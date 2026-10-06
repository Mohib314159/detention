const CACHE='detention-overseer-23';
const root=new URL('./',self.location.href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png']))));
// Wait for every old tab to close before activating. Never reload a running class.
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('detention-overseer-')&&k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==root.origin||!url.pathname.startsWith(root.pathname))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);const key=new URL(url);key.search='';
 // Large versioned-release assets do not need a network round trip on every visit.
 if(/\.(glb|gltf|bin|png|wasm|task)$/.test(url.pathname)){const stored=await cache.match(key.href);if(stored)return stored;}
 // Fresh code when connected; local assets can be used offline, including query-versioned modules.
 try{const response=await fetch(request);if(response.ok){await cache.put(key.href,response.clone()).catch(()=>{});}return response;}
 catch{const stored=await cache.match(key.href);if(stored)return stored;if(request.mode==='navigate')return await cache.match(new URL('index.html',root).href)||Response.error();return Response.error();}
 })());
});
