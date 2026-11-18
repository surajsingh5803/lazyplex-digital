import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const script=fs.readFileSync("assets/analytics.js","utf8");
const main=fs.readFileSync("assets/main.js","utf8");
const privacy=fs.readFileSync("privacy/index.html","utf8");
assert.match(main,/analyticsScript\.src = "\/assets\/analytics\.js"/);
assert.match(privacy,/optional Google Analytics 4/);
const created=[];
const listeners={};
const storage=new Map();
const body={appendChild(el){created.push(el)}};
const head={appendChild(el){created.push(el)}};
const footer={appendChild(el){created.push(el)}};
const doc={readyState:"complete",title:"Contact | Lazy Plex",referrer:"",
 body,head,cookie:"",createElement(tag){
  const el={tag,attrs:{},hidden:false,setAttribute(k,v){this.attrs[k]=v},
  addEventListener(k,fn){this[k]=fn},
  getAttribute(k){return this.attrs[k]},
  innerHTML:""};
  return el;
 },querySelector(q){return q===".footer-bottom"?footer:null},
 addEventListener(k,fn){listeners[k]=fn}};
const loc={origin:"https://digital.lazyplex.com",pathname:"/contact/",href:"https://digital.lazyplex.com/contact/?email=secret@example.com"};
const ctx={window:{location:loc,lpCampaignContext:{utm_source:"google",utm_campaign:"clinic_search"},dataLayer:[]},
 document:doc,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
 URL,Date,Set,JSON,console};
vm.runInNewContext(script,ctx);
assert.equal(created.filter(x=>String(x.src||"").includes("googletagmanager")).length,0,"Must not load GA4 pre-consent");
const banner=created.find(x=>x.className==="lp-consent-banner");
assert.ok(banner && !banner.hidden,"Consent banner shown before choice");
function choose(choice){
  banner.click({target:{closest:()=>({getAttribute:()=>choice})}});
}
choose("reject");
assert.equal(created.filter(x=>String(x.src||"").includes("googletagmanager")).length,0,"Rejection must not load GA4");
assert.equal(JSON.parse(storage.get("lp_digital_analytics_choice_v1")).value,"reject");
const prefs=created.find(x=>x.className==="lp-privacy-settings");
prefs.click();
assert.equal(banner.hidden,false);
choose("accept");
const ga=created.filter(x=>String(x.src||"").includes("googletagmanager"));
assert.equal(ga.length,1,"Accepted consent loads GA4 exactly once");
const conf=ctx.window.dataLayer.find(x=>Array.isArray(x)&&x[0]==="config");
assert.ok(conf,"config event");
assert.ok(conf[2].page_location.includes("utm_source=google"),"safe UTMs retained");
assert.ok(!conf[2].page_location.includes("secret@example.com"),"unrestricted query must not leak");
const previous=ctx.window.dataLayer.length;
ctx.window.dataLayer.push({event:"lazyplex_phone_click",phone:"9876543210"});
const emission=ctx.window.dataLayer.slice(previous).find(x=>Array.isArray(x)&&x[0]==="event");
assert.ok(emission);
assert.equal(emission[1],"lazyplex_phone_click");
assert.equal("phone" in emission[2],false);
console.log("Consent-first GA4 tests passed: opt-in only, reject, revoke controls, safe attribution and personal-data exclusion.");
