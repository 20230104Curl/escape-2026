import assert from 'node:assert/strict';
import {resetCurrentGame} from '../js/teacher-mode-data.js';
import {readFile} from 'node:fs/promises';
import {EMERGENCY_ALARM_KEY,emergencyAlarmPlayed,rememberEmergencyAlarm,createEmergencyAlarm} from '../js/emergency-alarm.js';
const wav=await readFile(new URL('../assets/audio/emergency-alarm.wav',import.meta.url));
assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.toString('ascii',8,12),'WAVE');
const seconds=wav.readUInt32LE(40)/wav.readUInt32LE(28);assert.equal(seconds,2,'Alarm asset must end after two seconds');
let peak=0;for(let offset=44;offset<wav.length;offset+=2)peak=Math.max(peak,Math.abs(wav.readInt16LE(offset)));assert.ok(peak>1000&&peak<16000,'Non-silent alarm has a moderate, unclipped level');
const records=new Map(),storage={getItem:key=>records.get(key),setItem:(key,value)=>records.set(key,value)};
assert.equal(emergencyAlarmPlayed(storage,1000),false);rememberEmergencyAlarm(storage,1000);assert.equal(emergencyAlarmPlayed(storage,1000),true);assert.equal(emergencyAlarmPlayed(storage,2000),false,'A new exploration can sound again');records.set(EMERGENCY_ALARM_KEY,'broken');assert.equal(emergencyAlarmPlayed(storage,1000),false);
function fixture(errors=[]){
 const events={},audio={plays:0,pauses:0,addEventListener:(name,callback)=>events[name]=callback,async play(){this.plays++;if(errors.length)throw errors.shift();},pause(){this.pauses++;}};
 return {audio,events,alarm:createEmergencyAlarm({makeAudio:()=>audio})};
}
const cue=fixture();assert.equal(await cue.alarm.start(),true);assert.equal(cue.audio.loop,false);assert.equal(cue.audio.volume,.55);assert.equal(cue.alarm.status,'playing');assert.equal(await cue.alarm.start(),false);cue.events.ended();assert.equal(cue.alarm.status,'finished');assert.equal(await cue.alarm.retry(),false);assert.equal(cue.audio.plays,1,'No repeated alarm in the same warning');
const blocked=fixture([Object.assign(new Error('gesture required'),{name:'NotAllowedError'})]);assert.equal(await blocked.alarm.start(),false);assert.equal(blocked.alarm.status,'blocked');assert.equal(await blocked.alarm.retry(),true);assert.equal(blocked.audio.plays,2);blocked.alarm.stop();assert.equal(blocked.audio.pauses,1);assert.equal(await blocked.alarm.retry(),false);
const broken=fixture([Object.assign(new Error('missing audio'),{name:'NotSupportedError'})]);assert.equal(await broken.alarm.start(),false);assert.equal(broken.alarm.status,'unavailable');
let resolvePlay;const pendingAudio={addEventListener(){},play:()=>new Promise(resolve=>resolvePlay=resolve),pauses:0,pause(){this.pauses++;}};const pending=createEmergencyAlarm({makeAudio:()=>pendingAudio});const started=pending.start();pending.stop();resolvePlay();assert.equal(await started,false,'Advancing while audio loads cancels playback');assert.ok(pendingAudio.pauses>=1);assert.equal(pending.status,'stopped');
storage.removeItem=key=>records.delete(key);rememberEmergencyAlarm(storage,1000);resetCurrentGame(storage,{removeItem(){}});assert.equal(emergencyAlarmPlayed(storage,1000),false,'Teacher reset clears the played-alarm record');
console.log('PASS: two-second replacement siren, unclipped audio, playback once, reload marker, gesture fallback, and cancellation on advance');
