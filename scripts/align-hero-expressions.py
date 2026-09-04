from pathlib import Path
import json
import sys

ROOT = Path("assets/derived-portraits/hero-sequence/expressive-v1")
OUTPUT = Path("assets/derived-portraits/hero-sequence/expressive-aligned-v4")
REFERENCE = ROOT / "frame-01-neutral.png"
sys.path.insert(0, str(Path(".tools/mediapipe010").resolve()))

import cv2  # noqa: E402
import mediapipe as mp  # noqa: E402
import numpy as np  # noqa: E402

# Skull-stable anchors. The jaw is deliberately excluded because it moves with expression.
# Two eye corners define a similarity transform: translation, uniform scale and rotation only.
# Unlike the rejected v1 affine transform, this cannot shear or stretch the portrait.
ANCHORS = (33, 263)  # outer eye corners


def landmarks(mesh, image):
    height, width = image.shape[:2]
    found = mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    if not found.multi_face_landmarks:
        raise RuntimeError("Aucun visage détecté")
    points = found.multi_face_landmarks[0].landmark
    return np.float32([[points[index].x * width, points[index].y * height] for index in ANCHORS])


files = sorted(ROOT.glob("frame-*.png"))
if len(files) != 30:
    raise RuntimeError(f"30 images attendues, {len(files)} trouvées")

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

    for file in files:
        image = cv2.imread(str(file))
        source = landmarks(mesh, image)
        source_mid = source.mean(axis=0)
        target_mid = target.mean(axis=0)
        source_width = float(np.linalg.norm(source[1] - source[0]))
        target_width = float(np.linalg.norm(target[1] - target[0]))
        scale = float(np.clip(target_width / source_width, 0.94, 1.06))
        source_angle = float(np.arctan2(*(source[1] - source[0])[::-1]))
        target_angle = float(np.arctan2(*(target[1] - target[0])[::-1]))
        angle = float(np.clip(target_angle - source_angle, np.deg2rad(-4), np.deg2rad(4)))
        cosine = float(np.cos(angle) * scale)
        sine = float(np.sin(angle) * scale)
        rotation = np.float32([[cosine, -sine], [sine, cosine]])
        translation = target_mid - rotation @ source_mid
        matrix = np.float32(
            [
                [rotation[0, 0], rotation[0, 1], translation[0]],
                [rotation[1, 0], rotation[1, 1], translation[1]],
            ]
        )
        aligned = cv2.warpAffine(
            image,
            matrix,
            canvas_size,
            flags=cv2.INTER_LANCZOS4,
            borderMode=cv2.BORDER_REFLECT_101,
        )
        output = OUTPUT / f"{file.stem}-aligned-v4.png"
        cv2.imwrite(str(output), aligned, [cv2.IMWRITE_PNG_COMPRESSION, 5])
        mapped = cv2.transform(source.reshape(1, -1, 2), matrix).reshape(-1, 2)
        error = np.abs(mapped - target)
        report.append(
            {
                "source": file.name,
                "output": output.name,
                "anchors": list(ANCHORS),
                "target": target.round(3).tolist(),
                "mapped": mapped.round(3).tolist(),
                "max_anchor_error_px": float(error.max()),
                "scale": scale,
                "rotation_degrees": float(np.rad2deg(angle)),
                "translation": translation.round(4).tolist(),
                "matrix": matrix.round(8).tolist(),
            }
        )
        print(f"{file.name}\tmax anchor error={error.max():.6f}px")

(OUTPUT / "alignment-report-v4.json").write_text(
    json.dumps(report, indent=2), encoding="utf-8"
)
print(f"Reference anchors: {target.tolist()}")
print(OUTPUT)
