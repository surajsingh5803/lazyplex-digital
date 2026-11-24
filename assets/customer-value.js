"use strict";
(() => {
 const normalize=value=>String(value||"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim();
 const matches=(query,text)=>normalize(query).split(" ").filter(Boolean).every(word=>normalize(text).includes(word));
 const price=document.getElementById("lp-price-filter");
 if(price){
   const input=document.getElementById("lp-price-search"),count=document.getElementById("lp-price-count"),cards=[...document.querySelectorAll(".price-card")];
   const apply=()=>{let visible=0;for(const card of cards){const selected=!!card.querySelector("select[data-kind]")?.value;card.hidden=!selected&&!matches(input.value,card.textContent);if(!card.hidden)visible++;}count.textContent=visible+" of "+cards.length+" options shown. Selected tiers stay visible.";};
   input.addEventListener("input",apply);document.getElementById("lp-price-clear").addEventListener("click",()=>{input.value="";apply();input.focus()});document.querySelectorAll("select[data-kind]").forEach(el=>el.addEventListener("change",apply));
   document.getElementById("reset-plan")?.addEventListener("click",apply);
   document.querySelectorAll("#lp-price-jump a[href^='#']").forEach(a=>a.addEventListener("click",()=>{input.value="";apply()}));
   price.hidden=false;apply();
 }
 const resources=document.getElementById("lp-resource-discovery");
 if(resources){
   const input=document.getElementById("lp-resource-search"),category=document.getElementById("lp-resource-category"),count=document.getElementById("lp-resource-count");
   const cards=[...document.querySelectorAll("main .seo-blog-card")];
   const categoryFor=card=>{const pathname=new URL(card.href,location.href).pathname;return pathname.startsWith("/industries/")?pathname.split("/")[2]:"general"};
   const sections=[...new Set(cards.map(card=>card.closest(".seo-section")).filter(Boolean))];
   const apply=()=>{let visible=0;for(const card of cards){const topic=categoryFor(card);card.hidden=!(matches(input.value,card.textContent+" "+topic)&&(!category.value||category.value===topic));if(!card.hidden)visible++;}for(const section of sections){const group=[...section.querySelectorAll(".seo-blog-card")];section.hidden=group.length>0&&group.every(card=>card.hidden);}count.textContent=visible+" of "+cards.length+" guides shown"+(visible?"":" — try another search or clear the filters")+".";
   };
   input.addEventListener("input",apply);category.addEventListener("change",apply);document.getElementById("lp-resource-clear").addEventListener("click",()=>{input.value="";category.value="";apply();input.focus()});resources.hidden=false;apply();
 }
})();
