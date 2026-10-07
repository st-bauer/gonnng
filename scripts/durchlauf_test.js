// Durchlauf Neues Spiel bis zum Ende der Irrlichtwiese in Kapitel 2 mit Neuladen nach jedem Raum. Start: NPM_ROOT=$(npm root -g) SP=/tmp node scripts/durchlauf_test.js (Server auf Port 8765 im Repo). Protokoll: $SP/durch_log.txt
const { chromium } = require(process.env.NPM_ROOT + '/playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1000, height: 800 } });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  const LOG = []; const log = s => { LOG.push(s); };
  const install = () => p.evaluate(() => { window.__log = window.__log || []; window.__q = []; let last = '';
    window.__auto = setInterval(() => { const S = window.__S();
      const sp = S.speech ? S.speech.who + ': ' + S.speech.text : (S.card ? 'KARTE ' + S.card.title : ''); if (sp && sp !== last) { last = sp; window.__log.push(sp); }
      if (S.dialog) { const o = S.dialog.options, i = S.quizAkt != null ? S.quizAkt : window.__q.length ? window.__q.shift() : o.length - 1; window.__log.push('?? ' + o[i]); window.__pick(i); }
      window.__skip(); }, 40); });
  const flush = async () => { const l = await p.evaluate(() => { const x = window.__log || []; window.__log = []; return x; }); l.forEach(log); };
  const idle = async (what) => { for (let i = 0; i < 900; i++) { if (await p.evaluate(() => !window.__S().busy && !window.__S().dialog && !window.__S().card)) return; await p.waitForTimeout(100); } log('!!! HAENGT bei ' + what); await flush(); fs.writeFileSync((process.env.SP||'/tmp') + '/durch_log.txt', LOG.join('\n')); console.log('HAENGT bei', what, errs); await p.locator('#cv').screenshot({ path: (process.env.SP||'/tmp') + '/durch_haengt.png' }); process.exit(1); };
  const act = async (v, id, it, q) => { await p.evaluate(([v, id, it, q]) => { window.__log.push('>> ' + v + ' ' + id + (it ? ' mit ' + it : '')); window.__q = q || []; window.__act(v, id, it); }, [v, id, it, q]); await p.waitForTimeout(150); await idle(v + ' ' + id + ' ' + it); };
  const st = () => p.evaluate(() => { const s = window.__S(); return { room: s.room, takt: s.takt, inv: s.inv.join(','), mode: window.__mode() }; });
  const neuladen = async (label) => { await flush(); log('=== NEULADEN nach ' + label); await p.evaluate(() => clearInterval(window.__auto)); await p.reload(); await p.waitForTimeout(800); await p.click('#weiter'); await p.waitForTimeout(1200); await install(); await idle('weiter'); log('Nach Weiterspielen: ' + JSON.stringify(await st())); };
  const must = async (cond, msg) => { const ok = await p.evaluate(cond); log((ok ? 'OK   ' : 'FEHLT') + ' ' + msg); if (!ok) { await flush(); fs.writeFileSync((process.env.SP||'/tmp') + '/durch_log.txt', LOG.join('\n')); console.log('FEHLT:', msg); await p.locator('#cv').screenshot({ path: (process.env.SP||'/tmp') + '/durch_fehlt.png' }); await b.close(); process.exit(2); } };
  const door = async (raum) => { const j = ['kantine', 'bio', 'keller'].indexOf(raum); if (raum === 'musik') return 'sued'; const t = await p.evaluate(() => window.__S().takt); return ['nord', 'ost', 'west'][((j + t + 1) % 3 + 3) % 3]; };
  const gotoRaum = async (raum) => { // aus der Halle in den Raum (bei Fehlwegen Gong abwarten)
    for (let i = 0; i < 6; i++) { const d = await door(raum); await act('gehe', d); const r = await p.evaluate(() => window.__S().room); if (r === (raum === 'keller' ? 'gang' : raum)) return; log('(Fehlweg, nochmal)'); } await flush(); fs.writeFileSync((process.env.SP||'/tmp') + '/durch_log.txt', LOG.join('\n')); console.log('kein Weg nach', raum, JSON.stringify(await st())); await p.locator('#cv').screenshot({ path: (process.env.SP||'/tmp') + '/durch_fehlt.png' }); process.exit(3); };

  await p.goto('http://localhost:8765/spiel/gonnng.html'); await p.evaluate(() => localStorage.clear()); await p.goto('http://localhost:8765/spiel/gonnng.html'); await p.waitForTimeout(800);
  await p.click('#neu'); await p.fill('#name', 'Mia'); await p.click('#girl'); await p.click('#los'); await p.waitForTimeout(2500);
  await p.click('#skip'); await p.waitForTimeout(500); await install(); await idle('prolog start');
  log('Start: ' + JSON.stringify(await st()));
  // ---- Prolog
  await act('schau', 'boden'); await act('oeffne', 'fenster');   await act('oeffne', 'federmappe'); await act('benutze', 'fenster', 'lineal');
  await act('rede', 'kraechz', null, [2, 3, 1]);
  await act('schau', 'boden'); await act('oeffne', 'pult'); await act('benutze', 'gitter', 'muenze'); await act('benutze', 'gitter'); await act('nimm', 'kreide');
  log('Prolog-Stand: ' + JSON.stringify(await st()));
  await neuladen('Prolog vor Schacht');
  await p.evaluate(() => { window.__act('benutze', 'gitter'); });
  await p.waitForFunction(() => window.__S().room === 'halle', null, { timeout: 90000 }); await idle('Halle Intro');
  log('Halle: ' + JSON.stringify(await st()));
  // ---- Halle
  await act('nimm', 'notiz'); await act('schau', 'zettel'); await act('druecke', 'gong');
  await neuladen('Halle');
  await gotoRaum('keller'); await idle('gang');
  await must(() => window.__S().room === 'gang', 'im Flüstergang');
  // ---- Fluestergang: Plaene
  await act('gehe', 'tuer');
  await act('benutze', 'tafel', 'kreide', [1, 2]);
  await act('gehe', 'tuer');
  await act('benutze', 'tafel', 'kreide', [1, 3]);
  await act('gehe', 'tuer');
  await act('benutze', 'tafel', 'kreide', [1, 4]);
  await act('rede', 'auf3', null, [1, 3]);
  await must(() => window.__S().suchKantine, 'Kantine als Ziel bekannt');
  await neuladen('Fluestergang Plaene');
  await act('gehe', 'treppe'); await idle('halle');
  await gotoRaum('kantine');
  await must(() => window.__S().room === 'kantine', 'in der Kantine');
  // ---- Kantine
  const box = await p.locator('#cv').boundingBox(); const sx = box.width / 320, sy = box.height / 200;
  const karte = async i => { await p.mouse.click(box.x + (8 + i * 78 + 36) * sx, box.y + 60 * sy); await p.waitForTimeout(120); };
  await act('rede', 'broesel', null, [0, 1, 3]);
  await p.evaluate(() => { window.__act('benutze', 'rezepte'); }); await p.waitForFunction(() => window.__S().sort, null, { timeout: 20000 });
  for (const i of [2, 3, 0, 1]) await karte(i); await p.waitForTimeout(800); await idle('sortieren');
  await must(() => !!window.__S().sortiert, 'Rezeptkarten sortiert');
  await neuladen('Kantine sortiert');
  await act('nimm', 'topf'); await act('oeffne', 'kuehl'); await act('nimm', 'topflappen'); await act('benutze', 'herd', 'topf');
  await act('gehe', 'kammertuer');
  await act('benutze', 'pulver', 'topflappen'); await act('nimm', 'zucker'); await act('nimm', 'pulver');
  await act('gehe', 'tuerV');
  await act('benutze', 'herd', 'milch'); await act('benutze', 'herd', 'zucker'); await act('benutze', 'herd', 'pulver');
  await must(() => window.__S().inv.indexOf('kekse') >= 0, 'Kekse von Frau Brösel');
  await neuladen('Kantine fertig');
  await act('gehe', 'tuerK'); await idle('halle');
  await gotoRaum('keller');
  await act('gehe', 'tuer');
  await must(() => window.__S().room === 'heiz', 'im Heizungskeller');
  await act('rede', 'grummel', null, [1, 2]); await act('oeffne', 'kessel');
  await must(() => window.__S().brauchFeuer, 'Feuer wird gebraucht');
  await neuladen('Heizungskeller Einstieg');
  await act('gehe', 'tuerZ'); await idle('gang');
  await act('gib', 'auf1', 'kekse');
  await must(() => window.__S().inv.indexOf('schlaegel') >= 0 && window.__S().inv.indexOf('kekse') >= 0, 'Schlägel getauscht und noch Kekse da');
  await act('gehe', 'treppe'); await idle('halle');
  // ---- Musikraum
  await gotoRaum('musik');
  await act('rede', 'fermate', null, [2]); await act('druecke', 'metronom'); await act('benutze', 'trommel', 'schlaegel');
  await act('rede', 'emil'); await act('benutze', 'emil', 'radiergummi'); await act('benutze', 'trommel', 'schlaegel');
  await act('nimm', 'karton'); await act('nimm', 'holzwolle'); await act('nimm', 'kopfhoerer');
  await must(() => window.__S().inv.indexOf('holzwolle') >= 0, 'Holzwolle');
  await neuladen('Musikraum');
  await act('gehe', 'tuerM'); await idle('halle');
  // ---- Biologieraum
  await gotoRaum('bio');
  await act('schau', 'gustav'); await act('rede', 'mia', null, [0, 1]); await act('schau', 'gustav'); await act('rede', 'mia', null, [2]);
  await act('rede', 'mia', null, [0, 1, 2, 3]); await act('gib', 'mia', 'kopfhoerer');
  await must(() => window.__S().inv.indexOf('lupe') >= 0, 'Lupe von Mia');
  await neuladen('Biologieraum');
  await act('gehe', 'tuerB'); await idle('halle');
  await gotoRaum('keller');
  await act('gehe', 'tuer');
  await must(() => window.__S().room === 'heiz', 'wieder im Heizungskeller');
  // ---- Feuer, Kiste, Tor
  await act('benutze', 'fleck', 'holzwolle'); await act('benutze', 'wolleZ', 'lupe');
  await must(() => window.__S().feuer && window.__S().kisteAuf, 'Feuer an, Kiste offen');
  await neuladen('Feuer');
  await act('schau', 'schloss'); await act('benutze', 'schloss', 'lupe');
  await must(() => window.__S().lochGesehen, 'Loch mit Lupe gesehen');
  await neuladen('Loch gesehen');
  const wahl = async (i) => { await p.waitForFunction(() => window.__S().sort && window.__S().sort.schluessel, null, { timeout: 20000 }); await p.evaluate(i => window.__S().sort.click(24 + i * 38, 50), i); };
  let pr = act('schau', 'kiste'); await wahl(1); await pr;
  pr = act('schau', 'kiste'); await wahl(5); await pr;
  await must(() => window.__S().inv.indexOf('torschluessel') >= 0, 'Torschlüssel');
  await act('benutze', 'tor', 'torschluessel', [0, 1]);
  await p.waitForFunction(() => window.__S().room === 'moorrand' && !window.__S().busy, null, { timeout: 90000 }).catch(() => log('KEIN MOORRAND'));
  await must(() => window.__S().inv.indexOf('lupe') < 0 && window.__S().miaZurueck, 'Lupe an Mia zurück');
  await neuladen('Moorrand erreicht');
  // ---- Kapitel 2: Moorrand mit Kolportus
  await act('rede', 'kolportus', null, [2]);
  await act('rede', 'kolportus', null, [2]);
  await must(() => window.__S().inv.indexOf('teeglas') >= 0, 'Teeglas von Kolportus');
  await neuladen('Moorrand Quiz');
  await act('gehe', 'wegR');
  await must(() => window.__S().room === 'irrwiese', 'auf der Irrlichtwiese');
  // ---- Kapitel 2: Irrlichtwiese
  await act('gehe', 'weiter');
  await act('rede', 'kraechz', null, [0, 3]);
  await must(() => window.__S().monokelWeg && window.__S().inv.indexOf('monokel') >= 0, 'Monokel gegen Versprechen');
  await neuladen('Monokel geliehen');
  await act('benutze', 'stumpf', 'teeglas');
  await act('benutze', 'glasS', 'monokel');
  await must(() => window.__S().irrImGlas && !window.__S().monokelWeg, 'Irrlichter im Glas, Monokel zurück');
  await neuladen('Irrlichter gefangen');
  await act('nimm', 'glasS');
  await must(() => window.__S().irrWeg && window.__S().inv.indexOf('irrglas') >= 0, 'Irrlicht-Glas im Rucksack');
  await act('gehe', 'weiter');
  await p.waitForFunction(() => window.__mode() === 'end', null, { timeout: 90000 }).catch(() => log('KEIN ENDE'));
  await flush(); log('Ende: ' + JSON.stringify(await st()));
  fs.writeFileSync((process.env.SP||'/tmp') + '/durch_log.txt', LOG.join('\n'));
  console.log('Fehler:', errs.length ? errs : 'keine'); await b.close();
})();
