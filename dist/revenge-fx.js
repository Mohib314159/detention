import * as T from './vendor/three.module.js';
import {makeLiquidSheet,liquidMaterial} from './liquid-sheets.js?v=23';

// Bounded reusable particles. Contact, sound and recoil share one event.
export function createRevengeFX(scene, onContact = () => {}) {
  const group = new T.Group(); scene.add(group); group.visible = false;
  const cream = new T.MeshStandardMaterial({color:'#fff5dc',roughness:.65});
  const crust = new T.MeshStandardMaterial({color:'#c88436',roughness:.85});
  const water = new T.MeshStandardMaterial({color:'#c6e3e7',roughness:.15,metalness:.15,transparent:true,opacity:.45,depthWrite:false});
  const sphere = new T.SphereGeometry(1,10,8), shard = new T.TetrahedronGeometry(1);
  function mesh(geometry, material, parent=group) { const m=new T.Mesh(geometry,material);parent.add(m);return m; }
  const particles=Array.from({length:120},(_,i)=>{const m=mesh(i%4===0?shard:sphere,cream);m.visible=false;return {m,v:new T.Vector3(),age:0,life:0,size:0};});
  let cursor=0,age=10,type='pie',target=null,orientation=null,contact=false,reduced=false,emit=0;
  const pie=new T.Group();group.add(pie);
  const base=mesh(new T.CylinderGeometry(.32,.28,.08,32),crust,pie);base.rotation.x=Math.PI/2;
  const filling=mesh(sphere,cream,pie);filling.scale.set(.30,.30,.12);filling.position.z=-.055;
  const splashMaterial=liquidMaterial(),smearMaterial=liquidMaterial(true),streamMaterial=liquidMaterial();streamMaterial.uniforms.stream.value=1;
  const splash=makeLiquidSheet(splashMaterial),smear=makeLiquidSheet(smearMaterial),flow=makeLiquidSheet(streamMaterial,{radial:false,sectors:12,rows:32});
  group.add(splash.mesh,smear.mesh,flow.mesh);
  const residue=new T.Group();group.add(residue);residue.add(smear.mesh);
  // Uneven cream clumps give the impact volume instead of a flat circular sticker.
  for(let i=0;i<17;i++){
    const a=i*2.39996,r=.06+Math.sqrt(i/17)*.14;
    const lump=mesh(sphere,cream,residue);lump.position.set(Math.cos(a)*r,Math.sin(a)*r*.85,.24);
    const size=.035+(i%4)*.012;lump.scale.set(size*1.2,size,.028+(i%3)*.012);
  }
  const creamDrips=Array.from({length:5},(_,i)=>{
    const drip=mesh(new T.CapsuleGeometry(.009,.12,4,8),cream,residue);
    drip.position.set((i-2)*.067,-.10,.25);return drip;
  });
  const runoff=Array.from({length:3},()=>{
    const material=liquidMaterial();material.uniforms.stream.value=1;
    const sheet=makeLiquidSheet(material,{radial:false,sectors:8,rows:20});group.add(sheet.mesh);return sheet;
  });
  const vessel=new T.Group();group.add(vessel);
  mesh(new T.CylinderGeometry(.29,.22,.44,24,1,true),new T.MeshStandardMaterial({color:'#b7c5cb',metalness:.75,roughness:.3,side:T.DoubleSide}),vessel);
  const rim=mesh(new T.TorusGeometry(.29,.025,8,32),vessel.children[0].material,vessel);rim.rotation.x=Math.PI/2;rim.position.y=.22;
  mesh(new T.CylinderGeometry(.22,.22,.025,24),vessel.children[0].material,vessel).position.y=-.22;
  const lip=new T.Vector3(),localLip=new T.Vector3(-.29,.22,0);
  const puddle=mesh(new T.CircleGeometry(1,40),water);puddle.rotation.x=-Math.PI/2;puddle.position.y=.015;
  const face=new T.Vector3(),start=new T.Vector3(),up=new T.Vector3(0,1,0);
  function spawn(pos,v,size,life,material,stretch=1){const p=particles[cursor++%particles.length];p.m.visible=true;p.m.material=material;p.m.position.copy(pos);p.v.copy(v);p.age=0;p.life=life;p.size=size;p.stretch=stretch;p.m.scale.set(size,size*stretch,size);}
  function burst(count,isWater){for(let i=0;i<count;i++){const a=i*2.39996,s=.6+((i*37)%19)/19*2.1;spawn(face,new T.Vector3(Math.cos(a)*s,.35+Math.sin(a)*s, .15+((i*13)%17)/17*1.8),isWater?.008+(i%4)*.004:.012+(i%5)*.007,1.3+(i%4)*.18,isWater?water:i%4===0?crust:cream,isWater?1.8:1);}}
  return {
    start(kind,getTarget,lowMotion=false,getOrientation=null){type=kind;target=getTarget;orientation=getOrientation;reduced=lowMotion;age=0;emit=0;contact=false;cursor=0;group.visible=true;particles.forEach(p=>p.m.visible=false);face.copy(target());start.copy(face).add(new T.Vector3(.6,.25,5));},
    update(dt){if(age>=4.8)return;age+=dt;face.copy(target());
      const wet=type!=='pie',hitAt=wet?.65:.48;
      if(!contact&&age>=hitAt){contact=true;onContact();burst(reduced?8:wet?44:32,wet);}
      pie.visible=!wet&&age<hitAt+1.0;
      if(pie.visible&&age<hitAt){const t=Math.min(age/hitAt,1);pie.position.lerpVectors(start,face,t);pie.position.y+=Math.sin(t*Math.PI)*.3;pie.rotation.set(0,0,reduced?0:t*4);}
      const impactAge=Math.max(0,age-hitAt);
      filling.visible=age<hitAt;
      if(!wet&&contact){pie.position.copy(face).add(new T.Vector3(.22*impactAge,-.3*impactAge-2.8*impactAge*impactAge,.22+impactAge*.6));pie.rotation.set(impactAge*3,0,impactAge*2);}

      residue.visible=!wet&&contact&&age<4.5;residue.position.copy(face);residue.quaternion.copy(orientation?orientation():new T.Quaternion());
      smear.mesh.visible=true;smear.update(impactAge,false,true);smearMaterial.uniforms.clock.value=0;smearMaterial.uniforms.fade.value=Math.min(1,(4.5-age)*2);
      for(let i=0;i<creamDrips.length;i++){const d=creamDrips[i],length=Math.max(0,Math.min(1,(impactAge-.4-i*.08)*.55));d.visible=length>0&&age<4;d.scale.y=length;d.position.y=-.10-length*.09;}
      const splashAge=impactAge;
      const sheetLife=wet?.7:.46;splash.mesh.visible=contact&&splashAge<sheetLife;
      splash.mesh.position.copy(face);splash.update(splashAge,wet);splashMaterial.uniforms.cream.value=wet?0:1;splashMaterial.uniforms.clock.value=splashAge;splashMaterial.uniforms.fade.value=Math.min(1,(sheetLife-splashAge)*7);
      const pouring=wet&&age>.35&&age<(type==='bucket'?2.5:1.65);
      vessel.visible=wet&&age<3;
      const tilt=T.MathUtils.smoothstep(age,0,.55)*(age>2.5?Math.max(0,(3-age)/.5):1);
      vessel.position.copy(face).add(new T.Vector3(.35,1.15,.04));vessel.rotation.z=tilt*1.85;
      vessel.updateMatrixWorld(true);lip.copy(localLip).applyMatrix4(vessel.matrixWorld);
      flow.mesh.visible=pouring;flow.mesh.position.set(0,0,0);streamMaterial.uniforms.clock.value=age;
      // The first row is attached to the transformed rim, never an independent screen offset.
      const pos=flow.mesh.geometry.attributes.position,cols=13,rows=32,front=Math.min(1,Math.max(0,(age-.35)/.30));
      for(let y=0;y<=rows;y++)for(let x=0;x<cols;x++){
        const t=y/rows*front,w=(type==='bucket'?.10:.055)*(1-.35*t),side=(x/12-.5)*2;
        pos.setXYZ(y*cols+x,lip.x+(face.x-lip.x)*t+side*w,
          lip.y+(face.y-lip.y)*t*t,
          lip.z+(face.z+.12-lip.z)*t+.012*Math.sin(t*25-age*18)*Math.sin(t*Math.PI));
      }
      pos.needsUpdate=true;flow.mesh.geometry.computeVertexNormals();
      for(let i=0;i<runoff.length;i++){
        const sheet=runoff[i],side=i-1;
        sheet.mesh.visible=wet&&contact&&age<3.5;
        sheet.mesh.position.copy(face).add(new T.Vector3(side*.13,-.82,.16));
        sheet.mesh.scale.set(.10,.65,1);sheet.mesh.rotation.z=side*.24;sheet.update(age+i*.6,true);
        sheet.mesh.material.uniforms.clock.value=age;
        sheet.mesh.material.uniforms.fade.value=Math.min(1,impactAge*5)*Math.max(0,Math.min(1,(3.5-age)*1.5));
      }
      puddle.visible=wet&&age>1;puddle.position.x=face.x;puddle.position.z=face.z;puddle.scale.setScalar(Math.min(1.1,(age-1)*.5));
      if(pouring&&contact){emit+=dt;while(emit>1/36){emit-=1/36;const a=cursor*2.39996;spawn(face,new T.Vector3(Math.sin(a)*(.3+(cursor%7)*.17),.3+Math.cos(a)*.7,Math.cos(a)*(.2+(cursor%5)*.15)),.011,1.7,water,2.4);}}
      for(const p of particles){if(!p.m.visible)continue;p.age+=dt;if(p.age>=p.life){p.m.visible=false;continue;}p.v.y-=dt*4.5;p.m.position.addScaledVector(p.v,dt);if(p.m.material===water)p.m.quaternion.setFromUnitVectors(up,p.v.clone().normalize());else{p.m.rotation.x+=dt*3;p.m.rotation.z+=dt*2;}const size=p.size*Math.min(1,(p.life-p.age)*4);p.m.scale.set(size,size*p.stretch,size);if(p.m.position.y<.03){p.m.position.y=.03;p.v.multiplyScalar(.6);p.v.y=Math.abs(p.v.y)*.18;}}
      if(age>=4.8)group.visible=false;
    },
    getState(){return {active:group.visible,contact,particles:particles.filter(p=>p.m.visible).length,age,lip:lip.toArray(),streamStart:flow.mesh.geometry.attributes.position.array.slice(18,21),pouring:flow.mesh.visible};}
  };
}
