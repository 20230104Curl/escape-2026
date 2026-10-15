import {mountRoom} from './room-game.js';
import {LATE_ROOMS,LATE_QUESTIONS,makeLateState,restoreLateState} from './room-late-data.js';
import {LATE_VISUALS} from './late-puzzles-art.js';
const number=Number(document.body.dataset.room);
mountRoom({room:LATE_ROOMS.find(room=>room.number===number),questions:LATE_QUESTIONS[number],makeEmptyState:makeLateState,restoreState:raw=>restoreLateState(raw,number),renderVisual:index=>LATE_VISUALS[number][index](),onAction:()=>false});
