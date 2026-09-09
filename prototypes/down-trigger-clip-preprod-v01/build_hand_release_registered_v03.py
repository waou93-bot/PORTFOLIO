from pathlib import Path

from PIL import Image, ImageChops, ImageDraw


ROOT = Path(__file__).parent
SOURCE = ROOT / "hand-release-test-v03.png"
OUTPUT = ROOT / "hand-release-registered-v03.gif"
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


def union_mask(size, polygons):
    result = Image.new("L", size, 0)
    for points in polygons:
        result = ImageChops.lighter(result, polygon_mask(size, points))
    return result


def tiled_texture(source: Image.Image, box, size):
    tile = source.crop(box)
    fill = Image.new("RGB", size)
    for y in range(0, size[1], tile.height):
        for x in range(0, size[0], tile.width):
            fill.paste(tile, (x, y))
    return fill


def fixed_background(base: Image.Image, removal_mask: Image.Image):
    width, height = base.size
    ground = tiled_texture(base, (0, 0, 260, 145), base.size)
    slab = tiled_texture(base, (720, 145, 920, height), base.size)
    split = Image.new("L", base.size, 0)
    ImageDraw.Draw(split).rectangle((0, 0, width, 145), fill=255)
    ground_mask = ImageChops.multiply(removal_mask, split)
    slab_mask = ImageChops.subtract(removal_mask, split)
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
    size = rows[0].size

    # Tight, pose-specific masks: unlike v01/v02 these never include a
    # rectangular chunk of slab from another source row.
    mask0 = union_mask(size, [[
        (292, 309), (300, 275), (338, 238), (382, 202), (414, 146),
        (445, 98), (475, 70), (515, 64), (552, 76), (590, 97),
        (628, 119), (666, 146), (696, 174), (707, 192), (735, 195),
        (742, 214), (720, 228), (683, 226), (650, 214), (620, 208),
        (604, 231), (570, 248), (525, 260), (480, 271), (438, 285),
        (395, 301), (360, 309),
    ]])
    mask1 = union_mask(size, [
        [(247, 309), (258, 276), (292, 250), (335, 226), (378, 202),
         (414, 170), (446, 135), (475, 112), (510, 116), (545, 138),
         (578, 166), (614, 190), (646, 211), (654, 232), (632, 251),
         (594, 253), (552, 245), (510, 246), (468, 262), (422, 280),
         (378, 300), (340, 309)],
        [(424, 143), (438, 96), (453, 69), (469, 65), (482, 74),
         (482, 98), (470, 126)],
        [(482, 132), (506, 91), (529, 66), (545, 65), (555, 76),
         (548, 98), (521, 130)],
        [(530, 145), (565, 101), (588, 82), (603, 84), (610, 98),
         (597, 119), (570, 149)],
        [(574, 168), (608, 139), (631, 132), (643, 141), (642, 157),
         (621, 177), (598, 190)],
    ])
    mask2 = union_mask(size, [
        [(331, 309), (333, 272), (360, 239), (397, 214), (429, 184),
         (446, 150), (457, 113), (477, 83), (494, 68), (510, 70),
         (519, 84), (512, 105), (499, 125), (523, 111), (545, 94),
         (561, 94), (570, 106), (559, 127), (540, 147), (569, 133),
         (588, 135), (598, 148), (590, 163), (563, 181), (593, 174),
         (608, 181), (613, 195), (600, 209), (571, 220), (603, 226),
         (620, 240), (615, 255), (591, 266), (560, 266), (530, 256),
         (498, 250), (465, 257), (430, 276), (397, 296), (368, 309)],
    ])

    # One narrow thumb tip is retained as the intentional final contact while
    # the rest of the open hand rises. It is then removed to make a real gap.
    last_tip = polygon_mask(size, [
        (586, 196), (610, 186), (633, 188), (650, 201), (651, 218),
        (635, 232), (611, 228), (593, 216),
    ])
    lifted_mask1 = ImageChops.subtract(mask1, last_tip)
    background = fixed_background(rows[0], mask0)

    # Two exposures per pose, with only the hand moving by one pixel inside
    # the fixed plate. This keeps all holds as real GIF frames.
    poses = [
        (0, mask0, 0, 0, False),
        (0, mask0, 1, 0, False),
        (1, mask1, 0, 0, False),
        (1, mask1, 1, 0, False),
        (1, lifted_mask1, 0, -2, True),
        (1, lifted_mask1, 1, -3, True),
        (1, lifted_mask1, 0, -5, False),
        (1, lifted_mask1, 1, -7, False),
        (2, mask2, 0, -9, False),
        (2, mask2, 1, -11, False),
        (2, mask2, 0, -14, False),
        (2, mask2, 1, -17, False),
    ]

    frames = []
    for row_index, mask, dx, dy, retain_tip in poses:
        layer, shifted = shifted_layer(rows[row_index], mask, dx, dy)
        composite = background.copy()
        composite.paste(layer, (0, 0), shifted)
        if retain_tip:
            tip_layer, tip_mask = shifted_layer(rows[1], last_tip, 0, 0)
            composite.paste(tip_layer, (0, 0), tip_mask)
        frames.append(letterbox(composite))

    paletted = [frame.quantize(colors=128, method=Image.Quantize.MEDIANCUT) for frame in frames]
    paletted[0].save(
        OUTPUT,
        save_all=True,
        append_images=paletted[1:],
        duration=round(1000 / FPS),
        loop=0,
        disposal=2,
        optimize=False,
    )
    print(
        f"Wrote {OUTPUT} ({len(frames)} exposures, {len(poses)} registered poses, "
        f"{len(frames) / FPS:.2f}s nominal, {FRAME_SIZE[0]}x{FRAME_SIZE[1]})"
    )


if __name__ == "__main__":
    main()
