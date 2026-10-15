import {mountRoom} from './room-game.js?v=2026-10-15-web-14';
import {ROOM,QUESTIONS,KANA_ROWS,makeEmptyState,restoreState} from './room2-data.js?v=2026-10-15-web-14';
import {rebusVisual,kanjiVisual,hiddenKanaVisual} from './puzzle-renewal-art.js?v=2026-10-15-web-14';
function renderHintExtra(question,index){if(question!==2||index!==1)return '';return `<div class="kana-shelf hint-kana-table" role="table" aria-label="五十音表">${KANA_ROWS.map(row=>`<div role="row">${row.map(letter=>`<span role="cell">${letter}</span>`).join('')}</div>`).join('')}</div>`;}
mountRoom({room:ROOM,questions:QUESTIONS,makeEmptyState,restoreState,renderVisual:index=>[rebusVisual,kanjiVisual,hiddenKanaVisual][index](),onAction:()=>false,renderHintExtra});
