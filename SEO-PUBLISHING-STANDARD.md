# Lazy Plex Digital — SEO editorial and publishing standard

Use this checklist for all service, industry, speciality, city and editorial pages. Target usefulness and qualified enquiries; never publish merely to expand URL count.

## Page patterns (preserve the existing visual system)

### Commercial service page
- Existing brand navigation, breadcrumb and accessible H1, followed by a precise service promise.
- Describe the customer's problem, scope, deliverables, qualification requirements, exclusions and the review process.
- Provide realistic measurement definitions, pricing factors (not unsupported prices), compliance limitations and FAQs.
- Link naturally to relevant industry applications, evidence or tools; a service-specific CTA should pass the matching `service` query parameter.
- Use genuine client evidence only after approval; no guaranteed rankings, sales or performance.

### Industry pillar
- Define buyer roles and distinctive challenges without creating an exhaustive repetitive template.
- Link to the top commercial service URLs, original operational examples and the existing supporting guides.
- Explicitly separate business outcomes (consultations attended, site visits, qualified RFQs) from clicks or raw leads.
- Add expert review for medical content and verification for property project information.

### Supporting educational article
- Answer one reader decision and avoid repeating a service landing page.
- Explain trade-offs, a practical example, evidence limits and what to do next.
- Include source links where technical or regulatory requirements are mentioned.
- Link back to its industry pillar, an appropriate service and one or two truly related guides.
- Use correct enquiry parameters: e.g., hospital SEO → `search-engine-optimisation`; property lead generation → `lead-generation`.

### City / geographic page
- Include specific, verifiable market insight and useful service applicability.
- Do not claim a physical office where none is confirmed; do not publish city-spun duplicate pages.
- Page creation requires real intent differentiation, evidence and a maintainable local plan.

## Structured content template

1. Unique title tag, clear meta description and self-referencing canonical.
2. Breadcrumb, one H1, short buyer-specific introduction and meaningful primary action.
3. Decision-specific sections (problem → deliverables → approach → trade-offs → success measurement).
4. Examples distinguished as illustrative versus client-approved.
5. Relevant FAQs and supporting sources.
6. Internal links that genuinely help the reader; appropriate contextual CTA.
7. Valid `Organization`, `BreadcrumbList`, `BlogPosting` or `WebApplication` data only when relevant and truthful.
8. Sitemap entry for intended indexable pages. No cross-domain canonical mistakes.

## Release procedure

- Work on a dedicated GitHub branch and use reviewable commits.
- Preserve all existing working URLs unless a separate redirect/migration plan is approved.
- Run `node scripts/seo-quality-check.mjs` and confirm zero errors.
- Review mobile layout, CTA parameters and primary content in the browser.
- Merge only when all checks pass; confirm deployment through GitHub Pages and verify live pages.
- Record actual Search Console and enquiry data later; do not manufacture rankings or results.

## Primary references

- Google Search Essentials: https://developers.google.com/search/docs/essentials
- People-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Business Profile local ranking: https://support.google.com/business/answer/7091
- Healthcare advertising policy: https://support.google.com/adspolicy/answer/176031
