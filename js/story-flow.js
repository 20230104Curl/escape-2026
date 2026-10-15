import * as config from './game-flow-config.js?v=2026-10-15-web-6';
import {testPlay,gameStorage,testFinalAt} from './play-mode.js?v=2026-10-15-web-6';
export const OPENING_SECONDS=300,EXPLORATION_SECONDS=1500,FINAL_ANSWER_SECONDS=60,ENDING_SECONDS=60;
export const FINAL_KEY='escape2026.finale.v1';
export const EXPLORATION_KEY='escape2026.exploration.v1';
export const FINAL_INPUT='のぶれすおりじゅ';
export const FINAL_FIXED={4:'・',6:'ブ',8:'ー'};
export function timestamp(value){const time=typeof value==='number'?value:typeof value==='string'&&value.trim()?Date.parse(value):NaN;return Number.isFinite(time)&&time>0?time:NaN;}
export function classTimes(start=config.GAME_START_AT,final=config.FINAL_REVEAL_AT){
  // An explicitly supplied schedule is kept for the teacher's fixed-time option.
  // Normal play uses the first saved press of the exploration start button.
  if(arguments.length===0){
    if(testPlay){const session=loadExploration(gameStorage);return {openingAt:NaN,explorationAt:session?.startedAt??NaN,finalAt:testFinalAt(),answerUntil:Infinity,endAt:Infinity};}
    try{const session=loadExploration(gameStorage);if(session)return explorationTimes(session.startedAt);}catch{}
  }
  const openingAt=timestamp(start),explorationAt=openingAt+OPENING_SECONDS*1000;
  const explicit=timestamp(final),finalAt=Number.isFinite(explicit)?explicit:explorationAt+EXPLORATION_SECONDS*1000;
  return {openingAt,explorationAt,finalAt,answerUntil:finalAt+FINAL_ANSWER_SECONDS*1000,endAt:finalAt+(FINAL_ANSWER_SECONDS+ENDING_SECONDS)*1000};
}
export function restoreExploration(raw){
  let saved;try{saved=JSON.parse(raw);}catch{return null;}
  return saved?.version===1&&Number.isFinite(saved.startedAt)&&saved.startedAt>0?{version:1,startedAt:saved.startedAt}:null;
}
export function loadExploration(storage){try{return restoreExploration(storage.getItem(EXPLORATION_KEY));}catch{return null;}}
export function startExploration(storage,now=Date.now()){
  const existing=loadExploration(storage);if(existing)return existing;
  if(!Number.isFinite(now)||now<=0)throw new Error('Invalid exploration start');
  const session={version:1,startedAt:now};storage.setItem(EXPLORATION_KEY,JSON.stringify(session));
  const saved=loadExploration(storage);if(!saved||saved.startedAt!==now)throw new Error('Exploration start was not saved');
  return saved;
}
export function explorationTimes(startedAt){
  const explorationAt=timestamp(startedAt),finalAt=explorationAt+EXPLORATION_SECONDS*1000;
  return {openingAt:NaN,explorationAt,finalAt,answerUntil:finalAt+FINAL_ANSWER_SECONDS*1000,endAt:finalAt+(FINAL_ANSWER_SECONDS+ENDING_SECONDS)*1000};
}
export const toKatakana=value=>value.replace(/[ぁ-ゖ]/g,c=>String.fromCharCode(c.charCodeAt(0)+0x60));
export const newFinalState=()=>({version:1,draft:'',submitted:false,result:null,reason:null,decidedAt:null,revealAt:null,bellPlayed:false});
export function restoreFinal(raw){
  let saved;try{saved=JSON.parse(raw);}catch{return newFinalState();}
  if(saved?.version!==1)return newFinalState();
  const state=newFinalState();state.draft=typeof saved.draft==='string'?saved.draft.slice(0,8):'';
  if(saved.submitted===true&&['success','rescued'].includes(saved.result)&&Number.isFinite(saved.decidedAt)&&saved.decidedAt>0){
    Object.assign(state,{submitted:true,result:saved.result,reason:saved.reason==='timeout'?'timeout':'answer',decidedAt:saved.decidedAt,revealAt:Number.isFinite(saved.revealAt)&&saved.revealAt>=saved.decidedAt?saved.revealAt:null,bellPlayed:saved.bellPlayed===true});
  }
  return state;
}
export function loadFinal(storage){try{return restoreFinal(storage.getItem(FINAL_KEY));}catch{return newFinalState();}}
export function decideFinal(state,now,times=classTimes()){
  if(state.submitted||!Number.isFinite(times.finalAt)||now<times.finalAt||now>=times.answerUntil||state.draft.length!==8)return false;
  Object.assign(state,{submitted:true,result:state.draft===FINAL_INPUT?'success':'rescued',reason:'answer',decidedAt:now,revealAt:Number.isFinite(times.answerUntil)?times.answerUntil:now});return true;
}
export function expireFinal(state,now,times=classTimes()){
  if(state.submitted||!Number.isFinite(times.answerUntil)||now<times.answerUntil)return false;
  Object.assign(state,{submitted:true,result:'rescued',reason:'timeout',decidedAt:times.answerUntil,revealAt:times.answerUntil});return true;
}
export function finalRevealAt(state,times=classTimes()){
  if(!state.submitted)return NaN;
  // Completed older games retain their ending; pending older records use the current deadline.
  return state.revealAt??(state.bellPlayed||!Number.isFinite(times.answerUntil)?state.decidedAt:Math.max(state.decidedAt,times.answerUntil));
}
export const canRevealFinal=(state,now=Date.now(),times=classTimes())=>state.submitted&&now>=finalRevealAt(state,times);
export const remaining=(deadline,now=Date.now())=>Math.max(0,Math.ceil((deadline-now)/1000));
export const clockText=seconds=>`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
