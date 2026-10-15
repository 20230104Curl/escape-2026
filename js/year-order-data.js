export const YEAR_ORDER_KEY='escape2026.yearOrder.v1';
export const YEAR_ORDER=[1,4,6,7,8];
export const YEAR_CHOICES=[7,1,8,4,6];
export const newYearOrder=()=>({version:2,slots:YEAR_ORDER.map(()=>null),submitted:false,correct:null,reason:null,decidedAt:null});
export const yearOrderComplete=state=>state.slots.length===YEAR_ORDER.length&&new Set(state.slots).size===YEAR_ORDER.length&&state.slots.every(value=>YEAR_ORDER.includes(value));
export const yearOrderCorrect=state=>yearOrderComplete(state)&&state.slots.every((value,i)=>value===YEAR_ORDER[i]);
export function restoreYearOrder(raw){
 let saved;try{saved=JSON.parse(raw);}catch{return newYearOrder();}
 const state=newYearOrder();if(![1,2].includes(saved?.version)||!Array.isArray(saved.slots))return state;
 // Preserve earlier games while removing the three previously fixed events.
 const slots=saved.version===1?saved.slots.filter((_,i)=>![1,2,4].includes(i)):saved.slots;
 const choices=[...new Set(slots.filter(value=>YEAR_CHOICES.includes(value)))].slice(0,YEAR_ORDER.length);
 choices.forEach((value,i)=>{state.slots[i]=value;});
 if(saved.submitted===true&&Number.isFinite(saved.decidedAt)&&saved.decidedAt>0&&['answer','timeout'].includes(saved.reason)){
  Object.assign(state,{submitted:true,reason:saved.reason,decidedAt:saved.decidedAt,correct:saved.reason==='answer'&&yearOrderComplete(state)&&yearOrderCorrect(state)});
 }
 return state;
}
export function loadYearOrder(storage){try{return restoreYearOrder(storage.getItem(YEAR_ORDER_KEY));}catch{return newYearOrder();}}
export function placeYearCard(state,number){
 if(state.submitted||!YEAR_CHOICES.includes(number)||state.slots.includes(number))return false;
 const slot=state.slots.indexOf(null);if(slot<0)return false;state.slots[slot]=number;return true;
}
export function removeYearCard(state,slot){
 if(state.submitted||!Number.isInteger(slot)||slot<0||slot>=state.slots.length||!state.slots[slot])return false;
 state.slots.splice(slot,1);state.slots.push(null);return true;
}
export function decideYearOrder(state,now,times){
 const orderAt=times.orderAt??times.finalAt;
 if(state.submitted||!yearOrderComplete(state)||!Number.isFinite(orderAt)||now<orderAt||now>=times.passwordAt)return false;
 Object.assign(state,{submitted:true,correct:yearOrderCorrect(state),reason:'answer',decidedAt:now});return true;
}
export function expireYearOrder(state,now,times){
 if(state.submitted||!Number.isFinite(times.passwordAt)||now<times.passwordAt)return false;
 Object.assign(state,{submitted:true,correct:false,reason:'timeout',decidedAt:times.passwordAt});return true;
}
