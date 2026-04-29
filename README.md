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

## Deployment (netcup per GitHub Push)

Der Workflow `.github/workflows/deploy-netcup.yml` deployed den `dist/`-Ordner automatisch zu netcup.

### 1) GitHub Secrets setzen

Unter `Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`:

- `NETCUP_FTP_HOST` (z. B. `ftpxxx.netcup.net`)
- `NETCUP_FTP_USERNAME`
- `NETCUP_FTP_PASSWORD`
- `NETCUP_FTP_TARGET_DIR` (z. B. `/httpdocs/`)

### 2) GitHub Variables setzen

Unter `Settings` -> `Secrets and variables` -> `Actions` -> `Variables`:

- `NETCUP_DEPLOY_ENABLED` = `true`
- optional `NETCUP_FTP_PROTOCOL` = `ftps` (Standard)
- optional `NETCUP_FTP_PORT` = `21` (Standard)

### 3) Ersttest ohne Upload

`Actions` -> `Deploy to netcup` -> `Run workflow` -> `dry_run = true`

### 4) Live-Deployment

Nach erfolgreichem Test:

- `Run workflow` mit `dry_run = false`
- oder einfach `git push` auf `main` (deployt automatisch)

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
