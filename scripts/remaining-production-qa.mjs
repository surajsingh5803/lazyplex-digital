import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const parent='https://lazyplex.com',digital='https://digital.lazyplex.com';
const results=[];
try {
 for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 let errors=[],requests=[];
 page.on('pageerror',e=>errors.push({message:e.message,stack:e.stack?.slice(0,1800)}));
 page.on('request',r=>{if(r.resourceType()==='script')requests.push(r.url())});
 // No form submissions, ad clicks or account actions.
 await page.route('**/*',route=>route.request().method()==='POST'?route.abort():route.continue());
 for(const [host,paths] of [[parent,['/','/privacy-policy/','/contact/','/products/','/luma-circuit/','/coaching/','/cart/','/checkout/','/my-account/']],[digital,['/','/pricing/','/insights/','/contact/?service=ai-search-optimisation']]]){
 for(const path of paths){
 errors=[];requests=[];
 const res=await page.goto(host+path+(path.includes('?')?'&':'?')+'lp_verify='+Date.now(),{waitUntil:'domcontentloaded',timeout:40000});
 await page.waitForLoadState('load',{timeout:25000}).catch(()=>{});
 await page.waitForTimeout(500);
 const info=await page.evaluate(()=>({h1:[...document.querySelectorAll('h1')].map(x=>x.textContent.trim()),overflow:document.documentElement.scrollWidth>innerWidth+2,rdt:typeof window.rdt,tracking:[...document.scripts].filter(s=>/reddit|rdt\(|rdt\.apply/.test(s.src+' '+s.textContent)).map(s=>({src:s.src,inline:s.src?'':s.textContent.slice(0,240)})).slice(0,5)}));
 const entry={width,url:host+path,status:res.status(),...info,errors,redditRequests:requests.filter(s=>/reddit/i.test(s))};
 results.push(entry);console.log(JSON.stringify(entry));
 if(host===digital){assert.equal(res.status(),200);if(path==='/pricing/')assert.ok(await page.locator('#lp-price-search').isVisible());if(path==='/insights/')assert.ok(await page.locator('#lp-resource-search').isVisible());if(path.startsWith('/contact/'))assert.equal(await page.locator('select[name="service"]').inputValue(),'ai-search-optimisation');}
 }
 }
 await page.close();
 }
 const reddit=results.filter(x=>x.redditRequests.length||x.errors.some(e=>e.message.includes('Function rdt not implemented')));assert.equal(reddit.length,0,'Reddit scripts remain: '+reddit.map(x=>x.url).join(', '));console.log('Production customer journey markers and Reddit removal verified');
}finally{await browser.close()}
