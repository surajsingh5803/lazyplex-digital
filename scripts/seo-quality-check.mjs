import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const host = "https://digital.lazyplex.com";
const sitemapPath = path.join(root, "sitemap.xml");
const errors = [];
const warnings = [];

if (!fs.existsSync(sitemapPath)) {
  console.error("Missing sitemap.xml");
  process.exit(1);
}
const sitemap = fs.readFileSync(sitemapPath, "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
const unique = new Set();
const titleOwner = new Map();
const forbiddenPublicPhrases = [
  "Commercial-intent keyword map and how to use it",
  "Target query</th>",
  "Suggested page/job</th>",
  "Match the SERP before writing",
  "Buyer search intent and the keyword-to-page match",
  "The keyword suggestions on this page are hypotheses",
  "PILLAR → SUPPORTING CONTENT CLUSTER",
  "SOURCING, NOT INVENTED STATISTICS",
  "How do I avoid duplicate or low-quality content?",
  "The commercial trigger for "
];
const expectedServiceForGuide = {
  "industries/ecommerce/insights/shopify-seo-category-product-pages/index.html": "search-engine-optimisation",
  "industries/education/insights/admission-lead-generation-qualified-applicants/index.html": "lead-generation",
  "industries/education/insights/education-seo-programme-pages/index.html": "search-engine-optimisation",
  "industries/hospitality/insights/hotel-direct-booking-channel-mix/index.html": "integrated-growth",
  "industries/hospitality/insights/hotel-seo-services-direct-bookings/index.html": "search-engine-optimisation",
  "industries/manufacturing-b2b/insights/b2b-manufacturing-lead-generation/index.html": "lead-generation",
  "industries/professional-services/insights/b2b-consulting-lead-generation/index.html": "lead-generation",
  "industries/startups-smes/insights/small-business-digital-marketing-priorities/index.html": "integrated-growth",
  "industries/startups-smes/insights/small-business-seo-service-pages/index.html": "search-engine-optimisation",
  "industries/startups-smes/insights/startup-marketing-budget-plan/index.html": "integrated-growth"
};
const htmlCache = new Map();
let checkedInternalLinks = 0;
let checkedAnchors = 0;
function readFileCached(file) {
  if (!htmlCache.has(file)) htmlCache.set(file, fs.readFileSync(file, "utf8"));
  return htmlCache.get(file);
}
function relativePage(file) {
  return path.relative(root, file).split(path.sep).join("/");
}


function localPath(pathname) {
  const pathnameDecoded = decodeURIComponent(pathname);
  const relative = pathnameDecoded.replace(/^\/+/, "");
  if (!relative || relative.endsWith("/")) return path.join(root, relative, "index.html");
  if (path.extname(relative)) return path.join(root, relative);
  return path.join(root, relative, "index.html");
}
function attribute(tag, name) {
  const re = new RegExp("\\b" + name + "=[\"']([^\"']*)[\"']", "i");
  return tag.match(re)?.[1] ?? null;
}
for (const entry of urls) {
  let pageUrl;
  try { pageUrl = new URL(entry); } catch { errors.push("Invalid sitemap URL: " + entry); continue; }
  if (pageUrl.origin !== host) { errors.push("Unexpected sitemap origin: " + entry); continue; }
  if (unique.has(entry)) errors.push("Duplicate sitemap URL: " + entry);
  unique.add(entry);

  const file = localPath(pageUrl.pathname);
  if (!fs.existsSync(file)) { errors.push("Sitemap URL has no file: " + entry); continue; }
  const html = fs.readFileSync(file, "utf8");
  htmlCache.set(file, html);
  for (const phrase of forbiddenPublicPhrases) {
    if (html.includes(phrase)) errors.push(entry + ": internal SEO brief leaked onto public page: " + phrase);
  }
  const expected = expectedServiceForGuide[relativePage(file)];
  if (expected) {
    const mainContent = html.split("<main")[1]?.split("</main>")[0] || html;
    const serviceHrefs = [...mainContent.matchAll(/href=["']([^"']*\/contact\/\?[^"']+)["']/gi)]
      .map(match => match[1].replace(/&amp;/g, "&"))
      .map(href => new URL(href, entry).searchParams.get("service"))
      .filter(Boolean);
    if (!serviceHrefs.includes(expected) || serviceHrefs.some(service => service !== expected)) {
      errors.push(entry + ": incorrect guide enquiry service; expected " + expected + ", found [" + serviceHrefs.join(", ") + "]");
    }
  }

  const h1s = [...html.matchAll(/<h1(?:\s|>)/gi)];
  if (h1s.length !== 1) errors.push(entry + ": expected exactly one H1; found " + h1s.length);
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!title) errors.push(entry + ": missing title");
  else if (titleOwner.has(title)) warnings.push("Possible duplicate title: " + entry + " and " + titleOwner.get(title));
  else titleOwner.set(title, entry);
  const descriptions = [...html.matchAll(/<meta[^>]+name=["']description["'][^>]*>/gi)];
  if (descriptions.length !== 1 || !attribute(descriptions[0]?.[0] ?? "", "content"))
    errors.push(entry + ": missing or repeated meta description");
  const canonicals = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/gi)];
  if (canonicals.length !== 1 || attribute(canonicals[0]?.[0] ?? "", "href") !== entry)
    errors.push(entry + ": incorrect or absent canonical");

  for (const script of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(script[1]); } catch { errors.push(entry + ": invalid JSON-LD"); }
  }
  for (const link of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const href = link[1].replace(/&amp;/g, "&");
    let target;
    try { target = new URL(href, entry); } catch { warnings.push(entry + ": unparseable link: " + href); continue; }
    if (target.origin !== host) continue;
    const targetPath = localPath(target.pathname);

    checkedInternalLinks++;
    if (!fs.existsSync(targetPath)) {
      errors.push(entry + ": broken internal link: " + href);
    } else if (target.hash && targetPath.endsWith(".html")) {
      const fragment = decodeURIComponent(target.hash.slice(1));
      if (fragment) {
        checkedAnchors++;
        const targetHtml = readFileCached(targetPath);
        const ids = [...targetHtml.matchAll(/\bid=["']([^"']+)["']/gi)].map(match => match[1]);
        const named = [...targetHtml.matchAll(/<a\b[^>]*\bname=["']([^"']+)["']/gi)].map(match => match[1]);
        if (!ids.includes(fragment) && !named.includes(fragment)) {
          errors.push(entry + ": link points to a missing section #" + fragment + " on " + target.pathname);
        }
      }
    }
  }
}
for (const warning of warnings) console.warn("WARN " + warning);
for (const error of errors) console.error("ERROR " + error);
console.log("SEO QA checked " + unique.size + " sitemap URLs and " + checkedInternalLinks + " internal links (" + checkedAnchors + " anchors); " + errors.length + " errors, " + warnings.length + " warnings.");
if (errors.length) process.exitCode = 1;
