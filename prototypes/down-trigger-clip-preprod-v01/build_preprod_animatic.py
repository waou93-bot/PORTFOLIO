from pathlib import Path

from PIL import Image


ROOT = Path(__file__).parent
source = ROOT / "storyboard-revised-v01.png"
output = ROOT / "down-trigger-preprod-animatic-v01.gif"

image = Image.open(source).convert("RGB")
width, height = image.size
cell_w = width // 2
cell_h = height // 3

boxes = [
    (0, 0, cell_w - 3, cell_h - 3),
    (cell_w + 3, 0, width, cell_h - 3),
    (0, cell_h + 3, cell_w - 3, cell_h * 2 - 3),
    (cell_w + 3, cell_h + 3, width, cell_h * 2 - 3),
    (0, cell_h * 2 + 3, cell_w - 3, height),
    (cell_w + 3, cell_h * 2 + 3, width, height),
]

frames = [image.crop(box).resize((960, 540), Image.Resampling.LANCZOS) for box in boxes]
sequence = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 4, 3, 2, 1]
animation = [frames[index] for index in sequence]
animation[0].save(
    output,
    save_all=True,
    append_images=animation[1:],
    duration=125,
    loop=0,
    optimize=False,
    disposal=2,
)
print(output)
