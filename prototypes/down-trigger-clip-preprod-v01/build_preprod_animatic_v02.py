from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).parent
SOURCE = ROOT / "storyboard-revised-v01.png"
OUTPUT = ROOT / "down-trigger-preprod-animatic-v02.gif"
FRAME_SIZE = (960, 540)


def panel_crops(image: Image.Image):
    """Read the 2x3 storyboard without stretching its wide vignette ratio."""
    width, height = image.size
    cell_w = width // 2
    cell_h = height // 3
    gutter = 3
    boxes = [
        (0, 0, cell_w - gutter, cell_h - gutter),
        (cell_w + gutter, 0, width, cell_h - gutter),
        (0, cell_h + gutter, cell_w - gutter, cell_h * 2 - gutter),
        (cell_w + gutter, cell_h + gutter, width, cell_h * 2 - gutter),
        (0, cell_h * 2 + gutter, cell_w - gutter, height),
        (cell_w + gutter, cell_h * 2 + gutter, width, height),
    ]
    return [image.crop(box) for box in boxes]


def letterbox(panel: Image.Image) -> Image.Image:
    """Fit a panel into 16:9 while preserving the source composition."""
    panel = panel.convert("RGB")
    scale = min(FRAME_SIZE[0] / panel.width, FRAME_SIZE[1] / panel.height)
    size = (max(1, round(panel.width * scale)), max(1, round(panel.height * scale)))
    resized = panel.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", FRAME_SIZE, (9, 10, 12))
    x = (FRAME_SIZE[0] - resized.width) // 2
    y = (FRAME_SIZE[1] - resized.height) // 2
    canvas.paste(resized, (x, y))
    return canvas


def main():
    storyboard = Image.open(SOURCE)
    panels = [letterbox(panel) for panel in panel_crops(storyboard)]

    # Each keyframe is held for 300 ms by the GIF timing. The sequence only moves
    # forward: grip -> lift -> false hope -> core reveal -> release -> fall.
    frames = panels
    frames[0].save(
        OUTPUT,
        save_all=True,
        append_images=frames[1:],
        duration=300,
        loop=0,
        disposal=2,
        optimize=False,
    )
    print(f"Wrote {OUTPUT} ({len(frames)} keyframes, 300 ms holds, {FRAME_SIZE[0]}x{FRAME_SIZE[1]})")


if __name__ == "__main__":
    main()
