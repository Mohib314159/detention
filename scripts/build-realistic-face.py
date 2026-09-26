"""Bake a head-and-neck study from CC0 MakeHuman geometry and facial targets.
Preserves UV seams, source indices, authored facial deltas and asset provenance.
No source asset or existing avatar is overwritten.
"""
from pathlib import Path
import json,gzip,zipfile,shutil
src=Path('asset-sources/makehuman');out=Path('dist/assets/realistic');out.mkdir(exist_ok=True)
v=[];uv=[];faces=[];group=''
for l in (src/'base.obj').read_text().splitlines():
 a=l.split()
 if not a:continue
 if a[0]=='v':v.append(list(map(float,a[1:4])))
 elif a[0]=='vt':uv.append(list(map(float,a[1:3])))
 elif a[0]=='g':group=a[1]
 elif a[0]=='f' and group=='body':faces.append([tuple(int(x)-1 for x in q.split('/')[:2]) for q in a[1:]])
def target(text):
 r={}
 for l in text.splitlines():
  a=l.split()
  if len(a)==4 and not a[0].startswith('#'):r[int(a[0])]=list(map(float,a[1:]))
 return r
male=target(gzip.decompress((src/'caucasian-male-young.target.gz').read_bytes()).decode())
for i,d in male.items():v[i]=[v[i][k]+d[k] for k in range(3)]
# Neck crop makes this an explicit facial study, not a fake replacement full-body rig.
faces=[f for f in faces if all(v[i][1]>6.65 for i,t in f)]
lookup={};ids=[];positions=[];tex=[];indices=[]
for f in faces:
 poly=[]
 for pair in f:
  if pair not in lookup:
   lookup[pair]=len(ids);i,t=pair;ids.append(i);positions.extend([round(v[i][0],6),round(v[i][1]-7.8,6),round(v[i][2]-.47,6)]);tex.extend(uv[t])
  poly.append(lookup[pair])
 for k in range(1,len(poly)-1):indices.extend([poly[0],poly[k],poly[k+1]])
z=zipfile.ZipFile(src/'faceunits01.zip');morphs={}
for name in z.namelist():
 if not name.endswith('.target'):continue
 d=target(z.read(name).decode());morphs[Path(name).stem]=[n for i in ids for n in d.get(i,[0,0,0])]
for name,file in [('age','head-age-incr.target.gz'),('jawWidth','chin-width-incr.target.gz')]:
 d=target(gzip.decompress((src/file).read_bytes()).decode());morphs[name]=[n for i in ids for n in d.get(i,[0,0,0])]
metadata=json.loads((src/'basemesh_vertex_groups.json').read_text());eyes=[]
for name in ['joint-l-eye','joint-r-eye']:
 eyeids=[i for a,b in metadata[name] for i in range(a,b+1)];eyes.append([sum(v[i][k] for i in eyeids)/len(eyeids)-[0,7.8,.47][k] for k in range(3)])
(out/'face.json').write_text(json.dumps(dict(positions=positions,uv=tex,indices=indices,morphs=morphs,eyes=eyes),separators=(',',':')),encoding='utf-8')
skin=zipfile.ZipFile(src/'skins02-mirror.zip')
for name,dest in [('Aksel_Skin_diffuse.png','skin.png'),('Aksel_Skin_NRM.png','normal.png'),('Aksel_Skin_SPEC.png','specular.png')]:
 path=next(n for n in skin.namelist() if n.endswith('/'+name));(out/dest).write_bytes(skin.read(path))
shutil.copyfile(src/'LICENSE.ASSETS.md',out/'LICENSE-CC0.txt');(out/'faceunits-license.json').write_bytes(z.read('packs/faceunits01.json'))
(out/'SOURCES.md').write_text('''# Avatar facial study\nMakeHuman/MPFB base geometry and age/jaw targets: https://github.com/makehumancommunity/mpfb2 (CC0 assets; source code is separately GPL).\nFacial targets by Mika Suominen: https://static.makehumancommunity.org/assets/assetpacks/faceunits01.html (CC0, per included pack manifest).\nAksel skin, normal and specular textures by Mindfront: https://static.makehumancommunity.org/assets/assetpacks/skins02.html (CC0).\nThis head-and-neck experiment has not been retargeted onto the classroom body.\n''',encoding='utf-8')
print(len(ids),'vertices',len(indices)//3,'triangles',len(morphs),'morphs')
