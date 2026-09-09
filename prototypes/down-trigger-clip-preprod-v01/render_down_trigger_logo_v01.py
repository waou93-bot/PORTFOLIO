from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
TARGET = ROOT / "assets" / "derived-down-trigger" / "down-trigger-logo-rendered-provisional-v01.png"


def main():
    image = Image.new("RGBA", (900, 330), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)
    regular = ImageFont.truetype(r"C:\Windows\Fonts\georgia.ttf", 118)
    italic = ImageFont.truetype(r"C:\Windows\Fonts\georgiai.ttf", 118)
    mono = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 16)
    d.text((28, 12), "Down", font=regular, fill=(232, 228, 218, 255))
    d.text((28, 124), "Trigger", font=italic, fill=(179, 56, 42, 255))
    d.text((34, 276), "METAL INDUSTRIEL — UNIVERS NARRATIF", font=mono, fill=(138, 133, 120, 225), spacing=2)
    d.rectangle((32, 252, 258, 256), fill=(179, 56, 42, 240))
    image.save(TARGET)
    print(TARGET)


if __name__ == "__main__":
    main()
