import {testPlay,gameStorage,gameSession,gameUrl,TEST_FINAL_KEY,clearTestRecords} from './play-mode.js?v=2026-10-15-web-8';
import {loadSettings,saveSettings} from './play-settings.js?v=2026-10-15-web-8';
import {FINAL_KEY} from './story-flow.js?v=2026-10-15-web-8';
import {installTeacherMode} from './teacher-mode.js?v=2026-10-15-web-8';

export function installTestTools(){
 installTeacherMode();
 if(!testPlay)return;
 const css=document.createElement('link');css.rel='stylesheet';css.href='css/test-play.css';document.head.append(css);
 const dialog=document.createElement('dialog');dialog.id='test-tools-dialog';dialog.setAttribute('aria-labelledby','test-tools-title');document.body.append(dialog);
 function menu(){dialog.innerHTML=`<h2 id="test-tools-title">テスト用の操作</h2><p>時間・ヒントの制限はありません。<br>通常プレイとは別の記録で試せます。</p><div class="test-actions"><button data-test-action="rooms">エリア一覧へ</button><button data-test-action="final">最終問題を試す</button><a href="${gameUrl('ending.html?preview=success')}">成功のエンディング</a><a href="${gameUrl('ending.html?preview=rescued')}">仲間に救われるエンディング</a><button data-test-action="reset">テストを最初から</button><a href="start.html">通常プレイに戻る</a></div><button class="primary" data-test-action="close">閉じる</button>`;}
 function sync(){
  const app=document.querySelector('#room-app'),header=app?.querySelector('.top');
  if(header&&!header.querySelector('[data-test-menu]')){const button=document.createElement('button');button.type='button';button.className='test-mode-button';button.dataset.testMenu='';button.textContent='テスト用';button.setAttribute('aria-label','テスト用の操作：時間・ヒント制限なし');button.onclick=()=>{menu();dialog.showModal();};header.append(button);}
  for(const link of app?.querySelectorAll('a[href]')||[]){const href=link.getAttribute('href'),next=gameUrl(href);if(href!==next)link.href=next;}
 }
 dialog.addEventListener('click',event=>{
  const action=event.target.closest('[data-test-action]')?.dataset.testAction;if(!action)return;
  if(action==='close'){dialog.close();return;}
  if(action==='reset'){dialog.innerHTML='<h2 id="test-tools-title">テストを最初からにしますか？</h2><p>テスト用の進み具合を消し、学年・人数の選択に戻ります。</p><div class="dialog-actions"><button class="secondary" data-test-action="back">戻る</button><button class="primary" data-test-action="confirm-reset">テストの記録を消す</button></div>';return;}
  if(action==='back'){menu();return;}
  try{
   if(action==='confirm-reset'){clearTestRecords();location.replace(gameUrl('start.html'));return;}
   if(!loadSettings(gameStorage))saveSettings(gameStorage,4,1);
   gameStorage.removeItem(FINAL_KEY);gameSession.removeItem('escape2026.transfer.seen');
   if(action==='final')gameStorage.setItem(TEST_FINAL_KEY,String(Date.now()));else gameStorage.removeItem(TEST_FINAL_KEY);
   location.replace(gameUrl(action==='final'?'final-clues.html':'rooms.html'));
  }catch{document.querySelector('#storage-warning').hidden=false;dialog.close();}
 });
 new MutationObserver(sync).observe(document.querySelector('#room-app'),{childList:true});sync();
}
