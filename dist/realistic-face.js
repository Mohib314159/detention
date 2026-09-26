import * as T from './vendor/three.module.js';
export const facePresets={vale:{label:'Vale · lean',age:.08,jawWidth:.12},warden:{label:'Warden · weathered',age:.78,jawWidth:.65},rook:{label:'Rook · broad',age:.25,jawWidth:1}};
export function expressionWeights(rage,time,blink=true){
 const a=T.MathUtils.clamp(rage,0,1),b=blink?Math.pow(Math.max(0,Math.cos((time%4.7-4.35)*Math.PI/.15)),12)*(time%4.7>4.2?1:0):0;
 return {browDownLeft:a*.82,browDownRight:a*.74,eyeSquintLeft:a*.26,eyeSquintRight:a*.3,noseSneerLeft:a*.32,noseSneerRight:a*.22,mouthPressLeft:a*.4,mouthPressRight:a*.4,mouthFrownLeft:a*.24,mouthFrownRight:a*.18,jawOpen:Math.max(0,a-.6)*(.3+.18*Math.sin(time*8)),eyeBlinkLeft:b,eyeBlinkRight:b};
}
export async function createRealisticFace({data=null,textures=true}={}){
 data??=await fetch('./assets/realistic/face.json').then(r=>{if(!r.ok)throw Error('Face geometry could not load');return r.json();});
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(data.positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(data.uv,2));geometry.setIndex(data.indices);geometry.computeVertexNormals();geometry.morphTargetsRelative=true;
 const names=Object.keys(data.morphs);geometry.morphAttributes.position=names.map(name=>{const a=new T.Float32BufferAttribute(data.morphs[name],3);a.name=name;return a;});
 // Lighting follows the expression, rather than retaining a frozen neutral normal field.
 geometry.morphAttributes.normal=names.map(name=>{const g=new T.BufferGeometry(),p=data.positions.map((v,i)=>v+data.morphs[name][i]);g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(data.indices);g.computeVertexNormals();const n=g.attributes.normal.array,base=geometry.attributes.normal.array,delta=new Float32Array(n.length);for(let i=0;i<n.length;i++)delta[i]=n[i]-base[i];g.dispose();return new T.BufferAttribute(delta,3);});
 const material=new T.MeshPhysicalMaterial({color:'#ffffff',roughness:.58,metalness:0,specularIntensity:.35,clearcoat:0});
 if(textures){const loader=new T.TextureLoader();const [map,normal]=await Promise.all([loader.loadAsync('./assets/realistic/skin.png'),loader.loadAsync('./assets/realistic/normal.png')]);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;material.map=map;material.normalMap=normal;material.normalScale.set(.4,.4);}
 const mesh=new T.Mesh(geometry,material),root=new T.Group();root.add(mesh);const eyes=[];
 for(const p of data.eyes){const eye=new T.Group();eye.position.fromArray(p);root.add(eye);const sclera=new T.Mesh(new T.SphereGeometry(.145,32,24),new T.MeshPhysicalMaterial({color:'#dad8ca',roughness:.22,clearcoat:1,clearcoatRoughness:.12}));eye.add(sclera);
 const iris=new T.Mesh(new T.SphereGeometry(.074,32,20),new T.MeshStandardMaterial({color:'#5c6550',roughness:.35}));iris.scale.z=.17;iris.position.z=.133;eye.add(iris);const pupil=new T.Mesh(new T.SphereGeometry(.028,24,16),new T.MeshPhysicalMaterial({color:'#080b09',roughness:.08,clearcoat:1}));pupil.scale.z=.2;pupil.position.z=.145;eye.add(pupil);eyes.push(eye);}
 let age=.08,jawWidth=.12,time=0;const weights=Object.fromEntries(names.map(n=>[n,0]));
 return {root,mesh,names,setIdentity(a,j){age=T.MathUtils.clamp(a,0,1);jawWidth=T.MathUtils.clamp(j,0,1);},update(dt,rage,{motion=true,blink=true}={}){time+=Math.min(dt,.1);const target={...expressionWeights(rage,time,blink),age,jawWidth};for(const name of names){weights[name]=T.MathUtils.damp(weights[name],target[name]||0,12,dt);mesh.morphTargetInfluences[mesh.morphTargetDictionary[name]]=weights[name];}root.rotation.y=motion?Math.sin(time*.49)*.025:0;root.rotation.x=motion?Math.sin(time*.8)*.012-rage*.018:0;for(const eye of eyes){eye.rotation.y=motion?Math.sin(time*.7)*.018:0;}},getState(){return {weights:{...weights},vertices:geometry.attributes.position.count,morphs:names.length};}};
}
