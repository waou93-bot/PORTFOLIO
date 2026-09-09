from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).parent
gif = Image.open(ROOT / "hand-release-registered-v03.gif")
frames = []
index = 0
while True:
    frame = gif.convert("RGB").crop((90, 55, 440, 300)).resize((560, 392), Image.Resampling.NEAREST)
    canvas = Image.new("RGB", (560, 420), (12, 13, 16))
    canvas.paste(frame, (0, 28))
    ImageDraw.Draw(canvas).text((10, 7), f"exposure {index + 1:02d}", fill=(224, 216, 198))
    frames.append(canvas)
    index += 1
    try:
        gif.seek(gif.tell() + 1)
    except EOFError:
        break

columns = 3
rows = (len(frames) + columns - 1) // columns
sheet = Image.new("RGB", (columns * 560, rows * 420), (4, 5, 7))
for i, frame in enumerate(frames):
    sheet.paste(frame, ((i % columns) * 560, (i // columns) * 420))
sheet.save(ROOT / "hand-release-registered-v03-detail-sheet.png")
print(f"Wrote {ROOT / 'hand-release-registered-v03-detail-sheet.png'} ({len(frames)} frames)")
