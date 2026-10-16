export const BELL_AUDIO_URL=new URL('../assets/audio/joya-bell.mp3?v=2026-10-16-web-14',import.meta.url).href;
export function preloadEndingBell(){const audio=new Audio(BELL_AUDIO_URL);audio.hidden=true;audio.preload='auto';document.body.append(audio);audio.load();return audio;}
export const BELL_SECONDS=5;
export const BELL_FADE_AT=3.5;
export const BELL_VOLUME=0.6;
export const shouldRingEnding=(state,first,ready)=>ready&&first&&state.submitted===true&&state.result==='success';

// Keep the short bell independent of story navigation. Only a blocked first
// attempt can be retried by a gesture; a played bell cannot be repeated.
export function createEndingBell({makeAudio=preloadEndingBell,onChange=()=>{},schedule=setInterval,cancel=clearInterval}={}){
 let audio=null,timer=null,status='idle';
 const change=value=>{status=value;onChange(value);};
 const clear=()=>{if(timer!==null){cancel(timer);timer=null;}};
 const finish=()=>{clear();audio?.pause();change('finished');};
 const update=()=>{
  const seconds=audio.currentTime;
  if(seconds>=BELL_SECONDS){finish();return;}
  audio.volume=BELL_VOLUME*Math.max(0,Math.min(1,(BELL_SECONDS-seconds)/(BELL_SECONDS-BELL_FADE_AT)));
 };
 async function play(){
  change('starting');
  try{
   if(!audio){audio=makeAudio();audio.preload='auto';audio.loop=false;audio.volume=BELL_VOLUME;audio.addEventListener('ended',finish,{once:true});audio.addEventListener('timeupdate',update);}
   await audio.play();
   change('playing');timer=schedule(update,100);update();return true;
  }catch(error){clear();change(error.name==='NotAllowedError'?'blocked':'unavailable');return false;}
 }
 return {
  get status(){return status;},
  start(state,{first=false,ready=false}={}){return status==='idle'&&shouldRingEnding(state,first,ready)?play():Promise.resolve(false);},
  retry(){return status==='blocked'?play():Promise.resolve(false);},
  dispose(){clear();audio?.pause();}
 };
}
