"use strict";
const WA_NUMBER = "917257919567";
// Only non-sensitive, short UTM labels are retained in this tab for enquiry routing.
// No names, phone numbers, emails, query strings or form messages are stored here.
const campaignFields = ["utm_source", "utm_medium", "utm_campaign"];
const safeCampaignValue = value => typeof value === "string" && /^[a-z0-9][a-z0-9_.-]{0,47}$/i.test(value) ? value.toLowerCase() : "";
const pageParams = new URLSearchParams(window.location.search);
const incomingCampaign = Object.fromEntries(campaignFields.map(key => [key, safeCampaignValue(pageParams.get(key))]));
let campaignContext = {...incomingCampaign};
try {
  const key = "lazyplex_campaign_session";
  if (campaignFields.some(k => incomingCampaign[k])) {
    window.sessionStorage.setItem(key, JSON.stringify({...incomingCampaign, savedAt: Date.now()}));
  } else {
    const stored = JSON.parse(window.sessionStorage.getItem(key) || "null");
    if (stored && Number.isFinite(stored.savedAt) && Date.now() >= stored.savedAt && Date.now() - stored.savedAt < 30 * 60 * 1000) {
      campaignContext = Object.fromEntries(campaignFields.map(k => [k, safeCampaignValue(stored[k])]));
    }
  }
} catch {
  // Browsers that disable session storage still support the contact form.
}
document.addEventListener("click", event => {
  const link = event.target?.closest?.("a[href]");
  if (!link) return;
  let target;
  try { target = new URL(link.getAttribute("href"), window.location.href); }
  catch { return; }
  // Record click intent only. Do not send contact details or claim a delivered enquiry.
  const eventType = target.protocol === "tel:" ? "lazyplex_phone_click"
    : (target.hostname === "wa.me" || target.hostname === "api.whatsapp.com") ? "lazyplex_whatsapp_click" : "";
  if (eventType) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:eventType,page_path:window.location.pathname});
    return;
  }
  if (target.origin !== window.location.origin || target.pathname !== "/contact/") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({event:"lazyplex_contact_cta_click",page_path:window.location.pathname,service:target.searchParams.get("service")||""});
});

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
    menu.hidden = true;
  }));
}
window.lpCampaignContext = {...campaignContext};
const form = document.querySelector('#enquiry-form');
if (form) {
  const waButton = form.querySelector?.('#whatsapp-submit');
  if (waButton) waButton.disabled = false;
  const params = new URLSearchParams(window.location.search);

  // Route a healthcare service/topic without collecting clinical or personal data in analytics.
  const focusNames = {
    'doctor-marketing':'Doctor marketing and practitioner visibility',
    'hospital-seo':'Hospital SEO services',
    'google-ads':'Google Ads for hospitals and clinics',
    'ivf-marketing':'IVF and fertility clinic marketing',
    'google-business-profile-for-doctors':'Doctor Google Business Profile guidance',
    'hospital-lead-counting-guide':'Hospital enquiry tracking and deduplication',
    'healthcare-seo-pricing-india':'Healthcare SEO scope and pricing',
    'ivf-clinic-marketing-guide':'IVF clinic marketing guide',
    'real-estate-seo':'Real estate SEO and project-page optimisation',
    'real-estate-lead-generation':'Real estate qualified buyer lead generation',
    'real-estate-google-ads':'Google Ads for real estate developers',
    'ai-search-optimisation':'AI search optimisation services',
    'property-qualified-lead-cost':'Property CPL and qualified buyer cost guide',
    'property-search-vs-pmax':'Search versus Performance Max for property campaigns',
    'property-launch-marketing':'Real estate project launch marketing',
    'developer-vs-broker-seo':'Developer SEO versus broker SEO',
    'property-funnel-reporting':'Real estate site visit and booking reporting',
    'seo-aeo-geo-guide':'SEO, AEO and GEO comparison guide'
  };
  const focus = params.get('focus') || '';
  const source = params.get('source') || '';
  const safeSource = /^[a-z0-9-]{1,60}$/.test(source) ? source : '';
  const enquiryContext = document.querySelector('#enquiry-context');
  if (enquiryContext && Object.prototype.hasOwnProperty.call(focusNames, focus)) {
    enquiryContext.textContent = 'You are enquiring about: ' + focusNames[focus] + '.';
    enquiryContext.hidden = false;
  }
  const service = params.get('service');
  const industry = params.get('industry');
  const serviceInput = form.elements.namedItem('service');
  const industryInput = form.elements.namedItem('industry');
  if (service && serviceInput && [...serviceInput.options].some(o => o.value === service)) serviceInput.value = service;
  if (industry && industryInput) {
    const industryMatch = [...industryInput.options].find(o => o.value.toLowerCase().replaceAll(' ','-') === industry || o.text.toLowerCase().replaceAll(' ','-') === industry);
    if (industryMatch) industryInput.value = industryMatch.value;
    // Explicit maps for display labels that differ from URL slugs.
    const industryLabels = {'healthcare':'Healthcare','ecommerce':'E-commerce','real-estate':'Real Estate','education':'Education','beauty-wellness':'Beauty & Wellness','hospitality':'Hospitality & Travel','professional-services':'Professional Services','manufacturing-b2b':'Manufacturing & B2B','startups-smes':'Startup / SME'};
    if (industryLabels[industry]) industryInput.value=industryLabels[industry];
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = document.querySelector('#form-status');
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const selectedService = serviceInput.options[serviceInput.selectedIndex]?.text || '';
    const lines = [
      'Hi Lazy Plex, I would like a quote / consultation.',
      '',
      'Name: ' + (d.get('name') || ''),
      'Phone: ' + (d.get('phone') || ''),
      'Email: ' + (d.get('email') || 'Not provided'),
      'Company: ' + (d.get('company') || 'Not provided'),
      'Industry: ' + (d.get('industry') || ''),
      'Service: ' + selectedService,
      'Approx. budget: ' + (d.get('budget') || 'Not provided'),
      'Project goals: ' + (d.get('message') || ''),
      '',
      'Sent from digital.lazyplex.com'
    ];
    if (Object.prototype.hasOwnProperty.call(focusNames, focus)) lines.splice(2, 0, 'Topic: ' + focusNames[focus]);
    if (safeSource) lines.splice(3, 0, 'Page source: ' + safeSource);
    if (campaignContext.utm_source) lines.splice(4, 0, "Campaign source: " + campaignContext.utm_source);
    if (campaignContext.utm_medium) lines.splice(5, 0, "Campaign medium: " + campaignContext.utm_medium);
    if (campaignContext.utm_campaign) lines.splice(6, 0, "Campaign label: " + campaignContext.utm_campaign);
    // A handoff is not a delivered WhatsApp message or a qualified lead.
    // Do not put the contact's name, email, phone or message into this event.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:'lazyplex_whatsapp_handoff',service:serviceInput.value,industry:d.get('industry') || '',topic:Object.prototype.hasOwnProperty.call(focusNames, focus)?focus:'',source:safeSource,utm_source:campaignContext.utm_source,utm_medium:campaignContext.utm_medium});
    const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    status.textContent = 'Opening WhatsApp. Review the prepared message and tap Send there to deliver your enquiry.';
    status.className = 'form-status success';
    window.location.assign(url);
  });
}

// Load consent-first analytics on all static pages. Legacy Node smoke tests use
// a minimal DOM and intentionally skip this browser-only enhancement.
if (typeof document.createElement === "function" && document.head && document.head.appendChild) {
  const analyticsScript = document.createElement("script");
  analyticsScript.src = "/assets/analytics.js";
  analyticsScript.defer = true;
  document.head.appendChild(analyticsScript);
}
