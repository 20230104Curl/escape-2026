export const COMPASS_LETTERS={1:'か',2:'し',3:'な',4:'た',5:'ひ'};
export const MIRROR_TIME={hour:8,minute:20};
export const FOLD_LETTERS=[['き','ふ','た','え'],['う','ん','ひ','こ'],['つ','け','せ','ぴ'],['い','お','は','ん']];
export const FOLD_MARKS=[[0,0,1,0],[0,0,0,2],[0,3,0,0],[4,0,0,0]];
export function foldedWord(){const result=[];FOLD_MARKS.forEach((row,y)=>row.forEach((n,x)=>{if(n)result[n-1]=FOLD_LETTERS[y][row.length-1-x];}));return result.join('');}
export const ICE_LETTERS={pink:'あ',mint:'つ',green:'い',yellow:'す',brown:'ー'};
export const ICE_STACKS=[['pink','mint','green'],['yellow','green','brown','mint'],['pink','green','yellow']];
export const readIce=stack=>stack.map(color=>ICE_LETTERS[color]).join('');
export const PIPE_CONNECTIONS=[[0,1],[1,2],[0],[2]];
export const WATER_NEEDS=[2,1,1];
export function waterAmounts(bits){const amounts=[0,0,0];PIPE_CONNECTIONS.forEach((pots,i)=>{if(bits[i]===1)for(const pot of pots)amounts[pot]++;});return amounts;}
export const FLOWER_ROWS=[
  [{label:'つ',petals:['rose','blue','rose','gold']},{label:'ね',petals:['rose','rose','blue','gold']},{label:'や',petals:['gold','rose','rose','blue']}],
  [{label:'か',petals:['blue','green','green','rose']},{label:'わ',petals:['green','rose','blue','green']},{label:'ぼ',petals:['blue','green','rose','green']}],
  [{label:'ゆ',petals:['gold','blue','rose','green']},{label:'み',petals:['gold','green','rose','blue']},{label:'る',petals:['rose','green','gold','blue']}]
];
export function sameRotation(a,b){return a.some((_,offset)=>a.every((color,i)=>color===b[(i+offset)%b.length]));}
export const FLOWER_CANDIDATES=FLOWER_ROWS[0].flatMap(a=>FLOWER_ROWS[1].flatMap(b=>FLOWER_ROWS[2].map(c=>a.label+b.label+c.label)));
export const SKY_WORDS={moon:'つき',star:'ほし',meteor:'いんせき'};
export const SKY_EXAMPLE=['け',['star',1],['meteor',3]];
export const SKY_QUERY=[['moon',1],['star',0],['meteor',1]];
export const readSky=path=>path.map(point=>Array.isArray(point)?SKY_WORDS[point[0]][point[1]]:point).join('');
export const ORBIT_WORDS=['たいよう','ちきゅう'];
export const ORBIT_EXAMPLE=[0,1,5],ORBIT_QUERY=[3,4,6,7];
export const readOrbit=path=>path.map(i=>ORBIT_WORDS.join('')[i]).join('');
export const CUBE_NET=[{x:1,y:0,value:2},{x:0,y:1,value:7},{x:1,y:1,value:5},{x:2,y:1,value:4},{x:3,y:1,value:1},{x:1,y:2,value:8}];
export const CUBE_QUERY=[2,7,5];
export const WEEK_LETTERS={1:'い',2:'か',3:'す',4:'け'};
export const WEEK_COLUMNS=[[null,null],['4゛',null],['2'],['3','1'],[null,null],[null,null],['゛']];
export const ERA_WORDS=[{name:'平成',reading:'へいせい',part:'はじめ'},{name:'明治',reading:'めいじ',part:'まんなか'},{name:'昭和',reading:'しょうわ',part:'おわり'}];
