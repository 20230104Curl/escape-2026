import {toKatakana} from './story-flow.js?v=2026-10-16-web-01';

export function renderFinalFragments(letters,{animate=false}={}){
 return `<h1 class="found-count">あなたは<strong>${letters.length}個</strong>の文字を見つけました！</h1><div class="final-fragments ${animate?'is-revealing':''}" aria-label="集めた文字と足りない文字の8つの枠">${Array.from({length:8},(_,index)=>{
  const letter=letters[index];
  return `<span class="fragment-frame ${letter?'is-found':'is-missing'}" aria-label="${letter?`集めた文字 ${toKatakana(letter)}`:'足りない文字'}">${letter?`<span class="fragment-letter" style="--fragment-delay:${350+index*220}ms">${toKatakana(letter)}</span>`:'<span aria-hidden="true">？</span>'}</span>`;
 }).join('')}</div><p class="final-instruction">集めた文字を並べ替えよう。<br><strong>足りない文字は自分で考えて、<br>ある有名な言葉をつくってください。</strong></p>`;
}
