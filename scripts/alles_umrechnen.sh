#!/bin/sh
# Baut die gemeinsame Palette neu und rechnet alle Bilder und Figuren damit um.
# Neue Bilder hier eintragen (Palette und Umrechnung).
set -e
cd "$(dirname "$0")/.."
R=assets/raw
P="--palette assets/palette.png"
python3 scripts/vga.py $R/schule_nacht_600px.png $R/uhrwerk_600px.png $R/klassenzimmer_600px.png \
  $R/graf_gruen_600px.png $R/aufschiebchen_gruen_600px.png $R/graf_greifen_gruen_600px.png \
  $R/held_gruen_600px.png $R/kraechz_gruen_600px.png $R/kallweit_gruen_600px.png $R/jonas_gruen_600px.png $R/lina_gruen_600px.png \
  --make-palette assets/palette.png --colors 224
python3 scripts/vga.py $R/schule_nacht_600px.png assets/bg/schule_nacht.png $P
python3 scripts/vga.py $R/uhrwerk_600px.png assets/bg/uhrwerk.png $P
python3 scripts/vga.py $R/klassenzimmer_600px.png assets/bg/klassenzimmer.png --size 320x180 $P
python3 scripts/vga.py $R/graf_gruen_600px.png assets/sprites/graf.png --sprite --key-green --height 90 $P --color 0.9
python3 scripts/vga.py $R/graf_greifen_gruen_600px.png assets/sprites/graf_greifen.png --sprite --key-green --height 87 $P --color 0.9
python3 scripts/vga.py $R/aufschiebchen_gruen_600px.png assets/sprites/aufschiebchen.png --sprite --key-green --height 48 $P
python3 scripts/lauf.py assets/sprites/graf_lauf.png --height 90 $P --color 0.9 $R/graf_lauf_a_gruen_600px.png:1,2 $R/graf_lauf_b_gruen_600px.png:2,3
python3 scripts/lauf.py assets/sprites/aufschiebchen_lauf.png --height 48 $P $R/aufschiebchen_lauf_a_gruen_600px.png:1,2 $R/aufschiebchen_lauf_b_gruen_600px.png:2,3
python3 scripts/vga.py $R/held_gruen_600px.png assets/sprites/held.png --sprite --key-green --height 78 $P
python3 scripts/lauf.py assets/sprites/held_lauf.png --height 78 $P $R/held_lauf_gruen_600px.png:1,2,3,4
python3 scripts/vga.py $R/kraechz_gruen_600px.png assets/sprites/kraechz.png --sprite --key-green --height 30 $P
python3 scripts/vga.py $R/kallweit_gruen_600px.png assets/sprites/kallweit.png --sprite --key-green --height 96 $P
python3 scripts/vga.py $R/jonas_gruen_600px.png assets/sprites/jonas.png --sprite --key-green --height 80 $P
python3 scripts/vga.py $R/lina_gruen_600px.png assets/sprites/lina.png --sprite --key-green --height 80 $P
