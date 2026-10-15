export function sealedFragment(){return `<div class="sealed-fragment" role="img" aria-label="最後に開く、封印されたかけら"><svg viewBox="0 0 100 110" aria-hidden="true"><rect x="16" y="9" width="68" height="91" rx="8" fill="#fff4cf" stroke="#c6a46a" stroke-width="3"/><path d="M20 23 80 84M80 23 20 84" stroke="#d9bd85" stroke-width="4"/><circle cx="50" cy="55" r="22" fill="#ce7774" stroke="#b55e60" stroke-width="3"/><path d="M41 52v-6a9 9 0 0 1 18 0v6" fill="none" stroke="#fff0d1" stroke-width="4"/><rect x="37" y="51" width="26" height="20" rx="4" fill="#fff0d1"/><circle cx="50" cy="60" r="3" fill="#b55e60"/></svg></div>`;}

export function renderRoomReward({complete,missed=false,chest}){
  return `<aside class="reward-box">${complete?sealedFragment():chest(false)}<h2>${complete?'この記憶はクリア！':missed?'小箱は開かなかった':'まだ開かない小箱'}</h2><p>${complete?'かけらは封印したまま<br>保管しました。<br>最後のナゾで開きます。':missed?'一度きりのナゾは解けなかった。<br>ほかのナゾにも挑戦しよう。':'3つのナゾを解いて、<br>文字のかけらを手に入れよう。'}</p>${complete?'<button class="primary" data-action="reward">クリアの記録を見る</button><a class="secondary reward-hub-link" href="rooms.html">できごと一覧に戻る</a>':''}</aside>`;
}

export function renderSealedReward({title,chest,afterword=''}){
  return `<section class="reward-screen"><p class="eyebrow">${title} クリア</p>${chest(true)}<h1>文字のかけらを保管した！</h1>${sealedFragment()}<p>かけらは、封印したまま保管した。<br>中の文字が読めるのは、<br>最後のナゾが始まってから。</p><button class="primary" data-action="room">エリアに戻る</button></section>`;
}
