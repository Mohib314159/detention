import fs from 'node:fs';
import path from 'node:path';
// A reproducible offline pack of the shipped application, never source archives.
const files=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const name=path.join(dir,entry.name);if(entry.isDirectory())walk(name);else{const relative=path.relative('dist',name).replaceAll('\\','/');if(!relative.endsWith('.md')&&!['offline-pack.json','sw.js'].includes(relative))files.push('./'+relative);}}}walk('dist');
files.sort();const bytes=files.reduce((sum,file)=>sum+fs.statSync(path.join('dist',file)).size,0);
fs.writeFileSync('dist/offline-pack.json',JSON.stringify({version:23,bytes,files},null,2)+'\n');
for(const name of ['index.html','manifest.webmanifest','sw.js','install.js','personality.js','sounds.js'])if(!fs.existsSync('dist/'+name))throw Error('Missing '+name);
console.log(`Static app ready. Offline pack: ${files.length} files, ${Math.ceil(bytes/1024/1024)} MB.`);
