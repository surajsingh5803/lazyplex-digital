import assert from "node:assert/strict";
import fs from "node:fs";
const css=fs.readFileSync("assets/styles.css","utf8");
function declaration(selector,key) {
  const start=css.indexOf(selector+"{");
  assert.ok(start>=0,"Missing selector "+selector);
  const from=start+selector.length+1;
  const end=css.indexOf("}",from);
  assert.ok(end>from,"Unclosed selector "+selector);
  const declarations=css.slice(from,end).split(";");
  const found=declarations.find(x=>x.split(":")[0]?.trim()===key);
  assert.ok(found,"Missing "+key+" in "+selector);
  return found.split(":").slice(1).join(":").trim();
}
function rgb(hex) {
  const x=hex.replace("#","");
  return [0,2,4].map(i=>parseInt(x.slice(i,i+2),16)/255).map(c=>c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4));
}
function luminance(hex){const [r,g,b]=rgb(hex);return 0.2126*r+0.7152*g+0.0722*b;}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}
const cases=[
  {fg:declaration(".small-caps","color"),bg:"#ffffff",name:"Small service labels"},
  {fg:declaration(".offer-card small","color"),bg:"#ffffff",name:"Offer card labels"},
  {fg:declaration(".section-offer h2 em","color"),bg:declaration(".section-offer","background"),name:"Highlighted offer heading"}
];
for(const c of cases){
  const ratio=contrast(c.fg,c.bg);
  assert.ok(ratio>=4.5,c.name+" contrast must be >=4.5:1, got "+ratio.toFixed(2));
  console.log(c.name+" contrast "+ratio.toFixed(2)+":1 PASS");
}
console.log("Targeted homepage text contrast checks passed.");
