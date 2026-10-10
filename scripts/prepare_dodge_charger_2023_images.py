"""Prepare reviewed owner photos without copying originals into the repository.

Run: python scripts/prepare_dodge_charger_2023_images.py [--source PATH]
Requires Pillow. Coordinates refer to EXIF-corrected originals; no padding,
retouching, stretching, or generated content is used.
"""

import argparse
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
RAW = Path.home() / "Downloads" / "Dodge charger 2023"
STEM = "2023-dodge-charger-sxt"
OUTPUT = ROOT / "public" / "optimized" / "v1" / "vehicles" / STEM
PREFIX = "WhatsApp Image 2026-10-09 at "

# Every one of the 16 sources was visually reviewed. Excluded:
# 8.38.51: frontal portrait overlapping the better horizontal front.
# 8.38.59 and 8.39.06: close front angles cut off opposite bumper/body.
# 8.39.09: soft dashboard/odometer, overlapping the sharper driver cockpit.
# The side photos are partial body views, not complete side profiles.
# No source shows the backup camera display in operation.
PHOTOS = [
    ("gray-front", "8.38.56 AM.jpeg", (0, 300, 4032, 2950)),
    ("gray-driver-side-front-wheel", "8.39.07 AM (1).jpeg", (0, 60, 4032, 2200)),
    ("gray-driver-side-rear-body", "8.39.07 AM.jpeg", (0, 120, 4032, 2350)),
    ("gray-passenger-side-front", "8.39.07 AM (2).jpeg", (0, 100, 4032, 2700)),
    ("gray-passenger-side-rear-body", "8.39.08 AM.jpeg", (0, 220, 4032, 2600)),
    ("gray-rear", "8.39.06 AM (3).jpeg", (0, 450, 3024, 3250)),
    ("black-driver-interior", "8.39.08 AM (3).jpeg", (0, 0, 3024, 3850)),
    ("black-front-passenger-interior", "8.39.08 AM (1).jpeg", (0, 0, 3024, 3200)),
    ("black-rear-seats", "8.39.08 AM (2).jpeg", (0, 0, 3024, 2850)),
    ("radio-and-center-console", "8.39.09 AM (1).jpeg", (0, 350, 3024, 3700)),
    ("open-trunk", "8.39.06 AM (2).jpeg", (0, 850, 3024, 3550)),
    ("engine-bay", "8.39.06 AM (1).jpeg", (0, 650, 4032, 3024)),
]

# Separate 4:3 thumbnail compositions, matching the existing Charger grid.
THUMBNAIL_CROPS = {
    "gray-front": (0, 0, 4032, 3024),
    "gray-driver-side-front-wheel": (0, 0, 4032, 3024),
    "gray-driver-side-rear-body": (0, 0, 4032, 3024),
    "gray-passenger-side-front": (0, 0, 4032, 3024),
    "gray-passenger-side-rear-body": (0, 0, 4032, 3024),
    "gray-rear": (0, 650, 3024, 2918),
    "black-driver-interior": (0, 200, 3024, 2468),
    "black-front-passenger-interior": (0, 0, 3024, 2268),
    "black-rear-seats": (0, 100, 3024, 2368),
    "radio-and-center-console": (0, 400, 3024, 2668),
    "open-trunk": (0, 1050, 3024, 3318),
    "engine-bay": (0, 0, 4032, 3024),
}
# The front is too tall for the default fixed-height card at wider mobile
# widths. Keep a small real-photo margin around roof and splitter and match
# this ratio on this vehicle's card instead of trimming either bumper/roof.
CARD_CROP = (0, 350, 4032, 2930)


def checked_crop(image: Image.Image, box: tuple, source: str) -> Image.Image:
    if not (0 <= box[0] < box[2] <= image.width
            and 0 <= box[1] < box[3] <= image.height):
        raise ValueError(f"Invalid crop for {source}: {box}, source {image.size}")
    return image.crop(box)


def save_resized(image: Image.Image, destination: Path, width: int, quality: int) -> None:
    output_width = min(width, image.width)
    output_height = round(image.height * output_width / image.width)
    image.resize((output_width, output_height), Image.Resampling.LANCZOS).save(
        destination, "WEBP", quality=quality, method=6
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=RAW)
    source = parser.parse_args().source
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, suffix, crop in PHOTOS:
        with Image.open(source / f"{PREFIX}{suffix}") as original:
            oriented = ImageOps.exif_transpose(original).convert("RGB")
            photo = checked_crop(oriented, crop, suffix)
            for width, quality in ((960, 82), (1600, 85)):
                save_resized(photo, OUTPUT / f"{STEM}-{name}-{width}.webp", width, quality)
            thumb = checked_crop(oriented, THUMBNAIL_CROPS[name], suffix)
            save_resized(thumb, OUTPUT / f"{STEM}-{name}-thumb.webp", 320, 80)
            if name == "gray-front":
                card = checked_crop(oriented, CARD_CROP, suffix)
                for width in (480, 800):
                    save_resized(card, OUTPUT / f"{STEM}-{name}-card-tall-{width}.webp", width, 83)

    assets = list(OUTPUT.glob("*.webp"))
    print(f"Prepared {len(PHOTOS)} photos; {len(assets)} WebP variants; "
          f"{sum(f.stat().st_size for f in assets):,} bytes in {OUTPUT}")


if __name__ == "__main__":
    main()
