# Public Website Content Integrity Audit — 16 November 2026

## Finding and correction

The screenshot of `/industries/healthcare/#sources` exposed a section headed **Commercial-intent keyword map and how to use it**, including a table of **Target query / Intent / Suggested page/job** and instructions to **Match the SERP before writing**. This belongs to internal SEO planning, not the public customer journey. The same table was published on all nine industry pillar pages.

We removed the public keyword-brief sections from **nine industry hubs**, replaced each with a linked, industry-specific decision section explaining real marketing services and problems, and retained the original `#keywords` anchor for existing deep links. We also replaced internal editorial labels (such as “PILLAR → SUPPORTING CONTENT CLUSTER” and “SOURCING, NOT INVENTED STATISTICS”) with visitor-facing navigation and references.

The 45 original industry guides used a template section called **Buyer search intent and the keyword-to-page match**, and an irrelevant FAQ about duplicate content. We removed the meta section and its TOC link, replaced the FAQ with a subject-relevant decision question, and kept useful procedural guidance, external references and service information. Four newer Phase 2 healthcare field guides were already distinct and were left unchanged.

We rewrote **36** robotic buying-trigger statements across the nine industry hubs.

## Service mismatch corrections

| Article slug | Before | After |
| --- | --- | --- |
| shopify-seo-category-product-pages | google-ads-ppc | search-engine-optimisation |
| admission-lead-generation-qualified-applicants | search-engine-optimisation | lead-generation |
| education-seo-programme-pages | local-seo | search-engine-optimisation |
| hotel-direct-booking-channel-mix | search-engine-optimisation | integrated-growth |
| hotel-seo-services-direct-bookings | local-seo | search-engine-optimisation |
| b2b-manufacturing-lead-generation | search-engine-optimisation | lead-generation |
| b2b-consulting-lead-generation | search-engine-optimisation | lead-generation |
| small-business-digital-marketing-priorities | website-development | integrated-growth |
| small-business-seo-service-pages | local-seo | search-engine-optimisation |
| startup-marketing-budget-plan | website-development | integrated-growth |

These corrections update the relevant article enquiry links and the related implementation-service link. They do not create or remove URLs.

## New preventive checks

The GitHub Pages SEO QA script now blocks known internal SEO phrases in public content, validates in-page anchors and checks the expected service on known high-risk guide enquiry links. It still checks sitemap paths, H1, title, meta description, self-canonicals, JSON-LD and local links.

## Publication notes

Changes are made directly on a GitHub branch and require a successful PR check, merge and production deployment before being described as live. The repo source is the authoritative publication record. Google indexation and live organic ranking are separate and are not guaranteed by a successful GitHub deployment.
