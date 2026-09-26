import * as T from './vendor/three.module.js';
export const environments=[
 {id:'classroom',name:'Detention hall',description:'Warm wood. Chalk dust. Bad memories.'},
 {id:'gym',name:'After-hours gym',description:'Concrete, boxing ropes and amber lights.'},
 {id:'rooftop',name:'Midnight rooftop',description:'An open skyline under a deep blue sky.'}
];
export function createEnvironments(scene){
 const gym=new T.Group(),rooftop=new T.Group();scene.add(gym,rooftop);gym.visible=rooftop.visible=false;
 const material=(color,roughness=.85)=>new T.MeshStandardMaterial({color,roughness});
 const concrete=material('#3e484c'),black=material('#19252c'),canvas=material('#59676d'),amber=new T.MeshBasicMaterial({color:'#efc080'}),blue=new T.MeshBasicMaterial({color:'#8ab4c6'});
 function box(parent,w,h,d,x,y,z,mat){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.receiveShadow=true;m.castShadow=true;parent.add(m);return m;}
 function pole(parent,a,b,r,mat){const start=new T.Vector3(...a),end=new T.Vector3(...b),m=new T.Mesh(new T.CylinderGeometry(r,r,start.distanceTo(end),12),mat);m.position.copy(start.clone().add(end).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),end.sub(start).normalize());parent.add(m);return m;}
 box(gym,20,.2,20,0,-.16,0,concrete);box(gym,20,8,.3,0,3.9,-4.2,concrete);
 for(const x of [-7,-3.5,3.5,7]){box(gym,.18,8,.4,x,3.9,-3.9,black);box(gym,2.4,2.1,.1,x,4.5,-3.96,black);for(let j=0;j<3;j++)box(gym,.62,1.84,.11,x+(j-1)*.76,4.5,-3.88,blue);}
 box(gym,6.3,.12,9.7,0,-.01,1.5,canvas);
 const rope=material('#a26747');for(const x of [-3.2,3.2]){for(const z of [-2.9,6])pole(gym,[x,0,z],[x,1.75,z],.075,black);for(const y of [.6,1.05,1.5])pole(gym,[x,y,-2.9],[x,y,6],.028,rope);}
 for(const x of [-5.3,5.3]){pole(gym,[x,5,-2],[x,3.3,-2],.018,black);const bag=new T.Mesh(new T.CapsuleGeometry(.38,1.3,6,18),material('#6b392b'));bag.position.set(x,2.3,-2);gym.add(bag);box(gym,1.8,.06,.5,x,5.6,-1.8,amber);}
 box(rooftop,24,.2,23,0,-.16,0,material('#263942'));box(rooftop,20,.8,.22,0,.3,-4.3,black);
 const building=material('#14232f');
 for(let i=0;i<25;i++){const x=(i-12)*1.4,h=2+((i*17)%11)*.45,z=-7-(i%3)*1.7;box(rooftop,1.15,h,1.5,x,h/2-.5,z,building);for(let row=0;row<Math.floor(h/.5);row++)for(let col=0;col<3;col++){if((i*7+row*3+col)%5<2)continue;box(rooftop,.13,.20,.025,x+(col-1)*.29,row*.5+.2,z+.77,(i+row)%4===0?amber:blue);}}
 const moon=new T.Mesh(new T.SphereGeometry(.65,24,16),new T.MeshBasicMaterial({color:'#d8e5e4'}));moon.position.set(5.5,7,-12);rooftop.add(moon);
 const points=[];for(let i=0;i<90;i++)points.push(Math.sin(i*127.1)*18,5+(i*7%19)*.5,-14-(i%5));const stars=new T.Points(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(points,3)),new T.PointsMaterial({color:'#b9d0df',size:.025}));rooftop.add(stars);
 for(const x of [-4,4]){pole(rooftop,[x,0,-3],[x,2,-3],.025,black);box(rooftop,.14,.3,.14,x,2,-3,amber);}
 return {set(id){gym.visible=id==='gym';rooftop.visible=id==='rooftop';},groups:{gym,rooftop}};
}
