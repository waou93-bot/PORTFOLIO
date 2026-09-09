from pathlib import Path

from PIL import Image


ROOT = Path(__file__).parent
source = Image.open(ROOT / "hand-release-test-v03.png").convert("RGB")
rows = [
    source.crop((3, 3, 1665, 309)),
    source.crop((3, 316, 1665, 623)),
    source.crop((3, 630, 1665, 940)),
]
for i, (row, box) in enumerate([(rows[0], (300, 145, 500, 306)), (rows[2], (740, 145, 900, 306)), (rows[2], (805, 155, 925, 275))]):
    row.crop(box).resize((800, 644), Image.Resampling.NEAREST).save(ROOT / f"slab-texture-debug-{i}.png")
