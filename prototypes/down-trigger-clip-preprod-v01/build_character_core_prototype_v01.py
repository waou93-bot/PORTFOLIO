from pathlib import Path
import math
import random

from PIL import Image, ImageDraw, ImageFilter, ImageOps


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
OUT = ROOT / "prototypes" / "down-trigger-clip-preprod-v01"
CHARACTER_PATH = ROOT / "assets" / "derived-down-trigger" / "down-trigger-masked-character-illustrated-provisional-v02-clean.png"
LOGO_PATH = ROOT / "assets" / "derived-down-trigger" / "down-trigger-logo-rendered-provisional-v01.png"
VERSION = "v05"

W, H = 960, 540
FRAME_COUNT = 24
FRAME_MS = 100
SEED = 4207


def fit_cover(image, size):
    return ImageOps.fit(image.convert("RGBA"), size, method=Image.Resampling.LANCZOS)


def add_grain(image, seed):
    rng = random.Random(seed)
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    px = overlay.load()
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            v = rng.randint(0, 34)
            a = rng.randint(0, 20)
            px[x, y] = (255 if rng.random() > 0.5 else 0, 255 if rng.random() > 0.5 else 0, 255 if rng.random() > 0.5 else 0, a)
    return Image.alpha_composite(image, overlay)


def draw_space(draw):
    draw.rectangle((0, 0, W, H), fill=(5, 7, 13, 255))
    for i in range(75):
        x = (i * 137 + 41) % W
        y = (i * 71 + 23) % 270
        r = 1 if i % 4 else 2
        draw.ellipse((x-r, y-r, x+r, y+r), fill=(150 + (i % 4) * 20, 145, 130, 120 + i % 80))
    # A faint accretion halo: the visual grammar is hand-made, not photoreal.
    for r in range(180, 15, -8):
        t = (180 - r) / 165
        col = (int(36 + 118 * t), int(18 + 37 * t), int(24 + 65 * t), int(8 + 24 * (1-t)))
        draw.ellipse((640-r, 180-r*0.56, 640+r, 180+r*0.56), outline=col, width=3)
    draw.ellipse((565, 100, 715, 260), fill=(1, 1, 3, 255))
    draw.ellipse((578, 113, 702, 247), outline=(154, 50, 45, 110), width=4)


def planet_plate():
    plate = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(plate)
    # The planet is a tactile slab rising from the lower edge.
    draw.polygon([(0, 330), (135, 300), (300, 317), (480, 286), (650, 320), (810, 292), (960, 315), (960, H), (0, H)], fill=(35, 36, 42, 255))
    draw.line([(0, 331), (135, 301), (300, 318), (480, 287), (650, 321), (810, 293), (960, 316)], fill=(121, 103, 92, 190), width=3)
    # Cracks converge toward the core.
    core = (454, 360)
    cracks = [
        [(0, 402), (120, 390), (205, 408), (core[0], core[1])],
        [(120, 540), (173, 468), (280, 434), core],
        [(775, 540), (706, 467), (590, 428), core],
        [(960, 385), (825, 389), (690, 401), core],
        [(350, 540), (376, 461), (425, 407), core],
    ]
    for points in cracks:
        draw.line(points, fill=(8, 8, 10, 255), width=6)
        draw.line(points, fill=(150, 55, 42, 90), width=2)
    draw.ellipse((core[0]-40, core[1]-14, core[0]+40, core[1]+14), fill=(3, 2, 4, 255), outline=(201, 66, 47, 180), width=3)
    draw.ellipse((core[0]-18, core[1]-6, core[0]+18, core[1]+6), fill=(232, 110, 57, 170))
    return plate


def character_layer(character, frame):
    # Three beats: resistance, rotation into the pull, release into the core.
    phase = frame / (FRAME_COUNT - 1)
    if phase < 0.42:
        p = phase / 0.42
        angle = -2 + 4 * p
        scale = 0.30 - 0.012 * p
        x = 235 + 40 * p
        y = 268 + 8 * p
    elif phase < 0.75:
        p = (phase - 0.42) / 0.33
        angle = 2 + 16 * p
        scale = 0.288 - 0.035 * p
        x = 275 + 155 * p
        y = 280 + 50 * p
    else:
        p = (phase - 0.75) / 0.25
        angle = 18 + 42 * p
        scale = 0.253 - 0.10 * p
        x = 430 + 80 * p
        y = 316 + 52 * p

    source = character.copy()
    bbox = source.getbbox()
    if bbox:
        source = source.crop(bbox)
    new_size = (max(1, int(source.width * scale)), max(1, int(source.height * scale)))
    source = source.resize(new_size, Image.Resampling.LANCZOS)
    source = source.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    layer.alpha_composite(source, (int(x - source.width / 2), int(y - source.height / 2)))
    return layer


def build_frame(character, logo, frame):
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    draw = ImageDraw.Draw(canvas)
    draw_space(draw)
    canvas = Image.alpha_composite(canvas, planet_plate())

    # Pull lines and dust provide the stop-motion graphic punctuation.
    pull = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pd = ImageDraw.Draw(pull)
    pulse = 0.5 + 0.5 * math.sin(frame * 0.9)
    for i in range(9):
        y = 105 + i * 27 + int(pulse * 4)
        pd.line([(760 + i * 11, y), (535, 220 + i * 9)], fill=(213, 71, 53, 40 + i * 4), width=2)
    pull = pull.filter(ImageFilter.GaussianBlur(0.8))
    canvas = Image.alpha_composite(canvas, pull)
    canvas = Image.alpha_composite(canvas, character_layer(character, frame))

    # End card: logo emerges at the core without interrupting the action.
    if frame >= FRAME_COUNT - 5:
        alpha = int(255 * ((frame - (FRAME_COUNT - 5)) / 4))
        mark = logo.copy()
        mark.thumbnail((205, 80), Image.Resampling.LANCZOS)
        mark.putalpha(mark.getchannel("A").point(lambda a: min(a, alpha)))
        canvas.alpha_composite(mark, (40, 40))

    return add_grain(canvas, SEED + frame).convert("P", palette=Image.Palette.ADAPTIVE, colors=128)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    character = Image.open(CHARACTER_PATH).convert("RGBA")
    alpha = character.getchannel("A")
    character = ImageOps.posterize(character.convert("RGB"), 4).filter(ImageFilter.MedianFilter(3)).convert("RGBA")
    character.putalpha(alpha)
    logo = Image.open(LOGO_PATH).convert("RGBA")
    frames = [build_frame(character, logo, i) for i in range(FRAME_COUNT)]
    path = OUT / f"down-trigger-character-core-prototype-{VERSION}.gif"
    frames[0].save(path, save_all=True, append_images=frames[1:], duration=FRAME_MS, loop=0, optimize=False)
    # Contact sheet for direction/continuity review.
    thumbs = []
    for f in frames:
        rgba = f.convert("RGBA")
        rgba.thumbnail((320, 180), Image.Resampling.LANCZOS)
        thumbs.append(rgba)
    sheet = Image.new("RGB", (960, 4 * 180), (12, 12, 16))
    for idx, thumb in enumerate(thumbs):
        sheet.paste(thumb.convert("RGB"), ((idx % 3) * 320, (idx // 3) * 180))
    sheet.save(OUT / f"down-trigger-character-core-prototype-{VERSION}-contact-sheet.jpg", quality=92)
    print(path)


if __name__ == "__main__":
    main()
