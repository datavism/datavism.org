# THE FOLDER — G1 story-kern spike · NOTES

**Was:** Feel-Test des In-Browser-Story-Kerns von Station **G1 THE FOLDER**
(LINE G). Nur Beats 0–4 (Story); Mission/Self-Check/Ticket bewusst NICHT drin.
**Gehört zu:** `docs/plans/2026-06-13-phase-2-line-g-design.md` §3 (G1), §4 (6 Beats),
§8 (Spike-first).
**Run:** `cd experiments/folder-spike && python3 -m http.server` → http://localhost:8000
(braucht jetzt Internet — three.js + GSAP kommen per CDN.)

## ⚖ Dependency-Override (Frank, 2026-06-13)

Design §8 sagte „null Dependencies, Ein-Datei". Frank: „kannst du was mit gsap
und webgl machen, also einen wirklichen Knaller" → bewusst überschrieben.
Stack jetzt: **three.js (WebGL-Partikel) + GSAP ScrollTrigger**, weiterhin eine
Datei, weiterhin `python3 -m http.server`. Beim Astro-Bau zu klären: Islands +
npm-Deps statt CDN; reduced-motion-/no-WebGL-Fallback ist schon drin.

---

## Messlatte (woran das gemessen wird)

> „Stories erzählen mit Daten, keine Gimmick-Spielchen — award-winning.
> Cookie Roulette kann vielfach überboten werden." (Frank, 2026-06-12)

STRECKE-Werkzeuge, die hier zum Einsatz kommen:
- **Maßstab-als-Dramaturgie (WebGL)** — ~6k Partikel + ~40 lesbare Label-Sprites
  explodieren um die Kamera, die Kamera stürzt hindurch (scroll-gescrubt via GSAP),
  dann **kollabiert alles in einen Punkt = dein Fingerprint.** Die Konvergenz IST
  die Aussage: der Apparat reduziert dich auf einen verkäuflichen Code.
- **Unruhe-Zähler** — „categories on you", tickt 4 → ~1.647 hoch, wird rot ab Hälfte.
- **Persönlicher Turn (3 Wellen, Crescendo)** — die Seite baut *live im Browser*
  einen Ordner auf DICH, steigernd invasiv:
  1. *passiv abgelesen* — Uhrzeit, Zeitzone, Sprache, Screen, Gerät, Display-Modus,
     plus dein Do-Not-Track-Status (gesendet & ignoriert).
  2. *Verhaltens-Spiegel* — Zeit auf der Seite + das WebGL-Label, das am längsten
     nahe der Bildschirmmitte stand (wo du langsamer scrolltest). Mit ehrlichem
     Fallback, wenn du durchrast. (Fix v4: hing vorher an DOM-Chips, die beim
     schnellen Scrollen nie „angeschaut" wurden → Spiegel blieb leer.)
  3. *Fingerprint-Klimax* — deterministischer Hash (Canvas + Hardware) → nahezu
     eindeutige ID. „Refresh = gleicher Code. Inkognito = wahrscheinlich gleich."
  Kein Account, kein Cookie, **nichts gesendet, nichts gespeichert, Refresh löscht.**
  (v2: ersetzte den lame Google-Link. v3: alle 3 Wellen — Frank wählte alles,
  2026-06-13.)
- **Quellen-Stamp** — `// GHOST · FILE 1/5` am Turn-Beat.
- **GHOST-Faden** — Origin-Fragment 1/5 (DRAFT) + Skill-Pivot zur „richtigen Frage".

## Methode (so wie STRECKE)

1. Bauen → **Frank testet** → reagieren → **„höher zielen"** → erst dann Astro-Bau.
2. Dieser Spike ist Wegwerf-Code zum Fühlen, kein Architektur-Vorgriff
   (keine Engine-Abstraktion vor 3+ Wiederholungen).

---

## ✅ VERIFY — Daten-Verifikations-Pass DURCHGEFÜHRT (2026-06-13)

**Voller Record + Quellen: [`VERIFY-G1.md`](./VERIFY-G1.md).** Befund: die „Op-004
AdTech Empire Map" existiert in data-snack NICHT → direkt gegen Primärquellen verifiziert.
Alle erfundenen Platzhalter sind durch **echte, quellenbelegte Segmente** ersetzt.

- [x] **Zähler** — `1647` „categories on you" → **650.000 „ways to label you"**
      (Xandr-Leak, The Markup + netzpolitik 2023).
- [x] **Kategorie-Namen** — erfundene „(inferred)"-Labels → **verbatim echte Segmente**
      aus dem Xandr-File (Pregnancy Test Kits, Propensity for Depression, Diabetes Type II,
      Opiate Addiction, 'Hardcore' Republicans …) + IAB-1.1-Standardkategorien.
- [x] **Sensitive-Flags** — die roten Labels sind real Art.-9-DSGVO-Sonderkategorien
      (Gesundheit/politische Meinung), trotzdem gehandelt (noyb-Beschwerde 2024).
- [x] **Cold-open-Zahl** — „hundreds of times a day" → **376×/Tag (EU)** (ICCL 2022).
- [x] **Quellenzeile** — Stamp in der Eskalation + Footer-Links + VERIFY-G1.md.
- [x] **Persönlicher Turn** (BEAT 3) — braucht keine Verifikation, echte Live-Signale.
- [ ] **Frank-Review:** dürfen die echten verbatim-Segmente (politisch/gesundheitlich)
      so gezeigt werden? (öffentlich dokumentiert → vertretbar, aber dein Call.)
- [ ] exakte IAB-1.1-Segmentzahl auszählen (sekundär; Held-Zahl ist 650.000).

## ⚖ Ehrlichkeits-Linie — Fingerprint (Frank-Entscheidung, festzuhalten)

Der Fingerprint *demonstriert* verdeckte Tracking-Technik, statt sie zu benutzen:
deterministisch berechnet, **nur lokal, nie gesendet, nie gespeichert**, Refresh
löscht. Das ist mit „kein Tracking, auch nicht ironisch" vereinbar, WEIL die Seite
laut benennt, was sie tut, und nichts behält. Vor Ship final entscheiden:
- [ ] Bleibt der Fingerprint in der ausgelieferten G1? (Spike = ja, zum Testen.)
- [ ] Disclaimer-Wortlaut reicht als ehrliche Offenlegung? (aktuell: „computed inside
      your browser · nothing sent · nothing saved · refresh and it's gone".)
- [ ] Keine Überbehauptung: „near-unique" statt „unique", „likely the same" für Inkognito.

## Authoring offen (eigene Sessions)

- [ ] GHOST-Fragment 1/5 final schreiben (Ton gegen Cast-Bible / STORY §11).
      Aktuell DRAFT, als solcher gelabelt.
- [ ] EN-Mikrokopie final (Canon §10, EN-first).

---

## Reaktions-Log (Frank → wo zielen wir höher?)

<!-- Frank: Notizen hier rein, was trägt / was flach ist / wo es knallen muss. -->

- **v5 (WebGL-Knaller, 2026-06-13):** Frank: „langweilig, mach was mit gsap+webgl,
  echter Knaller". → Komplett-Umbau auf three.js-Partikel + GSAP + WebAudio +
  UnrealBloom + Final-Shader (Aberration/Vignette/Grain). Kollaps als Gewalt-Event
  (Flare→Implosion, Boom, Flash, Shake, FOV-Punch).
- **v5 Browser-Verifikation (Playwright):** kein Runtime-/Shader-Fehler (nur
  favicon-404), WebGL2 aktiv, Bloom/GSAP geladen, Zähler 4→908→1.647, Spiegel fing
  „Recently Single" korrekt, Fingerprint berechnet.
- **v5 Tuning nach Screenshot-Befund:** erstes Bloom (threshold 0, strength .85)
  wusch alles in Lavendel-Dunst → gefixt: bloom (.55/.45/.30), schärfere Partikel
  (glow², alpha .7, uSize 50/34), Konvergenz auf 0.63–0.74 gestrafft, Kamera-Pull
  reduziert, tier0 6%, grain .03. Ergebnis: tiefes Schwarz, Kollaps implodiert
  sichtbar zum glühenden Kern.
- **OFFEN für Frank-Test:** Audio (Boom/Riser) nur live testbar — ♪-Button klicken;
  trägt der Sound den Kollaps? Schwarm dicht/„erdrückend" genug?
