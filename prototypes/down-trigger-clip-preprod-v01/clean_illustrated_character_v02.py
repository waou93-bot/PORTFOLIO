from pathlib import Path
from collections import deque
import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
SOURCE = ROOT / "assets" / "derived-down-trigger" / "down-trigger-masked-character-illustrated-provisional-v01.png"
TARGET = ROOT / "assets" / "derived-down-trigger" / "down-trigger-masked-character-illustrated-provisional-v02-clean.png"


def main():
    image = Image.open(SOURCE).convert("RGBA")
    rgb = np.asarray(image, dtype=np.uint8)[..., :3]
    luma = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
    chroma = rgb.max(axis=2).astype(int) - rgb.min(axis=2).astype(int)

    # The illustration is dark/ochre/blue while the paper is bright and low
    # chroma. Keep a broad foreground candidate, then discard tiny islands.
    candidate = (luma < 178) | (chroma > 34)
    h, w = candidate.shape
    visited = np.zeros((h, w), dtype=bool)
    keep = np.zeros((h, w), dtype=bool)
    for y in range(h):
        for x in range(w):
            if not candidate[y, x] or visited[y, x]:
                continue
            q = deque([(x, y)])
            visited[y, x] = True
            points = []
            while q:
                px, py = q.popleft()
                points.append((px, py))
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1),
                               (px - 1, py - 1), (px + 1, py - 1), (px - 1, py + 1), (px + 1, py + 1)):
                    if 0 <= nx < w and 0 <= ny < h and candidate[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        q.append((nx, ny))
            if len(points) >= 600:
                for px, py in points:
                    keep[py, px] = True

    alpha = Image.fromarray((keep * 255).astype(np.uint8), mode="L")
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.55))
    out = image.copy()
    out.putalpha(alpha)
    out.save(TARGET)
    print(TARGET)


if __name__ == "__main__":
    main()
