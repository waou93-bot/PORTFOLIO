from pathlib import Path
import importlib.util


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
SCRIPT = ROOT / "prototypes" / "down-trigger-clip-preprod-v01" / "build_down_trigger_animatic_v07.py"


def main():
    spec = importlib.util.spec_from_file_location("down_trigger_animatic_base", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.CORE = module.OUT / "down-trigger-character-core-prototype-v06.gif"
    module.HAND = module.OUT / "hand-release-illustrated-registered-v04.gif"
    module.VERSION = "v08"
    module.main()


if __name__ == "__main__":
    main()
