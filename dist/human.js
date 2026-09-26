import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';

// Authored CC0 skeletal clips. No procedural limb swinging on this character.
export async function createHuman(scene,onImpact,preloaded=null,variant='fighter'){
 const loader=new GLTFLoader();
 const [asset,raw,hair]=preloaded?[preloaded.asset,preloaded.raw,preloaded.hair]:await Promise.all([loader.loadAsync(variant==='rhea'?'./assets/rhea/human.gltf':'./assets/human.gltf'),fetch('./assets/motions.json').then(r=>{if(!r.ok)throw Error('Animation load failed');return r.json();}),loader.loadAsync(variant==='rhea'?'./assets/rhea/hair.gltf':'./assets/hair.gltf')]);
 const model=asset.scene,holder=new T.Group();holder.add(model);scene.add(holder);holder.visible=false;
 model.updateMatrixWorld(true);model.add(hair.scene);model.updateMatrixWorld(true);model.getObjectByName('Head').attach(hair.scene);
 model.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;if(o.material?.name?.startsWith('MI_Superhero_')){
  // A fitted training uniform, colored in bind pose so it deforms with the skin.
  const positions=o.geometry.attributes.position,colors=[];
  for(let i=0;i<positions.count;i++){const x=positions.getX(i),y=positions.getY(i);const skin=y>1.53||Math.abs(x)>.66;const color=new T.Color(skin?'#ffffff':y<.13?'#10151a':y<.96?'#27313b':'#364952');colors.push(color.r,color.g,color.b);}
  o.geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));o.material=o.material.clone();o.material.vertexColors=true;o.material.roughness=.85;
 }});
 const outfits=[];model.traverse(o=>{if(o.isMesh&&o.material?.vertexColors)outfits.push(o);});
 let facial=null;
 if(variant==='warden'){
  const {createRealisticFace}=await import('./realistic-face.js?v=16');facial=preloaded?.facial||await createRealisticFace();facial.setIdentity(.65,.65);
  // Keep the authored body rig and replace only its static head surface.
  hair.scene.visible=false;model.traverse(o=>{if(!o.isMesh)return;if(o.name==='Eyes'||o.name==='Eyebrows')o.visible=false;if(o.material?.name==='MI_Superhero_Male'){
   const g=o.geometry.clone(),p=g.attributes.position,idx=g.index?.array||Array.from({length:p.count},(_,i)=>i),kept=[];
   for(let i=0;i<idx.length;i+=3)if(Math.min(p.getY(idx[i]),p.getY(idx[i+1]),p.getY(idx[i+2]))<1.51)kept.push(idx[i],idx[i+1],idx[i+2]);g.setIndex(kept);o.geometry=g;
  }});
  const head=model.getObjectByName('Head'),mount=new T.Group();model.updateMatrixWorld(true);mount.quaternion.copy(head.getWorldQuaternion(new T.Quaternion()).invert());facial.root.scale.setScalar(.12);mount.add(facial.root);head.add(mount);
 }
 const wetMaterials=[];model.traverse(o=>{if(o.isMesh&&o.material?.isMeshStandardMaterial)wetMaterials.push({material:o.material,roughness:o.material.roughness});});let wetness=0;
 const headBone=model.getObjectByName('Head');holder.updateMatrixWorld(true);const headRest=headBone.getWorldQuaternion(new T.Quaternion()).invert();
 const mixer=new T.AnimationMixer(model),actions={},impacts={};
 for(const clip of retargetClips(model,raw))actions[clip.name]=mixer.clipAction(clip);
 // Derive impact timing from the authored fist trajectory, rather than a timer fraction.
 for(const name of ['Punch_Jab','Punch_Cross','Melee_Hook']){const action=actions[name];action.reset().play();let far=-Infinity,at=0;const hand=model.getObjectByName(name==='Punch_Jab'?'hand_l':'hand_r'),pelvis=model.getObjectByName('pelvis');
 for(let i=0;i<=90;i++){action.time=action.getClip().duration*i/90;mixer.update(0);model.updateMatrixWorld(true);const reach=hand.getWorldPosition(new T.Vector3()).z-pelvis.getWorldPosition(new T.Vector3()).z;if(reach>far){far=reach;at=action.time;}}
 impacts[name]=at;action.stop();}
 holder.scale.setScalar(1.65);holder.position.set(0,0,.6);
 let dodge=0,dodgeClock=0,dodgeEnabled=false;
 let current=null,mode='',elapsed=0,attack=0,hit=false,revengeTime=0,visible=false,approaching=false;const fading=[];
 function play(name,once=false,fade=.22){const next=actions[name];if(!next||next===current)return;next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).setLoop(once?T.LoopOnce:T.LoopRepeat,once?1:Infinity);next.clampWhenFinished=once;next.play();if(current){current.crossFadeTo(next,fade,false);fading.push({action:current,remaining:fade+.03});}current=next;mode=name;elapsed=0;hit=false;}
 play('Idle_FoldArms_Loop');
 return {setOutfit(id){for(const o of outfits){const p=o.geometry.attributes.position,c=o.geometry.attributes.color;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);const color=new T.Color(y>1.53||Math.abs(x)>.66?'#ffffff':y<.13?'#10151a':y<.96?'#27313b':({original:'#364952',ember:'#9c4938',arctic:'#8299a3'}[id]||'#364952'));c.setXYZ(i,color.r,color.g,color.b);}c.needsUpdate=true;}},setDodge(enabled,phase=0){dodgeEnabled=enabled;dodgeClock=phase;},setVisible(v){visible=v;holder.visible=v;},holdRevenge(){revengeTime=4.8;play('Idle_FoldArms_Loop',false,.15);},setWet(amount){wetness=Math.max(0,Math.min(1,amount));},revenge(){revengeTime=4.2;play('Hit_Head',true,.1);},update(dt,value,reduced){if(!visible)return;for(let i=fading.length-1;i>=0;i--){fading[i].remaining-=dt;if(fading[i].remaining<=0){if(fading[i].action!==current)fading[i].action.stop();fading.splice(i,1);}}elapsed+=dt;revengeTime=Math.max(0,revengeTime-dt);
  if(value>55)approaching=true;else if(value<18)approaching=false;const target=approaching?4.7:.6,distance=target-holder.position.z;const moving=Math.abs(distance)>.06&&revengeTime<=0;
  if(moving){holder.position.z+=Math.sign(distance)*Math.min(Math.abs(distance),dt*(distance>0?2.1:1.5));holder.rotation.y=T.MathUtils.damp(holder.rotation.y,0,10,dt);if(!revengeTime){play('Walk_Loop',false,.25);current.setEffectiveTimeScale(distance>0?1:-.8);}}
  else{holder.rotation.y=T.MathUtils.damp(holder.rotation.y,0,10,dt);if(!revengeTime){if(value>85&&!reduced){if(!/^Punch_|Melee_/.test(mode)||elapsed>current.getClip().duration+.16){play(mode==='Melee_Hook'?'Melee_Hook_Rec':['Punch_Jab','Punch_Cross','Melee_Hook'][attack++%3],true,.12);}}
  else play(value>15?'Idle_No_Loop':'Idle_FoldArms_Loop',false,.35);}}
  if(revengeTime>0&&mode==='Hit_Head'&&elapsed>current.getClip().duration-.12)play('Idle_No_Loop',true,.3);
  if(revengeTime>0&&mode==='Idle_No_Loop'&&elapsed>current.getClip().duration-.15)play('Idle_FoldArms_Loop',false,.4);
  wetness=Math.max(0,wetness-dt*.12);for(const item of wetMaterials)item.material.roughness=T.MathUtils.lerp(item.roughness,.22,wetness);
  mixer.update(dt);
  facial?.update(dt,value/100,{motion:!reduced,blink:true});
  if(dodgeEnabled)dodgeClock+=dt;dodge=T.MathUtils.damp(dodge,dodgeEnabled&&!reduced?Math.sin(dodgeClock*2.6)*.62:0,12,dt);holder.position.x=dodge;holder.rotation.z=0;const spine=model.getObjectByName('spine_03');if(spine)spine.rotateZ(-dodge*.25);
  if(!moving&&value>85&&!reduced&&impacts[mode]!==undefined&&!hit&&current.time>=impacts[mode]){hit=true;holder.updateMatrixWorld(true);const side=mode==='Punch_Jab'?'l':'r';onImpact('bang',{point:model.getObjectByName('hand_'+side).getWorldPosition(new T.Vector3()),side});}
 },getFacePose(){holder.updateMatrixWorld(true);const rotation=headBone.getWorldQuaternion(new T.Quaternion()).multiply(headRest);return {position:headBone.getWorldPosition(new T.Vector3()).add(new T.Vector3(0,.18,.10).applyQuaternion(rotation)),rotation};},getHeadPosition(){model.updateMatrixWorld(true);return model.getObjectByName('Head').getWorldPosition(new T.Vector3());},getPosition(){return holder.position;},getHeight(){return 2.85;},getState(){return {mode,wetness,activeActions:mixer.stats.actions.inUse,pendingFades:fading.length};}};
}

export function retargetClips(model,raw){
 const result=[];for(const clip of raw){const tracks=[];for(const track of clip.tracks){const name=track.name.split('.')[0],bone=model.getObjectByName(name);if(!bone)continue;
  if(track.name.endsWith('.quaternion')){const correction=bone.quaternion.clone().multiply(new T.Quaternion(...track.restRotation).invert()),q=new T.Quaternion(),v=[];for(let i=0;i<track.values.length;i+=4){q.fromArray(track.values,i).premultiply(correction).normalize();v.push(q.x,q.y,q.z,q.w);}tracks.push(new T.QuaternionKeyframeTrack(track.name,track.times,v));}
  else{const rest=track.rest,v=track.values.map((x,i)=>x-rest[i%3]+bone.position.getComponent(i%3));tracks.push(new T.VectorKeyframeTrack(track.name,track.times,v));}
 }result.push(new T.AnimationClip(clip.name,-1,tracks));}return result;
}
