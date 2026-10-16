import {toKatakana} from './story-flow.js?v=2026-10-16-web-08';
import {letterTile} from './room-reward-ui.js?v=2026-10-16-web-08';
import {gameStorage,gameUrl} from './play-mode.js?v=2026-10-16-web-08';
import {guardExploration} from './final-reveal.js?v=2026-10-16-web-08';
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

export function roomClearNotice(pending,letter,complete=pending){return complete?`<div class="room-clear-reward" role="status">${letterTile(letter)}<p>文字「${toKatakana(letter)}」を手に入れた！<br>最後のパスワードの手がかりです。${pending?'<br>できごと一覧に戻ります。':''}</p></div>`:'';}
