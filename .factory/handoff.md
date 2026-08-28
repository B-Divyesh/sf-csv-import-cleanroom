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

`swa deploy dist --env production --app-name csv-import-cleanroom --resource-group ParamFactory --no-use-keychain` authenticated but the factory Azure client lacks `Microsoft.Web/staticSites/read` for that resource group. The live root still served its previous `main-BDTrKIc8.js` at the time of check, so live deployment and cold recheck are pending the factory deployment authority. No product defect remains in the committed static artifact.

## Run locally

```sh
npm ci
npm run build
npm run preview
```

Use `/demo/` for the isolated sample. Reset demo clears only `demo:csv-import-cleanroom`; Start for real clears that demo namespace and returns to normal local work.
