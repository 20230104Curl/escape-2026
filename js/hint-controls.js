import {gameStorage} from './play-mode.js?v=2026-10-15-web-6';
import {hintStatus,openHint,withHintLock} from './play-settings.js?v=2026-10-15-web-6';
export function hintFooter(){const s=hintStatus(gameStorage);return s.unlimited?'ヒント 制限なし（全48個）':`ヒント あと ${s.left} / ${s.limit} 個`;}
export function hintPanel(room,question){
 const s=hintStatus(gameStorage,room,question),n=s.level;
 return `<section class="hint-area"><strong>${s.unlimited?'回数制限なし':s.left?'困ったときは':'残り0個'}</strong>${[0,1].map(i=>`<button class="hint-button" data-hint="${i}" ${i>n||(i===n&&!s.left)?'disabled':''}>ヒント${i+1}${i<n?'を見直す':'を見る'}</button>`).join('')}</section>`;
}
export function requestHint({room,question,index,dialog,confirmAction,commit,show,render,warn,guard}){
 const status=hintStatus(gameStorage,room,question);
 const message=(title,body)=>{dialog.innerHTML=`<h2 id="dialog-title">${title}</h2><p>${body}</p><div class="dialog-actions"><button class="primary" data-close>問題に戻る</button></div>`;dialog.querySelector('[data-close]').onclick=()=>dialog.close();if(!dialog.open)dialog.showModal();};
 if(index<status.level){show(index);return;}
 if(index!==status.level)return;
 if(!status.left){message('ヒントを使い切りました','一度開いたヒントは、何度でも見直せます。');return;}
 const open=async()=>{
  try{
   const result=await withHintLock(()=>{if(guard())return null;const result=openHint(gameStorage,room,question,index);if(result.ok)commit(result.level);return result;});
   if(!result)return;render();if(result.ok)show(index);else message(result.reason==='limit'?'ヒントを使い切りました':'ヒントを開けませんでした','一度開いたヒントは、何度でも見直せます。');
  }catch{warn();message('ヒントの記録を保存できません','先生に知らせてください。まだヒントは開いていません。');}
 };
 if(status.unlimited){open();return;}
 confirmAction(`ヒント${index+1}を開きますか？`,`${index===0?'考えるきっかけを教えます。':'答えの一歩手前まで、解き方を説明します。'}<br>開くと1個使います（あと${status.left}個）。<br>一度開いたヒントの見直しは減りません。`,'ヒントを開く',open);
}
