from pathlib import Path
import importlib.util


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
SCRIPT = ROOT / "prototypes" / "down-trigger-clip-preprod-v01" / "build_character_core_prototype_v01.py"


def main():
    spec = importlib.util.spec_from_file_location("down_trigger_core_base", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.CHARACTER_PATH = ROOT / "assets" / "derived-down-trigger" / "down-trigger-masked-character-illustrated-model-provisional-v01-clean.png"
    module.VERSION = "v06"
    module.main()


if __name__ == "__main__":
    main()
