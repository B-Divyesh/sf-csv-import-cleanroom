# Polish 4 — cumulative finding closure

All findings in reviews 1–4 were re-read and treated as acceptance work. The
live evidence below is from deployment `479fcbee-f4f4-4cb4-910e-1ddcc869ab1e`
at `https://csv-import-cleanroom.sociobot.in` on 2026-08-28.

## Evidence keys

- **Claims**: every command in `.factory/claims.json` passed independently in
  fresh clone `/tmp/csv-import-cleanroom-polish-4-finalproof-5aSKd3` (15/15).
- **Browser**: `npm run test:e2e` passed 38/38 in that clone. The update test
  then passed 12/12 with `--repeat-each=12`; it also passed 20/20 locally.
- **Live audit**: `.factory/qa-evidence/polish-4-live-check.json` records all
  routes, demo geometry, history restoration, offline reload, same-origin
  requests, sitemap entries, the PWA cache, zero console errors, and zero Axe
  violations.
- **Live route captures**: `.factory/qa-evidence/polish-4-live-*/verify.json`
  and their desktop/mobile screenshots cover Home, Demo, Privacy, Terms, 404,
  and Offline.
- **Live demo captures**: `.factory/qa-evidence/polish-4-live-demo-viewport.png`
  and `.factory/qa-evidence/polish-4-live-inspection-viewport.png`.
- **Live URLs checked cold**: [Home](https://csv-import-cleanroom.sociobot.in/),
  [query Demo](https://csv-import-cleanroom.sociobot.in/?demo=1),
  [route Demo](https://csv-import-cleanroom.sociobot.in/demo/),
  [Privacy](https://csv-import-cleanroom.sociobot.in/privacy/),
  [Terms](https://csv-import-cleanroom.sociobot.in/terms/),
  [Offline](https://csv-import-cleanroom.sociobot.in/offline.html),
  [404](https://csv-import-cleanroom.sociobot.in/404.html), and
  [sitemap](https://csv-import-cleanroom.sociobot.in/sitemap.xml).

## Review 1

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo opens a seeded, mapped workspace and focuses its heading. The compact sticky status bar leaves the sample and controls visible at 390 px. | Browser: `opens the mapped demo workspace in the first viewport and keeps stage focus` and `keeps the demo identity and controls in the settled mobile workspace viewport`; live demo capture. |
| F-1-2 | The update action sends `SKIP_WAITING` and reloads only after `controllerchange`. Waiting-worker detection now observes the installed-to-waiting transition without an event-order race. | `activates a waiting service-worker update from the in-app notice`: 12/12 fresh-clone and 20/20 local repeated passes. |
| F-1-3 | Internal links use real route navigation. Hash destinations have explicit branches, heading focus, and polite announcements; Back restores Home content, title, focus, and announcement. | Browser: `moves focus to headings for route and in-page navigation`, `routes the demo How it works link to Home and focuses every workspace destination`, and `restores the Home document, title, focus, and announcement with browser Back`; Live audit `history`. |
| F-1-4 | Every workspace stage change calls `focusStage`, including load, mapping, inspection, back, reset, and recipe import. | Browser: `opens the mapped demo workspace in the first viewport and keeps stage focus`; `sample workflow validates, explains, and exports without console errors`. |
| F-1-5 | Home, Demo, Privacy, Terms, 404, and Offline use the shared masthead, navigation, legal links, product line, factory credit, and version footer. | Browser: `serves product routes, metadata, a real 404, and a versioned PWA`; all Live route captures. |
| F-1-6 | Home includes explicit Privacy and limits, then visible Free and Plus sections with the $19 one-time price and exact entitlements. | Claims `plus-price` and `free-tier-entitlements`; Home live capture. |
| F-1-7 | Every route has route-specific title, description, canonical policy, OG/Twitter data, icons, manifest, and theme metadata. The designed 404 is intentionally canonicalized and `noindex`. | Browser route/PWA test and route-inventory test; Live audit `routes`; all Live route captures. |
| F-1-8 | Removed every unproved source-immutability statement, including OG and Twitter descriptions. Retained local-processing wording is limited to tested network behavior. | Browser: `claim registry covers retained metadata and legal promises`; `rg` source audit; Claim `on-device-processing`. |
| F-1-9 | Registered `billing-route`; checkout points only to Sociobot and no embedded provider loads before activation. | Claim `billing-route` (Claims 11/15); Terms live capture. |
| F-1-10 | Home title is `CSV Import Cleanroom — Prepare CSV imports`. | Live Home capture and Live audit route title. |
| F-1-11 | Replaced the metaphorical eyebrow with `Map, validate, and export CSV rows`. | `.factory/copy-audit.md`; Home live capture. |
| F-1-12 | Replaced the slogan with `Accepted rows follow your target template.` | Claim `conversion-workflow`; `.factory/copy-audit.md`; Home live capture. |
| F-1-13 | Renamed the workspace label to `CSV import workspace`. | `.factory/copy-audit.md`; live demo capture. |
| F-1-14 | Workspace heading now says `Choose the source and target CSV files`. | `.factory/copy-audit.md`; Home live capture. |
| F-1-15 | Replaced Wire/wiring terminology throughout with Map/mapping, including `Back to mapping`. | Browser workflow test; `.factory/copy-audit.md`; live inspection capture. |
| F-1-16 | The section label now says `How CSV cleanup works`. | `.factory/copy-audit.md`; Home live capture. |
| F-1-17 | The section heading now says `Reuse the same import settings`. | `.factory/copy-audit.md`; Home live capture. |
| F-1-18 | File controls have distinct accessible names: `Choose source CSV` and `Choose target template CSV`. | Browser: `file controls expose visible focus, checkbox targets are 44px, and malformed recipes give a next step`; Axe evidence. |
| F-1-19 | Plus triggers say `View Cleanroom Plus — $19 once`, accurately naming the dialog result. | Claim `plus-price`; `.factory/copy-audit.md`; Home live capture. |
| F-1-20 | Defined and consistently used source CSV, target template, recipe, inspection, and demo. | Terminology table in `.factory/copy-audit.md`; Browser workflow test. |
| F-1-21 | Route H1s plainly identify Privacy, Terms, and Page not found. | Live route captures for Privacy, Terms, and 404. |
| F-1-22 | README opens with a concrete two-sentence job and offline statement. | `.factory/copy-audit.md`; Claim `offline-reload`. |
| F-1-23 | README workflow is split into short action sentences. | `.factory/copy-audit.md`; Claim `conversion-workflow`. |
| F-1-24 | README build explanation is split and stays below 22 words per sentence. | `.factory/copy-audit.md`; fresh-clone `npm run build` pass. |
| F-1-25 | README test explanation is split into short sentences and names the covered behaviors. | `.factory/copy-audit.md`; fresh-clone Browser 38/38. |
| F-1-26 | `.factory/claims.json` now lists every retained product promise, and a registry-coverage test checks metadata and legal copy plus exactly one tagged test per claim. | Claims 15/15; `claim registry covers retained metadata and legal promises`. |

## Review 2

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | The demo status bar is sticky below the mobile masthead and always shows the exact isolation message, Reset demo, and Start for real. Stage focus no longer scrolls it away. | Browser mobile geometry test; Live audit `demo.geometry`; live demo and inspection captures. |
| F-2-2 | Removed mixed `pushState`/replace behavior. Real document routes navigate normally; Back restores the Home document and then focuses and announces its H1. | Browser Back regression; Live audit `history`. |
| F-2-3 | Registered and tested free rejection-report export, one free saved recipe, and the second-save Plus boundary. | Claim `free-tier-entitlements` (Claims 12/15). |
| F-2-4 | Demo workspace subsections use H2 under the route H1; normal embedded workspace uses H3 beneath its Home H2. | Browser all-state accessibility test; local Axe evidence covers mapping, empty inspection, and inspection; Live audit reports zero Axe violations. |

## Review 3

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Demo `How it works` links to `/#how`; the destination is visible and focused. | Browser: `routes the demo How it works link to Home and focuses every workspace destination`; Live audit history/routing. |
| F-3-2 | Offline is a fully styled, CSP-compatible route with shared chrome, plain title/H1/action, complete metadata, and no inline style. | Browser: `ships a CSP-compatible offline fallback with route metadata and no console errors`; Offline live capture; Live audit. |
| F-3-3 | Registered normal-workspace persistence, workspace reset, recipe deletion, and IndexedDB deletion behavior. | Claim `local-data-lifecycle` (Claims 13/15). |
| F-3-4 | Registered and tested all product routes for cookies, third-party resources, remote fonts, analytics, and pixel elements. | Claim `no-tracking-resources` (Claims 14/15); Live audit `requests` is same-origin only. |
| F-3-5 | Registered a fail-closed test for refunded, revoked, expired, and wrong-product license responses. | Claim `license-revocation` (Claims 15/15). |
| F-3-6 | Removed the unbounded accessibility entitlement wording; the retained free export and safety promises are tested. | Claim `free-tier-entitlements`; Browser all-state accessibility test; Terms live capture. |
| F-3-7 | Header action now says `View Cleanroom Plus — $19 once`. | Claim `plus-price`; Home live capture. |
| F-3-8 | Renamed `Export rack` to `Export inspection results`. | `.factory/copy-audit.md`; live inspection capture. |
| F-3-9 | Replaced `Formula shield active` with `Formula-like values will be escaped.` | Claim `formula-safe-export`; `.factory/copy-audit.md`; live inspection capture. |
| F-3-10 | Runtime states now say `Restoring your saved workspace…`, `Could not continue.`, and `Workspace reset.` | `.factory/copy-audit.md`; Browser workflow and malformed-recipe tests. |
| F-3-11 | 404 uses `Page not found`, `Open CSV workspace`, and `Try it with sample data`; an unknown URL returns HTTP 404. | Browser route/PWA test; 404 live capture; Live audit `missingStatus: 404`. |
| F-3-12 | Manifest description is plain, and package, manifest start URL, footer, and generated worker cache derive from v1.0.9. | Browser route/PWA test; Live audit `worker.versionedCache`; all Live route footers. |

## Review 4

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Added `/offline.html` to the sitemap. Added a recursive built-route inventory test that requires exact equality between all indexable HTML canonicals and sitemap URLs. `/404.html` is the sole asserted `noindex` exception. | Browser: `route inventory keeps the sitemap aligned with every indexable shipped page`; Live audit `sitemap` and `routes./404.html.noindex`; live `/sitemap.xml`. |

## Final quality evidence

- Fresh clone: claims 15/15, Vitest 9/9, Browser 38/38, lint pass, build
  pass with `dist/`, and `git diff --check` pass.
- Local Axe: zero violations at every impact level in eight routes/states:
  `.factory/qa-evidence/polish-4-axe-local.json`.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.2 s, CLS 0, TBT 0 ms:
  `.factory/qa-evidence/polish-4-lighthouse-live.json`.
- Production assets: 12.13 kB gzip initial app JavaScript and 5.17 kB gzip
  CSS. The mobile hero is 53.7 kB.
- Open live: <https://csv-import-cleanroom.sociobot.in/?demo=1>.

No finding of any severity remains open.
