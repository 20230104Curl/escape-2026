import {palindromeVisual,timesVisual} from './puzzle-renewal-art.js?v=2026-10-15-web-19';
import {prefecturePoem} from './replacement-puzzles-art.js?v=2026-10-15-web-19';
import {mountRoom} from './room-game.js?v=2026-10-15-web-19';
import {ROOM,QUESTIONS,makeEmptyState,restoreState} from './room3-data.js?v=2026-10-15-web-19';
mountRoom({room:ROOM,questions:QUESTIONS,makeEmptyState,restoreState,renderVisual:index=>[prefecturePoem,palindromeVisual,timesVisual][index](),onAction:()=>false});
