from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).parent
gif = Image.open(ROOT / "hand-release-registered-v08.gif")
frames = []
for index in range(4, 9):
    gif.seek(index)
    frame = gif.convert("RGB").crop((50, 160, 390, 290)).resize((1020, 390), Image.Resampling.NEAREST)
    canvas = Image.new("RGB", (1020, 425), (12, 13, 16))
    canvas.paste(frame, (0, 35))
    ImageDraw.Draw(canvas).text((12, 8), f"exposure {index + 1:02d}", fill=(224, 216, 198))
    frames.append(canvas)
sheet = Image.new("RGB", (1020, len(frames) * 425), (4, 5, 7))
for i, frame in enumerate(frames):
    sheet.paste(frame, (0, i * 425))
sheet.save(ROOT / "hand-release-v08-contact-zoom.png")
