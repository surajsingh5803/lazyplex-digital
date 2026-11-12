# Lazy Plex Digital — Version 2

**Target:** https://digital.lazyplex.com/  
**Hosting:** GitHub Pages (static website, no framework build step)  
**Brand assets:** official uploaded LP logo (faithful cropped logo on white background)  
**Phone and WhatsApp:** +91 72579 19567

## What's inside

- Original deep navy / mint / cream brand design retained.
- Homepage offering a *single service* or a larger connected growth engagement.
- 12 service pages with distinct scope, common challenges, measurement considerations and individually pre-filled quote links.
- 9 industry pages with use cases and links to relevant services.
- Real estate page links to existing [Lazy Plex Growth System](https://lazyplex.com/solutions/) and [Growth Audit](https://lazyplex.com/growth-audit/).
- New **Our Work** page using clearly labelled representative approaches; no invented testimonials or performance figures.
- About, Contact, Privacy, favicon, sitemap, robots.txt, CNAME and custom 404.
- Click-to-call, WhatsApp floating action, menu and footer links.

## Contact / lead collection — READ THIS

The contact form currently uses **WhatsApp handoff**, not background storage or an API endpoint. It validates required fields, preselects the requested service or industry and opens the actual WhatsApp number with a composed message. **The visitor must tap Send in WhatsApp to deliver it.** Nothing is silently submitted, emailed or saved by the website.

To receive true in-website submissions later, integrate a verified form endpoint (Tally, Formspree, CRM lead API, etc.), use a compliant privacy notice and add spam protection. Do not embed a private API key in frontend code. If users don't have WhatsApp, they can call the displayed number.

## Launch checklist

1. Create an empty **public** GitHub repository `lazyplex-digital` under `surajsingh5803`.
2. Extract this ZIP, upload all **contents** into repo root, commit to `main`.
3. Go to **Settings → Pages** and publish from `main` / `(root)`.
4. In GitHub Pages settings configure custom domain `digital.lazyplex.com` first.
5. In your domain provider create `CNAME` host `digital` → `surajsingh5803.github.io` (do not include repo name); don't modify existing apex/www/CRM records.
6. Enable HTTPS when available, verify live site, contact form WhatsApp send, mobile menu, logo and all links.
7. Submit `https://digital.lazyplex.com/sitemap.xml` through Google Search Console.
8. Add genuine, approved case studies and any analytics after you have configured relevant privacy/consent requirements.
9. **On the existing `lazyplex.com`, add a navigation/footer link** to `https://digital.lazyplex.com/services/` labelled “Digital Marketing Services.” This existing site's content has **not** been changed.

**No automatic deployment, DNS change, analytics setup or CRM API integration is performed by this ZIP.**

## Local preview

Run `python -m http.server 8000 --directory lazyplex-digital-site` from the parent folder. Visit http://localhost:8000/.
