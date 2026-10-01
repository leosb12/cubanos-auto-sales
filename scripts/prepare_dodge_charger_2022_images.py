"""Create responsive WebP assets from the owner-supplied 2022 Charger photos.

Requires local, Git-ignored JPEGs in ``Dodge charger 2022`` and Pillow.
The original photos are never served by the site.
Run: python scripts/prepare_dodge_charger_2022_images.py
"""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "Dodge charger 2022"
OUTPUT = ROOT / "public" / "optimized" / "v1" / "vehicles" / "2022-dodge-charger-sxt"
PREFIX = "WhatsApp Image 2026-10-01 at "

# Gallery order. Omit the overlapping side, rear-seat, driver-seat and screen shots.
# Crop coordinates refer to the orientation-corrected 4032x3024 / 3024x4032 files.
PHOTOS = [
    ("hero-front-three-quarter", "12.20.28 AM.jpeg", (0, 160, 4032, 2680)),
    ("front-view", "12.20.26 AM.jpeg", (0, 300, 3024, 3800)),
    ("driver-side-profile", "12.20.27 AM.jpeg", (0, 180, 4032, 2720)),
    ("rear-view", "12.20.28 AM (3).jpeg", (0, 250, 3024, 3800)),
    ("driver-front-cabin", "12.20.27 AM (1).jpeg", (0, 0, 3024, 3900)),
    ("passenger-front-cabin", "12.20.28 AM (2).jpeg", (0, 0, 3024, 3900)),
    ("dashboard-and-steering", "12.20.29 AM (1).jpeg", (0, 0, 4032, 3024)),
    ("rear-seats", "12.20.27 AM (3).jpeg", (0, 0, 3024, 3900)),
    ("trunk", "12.20.29 AM.jpeg", (0, 150, 4032, 2900)),
    ("backup-camera", "12.20.27 AM (2).jpeg", (0, 100, 3024, 3800)),
    ("engine-bay", "12.20.26 AM (3).jpeg", (0, 100, 4032, 2850)),
]


def save_resized(image: Image.Image, destination: Path, width: int, quality: int) -> None:
    resized_width = min(width, image.width)
    resized_height = round(image.height * resized_width / image.width)
    image.resize((resized_width, resized_height), Image.Resampling.LANCZOS).save(
        destination, "WEBP", quality=quality, method=6
    )


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, suffix, crop in PHOTOS:
        with Image.open(RAW / f"{PREFIX}{suffix}") as original:
            oriented = ImageOps.exif_transpose(original).convert("RGB")
            if crop[0] < 0 or crop[1] < 0 or crop[2] > oriented.width or crop[3] > oriented.height:
                raise ValueError(f"Crop exceeds {suffix}: {crop} for {oriented.size}")
            image = oriented.crop(crop)
            for width, quality in ((320, 80), (960, 82), (1600, 85)):
                label = "thumb" if width == 320 else str(width)
                save_resized(image, OUTPUT / f"{name}-{label}.webp", width, quality)

            if name == "hero-front-three-quarter":
                # Card crop retains the roof, wheels and front bumper.
                tall_card = oriented.crop((0, 200, 4032, 2572))
                for width in (480, 800):
                    save_resized(tall_card, OUTPUT / f"{name}-card-tall-{width}.webp", width, 83)

    print(f"Prepared {len(PHOTOS)} Charger photos in {OUTPUT}")


if __name__ == "__main__":
    main()
