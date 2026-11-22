import { chromium } from 'playwright';
const origin=process.env.LP_QA_ORIGIN||'https://lazyplex.com';
const paths=['/','/solutions/','/services/','/pricing/','/start/','/compare/','/our-work/','/working-together/','/request-proposal/','/request-growth-audit/','/growth-audit/','/contact/','/growth-advisor/','/industries/','/healthcare/','/real-estate/','/industries/education/','/industries/ecommerce/','/industries/beauty-wellness/','/industries/hospitality/','/industries/manufacturing-b2b/','/industries/professional-services/','/industries/startups-smes/','/get-customers/','/convert/','/automate/','/measure/','/about/','/software/','/how-it-works/','/growth-consultancy/'];
const widths=[320,390,768,1440],results=[];
const browser=await chromium.launch({headless:true});
try {
 for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  for(const path of paths){
   let result={path,width};
   try{
    const response=await page.goto(new URL(path,origin).href,{waitUntil:'domcontentloaded',timeout:35000});
    await page.waitForTimeout(180);
    result={...result,status:response?.status(),...await page.evaluate(()=>{
      const root=document.documentElement,body=document.body;
      const full=Math.max(root.scrollWidth,body?.scrollWidth||0),viewport=root.clientWidth;
      const h1=[...document.querySelectorAll('h1')].filter(el=>getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden');
      const offscreen=[...document.querySelectorAll('body *')].filter(el=>{
       const s=getComputedStyle(el);
       if(s.display==='none'||s.visibility==='hidden'||s.position==='fixed')return false;
       const r=el.getBoundingClientRect();
       return r.width>0&&(r.right>window.innerWidth+2||r.left< -2);
      }).slice(0,6).map(el=>({tag:el.tagName,class:String(el.className||'').slice(0,60),right:Math.round(el.getBoundingClientRect().right)}));
      return{viewport,documentWidth:full,overflow:Math.max(0,full-viewport),h1Count:h1.length,offscreen};
    })};
   }catch(e){result.error=String(e).slice(0,180)}
   results.push(result);
   console.log('LP_QA '+JSON.stringify(result));
  }
  await page.close();
 }
} finally {await browser.close()}
const critical=results.filter(x=>x.error||x.status!==200||x.h1Count!==1||x.overflow>2);
console.log('LP_QA_SUMMARY '+JSON.stringify({checked:results.length,critical:critical.length,results:critical.map(x=>({path:x.path,width:x.width,status:x.status,overflow:x.overflow,h1Count:x.h1Count,error:x.error,offscreen:x.offscreen}))}));
if(critical.length)process.exitCode=1;
