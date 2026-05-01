#!/usr/bin/env python3
"""
Download all assets referenced in old.html to a local public/ directory.

Usage:
    python download_assets.py [BASE_URL] [HTML_FILE] [OUTPUT_DIR]

Defaults:
    BASE_URL   = https://vbti-test.pages.dev
    HTML_FILE  = old.html
    OUTPUT_DIR = public

Environment variables can also be used:
    BASE_URL, HTML_FILE, OUTPUT_DIR
"""

import re
import os
import sys
import time
import random
import urllib.request
import urllib.error
from pathlib import Path
from urllib.parse import urljoin, urlparse


BASE_URL   = "https://vbti-test.com"
HTML_FILE  = "old/v1.1.5.html"
OUTPUT_DIR = "public"

ASSET_EXTS = frozenset({
    ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg",
    ".mp3", ".wav", ".ogg", ".flac",
    ".ico",
    ".mp4", ".webm",
    ".woff", ".woff2", ".ttf", ".eot",
})


def is_asset_path(path: str) -> bool:
    ext = Path(path.split("?")[0]).suffix.lower()
    return ext in ASSET_EXTS


def is_absolute_url(path: str) -> bool:
    return path.startswith(("http://", "https://", "//"))


def is_same_origin(url: str, base: str) -> bool:
    if not is_absolute_url(url):
        return True
    return urlparse(url).netloc == urlparse(base).netloc


def resolve_url(path: str, base_url: str) -> str:
    if path.startswith("//"):
        return "https:" + path
    if path.startswith(("http://", "https://")):
        return path
    return urljoin(base_url, path)


def local_path(asset: str, output_dir: str) -> Path:
    p = urlparse(asset)
    clean = p.path.lstrip("/")
    return Path(output_dir) / clean


def extract_assets(html: str, base_url: str) -> set[str]:
    hits: set[str] = set()

    # 1. JS / HTML string literals that contain asset extensions.
    #    Matches: 'music/miku.mp3'  "character/miku.webp"  src="favicon.png"
    #    Also catches meta content="https://vbti-test.pages.dev/share-card.png"
    ext_pat = "|".join(e.strip(".") for e in sorted(ASSET_EXTS, key=len, reverse=True))
    regex = re.compile(rf"""(['">])([^'"<>\s]*\.(?:{ext_pat}))(['"<\s])""", re.IGNORECASE)

    for m in regex.finditer(html):
        path = m.group(2).strip()
        if path and is_asset_path(path):
            hits.add(path)

    return hits


REQ_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
    "Accept": "image/webp,image/avif,image/*,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
}
RETRY_COUNT = 2
DELAY_MIN = 0.2
DELAY_MAX = 0.8


def download(url: str, dest: Path, referer: str = "") -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"  → {url}")

    headers = dict(REQ_HEADERS)
    if referer:
        headers["Referer"] = referer

    for attempt in range(RETRY_COUNT + 1):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as resp, open(dest, "wb") as f:
                f.write(resp.read())
            size = dest.stat().st_size
            print(f"    ✓ {size:,} bytes")
            time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))
            return True
        except urllib.error.HTTPError as e:
            if attempt < RETRY_COUNT and e.code in (429, 503):
                wait = (attempt + 1) * 3
                print(f"    ⏳ HTTP {e.code}, retrying in {wait}s …")
                time.sleep(wait)
                continue
            print(f"    ✗ HTTP {e.code}")
            return False
        except Exception as e:
            if attempt < RETRY_COUNT:
                wait = (attempt + 1) * 2
                print(f"    ⏳ {e}, retrying in {wait}s …")
                time.sleep(wait)
                continue
            print(f"    ✗ {e}")
            return False
    return False


def main():
    base_url   = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("BASE_URL", BASE_URL)
    html_file  = sys.argv[2] if len(sys.argv) > 2 else os.environ.get("HTML_FILE", HTML_FILE)
    output_dir = sys.argv[3] if len(sys.argv) > 3 else os.environ.get("OUTPUT_DIR", OUTPUT_DIR)

    print(f"Base URL   : {base_url}")
    print(f"HTML file  : {html_file}")
    print(f"Output dir : {output_dir}\n")

    with open(html_file, "r", encoding="utf-8") as f:
        html = f.read()

    all_assets = extract_assets(html, base_url)

    local_assets: set[str] = set()
    skip_count = 0
    for a in sorted(all_assets):
        if is_same_origin(a, base_url):
            local_assets.add(a)
        else:
            skip_count += 1
            print(f"  [skip external] {a}")

    print(f"\nFound {len(local_assets)} same-origin assets to download.\n")
    for a in sorted(local_assets):
        print(f"  {a}")

    if not local_assets:
        print("\nNothing to download.")
        return

    ok, fail = 0, 0
    for asset in sorted(local_assets):
        url  = resolve_url(asset, base_url)
        dest = local_path(asset, output_dir)
        if download(url, dest, referer=base_url):
            ok += 1
        else:
            fail += 1

    print(f"\nDone — {ok} succeeded, {fail} failed.")
    if fail:
        sys.exit(1)


if __name__ == "__main__":
    main()
