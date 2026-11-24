import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const html = read('index.html');
const css = read('assets/experience.css');
const js = read('assets/experience.js');

assert.match(html, /<body class="home-immersive">/, 'Immersive styling is homepage-scoped');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Homepage preserves exactly one H1');
assert.match(html, /<link\s+href="https:\/\/digital\.lazyplex\.com\/"\s+rel="canonical"\s*\/>/);
assert.match(html, /assets\/experience\.css/);
assert.match(html, /assets\/experience\.js/);
assert.match(html, /<canvas class="growth-stars" aria-hidden="true"><\/canvas>/);
assert.match(html, /class="motion-toggle" aria-pressed="true"/);
assert.match(css, /prefers-reduced-motion/);
assert.match(js, /visibilitychange/);
assert.match(js, /pointerenter/);
assert.match(js, /focus/);
assert.match(html, /id="hero-title"/);
assert.match(html, /id="growth-stage"/);
assert.match(html, /Digital marketing services <em>for your business/, 'Service content preserved');
assert.match(html, /Marketing designed <em>for your industry/, 'Industry content preserved');
assert.match(html, /https:\/\/heysuraj\.com\//, 'Founder link preserved');
assert.match(html, /https:\/\/lazyplex\.com\//, 'Main site link preserved');

const channels = {
  seo:'services/search-engine-optimisation/',
  ads:'services/google-ads-ppc/',
  social:'services/social-media-marketing/',
  ai:'services/ai-automation/'
};
for (const [key, href] of Object.entries(channels)) {
  const anchor = [...html.matchAll(/<a\b[^>]*data-focus="([^"]+)"[^>]*>/g)]
    .map(match => ({key:match[1],tag:match[0]})).find(item => item.key === key);
  assert.ok(anchor, 'Missing interactive channel: ' + key);
  assert.ok(anchor.tag.includes('href="' + href + '"'), 'Incorrect ' + key + ' link');
  assert.ok(existsSync(new URL(href + 'index.html',root)), 'Missing destination: ' + href);
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML ID');
console.log('Immersive homepage: structure, channel destinations and safety checks pass.');
