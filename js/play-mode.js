// Test play is opt-in per URL. Its records never share keys with normal play.
export const TEST_PREFIX='escape2026.testing.v1:';
export const TEST_FINAL_KEY='escape2026.testFinal.v1';
export const testPlay=new URLSearchParams(globalThis.location?.search||'').get('test')==='1';
export function createPlayStorage(source,test=false){
 const base=()=>typeof source==='function'?source():source;
 const key=name=>test?TEST_PREFIX+name:name;
 return {testPlay:test,scopeKey:key,getItem:name=>base().getItem(key(name)),setItem:(name,value)=>base().setItem(key(name),value),removeItem:name=>base().removeItem(key(name))};
}
export const gameStorage=createPlayStorage(()=>globalThis.localStorage,testPlay);
export const gameSession=createPlayStorage(()=>globalThis.sessionStorage,testPlay);
export function gameUrl(path,test=testPlay,base=globalThis.location?.href){
 if(!test)return path;
 const url=new URL(path,base);
 if(url.origin===new URL(base).origin&&/\/(?:start|rooms|room[1-8]|final-clues|ending)\.html$/.test(url.pathname))url.searchParams.set('test','1');
 return url.href;
}
export function playEventKey(key,test=testPlay){
 if(key===null)return null;
 if(test)return key.startsWith(TEST_PREFIX)?key.slice(TEST_PREFIX.length):undefined;
 return key.startsWith(TEST_PREFIX)?undefined:key;
}
export function onPlayStorage(callback){
 window.addEventListener('storage',event=>{const key=playEventKey(event.key);if(key!==undefined)callback({key,newValue:event.newValue,oldValue:event.oldValue});});
}
export function testFinalAt(storage=gameStorage){try{const value=Number(storage.getItem(TEST_FINAL_KEY));return Number.isFinite(value)&&value>0?value:NaN;}catch{return NaN;}}
export function clearTestRecords(local=globalThis.localStorage,session=globalThis.sessionStorage){
 for(const store of [local,session]){
  const keys=Array.from({length:store.length},(_,i)=>store.key(i)).filter(key=>key?.startsWith(TEST_PREFIX));
  for(const key of keys)store.removeItem(key);
 }
}
