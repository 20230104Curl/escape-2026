import {ROOM_KEY,QUESTIONS as questions1,restoreRoom1State} from './room1-data.js?v=2026-10-15-web-16';
import {ROOM as room2,QUESTIONS as questions2,restoreState as restore2} from './room2-data.js?v=2026-10-15-web-16';
import {ROOM as room3,QUESTIONS as questions3,restoreState as restore3} from './room3-data.js?v=2026-10-15-web-16';
import {ROOM as room4,QUESTIONS as questions4,restoreState as restore4} from './room4-data.js?v=2026-10-15-web-16';
import {LATE_ROOMS,LATE_QUESTIONS,restoreLateState} from './room-late-data.js?v=2026-10-15-web-16';
import {withNewsTheme} from './news-areas.js?v=2026-10-15-web-16';

export const ROOM_CATALOG=[
  {room:{number:1,title:'忘れられた準備室',image:'assets/images/room1-preparation.png',storageKey:ROOM_KEY,reward:'れ'},questions:questions1,restore:restoreRoom1State},
  {room:room2,questions:questions2,restore:restore2},{room:room3,questions:questions3,restore:restore3},{room:room4,questions:questions4,restore:restore4},
  ...LATE_ROOMS.map(room=>({room,questions:LATE_QUESTIONS[room.number],restore:raw=>restoreLateState(raw,room.number)}))
].map(entry=>({...entry,room:withNewsTheme(entry.room)}));

export function readRoomProgress(storage,onError=()=>{}){
  return ROOM_CATALOG.map(entry=>{
    let raw=null;try{raw=storage.getItem(entry.room.storageKey);}catch{onError();}
    const state=entry.restore(raw);
    const failed=entry.questions.some((q,i)=>q.maxAttempts&&!state.solved.includes(i)&&(state.attempts?.[i]||0)>=q.maxAttempts);
    return {...entry.room,state,complete:state.solved.length===3,failed};
  });
}
