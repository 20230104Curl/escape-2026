import {palindromeVisual,timesVisual} from './puzzle-renewal-art.js';
import {prefecturePoem} from './replacement-puzzles-art.js';
import {mountRoom} from './room-game.js';
import {ROOM,QUESTIONS,makeEmptyState,restoreState} from './room3-data.js';
mountRoom({room:ROOM,questions:QUESTIONS,makeEmptyState,restoreState,renderVisual:index=>[prefecturePoem,palindromeVisual,timesVisual][index](),onAction:()=>false});
