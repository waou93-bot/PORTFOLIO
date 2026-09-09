from pathlib import Path
import random

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).parent
SOURCE = ROOT / "test-07-11-contact-sheet-v01.png"
OUTPUT = ROOT / "down-trigger-clip-test-v01.gif"
FRAME_SIZE = (720, 405)
FPS = 8
EXPOSURES_PER_KEYFRAME = 4


def crop_panels(image: Image.Image):
    # The generated board has a 4 px outer frame, a 5 px vertical gutter and
    # horizontal gutters at y=362..365 and y=667..670. Use those real seams;
    # equal thirds leak the previous row into the next keyframe.
    width, height = image.size
    boxes = [
        (4, 4, 765, 362),
        (770, 4, width - 4, 362),
        (4, 366, 765, 667),
        (770, 366, width - 4, 667),
        (4, 671, 765, height - 4),
        (770, 671, width - 4, height - 4),
    ]
    return [image.crop(box).convert("RGB") for box in boxes]


def remove_panel_number(panel: Image.Image) -> Image.Image:
    """Hide the storyboard index while preserving its dark lower-left texture."""
    panel = panel.copy()
    width, height = panel.size
    # The index is in the lower-left corner. Blur only that local patch so the
    # board annotation disappears without introducing a hard rectangular fill.
    patch_h, patch_w = min(58, height), min(110, width)
    patch = panel.crop((0, height - patch_h, patch_w, height)).filter(ImageFilter.GaussianBlur(7))
    panel.paste(patch, (0, height - patch_h))
    return panel


def letterbox(panel: Image.Image) -> Image.Image:
    scale = min(FRAME_SIZE[0] / panel.width, FRAME_SIZE[1] / panel.height)
    size = (round(panel.width * scale), round(panel.height * scale))
    resized = panel.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", FRAME_SIZE, (7, 8, 10))
    canvas.paste(resized, ((FRAME_SIZE[0] - resized.width) // 2, (FRAME_SIZE[1] - resized.height) // 2))
    return canvas


def exposure(keyframe: Image.Image, rng: random.Random, index: int) -> Image.Image:
    jitter_x = rng.choice([-2, -1, 0, 0, 1, 2])
    jitter_y = rng.choice([-1, 0, 0, 0, 1])
    angle = rng.uniform(-0.35, 0.35)
    frame = keyframe.rotate(angle, resample=Image.Resampling.BICUBIC, fillcolor=(7, 8, 10))
    frame = ImageChopsOffset(frame, jitter_x, jitter_y)
    # Very sparse dust gives the test a tactile capture signature without
    # inventing new story content or competing with the character.
    draw = ImageDraw.Draw(frame, "RGBA")
    for _ in range(2 if index % 3 == 0 else 1):
        x = rng.randrange(24, FRAME_SIZE[0] - 24)
        y = rng.randrange(20, FRAME_SIZE[1] - 20)
        radius = rng.choice([1, 1, 2])
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(210, 185, 154, 35))
    return frame


def ImageChopsOffset(image: Image.Image, x: int, y: int) -> Image.Image:
    canvas = Image.new("RGB", image.size, (7, 8, 10))
    canvas.paste(image, (x, y))
    return canvas


def main():
    storyboard = Image.open(SOURCE)
    panels = [letterbox(remove_panel_number(panel)) for panel in crop_panels(storyboard)]
    rng = random.Random(20260908)
    frames = []
    for keyframe in panels:
        for index in range(EXPOSURES_PER_KEYFRAME):
            frames.append(exposure(keyframe, rng, index))

    paletted = [frame.quantize(colors=128, method=Image.Quantize.MEDIANCUT) for frame in frames]
    paletted[0].save(
        OUTPUT,
        save_all=True,
        append_images=paletted[1:],
        duration=round(1000 / FPS),
        loop=0,
        disposal=2,
        optimize=True,
    )
    print(f"Wrote {OUTPUT} ({len(frames)} exposures, {len(panels)} keyframes, {len(frames) / FPS:.2f}s, {FRAME_SIZE[0]}x{FRAME_SIZE[1]})")


if __name__ == "__main__":
    main()
