import {POEM_LINES,MAZE_EXAMPLE,MAZE_QUERY} from './replacement-puzzles-data.js?v=2026-10-16-web-01';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function prefecturePoem(){
 return `<p class="puzzle-instruction">我が国に無いものから、<br>隠された二文字を導き出せ。</p><div class="prefecture-poem">${POEM_LINES.map(line=>`<p>${line.map((part,i)=>i%2?esc(part):`<strong>${esc(part)}</strong>`).join('')}</p>`).join('')}</div>`;
}
export function kanaMaze(){
 const x=45,y=65,cell=40,outline='M45 65H485V265H85V225H125V105H45Z';
 const point=route=>({x:x+(route.col+.5)*cell,y:y+(route.row+.5)*cell,end:y+(route.endRow+.5)*cell});
 const example=point(MAZE_EXAMPLE),query=point(MAZE_QUERY);
 const lines=Array.from({length:12},(_,i)=>`<path d="M${x+i*cell} ${y}V265"/>`).join('')+Array.from({length:6},(_,i)=>`<path d="M45 ${y+i*cell}H485"/>`).join('');
 return `<p class="puzzle-instruction">上の矢印と絵を手がかりに、<br>下の「？」に入る言葉を答えよう。</p><div class="replacement-diagram"><svg viewBox="0 0 540 310" role="img" aria-label="5段の空白の表。上の点からの矢印は階段の絵を表す。下の点からの矢印が表す言葉は何か。"><defs><clipPath id="kana-maze-clip"><path d="${outline}"/></clipPath><marker id="kana-maze-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 10 5 0 10 3 5Z" fill="#bf4b40"/></marker></defs><path d="${outline}" fill="#fffdf8" stroke="#8b7059" stroke-width="2.5"/><g clip-path="url(#kana-maze-clip)" fill="none" stroke="#d6d0c6" stroke-width="1">${lines}</g><g fill="#7b6551"><rect x="165" y="105" width="40" height="40"/><rect x="165" y="185" width="40" height="40"/></g><path data-maze-route="example" d="M${example.x} ${example.y}V45H505V${example.end}H90" fill="none" stroke="#bf4b40" stroke-width="2.5" marker-end="url(#kana-maze-arrow)"/><path data-maze-route="query" d="M${query.x} ${query.y}V285H505V${query.end}H90" fill="none" stroke="#bf4b40" stroke-width="2.5" marker-end="url(#kana-maze-arrow)"/><g fill="#bf4b40"><circle cx="${example.x}" cy="${example.y}" r="6"/><circle cx="${query.x}" cy="${query.y}" r="6"/></g><g fill="#f0cf80" stroke="#846345" stroke-width="1.8"><path d="M34 140v-6h7v-6h7v-6h7v-6h7v-6h10v30Z"/><path d="M34 134h15v-6h7v-6h7v-6h9M41 128h8M48 122h8M55 116h8" fill="none"/></g><text x="54" y="183" text-anchor="middle" font-size="37" font-weight="800" fill="#bf4b40">？</text></svg></div>`;
}
