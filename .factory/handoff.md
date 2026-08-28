# CSV Import Cleanroom — polish 4 handoff

## Result

All 43 unique findings from `.factory/review-1.md` through
`.factory/review-4.md` are closed. This includes every blocking, major, and
minor item, plus the service-worker and mobile issues exposed while proving
the fixes. The complete finding-to-evidence matrix is in
`.factory/polish-4.md`.

Live product: <https://csv-import-cleanroom.sociobot.in>

- Deployment ID: `479fcbee-f4f4-4cb4-910e-1ddcc869ab1e`
- Region: Central US
- Deployed product commit: `15d45d6`
- Product version and worker cache: `1.0.9`

Polish 4 repair commits before this evidence handoff:

- `41636ff fix: complete polish route inventory`
- `02d5844 fix: keep demo status and headings visible`
- `025500f test: close service worker update race`
- `d3c02f1 test: synchronize browser lifecycle checks`
- `059bdbf fix: observe waiting worker deterministically`
- `15d45d6 fix: cover service worker waiting transition`

## Delivered

- The first screen names the job, audience, next action, and three tested
  facts in plain words.
- **Try it with sample data** opens `/?demo=1` in one click. Its seeded state
  uses `demo:csv-import-cleanroom`, never the real database. A sticky banner
  keeps the exact isolation notice, Reset demo, and Start for real visible.
- Mobile demo mapping and inspection remain usable at 390 × 844. Stage and
  route changes focus and announce the correct heading.
- Home, Demo, Privacy, Terms, Offline, and 404 have real URLs, route titles,
  metadata, common navigation/footer chrome, working Back behavior, and clean
  keyboard/accessibility states.
- `/offline.html` is indexed in the sitemap. A recursive built-page test keeps
  sitemap entries equal to every indexable shipped HTML route and asserts
  `/404.html` as the sole `noindex` exception.
- `.factory/claims.json` contains 15 promises. Each has exactly one tagged
  test, including privacy, lifecycle, entitlement, billing, offline, export,
  and license-state behavior.
- The service-worker update notice now handles the installed-to-waiting race,
  sends `SKIP_WAITING`, and reloads only after `controllerchange`.
- `.factory/catalog-description.txt` is a 98-character, verb-first sentence.
  `.factory/copy-audit.md` records the final vocabulary and word counts.

The existing calibration-bench visual system, generated hero artwork, color
tokens, type, and motion policy were preserved.

## Clean-clone verification

The final product commit was copied to a fresh tree at
`/tmp/csv-import-cleanroom-polish-4-finalproof-5aSKd3`. After `npm ci`:

```text
all exact commands in .factory/claims.json          PASS (15/15)
npm test                                             PASS (9/9)
npm run lint                                         PASS
npm run build                                        PASS (dist/ produced)
npm run test:e2e                                     PASS (38/38)
npm run test:e2e -- tests/e2e/update.spec.ts --repeat-each=12
                                                     PASS (12/12)
git diff --check                                     PASS
```

The update regression also passed 20/20 repeated runs in the working tree.
An aggregate stress run passed 76/76.

The production bundle contains 35.20 kB raw / 12.13 kB gzip initial app
JavaScript and 19.60 kB raw / 5.17 kB gzip CSS. The responsive mobile hero is
53.7 kB. These are below the static PWA budgets.

## Accessibility, privacy, offline, and live checks

Local Axe scans covered Home, direct query Demo, empty inspection, populated
inspection, Privacy, Terms, 404, and Offline. Every state had zero violations
at every impact level and zero console errors. Evidence:
`.factory/qa-evidence/polish-4-axe-local.json`.

The worker verifier covered all six live routes. Each has the correct title,
`lang=en`, one H1, a main landmark, no missing image alt text, no unnamed
buttons, and no console errors. Evidence:
`.factory/qa-evidence/polish-4-live-*/verify.json`.

The cold production audit additionally confirmed:

- direct `/?demo=1`, visible demo isolation controls, mapped sample focus, and
  inspection results at 390 × 844;
- zero live Axe violations on all routes plus mapping and inspection states;
- successful offline demo reload;
- only same-origin requests during the complete demo flow;
- Home → Privacy → Back restoring URL, title, H1, focus, and announcement;
- exact sitemap inventory, HTTP 404 for an unknown URL, the intentional 404
  `noindex`, and a versioned `1.0.9` worker cache.

Evidence: `.factory/qa-evidence/polish-4-live-check.json`,
`.factory/qa-evidence/polish-4-live-demo-viewport.png`, and
`.factory/qa-evidence/polish-4-live-inspection-viewport.png`.

Live Lighthouse scored Performance 100, Accessibility 100, Best Practices
100, and SEO 100. LCP was 1.2 s, CLS was 0, TBT was 0 ms, and Speed Index was
0.9 s. Evidence: `.factory/qa-evidence/polish-4-lighthouse-live.json`.

## Run locally

```bash
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
```

Run every exact command in `.factory/claims.json` independently to repeat the
claim audit. Use `npm run dev` for local development. The canonical demo is
`/?demo=1`; `.factory/demo.md` documents its data and storage boundary.

## Known gaps and next steps

None. No review finding, test failure, or live discrepancy remains open.
