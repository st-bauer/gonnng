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
- Intro Version 1 als Code-Pixelgrafik fertig (`intro/`), wird im neuen Stil neu gebaut.
- Teststandbild im neuen Stil: `assets/test/vga_test_standbild.png` (aus einer 199-Pixel-Vorschau, daher zu grob).
  Das alte Canva-Original (https://www.canva.com/M/MAHWUmwXVTw) ist verworfen, weil die Schule darin wie eine Kirche aussah.
- Neues Standbild „Schule bei Nacht“ (Variante 1): breites Schulgebäude aus Backstein, kleines eckiges Uhrtürmchen
  auf dem Dach, Schulhof mit Tor und Fußballtor. Gerade Fassung: https://www.canva.com/M/MAHWUzxEJaM,
  leicht schiefe Fassung: https://www.canva.com/M/MAHWUzkGKy8 (als PNG herunterladen, nach `assets/raw/schule_nacht.png`).

## Nächste Schritte

1. Neues Canva-Bild „Schule bei Nacht“ (Variante 1) herunterladen und in voller Auflösung umrechnen.
2. Den Grafen als gemalte Figur erzeugen (Morgenmantel, Kapuze, glühende Augen, Gesicht bleibt verborgen) und davorsetzen.
3. Wenn der Stil passt: übrige Intro-Einstellungen erzeugen (Hügel mit Aufschiebchen, Uhrwerk-Nahaufnahme,
   Nebel, Logo, Klassenzimmer) und das Intro nach dem Storyboard in `docs/konzept.md` neu bauen.
4. Danach den Prolog als spielbare Szene bauen (Lösungsweg, Hotspots, Dialogbaum und Tipps stehen im Konzept).
5. Offene Punkte aus dem Konzept klären (Namen der Nebenfiguren, Zielstufe, Speicherstand, Begleitmaterial).

## Online-Dokument

Das Konzept liegt zusätzlich als geteiltes Dokument in Claude:
https://claude.ai/code/artifact/effaee6f-8e6d-4f81-9ffd-e6574f3cf09f
`docs/konzept.md` ist ein Export davon. Änderungen am besten nur an einer Stelle pflegen.
