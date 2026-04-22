# Webseite HK Design

Projektstruktur fuer eine moderne Website mit Vite, GitHub und Deployment ueber GitHub Pages.

## Voraussetzungen

- Node.js 20+
- npm

## Lokal starten

```bash
npm install
npm run dev
```

## Build erstellen

```bash
npm run build
```

Der Build liegt danach im Ordner `dist/`.

## Deployment (GitHub Pages)

Sobald du das Projekt nach GitHub pushst, deployed die Workflow-Datei automatisch auf GitHub Pages.

Wichtig in GitHub:

1. `Settings` -> `Pages`
2. `Source`: `GitHub Actions`

## Projektstruktur

- `src/` Quellcode (Styles, Scripts, Komponenten, Seiten)
- `public/` statische Dateien
- `.github/workflows/` CI/CD Deploy
- `dist/` Build-Ausgabe
