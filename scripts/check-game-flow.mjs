import assert from 'node:assert/strict';
import {newYearOrder,restoreYearOrder,placeYearCard,removeYearCard,decideYearOrder,expireYearOrder,yearOrderComplete,YEAR_ORDER} from '../js/year-order-data.js';
import {renderYearOrder} from '../js/year-order-ui.js';
import {renderFinalFragments} from '../js/final-fragments-ui.js';
import {newFinalState,decideFinal,expireFinal,canRevealFinal,FINAL_INPUT,FINAL_FIXED,FINAL_MANUAL_POSITION,formatFinalAnswer,restoreFinal} from '../js/story-flow.js';

import {needsFinalPlacement,finalInputSlots,nextFinalPosition,finalInputComplete,foundFinalPositions,placeFinalFragments,enterFinalLetter,editableFinalPositions,eraseFinalLetters} from '../js/final-password-input.js';

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
for(const count of [0,3,5,8]){
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
globalThis.document={querySelector:selector=>selector==='.top'?{append:element=>{clock=element;}}:clock,createElement:()=>({setAttribute(){},classList:{toggle(name,on){if(on)classes.add(name);else classes.delete(name);}}})};
const realNow=Date.now;Date.now=()=>2000000000000;
try{
 for(const seconds of [301,300,299]){
  records.set('escape2026.exploration.v1',JSON.stringify({version:1,startedAt:Date.now()-(1500-seconds)*1000}));
  refreshExplorationClock();
  assert.equal(classes.has('is-urgent'),seconds<=300,`Urgency at ${seconds} seconds`);
 }
 assert.ok(clock.innerHTML.includes('4:59'));
}finally{Date.now=realNow;delete globalThis.document;delete globalThis.localStorage;}

const collected=['れ','ぶ','ゅ','の','じ'];
const placed=newFinalState();
assert.equal(placeFinalFragments(placed,[]),false);
assert.equal(placeFinalFragments(placed,collected),true);
assert.deepEqual(finalInputSlots(placed),['の','ぶ','れ','','','','','じ','ゅ']);
assert.equal(nextFinalPosition(placed),3);
assert.equal(finalInputComplete(placed),false);
assert.equal(decideFinal(placed,61000,times,order),false,'Positions containing holes cannot be submitted');
assert.equal(placeFinalFragments(placed,collected),false,'Placement is idempotent');
const restored=restoreFinal(JSON.stringify(placed));
assert.equal(restored.fragmentsPlaced,true);
assert.deepEqual(finalInputSlots(restored),finalInputSlots(placed),'Positioned letters survive a reload');
assert.equal(enterFinalLetter(placed,'あ'),true);
assert.equal(nextFinalPosition(placed),4);
assert.deepEqual(editableFinalPositions(placed,collected),[3]);
assert.equal(eraseFinalLetters(placed,collected),true);
assert.deepEqual(finalInputSlots(placed),['の','ぶ','れ','','','','','じ','ゅ'],'Backspace preserves collected letters and their positions');
for(const letter of ['す','お','ぶ','り'])enterFinalLetter(placed,letter);
assert.equal(placed.draft,FINAL_INPUT);
assert.equal(finalInputComplete(placed),true);
assert.equal(eraseFinalLetters(placed,collected,{all:true}),true);
assert.deepEqual(finalInputSlots(placed),['の','ぶ','れ','','','','','じ','ゅ'],'Clear removes only letters entered by the player');
for(const letter of ['す','お','ぶ','り'])enterFinalLetter(placed,letter);
assert.equal(decideFinal(placed,61000,times,order),true);
assert.equal(placed.result,'success');
assert.equal(eraseFinalLetters(placed,collected),false);
assert.equal(enterFinalLetter(placed,'あ'),false);
for(const count of [0,3,5,8]){
 const sample=['れ','ぶ','り','ゅ','の','す','じ','お'].slice(0,count),draft=newFinalState();
 placeFinalFragments(draft,sample);
 assert.equal(finalInputSlots(draft).filter(Boolean).length,count);
 const locked=new Set(foundFinalPositions(sample));
 for(let index=nextFinalPosition(draft);index>=0;index=nextFinalPosition(draft))enterFinalLetter(draft,FINAL_INPUT[index]);
 assert.equal(draft.draft,FINAL_INPUT);
 eraseFinalLetters(draft,sample,{all:true});
 assert.equal(finalInputSlots(draft).filter(Boolean).length,count);
 for(const index of locked)assert.equal(finalInputSlots(draft)[index],FINAL_INPUT[index]);
}
assert.deepEqual(foundFinalPositions(['ブ','ブ','レ']),[1,2],'One found character fills one editable position, not a printed symbol');
const earlier=restoreFinal(JSON.stringify({version:1,draft:'のぶれす'}));
assert.equal(earlier.fragmentsPlaced,false);
assert.equal(nextFinalPosition(earlier),4);
assert.equal(enterFinalLetter(earlier,'お'),true);
assert.equal(earlier.draft,'のぶれすお','Earlier sequential input still works');
const partialInput=newFinalState();partialInput.draft='ああああ';
placeFinalFragments(partialInput,collected);
assert.equal(finalInputSlots(partialInput)[3],'あ','Placement preserves input in uncollected positions');
assert.ok(renderFinalFragments(collected).includes('data-action="place-fragments"'));
assert.ok(renderFinalFragments(collected,{placed:true}).includes('文字を入れました'));


assert.deepEqual(FINAL_FIXED,{4:'・',8:'ー'},'Only the separator and long vowel mark are printed');
const collectedAll=['れ','ぶ','り','ゅ','の','す','じ','お'];
const requiredBu=newFinalState();placeFinalFragments(requiredBu,collectedAll);
assert.equal(requiredBu.draft,'のぶれすお りじゅ');
assert.equal(nextFinalPosition(requiredBu),FINAL_MANUAL_POSITION);
assert.equal(finalInputComplete(requiredBu),false);
assert.equal(decideFinal(requiredBu,61000,times,order),false,'Finding all fragments does not complete the answer');
assert.equal(foundFinalPositions([...collectedAll,'ぶ']).includes(FINAL_MANUAL_POSITION),false,'The second ブ never comes from automatic placement');
enterFinalLetter(requiredBu,'ぶ');
assert.equal(finalInputComplete(requiredBu),true);
assert.equal(formatFinalAnswer(requiredBu.draft),'ノブレス・オブリージュ');
assert.deepEqual(editableFinalPositions(requiredBu,collectedAll),[FINAL_MANUAL_POSITION]);
eraseFinalLetters(requiredBu,collectedAll);
assert.equal(finalInputSlots(requiredBu)[1],'ぶ','Backspace keeps the first collected ブ');
assert.equal(finalInputSlots(requiredBu)[FINAL_MANUAL_POSITION],'');
enterFinalLetter(requiredBu,'ぶ');
assert.equal(decideFinal(requiredBu,61000,times,order),true);
assert.equal(requiredBu.result,'success');
const wrongBu=newFinalState();placeFinalFragments(wrongBu,collectedAll);enterFinalLetter(wrongBu,'あ');
assert.equal(formatFinalAnswer(wrongBu.draft),'ノブレス・オアリージュ','Confirmation shows the actual typed letter');
assert.equal(decideFinal(wrongBu,61000,times,order),true);
assert.equal(wrongBu.result,'rescued','The manually entered ブ is checked');
const legacyPlaced=restoreFinal(JSON.stringify({version:1,draft:'のぶれすおりじゅ',fragmentsPlaced:true}));
assert.equal(legacyPlaced.draft,'のぶれすお りじゅ');
assert.equal(nextFinalPosition(legacyPlaced),FINAL_MANUAL_POSITION);
assert.equal(legacyPlaced.fragmentsPlaced,true);
enterFinalLetter(legacyPlaced,'ぶ');
assert.equal(restoreFinal(JSON.stringify(legacyPlaced)).draft,FINAL_INPUT,'New saves are not migrated twice');
const legacyPartialFinal=restoreFinal(JSON.stringify({version:1,draft:'のぶれすおり'}));
assert.equal(legacyPartialFinal.draft,'のぶれすお り');
assert.equal(nextFinalPosition(legacyPartialFinal),FINAL_MANUAL_POSITION);
const legacyCompletedFinal=restoreFinal(JSON.stringify({version:1,draft:'のぶれすおりじゅ',submitted:true,result:'success',reason:'answer',decidedAt:1000,revealAt:121000}));
assert.equal(legacyCompletedFinal.submitted,true);
assert.equal(legacyCompletedFinal.result,'success','Completed older games retain their ending');
const stillMissingBu=renderFinalFragments(collectedAll,{placed:true,remaining:1});
assert.ok(stillMissingBu.includes('残り1文字'));
assert.ok(!stillMissingBu.includes('すべての文字が入りました'));
assert.ok(renderFinalFragments(collectedAll,{placed:true,remaining:0}).includes('すべての文字が入りました'));


// Found fragments must be placed before the manual-input phase opens.
for(const count of [0,3,6,8]){
 const letters=['れ','ぶ','り','ゅ','の','す','じ','お'].slice(0,count),pending=newFinalState();
 assert.equal(needsFinalPlacement(pending,letters),count>0);
 if(count){assert.equal(placeFinalFragments(pending,letters),true);assert.equal(needsFinalPlacement(pending,letters),false);assert.equal(needsFinalPlacement(restoreFinal(JSON.stringify(pending)),letters),false,'Reload keeps manual input enabled after placement');}
}
const earlierTyped=newFinalState();earlierTyped.draft='のぶ';
assert.equal(needsFinalPlacement(earlierTyped,['れ','ぶ']),true,'Earlier typed drafts still place found letters first');
const earlierFinished={...earlierTyped,submitted:true};assert.equal(needsFinalPlacement(earlierFinished,['れ']),false);
const placementPrompt=renderFinalFragments(['れ','ぶ']);assert.ok(placementPrompt.includes('is-priority'));assert.ok(placementPrompt.includes('ここを押そう'));assert.ok(placementPrompt.includes('aria-label="文字を入れる"'));assert.ok(placementPrompt.includes('place-arrow'));
assert.ok(!renderFinalFragments(['れ'],{placed:true}).includes('is-priority'));
assert.ok(!renderFinalFragments([]).includes('is-priority'));

console.log('PASS: placement-first input gating, zero-letter access, reload after placement; mandatory second ブ, nine-letter answer, migration, displayed confirmation; positioned letters, persistent gaps, protected collected letters, remaining input; five-card ordering, undo, saved-game migration, deadlines, fragment counts, final results, and 5-minute clock boundary');
