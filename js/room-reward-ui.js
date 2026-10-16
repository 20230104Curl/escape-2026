import {toKatakana} from './story-flow.js?v=2026-10-16-web-19';
import {gameUrl} from './play-mode.js?v=2026-10-16-web-19';

export function letterTile(letter){const value=toKatakana(letter);return `<span class="collected-letter" aria-label="集めた文字 ${value}">${value}</span>`;}
export function renderCollectedLetters(rooms){
 const count=rooms.filter(room=>room.complete).length;
 return `<div class="hub-fragments" role="group" aria-label="集めた文字 ${count}個、全8個"><span>集めた文字 <strong>${count} / 8</strong></span>${rooms.map(room=>`<span class="hub-fragment ${room.complete?'is-found':'is-missing'}" aria-label="${room.complete?'集めた文字 '+toKatakana(room.reward):'まだ集めていない文字'}">${room.complete?toKatakana(room.reward):'？'}</span>`).join('')}</div>`;
}
export function renderRoomReward({complete,missed=false,chest,letter}){
 return `<aside class="reward-box">${complete?letterTile(letter):chest(false)}<h2>${complete?'文字を手に入れた！':missed?'小箱は開かなかった':'このエリアで文字を集めよう'}</h2><p>${complete?'集めた文字は<br>最後のパスワードに使います。':missed?'一度きりのナゾは解けなかった。<br>ほかのエリアで文字を集めよう。':'3つのナゾを解くと、<br>文字を1つ手に入れられます。'}</p>${complete?`<button class="primary" data-action="reward">集めた文字を見る</button><a class="secondary reward-hub-link" href="${gameUrl('rooms.html')}">できごと一覧に戻る</a>`:''}</aside>`;
}
export function renderCollectedReward({title,chest,letter}){
 return `<section class="reward-screen"><p class="eyebrow">${title} クリア</p>${chest(true)}<h1>文字「${toKatakana(letter)}」を手に入れた！</h1>${letterTile(letter)}<p>この文字は、最後のパスワードの手がかりです。<br>できごと一覧でも、集めた文字を確かめられます。<br>ほかのエリアでも、文字を集めよう。</p><button class="primary" data-action="room">エリアに戻る</button></section>`;
}
