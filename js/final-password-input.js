import {FINAL_INPUT,FINAL_MANUAL_POSITION} from './story-flow.js?v=2026-10-16-web-17';

export const needsFinalPlacement=(state,letters)=>!state.submitted&&letters.length>0&&!state.fragmentsPlaced;
export const finalInputSlots=state=>Array.from({length:FINAL_INPUT.length},(_,index)=>state.draft[index]&&state.draft[index]!==' '?state.draft[index]:'');
export const nextFinalPosition=state=>finalInputSlots(state).findIndex(letter=>!letter);
export const finalInputComplete=state=>state.draft.length===FINAL_INPUT.length&&!/\s/.test(state.draft);
const saveSlots=(state,slots)=>{state.draft=slots.map(letter=>letter||' ').join('').trimEnd();};
export function foundFinalPositions(letters){
 const remaining=letters.map(letter=>letter.replace(/[ァ-ヶ]/g,char=>String.fromCharCode(char.charCodeAt(0)-0x60)));
 return [...FINAL_INPUT].flatMap((letter,index)=>{if(index===FINAL_MANUAL_POSITION)return [];const found=remaining.indexOf(letter);if(found<0)return [];remaining.splice(found,1);return [index];});
}
export function placeFinalFragments(state,letters){
 if(state.submitted||state.fragmentsPlaced)return false;
 const positions=foundFinalPositions(letters);if(!positions.length)return false;
 const slots=finalInputSlots(state);for(const index of positions)slots[index]=FINAL_INPUT[index];
 state.fragmentsPlaced=true;saveSlots(state,slots);return true;
}
export function enterFinalLetter(state,letter){
 const index=nextFinalPosition(state);if(state.submitted||index<0||!/^([ぁ-ゖ]|ー)$/.test(letter))return false;
 const slots=finalInputSlots(state);slots[index]=letter;saveSlots(state,slots);return true;
}
export function editableFinalPositions(state,letters){
 const provided=state.fragmentsPlaced?foundFinalPositions(letters):[];
 return finalInputSlots(state).flatMap((letter,index)=>letter&&!provided.includes(index)?[index]:[]);
}
export function eraseFinalLetters(state,letters,{all=false}={}){
 if(state.submitted)return false;
 const editable=editableFinalPositions(state,letters);if(!editable.length)return false;
 const slots=finalInputSlots(state);for(const index of all?editable:editable.slice(-1))slots[index]='';
 saveSlots(state,slots);return true;
}
