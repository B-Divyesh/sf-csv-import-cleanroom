# CSV Import Cleanroom — repair handoff

## Repair scope

Repaired the independent-verifier blockers recorded for candidate `1e2e829d3ca58846f43db4176aec34f8acc0e399` in `.factory/verification-1.md`.

- Added `.factory/claims.json` with seven executable claim checks and exact `@claim:` coverage.
- Rewrote the first screen to name operations staff and solo administrators, use **Try it with sample data**, explain the next state, and state privacy/offline/price facts.
- Added a real `/demo/` entry. Demo work uses the separate `demo:csv-import-cleanroom` IndexedDB database; real drafts use `csv-import-cleanroom`. The persistent banner provides **Reset demo** and **Start for real**. Returning to real work deletes only demo storage and preserves the real draft.
- Fixed the mapping accessibility defects: `#recipe-file` has a programmatic label, CSV picker labels show a designed focus ring through `:focus-within`, required-checkbox labels are at least 44 px, and the nested complementary landmark was replaced with a labelled section.
- Replaced JSON parser jargon with a plain recovery instruction.
- Fixed a discovered PWA root cause: `sw.js` contained TypeScript’s non-null syntax and could not register. The worker now parses, precaches the demo route with absolute cache keys, updates under `cleanroom-v1.0.4`, and exposes the existing update flow.
- Added `/demo/`, designed `404.html`, `sitemap.xml`, canonical/Open Graph/Twitter/apple-touch metadata, a 1200×630 social-card crop derived from the provenanced hero, `staticwebapp.config.json`, response/security/cache policy, `.factory/demo.md`, and `.factory/copy-audit.md`.

## Verification

Clean install and quality gates run on 2026-08-28 UTC:

```sh
npm ci
npm test                         # 9/9 passed
npm test -- --testNamePattern @claim:file-limits  # 1/1 passed
npm run lint                     # tsc --noEmit passed
npm run build                    # dist/ produced
npm run test:e2e                 # 11/11 passed
npm run test:e2e -- --grep @claim:  # 6/6 passed
npm audit --audit-level=high     # 0 vulnerabilities
```

Browser evidence from Playwright 1.58.2 covers desktop, 390 px mobile, keyboard-visible picker focus, focus target size, mapping and inspection state axe scans, demo isolation, CSV export, formula neutralization, same-origin demo requests, service-worker cache contents, offline demo processing, route metadata, and designed 404 configuration.

`/opt/fleet/lib/verify-url.sh` passed against the built local preview for `/` and `/demo/`: both returned HTTP 200 with no console errors, `lang=en`, one `h1`, a main landmark, and no missing image alt text. The Playwright axe integration reported no serious or critical violations on `/`, `/demo/`, `/privacy/`, `/terms/`, mapping, or inspection. `npx @axe-core/cli` was attempted but its Selenium launcher could not locate a Chrome binary in this container; the project’s pinned Playwright Chromium axe tests are the recorded accessibility evidence.

Build output remains within static budgets: main JS 31.67 KB raw / 11.22 KB gzip; main CSS 17.98 KB raw / 4.88 KB gzip; mobile hero 53.7 KB; social card 86.6 KB. `dist/staticwebapp.config.json` supplies immutable caching for `/assets/*`, a manifest MIME type, CSP, frame policy, permissions policy, and the production 404 override.

## Run and deploy

Use `npm run dev` for local work. Deploy the generated `dist/` directory as the static app; it contains `index.html` at its root and `staticwebapp.config.json`. The repository’s configured `main` push is the handoff point for the factory static deployment; no DNS, billing, or other infrastructure was changed.

## Known limits

- CSV only; the explicit local cap remains 10 MB and 50,000 data rows per file.
- The local Vite preview does not apply Azure Static Web Apps response overrides, so the automated route test validates `staticwebapp.config.json` plus the rendered `404.html`; the production static host applies the 404 status/header policy.
- The product intentionally has no cloud sync. Recipe JSON export/import remains the portability path.
