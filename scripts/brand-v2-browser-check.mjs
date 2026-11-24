import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({headless:true});
const base='http://127.0.0.1:8765';
try {
  for (const width of [390,1280]) {
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror', e=>errors.push(e.message));
    await page.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
    for(const path of ['/','/pricing/','/growth-planner/','/services/google-ads-ppc/','/insights/how-to-choose-digital-marketing-agency/']){
      const response=await page.goto(base+path,{waitUntil:'domcontentloaded'});
      assert.equal(response.status(),200,path);
      await page.locator('h1').waitFor();
      const size=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
      assert.ok(size.scroll<=size.viewport+2, 'Horizontal overflow '+path+' '+width+': '+JSON.stringify(size));
    }
    await page.goto(base+'/');
    await page.locator('[data-outcome="2"]').click();
    assert.match(await page.locator('#outcome-name').innerText(),/existing traffic/i);
    await page.goto(base+'/growth-planner/');
    await page.selectOption('#goal','local');
    await page.locator('#planner button').click();
    assert.match(await page.locator('#recommendation').innerText(),/Local discovery/i);
    assert.equal(await page.locator('#next').getAttribute('href'),'/contact/?service=local-seo');
    await page.goto(base+'/pricing/');
    await page.selectOption('#tier-service-seo','basic');
    assert.match(await page.locator('#estimate').innerText(),/19,999/);
    await page.selectOption('#tier-bundle-get','basic');
    const overlap=await page.locator('#estimate').innerText();
    assert.match(overlap,/49,999/);
    assert.match(overlap,/overlap/i);
    assert.doesNotMatch(overlap,/69,998/);
    await page.selectOption('#tier-service-lead_gen','basic');
    assert.match(await page.locator('#estimate').innerText(),/62,998/);
    await page.selectOption('#tier-bundle-convert','basic');
    assert.match(await page.locator('#estimate').innerText(),/custom quote/i);
    await page.locator('#pricing-proposal').click();
    await page.waitForURL('**/contact/**');
    assert.match(await page.locator('textarea[name="message"]').inputValue(),/Lazy Plex Digital — indicative selection/);
    assert.equal(await page.locator('select[name="service"]').inputValue(),'integrated-growth');
    assert.deepEqual(errors,[],'Browser runtime errors');
    await page.close();
    console.log('Passed customer flow at '+width+'px');
  }
} finally { await browser.close(); }
