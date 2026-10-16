import {NEWS_AREAS} from './news-areas.js?v=2026-10-16-web-16';
import {YEAR_CHOICES,yearOrderComplete} from './year-order-data.js?v=2026-10-16-web-16';
function picture(number){
 const area=NEWS_AREAS.find(area=>area.number===number);
 const lines={1:['衆議院議員','総選挙'],4:['サッカーW杯','日本代表'],6:['千葉の','記録的な大雨'],7:['愛知・名古屋','アジア大会 開幕'],8:['ノーベル化学賞','受賞決定']};
 return `<img src="assets/images/${area.image}.png" alt=""><span class="year-card-title">${lines[number].map(line=>`<span>${line}</span>`).join('')}</span>`;
}
export function renderYearOrder(state){
 if(state.submitted)return `<section class="final-clues is-waiting"><h1>解答を受け付けました</h1><p>カウントダウンが終わるまで<br>お待ちください。</p></section>`;
 const selected=state.slots.filter(Number.isInteger).length;
 return `<section class="year-order" aria-labelledby="year-title"><div class="year-heading"><p class="eyebrow">クリックした順に、①から番号が付きます</p><h1 id="year-title">${selected===0?'まず、いちばん早く起きたできごとをクリック！':selected<5?'次に起きたできごとをクリック！':'5つのできごとを選びました'}</h1><p>まちがえたら「1つ戻す」で選び直せます。</p></div><div class="year-bank" aria-label="起こった順に選ぶ5つのできごと">${YEAR_CHOICES.map(number=>{
  const position=state.slots.indexOf(number),chosen=position!==-1;
  return `<button class="year-card ${chosen?'is-selected':''}" data-year-card="${number}" aria-label="${NEWS_AREAS.find(a=>a.number===number).timelineTitle}${chosen?`、${position+1}番目に選択済み`:'を次に選ぶ'}" ${chosen?'disabled':''}><span class="year-position ${chosen?'is-numbered':''}">${chosen?`${position+1}番目`:`${selected+1}番目を選ぶ ↓`}</span>${picture(number)}</button>`;
 }).join('')}</div><p class="year-selection" role="status" aria-live="polite">${selected===5?'5つ選びました。カードの番号が、起こった順になっているか確かめよう。':`次は ${selected+1}番目のできごとをクリック。`}</p><div class="year-actions"><div class="year-edit"><button class="secondary" data-year-undo ${selected?'':'disabled'}>⌫ 1つ戻す</button><button class="secondary" data-year-clear ${selected?'':'disabled'}>全部やり直す</button></div><span>解答チャンスは1回だけ</span><button class="primary" data-year-submit ${yearOrderComplete(state)?'':'disabled'}>この順番で決定</button></div></section>`;
}
