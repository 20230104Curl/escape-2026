export const YEAR_ORDER_KEY='escape2026.yearOrder.v1';
export const YEAR_ORDER=[1,2,3,4,5,6,7,8];
export const FIXED_YEAR_SLOTS={0:1,1:2,4:5};
export const YEAR_CHOICES=[7,3,8,4,6];
export const newYearOrder=()=>({version:1,slots:YEAR_ORDER.map((_,i)=>FIXED_YEAR_SLOTS[i]??null),submitted:false,correct:null,reason:null,decidedAt:null});
export const yearOrderComplete=state=>state.slots.every(Number.isInteger);
export const yearOrderCorrect=state=>state.slots.every((value,i)=>value===YEAR_ORDER[i]);
export function restoreYearOrder(raw){
 let saved;try{saved=JSON.parse(raw);}catch{return newYearOrder();}
 const state=newYearOrder();if(saved?.version!==1||!Array.isArray(saved.slots))return state;
 const used=new Set(Object.values(FIXED_YEAR_SLOTS));
 for(let i=0;i<8;i++)if(FIXED_YEAR_SLOTS[i]===undefined){const value=saved.slots[i];if(YEAR_CHOICES.includes(value)&&!used.has(value)){state.slots[i]=value;used.add(value);}}
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
 if(state.submitted||FIXED_YEAR_SLOTS[slot]!==undefined||!state.slots[slot])return false;state.slots[slot]=null;return true;
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
