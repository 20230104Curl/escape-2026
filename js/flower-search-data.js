export const FLOWER_GRID=['ひりわまひ','さくららき','めすみれば','あじさいつ','ぽぽんたき'].map(row=>[...row]);
export const FLOWER_WORDS=['さくら','つばき','すみれ','ひまわり','あじさい','たんぽぽ'];
export const FLOWER_DIRECTIONS=[[0,1],[0,-1],[1,0],[-1,0]];
export function flowerMarks(value){
 return Array.isArray(value)?[...new Set(value.filter(i=>Number.isInteger(i)&&i>=0&&i<FLOWER_GRID.flat().length))]:[];
}
