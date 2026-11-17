#!/usr/bin/env python3
"""Submit changed digital.lazyplex.com URLs to the official IndexNow endpoint.

No paid API. No background server, no visitor data, no automated full-sitemap spam.
The workflow runs after successful GitHub Pages deployment or manual dispatch.
"""
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET

HOST = "digital.lazyplex.com"
SITE = "https://" + HOST
KEY = "98ee5d1795784dcd838024c1ada1bd49"
KEY_URL = SITE + "/" + KEY + ".txt"
ENDPOINT = "https://api.indexnow.org/indexnow"
ROOT = Path(__file__).resolve().parents[1]
KEY_FILE = ROOT / (KEY + ".txt")
SEED_FILE = ROOT / "indexnow" / "recent-updated-urls.txt"
SITEMAP_FILE = ROOT / "sitemap.xml"


def sitemap_urls(xml_text):
    root = ET.fromstring(xml_text)
    return [el.text.strip() for el in root.iter()
            if el.tag.rsplit("}", 1)[-1] == "loc" and el.text]


def validate_urls(urls):
    result = []
    seen = set()
    for raw in urls:
        u = raw.strip()
        if not u or u.startswith("#"):
            continue
        parts = urlsplit(u)
        if (parts.scheme != "https" or parts.hostname != HOST
                or parts.port is not None or parts.username or parts.password
                or parts.query or parts.fragment or not parts.path.startswith("/")
                or len(u) > 2048):
            raise ValueError("Refusing URL outside canonical host or with query: " + u)
        if u not in seen:
            seen.add(u)
            result.append(u)
    return result


def file_to_url(path):
    path = path.strip().lstrip("/")
    if path == "index.html":
        return SITE + "/"
    if not path.endswith("/index.html"):
        return None
    if path.startswith(".") or path.startswith("indexnow/"):
        return None
    return SITE + "/" + path[:-len("index.html")]


def changed_files():
    try:
        out = subprocess.check_output(
            ["git", "diff", "--name-status", "--no-renames", "HEAD^", "HEAD"],
            cwd=ROOT, text=True, stderr=subprocess.DEVNULL)
    except (subprocess.CalledProcessError, FileNotFoundError):
        return []
    entries = []
    for line in out.splitlines():
        fields = line.split("\t")
        if len(fields) >= 2:
            entries.append(fields[1])
    return entries


def changed_urls():
    paths = changed_files()
    results = [url for p in paths if (url := file_to_url(p))]
    if "sitemap.xml" in paths:
        try:
            old_xml = subprocess.check_output(
                ["git", "show", "HEAD^:sitemap.xml"], cwd=ROOT)
            old = set(sitemap_urls(old_xml))
            current = set(sitemap_urls(SITEMAP_FILE.read_bytes()))
            results.extend(sorted(old ^ current))
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
    # One-time bootstrap or intentional changes to the seed list.
    if "indexnow/recent-updated-urls.txt" in paths:
        results.extend(SEED_FILE.read_text(encoding="utf-8").splitlines())
    return validate_urls(results)


def verify_key():
    expected = KEY.encode("utf-8")
    if not KEY_FILE.is_file() or KEY_FILE.read_bytes() != expected:
        raise RuntimeError("Local IndexNow key file is absent or is not the exact key")
    request = urllib.request.Request(
        KEY_URL, headers={"User-Agent": "LazyPlex-IndexNow/1.0", "Cache-Control": "no-cache"})
    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            status = response.status
            final_url = response.geturl()
            content = response.read(2048)
    except urllib.error.HTTPError as exc:
        raise RuntimeError("Public key URL returned HTTP " + str(exc.code)) from exc
    except Exception as exc:
        raise RuntimeError("Public key URL not reachable: " + str(exc)) from exc
    print("Verification response: HTTP", status, "final URL:", final_url,
          "bytes:", len(content), flush=True)
    if status != 200 or final_url != KEY_URL or content != expected:
        raise RuntimeError("Public key validation failed: expected direct HTTP 200 and exact 32-byte file; got "
                           + str(status) + " at " + final_url + " with body prefix " + repr(content[:80]))
    print("IndexNow key publicly verified on canonical host.", flush=True)


def submit(urls):
    body = json.dumps({
        "host": HOST, "key": KEY, "keyLocation": KEY_URL, "urlList": urls
    }, separators=(",", ":")).encode("utf-8")
    request = urllib.request.Request(
        ENDPOINT, data=body, method="POST",
        headers={"Content-Type": "application/json; charset=utf-8",
                 "User-Agent": "LazyPlex-IndexNow/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            status = response.status
            text = response.read(2048).decode("utf-8", errors="replace")
    except urllib.error.HTTPError as exc:
        payload = exc.read(1024).decode("utf-8", errors="replace")
        raise RuntimeError("IndexNow HTTP " + str(exc.code) + ": " + payload) from exc
    except Exception as exc:
        raise RuntimeError("Could not submit to IndexNow: " + str(exc)) from exc
    print("IndexNow API HTTP", status, "- submitted", len(urls), "changed URL(s).", flush=True)
    if text:
        print("API response:", text[:300], flush=True)
    if status == 200:
        print("SUCCESS: notification received and key accepted; indexing is not guaranteed.")
    elif status == 202:
        print("ACCEPTED: notification received; key verification may still be pending.")
    else:
        raise RuntimeError("IndexNow unexpected HTTP " + str(status))


def main():
    event = os.environ.get("GITHUB_EVENT_NAME", "").strip()
    manual = os.environ.get("INDEXNOW_MANUAL_URLS", "").strip()
    mode = os.environ.get("INDEXNOW_MODE", "").strip().lower()
    if manual:
        urls = validate_urls(re.split(r"[\n,]+", manual))
    elif event == "workflow_dispatch" and mode == "recent":
        urls = validate_urls(SEED_FILE.read_text(encoding="utf-8").splitlines())
    else:
        urls = changed_urls()
    print("Submission mode:", "manual URL input" if manual else (mode or "changed"),
          "; changed URLs:", len(urls), flush=True)
    for url in urls:
        print("  ", url, flush=True)
    if not urls:
        print("No new, updated or removed URLs in this release; no IndexNow request sent.")
        return
    verify_key()
    submit(urls)


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, ValueError) as exc:
        print("INDEXNOW FAILURE:", exc, file=sys.stderr, flush=True)
        sys.exit(1)
