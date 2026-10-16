import {toKatakana} from './story-flow.js?v=2026-10-16-web-05';
import {roomCompletion,roomClearNotice} from './room-completion.js?v=2026-10-16-web-05';
import {readableCopy} from './readable-copy.js?v=2026-10-16-web-05';
import {gameStorage,gameUrl,onPlayStorage} from './play-mode.js?v=2026-10-16-web-05';
import {installTestTools} from './test-tools.js?v=2026-10-16-web-05';
import {hintFooter,hintPanel as sharedHintPanel,requestHint} from './hint-controls.js?v=2026-10-16-web-05';
import {SETTINGS_KEY,HINTS_KEY,preserveHintUsage} from './play-settings.js?v=2026-10-16-web-05';
import {renderRoomReward,renderCollectedReward} from './room-reward-ui.js?v=2026-10-16-web-05';
import {watchFinalReveal,guardExploration,refreshExplorationClock} from './final-reveal.js?v=2026-10-16-web-05';
import {withNewsTheme} from './news-areas.js?v=2026-10-16-web-05';
import {newsDateBadge} from './news-dates.js?v=2026-10-16-web-05';
import {seasonVisual} from './puzzle-renewal-art.js?v=2026-10-16-web-05';
import {ROOM_KEY,ROOM_REWARD,QUESTIONS,CARDS,SLOT_MARKS,FIXED_CARDS,cardAtSlot,makeRoom1State as emptyState,restoreRoom1State as parseState,answerKeys,inputAnswer} from './room1-data.js?v=2026-10-16-web-05';

const area=withNewsTheme({number:1,reward:ROOM_REWARD});
document.title=`${area.title}｜2026年からの脱出`;
const app=document.querySelector('#room-app');
const dialog=document.querySelector('#room-dialog');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state=emptyState(), view='welcome', current=0, feedback='', keys=[], lastFocus=null;
try{state=parseState(gameStorage.getItem(ROOM_KEY));}catch{warn();}
if(state.started)view='room';
const completion=roomCompletion(ROOM_KEY,parseState,warn);
function warn(){document.querySelector('#storage-warning').hidden=false;}
function save(){try{const raw=JSON.stringify(state);gameStorage.setItem(ROOM_KEY,raw);if(gameStorage.getItem(ROOM_KEY)!==raw)throw Error('Save failed');return true;}catch{warn();return false;}}
function chest(open=false){return `<svg class="chest" viewBox="0 0 160 120" aria-hidden="true"><ellipse cx="80" cy="107" rx="66" ry="8" fill="#6e507e" opacity=".12"/><path d="M24 54 Q24 23 53 23 H108 Q136 23 136 54V61H24Z" fill="${open?'#f8d37c':'#c58c59'}" stroke="#79533d" stroke-width="4" ${open?'transform="translate(0,-13)"':''}/><rect x="24" y="56" width="112" height="46" rx="7" fill="#b8764e" stroke="#79533d" stroke-width="4"/><path d="M44 28v73M116 28v73" stroke="#efcb77" stroke-width="10"/><path d="M25 62h110" stroke="#79533d" stroke-width="4"/><rect x="68" y="53" width="25" height="30" rx="7" fill="#f4cf76" stroke="#9a713b" stroke-width="3"/><circle cx="80" cy="65" r="4" fill="#75543a"/><path d="M80 67v8" stroke="#75543a" stroke-width="3"/>${open?'<path d="m14 20 5 10 11 2-9 7 1 11-8-6-10 4 3-11-6-9 10 1ZM138 8l3 7 8 1-6 5 1 8-6-4-7 3 2-8-5-6 8 1Z" fill="#f6bf5c"/>':''}</svg>`;}
function header(){return `<header class="top"><div class="brand">2026年からの脱出<small>新しい年への扉を、きみの手で。</small></div><div class="top-right"><a class="area-switch" href="${gameUrl('rooms.html')}">← ほかのエリアへ</a><div class="progress" aria-label="3問中${state.solved.length}問クリア">${QUESTIONS.map((_,i)=>`<span class="dot ${state.solved.includes(i)?'done':''}"></span>`).join('')}</div></div></header>`;}
function footer(){return `<footer class="room-footer"><span>${hintFooter()}</span><a class="hub-link" href="${gameUrl('rooms.html')}">あとで解いてもOK・エリア一覧に戻る</a><button class="text-button" data-action="reset" hidden>このエリアを最初から</button></footer>`;}
function welcome(){return `<section class="welcome"><div class="hero"><img src="${area.image}" alt="${area.imageAlt}">${newsDateBadge(area)}<div class="hero-caption">${area.caption}</div></div><div class="welcome-copy"><p class="eyebrow">2026年の記憶</p><h1>${area.headingHTML||area.newsName}</h1><p>${area.intro}</p><p class="collection-goal">このエリアの3問を解いて、<br>文字を1つ集めよう。</p><button class="primary" data-action="start">ナゾに挑む →</button></div></section>`;}
function room(){const all=state.solved.length===3;return `<section><div class="title-row"><div><h1>${area.title}</h1><p class="subtitle">${area.overviewIntro||area.intro}</p></div><span class="badge">${state.solved.length} / 3 問クリア</span></div><div class="room-map"><div class="hero"><img src="${area.image}" alt="${area.imageAlt}">${newsDateBadge(area)}<div class="hero-caption">${all?`文字「${toKatakana(area.reward)}」を手に入れた。最後のパスワードに使おう。`:area.caption}</div></div>${renderRoomReward({complete:all,letter:area.reward,chest})}</div><div class="task-grid">${QUESTIONS.map((q,i)=>`<button class="task ${state.solved.includes(i)?'solved':''}" data-question="${i}"><span class="number">${state.solved.includes(i)?'✓':String(i+1).padStart(2,'0')}</span><span><small>${q.label}</small><strong>${q.short}</strong><span class="task-state">${state.solved.includes(i)?'正解！ 解説を見る':''}</span></span></button>`).join('')}</div></section>`;}
function placedCard(slot){const id=cardAtSlot(state.order,slot),word=id===undefined?'':CARDS[id].word;return `<span class="card-letters">${Array.from({length:4},(_,j)=>`<span class="letter-cell ${SLOT_MARKS[slot]===j?'window-ring':''}">${word[j]||''}</span>`).join('')}</span>`;}
function visual(){if(current===0)return `<p class="puzzle-instruction">このメモが示すものは？</p><div class="memo-scene"><img class="tanuki" src="assets/images/room1-tanuki.png" alt="たぬきの絵"><div class="papers"><div class="paper"><span>メモ ①</span><p>たうたしたろたかたらたよため</p></div><div class="paper"><span>メモ ②</span><p>たらたびたと</p></div></div></div>`;
if(current===1)return seasonVisual();
return `<p class="puzzle-instruction">「しお」と「でんわ」の間に、6枚の言葉をつなごう。<br>正しい順に置くと、台紙の赤丸に言葉が現れる。</p><div class="card-bank" aria-label="ばらばらの記憶カード">${CARDS.map((c,i)=>Object.values(FIXED_CARDS).includes(i)?'':`<button class="word-card" data-card="${i}" ${state.order.includes(i)?'disabled':''}>${c.word}</button>`).join('')}</div><p class="board-label">赤丸のある台紙 <span>2番目から順にカードを置こう</span></p><div class="card-order" aria-label="赤丸のある台紙">${Array.from({length:8},(_,i)=>{const id=cardAtSlot(state.order,i),fixed=FIXED_CARDS[i]!==undefined;return `<button class="card-slot ${id!==undefined?'filled':''} ${fixed?'fixed':''}" data-slot="${i}" ${fixed||id===undefined?'disabled':''} aria-label="${i+1}番目${id!==undefined?' '+CARDS[id].word+(fixed?' 固定':'を戻す'):''}"><small>${i+1}${i===0?' ・ はじまり・固定':i===7?' ・ おわり・固定':''}</small>${placedCard(i)}</button>`;}).join('')}</div><p class="card-tip">上の6枚をタップして、2番目から順に置こう。<br>置いたカードはタップで戻せます。赤丸の文字を順に読もう。</p>`;}
function showHint(index,question=current){dialog.innerHTML=`<h2 id="dialog-title" data-hint-level="${index}">ヒント${index+1}</h2><p class="hint-text" data-hint-level="${index}">${readableCopy(QUESTIONS[question].hints[index])}</p><div class="dialog-actions"><button class="primary" data-close>問題に戻る</button></div>`;dialog.querySelector('[data-close]').onclick=()=>dialog.close();if(!dialog.open)dialog.showModal();}
function hintPanel(){return sharedHintPanel(1,current);}
function answerPanel(){
  const q=QUESTIONS[current],value=state.drafts[current],target=inputAnswer(q);
  let inputIndex=0;
  const slots=[...q.answer].map((_,i)=>{
    const fixed=q.fixedLetters?.[i];
    if(fixed!==undefined)return `<span class="slot-group"><span class="slot fixed" aria-label="${esc(fixed)} 入力不要">${esc(fixed)}</span></span>`;
    const index=inputIndex++;
    return `<span class="slot-group"><span class="slot ${value.length===index?'current':''}">${esc(value[index]||'')}</span></span>`;
  }).join('');
  return `<aside class="answer-panel"><h2>答えを入力</h2><div class="slots" role="status" aria-live="polite" aria-label="入力した文字 ${esc(value||'まだありません')}">${slots}</div>${q.fixedLetters?'<p class="fixed-letter-help">「ー」は入力しなくてOK</p>':''}<div class="keypad">${value.length<target.length?keys.map(k=>`<button data-key="${esc(k)}" aria-label="${esc(k)}">${esc(k)}</button>`).join(''):'<p class="smallprint" style="grid-column:1/-1;text-align:center">入力できました！<br>「これで決定」を押そう。</p>'}</div><div class="edit-buttons"><button data-action="backspace" ${!value?'disabled':''}>⌫ 1文字消す</button><button data-action="clear" ${!value?'disabled':''}>全部消す</button></div><button class="primary" data-action="submit" ${value.length!==target.length?'disabled':''}>これで決定</button><p class="feedback" role="status" aria-live="polite">${feedback}</p></aside>`;
}
function success(){const q=QUESTIONS[current];return `<div class="success"><div class="seal" aria-hidden="true">✓</div><h2>正解！</h2><div class="correct-answer">${q.answer}</div><p>${readableCopy(q.explanation)}</p>${roomClearNotice(completion.pending,area.reward,state.solved.length===3)}<button class="primary" data-action="${state.solved.length===3?'hub':'room'}">${state.solved.length===3?'できごと一覧に戻る':'エリアに戻って、次のナゾへ →'}</button></div>`;}
function puzzle(){return `<div class="title-row"><div><p class="eyebrow">ナゾ ${String(current+1).padStart(2,'0')} / 03</p><h1>${QUESTIONS[current].title}</h1></div><button class="secondary" data-action="room">このエリアの3問に戻る</button></div>${state.solved.includes(current)?success():`<div class="puzzle-layout"><div class="puzzle-content"><section class="puzzle-board" aria-label="問題">${visual()}</section>${hintPanel()}</div>${answerPanel()}</div>`}`;}
function reward(){return renderCollectedReward({title:area.title,chest,letter:area.reward,afterword:"下の「できごと一覧」から、行きたい部屋を選ぼう。"});}
function render(){app.innerHTML=`<main class="shell view-${view}">${header()}${view==='welcome'?welcome():view==='room'?room():view==='reward'?reward():puzzle()}${footer()}</main>`;refreshExplorationClock();}
function navigate(next,{autoReturn=false}={}){completion.cancel();if(autoReturn)completion.start();view=next;feedback='';render();window.scrollTo({top:0,behavior:'instant'});const h=app.querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}}
function confirmAction(title,message,label,action){lastFocus=document.activeElement;dialog.innerHTML=`<h2 id="dialog-title">${title}</h2><p>${message}</p><div class="dialog-actions"><button class="secondary" data-close>戻る</button><button class="primary" data-confirm>${label}</button></div>`;dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.querySelector('[data-confirm]').onclick=()=>{dialog.close();if(!guardExploration())action();};dialog.showModal();}
dialog.addEventListener('close',()=>{if(lastFocus?.isConnected)lastFocus.focus();});
function refreshKeys(){const q=QUESTIONS[current];keys=answerKeys(inputAnswer(q),state.drafts[current].length,[],Object.values(q.fixedLetters||{}));}
app.addEventListener('click',event=>{
  if(guardExploration())return;const b=event.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.hint!==undefined){const target=current;requestHint({room:1,question:target,index:Number(b.dataset.hint),dialog,confirmAction,commit:level=>{state=parseState(gameStorage.getItem(ROOM_KEY));state.hints[target]=Math.max(state.hints[target],level);save();},show:index=>showHint(index,target),render,warn,guard:guardExploration});return;}
  if(b.dataset.question!==undefined){current=Number(b.dataset.question);refreshKeys();navigate('puzzle');return;}
  if(b.dataset.key!==undefined&&view==='puzzle'&&!state.solved.includes(current)){if(state.drafts[current].length>=inputAnswer(QUESTIONS[current]).length)return;state.drafts[current]+=b.dataset.key;feedback='';refreshKeys();save();render();return;}
  if(b.dataset.card!==undefined){const i=Number(b.dataset.card);if(CARDS[i]&&!Object.values(FIXED_CARDS).includes(i)&&!state.order.includes(i)){state.order.splice(-1,0,i);save();render();}return;}
  if(b.dataset.slot!==undefined){const slot=Number(b.dataset.slot);if(FIXED_CARDS[slot]===undefined&&cardAtSlot(state.order,slot)!==undefined){state.order.splice(slot,1);save();render();}return;}
  switch(b.dataset.action){
    case 'start':state.started=true;save();navigate('room');break;
    case 'room':navigate('room');break;
    case 'backspace':state.drafts[current]=state.drafts[current].slice(0,-1);feedback='';refreshKeys();save();render();break;
    case 'clear':state.drafts[current]='';feedback='';refreshKeys();save();render();break;
    case 'submit':if(state.drafts[current]===inputAnswer(QUESTIONS[current])){const wasComplete=state.solved.length===3;if(!state.solved.includes(current))state.solved.push(current);if(state.solved.length===3)state.claimed=true;const saved=save();navigate('puzzle',{autoReturn:saved&&!wasComplete&&state.solved.length===3});}else{dialog.innerHTML='<h2 id="dialog-title">まだ鍵が開かないようです</h2><p>「1文字消す」で直すか、ヒントを見てみよう。</p><div class="dialog-actions"><button class="primary" data-close>問題に戻る</button></div>';dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.showModal();}break;
    case 'hub':completion.returnNow();break;
    case 'reward':if(state.solved.length===3){state.claimed=true;save();navigate('reward');}break;
    case 'reset':completion.cancel();confirmAction('この部屋を最初から？','このエリアの正解・入力・集めた文字を初期化します。全体のヒント使用数は戻りません。','最初から遊ぶ',()=>{preserveHintUsage(gameStorage);state=emptyState();save();navigate('welcome');});break;
  }
});
onPlayStorage(event=>{if(event.key===SETTINGS_KEY||event.key===HINTS_KEY){if(!guardExploration())render();return;}if(event.key!==ROOM_KEY)return;state=parseState(event.newValue);if(state.solved.length!==3)completion.cancel();if(dialog.open)dialog.close();if(!state.started)view='welcome';else if(view==='welcome')view='room';else if(view==='reward'&&!state.claimed)view='room';refreshKeys();render();});
render();watchFinalReveal();

installTestTools();
