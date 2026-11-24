import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const base='http://127.0.0.1:8765';
const labels=['Services','Industries','Plans & pricing','Resources','About us','Contact'];
const pages=['/','/pricing/','/growth-planner/','/services/google-ads-ppc/','/industries/healthcare/','/insights/how-to-choose-digital-marketing-agency/','/404.html'];
try {
 for(const width of [320,390,768,1199,1280,1440]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
  for(const url of pages){
    await page.goto(base+url,{waitUntil:'domcontentloaded'});
    const header=page.locator('header[data-navigation-version="3"]');
    assert.equal(await header.count(),1,url);
    assert.equal(await page.locator('footer[data-footer-version="3"]').count(),1,url);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Overflow on '+url+' at '+width);
  }
  await page.goto(base+'/');
  const isMobile=width<1200;
  const shell=page.locator('.lp-mobile-shell');
  if(isMobile)await shell.locator(':scope > summary').click();
  const nav=isMobile?shell.locator('nav'):page.locator('.desktop-nav');
  assert.ok(await nav.isVisible());
  for(const name of labels){
    const group=nav.locator('.lp-nav-group').filter({has:page.locator('summary').filter({hasText:name})}).first();
    const trigger=group.locator(':scope > summary');
    await trigger.click();
    assert.ok(await group.evaluate(el=>el.open),name+' did not open');
    const panel=group.locator('.lp-nav-panel');
    assert.ok(await panel.isVisible());
    const box=await panel.boundingBox();
    assert.ok(box.x>=-2&&box.x+box.width<=width+2,name+' dropdown outside screen '+width+' '+JSON.stringify(box));
    assert.equal(await nav.locator('.lp-nav-group[open]').count(),1);
    assert.ok(await panel.locator('a[href]').count()>0);
    await page.keyboard.press('Escape');
    assert.equal(await group.evaluate(el=>el.open),false);
  }
  const services=nav.locator('.lp-nav-group').first();
  await services.locator('summary').click();
  assert.equal(await services.locator('a[href^="/services/"]').count(),16);
  await services.locator('a[href="/services/google-ads-ppc/"]').click();
  await page.waitForURL('**/services/google-ads-ppc/');
  assert.equal(await page.locator('header[data-navigation-version="3"]').count(),1);
  assert.deepEqual(errors,[],'JavaScript errors');
  console.log('Navigation passed at '+width+'px');
  await page.close();
 }
 const nojs=await browser.newPage({viewport:{width:1280,height:900},javaScriptEnabled:false});
 await nojs.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
 await nojs.goto(base+'/');
 await nojs.locator('.desktop-nav .lp-nav-group').first().locator('summary').click();
 assert.ok(await nojs.locator('.desktop-nav .lp-nav-group').first().locator('a[href="/services/google-ads-ppc/"]').isVisible());
 await nojs.close();
 console.log('Native dropdown remains functional without JavaScript');
} finally {await browser.close()}
