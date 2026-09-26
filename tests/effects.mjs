import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {createRevengeFX} from '../dist/revenge-fx.js';
for(const type of ['pie','water','bucket']){
 const scene=new T.Scene();let hits=0;const fx=createRevengeFX(scene,()=>hits++);
 fx.start(type,()=>new T.Vector3(0,2.7,.6));fx.update(.1);assert.equal(hits,0);
 for(let i=0;i<50;i++)fx.update(.016);
 assert.equal(hits,1);assert.ok(fx.getState().particles>20);
 for(let i=0;i<320;i++)fx.update(.016);
 assert.equal(fx.getState().active,false);assert.equal(hits,1);
 fx.start(type,()=>new T.Vector3(0,2.7,.6),true);fx.update(.8);
 assert.equal(hits,2);assert.ok(fx.getState().particles<=120);
 scene.traverse(o=>{if(o.isMesh)assert.ok(o.position.toArray().every(Number.isFinite));});
}
console.log('PASS: pie/water/bucket contact once, visible particles, finite positions, cleanup and restart.');
