# Phase 3 SEO Implementation — 16 November 2026

Site: https://digital.lazyplex.com/  
Repository: surajsingh5803/lazyplex-digital

## Published scope

**Commercial:** `/industries/real-estate/seo/`, `/industries/real-estate/lead-generation/`, `/industries/real-estate/google-ads/`, `/services/ai-search-optimisation/`.

**New guides:** five in `/industries/real-estate/insights/` (qualified buyer cost; Search versus Performance Max; project launch; developer versus broker SEO; site-visit and booking measurement) and `/insights/seo-aeo-geo-explained/`.

**Tools:** `/tools/` and `/tools/real-estate-lead-funnel-calculator/`. Visitor numbers stay in-browser. Sample defaults are fictional. Costs are media-only unless the user enters otherwise; zero denominators show unavailable.

**Locations:** `/locations/lucknow/`, `/locations/mumbai/`; Patna unchanged. Pages offer different industry-specific journeys and do not claim a walk-in office.

## Search intent and estimated monthly searches in India

- Real estate digital marketing agency: 720; industry hub.
- Real estate SEO services: 590; dedicated commercial SEO page.
- Real estate lead generation agency: 110; lead-generation commercial page.
- AI SEO agency: 720; AI search commercial page.
- Digital marketing agency in Lucknow: 3,600; Lucknow service-area page.
- Digital marketing agency in Mumbai: 6,600; Mumbai service-area page.

Source: OpenSEO, 16 November 2026. Third-party search-volume estimates are not forecasts or guaranteed rankings. The old five property guides remain distinct from the three new commercial services.

## Trust and policy

- Project claims require developer verification; do not invent prices, RERA details, inventory, physical offices, conversions or client results.
- Campaign eligibility and residential housing targeting depend on Google Ads policies and geography: https://support.google.com/adspolicy/answer/9997418
- Google's AI search guidance prioritises foundational SEO and original helpful content rather than AI citation hacks: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- The calculator separates raw leads, qualified buyers, planned/attended visits and confirmed bookings. WhatsApp handoffs are not verified leads.

## QA before release

Run `node scripts/seo-quality-check.mjs`, `node --check assets/main.js` and `node --check assets/real-estate-funnel.js`. Review mobile layout, form calculations, sitemap, metadata, link resolution and production deployment. GitHub Pages HTTP 200 is distinct from Google indexing.
