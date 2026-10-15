import {gameStorage,gameSession,gameUrl,testPlay} from './play-mode.js?v=2026-10-16-web-02';
import {teacherTapSequence,resetCurrentGame} from './teacher-mode-data.js?v=2026-10-16-web-02';

export function installTeacherMode(){
 if(document.querySelector('#teacher-mode-dialog'))return;
 const app=document.querySelector('#room-app');if(!app)return;
 const css=document.createElement('link');css.rel='stylesheet';css.href='css/teacher-mode.css'+new URL(import.meta.url).search;document.head.append(css);
 const dialog=document.createElement('dialog');dialog.id='teacher-mode-dialog';dialog.setAttribute('aria-labelledby','teacher-mode-title');document.body.append(dialog);
 const taps=teacherTapSequence();let lastEntry=null;
 function close(){dialog.close();dialog.innerHTML='';taps.reset();lastEntry?.isConnected&&lastEntry.focus({preventScroll:true});}
 function menu(){
  if(dialog.open)return;
  const roomReset=app.querySelector('[data-action="reset"]');
  dialog.innerHTML=`<h2 id="teacher-mode-title">教師モード</h2><p>${testPlay?'テスト用の記録だけを操作します。':'この端末のプレイ記録を操作します。'}</p><div class="teacher-actions"><a class="secondary" href="${gameUrl('start.html?preview=1')}">OPを見直す</a>${roomReset?'<button class="secondary" data-teacher-room>このエリアを最初から</button>':''}<button class="secondary" data-teacher-all>全体を最初から</button></div><div class="dialog-actions"><button class="primary" data-close>ゲームに戻る</button></div>`;
  dialog.showModal();dialog.querySelector('[data-close]').focus();
 }
 function sync(){for(const brand of app.querySelectorAll('.brand')){brand.classList.add('teacher-entry');brand.tabIndex=0;brand.setAttribute('role','button');}}
 function entry(event){const brand=event.target.closest?.('.brand');return brand&&app.contains(brand)?brand:null;}
 function tap(brand){lastEntry=brand;if(taps.tap(Date.now()))menu();}
 document.addEventListener('click',event=>{
  const brand=entry(event);if(!brand){taps.reset();return;}
  event.preventDefault();event.stopImmediatePropagation();tap(brand);
 },true);
 document.addEventListener('keydown',event=>{
  const brand=entry(event);if(!brand||!['Enter',' '].includes(event.key)){taps.reset();return;}
  event.preventDefault();event.stopImmediatePropagation();if(!event.repeat)tap(brand);
 },true);
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
 dialog.addEventListener('click',event=>{
  if(event.target.closest('[data-close]')){close();return;}
  if(event.target.closest('[data-teacher-room]')){const reset=app.querySelector('[data-action="reset"]');close();reset?.click();return;}
  if(event.target.closest('[data-teacher-all]')){
   dialog.innerHTML=`<h2 id="teacher-mode-title">全体の記録を消しますか？</h2><p>${testPlay?'この端末のテスト用記録を消します。':'この端末の８エリアの正解・入力・かけらを消します。'}<br>学年・人数、ヒント使用数、探索タイマー、<br>最終解答と終了記録も初期化し、設定画面へ戻ります。</p><div class="dialog-actions"><button class="secondary" data-close>戻る</button><button class="primary" data-confirm>記録を消して最初から</button></div>`;
   dialog.querySelector('[data-close]').focus();return;
  }
  if(event.target.closest('[data-confirm]')){
   try{resetCurrentGame(gameStorage,gameSession);location.replace(gameUrl('start.html'));}catch{const warning=document.querySelector('#storage-warning');if(warning)warning.hidden=false;close();}
  }
 });
 new MutationObserver(sync).observe(app,{childList:true});sync();
}
