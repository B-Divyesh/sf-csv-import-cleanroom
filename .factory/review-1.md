# Adversarial first-read review 1 — CSV Import Cleanroom

**Verdict: FAIL**

Reviewed 2026-08-28 UTC against <https://csv-import-cleanroom.sociobot.in> and base `f924f70cbe6154eda0a936d5e2955012382ad53c`. There are 26 findings: 2 blocking, 7 major, and 17 minor. PASS requires zero findings.

## Thirty-second first read

Fresh contexts were used at 390 × 844 and 1440 × 900. Before scrolling, my answers were:

- **What does it do?** It prepares a messy CSV for a strict import, validates it, and does not alter the source.
- **For whom?** Operations staff and solo administrators preparing SaaS imports.
- **What should I click first?** **Try it with sample data**; the adjacent note says it opens a mapped import with one explained rejection.

All three answers are present on the first screen, so the cold landing screen passes. The live page returned 200, had no console errors, and had no horizontal overflow at 390 px. The next screen fails the demo requirement in F-1-1.

## Findings

| ID | Severity | Exact quote/location | Why this fails | Concrete fix |
| --- | --- | --- | --- | --- |
| F-1-1 | **BLOCKING** | After **“Try it with sample data”**, `/demo/` shows the banner and complete hero. At 390 × 844 the workspace starts at y=1192 and mapping table at y=1676; at 1440 × 900 they start at y=938 and y=1290. | The first post-click screen is another pitch, not the product in use. The seeded data exists but requires scrolling. | Put the seeded workspace directly below the demo banner, or compact/remove the hero and scroll/focus the workspace. Test that a sample name plus a mapping/result is inside the initial 390 px and desktop viewports. |
| F-1-2 | **BLOCKING** | Prior handoff: **“One first aggregate Playwright run had a non-reproducible service-worker update-test failure before its update notice rendered”** and **“Stabilize the test’s worker lifecycle/waiting logic.”** It supplied no ID, so this is the carry-forward ID. | Only docs changed after the accepted candidate; `tests/e2e/update.spec.ts` did not. One standalone pass, the full-suite pass, and five repeated passes do not constitute the required code-level fix for the recorded race. The work order makes an unfixed handoff finding blocking. | Wait explicitly for the replacement worker to reach `installed`/`waiting`, assert the notice from that state, activate it, and wait for `controllerchange`. Isolate the generated worker fixture per run, then confirm repeated aggregate runs. |
| F-1-3 | Major | Header **“Privacy”** performs a document navigation; **“How it works”** changes the hash. After either, focus is `BODY`; `/privacy/` has no live region. Back returns to `/` with focus on `BODY`. | Internal navigation does not use the required `pushState`, destination-heading focus, or route announcement. | Implement History API routing for internal routes; restore back/forward state; focus the destination `h1` or section heading with `tabindex="-1"`; announce it in one persistent polite live region. Test direct, back, forward, and focus behavior. |
| F-1-4 | Major | Demo **“Run inspection”**: after keyboard activation, inspection renders and announces **“2 accepted, 1 rejected”**, but focus becomes `BODY`. | A stage change removes the focused control and returns keyboard users to the start of the document. | Focus the active stage heading/summary after every stage-changing render. Test Load → Map, Map → Inspect, Back, Reset, and recipe import. |
| F-1-5 | Major | `/privacy/` and `/terms/` headers contain only the wordmark; footers contain **“Return to the cleanroom”** and one legal link. The 404 is similarly reduced. | These routes drop the common navigation, one-liner, both legal links, factory credit, and version/build ID required on every route. | Reuse one header/footer skeleton on home, demo, legal, and 404 routes. |
| F-1-6 | Major | On `/`, `#how` is followed immediately by the footer. Pricing appears only as **“$19 once for unlimited recipes”** and in an **“Unlock Plus”** modal. | The required landing order lacks explicit privacy/non-goals and paid-tier sections. Hero facts and a modal are not scannable substitutes. | Add a local-processing/non-goals section, then a visible Free versus Plus section with `$19 once`, no subscription, and exact unlocks. |
| F-1-7 | Major | `/demo/` lacks Twitter title/description/image. `/privacy/` and `/terms/` also lack `og:url` and `og:type`. The 404 lacks canonical, OG, Twitter, apple-touch, and manifest metadata. | Route metadata is incomplete and shared previews can be inconsistent. | Add the complete route-specific canonical/OG/Twitter/icon metadata set. If a noindex 404 intentionally omits canonical, document and test that exception. |
| F-1-8 | Major | Hero **“Keep the source intact.”**; load card **“This file is only read.”**; steps **“Your untouched source…”** | No claim entry tests source-file immutability. `on-device-processing` checks request destinations, not unchanged source bytes. | Add `source-immutability` with a test that runs/export transforms from a temporary file, then compares its bytes and stored source rows; or remove all three promises. |
| F-1-9 | Major | README: **“Checkout and license verification use the Sociobot billing API; no payment provider is embedded.”** | `license-request-policy` covers background verification only. The checkout route and no-embed promise are unlisted. | Add `billing-route` and test the Buy href, absence of payment iframes/scripts, and no provider request before explicit activation; or remove the sentence. |
| F-1-10 | Minor | Home `<title>`: **“CSV Import Cleanroom — Local CSV preflight”** | “Preflight” does not plainly name the job. | Use **“CSV Import Cleanroom — Prepare CSV imports”**. |
| F-1-11 | Minor | Hero eyebrow **“A preflight bench for strict imports”** | It is metaphorical and adds no usable information beyond the headline. | Use **“Map, validate, and export CSV rows”**, or remove it. |
| F-1-12 | Minor | Figure caption **“Source in. Exact template out.”** | This is an absolute slogan; “exact” is unqualified and the fragments do not explain mapping/rejection behavior. | Use **“Accepted rows follow your target template.”** and include it in `conversion-workflow` if retained as a promise. |
| F-1-13 | Minor | Workspace eyebrow **“Conversion console”** | It is a metaphor, not the section’s contents. | Use **“CSV import workspace”**. |
| F-1-14 | Minor | Workspace H2 **“Set up the bench”** | Out of context, it does not say that two CSV files are needed. | Use **“Choose the source and target CSV files”**. |
| F-1-15 | Minor | Stage **“Wire”**, detail **“Map + transform”**, action **“Wire target fields”**; README says **“maps fields.”** | One operation has two names, and “wire” is metaphor rather than the user’s job. | Use **“Map”**, **“Map + transform”**, and **“Map target fields”** throughout. |
| F-1-16 | Minor | Steps eyebrow **“Built for repeat work”** | It is a benefit slogan, not a section name. | Use **“How CSV cleanup works”** or make **“How it works”** the actual heading. |
| F-1-17 | Minor | `#how` H2 **“The recipe is the artifact.”** | “Artifact” is internal jargon and does not say the settings can be reused. | Use **“Reuse the same import settings”**. |
| F-1-18 | Minor | Both file labels are **“Choose CSV.”** | Screen-reader and voice-control users cannot distinguish source from target control by accessible name. | Use **“Choose source CSV”** and **“Choose target template CSV.”** |
| F-1-19 | Minor | Footer button **“Cleanroom Plus · $19 once”** | It is a noun/price, not an action; it opens license details. | Use **“View Cleanroom Plus — $19 once”** or **“Buy Cleanroom Plus — $19 once”**, matching the next result. |
| F-1-20 | Minor | **“strict SaaS import template,” “Target template CSV,”** and **“target service’s header template”** | The terminology table specifies “target template,” but live copy adds competing forms. | Define it once as **“target template CSV”**, then use **“target template”** thereafter. |
| F-1-21 | Minor | Privacy H1 **“Your spreadsheets stay yours.”**; Terms H1 **“Use the bench; verify the result.”**; 404 H1 **“This bench does not exist.”** | These slogans/metaphors do not identify their pages when read alone. | Use **“How your CSV data is handled”**, **“Terms for CSV Import Cleanroom”**, and **“Page not found.”** |
| F-1-22 | Minor | README: **“CSV Import Cleanroom is an offline-first browser utility for operations staff preparing a messy CSV for a strict SaaS import template.”** (21 words) | “Offline-first browser utility” is avoidable jargon and delays the job statement. | **“CSV Import Cleanroom helps operations staff turn messy CSV files into strict import templates. It works offline after the first visit.”** |
| F-1-23 | Minor | README: **“It maps fields, runs named date, currency, and ID transforms, validates each row, explains rejects, and restores mappings from exported recipe JSON.”** (22 words) | It meets the cap but violates one idea per sentence. | **“Map source columns to target fields. Apply named date, currency, or ID transforms. Validate rows, explain rejects, and reuse an exported recipe.”** |
| F-1-24 | Minor | README build description beginning **“It type-checks the app…”** (26 words) | It exceeds 22 words and combines four outcomes. | **“The build type-checks the app and bundles it with Vite. It adds hashed assets to the offline cache and writes the site to `dist/`.”** |
| F-1-25 | Minor | README test description beginning **“The Playwright suite uses Chromium 1.58.2…”** (29 words) | It exceeds 22 words and hides outcomes in a long list. | **“Playwright uses Chromium 1.58.2. It checks demo isolation, conversion, exports, keyboard focus, the 390 px layout, offline reload, and serious or critical accessibility issues.”** |
| F-1-26 | Minor | README: **“Every visitor-facing claim and its executable regression test is listed in `.factory/claims.json`.”** | “Visitor-facing” and “executable regression test” are internal jargon. | Use **“Every product promise and its test appears in `.factory/claims.json`.”** |

## Copy audit

Counts treat whitespace-separated compounds such as “offline-first” as one word. Repeated navigation labels are listed once with their repeated location. Code commands are excluded; the prose that introduces them is included.

### Live landing page `/`

| Location | Copy unit | Words | Result |
| --- | --- | ---: | --- |
| Skip link | Skip to workspace | 3 | OK |
| Header/footer | CSV Import Cleanroom | 3 | OK |
| Header/footer | Demo | 1 | OK |
| Header | How it works | 3 | OK |
| Header/footer | Privacy | 1 | OK |
| Header | Unlock Plus | 2 | OK |
| Status | Local processing ready | 3 | OK; `on-device-processing` |
| Status | Files never leave this device | 5 | OK; `on-device-processing` |
| Hero eyebrow | A preflight bench for strict imports | 6 | F-1-11 |
| Hero H1 | Prepare CSV imports. | 3 | OK |
| Hero H1 | Keep the source intact. | 4 | F-1-8 |
| Hero | For operations staff and solo admins preparing strict SaaS imports from messy spreadsheets. | 13 | OK |
| Hero button | Try it with sample data | 5 | OK |
| Hero link | Open your files | 3 | OK |
| Hero note | The sample opens a mapped import with one explained rejection. | 10 | OK; demo/conversion tests |
| Assurance | Files stay on this device | 5 | OK; `on-device-processing` |
| Assurance | Works offline after first visit | 5 | OK; `offline-reload` |
| Assurance | $19 once for unlimited recipes | 5 | OK; `plus-price` |
| Figure caption | Source in. | 2 | F-1-12 |
| Figure caption | Exact template out. | 3 | F-1-12 |
| Workspace eyebrow | Conversion console | 2 | F-1-13 |
| Workspace H2 | Set up the bench | 4 | F-1-14 |
| Stage | Load | 1 | OK |
| Stage detail | Source + template | 2 | F-1-20 |
| Stage | Wire | 1 | F-1-15 |
| Stage detail | Map + transform | 2 | F-1-15 |
| Stage | Inspect | 1 | OK |
| Stage detail | Validate + export | 2 | OK |
| Source card | Input A | 2 | OK |
| Source card H3 | Messy source CSV | 3 | OK |
| Source card | The rows you need to clean. | 6 | OK |
| Source card | This file is only read. | 5 | F-1-8 |
| Source control | Choose CSV | 2 | F-1-18 |
| Target card | Input B | 2 | OK |
| Target card H3 | Target template CSV | 3 | F-1-20 |
| Target card | An empty template or example export. | 6 | F-1-20 |
| Target card | Its header defines the output. | 5 | OK |
| Target control | Choose CSV | 2 | F-1-18 |
| Limits label | Local limits | 2 | OK |
| Limit | CSV only | 2 | OK |
| Limit | 10 MB per file | 4 | OK; `file-limits` |
| Limit | 50,000 data rows | 3 | OK; `file-limits` |
| Limit | UTF-8 recommended | 2 | OK |
| Workspace button | Use sample files | 3 | OK |
| Workspace button | Wire target fields | 3 | F-1-15 |
| Steps eyebrow | Built for repeat work | 4 | F-1-16 |
| Steps H2 | The recipe is the artifact. | 5 | F-1-17 |
| Step heading | Load two files | 3 | OK |
| Step | Your untouched source and the target service’s header template. | 9 | F-1-8, F-1-20 |
| Step heading | Name every decision | 3 | OK |
| Step | Map columns, choose explicit transforms, and add strict rules. | 9 | OK |
| Step heading | Inspect before export | 3 | OK |
| Step | Separate accepted rows from explained rejects and reuse the JSON recipe. | 11 | OK |
| Footer | Local CSV preparation for strict imports. | 6 | OK |
| Footer | Terms | 1 | OK |
| Footer button | Cleanroom Plus · $19 once | 4 | F-1-19 |
| Footer | Built by Param Factory · v1.0.5 · Hero artwork generated for this product with factory-image. | 13 | OK; provenance matches `.factory/design.md` |

No landing sentence exceeds 22 words. Its failures are jargon, metaphor, inconsistent terms, action labels, and unlisted claims.

### README

| Location | Copy unit | Words | Result |
| --- | --- | ---: | --- |
| H1 | CSV Import Cleanroom | 3 | OK |
| Intro | CSV Import Cleanroom is an offline-first browser utility for operations staff preparing a messy CSV for a strict SaaS import template. | 21 | F-1-22 |
| Intro | It maps fields, runs named date, currency, and ID transforms, validates each row, explains rejects, and restores mappings from exported recipe JSON. | 22 | F-1-23 |
| Link label | Live product | 2 | OK |
| H2 | Capabilities | 1 | OK |
| Capability | A one-click isolated sample demo | 5 | OK in tests; live presentation fails F-1-1 |
| Capability | Free accepted-row CSV and reusable recipe JSON exports | 8 | OK; `csv-export` |
| Capability | Formula-like cells neutralized in every CSV export | 7 | OK; `formula-safe-export` |
| Capability | Offline reload after the first visit | 6 | OK; `offline-reload` |
| Capability | Local limits of 10 MB and 50,000 data rows per file | 11 | OK; `file-limits` |
| Capability | Recipe JSON contains field names and rules, not spreadsheet rows | 10 | OK; `recipe-data-separation` |
| Capability | A $19 one-time Plus license with no subscription for unlimited on-device saved recipes | 13 | OK; `plus-price` |
| Claims note | Every visitor-facing claim and its executable regression test is listed in .factory/claims.json. | 12 | F-1-26 |
| Claims note | The demo sandbox is documented in .factory/demo.md. | 7 | OK |
| H2 | Develop and verify | 3 | OK |
| Requirement | Requires Node.js 20 or newer. | 5 | OK |
| Build lead-in | The required production build command is: | 6 | OK |
| Build description | It type-checks the app, builds with Vite, injects hashed assets into the service-worker precache, and writes the deployable site to dist/ with dist/index.html at its root. | 26 | F-1-24 |
| Test lead-in | Run verification with: | 3 | OK |
| Test description | The Playwright suite uses Chromium 1.58.2 and covers demo isolation, sample conversion/export, serious/critical axe checks in each workflow state, keyboard focus, a 390 px layout, and an offline reload. | 29 | F-1-25 |
| H2 | Privacy and billing | 3 | OK |
| Privacy | During normal and demo processing, spreadsheet rows remain in the browser. | 11 | OK; `on-device-processing` |
| Privacy | With a license present, verification is the only third-party background request. | 11 | OK; `license-request-policy` |
| Privacy | It includes no spreadsheet rows and runs at most daily. | 10 | OK; `license-request-policy` |
| Billing | Checkout and license verification use the Sociobot billing API; no payment provider is embedded. | 14 | F-1-9 |
| Legal links | See /privacy and /terms. | 4 | OK |
| H2 | Deployment | 1 | OK |
| Deployment | Deploy the contents of dist/ as a static site with directory routing enabled. | 13 | OK |
| Deployment | Do not deploy the repository root. | 6 | OK |
| Deployment | The factory owns DNS and production registration of the billing product. | 11 | OK |
| Documentation | The product brief and visual system are recorded in .factory/brief.json and .factory/design.md. | 12 | OK |
| H2 | License | 1 | OK |
| License | MIT. | 1 | OK |
| License | See LICENSE. | 2 | OK |

## Demo and sandbox verification

- One click from `/` reaches `/demo/`.
- The sample is realistic: `customer-source-sample.csv`, a five-column target, ID/date/currency transforms, two accepted rows, one rejected row, and a formula-like value.
- The persistent banner, **Reset demo**, and **Start for real** are present.
- Changing the first mapping from `Customer ID` to no source and pressing Reset restored `Customer ID`.
- A real draft named `real-private.csv` / `real-template.csv` survived entering, resetting, and leaving demo mode.
- IndexedDB used separate `csv-import-cleanroom` and `demo:csv-import-cleanroom` databases. Leaving demo deleted the demo database and retained the real database.
- The live normal → demo → reset → real flow made no cross-origin request and logged no console error.
- After service-worker activation, an offline `/demo/` reload restored the banner and sample with no external request.
- Despite those passes, the first demo viewport fails F-1-1.

## Claim test results

Every listed command was run individually after `npm ci` in a fresh clone of `f924f70cbe6154eda0a936d5e2955012382ad53c`.

| Claim | Listed command | Result |
| --- | --- | --- |
| `demo-isolation` | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS, 1 test |
| `csv-export` | `npm run test:e2e -- --grep @claim:csv-export` | PASS, 1 test |
| `formula-safe-export` | `npm run test:e2e -- --grep @claim:formula-safe-export` | PASS, 1 test |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS, 1 test |
| `on-device-processing` | `npm run test:e2e -- --grep @claim:on-device-processing` | PASS, 1 test |
| `plus-price` | `npm run test:e2e -- --grep @claim:plus-price` | PASS, 1 test |
| `file-limits` | `npm test -- --testNamePattern @claim:file-limits` | PASS, 1 run / 8 skipped |
| `recipe-data-separation` | `npm run test:e2e -- --grep @claim:recipe-data-separation` | PASS, 1 test |
| `conversion-workflow` | `npm run test:e2e -- --grep @claim:conversion-workflow` | PASS, 1 test |
| `license-request-policy` | `npm run test:e2e -- --grep @claim:license-request-policy` | PASS, 1 test |

The listed tests pass, but F-1-8 and F-1-9 are unlisted claim-like statements, so the claim audit is not complete.

## Structure, links, accessibility, and identity

Confirmed passes:

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200. A random missing path returns the designed 404 with HTTP 404.
- Every route has `lang="en"`, one `h1`, and one `main`.
- The home description, canonical, OG image, SVG favicon, apple-touch icon, manifest, robots file, and sitemap are present. The social image is 1200 × 630 and product-specific.
- All same-origin links/assets found in the crawl returned 200. The checkout endpoint responded 303 to Dodo-hosted checkout.
- Fresh live axe scans found zero violations on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`.
- The initial mobile page has no horizontal overflow. The built JavaScript is about 11.8 KB gzip.
- The warm calibration-bench art, palette, typography, controls, and original hero asset are distinct rather than a generic SaaS template.

Failures are in F-1-3 through F-1-7 and F-1-21.

## Earlier-review history

No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. The existing handoff contains one explicit low-severity follow-up about the service-worker update test. Its standalone run passed, the full 24-test run passed, and five repeated runs passed, but no implementation/test change addresses the recorded race; it is carried forward as blocking F-1-2 under the work order’s history rule.

## Full local gates

From the same fresh clone:

- `npm test`: PASS, 9/9.
- `npm run lint`: PASS.
- `npm run build`: PASS; `dist/` produced.
- `npm run test:e2e`: PASS, 24/24.
- `npm run test:e2e -- tests/e2e/update.spec.ts`: PASS, 1/1.
- `npm run test:e2e -- tests/e2e/update.spec.ts --repeat-each=5`: PASS, 5/5.

Green gates do not override the demo, history, claims, copy, routing, and structure findings.

## Missed leverage

No AI feature is justified. This is deterministic mapping, transformation, validation, and export; optional AI adds network/privacy risk without filling an obvious need. Recipe import/export exists, and sync would conflict with the local-first model unless introduced as an explicit opt-in product change. No missed-leverage finding is added.

## What would make this perfect

Resolve every finding above, especially by making the seeded workspace the first `/demo/` viewport, closing the recorded update-test race, registering every retained promise, and restoring the route/accessibility skeleton. Then rerun the cold 390 px and desktop review, every claim command, all gates, link/metadata crawl, request logging, offline reload, axe, keyboard focus, and history traversal. Do not add AI or another marketing section; after these repairs, the target is genuinely nothing left to do.
