import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), out=path.join(root,'dist');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const host='https://digital.lazyplex.com';
const sitemap=fs.readFileSync('sitemap.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1].trim()));
const files=new Set(urls.map(u=>{if(u.origin!==host)throw Error('Unexpected sitemap origin');return path.join(u.pathname.replace(/^\/+/,''),'index.html')}));
files.add('404.html');
for(const rel of files){const html=fs.readFileSync(rel,'utf8');if(rel!=='404.html'&&(/<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)||html.includes('name="lp-preview"')))throw Error('Preview directives in production page '+rel);const dest=path.join(out,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,html)}
fs.cpSync('assets',path.join(out,'assets'),{recursive:true});
for(const rel of ['favicon.ico','favicon.png','apple-touch-icon.png','manifest.json','site.webmanifest','robots.txt','sitemap.xml','llms.txt','98ee5d1795784dcd838024c1ada1bd49.txt'])if(fs.existsSync(rel))fs.copyFileSync(rel,path.join(out,rel));
for(const rel of ['robots.txt','sitemap.xml','llms.txt','98ee5d1795784dcd838024c1ada1bd49.txt'])if(!fs.existsSync(path.join(out,rel)))throw Error('Missing required discovery file '+rel);
console.log('Prepared production static build: '+files.size+' HTML pages and discovery files');
