from pathlib import Path
import random

from PIL import Image, ImageDraw


ROOT = Path(__file__).parent
SOURCE = ROOT / "test-07-11-contact-sheet-v02.png"
OUTPUT = ROOT / "down-trigger-clip-test-v02.gif"
FRAME_SIZE = (720, 405)
FPS = 8
EXPOSURES_PER_KEYFRAME = 4


def crop_panels(image: Image.Image):
    width, height = image.size
    # Exact separators measured on v02: vertical 834..838, horizontal
    # 312..315 and 625..628, with a 3 px outer frame.
    if (width, height) == (1672, 941):
        boxes = [
            (4, 3, 834, 312), (839, 3, 1668, 312),
            (4, 316, 834, 625), (839, 316, 1668, 625),
            (4, 629, 834, 937), (839, 629, 1668, 937),
        ]
    else:
        raise ValueError(f"Unexpected storyboard size: {(width, height)}")
    return [image.crop(box).convert("RGB") for box in boxes]


def remove_panel_number(panel: Image.Image) -> Image.Image:
    # v02 was generated without board annotations; do not soften real costume
    # or glove texture in the lower-left corner.
    return panel


def letterbox(panel: Image.Image) -> Image.Image:
    scale = min(FRAME_SIZE[0] / panel.width, FRAME_SIZE[1] / panel.height)
    size = (round(panel.width * scale), round(panel.height * scale))
    resized = panel.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", FRAME_SIZE, (7, 8, 10))
    canvas.paste(resized, ((FRAME_SIZE[0] - resized.width) // 2, (FRAME_SIZE[1] - resized.height) // 2))
    return canvas


def offset(image: Image.Image, x: int, y: int) -> Image.Image:
    canvas = Image.new("RGB", image.size, (7, 8, 10))
    canvas.paste(image, (x, y))
    return canvas


def exposure(keyframe: Image.Image, rng: random.Random, index: int) -> Image.Image:
    angle = rng.uniform(-0.35, 0.35)
    frame = keyframe.rotate(angle, resample=Image.Resampling.BICUBIC, fillcolor=(7, 8, 10))
    frame = offset(frame, rng.choice([-2, -1, 0, 0, 1, 2]), rng.choice([-1, 0, 0, 0, 1]))
    draw = ImageDraw.Draw(frame, "RGBA")
    for _ in range(2 if index % 3 == 0 else 1):
        x = rng.randrange(20, FRAME_SIZE[0] - 20)
        y = rng.randrange(20, FRAME_SIZE[1] - 20)
        radius = rng.choice([1, 1, 2])
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(210, 185, 154, 35))
    return frame


def main():
    storyboard = Image.open(SOURCE)
    panels = [letterbox(remove_panel_number(panel)) for panel in crop_panels(storyboard)]
    rng = random.Random(20260908)
    frames = [exposure(panel, rng, index) for panel in panels for index in range(EXPOSURES_PER_KEYFRAME)]
    paletted = [frame.quantize(colors=128, method=Image.Quantize.MEDIANCUT) for frame in frames]
    paletted[0].save(
        OUTPUT, save_all=True, append_images=paletted[1:], duration=round(1000 / FPS),
        loop=0, disposal=2, optimize=True,
    )
    print(f"Wrote {OUTPUT} ({len(frames)} exposures, 6 keyframes, 3.00s nominal, {FRAME_SIZE[0]}x{FRAME_SIZE[1]})")


if __name__ == "__main__":
    main()
