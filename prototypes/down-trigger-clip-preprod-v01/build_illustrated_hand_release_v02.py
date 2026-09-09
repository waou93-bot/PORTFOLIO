from pathlib import Path
import math
import random

from PIL import Image, ImageDraw, ImageFilter, ImageOps


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
OUT = ROOT / "prototypes" / "down-trigger-clip-preprod-v01"
W, H = 960, 540
N, MS = 12, 120


def paper_noise(image, seed):
    rng = random.Random(seed)
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(1000):
        x, y = rng.randrange(W), rng.randrange(H)
        a = rng.randrange(8, 22)
        d.point((x, y), fill=(220, 196, 166, a))
    return Image.alpha_composite(image, layer)


def background(seed=2711):
    image = Image.new("RGBA", (W, H), (12, 13, 18, 255))
    d = ImageDraw.Draw(image)
    d.rectangle((0, 0, W, 345), fill=(15, 15, 20, 255))
    # One continuous slab, never moved or redrawn between exposures.
    d.polygon([(0, 365), (170, 351), (350, 361), (530, 348), (730, 362), (960, 350), (960, H), (0, H)], fill=(49, 47, 51, 255))
    edge = [(0, 365), (170, 351), (350, 361), (530, 348), (730, 362), (960, 350)]
    d.line(edge, fill=(184, 83, 57, 235), width=3)
    d.line([(0, 390), (200, 378), (360, 388), (530, 375), (740, 388), (960, 376)], fill=(9, 9, 12, 255), width=3)
    # The group mark is engraved in the fixed slab.
    cx, cy = 530, 374
    d.ellipse((cx - 45, cy - 10, cx + 45, cy + 10), outline=(211, 91, 60, 225), width=3)
    d.ellipse((cx - 20, cy - 4, cx + 20, cy + 4), fill=(211, 91, 60, 185))
    d.line([(cx - 20, cy), (cx + 20, cy)], fill=(245, 154, 84, 200), width=2)
    return paper_noise(image, seed)


def hatch(draw, box, step=12, color=(195, 73, 55, 150)):
    x0, y0, x1, y1 = box
    for x in range(x0 - 30, x1 + 30, step):
        draw.line([(x, y1), (x + 55, y0)], fill=color, width=2)


def draw_graphic_hand(image, index):
    d = ImageDraw.Draw(image)
    # Contact is held for six exposures, then reduced to one fingertip,
    # followed by a true gap and a lifted open hand.
    if index <= 5:
        palm_y = 258
        tips = [365, 369, 371, 368, 361]
    elif index == 6:
        palm_y = 252
        tips = [358, 352, 347, 343, 339]
    elif index == 7:
        palm_y = 237
        tips = [337, 334, 330, 327, 324]
    else:
        lift = index - 7
        palm_y = 237 - 16 * lift
        tips = [337 - 16 * lift, 334 - 16 * lift, 330 - 16 * lift, 327 - 16 * lift, 324 - 16 * lift]

    # Continuous illustrated sleeve, with the same charcoal/blue/rust grammar
    # as the full character styleframe.
    sleeve = [(180, -18), (347, -18), (382, 100), (364, 180), (328, palm_y + 12), (213, palm_y - 18), (205, 120)]
    d.polygon(sleeve, fill=(30, 33, 41, 255), outline=(7, 8, 12, 255), width=5)
    d.line([(205, 28), (340, 28), (362, 115), (332, palm_y)], fill=(100, 111, 122, 205), width=4)
    hatch(d, (205, 42, 360, palm_y - 15), 17, (179, 63, 50, 120))
    d.rounded_rectangle((286, palm_y - 18, 357, palm_y + 12), radius=9, fill=(19, 21, 28, 255), outline=(121, 131, 138, 210), width=3)
    d.line([(300, palm_y - 10), (344, palm_y + 3)], fill=(197, 76, 54, 170), width=2)

    # Palm and five readable fingers, drawn as articulated paper pieces.
    palm = [(218, palm_y - 2), (249, palm_y - 42), (316, palm_y - 47), (363, palm_y - 12), (351, palm_y + 36), (230, palm_y + 38)]
    d.polygon(palm, fill=(25, 27, 34, 255), outline=(5, 6, 9, 255), width=5)
    d.line([(232, palm_y + 15), (345, palm_y + 19)], fill=(128, 133, 138, 200), width=3)
    hatch(d, (232, palm_y - 31, 350, palm_y + 28), 16, (182, 69, 54, 120))
    x_positions = [225, 249, 273, 297, 321]
    widths = [23, 23, 24, 23, 22]
    for j, (x, width) in enumerate(zip(x_positions, widths)):
        top = palm_y + 12 + (j % 2) * 4
        bottom = tips[j]
        if bottom < top:
            bottom = top + 5
        finger = [(x, top), (x + width, top + 2), (x + width + 4, bottom - 7), (x + width - 3, bottom), (x + 4, bottom - 2), (x - 3, bottom - 8)]
        d.polygon(finger, fill=(21, 23, 30, 255), outline=(5, 6, 9, 255), width=3)
        d.line([(x + 3, top + 12), (x + width - 2, top + 14)], fill=(126, 130, 136, 210), width=2)
        d.line([(x + 5, top + 25), (x + width - 1, top + 27)], fill=(176, 67, 53, 160), width=2)

    # A thumb folds around the near edge during contact, then relaxes.
    thumb_y = min(368, palm_y + 82) if index <= 6 else palm_y + 75
    thumb = [(330, palm_y + 5), (373, palm_y + 15), (390, thumb_y - 12), (375, thumb_y + 2), (343, palm_y + 40)]
    d.polygon(thumb, fill=(22, 24, 31, 255), outline=(5, 6, 9, 255), width=4)
    d.line([(350, palm_y + 25), (380, thumb_y - 6)], fill=(125, 130, 135, 190), width=2)


def make_frame(index):
    image = background(2711 + index)
    draw_graphic_hand(image, index)
    return image.convert("P", palette=Image.Palette.ADAPTIVE, colors=128)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    frames = [make_frame(i) for i in range(N)]
    gif = OUT / "hand-release-illustrated-registered-v03.gif"
    frames[0].save(gif, save_all=True, append_images=frames[1:], duration=MS, loop=0, optimize=False)
    sheet = Image.new("RGB", (960, 4 * 180), (9, 9, 13))
    for i, f in enumerate(frames):
        thumb = f.convert("RGB")
        thumb.thumbnail((320, 180), Image.Resampling.LANCZOS)
        sheet.paste(thumb, ((i % 3) * 320, (i // 3) * 180))
    sheet.save(OUT / "hand-release-illustrated-registered-v03-contact-sheet.jpg", quality=92)
    print(gif)


if __name__ == "__main__":
    main()
