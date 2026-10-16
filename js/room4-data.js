import {emptyState,parseState} from './room1-data.js?v=2026-10-16-web-04';

export const ROOM = {
  number:4,storageKey:'escape2026.room4.v1',title:'からくり工房',titleHTML:'からくり<br>工房',
  image:'assets/images/room4-workshop-v2.png',imageAlt:'織り機、はかり、3色の箱が並ぶ、明るいからくり工房',
  caption:'止まった装置にも、動き出すためのひみつがある。',
  intro:'最後の鐘につながる手がかりを探して、<br>きみはからくり工房にたどり着いた。<br>机の上には、作りかけの装置が残っている。',
  details:'文字を織る糸、つり合った部品、<br>3つの箱。職人の残したひみつを解こう。',
  reward:'ゅ',otherURL:'room3.html',otherLabel:'ひかりのアトリエへ',
  links:[{href:'room3.html',label:'ひかりのアトリエへ'},{href:'room5.html',label:'風の航海室へ'}],
  afterword:'この部屋のナゾはここまでです。<br>かけらは、最後のナゾが始まってから開きます。'
};
export const QUESTIONS = [
  {id:'loom',title:'ことばの織り機',short:'2色の文字の糸',label:'織り方のナゾ',answer:'くつした',maxAttempts:1,
    hints:["糸にも織り目にも、赤と青があります。同じ色どうしを対応させると、読む順が見つかりそうです。","同じ色の糸の文字は、左から順に使います。織り目が青に変わったら青い糸の続き、赤に変わったら赤い糸の続きから１文字取りましょう。"],
    explanation:'赤い糸と青い糸を交互に織る。「く・し」と「つ・た」を赤・青・赤・青の順に1文字ずつ使うと「く・つ・し・た」！'},
  {id:'balance',title:'つり合う部品',short:'部品のはかり',label:'重さのナゾ',answer:'563',answerSymbols:['★','◆','●'],inputTitle:'この順番の重さを入力',
    hints:["いちばん上のはかりでは、◆１つと●２つが同じ重さです。ほかのはかりでも、同じ重さのものに置きかえてみよう。","真ん中の◆を●２つ分、★をいちばん下の「●と２」に置きかえよう。すると、●３つと重さ２のおもりで11になります。まず●１つの重さを求め、ほかの形も調べよう。"],
    explanation:'◆は●2つ分、★は●と2。◆＋★＝11なので、●3つ＋2＝11。●＝3、◆＝6、★＝5。指定の順に並べると「563」！'},
  {id:'boxes',title:'ひとつだけの本当',short:'鍵の入った箱',label:'貼り紙のナゾ',answer:'あお',candidateAnswers:['あか','あお','しろ'],inputTitle:'箱の色をひらがなで入力',maxAttempts:1,
    hints:["答えを決定する前に、鍵が赤・青・白の箱にある場合をそれぞれ想像してみよう。そのとき、３枚の貼り紙のうち何枚が正しくなるかな？","たとえば赤い箱に鍵があると、赤の貼り紙はうそ、ほか２枚は本当になり、条件に合いません。ほかの色も、３枚すべてを確かめてみよう。"],
    explanation:'青い箱に鍵があると、赤の「この箱に鍵はない」だけが正しい。青と白の貼り紙は間違いになる。正しい貼り紙が1枚だけなので、答えは「あお」！'}
];
export const THREADS = [{color:'blue',word:'つた',label:'青い糸'},{color:'red',word:'くし',label:'赤い糸'}];
export const WEAVE_ORDER = ['red','blue','red','blue'];
export function wovenWord(){
  const used={red:0,blue:0};
  return WEAVE_ORDER.map(color=>THREADS.find(t=>t.color===color).word[used[color]++]).join('');
}
export const BALANCES = [
  {left:['●','●'],right:['◆'],description:'丸2つとひし形1つがつり合っています'},
  {left:['◆','★'],right:[11],description:'ひし形と星が重さ11のおもりとつり合っています'},
  {left:['★'],right:['●',2],description:'星が丸と重さ2のおもりとつり合っています'}
];
export const BOXES = [
  {id:'red',label:'あか',statement:'この箱に\n鍵はない'},
  {id:'blue',label:'あお',statement:'鍵は\n赤い箱の中'},
  {id:'white',label:'しろ',statement:'鍵は\n青い箱には\nない'}
];
export function trueNotes(key){return [key!=='red',key==='red',key!=='blue'];}
export const makeEmptyState=()=>({...emptyState(),attempts:[0,0,0]});
export function restoreState(raw){
  const state={...parseState(raw),attempts:[0,0,0]};
  try{const saved=JSON.parse(raw);if(saved?.version===1){
    state.drafts=QUESTIONS.map((q,i)=>typeof saved.drafts?.[i]==='string'?saved.drafts[i].slice(0,q.answer.length):'');
    state.attempts=QUESTIONS.map((q,i)=>q.maxAttempts&&Number.isInteger(saved.attempts?.[i])?Math.max(0,Math.min(q.maxAttempts,saved.attempts[i])):0);
  }}catch{}
  return state;
}
