#!/usr/bin/env python3
"""Check Lazy Plex Digital's local and publicly served AI-search discovery paths.

An HTTP 200 response to a named User-Agent is a smoke test only. It does not
prove a crawler's genuine IP is permitted or that an AI search engine will
retrieve, index, cite or rank the website.
"""
from __future__ import annotations

import argparse
import struct
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://digital.lazyplex.com"
SEARCH_AGENTS = {
    "OAI-SearchBot": "Mozilla/5.0 (compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot)",
    "PerplexityBot": "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
    "Claude-SearchBot": "Mozilla/5.0 (compatible; Claude-SearchBot/1.0)",
    "Googlebot": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Bingbot": "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
}

def validate_config() -> None:
    robots_text = (ROOT / "robots.txt").read_text(encoding="utf-8")
    parser = RobotFileParser()
    parser.parse(robots_text.splitlines())
    for user_agent in SEARCH_AGENTS:
        for path in ("/", "/insights/", "/industries/healthcare/"):
            assert parser.can_fetch(user_agent, SITE + path), f"{user_agent} blocked for {path}"
    assert f"Sitemap: {SITE}/sitemap.xml" in robots_text
    sitemap = ET.parse(ROOT / "sitemap.xml")
    locs = [x.text.strip() for x in sitemap.iter() if x.tag.endswith("loc") and x.text]
    assert len(locs) >= 50, f"Expected many public pages, got {len(locs)}"
    for path in ("/", "/about/", "/insights/", "/tools/lead-quality-roi-calculator/"):
        assert SITE + path in locs, f"Sitemap missing {path}"
    llms = (ROOT / "llms.txt").read_text(encoding="utf-8")
    for value in (SITE + "/", SITE + "/services/", SITE + "/industries/", SITE + "/insights/"):
        assert value in llms, f"AI navigation file missing {value}"
    print(f"Local checks passed: {len(SEARCH_AGENTS)} agents permitted and {len(locs)} sitemap URLs.", flush=True)

def request(path: str, user_agent: str) -> tuple[str, bytes]:
    url = SITE + path
    req = Request(url, headers={"User-Agent": user_agent, "Accept": "*/*"})
    with urlopen(req, timeout=25) as response:
        final_url = response.geturl()
        status = response.status
        mime = response.headers.get("Content-Type", "")
        data = response.read(1_500_000)
    if status != 200 or final_url != url:
        raise RuntimeError(f"{path}: HTTP {status}, unexpected URL {final_url}")
    print(f"HTTP {status} {path} — {user_agent[:40]} — {mime}", flush=True)
    return mime, data

def validate_live() -> None:
    for agent, header in SEARCH_AGENTS.items():
        mime, body = request("/", header)
        assert b"Lazy Plex" in body or b"LAZY PLEX" in body, f"{agent} homepage content missing"
    mime, body = request("/robots.txt", SEARCH_AGENTS["OAI-SearchBot"])
    assert b"User-agent: OAI-SearchBot" in body and b"Allow: /" in body
    mime, body = request("/llms.txt", SEARCH_AGENTS["OAI-SearchBot"])
    assert b"Lazy Plex Digital" in body and b"lead-quality-roi-calculator" in body
    mime, body = request("/sitemap.xml", SEARCH_AGENTS["Googlebot"])
    assert b"<urlset" in body and b"https://digital.lazyplex.com/" in body
    mime, body = request("/favicon.png", SEARCH_AGENTS["Googlebot"])
    assert body[:8] == b"\x89PNG\r\n\x1a\n"
    width, height = struct.unpack(">II", body[16:24])
    assert width == height and width >= 48, f"Bad favicon dimensions {width}x{height}"
    print(f"Live checks passed: Search UA response tests + robots/sitemap/llms/favicon ({width}x{height}).", flush=True)
    print("Note: these are UA smoke tests, NOT verified requests from the actual bot IP ranges.", flush=True)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--live", action="store_true", help="Check public URLs in addition to repository configuration.")
    args = ap.parse_args()
    validate_config()
    if args.live:
        validate_live()
