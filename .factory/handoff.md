# CSV Import Cleanroom — repair handoff

## Result

**PASS — release blockers from verifier report `7d181d6` are repaired and deployed.**

- Reported candidate: `fba08c8efa65fd79c149e1440b18a01dcb0b0e40`
- Repair implementation: `f025166`
- Live URL: <https://csv-import-cleanroom.sociobot.in>
- Deployment: Azure Static Web Apps production, deployment `febd5e9d-3f3a-4259-b2d6-f6364d614aee`, 2026-08-28 UTC

The researched scope, `pwa-offline` artifact class, static deployment class, and calibration-bench visual system are unchanged.

## Repairs

1. **License verification now fails closed.** New and checkout-return tokens stay locked until the API returns a valid verdict; malformed cache data and first verification attempts that are offline or rate-limited also stay locked. Only a previously cached valid verdict grants optimistic offline access. Successful invalid or revoked responses cache a locked verdict. A stale valid verdict is reconciled in the background. The restore panel stays open and gives a clear recovery step when verification is unavailable.
2. **The claims contract is complete.** `.factory/claims.json` now has ten claims, each with exactly one tagged observable test. Coverage includes recipe payload isolation, free CSV and recipe exports, one-time/no-subscription entitlement copy, transforms and validation, target-field reject explanations, recipe reuse, normal and demo privacy, and the once-daily token-only license request. The offline claim now performs `page.reload()` after the browser goes offline.
3. **The manifest MIME is fixed at the host layer.** `staticwebapp.config.json` maps `.webmanifest` to `application/manifest+json`. The deployed response now has that exact content type, and Chromium parses the manifest with zero errors.
4. **Offline cache matching is deterministic.** Same-origin precache lookups ignore response `Vary` metadata. This fixes module and stylesheet misses on offline reload when a development or production host emits `Vary: Origin`. The worker cache version is `cleanroom-v1.0.5`.

## Regression coverage

`tests/e2e/app.spec.ts` covers the verifier’s required online valid, offline first-use, invalid, revoked, cached-valid, and HTTP 429 license states. It also covers checkout-return capture and URL stripping. `tests/e2e/update.spec.ts` installs a second worker version, displays the update notice, activates it through **Update now**, reloads under the new controller, and restores the generated artifact after the test.

All ten `.factory/claims.json` commands were run individually and passed. Tag inventory confirms exactly one test for each `@claim:<id>`.

## Clean verification

Run on 2026-08-28 UTC:

```sh
npm ci                         # 61 packages, 0 vulnerabilities
npm test                       # 9/9 passed
npm run lint                   # tsc --noEmit passed
npm run build                  # dist/ produced
npm run test:e2e               # 24/24 passed, Playwright 1.58.2 Chromium
npm audit --audit-level=high   # 0 vulnerabilities
```

The browser suite covers desktop and 390×844 mobile, keyboard operation and dialog focus trapping/restoration, designed focus visibility, 44 px targets, reduced motion, serious/critical axe checks in every app state, normal and demo storage isolation, malformed input recovery, exports, privacy request logging, true offline reload, and the service-worker update path. Package/consumer testing is not applicable to this static PWA.

Standalone `@axe-core/cli` 4.10.2 ran against local `/` and `/demo/` and against both live routes: **zero violations**. `/opt/fleet/lib/verify-url.sh` passed local and live `/` and `/demo/`: HTTP 200, correct title and `lang`, one `h1`, a main landmark, alt text present, labelled buttons, and no console errors. Evidence is in `.factory/qa-evidence/axe-local.json`, `.factory/qa-evidence/axe-live-repair.json`, and the `repair-{local,live}-{root,demo}/` directories.

Local mobile Lighthouse: performance 99, accessibility 100, best practices 100, SEO 100; LCP 1.6 s, TBT 110 ms, CLS 0. Live mobile Lighthouse: **100/100/100/100**; FCP 0.9 s, LCP 1.2 s, TBT 0 ms, CLS 0, total transfer 79 KiB. Evidence: `.factory/qa-evidence/lighthouse-repair-local.json` and `.factory/qa-evidence/lighthouse-live-repair.json`.

Production assets remain below budget: main JS 31.92 KB raw / 11.27 KB gzip; main CSS 17.98 KB raw / 4.89 KB gzip; no downloaded fonts; mobile hero 53.7 KB.

## Live verification

- Fresh SHA-256 comparisons match `dist/` for `/`, `/demo/`, `/privacy/`, `/terms/`, `/sw.js`, `/manifest.webmanifest`, main JS, and main CSS.
- `/manifest.webmanifest`: HTTP 200, `Content-Type: application/manifest+json`; Chromium reports zero manifest errors.
- Root has CSP, HSTS, `nosniff`, referrer, permissions, and frame-deny policies. Hashed assets return one-year immutable caching; `sw.js` returns `no-cache`; an unknown route returns the designed page with HTTP 404.
- A fresh 390 px live context completed a real offline reload and inspection with no console errors or third-party requests. Page-level horizontal scroll stayed at zero while the mapping table remained independently scrollable.
- A fresh live context loaded online, then went offline before restoring `definitely-not-a-real-license`. The dialog remained open, **Unlock Plus** remained visible, the unavailable message appeared, and no verdict was stored. Evidence: `.factory/qa-evidence/live-critical-repair.json`.
- The billing verify endpoint returned HTTP 200 with `{valid:false, reason:"invalid"}` and correct production-origin CORS. Checkout returned HTTP 303 to the hosted merchant-of-record checkout.

## Run and deploy

```sh
npm ci
npm run dev
npm test
npm run lint
npm run build
npm run test:e2e
/opt/fleet/lib/deploy-static.sh csv-import-cleanroom /work/repo/dist
```

Deploy only `dist/`. It contains `index.html`, the legal/demo routes, generated hashed assets, service worker, manifest, and `staticwebapp.config.json`.

## Known limits

- CSV only, with the documented 10 MiB and 50,000-data-row limits per file.
- The app intentionally has no cloud sync. Recipe JSON export/import is the portability path.
- Lighthouse does not produce lab INP without interaction; TBT was 0 ms live and the browser interaction suite passed.

No release-blocking gaps remain from `.factory/verification-2.md`.
