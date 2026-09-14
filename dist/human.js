import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';

// Authored CC0 skeletal clips. No procedural limb swinging on this character.
export async function createHuman(scene,onImpact){
 const loader=new GLTFLoader();
 const [asset,raw,hair]=await Promise.all([loader.loadAsync('./assets/human.gltf'),fetch('./assets/motions.json').then(r=>{if(!r.ok)throw Error('Animation load failed');return r.json();}),loader.loadAsync('./assets/hair.gltf')]);
 const model=asset.scene,holder=new T.Group();holder.add(model);scene.add(holder);holder.visible=false;
 model.updateMatrixWorld(true);model.add(hair.scene);model.updateMatrixWorld(true);model.getObjectByName('Head').attach(hair.scene);
 model.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;if(o.material?.name==='MI_Superhero_Male'){
  // A fitted training uniform, colored in bind pose so it deforms with the skin.
  const positions=o.geometry.attributes.position,colors=[];
  for(let i=0;i<positions.count;i++){const x=positions.getX(i),y=positions.getY(i);const skin=y>1.53||Math.abs(x)>.66;const color=new T.Color(skin?'#ffffff':y<.13?'#10151a':y<.96?'#27313b':'#364952');colors.push(color.r,color.g,color.b);}
  o.geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));o.material=o.material.clone();o.material.vertexColors=true;o.material.roughness=.85;
 }});
 const mixer=new T.AnimationMixer(model),actions={},impacts={};
 for(const clip of retargetClips(model,raw))actions[clip.name]=mixer.clipAction(clip);
 // Derive impact timing from the authored fist trajectory, rather than a timer fraction.
 for(const name of ['Punch_Jab','Punch_Cross','Melee_Hook']){const action=actions[name];action.reset().play();let far=-Infinity,at=0;const hand=model.getObjectByName(name==='Punch_Jab'?'hand_l':'hand_r'),pelvis=model.getObjectByName('pelvis');
 for(let i=0;i<=90;i++){action.time=action.getClip().duration*i/90;mixer.update(0);model.updateMatrixWorld(true);const reach=hand.getWorldPosition(new T.Vector3()).z-pelvis.getWorldPosition(new T.Vector3()).z;if(reach>far){far=reach;at=action.time;}}
 impacts[name]=at;action.stop();}
 holder.scale.setScalar(1.65);holder.position.set(0,0,.6);
 let current=null,mode='',elapsed=0,attack=0,hit=false,revengeTime=0,visible=false;
 function play(name,once=false,fade=.22){const next=actions[name];if(!next||next===current)return;next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).setLoop(once?T.LoopOnce:T.LoopRepeat,once?1:Infinity);next.clampWhenFinished=once;next.play();current?.crossFadeTo(next,fade,false);current=next;mode=name;elapsed=0;hit=false;}
 play('Idle_FoldArms_Loop');
 return {setVisible(v){visible=v;holder.visible=v;},revenge(){revengeTime=1.6;play('Hit_Head',true,.1);},update(dt,value,reduced){if(!visible)return;elapsed+=dt;revengeTime=Math.max(0,revengeTime-dt);
  const target=value>55?4.7:.6,distance=target-holder.position.z;const moving=Math.abs(distance)>.06;
  if(moving){holder.position.z+=Math.sign(distance)*Math.min(Math.abs(distance),dt*2.1);holder.rotation.y=T.MathUtils.damp(holder.rotation.y,distance<0?Math.PI:0,10,dt);if(!revengeTime)play('Walk_Loop',false,.25);}
  else{holder.rotation.y=T.MathUtils.damp(holder.rotation.y,0,10,dt);if(!revengeTime){if(value>85&&!reduced){if(!/^Punch_|Melee_/.test(mode)||elapsed>current.getClip().duration+.16){play(mode==='Melee_Hook'?'Melee_Hook_Rec':['Punch_Jab','Punch_Cross','Melee_Hook'][attack++%3],true,.12);}}
  else play(value>15?'Idle_No_Loop':'Idle_FoldArms_Loop',false,.35);}}
  mixer.update(dt);
  if(!moving&&value>85&&!reduced&&impacts[mode]!==undefined&&!hit&&current.time>=impacts[mode]){hit=true;onImpact('bang');}
 },getPosition(){return holder.position;},getHeight(){return 2.85;}};
}

export function retargetClips(model,raw){
 const result=[];for(const clip of raw){const tracks=[];for(const track of clip.tracks){const name=track.name.split('.')[0],bone=model.getObjectByName(name);if(!bone)continue;
  if(track.name.endsWith('.quaternion')){const correction=bone.quaternion.clone().multiply(new T.Quaternion(...track.restRotation).invert()),q=new T.Quaternion(),v=[];for(let i=0;i<track.values.length;i+=4){q.fromArray(track.values,i).premultiply(correction).normalize();v.push(q.x,q.y,q.z,q.w);}tracks.push(new T.QuaternionKeyframeTrack(track.name,track.times,v));}
  else{const rest=track.rest,v=track.values.map((x,i)=>x-rest[i%3]+bone.position.getComponent(i%3));tracks.push(new T.VectorKeyframeTrack(track.name,track.times,v));}
 }result.push(new T.AnimationClip(clip.name,-1,tracks));}return result;
}
