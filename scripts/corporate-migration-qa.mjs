import assert from 'node:assert/strict';
const routes={"/solutions/":"/pricing/#packages","/growth-consultancy/":"/approach/","/pricing/":"/pricing/","/services/":"/services/","/compare/":"/pricing/#packages","/pricing-preview/":"/pricing/","/start/":"/growth-planner/","/growth-advisor/":"/growth-planner/","/request-growth-audit/":"/growth-planner/","/growth-audit/":"/growth-planner/","/request-proposal/":"/contact/?service=integrated-growth","/working-together/":"/approach/","/how-it-works/":"/approach/","/get-customers/":"/pricing/#packages","/convert/":"/services/conversion-optimisation/","/automate/":"/services/crm-automation/","/measure/":"/services/analytics-reporting/","/our-work/":"/work/","/growth-example/":"/work/","/industries/":"/industries/","/healthcare/":"/industries/healthcare/","/real-estate/":"/industries/real-estate/","/industries/education/":"/industries/education/","/industries/ecommerce/":"/industries/ecommerce/","/industries/beauty-wellness/":"/industries/beauty-wellness/","/industries/hospitality/":"/industries/hospitality/","/industries/manufacturing-b2b/":"/industries/manufacturing-b2b/","/industries/professional-services/":"/industries/professional-services/","/industries/startups-smes/":"/industries/startups-smes/","/how-to-choose-digital-marketing-agency/":"/insights/how-to-choose-digital-marketing-agency/","/small-business-digital-marketing-budget-india/":"/insights/small-business-digital-marketing-budget-india/","/seo-vs-google-ads-vs-meta-ads-service-business/":"/insights/seo-vs-google-ads-vs-meta-ads-service-business/","/why-marketing-leads-not-converting/":"/insights/why-marketing-leads-not-converting/","/healthcare-marketing-strategy-clinics-hospitals/":"/insights/healthcare-marketing-strategy-clinics-hospitals/","/real-estate-marketing-strategy-developers-site-visits/":"/insights/real-estate-marketing-strategy-developers-site-visits/","/seo-ai-search-businesses-2026-guide/":"/insights/seo-ai-search-businesses-2026-guide/","/how-to-measure-marketing-roi-leads-revenue/":"/insights/how-to-measure-marketing-roi-leads-revenue/"};
const parent='https://lazyplex.com',staging='https://staging-9b98-winbuzzgame.wpcomstaging.com',digital='https://digital.lazyplex.com';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const req=async(url,redirect='manual')=>{
  for(let attempt=0;attempt<3;attempt++){
    if(new URL(url).hostname!=='digital.lazyplex.com')await sleep(1000);
    const response=await fetch(url,{redirect,signal:AbortSignal.timeout(25000),headers:{'User-Agent':'LazyPlex-Release-QA/1.0','Cache-Control':'no-cache'}});
    if(response.status!==429||attempt===2)return response;
    const header=response.headers.get('retry-after');
    const seconds=header&&/^\d+$/.test(header)?Number(header):header?Math.max(0,(Date.parse(header)-Date.now())/1000):10*(attempt+1);
    // Respect rate limits; don't evade them or classify a blocked response as success.
    if(!Number.isFinite(seconds)||seconds>60)return response;
    await response.body?.cancel();
    await sleep(Math.max(10000,seconds*1000));
  }
};
for(const [from,to] of Object.entries(routes)){
 const expected=new URL(to,digital);
 const dest=await req(expected.href,'follow');assert.equal(dest.status,200,expected.href);
 const html=await dest.text();assert.ok(!/name=["']lp-preview["']/.test(html),'Preview leaked');
 if(expected.hash)assert.ok(html.includes('id="'+expected.hash.slice(1)+'"'),expected.href);
 const r=await req(staging+from+'?utm_source=qa');assert.equal(r.status,302,from);
 const loc=new URL(r.headers.get('location'));assert.equal(loc.origin,digital);assert.equal(loc.pathname,expected.pathname);assert.equal(loc.hash,expected.hash);assert.equal(loc.searchParams.get('utm_source'),'qa');
 console.log(from+' -> '+expected.href+' verified');
}
for(const path of ['/','/about/','/businesses/','/products/','/software/','/labs/','/leadership/','/our-approach/','/insights/','/contact/','/partnerships/','/product-support/','/luma-circuit/','/privacy-policy/','/lp-crm-terms/','/lp-crm-privacy-policy/','/lp-crm-data-deletion/','/luma-circuit-privacy/']){
 const r=await req(parent+path,'follow');assert.equal(r.status,200,path);assert.equal(new URL(r.url).hostname,'lazyplex.com',path);
}
const l=await req(parent+'/llms.txt','follow');const body=await l.text();assert.equal(l.status,200);assert.ok(body.includes('Lazy Plex Labs'));assert.ok(body.includes('/businesses/'));assert.ok(!body.includes('Lazy Plex is a growth consultancy'));
console.log('Corporate pages, legacy legal routes and updated AI discovery verified');
