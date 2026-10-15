import {MIRROR_TIME,FOLD_LETTERS,FOLD_MARKS,ICE_STACKS,FLOWER_ROWS,CUBE_NET,CUBE_QUERY,WEEK_COLUMNS,ERA_WORDS} from './late-puzzles-data.js?v=2026-10-15-web-17';
import {kanaMaze} from './replacement-puzzles-art.js?v=2026-10-15-web-17';
import {FLOWER_GRID,flowerMarks} from './flower-search-data.js?v=2026-10-15-web-17';
const svg=(body,label,viewBox='0 0 500 340')=>`<div class="late-diagram"><svg viewBox="${viewBox}" role="img" aria-label="${label}">${body}</svg></div>`;
const text=(value,x,y,size=25,color='#4d4565',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="middle" font-weight="700" ${extra}>${value}</text>`;
const marker=(id,color)=>`<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="${color}"/></marker></defs>`;
function number(n,x,y,dakuten=false){return `<circle cx="${x}" cy="${y}" r="15" fill="#fffdf5" stroke="#aa8c62" stroke-width="2"/>${text(n,x,y+6,19)}${dakuten?text('゛',x+20,y-9,17):''}`;}
function icon(index,x,y,size=62){return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${index%3*100} ${Math.floor(index/3)*100} 100 100" class="painted-svg-icon"><image href="assets/images/rooms-late-icons-v2.png" width="300" height="200"/></svg>`;}
export function compass(){
 return `<p class="puzzle-instruction">赤い針が示すのは北。丸に文字を当てはめると？</p>`+svg(`<circle cx="148" cy="170" r="85" fill="#e7eee5" stroke="#c8ad78" stroke-width="5"/><circle cx="148" cy="170" r="69" fill="#fffaf0" stroke="#d4c39d"/><path d="M148 95 129 176 148 166 167 176Z" fill="#d67c70"/><path d="M148 245 129 176 148 166 167 176Z" fill="#b9c9c9"/><circle cx="148" cy="170" r="6" fill="#af8a57"/>${number('',128,40)}${number(4,166,40)}${number(5,252,170)}${number(1,287,170,true)}${number(2,322,170)}${number('',110,305)}${number(3,148,305)}${number('',186,305)}${number('',20,170)}${number(2,55,170)}<rect x="346" y="82" width="151" height="180" rx="16" fill="#f2e9d9"/>${text('①②゛',421,127,28)}${text('＝ 舵',421,166,29)}${text('かじ',448,185,13)}<path d="M361 202h121" stroke="#ceb78e" stroke-dasharray="5 5"/>${text('ふ③④⑤゛',421,239,25)}`,'北から時計回りに丸の組がある方位磁針。右に文字の暗号と舵の例');
}
export function mirrorClock(){
 const cx=200,cy=144,r=97;
 const point=(deg,length)=>[cx+Math.sin(deg*Math.PI/180)*length,cy-Math.cos(deg*Math.PI/180)*length];
 const minute=point(MIRROR_TIME.minute*6,66),hour=point((MIRROR_TIME.hour+MIRROR_TIME.minute/60)*30,43);
 const face=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fffaf0" stroke="#8eaaad" stroke-width="5"/>${Array.from({length:60},(_,i)=>{const a=point(i*6,89),b=point(i*6,i%5?85:80);return `<path d="M${a}L${b}" stroke="#928a8a" stroke-width="${i%5?1:2}"/>`;}).join('')}${Array.from({length:12},(_,i)=>{const p=point((i+1)*30,70);return text(i+1,p[0],p[1]+6,19);}).join('')}<path d="M${hour}L${cx} ${cy}L${minute}" fill="none" stroke="#5e557a" stroke-width="5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="5" fill="#d48a72"/>`;
 return `<p class="puzzle-instruction">鏡に映った時計。<b>もとの時計</b>は何時何分？</p>`+svg(`<rect x="81" y="21" width="238" height="247" rx="40" fill="#dae9ed" stroke="#b59b76" stroke-width="8"/><path d="M97 102 136 37M274 253l31-46" stroke="#fff" stroke-width="6" opacity=".7"/><g transform="translate(400 0) scale(-1 1)">${face}</g>`,'左右が逆に映る鏡の中の時計。文字盤の数字と針も反転している','0 0 400 290')+`<p class="late-note">例：7時5分なら「0705」。午前・午後は考えません。</p>`;
}
export function foldedMap(){
 const columns=FOLD_LETTERS[0].length,cell=74,left=24,top=72,fold=left+columns*cell;
 const cells=FOLD_LETTERS.map((row,y)=>Array.from({length:columns*2},(_,x)=>{const cx=left+x*cell,cy=top+y*cell,mark=x<columns?0:FOLD_MARKS[y][x-columns],value=x<columns?row[x]:mark?'①②③④'[mark-1]:'';return `<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" fill="${x<columns?'#e7f0e7':'#f6e0cf'}" stroke="#b2a58b" stroke-width="2"/>${value?text(value,cx+cell/2,cy+cell*.69,38):''}`;}).join('')).join('');
 return `<p class="puzzle-instruction">右半分を、点線で左へ折る。<br>① → ② → ③ → ④ に重なる文字は？</p>`+svg(`${marker('fold-arrow','#b5815a')}${cells}<path d="M${fold} 60v320" stroke="#86654d" stroke-dasharray="7 6" stroke-width="4"/><path d="M588 45 Q456 -10 343 45" fill="none" stroke="#b5815a" stroke-width="4" marker-end="url(#fold-arrow)"/>`,'左半分に縦4マス・横4マスの16文字、右半分の同じ大きさのマスに4つの番号がある紙。真ん中の点線で右半分を左へ折る','0 0 640 400');
}
const iceIndex={pink:0,mint:1,green:2,yellow:3,brown:4};
const iceAlt={pink:'ピンク',mint:'水色のつぶ入り',green:'緑',yellow:'黄色',brown:'茶色'};
export function iceCream(){return `<p class="puzzle-instruction">同じアイスは、同じ1文字。<br>右のカップに入る言葉は？</p><div class="ice-cream-row">${ICE_STACKS.map((stack,i)=>`<div class="ice-tower">${stack.map((color,j)=>`<span class="ice-piece" role="img" aria-label="${iceAlt[color]}のアイス" style="background-position:${iceIndex[color]%3*50}% ${Math.floor(iceIndex[color]/3)*100}%;z-index:${10-j}"></span>`).join('')}<div class="ice-piece ice-cup" style="background-position:100% 100%"><strong>${['アツイ','スイーツ','？'][i]}</strong></div></div>`).join('')}</div>`;}
export function flowerSearch(state={}){
 const marks=flowerMarks(state.flowerMarks);
 return `<p class="puzzle-instruction">６つの花の名前を消すと、残る言葉は？</p><div class="flower-search"><div class="flower-search-grid" role="group" aria-label="５行５列の文字表。タップで文字に印を付ける">${FLOWER_GRID.flat().map((letter,i)=>`<button type="button" class="flower-search-cell${marks.includes(i)?' marked':''}" data-flower-cell="${i}" aria-pressed="${marks.includes(i)}" aria-label="${Math.floor(i/5)+1}行${i%5+1}列、${letter}">${letter}</button>`).join('')}</div><div class="flower-search-guide"><p>よこ <b>← →</b><br>たて <b>↑ ↓</b></p><p>まっすぐに探そう。<br>逆向きもあります。<br>花どうしは重なりません。</p></div></div><p class="flower-search-note">タップで消す／戻す。<br>残りを、上の段から左→右に読もう。</p>`;
}
const petalColors={rose:'#ed9c9b',blue:'#83b2d0',green:'#9dc49a',gold:'#f0cd75'};
export function flowers(){
 const body=FLOWER_ROWS.map((row,y)=>row.map((flower,x)=>{const cx=95+x*155,cy=52+y*111;return `<g>${flower.petals.map((color,i)=>{const a=i*Math.PI/2;return `<circle cx="${cx+Math.sin(a)*22}" cy="${cy-Math.cos(a)*22}" r="18" fill="${petalColors[color]}" stroke="#7f7a761f" stroke-width="2"/>`;}).join('')}<circle cx="${cx}" cy="${cy}" r="11" fill="#fff6d6" stroke="#c4ae70"/>${text(flower.label,cx,cy+57,22)}</g>`;}).join('')).join('');
 return `<p class="puzzle-instruction">各段に、回すと同じになる花が2つ。<br><b>仲間はずれの文字を、上から</b>読もう。</p>`+svg(body,'3段に3つずつ並ぶ4枚の花びら。花びらの色の並びを比べる');
}
export function skyTrails(){
 const moons=[40,130].map(y=>icon(0,58,y-32,64)).join(''),stars=[130,220].map(y=>icon(1,188,y-32,64)).join(''),meteors=[40,130,220,310].map(y=>icon(2,328,y-32,64)).join('');
 return `<p class="puzzle-instruction">「景色」になる下の道と、同じひみつ。<br>紫の矢印が教える言葉は？</p>`+svg(`${marker('sky-purple','#8568a4')}${marker('sky-gold','#c09b58')}<path d="M32 130H465" fill="none" stroke="#8568a4" stroke-width="8" marker-end="url(#sky-purple)"/><path d="M163 220H270L360 310H459" fill="none" stroke="#c09b58" stroke-width="7" marker-end="url(#sky-gold)"/>${moons}${stars}${meteors}${text('け',150,229,28)}${text('？',471,107,30,'#8568a4')}${text('景色',451,285,24)}${text('けしき',451,308,14)}`,'縦に月が2つ、星が2つ、隕石が4つ。道が絵の一部を横切る','0 0 500 350');
}
export function wordOrbit(){
 const nodes=[130,220,310,400].flatMap(x=>[90,205].map(y=>`<circle cx="${x}" cy="${y}" r="26" fill="#fffdf7" stroke="#bcb4bd" stroke-width="2"/>`)).join('');
 return `<p class="puzzle-instruction">上と下の丸に、模型の名前を1文字ずつ。<br>青緑の道をスタートからたどると？</p>`+svg(`${marker('orbit-gold','#c59b53')}${marker('orbit-green','#619b94')}<path d="M100 90H220V260" fill="none" stroke="#c59b53" stroke-width="6" marker-end="url(#orbit-gold)"/><circle cx="100" cy="90" r="5" fill="#c59b53"/><path d="M465 90H400V54Q400 30 376 30H110Q86 30 86 54V150Q86 205 130 205C130 280 310 280 310 205H466" fill="none" stroke="#619b94" stroke-width="6" marker-end="url(#orbit-green)"/><circle cx="465" cy="90" r="5" fill="#619b94"/>${icon(3,2,50,74)}${icon(4,2,167,74)}${nodes}${text('例',178,67,15,'#a87c36')}${text('スタート',450,56,15,'#4e807b')}${text('大気',220,289,26)}${text('たいき',220,310,14)}${text('？',471,240,29,'#4e807b')}`,'太陽と地球の絵の横に4つずつの丸。金色の例と青緑の道が丸を結んでいる','0 0 500 325');
}
export function cubeNet(){
 const cell=74,x0=68,y0=15;
 const faces=CUBE_NET.map(f=>`<rect x="${x0+f.x*cell}" y="${y0+f.y*cell}" width="${cell}" height="${cell}" fill="#e7edf0"/>${text(f.value,x0+(f.x+.5)*cell,y0+(f.y+.5)*cell+12,36)}`).join('');
 const edge=CUBE_NET.flatMap(f=>[[0,-1],[1,0],[0,1],[-1,0]].map(([dx,dy],i)=>{const neighbor=CUBE_NET.some(n=>n.x===f.x+dx&&n.y===f.y+dy);if(neighbor&&(i===2||i===3))return '';const x=x0+f.x*cell,y=y0+f.y*cell;const coords=[`M${x} ${y}h${cell}`,`M${x+cell} ${y}v${cell}`,`M${x} ${y+cell}h${cell}`,`M${x} ${y}v${cell}`][i];return `<path d="${coords}" fill="none" stroke="#8b8998" stroke-width="2" ${neighbor?'stroke-dasharray="6 5"':''}/>`;})).join('');
 return `<p class="puzzle-instruction">点線で折って、立方体の箱にする。<br><b>2・7・5</b>の反対の面の数字を、順に答えよう。</p>`+svg(`${faces}${edge}${text(`${CUBE_QUERY.join(' → ')} の反対は？`,250,291,24)}`,'6つの面に数字が書かれた立方体の展開図','0 0 500 320');
}
export function weekdays(){return `<p class="puzzle-instruction">7つの列にかくれた、身近な並び。<br>下の文が教える言葉を答えよう。</p><div class="weekday-columns">${WEEK_COLUMNS.map((column,i)=>`<div class="weekday-column ${i===0?'sunday':i===6?'saturday':''}">${column.map(c=>`<span class="${c==='゛'?'accent-only':''}">${c||''}</span>`).join('')}</div>`).join('')}</div><div class="weekday-code"><p>せ①②① は</p><p>③゛④①</p></div>`;}
function colorCircle(color,x,y){const colors={red:['#f4ceca','#cf7b79'],blue:['#d2e3f4','#739cc2'],green:['#d1e7c4','#8aac73']};return `<circle cx="${x}" cy="${y}" r="19" fill="${colors[color][0]}" stroke="${colors[color][1]}" stroke-width="3"/>`;}
export function jadeRebus(){return `<p class="puzzle-instruction">玉とまわりの形が、言葉になる。<br>色の丸を当てはめると？</p>`+svg(`<path d="M130 22v23M61 80V48h138v32" fill="none" stroke="#5d6372" stroke-width="5"/>${icon(5,80,73,100)}<rect x="315" y="42" width="130" height="140" fill="none" stroke="#5d6372" stroke-width="5"/>${icon(5,330,67,100)}${text('た',85,221,30)}${colorCircle('red',130,211)}${colorCircle('blue',177,211)}${colorCircle('green',351,211)}${text('に',399,221,30)}${text('答えは',109,294,20)}${colorCircle('red',192,284)}${colorCircle('blue',239,284)}${colorCircle('green',286,284)}${text('り',331,295,31)}`,'屋根の下の玉と四角の中の玉。文字の一部が赤、青、緑の丸になっている','0 0 500 325');}
export function eraLetter(){return `<p class="puzzle-instruction">展示室の古い手紙に、こんな問いが残っていた。</p><div class="era-letter">${ERA_WORDS.map(era=>`<p><strong>${era.name}</strong>の<span>${era.part}</span>、</p>`).join('')}<div>どんな時代だったのでしょう？</div></div>`;}
export const LATE_VISUALS={5:[compass,mirrorClock,foldedMap],6:[iceCream,flowerSearch,flowers],7:[skyTrails,wordOrbit,cubeNet],8:[weekdays,jadeRebus,kanaMaze]};
