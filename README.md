# Lazy Plex Digital — Industry SEO Expansion (V3)

Site: `https://digital.lazyplex.com`  
Repository: `https://github.com/surajsingh5803/lazyplex-digital`

## What is included

- The existing Lazy Plex brand and website design, including the official LP logo, contact number, WhatsApp enquiry flow, 12 original service pages and existing general pages.
- **9 expanded industry pillar pages**, each **5,223–5,485 words**.
- **49 supporting detailed articles**, five under each industry, each approximately **2,482–2,628 words**.
- One new `/insights/` directory landing page and navigation entry.
- Two additional landing pages for **CRM Automation** and **Conversion Rate Optimisation**, so new commercial links lead to real pages.
- New canonical URLs, page meta information and appropriate webpage/blog/breadcrumb structured data, with no unsupported rich-result guarantees.
- Updated sitemap.xml, covering the current indexable HTML pages (404 excluded).
- `SEO-KEYWORD-ICP-RESEARCH.md`: ICP profiles, pain-point framing, industry keyword clusters and references.
- `CONTENT-QA.md` and `content-manifest.json`: word counts and editorial launch checklist.

## Important editorial limitations

1. The keywords are **commercial-intent research hypotheses**, not verified search-volume, keyword-difficulty, or CPC measurements. Validate with Google Search Console, Keyword Planner and actual country/location SERPs.
2. Every pillar and article is a **first draft** structured to help buyers choose services, not a claim of sector-specific performance. Editorial review, subject-matter verification and relevant experience should be added before aggressive promotion.
3. Healthcare, regulated professional-services and any medical aesthetics content must be reviewed for factual claims, permissions and applicable local law.
4. No case-study performance figures, testimonial endorsements, partner credentials or search rankings have been invented.
5. The current contact form opens a WhatsApp message and requires the visitor to press **Send**. Static GitHub Pages does not receive or store form submissions.
6. Publishing the new code does **not** resolve a separate custom-domain DNS verification or SSL certificate problem; verify HTTPS in GitHub Pages before sending public traffic.

## How changes are published

Edit `surajsingh5803/lazyplex-digital` directly through a dedicated GitHub branch and pull request, not by uploading ZIP files. Keep the existing domain, URL structure and styling, run the SEO QA workflow and then merge into `main` after review. Deployment is handled by the existing GitHub Pages configuration.

Phase 1 implementation notes and measured keyword intent mapping: [SEO-PHASE1-IMPLEMENTATION.md](SEO-PHASE1-IMPLEMENTATION.md). Editorial standards: [SEO-PUBLISHING-STANDARD.md](SEO-PUBLISHING-STANDARD.md). Run `node scripts/seo-quality-check.mjs` before merging.

## Navigation and URL pattern

- Pillar: `/industries/healthcare/`
- Supporting article: `/industries/healthcare/insights/hospital-seo-services-what-to-check/`
- All articles: `/insights/`
- Related service: `/services/search-engine-optimisation/`

The existing real estate specialism cross-links to `https://lazyplex.com/solutions/` without duplicating that main site's positioning.

## Personal project notes

Read the founder's overview of Lazy Plex and its consulting approach: [Suraj Kumar's project page](https://heysuraj.com/projects/lazy-plex/).

## Phase 2 — Healthcare expansion (16 November 2026)

- Four additional healthcare commercial pages: doctor marketing, hospital SEO, healthcare Google Ads, IVF marketing.
- Four original healthcare field guides: doctor GBP eligibility, lead counting without duplication, India healthcare SEO pricing factors, IVF clinic marketing trust.
- All eight pages are linked from the healthcare hub and the new guides from Insights; existing URLs are unchanged.
- New enquiry links pass a healthcare topic and source to the existing contact form. A WhatsApp handoff is **not** counted as a confirmed lead.
- See [SEO-PHASE2-HEALTHCARE.md](SEO-PHASE2-HEALTHCARE.md) for the keyword ownership and editorial map.

## Phase 3 — real estate, AI search, regional services and tools (16 November 2026)

- Published real estate SEO, qualified lead generation and Google Ads specialist service pages and a responsible AI search optimisation offer.
- Added five distinct property marketing guides and an SEO/AEO/GEO explainer.
- Added Lucknow and Mumbai service-area pages, with no claim of physical offices. Existing Patna page remains.
- Added the free `/tools/` directory and a browser-only real estate lead-to-site-visit funnel calculator.
- Sitemap contains 100 intended indexable URLs; see [SEO-PHASE3-IMPLEMENTATION.md](SEO-PHASE3-IMPLEMENTATION.md) for the release scope.

## Phase 4 — measurement and conversion improvements

- A dated 101-URL Google indexation snapshot is stored in [SEO-PHASE4-INDEXATION-SNAPSHOT.md](SEO-PHASE4-INDEXATION-SNAPSHOT.md). It distinguishes indexed, discovered-not-indexed and unknown-to-Google URLs.
- Added the browser-only `/tools/break-even-marketing-budget-planner/` with a distinct reverse customer-target workflow, not another forward ROI calculator.
- Improved dark-green small-label contrast on the existing white service cards after Lighthouse accessibility review.
- Linked the planner from the tools directory and relevant lead-generation and Google Ads service pages.

## Phase 4 — measurement and conversion quality

Full execution details: [SEO-PHASE4-IMPLEMENTATION.md](SEO-PHASE4-IMPLEMENTATION.md). Google indexation snapshot: [SEO-PHASE4-INDEXATION-SNAPSHOT.md](SEO-PHASE4-INDEXATION-SNAPSHOT.md). Manual AI answer observation protocol: [SEO-PHASE4-AI-OBSERVATION-PLAN.md](SEO-PHASE4-AI-OBSERVATION-PLAN.md).

New `/tools/break-even-marketing-budget-planner/` estimates the **required** leads and spend from a target outcome; it does not duplicate the forward ROI calculator. Added privacy-conscious source preservation and a separate CTA-intent event. The project still needs an appropriate GA4 connection to measure actual site events.


## GA4 analytics (consent-first)
This static site loads `/assets/analytics.js` from the common `assets/main.js`.
The currently connected GA4 web stream is `G-Y52PL9CNK0` (Lazy Plex root
property). This is intentionally a **shared GA4 property**; separate
`digital.lazyplex.com` traffic using GA4's Hostname dimension, not by
assuming the property contains only the Digital subdomain.
On a first visit **no Google Analytics script is loaded** until the visitor
accepts analytics. A rejection disables GA4 and keeps navigation, WhatsApp,
contact form, and CRM choices operational. The footer lets visitors change
their choice. Optional consent is stored in localStorage for up to 180 days.
`page_location` includes only the path and allowlisted UTM labels, never
unrestricted query strings or contact data. Only allowlisted event names and non-personal event parameters are forwarded.
A **server-confirmed CRM receipt** emits the GA4 recommended `generate_lead`
event; WhatsApp handoffs remain engagement only. The `generate_lead` event
must still be marked as a key event in the GA4 Admin interface to report
conversions and optionally import them into Google Ads.
For clean reporting, create a dedicated Digital web data stream/property in
GA4 and update the measurement ID here when it becomes available.
