import {gameStorage,gameUrl,onPlayStorage,testPlay} from './play-mode.js?v=2026-10-15-web-9';
import {loadSettings} from './play-settings.js?v=2026-10-15-web-9';
import {classTimes,timestamp,loadFinal,expireFinal,canRevealFinal,FINAL_KEY,remaining,clockText} from './story-flow.js?v=2026-10-15-web-9';
let leaving=false;
function go(path){if(leaving)return;leaving=true;location.replace(gameUrl(path));}

export function revealTime(value=classTimes().finalAt){
  return timestamp(value);
}
export function isFinalOpen(now=Date.now(),at=classTimes().finalAt){
  const deadline=revealTime(at);
  return Number.isFinite(now)&&Number.isFinite(deadline)&&now>=deadline;
}
export function finalFragments(rooms,now=Date.now(),at=classTimes().finalAt){
  if(!isFinalOpen(now,at))return [];
  return rooms.filter(room=>room.complete).map(room=>room.reward);
}
export function watchFinalReveal(){
  const check=()=>{
    if(guardExploration())return;
    const times=classTimes();if(!testPlay&&!Number.isFinite(times.finalAt))return;
    let clock=document.querySelector('.exploration-clock');
    if(!clock){clock=document.createElement('span');clock.className='exploration-clock';document.querySelector('.brand')?.append(clock);}
    clock.textContent=testPlay?`探索 時間制限なし`:`探索 あと ${clockText(remaining(times.finalAt))}`;
  };
  check();setInterval(check,500);onPlayStorage(check);window.addEventListener('pageshow',check);document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
}
export function guardExploration(){
  if(leaving)return true;
  const state=loadFinal(gameStorage),now=Date.now(),times=classTimes();
  if(expireFinal(state,now,times)){try{gameStorage.setItem(FINAL_KEY,JSON.stringify(state));}catch{}}
  if(canRevealFinal(state,now,times)){go('ending.html');return true;}
  if(state.submitted){go('final-clues.html');return true;}
  if(isFinalOpen(now)){go('final-clues.html');return true;}
  if(!loadSettings(gameStorage)){go('start.html');return true;}
  if(Number.isFinite(times.explorationAt)&&now<times.explorationAt){go('start.html');return true;}
  return false;
}
