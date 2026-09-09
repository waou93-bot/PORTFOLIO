from pathlib import Path
import math
import random

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
SOURCE = ROOT / "assets" / "derived-down-trigger" / "down-trigger-masked-character-illustrated-model-provisional-v01-clean.png"
OUT = ROOT / "prototypes" / "down-trigger-clip-preprod-v01"
W, H = 960, 540
SOURCE_SIZE = (1024, 1536)
N, MS = 12, 120
VERSION = "v01"

PARTS = {
    "head_hood": [(250, 20), (770, 20), (790, 390), (690, 480), (335, 480), (235, 370)],
    "torso_vest": [(205, 270), (815, 270), (850, 800), (730, 900), (290, 900), (170, 780)],
    "arm_left": [(135, 300), (470, 300), (545, 580), (430, 700), (170, 680), (100, 500)],
    "arm_right": [(490, 300), (855, 300), (900, 500), (790, 700), (535, 700), (430, 580)],
    "hands": [(330, 340), (690, 340), (730, 590), (610, 650), (350, 650), (275, 540)],
    "pelvis": [(260, 730), (770, 730), (820, 990), (690, 1070), (330, 1070), (220, 960)],
    "leg_left": [(160, 900), (510, 900), (530, 1380), (420, 1430), (165, 1390), (105, 1110)],
    "leg_right": [(480, 900), (850, 900), (910, 1110), (850, 1390), (600, 1430), (470, 1380)],
    "boot_left": [(120, 1280), (470, 1280), (500, 1510), (90, 1510)],
    "boot_right": [(550, 1280), (900, 1280), (950, 1510), (520, 1510)],
}

ORDER = ["leg_left", "leg_right", "boot_left", "boot_right", "pelvis", "torso_vest",
         "head_hood", "arm_left", "arm_right", "hands"]


def mask_for(points):
    mask = Image.new("L", SOURCE_SIZE, 0)
    ImageDraw.Draw(mask).polygon(points, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(0.8))


def make_parts(source):
    source_alpha = source.getchannel("A")
    return {name: Image.composite(source, Image.new("RGBA", SOURCE_SIZE),
                                  ImageChops_multiply(source_alpha, mask_for(points)))
            for name, points in PARTS.items()}


def ImageChops_multiply(a, b):
    # Kept local so the script remains a single portable render entry point.
    from PIL import ImageChops
    return ImageChops.multiply(a, b)


def scene_background(index):
    image = Image.new("RGBA", (W, H), (5, 7, 13, 255))
    d = ImageDraw.Draw(image)
    for i in range(80):
        x = (i * 137 + 41) % W
        y = (i * 71 + 23) % 270
        r = 1 if i % 4 else 2
        d.ellipse((x - r, y - r, x + r, y + r), fill=(160, 150, 136, 120 + i % 80))
    for r in range(178, 16, -8):
        t = (178 - r) / 162
        d.ellipse((640 - r, 180 - r * 0.56, 640 + r, 180 + r * 0.56),
                  outline=(int(36 + 118 * t), int(18 + 37 * t), int(24 + 65 * t), int(8 + 24 * (1 - t))), width=3)
    d.ellipse((565, 100, 715, 260), fill=(1, 1, 3, 255))
    d.ellipse((578, 113, 702, 247), outline=(154, 50, 45, 120), width=4)
    plate = [(0, 330), (135, 300), (300, 317), (480, 286), (650, 320), (810, 292), (960, 315), (960, H), (0, H)]
    d.polygon(plate, fill=(35, 36, 42, 255))
    d.line(plate[:7], fill=(121, 103, 92, 190), width=3)
    core = (454, 360)
    for points in [[(0, 402), (120, 390), (205, 408), core], [(120, 540), (173, 468), (280, 434), core],
                   [(775, 540), (706, 467), (590, 428), core], [(960, 385), (825, 389), (690, 401), core]]:
        d.line(points, fill=(8, 8, 10, 255), width=6)
        d.line(points, fill=(150, 55, 42, 90), width=2)
    d.ellipse((414, 346, 494, 374), fill=(3, 2, 4, 255), outline=(201, 66, 47, 180), width=3)
    d.ellipse((436, 354, 472, 366), fill=(232, 110, 57, 170))
    return image


def assembled_puppet(parts, frame):
    rig = Image.new("RGBA", SOURCE_SIZE, (0, 0, 0, 0))
    phase = frame / (N - 1)
    # Local layer motion: a small shoulder twist precedes the global fall.
    twist = max(0.0, (phase - 0.25) / 0.75) * 12
    for name in ORDER:
        layer = parts[name]
        if name == "arm_left":
            layer = layer.rotate(-twist, center=(330, 500), resample=Image.Resampling.BICUBIC)
        elif name == "arm_right":
            layer = layer.rotate(twist * 0.8, center=(690, 500), resample=Image.Resampling.BICUBIC)
        elif name == "head_hood":
            layer = layer.rotate(twist * 0.22, center=(512, 260), resample=Image.Resampling.BICUBIC)
        rig = Image.alpha_composite(rig, layer)

    bbox = rig.getchannel("A").getbbox()
    rig = rig.crop(bbox) if bbox else rig
    global_angle = -3 + 46 * max(0.0, (phase - 0.36) / 0.64)
    rig = rig.rotate(global_angle, expand=True, resample=Image.Resampling.BICUBIC)
    scale = 0.245 - 0.075 * max(0.0, (phase - 0.68) / 0.32)
    rig = rig.resize((max(1, int(rig.width * scale)), max(1, int(rig.height * scale))), Image.Resampling.LANCZOS)
    x = int(230 + 190 * phase)
    y = int(160 + 135 * phase)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    layer.alpha_composite(rig, (x, y))
    return layer


def make_frame(parts, index):
    image = scene_background(index)
    image = Image.alpha_composite(image, assembled_puppet(parts, index))
    grain = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grain)
    rng = random.Random(9700 + index)
    for _ in range(300):
        px, py = rng.randrange(W), rng.randrange(H)
        gd.point((px, py), fill=(220, 190, 160, rng.randrange(8, 28)))
    image = Image.alpha_composite(image, grain)
    return image.convert("P", palette=Image.Palette.ADAPTIVE, colors=128)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGBA")
    parts = make_parts(source)
    frames = [make_frame(parts, i) for i in range(N)]
    gif = OUT / f"down-trigger-puppet-rig-test-{VERSION}.gif"
    frames[0].save(gif, save_all=True, append_images=frames[1:], duration=MS, loop=0, optimize=False)
    sheet = Image.new("RGB", (960, 4 * 180), (10, 10, 15))
    for i, frame in enumerate(frames):
        thumb = frame.convert("RGB").resize((320, 180), Image.Resampling.LANCZOS)
        sheet.paste(thumb, ((i % 3) * 320, (i // 3) * 180))
    sheet.save(OUT / f"down-trigger-puppet-rig-test-{VERSION}-contact-sheet.jpg", quality=92)
    print(gif)


if __name__ == "__main__":
    main()
