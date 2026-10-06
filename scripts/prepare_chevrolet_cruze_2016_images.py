"""Prepare the owner-supplied Cruze photos without copying originals into the repo.

Run: python scripts/prepare_chevrolet_cruze_2016_images.py [--source PATH]
Requires Pillow. Sources remain outside public/ and are never modified.
"""

import argparse
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
RAW = Path.home() / "Downloads" / "Chevrolet cruze" / "WhatsApp Unknown 2026-10-06 at 12.24.03 PM"
OUTPUT = ROOT / "public" / "optimized" / "v2" / "vehicles" / "2016-chevrolet-cruze-lt"
PREFIX = "WhatsApp Image 2026-10-05 at "
STEM = "2016-chevrolet-cruze-lt"

# Manually reviewed gallery order. Coordinates use EXIF-corrected originals.
# Excluded from the gallery: 30 (1) console overlap; 30 (3) used for the card;
# 30 rear-side fragment; 32 rear seats with flatter contrast and overlapping coverage.
PHOTOS = [
    ("black-front-three-quarter", "12.20.32 PM (2).jpeg", (0, 950, 3024, 3400)),
    ("black-front", "12.20.33 PM.jpeg", (0, 800, 3024, 3350)),
    ("black-driver-side-front-wheel", "12.20.30 PM (2).jpeg", (0, 0, 4032, 2150)),
    ("black-passenger-side-rear", "12.20.32 PM (1).jpeg", (0, 300, 4032, 2600)),
    ("black-rear", "12.20.31 PM (2).jpeg", (0, 550, 3024, 3250)),
    ("black-driver-interior", "12.20.33 PM (1).jpeg", (0, 0, 3024, 3900)),
    ("black-front-passenger-interior", "12.20.31 PM (1).jpeg", (0, 0, 3024, 3650)),
    ("dashboard-and-center-console", "12.20.29 PM.jpeg", (0, 0, 4032, 3024)),
    ("black-rear-seats", "12.20.29 PM (1).jpeg", (0, 0, 3024, 3350)),
    ("backup-camera-display", "12.20.29 PM (2).jpeg", (0, 150, 3024, 3050)),
    ("open-trunk", "12.20.31 PM.jpeg", (0, 500, 3024, 3600)),
    ("engine-bay", "12.20.31 PM (3).jpeg", (0, 850, 3024, 2800)),
]

# Independent thumbnail compositions: remove background rather than padding
# the portrait photos or zooming already-padded images in the browser.
THUMBNAIL_CROPS = {
    "black-front-three-quarter": (0, 500, 3024, 3524),
    "black-front": (0, 500, 3024, 3524),
    "black-driver-side-front-wheel": (0, 0, 3024, 3024),
    "black-passenger-side-rear": (250, 0, 3274, 3024),
    "black-rear": (0, 300, 3024, 3324),
    "black-driver-interior": (0, 200, 3024, 3224),
    "black-front-passenger-interior": (0, 0, 3024, 3024),
    "dashboard-and-center-console": (850, 0, 3874, 3024),
    "black-rear-seats": (0, 250, 3024, 3274),
    "backup-camera-display": (0, 200, 3024, 3224),
    "open-trunk": (0, 300, 3024, 3324),
    "engine-bay": (0, 600, 3024, 3624),
}

# This original horizontal photograph fills the same 800x471 card format
# as the Ford and Dodge. Its crop only removes sky and foreground gravel.
CARD_SOURCE = "12.20.30 PM (3).jpeg"
CARD_CROP = (0, 180, 4032, 2552)


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
            if not (0 <= crop[0] < crop[2] <= oriented.width and 0 <= crop[1] < crop[3] <= oriented.height):
                raise ValueError(f"Invalid crop for {suffix}: {crop}, source {oriented.size}")
            image = oriented.crop(crop)
            for width, quality in ((960, 82), (1600, 85)):
                save_resized(image, OUTPUT / f"{STEM}-{name}-{width}.webp", width, quality)

            thumb_crop = THUMBNAIL_CROPS[name]
            if not (0 <= thumb_crop[0] < thumb_crop[2] <= oriented.width
                    and 0 <= thumb_crop[1] < thumb_crop[3] <= oriented.height
                    and thumb_crop[2] - thumb_crop[0] == thumb_crop[3] - thumb_crop[1]):
                raise ValueError(f"Invalid square thumbnail crop for {suffix}: {thumb_crop}")
            thumbnail = oriented.crop(thumb_crop).resize((320, 320), Image.Resampling.LANCZOS)
            thumbnail.save(OUTPUT / f"{STEM}-{name}-thumb.webp", "WEBP", quality=80, method=6)

            if name == "black-front-three-quarter":
                with Image.open(source / f"{PREFIX}{CARD_SOURCE}") as card_original:
                    card_photo = ImageOps.exif_transpose(card_original).convert("RGB").crop(CARD_CROP)
                    for width in (480, 800):
                        save_resized(card_photo, OUTPUT / f"{STEM}-{name}-card-tall-{width}.webp", width, 83)

    assets = list(OUTPUT.glob("*.webp"))
    print(f"Prepared {len(PHOTOS)} Cruze photos; {len(assets)} WebP variants; {sum(f.stat().st_size for f in assets):,} bytes in {OUTPUT}")


if __name__ == "__main__":
    main()
