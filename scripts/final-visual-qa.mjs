import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const sites=[
 ['https://lazyplex.com',['/','/about/','/businesses/','/products/','/software/','/labs/','/leadership/','/our-approach/','/insights/','/contact/','/partnerships/','/product-support/','/luma-circuit/']],
 ['https://digital.lazyplex.com',['/','/services/','/industries/','/pricing/','/growth-planner/','/work/','/about/','/contact/','/insights/','/tools/','/services/google-ads-ppc/','/services/search-engine-optimisation/','/industries/healthcare/','/industries/real-estate/','/insights/how-to-choose-digital-marketing-agency/']]
];
const browser=await chromium.launch({headless:true});
const findings=[];
try{
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  // Keep first-party JS and CSS; skip external analytics, trackers, media and fonts to avoid recording synthetic leads.
  await page.route('**/*',route=>{const u=new URL(route.request().url());return ['lazyplex.com','digital.lazyplex.com','estatecrm.lazyplex.com'].includes(u.hostname)?route.continue():route.abort()});
  for(const [host,paths] of sites)for(const path of paths){
   const url=host+path;const errors=[];const handler=e=>errors.push(e.message);page.on('pageerror',handler);
   try{
    let response;
    for(let attempt=0;attempt<3;attempt++){
      response=await page.goto(url+'?visualqa='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
      if(response.status()!==429)break;
      await page.waitForTimeout(5000*(attempt+1));
    }
    if(response.status()===429){findings.push({url,width,issues:['Rate limited: layout not assessed']});console.log(JSON.stringify({url,width,issues:['Rate limited: layout not assessed']}));continue;}
    await page.waitForTimeout(host==='https://lazyplex.com'?500:50);
    const state=await page.evaluate(()=>({title:document.title,h1:document.querySelectorAll('h1').length,main:document.querySelectorAll('main').length,scroll:document.documentElement.scrollWidth,width:innerWidth,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth&&i.getBoundingClientRect().width>0).map(i=>i.getAttribute('src')).slice(0,5),unlabelledInputs:[...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea')].filter(x=>!x.labels?.length&&!x.getAttribute('aria-label')&&!x.getAttribute('aria-labelledby')).map(x=>x.name||x.id||x.type).slice(0,10)}));
    const result={url,width,status:response.status(),...state,errors};
    const issues=[];if(result.status!==200)issues.push('HTTP '+result.status);if(result.h1!==1)issues.push('H1 count '+result.h1);if(result.scroll>width+2)issues.push('overflow '+result.scroll);if(result.errors.length)issues.push('runtime '+result.errors.join('; '));if(result.unlabelledInputs.length)issues.push('unlabelled '+result.unlabelledInputs.join(','));
    findings.push({...result,issues});console.log(JSON.stringify({url,width,issues}));
   }catch(e){findings.push({url,width,issues:[e.message]});console.log(JSON.stringify({url,width,error:e.message}));}
   finally{page.off('pageerror',handler)}
  }
  await page.close();
 }
 fs.writeFileSync('visual-qa-results.json',JSON.stringify(findings,null,2));
 console.log('VISUAL QA SUMMARY '+JSON.stringify({checks:findings.length,withIssues:findings.filter(x=>x.issues.length).length}));
}finally{await browser.close()}
