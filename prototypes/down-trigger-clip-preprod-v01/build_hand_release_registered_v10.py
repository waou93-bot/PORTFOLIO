from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

import build_hand_release_registered_v08 as plate
import build_hand_release_registered_v03 as base


ROOT = Path(__file__).parent
OUTPUT = ROOT / "hand-release-registered-v10.gif"
FRAME_SIZE = (720, 405)
DELAY = 120


def mask(size, points):
    result = Image.new("L", size, 0)
    ImageDraw.Draw(result).polygon(points, fill=255)
    return result


def union(size, polygons):
    result = Image.new("L", size, 0)
    for points in polygons:
        result = ImageChops.lighter(result, mask(size, points))
    return result


def shifted(image, source_mask, dx, dy):
    layer = Image.new("RGB", image.size)
    layer.paste(image, (dx, dy))
    shifted_mask = Image.new("L", image.size)
    shifted_mask.paste(source_mask, (dx, dy))
    return layer, shifted_mask


def letterbox(panel):
    scale = min(FRAME_SIZE[0] / panel.width, FRAME_SIZE[1] / panel.height)
    size = (round(panel.width * scale), round(panel.height * scale))
    resized = panel.resize(size, Image.Resampling.LANCZOS)
    result = Image.new("RGB", FRAME_SIZE, (7, 8, 10))
    result.paste(resized, ((FRAME_SIZE[0] - resized.width) // 2, (FRAME_SIZE[1] - resized.height) // 2))
    return result


def shared_palette_export(frames):
    strip = Image.new("RGB", (FRAME_SIZE[0], FRAME_SIZE[1] * len(frames)))
    for i, frame in enumerate(frames):
        strip.paste(frame, (0, i * FRAME_SIZE[1]))
    palette = strip.quantize(colors=128, method=Image.Quantize.MEDIANCUT)
    paletted = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
    paletted[0].save(
        OUTPUT, save_all=True, append_images=paletted[1:], duration=DELAY,
        loop=0, disposal=2, optimize=False,
    )


def main():
    rows = base.crop_rows(Image.open(base.SOURCE))
    size = rows[0].size

    mask0 = mask(size, [
        (292, 309), (300, 275), (338, 238), (382, 202), (414, 146),
        (445, 98), (475, 70), (515, 64), (552, 76), (590, 97),
        (628, 119), (666, 146), (696, 174), (707, 192), (735, 195),
        (742, 214), (720, 228), (683, 226), (650, 214), (620, 208),
        (604, 231), (570, 248), (525, 260), (480, 271), (438, 285),
        (395, 301), (360, 309),
    ])
    mask1 = union(size, [
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
    mask2 = mask(size, [
        (331, 309), (333, 272), (360, 239), (397, 214), (429, 184),
        (446, 150), (457, 113), (477, 83), (494, 68), (510, 70),
        (519, 84), (512, 105), (499, 125), (523, 111), (545, 94),
        (561, 94), (570, 106), (559, 127), (540, 147), (569, 133),
        (588, 135), (598, 148), (590, 163), (563, 181), (593, 174),
        (608, 181), (613, 195), (600, 209), (571, 220), (603, 226),
        (620, 240), (615, 255), (591, 266), (560, 266), (530, 256),
        (498, 250), (465, 257), (430, 276), (397, 296), (368, 309),
    ])

    # Single anchored fingertip: it remains connected during the two final
    # contact poses and disappears before the first full gap.
    tip = mask(size, [
        (586, 196), (610, 186), (633, 188), (650, 201), (651, 218),
        (635, 232), (611, 228), (593, 216),
    ])
    lifted1 = ImageChops.subtract(mask1, tip)
    background = plate.clean_plate(rows[0], mask0)

    poses = [
        (0, mask0, 0, 0, False),
        (0, mask0, 1, 0, False),
        (1, mask1, 0, 0, False),
        (1, mask1, 1, 0, False),
        (1, lifted1, 0, -2, True),
        (1, lifted1, 1, -4, True),
        (1, lifted1, 0, -7, True),
        (1, lifted1, 1, -10, True),
        (1, lifted1, 0, -14, False),
        (1, lifted1, 1, -17, False),
        (2, mask2, 0, -19, False),
        (2, mask2, 1, -21, False),
        (2, mask2, 0, -23, False),
        (2, mask2, 1, -25, False),
        (2, mask2, 0, -27, False),
        (2, mask2, 1, -29, False),
    ]

    frames = []
    for row_index, source_mask, dx, dy, anchored_tip in poses:
        layer, shifted_mask = shifted(rows[row_index], source_mask, dx, dy)
        composite = background.copy()
        composite.paste(layer, (0, 0), shifted_mask)
        if anchored_tip:
            tip_layer, tip_mask = shifted(rows[1], tip, 0, 0)
            composite.paste(tip_layer, (0, 0), tip_mask)
        frames.append(letterbox(composite))

    shared_palette_export(frames)
    print(f"Wrote {OUTPUT} ({len(frames)} exposures, {DELAY} ms/frame, {FRAME_SIZE[0]}x{FRAME_SIZE[1]})")


if __name__ == "__main__":
    main()
