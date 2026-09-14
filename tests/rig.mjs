import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {retargetClips} from '../dist/human.js';
globalThis.ProgressEvent=class {constructor(type,data){Object.assign(this,{type},data);}};
const json=JSON.parse(fs.readFileSync('dist/assets/human.gltf','utf8'));
for(const b of json.buffers)b.uri='data:application/octet-stream;base64,'+fs.readFileSync('dist/assets/'+b.uri).toString('base64');
json.images=[];json.textures=[];json.materials=json.materials.map(m=>({name:m.name}));
const asset=await new GLTFLoader().parseAsync(JSON.stringify(json),'');
const raw=JSON.parse(fs.readFileSync('dist/assets/motions.json','utf8'));
const clips=retargetClips(asset.scene,raw),mixer=new T.AnimationMixer(asset.scene);
assert.equal(clips.length,15);
for(const name of ['Punch_Jab','Punch_Cross','Melee_Hook','Walk_Loop','Idle_FoldArms_Loop']){
 const clip=clips.find(c=>c.name===name);assert(clip);assert(clip.tracks.some(t=>t.name.includes('index_01')),'Finger animation exists');
 const action=mixer.clipAction(clip).play(),hand=asset.scene.getObjectByName('hand_r');let min=Infinity,max=-Infinity,low=Infinity,high=-Infinity;
 for(let i=0;i<=60;i++){mixer.setTime(i*clip.duration/60);asset.scene.updateMatrixWorld(true);const point=hand.getWorldPosition(new T.Vector3());assert(point.toArray().every(Number.isFinite));min=Math.min(min,point.z);max=Math.max(max,point.z);low=Math.min(low,point.y);high=Math.max(high,point.y);}
 console.log(name, 'duration',clip.duration.toFixed(2),'right hand forward range',min.toFixed(2),max.toFixed(2),'height',low.toFixed(2),high.toFixed(2));
 action.stop();
}
console.log('PASS: all core clips bind to the real skeleton, including fingers, with finite hand motion. Visual QA remains separate.');
