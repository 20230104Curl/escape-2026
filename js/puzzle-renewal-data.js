export const SEASON_DIGITS={1:'は',2:'な',3:'ゆ',4:'き',5:'ふ',6:'る',7:'つ'};
export const SEASON_QUERY=[5,6,'ー',7];
export const KANJI_PARTS={red:{char:'化',left:'イ',right:'ヒ'},blue:{char:'加',left:'カ',right:'ロ'},green:{char:'刈',left:'メ',right:'リ'}};
export const KANJI_EXAMPLE=[['red','right'],['blue','left'],['green','right']];
export const KANJI_QUERY=[['green','left'],['red','left'],['blue','right']];
export const HIDDEN_COLUMNS=[['','へ','','ま',''],['あ','','','','お'],['す','','','た',''],['','き','','','こ']];
export const COLUMN_SOLUTIONS=[...'ほうそく'];
export const KANA_ORDER=[...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'];
export const PALINDROME_EXAMPLES=[['とまと','まと'],['きつね','つき']];
export const PALINDROME_PREFIX=['みず','ねこ'];
export const TIMES_POINTS=[
  {id:'unknown',row:3,col:5}, {id:'lion',row:4,col:4}, {id:'comb',row:9,col:4},
  {id:'ink',row:1,col:9}, {id:'meat',row:2,col:9}, {id:'leaf',row:8,col:8}
];
export const TIMES_READINGS={unknown:'さんご',lion:'しし',comb:'くし',ink:'いんく',meat:'にく',leaf:'はっぱ'};
export function partsWord(sequence){return sequence.map(([color,side])=>KANJI_PARTS[color][side]).join('');}
export function isPalindrome(word){return [...word].reverse().join('')===word;}

// Only replaced riddles lose old answers. Other progress survives a content update.
export function restoreRevision(raw,baseRestore,answers,revision,changed){
  const state=baseRestore(raw);
  let saved=null;try{saved=JSON.parse(raw);}catch{}
  state.drafts=answers.map((answer,i)=>typeof saved?.drafts?.[i]==='string'?saved.drafts[i].slice(0,answer.length):'');
  if(saved?.contentRevision!==revision){
    state.solved=state.solved.filter(i=>!changed.includes(i));
    for(const i of changed){state.drafts[i]='';state.hints[i]=0;}
    if(state.solved.length<3)state.claimed=false;
  }
  state.contentRevision=revision;
  return state;
}
