# Phase 4 — Measurement, Conversion and Quality Sprint

Date: 16 November 2026  
Site: https://digital.lazyplex.com/  
Branch: `seo/phase-4-measurement-ux-2026-11-16`

## Verified starting point

- Search Console property `sc-domain:lazyplex.com` is selected and covers the digital subdomain.
- URL Inspection queried **all 101 then-listed URLs**, finding **30 submitted and indexed**, **18 discovered but not indexed**, and **53 unknown to Google**. Full dated details: `SEO-PHASE4-INDEXATION-SNAPSHOT.md`.
- The GSC performance query filtered to digital.lazyplex.com returned no rows in the current 3-month window, so no search query ranking gains can yet be claimed.
- Connected OpenSEO GA4 measurement health returned **ga4_not_connected**. No GA4 sessions, key events or qualified inbound results can yet be reported.
- OpenSEO audit dated 16 November crawled **50 pages** (free plan cap) and ran Lighthouse on **10 representative pages, mobile and desktop**. Homepage mobile: performance **99**, accessibility **95**, SEO **100**, LCP approximately **1.62 seconds**, CLS approximately **0.0094**. Contact mobile: performance **99**, accessibility **100**, SEO **100**. Render-blocking fonts and under-contrast small-caps text were observed; small-caps contrast was corrected without replacing the existing visual system. Do not claim a measured after-score until rerun.
- Crawl stopped due to 50-page audit allowance; absence of issues on this sample does not prove all 102 live pages were crawled externally.

## What was implemented

1. Added `/tools/break-even-marketing-budget-planner/`. Unlike the forward ROI calculator, it plans backward from target customers to required qualified and raw leads, spend and unit contribution. All inputs are browser-only, defaults are fictional and results are not forecasts.
2. Added useful contextual planner links from the tools directory, Google Ads, Lead Generation and real estate lead-generation pages. No existing URLs were renamed.
3. Changed the low-contrast small-card label colour from `#5c8842` to `#355f21` after Lighthouse flagged accessibility.
4. Preserved only short, safe UTM source/medium/campaign labels in current-tab session storage for up to 30 minutes and optionally included them in the visitor-reviewable WhatsApp draft. No personal data enters the local `dataLayer` events.
5. Added distinct `lazyplex_contact_cta_click` (intention to open the contact page) and retained `lazyplex_whatsapp_handoff` (opening WhatsApp) events. Neither proves a delivered message or unique qualified enquiry. The site still has no connected GA4; no analytics figures are implied.
6. Updated Privacy Policy for technical hosting, Google web fonts and the campaign-label session.
7. Extended GitHub QA with tests of reverse-planner mathematics, zero/invalid assumptions, reset behaviour, attribution and WhatsApp handoff.
8. Added an opt-in manually triggered or monthly GitHub Lighthouse workflow to audit four live pages and retain artifacts; it does not upload to a public third-party storage server. The cost in GitHub-hosted runner minutes depends on the account plan and usage.
9. Added `SEO-PHASE4-AI-OBSERVATION-PLAN.md`, with twelve neutral prompts and a clear observation protocol. No paid AI monitoring was enabled or fictitious citations recorded.

## External and account-dependent next steps

- Use Search Console to inspect URLs that remain unknown after a reasonable discovery period, review actual indexing decisions, and request indexing manually where justified. This tool cannot submit indexing requests to Google.
- Connect the **correct** GA4 website property in <https://app.openseo.so/p/b9e7f1ef-4fa6-44da-b539-d8e5fdd8a205/settings/integrations> and confirm suitable, privacy-safe key event configuration. Do not equate a click with a submitted enquiry.
- Once GSC queries for digital.lazyplex.com and GA4 events exist, prioritise high-intent URL improvements by real impressions, CTR, qualified contact stages and business relevance.
- Wait for permitted, verifiable case studies and client results. Do not fabricate authority or backlinks.

## Post-deployment accessibility follow-up

A second OpenSEO Lighthouse sample on 16 November still showed homepage accessibility at 95 and found additional low-contrast elements: offer-card labels (`#609448` on white) and a mint-coloured highlighted heading on the light-green offer section. Corrected both to `#355f21` while preserving navy/mint styling. Added a source-level minimum 4.5:1 test for three priority text cases. This is targeted contrast testing, not a full accessibility certification. The follow-up Lighthouse run exhausted OpenSEO Lighthouse credits before testing the new budget planner; do not claim a new measured Lighthouse score until an eligible audit completes.
