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
- Speicherstand: localStorage mit try/catch, nach jeder Aktion (siehe `spiel/gonnng.html`).

## Grafik (Entscheidung vom 27.09.2026: alles im Code gezeichnet)

Raum, Figuren, Schrift und Verbleiste werden im Browser per Code gezeichnet. Maßstab dafür sind
`intro/intro-v3-code.html` und `prolog/prolog-v2-code.html`. Gemalte Bilder aus Canva wirkten im Spiel
aufgesetzt, weil Figuren und Hintergrund nicht dieselbe Pixelgröße und dasselbe Licht hatten.

Regeln für neue Grafik:
- Alles in echten Pixeln bei 320 × 200, nichts skalieren. Figuren in anderer Größe werden mit `PupK` neu gezeichnet.
- Nur Farben aus den festen Rampen (`RAMP`, je dunkel, Schatten, Grundton, Licht), Verläufe gerastert (`dith`, Bayer).
- Licht kommt in jeder Szene aus einer klaren Richtung, Figuren sind auf der Lichtseite heller.
- Figuren entstehen aus Einzelteilen (`Pup.part` mit Kopf, Rumpf, Armen, Beinen) und bekommen eine dunkle Umrisslinie.
  So gibt es Laufen, Sprechen, Blinzeln und Greifen ohne neue Bilder.
- Szenen haben 320 × 144 Pixel, darunter liegt die Verbleiste (Spiel) oder ein schwarzer Balken mit Untertiteln (Zwischensequenz).
- Text in der eigenen Pixelschrift (`G`, mit Umlauten und ß), Sprechtext farbig mit schwarzem Rand über der Figur.

LucasArts-Merkmale, auf die zu achten ist: große Figuren mit Gesicht, filmische Einstellungen, viel Licht und Schatten,
der Graf unter der Kapuze nur mit zwei glühenden Augen.

Archiv: Die frühere Canva-Pipeline (`assets/`, `scripts/vga.py`, `scripts/lauf.py`, `scripts/alles_umrechnen.sh`,
`intro/intro-v2-gemalt.html`, `prolog/prolog-v1.html`) bleibt zum Vergleich liegen, wird aber nicht weiterentwickelt.
Canva-Arbeitsdatei: https://canva.link/mp6p64febvogrh4

## Stand (27.09.2026)

- Konzept komplett: Welt, Figuren, Intro-Storyboard, Prolog im Detail, Kapitel 1 bis 4 mit Rätseln,
  Inventarlisten, Kombinationsrätseln, Ausreden-Duell, Fachcheck, geprüfte Quellen (`docs/konzept.md`).
- Titel: „Gonnng!“. Gegenspieler: Graf Nimmerjetzt. Schule: Sankt Irgendwann auf dem Schiefenberg.
- Intro im Code-Stil: `intro/intro-v3-code.html`. Breitbild mit Untertiteln, Graf als Figur (`makeGraf`),
  Nacht am Schiefenberg mit Stein, Glockenturm mit schwingender Unruh, Nebel, Logo, Klassenzimmer.
  Die Gestalt erklärt den Aufschiebchen ihren Plan, ohne dass verraten wird, wer sie ist.
  Veröffentlicht: https://claude.ai/artifact/BS5pGKmyXccQH7ACNqeexc
- Prolog im Code-Stil: `prolog/prolog-v2-code.html`. Neun Verben, Inventar, alle Hotspots, Zielgespräch mit
  mehreren witzigen Antworten pro Stufe, erweitertes Gespräch mit Krächz, Tippstufen, kompletter Lösungsweg.
  Veröffentlicht: https://claude.ai/artifact/NR1J7CbkmNjAhoJp5bv4YM
- **Das Spiel: `spiel/gonnng.html`** (eine Datei, keine Bilder). Titel mit „Neues Spiel“ und „Weiterspielen“,
  Namenswahl, Wahl Mädchen oder Junge (Mädchen mit Pferdeschwanz), dann Intro und Prolog am Stück.
  Speicherstand im Browser (`localStorage`, Schlüssel `gonnng.spielstand.v1`, mit try/catch), gespeichert nach jeder Aktion.
  Aufbau: gemeinsame Werkzeuge, Figuren und Schrift, dazu die Module `Intro` und `Prolog` mit eigenem Namensraum.
  Die Dateien `intro/intro-v3-code.html` und `prolog/prolog-v2-code.html` bleiben als Einzelansichten, neue Arbeit geht in `spiel/gonnng.html`.
- Zum Testen: `window.__frame(sekunde)` im Intro, `window.__act(verb, id, item)` und `window.__pick(i)` im Prolog.
- Entschieden: Die Unruh bleibt. Die Große Stundenuhr ist eine Sonderanfertigung (Turmuhren haben sonst meist ein Pendel),
  Krächz erklärt das auf Nachfrage. Die Namen Frau Kallweit, Jonas und Lina bleiben.

## Nächste Schritte

1. Kapitel 1 „Die wandernden Flure“: erst einen Raum bauen und zeigen, dann den Rest.

## Online-Dokument

Das Konzept liegt zusätzlich als geteiltes Dokument in Claude:
https://claude.ai/code/artifact/effaee6f-8e6d-4f81-9ffd-e6574f3cf09f
`docs/konzept.md` ist ein Export davon. Änderungen am besten nur an einer Stelle pflegen.
