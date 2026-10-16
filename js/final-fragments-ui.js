import {toKatakana,FINAL_INPUT} from './story-flow.js?v=2026-10-16-web-17';

export function renderFinalFragments(letters,{animate=false,placed=false,remaining=FINAL_INPUT.length}={}){
 const needsPlacement=letters.length>0&&!placed;
 const instruction=needsPlacement?'<strong>さなる生が大切にすべき言葉をつくってください。</strong>':remaining===0?'すべての文字が入りました。<br><strong>答えを確かめて「これで決定」を押してください。</strong>':`${placed?`残り${remaining}文字を自分で考えて入力し、`:'空欄の文字を、自分で考えて入力し、'}<br><strong>さなる生が大切にすべき言葉をつくってください。</strong>`;
 return `<h1 class="found-count">あなたは<strong>${letters.length}個</strong>の文字を見つけました！</h1><p class="final-instruction">${instruction}</p><div class="final-fragments ${animate?'is-revealing':''}" aria-label="集めた文字と足りない文字の8つの枠">${Array.from({length:8},(_,index)=>{
  const letter=letters[index];
  return `<span class="fragment-frame ${letter?'is-found':'is-missing'}" aria-label="${letter?`集めた文字 ${toKatakana(letter)}`:'足りない文字'}">${letter?`<span class="fragment-letter" style="--fragment-delay:${350+index*220}ms">${toKatakana(letter)}</span>`:'<span aria-hidden="true">？</span>'}</span>`;
 }).join('')}</div>${letters.length?`<button class="place-fragments ${needsPlacement?'is-priority':''}" data-action="place-fragments" aria-label="${placed?'文字を入れました':'文字を入れる'}" ${placed?'disabled':''}>${placed?'文字を入れました ✓':'<span><small>ここを押そう</small><strong>文字を入れる</strong></span><span class="place-arrow" aria-hidden="true">↓</span>'}</button>`:''}`;
}
