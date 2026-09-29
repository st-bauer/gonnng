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
  Mit „Gehe zu“ läuft die Figur nur hin (Ausgänge führen weiter). Anschauen, Nehmen usw. gibt es nur mit dem passenden Verb.
- Ton: per Web Audio im Browser erzeugt (Chiptune), startet erst nach einem Tipp.
- Speicherstand: localStorage mit try/catch, nach jeder Aktion (siehe `spiel/gonnng.html`).

## Grafik (Entscheidung vom 27.09.2026: alles im Code gezeichnet)

Raum, Figuren, Schrift und Verbleiste werden im Browser per Code gezeichnet. Maßstab dafür sind
`intro/intro-v3-code.html` und `prolog/prolog-v2-code.html`. Gemalte Bilder aus Canva wirkten im Spiel
aufgesetzt, weil Figuren und Hintergrund nicht dieselbe Pixelgröße und dasselbe Licht hatten.

Regeln für neue Grafik:
- Alles in echten Pixeln bei 320 × 200, nichts skalieren. Figuren in anderer Größe werden mit `PupK` neu gezeichnet.
- Räume (Entscheidung vom 28.09.2026): lange Farbrampen mit 8 bis 14 Stufen (`KR`, erzeugt mit `mkRamp`), Farbe pro Pixel mit `pick`
  (Bayer-Rasterung nur zwischen zwei benachbarten Stufen). Licht aus klaren Quellen, auch zwei (etwa kühles Fenster und warme Lampe,
  gemischt über den Anteil der Lampe). Schatten werden in die Flächen gerechnet, nicht als Punkte aufgelegt. Perspektive mit Fluchtpunkt,
  Möbel als Körper mit Ober- und Seitenfläche, Materialien mit Struktur (Fugen, Maserung, Glanz). Keine Lichtstrahlen aus hellen Einzelpunkten.
  Maßstab dafür ist die Kantine (`drawKantineBg`). Auf diesem Niveau sind alle Spielräume, das Intro (Nacht, Turmraum)
  und die Zwischensequenzen (Hintergründe werden einmal gebaut und zwischengespeichert: `schachtBg`, `kellerBg`).
- Gegenstände (im Raum und im Inventar) mit `kastenG`, `zylG`, `beutelG`, `keksG`. Zwei Lichtfarben weich mischen mit `mkMix` und `pickMix`.
- Figuren: Teile werden mit den kurzen Rampen (`RAMP`, je dunkel, Schatten, Grundton, Licht) angelegt. `Pup.part` macht daraus
  automatisch eine lange Rampe und schattiert weich nach der Form des Teils, Licht von links oben.
- Licht kommt in jeder Szene aus einer klaren Richtung, Figuren sind auf der Lichtseite heller.
- Figuren entstehen aus Einzelteilen (`Pup.part` mit Kopf, Rumpf, Armen, Beinen) und bekommen eine dunkle Umrisslinie.
  So gibt es Laufen, Sprechen, Blinzeln und Greifen ohne neue Bilder.
- Szenen haben 320 × 144 Pixel, darunter liegt die Verbleiste (Spiel) oder ein schwarzer Balken mit Untertiteln (Zwischensequenz).
- Text in der eigenen Pixelschrift (`G`, mit Umlauten und ß), Sprechtext farbig mit schwarzem Rand über der Figur.
- Schilder mit `plaque`: offizielle Schulschilder als Emailleschild (dunkelblau, weißer Rand, Schrauben), Grummelbarts Schilder im Keller
  und im Flüstergang als handbeschriftetes Brett (`plaque(x,y,text,'holz')`).

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
- Kapitel 1, erster Raum: die Eingangshalle in `spiel/gonnng.html` (Raum `halle` im selben Modul wie das Klassenzimmer).
  Der Prolog endet im Lüftungsschacht und führt direkt in die Halle. Flur-Rätsel (Regel im Konzept): Schilder zeigen
  die Räume, Kompassrose im Boden, der Gong lässt sich zum Ausprobieren anschlagen.
  Die Regel muss man selbst herausfinden, Krächz erklärt sie nur über die Tippstufen auf Nachfrage.
  Beim Losgehen gongt es immer, man muss also dorthin, wo die Kellertreppe nach dem nächsten Gong steht.
  Start in Takt 2 (Kellertreppe im Osten, Lösung Westen).
  Der Grund für den Keller ist eine Spur: der verlorene Zettel des Diebs unter dem Gitter („Heft im Heizungskeller abgeben“).
- Im Prolog bleibt der Dieb des Hefts unbekannt (Licht aus, Trippeln). Erst im Flüstergang zeigt sich das Aufschiebchen.
  Krächz macht das Heft zur Spur zur Unruh (wer das Heft hat, weiß vielleicht, wo die Unruh ist). Die Krümel liegen
  ab dem Licht-aus sichtbar da, fallen der Figur aber erst nach dem Zielgespräch auf.
- Kapitel 1, zweiter Raum: der Flüstergang (Raum `gang`). Der Dieb zeigt sich und verschwindet im Heizungskeller.
  Drei flüsternde Aufschiebchen, wer reinfällt, trottet zurück (`goTo`, `stoer`, erlebte Stolperstellen in `S.erlebt`).
  Grummelbarts Tafel zeigt seine eigenen Wenn-dann-Pläne. Mit Kreide schreibt die Figur dort eigene Pläne (`planSchreiben`,
  Auswahl aus `WENN` und `DANN`, gespeichert in `S.plaene`). Nur konkrete Handlungen passen, dann läuft die Figur von allein vorbei.
  Der Keks-Plan braucht einen Keks: Im Gespräch mit dem Aufschiebchen auf der Kiste erfährt man, dass Frau Brösel in der Kantine die Kekse backt.
  Grundsatz: Krächz hilft nur, jedes Rätsel ist auch ohne ihn lösbar. Vorschläge vor dem Einbau auf Sinn in der Spielwelt prüfen.
  Inventar mit Blättern (Pfeile links neben den Feldern).
- Kapitel 1, dritter Raum: die Kantine (Raum `kantine`) mit Speisekammer (Raum `kammer`). Frau Brösel (`makeBroesel`) ist erstarrt
  vor dem Mittagessen für zweihundert Schülerinnen und Schüler. Rätsel 1: Rezeptkarten sortieren (`sortieren`, `KARTEN`, `RICHTIG`:
  Pudding, Suppe, Kekse, Salat). Rätsel 2: Topf, Milch, Zucker, Puddingpulver auf den Herd legen (`aufHerd`, `S.bereit`), Zucker und
  Pulver liegen unter einem schlafenden Aufschiebchen, das den Topflappen als Kissen nimmt. Frau Brösel wird wach (`S.broesel` 1 und 2)
  und schenkt Kekse (`kekse`).
  Mit den Keksen kommt die Figur durch den Flüstergang in den Heizungskeller.
- Zwischensequenzen (`runCut`, überspringbar, ohne Verbleiste): Rutschpartie durch den Schacht,
  Abstieg über die Kellertreppe am Ende der Hallen-Vorschau.
- Szenenwahl nur zum Testen (versteckt, erscheint nach fünfmal schnellem Tippen auf den Titel „Gonnng!“): Intro, Prolog, Eingangshalle, Flüstergang, Kantine, Heizungskeller, Musikraum, Biologieraum, Heizungskeller mit Lupe und Holzwolle, jeweils mit passendem Spielstand (`SZENEN`).
  Neue Räume dort mit ergänzen.
- Zum Testen: `window.__frame(sekunde)` im Intro, `window.__act(verb, id, item)` und `window.__pick(i)` im Prolog.
- Entschieden: Die Unruh bleibt. Die Große Stundenuhr ist eine Sonderanfertigung (Turmuhren haben sonst meist ein Pendel),
  Krächz erklärt das auf Nachfrage. Die Namen Frau Kallweit, Jonas und Lina bleiben.

- Kapitel 1, vierter Raum: der Heizungskeller (Raum `heiz`, `drawHeizBg`, `makeGrummel`, `actHeiz`). Grummelbart erstarrt im Sessel mit dem
  Schlüssel in der Faust, Kessel mit Anmachholz und Kohle, aber ohne Streichhölzer (`S.brauchFeuer`). Seit dem Gong steht die Sonne still,
  ein Sonnenfleck vom Kellerfenster (`fleck`). Holzwolle hinein, Lupe darüber (`brennglas`), die Heizung springt an (`S.feuer`),
  Grummelbart taut auf (`grummelTaut`). Danach endet die Vorschau vor dem Kompass.
- Kapitel 1, fünfter Raum: der Musikraum (Raum `musik`, `drawMusikBg`, `makeKind`, `makeFermate`, `actMusik`). Frau Fermate und vier Kinder erstarrt,
  Metronom auf dem Klavier (`S.metronom`, 80 Schläge in der Minute, `TAKT_MS`). Eingezählt wird mit dem Trommelschlägel auf der großen Trommel
  (`einzaehlen`, `trommeln`). Danach Pause (`S.pause`), ein Stück Radiergummi in Emils Flöte (`S.floeteZu`), beim nächsten Einzählen holt
  Frau Fermate eine neue Flöte aus dem Karton (`neueFloeteHolen`, `fermateGeh`, `S.kartonAuf`), die Holzwolle nimmt man einfach.
- Kapitel 1, sechster Raum: der Biologieraum (Raum `bio`, `drawBioBg`, `makeMia`, `actBio`). Mia sucht Gustav, die Stabschrecke. Der Zweig,
  der ohne Wind schaukelt, ist Gustav (`S.gustavGefunden`). Zeigt man ihn Mia, zeichnet sie los, wird wach und leiht die Lupe.
- Flüstergang: Das Aufschiebchen in der Nische knackt Nüsse mit dem Trommelschlägel und tauscht ihn gegen einen Keks (`schlaegelTausch`).
- Musikraum und Biologieraum betritt man erst, wenn die Figur Feuer braucht (`S.brauchFeuer`), vorher gibt es nur eine Karte.
- Entschieden (29.09.2026): kein Klatschen mit Zeitmessung (auf dem iPad nicht bedienbar). Brikett, Kordel, Keks-Angel und Kochlöffel sind gestrichen.
  Figuren sagen nicht an, was man tun soll, Hinweise gibt es versteckt im Gespräch. Vorschläge erst besprechen, gebaut wird erst nach Auftrag.

## Nächste Schritte

1. Kompass-Rätsel mit Grummelbart (konkrete Ziele), danach das Tor zum Land Später.
2. Offen: Wird die Lupe in Kapitel 2 als Okular des Fernrohrs weiterverwendet?

## Online-Dokument

Das Konzept liegt zusätzlich als geteiltes Dokument in Claude:
https://claude.ai/code/artifact/effaee6f-8e6d-4f81-9ffd-e6574f3cf09f
`docs/konzept.md` ist ein Export davon. Änderungen am besten nur an einer Stelle pflegen.
