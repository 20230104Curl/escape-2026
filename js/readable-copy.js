const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Keep the wording intact while separating sentences and selected phrase boundaries.
export function readableCopy(value,breakAfter=[]){
 let copy=String(value);
 for(const phrase of breakAfter)copy=copy.replaceAll(phrase,phrase+'\n');
 return copy.split(/<br\s*\/?>|\n|(?<=[。！？])(?=[^」』）])/u).filter(Boolean).map(escapeHTML).join('<br>');
}
