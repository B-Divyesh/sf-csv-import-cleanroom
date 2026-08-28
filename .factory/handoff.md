# CSV Import Cleanroom — polish round 2 handoff

## Result

Repair commit `3f07771462fac63bd95454daf00980790b8df266` closes every F-1 and F-2 review finding. It preserves the calibration-bench visual system and the static offline PWA deployment class.

## Changes

- A compact sticky demo bar keeps “Demo — sample data, nothing is saved”, Reset demo, and Start for real visible at 390 px after the sample workspace takes focus.
- Internal Demo and Privacy links now use real document navigation, so Back restores Home’s document, title, heading focus, and route announcement.
- The demo heading hierarchy is H1 then H2 for Saved recipes.
- Free-tier rejection-report export and one-recipe entitlement are registered and tested; the second saved recipe opens Plus.
- The service-worker update regression now proves the replacement controller/cache before a cold shell reload. It passed five repeated runs.

## Verification

- `npm test` — 9/9 passed.
- `npm run lint` — passed.
- `npm run build` — passed; `dist/` contains the static site. Initial main JS is 11.84 kB gzip and CSS is 5.11 kB gzip.
- `npm run test:e2e` — 30/30 passed, including offline reload, request-policy/privacy checks, 390 px layout, route history, and Axe. The demo mapping scan has no `heading-order` violation and no route has serious or critical Axe findings.
- `npm run test:e2e -- tests/e2e/update.spec.ts --repeat-each=5` — 5/5 passed.
- Fresh clone `/tmp/csv-cleanroom-polish-2-clean` after `npm ci`: all 12 commands from `.factory/claims.json` passed individually.
- `git diff --check` passed before commit.

## Deployment and live follow-up

The generic Azure CLI route was denied by RBAC, so deployment used the configured factory static work order: `/opt/fleet/lib/deploy-static.sh csv-import-cleanroom /work/repo/dist`. Azure Static Web Apps production deployment `cfea12e9-0ab8-4b1d-8438-8ea02ba15e50` succeeded and bound the ready custom domain.

Cold production recheck at <https://csv-import-cleanroom.sociobot.in> and `/demo/` passed. All four routes (`/`, `/demo/`, `/privacy/`, `/terms/`) have one H1, one main landmark, expected title, and no serious/critical Axe violations. The settled 390 × 844 demo focused `#workspace-title` while its banner stayed at y=72–188; all three required controls were inside the viewport. Home → Privacy → Back restored the Home URL, title, `#page-title` focus, and “Home page loaded.” announcement. No console errors occurred. Screenshots: `.factory/qa-evidence/polish-2-live-demo-mobile.png` and `.factory/qa-evidence/polish-2-live-home-mobile.png`.

## Run locally

```sh
npm ci
npm run build
npm run preview
```

Use `/demo/` for the isolated sample. Reset demo clears only `demo:csv-import-cleanroom`; Start for real clears that demo namespace and returns to normal local work.
