"""
lauf.py: schneidet Laufphasen aus Canva-Bildreihen (Figuren vor Gruen) und baut daraus einen Sprite-Streifen.

Jede Eingabe hat die Form datei.png:1,2 und nennt, welche Figuren (von links gezaehlt) daraus genommen werden.
Alle Phasen werden gleich skaliert, stehen mit den Fuessen auf derselben Linie und sind am Kopf ausgerichtet,
damit die Figur beim Abspielen nicht zittert.

Beispiel:
  python scripts/lauf.py assets/sprites/graf_lauf.png --height 90 --palette assets/palette.png \\
      assets/raw/graf_lauf_a_gruen_600px.png:1,2 assets/raw/graf_lauf_b_gruen_600px.png:2,3

Ausgabe: ein PNG mit allen Phasen nebeneinander, jede Zelle gleich breit, Fusspunkt unten in der Mitte.
"""
import argparse
from PIL import Image
from vga import key_green, prep, quantize, load_palette


def figures(rgba, gap=3):
    """Findet die Figuren als Spaltenbereiche, die durch leere Spalten getrennt sind."""
    a = rgba.getchannel("A").point(lambda v: 255 if v > 128 else 0)
    w, h = a.size
    px = a.load()
    filled = [sum(1 for y in range(h) if px[x, y]) >= 2 for x in range(w)]
    segs, start, empty = [], None, 0
    for x, f in enumerate(filled + [False] * gap):
        if f:
            if start is None:
                start = x
            empty = 0
        elif start is not None:
            empty += 1
            if empty >= gap:
                segs.append((start, x - empty + 1))
                start, empty = None, 0
    return [s for s in segs if s[1] - s[0] > 10]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out")
    ap.add_argument("inputs", nargs="+", help="datei.png:1,2")
    ap.add_argument("--height", type=int, default=90)
    ap.add_argument("--palette")
    ap.add_argument("--colors", type=int, default=64)
    ap.add_argument("--contrast", type=float, default=1.15)
    ap.add_argument("--color", type=float, default=1.2)
    ap.add_argument("--preview", type=int, default=4)
    a = ap.parse_args()

    frames = []
    for spec in a.inputs:
        path, picks = spec.rsplit(":", 1)
        rgba = key_green(Image.open(path))
        segs = figures(rgba)
        for i in [int(p) for p in picks.split(",")]:
            x0, x1 = segs[i - 1]
            fig = rgba.crop((x0, 0, x1, rgba.height))
            fig = fig.crop(fig.getchannel("A").point(lambda v: 255 if v > 128 else 0).getbbox())
            head = fig.crop((0, 0, fig.width, max(1, fig.height * 35 // 100)))
            hb = head.getchannel("A").point(lambda v: 255 if v > 128 else 0).getbbox()
            anchor = (hb[0] + hb[2]) / 2 if hb else fig.width / 2
            frames.append((fig, anchor))

    heights = sorted(f.height for f, _ in frames)
    s = a.height / heights[len(heights) // 2]
    left = max(anchor * s for f, anchor in frames)
    right = max((f.width - anchor) * s for f, anchor in frames)
    cw = int(2 * max(left, right)) + 2
    ch = max(round(f.height * s) for f, _ in frames) + 1
    palette = load_palette(a.palette) if a.palette else None

    sheet = Image.new("RGBA", (cw * len(frames), ch), (0, 0, 0, 0))
    for i, (fig, anchor) in enumerate(frames):
        w, h = max(1, round(fig.width * s)), max(1, round(fig.height * s))
        small = fig.resize((w, h), Image.LANCZOS)
        alpha = small.getchannel("A").point(lambda v: 255 if v > 128 else 0)
        rgb = quantize(prep(small, a.contrast, a.color), a.colors, palette, True).convert("RGBA")
        rgb.putalpha(alpha)
        x = i * cw + round(cw / 2 - anchor * s)
        sheet.alpha_composite(rgb, (x, ch - h))
    sheet.save(a.out)
    print(f"Gespeichert: {a.out} ({len(frames)} Phasen, Zelle {cw}x{ch})")
    if a.preview:
        pv = a.out.rsplit(".", 1)[0] + f"_x{a.preview}.png"
        sheet.resize((sheet.width * a.preview, sheet.height * a.preview), Image.NEAREST).save(pv)


if __name__ == "__main__":
    main()
