# Adversarial first-read review 3 — CSV Import Cleanroom

**Verdict: FAIL**

Reviewed 2026-08-28 UTC against <https://csv-import-cleanroom.sociobot.in> and repository commit `d227aa736d65378fc535b47399e84ba858e1ce86`. There are six blocking and ten minor findings. PASS requires zero findings and no untested claim.

## Thirty-second cold read

Fresh browser contexts at 390 × 844 and 1440 × 900 were opened before scrolling.

- **What does this do?** It maps and validates a messy CSV, then exports rows shaped for a target import template.
- **For whom?** Operations staff and solo administrators preparing spreadsheet imports.
- **What should I click first?** **Try it with sample data**. The adjacent sentence says it opens a mapped import with one explained rejection.

The first screen answers all three questions at both sizes. It returned HTTP 200, had no console error, and had no horizontal overflow at 390 px. The primary demo path is visually dominant. The secondary **Open your files** path has a destination-focus failure in F-1-3.

## Findings

### Blocking

| ID | Exact quote / location | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| F-3-1 | Desktop `/demo/` header: **“How it works”** has `href="#how"`, which resolves to `/demo/#how`. The demo document has no `id="how"`; the crawl reports `HASH-MISSING`. | This is a dead internal link. Clicking it only appends a fragment and does not reveal, scroll to, or focus any content. The site-structure contract makes broken routing blocking. | On demo, link to `/#how`, or omit the link. Add a live-equivalent test that opens `/demo/`, activates **How it works**, and asserts the destination URL, `#how-title` visibility, and focus. |
| F-1-3 — carry-forward | Home action **“Open your files”** links to `/#workspace`. At both 390 px and desktop, the workspace scrolls into view, but focus moves to **“Prepare CSV imports.”** instead of `#workspace-title`. `src/main.ts` sends every hash except `#how` to `document.querySelector('#page-title, #workspace-title')`, which always selects `#page-title` on Home. | The earlier internal-navigation finding is only partly fixed. A keyboard or screen-reader visitor activates a workspace action and is sent back to the hero in the focus order. The label also promises to open files, but the result is only navigation to the file controls. | Give `#workspace` its own branch in `focusRouteDestination()` and focus `#workspace-title`. Rename the action **Choose CSV files**. Test click, direct `/#workspace`, Back, and Forward at mobile and desktop widths. |
| F-1-8 — carry-forward | Home Open Graph and Twitter description: **“Prepare a strict SaaS import template locally without changing the source CSV.”** | The earlier untested source-immutability promise remains in shared-link metadata even though the visible copies were removed. `on-device-processing` checks network destinations; it does not compare source bytes or prove the source data is unchanged. This is an unlisted claim. | Remove the clause, for example: **“Map, validate, and export CSV rows locally for a strict target template.”** Alternatively add `source-immutability` to `claims.json` and compare source bytes and stored source rows before and after transforms/export. |
| F-1-15 — carry-forward | Inspection action in live `/demo/`: **“Adjust wiring”**. Source: `src/main.ts` inspection footer. | The earlier finding required **Map** terminology throughout, but the metaphor remains in a normal workflow state. This is a half-fixed earlier finding and conflicts with **Map**, **mapping**, and **Map target fields** elsewhere. | Rename it **Back to mapping** or **Adjust mapping**, update the entitlement test that locates the old label, and search all shipped states for `wire`/`wiring`. |
| F-1-26 — carry-forward | README: **“Every product promise and its test appears in `.factory/claims.json`.”** | The earlier rewrite removed jargon but left a statement that is now demonstrably false: F-1-8 and F-3-3 through F-3-6 identify promises with no claim entry. An operator following the README would incorrectly treat the registry as complete. | Register and test every retained promise, then keep the sentence; otherwise delete it. Add a registry-coverage check that inventories claim-bearing copy in metadata and legal pages. |
| F-3-2 | Live `/offline.html`: title **“Cleanroom is offline”**, H1 **“Bench power is offline.”**, no header/footer/description/canonical/OG metadata, and an inline `<style>`. The response CSP is `style-src 'self'`, so Chromium logs **“Applying inline style violates … style-src 'self'”** and renders an unstyled serif page. | This is a shipped, precached PWA route for offline failure. It has a console error, loses the product identity and route skeleton, and uses a metaphor instead of saying which page is unavailable. | Move the styles to a self-hosted CSS file and give the page the shared header/footer and metadata. Use title **“Offline — CSV Import Cleanroom”**, H1 **“This page is unavailable offline”**, and a plain **Return to CSV workspace** action. Add a Playwright check for its CSP, console, landmarks, metadata, Axe result, and offline rendering. |

### Minor

| ID | Exact quote / location | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| F-3-3 | Privacy, **Data stored on your device**: **“The app stores your active workspace and saved recipes in browser IndexedDB so work can survive a refresh.”** and **“You can remove active work with ‘Reset workspace,’ remove individual recipes in the recipe shelf, or clear this site’s browser data.”** | These are useful persistence and deletion promises, but no `claims.json` entry tests normal-workspace refresh, recipe deletion, and Reset workspace deletion. `demo-isolation` tests separation and restoration after leaving demo, not the full statements. | Add a `local-data-lifecycle` claim and test a normal draft across reload, Reset workspace, a saved recipe deletion, and the resulting IndexedDB records. Or narrow the policy to already tested behavior. |
| F-3-4 | Privacy, **Analytics and tracking**: **“There are no advertising pixels, third-party analytics, tracking cookies, remote fonts, or runtime CDN scripts in the app.”** | This is an unlisted privacy claim. `on-device-processing` records requests in one normal/demo flow, but does not assert cookies, all routes, or the DOM/resource types named here. | Add `no-tracking-resources` with a fresh-context test across every route that asserts no cookies, no third-party resource origins, no remote fonts, and no analytics/pixel elements. |
| F-3-5 | Terms, **Cleanroom Plus purchase**: **“A refunded, revoked, expired, or wrong-product license will no longer unlock Plus.”** | This license-state promise is absent from `claims.json`. Untagged fail-closed tests are not a registered claim test and do not cover all four states in this sentence. | Add `license-revocation` and a tagged fixture test for refunded, revoked, expired, and wrong-product responses, or state only the tested invalid-license behavior. |
| F-3-6 | Terms, **Cleanroom Plus purchase**: **“Core CSV export, rejection reports, safety behavior, accessibility features, and recipe JSON export remain free.”** | Export and formula-safety claims are registered, but **accessibility features remain free** is not represented or tested as an entitlement claim. | Remove “accessibility features” from the paid-entitlement sentence, or add it to `free-tier-entitlements` and assert all accessibility affordances remain available without a license. |
| F-3-7 | Home header button: **“Unlock Plus”**. | It opens a price/details dialog; it does not unlock anything. The action does not name its result, and “unlock” is banned marketing language unless it describes the literal result. | Use **View Cleanroom Plus — $19 once**, matching the landing and footer actions. |
| F-3-8 | Inspection eyebrow: **“Export rack”**. | This is a workshop metaphor, not a section name that explains its contents out of context. | Use **Export inspection results**. |
| F-3-9 | Inspection notice: **“Formula shield active.”** | “Shield” is metaphorical and the heading carries less information than the following explanation. | Use **Formula-like values will be escaped.** |
| F-3-10 | Runtime state copy in `src/main.ts`: **“Restoring the last local bench…”**, **“Bench stopped.”**, and **“Bench reset.”** | Loading, error, and confirmation messages use brand lore instead of naming the workspace state. **Bench stopped** also does not itself say what happened. | Use **Restoring your saved workspace…**, **Could not continue.**, and **Workspace reset.** Keep the specific cause and next action in the error body. |
| F-3-11 | 404 copy/actions: **“Return to the cleanroom…”**, **“Open the cleanroom”**, and **“Try the sample”**. | The page reintroduces the workshop metaphor and uses a different demo action from the rest of the product. The two links do not use the established result names. | Use **“Return to the CSV workspace or try it with sample data.”**, **Open CSV workspace**, and **Try it with sample data**. |
| F-3-12 | `public/manifest.webmanifest`: **“A local, repeatable preflight for strict CSV imports.”**; `start_url` is `/?v=1.0.5`. `public/sw.js` also declares `cleanroom-v1.0.5`, while the package and live footer are 1.0.7. | “Preflight” is unexplained jargon, and three shipped version identifiers disagree. Reusing the 1.0.5 cache prefix also leaves stale hashed assets under the current cache family. | Use **“Prepare strict CSV imports locally with reusable mappings and validation.”** Set the installed start URL to `/` or the current version, and update the service-worker cache version from one build source. |

## Copy audit

Counts are whitespace-delimited. Headings and controls are included because visitors and assistive technology encounter them as standalone copy. No landing or README sentence exceeds 22 words. The only landing action-copy flags are linked to findings above; README has no plain-language flag.

### Live landing page `/`

| Location | Copy unit | Words | Result |
| --- | --- | ---: | --- |
| Skip link | Skip to workspace | 3 | Pass |
| Header/footer brand | CSV Import Cleanroom | 3 | Pass |
| Header navigation | Demo; How it works; Privacy | 1; 3; 1 | Pass |
| Header action | Unlock Plus | 2 | F-3-7 |
| Network strip | Local processing ready | 3 | Pass |
| Network strip | Files never leave this device | 5 | `on-device-processing` |
| Route announcement | Home page loaded. | 3 | Pass |
| Hero eyebrow | Map, validate, and export CSV rows | 6 | Pass |
| Hero H1 | Prepare CSV imports. | 3 | Pass |
| Hero sentence | For operations staff and solo admins preparing a target template from messy spreadsheets. | 13 | Pass |
| Hero primary action | Try it with sample data | 5 | Pass |
| Hero secondary action | Open your files | 3 | F-1-3 |
| Hero sentence | The sample opens a mapped import with one explained rejection. | 10 | `demo-isolation`, `conversion-workflow` |
| Hero facts | Files stay on this device; Works offline after first visit; $19 once for unlimited recipes | 5; 5; 5 | Registered claims |
| Figure caption | Accepted rows follow your target template. | 6 | `conversion-workflow` |
| Workspace eyebrow | CSV import workspace | 3 | Pass |
| Workspace H2 | Choose the source and target CSV files | 7 | Pass |
| Stages | Load; Source + target template; Map; Map + transform; Inspect; Validate + export | 1; 4; 1; 3; 1; 3 | Pass |
| Source labels | Input A; CSV; Messy source CSV | 2; 1; 3 | Pass |
| Source sentence/action | The rows you need to clean.; Choose source CSV | 6; 3 | Pass |
| Target labels | Input B; CSV; Target template CSV | 2; 1; 3 | Pass |
| Target sentences | An empty template or example export.; Its header defines the output. | 6; 5 | Pass; `conversion-workflow` |
| Target action | Choose target template CSV | 4 | Pass |
| Limits | Local limits; CSV only; 10 MB per file; 50,000 data rows; UTF-8 recommended | 2; 2; 4; 3; 2 | `file-limits` for numbers |
| Workspace actions | Use sample files; Map target fields | 3; 3 | Pass |
| How section | How CSV cleanup works; Reuse the same import settings | 4; 5 | Pass |
| Step 1 | Load two files; Load a source CSV and define the target template CSV once. | 3; 11 | Pass |
| Step 2 | Map target fields; Map columns, choose explicit transforms, and add strict rules. | 3; 9 | `conversion-workflow` |
| Step 3 | Inspect before export; Separate accepted rows from explained rejects and reuse the JSON recipe. | 3; 11 | `conversion-workflow` |
| Privacy section | Privacy and limits; Process CSV files on this device | 3; 6 | Pass |
| Privacy sentence | Spreadsheet rows stay in your browser during normal and demo processing. | 11 | `on-device-processing` |
| Privacy sentence/action | Review the exported CSV before importing it into your target service.; Read the privacy policy | 11; 4 | Pass |
| Pricing section | Cleanroom Plus; Save unlimited recipes for $19 once | 2; 6 | `plus-price` |
| Pricing sentences | No subscription.; CSV export, recipe export, rejection reports, and safety checks stay free. | 2; 11 | Registered claims |
| Free tier | Free; Save one recipe and export every result. | 1; 7 | `free-tier-entitlements` plus export claims |
| Plus tier | Plus · $19 once; Unlimited saved recipes on this device. | 4; 6 | `plus-price` |
| Pricing/footer action | View Cleanroom Plus — $19 once | 6 | Pass |
| Footer sentence | Local CSV preparation for strict imports. | 6 | Pass |
| Footer links | Demo; Privacy; Terms | 1; 1; 1 | Pass |
| Footer provenance | Built by Param Factory · v1.0.7 · Hero artwork generated for this product with factory-image. | 15 | Pass |

### README

| Location | Copy unit | Words | Result |
| --- | --- | ---: | --- |
| H1 | CSV Import Cleanroom | 3 | Pass |
| Intro | CSV Import Cleanroom helps operations staff turn messy CSV files into strict import templates. | 14 | `conversion-workflow` |
| Intro | It works offline after the first visit. | 7 | `offline-reload` |
| Intro | Map source columns to target fields. | 6 | `conversion-workflow` |
| Intro | Apply named date, currency, or ID transforms. | 7 | `conversion-workflow` |
| Intro | Validate rows, explain rejects, and reuse an exported recipe. | 9 | `conversion-workflow` |
| Link label | Live product | 2 | Pass |
| H2 | Capabilities | 1 | Pass |
| Capability | A one-click isolated sample demo | 5 | `demo-isolation` |
| Capability | Free accepted-row CSV and reusable recipe JSON exports | 8 | `csv-export` |
| Capability | Free rejection-report exports and one saved local recipe | 8 | `free-tier-entitlements` |
| Capability | Formula-like cells neutralized in every CSV export | 7 | `formula-safe-export` |
| Capability | Offline reload after the first visit | 6 | `offline-reload` |
| Capability | Local limits of 10 MB and 50,000 data rows per file | 11 | `file-limits` |
| Capability | Recipe JSON contains field names and rules, not spreadsheet rows | 10 | `recipe-data-separation` |
| Capability | A $19 one-time Plus license with no subscription for unlimited on-device saved recipes | 13 | `plus-price` |
| Claims note | Every product promise and its test appears in .factory/claims.json. | 9 | False until F-1-8 and F-3-3 through F-3-6 are resolved |
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
| Privacy | During normal and demo processing, spreadsheet rows remain in the browser. | 11 | `on-device-processing` |
| Privacy | With a license present, verification is the only third-party background request. | 11 | `license-request-policy` |
| Privacy | It includes no spreadsheet rows and runs at most daily. | 10 | `license-request-policy` |
| Billing | Checkout and license verification use the Sociobot billing API. | 9 | `billing-route` |
| Billing | No payment provider is embedded. | 5 | `billing-route` |
| Legal lead-in | See /privacy and /terms. | 4 | Pass |
| H2 | Deployment | 1 | Pass |
| Deployment | Deploy the contents of dist/ as a static site with directory routing enabled. | 13 | Pass |
| Deployment | Do not deploy the repository root. | 6 | Pass |
| Deployment | The factory owns DNS and production registration of the billing product. | 11 | Pass |
| Documentation | The product brief and visual system are recorded in .factory/brief.json and .factory/design.md. | 12 | Pass |
| H2 | License | 1 | Pass |
| License | MIT.; See LICENSE. | 1; 2 | Pass |

Terminology is otherwise consistent: **source CSV**, **target template**, **recipe**, **inspection**, and **demo**. F-1-15 is the remaining conflicting workflow term.

## Demo, sandbox, and privacy behavior

- The landing action reaches `/demo/` in one click. At 390 × 844, the settled mapping table begins at y=485. The H1 names `customer-source-sample.csv`, and the screen already shows five realistic target mappings.
- The sticky banner remains at y=80–178 after focus scrolling and contains **“Demo — sample data, nothing is saved”**, **Reset demo**, and **Start for real**.
- Changing `#source-0` to no source and activating Reset restored **Customer ID**.
- A normal draft named `real-private.csv` / `real-template.csv` survived entry to demo, demo reset, and Start for real. After exit, only `csv-import-cleanroom` remained in IndexedDB; `demo:csv-import-cleanroom` was deleted.
- The live normal → demo → reset → real flow requested only `https://csv-import-cleanroom.sociobot.in` and put no private cell value in a URL.
- The registered offline test reloaded `/demo/` offline with the sample and inspection available. F-3-2 concerns the separate shipped `/offline.html` failure route.

## Registered claim tests

All 12 commands in `.factory/claims.json` ran individually after `npm ci` in fresh clone `/tmp/csv-cleanroom-review3-ZO2LWZ` at the reviewed commit.

| Claim | Exact listed command | Result |
| --- | --- | --- |
| `demo-isolation` | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS, 1 test |
| `csv-export` | `npm run test:e2e -- --grep @claim:csv-export` | PASS, 1 test |
| `formula-safe-export` | `npm run test:e2e -- --grep @claim:formula-safe-export` | PASS, 1 test |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS, 1 test |
| `on-device-processing` | `npm run test:e2e -- --grep @claim:on-device-processing` | PASS, 1 test |
| `plus-price` | `npm run test:e2e -- --grep @claim:plus-price` | PASS, 1 test |
| `file-limits` | `npm test -- --testNamePattern @claim:file-limits` | PASS, 1 test; 8 skipped |
| `recipe-data-separation` | `npm run test:e2e -- --grep @claim:recipe-data-separation` | PASS, 1 test |
| `conversion-workflow` | `npm run test:e2e -- --grep @claim:conversion-workflow` | PASS, 1 test |
| `license-request-policy` | `npm run test:e2e -- --grep @claim:license-request-policy` | PASS, 1 test |
| `billing-route` | `npm run test:e2e -- --grep @claim:billing-route` | PASS, 1 test |
| `free-tier-entitlements` | `npm run test:e2e -- --grep @claim:free-tier-entitlements` | PASS, 1 test |

No registered claim test failed. F-1-8 and F-3-3 through F-3-6 are unlisted claims, so the claim audit is not complete.

## Structure, accessibility, links, and identity

Confirmed passes:

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200. A missing path returns the designed 404 with HTTP 404 and a way back.
- Those five main routes have the expected route title, description, canonical, Open Graph/Twitter metadata, favicon, Apple touch icon, `lang="en"`, one H1, and one main landmark. Social art is 1200 × 630.
- Home → Demo/Privacy → Back restores Home's URL, title, H1, focus, and polite announcement. **How it works** on Home focuses `#how-title`.
- Every ordinary same-origin page link and the Sociobot checkout link returned 200. Fragment-target validation found only F-3-1.
- Live Axe scans report zero violations at any impact level on Home, settled Demo, Privacy, Terms, and 404.
- Main and demo flows load without console errors. `/offline.html` is the exception in F-3-2.
- Live headers include CSP with `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, and no meta-delivered frame policy.
- The calibration-bench illustration, paper/enamel palette, strong borders, stage plates, and dense mapping surface match `.factory/design.md` and do not resemble a generic SaaS template.
- The production main JavaScript is 11.84 kB gzip and CSS is 5.11 kB gzip. Reduced-motion rules and visible focus styles are present.

## Earlier-review and polish history

Every earlier ID was checked against both the live site and current source. A prior “fixed” label was not accepted as evidence.

| Earlier finding | Result in review 3 |
| --- | --- |
| F-1-1 | Fixed: mapped sample content is in the first 390 px demo viewport. |
| F-1-2 | Fixed: update lifecycle code remains explicit; full suite passed and `update.spec.ts --repeat-each=5` passed 5/5. |
| F-1-3 | **Reopened, blocking:** `/#workspace` focuses the Home H1 instead of the workspace heading. |
| F-1-4 | Fixed: Run inspection focuses `#workspace-title`. |
| F-1-5 | Fixed on Home, Demo, legal, and 404 routes: shared header/footer contents are present. The distinct offline route failure is F-3-2. |
| F-1-6 | Fixed: privacy/limits and visible Free/Plus sections remain on Home. |
| F-1-7 | Fixed on the reviewed main routes: complete route metadata is live. The distinct offline route failure is F-3-2. |
| F-1-8 | **Reopened, blocking:** the source-immutability promise remains in OG/Twitter descriptions. |
| F-1-9 | Fixed: `billing-route` exists and passes. |
| F-1-10 | Fixed: Home title is plain and task-specific. |
| F-1-11 | Fixed: hero eyebrow names map/validate/export work. |
| F-1-12 | Fixed: figure caption is qualified and covered by conversion workflow. |
| F-1-13 | Fixed: workspace eyebrow names the workspace. |
| F-1-14 | Fixed: workspace heading names both required files. |
| F-1-15 | **Reopened, blocking:** **Adjust wiring** remains in the inspection state. |
| F-1-16 | Fixed: How-section label names CSV cleanup. |
| F-1-17 | Fixed: H2 states that import settings can be reused. |
| F-1-18 | Fixed: source and target file controls have distinct accessible names. |
| F-1-19 | Fixed at the original footer location: it says **View Cleanroom Plus — $19 once**. F-3-7 covers the separate header action. |
| F-1-20 | Fixed: source CSV and target template terminology is otherwise consistent. |
| F-1-21 | Fixed: Privacy, Terms, and 404 H1s identify their pages. |
| F-1-22 | Fixed: README opens with the job in plain language. |
| F-1-23 | Fixed: README workflow copy is split into short instructions. |
| F-1-24 | Fixed: README build sentences are under 22 words. |
| F-1-25 | Fixed: README test sentences are under 22 words. |
| F-1-26 | **Reopened, blocking:** the clearer sentence is false because the claim registry is incomplete. |
| F-2-1 | Fixed: demo identity, Reset, and Start for real stay in the settled mobile viewport. |
| F-2-2 | Fixed for its exact regression: Home → Demo/Privacy → Back restores the Home document and focus. |
| F-2-3 | Fixed: `free-tier-entitlements` is registered and passes. |
| F-2-4 | Fixed: Demo uses H1 then H2, and live Axe reports no heading-order violation. |

The polish-1 and polish-2 records were also compared to live behavior. Their evidence for the items marked fixed above still holds. The polish-2 handoff statement that every F-1/F-2 finding is closed is contradicted by F-1-3, F-1-8, and F-1-15.

## Local gates

From `/work/repo` at the reviewed commit:

```text
npm test                                                    PASS (9/9)
npm run lint                                                PASS
npm run build                                               PASS (dist/ produced)
npm run test:e2e                                            PASS (30/30)
npm run test:e2e -- tests/e2e/update.spec.ts --repeat-each=5 PASS (5/5)
git diff --check                                            PASS before review files
```

## Missed leverage

No AI feature is justified. Mapping, deterministic transforms, validation, rejected-row explanations, and recipe import/export cover the brief without sending spreadsheet data to a model. Sync would conflict with the stated local-first privacy boundary unless introduced as an explicit optional feature. No missing AI, import/export, or sync feature is recorded.

## What would make this perfect

Repair the dead Demo fragment and the workspace focus target. Remove or test the remaining source-immutability metadata claim and every unlisted legal/privacy promise. Replace the residual wiring, bench, rack, shield, and unlock language with the established mapping/workspace terms. Rebuild `/offline.html` with CSP-compatible styling and the shared route skeleton, and derive manifest/service-worker versions from the current build. Then repeat the cold read, full fragment crawl, all claim commands from a clean clone, the complete suite, offline fallback, live request log, focus/history traversal, and Axe scans. There is no additional product feature or AI step to add after those defects are closed.
