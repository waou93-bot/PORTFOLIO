from pathlib import Path
from PIL import Image
import numpy as np

ROOT = Path("assets/derived-portraits/hero-sequence")


def close_small_gaps(values: np.ndarray, gap: int = 16) -> np.ndarray:
    result = values.copy()
    false_indices = np.flatnonzero(~result)
    if not false_indices.size:
        return result
    start = None
    for idx in range(len(result)):
        if not result[idx] and start is None:
            start = idx
        if result[idx] and start is not None:
            if idx - start <= gap:
                result[start:idx] = True
            start = None
    return result


def geometry(path: Path) -> tuple[int, int, int]:
    image = Image.open(path).convert("YCbCr")
    data = np.asarray(image)
    y, cb, cr = data[..., 0], data[..., 1], data[..., 2]
    skin = (y > 55) & (cb >= 76) & (cb <= 132) & (cr >= 132) & (cr <= 188)
    height, width = skin.shape
    center = width // 2

    central_density = skin[:, center - 70:center + 70].mean(axis=1)
    valid = central_density > 0.22
    top = 0
    for row in range(0, min(420, height - 24)):
        if valid[row:row + 24].mean() > 0.72:
            top = row
            break

    sample_rows = range(min(top + 70, height - 1), min(top + 155, height - 1), 8)
    spans = []
    for row in sample_rows:
        line = close_small_gaps(skin[row], 24)
        left = center
        while left > 0 and line[left - 1]:
            left -= 1
        right = center
        while right < width - 1 and line[right + 1]:
            right += 1
        if right - left > 120:
            spans.append((left, right))
    if not spans:
        return top, center, 0
    left = int(np.median([span[0] for span in spans]))
    right = int(np.median([span[1] for span in spans]))
    return top, (left + right) // 2, right - left + 1


for file in sorted(ROOT.glob("nicolas-jez-hero-sequence-*.png")):
    top, center, width = geometry(file)
    print(f"{file.name}\ttop={top}\tcenter={center}\twidth={width}")
