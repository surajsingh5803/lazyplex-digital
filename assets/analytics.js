"use strict";
/**
 * Lazy Plex Digital: consent-first GA4. Analytics code is not loaded unless
 * the visitor opts in. Shares GA4 property "lazyplex.com"; use the Hostname
 * dimension to distinguish digital.lazyplex.com from the main website.
 */
(() => {
  const ID = "G-Y52PL9CNK0";  // public measurement ID, not an API secret
  const KEY = "lp_digital_analytics_choice_v1";
  const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
  const ALLOWED_EVENTS = new Set([
    "lazyplex_contact_cta_click",
    "lazyplex_whatsapp_click",
    "lazyplex_phone_click",
    "lazyplex_whatsapp_handoff",
    "lazyplex_secure_enquiry_received"
  ]);
  let consent = false;
  let started = false;
  let banner;
  const readChoice = () => {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "null");
      if (data && (data.value === "accept" || data.value === "reject") &&
          typeof data.date === "number" && Date.now() - data.date < MAX_AGE_MS &&
          Date.now() >= data.date) return data.value;
    } catch { /* Storage may be blocked */ }
    return null;
  };
  const saveChoice = value => {
    try { localStorage.setItem(KEY, JSON.stringify({value, date: Date.now()})); }
    catch { /* Consent remains effective for this page only */ }
  };
  window.dataLayer = window.dataLayer || [];
  const previousPush = window.dataLayer.push;
  window.dataLayer.push = function (...entries) {
    const result = previousPush.apply(this, entries);
    if (!consent || !started || typeof window.gtag !== "function") return result;
    for (const item of entries) {
      if (!item || Array.isArray(item) || !ALLOWED_EVENTS.has(item.event)) continue;
      // Explicit allowlist prevents accidental sending of names, email,
      // phone numbers, freeform messages or other FormData.
      const eventParams = {send_to: ID};
      if (typeof item.service === "string" && /^[a-z0-9-]{1,100}$/.test(item.service))
        eventParams.service = item.service;
      if (typeof item.industry === "string" && item.industry.length <= 80)
        eventParams.industry = item.industry;
      if (typeof item.source === "string" && /^[a-z0-9-]{1,60}$/.test(item.source))
        eventParams.source = item.source;
      // GA4's recommended event means a lead reached our CRM.
      // WhatsApp handoffs intentionally remain engagement events, not leads.
      const gaEvent = item.event === "lazyplex_secure_enquiry_received" ? "generate_lead" : item.event;
      if (gaEvent === "generate_lead") eventParams.method = "secure_crm_form";
      window.gtag("event", gaEvent, eventParams);
    }
    return result;
  };
  const gtag = (...args) => window.dataLayer.push(args);
  const scrubbedLocation = () => {
    const safe = new URL(window.location.origin + window.location.pathname);
    // Retain only validated UTM labels. No arbitrary search terms, emails or PII.
    const campaign = window.lpCampaignContext || {};
    for (const k of ["utm_source","utm_medium","utm_campaign"]) {
      if (typeof campaign[k] === "string" && /^[a-z0-9][a-z0-9_.-]{0,47}$/i.test(campaign[k]))
        safe.searchParams.set(k, campaign[k]);
    }
    return safe.toString();
  };
  const beginAnalytics = () => {
    if (started) return;
    consent = true;
    started = true;
    window.gtag = gtag;
    window.gtag("consent", "default", {
      analytics_storage:"denied",ad_storage:"denied",
      ad_user_data:"denied",ad_personalization:"denied"
    });
    window.gtag("js", new Date());
    window.gtag("consent", "update", {analytics_storage:"granted"});
    let originRef = "";
    try { if (document.referrer) originRef = new URL(document.referrer).origin; } catch {}
    window.gtag("config", ID, {
      send_page_view:true,
      allow_google_signals:false,
      allow_ad_personalization_signals:false,
      page_location:scrubbedLocation(),
      page_referrer:originRef,
      page_title:document.title
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
    document.head.appendChild(script);
  };
  const denyAnalytics = () => {
    consent = false;
    if (started && typeof window.gtag === "function") {
      window.gtag("consent","update",{
        analytics_storage:"denied",ad_storage:"denied",
        ad_user_data:"denied",ad_personalization:"denied"
      });
    }
    // Expire this site's GA identifiers on the host and parent domain.
    for (const part of ["_ga", "_ga_" + ID.replace("G-","")]) {
      for (const domain of ["", ";domain=.lazyplex.com"]) {
        document.cookie = part + "=;Max-Age=0;path=/" + domain + ";SameSite=Lax;Secure";
      }
    }
  };
  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
  }
  function applyChoice(value) {
    saveChoice(value);
    if (value === "accept") beginAnalytics();
    else denyAnalytics();
    if (banner) banner.hidden = true;
  }
  function init() {
    banner = document.createElement("section");
    banner.className = "lp-consent-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Optional site analytics");
    banner.hidden = true;
    banner.innerHTML =
      '<p><strong>Optional analytics</strong> — May we use Google Analytics to understand visits and improve our website? No analytics cookies are set unless you accept. <a href="/privacy/">Privacy details</a>.</p>' +
      '<div><button type="button" data-lp-choice="reject">Reject analytics</button>' +
      '<button type="button" data-lp-choice="accept" class="lp-consent-accept">Accept analytics</button></div>';
    banner.addEventListener("click", e => {
      const choice = e.target.closest("[data-lp-choice]")?.getAttribute("data-lp-choice");
      if (choice === "accept" || choice === "reject") applyChoice(choice);
    });
    document.body.appendChild(banner);
    const settings = document.createElement("button");
    settings.type = "button";
    settings.className = "lp-privacy-settings";
    settings.textContent = "Analytics preferences";
    settings.addEventListener("click", showBanner);
    const footer = document.querySelector(".footer-bottom") || document.querySelector("footer") || document.body;
    footer.appendChild(settings);
    const saved = readChoice();
    if (saved === "accept") beginAnalytics();
    else if (saved === "reject") denyAnalytics();
    else showBanner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
