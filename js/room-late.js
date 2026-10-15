import {mountRoom} from './room-game.js?v=2026-10-15-web-9';
import {LATE_ROOMS,LATE_QUESTIONS,makeLateState,restoreLateState} from './room-late-data.js?v=2026-10-15-web-9';
import {LATE_VISUALS} from './late-puzzles-art.js?v=2026-10-15-web-9';
import {flowerMarks} from './flower-search-data.js?v=2026-10-15-web-9';
const number=Number(document.body.dataset.room);
mountRoom({room:LATE_ROOMS.find(room=>room.number===number),questions:LATE_QUESTIONS[number],makeEmptyState:makeLateState,restoreState:raw=>restoreLateState(raw,number),renderVisual:(index,state)=>LATE_VISUALS[number][index](state),onAction:(button,state)=>{
 if(number!==6||button.dataset.flowerCell===undefined)return false;
 const cell=Number(button.dataset.flowerCell);if(!Number.isInteger(cell)||cell<0||cell>=25)return false;
 const marks=flowerMarks(state.flowerMarks);state.flowerMarks=marks.includes(cell)?marks.filter(i=>i!==cell):[...marks,cell];return true;
}});
