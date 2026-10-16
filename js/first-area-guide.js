export const FIRST_GUIDE_KEY='escape2026.firstAreaGuide.v1';
export function readFirstGuide(storage){
 try{const saved=JSON.parse(storage.getItem(FIRST_GUIDE_KEY));return saved?.version===1&&Number.isInteger(saved.room)&&saved.room>=1&&saved.room<=8&&['area','start','question','done'].includes(saved.step)?saved:null;}catch{return null;}
}
function writeGuide(storage,guide){try{storage.setItem(FIRST_GUIDE_KEY,JSON.stringify(guide));}catch{}return guide;}
export function prepareFirstGuide(storage,rooms,firstRoom=1){
 const saved=readFirstGuide(storage);if(saved)return saved;
 const inProgress=rooms.some(room=>room.state.started||room.state.solved.length>0);
 return writeGuide(storage,{version:1,room:firstRoom,step:inProgress?'done':'area'});
}
export function advanceFirstGuide(storage,room,step){
 const guide=readFirstGuide(storage);if(!guide||guide.step==='done')return;
 if(step!=='start'&&guide.room!==room)return;
 return writeGuide(storage,{version:1,room,step});
}
export function renderFirstRoomGuide(storage,room,view){
 const guide=readFirstGuide(storage);if(!guide||guide.room!==room||guide.step==='done')return '';
 const action=view==='welcome'?'start':view==='room'?'question':null;if(!action)return '';
 return `<p class="first-play-guide" data-guide-action="${action}" role="status"><span aria-hidden="true">${action==='start'?'②':'③'}</span><strong>${action==='start'?'「ナゾに挑む」を押してみよう！':'まずは、①のナゾを押してみよう！'}</strong></p>`;
}
