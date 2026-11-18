"use strict";
// Progressive enhancement: only show direct CRM submission after a secure backend
// explicitly reports it is enabled. WhatsApp remains functional independently.
// No lead data is sent unless the visitor clicks "Send enquiry securely".
(() => {
  const form = document.querySelector("#enquiry-form");
  const panel = document.querySelector("#secure-intake");
  if (!form || !panel || typeof fetch !== "function") return;
  const status = document.querySelector("#secure-intake-status");
  const button = document.querySelector("#send-secure-enquiry");
  const widget = document.querySelector("#secure-turnstile");
  const endpoint = "https://crm.lazyplex.com/api/public-leads";
  const started = Date.now();
  let siteKey = "";
  let captcha = "";
  let widgetLoaded = false;
  const update = (text, success = false) => {
    status.textContent = text;
    status.className = success ? "form-status success" : "form-status";
  };
  // Do not allow the Turnstile script to load unless public intake is enabled.
  const ready = new AbortController();
  const timeout = setTimeout(() => ready.abort(), 5000);
  fetch(endpoint + "/status", {mode:"cors",credentials:"omit",signal:ready.signal,cache:"no-store"})
    .then(async response => response.ok ? response.json() : null)
    .then(data => {
      if (!data || data.enabled !== true || !/^[\w-]{10,100}$/.test(data.siteKey || "")) return;
      siteKey = data.siteKey;
      panel.hidden = false;
    })
    .catch(() => {/* Live CRM intake is optional; the WhatsApp path remains available. */})
    .finally(() => clearTimeout(timeout));
  const loadCaptcha = () => new Promise((resolve,reject) => {
    if (widgetLoaded) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => {
      if (!window.turnstile) { reject(new Error("Spam verification unavailable")); return; }
      window.turnstile.render(widget, {
        sitekey: siteKey,
        callback: token => { captcha = token; update("Spam check complete. Click Send enquiry securely to submit."); },
        "expired-callback": () => { captcha = ""; update("Spam check expired; please complete it again."); },
        "error-callback": () => { captcha = ""; update("Spam check unavailable. Please continue through WhatsApp."); }
      });
      widgetLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Spam check could not be loaded"));
    document.head.appendChild(script);
  });
  button.addEventListener("click", async () => {
    if (!form.reportValidity()) return;
    if (!siteKey) return;
    if (!widgetLoaded) {
      update("Complete the spam verification below, then click Send enquiry securely again.");
      try { await loadCaptcha(); } catch { update("Unable to load spam verification. Please continue through WhatsApp."); }
      return;
    }
    if (!captcha) { update("Please complete the spam check first."); return; }
    const d = new FormData(form);
    const payload = {
      name:d.get("name"), phone:d.get("phone"), email:d.get("email"), company:d.get("company"),
      industry:d.get("industry"), service:d.get("service"), budget:d.get("budget"),
      message:d.get("message"), consent:d.get("consent") === "yes",
      website:d.get("website") || "", elapsed_ms:Date.now()-started,
      turnstile_token:captcha,
      campaign: (window.lpCampaignContext && typeof window.lpCampaignContext === "object")
        ? window.lpCampaignContext : {}
    };
    button.disabled = true;
    update("Sending your enquiry securely…");
    try {
      const response = await fetch(endpoint, {
        method:"POST",mode:"cors",credentials:"omit",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Submission not confirmed ("+response.status+")");
      const result = await response.json();
      if (result.received !== true) throw new Error("Submission was not confirmed");
      update("Your enquiry was received by Lazy Plex CRM. We will review it and follow up.", true);
      window.dataLayer = window.dataLayer || [];
      // Count only confirmed server receipts; never send names/contact details to analytics.
      window.dataLayer.push({event:"lazyplex_secure_enquiry_received",
        page_path:"/contact/", service:String(payload.service || "").slice(0,100),
        industry:String(payload.industry || "").slice(0,100)});
      button.textContent = "Enquiry received ✓";
      button.disabled = true;
      return;
    } catch (error) {
      update("Secure submission was not confirmed. Your details were not marked received. Please use Continue to WhatsApp.");
      button.disabled = false;
      captcha = "";
      if (window.turnstile && widgetLoaded) window.turnstile.reset(widget);
    }
  });
})();
