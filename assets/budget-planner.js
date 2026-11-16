"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const form=document.querySelector("#budget-planner-form");
  const err=document.querySelector("#budget-error");
  const reset=document.querySelector("#budget-reset");
  if(!form||!err||!reset)return;
  const ids=["customers","qualifiedRate","closeRate","cpl","fees","contribution"];
  const initial={customers:"8",qualifiedRate:"40",closeRate:"10",cpl:"400",fees:"14000",contribution:"20000"};
  const outs={qualified:"#budget-qualified",leads:"#budget-leads",spend:"#budget-spend",total:"#budget-total",breakEven:"#budget-break-even",headroom:"#budget-headroom"};
  const els=Object.fromEntries(Object.entries(outs).map(([k,id])=>[k,document.querySelector(id)]));
  const money=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0});
  const count=new Intl.NumberFormat("en-IN",{maximumFractionDigits:0});
  const set=(name,value)=>{if(els[name])els[name].textContent=value;};
  function update(){
    const v=Object.fromEntries(ids.map(k=>[k,Number(form.elements.namedItem(k)?.value)]));
    const invalid=ids.some(k=>!Number.isFinite(v[k])||v[k]<0) || !Number.isInteger(v.customers)||v.customers<1 ||v.qualifiedRate<=0||v.qualifiedRate>100||v.closeRate<=0||v.closeRate>100;
    err.textContent=invalid?"Enter a positive whole-number customer target, rates greater than 0% and at most 100%, and non-negative costs.":"";
    if(invalid){Object.keys(outs).forEach(k=>set(k,"—"));return;}
    const qualified=Math.ceil(v.customers/(v.closeRate/100));
    const leads=Math.ceil(qualified/(v.qualifiedRate/100));
    const spend=leads*v.cpl;
    const total=spend+v.fees;
    const breakEven=total/v.customers;
    const headroom=v.customers*v.contribution-total;
    const values=[qualified,leads,spend,total,breakEven,headroom];
    if(!values.every(Number.isFinite)||values.some(x=>Math.abs(x)>1e13)){
      err.textContent="These assumptions are too large to model reliably. Try smaller figures.";
      Object.keys(outs).forEach(k=>set(k,"—"));return;
    }
    set("qualified",count.format(qualified));
    set("leads",count.format(leads));
    set("spend",money.format(spend));
    set("total",money.format(total));
    set("breakEven",money.format(breakEven));
    set("headroom",money.format(headroom));
  }
  form.addEventListener("input",update);
  form.addEventListener("submit",ev=>ev.preventDefault());
  reset.addEventListener("click",()=>{for(const [k,v] of Object.entries(initial))form.elements.namedItem(k).value=v;update();});
  update();
});
