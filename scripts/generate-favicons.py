#!/usr/bin/env python3
"""Create favicons from the actual Lazy Plex logo, with no invented mark or padding."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "lazyplex-logo.webp"

TARGETS = {
    ROOT / "favicon.png": 384,            # Square, divisible by 48 for Google.
    ROOT / "assets" / "favicon.png": 384, # Other site pages reference this asset.
    ROOT / "apple-touch-icon.png": 180,
}

def full_original_mark(size: int) -> Image.Image:
    with Image.open(SOURCE) as original:
        logo = ImageOps.exif_transpose(original).convert("RGB")
        width, height = logo.size
        # Approved source is 378x379: discard just one outermost white-border
        # pixel row, without trimming, redrawing or recolouring the actual logo.
        if abs(width - height) > 1:
            raise ValueError(f"Unexpected logo proportions {width}x{height}; manual review needed")
        side = min(width, height)
        logo = logo.crop((0, 0, side, side))
        # Fill the favicon completely with the original image. No 95%-sized
        # artwork, white padding, gradients, glyphs or redesigned LP icon.
        return logo.resize((size, size), resample=Image.Resampling.LANCZOS)

def main() -> None:
    if not SOURCE.is_file():
        raise SystemExit(f"Approved logo not found: {SOURCE}")
    for output, size in TARGETS.items():
        full_original_mark(size).save(output, format="PNG", optimize=True)
        with Image.open(output) as img:
            assert img.size == (size, size) and img.format == "PNG"
        print(f"Created {output.relative_to(ROOT)} from original logo at {size}x{size}")
    ico = ROOT / "favicon.ico"
    full_original_mark(256).save(
        ico, format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    )
    with Image.open(ico) as img:
        assert img.format == "ICO"
    print("Created favicon.ico from original logo (16–256px)")

if __name__ == "__main__":
    main()
