from pathlib import Path
import json
import sys

ROOT = Path("assets/derived-portraits/hero-sequence")
sys.path.insert(0, str(Path(".tools/opencv4").resolve()))

import cv2  # noqa: E402


def selected_files():
    selected = {}
    for file in sorted(ROOT.glob("nicolas-jez-hero-sequence-*.png")):
        frame = file.name.split("hero-sequence-")[1][:2]
        current = selected.get(frame)
        if current is None or "-v2.png" in file.name:
            selected[frame] = file
    return [selected[key] for key in sorted(selected)]


cascades = [
    cv2.CascadeClassifier(str(Path(cv2.data.haarcascades) / name))
    for name in (
        "haarcascade_frontalface_alt2.xml",
        "haarcascade_frontalface_default.xml",
        "haarcascade_frontalface_alt.xml",
    )
]
results = []
for file in selected_files():
    image = cv2.imread(str(file))
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)
    faces = []
    for cascade in cascades:
        for neighbors in (3, 2, 1):
            faces = cascade.detectMultiScale(gray, scaleFactor=1.03, minNeighbors=neighbors, minSize=(180, 180))
            if len(faces):
                break
        if len(faces):
            break
    height, width = gray.shape
    center_x, center_y = width / 2, height * 0.42
    candidates = []
    for x, y, w, h in faces:
        distance = abs((x + w / 2) - center_x) + abs((y + h / 2) - center_y)
        candidates.append((distance, int(x), int(y), int(w), int(h)))
    candidates.sort()
    face = candidates[0][1:] if candidates else None
    results.append({"file": file.name, "image": [width, height], "face": face})

output = ROOT / "hero-face-measurements-v1.json"
output.write_text(json.dumps(results, indent=2), encoding="utf-8")
for item in results:
    print(f"{item['file']}\t{item['face']}")
print(output)
