import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const sitemap=fs.readFileSync('sitemap.xml','utf8');
const paths=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const files=[...paths.map(p=>path.join(root,p.replace(/^\//,''),'index.html')),path.join(root,'404.html')];
const groups=[
 {title:'Services',wide:true,cols:[
 ['Search & visibility',[['SEO','/services/search-engine-optimisation/'],['Local SEO','/services/local-seo/'],['AI search optimisation','/services/ai-search-optimisation/'],['Content marketing','/services/content-marketing/'],['Social media marketing','/services/social-media-marketing/']]],
 ['Acquisition & conversion',[['Google Ads & PPC','/services/google-ads-ppc/'],['Meta Ads','/services/meta-ads/'],['Lead generation','/services/lead-generation/'],['Conversion optimisation','/services/conversion-optimisation/'],['Branding & design','/services/branding-design/']]],
 ['Technology & measurement',[['Website development','/services/website-development/'],['CRM automation','/services/crm-automation/'],['AI automation','/services/ai-automation/'],['Email & WhatsApp marketing','/services/email-whatsapp-marketing/'],['Analytics & reporting','/services/analytics-reporting/']]],
 ],all:['All services','/services/']},
 {title:'Industries',wide:true,cols:[
 ['Consumer & care',[['Healthcare','/industries/healthcare/'],['Beauty & wellness','/industries/beauty-wellness/'],['E-commerce & D2C','/industries/ecommerce/'],['Hospitality','/industries/hospitality/'],['Education','/industries/education/']]],
 ['Business & property',[['Real estate','/industries/real-estate/'],['Manufacturing & B2B','/industries/manufacturing-b2b/'],['Professional services','/industries/professional-services/'],['Startups & SMEs','/industries/startups-smes/']]]
 ],all:['All industries','/industries/']},
 {title:'Growth & pricing',cols:[['Plan your growth',[['Growth planner','/growth-planner/'],['Service pricing','/pricing/'],['Growth packages','/pricing/#packages'],['Our approach','/approach/']]]]},
 {title:'Resources',cols:[['Learn & calculate',[['Insights & guides','/insights/'],['All calculators','/tools/'],['Lead quality & ROI','/tools/lead-quality-roi-calculator/'],['Real estate lead funnel','/tools/real-estate-lead-funnel-calculator/'],['Break-even marketing budget','/tools/break-even-marketing-budget-planner/'],['Editorial standards','/editorial/']]]]},
 {title:'Company',cols:[['About Lazy Plex Digital',[['About us','/about/'],['Our work','/work/'],['Our approach','/approach/'],['Parent company','https://lazyplex.com/']]],['Locations',[['Mumbai','/locations/mumbai/'],['Lucknow','/locations/lucknow/'],['Patna','/locations/patna/']]]]},
 {title:'Contact',cols:[['Speak to us',[['Project enquiry','/contact/'],['Call +91 72579 19567','tel:+917257919567'],['WhatsApp enquiry','https://wa.me/917257919567?text=Hi%20Lazy%20Plex%2C%20I%20would%20like%20to%20discuss%20digital%20marketing%20services.']]]]}
];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function link([label,url],current,cls=''){return '<a'+(cls?' class="'+cls+'"':'')+(url===current?' aria-current="page"':'')+' href="'+esc(url)+'">'+esc(label)+'</a>'}
function brand(){return '<a class="brand" aria-label="Lazy Plex Digital home" href="/"><span class="brand-mark"><img alt="" class="brand-logo" src="/assets/lazyplex-logo.webp" width="42" height="42"></span><span class="brand-name">LAZY PLEX <small>DIGITAL</small></span></a>'}
function group(g,current,scope){return '<details class="lp-nav-group'+(g.wide?' lp-nav-wide':'')+'" name="lp-'+scope+'-group"><summary>'+esc(g.title)+'<span class="lp-nav-chevron" aria-hidden="true"></span></summary><div class="lp-nav-panel"><div class="lp-nav-columns" style="--lp-nav-columns:'+g.cols.length+'">'+g.cols.map(([heading,links])=>'<div class="lp-nav-column"><p class="lp-nav-label">'+esc(heading)+'</p>'+links.map(l=>link(l,current)).join('')+'</div>').join('')+'</div>'+(g.all?link(g.all,current,'lp-nav-all'):'')+'</div></details>'}
function header(current){return '<header class="site-header lp-digital-nav" data-navigation-version="3"><div class="container nav-bar">'+brand()+'<nav aria-label="Primary navigation" class="desktop-nav">'+link(['Home','/'],current,'nav-link')+groups.map(g=>group(g,current,'desktop')).join('')+'<a class="nav-cta" href="/growth-planner/">Get Started <span aria-hidden="true">↗</span></a></nav><details class="lp-mobile-shell"><summary aria-label="Open navigation"><span class="lp-hamburger" aria-hidden="true">☰</span> Menu</summary><nav aria-label="Mobile navigation" class="mobile-menu">'+link(['Home','/'],current)+groups.map(g=>group(g,current,'mobile')).join('')+link(['Get Started','/growth-planner/'],current,'lp-mobile-cta')+'</nav></details></div></header>'}
const footerGroups=[
 ['Services',[['All services','/services/'],['SEO & AI search','/services/search-engine-optimisation/'],['Google Ads','/services/google-ads-ppc/'],['Meta Ads','/services/meta-ads/'],['Lead generation','/services/lead-generation/'],['Automation','/services/ai-automation/']]],
 ['Planning',[['Industry solutions','/industries/'],['Pricing','/pricing/'],['Growth planner','/growth-planner/'],['Our approach','/approach/'],['Our work','/work/']]],
 ['Resources',[['Insights','/insights/'],['All calculators','/tools/'],['Editorial standards','/editorial/'],['About us','/about/'],['Lazy Plex — parent company','https://lazyplex.com/']]],
 ['Contact & legal',[['Project enquiry','/contact/'],['Call +91 72579 19567','tel:+917257919567'],['Chat on WhatsApp','https://wa.me/917257919567?text=Hi%20Lazy%20Plex%2C%20I%20would%20like%20to%20enquire%20about%20digital%20marketing%20services.'],['Privacy policy','/privacy/']]]
];
function footer(current){return '<footer class="site-footer lp-digital-footer" data-footer-version="3"><div class="container"><div class="lp-footer-intro">'+brand()+'<p>Ideas. Execution. Measurable growth. A specialist division of Lazy Plex.</p></div><div class="lp-footer-columns">'+footerGroups.map(([title,links])=>'<div><h3>'+esc(title)+'</h3>'+links.map(l=>link(l,current)).join('')+'</div>').join('')+'</div><div class="footer-bottom"><span>© 2026 Lazy Plex. All rights reserved.</span><span>Designed for performance. Built to grow.</span></div></div></footer>'}
const cssTag='<link rel="stylesheet" href="/assets/navigation-v3.css">';
const jsTag='<script defer src="/assets/navigation-v3.js"></script>';
const targets=new Set(paths);
for(const g of groups)for(const [label,links] of g.cols)for(const [name,url] of links){if(url.startsWith('/')&&!targets.has(url.split('#')[0]))throw Error('Unpublished menu destination '+name+' '+url)}
let changed=0;
for(const f of files){
 const current=f.endsWith('/404.html')?'/404.html':'/'+path.relative(root,f).replace(/index\.html$/,'').split(path.sep).join('/');
 const html=fs.readFileSync(f,'utf8');
 if(!/<header\b[^>]*class=["'][^"']*\bsite-header\b[^"']*["'][^>]*>[\s\S]*?<\/header>/i.test(html))throw Error('No site header '+f);
 if(!/<footer\b[^>]*class=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>[\s\S]*?<\/footer>/i.test(html))throw Error('No site footer '+f);
 let next=html.replace(/<header\b[^>]*class=["'][^"']*\bsite-header\b[^"']*["'][^>]*>[\s\S]*?<\/header>/i,header(current)).replace(/<footer\b[^>]*class=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>[\s\S]*?<\/footer>/i,footer(current));
 if(!next.includes(cssTag))next=next.replace(/<\/head>/i,cssTag+'</head>');
 if(!next.includes(jsTag))next=next.replace(/<\/body>/i,jsTag+'</body>');
 if(f.endsWith('/404.html'))next=next.replace(/(href|src)=["']assets\//g,'$1="/assets/');
 if(next!==html){fs.writeFileSync(f,next);changed++}
}
console.log('Shared navigation and footer: '+files.length+' public pages; '+changed+' changed');
