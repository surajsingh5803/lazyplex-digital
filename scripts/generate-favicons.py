#!/usr/bin/env python3
"""Build consistent browser and Google Search favicons from the approved Lazy Plex logo."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "lazyplex-logo.webp"
TARGETS = {
    ROOT / "favicon.png": 512,
    ROOT / "assets" / "favicon.png": 512,
    ROOT / "apple-touch-icon.png": 180,
}

def square_logo(size: int) -> Image.Image:
    with Image.open(SOURCE) as original:
        logo = ImageOps.exif_transpose(original).convert("RGB")
        # Use the original mark and its original colors; do not redraw or recolor.
        max_width = round(size * 0.95)
        resized = ImageOps.contain(logo, (max_width, max_width), method=Image.Resampling.LANCZOS)
        background = Image.new("RGB", (size, size), (255, 255, 255))
        background.paste(resized, ((size - resized.width) // 2, (size - resized.height) // 2))
        return background

def main() -> None:
    if not SOURCE.is_file():
        raise SystemExit(f"Source logo not found: {SOURCE}")
    for output, size in TARGETS.items():
        image = square_logo(size)
        image.save(output, format="PNG", optimize=True)
        with Image.open(output) as check:
            assert check.size == (size, size) and check.format == "PNG"
        print(f"Created {output.relative_to(ROOT)} ({size}x{size})")
    base = square_logo(256)
    ico = ROOT / "favicon.ico"
    base.save(ico, format="ICO", sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])
    with Image.open(ico) as check:
        assert check.format == "ICO"
    print("Created favicon.ico (16–256px)")

if __name__ == "__main__":
    main()
