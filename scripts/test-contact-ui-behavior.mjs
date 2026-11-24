import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

// Simulate the browser control flow without real customer data or creating a CRM lead.
const script = fs.readFileSync("assets/contact-intake.js", "utf8");
const values = {
  name:"Sample Person",phone:"+917000001234",email:"test@example.com",
  company:"Sample Company",industry:"Education",service:"search-engine-optimisation",
  budget:"Not sure",message:"I need SEO for our education website.",
  website:"",consent:"yes"
};
let posts = 0, renders = 0, callback, onClick, lastBody;
const panel = {hidden:true};
const status = {textContent:"",className:""};
const button = {disabled:false,textContent:"Submit my project enquiry",addEventListener:(type,fn)=>{
  assert.equal(type,"click");onClick=fn;
}};
const form = {
  reportValidity:()=>true,
  elements:{namedItem:()=>({focus(){},setCustomValidity(){},reportValidity(){return true;}})}
};
const api = {
  render:(_widget,options)=>{renders++;callback=options.callback;return "widget-1";},
  reset:()=>{}
};
const document = {
  querySelector:(selector)=>({
    "#enquiry-form":form,
    "#secure-intake":panel,
    "#secure-intake-status":status,
    "#send-secure-enquiry":button,
    "#secure-turnstile":{}
  })[selector]||null,
  createElement:()=>({}),
  head:{appendChild:tag=>queueMicrotask(()=>tag.onload())}
};
class FakeFormData {constructor(formRef){assert.equal(formRef,form);}get(k){return values[k]??null;}}
const window = {turnstile:api,lpCampaignContext:{utm_source:"google"},dataLayer:[]};
const fetch = async (url,opts={})=>{
  if (url.endsWith("/status"))
    return {ok:true,json:async()=>({enabled:true,siteKey:"test-public-site-key"})};
  assert.equal(url,"https://crm.lazyplex.com/api/public-leads");
  assert.equal(opts.method,"POST");
  posts++;
  lastBody=JSON.parse(opts.body);
  if(posts===1)
    return {ok:false,status:422,json:async()=>({detail:"Please describe your project in at least 10 characters"})};
  return {ok:true,status:201,json:async()=>({received:true})};
};
vm.runInNewContext(script,{window,document,fetch,FormData:FakeFormData,
  Date,Promise,JSON,RegExp,AbortController,setTimeout,clearTimeout,console});
const flush=()=>new Promise(resolve=>setTimeout(resolve,5));
await flush();
assert.equal(panel.hidden,false,"Secure option is shown only after backend reports active");
assert.ok(onClick,"Submission click handler");
values.message="hi";
onClick();
assert.equal(posts,0,"Short message rejected before Turnstile or POST");
assert.match(status.textContent,/at least 10 characters/);
values.message="I need SEO services for our coaching business.";
onClick();
await flush();
assert.equal(renders,1,"Turnstile rendered exactly once");
assert.equal(posts,0,"No submission before verified token");
callback("cloudflare-valid-widget-token");
await flush();
assert.equal(posts,1,"One click triggers one POST automatically when the challenge passes");
assert.equal(lastBody.consent,true);
assert.equal(lastBody.turnstile_token,"cloudflare-valid-widget-token");
assert.match(status.textContent,/Please correct your enquiry:/,"Server response is visible to visitors");
assert.equal(button.disabled,false,"Visitor can correct and retry");
onClick();
await flush();
assert.equal(posts,2,"Retry after correcting a server-side validation issue");
assert.equal(renders,1,"Retry of HTTP 422 does not need another Cloudflare challenge");
assert.match(status.textContent,/Your enquiry has been received/);
assert.equal(button.disabled,true);
assert.equal(window.dataLayer.filter(x=>x.event==="lazyplex_secure_enquiry_received").length,1);
onClick();
await flush();
assert.equal(posts,2,"Successful submission cannot duplicate a lead by repeated clicking");
console.log("Browser flow passed: early validation, one-click challenge, useful HTTP 422, safe retry and duplicate prevention.");
