from pathlib import Path
import math
import random

from PIL import Image, ImageDraw, ImageFilter, ImageOps


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
OUT = ROOT / "prototypes" / "down-trigger-clip-preprod-v01"
GRIP = ROOT / "assets" / "derived-down-trigger" / "down-trigger-illustrated-hand-grip-provisional-v01-clean.png"
OPEN = ROOT / "assets" / "derived-down-trigger" / "down-trigger-illustrated-hand-open-provisional-v01-clean.png"
W, H = 960, 540
N = 12
MS = 120


def paper_noise(base, seed):
    rng = random.Random(seed)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(900):
        x = rng.randrange(W)
        y = rng.randrange(H)
        a = rng.randrange(8, 28)
        d.point((x, y), fill=(220, 196, 166, a))
    return Image.alpha_composite(base, layer)


def background():
    im = Image.new("RGBA", (W, H), (12, 13, 18, 255))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 385), fill=(15, 15, 20, 255))
    # Fixed slab: its top edge is the continuity invariant.
    d.polygon([(0, 392), (170, 377), (350, 389), (530, 373), (730, 390), (960, 376), (960, H), (0, H)], fill=(48, 46, 50, 255))
    d.line([(0, 392), (170, 377), (350, 389), (530, 373), (730, 390), (960, 376)], fill=(182, 84, 58, 210), width=3)
    d.line([(0, 418), (200, 404), (360, 415), (530, 400), (740, 414), (960, 402)], fill=(10, 10, 13, 255), width=3)
    # The band's sign is a physical trace in the slab, not an overlay.
    cx, cy = 530, 397
    d.ellipse((cx - 46, cy - 11, cx + 46, cy + 11), outline=(210, 91, 60, 220), width=3)
    d.ellipse((cx - 21, cy - 5, cx + 21, cy + 5), fill=(211, 91, 60, 180))
    d.line([(cx - 21, cy), (cx + 21, cy)], fill=(245, 154, 84, 200), width=2)
    return paper_noise(im, 913)


def prepare(image, crop, width):
    image = image.crop(crop)
    alpha = image.getchannel("A")
    image = ImageOps.posterize(image.convert("RGB"), 4).filter(ImageFilter.MedianFilter(3)).convert("RGBA")
    image.putalpha(alpha)
    scale = width / image.width
    return image.resize((width, int(image.height * scale)), Image.Resampling.LANCZOS)


def frame(grip, opened, fixed_slab, index):
    canvas = background()
    canvas.alpha_composite(fixed_slab, (72, -42))
    # Hold the contact for readability, then create an explicit last-contact
    # frame, a visible gap, and a controlled release.
    if index <= 5:
        layer = grip
        x, y = 72 + (index % 2), -42
        layer = layer.resize((grip.width + (index % 2), grip.height + (index % 2)), Image.Resampling.LANCZOS)
    elif index == 6:
        layer = grip
        x, y = 72, -49
    else:
        layer = opened
        lift = (index - 7) * 24
        x, y = 72 + (index % 2), -44 - lift
    canvas.alpha_composite(layer, (x, y))
    # A tiny registration mark makes the invariant edge easy to inspect.
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.line([(70, 367), (185, 357)], fill=(232, 112, 72, 150), width=2)
    od.line([(70, 369), (185, 359)], fill=(20, 17, 20, 180), width=1)
    canvas = Image.alpha_composite(canvas, overlay.filter(ImageFilter.GaussianBlur(0.25)))
    return canvas.convert("P", palette=Image.Palette.ADAPTIVE, colors=128)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    grip = prepare(Image.open(GRIP).convert("RGBA"), (0, 0, 900, 1300), 432)
    opened = prepare(Image.open(OPEN).convert("RGBA"), (72, 0, 1023, 1232), 432)
    fixed_slab = grip.copy()
    slab_mask = Image.new("L", fixed_slab.size, 0)
    md = ImageDraw.Draw(slab_mask)
    md.polygon([(0, 432), (78, 428), (165, 435), (255, 452), (345, 480), (432, 518), (432, fixed_slab.height), (0, fixed_slab.height)], fill=255)
    fixed_slab.putalpha(Image.composite(fixed_slab.getchannel("A"), Image.new("L", fixed_slab.size, 0), slab_mask))
    frames = [frame(grip, opened, fixed_slab, i) for i in range(N)]
    gif = OUT / "hand-release-illustrated-registered-v01.gif"
    frames[0].save(gif, save_all=True, append_images=frames[1:], duration=MS, loop=0, optimize=False)
    sheet = Image.new("RGB", (960, 4 * 180), (9, 9, 13))
    for i, f in enumerate(frames):
        thumb = f.convert("RGB")
        thumb.thumbnail((320, 180), Image.Resampling.LANCZOS)
        sheet.paste(thumb, ((i % 3) * 320, (i // 3) * 180))
    sheet.save(OUT / "hand-release-illustrated-registered-v01-contact-sheet.jpg", quality=92)
    print(gif)


if __name__ == "__main__":
    main()
