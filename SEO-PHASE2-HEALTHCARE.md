# Lazy Plex Digital — Phase 2 healthcare SEO implementation

**Date:** 16 November 2026  
**Industry:** Healthcare and hospitals  
**Status:** Published in phase-2 branch; production status requires CI and deployment confirmation.

## Intent map

| URL | Intent owner | Service or educational role | Estimated India monthly searches |
| --- | --- | --- | ---: |
| /industries/healthcare/ | healthcare digital marketing agency | Industry hub | 720 |
| /industries/healthcare/doctor-marketing/ | digital marketing for doctors | Commercial speciality service | 590 |
| /industries/healthcare/hospital-seo/ | hospital SEO services | Commercial scope / procurement | 10 |
| /industries/healthcare/google-ads/ | Google Ads for doctors / healthcare ads | Commercial paid media | 70 (doctors variant) |
| /industries/healthcare/ivf-marketing/ | IVF marketing agency | Commercial specialist engagement | 30 |
| /industries/healthcare/insights/google-business-profile-for-doctors/ | doctor GBP eligibility | Educational implementation | 110 |
| /industries/healthcare/insights/hospital-lead-counting-guide/ | hospital lead tracking | Operational guide | No reliable metric from batch |
| /industries/healthcare/insights/healthcare-seo-pricing-india/ | SEO pricing factors | Commercial research | No reliable metric from batch |
| /industries/healthcare/insights/ivf-clinic-marketing-guide/ | IVF clinic marketing education | Patient-respectful planning | No reliable metric from batch |

Source: OpenSEO India keyword estimates retrieved 16 November 2026. Search estimates are directional, not traffic forecasts; low-volume specialist phrases can still have meaningful commercial value. No keyword volume was invented for missing results.

## Existing URLs retained to prevent cannibalisation

- /industries/healthcare/insights/hospital-seo-services-what-to-check/ — how to select a hospital SEO agency; complementary to the commercial hospital SEO scope.
- /industries/healthcare/insights/google-ads-for-clinics-appointment-quality/ — implementation and contact quality; complementary to the new paid service.
- /industries/healthcare/insights/medical-local-seo-multiple-locations/ — multi-location practitioner and branch strategy; distinct from doctor marketing.
- /industries/healthcare/insights/patient-enquiry-follow-up-system/ — CRM lifecycle; complements the new lead-counting methodology.

## Editorial evidence and policy references

- Google practitioner eligibility: https://support.google.com/business/answer/3038177
- Google local search ranking: https://support.google.com/business/answer/7091
- Google Ads healthcare and medicines rules: https://support.google.com/adspolicy/answer/176031
- Google Search people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

All examples are illustrative. No medical outcomes, specific patient information, rankings or client performance were fabricated. Clinical claims on client sites still require the authorised medical team.

## Conversion definition

The website uses a static GitHub Pages contact form that prepares a WhatsApp message. The user must press **Send** in WhatsApp. A `lazyplex_whatsapp_handoff` event (if consumed by an analytics implementation) records only the attempt to open WhatsApp, not a delivered lead or confirmed client. Healthcare focus/source may be included in the prepared message to improve triage; do not include any patient diagnosis or medical information.

## QA checklist

- New URLs each have one H1, unique title/description, self-canonical and relevant BlogPosting or WebPage structured data.
- Existing sitewide header/footer and navy/mint stylesheet reused unchanged.
- Sitemap and content-manifest updated to include eight new paths.
- Healthcare hub and Insights index link to the new content.
- Internal links to the old five healthcare guides continue working.
- Run `node scripts/seo-quality-check.mjs` in GitHub Actions; confirm GitHub Pages release success.
