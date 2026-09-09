from pathlib import Path
import random

from PIL import Image, ImageDraw


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
OUT = ROOT / "prototypes" / "down-trigger-clip-preprod-v01"
W, H = 960, 540
N, MS = 12, 120


def fixed_background():
    image = Image.new("RGBA", (W, H), (11, 12, 17, 255))
    d = ImageDraw.Draw(image)
    d.rectangle((0, 0, W, 346), fill=(15, 15, 20, 255))

    # The slab is one invariant layer shared by every exposure.
    slab = [(0, 365), (170, 351), (350, 361), (530, 348), (730, 362), (960, 350), (960, H), (0, H)]
    d.polygon(slab, fill=(47, 46, 51, 255))
    edge = [(0, 365), (170, 351), (350, 361), (530, 348), (730, 362), (960, 350)]
    d.line(edge, fill=(184, 83, 57, 240), width=3)
    d.line([(0, 391), (200, 378), (360, 388), (530, 375), (740, 388), (960, 376)], fill=(8, 9, 12, 255), width=3)

    # Engraved group mark: fixed position, no duplicate or floating fragment.
    cx, cy = 530, 374
    d.ellipse((cx - 45, cy - 10, cx + 45, cy + 10), outline=(211, 91, 60, 225), width=3)
    d.ellipse((cx - 20, cy - 4, cx + 20, cy + 4), fill=(211, 91, 60, 185))
    d.line([(cx - 20, cy), (cx + 20, cy)], fill=(245, 154, 84, 200), width=2)

    # Sparse paper flecks stay away from the contact edge.
    rng = random.Random(808)
    for _ in range(240):
        x, y = rng.randrange(W), rng.randrange(0, 340)
        c = (150, 144, 135, rng.randrange(15, 42))
        d.point((x, y), fill=c)
    return image


def exposure_grain(image, index):
    # A single far-away fleck keeps GIF holds distinct without moving the slab.
    d = ImageDraw.Draw(image)
    rng = random.Random(4200 + index)
    for _ in range(6):
        d.point((rng.randrange(20, 920), rng.randrange(18, 120)), fill=(219, 178, 133, 24))
    return image


def hatch(d, box, step=15, color=(185, 70, 55, 135)):
    x0, y0, x1, y1 = box
    for x in range(x0 - 35, x1 + 40, step):
        d.line([(x, y1), (x + 48, y0)], fill=color, width=2)


def paper_piece(d, points, fill, outline=(5, 6, 9, 255), width=4):
    d.polygon(points, fill=fill)
    d.line(points + [points[0]], fill=outline, width=width, joint="curve")


def draw_sleeve_and_palm(d, palm_y, lift):
    # A continuous sleeve with cut-paper facets and an asymmetrical cuff.
    sleeve = [(158, -20), (335, -20), (371, 72), (365, 160), (342, palm_y - 8),
              (292, palm_y - 35), (220, palm_y - 22), (187, 120)]
    paper_piece(d, sleeve, (28, 31, 40, 255), width=5)
    d.polygon([(178, 12), (324, 12), (350, 86), (338, palm_y - 30), (218, palm_y - 17)], fill=(51, 59, 70, 165))
    d.line([(181, 18), (320, 18), (347, 88), (329, palm_y - 24)], fill=(142, 152, 158, 175), width=3)
    hatch(d, (194, 36, 354, palm_y - 18), step=17)
    d.polygon([(237, palm_y - 45), (322, palm_y - 38), (357, palm_y - 5), (343, palm_y + 20),
               (235, palm_y + 8), (212, palm_y - 14)], fill=(22, 24, 31, 255), outline=(5, 6, 9, 255))
    d.line([(239, palm_y - 30), (333, palm_y - 18)], fill=(193, 76, 55, 190), width=3)
    d.line([(245, palm_y - 20), (338, palm_y - 8)], fill=(102, 120, 130, 180), width=2)

    # Palm is a single readable mass, with a blue-grey paper facet.
    palm = [(209, palm_y - 3), (236, palm_y - 39), (296, palm_y - 48), (349, palm_y - 18),
            (365, palm_y + 24), (342, palm_y + 49), (270, palm_y + 45), (225, palm_y + 31)]
    paper_piece(d, palm, (25, 28, 36, 255), width=5)
    d.polygon([(242, palm_y - 32), (294, palm_y - 41), (337, palm_y - 16), (321, palm_y + 6),
               (261, palm_y + 3)], fill=(66, 75, 87, 210))
    d.line([(234, palm_y + 20), (346, palm_y + 26)], fill=(135, 142, 145, 170), width=3)
    hatch(d, (231, palm_y - 25, 346, palm_y + 32), step=18, color=(185, 70, 55, 105))


def draw_finger(d, x, top, tip, width, accent, separated=False):
    # Two offset paper pieces make the fingers read as articulated, not bars.
    joint = top + 28
    end = tip
    if separated:
        end -= 6
    proximal = [(x + 2, top), (x + width - 2, top + 2), (x + width + 1, joint + 7),
                (x + width - 4, joint + 17), (x + 3, joint + 15), (x - 2, joint + 7)]
    paper_piece(d, proximal, (30, 33, 42, 255), width=3)
    d.rounded_rectangle((x - 1, joint + 8, x + width + 2, end), radius=8,
                        fill=(20, 23, 31, 255), outline=(5, 6, 9, 255), width=3)
    d.line([(x + 4, joint + 18), (x + width - 4, joint + 20)], fill=(111, 127, 136, 200), width=2)
    d.line([(x + 5, end - 15), (x + width - 5, end - 13)], fill=accent, width=2)


def draw_hand(image, index):
    d = ImageDraw.Draw(image)
    # Contact states 0–5; last fingertip 6; continuous gap 7; lift 8–11.
    if index <= 4:
        palm_y = 255
        tips = [356, 358, 360, 358, 354]
    elif index == 5:
        palm_y = 249
        tips = [350, 350, 349, 347, 341]
    elif index == 6:
        palm_y = 242
        tips = [342, 338, 333, 328, 320]
    else:
        lift = index - 7
        palm_y = 232 - 15 * lift
        tips = [325 - 15 * lift, 321 - 15 * lift, 317 - 15 * lift, 313 - 15 * lift, 308 - 15 * lift]

    draw_sleeve_and_palm(d, palm_y, index - 7)
    xs = [221, 245, 269, 293, 317]
    widths = [23, 23, 24, 23, 22]
    for j, (x, width, tip) in enumerate(zip(xs, widths, tips)):
        top = palm_y + 8 + (j % 2) * 3
        draw_finger(d, x, top, tip, width, (181, 70, 53, 180), separated=index >= 7)

    # Thumb folds around the near edge during contact, then rises with the palm.
    thumb_y = min(365, palm_y + 86) if index <= 6 else palm_y + 70
    thumb = [(325, palm_y + 3), (361, palm_y + 14), (387, thumb_y - 15),
             (379, thumb_y + 3), (345, palm_y + 44)]
    paper_piece(d, thumb, (22, 25, 32, 255), width=4)
    d.line([(347, palm_y + 24), (378, thumb_y - 8)], fill=(125, 138, 143, 190), width=2)


def make_frame(index):
    image = fixed_background()
    draw_hand(image, index)
    return exposure_grain(image, index).convert("P", palette=Image.Palette.ADAPTIVE, colors=128)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    frames = [make_frame(i) for i in range(N)]
    gif = OUT / "hand-release-illustrated-registered-v04.gif"
    frames[0].save(gif, save_all=True, append_images=frames[1:], duration=MS, loop=0, optimize=False)
    sheet = Image.new("RGB", (960, 4 * 180), (9, 9, 13))
    for i, f in enumerate(frames):
        thumb = f.convert("RGB")
        thumb.thumbnail((320, 180), Image.Resampling.LANCZOS)
        sheet.paste(thumb, ((i % 3) * 320, (i // 3) * 180))
    sheet.save(OUT / "hand-release-illustrated-registered-v04-contact-sheet.jpg", quality=92)
    print(gif)


if __name__ == "__main__":
    main()
