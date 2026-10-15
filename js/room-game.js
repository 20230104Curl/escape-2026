import {roomCompletion,roomClearNotice} from './room-completion.js?v=2026-10-15-web-7';
import {readableCopy} from './readable-copy.js?v=2026-10-15-web-7';
import {gameStorage,onPlayStorage} from './play-mode.js?v=2026-10-15-web-7';
import {installTestTools} from './test-tools.js?v=2026-10-15-web-7';
import {hintFooter,hintPanel as sharedHintPanel,requestHint} from './hint-controls.js?v=2026-10-15-web-7';
import {SETTINGS_KEY,HINTS_KEY,preserveHintUsage} from './play-settings.js?v=2026-10-15-web-7';
import {renderRoomReward,renderSealedReward} from './room-reward-ui.js?v=2026-10-15-web-7';
import {watchFinalReveal,guardExploration} from './final-reveal.js?v=2026-10-15-web-7';
import {withNewsTheme} from './news-areas.js?v=2026-10-15-web-7';
import {answerKeys,inputAnswer} from './room1-data.js?v=2026-10-15-web-7';

export function mountRoom({room,questions,makeEmptyState,restoreState,renderVisual,onAction,renderHintExtra=()=>''}){
room=withNewsTheme(room);
document.title=`${room.title}｜2026年からの脱出`;
const ROOM_KEY=room.storageKey;
const QUESTIONS=questions;
const app=document.querySelector('#room-app');
const dialog=document.querySelector('#room-dialog');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state=makeEmptyState(), view='welcome', current=0, feedback='', keys=[], lastFocus=null;
try{state=restoreState(gameStorage.getItem(ROOM_KEY));}catch{warn();}
if(state.started)view='room';
const completion=roomCompletion(ROOM_KEY,restoreState,warn);
function warn(){document.querySelector('#storage-warning').hidden=false;}
function save(){try{const raw=JSON.stringify(state);gameStorage.setItem(ROOM_KEY,raw);if(gameStorage.getItem(ROOM_KEY)!==raw)throw Error('Save failed');return true;}catch{warn();return false;}}
function failed(index){return !state.solved.includes(index)&&QUESTIONS[index].maxAttempts&&(state.attempts?.[index]||0)>=QUESTIONS[index].maxAttempts;}
function chest(open=false){return `<svg class="chest" viewBox="0 0 160 120" aria-hidden="true"><ellipse cx="80" cy="107" rx="66" ry="8" fill="#6e507e" opacity=".12"/><path d="M24 54 Q24 23 53 23 H108 Q136 23 136 54V61H24Z" fill="${open?'#f8d37c':'#c58c59'}" stroke="#79533d" stroke-width="4" ${open?'transform="translate(0,-13)"':''}/><rect x="24" y="56" width="112" height="46" rx="7" fill="#b8764e" stroke="#79533d" stroke-width="4"/><path d="M44 28v73M116 28v73" stroke="#efcb77" stroke-width="10"/><path d="M25 62h110" stroke="#79533d" stroke-width="4"/><rect x="68" y="53" width="25" height="30" rx="7" fill="#f4cf76" stroke="#9a713b" stroke-width="3"/><circle cx="80" cy="65" r="4" fill="#75543a"/><path d="M80 67v8" stroke="#75543a" stroke-width="3"/>${open?'<path d="m14 20 5 10 11 2-9 7 1 11-8-6-10 4 3-11-6-9 10 1ZM138 8l3 7 8 1-6 5 1 8-6-4-7 3 2-8-5-6 8 1Z" fill="#f6bf5c"/>':''}</svg>`;}
function header(){return `<header class="top"><div class="brand">2026年からの脱出<small>新しい年への扉を、きみの手で。</small></div><div class="top-right"><span class="badge">${room.title}</span><div class="progress" aria-label="3問中${state.solved.length}問クリア">${QUESTIONS.map((_,i)=>`<span class="dot ${state.solved.includes(i)?'done':''}"></span>`).join('')}</div></div></header>`;}
function footer(){return `<footer class="room-footer"><span>${hintFooter()}</span><a class="hub-link" href="rooms.html">できごと一覧</a><button class="text-button" data-action="reset" hidden>このエリアを最初から</button></footer>`;}
function welcome(){return `<section class="welcome"><div class="hero"><img src="${room.image}" alt="${room.imageAlt}"><div class="hero-caption">${room.caption}</div></div><div class="welcome-copy"><p class="eyebrow">2026年の記憶</p><h1>${room.headingHTML||room.newsName||room.titleHTML||room.title}</h1><p>${room.intro}</p><p style="margin-top:14px">${room.details}</p><button class="primary" data-action="start">ナゾに挑む →</button></div></section>`;}
function roomView(){const all=state.solved.length===3,missed=QUESTIONS.some((_,i)=>failed(i));return `<section><div class="title-row"><div><h1>${room.title}</h1><p class="subtitle">${room.overviewIntro||room.intro}</p></div><span class="badge">${state.solved.length} / 3 問クリア</span></div><div class="room-map"><div class="hero"><img src="${room.image}" alt="${room.imageAlt}"><div class="hero-caption">${all?'この記憶のナゾが解けた。かけらを封印して保管した。':room.caption}</div></div>${renderRoomReward({complete:all,missed,chest})}</div><div class="task-grid">${QUESTIONS.map((q,i)=>`<button class="task ${state.solved.includes(i)?'solved':failed(i)?'failed':''}" data-question="${i}"><span class="number">${state.solved.includes(i)?'✓':failed(i)?'×':String(i+1).padStart(2,'0')}</span><span><small>${q.label}</small><strong>${q.short}</strong><span class="task-state">${state.solved.includes(i)?'正解！ 解説を見る':failed(i)?'解答済み・解説を見る':'調べる →'}</span></span></button>`).join('')}</div></section>`;}
function visual(){return renderVisual(current,state);}
function showHint(index,question=current){const hint=QUESTIONS[question].hints[index];dialog.innerHTML=`<h2 id="dialog-title" data-hint-level="${index}">ヒント${index+1}</h2>${hint?`<p class="hint-text" data-hint-level="${index}">${readableCopy(hint)}</p>`:''}${renderHintExtra(question,index,state)}<div class="dialog-actions"><button class="primary" data-close>問題に戻る</button></div>`;dialog.querySelector('[data-close]').onclick=()=>dialog.close();if(!dialog.open)dialog.showModal();}
function hintPanel(){return sharedHintPanel(room.number,current);}
function answerPanel(){const q=QUESTIONS[current],value=state.drafts[current],target=inputAnswer(q);let inputIndex=0;
  const slots=[...q.answer].map((_,i)=>{const fixed=q.fixedLetters?.[i],mark=q.fixedMarks?.[i],index=fixed===undefined?inputIndex++:-1;return `<span class="slot-group">${q.answerSymbols?`<b class="slot-symbol">${q.answerSymbols[i]}</b>`:''}<span class="slot ${fixed!==undefined?'fixed':value.length===index?'current':''}" ${fixed!==undefined?`aria-label="${esc(fixed)} 入力不要"`:''}>${esc(fixed!==undefined?fixed:value[index]||'')}${mark?`<span class="slot-fixed-mark" aria-label="濁点 入力不要">${esc(mark)}</span>`:''}</span></span>`;}).join('');
  return `<aside class="answer-panel"><h2>${q.inputTitle||'答えを入力'}</h2>${q.maxAttempts?`<p class="attempt-rule"><strong>解答チャンスは${q.maxAttempts}回だけ</strong><br>迷ったらヒントを見てから決めよう。</p>`:''}<div class="slots" role="status" aria-live="polite" aria-label="入力した文字 ${esc(value||'まだありません')}">${slots}</div>${q.inputNote?`<p class="fixed-letter-help">${esc(q.inputNote)}</p>`:''}<p class="answer-help">1文字ずつ選ぼう。入力するたびに文字と並びが変わります。</p><div class="keypad ${/^\d+$/.test(q.answer)?'numeric':''}">${value.length<target.length?keys.map(k=>`<button data-key="${esc(k)}" aria-label="${esc(k)}">${esc(k)}</button>`).join(''):'<p class="smallprint" style="grid-column:1/-1;text-align:center">入力できました！<br>「これで決定」を押そう。</p>'}</div><div class="edit-buttons"><button data-action="backspace" ${!value?'disabled':''}>⌫ 1文字消す</button><button data-action="clear" ${!value?'disabled':''}>全部消す</button></div><button class="primary" data-action="submit" ${value.length!==target.length?'disabled':''}>これで決定</button><p class="feedback" role="status" aria-live="polite">${feedback}</p></aside>`;}
function success(){const q=QUESTIONS[current];return `<div class="success"><div class="seal" aria-hidden="true">✓</div><h2>正解！</h2><div class="correct-answer">${q.answer}</div><p>${readableCopy(q.explanation)}</p>${roomClearNotice(completion.pending)}<button class="primary" data-action="${state.solved.length===3?'hub':'room'}">${state.solved.length===3?'できごと一覧に戻る':'エリアに戻って、次のナゾへ →'}</button></div>`;}
function failure(){const q=QUESTIONS[current];return `<div class="success failure"><div class="seal" aria-hidden="true">×</div><h2>今回は不正解</h2><p>このナゾの解答チャンスは${q.maxAttempts}回です。<br>このエリアの文字のかけらは獲得できません。</p><div class="correct-answer">正解は「${q.answer}」</div><p>${readableCopy(q.explanation)}</p><button class="primary" data-action="room">エリアに戻って、ほかのナゾへ →</button></div>`;}
function puzzle(){return `<div class="title-row"><div><p class="eyebrow">ナゾ ${String(current+1).padStart(2,'0')} / 03</p><h1>${QUESTIONS[current].title}</h1></div><button class="secondary" data-action="room">エリアに戻る</button></div>${state.solved.includes(current)?success():failed(current)?failure():`<div class="puzzle-layout"><div class="puzzle-content"><section class="puzzle-board" aria-label="問題">${visual()}</section>${hintPanel()}</div>${answerPanel()}</div>`}`;}
function reward(){return renderSealedReward({title:room.title,chest,afterword:room.afterword});}
function render(){app.innerHTML=`<main class="shell view-${view}">${header()}${view==='welcome'?welcome():view==='room'?roomView():view==='reward'?reward():puzzle()}${footer()}</main>`;}
function navigate(next,{autoReturn=false}={}){completion.cancel();if(autoReturn)completion.start();view=next;feedback='';render();window.scrollTo({top:0,behavior:'instant'});const h=app.querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}}
function confirmAction(title,message,label,action){lastFocus=document.activeElement;dialog.innerHTML=`<h2 id="dialog-title">${title}</h2><p>${message}</p><div class="dialog-actions"><button class="secondary" data-close>戻る</button><button class="primary" data-confirm>${label}</button></div>`;dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.querySelector('[data-confirm]').onclick=()=>{dialog.close();if(!guardExploration())action();};dialog.showModal();}
dialog.addEventListener('close',()=>{if(lastFocus?.isConnected)lastFocus.focus();});
function refreshKeys(){const q=QUESTIONS[current];keys=answerKeys(inputAnswer(q),state.drafts[current].length,q.candidateAnswers?.map(answer=>inputAnswer({...q,answer})),Object.values(q.fixedLetters||{}));}
function gradeAnswer(target,answer){const commit=()=>commitAnswer(target,answer);if(QUESTIONS[target].maxAttempts&&navigator.locks)navigator.locks.request(gameStorage.scopeKey(ROOM_KEY+'.answers'),commit).catch(warn);else commit();}
function commitAnswer(target,answer){if(guardExploration())return;
  const q=QUESTIONS[target];
  if(q.maxAttempts){
    // Recheck the saved result before consuming the single chance, including another tab's answer.
    try{const saved=gameStorage.getItem(ROOM_KEY);if(saved)state=restoreState(saved);}catch{warn();}
    if(failed(target)||state.solved.includes(target)){current=target;navigate('puzzle');return;}
    state.attempts||=QUESTIONS.map(()=>0);
    state.attempts[target]=(state.attempts[target]||0)+1;
    state.drafts[target]=answer;
  }
  current=target;
  if(answer===inputAnswer(q)){const wasComplete=state.solved.length===3;if(!state.solved.includes(target))state.solved.push(target);if(state.solved.length===3)state.claimed=true;const saved=save();navigate('puzzle',{autoReturn:saved&&!wasComplete&&state.solved.length===3});}
  else if(q.maxAttempts){save();navigate('puzzle');}
  else{dialog.innerHTML='<h2 id="dialog-title">まだ鍵が開かないようです</h2><p>「1文字消す」で直すか、ヒントを見てみよう。</p><div class="dialog-actions"><button class="primary" data-close>問題に戻る</button></div>';dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.showModal();}
}
app.addEventListener('click',event=>{
  if(guardExploration())return;const b=event.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.hint!==undefined){const target=current;requestHint({room:room.number,question:target,index:Number(b.dataset.hint),dialog,confirmAction,commit:level=>{state=restoreState(gameStorage.getItem(ROOM_KEY));state.hints[target]=Math.max(state.hints[target],level);save();},show:index=>showHint(index,target),render,warn,guard:guardExploration});return;}
  if(b.dataset.question!==undefined){current=Number(b.dataset.question);refreshKeys();navigate('puzzle');return;}
  if(b.dataset.key!==undefined&&view==='puzzle'&&!state.solved.includes(current)&&!failed(current)){if(state.drafts[current].length>=inputAnswer(QUESTIONS[current]).length)return;state.drafts[current]+=b.dataset.key;feedback='';refreshKeys();save();render();return;}
  if(onAction(b,state)){save();render();return;}
  switch(b.dataset.action){
    case 'start':state.started=true;save();navigate('room');break;
    case 'room':navigate('room');break;
    case 'backspace':state.drafts[current]=state.drafts[current].slice(0,-1);feedback='';refreshKeys();save();render();break;
    case 'clear':state.drafts[current]='';feedback='';refreshKeys();save();render();break;
    case 'submit':{
      const target=current,q=QUESTIONS[target],answer=state.drafts[target];
      if(answer.length!==inputAnswer(q).length||state.solved.includes(target)||failed(target))break;
      if(q.maxAttempts)confirmAction('解答チャンスは1回だけです',`「${esc(answer)}」で決定しますか？<br>不正解の場合は解き直せず、<br>このエリアの文字のかけらは獲得できません。<br>「戻る」なら、まだ解答チャンスを使いません。`,'この答えで決定',()=>gradeAnswer(target,answer));
      else gradeAnswer(target,answer);
      break;
    }
    case 'hub':completion.returnNow();break;
    case 'reward':if(state.solved.length===3){state.claimed=true;save();navigate('reward');}break;
    case 'reset':completion.cancel();confirmAction('この部屋を最初から？','このエリアの正解・入力・かけらを初期化します。全体のヒント使用数は戻りません。','最初から遊ぶ',()=>{preserveHintUsage(gameStorage);state=makeEmptyState();save();navigate('welcome');});break;
  }
});
onPlayStorage(event=>{if(event.key===SETTINGS_KEY||event.key===HINTS_KEY){if(!guardExploration())render();return;}if(event.key!==ROOM_KEY)return;state=restoreState(event.newValue);if(state.solved.length!==3)completion.cancel();if(dialog.open)dialog.close();if(!state.started)view='welcome';else if(view==='welcome')view='room';else if(view==='reward'&&!state.claimed)view='room';refreshKeys();render();});
render();watchFinalReveal();

}

installTestTools();
