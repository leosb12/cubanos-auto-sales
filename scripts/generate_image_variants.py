"""Regenerate checked-in WebP variants without changing the source images.

Requires Pillow: python -m pip install Pillow
When replacing an existing source photo, bump the /optimized/v1/ URL version in
the site before publishing so immutable browser caches receive the new image.
"""

import re
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUTPUT = PUBLIC / "optimized" / "v1"


def save_webp(source: Path, destination: Path, width: int, quality: int) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")
        if image.width != width:
            height = round(image.height * width / image.width)
            image = image.resize((width, height), Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=quality, method=6)


def main() -> None:
    hero = PUBLIC / "bannercubanos.png"
    for width in (640, 1200, 1920):
        save_webp(hero, OUTPUT / f"hero-cubanos-{width}.webp", width, 90)

    cover_sources = {
        PUBLIC / folder.lstrip("/") / filename
        for folder, filename in re.findall(
            r"coverImage:\s*imagePath\('([^']+)',\s*'([^']+)'\)",
            (ROOT / "src" / "data" / "vehicles.js").read_text(encoding="utf-8"),
        )
    }

    for source in PUBLIC.glob("*/*.jpg"):
        output_dir = OUTPUT / "vehicles" / source.parent.name
        save_webp(source, output_dir / f"{source.stem}-thumb.webp", 320, 82)
        if source in cover_sources:
            for width in (480, 800):
                save_webp(source, output_dir / f"{source.stem}-card-{width}.webp", width, 78)

    print(f"Generated vehicle thumbnails and {len(cover_sources)} responsive cover pairs in {OUTPUT}")


if __name__ == "__main__":
    main()
