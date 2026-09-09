from pathlib import Path
import random

from PIL import Image, ImageChops, ImageDraw, ImageOps


ROOT = Path(__file__).parent
SOURCE = ROOT / "hand-release-test-v03.png"
OUTPUT = ROOT / "hand-release-registered-v01.gif"
FRAME_SIZE = (720, 405)
FPS = 8


def crop_rows(image: Image.Image):
    if image.size != (1668, 943):
        raise ValueError(f"Unexpected source size: {image.size}")
    return [
        image.crop((3, 3, 1665, 309)).convert("RGB"),
        image.crop((3, 316, 1665, 623)).convert("RGB"),
        image.crop((3, 630, 1665, 940)).convert("RGB"),
    ]


def polygon_mask(size, points):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).polygon(points, fill=255)
    return mask


def tiled_texture(source: Image.Image, box, size):
    tile = source.crop(box)
    fill = Image.new("RGB", size)
    for y in range(0, size[1], tile.height):
        for x in range(0, size[0], tile.width):
            fill.paste(tile, (x, y))
    return fill


def fixed_background(base: Image.Image, hand_mask: Image.Image):
    width, height = base.size
    ground = tiled_texture(base, (0, 0, 260, 145), base.size)
    slab = tiled_texture(base, (720, 145, 920, height), base.size)
    split = Image.new("L", base.size, 0)
    ImageDraw.Draw(split).rectangle((0, 0, width, 145), fill=255)
    ground_mask = ImageChops.multiply(hand_mask, split)
    slab_mask = ImageChops.subtract(hand_mask, split)
    background = base.copy()
    background.paste(ground, (0, 0), ground_mask)
    background.paste(slab, (0, 0), slab_mask)
    return background


def shifted_layer(image: Image.Image, mask: Image.Image, dx: int, dy: int):
    layer = Image.new("RGB", image.size)
    shifted_mask = Image.new("L", image.size)
    layer.paste(image, (dx, dy))
    shifted_mask.paste(mask, (dx, dy))
    return layer, shifted_mask


def letterbox(panel: Image.Image):
    scale = min(FRAME_SIZE[0] / panel.width, FRAME_SIZE[1] / panel.height)
    size = (round(panel.width * scale), round(panel.height * scale))
    resized = panel.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", FRAME_SIZE, (7, 8, 10))
    canvas.paste(resized, ((FRAME_SIZE[0] - resized.width) // 2, (FRAME_SIZE[1] - resized.height) // 2))
    return canvas


def main():
    rows = crop_rows(Image.open(SOURCE))
    width, height = rows[0].size
    # One continuous arm/hand silhouette for every state; the background plate
    # is held from state 1 so the slab and core marker cannot drift.
    points = [(245, height), (250, 260), (290, 230), (330, 190), (350, 145),
              (390, 95), (450, 65), (520, 65), (585, 85), (640, 130),
              (680, 185), (690, 235), (660, 275), (620, height)]
    hand_mask = polygon_mask((width, height), points)
    background = fixed_background(rows[0], hand_mask)
    hand_layers = [(row, hand_mask) for row in rows]
    stages = [
        (0, 0, 0),  # hooked grip
        (0, 0, 1),  # hooked grip hold
        (1, 0, 0),  # fingers open, last contact
        (1, 0, -2), # last contact becomes visible
        (2, 0, -6), # narrow separation
        (2, 1, -10),# hand lifts, slab stays registered
    ]
    frames = []
    for row_index, dx, dy in stages:
        layer, mask = shifted_layer(hand_layers[row_index][0], hand_layers[row_index][1], dx, dy)
        composite = background.copy()
        composite.paste(layer, (0, 0), mask)
        frames.append(letterbox(composite))
    # Two exposures per pose preserve a deliberate stop-motion cadence.
    frames = [frame for frame in frames for _ in range(2)]
    rng = random.Random(20260908)
    exposed = []
    for frame in frames:
        angle = rng.uniform(-0.08, 0.08)
        exposed.append(frame.rotate(angle, resample=Image.Resampling.BICUBIC, fillcolor=(7, 8, 10)))
    paletted = [frame.quantize(colors=128, method=Image.Quantize.MEDIANCUT) for frame in exposed]
    paletted[0].save(
        OUTPUT, save_all=True, append_images=paletted[1:], duration=round(1000 / FPS),
        loop=0, disposal=2, optimize=True,
    )
    print(f"Wrote {OUTPUT} ({len(exposed)} exposures, 6 registered poses, {len(exposed) / FPS:.2f}s nominal, {FRAME_SIZE[0]}x{FRAME_SIZE[1]})")


if __name__ == "__main__":
    main()
