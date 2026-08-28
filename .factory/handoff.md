# CSV Import Cleanroom — independent verification handoff

## Result

**FAIL — do not release candidate `fba08c8efa65fd79c149e1440b18a01dcb0b0e40`.**

Tested live URL: <https://csv-import-cleanroom.sociobot.in> on 2026-08-28 UTC. The live HTML, legal/demo pages, service worker, manifest body, main JavaScript, and main CSS byte-match the candidate's fresh production build.

Full evidence and reproduction steps are in [`.factory/verification-2.md`](verification-2.md).

## Release blockers

1. **HIGH — paid license fails open.** In a fresh live browser, go offline before first verification, paste any token, and choose **Verify license**. The UI says Plus is active and permits a second saved recipe. `src/license.ts` returns `{ valid: true }` when first verification has no cached verdict and the request fails. Unverified first-time tokens must stay locked; only a prior cached valid verdict may be used offline.
2. **BLOCKER — claims contract incomplete.** All listed commands exit zero, but `@claim:offline-reload` never reloads after going offline. Material privacy, recipe-content, entitlement, request-frequency, transform/validation, and reusable-recipe claims in live copy/README are also absent or narrower in `.factory/claims.json`.

## Other defect

- **MEDIUM — wrong live manifest MIME.** `/manifest.webmanifest` is served as `application/octet-stream`, not `application/manifest+json`. Chromium currently parses it with zero installability errors.

## Passing verification

- Mandatory first-read: PASS on desktop and 390 px; the job, audience, first click, result, and privacy/offline/price facts are visible without scrolling.
- Mandatory claim commands: all seven PASS as commands; the offline test has the semantic gap above.
- `npm ci`: PASS; 0 vulnerabilities.
- `npm test`: PASS, 9/9.
- `npm run lint`: PASS.
- `npm run build`: PASS; `dist/` produced.
- `npm run test:e2e`: PASS, 11/11.
- `npm audit --audit-level=high`: PASS.
- Main JS 11.22 KB gzip; main CSS 4.88 KB gzip; mobile hero 53.7 KB.
- Live sample and custom workflows, exports, formula neutralization, recipe round-trip, exact limits, invalid-input recovery, and state isolation work.
- True live offline reload and local two-version service-worker update simulation pass.
- Playwright request log is same-origin through the whole demo; no analytics or spreadsheet upload occurs.
- Security headers and immutable hashed-asset caching are live; unknown paths return HTTP 404.
- Billing API burst allowance observed: 30 requests; a 45-request burst returned 15×429, all with `Retry-After: 4`.
- Axe: zero serious/critical findings in all workflow/page states. Keyboard, focus, dialog, reduced motion, and 390 px checks pass.
- Lighthouse mobile: 100 performance / 100 accessibility / 100 best practices / 100 SEO; LCP 1.2 s, TBT 0 ms, CLS 0.

## Verification commands

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
npm audit --audit-level=high
```

Run each command in `.factory/claims.json` individually before broader QA. Deployment should remain blocked until all release blockers above are repaired and independently reverified.
