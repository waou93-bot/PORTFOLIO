from pathlib import Path
import random

from PIL import Image, ImageDraw


ROOT = Path(__file__).parent
SOURCE = ROOT / "test-07-11-contact-sheet-v03.png"
OUTPUT = ROOT / "down-trigger-clip-test-v03.gif"
FRAME_SIZE = (720, 405)
FPS = 8
EXPOSURES_PER_KEYFRAME = 4


def crop_panels(image: Image.Image):
    width, height = image.size
    if (width, height) != (1672, 941):
        raise ValueError(f"Unexpected storyboard size: {(width, height)}")
    # v03 is a 2x4 board. The white horizontal gutters are 234..239,
    # 467..472 and 700..704; the vertical gutter is 834..837.
    boxes = [
        (4, 3, 834, 234), (838, 3, 1668, 234),
        (4, 240, 834, 467), (838, 240, 1668, 467),
        (4, 473, 834, 700), (838, 473, 1668, 700),
        (4, 705, 834, 937), (838, 705, 1668, 937),
    ]
    return [image.crop(box).convert("RGB") for box in boxes]


def letterbox(panel: Image.Image) -> Image.Image:
    scale = min(FRAME_SIZE[0] / panel.width, FRAME_SIZE[1] / panel.height)
    size = (round(panel.width * scale), round(panel.height * scale))
    resized = panel.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", FRAME_SIZE, (7, 8, 10))
    canvas.paste(resized, ((FRAME_SIZE[0] - resized.width) // 2, (FRAME_SIZE[1] - resized.height) // 2))
    return canvas


def exposure(keyframe: Image.Image, rng: random.Random, index: int) -> Image.Image:
    frame = keyframe.rotate(rng.uniform(-0.3, 0.3), resample=Image.Resampling.BICUBIC, fillcolor=(7, 8, 10))
    shifted = Image.new("RGB", frame.size, (7, 8, 10))
    shifted.paste(frame, (rng.choice([-2, -1, 0, 0, 1, 2]), rng.choice([-1, 0, 0, 0, 1])))
    draw = ImageDraw.Draw(shifted, "RGBA")
    for _ in range(2 if index % 3 == 0 else 1):
        x = rng.randrange(20, FRAME_SIZE[0] - 20)
        y = rng.randrange(20, FRAME_SIZE[1] - 20)
        radius = rng.choice([1, 1, 2])
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(210, 185, 154, 35))
    return shifted


def main():
    storyboard = Image.open(SOURCE)
    panels = [letterbox(panel) for panel in crop_panels(storyboard)]
    rng = random.Random(20260908)
    frames = [exposure(panel, rng, index) for panel in panels for index in range(EXPOSURES_PER_KEYFRAME)]
    paletted = [frame.quantize(colors=128, method=Image.Quantize.MEDIANCUT) for frame in frames]
    paletted[0].save(
        OUTPUT, save_all=True, append_images=paletted[1:], duration=round(1000 / FPS),
        loop=0, disposal=2, optimize=True,
    )
    print(f"Wrote {OUTPUT} ({len(frames)} exposures, 8 keyframes, 4.00s nominal, {FRAME_SIZE[0]}x{FRAME_SIZE[1]})")


if __name__ == "__main__":
    main()
