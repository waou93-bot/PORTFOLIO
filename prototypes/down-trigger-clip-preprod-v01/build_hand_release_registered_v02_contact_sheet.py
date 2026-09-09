from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).parent
SOURCE = ROOT / "hand-release-registered-v02.gif"
OUTPUT = ROOT / "hand-release-registered-v02-contact-sheet.png"


def main():
    gif = Image.open(SOURCE)
    frames = []
    index = 0
    while True:
        frame = gif.convert("RGB").resize((360, 203), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (360, 231), (12, 13, 16))
        canvas.paste(frame, (0, 24))
        draw = ImageDraw.Draw(canvas)
        draw.text((10, 6), f"exposure {index + 1:02d}", fill=(224, 216, 198))
        frames.append(canvas)
        index += 1
        try:
            gif.seek(gif.tell() + 1)
        except EOFError:
            break

    columns = 4
    rows = (len(frames) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * 360, rows * 231), (4, 5, 7))
    for i, frame in enumerate(frames):
        sheet.paste(frame, ((i % columns) * 360, (i // columns) * 231))
    sheet.save(OUTPUT)
    print(f"Wrote {OUTPUT} ({len(frames)} frames, {sheet.size[0]}x{sheet.size[1]})")


if __name__ == "__main__":
    main()
