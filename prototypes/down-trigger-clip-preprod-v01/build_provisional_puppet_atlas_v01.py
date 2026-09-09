from pathlib import Path
import json

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
SOURCE = ROOT / "assets" / "derived-down-trigger" / "down-trigger-masked-character-illustrated-model-provisional-v01-clean.png"
OUT = ROOT / "assets" / "derived-down-trigger" / "puppet-atlas-provisional-v01"


PARTS = {
    "head_hood": [(250, 20), (770, 20), (790, 390), (690, 480), (335, 480), (235, 370)],
    "torso_vest": [(205, 270), (815, 270), (850, 800), (730, 900), (290, 900), (170, 780)],
    "arm_left": [(135, 300), (470, 300), (545, 580), (430, 700), (170, 680), (100, 500)],
    "arm_right": [(490, 300), (855, 300), (900, 500), (790, 700), (535, 700), (430, 580)],
    "hands": [(330, 340), (690, 340), (730, 590), (610, 650), (350, 650), (275, 540)],
    "pelvis": [(260, 730), (770, 730), (820, 990), (690, 1070), (330, 1070), (220, 960)],
    "leg_left": [(160, 900), (510, 900), (530, 1380), (420, 1430), (165, 1390), (105, 1110)],
    "leg_right": [(480, 900), (850, 900), (910, 1110), (850, 1390), (600, 1430), (470, 1380)],
    "boot_left": [(120, 1280), (470, 1280), (500, 1510), (90, 1510)],
    "boot_right": [(550, 1280), (900, 1280), (950, 1510), (520, 1510)],
}


def polygon_mask(size, points):
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.polygon(points, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(1.0))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGBA")
    alpha = np.asarray(source.getchannel("A"), dtype=np.uint8)
    metadata = {"source": str(SOURCE.relative_to(ROOT)), "status": "provisional", "parts": {}}

    for name, points in PARTS.items():
        mask = polygon_mask(source.size, points)
        mask_array = np.minimum(np.asarray(mask, dtype=np.uint8), alpha)
        part = source.copy()
        part.putalpha(Image.fromarray(mask_array, mode="L"))
        bbox = part.getchannel("A").getbbox()
        if bbox:
            part = part.crop(bbox)
        path = OUT / f"{name}.png"
        part.save(path)
        metadata["parts"][name] = {
            "file": str(path.relative_to(ROOT)),
            "source_polygon": points,
            "size": list(part.size),
            "overlap": "intentional joint overlap for provisional rigging"
        }

    sheet = Image.new("RGBA", (1200, 900), (16, 17, 22, 255))
    draw = ImageDraw.Draw(sheet)
    for i, (name, _) in enumerate(PARTS.items()):
        part = Image.open(OUT / f"{name}.png").convert("RGBA")
        part.thumbnail((230, 220), Image.Resampling.LANCZOS)
        x = (i % 5) * 240 + 5
        y = (i // 5) * 300 + 8
        sheet.alpha_composite(part, (x + (230 - part.width) // 2, y))
        draw.text((x + 8, y + 230), name, fill=(226, 190, 145, 255))
    sheet.convert("RGB").save(OUT / "puppet-atlas-contact-sheet.jpg", quality=92)
    (OUT / "manifest.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(OUT)


if __name__ == "__main__":
    main()
