# Independent verification 3 — CSV Import Cleanroom

## Decision

**PASS** for candidate `4655ae02e918123be932a47173d08f022f5b0bea` at <https://csv-import-cleanroom.sociobot.in>.

Verified 2026-08-28 UTC from a clean checkout. The deployed files match a fresh production build of this exact commit. This is a local-first PWA; no consumer-package or sign-in checks apply.

## First-read test

Cold production landing page, before interaction:

- **What it does:** “Prepare CSV imports. Keep the source intact.” It shows source CSV → target-template CSV and explains mapping, transforms, validation, rejects, and JSON recipes.
- **For whom:** “For operations staff and solo admins preparing strict SaaS imports from messy spreadsheets.”
- **What to click first:** the visible primary action is **Try it with sample data**, with adjacent plain text explaining that it opens a mapped import with one explained rejection.

The action is one click, routes to `/demo/`, and shows the persistent “Demo — sample data, nothing is saved” banner with **Reset demo** and **Start for real**. The first-read and demo-sandbox gates pass.

## Mandatory claims gate

`.factory/claims.json` is present with 10 claims. From the clean clone, `node_modules` was initially absent, so the first attempted listed commands correctly reported missing test packages; `npm ci` then installed the locked 61 packages (0 vulnerabilities). Every listed claim command was rerun and passed. A combined `npm run test:e2e -- --grep @claim` run also reported all 9 Playwright claims passed; the Vitest file-limit claim passed separately.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolation` | PASS | Real draft survives entering, resetting, and leaving demo. |
| `csv-export` | PASS | Free accepted CSV and recipe JSON download. |
| `formula-safe-export` | PASS | Export prefixes formula-risk value with an apostrophe. |
| `offline-reload` | PASS | Reloaded `/demo/` offline after first visit. |
| `on-device-processing` | PASS | Demo and normal processing make same-origin requests only. |
| `plus-price` | PASS | License panel says `$19 once`, no subscription, unlimited local recipes. |
| `file-limits` | PASS | 10 MiB and 50,000-row limits exercised. |
| `recipe-data-separation` | PASS | JSON recipe has mappings/rules, no sample cell values. |
| `conversion-workflow` | PASS | Transforms, target-field rejection explanation, and recipe restore work. |
| `license-request-policy` | PASS | One daily token-only verification request under the mocked browser flow. |

## Clean local gates

```text
npm ci                                      PASS — 61 packages, 0 vulnerabilities
npm test                                    PASS — 2 files, 9 tests
npm run lint                                PASS — tsc --noEmit
npm run build                               PASS — dist/ produced
npm run test:e2e -- --reporter=list         PASS — 24 tests
```

The update test was additionally run alone and passed. It verifies a waiting worker, the in-app **Update now** notice, activation, reload, and the new cache version. One earlier full-suite attempt had a non-reproducible failure in that update test (only the skip link had rendered when the toast was awaited); the standalone rerun and the immediately following clean full-suite run passed. This is recorded as a low-severity test-stability follow-up, not evidence of a production failure.

Build output: `main` JS 31.92 kB raw / **11.33 kB gzip** and CSS 17.98 kB raw / **4.88 kB gzip**, well within the 200 kB initial-JS and 50 kB CSS budgets.

## Live end-to-end and resilience

- Ran the sample workflow: mapped source/template, named date/currency/ID transforms, inspection, two accepted rows, one explained `email` rejection, safe CSV output, and recipe JSON export.
- Exercised live invalid input and recovery: unclosed quote, 50,001 data rows, and 10 MiB + 1 byte each display a specific `role=alert` explanation and **Dismiss**; valid source/template inputs then load successfully.
- Fresh live context: service worker controlled `/demo/`; after `context.setOffline(true)`, a full reload rendered the mapped demo and inspection UI with zero console errors.
- Live update affordance is covered by the passing local worker-update test. Production serves `sw.js` with `Cache-Control: no-cache`; its active worker is `https://csv-import-cleanroom.sociobot.in/sw.js`.
- Desktop and 390×844 CSS viewport work without page-level sideways scrolling; the wide mapping table remains in its own scroll container. Keyboard testing confirms Enter on the sample action, a 3 px visible focus outline, modal focus trapping/restoration, and Escape close. Reduced-motion context reports near-zero transition/animation durations.

## Privacy, requests, and API allowance

- Fresh root and demo request logs contained only same-origin resources and no console/page errors.
- With a private normal CSV loaded, the only external request after explicit license verification was `GET https://api.sociobot.in/api/v1/products/csv-import-cleanroom/verify?license=qa-invalid-license-4655ae02`, with no body. The recorded request set contained no `private.person@example.com` or other spreadsheet value.
- Direct verifier endpoint test with an invalid, non-sensitive token and production Origin: requests 1–30 returned 200 invalid verdicts; request **31 returned 429** with `Retry-After: 3` (and `x-ratelimit-after: 3`). Observed allowance: **30 immediate requests per client/rate window**. The API also returned the correct production `Access-Control-Allow-Origin` on that response.
- No sign-in provider is present or required. No analytics, remote fonts, runtime CDN code, or third-party request was observed in normal/demo operation.

## Accessibility, metadata, performance, and headers

- `/opt/fleet/lib/verify-url.sh` passed live `/` and `/demo/`: HTTP 200, title, `lang=en`, exactly one h1, main landmark, image alt attributes, labelled buttons, and no console errors.
- Independent Playwright axe scans of `/`, `/demo/`, `/privacy/`, and `/terms/` found **zero violations** (including zero serious/critical). The CLI wrapper could not locate a system Chrome in this container, so the equivalent installed `@axe-core/playwright` integration was used.
- Live Lighthouse: performance **98**, accessibility **100**, best practices **100**, SEO **100**; FCP 1.0 s, LCP 1.3 s, TBT 170 ms, CLS 0, transfer 79 KiB.
- Headers: CSP, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, permissions policy, and frame deny are present. Hashed assets are one-year immutable; manifest is `application/manifest+json`; service worker is no-cache; unknown route returns HTTP 404.

## Deployment identity

Fresh SHA-256 comparisons match `dist/` from candidate `4655ae0` for `/`, `/demo/`, `/privacy/`, `/terms/`, `/sw.js`, `/manifest.webmanifest`, `main-BrXe-hBO.js`, and `main-BQDtiEZ2.css`.

## Defects and follow-up

### Low — service-worker update test has shown one non-reproducible aggregate-suite failure

The first full Playwright run timed out before rendering the update notice; its standalone rerun and the next full 24-test run passed. The live worker controls and offline reload succeed. Stabilize the test’s wait/retry or isolate its worker cache lifecycle so this diagnostic test cannot intermittently fail CI. This is non-blocking for this verified candidate because the required claim suite, final full suite, and actual PWA behavior passed.

Evidence retained during verification under `/tmp/csv-cleanroom-qa/` in the verification container (screenshots, request/response headers, browser results, rate-limit results, and Lighthouse JSON).
