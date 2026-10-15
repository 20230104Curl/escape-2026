import assert from 'node:assert/strict';
import {newYearOrder,restoreYearOrder,placeYearCard,removeYearCard,decideYearOrder,expireYearOrder,yearOrderComplete,YEAR_ORDER} from '../js/year-order-data.js';
import {renderYearOrder} from '../js/year-order-ui.js';
import {renderFinalFragments} from '../js/final-fragments-ui.js';
import {newFinalState,decideFinal,expireFinal,canRevealFinal,FINAL_INPUT} from '../js/story-flow.js';

const times={orderAt:1000,passwordAt:61000,answerUntil:121000};
const order=newYearOrder();
assert.equal(placeYearCard(order,2),false,'Hidden fixed events cannot be chosen');
assert.equal(placeYearCard(order,1),true);
assert.equal(placeYearCard(order,1),false,'A card cannot be chosen twice');
placeYearCard(order,6);removeYearCard(order,1);placeYearCard(order,4);
for(const number of [6,7,8])placeYearCard(order,number);
assert.deepEqual(order.slots,YEAR_ORDER,'Undo preserves the click sequence');
assert.equal(yearOrderComplete(order),true);
assert.equal(decideYearOrder(order,61000,times),false,'Deadline is exclusive');
assert.equal(decideYearOrder(order,60000,times),true);
assert.equal(order.correct,true);
assert.equal(removeYearCard(order,0),false,'Submitted answers stay locked');

const old={version:1,slots:[1,2,3,4,5,6,7,8],submitted:true,decidedAt:10000,reason:'answer'};
assert.deepEqual(restoreYearOrder(JSON.stringify(old)).slots,YEAR_ORDER);
assert.equal(restoreYearOrder(JSON.stringify(old)).correct,true,'Earlier completed games retain their result');
const oldWrong={...old,slots:[4,2,3,1,5,6,7,8]};
assert.equal(restoreYearOrder(JSON.stringify(oldWrong)).correct,false);
const partial=restoreYearOrder(JSON.stringify({version:1,slots:[7,2,3,null,5,1,null,null]}));
assert.deepEqual(partial.slots,[7,1,null,null,null]);
const corrupt=restoreYearOrder(JSON.stringify({version:2,slots:[1,1,2,9,8]}));
assert.deepEqual(corrupt.slots,[1,8,null,null,null]);
assert.equal(yearOrderComplete({slots:[1,1,1,1,1]}),false);
assert.equal(yearOrderComplete({slots:[1,4,6,7]}),false);
const timedOut=newYearOrder();assert.equal(expireYearOrder(timedOut,61000,times),true);
assert.equal(timedOut.correct,false);

const html=renderYearOrder(newYearOrder());
assert.equal((html.match(/data-year-card=/g)||[]).length,5);
for(const hidden of [2,3,5])assert.equal(html.includes(`data-year-card="${hidden}"`),false);
for(const count of [0,3,8]){
 const fragments=renderFinalFragments(['れ','ぶ','り','ゅ','の','す','じ','お'].slice(0,count),{animate:true});
 assert.equal((fragments.match(/class="fragment-frame /g)||[]).length,8);
 assert.equal((fragments.match(/class="fragment-letter"/g)||[]).length,count);
 assert.ok(fragments.includes(`<strong>${count}個</strong>`));
 assert.equal((fragments.match(/is-missing/g)||[]).length,8-count);
 assert.ok(!/[ぁ-ゖ]/.test(fragments.match(/class="fragment-letter"[^>]*>(.*?)</g)?.join('')||''));
}

const final=newFinalState();final.draft=FINAL_INPUT;
assert.equal(decideFinal(final,61000,times,order),true);
assert.equal(final.result,'success');
assert.equal(canRevealFinal(final,120999,times),false,'Answer stays hidden until the countdown ends');
assert.equal(canRevealFinal(final,121000,times),true);
const wrongFinal=newFinalState();wrongFinal.draft=FINAL_INPUT;
assert.equal(decideFinal(wrongFinal,61000,times,restoreYearOrder(JSON.stringify(oldWrong))),true);
assert.equal(wrongFinal.result,'rescued','Both stages are required for success');
const emptyFinal=newFinalState();assert.equal(expireFinal(emptyFinal,121000,times),true);
assert.equal(emptyFinal.result,'rescued');
const {refreshExplorationClock}=await import('../js/final-reveal.js');
const records=new Map(),classes=new Set();let clock=null;
globalThis.localStorage={getItem:key=>records.get(key)||null};
globalThis.document={querySelector:selector=>selector==='.brand'?{append:element=>{clock=element;}}:clock,createElement:()=>({setAttribute(){},classList:{toggle(name,on){if(on)classes.add(name);else classes.delete(name);}}})};
const realNow=Date.now;Date.now=()=>2000000000000;
try{
 for(const seconds of [301,300,299]){
  records.set('escape2026.exploration.v1',JSON.stringify({version:1,startedAt:Date.now()-(1500-seconds)*1000}));
  refreshExplorationClock();
  assert.equal(classes.has('is-urgent'),seconds<=300,`Urgency at ${seconds} seconds`);
 }
 assert.ok(clock.innerHTML.includes('4:59'));
}finally{Date.now=realNow;delete globalThis.document;delete globalThis.localStorage;}
console.log('PASS: five-card ordering, undo, saved-game migration, deadlines, fragment counts, final results, and 5-minute clock boundary');
