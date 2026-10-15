import {emptyState,parseState,inputAnswer} from './room1-data.js?v=2026-10-16-web-03';
import {FLOWER_CANDIDATES} from './late-puzzles-data.js?v=2026-10-16-web-03';
import {withAttempts} from './answer-attempts.js?v=2026-10-16-web-03';
import {FLOWER_WORDS,flowerMarks} from './flower-search-data.js?v=2026-10-16-web-03';

const roomNames={4:"からくり工房",5:"風の航海室",6:"おやつの温室",7:"星の観測室",8:"明日への展示室"};
const room=(number,title,titleHTML,image,imageAlt,caption,intro,details,reward)=>({
  number,storageKey:`escape2026.room${number}.v1`,title,titleHTML,image:`assets/images/${image}.png`,imageAlt,caption,intro,details,reward,
  links:[{href:`room${number-1}.html`,label:`${roomNames[number-1]}へ`},...(number<8?[{href:`room${number+1}.html`,label:`${roomNames[number+1]}へ`}]:[])],
  afterword:`この部屋のナゾはここまでです。<br>集めた文字は、この端末に保存されます。`
});
export const LATE_ROOMS=[
  room(5,'風の航海室','風の<br>航海室','room5-voyage','方位磁針、鏡の時計、折りたたんだ地図のある明るい航海室','止まった風の向こうに、新しい年への道がある。','鐘の音を探す旅は、まだ続く。<br>きみは、風が眠る航海室の扉を開けた。<br>船出を待つ道具が、静かに並んでいる。','方位磁針、鏡に映る時計、<br>折り返された地図。進む道を見つけよう。','の'),
  room(6,'おやつの温室','おやつの<br>温室','room6-greenhouse','アイスクリームや花が並ぶ日差しの明るい温室','育つものにも、おいしいものにも、ひみつがある。','時計の町を進むと、<br>日だまりの温室にたどり着いた。<br>作りかけのおやつと花が、きみを待っている。','色の違うアイス、花の名前の文字表、<br>花の見本。温室の3つのひみつを探そう。','す'),
  room(7,'星の観測室','星の<br>観測室','room7-observatory','望遠鏡、太陽と地球の模型、紙の箱がある明るい観測室','空を見上げると、遠い光が道を教えてくれる。','最後の鐘の手がかりを追って、<br>きみは星を観測する部屋に入った。<br>止まった夜空にも、光の道すじが残っている。','星空を横切る線、模型の軌道、<br>広げた紙の箱。見方を変えて考えよう。','じ'),
  room(8,'明日への展示室','明日への<br>展示室','room8-exhibition','曜日の標本、玉の展示台、古い手紙が並ぶ明るい展示室','思い出をしまうだけでなく、明日へ持っていくために。','2026年の記録が残された展示室。<br>この先には、最後の鐘へ続く道がある。<br>きみは、まだ解けていない展示を見つめた。','曜日の標本、不思議な玉、<br>時代の手紙。明日へつながる言葉を探そう。','お')
];
export const LATE_QUESTIONS={
  5:[
    {id:'compass',title:'方角が示すことば',short:'文字の方位磁針',label:'方角と音のナゾ',answer:'ふなたび',inputAnswer:'なたひ',fixedLetters:{0:'ふ'},answerSymbols:['','③','④','⑤'],fixedMarks:{3:'゛'},inputTitle:'番号に入る文字を入力',inputNote:'「ふ」「゛」は入力しなくてOK',
      hints:["赤い針は、北を指しています。北・東・南・西を、ひらがなで書いて丸に当てはめてみよう。","丸の数は、その方角をひらがなで読んだ文字数です。「舵（かじ）」の例で番号の読み方を確かめ、最後の式にも当てはめよう。"],
      explanation:'③＝な、④＝た、⑤＝ひ。入力するのは「な・た・ひ」。書いてある「ふ」と濁点を合わせると、「ふ③④⑤゛」は「ふなたび」と読めます。'},
    {id:'mirror-clock',title:'鏡の向こうの時刻',short:'鏡に映った時計',label:'反転のナゾ',answer:'0820',inputTitle:'時刻を4けたで入力',
      hints:["鏡では、文字盤の数字も針も左右が逆に映ります。紙の時計を裏から見ているつもりで、左右を入れ替えてみよう。","鏡の中の「12」と「6」を結ぶ線を折り目にして、針を反対側へ移すつもりで考えよう。長い針が示す分を先に調べ、短い針がどの数字を過ぎたかも確かめます。"],
      explanation:'鏡の中の文字盤と針を左右に戻すと、短い針は8と9の間、長い針は4。もとの時刻は8時20分なので「0820」！'},
    {id:'folded-map',title:'折り返した地図',short:'点線のある地図',label:'重なりのナゾ',answer:'ふうせん',answerSymbols:['①','②','③','④'],candidateAnswers:['ふうせん','ひこうき','えんぴつ','たんけん'],
      hints:["折ると、番号は同じ高さのマスに重なります。点線の近くどうし、遠くどうしが重なることに注目しよう。使わない文字もあります。","①のある列は、折り目から右に何列目かな？左も折り目から同じ数だけ列を数えた、同じ高さのマスに重なります。残りの番号も同じ方法で確かめよう。"],
      explanation:'折り目から同じだけ離れた、同じ高さのマスが重なる。16文字のうち、①は「ふ」、②は「う」、③は「せ」、④は「ん」。順に読むと「ふうせん」！'}
  ],
  6:[
    {id:'ice-scoops',title:'おやつの積みかさね',short:'3つのアイス',label:'色とことばのナゾ',answer:'あいす',
      hints:["同じ色・同じ模様のアイスは、同じ１文字を表します。カップの言葉と、上から並ぶアイスを比べてみよう。","まず２つの例に共通するアイスを探し、その色がどちらの言葉でも同じ文字になるか確かめよう。真ん中のカップの「ー」も、アイス１個分です。わかった色から右のカップに当てはめよう。"],
      explanation:'同じアイスは同じ文字。ピンク＝ア、緑＝イ、黄色＝ス。上から読むと「アイス」、ひらがなで「あいす」！'},
    {id:'flower-search',title:'花の名前さがし',short:'花の名前がかくれた表',label:'文字を探すナゾ',answer:'ひらめき',
      hints:[`探す花は、次の６種類です。\n${FLOWER_WORDS.slice(0,3).join('・')}\n${FLOWER_WORDS.slice(3).join('・')}\n上下左右に、まっすぐ探そう。逆向きもあります。`,"一番上の段の「ひまわり」は、右から左へ並んでいます。ほかの花も、読む向きを変えて調べよう。６つとも見つかったか一覧で確かめ、使わなかった文字だけを、上の段から左→右に読もう。"],
      explanation:'「ひまわり」「たんぽぽ」は左向き、「つばき」は上向き。「さくら」「すみれ」「あじさい」は右向きにかくれています。６つの花の文字を消し、残った文字を上の段から左→右に読むと「ひ・ら・め・き」！'},
    {id:'turning-flowers',title:'花びらの仲間はずれ',short:'回せる花の見本',label:'回転のナゾ',answer:'つぼみ',candidateAnswers:FLOWER_CANDIDATES,maxAttempts:1,
      hints:["花の向きだけが違っても、回すと同じになるものは仲間です。花びらの色を、ぐるりと時計回りに比べてみよう。","同じ色が２枚ある段は、その２枚が隣り合うか向かい合うか比べよう。全部違う色の段は、１色を上にそろえてから、時計回りの色の並びを比べます。裏返さず、回して重なるか確かめよう。"],
      explanation:'回しても重ならない花は、上から「つ」「ぼ」「み」。答えは「つぼみ」！'}
  ],
  7:[
    {id:'sky-trails',title:'星空を通る矢印',short:'月と星の並び',label:'数と音のナゾ',answer:'きほん',
      hints:["同じ絵がたてに並ぶ数と、その絵の名前の文字数を比べよう。下の「けしき」の道も手がかりです。","流れ落ちる絵は「いんせき」の４文字です。下の「けしき」の道で、各列のどの文字を読むか確かめてから、紫の矢印も同じように読もう。"],
      explanation:'たての絵に名前の文字を1つずつ当てはめる。紫の矢印は「き・ほ・ん」を通るので「きほん」！'},
    {id:'word-orbit',title:'ことばの軌道',short:'2つの星の模型',label:'道すじのナゾ',answer:'うちゅう',
      hints:["模型の名前をひらがなにすると、それぞれ４文字になります。小さい「ゅ」も１つの丸を使います。","まず金色の道を、左端の点からたどり、「たいき」になるか確かめよう。線が丸の中を通るときだけ、その文字を読みます。青緑も「スタート」から矢印まで、同じルールでたどろう。"],
      explanation:'太陽＝たいよう、地球＝ちきゅう。青緑の道が通る丸を順に読むと「う・ち・ゅ・う」！'},
    {id:'star-box',title:'星箱の展開図',short:'広げられた紙の箱',label:'立体のナゾ',answer:'841',answerSymbols:['2の反対','7の反対','5の反対'],inputTitle:'反対の面の数字を、この順で入力',maxAttempts:1,
      hints:["点線で折って、立方体の箱にします。向かい合うのは、辺をくっつける面ではなく、箱の向こう側にある面です。","横に４枚並んだ部分は、箱のまわりの４つの壁になります。上下に付いた２枚はふたと底です。１つの面を手前に固定して、ほかの面がどこへ来るか考えよう。"],
      explanation:'箱にすると、2の反対は8、7の反対は4、5の反対は1。指定された順に並べて「841」！'}
  ],
  8:[
    {id:'weekday',title:'曜日の標本',short:'色のついた7つの列',label:'身近な並びのナゾ',answer:'ずけい',inputAnswer:'すけい',answerSymbols:['③','④','①'],fixedMarks:{0:'゛'},inputTitle:'番号に入る文字を入力',inputNote:'「゛」は入力しなくてOK',
      hints:["赤い列から始まり、青い列で終わる７つの並び。カレンダーにある、曜日の読み方を思い出そう。","「日・月・火・水・木・金・土」を、マスの数に合う読み方で入れよう。まず「せ①②①」が意味の通る文になるか確かめ、同じ番号を下の行にも使おう。"],
      explanation:'③＝す、④＝け、①＝い。入力するのは「す・け・い」。③に書いてある濁点を付けると「ず」になり、文は「せいかいは ずけい」と読めます。'},
    {id:'jade-rebus',title:'玉の展示台',short:'玉を囲む形',label:'絵と漢字のナゾ',answer:'からくり',fixedLetters:{3:'り'},inputNote:'「り」は入力しなくてOK',
      hints:["絵の玉を、漢字の「玉」に置きかえてみよう。まわりの線と組み合わせると、どんな漢字になるかな？","左の線は、漢字の「宀（うかんむり）」に似ています。玉と合わせてできる漢字を、下の「た」から始まる読み方で考えよう。右も囲みと玉から漢字を作り、同じ色の丸には同じ１文字を入れます。"],
      explanation:'玉を漢字にすると、屋根の下は「宝＝たから」、四角の中は「国＝くに」。色の丸を読むと「か・ら・く・り」！'},
    {id:'kana-maze',title:'矢印が示すことば',short:'階段と空白の表',label:'表の見方のナゾ',answer:'そうだん',
      hints:["この表は五十音表です。右上のマスを「あ」として、\nひらがなを１文字ずつ入れてみよう。","上の矢印は「か」からはじまり、「イ段」を通るので、\n「かいだん」ですね。\n同じように、下の矢印も読んでみよう。"],
      explanation:'表は五十音表。上は「か」から「い段」へ進むので「かいだん」。下は「そ」から「う段」へ進むので「そうだん」！'}
  ]
};
export const makeLateState=()=>({...emptyState(),contentRevision:2,answerInputRevision:3,attempts:[0,0,0],flowerSearchRevision:1,flowerLayoutRevision:2,flowerMarks:[]});
export function restoreLateState(raw,number){
  const state=withAttempts({...parseState(raw),contentRevision:2,answerInputRevision:3,flowerSearchRevision:1,flowerLayoutRevision:2,flowerMarks:[]},raw,LATE_QUESTIONS[number]);
  try{const saved=JSON.parse(raw);if(saved?.version===1)state.drafts=LATE_QUESTIONS[number].map((q,i)=>{
    let draft=typeof saved.drafts?.[i]==='string'?saved.drafts[i].slice(0,q.answer.length):'';
    const revision=Number.isInteger(saved.answerInputRevision)?saved.answerInputRevision:0;
    if(revision<1)draft=[...draft].filter((_,j)=>q.fixedLetters?.[j]===undefined).join('');
    // Keep existing clears and hints; migrate the old voiced input to the printed-dakuten format.
    if(number===8&&i===0&&revision<2&&draft.startsWith('ず'))draft='す'+draft.slice(1);
    if(number===5&&i===0&&revision<3&&draft==='なたび')draft='なたひ';
    return draft.slice(0,inputAnswer(q).length);
  });}catch{}
  if(number===8){let saved=null;try{saved=JSON.parse(raw);}catch{}if(saved?.contentRevision!==2){state.solved=state.solved.filter(i=>i!==2);state.drafts[2]='';state.hints[2]=0;state.claimed=false;}}
  if(number===6){let saved=null;try{saved=JSON.parse(raw);}catch{}if(saved?.flowerSearchRevision===1){if(saved.flowerLayoutRevision===2)state.flowerMarks=flowerMarks(saved.flowerMarks);}else{state.solved=state.solved.filter(i=>i!==1);state.drafts[1]='';state.hints[1]=0;state.attempts[1]=0;state.claimed=false;}}
  return state;
}
