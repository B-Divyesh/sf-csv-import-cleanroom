# CSV Import Cleanroom — review 4 handoff

## Result

Review 4 made no product-code changes. It rechecked the live deployment and the
repository from a fresh clone. Earlier findings are resolved, but review 4 found
one remaining minor route-inventory issue; see `.factory/review-4.md` F-4-1.

Product repair commits:

- `06e57c4 fix: close polish review findings`
- `2e803d5 test: stabilize service worker update lifecycle`

Deployment: `e9d59d32-d0ea-4710-a0b7-fed26eab7365` (Static Web Apps, Central US). The deployed product build is `2e803d5`; this handoff and the evidence records are documentation-only follow-up work.

## Delivered

- A direct `?demo=1` sandbox with separately namespaced demo storage, a persistent banner, Reset demo, and Start for real controls. The mapped sample is visible in the first mobile viewport.
- Correct in-page destination focus, direct and back/forward route behavior, route announcements, and a working Demo → How it works link.
- Complete route metadata and common navigation/footer skeletons, including a CSP-compatible offline fallback and a real 404.
- All retained visitor promises recorded in `.factory/claims.json`, including local data deletion, tracking/resource privacy, and license revocation.
- Plain-language copy fixes, consistent mapping terminology, version-derived PWA cache naming, and a one-line verb-first catalog description.

## Verification

From a fresh `npm ci` clone at `2e803d59c1846585520405093007d57a4c6de3e3`:

```text
every command listed in .factory/claims.json       PASS (15/15 claim tests)
npm test                                           PASS (9/9)
npm run lint                                       PASS
npm run build                                      PASS (dist/ produced)
npm run test:e2e                                   PASS (37/37)
npm run test:e2e -- tests/e2e/update.spec.ts --repeat-each=8
                                                   PASS (8/8)
git diff --check                                   PASS
```

The production build has 12.03 kB gzip JavaScript and 5.11 kB gzip CSS. The post-build service worker cache is `cleanroom-v1.0.8`.

Cold live verification covered `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, and `/offline.html`:

- `verify-url.sh` reports a correct title, `lang=en`, one H1, a main landmark, no missing image alt text, no unnamed buttons, and no console errors for each route. Evidence: `.factory/qa-evidence/polish-3-live-*/verify.json`.
- Playwright Axe scans found **0 violations at every impact level** on all six routes. The same cold check confirmed the 390 px demo banner/reset/exit controls, direct `?demo=1`, workspace-heading focus, offline demo reload, the repaired Demo fragment, and the `1.0.8` worker. Evidence: `.factory/qa-evidence/polish-3-live-check.json`.
- A cold missing URL returned HTTP 404 with the designed error page. Evidence: `.factory/qa-evidence/polish-3-live-404.html`.
- Live Lighthouse scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100; LCP was 1.2 s and CLS was 0. Evidence: `.factory/qa-evidence/polish-3-lighthouse-live.json`.

## Run locally

```bash
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
```

Run each exact `test` command in `.factory/claims.json` independently to repeat the claim audit. `npm run dev` starts the local app. The demo contract, sample data, reset behavior, and storage namespaces are documented in `.factory/demo.md`.

## Known gaps

- `public/sitemap.xml` omits `/offline.html` and `/404.html`; review 4 records
  this as F-4-1. Establish and test the intended sitemap/noindex policy, then
  repeat the route crawl.
