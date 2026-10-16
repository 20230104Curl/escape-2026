import {EMERGENCY_ALARM_KEY,createEmergencyAlarm,preloadEmergencyAlarm,emergencyAlarmPlayed,rememberEmergencyAlarm} from './emergency-alarm.js?v=2026-10-16-web-15';
import {gameStorage,gameSession,gameUrl,onPlayStorage,testPlay} from './play-mode.js?v=2026-10-16-web-15';
import {installTestTools} from './test-tools.js?v=2026-10-16-web-15';
import {readRoomProgress} from './room-catalog.js?v=2026-10-16-web-15';
import {renderCollectedLetters} from './room-reward-ui.js?v=2026-10-16-web-15';
import {preloadEndingBell} from './ending-bell.js?v=2026-10-16-web-15';
import {isFinalOpen,finalFragments} from './final-reveal.js?v=2026-10-16-web-15';
import {answerKeys} from './room1-data.js?v=2026-10-16-web-15';
import {classTimes,FINAL_KEY,FINAL_INPUT,FINAL_FIXED,FINAL_STAGE_START_KEY,startFinalStage,loadFinal,decideFinal,expireFinal,canRevealFinal,toKatakana,formatFinalAnswer,remaining,isPasswordOpen} from './story-flow.js?v=2026-10-16-web-15';
import {EMERGENCY} from './story-content.js?v=2026-10-16-web-15';
import {YEAR_ORDER_KEY,loadYearOrder,placeYearCard,removeYearCard,decideYearOrder,expireYearOrder,yearOrderComplete} from './year-order-data.js?v=2026-10-16-web-15';
import {renderYearOrder} from './year-order-ui.js?v=2026-10-16-web-15';
import {NEWS_AREAS} from './news-areas.js?v=2026-10-16-web-15';
import {renderFinalFragments} from './final-fragments-ui.js?v=2026-10-16-web-15';
import {needsFinalPlacement,finalInputSlots,nextFinalPosition,finalInputComplete,foundFinalPositions,placeFinalFragments,enterFinalLetter,editableFinalPositions,eraseFinalLetters} from './final-password-input.js?v=2026-10-16-web-15';
const app=document.querySelector('#room-app'),dialog=document.querySelector('#room-dialog');
let state=loadFinal(gameStorage),order=loadYearOrder(gameStorage),wasOpen=null,wasSubmitted=null,wasOrder=null,keys=[],navigating=false;
let justPlaced=false;
const alarm=createEmergencyAlarm({onChange:status=>{const button=dialog.querySelector('[data-alarm-play]');if(button)button.hidden=status!=='blocked';}});
preloadEmergencyAlarm();
window.addEventListener('pagehide',()=>alarm.stop(),{once:true});
dialog.addEventListener('close',()=>{if(dialog.classList.contains('emergency-dialog'))alarm.stop();dialog.removeAttribute('role');dialog.removeAttribute('aria-describedby');});
async function playEmergencyAlarm(retry=false){
 const finalAt=classTimes().finalAt;
 const play=async()=>{
  if(!awaitingStart()||!dialog.open||emergencyAlarmPlayed(gameStorage,finalAt))return;
  if(await (retry?alarm.retry():alarm.start()))rememberEmergencyAlarm(gameStorage,finalAt);
 };
 // A manual retry calls play synchronously to preserve the browser's gesture.
 if(retry||!navigator.locks)return play();
 try{await navigator.locks.request(gameStorage.scopeKey(EMERGENCY_ALARM_KEY),play);}catch{}
}
// Warm the success scene during the final challenge so image and sound can start together.
preloadEndingBell();
const endingImage=new Image();endingImage.src='assets/images/ed-01-bell.png';
const awaitingStart=()=>isFinalOpen()&&!Number.isFinite(classTimes().orderAt)&&!state.submitted;
const inOrder=()=>isFinalOpen()&&!awaitingStart()&&!isPasswordOpen()&&!state.submitted;
// Prepare the illustrations while the warning is being read, before the clock starts.
const illustrationsReady=Promise.all(NEWS_AREAS.map(area=>new Promise(resolve=>{const image=new Image();image.onload=image.onerror=resolve;image.src=`assets/images/${area.image}.png`;if(image.complete)resolve();})));
function saveOrder(){try{gameStorage.setItem(YEAR_ORDER_KEY,JSON.stringify(order));return true;}catch{warn();return false;}}
function go(path){if(navigating)return;navigating=true;location.replace(gameUrl(path));}
function warn(){document.querySelector('#storage-warning').hidden=false;}
function save(){try{gameStorage.setItem(FINAL_KEY,JSON.stringify(state));return true;}catch{warn();return false;}}
function refreshKeys(){keys=nextFinalPosition(state)<0?[]:answerKeys(FINAL_INPUT,nextFinalPosition(state));}
function render(){
 const open=isFinalOpen(),ordering=inOrder();wasOpen=open;wasSubmitted=state.submitted;wasOrder=ordering;let content;
 if(state.submitted){
  content=`${renderCollectedLetters(readRoomProgress(gameStorage,warn))}<h1>解答を受け付けました</h1><p>結果は、カウントダウンが終わると<br>発表されます。</p>`;
 }else if(awaitingStart()){
  content=renderCollectedLetters(readRoomProgress(gameStorage,warn));
 }else if(ordering){
  content=renderYearOrder(order);
 }else if(open){
  const rooms=readRoomProgress(gameStorage,warn),letters=finalFragments(rooms),slots=finalInputSlots(state),provided=state.fragmentsPlaced?foundFinalPositions(letters):[],editable=editableFinalPositions(state,letters),needsPlacement=needsFinalPlacement(state,letters);let index=0;
  const mask=Array.from({length:11},(_,i)=>{const fixed=FINAL_FIXED[i],position=fixed===undefined?index++:-1;return `<span class="final-slot ${fixed!==undefined?'fixed':provided.includes(position)?'is-collected':!needsPlacement&&position===nextFinalPosition(state)?'current':''}">${fixed??toKatakana(slots[position]||'')}</span>`;}).join('');
  content=`<div class="final-question">${renderFinalFragments(letters,{animate:false,placed:state.fragmentsPlaced,remaining:slots.filter(letter=>!letter).length})}<h2>2027年への扉を開く言葉は？</h2><div class="final-mask ${needsPlacement?'is-drop-target':justPlaced?'is-filling':''}" role="status" aria-label="入力中のパスワード">${mask}</div><p class="final-note">あてはめた文字と「・」「ー」は入力しなくてOK。</p></div><aside class="final-controls ${needsPlacement?'is-awaiting-placement':''}"><h2>最後のパスワード</h2><p class="final-input-guide" id="final-input-guide" role="status">${needsPlacement?'先に「文字を入れる」<br>ボタンを押そう。':'残りの空欄を入力しよう。'}</p><p class="final-note">解答チャンスは1回だけ</p><fieldset class="final-input-fields" ${needsPlacement?'disabled':''} aria-label="最後のパスワードの文字入力" aria-describedby="final-input-guide"><div class="final-keypad">${keys.length?keys.map(k=>`<button data-key="${k}" aria-label="${toKatakana(k)}">${toKatakana(k)}</button>`).join(''):'<p class="final-note">入力できました。<br>決定前に確かめよう。</p>'}</div><div class="edit-buttons"><button data-action="backspace" ${!editable.length?'disabled':''}>⌫ 1文字消す</button><button data-action="clear" ${!editable.length?'disabled':''}>全部消す</button></div><button class="primary" data-action="submit" ${!finalInputComplete(state)?'disabled':''}>これで決定</button></fieldset><p class="final-feedback" role="status"></p></aside>`;
  justPlaced=false;
 }else content=`${renderCollectedLetters(readRoomProgress(gameStorage,warn))}<h1>集めた文字は、最後のパスワードに使います</h1><p>今は、2026年のできごとを巡って文字を集めよう。<br>最後の挑戦が始まると、解答できます。</p><a class="primary" href="rooms.html">できごと一覧へ</a>`;
 app.innerHTML=`<main class="shell"><header class="top"><div class="brand">2026年からの脱出</div><span class="badge" id="final-clock" role="timer">${open?'最後の挑戦':'文字を集めよう'}</span></header>${ordering?content:`<section class="final-clues ${state.submitted?'is-waiting':open&&!awaitingStart()?'is-open':'is-locked'}">${content}</section>`}</main>`;
 updateClock();
}
function updateClock(){
 if(!isFinalOpen())return;
 if(awaitingStart()){const clock=document.querySelector('#final-clock');clock.textContent='最後の挑戦';clock.classList.remove('is-urgent');return;}
 const clock=document.querySelector('#final-clock'),times=classTimes(),ordering=inOrder(),seconds=remaining(ordering?times.passwordAt:times.answerUntil),label=ordering?'できごとの並べ替え':'最後の挑戦';
 clock.innerHTML=testPlay?`${label} 時間制限なし`:`<span>${label} あと </span><strong>${seconds}<small>秒</small></strong>`;
 clock.classList.toggle('is-urgent',!testPlay&&seconds<=10);
}
function tick(){
 if(navigating)return true;
 state=loadFinal(gameStorage);order=loadYearOrder(gameStorage);
 if(expireYearOrder(order,Date.now(),classTimes()))saveOrder();
 if(expireFinal(state,Date.now()))save();
 if(canRevealFinal(state)){go('ending.html');return true;}
 if(wasOpen!==isFinalOpen()||wasSubmitted!==state.submitted||wasOrder!==inOrder()){if(dialog.open){if(dialog.classList.contains('emergency-dialog'))alarm.stop();dialog.close();dialog.classList.remove('emergency-dialog');}refreshKeys();render();}
 updateClock();
 return state.submitted;
}
function transfer(){
 if(!awaitingStart()||dialog.open)return;
 dialog.innerHTML=`<div class="emergency-heading"><div class="emergency-title"><span class="emergency-symbol" aria-hidden="true">!</span><div><p class="emergency-label">探索時間終了</p><h2 id="dialog-title">${EMERGENCY.title}</h2></div></div><button class="emergency-sound" data-alarm-play hidden>警報音を鳴らす</button></div><p class="emergency-copy" id="emergency-body">${EMERGENCY.body}</p><p class="emergency-last"><strong>${EMERGENCY.last}</strong></p><button class="primary" data-enter disabled>準備しています…</button>`;dialog.classList.add('emergency-dialog');dialog.setAttribute('role','alertdialog');dialog.setAttribute('aria-describedby','emergency-body');dialog.showModal();
 void playEmergencyAlarm();
 dialog.querySelector('[data-alarm-play]').onclick=()=>void playEmergencyAlarm(true);
 const enter=dialog.querySelector('[data-enter]');illustrationsReady.then(()=>{if(enter.isConnected){enter.disabled=false;enter.textContent='できごとの並べ替えへ';}});
 enter.onclick=async()=>{
  if(enter.disabled)return;enter.disabled=true;alarm.stop();
  const begin=()=>startFinalStage(gameStorage,classTimes().finalAt);
  try{if(navigator.locks)await navigator.locks.request(gameStorage.scopeKey(FINAL_STAGE_START_KEY),begin);else begin();dialog.close();dialog.classList.remove('emergency-dialog');tick();render();}
  catch{warn();enter.disabled=false;}
 };
}
dialog.addEventListener('cancel',event=>{if(awaitingStart())event.preventDefault();});
app.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b||b.disabled||tick()||!isFinalOpen())return;
 if(inOrder()){
  if(order.submitted)return;
  if(b.dataset.yearCard!==undefined){if(placeYearCard(order,Number(b.dataset.yearCard))&&saveOrder())render();return;}
  if(b.hasAttribute('data-year-undo')){const last=order.slots.findLastIndex(Number.isInteger);if(removeYearCard(order,last)&&saveOrder())render();return;}
  if(b.hasAttribute('data-year-clear')){order.slots.fill(null);if(saveOrder())render();return;}
  if(b.hasAttribute('data-year-submit')&&yearOrderComplete(order)){
   const slots=[...order.slots];
   dialog.innerHTML='<h2 id="dialog-title">この順番で決定しますか？</h2><p>解答チャンスは１回だけです。<br>決定すると、順番は変更できません。</p><div class="dialog-actions"><button class="secondary" data-close>戻る</button><button class="primary" data-confirm>この順番で決定</button></div>';
   dialog.querySelector('[data-close]').onclick=()=>dialog.close();
   dialog.querySelector('[data-confirm]').onclick=async()=>{
    const commit=()=>{const fresh=loadYearOrder(gameStorage);if(!fresh.submitted){fresh.slots=slots;expireYearOrder(fresh,Date.now(),classTimes());if(!fresh.submitted)decideYearOrder(fresh,Date.now(),classTimes());}order=fresh;if(saveOrder()){dialog.close();tick();render();}};
    if(navigator.locks)await navigator.locks.request(gameStorage.scopeKey(YEAR_ORDER_KEY),commit);else commit();
   };dialog.showModal();
  }return;
 }
 const letters=finalFragments(readRoomProgress(gameStorage,warn));
 if(b.dataset.action==='place-fragments'){if(placeFinalFragments(state,letters)){justPlaced=true;save();refreshKeys();render();app.querySelector('.final-keypad button:not(:disabled)')?.focus({preventScroll:true});}return;}
 if(needsFinalPlacement(state,letters))return;
 if(b.dataset.key!==undefined){if(enterFinalLetter(state,b.dataset.key)){save();refreshKeys();render();}return;}
 if(b.dataset.action==='backspace'||b.dataset.action==='clear'){if(eraseFinalLetters(state,finalFragments(readRoomProgress(gameStorage,warn)),{all:b.dataset.action==='clear'})){save();refreshKeys();render();}return;}
 if(b.dataset.action==='submit'&&finalInputComplete(state)){
  const answer=state.draft;
  dialog.innerHTML=`<h2 id="dialog-title">解答チャンスは1回だけです</h2><p>「${formatFinalAnswer(answer)}」で決定しますか？<br>決定すると、答えは変更できません。<br>「戻る」なら、まだ解答チャンスを使いません。</p><div class="dialog-actions"><button class="secondary" data-close>戻る</button><button class="primary" data-confirm>この答えで決定</button></div>`;
  dialog.querySelector('[data-close]').onclick=()=>dialog.close();
  dialog.querySelector('[data-confirm]').onclick=async()=>{
   const commit=()=>{const fresh=loadFinal(gameStorage);if(!fresh.submitted){fresh.draft=answer;const now=Date.now();expireFinal(fresh,now);if(!fresh.submitted)decideFinal(fresh,now);}state=fresh;if(save()){dialog.close();tick();}};
   if(navigator.locks)await navigator.locks.request(gameStorage.scopeKey(FINAL_KEY),commit);else commit();
  };dialog.showModal();
 }
});
onPlayStorage(()=>{if(!tick()){refreshKeys();render();}});
refreshKeys();render();if(!tick())transfer();
setInterval(()=>{if(!tick()&&awaitingStart())transfer();},500);
window.addEventListener('pageshow',tick);document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});

installTestTools();
