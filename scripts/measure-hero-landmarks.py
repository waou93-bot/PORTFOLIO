from pathlib import Path
import json
import sys

ROOT = Path("assets/derived-portraits/hero-sequence")
sys.path.insert(0, str(Path(".tools/mediapipe010").resolve()))

import cv2  # noqa: E402
import mediapipe as mp  # noqa: E402


def selected_files():
    selected = {}
    for file in sorted(ROOT.glob("nicolas-jez-hero-sequence-*.png")):
        frame = file.name.split("hero-sequence-")[1][:2]
        current = selected.get(frame)
        if current is None or "-v2.png" in file.name:
            selected[frame] = file
    return [selected[key] for key in sorted(selected)]


results = []
with mp.solutions.face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.25,
) as mesh:
    for file in selected_files():
        image = cv2.imread(str(file))
        height, width = image.shape[:2]
        found = mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        if not found.multi_face_landmarks:
            result = {"file": file.name, "image": [width, height], "landmarks": None}
        else:
            points = found.multi_face_landmarks[0].landmark
            wanted = {
                str(index): [round(points[index].x * width, 3), round(points[index].y * height, 3)]
                for index in (1, 10, 33, 152, 234, 263, 454)
            }
            result = {"file": file.name, "image": [width, height], "landmarks": wanted}
        results.append(result)
        print(f"{file.name}\t{result['landmarks']}")

output = ROOT / "hero-face-landmarks-v1.json"
output.write_text(json.dumps(results, indent=2), encoding="utf-8")
print(output)
