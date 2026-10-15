export const PREFECTURES='北海道 青森県 岩手県 宮城県 秋田県 山形県 福島県 茨城県 栃木県 群馬県 埼玉県 千葉県 東京都 神奈川県 新潟県 富山県 石川県 福井県 山梨県 長野県 岐阜県 静岡県 愛知県 三重県 滋賀県 京都府 大阪府 兵庫県 奈良県 和歌山県 鳥取県 島根県 岡山県 広島県 山口県 徳島県 香川県 愛媛県 高知県 福岡県 佐賀県 長崎県 熊本県 大分県 宮崎県 鹿児島県 沖縄県'.split(' ');
// Alternating red kanji and ordinary text; this is text, never a copy of the supplied image.
export const POEM_LINES=[
 ['大','いなる','山','は','三','つに','分','かれ'],
 ['岩','が','岡','に','正','しく','形','をかえるとき'],
 ['牛','の','群','れは','角','を','重','ね'],
 ['青','き','馬','は','鳥','の','歌','を','知','る'],
 ['刀','を','手','に','取','り','北','の','山道',''],
 ['東','の','森','で','愛','をささげば'],
 ['静','かな','海','に','京','は','和','む']
];
export function unusedPoemKanji(){const names=new Set(PREFECTURES.join(''));return POEM_LINES.flatMap(line=>line.filter((_,i)=>i%2===0).flatMap(s=>[...s])).filter(c=>!names.has(c));}
export const MAZE_KANA=[
 [...'んわらやまはなたさかあ'],
 [null,null,'り',null,'み','ひ','に','ち','し','き','い'],
 [null,null,'る','ゆ','む','ふ','ぬ','つ','す','く','う'],
 [null,null,'れ',null,'め','へ','ね','て','せ','け','え'],
 [null,'を','ろ','よ','も','ほ','の','と','そ','こ','お']
];
export const MAZE_EXAMPLE={row:0,col:9,endRow:1},MAZE_QUERY={row:4,col:8,endRow:2};
export const mazeWord=route=>MAZE_KANA[route.row][route.col]+'あいうえお'[route.endRow]+'だん';
