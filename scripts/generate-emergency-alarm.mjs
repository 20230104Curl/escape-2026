import {writeFile,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const source=process.argv[2];
if(!source)throw Error('Pass the supplied Warning-Siren04-05(High-Mid).mp3 file path. Requires FFmpeg.');
const rate=22050,seconds=3;
// Use the full supplied siren, padding its short tail to exactly three seconds.
const pcm=execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i',source,'-t',String(seconds),'-af','apad,afade=t=out:st=2.96:d=0.04','-ar',String(rate),'-ac','1','-f','s16le','pipe:1'],{maxBuffer:4*1024*1024,stdio:['ignore','pipe','pipe']});
if(pcm.length!==rate*seconds*2)throw Error('Expected exactly three seconds of converted audio.');
const wav=Buffer.alloc(44+pcm.length);
wav.write('RIFF',0);wav.writeUInt32LE(wav.length-8,4);wav.write('WAVE',8);wav.write('fmt ',12);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(pcm.length,40);pcm.copy(wav,44);
await writeFile(new URL('../assets/audio/emergency-alarm.wav',import.meta.url),wav);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
console.log(JSON.stringify({sourceSha256:sha(await readFile(source)),outputSha256:sha(wav),seconds,sampleRate:rate,channels:1,fadeOutSeconds:0.04}));
