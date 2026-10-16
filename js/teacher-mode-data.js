import {EMERGENCY_ALARM_KEY} from './emergency-alarm.js?v=2026-10-16-web-14';
import {FINAL_KEY,EXPLORATION_KEY,FINAL_STAGE_START_KEY} from './story-flow.js?v=2026-10-16-web-14';
import {SETTINGS_KEY,HINTS_KEY} from './play-settings.js?v=2026-10-16-web-14';
import {TEST_FINAL_KEY} from './play-mode.js?v=2026-10-16-web-14';
import {YEAR_ORDER_KEY} from './year-order-data.js?v=2026-10-16-web-14';
import {FIRST_GUIDE_KEY} from './first-area-guide.js?v=2026-10-16-web-14';
import {FAILURE_NOTICE_KEY} from './ending-notice.js?v=2026-10-16-web-14';

export function teacherTapSequence(maxGap=1500){
 let count=0,last=null;
 return {reset(){count=0;last=null;},tap(now){
  if(!Number.isFinite(now)){this.reset();return false;}
  count=last!==null&&now>=last&&now-last<=maxGap?count+1:1;last=now;
  if(count<5)return false;this.reset();return true;
 }};
}
export function resetCurrentGame(storage,session){
 for(let n=1;n<=8;n++)storage.removeItem(`escape2026.room${n}.v1`);
 for(const key of [FINAL_KEY,EXPLORATION_KEY,FINAL_STAGE_START_KEY,SETTINGS_KEY,HINTS_KEY,TEST_FINAL_KEY,YEAR_ORDER_KEY,EMERGENCY_ALARM_KEY,FIRST_GUIDE_KEY,FAILURE_NOTICE_KEY])storage.removeItem(key);
 session.removeItem('escape2026.transfer.seen');
}
