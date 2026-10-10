"""Reproducible offline montage; original footage is never changed."""
from pathlib import Path
import json
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / 'site/public/media/identity'
WORK = ROOT / '.local-backups/single-video-20261010'
WORK.mkdir(parents=True, exist_ok=True)
SOURCES = [
    ('hero-reel-mirror/clip-01.mp4', 2.4, False),
    ('hero-reel-mirror/clip-02.mp4', 4.4, False),
    ('hero-reel-mirror/clip-03.mp4', 4.7, False),
    ('landing-hero-video.mp4', 3.2, True),
    ('91744-636709154_medium.mp4', 2.8, False),
    ('165208-832102298_medium.mp4', 4.3, False),
]
FPS, FADE = 30, 0.48

def run(args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'warning', '-nostdin', *args], check=True)

parts = []
for index, (source, duration, right_half) in enumerate(SOURCES):
    part = WORK / f'mirror-native-{index + 1:02}.mp4'
    if '--finish-only' in sys.argv:
        if not part.is_file():
            raise FileNotFoundError(part)
        parts.append(part)
        continue
    # Cover exactly as the desktop background did, then reflect selected half.
    selected_x = 'iw/2' if right_half else '0'
    graph = (
        f'[0:v]trim=duration={duration},setpts=PTS-STARTPTS,'
        f'scale=1920:1080:force_original_aspect_ratio=increase,'
        f'crop=1920:1080,setsar=1,fps={FPS},format=yuv420p,'
        f'crop=iw/2:ih:{selected_x}:0,split=2[a][b];'
        '[b]hflip[reflected];'
        + ('[reflected][a]' if right_half else '[a][reflected]')
        + 'hstack=inputs=2[out]'
    )
    run(['-i', str(MEDIA / source), '-filter_complex_threads', '2',
         '-filter_complex', graph, '-map', '[out]', '-an', '-c:v', 'libx264',
         '-preset', 'fast', '-crf', '18', '-threads', '4',
         '-movflags', '+faststart', '-y', str(part)])
    parts.append(part)
    print(f'Prepared source {index+1}/6', flush=True)

# Append the opening 0.48 s after the final scene, then start the loop 0.48 s
# into scene 1. The closing blend ends where playback restarts, without a jump.
inputs = []
for part in parts:
    inputs += ['-i', str(part)]
inputs += ['-i', str(parts[0])]
filters = [f'[{i}:v]settb=1/{FPS},setpts=PTS-STARTPTS[v{i}]' for i in range(6)]
filters += [f'[6:v]trim=duration={FADE},settb=1/{FPS},setpts=PTS-STARTPTS[v6]']
elapsed = SOURCES[0][1]
previous = 'v0'
for i in range(1, 7):
    offset = elapsed - FADE
    output = f'blend{i}'
    filters.append(f'[{previous}][v{i}]xfade=transition=fade:duration={FADE}:offset={offset:.6f}[{output}]')
    elapsed += (SOURCES[i][1] if i < 6 else FADE) - FADE
    previous = output
filters.append(f'[{previous}]trim=start={FADE},setpts=PTS-STARTPTS,format=yuv420p[out]')
filter_path = WORK / 'single-hero-filter.txt'
filter_path.write_text(';\n'.join(filters), encoding='utf-8')
target = MEDIA / 'hero-mirror-loop-v1.mp4'
delivery = WORK / 'hero-mirror-loop-delivery.mp4'
run([*inputs, '-filter_complex_threads', '2', '-filter_complex_script', str(filter_path),
     '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '23',
     '-threads', '4', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y', str(delivery)])
delivery.replace(target)
run(['-i', str(target), '-frames:v', '1', '-vf', 'scale=1280:-2',
     '-c:v', 'libwebp', '-quality', '85', '-y', str(MEDIA / 'hero-mirror-loop-v1-poster.webp')])
probe = subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams', '-show_format',
                                '-of', 'json', str(target)], text=True)
(ROOT / 'SEO/AUDITS/single-video-export-2026-10-10.json').write_text(probe, encoding='utf-8')
print(json.dumps({'output':str(target),'bytes':target.stat().st_size,'fps':FPS}), flush=True)
