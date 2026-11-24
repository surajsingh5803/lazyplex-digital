"use strict";
// Progressive enhancement: public CRM submission only when Turnstile is enabled.
// One click begins verification and automatically submits on a valid token.
// WhatsApp fallback is independent and no personal information goes to analytics.
(() => {
  if (document.querySelector('meta[name="lp-preview"]')) return;
  const form = document.querySelector("#enquiry-form");
  const panel = document.querySelector("#secure-intake");
  if (!form || !panel || typeof fetch !== "function") return;
  const status = document.querySelector("#secure-intake-status");
  const button = document.querySelector("#send-secure-enquiry");
  const widget = document.querySelector("#secure-turnstile");
  if (!status || !button || !widget) return;
  const endpoint = "https://crm.lazyplex.com/api/public-leads";
  const started = Date.now();
  let siteKey = "";
  let captcha = "";
  let widgetLoaded = false;
  let widgetId = null;
  let loadingWidget = false;
  let pendingSubmit = false;
  let inFlight = false;
  let completed = false;
  let hasErrorNotice = false;
  const update = (text, success = false) => {
    status.textContent = text;
    status.className = success ? "form-status success" : "form-status";
  };
  const fieldError = (name, message) => {
    pendingSubmit = false;
    hasErrorNotice = true;
    update(message);
    const field = form.elements.namedItem(name);
    if (field && typeof field.focus === "function") {
      field.focus();
      if (typeof field.setCustomValidity === "function") {
        field.setCustomValidity(message);
        field.reportValidity();
        field.setCustomValidity("");
      }
    }
    return false;
  };
  const getValues = () => {
    // Standard HTML required/minlength checks run first.
    if (!form.reportValidity()) {
      hasErrorNotice = true;
      update("Please complete the required fields before sending.");
      return null;
    }
    const d = new FormData(form);
    const name = String(d.get("name") || "").trim();
    const phone = String(d.get("phone") || "").trim();
    const email = String(d.get("email") || "").trim();
    const message = String(d.get("message") || "").trim();
    const service = String(d.get("service") || "").trim();
    if (name.length < 2) return fieldError("name", "Please enter your name (at least 2 characters).");
    if (!/^[+0-9()\s.-]{7,25}$/.test(phone))
      return fieldError("phone", "Enter a valid contact number (at least 7 characters).");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return fieldError("email", "Please enter a complete email address or leave it blank.");
    if (!service) return fieldError("service", "Choose the marketing service you need.");
    if (message.length < 10)
      return fieldError("message", "Please describe your project in at least 10 characters.");
    if (d.get("consent") !== "yes")
      return fieldError("consent", "Please agree to the enquiry privacy notice.");
    return {name,phone,email,service,message,
      company:String(d.get("company") || "").trim(),
      industry:String(d.get("industry") || "").trim(),
      budget:String(d.get("budget") || "").trim(),
      consent:true,
      website:String(d.get("website") || ""),
      elapsed_ms:Math.max(0,Date.now()-started),
      campaign:(window.lpCampaignContext && typeof window.lpCampaignContext === "object")
        ? window.lpCampaignContext : {}};
  };
  const readFailure = (response, details) => {
    const detail = typeof details?.detail === "string" ? details.detail : "";
    if (response.status === 422)
      return "Please correct your enquiry: " + (detail || "check the name, phone number and project description.");
    if (response.status === 403)
      return "Cloudflare verification did not pass. Please complete a fresh security check and retry.";
    if (response.status === 429)
      return "Too many enquiries from this connection. Please use WhatsApp or try again later.";
    if (response.status === 503)
      return "Secure CRM intake is temporarily unavailable. Please use WhatsApp.";
    // An unexpected server or network error may occur after a record was saved.
    return "We couldn't confirm whether your enquiry was saved. Please check with Lazy Plex on WhatsApp before resubmitting.";
  };
  const refreshCaptcha = () => {
    captcha = "";
    if (window.turnstile && widgetLoaded && widgetId !== null)
      try { window.turnstile.reset(widgetId); } catch { /* Keep WhatsApp fallback */ }
  };
  async function submitIfReady() {
    if (inFlight || completed || !captcha || !siteKey) return;
    const payload = getValues();
    if (!payload) return;
    inFlight = true;
    pendingSubmit = false;
    hasErrorNotice = false;
    button.disabled = true;
    const token = captcha;
    update("Verifying and sending your enquiry to Lazy Plex CRM…");
    let response = null;
    try {
      const sendController = new AbortController();
      const sendTimeout = setTimeout(() => sendController.abort(), 65000);
      try { response = await fetch(endpoint, {
        method:"POST", mode:"cors", credentials:"omit", signal:sendController.signal,
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...payload,turnstile_token:token})
      }); } finally { clearTimeout(sendTimeout); }
      let result = null;
      try { result = await response.json(); } catch { /* handled below */ }
      if (!response.ok || result?.received !== true)
        throw {response,result};
      completed = true;
      update("Enquiry received successfully by Lazy Plex CRM. We will review it and follow up.",true);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({event:"lazyplex_secure_enquiry_received",page_path:"/contact/",
        service:payload.service,industry:payload.industry});
      button.textContent = "Enquiry received ✓";
      button.disabled = true;
      return;
    } catch (error) {
      const serverResponse = error?.response || response;
      const message = serverResponse
        ? readFailure(serverResponse,error?.result)
        : "We couldn't confirm delivery due to a connection issue. Please check with Lazy Plex on WhatsApp before resubmitting.";
      hasErrorNotice = true;
      update(message);
      // 422 happens before token verification; keep the valid token so the
      // visitor can fix the field rather than repeat Cloudflare unnecessarily.
      if (serverResponse?.status !== 422) refreshCaptcha();
      if (serverResponse?.status === 503) panel.hidden = true;
      button.disabled = false;
    } finally {
      inFlight = false;
    }
  }
  function loadCaptcha() {
    if (widgetLoaded || loadingWidget) return;
    loadingWidget = true;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => {
      if (!window.turnstile) {
        loadingWidget = false;
        update("Security verification could not start. Please use WhatsApp.");
        return;
      }
      try {
        widgetLoaded = true;
        widgetId = window.turnstile.render(widget, {
          sitekey:siteKey,
          callback:token => {
            captcha = token;
            if (pendingSubmit && !inFlight && !completed) {
              pendingSubmit = false;
              void submitIfReady();
            } else if (!hasErrorNotice && !completed) {
              update("Spam check complete. Ready to send your enquiry.");
            }
          },
          "expired-callback":() => {
            captcha = "";
            pendingSubmit = false;
            if (!completed) update("Spam check expired. Click Send enquiry securely to verify again.");
          },
          "error-callback":() => {
            captcha = "";
            pendingSubmit = false;
            update("Cloudflare verification is unavailable. Please use WhatsApp or retry.");
          }
        });
      } catch {
        widgetLoaded = false;
        update("Unable to show Cloudflare verification. Please use WhatsApp.");
      } finally { loadingWidget = false; }
    };
    script.onerror = () => {
      loadingWidget = false;
      pendingSubmit = false;
      update("Unable to load Cloudflare verification. Please use WhatsApp.");
    };
    document.head.appendChild(script);
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 65000); // Render free plans can wake slowly.
  fetch(endpoint + "/status", {mode:"cors",credentials:"omit",signal:controller.signal,cache:"no-store"})
    .then(async response => response.ok ? response.json() : null)
    .then(data => {
      if (!data || data.enabled !== true || !/^[\w-]{10,100}$/.test(data.siteKey || "")) return;
      siteKey = data.siteKey;
      panel.hidden = false;
    })
    .catch(() => { /* WhatsApp still works even if CRM is sleeping */ })
    .finally(() => clearTimeout(timeout));
  button.addEventListener("click", () => {
    if (inFlight || completed || !siteKey) return;
    if (!getValues()) return;
    hasErrorNotice = false;
    pendingSubmit = true;
    if (captcha) {
      pendingSubmit = false;
      void submitIfReady();
      return;
    }
    update("Completing Cloudflare verification. Your enquiry will send automatically when it passes…");
    if (!widgetLoaded) loadCaptcha();
    else if (window.turnstile && widgetId !== null) {
      try { window.turnstile.reset(widgetId); } catch { /* user can use WhatsApp */ }
    }
  });
})();