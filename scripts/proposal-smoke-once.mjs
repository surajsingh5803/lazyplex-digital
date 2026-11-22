import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
let outcome={};
try{
  const r=await page.goto("https://lazyplex.com/request-proposal/?service=seo&tier=basic",{waitUntil:"domcontentloaded",timeout:35000});
  await page.waitForTimeout(900);
  outcome.pageStatus=r?.status();
  outcome.prefill=await page.locator('input[name="g539-serviceorgrowthsolution"]').inputValue();
  if(outcome.prefill!=="SEO — Basic") throw Error("Service prefill did not match");
  await page.locator('input[name="g539-fullname"]').fill("LP Internal QA — No Follow Up");
  await page.locator('input[name="g539-email"]').fill("plexlazy@gmail.com");
  await page.locator('input[name="g539-businessorcompany"]').fill("Lazy Plex Internal QA");
  await page.locator('input[name="g539-industrybusinesstype"]').fill("Software");
  await page.locator('textarea[name="g539-yourgoalsandrequirementsnosensitivedata"]').fill("Internal QA test of form delivery only. Do not treat as a customer lead.");
  await page.locator('input[name="g539-iagreetobecontactedaboutthisenquiry"]').check();
  await page.locator('#contact-form-539 button[type="submit"]').click();
  await page.waitForTimeout(4500);
  outcome.success=await page.locator('.wp-block-jetpack-contact-form__success,.contact-form-submission,.form-submission-success').count();
  outcome.pageText=(await page.locator('body').innerText()).slice(-1400);
  outcome.formStillVisible=await page.locator('#contact-form-539 button[type="submit"]').count()>0;
  console.log("LP_FORM_QA "+JSON.stringify(outcome));
  if(!outcome.success && !/thank you|successfully submitted|message (?:has been )?sent/i.test(outcome.pageText)) process.exitCode=1;
}catch(e){console.log("LP_FORM_QA_ERROR "+JSON.stringify({message:String(e),outcome}));process.exitCode=1;}
finally{await browser.close();}
