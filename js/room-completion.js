import {gameStorage,gameUrl} from './play-mode.js?v=2026-10-15-web-19';
import {guardExploration} from './final-reveal.js?v=2026-10-15-web-19';
export const ROOM_CLEAR_DELAY=3000;

export function roomCompletion(roomKey,restore,warn){
 let timer=null,leaving=false;
 function cancel(){if(timer!==null)clearTimeout(timer);timer=null;}
 function returnNow(){
  cancel();if(leaving||guardExploration())return;
  try{
   const saved=restore(gameStorage.getItem(roomKey));
   if(saved.solved.length!==3)return;
   leaving=true;location.replace(gameUrl('rooms.html'));
  }catch{warn();}
 }
 return {cancel,returnNow,get pending(){return timer!==null;},start(){cancel();timer=setTimeout(returnNow,ROOM_CLEAR_DELAY);}};
}

export function roomClearNotice(pending){return pending?'<p class="room-clear-notice" role="status">このできごとをクリア！<br>かけらを保管しました。一覧に戻ります。</p>':'';}
