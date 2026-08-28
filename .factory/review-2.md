# Adversarial first-read review 2 — CSV Import Cleanroom

**Verdict: FAIL**

Reviewed 2026-08-28 UTC against the live site at <https://csv-import-cleanroom.sociobot.in> and repository commit c3e6da677d642e9d05ee552a6ea56094538a5c24. There are two blocking and two minor findings. PASS requires zero findings and no untested claim.

## Thirty-second cold read

Fresh browser contexts at 390 × 844 and 1440 × 900 were opened before scrolling.

- **What does this do?** It prepares a messy CSV for a target import template by mapping, validating, and exporting rows.
- **For whom?** Operations staff and solo admins preparing a strict import.
- **What should I click first?** **Try it with sample data**; its adjacent note promises a mapped import with one explained rejection.

The first landing screen answers all three questions. It returned HTTP 200, had no console errors, and had no horizontal overflow at 390 px. The demo state does not keep its required sandbox controls visible (F-2-1).

## Findings

| ID | Severity | Exact quote / location | Why this fails | Concrete fix |
| --- | --- | --- | --- | --- |
| F-2-1 | **BLOCKING** | Fresh /demo/ at 390 × 844 focuses and scrolls to **“CSV import workspace · customer-source-sample.csv”**. The required banner **“Demo — sample data, nothing is saved”**, **“Reset demo”**, and **“Start for real”** are at y=-141 after the settled load, outside the viewport. The landing CTA has the same settled state. | The first visible product screen is useful, but it does not identify itself as a sandbox or expose the exit/reset controls. A visitor can mistake sample work for real work. This fails the required persistent demo banner. | Keep a compact demo-status bar sticky below the masthead while demo mode is active, containing the exact isolation message, Reset demo, and Start for real. Alternatively do not focus-scroll on initial demo load, but the banner must remain visible while working. Add a 390 px test that waits for the settled demo state and asserts all three controls intersect the viewport. |
| F-2-2 — carry-forward of F-1-3 | **BLOCKING** | From Home, click header **“Privacy”** or **“Demo”**, then press Back once. The address bar becomes https://csv-import-cleanroom.sociobot.in/, but the destination document remains: Privacy retains title **“Privacy — CSV Import Cleanroom”** and H1 **“How your CSV data is handled”**; Demo retains title **“Demo — CSV Import Cleanroom”** and the sample workspace. | Back/forward does not restore the correct route, title, document, focus, or announcement. The earlier routing finding is half-fixed: history.pushState() followed by location.replace() creates an entry whose URL says Home while it renders the destination. | Use one routing model. Prefer ordinary same-origin links/full document navigations for these static routes, with no preceding pushState; or implement all routes in one SPA and render on popstate. Add regression tests for Home → Demo → Back and Home → Privacy → Back that assert URL, title, H1, focused heading, and route announcement all match Home. |
| F-2-3 | Minor | Landing Plus section: **“CSV export, recipe export, rejection reports, and safety checks stay free.”** and **“One saved recipe and all exports.”** | These are visitor-facing entitlement claims. csv-export proves accepted CSV and recipe JSON export; formula-safe-export proves formula neutralization; neither claim/test proves free rejection-report export or the one-free-recipe limit. | Add free-tier-entitlements to claims.json: in a fresh demo, export a rejection report and save one recipe without a license, then assert a second save opens Plus. Or narrow the copy to the already tested CSV/recipe export promise. |
| F-2-4 | Minor | Live /demo/: H1 **“CSV import workspace · customer-source-sample.csv”** is followed by H3 **“Saved recipes”**, without an H2. Live Axe reports heading-order (moderate). | The outline skips a level, so screen-reader heading navigation does not describe the workspace structure correctly. | Make **“Saved recipes”** an H2, or introduce a named H2 section that contains it. Re-run Axe on the settled demo mapping screen and assert no heading-order violation. |

## Copy audit

Word counts use whitespace-delimited words. Buttons, headings, labels, and repeated navigation copy are included because visitors and assistive technology read them. No unit exceeds 22 words; no banned marketing adjective, metaphor, jargon-heavy heading, or non-result button label was found. F-2-3 marks the two unlisted entitlement statements.

### Landing page — initial state

| Location | Copy unit | Words | Result |
| --- | --- | ---: | --- |
| Header brand | CSV Import Cleanroom | 3 | Pass |
| Header nav | Demo; How it works; Privacy | 1; 3; 1 | Pass |
| Header action | Unlock Plus | 2 | Pass |
| Network strip | Local processing ready | 3 | Pass |
| Network strip | Files never leave this device | 5 | on-device-processing |
| Hero eyebrow | Map, validate, and export CSV rows | 6 | Pass |
| Hero H1 | Prepare CSV imports. | 3 | Pass |
| Hero lede | For operations staff and solo admins preparing a target template from messy spreadsheets. | 13 | Pass |
| Hero actions | Try it with sample data; Open your files | 5; 3 | Pass |
| Hero note | The sample opens a mapped import with one explained rejection. | 10 | demo-isolation, conversion-workflow |
| Hero facts | Files stay on this device; Works offline after first visit; $19 once for unlimited recipes | 5; 5; 5 | on-device-processing; offline-reload; plus-price |
| Hero caption | Accepted rows follow your target template. | 6 | conversion-workflow |
| Workspace eyebrow | CSV import workspace | 3 | Pass |
| Workspace H2 | Choose the source and target CSV files | 7 | Pass |
| Stages | Load; Source + target template; Map; Map + transform; Inspect; Validate + export | 1; 4; 1; 3; 1; 3 | Pass |
| Source labels | Input A; CSV; Messy source CSV | 2; 1; 3 | Pass |
| Source help/action | The rows you need to clean.; Choose source CSV | 6; 3 | Pass |
| Target labels | Input B; Target template CSV | 2; 3 | Pass |
| Target help | An empty template or example export. | 6 | Pass |
| Target help | Its header defines the output. | 5 | conversion-workflow |
| Target action | Choose target template CSV | 4 | Pass |
| Limits | Local limits; CSV only; 10 MB per file; 50,000 data rows; UTF-8 recommended | 2; 2; 4; 3; 2 | file-limits for numeric limits; otherwise Pass |
| Workspace actions | Use sample files; Map target fields | 3; 3 | Pass |
| How eyebrow/H2 | How CSV cleanup works; Reuse the same import settings | 4; 5 | Pass |
| Step 1 | Load two files; Load a source CSV and define the target template CSV once. | 3; 11 | Pass |
| Step 2 | Map target fields; Map columns, choose explicit transforms, and add strict rules. | 3; 9 | conversion-workflow |
| Step 3 | Inspect before export; Separate accepted rows from explained rejects and reuse the JSON recipe. | 3; 11 | conversion-workflow |
| Privacy eyebrow/H2 | Privacy and limits; Process CSV files on this device | 3; 6 | Pass |
| Privacy copy | Spreadsheet rows stay in your browser during normal and demo processing. | 11 | on-device-processing |
| Privacy copy/link | Review the exported CSV before importing it into your target service.; Read the privacy policy | 11; 4 | Pass; instruction, not promise |
| Pricing eyebrow/H2 | Cleanroom Plus; Save unlimited recipes for $19 once | 2; 6 | plus-price |
| Pricing copy | No subscription. | 2 | plus-price |
| Pricing copy | CSV export, recipe export, rejection reports, and safety checks stay free. | 11 | **F-2-3** |
| Free tier | Free; One saved recipe and all exports. | 1; 6 | **F-2-3** for entitlement |
| Plus tier | Plus · $19 once; Unlimited saved recipes on this device. | 4; 6 | plus-price |
| Pricing action | View Cleanroom Plus — $19 once | 6 | Pass |
| Footer copy | Local CSV preparation for strict imports. | 6 | Pass |
| Footer links | Demo; Privacy; Terms | 1; 1; 1 | Pass |
| Footer action | View Cleanroom Plus — $19 once | 6 | Pass |
| Footer provenance | Built by Param Factory · v1.0.6 · Hero artwork generated for this product with factory-image. | 15 | Pass; provenance matches design record |

### README

| Location | Copy unit | Words | Result |
| --- | --- | ---: | --- |
| H1 | CSV Import Cleanroom | 3 | Pass |
| Intro | CSV Import Cleanroom helps operations staff turn messy CSV files into strict import templates. | 14 | conversion-workflow |
| Intro | It works offline after the first visit. | 7 | offline-reload |
| Intro | Map source columns to target fields. | 6 | conversion-workflow |
| Intro | Apply named date, currency, or ID transforms. | 7 | conversion-workflow |
| Intro | Validate rows, explain rejects, and reuse an exported recipe. | 9 | conversion-workflow |
| Link label | Live product | 2 | Pass |
| H2 | Capabilities | 1 | Pass |
| Capability | A one-click isolated sample demo | 5 | demo-isolation |
| Capability | Free accepted-row CSV and reusable recipe JSON exports | 8 | csv-export |
| Capability | Formula-like cells neutralized in every CSV export | 7 | formula-safe-export |
| Capability | Offline reload after the first visit | 6 | offline-reload |
| Capability | Local limits of 10 MB and 50,000 data rows per file | 11 | file-limits |
| Capability | Recipe JSON contains field names and rules, not spreadsheet rows | 10 | recipe-data-separation |
| Capability | A $19 one-time Plus license with no subscription for unlimited on-device saved recipes | 13 | plus-price |
| Claims note | Every product promise and its test appears in .factory/claims.json. | 9 | Pass |
| Demo note | The demo sandbox is documented in .factory/demo.md. | 7 | Pass |
| H2 | Develop and verify | 3 | Pass |
| Requirement | Requires Node.js 20 or newer. | 5 | Pass |
| Build lead-in | The required production build command is: | 6 | Pass |
| Build | The build type-checks the app and bundles it with Vite. | 10 | Pass |
| Build | It adds hashed assets to the offline cache and writes the site to dist/. | 14 | Pass |
| Test lead-in | Run verification with: | 3 | Pass |
| Test | Playwright uses Chromium 1.58.2. | 4 | Pass |
| Test | It checks demo isolation, conversion, exports, keyboard focus, the 390 px layout, offline reload, and serious or critical accessibility issues. | 20 | Pass |
| H2 | Privacy and billing | 3 | Pass |
| Privacy | During normal and demo processing, spreadsheet rows remain in the browser. | 11 | on-device-processing |
| Privacy | With a license present, verification is the only third-party background request. | 11 | license-request-policy |
| Privacy | It includes no spreadsheet rows and runs at most daily. | 10 | license-request-policy |
| Billing | Checkout and license verification use the Sociobot billing API. | 9 | billing-route |
| Billing | No payment provider is embedded. | 5 | billing-route |
| H2 | Deployment | 1 | Pass |
| Deployment | Deploy the contents of dist/ as a static site with directory routing enabled. | 13 | Pass |
| Deployment | Do not deploy the repository root. | 6 | Pass |
| Deployment | The factory owns DNS and production registration of the billing product. | 11 | Pass |
| Documentation | The product brief and visual system are recorded in .factory/brief.json and .factory/design.md. | 12 | Pass |
| H2 | License | 1 | Pass |
| License | MIT.; See LICENSE. | 1; 2 | Pass |

All README sentences are 22 words or fewer. Vocabulary is consistent: source CSV, target template, recipe, inspection, and demo.

## Demo, sandbox, and privacy checks

- The landing CTA reaches /demo/ in one click. The realistic sample has a three-row customer source, five target fields, explicit ID/date/currency transforms, two accepted rows, one explained email rejection, and formula-like input.
- Reset restored a deliberately cleared Customer ID mapping. Start for real preserved a separately seeded normal draft named real-private.csv / real-template.csv.
- A fresh direct live /demo/ context used demo:csv-import-cleanroom IndexedDB. Source confirms normal work uses csv-import-cleanroom, and demo reset/exit clears only the selected demo namespace.
- A normal-file → demo → inspection request log had only csv-import-cleanroom.sociobot.in URLs, no spreadsheet value, no third-party script, and no console error.
- After service-worker activation, an offline live /demo/ reload restored customer-source-sample.csv and its mapping workspace. The initial blank render resolves before the asynchronous sample load; the settled state passes.
- The isolation mechanics pass. F-2-1 is specifically that the required demo banner/actions are scrolled out of sight in that settled state.

## Registered claim tests

All listed commands ran individually from fresh clone /tmp/csv-cleanroom-review-2-7pC3jk after npm ci; all passed.

| Claim | Exact listed command | Result |
| --- | --- | --- |
| demo-isolation | npm run test:e2e -- --grep @claim:demo-isolation | PASS |
| csv-export | npm run test:e2e -- --grep @claim:csv-export | PASS |
| formula-safe-export | npm run test:e2e -- --grep @claim:formula-safe-export | PASS |
| offline-reload | npm run test:e2e -- --grep @claim:offline-reload | PASS |
| on-device-processing | npm run test:e2e -- --grep @claim:on-device-processing | PASS |
| plus-price | npm run test:e2e -- --grep @claim:plus-price | PASS |
| file-limits | npm test -- --testNamePattern @claim:file-limits | PASS |
| recipe-data-separation | npm run test:e2e -- --grep @claim:recipe-data-separation | PASS |
| conversion-workflow | npm run test:e2e -- --grep @claim:conversion-workflow | PASS |
| license-request-policy | npm run test:e2e -- --grep @claim:license-request-policy | PASS |
| billing-route | npm run test:e2e -- --grep @claim:billing-route | PASS |

F-2-3 is the only landing claim-like copy that does not have a matching claim entry/test.

## Structure, accessibility, links, and identity

Confirmed:

- /, /demo/, /privacy/, and /terms/ return 200. A random missing path returns the designed 404 with HTTP 404 and a way back.
- Checked routes have expected title, description, canonical, Open Graph/Twitter metadata, SVG favicon, Apple touch icon, manifest, lang=en, one H1, and one main. robots.txt and sitemap.xml are present.
- Every discovered same-origin link returned 200; mailto links are explicit. Live headers include CSP with frame-ancestors, X-Content-Type-Options, and Referrer-Policy.
- Live Axe scans have zero serious or critical violations on landing, demo, privacy, and terms. The demo has one moderate heading-order violation (F-2-4).
- Fresh landing and demo loads have no console errors. Chromium reports the expected 404 status as a console network error for the intentionally missing route, while the designed page renders correctly.
- The original calibration-bench art, paper/enamel palette, typography, stage plates, and data-first workbench layout match .factory/design.md and are not a generic SaaS template.
- No AI feature is justified. Mapping, validation, and export are deterministic; AI would add privacy/network risk without an implied missing capability. Recipe import/export is present.

The broken Home → destination → Back sequence is blocking F-2-2 despite otherwise valid deep links and metadata.

## Earlier-review history

Every prior review/polish/handoff item was checked against live behavior and code, not accepted from its status label.

| Earlier finding | Result this round |
| --- | --- |
| F-1-1 | Mapped sample data is in the first demo viewport. **Not fully closed:** required banner controls are not visible after automatic focus scroll (F-2-1). |
| F-1-2 | Fixed: update test waits for waiting, activates, waits for navigation/controller change, and passed --repeat-each=3. |
| F-1-3 | **Reopened as F-2-2:** Back changes the URL to Home but leaves the Demo/Privacy document rendered. |
| F-1-4 | Fixed: stage changes call focusStage(); inspection focused the workspace heading. |
| F-1-5 | Fixed: legal and 404 routes include common wordmark/nav/footer/legal links/factory credit/version. |
| F-1-6 | Fixed: landing has dedicated privacy/limits and Free/Plus sections. |
| F-1-7 | Fixed: route-specific canonical, OG, Twitter, manifest, favicon, and Apple-touch metadata are live. |
| F-1-8 | Fixed: unsupported source-immutability promise was removed. |
| F-1-9 | Fixed: billing-route is registered and passes. |
| F-1-10 | Fixed: plain Home title. |
| F-1-11 | Fixed: hero eyebrow names the work. |
| F-1-12 | Fixed: caption is qualified and conversion-specific. |
| F-1-13 | Fixed: workspace eyebrow names the workspace. |
| F-1-14 | Fixed: workspace heading explains the two files. |
| F-1-15 | Fixed: Map vocabulary is used consistently. |
| F-1-16 | Fixed: How eyebrow names section contents. |
| F-1-17 | Fixed: recipe heading explains reuse. |
| F-1-18 | Fixed: source/template file controls have distinct names. |
| F-1-19 | Fixed: Plus trigger names its result. |
| F-1-20 | Fixed: source CSV, target template, recipe, inspection, and demo terms are consistent. |
| F-1-21 | Fixed: legal/404 H1s identify pages plainly. |
| F-1-22 | Fixed: README introduction is plain and split. |
| F-1-23 | Fixed: README workflow has one usable idea per sentence. |
| F-1-24 | Fixed: README build copy is below 22 words. |
| F-1-25 | Fixed: README test copy is below 22 words. |
| F-1-26 | Fixed: README claim note is understandable and links the registry. |

## Local gates

From the same fresh clone:

~~~text
npm test                                                PASS (9/9)
npm run lint                                            PASS
npm run build                                           PASS (dist/ produced)
npm run test:e2e                                        PASS (27/27)
npm run test:e2e -- tests/e2e/update.spec.ts --repeat-each=3  PASS (3/3)
~~~

## What would make this perfect

Keep the demo identity and Reset/Start controls visible while the sample workspace is on screen. Remove the mixed pushState plus location.replace route transition and verify back/forward with real browser history. Register and prove each free-tier entitlement. Repair the demo heading outline. Then re-run the cold mobile/desktop review, all claim commands, offline/request-log tests, route-history tests, link crawl, and live Axe scan. No AI feature or additional marketing section is needed.
