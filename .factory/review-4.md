# Adversarial first-read review 4 — CSV Import Cleanroom

**Verdict: FAIL** — reviewed 2026-08-28 UTC against the live site and commit
`c8aabe0f3fb6572f702b620f523fd5e5650160c9`. PASS requires zero findings. One
minor finding remains.

## Thirty-second cold read

Fresh unauthenticated Chromium contexts at 390 × 844 and 1440 × 900, before any
scrolling, answered all three required questions.

- **What it does:** prepares a messy CSV for a target import template by mapping,
  validating, and exporting rows.
- **For whom:** operations staff and solo administrators preparing strict imports.
- **What to click:** **Try it with sample data**. The adjacent text says, **“The
  sample opens a mapped import with one explained rejection.”**

The home response was 200 with no console errors or mobile horizontal overflow.
The headline, audience sentence, action, consequence, and three plain facts are
all in the first screen at both sizes.

## Finding

| ID | Severity | Exact location | Why this fails | Concrete fix |
| --- | --- | --- | --- | --- |
| F-4-1 | Minor | Live `/sitemap.xml` and `public/sitemap.xml` list only `/`, `/demo/`, `/privacy/`, and `/terms/`. The deployment also exposes `/offline.html` and a designed `/404.html`. | The site-structure contract requires a sitemap listing every route. The missing-route request returned the designed error document with HTTP 404, so both omitted paths are verified routes. | Add the omitted URLs, or document and test a specific noindex exception for the 404 page while including the visitor-facing offline route. Add a route-inventory test that compares the sitemap with shipped routes. |

## Copy audit

Word counts are whitespace-delimited. Each visible copy unit is listed below;
form-option values are not landing sentences. No unit exceeds 22 words. No
banned marketing word, unexplained heading, inconsistent core term, or
non-result action was found. Claim IDs identify the test entry covering a
visitor-facing promise.

### Landing `/`

| Location | Copy unit (words) | Result |
| --- | --- | --- |
| Skip / brand | Skip to workspace (3); CSV Import Cleanroom (3) | Pass |
| Header | Demo (1); How it works (3); Privacy (1); View Cleanroom Plus — $19 once (6) | Pass |
| Network / announcement | Local processing ready (3); Files never leave this device (5); Home page loaded. (3) | `on-device-processing`; Pass |
| Hero | Map, validate, and export CSV rows (6); Prepare CSV imports. (3); For operations staff and solo admins preparing a target template from messy spreadsheets. (13) | Pass |
| Hero actions | Try it with sample data (5); Choose CSV files (3); The sample opens a mapped import with one explained rejection. (10) | Pass; `demo-isolation`, `conversion-workflow` |
| Hero facts / caption | Files stay on this device (5); Works offline after first visit (5); $19 once for unlimited recipes (5); Accepted rows follow your target template. (6) | `on-device-processing`; `offline-reload`; `plus-price`; `conversion-workflow` |
| Workspace / stages | CSV import workspace (3); Choose the source and target CSV files (7); Load (1); Map (1); Inspect (1); Source + target template (4); Map + transform (3); Validate + export (3) | Pass |
| Source input | Input A (2); CSV (1); Messy source CSV (3); The rows you need to clean. (6); Choose source CSV (3) | Pass |
| Target input | Input B (2); CSV (1); Target template CSV (3); An empty template or example export. (6); Its header defines the output. (5); Choose target template CSV (4) | `conversion-workflow`; Pass |
| Limits / actions | Local limits (2); CSV only (2); 10 MB per file (4); 50,000 data rows (3); UTF-8 recommended (2); Use sample files (3); Map target fields (3) | `file-limits`; Pass |
| How it works | How CSV cleanup works (4); Reuse the same import settings (5); Load two files (3); Load a source CSV and define the target template CSV once. (11) | `conversion-workflow`; Pass |
| Steps | Map target fields (3); Map columns, choose explicit transforms, and add strict rules. (9); Inspect before export (3); Separate accepted rows from explained rejects and reuse the JSON recipe. (11) | `conversion-workflow` |
| Privacy | Privacy and limits (3); Process CSV files on this device (6); Spreadsheet rows stay in your browser during normal and demo processing. (11); Review the exported CSV before importing it into your target service. (11); Read the privacy policy (4) | `on-device-processing`; Pass |
| Plus | Cleanroom Plus (2); Save unlimited recipes for $19 once (6); No subscription. (2); CSV export, recipe export, rejection reports, and safety checks stay free. (11) | `plus-price`; `csv-export`; `free-tier-entitlements`; `formula-safe-export` |
| Tiers / action | Free (1); Save one recipe and export every result. (7); Plus · $19 once (4); Unlimited saved recipes on this device. (6); View Cleanroom Plus — $19 once (6) | `free-tier-entitlements`; `plus-price`; Pass |
| Footer | Local CSV preparation for strict imports. (6); Demo (1); Privacy (1); Terms (1); View Cleanroom Plus — $19 once (6); Built by Param Factory · v1.0.8 · Hero artwork generated for this product with factory-image. (15) | Pass; provenance matches `design.md` |

### README

| Location | Copy unit (words) | Result |
| --- | --- | --- |
| H1 / intro | CSV Import Cleanroom (3); CSV Import Cleanroom helps operations staff turn messy CSV files into strict import templates. (14); It works offline after the first visit. (7) | `conversion-workflow`; `offline-reload` |
| Workflow | Map source columns to target fields. (6); Apply named date, currency, or ID transforms. (7); Validate rows, explain rejects, and reuse an exported recipe. (9) | `conversion-workflow` |
| Capabilities | Capabilities (1); A one-click isolated sample demo (5); Free accepted-row CSV and reusable recipe JSON exports (8); Free rejection-report exports and one saved local recipe (8) | `demo-isolation`; `csv-export`; `free-tier-entitlements` |
| More capabilities | Formula-like cells neutralized in every CSV export (7); Offline reload after the first visit (6); Local limits of 10 MB and 50,000 data rows per file (11); Recipe JSON contains field names and rules, not spreadsheet rows (10) | `formula-safe-export`; `offline-reload`; `file-limits`; `recipe-data-separation` |
| More capabilities | A $19 one-time Plus license with no subscription for unlimited on-device saved recipes (13); Normal work survives refresh until you reset it or delete a saved recipe (13) | `plus-price`; `local-data-lifecycle` |
| Documentation | Every product promise and its test appears in `.factory/claims.json`. (9); The demo sandbox is documented in `.factory/demo.md`. (7) | Pass |
| Development | Develop and verify (3); Requires Node.js 20 or newer. (5); The required production build command is: (6); The build type-checks the app and bundles it with Vite. (10); It adds hashed assets to the offline cache and writes the site to `dist/`. (14) | Pass |
| Tests | Run verification with: (3); Playwright uses Chromium 1.58.2. (4); It checks demo isolation, conversion, exports, keyboard focus, the 390 px layout, offline reload, and serious or critical accessibility issues. (20) | Pass |
| Privacy / billing | Privacy and billing (3); During normal and demo processing, spreadsheet rows remain in the browser. (11); With a license present, verification is the only third-party background request. (11); It includes no spreadsheet rows and runs at most daily. (10) | `on-device-processing`; `license-request-policy` |
| Billing | Checkout and license verification use the Sociobot billing API. (9); No payment provider is embedded. (5) | `billing-route` |
| Deployment | Deployment (1); Deploy the contents of `dist/` as a static site with directory routing enabled. (13); Do not deploy the repository root. (6); The factory owns DNS and production registration of the billing product. (11) | Pass |
| Close | The product brief and visual system are recorded in `.factory/brief.json` and `.factory/design.md`. (12); License (1); MIT. (1); See LICENSE. (2) | Pass |

The landing and README have no unlisted claim-like sentence.

## Demo, claims, and sandbox verification

- One click reached `/demo/`. Its settled first mobile viewport showed the mapped
  customer sample, demo banner, **Reset demo**, **Start for real**, and a focused
  workspace heading. Desktop matched.
- The realistic sample has five target fields, explicit ID/date/currency
  transforms, two accepted rows, and one explained email rejection. Reset restores
  it. The code separates `demo:csv-import-cleanroom` from normal
  `csv-import-cleanroom` IndexedDB storage; the independent isolation test proves
  normal work survives demo reset and exit.
- A fresh live demo inspection logged only same-origin requests and no spreadsheet
  value in a URL. After service-worker readiness, an offline reload retained the
  sample and demo banner.
- Every exact command in `.factory/claims.json` passed independently from a fresh
  `npm ci` clone: all 15 registered claims passed.

## Earlier findings and structure

All findings from reviews 1–3 were checked on live behavior and code, not their
marked status. They are fixed: first-viewport mapped demo/banner, storage
isolation, reset, history/back focus, route announcements, shared skeleton,
metadata, 404, demo heading order, entitlement and privacy claim coverage,
current PWA cache, and plain copy. F-4-1 is new.

Live `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, and `/offline.html` each
had `lang=en`, one H1, one main, route-specific title/description/canonical/OG/
Twitter metadata, icons, and no console errors. A random missing URL returned
the designed page with HTTP 404. All home links returned 200 or were valid
fragments. Home → Privacy → Back restored home title/H1/focus/announcement;
Demo → How it works reached `/#how` and focused that heading. Axe found no serious
or critical issue on all six routes. The instrument-panel design matches the
documented calibration-bench visual thesis and is distinct from a generic SaaS
template.

No missed AI feature is implied: this is a deterministic local mapping and
validation task, and recipe import/export already covers the obvious leverage.

## Local gates

```text
npm test          PASS (9/9)
npm run lint      PASS
npm run build     PASS (dist/ produced)
npm run test:e2e  PASS (37/37)
```

The built JavaScript is 12.03 kB gzip and CSS 5.11 kB gzip.

## What would make this perfect

Resolve F-4-1 with an explicit, tested sitemap route policy, then repeat the
cold mobile/desktop, claims, offline/request, route-crawl, and Axe checks.
