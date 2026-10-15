import {gameStorage,gameUrl,onPlayStorage,testPlay} from './play-mode.js?v=2026-10-15-web-23';
import {installTestTools} from './test-tools.js?v=2026-10-15-web-23';
import {ENDINGS} from './story-content.js?v=2026-10-15-web-23';
import {loadFinal,expireFinal,canRevealFinal,finalRevealAt,FINAL_KEY} from './story-flow.js?v=2026-10-15-web-23';
const scenes=[
 {image:'ed-01-bell',alt:'雪の積もる鐘楼で108回目の鐘が鳴り、金色の光の波紋が広がる。'},
 {image:'ed-02-time-moves',alt:'再び灯りがともった町を、子どもたちと犬が見守る。止まっていた時間が動き出した。'},
 {image:'ed-03-new-year',alt:'あたたかく輝く門を、子どもたちと仲間が一緒にくぐり、新しい年へ進む。'}
];
for(const scene of scenes.slice(1)){const image=new Image();image.src=`assets/images/${scene.image}.png`;}
const previewResult=new URLSearchParams(location.search).get('preview'),preview=['success','rescued'].includes(previewResult);
const app=document.querySelector('#room-app');let state=preview?{submitted:true,result:previewResult,decidedAt:Date.now(),bellPlayed:true}:loadFinal(gameStorage),manual=0,animateBell=preview,lastRender='';
if(!preview&&expireFinal(state,Date.now()))save();
function ready(){return preview||canRevealFinal(state);}
function guard(){if(ready())return true;location.replace(gameUrl(state.submitted?'final-clues.html':'rooms.html'));return false;}
guard();
function save(){try{gameStorage.setItem(FINAL_KEY,JSON.stringify(state));}catch{document.querySelector('#storage-warning').hidden=false;}}
function currentFrame(){return preview||testPlay?manual:Math.min(2,Math.max(manual,Math.floor((Date.now()-finalRevealAt(state))/20000)));}
function render(){
 if(!ready())return;
 const index=currentFrame(),frame=ENDINGS[state.result][index],scene=scenes[index],key=`${state.result}/${index}/${state.bellPlayed}`;
 if(key===lastRender)return;lastRender=key;
 const ringing=animateBell&&index===0;animateBell=false;
 app.innerHTML=`<main class="shell ending-screen illustrated-ending"><figure class="ending-illustration ${ringing?'is-ringing':''}" role="img" aria-label="${scene.alt}"><img class="ending-backdrop" src="assets/images/${scene.image}.png" alt="" fetchpriority="high">${index===0?'<div class="ending-bell-waves" aria-hidden="true"><i></i><i></i></div>':''}</figure><header class="top"><div class="brand">2026年からの脱出</div><span class="midnight-clock">2027年1月1日 00:00</span></header><section class="story-stage ending-stage"><div class="ending-copy"><h1>${frame.title}</h1><p class="story-body">${frame.body}</p>${index<2||preview?'<div class="story-actions">'+(preview&&index>0?'<button class="secondary" data-back>戻る</button>':'')+(index<2?'<button class="primary" data-next>つぎへ</button>':'')+'</div>':''}${index===2?'<p class="ending-complete"><span>2026年からの脱出は終了です。</span><span>まだプレイしていない生徒のために、</span><strong>ヒントや答えは言わないこと！</strong></p>':''}</div></section><div class="story-footer" aria-hidden="true"></div></main>`;
}
async function showEnding(){
 if(!guard())return;
 if(preview){render();return;}
 const show=()=>{
  state=loadFinal(gameStorage);if(!guard())return;
  // This saved field marks the first visual bell and preserves existing records.
  animateBell=!state.bellPlayed;if(animateBell){state.bellPlayed=true;save();}render();
 };
 if(navigator.locks)await navigator.locks.request(gameStorage.scopeKey(FINAL_KEY+'.bell'),show);else show();
}
app.addEventListener('click',e=>{
 if(e.target.closest('[data-next]')){manual=Math.min(2,currentFrame()+1);render();}
 if(preview&&e.target.closest('[data-back]')){manual=Math.max(0,manual-1);animateBell=manual===0;render();}
});
onPlayStorage(()=>{if(preview)return;state=loadFinal(gameStorage);if(guard())render();});
showEnding();setInterval(render,1000);

installTestTools();
