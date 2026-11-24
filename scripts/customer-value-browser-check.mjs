import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const base='http://127.0.0.1:8765';
try{
for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 let posts=0,lastPayload=null,mode='success';
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{
  const url=route.request().url();
  if(url.startsWith(base))return route.continue();
  if(url==='https://crm.lazyplex.com/api/public-leads/status')return route.fulfill({json:{enabled:true,siteKey:'mock-site-key-123'},headers:{'access-control-allow-origin':'*'}});
  if(url.startsWith('https://challenges.cloudflare.com/turnstile/'))return route.fulfill({contentType:'application/javascript',body:"window.turnstile={render(el,opts){window._mockCaptcha=opts;queueMicrotask(()=>opts.callback('local-test-token'));return 1},reset(){queueMicrotask(()=>window._mockCaptcha.callback('local-test-token'))}}"});
  if(url==='https://crm.lazyplex.com/api/public-leads'){
   if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers:{'access-control-allow-origin':'*','access-control-allow-methods':'POST,OPTIONS','access-control-allow-headers':'content-type'}});
   posts++;lastPayload=route.request().postDataJSON();return route.fulfill({status:mode==='success'?200:422,json:mode==='success'?{received:true}:{detail:'Test validation error'},headers:{'access-control-allow-origin':'*'}});
  }
  return route.abort();
 });
 await page.goto(base+'/pricing/');
 await page.locator('#lp-price-search').waitFor();
 await page.selectOption('#tier-service-seo','basic');
 await page.fill('#lp-price-search','google ads');
 assert.ok(await page.locator('#service-google').isVisible());
 assert.ok(await page.locator('#service-seo').isVisible(),'Selected tier must remain visible');
 assert.ok(!await page.locator('#service-meta').isVisible());
 await page.locator('#lp-price-clear').click();
 assert.ok(await page.locator('#service-meta').isVisible());
 await page.goto(base+'/insights/');
 await page.locator('#lp-resource-search').waitFor();
 await page.selectOption('#lp-resource-category','healthcare');
 assert.ok(await page.locator('.seo-blog-card[href^="/industries/healthcare/"]').first().isVisible());
 assert.ok(!await page.locator('.seo-blog-card[href^="/industries/real-estate/"]').first().isVisible());
 await page.fill('#lp-resource-search','no matching query xzxzx');
 assert.match(await page.locator('#lp-resource-count').innerText(),/^0 of/);
 await page.locator('#lp-resource-clear').click();
 assert.ok(await page.locator('.seo-blog-card[href^="/industries/real-estate/"]').first().isVisible());
 await page.goto(base+'/contact/?service=ai-search-optimisation');
 assert.equal(await page.locator('select[name="service"]').inputValue(),'ai-search-optimisation');
 assert.equal(await page.locator('select[name="industry"]').getAttribute('required'),null);
 const submit=page.locator('#send-secure-enquiry');
 await submit.waitFor();
 await page.fill('input[name="name"]','Local QA Test');
 await page.fill('input[name="phone"]','0000000000');
 await page.fill('textarea[name="message"]','Simulated local QA only, never transmitted to real CRM.');
 await page.check('input[name="consent"]');
 mode='validation';await submit.click();
 await page.waitForFunction(()=>document.querySelector('#secure-intake-status').textContent.includes('Test validation error'));
 assert.equal(posts,1);
 assert.ok(!await page.locator('#secure-intake-status').evaluate(el=>el.classList.contains('success')));
 mode='success';await submit.click();
 await page.waitForFunction(()=>document.querySelector('#secure-intake-status').classList.contains('success'));
 assert.equal(lastPayload.service,'ai-search-optimisation');assert.equal(lastPayload.industry,'');
 assert.equal(posts,2);assert.ok(await submit.isDisabled());
 assert.deepEqual(errors,[]);
 console.log('Customer value and simulated enquiry flow passed at '+width+'px; no production POST');
 await page.close();
}
}finally{await browser.close()}
