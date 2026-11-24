import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),host='https://digital.lazyplex.com';
const urls=[...fs.readFileSync('sitemap.xml','utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const routes={"/solutions/":"/pricing/#packages","/growth-consultancy/":"/approach/","/pricing/":"/pricing/","/services/":"/services/","/compare/":"/pricing/#packages","/pricing-preview/":"/pricing/","/start/":"/growth-planner/","/growth-advisor/":"/growth-planner/","/request-growth-audit/":"/growth-planner/","/growth-audit/":"/growth-planner/","/request-proposal/":"/contact/?service=integrated-growth","/working-together/":"/approach/","/how-it-works/":"/approach/","/get-customers/":"/pricing/#packages","/convert/":"/services/conversion-optimisation/","/automate/":"/services/crm-automation/","/measure/":"/services/analytics-reporting/","/our-work/":"/work/","/growth-example/":"/work/","/industries/":"/industries/","/healthcare/":"/industries/healthcare/","/real-estate/":"/industries/real-estate/","/industries/education/":"/industries/education/","/industries/ecommerce/":"/industries/ecommerce/","/industries/beauty-wellness/":"/industries/beauty-wellness/","/industries/hospitality/":"/industries/hospitality/","/industries/manufacturing-b2b/":"/industries/manufacturing-b2b/","/industries/professional-services/":"/industries/professional-services/","/industries/startups-smes/":"/industries/startups-smes/","/how-to-choose-digital-marketing-agency/":"/insights/how-to-choose-digital-marketing-agency/","/small-business-digital-marketing-budget-india/":"/insights/small-business-digital-marketing-budget-india/","/seo-vs-google-ads-vs-meta-ads-service-business/":"/insights/seo-vs-google-ads-vs-meta-ads-service-business/","/why-marketing-leads-not-converting/":"/insights/why-marketing-leads-not-converting/","/healthcare-marketing-strategy-clinics-hospitals/":"/insights/healthcare-marketing-strategy-clinics-hospitals/","/real-estate-marketing-strategy-developers-site-visits/":"/insights/real-estate-marketing-strategy-developers-site-visits/","/seo-ai-search-businesses-2026-guide/":"/insights/seo-ai-search-businesses-2026-guide/","/how-to-measure-marketing-roi-leads-revenue/":"/insights/how-to-measure-marketing-roi-leads-revenue/"};
let rewrites=0,articles=0,changed=0;
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
for(const url of urls){
 const u=new URL(url), file=path.join(root,u.pathname.replace(/^\//,''),'index.html');
 const old=fs.readFileSync(file,'utf8');
 let h=old.replace(/href=(["'])(https:\/\/lazyplex\.com\/[^"'\s]*)\1/g,(match,quote,value)=>{
  const a=new URL(value.replaceAll('&amp;','&'));if(!Object.hasOwn(routes,a.pathname))return match;
  const target=new URL(routes[a.pathname],host);for(const [k,v] of a.searchParams)if(!target.searchParams.has(k))target.searchParams.set(k,v);
  if(!target.hash&&a.hash){const dest=path.join(root,target.pathname.slice(1),'index.html');if(fs.existsSync(dest)&&fs.readFileSync(dest,'utf8').includes('id="'+decodeURIComponent(a.hash.slice(1))+'"'))target.hash=a.hash}
  rewrites++;return 'href='+quote+escape(target.pathname+target.search+target.hash)+quote;
 });
 h=h.replaceAll('LAZY PLEX / MAIN CONSULTANCY','LAZY PLEX / PARENT COMPANY').replaceAll('Lazy Plex: the main consultancy and editorial hub','Lazy Plex: our parent company').replaceAll('The main Lazy Plex WordPress site explains the broader consultancy and its practical business decision guides.','The parent company brings together Lazy Plex Digital, Lazy Plex Software and Lazy Plex Labs. Explore its corporate information and business technology perspectives.').replaceAll('Read the business-owner guides','Explore corporate business and technology insights').replaceAll('Explore the full Lazy Plex business playbooks','Explore related business decision guides');
 if(u.pathname==='/about/')h=h.replaceAll('Lazy Plex approaches digital growth','Lazy Plex Digital approaches digital growth');
 if(u.pathname==='/work/')h=h.replace('href="/pricing/#packages" rel="noopener noreferrer" target="_blank">Explore our property growth approach','href="/industries/real-estate/">Explore our property growth approach');
 if(u.pathname==='/pricing/'&&!h.includes('id="lp-price-jump"')){
  const cards=[...h.matchAll(/<article class="price-card" id="(service-[^"]+)"><h3>([^<]+)<\/h3>/g)].map(m=>[m[1],m[2]]);
  if(cards.length!==15)throw Error('Unexpected catalogue count '+cards.length);
  h=h.replace('<h2 id="individual">Individual services</h2>','<h2 id="individual">Individual services</h2><nav id="lp-price-jump" class="lp-quick-nav" aria-label="Jump to service pricing"><p><strong>Find your service</strong></p><div>'+cards.map(([id,label])=>'<a href="#'+id+'">'+label+'</a>').join('')+'</div><a class="lp-quick-package" href="#packages">Compare growth packages →</a></nav>');
 }
 if(u.pathname==='/growth-planner/'&&!h.includes('class="lp-planner-help"')){
  h=h.replace('<div class="planner">','<section class="lp-planner-help"><div><strong>01 · Goal</strong><p>Choose the business problem to address.</p></div><div><strong>02 · Readiness</strong><p>Tell us the current stage and tracking ability.</p></div><div><strong>03 · Starting plan</strong><p>Review the recommendation before comparing scope and fees.</p></div></section><div class="planner">');
 }
 if(h.includes('<article class="lp-editorial">')&&!h.includes('class="lp-editorial-toc"')){
  let toc=[],used=new Set([...h.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]));
  h=h.replace(/<article class="lp-editorial">[\s\S]*?<\/article>/, article=>{
   const content=article.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/g,(full,attrs,label)=>{
    if(/class="[^"]*lp-editorial-next/.test(attrs))return full;
    const existing=attrs.match(/\bid=["']([^"']+)["']/)?.[1];
    const title=label.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').trim();
    let id=existing||'guide-'+title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,64);
    if(!existing){let n=2,base=id;while(used.has(id))id=base+'-'+n++;used.add(id)}
    toc.push([id,title]);
    return '<h2'+attrs+(existing?'':' id="'+id+'"')+'>'+label+'</h2>';
   });
   if(!toc.length)return content;
   articles++;return content.replace('<article class="lp-editorial">','<article class="lp-editorial"><details class="lp-editorial-toc" open><summary>On this page</summary><ol>'+toc.map(([id,title])=>'<li><a href="#'+id+'">'+escape(title)+'</a></li>').join('')+'</ol></details>');
  });
 }
 const css='<link rel="stylesheet" href="/assets/final-brand-quality.css">';
 if(!h.includes(css))h=h.replace('</head>',css+'</head>');
 if(h!==old){fs.writeFileSync(file,h);changed++}
}
console.log(JSON.stringify({pages:urls.length,rewrites,articles,changed}));
