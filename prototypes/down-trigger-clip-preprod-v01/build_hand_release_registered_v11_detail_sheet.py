from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).parent
gif = Image.open(ROOT / "hand-release-registered-v11.gif")
frames = []
index = 0
while True:
    frame = gif.convert("RGB").resize((480, 270), Image.Resampling.NEAREST)
    canvas = Image.new("RGB", (480, 300), (12, 13, 16))
    canvas.paste(frame, (0, 30))
    ImageDraw.Draw(canvas).text((10, 7), f"exposure {index + 1:02d}", fill=(224, 216, 198))
    frames.append(canvas)
    index += 1
    try:
        gif.seek(gif.tell() + 1)
    except EOFError:
        break

columns = 2
rows = (len(frames) + columns - 1) // columns
sheet = Image.new("RGB", (columns * 480, rows * 300), (4, 5, 7))
for i, frame in enumerate(frames):
    sheet.paste(frame, ((i % columns) * 480, (i // columns) * 300))
sheet.save(ROOT / "hand-release-registered-v11-detail-sheet.png")
print(f"Wrote {ROOT / 'hand-release-registered-v11-detail-sheet.png'} ({len(frames)} frames)")
