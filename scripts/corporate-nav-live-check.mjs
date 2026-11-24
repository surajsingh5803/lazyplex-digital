import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const base='https://lazyplex.com';
const groups=[
 ['Company','/about/', [['About Us','/about/'],['Leadership','/leadership/'],['Our Approach','/our-approach/']]],
 ['Our Businesses','/businesses/', [['Lazy Plex Digital','https://digital.lazyplex.com/'],['Lazy Plex Software','/software/'],['Lazy Plex Labs','/labs/']]],
 ['Products & Innovation','/products/', [['Product Overview','/products/'],['LP Real Estate CRM','https://estatecrm.lazyplex.com/'],['Software Portfolio','/software/'],['Luma Circuit','/luma-circuit/']]],
 ['Insights','/insights/', [['Corporate Insights','/insights/'],['Digital Marketing Insights','https://digital.lazyplex.com/insights/']]],
 ['Contact Us','/contact/', [['General Enquiries','/contact/'],['Partnerships & Collaborations','/partnerships/'],['Product Support','/product-support/'],['Digital Marketing Enquiries','https://digital.lazyplex.com/contact/']]]
];
const abs=u=>u.startsWith('https:')?u:base+u;
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto(base+'/?navcheck='+Date.now(),{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('.lpbrand-header:visible').count(),1);
 assert.equal(await page.locator('.lpbrand-footer:visible').count(),1);
 assert.equal(await page.locator('.lpbrand-header a[href="https://lazyplex.com/pricing/"]').count(),0,'Old header links still present');
 const header=page.locator('#lpbrand-corporate-nav').first();
 assert.equal(await header.count(),1,'Header menu id missing');
 const footer=page.locator('#lpbrand-corporate-footer').first();
 assert.equal(await footer.count(),1,'Footer menu id missing');
 assert.equal(await header.locator(':scope > li').count(),6);
 for(const [label,dest,children] of groups){
   const a=header.locator(':scope > li > a').filter({hasText:label}).first();
   assert.equal(await a.getAttribute('href'),abs(dest));
   await a.hover();
   const li=a.locator('..');
   for(const [name,url] of children){
     const link=li.locator('.sub-menu a').filter({hasText:name}).first();
     assert.equal(await link.getAttribute('href'),abs(url));
     await link.waitFor({state:'visible',timeout:5000});
   }
 }
 assert.equal(await footer.locator(':scope > li').count(),4);
 const layout=await footer.evaluate(el=>({display:getComputedStyle(el).display,columns:getComputedStyle(el).gridTemplateColumns,visible:[...el.querySelectorAll('.sub-menu a')].every(a=>a.getBoundingClientRect().height>0)}));
 assert.equal(layout.display,'grid');
 assert.equal(layout.columns.split(' ').length,4);
 assert.ok(layout.visible,'Footer links must be visible without hover');
 console.log('Desktop: five dropdowns and four-column footer verified');
 await page.setViewportSize({width:390,height:844});
 await page.goto(base+'/?navcheck='+Date.now(),{waitUntil:'domcontentloaded'});
 const mobile=page.locator('.lpbrand-mobile');
 await mobile.locator('summary').click();
 assert.ok(await mobile.locator('#lpbrand-mobile-nav a[href="https://lazyplex.com/leadership/"]').isVisible(),'Mobile leadership link missing');
 assert.ok(await mobile.locator('#lpbrand-mobile-nav a[href="https://lazyplex.com/partnerships/"]').isVisible(),'Mobile partnerships link missing');
 await mobile.locator('summary').click();
 const mobileFooter=await page.locator('#lpbrand-corporate-footer').evaluate(el=>({columns:getComputedStyle(el).gridTemplateColumns,visible:[...el.querySelectorAll('.sub-menu a')].every(a=>a.getBoundingClientRect().height>0)}));
 assert.equal(mobileFooter.columns.split(' ').length,2);
 assert.ok(mobileFooter.visible);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Mobile horizontal overflow');
 console.log('Mobile: responsive two-column footer verified');
 for(const path of ['/leadership/','/our-approach/','/businesses/','/products/','/luma-circuit/','/partnerships/','/product-support/']){
   const r=await page.request.get(base+path);assert.equal(r.status(),200,path);console.log(path+' -> 200');
 }
}finally{await browser.close()}
