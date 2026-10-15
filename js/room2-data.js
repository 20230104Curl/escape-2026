import {restoreRevision} from './puzzle-renewal-data.js?v=2026-10-15-web-20';
import {withAttempts} from './answer-attempts.js?v=2026-10-15-web-20';
import {emptyState as baseEmpty,parseState as baseParse} from './room1-data.js?v=2026-10-15-web-20';

export const ROOM = {
  number:2,storageKey:'escape2026.room2.v1',title:'ふしぎな図書室',titleHTML:'ふしぎな<br>図書室',
  image:'assets/images/room2-library.png',imageAlt:'絵本、文字のかけら、本棚が並ぶ、明るい図書室',
  caption:'本の中に、止まった時間の手がかりがある。',
  intro:'鐘の音を取りもどす手がかりを探して、<br>きみは図書室の扉を開けた。<br>開いた本が、だれかを待っている。',
  details:'絵が話す問題、もうひとつの読み方、<br>帯にかくれた文字。3つのナゾが眠っている。',
  reward:'ぶ',otherURL:'room1.html',otherLabel:'忘れられた準備室へ',
  links:[{href:'room1.html',label:'忘れられた準備室へ'},{href:'room3.html',label:'ひかりのアトリエへ'}],
  afterword:'この部屋のナゾはここまでです。<br>集めた文字は、この端末に保存されます。'
};
export const QUESTIONS = [
  {id:'picture-sentence',title:'絵が話す問題',short:'絵の指示文',label:'絵を読むナゾ',answer:'あわ',
    hints:["絵を名前に置きかえて、順に読もう。絵と文字をひと続きの文にすると、何かをする指示になるかもしれません。","下の段は、「わ」に「変える」と読めます。上の段も、言葉を区切ってみよう。何の文字を、どの文字に変える指示なのかな？"],
    explanation:'絵をつなぐと「ありのりを、わにかえると？」。「あり」の「り」を「わ」に変えると「あわ」！'},
  {id:'kanji-sides',title:'もうひとつの文字',short:'色の付いた漢字',label:'漢字の形のナゾ',answer:'めいろ',
    hints:["色は漢字を、矢印は左右のどちらかを指しています。取り出した形を、カタカナとして読めないかな？","例の「光」は「ヒ・カ・リ」と読めます。どの漢字のどちら側を使うと「ヒ」になるかたしかめよう。下の段の最初は緑の「←」なので、緑の漢字の左側を使うと「メ」になります。"],
    explanation:'漢字の左右が、カタカナに見える。「刈」の左＝メ、「化」の左＝イ、「加」の右＝ロ。メ・イ・ロは「めいろ」！'},
  {id:'covered-kana',title:'帯の下のことば',short:'かくれた文字列',label:'並び方のナゾ',answer:'ほうそく',
    hints:["見えている文字は、五十音の順に続いています。帯の上と下にある文字の間には、何が入るかな？","いちばん左の列は、「へ」と「ま」の間にある文字なので、\n「ほ」になります。残りの列も同じように調べよう！"],
    explanation:'左から「ふ・へ・ほ・ま・み」「あ・い・う・え・お」「す・せ・そ・た・ち」「か・き・く・け・こ」。帯の下の文字は「ほ・う・そ・く」！'}
];
export const KANA_ROWS = [
  ['わ','ら','や','ま','は','な','た','さ','か','あ'],
  ['','り','','み','ひ','に','ち','し','き','い'],
  ['','る','ゆ','む','ふ','ぬ','つ','す','く','う'],
  ['','れ','','め','へ','ね','て','せ','け','え'],
  ['を','ろ','よ','も','ほ','の','と','そ','こ','お']
];
export const makeEmptyState=()=>({...baseEmpty(),contentRevision:3,attempts:[0,0,0]});
export const restoreState=raw=>withAttempts(restoreRevision(raw,baseParse,QUESTIONS.map(q=>q.answer),3,[0,1,2]),raw,QUESTIONS);
