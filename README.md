# HK Design Webseite

Statische, zweisprachige Firmenwebseite (DE/EN) fuer HK Design mit Fokus auf Conversion, SEO und schnelle Auslieferung ueber GitHub Pages.

## Voraussetzungen

- Node.js 20+
- npm

## Lokal entwickeln

```bash
npm install
npm run dev
```

## Produktions-Build

```bash
npm run build
```

Die Build-Ausgabe liegt danach im Ordner `dist/`.

## Deployment (GitHub Pages)

Der Build wird ueber GitHub Actions ausgerollt.

1. `Settings` -> `Pages`
2. `Source`: `GitHub Actions`

## Projektstruktur

- `index.html` deutsche Hauptseite
- `en/index.html` englische Version
- `css/style.css` globales Styling
- `js/script.js` Navigation, Scroll-States, Formular-Validierung
- `assets/` Favicons und OG-Grafik
- `impressum.html`, `datenschutz.html`, `404.html` rechtliche/technische Seiten
- `.github/workflows/` Deployment-Pipeline
- `dist/` Build-Ausgabe

## Formular-Hinweis

Im Kontaktformular ist Formspree vorbereitet. Ersetze in beiden HTML-Dateien den Platzhalter `YOUR_FORMSPREE_ID` durch deine echte Formspree-ID.
