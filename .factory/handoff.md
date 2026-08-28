# CSV Import Cleanroom — build handoff

## Shipped

- A complete local CSV workflow: source and target-template loading, explicit column wiring, defaults, named transforms, validation, preview, accepted-only CSV export, rejected-row report, and portable JSON recipe import/export.
- Formula-injection detection in preview and neutralization in every CSV export. Ordinary negative numbers remain numeric.
- IndexedDB draft recovery and saved recipes. The useful free tier includes all processing and exports plus one saved local recipe.
- $19 one-time Cleanroom Plus license flow through the Sociobot API, including checkout link, return-token capture, daily cached verification, offline optimistic unlock, and paste-to-restore.
- Installable PWA metadata, 192/512 maskable icons, versioned app-shell cache, build-time hashed-asset precache, offline status, fallback page, and update toast.
- Responsive instrument-panel UI for desktop and 390 px mobile, keyboard-visible focus, reduced-motion treatment, semantic landmarks, and modal focus containment.
- Privacy and terms pages, full README, MIT license, and original generated/optimized hero artwork with provenance in `.factory/design.md`.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Results on 2026-08-28:

- `npm test`: 8/8 passing.
- `npm run build`: passing; `dist/index.html` present. Initial app JS 30.28 KB raw / 10.82 KB gzip; CSS 17.28 KB raw / 4.72 KB gzip. Hero WebP 108 KB desktop and 53 KB mobile.
- Playwright 1.58.2: 4/4 passing. Covers end-to-end sample conversion and CSV download, no console/page errors, serious/critical axe scans on the landing page, inspected-results state, `/privacy/`, and `/terms/`, operation after `context.setOffline(true)`, non-empty cached JS, and the 390 px layout/keyboard-scroll boundary.
- Lighthouse 12.5.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100. LCP 1.7 s, CLS 0, total blocking time 0 ms, speed index 1.1 s.
- `npm audit`: 0 vulnerabilities.

## Known limits and next steps

- Deliberately supports CSV only—not XLSX—and caps each input at 10 MB / 50,000 rows to keep browser work predictable.
- The date transform is explicitly day-first (`D/M/Y → YYYY-MM-DD`); ambiguous automatic inference is intentionally not included.
- Saved recipes and drafts are device-local. JSON export/import is the portability mechanism; there is no cloud sync.
- The factory must register the production billing product for slug `csv-import-cleanroom`. No product ID or payment provider is embedded here.
- Lighthouse was measured against the local Vite production preview. Recheck after deployment because CDN headers are factory infrastructure.
