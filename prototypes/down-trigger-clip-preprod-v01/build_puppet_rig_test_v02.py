from pathlib import Path
import importlib.util


ROOT = Path(r"C:\Users\waou9\Documents\NJ\Portfolio immersif Nicolas Jez - MASTER")
SCRIPT = ROOT / "prototypes" / "down-trigger-clip-preprod-v01" / "build_puppet_rig_test_v01.py"


def main():
    spec = importlib.util.spec_from_file_location("down_trigger_rig_base", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.N = 24
    module.VERSION = "v02"
    module.main()


if __name__ == "__main__":
    main()
