from pathlib import Path
from collections import deque
from PIL import Image


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
SOURCE = ROOT / "assets" / "derived-down-trigger" / "down-trigger-masked-character-cutout-provisional-v01.png"
TARGET = ROOT / "assets" / "derived-down-trigger" / "down-trigger-masked-character-cutout-provisional-v01-clean.png"


def background_like(rgb):
    r, g, b = rgb
    return max(rgb) - min(rgb) <= 9 and min(rgb) >= 175


def main():
    im = Image.open(SOURCE).convert("RGBA")
    w, h = im.size
    px = im.load()
    seen = bytearray(w * h)
    queue = deque()
    for x in range(w):
        queue.extend(((x, 0), (x, h - 1)))
    for y in range(h):
        queue.extend(((0, y), (w - 1, y)))
    while queue:
        x, y = queue.popleft()
        idx = y * w + x
        if seen[idx]:
            continue
        seen[idx] = 1
        if not background_like(px[x, y][:3]):
            continue
        r, g, b, _ = px[x, y]
        # The generator baked a checkerboard preview into RGB. Those pixels
        # must be fully transparent; retaining them would contaminate every
        # composite frame with a visible grid.
        px[x, y] = (r, g, b, 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                queue.append((nx, ny))
    im.save(TARGET)
    print(TARGET)


if __name__ == "__main__":
    main()
