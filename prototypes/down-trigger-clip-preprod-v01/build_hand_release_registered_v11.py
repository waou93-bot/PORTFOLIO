from pathlib import Path

from PIL import Image

import build_hand_release_registered_v10 as base


ROOT = Path(__file__).parent
base.OUTPUT = ROOT / "hand-release-registered-v11.gif"


def focused_letterbox(panel):
    """Make the macro contact readable without changing the source geometry."""
    # The global scene remains wide; this dedicated raccord focuses on the
    # hand, slab and its engraved mark. The copper target remains a global-shot
    # invariant, not a required element of this close-up proof.
    crop = panel.crop((180, 0, 1000, panel.height))
    scale = min(base.FRAME_SIZE[0] / crop.width, base.FRAME_SIZE[1] / crop.height)
    size = (round(crop.width * scale), round(crop.height * scale))
    resized = crop.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", base.FRAME_SIZE, (7, 8, 10))
    canvas.paste(resized, ((base.FRAME_SIZE[0] - resized.width) // 2, (base.FRAME_SIZE[1] - resized.height) // 2))
    return canvas


def main():
    base.letterbox = focused_letterbox
    base.main()


if __name__ == "__main__":
    main()
