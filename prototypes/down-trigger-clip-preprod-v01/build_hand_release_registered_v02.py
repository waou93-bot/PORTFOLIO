from pathlib import Path

from PIL import Image, ImageChops, ImageDraw


ROOT = Path(__file__).parent
SOURCE = ROOT / "hand-release-test-v03.png"
OUTPUT = ROOT / "hand-release-registered-v02.gif"
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

    # The mask is deliberately wider than the visible arm. This removes the
    # complete first-pose silhouette from the held plate, including the thumb
    # edge that leaked through in registered-v01.
    points = [
        (220, height), (230, 270), (270, 225), (305, 180), (335, 135),
        (380, 82), (445, 48), (525, 45), (600, 68), (680, 115),
        (735, 170), (770, 230), (755, 285), (700, height),
    ]
    hand_mask = polygon_mask((width, height), points)
    background = fixed_background(rows[0], hand_mask)

    # Eight registered poses: grip, hold, deliberate release, a visible
    # last-contact beat, a small gap, then the larger withdrawal.
    stages = [
        (0, 0, 0),
        (0, 0, 0),
        (1, 0, 0),
        (1, 0, 1),
        (1, 0, -1),
        (2, 0, -3),
        (2, 0, -7),
        (2, 1, -12),
    ]

    exposures = []
    for row_index, dx, dy in stages:
        exposures.append((row_index, dx, dy))
        # A one-pixel hand-only adjustment gives the second exposure a real
        # image-to-image change, so GIF export cannot collapse the hold.
        exposures.append((row_index, dx + 1, dy))

    frames = []
    for row_index, dx, dy in exposures:
        layer, mask = shifted_layer(rows[row_index], hand_mask, dx, dy)
        composite = background.copy()
        composite.paste(layer, (0, 0), mask)
        frames.append(letterbox(composite))

    # The fixed slab and copper marker remain on the common background plate;
    # only the hand gets the one-pixel exposure adjustment.
    paletted = [frame.quantize(colors=128, method=Image.Quantize.MEDIANCUT) for frame in frames]
    paletted[0].save(
        OUTPUT,
        save_all=True,
        append_images=paletted[1:],
        duration=round(1000 / FPS),
        loop=0,
        disposal=2,
        # Keep duplicate exposures as real frames; optimize=True collapses
        # identical holds and destroys the intended stop-motion cadence.
        optimize=False,
    )
    print(
        f"Wrote {OUTPUT} ({len(frames)} exposures, {len(stages)} registered poses, "
        f"{len(frames) / FPS:.2f}s nominal, {FRAME_SIZE[0]}x{FRAME_SIZE[1]})"
    )


if __name__ == "__main__":
    main()
