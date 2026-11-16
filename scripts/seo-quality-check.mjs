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
    if (!fs.existsSync(targetPath)) errors.push(entry + ": broken internal link: " + href);
  }
}
for (const warning of warnings) console.warn("WARN " + warning);
for (const error of errors) console.error("ERROR " + error);
console.log("SEO QA checked " + unique.size + " sitemap URLs; " + errors.length + " errors, " + warnings.length + " warnings.");
if (errors.length) process.exitCode = 1;
