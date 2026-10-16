import {toKatakana,FINAL_INPUT} from './story-flow.js?v=2026-10-16-web-08';

export function renderFinalFragments(letters,{animate=false,placed=false,remaining=FINAL_INPUT.length}={}){
 const needsPlacement=letters.length>0&&!placed;
 const instruction=needsPlacement?'まず、赤い「文字をあてはめる」を押そう。<br><strong>そのあと、残りの空欄に入力して、<br>ある有名な言葉をつくってください。</strong>':remaining===0?'すべての文字が入りました。<br><strong>答えを確かめて「これで決定」を押してください。</strong>':`${letters.length?(placed?'見つけた文字を下の欄にあてはめました。':'ボタンを押すと、見つけた文字が下の欄に入ります。'):'空欄の文字を、自分で考えよう。'}<br><strong>${placed?`残り${remaining}文字を自分で考えて入力し、`:'残りの空欄にすべての文字を入力して、'}<br>ある有名な言葉をつくってください。</strong>`;
 return `<h1 class="found-count">あなたは<strong>${letters.length}個</strong>の文字を見つけました！</h1><div class="final-fragments ${animate?'is-revealing':''}" aria-label="集めた文字と足りない文字の8つの枠">${Array.from({length:8},(_,index)=>{
  const letter=letters[index];
  return `<span class="fragment-frame ${letter?'is-found':'is-missing'}" aria-label="${letter?`集めた文字 ${toKatakana(letter)}`:'足りない文字'}">${letter?`<span class="fragment-letter" style="--fragment-delay:${350+index*220}ms">${toKatakana(letter)}</span>`:'<span aria-hidden="true">？</span>'}</span>`;
 }).join('')}</div><button class="place-fragments ${needsPlacement?'is-priority':''}" data-action="place-fragments" ${!letters.length||placed?'disabled':''}>${placed?'文字をあてはめました':'文字をあてはめる'}</button><p class="final-instruction">${instruction}</p>`;
}
