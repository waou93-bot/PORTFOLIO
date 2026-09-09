from pathlib import Path
import random

from PIL import Image, ImageDraw


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
OUT = ROOT / "prototypes" / "down-trigger-clip-preprod-v01"
CORE = OUT / "down-trigger-character-core-prototype-v05.gif"
HAND = OUT / "hand-release-illustrated-registered-v04.gif"
LOGO = ROOT / "assets" / "derived-down-trigger" / "down-trigger-logo-rendered-provisional-v01.png"
VERSION = "v07"
W, H = 960, 540


def read_frames(path):
    image = Image.open(path)
    frames, durations = [], []
    for i in range(image.n_frames):
        image.seek(i)
        frames.append(image.convert("RGBA"))
        durations.append(image.info.get("duration", 100))
    return frames, durations


def opener(index, logo):
    rng = random.Random(8000 + index)
    image = Image.new("RGBA", (W, H), (8, 9, 14, 255))
    d = ImageDraw.Draw(image)
    for _ in range(70):
        x, y = rng.randrange(W), rng.randrange(H)
        d.point((x, y), fill=(166, 140, 112, rng.randrange(80, 180)))
    mark = logo.copy()
    mark.thumbnail((260, 100), Image.Resampling.LANCZOS)
    mark.putalpha(mark.getchannel("A").point(lambda a: min(a, 220)))
    image.alpha_composite(mark, (350, 220))
    return image.convert("P", palette=Image.Palette.ADAPTIVE, colors=128)


def close_transition(frame, index):
    image = frame.copy().convert("RGBA")
    overlay = Image.new("RGBA", (W, H), (184, 83, 57, 0))
    overlay.putalpha(int(45 + index * 35))
    return Image.alpha_composite(image, overlay).convert("P", palette=Image.Palette.ADAPTIVE, colors=128)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    core_frames, _ = read_frames(CORE)
    hand_frames, _ = read_frames(HAND)
    logo = Image.open(LOGO).convert("RGBA")

    frames = [opener(0, logo)]
    durations = [500]
    frames.extend(core_frames[:8])
    durations.extend([110] * 8)
    frames.append(close_transition(core_frames[7], 0))
    durations.append(90)
    frames.extend(hand_frames)
    durations.extend([120] * len(hand_frames))
    frames.append(close_transition(core_frames[11], 1))
    durations.append(90)
    frames.extend(core_frames[11:])
    durations.extend([110] * len(core_frames[11:]))
    frames.append(opener(1, logo))
    durations.append(600)

    gif = OUT / f"down-trigger-clip-animatic-{VERSION}.gif"
    frames[0].save(gif, save_all=True, append_images=frames[1:], duration=durations, loop=0, optimize=False)

    cols, rows = 6, 7
    thumb_w, thumb_h = 160, 90
    sheet = Image.new("RGB", (cols * thumb_w, rows * thumb_h), (9, 9, 13))
    for i, frame in enumerate(frames):
        thumb = frame.convert("RGB").resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.paste(thumb, ((i % cols) * thumb_w, (i // cols) * thumb_h))
    sheet.save(OUT / f"down-trigger-clip-animatic-{VERSION}-contact-sheet.jpg", quality=92)
    print(gif)
    print({'frames': len(frames), 'nominal_ms': sum(durations)})


if __name__ == "__main__":
    main()
