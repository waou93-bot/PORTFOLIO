from pathlib import Path

from PIL import Image


ROOT = Path(__file__).parent
gif = Image.open(ROOT / "hand-release-registered-v08.gif")
for index in [0, 2, 4, 6, 8, 10]:
    gif.seek(index)
    gif.convert("RGB").save(ROOT / f"hand-release-v08-frame-{index + 1:02d}.png")
