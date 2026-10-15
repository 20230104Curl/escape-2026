import {restoreRevision} from './puzzle-renewal-data.js?v=2026-10-16-web-01';
export const ROOM_KEY = 'escape2026.room1.v1';
export const QUESTIONS = [
  { id: 'memo', title: 'たぬきが残したメモ', short: '机の上のメモ', label: '文字のナゾ', answer: 'とびら',
    hints:["動物の名前を「た・ぬき」と区切ってみよう。文字に何をすればよいかな？","２枚のメモから、動物の名前が教える１文字を抜いてみよう。まず①に残った文を読み、その指示を②のメモに使います。"],
    explanation: 'たぬき＝「た」を抜く。①は「うしろからよめ」、②は「らびと」。②を後ろから読むと「とびら」！' },
  { id: 'seasons', title: 'めぐる季節', short: '季節の暗号', label: 'めぐる文字のナゾ', answer: 'ふるーつ', fixedLetters:{2:'ー'},
    hints:["花や雪から、毎年めぐってくる４つの季節を考えてみよう。矢印の順番も手がかりです。","花は春、雪は冬の手がかりです。季節の読みを２文字ずつ丸に入れ、同じ番号には同じ文字を使おう。時計回りに季節をたどると、残りの丸も埋められます。"],
    explanation: '春・夏・秋・冬を「はる・なつ・あき・ふゆ」に変える。⑤＝ふ、⑥＝る、⑦＝つ。⑤⑥ー⑦は「ふるーつ」！' },
  { id: 'cards', title: 'ばらばらの記憶カード', short: '壁の記憶カード', label: 'つながるナゾ', answer: 'おいで',
    hints:["言葉を「しりとり」でつないでみよう。「しお」の次につながるカードはどれ？","迷ったら、最後の「でんわ」につながるカードから逆向きに探す方法もあります。小さい「ゃ」は「や」につなげよう。並べ終えたら、台紙の赤丸に入った１文字ずつを読もう。"],
    explanation: 'しりとりで8枚をつなぎ、丸の文字を順に読むと「お・い・で」。先の部屋から、だれかが呼んでいるのかもしれない。' }
];
export const CARDS = [
  {word:'うで'}, {word:'いりぐち'}, {word:'おもちゃ'}, {word:'ずこう'},
  {word:'でんわ'}, {word:'やさい'}, {word:'ちず'}, {word:'しお'}
];
export const SLOT_MARKS = {1:0, 2:2, 6:1};
export const CORRECT_ORDER = [7,2,5,1,6,3,0,4];
export const FIXED_CARDS = {0:CORRECT_ORDER[0],7:CORRECT_ORDER[7]};
const fixedCardOrder=order=>[FIXED_CARDS[0],...order.filter(id=>!Object.values(FIXED_CARDS).includes(id)),FIXED_CARDS[7]];
export const cardAtSlot=(order,slot)=>FIXED_CARDS[slot]??(slot<order.length-1?order[slot]:undefined);
export const emptyState = () => ({version:1, started:false, solved:[], hints:[0,0,0], drafts:['','',''], order:[], claimed:false});
export function parseState(raw) {
  try {
    const s=JSON.parse(raw);
    if(s?.version!==1) return emptyState();
    const n=emptyState();
    n.started=s.started===true;
    n.solved=[...new Set((s.solved||[]).filter(i=>Number.isInteger(i)&&i>=0&&i<3))];
    n.hints=n.hints.map((_,i)=>Number.isInteger(s.hints?.[i])?Math.max(0,Math.min(2,s.hints[i])):0);
    n.drafts=n.drafts.map((_,i)=>typeof s.drafts?.[i]==='string'?s.drafts[i].slice(0,3):'');
    n.order=[...new Set((s.order||[]).filter(i=>Number.isInteger(i)&&i>=0&&i<8))];
    n.claimed=n.solved.length===3&&s.claimed===true;
    return n;
  } catch {return emptyState();}
}
export function shuffled(items) {
  const out=[...items];
  for(let i=out.length-1;i>0;i--) {const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
  return out;
}
export function answerKeys(answer,position,alternatives=[],excluded=[]) {
  if(position>=answer.length)return [];
  if(/^\d+$/.test(answer))return [...'1234567890'];
  const pool=[...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽゃゅょー'];
  const required=[...new Set([answer[position],...alternatives.map(word=>word[position]).filter(Boolean)])];
  return shuffled([...required,...shuffled(pool.filter(c=>!required.includes(c)&&!excluded.includes(c))).slice(0,9-required.length)]);
}

export const inputAnswer=q=>q.inputAnswer??[...q.answer].filter((_,i)=>q.fixedLetters?.[i]===undefined).join('');
export const makeRoom1State=()=>({...emptyState(),order:fixedCardOrder([]),contentRevision:1,answerInputRevision:1});
export function restoreRoom1State(raw){
  const state=restoreRevision(raw,parseState,QUESTIONS.map(q=>q.answer),1,[1]);
  let saved=null;try{saved=JSON.parse(raw);}catch{}
  // Earlier drafts included the printed symbol. Preserve typed letters and solved progress.
  if(saved?.answerInputRevision!==1){
    state.drafts=state.drafts.map((draft,i)=>[...draft].filter((_,j)=>QUESTIONS[i].fixedLetters?.[j]===undefined).join(''));
  }
  state.drafts=state.drafts.map((draft,i)=>draft.slice(0,inputAnswer(QUESTIONS[i]).length));
  state.answerInputRevision=1;
  // Keep placed middle cards in order while anchoring the given start and end.
  state.order=fixedCardOrder(state.order);
  return state;
}
