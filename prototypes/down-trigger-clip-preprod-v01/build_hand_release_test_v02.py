from pathlib import Path
import random

from PIL import Image, ImageDraw


ROOT = Path(__file__).parent
SOURCE = ROOT / "hand-release-test-v02.png"
OUTPUT = ROOT / "hand-release-test-v02.gif"
FRAME_SIZE = (720, 405)
FPS = 8
EXPOSURES_PER_KEYFRAME = 4


def crop_rows(image: Image.Image):
    if image.size != (1670, 942):
        raise ValueError(f"Unexpected hand sheet size: {image.size}")
    # Exact black separators measured on the v02 board.
    boxes = [(3, 3, 1667, 309), (3, 316, 1667, 623), (3, 630, 1667, 939)]
    return [image.crop(box).convert("RGB") for box in boxes]


def letterbox(panel: Image.Image) -> Image.Image:
    scale = min(FRAME_SIZE[0] / panel.width, FRAME_SIZE[1] / panel.height)
    size = (round(panel.width * scale), round(panel.height * scale))
    resized = panel.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", FRAME_SIZE, (7, 8, 10))
    canvas.paste(resized, ((FRAME_SIZE[0] - resized.width) // 2, (FRAME_SIZE[1] - resized.height) // 2))
    return canvas


def exposure(keyframe: Image.Image, rng: random.Random, index: int) -> Image.Image:
    frame = keyframe.rotate(rng.uniform(-0.18, 0.18), resample=Image.Resampling.BICUBIC, fillcolor=(7, 8, 10))
    shifted = Image.new("RGB", frame.size, (7, 8, 10))
    shifted.paste(frame, (rng.choice([-1, 0, 0, 1]), rng.choice([0, 0, 0, 1])))
    draw = ImageDraw.Draw(shifted, "RGBA")
    if index == 0:
        draw.ellipse((625, 50, 627, 52), fill=(210, 185, 154, 24))
    return shifted


def main():
    sheet = Image.open(SOURCE)
    keyframes = [letterbox(row) for row in crop_rows(sheet)]
    rng = random.Random(20260908)
    frames = [exposure(frame, rng, index) for frame in keyframes for index in range(EXPOSURES_PER_KEYFRAME)]
    paletted = [frame.quantize(colors=128, method=Image.Quantize.MEDIANCUT) for frame in frames]
    paletted[0].save(
        OUTPUT, save_all=True, append_images=paletted[1:], duration=round(1000 / FPS),
        loop=0, disposal=2, optimize=True,
    )
    print(f"Wrote {OUTPUT} ({len(frames)} exposures, 3 keyframes, 1.50s nominal, {FRAME_SIZE[0]}x{FRAME_SIZE[1]})")


if __name__ == "__main__":
    main()
