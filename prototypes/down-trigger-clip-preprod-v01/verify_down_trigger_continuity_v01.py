from pathlib import Path
import json

from PIL import Image, ImageChops


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
OUT = ROOT / "prototypes" / "down-trigger-clip-preprod-v01"


def read_gif(path):
    image = Image.open(path)
    frames, durations = [], []
    for i in range(image.n_frames):
        image.seek(i)
        frames.append(image.convert("RGBA"))
        durations.append(image.info.get("duration", 0))
    return frames, durations


def fixed_region_changes(frames, box):
    if not frames:
        return None
    base = frames[0].crop(box)
    return sum(
        1 for frame in frames[1:]
        if ImageChops.difference(base, frame.crop(box)).getbbox()
    )


def inspect_gif(path):
    frames, durations = read_gif(path)
    return {
        "file": str(path.relative_to(ROOT)),
        "frames": len(frames),
        "size": list(frames[0].size) if frames else None,
        "duration_set_ms": sorted(set(durations)),
        "nominal_duration_ms": sum(durations),
    }, frames


def main():
    report = {"project": "Down Trigger", "version": "continuity-report-v01", "checks": [], "gates": {}}

    hand_meta, hand_frames = inspect_gif(OUT / "hand-release-illustrated-registered-v04.gif")
    hand_ok = (
        hand_meta["frames"] == 12 and hand_meta["size"] == [960, 540]
        and hand_meta["duration_set_ms"] == [120]
        and hand_meta["nominal_duration_ms"] == 1440
        and fixed_region_changes(hand_frames, (600, 340, 960, 540)) == 0
        and fixed_region_changes(hand_frames, (470, 345, 590, 405)) == 0
    )
    report["checks"].append({"id": "hand_v04", "asset": hand_meta, "fixed_right_changes": fixed_region_changes(hand_frames, (600, 340, 960, 540)), "fixed_marker_changes": fixed_region_changes(hand_frames, (470, 345, 590, 405)), "status": "PASS" if hand_ok else "FAIL"})

    for version in ("v08", "v09"):
        meta, frames = inspect_gif(OUT / f"down-trigger-clip-animatic-{version}.gif")
        macro = frames[10:22]
        right = fixed_region_changes(macro, (600, 340, 960, 540))
        marker = fixed_region_changes(macro, (470, 345, 590, 405))
        ok = meta["frames"] == 37 and meta["size"] == [960, 540] and meta["nominal_duration_ms"] == 5030 and right == 0 and marker == 0
        report["checks"].append({"id": f"animatic_{version}", "asset": meta, "macro_frames": len(macro), "macro_fixed_right_changes": right, "macro_fixed_marker_changes": marker, "status": "PASS" if ok else "FAIL"})

    character = Image.open(ROOT / "assets/derived-down-trigger/down-trigger-masked-character-illustrated-model-provisional-v01-clean.png").convert("RGBA")
    alpha = character.getchannel("A")
    alpha_ok = alpha.getextrema()[0] == 0 and alpha.getextrema()[1] == 255
    report["checks"].append({"id": "masked_character_alpha", "size": list(character.size), "alpha_extrema": list(alpha.getextrema()), "status": "PASS" if alpha_ok else "FAIL"})

    report["gates"] = {
        "audio_present": False,
        "canonical_separated_assets_present": False,
        "production_status": "WAITING_EXTERNAL_INPUTS"
    }
    report["technical_status"] = "PASS_PROVISOIRE" if all(c["status"] == "PASS" for c in report["checks"]) else "À_CORRIGER"
    path = OUT / "down-trigger-continuity-report-v01.json"
    path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(path)
    print(json.dumps({"technical_status": report["technical_status"], "checks": len(report["checks"]), "audio_present": False}, ensure_ascii=False))


if __name__ == "__main__":
    main()
