"""Offline 60 fps delivery from the preserved montage master; no paid service."""
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / 'site/public/media/identity'
MASTER = ROOT / '.local-backups/single-video-20261010/hero-mirror-loop-quality-master.mp4'
DESKTOP = MEDIA / 'hero-mirror-smooth-v2.mp4'
MOBILE = MEDIA / 'hero-mirror-smooth-mobile-v2.mp4'

def run(*args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'warning', '-nostdin', *args], check=True)

if __name__ == '__main__':
    # Motion-compensated intermediate frames, rather than duplicated frames.
    run('-i', str(MASTER), '-vf',
        'scale=1280:720,minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1',
        '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '21',
        '-maxrate', '4M', '-bufsize', '8M', '-threads', '4',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y', str(DESKTOP))
    run('-i', str(DESKTOP), '-vf', 'scale=960:540', '-an', '-c:v', 'libx264',
        '-preset', 'fast', '-crf', '23', '-maxrate', '2M', '-bufsize', '4M',
        '-threads', '4', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y', str(MOBILE))
