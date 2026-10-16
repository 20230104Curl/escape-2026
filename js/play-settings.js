import {readRoomProgress} from './room-catalog.js?v=2026-10-16-web-06';
import {loadExploration} from './story-flow.js?v=2026-10-16-web-06';
import {gameStorage} from './play-mode.js?v=2026-10-16-web-06';
export const SETTINGS_KEY='escape2026.playSettings.v1',HINTS_KEY='escape2026.hints.v1';
export const GRADES=[{value:4,label:'小4'},{value:5,label:'小5'},{value:6,label:'小6'},{value:7,label:'中1'},{value:8,label:'中2'},{value:9,label:'中3'}];
export const HINT_LIMITS={4:36,5:30,6:24,7:18,8:12,9:12},TOTAL_HINTS=48;
export function hintLimit(grade,players){return Number.isInteger(grade)&&Object.hasOwn(HINT_LIMITS,grade)&&[1,2].includes(players)?HINT_LIMITS[grade]*(players===2?2/3:1):0;}
export function restoreSettings(raw){let s;try{s=JSON.parse(raw);}catch{return null;}return s?.version===1&&hintLimit(s.grade,s.players)?{version:1,grade:s.grade,players:s.players}:null;}
export function loadSettings(storage){try{return restoreSettings(storage.getItem(SETTINGS_KEY));}catch{return null;}}
function write(storage,key,value){const raw=JSON.stringify(value);if(storage.getItem(key)!==raw)storage.setItem(key,raw);if(storage.getItem(key)!==raw)throw Error('記録を保存できませんでした');}
const emptyUsage=()=>Array.from({length:8},()=>[0,0,0]);
const validLevel=n=>Number.isInteger(n)&&n>=0&&n<=2?n:0;
export function readHintUsage(storage){
 let saved;try{saved=JSON.parse(storage.getItem(HINTS_KEY));}catch{}
 const levels=emptyUsage();if(saved?.version===1)for(let r=0;r<8;r++)for(let q=0;q<3;q++)levels[r][q]=validLevel(saved.levels?.[r]?.[q]);
 // Import previously viewed hints without changing any answers or room records.
 for(const [r,room] of readRoomProgress(storage).entries())for(let q=0;q<3;q++)levels[r][q]=Math.max(levels[r][q],validLevel(room.state.hints[q]));
 return levels;
}
export function preserveHintUsage(storage){const levels=readHintUsage(storage);write(storage,HINTS_KEY,{version:1,levels});return levels;}
export function saveSettings(storage,grade,players){
 if(!hintLimit(grade,players))throw Error('学年とプレイ人数を選んでください');
 const previous=loadSettings(storage);
 if(previous&&loadExploration(storage)&&(previous.grade!==grade||previous.players!==players))throw Error('探索開始後は設定を変更できません');
 preserveHintUsage(storage);const next={version:1,grade,players};write(storage,SETTINGS_KEY,next);return next;
}
export function hintStatus(storage,room=1,question=0){
 const settings=loadSettings(storage),levels=readHintUsage(storage),used=levels.flat().reduce((a,b)=>a+b,0),limit=settings?(storage.testPlay?TOTAL_HINTS:hintLimit(settings.grade,settings.players)):0;
 return {configured:!!settings,unlimited:storage.testPlay===true,used,limit,left:Math.max(0,limit-used),level:levels[room-1]?.[question]||0};
}
export function openHint(storage,room,question,index){
 if(!Number.isInteger(room)||room<1||room>8||!Number.isInteger(question)||question<0||question>2||![0,1].includes(index))return {ok:false,reason:'invalid'};
 const settings=loadSettings(storage);if(!settings)return {ok:false,reason:'settings'};
 const levels=readHintUsage(storage),level=levels[room-1][question],used=levels.flat().reduce((a,b)=>a+b,0),limit=storage.testPlay?TOTAL_HINTS:hintLimit(settings.grade,settings.players);
 if(index>level)return {ok:false,reason:'order'};
 if(index===level&&used>=limit)return {ok:false,reason:'limit'};
 const fresh=index===level;levels[room-1][question]=Math.max(level,index+1);write(storage,HINTS_KEY,{version:1,levels});
 return {ok:true,fresh,level:levels[room-1][question],used:used+(fresh?1:0),limit,left:Math.max(0,limit-used-(fresh?1:0))};
}
export async function withHintLock(action){return globalThis.navigator?.locks?globalThis.navigator.locks.request(gameStorage.scopeKey(HINTS_KEY),action):action();}
