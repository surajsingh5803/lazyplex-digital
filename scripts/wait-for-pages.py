#!/usr/bin/env python3
"""Wait for the GitHub Pages workflow for this exact main commit to deploy."""
import json
import os
import sys
import time
import urllib.error
import urllib.request

repo = os.environ.get("GITHUB_REPOSITORY", "")
sha = os.environ.get("GITHUB_SHA", "")
token = os.environ.get("GITHUB_TOKEN", "")
if not repo or not sha or not token:
    raise SystemExit("Missing GitHub workflow context or actions:read token")
endpoint = "https://api.github.com/repos/" + repo + "/actions/runs?per_page=30"
print("Waiting for Pages deployment of commit", sha, flush=True)
for attempt in range(36):
    request = urllib.request.Request(endpoint, headers={
        "Accept": "application/vnd.github+json",
        "Authorization": "Bearer " + token,
        "User-Agent": "LazyPlex-IndexNow-deploy-check",
        "X-GitHub-Api-Version": "2022-11-28",
    })
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            runs = json.loads(response.read()).get("workflow_runs", [])
    except Exception as exc:
        raise SystemExit("Unable to read GitHub Pages deployment status: " + str(exc))
    pages = [run for run in runs
             if run.get("name") == "pages build and deployment"
             and run.get("head_sha") == sha]
    if pages:
        latest = max(pages, key=lambda x: x.get("created_at", ""))
        state, outcome = latest.get("status"), latest.get("conclusion")
        print("GitHub Pages:", state, outcome or "pending", flush=True)
        if outcome == "success":
            # Allow GitHub Pages edge nodes a brief chance to refresh.
            time.sleep(5)
            print("Pages deployment confirmed for current commit.", flush=True)
            sys.exit(0)
        if outcome in ("failure", "cancelled", "timed_out"):
            raise SystemExit("Cannot notify IndexNow: Pages deployment " + outcome)
    else:
        print("Pages run for this SHA not found yet", flush=True)
    time.sleep(10)
raise SystemExit("Pages deployment not confirmed within polling limit; no IndexNow notifications sent")
