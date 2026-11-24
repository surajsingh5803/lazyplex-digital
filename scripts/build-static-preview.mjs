import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), out=path.join(root,'dist');
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
const host='https://digital.lazyplex.com';
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1].trim()));
const files=new Set(urls.map(u=>{if(u.origin!==host)throw Error('Unexpected sitemap host');return path.join(u.pathname.replace(/^\/+/,''),'index.html')}));
files.add('404.html');
for(const rel of files){const source=path.join(root,rel);if(!fs.existsSync(source))throw Error('Missing '+rel);let html=fs.readFileSync(source,'utf8');if(!/<\/head>/i.test(html))throw Error('Missing head '+rel);html=html.replace(/<meta\b[^>]*\bname=["']robots["'][^>]*>/gi,'').replace(/<\/head>/i,'<meta name="robots" content="noindex, nofollow"></head>');const dest=path.join(out,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,html)}
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
for(const f of ['favicon.ico','favicon.png','apple-touch-icon.png','manifest.json','site.webmanifest'])if(fs.existsSync(path.join(root,f)))fs.copyFileSync(path.join(root,f),path.join(out,f));
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\n');
console.log('Prepared noindex preview: '+files.size+' HTML pages');
