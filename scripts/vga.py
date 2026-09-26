"""
vga.py: rechnet gemalte Bilder (z. B. aus Canva) in VGA-Pixelgrafik um.

Beispiele:
  python scripts/vga.py hintergrund.png assets/bg/schule_nacht.png
  python scripts/vga.py hintergrund.png out.png --size 320x200 --colors 64
  python scripts/vga.py hintergrund.png out.png --palette assets/palette.png   (gemeinsame Palette)
  python scripts/vga.py graf.png assets/sprites/graf.png --sprite --height 90 --palette assets/palette.png
  python scripts/vga.py a.png b.png c.png --make-palette assets/palette.png --colors 128
  python scripts/vga.py graf_gruen.png assets/sprites/graf.png --sprite --key-green   (Figur vor Gruen freistellen)

Benoetigt: pip install pillow
"""
import argparse
from PIL import Image, ImageEnhance


def prep(im, contrast, color):
    rgb = im.convert("RGB")
    rgb = ImageEnhance.Contrast(rgb).enhance(contrast)
    rgb = ImageEnhance.Color(rgb).enhance(color)
    return rgb


def fit_cover(im, w, h):
    """Skaliert und schneidet mittig zu, damit das Bild genau w x h fuellt."""
    sw, sh = im.size
    scale = max(w / sw, h / sh)
    nw, nh = round(sw * scale), round(sh * scale)
    im = im.resize((nw, nh), Image.LANCZOS)
    left, top = (nw - w) // 2, (nh - h) // 2
    return im.crop((left, top, left + w, top + h))


def key_green(im):
    """Stellt eine Figur vor einfarbigem Gruen frei und nimmt den gruenen Saum an den Kanten weg."""
    rgba = im.convert("RGBA")
    px = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = px[x, y]
            spill = g - max(r, b)
            if spill > 60 and g > 120:
                px[x, y] = (0, 0, 0, 0)
            elif spill > 0:
                px[x, y] = (r, max(r, b), b, a)
    return rgba


def load_palette(path):
    pal_img = Image.open(path).convert("RGB")
    px = [pal_img.getpixel((x, y)) for y in range(pal_img.height) for x in range(pal_img.width)]
    colors = list(dict.fromkeys(px))[:256]
    p = Image.new("P", (1, 1))
    flat = [c for rgb in colors for c in rgb]
    flat += [0] * (768 - len(flat))
    p.putpalette(flat)
    return p


def quantize(rgb, colors, palette, dither):
    d = Image.Dither.FLOYDSTEINBERG if dither else Image.Dither.NONE
    if palette is not None:
        return rgb.quantize(palette=palette, dither=d).convert("RGB")
    return rgb.quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=d).convert("RGB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inputs", nargs="+", help="Eingabebild(er); beim normalen Aufruf: Eingabe Ausgabe")
    ap.add_argument("--size", default="320x200", help="Zielgroesse fuer Hintergruende, z. B. 320x200 oder 320x180")
    ap.add_argument("--colors", type=int, default=64, help="Farbanzahl ohne gemeinsame Palette")
    ap.add_argument("--palette", help="PNG mit gemeinsamer Palette (siehe --make-palette)")
    ap.add_argument("--make-palette", help="Erzeugt aus allen Eingaben eine gemeinsame Palette und speichert sie hier")
    ap.add_argument("--sprite", action="store_true", help="Figur mit Transparenz statt Hintergrund")
    ap.add_argument("--key-green", action="store_true", help="Figur vor Gruen (Chroma Key) freistellen (bei --sprite)")
    ap.add_argument("--height", type=int, default=90, help="Zielhoehe einer Figur in Pixeln (bei --sprite)")
    ap.add_argument("--contrast", type=float, default=1.15)
    ap.add_argument("--color", type=float, default=1.2)
    ap.add_argument("--no-dither", action="store_true")
    ap.add_argument("--preview", type=int, default=4, help="Zusaetzliche vergroesserte Vorschau (Faktor, 0 = aus)")
    a = ap.parse_args()
    w, h = map(int, a.size.lower().split("x"))

    if a.make_palette:
        tiles = [fit_cover(prep(Image.open(p), a.contrast, a.color), w, h) for p in a.inputs]
        sheet = Image.new("RGB", (w, h * len(tiles)))
        for i, t in enumerate(tiles):
            sheet.paste(t, (0, i * h))
        q = sheet.quantize(colors=a.colors, method=Image.Quantize.MEDIANCUT)
        pal = q.getpalette()[: a.colors * 3]
        out = Image.new("RGB", (a.colors, 1))
        out.putdata([tuple(pal[i:i + 3]) for i in range(0, len(pal), 3)])
        out.save(a.make_palette)
        print(f"Palette mit {a.colors} Farben gespeichert: {a.make_palette}")
        return

    if len(a.inputs) != 2:
        ap.error("Bitte genau Eingabe und Ausgabe angeben.")
    src, dst = a.inputs
    palette = load_palette(a.palette) if a.palette else None
    im = Image.open(src)

    if a.sprite:
        rgba = key_green(im) if a.key_green else im.convert("RGBA")
        bbox = rgba.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox()
        if bbox:
            rgba = rgba.crop(bbox)
        scale = a.height / rgba.height
        rgba = rgba.resize((max(1, round(rgba.width * scale)), a.height), Image.LANCZOS)
        alpha = rgba.getchannel("A").point(lambda v: 255 if v > 128 else 0)
        rgb = quantize(prep(rgba, a.contrast, a.color), a.colors, palette, not a.no_dither)
        out = rgb.convert("RGBA")
        out.putalpha(alpha)
    else:
        rgb = fit_cover(prep(im, a.contrast, a.color), w, h)
        out = quantize(rgb, a.colors, palette, not a.no_dither)

    out.save(dst)
    print(f"Gespeichert: {dst} ({out.width}x{out.height})")
    if a.preview:
        pv = dst.rsplit(".", 1)[0] + f"_x{a.preview}.png"
        out.resize((out.width * a.preview, out.height * a.preview), Image.NEAREST).save(pv)
        print(f"Vorschau: {pv}")


if __name__ == "__main__":
    main()
