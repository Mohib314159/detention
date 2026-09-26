import * as T from './vendor/three.module.js';
import {createRealisticFace,facePresets} from './realistic-face.js?v=16';
const $=s=>document.querySelector(s),host=$('#stage');let renderer;
try{
renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;host.prepend(renderer.domElement);
const scene=new T.Scene();scene.background=new T.Color('#151e1b');const camera=new T.PerspectiveCamera(34,1,.1,100);camera.position.set(0,.35,5.3);camera.lookAt(0,.22,.35);
scene.add(new T.HemisphereLight('#d9e8ed','#343c2f',1.6));const key=new T.DirectionalLight('#ffe5d0',2.7);key.position.set(-3,3,4);scene.add(key);const fill=new T.DirectionalLight('#bdcfdf',1);fill.position.set(3,1,2);scene.add(fill);const rim=new T.DirectionalLight('#e6e5cb',2);rim.position.set(1,3,-2);scene.add(rim);
const face=await createRealisticFace();const pivot=new T.Group();pivot.add(face.root);scene.add(pivot);$('#status').textContent='MakeHuman study · 54 facial / identity controls · local rendering';
$('#motion').checked=!matchMedia('(prefers-reduced-motion: reduce)').matches;
let cycle=false,elapsed=0,last=performance.now();
const identity=()=>face.setIdentity(Number($('#age').value),Number($('#jaw').value));$('#age').oninput=identity;$('#jaw').oninput=identity;$('#identity').onchange=()=>{const p=facePresets[$('#identity').value];$('#age').value=p.age;$('#jaw').value=p.jawWidth;identity();};
$('#cycle').onclick=()=>{cycle=!cycle;elapsed=0;$('#cycle').textContent=cycle?'Pause build-up':'Play rage build-up';};$('#neutral').onclick=()=>{cycle=false;$('#rage').value=0;$('#cycle').textContent='Play rage build-up';};$('#rage').oninput=()=>{cycle=false;$('#cycle').textContent='Play rage build-up';};
new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}).observe(host);
renderer.setAnimationLoop(now=>{const dt=Math.min((now-last)/1000,.06);last=now;if(document.hidden)return;if(cycle){elapsed+=dt;$('#rage').value=(1-Math.cos(elapsed*.65))/2;}const rage=Number($('#rage').value);$('#rage-label').textContent=rage<.2?'Calm':rage<.55?'Suspicious':rage<.8?'Furious':'Raging';pivot.rotation.y=Number($('#angle').value)*Math.PI/180;face.update(dt,rage,{motion:$('#motion').checked,blink:$('#blink').checked});renderer.render(scene,camera);});
}catch(error){console.error(error);$('#status').textContent='The facial study could not load. Refresh to retry; your classroom and saved progress are unchanged.';renderer?.dispose();}
