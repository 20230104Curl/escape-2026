import {gameStorage,gameUrl,onPlayStorage,testPlay} from './play-mode.js?v=2026-10-16-web-11';
import {installTestTools} from './test-tools.js?v=2026-10-16-web-11';
import {ENDINGS} from './story-content.js?v=2026-10-16-web-11';
import {loadFinal,expireFinal,canRevealFinal,finalRevealAt,FINAL_KEY} from './story-flow.js?v=2026-10-16-web-11';
import {createEndingBell} from './ending-bell.js?v=2026-10-16-web-11';
const scenes=[
 {image:'ed-01-bell',alt:'雪の積もる鐘楼で108回目の鐘が鳴り、金色の光の波紋が広がる。'},
 {image:'ed-02-time-moves',alt:'再び灯りがともった町を、子どもたちと犬が見守る。止まっていた時間が動き出した。'},
 {image:'ed-03-new-year',alt:'あたたかく輝く門を、子どもたちと仲間が一緒にくぐり、新しい年へ進む。'}
];
for(const scene of scenes.slice(1)){const image=new Image();image.src=`assets/images/${scene.image}.png`;}
const previewResult=new URLSearchParams(location.search).get('preview'),preview=['success','rescued'].includes(previewResult);
const app=document.querySelector('#room-app');let state=preview?{submitted:true,result:previewResult,decidedAt:Date.now(),bellPlayed:true}:loadFinal(gameStorage),manual=0,animateBell=preview&&previewResult==='success',lastRender='',mediaReady=preview;
const firstIllustration=new Image();firstIllustration.src='assets/images/ed-01-bell.png';
const firstIllustrationReady=firstIllustration.decode().catch(()=>{});
const bell=createEndingBell({onChange:()=>{const button=app.querySelector('[data-ring-bell]');if(button)button.hidden=bell.status!=='blocked';}});
window.addEventListener('pagehide',()=>bell.dispose(),{once:true});
if(!preview&&expireFinal(state,Date.now()))save();
function ready(){return preview||canRevealFinal(state);}
function guard(){if(ready())return true;location.replace(gameUrl(state.submitted?'final-clues.html':'rooms.html'));return false;}
guard();
function save(){try{gameStorage.setItem(FINAL_KEY,JSON.stringify(state));}catch{document.querySelector('#storage-warning').hidden=false;}}
function currentFrame(){return preview||testPlay?manual:Math.min(2,Math.max(manual,Math.floor((Date.now()-finalRevealAt(state))/20000)));}
function render(){
 if(!ready()||!mediaReady)return;
 const index=currentFrame(),frame=ENDINGS[state.result][index],scene=state.result==='rescued'&&index===0?{image:'ed-02-time-moves',alt:'仲間に助けられ、再び灯りのともる町に戻ってきた。'}:scenes[index],key=`${state.result}/${index}/${state.bellPlayed}`;
 if(key===lastRender)return;lastRender=key;
 const ringing=animateBell&&index===0;animateBell=false;
 app.innerHTML=`<main class="shell ending-screen illustrated-ending"><figure class="ending-illustration ${ringing?'is-ringing':''}" role="img" aria-label="${scene.alt}"><img class="ending-backdrop" src="assets/images/${scene.image}.png" alt="" fetchpriority="high">${index===0&&state.result==='success'?'<div class="ending-bell-waves" aria-hidden="true"><i></i><i></i></div>':''}</figure><header class="top"><div class="brand">2026年からの脱出</div><span class="midnight-clock">2027年1月1日 00:00</span></header><section class="story-stage ending-stage"><div class="ending-copy"><h1>${frame.title}</h1><p class="story-body">${frame.body}</p>${index<2||preview?'<div class="story-actions">'+(preview&&index>0?'<button class="secondary" data-back>戻る</button>':'')+(index<2?'<button class="primary" data-next>つぎへ</button>':'')+'</div>':''}${index===2?'<p class="ending-complete"><span>2026年からの脱出は終了です。</span><span>まだプレイしていない生徒のために、</span><strong>ヒントや答えは言わないこと！</strong></p>':''}</div></section><footer class="story-footer"><button class="secondary ending-sound-button" data-ring-bell${bell.status==='blocked'?'':' hidden'}>108回目の鐘を鳴らす</button><small class="ending-sound-credit">効果音：<a href="https://otologic.jp/free/se/temple-bells01.html" target="_blank" rel="noopener noreferrer">OtoLogic</a>（<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>）</small></footer></main>`;
}
async function showEnding(){
 if(!guard())return;
 if(preview){render();return;}
 const show=async()=>{
  state=loadFinal(gameStorage);if(!guard())return;
  // Claim the first ending under the storage lock, including a blocked audio
  // attempt. Reloads and other tabs must never ring the same ending again.
  const first=!state.bellPlayed;animateBell=first&&state.result==='success';
  if(first){state.bellPlayed=true;save();}
  if(first&&state.result==='success'){
   await firstIllustrationReady;
   // Resolve when playback begins, not when the five-second sound ends.
   await bell.start(state,{first,ready:ready()});
  }
  mediaReady=true;render();
 };
 if(navigator.locks)await navigator.locks.request(gameStorage.scopeKey(FINAL_KEY+'.bell'),show);else show();
}
app.addEventListener('click',e=>{
 if(e.target.closest('[data-ring-bell]'))void bell.retry();
 if(e.target.closest('[data-next]')){manual=Math.min(2,currentFrame()+1);render();}
 if(preview&&e.target.closest('[data-back]')){manual=Math.max(0,manual-1);animateBell=manual===0&&state.result==='success';render();}
});
onPlayStorage(()=>{if(preview)return;state=loadFinal(gameStorage);if(guard())render();});
showEnding();setInterval(render,1000);

installTestTools();
