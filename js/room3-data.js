import {restoreRevision} from './puzzle-renewal-data.js?v=2026-10-15-web-8';
import {emptyState,parseState} from './room1-data.js?v=2026-10-15-web-8';

export const ROOM = {
  number:3,storageKey:'escape2026.room3.v1',title:'ひかりのアトリエ',titleHTML:'ひかりの<br>アトリエ',
  image:'assets/images/room3-atelier.png',imageAlt:'格子の窓、絵の具、鏡、小箱のある明るいアトリエ',
  caption:'光が差しこむ部屋に、3つの作品が残されていた。',
  intro:'止まった時間の向こうで、<br>まだ見ぬ年の光が待っている。<br>きみは不思議なアトリエに足を踏み入れた。',
  details:'数字の付いた絵、両むきの絵、<br>マスに結ばれた絵。作品のひみつを見つけよう。',
  reward:'り',otherURL:'room2.html',otherLabel:'ふしぎな図書室へ',
  links:[{href:'room2.html',label:'ふしぎな図書室へ'},{href:'room4.html',label:'からくり工房へ'}],
  afterword:'この部屋のナゾはここまでです。<br>集めた文字は、この端末に保存されます。'
};
export const QUESTIONS = [
  {id:'prefecture-poem',title:'我が国にない文字',short:'赤い漢字の手紙',label:'漢字を組み合わせるナゾ',answer:'せいかい',inputTitle:'答えの読みを入力',
    hints:["赤い漢字には、地図で見かける字がたくさんあります。日本の47の地域の名前と比べてみよう。","都道府県名に一度も使われない赤い漢字は４種類です。そのうち３種類を、１つの漢字の部品として組み合わせよう。残りの１種類と合わせて、二文字の言葉にします。"],
    explanation:'都道府県名に使われない赤い漢字は「正・牛・角・刀」。「角・刀・牛」を組み合わせると「解」。残った「正」と並べて「正解」なので、読みは「せいかい」！'},
  {id:'palindrome',title:'両むきのことば',short:'両むきの絵',label:'音の並びのナゾ',answer:'ねずみ',
    hints:["絵の名前を左からつなげて、反対からも読んでみよう。「とまと・まと」は、右から読むとどうなるかな？","２つの例は、右から読んでも同じ並びです。？は最後にあるので、まず全体の最初の文字と、？の最後の文字が同じになるように考えよう。外側から１文字ずつ比べると絞れます。"],
    explanation:'左からも右からも同じになる言葉。「みず・ねこ・ねずみ」をつなぐと「みずねこねずみ」。逆からも同じなので、答えは「ねずみ」！'},
  {id:'times-map',title:'マスと絵のひみつ',short:'マスに結ばれた絵',label:'位置と音のナゾ',answer:'さんご',
    hints:["マスはたて９段、よこ９列。かけ算の表を思い浮かべて、絵の名前と比べてみよう。","例の「しし」は４×４、「くし」は９×４の読み方です。？につながる点も、上から何段目・左から何列目か数えて、同じように読んでみよう。"],
    explanation:'絵の名前が、九九のかけ声になっている。「しし」は4×4、「くし」は9×4。？の点は3段目・5列目なので、3×5＝「さんご」！'}
];
export const WINDOW_EXAMPLES = [{rows:1,cols:1,value:1},{rows:2,cols:1,value:3},{rows:2,cols:2,value:9}];
export const WINDOW_TARGET = {rows:3,cols:1};
export function rectangleCount(rows,cols){return rows*(rows+1)*cols*(cols+1)/4;}
export const makeEmptyState=()=>({...emptyState(),contentRevision:2});
export function restoreState(raw){let saved=null;try{saved=JSON.parse(raw);}catch{}return restoreRevision(raw,parseState,QUESTIONS.map(q=>q.answer),2,saved?.contentRevision>=1?[0]:[0,1,2]);}
