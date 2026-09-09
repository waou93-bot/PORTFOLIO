from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).parent
source = Image.open(ROOT / "hand-release-test-v03.png").convert("RGB")
rows = [
    source.crop((3, 3, 1665, 309)),
    source.crop((3, 316, 1665, 623)),
    source.crop((3, 630, 1665, 940)),
]
out = Image.new("RGB", (1668, 1100), (8, 9, 11))
draw = ImageDraw.Draw(out)
for i, row in enumerate(rows):
    row = row.resize((1668, 309))
    out.paste(row, (0, i * 365 + 40))
    draw.text((12, i * 365 + 12), f"row {i}", fill=(230, 220, 200))
    for x in range(0, 1668, 100):
        draw.line((x, i * 365 + 40, x, i * 365 + 55), fill=(140, 130, 115))
        draw.text((x + 2, i * 365 + 22), str(x), fill=(140, 130, 115))
out.save(ROOT / "hand-release-rows-debug.png")
