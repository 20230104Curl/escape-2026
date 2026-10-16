import {toKatakana} from './story-flow.js?v=2026-10-16-web-13';
import {letterTile} from './room-reward-ui.js?v=2026-10-16-web-13';
import {gameStorage,gameUrl} from './play-mode.js?v=2026-10-16-web-13';
import {guardExploration} from './final-reveal.js?v=2026-10-16-web-13';
export function roomCompletion(roomKey,restore,warn){
 let leaving=false;
 function returnNow(){
  if(leaving||guardExploration())return;
  try{
   const saved=restore(gameStorage.getItem(roomKey));
   if(saved.solved.length!==3)return;
   leaving=true;location.replace(gameUrl('rooms.html'));
  }catch{warn();}
 }
 return {returnNow};
}

export function roomClearNotice(letter,complete){return complete?`<div class="room-clear-reward" role="status">${letterTile(letter)}<p>文字「${toKatakana(letter)}」を手に入れた！<br>最後のパスワードの手がかりです。</p></div>`:'';}
