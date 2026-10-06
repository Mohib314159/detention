import * as T from './vendor/three.module.js';

// Continuous surfaces carry the liquid silhouette; spray only supplies detail.
export function makeLiquidSheet(material, {radial=true, sectors=72, rows=12}={}) {
  const geometry=new T.BufferGeometry(),positions=new Float32Array((sectors+1)*(rows+1)*3),uvs=[],indices=[];
  for(let y=0;y<=rows;y++)for(let x=0;x<=sectors;x++){
    uvs.push(x/sectors,y/rows);
    if(x<sectors&&y<rows){const a=y*(sectors+1)+x,b=a+sectors+1;indices.push(a,b,a+1,a+1,b,b+1);}
  }
  geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);
  const mesh=new T.Mesh(geometry,material);mesh.frustumCulled=false;
  function update(t,water=true,settled=false){
    for(let y=0;y<=rows;y++)for(let x=0;x<=sectors;x++){
      const u=x/sectors,v=y/rows,a=u*Math.PI*2,i=(y*(sectors+1)+x)*3;
      if(radial){
        const lobes=1+.13*Math.sin(a*7+1)+.09*Math.sin(a*13)+.055*Math.sin(a*23+2);
        const radius=settled?.22:(water?.18:.16)+Math.min(t,.5)*(water?1.7:1.05);
        const r=v*radius*(1+(lobes-1)*v*v*(settled?.85:1));
        positions[i]=Math.cos(a)*r;
        positions[i+1]=Math.sin(a)*r*(water?.37:.8)-(settled?Math.max(0,t-1)*.015*v:1.5*t*t*v);
        positions[i+2]=settled?.21+.08*(1-v*v):.15+Math.sin(v*Math.PI)*.13+v*v*(water?.25:.14)*Math.sin(a*5+t*7);
      }else{
        const width=(.07+.055*v)*(1+.18*Math.sin(v*23-t*19));
        positions[i]=(u-.5)*width*2+Math.sin(v*8-t*4)*.025*v;
        positions[i+1]=(1-v)*1.0;
        positions[i+2]=.06*Math.sin(u*Math.PI)+.025*Math.sin(v*21-t*15);
      }
    }
    geometry.attributes.position.needsUpdate=true;geometry.computeVertexNormals();
  }
  update(0);return {mesh,update};
}

export function liquidMaterial(cream=false){
 return new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{clock:{value:0},fade:{value:1},cream:{value:cream?1:0},stream:{value:0}},
 vertexShader:`varying vec2 tex;varying vec3 n;varying vec3 view;void main(){tex=uv;n=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);view=normalize(-p.xyz);gl_Position=projectionMatrix*p;}`,
 fragmentShader:`uniform float clock,fade,cream,stream;varying vec2 tex;varying vec3 n,view;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
 void main(){float grain=noise(tex*vec2(36.,9.)+vec2(0.,-clock*4.));float thin=smoothstep(.30,.85,tex.y);float holes=smoothstep(.19,.30,grain+1.-thin-clock*.22);if(stream>.5)holes=1.;float edge=pow(1.-abs(dot(normalize(n),normalize(view))),2.);float shine=pow(max(0.,dot(reflect(-normalize(vec3(-.6,1.,1.)),normalize(n)),normalize(view))),28.);vec3 water=mix(vec3(.34,.55,.57),vec3(.91,.98,1.),edge*.7+shine*.9);vec3 milk=vec3(.94,.89,.76)*(.75+.25*max(0.,dot(normalize(n),normalize(vec3(-.5,1.,1.)))));float opacity=mix(.25+edge*.45+shine*.3,.97,cream);gl_FragColor=vec4(mix(water,milk,cream),opacity*holes*fade);}`});
}
