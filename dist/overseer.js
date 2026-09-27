import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';

// RobotExpressive: Tomas Laulhe / modifications Don McCurdy, CC0.
// Keep authored skeletal motion and animate facial morphs independently.
export async function createOverseer(scene,onImpact,variant='morrow',asset=null){
 asset ||= await new GLTFLoader().loadAsync('./assets/morrow/robot.glb');
 const model=asset.scene,root=new T.Group();root.add(model);scene.add(root);root.visible=false;
 model.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(model),scale=2.85/(bounds.max.y-bounds.min.y);model.scale.setScalar(scale);model.position.y=-bounds.min.y*scale;
 const shells=[],faces=[];let head,hand;
 model.traverse(o=>{if(o.isBone&&o.name==='Head')head=o;if(o.isBone&&o.name==='Palm2R')hand=o;if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;o.material=o.material.clone();if(o.material.name==='Main')shells.push(o.material);if(o.morphTargetDictionary)faces.push(o);o.material.roughness=.48;o.material.metalness=.22;});
 // Loader sanitizes dots from bone names; choose the visible hand as fallback.
 hand ||= model.getObjectByName('Hand_R')||model.getObjectByName('HandR')||model.getObjectByName('Hand.R');
 head ||= model.getObjectByName('Head');
 const armour=new T.MeshStandardMaterial({color:variant==='riot'?'#302c2d':'#eee4ce',metalness:.65,roughness:.35});
 // Riot has a bolted brow guard. Morrow retains the round, expressive face.
 if(variant==='riot'&&head){const guard=new T.Mesh(new T.BoxGeometry(.017,.0024,.0036),armour);guard.position.set(0,.006,.005);head.add(guard);}
 const mixer=new T.AnimationMixer(model),actions=Object.fromEntries(asset.animations.map(c=>[c.name,mixer.clipAction(c)]));
 let mode='',action,clock=0,revenge=0,visible=false,dodge=false,hit=false,wet=0,angry=0;const retiring=[];
 function play(name,once=false){if(mode===name)return;mode=name;clock=0;hit=false;const next=actions[name];next.reset().setLoop(once?T.LoopOnce:T.LoopRepeat,once?1:Infinity);next.clampWhenFinished=once;next.setEffectiveTimeScale(variant==='riot'?1.18:1);next.setEffectiveWeight(1).fadeIn(.2).play();if(action&&action!==next){action.fadeOut(.2);retiring.push({action,left:.21});}action=next;}
 // Locate the authored punch's furthest-forward hand position, not a guessed timer.
 let strike=.4;const punch=actions.Punch;let max=-Infinity;punch.play();for(let i=0;i<=100;i++){mixer.setTime(i*punch.getClip().duration/100);model.updateMatrixWorld(true);const p=(hand||head).getWorldPosition(new T.Vector3());if(p.z>max){max=p.z;strike=i*punch.getClip().duration/100;}}mixer.stopAllAction();mixer.setTime(0);
 function paint(id){const colors=variant==='riot'?{original:'#bd442b',ember:'#eb681f',arctic:'#75899b'}:{original:'#d3bc84',ember:'#be6e3e',arctic:'#a9c7c8'};shells.forEach(m=>m.color.set(colors[id]||colors.original));}
 paint('original');play('Idle');root.position.z=.6;
 return{setVisible(v){root.visible=visible=v;},setOutfit:paint,setDodge(v){dodge=v;},setWet(v){wet=v;},holdRevenge(){revenge=5;},revenge(){revenge=3.2;play('No',true);},getPosition(){return root.position;},getFacePose(){root.updateMatrixWorld(true);return{position:head.getWorldPosition(new T.Vector3()),rotation:head.getWorldQuaternion(new T.Quaternion())};},getState(){return{mode,angry,activeActions:mixer.stats.actions.inUse};},update(dt,value,reduced){if(!visible)return;clock+=dt;revenge=Math.max(0,revenge-dt);wet=Math.max(0,wet-dt*.12);for(let i=retiring.length-1;i>=0;i--){retiring[i].left-=dt;if(retiring[i].left<=0){if(retiring[i].action!==action)retiring[i].action.stop();retiring.splice(i,1);}}
 const target=value>55?4.1:value<18?.6:root.position.z,delta=target-root.position.z,moving=Math.abs(delta)>.04&&revenge===0;
 if(moving&&!reduced){root.position.z+=Math.sign(delta)*Math.min(Math.abs(delta),dt*(variant==='riot'?2.3:1.7));play('Walking');action.setEffectiveTimeScale(delta<0?-.85:variant==='riot'?1.18:1);}
 else if(!revenge){if(value>85&&!reduced){if(mode!=='Punch')play('Punch',true);else if(action.time>=action.getClip().duration){mode='';play('Punch',true);}}else play('Idle');}
 mixer.update(dt);angry=T.MathUtils.damp(angry,revenge?.15:value/100,7,dt);for(const f of faces){for(const [name,index]of Object.entries(f.morphTargetDictionary)){const target=name==='Angry'?angry:name==='Surprised'?(revenge?.85:Math.max(0,1-Math.abs(value-35)/20)*.5):name==='Sad'?(revenge?.35:0):0;f.morphTargetInfluences[index]=T.MathUtils.damp(f.morphTargetInfluences[index],target,9,dt);}}
 root.position.x=T.MathUtils.damp(root.position.x,dodge&&!reduced?Math.sin(mixer.time*3)*.62:0,10,dt);shells.forEach(m=>m.roughness=.48-wet*.26);
 if(mode==='Punch'&&!hit&&!reduced&&action.time>=strike){hit=true;root.updateMatrixWorld(true);onImpact('bang',{point:(hand||head).getWorldPosition(new T.Vector3()),side:'r'});}
 }};
}
