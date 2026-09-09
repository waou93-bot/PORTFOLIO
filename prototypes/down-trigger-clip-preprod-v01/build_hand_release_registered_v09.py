from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

import build_hand_release_registered_v08 as plate
import build_hand_release_registered_v03 as base


ROOT = Path(__file__).parent
SOURCE = ROOT / "hand-release-registered-v08.gif"
OUTPUT = ROOT / "hand-release-registered-v09.gif"
FRAME_SIZE = (720, 405)
FRAME_DELAY = 120


def polygon_mask(points):
    mask = Image.new("L", FRAME_SIZE, 0)
    ImageDraw.Draw(mask).polygon(points, fill=255)
    return mask


def shifted(image, mask, dx, dy):
    layer = Image.new("RGB", FRAME_SIZE)
    layer.paste(image, (dx, dy))
    shifted_mask = Image.new("L", FRAME_SIZE)
    shifted_mask.paste(mask, (dx, dy))
    return layer, shifted_mask


def read_frames():
    gif = Image.open(SOURCE)
    frames = []
    while True:
        frames.append(gif.convert("RGB").copy())
        try:
            gif.seek(gif.tell() + 1)
        except EOFError:
            break
    return frames


def shared_palette_export(frames):
    strip = Image.new("RGB", (FRAME_SIZE[0], FRAME_SIZE[1] * len(frames)))
    for index, frame in enumerate(frames):
        strip.paste(frame, (0, index * FRAME_SIZE[1]))
    palette = strip.quantize(colors=128, method=Image.Quantize.MEDIANCUT)
    paletted = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
    paletted[0].save(
        OUTPUT, save_all=True, append_images=paletted[1:], duration=FRAME_DELAY,
        loop=0, disposal=2, optimize=False,
    )


def main():
    source_frames = read_frames()
    rows = base.crop_rows(Image.open(base.SOURCE))
    background = base.letterbox(plate.clean_plate(rows[0], Image.new("L", rows[0].size, 0)))

    # Union silhouette for the two open-hand references. The polygon stays
    # inside the glove/arm contour and excludes the slab as far as possible.
    open_mask = polygon_mask([
        (82, 286), (91, 252), (108, 228), (126, 207), (146, 181),
        (165, 166), (188, 164), (210, 176), (232, 169), (255, 176),
        (278, 190), (299, 207), (321, 222), (323, 239), (304, 249),
        (281, 242), (258, 237), (242, 247), (218, 260), (190, 273),
        (153, 283), (115, 292),
    ])
    raised_mask = polygon_mask([
        (112, 286), (125, 252), (143, 226), (158, 198), (173, 177),
        (191, 165), (209, 170), (222, 183), (239, 176), (255, 181),
        (272, 195), (288, 211), (303, 224), (304, 239), (286, 248),
        (267, 242), (249, 239), (231, 251), (208, 264), (181, 277),
        (148, 290),
    ])
    union = ImageChops.lighter(open_mask, raised_mask)

    # The thumb tip is the last intentional support point. It is held against
    # the plate for two exposures while the rest of the hand rises.
    tip_mask = polygon_mask([
        (258, 211), (276, 210), (296, 218), (313, 229),
        (315, 241), (298, 248), (279, 241), (263, 231),
    ])
    lifted_open_mask = ImageChops.subtract(open_mask, tip_mask)

    def compose(source, mask, dx=0, dy=0, anchored_tip=False, alpha=None):
        if alpha is not None:
            source = Image.blend(source_frames[2], source_frames[8], alpha)
            mask = union
        layer, shifted_mask = shifted(source, mask, dx, dy)
        frame = background.copy()
        frame.paste(layer, (0, 0), shifted_mask)
        if anchored_tip:
            tip_layer, tip = shifted(source_frames[2], tip_mask, 0, 0)
            frame.paste(tip_layer, (0, 0), tip)
        return frame

    frames = [
        compose(source_frames[0], union, dx=0, dy=0),
        compose(source_frames[0], union, dx=1, dy=0),
        compose(source_frames[2], open_mask, dx=0, dy=0),
        compose(source_frames[2], open_mask, dx=1, dy=0),
        compose(source_frames[2], lifted_open_mask, dx=0, dy=-4, anchored_tip=True),
        compose(source_frames[2], lifted_open_mask, dx=1, dy=-7, anchored_tip=True),
        compose(source_frames[2], lifted_open_mask, dx=0, dy=-12),
        compose(source_frames[2], lifted_open_mask, dx=1, dy=-15),
        compose(source_frames[2], union, dx=0, dy=-17, alpha=0.25),
        compose(source_frames[2], union, dx=1, dy=-19, alpha=0.5),
        compose(source_frames[8], raised_mask, dx=0, dy=-21),
        compose(source_frames[8], raised_mask, dx=1, dy=-23),
        compose(source_frames[8], raised_mask, dx=0, dy=-26),
        compose(source_frames[8], raised_mask, dx=1, dy=-29),
    ]
    shared_palette_export(frames)
    print(f"Wrote {OUTPUT} ({len(frames)} exposures, {FRAME_DELAY} ms/frame, {FRAME_SIZE[0]}x{FRAME_SIZE[1]})")


if __name__ == "__main__":
    main()
