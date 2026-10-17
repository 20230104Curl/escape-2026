import {answerKeys} from './room1-data.js?v=2026-10-17-web-1';

const PASSWORD='だっしゅつ';
export const ENTRY_PASSWORD_LENGTH=PASSWORD.length;
export const entryPasswordCorrect=value=>value===PASSWORD;
export const entryPasswordKeys=value=>answerKeys(PASSWORD,value.length);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function entryPasswordScreen(value,keys,feedback=''){
 return `<main class="shell opening-shell entry-shell"><img class="opening-backdrop" src="assets/images/op-01-bell.png" alt="雪の積もる境内と、あたたかな灯りに包まれた除夜の鐘。"><header class="top"><div class="brand">2026年からの脱出</div></header><section class="story-stage entry-stage" aria-labelledby="entry-title"><div class="entry-copy"><p class="eyebrow">ゲームの入口</p><h1 id="entry-title">パスワードを入力しよう</h1><p>右の文字をタップして、<br><strong>5文字のパスワード</strong>を入力してください。</p><div class="slots entry-slots" role="status" aria-live="polite" aria-label="入力した文字 ${esc(value||'まだありません')}">${Array.from({length:ENTRY_PASSWORD_LENGTH},(_,i)=>`<span class="slot ${value.length===i?'current':''}">${esc(value[i]||'')}</span>`).join('')}</div><p class="entry-tip">ゲームでも、同じ文字入力を使います。<br>入力を間違えたら、消して直せます。</p></div><aside class="answer-panel entry-controls" aria-label="パスワードの文字入力"><h2>文字を選ぼう</h2><div class="keypad">${keys.length?keys.map(key=>`<button data-entry-key="${esc(key)}" aria-label="${esc(key)}">${esc(key)}</button>`).join(''):'<p class="entry-complete">5文字入りました。<br>「これで決定」を押そう。</p>'}</div><div class="edit-buttons"><button data-entry-action="backspace" ${!value?'disabled':''}>⌫ 1文字消す</button><button data-entry-action="clear" ${!value?'disabled':''}>全部消す</button></div><button class="primary" data-entry-action="submit" ${value.length!==ENTRY_PASSWORD_LENGTH?'disabled':''}>これで決定</button><p class="entry-feedback" role="status" aria-live="polite">${esc(feedback)}</p></aside></section><div class="story-footer" aria-hidden="true"></div></main>`;
}
