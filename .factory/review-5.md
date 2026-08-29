# Adversarial first-read review 5 — CSV Import Cleanroom

**Verdict: PASS**

Reviewed 2026-08-29 UTC against the live site and clean checkout
`c79818a19b10b0cef85173df613769dbc63bfe44`. PASS requires zero findings.
There are no `F-5-*` findings.

## Thirty-second first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 showed the same clear
first screen before scrolling.

| Question | Answer | Exact first-screen evidence |
| --- | --- | --- |
| What does it do? | Maps, validates, and exports CSV rows into a target template. | “Prepare CSV imports.” and “Map, validate, and export CSV rows” |
| For whom? | Operations staff and solo administrators preparing a target template from a messy spreadsheet. | “For operations staff and solo admins preparing a target template from messy spreadsheets.” |
| What should I click first? | Try the sample. | Primary action: “Try it with sample data”; adjacent result: “The sample opens a mapped import with one explained rejection.” |

The live home page returned 200, has one H1 and a main landmark, had no
console errors, and had no page-level horizontal overflow at 390 px.

## Copy audit

Counts are whitespace-delimited. This records every visitor-visible landing
unit and every README sentence/label; code commands are excluded. No unit is
over 22 words. No banned marketing adjective, unexplained metaphor, jargon
heading, inconsistent workflow term, or non-result button label was found.

### Landing page `/`

| Location | Copy (words) |
| --- | --- |
| Skip/header/footer | Skip to workspace (3); CSV Import Cleanroom (3); Demo (1); How it works (3); Privacy (1) |
| Header action/status | View Cleanroom Plus — $19 once (6); Local processing ready (3); Files never leave this device (5) |
| Hero | Map, validate, and export CSV rows (6); Prepare CSV imports. (3); For operations staff and solo admins preparing a target template from messy spreadsheets. (13) |
| Hero actions/result | Try it with sample data (5); Choose CSV files (3); The sample opens a mapped import with one explained rejection. (10) |
| Hero facts/caption | Files stay on this device (5); Works offline after first visit (5); $19 once for unlimited recipes (5); Accepted rows follow your target template. (6) |
| Workspace | CSV import workspace (3); Choose the source and target CSV files (7) |
| Stages | Load (1); Source + target template (4); Map (1); Map + transform (3); Inspect (1); Validate + export (3) |
| Source file | Input A (2); CSV (1); Messy source CSV (3); The rows you need to clean. (6); Choose source CSV (3) |
| Target file | Input B (2); CSV (1); Target template CSV (3); An empty template or example export. (6); Its header defines the output. (5); Choose target template CSV (4) |
| Limits/actions | Local limits (2); CSV only (2); 10 MB per file (4); 50,000 data rows (3); UTF-8 recommended (2); Use sample files (3); Map target fields (3) |
| How section | How CSV cleanup works (4); Reuse the same import settings (5) |
| Step 1 | Load two files (3); Load a source CSV and define the target template CSV once. (11) |
| Step 2 | Map target fields (3); Map columns, choose explicit transforms, and add strict rules. (9) |
| Step 3 | Inspect before export (3); Separate accepted rows from explained rejects and reuse the JSON recipe. (11) |
| Privacy section | Privacy and limits (3); Process CSV files on this device (6); Spreadsheet rows stay in your browser during normal and demo processing. (11); Review the exported CSV before importing it into your target service. (11); Read the privacy policy (4) |
| Plus section | Cleanroom Plus (2); Save unlimited recipes for $19 once (6); No subscription. (2); CSV export, recipe export, rejection reports, and safety checks stay free. (11) |
| Tiers | Free (1); Save one recipe and export every result. (7); Plus · $19 once (4); Unlimited saved recipes on this device. (6) |
| Footer | Local CSV preparation for strict imports. (6); Demo (1); Privacy (1); Terms (1); View Cleanroom Plus — $19 once (6) |
| Provenance | Built by Param Factory · v1.0.9 · Hero artwork generated for this product with factory-image. (15) |

Direct demo units are also plain and actionable: “Demo — sample data, nothing
is saved” (7), “This demo uses separate local storage.” (6), “Reset demo”
(2), and “Start for real” (3).

### README

| Location | Copy (words) |
| --- | --- |
| H1/introduction | CSV Import Cleanroom (3); CSV Import Cleanroom helps operations staff turn messy CSV files into strict import templates. (13); It works offline after the first visit. (7) |
| Workflow | Map source columns to target fields. (6); Apply named date, currency, or ID transforms. (7); Validate rows, explain rejects, and reuse an exported recipe. (9) |
| Link/H2 | Live product (2); Capabilities (1) |
| Capabilities | A one-click isolated sample demo (5); Free accepted-row CSV and reusable recipe JSON exports (8); Free rejection-report exports and one saved local recipe (8); Formula-like cells neutralized in every CSV export (7); Offline reload after the first visit (6) |
| Capabilities | Local limits of 10 MB and 50,000 data rows per file (11); Recipe JSON contains field names and rules, not spreadsheet rows (10); A $19 one-time Plus license with no subscription for unlimited on-device saved recipes (13); Normal work survives refresh until you reset it or delete a saved recipe (13) |
| Registry/demo notes | Every product promise and its test appears in `.factory/claims.json`. (9); The demo sandbox is documented in `.factory/demo.md`. (7) |
| Development | Develop and verify (3); Requires Node.js 20 or newer. (5); The required production build command is: (6); The build type-checks the app and bundles it with Vite. (10); It adds hashed assets to the offline cache and writes the site to `dist/`. (14) |
| Testing | Run verification with: (3); Playwright uses Chromium 1.58.2. (5); It checks demo isolation, conversion, exports, keyboard focus, the 390 px layout, offline reload, and serious or critical accessibility issues. (18) |
| Privacy/billing | Privacy and billing (3); During normal and demo processing, spreadsheet rows remain in the browser. (10); With a license present, verification is the only third-party background request. (11); It includes no spreadsheet rows and runs at most daily. (10) |
| Privacy/billing | Checkout and license verification use the Sociobot billing API. (9); No payment provider is embedded. (5); See `/privacy` and `/terms`. (4) |
| Deployment | Deployment (1); Deploy the contents of `dist/` as a static site with directory routing enabled. (13); Do not deploy the repository root. (6); The factory owns DNS and production registration of the billing product. (11) |
| References/license | The product brief and visual system are recorded in `.factory/brief.json` and `.factory/design.md`. (13); License (1); MIT. See LICENSE. (3) |

## Demo, claims, and privacy

The primary action enters `/?demo=1` in one click. The first post-click
mobile screen has the sticky isolation banner, Reset demo, Start for real,
the realistic `customer-source-sample.csv`, connected-field count, mapped
stage, and start of the mapping table. It is the product in use, not a second
pitch. The live demo request log contains same-origin resources only and no
console errors.

The exact `@claim:demo-isolation` test loaded real files, entered the sample,
reloaded/reset the demo, and returned to the unchanged real draft. It confirms
the documented `demo:csv-import-cleanroom` IndexedDB namespace rather than
only trusting the banner.

After `npm ci` in a clean clone, every exact command listed in
`.factory/claims.json` passed individually:

| Claim IDs | Result |
| --- | --- |
| demo-isolation; csv-export; formula-safe-export; offline-reload; on-device-processing | PASS |
| plus-price; file-limits; recipe-data-separation; conversion-workflow | PASS |
| license-request-policy; billing-route; free-tier-entitlements | PASS |
| local-data-lifecycle; no-tracking-resources; license-revocation | PASS |

The offline test performs an actual offline reload after service-worker
activation. The privacy tests record request/resource origins and private row
values. Every claim-like landing or README promise has a registry entry; the
instruction to review an export is advice, not an untested promise.

## Structure and accessibility

- `/`, `/?demo=1`, `/demo/`, `/privacy/`, `/terms/`, and `/offline.html`
  returned 200. An unknown route returns the designed 404 with HTTP 404.
- Every route has `lang=en`, one H1, a main landmark, route-specific
  title/description/canonical/OG/Twitter metadata, manifest, favicon, and
  Apple touch icon. Titles follow the required product/job pattern.
- Internal-link crawl found only 200 responses. The 404 page’s `#main` skip
  link is an in-document anchor; its actual Home and Demo destinations return
  200.
- Clean-clone checks passed for Back behavior, direct query demo, Home `#how`,
  Demo → How it works, heading focus, polite route announcement, keyboard
  operation, dialog trap, reduced motion, 44 px controls, metadata, sitemap,
  and offline fallback.
- Axe found no serious or critical issue on home, demo, mapping, empty and
  populated inspection, legal pages, or the license dialog.
- The sitemap exactly matches indexable built pages and excludes only the
  documented `noindex` 404. The warm calibration-bench art and instrument
  controls are specific to this product, not a generic SaaS template.

## Earlier findings confirmed

Every earlier review, polish record, and handoff was read. Each item below was
confirmed in current code and, where relevant, live behavior; none is merely
marked fixed.

| Earlier ID(s) | Current confirmation |
| --- | --- |
| F-1-1 | Demo opens mapped sample work in the first mobile viewport. |
| F-1-2 | `tests/e2e/update.spec.ts` passed; it verifies waiting worker, activation, controller change, and new cache. |
| F-1-3 | Route, fragment, Back, heading-focus, and announcement tests pass. |
| F-1-4 | Stage changes focus the workspace heading. |
| F-1-5 | Home, demo, legal, offline, and 404 share navigation and footer content. |
| F-1-6 | Home has dedicated privacy/limits and Free/Plus sections. |
| F-1-7 | Complete route metadata is live. |
| F-1-8 | Unsupported source-immutability wording is absent. |
| F-1-9 | `billing-route` is registered and passes. |
| F-1-10 | Home title names the job plainly. |
| F-1-11 | Hero label names map/validate/export work. |
| F-1-12 | Caption is qualified and conversion-tested. |
| F-1-13 | Workspace label names the CSV import workspace. |
| F-1-14 | Workspace heading names the two CSV files. |
| F-1-15 | Runtime uses Map/mapping and Back to mapping; no wiring term remains. |
| F-1-16 | How label names CSV cleanup. |
| F-1-17 | Recipe heading names reusable settings. |
| F-1-18 | Source and target controls have distinct accessible names. |
| F-1-19 | Plus controls name their result and price. |
| F-1-20 | Source CSV, target template, recipe, inspection, and demo terms are consistent. |
| F-1-21 | Privacy, Terms, and 404 H1s identify their pages. |
| F-1-22 | README begins with a plain job statement. |
| F-1-23 | README workflow uses short task sentences. |
| F-1-24 | README build copy is split and below the cap. |
| F-1-25 | README test copy is short and specific. |
| F-1-26 | Registry coverage and retained product/legal promises pass. |
| F-2-1 | Demo identity/reset/exit controls remain visible on mobile. |
| F-2-2 | Home → Demo/Privacy → Back restores home, title, focus, and announcement. |
| F-2-3 | Free rejection report, one saved recipe, and Plus gate are tested. |
| F-2-4 | Demo uses valid H1/H2 structure and passes heading-order Axe check. |
| F-3-1 | `#workspace` and `#how` focus the right destination heading. |
| F-3-2 | Offline fallback is self-hosted, styled, metadata-complete, and clean. |
| F-3-3 | Refresh/delete/reset lifecycle is registered and tested. |
| F-3-4 | Product routes have no tracking resources, cookies, remote fonts, or CDNs. |
| F-3-5 | Refunded, revoked, expired, and wrong-product licenses remain locked. |
| F-3-6 | Unsupported entitlement wording is absent; retained free claims are tested. |
| F-3-7 | Header/footer say View Cleanroom Plus — $19 once. |
| F-3-8 | Inspection export label names the result. |
| F-3-9 | Formula notice says values will be escaped. |
| F-3-10 | Runtime messages name restore, failure, and reset states plainly. |
| F-3-11 | 404 uses CSV-workspace and sample-data action names. |
| F-3-12 | Manifest wording/start URL and generated worker cache version are current. |
| F-4-1 | Sitemap includes `/offline.html`; only the noindex 404 is omitted. |

## Missed leverage

The brief’s local conversion job is complete: named transforms, validation,
target-field reject reasons, recipe reuse, accepted CSV export, rejection
report export, and recipe JSON export are present. An AI feature is not implied
by this local-first job and would add an unnecessary key/network path. No
missing import, export, sync, or AI feature is identified.

## What would make this perfect

No corrective work is identified in this round. Preserve the direct sample
entry, isolated demo namespace, explicit claim tests, and calibration-bench
visual identity in future changes.

## Verification

```text
npm ci
npm test                         PASS — 9 tests
npm run lint                     PASS
npm run build                    PASS — dist/ produced
npm run test:e2e -- tests/e2e/update.spec.ts
                                 PASS
```

All 15 exact claim commands also passed individually. Targeted checks for Axe,
metadata, route inventory, offline fallback, keyboard/reduced-motion behavior,
390 px layout, demo controls, and route focus passed.
