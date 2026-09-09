from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

import build_hand_release_registered_v03 as base
from build_hand_release_registered_v04 import shared_palette_export


ROOT = Path(__file__).parent
base.OUTPUT = ROOT / "hand-release-registered-v06.gif"


def clean_plate(image: Image.Image, _removal_mask: Image.Image):
    """Clean the held plate with a slab-only crop from the detached-pose row."""
    width, height = image.size
    ground = base.tiled_texture(image, (0, 0, 260, 145), image.size)
    source_rows = base.crop_rows(Image.open(base.SOURCE))
    # Row 2 exposes the slab without the arm over it. Keep clear of its copper
    # marker and use only the left slab texture as the replacement tile.
    slab = base.tiled_texture(source_rows[2], (740, 145, 900, height), image.size)
    cleanup = base.polygon_mask((width, height), [
        (205, height), (208, 258), (252, 212), (310, 166),
        (365, 108), (408, 46), (510, 36), (625, 54),
        (720, 108), (775, 168), (795, 258), (738, height),
    ])
    split = Image.new("L", image.size, 0)
    ImageDraw.Draw(split).rectangle((0, 0, width, 145), fill=255)
    ground_mask = ImageChops.multiply(cleanup, split)
    slab_mask = ImageChops.subtract(cleanup, split)
    background = image.copy()
    background.paste(ground, (0, 0), ground_mask)
    background.paste(slab, (0, 0), slab_mask)
    return background


def main():
    base.fixed_background = clean_plate
    base.main()
    count = shared_palette_export(base.OUTPUT)
    print(f"Re-encoded {base.OUTPUT} with a shared palette ({count} frames, 120 ms/frame)")


if __name__ == "__main__":
    main()
