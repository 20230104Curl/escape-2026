export function withAttempts(state,raw,questions){
 let saved=null;try{saved=JSON.parse(raw);}catch{}
 return {...state,attempts:questions.map((q,i)=>q.maxAttempts&&saved?.version===1&&Number.isInteger(saved.attempts?.[i])?Math.max(0,Math.min(q.maxAttempts,saved.attempts[i])):0)};
}
