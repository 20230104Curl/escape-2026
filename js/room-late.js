import {mountRoom} from './room-game.js?v=2026-10-15-web-4';
import {LATE_ROOMS,LATE_QUESTIONS,makeLateState,restoreLateState} from './room-late-data.js?v=2026-10-15-web-4';
import {LATE_VISUALS} from './late-puzzles-art.js?v=2026-10-15-web-4';
const number=Number(document.body.dataset.room);
mountRoom({room:LATE_ROOMS.find(room=>room.number===number),questions:LATE_QUESTIONS[number],makeEmptyState:makeLateState,restoreState:raw=>restoreLateState(raw,number),renderVisual:index=>LATE_VISUALS[number][index](),onAction:()=>false});
