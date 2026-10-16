import {writeFile} from 'node:fs/promises';
const rate=22050,seconds=2,samples=rate*seconds,wav=Buffer.alloc(44+samples*2);
wav.write('RIFF',0);wav.writeUInt32LE(wav.length-8,4);wav.write('WAVE',8);wav.write('fmt ',12);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples*2,40);
// Eight short, soft-edged alternating tones. No recorded samples are used.
for(let index=0;index<samples;index++){
 const time=index/rate,beat=Math.floor(time/.25),local=time-beat*.25,frequency=beat%2===0?880:660;
 const envelope=local<.21?Math.max(0,Math.min(1,local/.008,(.21-local)/.02)):0;
 const phase=2*Math.PI*frequency*time,sample=.38*envelope*(Math.sin(phase)+.12*Math.sin(phase*3));
 wav.writeInt16LE(Math.round(sample*32767),44+index*2);
}
await writeFile(new URL('../assets/audio/emergency-alarm.wav',import.meta.url),wav);
console.log('Generated a two-second original game alarm (22050 Hz, mono PCM WAV).');
