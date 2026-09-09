from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
OUT = ROOT / "prototypes" / "down-trigger-clip-preprod-v01"
W, H = 1800, 1500
BG = (9, 10, 15)

ASSETS = [
    ("A — modèle dessiné des six membres", ROOT / "assets/derived-down-trigger/down-trigger-band-illustrated-model-sheet-provisional-v01.png"),
    ("B — poses du personnage masqué", ROOT / "assets/derived-down-trigger/down-trigger-masked-character-pose-sheet-provisional-v01.png"),
    ("C — raccord main/dalle v04", OUT / "hand-release-illustrated-registered-v04-contact-sheet.jpg"),
    ("D — animatic artistique v08", OUT / "down-trigger-clip-animatic-v08-contact-sheet.jpg"),
    ("E — animatic technique rig v09", OUT / "down-trigger-clip-animatic-v09-contact-sheet.jpg"),
]


def fit(image, box):
    image = image.convert("RGB")
    image.thumbnail((box[2], box[3]), Image.Resampling.LANCZOS)
    return image


def main():
    board = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(board)
    try:
        font = ImageFont.truetype("segoeui.ttf", 26)
        small = ImageFont.truetype("segoeui.ttf", 20)
    except OSError:
        font = small = ImageFont.load_default()

    draw.text((42, 24), "DOWN TRIGGER — prototype stop-motion / revue préproduction", fill=(232, 196, 151), font=font)
    draw.text((42, 62), "DA dessinée · raccord contrôlé · assets provisoires · audio absent", fill=(161, 170, 178), font=small)

    boxes = [(40, 110, 840, 360), (920, 110, 840, 520), (40, 510, 840, 360), (920, 670, 840, 360), (40, 910, 840, 360)]
    for (label, path), (x, y, bw, bh) in zip(ASSETS, boxes):
        draw.rounded_rectangle((x, y, x + bw, y + bh), radius=12, outline=(78, 73, 77), width=2, fill=(15, 16, 22))
        image = Image.open(path)
        preview = fit(image, (x + 12, y + 42, bw - 24, bh - 54))
        px = x + (bw - preview.width) // 2
        py = y + 40 + (bh - 40 - preview.height) // 2
        board.paste(preview, (px, py))
        draw.text((x + 18, y + 10), label, fill=(224, 220, 210), font=small)

    draw.text((920, 1340), "Prochaine décision : valider la piste graphique, puis fournir l’audio et les découpes canoniques.", fill=(205, 126, 83), font=small)
    board.save(OUT / "down-trigger-prototype-review-board-v01.jpg", quality=94)
    print(OUT / "down-trigger-prototype-review-board-v01.jpg")


if __name__ == "__main__":
    main()
