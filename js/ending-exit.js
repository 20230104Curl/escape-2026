export function renderEndingActions(index,preview=false){
 if(index===2)return '<div class="story-actions"><button class="primary" data-finish>終わる</button></div>';
 return `<div class="story-actions">${preview&&index>0?'<button class="secondary" data-back>戻る</button>':''}<button class="primary" data-next>つぎへ</button></div>`;
}
export function renderGameClosed(){return '<main class="game-closed" tabindex="-1" role="status"><h1>終了しました</h1><p>このタブを閉じてください。</p></main>';}
export function createGameExit({stop,clearScreen,closeWindow}){
 let finished=false;
 return {
  get finished(){return finished;},
  finish(){
   if(finished)return;finished=true;
   stop();clearScreen();
   // Browser-opened tabs may reject close(); the cleared page remains finished.
   try{closeWindow();}catch{}
  }
 };
}
