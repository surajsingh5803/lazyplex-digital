# Lazy Plex Buyer Journey Rebuild — Implementation Ledger
_Date: 2026-11-23 (India Standard Time)_

## Goal
Make the first-time visitor journey easier: business need → relevant service/solution → scope comparison → published pricing → proof/engagement terms → enquiry or approved purchase.

## Changes implemented on WordPress
- New published pages: `/start/`, `/compare/`, `/our-work/`, `/working-together/`, `/request-proposal/`, `/request-growth-audit/`.
- Updated homepage: clear starting route, published-price snapshot, concise four-pillar explanation, earlier evidence/experience section.
- Updated `/solutions/` to avoid misleading buy-now language and point to service comparisons.
- Added sector-specific starting points to nine existing industry pages.
- Added explicit quote-not-purchase explanations to services, pricing and Growth Advisor shortcode pages.
- Updated Contact, Privacy Policy and WordPress classic navigation.
- Implemented a general-industry Jetpack audit request form with a required consent checkbox. Kept original, real-estate-specific Fluent Form #3 intact for property sales.
- Updated most generic Growth Audit links to the neutral audit route; property-specific content retains its own detailed form.
- Corrected 320px Growth Advisor button overflow and full-width marketing wrappers; existing ecommerce/checkout pages were not restyled.
- Adjusted four new guide pages to avoid duplicate H1 title display.

## Digital Hub GitHub commits
- Digital homepage now links directly to canonical main pricing.
- Digital services directory points to the main canonical service tiers and comparison.
- Individual specialist guides show a comparison banner with service-specific proposal entry.
- Added responsive first-time buyer QA via `scripts/buyer-journey-audit.mjs` and `.github/workflows/buyer-journey-qa.yml`.

## Automated checks
- 31 public routes × 4 viewport widths (320, 390, 768, 1440): **124/124 passed** at latest GitHub Action run, no critical HTTP/H1/document-horizontal-overflow defects.
- WordPress site-wide rendered checks: 42 published pages before adding the neutral audit page, all HTTP 200; the only dead-link report concerned three WooCommerce photo-interface controls on the noindexed Shop page.
- New two forms render valid fields via Jetpack shortcode; **no real submission, email receipt, payment or CRM handoff was executed**.
- GitHub Pages deployment and SEO quality workflow succeeded on earlier latest app commit.
- Homepage lab performance: 84 mobile, 100 desktop (Nov 22 run). Real visitor LCP, INP, CLS rated good over 28 days. Mobile render-blocking CSS is still an improvement candidate.

## Commercial blockers that must not be fabricated
1. Final approved service and package terms, cancellation/refund policies and authoritative tax treatment.
2. Fixed price and specific deliverable quantities for Convert, Automate, and Measure pillars if the business wants self-service checkout; they remain custom-quote offers.
3. Verified case studies and customer testimonials with permission; the new Our Work page labels examples honestly.
4. Zero published products discovered in WooCommerce or FluentCart; real checkout/payment tests and order fulfilment cannot be claimed.
5. Real form-delivery tests and CRM handoff validation remain unverified.
6. The original Elementor-managed /growth-audit/ still serves cached real-estate-specific layout despite saved Elementor content changes; general visitors are routed to /request-growth-audit/ from the main buying paths.
7. Main WordPress custom branded header may not use the classic WP navigation; verify on live browser before assuming all newly created menu entries appear in that header.
8. Site-wide visual QA verifies geometry/status/H1 but does not replace manual accessibility testing, assistive-tech testing or real customer usability interviews.

## Release principle
Never display `Buy Now` for an unverified checkout; use `Request a proposal` for custom-scoped work and never substitute invented prices, case studies or guarantees.
