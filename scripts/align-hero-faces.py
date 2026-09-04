from pathlib import Path
import json
import sys

ROOT = Path("assets/derived-portraits/hero-sequence")
OUTPUT = ROOT / "aligned-v1"
REFERENCE = Path("assets/derived-portraits/hero-expanded/nicolas-jez-centered-frontal-hero-v1.png")
sys.path.insert(0, str(Path(".tools/mediapipe010").resolve()))

import cv2  # noqa: E402
import mediapipe as mp  # noqa: E402
import numpy as np  # noqa: E402

ANCHORS = (33, 263, 152)  # outer eye corners, then chin


def selected_files():
    selected = {}
    for file in sorted(ROOT.glob("nicolas-jez-hero-sequence-*.png")):
        frame = file.name.split("hero-sequence-")[1][:2]
        current = selected.get(frame)
        if current is None or "-v2.png" in file.name:
            selected[frame] = file
    return [selected[key] for key in sorted(selected)]


def landmarks(mesh, image):
    height, width = image.shape[:2]
    found = mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    if not found.multi_face_landmarks:
        raise RuntimeError("Aucun visage détecté")
    points = found.multi_face_landmarks[0].landmark
    return np.float32([[points[index].x * width, points[index].y * height] for index in ANCHORS])


OUTPUT.mkdir(parents=True, exist_ok=True)
report = []
with mp.solutions.face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.25,
) as mesh:
    reference_image = cv2.imread(str(REFERENCE))
    target = landmarks(mesh, reference_image)
    canvas_size = (reference_image.shape[1], reference_image.shape[0])

    for file in selected_files():
        image = cv2.imread(str(file))
        source = landmarks(mesh, image)
        matrix = cv2.getAffineTransform(source, target)
        aligned = cv2.warpAffine(
            image,
            matrix,
            canvas_size,
            flags=cv2.INTER_LANCZOS4,
            borderMode=cv2.BORDER_REFLECT_101,
        )
        output = OUTPUT / f"{file.stem}-aligned-v1.png"
        cv2.imwrite(str(output), aligned, [cv2.IMWRITE_PNG_COMPRESSION, 5])
        mapped = cv2.transform(source.reshape(1, -1, 2), matrix).reshape(-1, 2)
        error = np.abs(mapped - target)
        report.append({
            "source": file.name,
            "output": output.name,
            "anchors": list(ANCHORS),
            "target": target.round(3).tolist(),
            "mapped": mapped.round(3).tolist(),
            "max_anchor_error_px": float(error.max()),
            "matrix": matrix.round(8).tolist(),
        })
        print(f"{file.name}\tmax anchor error={error.max():.6f}px")

(OUTPUT / "alignment-report-v1.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(f"Reference anchors: {target.tolist()}")
print(OUTPUT)
