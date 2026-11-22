(() => {
  'use strict';
  const root = document.getElementById('lpgp-pricing');
  const cfg = window.LPGP_CONFIG;
  if (!root || !cfg) return;
  const params = new URLSearchParams(window.location.search);
  const state = {catalog:null, pillar:['get','convert','automate','measure'].includes(params.get('pillar'))?params.get('pillar'):'get', mode:['bundle','individual'].includes(params.get('mode'))?params.get('mode'):'bundle', tier:['basic','intermediate','advanced'].includes(params.get('tier'))?params.get('tier'):'basic', selected:new Map(), extras:new Map(), quote:null, sequence:0, loading:false};
  const money = n => n === null || n === undefined ? 'Custom quote' : '₹' + Number(n).toLocaleString('en-IN');
  const safe = s => String(s ?? '').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const tierName = id => state.catalog?.tiers?.[id] || 'Basic';
  const service = id => state.catalog.services.find(x=>x.id===id);
  const serviceTier = (s,t) => s.tiers[t] || s.tiers.basic;
  const sum = (arr,key) => arr.reduce((n,x)=>n+(Number(x?.[key])||0),0);
  const fees = (v) => `<strong>${money(v)}</strong>`;
  const handleErr = error => {
    const aside = root.querySelector('.lpgp-summary');
    if (aside) aside.innerHTML = `<div role="alert" class="lpgp-error">Price verification failed. Please try again or request a manual quotation. ${safe(error.message || '')}</div>`;
  };
  async function calculate() {
    const seq = ++state.sequence;
    const selected = [...(state.mode==='bundle'?state.extras:state.selected)].map(([id,tier])=>({id,tier}));
    const payload = state.mode === 'bundle' ? {mode:'bundle',pillar:state.pillar,tier:state.tier,selected} : {mode:'individual',selected};
    const aside = root.querySelector('.lpgp-summary');
    if (aside) aside.innerHTML = `<div class="lpgp-loader" role="status">Verifying estimate on the server…</div>`;
    try {
      const response = await fetch(cfg.calculate,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),credentials:'omit'});
      if (!response.ok) throw Error('Service unavailable ('+response.status+')');
      const result = await response.json();
      if (seq!==state.sequence) return;
      if (!result || result.code || result.error) throw Error(result.message||'Invalid estimate');
      state.quote=result;
      if (aside) aside.innerHTML = summary(result);
    }catch(e){if (seq===state.sequence){state.quote=null;handleErr(e);}}
  }
  function header() {
    return `<nav class="lpgp-pillar-tabs" aria-label="Choose a growth pillar">${Object.entries(state.catalog.pillars).map(([id,p],i)=>`<button type="button" data-pillar="${id}" aria-pressed="${state.pillar===id}" class="${state.pillar===id?'is-active':''}"><span>${String(i+1).padStart(2,'0')}</span>${safe(p.title)}</button>`).join('')}</nav>`;
  }
  function modeSelect(){
    return `<div class="lpgp-buy-modes" aria-label="Choose a buying method"><button data-mode="bundle" type="button" aria-pressed="${state.mode==='bundle'}" class="${state.mode==='bundle'?'is-active':''}"><span class="lpgp-mode-icon" aria-hidden="true">▦</span><span><strong>Complete pillar bundle</strong><small>All capabilities in one clearly scoped solution</small></span></button><button data-mode="individual" type="button" aria-pressed="${state.mode==='individual'}" class="${state.mode==='individual'?'is-active':''}"><span class="lpgp-mode-icon" aria-hidden="true">☑</span><span><strong>Choose individual services</strong><small>Select services and tiers à la carte</small></span></button></div>`;
  }
  function bundleContent(){
    const p=state.catalog.pillars[state.pillar];const b=state.catalog.bundles[state.pillar];const tier=b.tiers[state.tier];
    const available=state.catalog.services.filter(s=>!b.included.includes(s.id));
    const separateServices=b.included.map(id=>service(id)?.tiers[state.tier]).filter(Boolean);
    const separateMonthly=sum(separateServices,'monthly'), separateOnce=sum(separateServices,'once');
    const comparison=`<div class="lpgp-independent-reference"><strong>What would these ${b.included.length} full standalone ${safe(tierName(state.tier))} services list for?</strong><div><span>Separate recurring service fees</span><b>${money(separateMonthly)}/month</b></div><div><span>Standalone one-time projects</span><b>${money(separateOnce)}</b></div><small>This is a full standalone service basket, not the same scope as this bundle. No savings claim is made against these figures. Comparable savings appear only after deliverables are verified.</small></div>`;
    return `<div class="lpgp-section-heading"><div><div class="lpgp-kicker">ONE SOLUTION. ONE BUNDLE PRICE.</div><h2>${safe(p.title)} <span>Bundle</span></h2><p>${safe(p.description)} ${state.pillar==='get'?'Every tier includes all eight customer-acquisition capabilities, each with defined limits.':''}</p></div></div>
    <div class="lpgp-tier-switch" role="group" aria-label="Choose bundle level">${Object.keys(state.catalog.tiers).map(t=>`<button data-tier="${t}" aria-pressed="${t===state.tier}" type="button" class="${t===state.tier?'is-active':''}"><strong>${safe(tierName(t))}</strong><span>${money(b.tiers[t].monthly)}${b.tiers[t].monthly===null?'':' / month'}</span></button>`).join('')}</div>
    <section class="lpgp-bundle-detail"><div class="lpgp-bundle-top"><div><div class="lpgp-kicker">WHAT YOU GET</div><h3>${b.included.length} included capabilities · ${safe(tierName(state.tier))}</h3></div><div class="lpgp-bundle-price"><strong>${money(tier.monthly)}</strong><small>${tier.monthly===null?'Scoped to requirements':'per month, excludes external spend'}</small></div></div>
    <div class="lpgp-scope-grid"><ul>${(tier.scopes||[]).map(i=>`<li>✓ ${safe(i)}</li>`).join('')}</ul></div>
    <p class="lpgp-small">Important: capabilities are <strong>included at the stated limited bundle scope</strong>. These are not eight full standalone retainers. Complete branding projects, full website builds, ad spend, software subscriptions, and extra content/workflows can be separately scoped.</p></section>
    ${comparison}
    <details class="lpgp-details"><summary>See the individual services behind this bundle <span>↗</span></summary><div class="lpgp-mini-services">${b.included.map(id=>{const s=service(id);return `<div><strong>${safe(s?.name||id)}</strong><span>Standalone Basic: ${money(s?.tiers.basic.monthly||s?.tiers.basic.once)} ${s?.unit==='once'?'one-time':'/month'}</span><a href="${safe(s.url)}" target="_blank" rel="noopener noreferrer">Service details ↗</a></div>`}).join('')}</div><p class="lpgp-small">These standalone prices are displayed for transparency. Their deliverables can be broader than the limited bundle work.</p></details>
    <details class="lpgp-details"><summary>Need extra capabilities from other pillars? <span>+</span></summary><p class="lpgp-small">Select services outside ${safe(p.title)}. Included services will never be charged twice. Upgrading an included service beyond its bundle limit requires a scoped quotation.</p>${available.map(s=>`<div class="lpgp-service-choice"><label><input type="checkbox" data-extra="${s.id}" ${state.extras.has(s.id)?'checked':''} /><span>${safe(s.name)}</span></label><select data-extra-tier="${s.id}" aria-label="${safe(s.name)} service level" ${state.extras.has(s.id)?'':'disabled'}>${Object.keys(state.catalog.tiers).map(t=>`<option value="${t}" ${state.extras.get(s.id)===t?'selected':''}>${safe(tierName(t))}: ${money(s.tiers[t].monthly||s.tiers[t].once)}</option>`).join('')}</select></div>`).join('')}</details>`;
  }
  function individualContent(){
    const p=state.catalog.pillars[state.pillar];const services=state.catalog.services.filter(s=>s.pillar===state.pillar);
    return `<div class="lpgp-section-heading"><div><div class="lpgp-kicker">BUY JUST WHAT YOU NEED</div><h2>${safe(p.title)} <span>Services</span></h2><p>Select standalone services, choose Basic, Intermediate or Advanced and review the exact scope before comparing with the complete bundle.</p></div></div>
    <div class="lpgp-service-grid">${services.map(s=>{const selected=state.selected.has(s.id),t=state.selected.get(s.id)||'basic',plan=serviceTier(s,t);return `<article class="lpgp-service-card ${selected?'is-selected':''}"><div class="lpgp-service-head"><label><input type="checkbox" data-select="${s.id}" ${selected?'checked':''} /><strong>${safe(s.name)}</strong></label><span class="lpgp-service-tag">${s.unit==='once'?'One-time':'Monthly'}</span></div><p>${safe(s.summary)}</p><label class="lpgp-field-label" for="lpgp-tier-${s.id}">Service level</label><select id="lpgp-tier-${s.id}" data-service-tier="${s.id}" ${selected?'':'disabled'}>${Object.keys(state.catalog.tiers).map(key=>`<option value="${key}" ${t===key?'selected':''}>${safe(tierName(key))} · ${money(s.tiers[key].monthly||s.tiers[key].once)}${s.tiers[key].monthly&&s.tiers[key].once?' + '+money(s.tiers[key].once)+' setup':''}</option>`).join('')}</select><p class="lpgp-service-scope">${safe(plan.scope)}</p><a href="${safe(s.url)}" target="_blank" rel="noopener noreferrer">Explore detailed service ↗</a></article>`}).join('')}</div>
    <div class="lpgp-compare-banner"><div><strong>Want every ${safe(p.title)} capability in one solution?</strong><p>Compare with the bundle from ${money(state.catalog.bundles[state.pillar].tiers.basic.monthly)}${state.catalog.bundles[state.pillar].tiers.basic.monthly===null?'':'/month'}. It includes ${p.service_ids.length} capped capabilities. Deliverable quantities differ from standalone services, so the totals are not automatically a savings claim.</p></div><button type="button" data-mode="bundle" class="lpgp-ghost-btn">Compare bundle ↗</button></div>`;
  }
  function summary(q){
    const isBundle=q.mode==='bundle';const listed=q.lines||[];const b=isBundle?state.catalog.bundles[state.pillar]:null;
    const extraCount=(q.extras||[]).length;
    const content=isBundle?`<div class="lpgp-subline">${safe(b.title)} · ${safe(tierName(state.tier))}</div><div class="lpgp-include-line">✓ ${b.included.length} capabilities included at capped scope</div>`:`<div class="lpgp-subline">${listed.length} standalone service${listed.length===1?'':'s'} selected</div>${listed.length?`<ul class="lpgp-cart-items">${listed.map(x=>`<li><span>${safe(x.name)} · ${safe(tierName(x.tier))}</span><span>${money(x.monthly||x.once)} ${x.once&&!x.monthly?'once':'/mo'}</span></li>`).join('')}</ul>`:''}`;
    const reference=isBundle&&q.reference&&q.savings?`<div class="lpgp-savings"><div>Verified equivalent standalone price: <del>${money(q.reference.monthly)}/mo</del></div><strong>You save ${money(q.savings.monthly)}/month</strong><small>Scope-equivalent reference confirmed by pricing administrator</small></div>`:'';
    const notice=(!state.catalog||state.catalog.status!=='published')?`<div class="lpgp-warning lpgp-banner">Planning preview · Rates not yet approved</div>`:'';
    const quoteButton=`<button class="lpgp-submit" type="button" data-show-form="1">Request this quotation ↗</button><button class="lpgp-copy" type="button" data-copy="quote">Copy estimate</button><form class="lpgp-enquiry" data-quote-form="1" hidden><h4>Send your selected scope</h4><p>We'll receive the exact service selection and a server-verified price estimate. No payment is collected.</p><label>Your name <input name="name" autocomplete="name" maxlength="100" required></label><label>Company (optional) <input name="company" autocomplete="organization" maxlength="130"></label><label>Email address <input name="email" type="email" autocomplete="email" required></label><label>Phone (optional) <input name="phone" type="tel" autocomplete="tel" maxlength="40"></label><label>Notes (optional) <textarea name="message" maxlength="2000" rows="3" placeholder="Business goal, website or question"></textarea></label><div class="lpgp-trap" aria-hidden="true"><label>Website <input name="website_field" autocomplete="off" tabindex="-1"></label></div><label class="lpgp-consent"><input name="consent" type="checkbox" required> I agree to be contacted about this quotation and understand that the details I submit will be used to respond. <a href="${safe(cfg.privacy)}">Privacy information</a>.</label><button class="lpgp-submit" type="submit">Send quote request ↗</button><p class="lpgp-form-status" role="status" aria-live="polite"></p></form>`;
    return `<div class="lpgp-kicker">YOUR ESTIMATE</div><h3>${isBundle?'Growth solution':'Selected specialist services'}</h3>${notice}${content}
    <div class="lpgp-price-row"><span>Monthly services</span><strong>${money(q.monthly)}${q.monthly!==null?'/mo':''}</strong></div><div class="lpgp-price-row"><span>One-time setup / projects</span><strong>${money(q.once)}</strong></div>${extraCount?`<div class="lpgp-price-row"><span>Additional services</span><strong>${extraCount} selected</strong></div>`:''}<div class="lpgp-price-total"><span>First-month starting estimate</span><strong>${money(q.first_month)}</strong></div>${reference}<p class="lpgp-comparison-note">${safe(q.comparison_note)}</p><p class="lpgp-small">Ad budgets, hosting, software/API charges, messaging fees and applicable taxes are separate. No payment is collected here.</p>${quoteButton}`;
  }
  function draw(){
    root.querySelector('.lpgp-shell').innerHTML = `${header()}<div class="lpgp-main-layout"><section class="lpgp-selector">${modeSelect()}${state.mode==='bundle'?bundleContent():individualContent()}</section><aside class="lpgp-summary" aria-live="polite"><div class="lpgp-loader">Preparing estimate…</div></aside></div><div class="lpgp-end"><h2>One company. Four connected ways to grow.</h2><p><a href="/solutions/">Explore all growth solutions</a> · <a href="/industries/">All nine industries</a> · <a href="https://digital.lazyplex.com/services/">Specialist Digital services</a> · <a href="/software/">Software & products</a></p></div>`;
    calculate();
  }
  root.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.showForm){const f=root.querySelector('[data-quote-form]');if(f){f.hidden=false;f.scrollIntoView({block:'nearest',behavior:'smooth'});f.querySelector('input[name="name"]')?.focus();}return;}
    if(button.dataset.pillar){state.pillar=button.dataset.pillar;state.extras=new Map([...state.extras].filter(([id])=>!state.catalog.pillars[state.pillar].service_ids.includes(id)));draw();}
    else if(button.dataset.mode){state.mode=button.dataset.mode;draw();}
    else if(button.dataset.tier){state.tier=button.dataset.tier;draw();}
    else if(button.dataset.copy && state.quote){
      const q=state.quote;const title=q.mode==='bundle'?`${q.title} ${tierName(q.tier)}`:'Individual services';
      const details=q.mode==='bundle'?(q.scopes||[]).join('\n- '):(q.lines||[]).map(s=>`${s.name} · ${tierName(s.tier)}: ${money(s.monthly||s.once)}`).join('\n- ');
      const value=`Lazy Plex ${q.quote_status==='planning-preview'?'WORKING PREVIEW — NOT AN OFFER':'Starting estimate'}\n${title}\n- ${details}\nMonthly: ${money(q.monthly)}\nOne-time: ${money(q.once)}\nFirst month: ${money(q.first_month)}\nExternal charges and tax additional.\nScope varies between bundles and standalone services.`;
      if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(value).then(()=>{button.textContent='Copied ✓';}).catch(()=>{button.textContent='Copy failed';});
    }
  });
  root.addEventListener('change',event=>{
    const target=event.target;
    if(target.dataset.select){if(target.checked)state.selected.set(target.dataset.select, state.selected.get(target.dataset.select)||'basic');else state.selected.delete(target.dataset.select);draw();}
    else if(target.dataset.serviceTier){state.selected.set(target.dataset.serviceTier,target.value);draw();}
    else if(target.dataset.extra){if(target.checked)state.extras.set(target.dataset.extra,'basic');else state.extras.delete(target.dataset.extra);draw();}
    else if(target.dataset.extraTier){state.extras.set(target.dataset.extraTier,target.value);draw();}
  });
  root.addEventListener('submit',async event=>{
    const form=event.target.closest('[data-quote-form]');if(!form)return;event.preventDefault();
    if(!form.reportValidity())return;
    const status=form.querySelector('.lpgp-form-status');const submit=form.querySelector('button[type="submit"]');
    const fd=new FormData(form);const selection=state.mode==='bundle'?{mode:'bundle',pillar:state.pillar,tier:state.tier,selected:[...state.extras].map(([id,tier])=>({id,tier}))}:{mode:'individual',selected:[...state.selected].map(([id,tier])=>({id,tier}))};
    submit.disabled=true;status.textContent='Submitting and verifying your selection…';
    try {
      const res=await fetch(cfg.request,{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:fd.get('name'),company:fd.get('company'),email:fd.get('email'),phone:fd.get('phone'),message:fd.get('message'),website_field:fd.get('website_field'),consent:fd.has('consent'),selection})});
      const payload=await res.json();if(!res.ok||!payload.received)throw Error(payload.message||'Unable to confirm your enquiry');
      form.innerHTML=`<div class="lpgp-confirm" role="status"><strong>Quotation request received</strong><p>Your reference: ${safe(payload.reference||'')}. Our team can review your selection. Please save this reference for follow-up.</p><a href="${safe(cfg.contact)}">Contact Lazy Plex</a></div>`;
    }catch(e){status.textContent='We could not confirm your submission: '+String(e.message||'Unknown error')+'. You can use the main contact page.';submit.disabled=false;}
  });
  
  const inline = root.querySelector('script[data-lpgp-catalog]');
  try {
    if (inline) {
      const c=JSON.parse(inline.textContent);
      if (!c.services || !c.bundles) throw Error('Invalid catalogue');
      state.catalog=c;draw();
    } else throw Error('No inline catalogue');
  } catch (_) {
    fetch(cfg.catalog,{credentials:'omit'}).then(r=>{if(!r.ok)throw Error('Catalogue not available');return r.json();}).then(c=>{if(!c.services||!c.bundles)throw Error('Incomplete catalogue');state.catalog=c;draw();}).catch(e=>root.querySelector('.lpgp-shell').innerHTML=`<p class="lpgp-error" role="alert">Pricing catalogue is temporarily unavailable. <a href="${safe(cfg.contact)}">Request a manual quote</a>.</p>`);
  }
})();