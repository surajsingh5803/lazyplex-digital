import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync("assets/real-estate-funnel.js", "utf8");
const initial = {spend:"60000",leads:"150",qualified:"60",scheduled:"30",attended:"20",bookings:"3"};
const controls = Object.fromEntries(Object.entries(initial).map(([k,v])=>[k,{value:v}]));
const elements = {};
const listeners = {};
const outputIds = ["#funnel-cpl","#funnel-cpql","#funnel-visit-cost","#funnel-booking-cost","#funnel-quality-rate","#funnel-attendance-rate"];
for (const id of outputIds) elements[id]={textContent:"—"};
elements["#funnel-error"]={textContent:""};
const form = {
  elements:{namedItem:key=>controls[key]},
  addEventListener:(type,fn)=>{listeners["form:"+type]=fn;},
  reset:()=>{for(const [k,v] of Object.entries(initial))controls[k].value=v;}
};
const reset = {addEventListener:(type,fn)=>{listeners["reset:"+type]=fn;}};
const document = {
  querySelector:selector=>selector==="#property-funnel-form"?form:selector==="#funnel-reset"?reset:elements[selector],
  addEventListener:(type,fn)=>{if(type==="DOMContentLoaded")fn();}
};
vm.runInNewContext(source,{document,Intl,Number,Object,console});
function contains(id,expected){assert.ok(elements[id].textContent.includes(expected),id+" expected "+expected+"; got "+elements[id].textContent);}
contains("#funnel-cpl","400");
contains("#funnel-cpql","1,000");
contains("#funnel-visit-cost","3,000");
contains("#funnel-booking-cost","20,000");
contains("#funnel-quality-rate","40");
contains("#funnel-attendance-rate","66.7");
assert.equal(elements["#funnel-error"].textContent,"");
controls.qualified.value="200";
listeners["form:input"]();
assert.notEqual(elements["#funnel-error"].textContent,"");
assert.equal(elements["#funnel-cpql"].textContent,"—");
controls.qualified.value="0";controls.scheduled.value="0";controls.attended.value="0";controls.bookings.value="0";controls.leads.value="0";
listeners["form:input"]();
assert.equal(elements["#funnel-error"].textContent,"");
assert.equal(elements["#funnel-cpl"].textContent,"—");
assert.equal(elements["#funnel-booking-cost"].textContent,"—");
controls.leads.value="50";controls.qualified.value="2.5";
listeners["form:input"]();
assert.notEqual(elements["#funnel-error"].textContent,"");
listeners["reset:click"]();
assert.equal(elements["#funnel-error"].textContent,"");
contains("#funnel-cpl","400");
console.log("Property funnel calculator smoke test passed: defaults, arithmetic, zero denominators, invalid stage counts and reset.");
