import {gameStorage,onPlayStorage} from './play-mode.js?v=2026-10-16-web-15';
import {installTestTools} from './test-tools.js?v=2026-10-16-web-15';
import {hintFooter} from './hint-controls.js?v=2026-10-16-web-15';
import {readRoomProgress} from './room-catalog.js?v=2026-10-16-web-15';
import {watchFinalReveal,refreshExplorationClock} from './final-reveal.js?v=2026-10-16-web-15';
import {HUB_ORDER,newsDateBadge} from './news-dates.js?v=2026-10-16-web-15';
import {renderCollectedLetters} from './room-reward-ui.js?v=2026-10-16-web-15';
import {prepareFirstGuide,advanceFirstGuide} from './first-area-guide.js?v=2026-10-16-web-15';
function render(){
  const rooms=readRoomProgress(gameStorage,()=>document.querySelector('#storage-warning').hidden=false);
  const guide=prepareFirstGuide(gameStorage,rooms,HUB_ORDER[0]),showGuide=guide.step==='area';
  const complete=rooms.filter(room=>room.complete).length,solved=rooms.reduce((sum,room)=>sum+room.state.solved.length,0);
  document.querySelector('#room-app').innerHTML=`<main class="shell"><header class="top"><div class="brand">2026年からの脱出</div></header><div class="hub-heading"><div><h1>どのできごとを巡る？</h1><p>3つのナゾを解いて、文字を1つずつ集めよう。</p></div><div class="hub-summary">${solved} / 24 問クリア<br>文字 ${complete} / 8 個</div></div>${showGuide?'<p class="first-play-guide hub-first-guide" role="status"><span aria-hidden="true">①</span><strong>まずは、ここを押してナゾに挑戦！</strong></p>':''}<div class="hub-grid">${HUB_ORDER.map(number=>rooms.find(room=>room.number===number)).map(room=>`<a data-area="${room.number}" class="hub-card ${showGuide&&room.number===guide.room?'is-guide-target':''} ${room.complete?'complete':room.failed?'failed':''}" href="room${room.number}.html">${showGuide&&room.number===guide.room?'<span class="first-area-label">ここをタップ ↓</span>':''}<img src="${room.image}" alt="${room.title}">${newsDateBadge(room)}${room.complete?'<span class="clear-stamp">クリア！</span>':room.failed?'<span class="failed-stamp">残念！</span>':''}<div class="hub-card-copy"><h2>${room.title}</h2><p class="news-brief">${room.brief}</p><div class="hub-card-status"><span>${room.state.solved.length} / 3 問クリア</span></div></div></a>`).join('')}</div><footer class="hub-footer">${renderCollectedLetters(rooms)}<span class="hint-total">${hintFooter()}</span></footer></main>`;
}
document.querySelector('#room-app').addEventListener('click',event=>{const card=event.target.closest('[data-area]');if(card)advanceFirstGuide(gameStorage,Number(card.dataset.area),'start');});
onPlayStorage(()=>{render();refreshExplorationClock();});render();watchFinalReveal();

installTestTools();
