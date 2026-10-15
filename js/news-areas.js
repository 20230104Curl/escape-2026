// News scenery is independent of the existing riddles, answers and saved records.
import {readableCopy} from './readable-copy.js?v=2026-10-15-web-6';
const welcomeBreaks={1:['行われ、'],2:['スケートの'],3:['平和について、'],4:['相手に、'],5:['助け合いながら、'],6:['豪雨が発生し、'],7:['eスポーツの','ぷよぷよでも'],8:['研究者、','さんの']};
export const NEWS_AREAS=[
  {number:1,title:'総選挙と高市政権',newsName:'衆議院議員総選挙・高市政権',brief:'選挙で、日本のこれからを考えた。',description:'2月に衆議院議員総選挙が行われ、高市早苗さんが再び首相に指名されました。',image:'news1-election-v2',imageAlt:'高市早苗首相のオリジナル似顔絵と国会議事堂、投票箱',source:'https://www.kantei.go.jp/jp/105/actions/202602/18shimei.html'},
  {number:2,title:'冬季五輪・りくりゅう',newsName:'ミラノ・コルティナ冬季五輪',brief:'ふたりの絆が、金メダルに。',description:'フィギュアスケートの三浦璃来・木原龍一ペアが金メダル。ふたりの挑戦が大きな感動を届けました。',image:'news2-skating',imageAlt:'金メダルを身につけて滑る三浦璃来・木原龍一ペアのオリジナルイラスト',source:'https://www.joc.or.jp/news/20260218_01.html'},
  {number:3,title:'中東・イランへの攻撃',newsName:'アメリカ・イスラエルによるイラン攻撃',headingHTML:'アメリカ・イスラエルによる<br>イラン攻撃',brief:'世界が、平和を願った。',description:'2月、アメリカとイスラエルがイランを攻撃しました。人々の安全と平和について、世界が考える出来事でした。',image:'news3-middle-east',imageAlt:'世界地図とイランの位置を示す、穏やかなニュース画面風イラスト',source:'https://www.un.org/sg/en/content/sg/statements/2026-02-28/secretary-generals-remarks-the-security-council-meeting-the-situation-the-middle-east-delivered'},
  {number:4,title:'サッカーW杯',newsName:'サッカーワールドカップ・日本代表',brief:'世界の強豪に、チームで挑んだ。',description:'日本代表がワールドカップの決勝トーナメントへ進出。世界の強豪を相手に、力を合わせて戦いました。',image:'news4-football',imageAlt:'青いユニフォームの日本代表と、応援に包まれるサッカースタジアム',source:'https://www.jfa.jp/samuraiblue/worldcup_2026/canadamexicousa2026/'},
  {number:5,title:'熊本の大地震',newsName:'令和8年熊本地震',brief:'支え合い、暮らしを取り戻す。',description:'7月、熊本で大きな地震が発生しました。人々は助け合いながら、安全な暮らしを取り戻そうとしています。',image:'news5-kumamoto',imageAlt:'熊本城と地震計の波形、安全を確かめる人々のイラスト',source:'https://www.jma.go.jp/jma/press/2607/28d/202607282030.html'},
  {number:6,title:'長雨と記録的な大雨',newsName:'長雨・豪雨による被害',brief:'雨の力と、備えの大切さ。',description:'長く続く雨や記録的な大雨で、各地に被害が出ました。8月には千葉で豪雨が発生し、備えの大切さを考える年となりました。',image:'news6-heavy-rain',imageAlt:'大雨で水が増えた川と町、安全な場所へ向かう人々のイラスト',source:'https://www.data.jma.go.jp/stats/data/bosai/report/2026/20260916/20260916.html'},
  {number:7,title:'愛知・名古屋アジア大会',newsName:'愛知・名古屋アジア大会',brief:'地元の大舞台。eスポーツでも金！',description:'愛知・名古屋でアジア大会を開催。日本はeスポーツのポケモンユナイトとぷよぷよでも金メダルを獲得しました。',image:'news7-asian-games',imageAlt:'大会会場とeスポーツの選手、金メダルのオリジナルイラスト',source:'https://www.joc.or.jp/games/asia/2026/japan/winnerslist/index.html'},
  {number:8,title:'ノーベル化学賞',newsName:'硤合憲三さんのノーベル化学賞',headingHTML:'硤合憲三さんの<br>ノーベル化学賞',brief:'積み重ねた研究が、世界へ。',description:'日本の研究者、硤合憲三（そあい・けんそう）さんのノーベル化学賞受賞が決定。化学の発見が世界で認められました。',image:'news8-chemistry-v2',imageAlt:'黒縁眼鏡をかけた硤合憲三さんのオリジナル似顔絵と実験器具、科学賞のメダル',source:'https://www.tus.ac.jp/today/archive/20261008_3513.html'}
];
export function withNewsTheme(room){
  const area=NEWS_AREAS.find(item=>item.number===room.number);if(!area)return room;
  return {...room,...area,image:`assets/images/${area.image}.png`,titleHTML:area.title,caption:area.brief,
    intro:readableCopy(area.description,welcomeBreaks[area.number]),overviewIntro:readableCopy(area.description),details:'この記憶に隠された、3つのナゾ。<br>解き明かして、<br>最後の鐘への手がかりを集めよう。',
    links:NEWS_AREAS.filter(item=>Math.abs(item.number-room.number)===1).map(item=>({href:`room${item.number}.html`,label:`${item.title}へ`})),
    afterword:'この記憶の手がかりを保管しました。<br>次のできごとを巡ろう。'};
}
