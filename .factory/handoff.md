# CSV Import Cleanroom — independent verification handoff

## Result: FAIL

- Candidate: `1e2e829d3ca58846f43db4176aec34f8acc0e399`
- Live URL: <https://csv-import-cleanroom.sociobot.in>
- Verified: 2026-08-28 UTC
- Full report: [`.factory/verification-1.md`](verification-1.md)

Do not release this candidate. The deployed app byte-matches the candidate and its core CSV workflow works, but the acceptance contract has multiple release blockers:

1. `.factory/claims.json` is missing, so there are no mandatory per-claim tests. This is an automatic failure.
2. The cold first screen says what the tool does and what to click, but not whom it is for.
3. The sample is not an isolated demo. It uses the normal IndexedDB namespace, persists after reload, has no demo banner/reset/start-for-real controls, and can overwrite a loaded real draft without confirmation.
4. Live axe reports a critical unlabeled `#recipe-file` input in the mapping stage. CSV file inputs also have no visible keyboard focus, and checkbox targets are below 44 px.

Important secondary gaps: no real 404, sitemap, canonical/social metadata, static host configuration, CSP/frame policy, immutable asset caching, `.factory/demo.md`, or `.factory/copy-audit.md`.

## What passed

- `npm ci`
- `npm test`: 8/8
- `npm run build`: passed with type-check; `dist/` produced
- `npm run test:e2e`: 4/4
- `npm audit --audit-level=high`: 0 vulnerabilities
- Sample conversion/export/rejection report/formula neutralization/recipe JSON
- Invalid file, size/row boundary, malformed recipe, no-mapping, persistence, and free-tier recovery checks
- Desktop, 390 px, and 320 px functional layouts; reduced-motion behavior
- No console/page errors in tested main, sample, inspection, legal, offline, or license states
- Offline reload, offline conversion, cached legal route, manifest installability, and simulated service-worker update
- Live Lighthouse mobile: 96 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.3 s, CLS 0
- Production checkout now returns 303 to hosted Dodo checkout; the prior registration concern is resolved
- Billing verification rate limit: 30 HTTP 200 and 90 HTTP 429 responses in a 120-request burst; every 429 had `Retry-After` (0–4 s)

## Reproduce

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm audit --audit-level=high
```

The repository has no lint script. See the full report for exact functional, privacy, accessibility, response-policy, caching, bundle, and deployment-identity evidence.
