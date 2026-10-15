import {gameStorage,onPlayStorage} from './play-mode.js?v=2026-10-15-web-18';
import {installTestTools} from './test-tools.js?v=2026-10-15-web-18';
import {hintFooter} from './hint-controls.js?v=2026-10-15-web-18';
import {readRoomProgress} from './room-catalog.js?v=2026-10-15-web-18';
import {watchFinalReveal} from './final-reveal.js?v=2026-10-15-web-18';
import {HUB_ORDER,newsDateBadge} from './news-dates.js?v=2026-10-15-web-18';
function render(){
  const rooms=readRoomProgress(gameStorage,()=>document.querySelector('#storage-warning').hidden=false);
  const complete=rooms.filter(room=>room.complete).length,solved=rooms.reduce((sum,room)=>sum+room.state.solved.length,0);
  document.querySelector('#room-app').innerHTML=`<main class="shell"><header class="top"><div class="brand">2026年からの脱出</div></header><div class="hub-heading"><div><h1>どのできごとを巡る？</h1></div><div class="hub-summary">${solved} / 24 問クリア<br>${complete} / 8 エリアクリア</div></div><div class="hub-grid">${HUB_ORDER.map(number=>rooms.find(room=>room.number===number)).map(room=>`<a class="hub-card ${room.complete?'complete':room.failed?'failed':''}" href="room${room.number}.html"><img src="${room.image}" alt="${room.title}">${newsDateBadge(room)}${room.complete?'<span class="clear-stamp">クリア！</span>':room.failed?'<span class="failed-stamp">残念！</span>':''}<div class="hub-card-copy"><h2>${room.title}</h2><p class="news-brief">${room.brief}</p><div class="hub-card-status"><span>${room.state.solved.length} / 3 問クリア</span></div></div></a>`).join('')}</div><footer class="hub-footer"><span class="hint-total">${hintFooter()}</span></footer></main>`;
}
onPlayStorage(render);render();watchFinalReveal();

installTestTools();
