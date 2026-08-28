# CSV Import Cleanroom — polish round 1 handoff

## Result

Repair commits `f5f27f1a78484022df4726c0006c98990496a0b5` and `34f36f8857b06dbb46eda023bbd5ab9f8a014612` resolve F-1-1 through F-1-26. The full finding-to-evidence map is in `.factory/polish-1.md`.

## Delivered

- One-click `/demo/` is isolated and immediately shows the populated mapping workspace under its persistent banner.
- Rebuilt update-worker test lifecycle, heading focus, legal/404 skeletons and metadata, mobile behavior, pricing/privacy sections, and all reviewed wording.
- Added the missing billing-route claim/test and removed unsupported immutability wording.
- Updated catalog copy: “Prepare CSV imports locally with mapping, validation, explained rejects, and reusable recipes.”

## Exact verification

```text
fresh clone: npm ci                                           PASS (61 packages, 0 vulnerabilities)
fresh clone: npm run build                                    PASS (dist/)
fresh clone: each of 11 claims commands                       PASS
npm test                                                      PASS (9/9)
npm run lint                                                  PASS
npm run build                                                 PASS
npm run test:e2e                                              PASS (27/27)
update-worker test --repeat-each=3                            PASS (3/3)
local verify-url.sh: / and /demo/                             PASS (title/lang/h1/main/alt/console)
Playwright axe integration: landing, demo, mapping, inspect,
  license, privacy, terms                                     PASS (0 serious/critical)
```

Evidence screenshots are under `.factory/qa-evidence/polish-1-*`. Main bundle is 33.73 kB raw / 11.78 kB gzip; CSS is 18.70 kB raw / 5.01 kB gzip.

## Deployment

Pushed the repair series to `origin/main`, then deployed `dist/` directly through the configured Azure Static Web Apps production channel. A cold live recheck passed at <https://csv-import-cleanroom.sociobot.in> and `/demo/`: root title is “CSV Import Cleanroom — Prepare CSV imports”; `verify-url.sh` found no console errors, one H1, `lang=en`, main, and complete image alt text on both routes. The live 390 × 844 demo exposes the mapping table at y=484.8, inside its first viewport. Live evidence is in `.factory/qa-evidence/polish-1-live-*`.
