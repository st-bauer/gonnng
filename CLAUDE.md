# Gonnng! Lernadventure zum selbstregulierten Lernen

Point-and-Click-Adventure im Stil der LucasArts-Klassiker (Monkey Island) für die Klassen 5 bis 7.
Die Spielerinnen und Spieler nutzen belegte SRL-Strategien als Werkzeuge, Rätsellösungen und
Konter im Finale („Ausreden-Duell“). Das vollständige Konzept steht in `docs/konzept.md`.

## Arbeitsweise und Stil (bitte immer einhalten)

- Alle Texte auf Deutsch, natürlicher gesprochener Ton.
- Keine Gedankenstriche als Stilmittel, keine Konstruktionen nach dem Muster „nicht X, sondern Y“.
- Immer männliche und weibliche Form ausschreiben („Schülerinnen und Schüler“, „Lehrerin oder Lehrer“), kein Gendersternchen.
- Schlanke Lösungen bevorzugen, in kleinen Schritten arbeiten und Zwischenstände zeigen.
- Fachliche Richtigkeit ist Pflicht: Jede SRL-Strategie braucht einen Beleg (siehe Quellen in `docs/konzept.md`),
  Biologie- und Physikinhalte der Rätsel müssen stimmen. Neue Fakten vor dem Einbau prüfen.
- Humor: skurril, trocken, nie belehrend. Die Figuren brauchen die Strategien, sie erklären sie nicht.

## Technische Entscheidungen

- Zielplattform: Browser, auch iPad. Das Spiel wird eine einzelne HTML-Datei (plus Grafikdateien), ohne Server.
- Bildformat: 320 × 200 Pixel (VGA), per CSS pixelgenau hochskaliert (`image-rendering: pixelated`).
- Bedienung wie im Vorbild: neun Verben (Gib, Nimm, Benutze, Öffne, Schau an, Drücke, Schließe, Rede mit, Ziehe),
  Standardverb „Gehe zu“, Inventar, „Benutze X mit Y“, Sprechtext farbig über der Figur.
- Ton: per Web Audio im Browser erzeugt (Chiptune), startet erst nach einem Tipp.
- Speicherstand: noch offen (localStorage mit try/catch wäre die schlanke Lösung).

## Grafik-Pipeline (Entscheidung: „Weg 2“)

Reine Code-Pixelgrafik (siehe `intro/intro-v1-code-pixel.html`) sah nicht nach LucasArts aus.
Neuer Weg: gemalte Bilder erzeugen und in echte VGA-Optik umrechnen.

1. Hintergründe und Figuren in Canva (oder einem anderen Bildgenerator) erzeugen.
   Prompt-Muster für Hintergründe: „Background art for a 1990s VGA point-and-click adventure game,
   hand-painted pixel art style with rich dithered color gradients … no people, no characters, no text“.
   Figuren einzeln auf schlichtem Hintergrund erzeugen und den Hintergrund entfernen.
2. Originale in voller Auflösung nach `assets/raw/` legen.
3. Einmal eine gemeinsame Palette für alle Szenen bauen, damit alles zusammenpasst:
   `python scripts/vga.py assets/raw/*.png --make-palette assets/palette.png --colors 128`
4. Hintergründe umrechnen: `python scripts/vga.py assets/raw/schule_nacht.png assets/bg/schule_nacht.png --palette assets/palette.png`
5. Figuren umrechnen: `python scripts/vga.py assets/raw/graf.png assets/sprites/graf.png --sprite --height 90 --palette assets/palette.png`

LucasArts-Merkmale, auf die zu achten ist: große Figuren (ein Drittel bis halbe Bildhöhe) mit Gesicht,
filmische Einstellungen (Nahaufnahmen, Untersicht, Silhouetten vor dem Mond), gemalte Hintergründe
mit viel Licht und Schatten, der Graf unter der Kapuze nur mit zwei glühenden Augen.

## Stand (26.09.2026)

- Konzept komplett: Welt, Figuren, Intro-Storyboard, Prolog im Detail, Kapitel 1 bis 4 mit Rätseln,
  Inventarlisten, Kombinationsrätseln, Ausreden-Duell, Fachcheck, geprüfte Quellen (`docs/konzept.md`).
- Titel: „Gonnng!“. Gegenspieler: Graf Nimmerjetzt. Schule: Sankt Irgendwann auf dem Schiefenberg.
- Intro Version 1 als Code-Pixelgrafik (`intro/intro-v1-code-pixel.html`), abgelöst durch
  Intro Version 2 mit den gemalten Bildern (`intro/intro-v2-gemalt.html`, lädt die Bilder aus `assets/`).
  `intro/gonnng-intro-vorschau.html` ist dieselbe Datei mit eingebetteten Bildern zum Weitergeben;
  nach Änderungen neu erzeugen (Bilder als data-URI einsetzen). Zum Testen zeigt `window.__frame(sekunde)` ein Standbild.
- Teststandbild im neuen Stil: `assets/test/vga_test_standbild.png` (aus einer 199-Pixel-Vorschau, daher zu grob).
  Das alte Canva-Original (https://www.canva.com/M/MAHWUmwXVTw) ist verworfen, weil die Schule darin wie eine Kirche aussah.
- Neues Standbild „Schule bei Nacht“ (Variante 1): breites Schulgebäude aus Backstein, kleines eckiges Uhrtürmchen
  auf dem Dach, Schulhof mit Tor und Fußballtor. Gerade Fassung: https://www.canva.com/M/MAHWUzxEJaM,
  leicht schiefe Fassung: https://www.canva.com/M/MAHWUzkGKy8.
  Lokal liegen beide nur als 600 × 338 Pixel große Canva-Vorschau in `assets/raw/` (`schule_nacht_600px.png`,
  `schule_nacht_gerade_600px.png`), weil die Cloud-Umgebung `export-download.canva.com` nicht erreicht.
  Für 320 × 200 reicht das. Die schiefe Fassung ist schon umgerechnet: `assets/bg/schule_nacht.png`
  (mit gemeinsamer Palette). Die Canva-Arbeitsdatei mit allen Bildern: https://canva.link/mp6p64febvogrh4
- Graf Nimmerjetzt als Figur: in Canva vor Grün erzeugt (https://www.canva.com/M/MAHWVEdRLfQ), Rohbild
  `assets/raw/graf_gruen_600px.png`, freigestellt und umgerechnet nach `assets/sprites/graf.png` (52 × 90).
  `scripts/vga.py` kann dafür jetzt mit `--key-green` Figuren vor Grün freistellen.
- Laufphasen (je 4 Bilder, in Canva mit der Figur als Referenzbild als Bildreihe erzeugt):
  `assets/sprites/graf_lauf.png` und `assets/sprites/aufschiebchen_lauf.png`, gebaut mit `scripts/lauf.py`
  (schneidet die Figuren aus, richtet sie an Kopf und Füßen aus). Canva-Bildreihen: https://www.canva.com/M/MAHWVG04uGg
  und https://www.canva.com/M/MAHWVCKMXrs. Tipp: In der Arbeitsdatei zwei Phasen pro Seite zeigen (Bild 1,4-fach), sonst ist die Vorschau zu klein.
- Greifpose des Grafen: `assets/sprites/graf_greifen.png` (69 × 87, gleicher Maßstab wie die stehende Figur,
  Kopfmitte 39 px vom linken Rand), https://www.canva.com/M/MAHWVKVjA2M.
- Intro: Klick, Tippen, Leertaste, Enter oder Pfeil rechts springen zum nächsten Satz, ans Satzende oder zur nächsten Einstellung.
  Der Ton wird dabei ab der neuen Stelle neu geplant.
- Weitere Bilder (alle in der Canva-Arbeitsdatei, Rohbilder in `assets/raw/`):
  Uhrwerk im Glockenturm mit großer Unruh (`assets/bg/uhrwerk.png`, 320 × 200, https://www.canva.com/M/MAHWVGRLFcE),
  Klassenzimmer (im Intro: nächster Morgen) mit Tafel, Wanduhr und Lüftungsgitter rechts (`assets/bg/klassenzimmer.png`,
  320 × 180, damit das Gitter nicht abgeschnitten wird und unten Platz für die Verbleiste bleibt,
  https://www.canva.com/M/MAHWVMHQKLw), Aufschiebchen in Schlafanzug und Zipfelmütze
  (`assets/sprites/aufschiebchen.png`, 40 × 48, https://www.canva.com/M/MAHWVF1FGcM).
- Gemeinsame Palette (128 Farben) aus allen Bildern: `assets/palette.png`. Bei neuen Bildern neu bauen und alles neu umrechnen.
  Bei Figuren vor Grün (Dateiname mit „gruen“) zählen dabei nur die Pixel der Figur.
- Probemontagen: `assets/test/intro_huegel.png`, `assets/test/intro_uhrwerk.png`, `assets/test/prolog_klassenzimmer.png`,
  Übersicht `assets/test/uebersicht_x2.png`. Figuren in Nachtszenen wirken noch zu hell, das Spiel sollte sie dort abdunkeln.
- Fachcheck offen: Große Turmuhren laufen in der Regel mit einem Pendel, die Unruh sitzt eher in Taschen- und Tischuhren.
  Entweder im Spiel begründen (besondere Uhr) oder auf Pendel umstellen.

## Nächste Schritte

1. Optional: „Schule bei Nacht“ in voller Auflösung aus der Canva-Arbeitsdatei exportieren und neu umrechnen.
2. Graf: Stil prüfen (Rüstung wirkt noch etwas türkis), bei Bedarf Laufphasen oder weitere Posen erzeugen.
3. Intro Version 2 abnehmen und verfeinern (z. B. Stein zum Hinsetzen). Die Leiter ist auf Wunsch gestrichen, die Greifpose ist eingebaut.
4. Danach den Prolog als spielbare Szene bauen (Lösungsweg, Hotspots, Dialogbaum und Tipps stehen im Konzept).
5. Offene Punkte aus dem Konzept klären (Namen der Nebenfiguren, Zielstufe, Speicherstand, Begleitmaterial).

## Online-Dokument

Das Konzept liegt zusätzlich als geteiltes Dokument in Claude:
https://claude.ai/code/artifact/effaee6f-8e6d-4f81-9ffd-e6574f3cf09f
`docs/konzept.md` ist ein Export davon. Änderungen am besten nur an einer Stelle pflegen.
