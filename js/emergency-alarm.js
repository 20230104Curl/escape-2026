export const EMERGENCY_ALARM_KEY='escape2026.emergencyAlarm.v1';
export const EMERGENCY_ALARM_URL=new URL('../assets/audio/emergency-alarm.wav?v=2026-10-16-web-08',import.meta.url).href;
let preloaded=null;
export function preloadEmergencyAlarm(){
 if(!preloaded){preloaded=new Audio(EMERGENCY_ALARM_URL);preloaded.hidden=true;preloaded.preload='auto';preloaded.dataset.emergencyAlarm='';document.body.append(preloaded);preloaded.load();}
 return preloaded;
}
export function emergencyAlarmPlayed(storage,finalAt){try{const saved=JSON.parse(storage.getItem(EMERGENCY_ALARM_KEY));return saved?.version===1&&saved.finalAt===finalAt;}catch{return false;}}
export function rememberEmergencyAlarm(storage,finalAt){try{storage.setItem(EMERGENCY_ALARM_KEY,JSON.stringify({version:1,finalAt}));}catch{}}
export function createEmergencyAlarm({makeAudio=preloadEmergencyAlarm,onChange=()=>{}}={}){
 let audio=null,status='idle',stopped=false;
 const change=value=>{status=value;onChange(value);};
 async function play(){
  change('starting');
  try{
   if(!audio){audio=makeAudio();audio.loop=false;audio.volume=.55;audio.addEventListener('ended',()=>{if(!stopped)change('finished');},{once:true});}
   await audio.play();
   if(stopped){audio.pause();return false;}
   change('playing');return true;
  }catch(error){if(!stopped)change(error.name==='NotAllowedError'?'blocked':'unavailable');return false;}
 }
 return {
  get status(){return status;},
  start(){return !stopped&&status==='idle'?play():Promise.resolve(false);},
  retry(){return !stopped&&status==='blocked'?play():Promise.resolve(false);},
  stop(){stopped=true;audio?.pause();change('stopped');}
 };
}
