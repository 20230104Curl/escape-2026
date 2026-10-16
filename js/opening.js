import {gameStorage,gameUrl,onPlayStorage,testPlay} from './play-mode.js?v=2026-10-16-web-04';
import {installTestTools} from './test-tools.js?v=2026-10-16-web-04';
import {setupScreen} from './setup-screen.js?v=2026-10-16-web-04';
import {loadSettings,saveSettings} from './play-settings.js?v=2026-10-16-web-04';
import {OPENING} from './story-content.js?v=2026-10-16-web-04';
import {classTimes,loadFinal,canRevealFinal,startExploration,EXPLORATION_KEY} from './story-flow.js?v=2026-10-16-web-04';
const scenes=[
 {image:'op-01-bell',alt:'雪の積もる大晦日の境内。あたたかな灯りに照らされた除夜の鐘。'},
 {image:'op-02-time',alt:'鐘のまわりで青と金の光が渦を巻き、雪の粒まで止まった世界。'},
 {image:'op-03-memories-v2',alt:'2026年の8つのできごとが、光に包まれた記憶の窓として浮かぶ。'},
 {image:'op-04-doorway',alt:'開いた門から金色の道が続く、2026年の記憶への入口。'}
];
// Load the following scenes during reading, without adding a reading-time lock.
for(const scene of scenes.slice(1)){const image=new Image();image.src=`assets/images/${scene.image}.png`;}
const app=document.querySelector('#room-app'),previewKind=new URLSearchParams(location.search).get('preview'),preview=['1','setup'].includes(previewKind),savedSettings=loadSettings(gameStorage);
let frame=0,starting=false,navigating=false,savingSettings=false,setupVisible=previewKind==='setup'||(!preview&&!savedSettings),selectedGrade=previewKind==='setup'?null:savedSettings?.grade??null,selectedPlayers=previewKind==='setup'?null:savedSettings?.players??null;
function go(path){if(navigating)return;navigating=true;location.replace(gameUrl(path));}
function render(){if(setupVisible){app.innerHTML=setupScreen(selectedGrade,selectedPlayers,preview);return;}const page=OPENING[frame],times=classTimes(),waiting=Number.isFinite(times.explorationAt)&&Date.now()<times.explorationAt;
 const scene=scenes[frame];
 app.innerHTML=`<main class="shell opening-shell"><img class="opening-backdrop" src="assets/images/${scene.image}.png" alt="${scene.alt}" fetchpriority="high">${frame===0?'<div class="opening-bell-waves" aria-hidden="true"><i></i><i></i></div>':''}<header class="top"><div class="brand">2026年からの脱出</div></header><section class="story-stage" aria-labelledby="opening-title"><div class="opening-copy"><h1 id="opening-title">${page.title}</h1><p class="story-body">${page.body}</p><div class="opening-navigation"><div class="story-steps" aria-label="物語 ${frame+1} / ${OPENING.length}">${OPENING.map((_,i)=>`<i class="${i===frame?'on':''}"></i>`).join('')}</div><div class="story-actions">${frame?'<button class="secondary" data-back>戻る</button>':!preview||previewKind==='setup'?'<button class="secondary" data-settings>設定に戻る</button>':''}${frame<OPENING.length-1?'<button class="primary" data-next>つぎへ</button>':preview?'<a class="primary" href="rooms.html">ゲームに戻る</a>':waiting?'<button class="primary" disabled>先生の合図を待とう</button>':`<button class="primary" data-start ${starting?'disabled':''}>${starting?'開始しています…':(testPlay?'探索を開始':'探索を開始（25分）')}</button>`}</div></div></div></section><div class="story-footer" aria-hidden="true"></div></main>`;
}
app.addEventListener('click',async e=>{
 const gradeButton=e.target.closest('[data-grade]'),playersButton=e.target.closest('[data-players]');
 if(setupVisible&&gradeButton){selectedGrade=Number(gradeButton.dataset.grade);render();return;}
 if(setupVisible&&playersButton){selectedPlayers=Number(playersButton.dataset.players);render();return;}
 if(setupVisible&&e.target.closest('[data-setup-confirm]')){
  if(savingSettings)return;savingSettings=true;
  try{if(!preview){const save=()=>saveSettings(gameStorage,selectedGrade,selectedPlayers);if(navigator.locks)await navigator.locks.request(gameStorage.scopeKey(EXPLORATION_KEY),save);else save();}setupVisible=false;frame=0;render();check();}
  catch{document.querySelector('#storage-warning').hidden=false;}finally{savingSettings=false;}return;
 }
 if(e.target.closest('[data-settings]')){setupVisible=true;render();return;}
 if(!preview&&e.target.closest('[data-start]')){
  if(starting)return;starting=true;render();
  try{
   const begin=()=>{if(!loadSettings(gameStorage)){starting=false;setupVisible=true;render();return;}const final=loadFinal(gameStorage);if(final.submitted){go(canRevealFinal(final)?'ending.html':'final-clues.html');return;}startExploration(gameStorage);go('rooms.html');};
   if(navigator.locks)await navigator.locks.request(gameStorage.scopeKey(EXPLORATION_KEY),begin);else begin();
  }catch{starting=false;document.querySelector('#storage-warning').hidden=false;render();}
  return;
 }
 if(e.target.closest('[data-next]'))frame++;if(e.target.closest('[data-back]'))frame--;
 render();
});
function check(){if(preview||navigating)return;const state=loadFinal(gameStorage),times=classTimes(),now=Date.now(),settings=loadSettings(gameStorage);if(state.submitted)go(canRevealFinal(state,now,times)?'ending.html':'final-clues.html');else if(Number.isFinite(times.finalAt)&&now>=times.finalAt)go('final-clues.html');else if(!settings){if(!setupVisible){setupVisible=true;render();}}else if(Number.isFinite(times.explorationAt)&&now>=times.explorationAt)go('rooms.html');}
render();check();setInterval(check,500);onPlayStorage(check);window.addEventListener('pageshow',check);document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});

installTestTools();
