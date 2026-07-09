# WVSU USC Unified Calendar

Official read-only unified calendar for the **West Visayas State University University Student Council**, Academic Year 2026–2027.

**Live site:** [https://santiagocrab.github.io/wvsualigncalendar/](https://santiagocrab.github.io/wvsualigncalendar/) (enable GitHub Pages → **Deploy from branch** → `gh-pages` → `/ (root)`)

## Repository

- **Source code:** `main` branch
- **GitHub Pages build:** `gh-pages` branch (production `dist/` only)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build static site

```bash
npm run build
```

Upload the `dist/` folder to any static host, or push to `main` — GitHub Actions deploys automatically to GitHub Pages.

```bash
npm run preview
```

## Features

- **Dashboard** — KPIs, category summary, featured tools
- **Calendar** — Month / week / list, AY quick-jump, day popup
- **Conflict Checker** — Cross-org physical venue clashes only (excludes online, TBA/TBD, same-host)
- **Organizations** — 90 official USC councils and orgs
- **Approval Board, Reports, Settings** — Read-only views and legend

## Data

Events are bundled in `src/data/events.json` (~939 activities). Static publication — no add/edit/delete in the UI.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · HashRouter · Lucide · date-fns
