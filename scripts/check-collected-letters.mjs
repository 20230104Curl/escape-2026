import assert from 'node:assert/strict';
import {ROOM_CATALOG,readRoomProgress} from '../js/room-catalog.js';
import {renderRoomReward,renderCollectedReward,renderCollectedLetters} from '../js/room-reward-ui.js';
import {roomClearNotice} from '../js/room-completion.js';
import {finalFragments} from '../js/final-reveal.js';
import {toKatakana} from '../js/story-flow.js';
const records=new Map(),storage={getItem:key=>records.get(key)||null};
const chest=()=>'<svg aria-hidden="true"></svg>';
const tileCount=html=>(html.match(/aria-label="集めた文字 [ァ-ヶ]/g)||[]).length;
const empty=readRoomProgress(storage);
assert.equal(tileCount(renderCollectedLetters(empty)),0);
assert.equal((renderCollectedLetters(empty).match(/まだ集めていない文字/g)||[]).length,8);
for(const entry of ROOM_CATALOG){
 const letter=toKatakana(entry.room.reward);
 const unopened=renderRoomReward({complete:false,chest,letter:entry.room.reward});
 const missed=renderRoomReward({complete:false,missed:true,chest,letter:entry.room.reward});
 assert.equal(tileCount(unopened),0);assert.equal(tileCount(missed),0,'A failed area does not reveal its letter');
 const state=entry.restore(null);state.started=true;state.solved=[0,1];
 records.set(entry.room.storageKey,JSON.stringify(state));
 assert.equal(readRoomProgress(storage).find(room=>room.number===entry.room.number).complete,false,'Two solved riddles do not earn a letter');
 state.solved.push(2);state.claimed=false;records.set(entry.room.storageKey,JSON.stringify(state));
 const room=readRoomProgress(storage).find(room=>room.number===entry.room.number);
 assert.equal(room.complete,true,'Existing completed records reveal their letter without re-solving');
 for(const html of [renderRoomReward({complete:true,chest,letter:room.reward}),renderCollectedReward({title:room.title,chest,letter:room.reward}),roomClearNotice(room.reward,true)]){
  assert.ok(html.includes('集めた文字 '+letter));assert.equal(tileCount(html),1);
  assert.ok(!html.includes('封印'));assert.ok(!html.includes('最後のナゾが始まってから'));
 }
 assert.equal(roomClearNotice(room.reward,false),'');
}
const all=readRoomProgress(storage);assert.equal(all.filter(room=>room.complete).length,8);
assert.deepEqual(finalFragments(all),['れ','ぶ','り','ゅ','の','す','じ','お']);
assert.deepEqual(finalFragments(all,0,Infinity),all.map(room=>room.reward),'Collected letters are visible before the final challenge');
assert.equal(tileCount(renderCollectedLetters(all)),8);
records.delete(ROOM_CATALOG[0].room.storageKey);
assert.equal(tileCount(renderCollectedLetters(readRoomProgress(storage))),7,'Resetting an area removes its letter from the collection');
console.log('PASS: immediate katakana rewards in all eight areas, earned-only display, saved-game visibility, completion notices and collection consistency');
