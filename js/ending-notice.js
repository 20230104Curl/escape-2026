export const FAILURE_NOTICE_KEY='escape2026.failureNotice.v1';
export const FAILURE_NOTICE_MS=5000;
export function beginFailureNotice(storage,state,now=Date.now()){
 if(!state.submitted||state.result!=='rescued')return null;
 try{
  const saved=JSON.parse(storage.getItem(FAILURE_NOTICE_KEY));
  if(saved?.version===1&&saved.decidedAt===state.decidedAt&&saved.revealAt===state.revealAt&&Number.isFinite(saved.startedAt)&&saved.startedAt>0&&saved.startedAt<=now)return saved.startedAt;
 }catch{}
 const notice={version:1,decidedAt:state.decidedAt,revealAt:state.revealAt,startedAt:now};
 try{storage.setItem(FAILURE_NOTICE_KEY,JSON.stringify(notice));}catch{}
 return now;
}
export function failureNoticeRemaining(startedAt,now=Date.now()){
 return Number.isFinite(startedAt)?Math.max(0,startedAt+FAILURE_NOTICE_MS-now):0;
}
export function renderFailureNotice(){return '<main class="failure-notice" role="alert"><h1>残念！</h1></main>';}
