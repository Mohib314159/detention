import fs from 'node:fs';
import * as T from '../dist/vendor/three.module.js';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {createOverseer} from '../dist/overseer.js';
import assert from 'node:assert/strict';
const data=fs.readFileSync('dist/assets/morrow/robot.glb');
for(const variant of ['morrow','riot']){
const asset=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');
let hits=0;const character=await createOverseer(new T.Scene(),(kind,detail)=>{assert(detail.point.toArray().every(Number.isFinite));hits++},variant,asset);character.setVisible(true);
for(let i=0;i<900;i++)character.update(1/60,100,false);
assert(hits>=3,variant+' punches');assert(character.getState().angry>.9);assert(character.getState().activeActions<=2);
for(let i=0;i<600;i++)character.update(1/60,0,false);
assert(Math.abs(character.getPosition().z-.6)<.08);assert(character.getState().angry<.01);
const previous=hits;for(let i=0;i<600;i++)character.update(1/60,100,true);assert.equal(hits,previous);
character.holdRevenge();character.revenge();for(let i=0;i<300;i++)character.update(1/60,0,false);assert.equal(character.getState().mode,'Idle');
console.log('PASS',variant,'authored punches',hits,'recovery, facial expression, reduced motion, action cleanup');
}
