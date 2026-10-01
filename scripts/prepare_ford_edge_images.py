"""Prepare the supplied 2013 Ford Edge photos as size-limited WebP assets.

Requires local, Git-ignored JFIF files in ``2013 ford edge`` and Pillow.
The raw files remain untouched. Run: python scripts/prepare_ford_edge_images.py
"""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "2013 ford edge"
OUTPUT = ROOT / "public" / "optimized" / "v1" / "vehicles" / "2013-ford-edge"

# Ordered to match the detail-page gallery. Two redundant/soft source photos are omitted.
PHOTOS = [
    ("hero-front", "85090f0a-6538-4e0f-8b5c-c9fcea19483d.jfif", (0, 0, 4032, 2700)),
    ("front-view", "fd368ca3-979e-467f-9d24-02898c6944b4.jfif", (0, 250, 3024, 3650)),
    ("driver-side-profile", "f04916cc-add7-4c9d-9360-cd5431cfcd73.jfif", (0, 0, 4032, 2700)),
    ("rear-view", "0a97a6fc-616e-42bf-a946-fe7c0860733d.jfif", (0, 180, 3024, 3650)),
    ("passenger-side-profile", "f4a1f55e-3494-4d09-9a9e-8d66dc8931fd.jfif", (0, 0, 4032, 2700)),
    ("driver-seat", "f5a07193-38e7-4825-8a0d-d9b7f075912b.jfif", (0, 0, 3024, 3800)),
    ("front-cabin", "b2d3e369-e139-419e-bd56-ebccc63405cc.jfif", (0, 0, 3024, 3750)),
    ("rear-seats", "c00f70bd-97aa-4b9d-b891-06d1e966bb49.jfif", (0, 0, 3024, 3750)),
    ("cargo-area", "5d6d4498-9887-41ce-8b27-ae550671eed2.jfif", (0, 0, 4032, 3024)),
    ("steering-wheel", "954de970-8394-4b05-a88a-907ede418dd7.jfif", (0, 0, 4032, 3024)),
]


def save_resized(image: Image.Image, destination: Path, width: int, quality: int) -> None:
    output_width = min(width, image.width)
    output_height = round(image.height * output_width / image.width)
    resized = image.resize((output_width, output_height), Image.Resampling.LANCZOS)
    resized.save(destination, "WEBP", quality=quality, method=6)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, filename, crop in PHOTOS:
        with Image.open(RAW / filename) as raw:
            image = ImageOps.exif_transpose(raw).convert("RGB").crop(crop)
            for width, quality in ((320, 80), (960, 82), (1600, 85)):
                suffix = "thumb" if width == 320 else str(width)
                save_resized(image, OUTPUT / f"{name}-{suffix}.webp", width, quality)

            if name == "driver-side-profile":
                # The inventory card keeps the roof and wheels without excess gravel.
                tall_card = image.crop((0, 0, 4032, 2372))
                for width in (480, 800):
                    save_resized(tall_card, OUTPUT / f"{name}-card-tall-{width}.webp", width, 83)

    print(f"Prepared {len(PHOTOS)} Ford Edge photos in {OUTPUT}")


if __name__ == "__main__":
    main()
