import {NEWS_AREAS} from './news-areas.js?v=2026-10-15-web-27';
import {FIXED_YEAR_SLOTS,YEAR_CHOICES,yearOrderComplete} from './year-order-data.js?v=2026-10-15-web-27';
function picture(number,showMonth=false){
 const area=NEWS_AREAS.find(area=>area.number===number);
 const lines={1:['衆議院議員','総選挙'],2:['りくりゅう','金メダル'],3:['イランへの','攻撃'],4:['サッカーW杯','日本代表'],5:['熊本の','大地震'],6:['千葉の','記録的な大雨'],7:['愛知・名古屋','アジア大会','開幕'],8:['ノーベル','化学賞','受賞決定']};
 return `<img src="assets/images/${area.image}.png" alt=""><span class="year-card-title">${lines[number].map(line=>`<span>${line}</span>`).join('')}</span>${showMonth?`<span class="year-month">${area.month}</span>`:''}`;
}
export function renderYearOrder(state){
 if(state.submitted)return `<section class="final-clues is-waiting"><h1>解答を受け付けました</h1><p>カウントダウンが終わるまで<br>お待ちください。</p></section>`;
 return `<section class="year-order" aria-labelledby="year-title"><div class="year-heading"><h1 id="year-title">2026年のできごとを、起こった順に並べよう</h1><p>カードをタップして、空欄へ。入れたカードは、タップすると戻せます。</p></div><div class="year-bank" aria-label="並べる５つのできごと">${YEAR_CHOICES.map(number=>`<button class="year-card" data-year-card="${number}" aria-label="${NEWS_AREAS.find(a=>a.number===number).timelineTitle}を空欄に入れる" ${state.slots.includes(number)?'disabled':''}>${picture(number)}</button>`).join('')}</div><ol class="year-board" aria-label="古いできごとから順に８つ">${state.slots.map((number,index)=>`<li class="year-slot ${FIXED_YEAR_SLOTS[index]!==undefined?'is-fixed':''}"><span class="year-position">${index+1}</span>${number?(FIXED_YEAR_SLOTS[index]!==undefined?`<div class="year-card fixed">${picture(number,true)}</div>`:`<button class="year-card" data-year-remove="${index}" aria-label="${NEWS_AREAS.find(a=>a.number===number).timelineTitle}を戻す">${picture(number)}</button>`):'<span class="year-empty">？</span>'}</li>`).join('')}</ol><div class="year-actions"><span>解答チャンスは１回だけ</span><button class="primary" data-year-submit ${yearOrderComplete(state)?'':'disabled'}>この順番で決定</button></div></section>`;
}
