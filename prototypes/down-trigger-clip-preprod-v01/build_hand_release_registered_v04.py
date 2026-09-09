from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

import build_hand_release_registered_v03 as base


ROOT = Path(__file__).parent
base.OUTPUT = ROOT / "hand-release-registered-v04.gif"


def broad_fixed_background(image: Image.Image, _removal_mask: Image.Image):
    """Remove the complete initial hand/arm silhouette from the held plate."""
    width, height = image.size
    ground = base.tiled_texture(image, (0, 0, 260, 145), image.size)
    slab = base.tiled_texture(image, (720, 145, 920, height), image.size)
    cleanup = base.polygon_mask((width, height), [
        (210, height), (214, 260), (255, 215), (310, 170),
        (365, 110), (410, 48), (505, 38), (620, 56),
        (715, 110), (770, 170), (790, 255), (735, height),
    ])
    split = Image.new("L", image.size, 0)
    ImageDraw.Draw(split).rectangle((0, 0, width, 145), fill=255)
    ground_mask = ImageChops.multiply(cleanup, split)
    slab_mask = ImageChops.subtract(cleanup, split)
    background = image.copy()
    background.paste(ground, (0, 0), ground_mask)
    background.paste(slab, (0, 0), slab_mask)
    return background


def shared_palette_export(path: Path):
    """Re-encode with one palette so the fixed plate does not shimmer."""
    source = Image.open(path)
    frames = []
    while True:
        frames.append(source.convert("RGB"))
        try:
            source.seek(source.tell() + 1)
        except EOFError:
            break
    strip = Image.new("RGB", (frames[0].width, frames[0].height * len(frames)))
    for index, frame in enumerate(frames):
        strip.paste(frame, (0, index * frame.height))
    palette = strip.quantize(colors=128, method=Image.Quantize.MEDIANCUT)
    paletted = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
    paletted[0].save(
        path,
        save_all=True,
        append_images=paletted[1:],
        duration=120,
        loop=0,
        disposal=2,
        optimize=False,
    )
    return len(frames)


def main():
    base.fixed_background = broad_fixed_background
    base.main()
    count = shared_palette_export(base.OUTPUT)
    print(f"Re-encoded {base.OUTPUT} with one shared 128-color palette ({count} frames, 120 ms/frame)")


if __name__ == "__main__":
    main()
