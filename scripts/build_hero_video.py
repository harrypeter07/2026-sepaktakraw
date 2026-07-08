#!/usr/bin/env python3
"""
Build the autoplay hero video for the home page.

The home hero (`components/hero-scroll-sequence.tsx`) autoplays this video
(muted, playsInline) on load — the ball rolls and reveals "SEPAKTAKRAW", then
holds on the final frame. The source is upscaled (lanczos) and lightly sharpened
since the original is only 720p, the AI "Veo" watermark is cropped off, and it's
encoded web-optimized (faststart) for fast autoplay on desktop and mobile.

Usage:
  python scripts/build_hero_video.py --input "/path/to/video.mp4"

Outputs (into public/hero/):
  hero.mp4         upscaled H.264 (yuv420p, faststart)
  poster.jpg       first frame  (instant paint before the video buffers)
  poster-end.jpg   last frame   (static hero for reduced motion)

Requires ffmpeg on PATH.
"""
import argparse
import os
import subprocess
import sys

OUT_DIR = os.path.join("public", "hero")


def run(cmd):
    proc = subprocess.run(cmd)
    if proc.returncode != 0:
        sys.exit(f"Command failed: {' '.join(cmd)}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--height", type=int, default=1080, help="target height (width auto)")
    p.add_argument("--crop-bottom", type=int, default=40, help="px cropped to remove watermark")
    p.add_argument("--crf", type=int, default=21, help="quality 0(best)-51(worst)")
    args = p.parse_args()

    if not os.path.isfile(args.input):
        sys.exit(f"Input not found: {args.input}")
    os.makedirs(OUT_DIR, exist_ok=True)

    mp4 = os.path.join(OUT_DIR, "hero.mp4")
    vf = (
        f"crop=in_w:in_h-{args.crop_bottom}:0:0,"
        f"scale=-2:{args.height}:flags=lanczos,"
        f"unsharp=5:5:0.8:3:3:0.4"
    )
    print("Encoding hero video…")
    run([
        "ffmpeg", "-y", "-i", args.input,
        "-vf", vf,
        "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
        "-preset", "slow", "-crf", str(args.crf),
        "-an", "-movflags", "+faststart",
        mp4,
    ])

    print("Extracting posters…")
    run(["ffmpeg", "-y", "-i", mp4, "-vf", "select=eq(n\\,0)",
         "-frames:v", "1", "-q:v", "3", os.path.join(OUT_DIR, "poster.jpg")])
    run(["ffmpeg", "-y", "-sseof", "-0.1", "-i", mp4,
         "-frames:v", "1", "-q:v", "3", os.path.join(OUT_DIR, "poster-end.jpg")])

    size = os.path.getsize(mp4) / 1_048_576
    print(f"Done. {mp4} ({size:.1f} MB) + poster.jpg + poster-end.jpg")


if __name__ == "__main__":
    main()
