# IndexNow — direct notifications for Lazy Plex Digital

- Canonical host: `https://digital.lazyplex.com/`.
- Ownership key: `/98ee5d1795784dcd838024c1ada1bd49.txt` (file contains **only** the key).
- API: `https://api.indexnow.org/indexnow` (IndexNow global endpoint).
- Automatic action: [GitHub Actions / IndexNow](https://github.com/surajsingh5803/lazyplex-digital/actions/workflows/indexnow.yml).
- Trigger: **after a successful GitHub Pages deployment** of the main branch. Only newly added, edited, renamed, or removed `index.html` pages and sitemap changes are notified. This installation also seeds the 29 recently edited pages once.
- Manual mode: Actions → **IndexNow — direct publishing notifications** → Run workflow → select **recent** (the seed) or **changed** (the last commit), or supply an explicit list of changed URLs.
- Log: The workflow validates a direct HTTP 200 and exact text bytes at the public key URL, then posts the changed URLs and prints the real IndexNow API status.

**Meaning of HTTP responses:** 200 = received / verified; 202 = received with validation pending; 403 = ownership key rejected; 422 = invalid host/key URL; 429 = rate-limited. A successful submission is **not** a search-engine indexation guarantee. IndexNow does not send to Google.

`all-sitemap-urls.txt` is a convenient complete copy/paste reference of the 102 sitemap pages and is **not** automatically sent to IndexNow. `recent-updated-urls.txt` contains the 29 newly created or substantively updated URLs used for the initial notification. Avoid repeatedly submitting all sitemap URLs without actual changes.

The site uses GitHub Pages and plain HTML. The repository includes `.nojekyll` so the root key file is deployed unprocessed. No additional SaaS, paid service, browser automation, visitor analytics or API token is needed.
