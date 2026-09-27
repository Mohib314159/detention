import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {createDialogue} from '../dist/personality.js';
const manifest=JSON.parse(fs.readFileSync('dist/manifest.webmanifest'));assert.equal(manifest.display,'standalone');assert(manifest.id);for(const icon of manifest.icons)assert(fs.existsSync('dist/'+icon.src));
const pack=JSON.parse(fs.readFileSync('dist/offline-pack.json'));for(const file of pack.files)assert(fs.existsSync('dist/'+file),file);for(const required of ['./main.js','./personality.js','./sounds.js','./assets/morrow/robot.glb','./vendor/face_landmarker.task'])assert(pack.files.includes(required));
const listeners={},store=new Map();const cache={async put(key,response){store.set(String(key),response.clone());},async match(key){return store.get(String(key))?.clone();},async addAll(files){for(const file of files)await this.put(new URL(file,'https://test.example/').href,new Response('shell'));}};
let online=true;const context={self:{location:{href:'https://test.example/sw.js'},addEventListener:(name,fn)=>listeners[name]=fn},URL,Response,caches:{open:async()=>cache,keys:async()=>[],delete:async()=>true},fetch:async()=>{if(!online)throw Error('offline');return new Response('fresh');}};
vm.runInNewContext(fs.readFileSync('dist/sw.js','utf8'),context);let pending;listeners.install({waitUntil:p=>pending=p});await pending;
async function request(url,mode='cors'){let result;listeners.fetch({request:{url,method:'GET',mode},respondWith:r=>result=r});return result;}
assert.equal(await (await request('https://test.example/main.js?v=20')).text(),'fresh');online=false;
assert.equal(await (await request('https://test.example/main.js?v=20')).text(),'fresh');assert.equal(await (await request('https://test.example/?app=1','navigate')).text(),'shell');
const say=createDialogue(()=>0);assert.notEqual(say('riot','idle'),say('riot','idle'));assert.notEqual(say('riot','rage'),say('morrow','rage'));assert.equal(say('riot','rage','gentle'),'Eyes away. One step at a time.');
console.log('PASS: manifest assets, full offline pack, versioned module fallback, offline navigation, varied character dialogue and gentle tone.');
