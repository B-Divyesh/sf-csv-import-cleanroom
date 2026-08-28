# Polish round 3 — complete review closure

Repair commits: `06e57c4` and `2e803d5`. The deployed product is <https://csv-import-cleanroom.sociobot.in> (Static Web Apps deployment `e9d59d32-d0ea-4710-a0b7-fed26eab7365`). Every prior finding was rechecked; an earlier “fixed” status was not treated as evidence.

## Common evidence

- Fresh-clone claims audit: every one of the 15 exact commands in `.factory/claims.json` passed.
- Fresh-clone gates: `npm test` 9/9, `npm run lint`, `npm run build`, full `npm run test:e2e` 37/37, and `tests/e2e/update.spec.ts --repeat-each=8` 8/8 all passed.
- Cold live checks: [home](https://csv-import-cleanroom.sociobot.in/), [demo](https://csv-import-cleanroom.sociobot.in/demo/), [privacy](https://csv-import-cleanroom.sociobot.in/privacy/), [terms](https://csv-import-cleanroom.sociobot.in/terms/), [404](https://csv-import-cleanroom.sociobot.in/404.html), and [offline](https://csv-import-cleanroom.sociobot.in/offline.html) have no console errors and zero Axe violations. Route screenshots and `verify-url.sh` reports are in `.factory/qa-evidence/polish-3-live-*/`; the joint interaction check is `.factory/qa-evidence/polish-3-live-check.json`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The demo opens directly on the seeded mapping workspace; the sample name and mappings remain inside the first 390 px viewport. | `opens the mapped demo workspace in the first viewport and keeps stage focus`; `polish-3-live-demo/screenshot-mobile.png`; [live demo](https://csv-import-cleanroom.sociobot.in/demo/). |
| F-1-2 | The update test now waits for the isolated replacement worker, its waiting state, activation, controller change, and replacement cache without a competing final reload. | `activates a waiting service-worker update from the in-app notice --repeat-each=8` passed 8/8. |
| F-1-3 | `#workspace` explicitly focuses `#workspace-title`; direct destinations and history return a focused heading with a polite announcement. | `routes the demo How it works link to Home and focuses every workspace destination`; live `focus.activeId = workspace-title` in `polish-3-live-check.json`; [live workspace](https://csv-import-cleanroom.sociobot.in/#workspace). |
| F-1-4 | Stage renders restore focus to the workspace heading after mapping, inspection, back, reset, and recipe actions. | `opens the mapped demo workspace in the first viewport and keeps stage focus`; [live demo](https://csv-import-cleanroom.sociobot.in/demo/). |
| F-1-5 | Home, demo, legal, 404, and offline routes use the common wordmark/navigation/footer skeleton with both legal links, factory credit, and build ID. | `serves product routes, metadata, sitemap, a real 404, and a versioned PWA`; offline route test; live route reports. |
| F-1-6 | Landing retains dedicated privacy/limits and visible Free/Plus sections with the one-time price and exact limits. | `@claim:plus-price`, `@claim:free-tier-entitlements`; `polish-3-live-root/screenshot-desktop.png`; [live home](https://csv-import-cleanroom.sociobot.in/). |
| F-1-7 | Every route now has its own title, description, canonical, Open Graph/Twitter set, icons, manifest, and intended route metadata. | `serves product routes, metadata, sitemap, a real 404, and a versioned PWA`; offline fallback test; live route reports. |
| F-1-8 | Removed the unsupported source-immutability wording from Open Graph/Twitter metadata rather than retaining an unprovable promise. | `claim registry covers retained metadata and legal promises`; live home metadata in `polish-3-live-root/index.html`. |
| F-1-9 | The Sociobot-only checkout/no embedded provider statement is registered and tested. | `@claim:billing-route uses Sociobot checkout without embedded payment providers`; [live terms](https://csv-import-cleanroom.sociobot.in/terms/). |
| F-1-10 | Home title is `CSV Import Cleanroom — Prepare CSV imports`. | route metadata test; `polish-3-live-root/verify.json`. |
| F-1-11 | The hero eyebrow says `Map, validate, and export CSV rows`. | copy audit; `polish-3-live-root/screenshot-desktop.png`. |
| F-1-12 | The caption uses the qualified target-template result and is covered by the conversion claim. | `@claim:conversion-workflow`; [live home](https://csv-import-cleanroom.sociobot.in/). |
| F-1-13 | The workspace eyebrow is `CSV import workspace`. | first-viewport test; `polish-3-live-demo/screenshot-mobile.png`. |
| F-1-14 | The workspace heading plainly names the source and target CSV files. | form/route tests; [live home workspace](https://csv-import-cleanroom.sociobot.in/#workspace). |
| F-1-15 | Replaced residual `Adjust wiring` with `Back to mapping`; the workflow uses Map/mapping consistently. | `@claim:conversion-workflow`; `.factory/copy-audit.md`; [live demo](https://csv-import-cleanroom.sociobot.in/demo/). |
| F-1-16 | The how section uses a factual CSV-cleanup label. | copy audit; `polish-3-live-root/screenshot-desktop.png`. |
| F-1-17 | The heading states that import settings can be reused. | copy audit; [live how section](https://csv-import-cleanroom.sociobot.in/#how). |
| F-1-18 | Source and target template file controls have distinct accessible names. | `file controls expose visible focus, checkbox targets are 44px, and malformed recipes give a next step`; live Axe 0. |
| F-1-19 | Footer Plus action says `View Cleanroom Plus — $19 once`. | `@claim:plus-price`; live home screenshot. |
| F-1-20 | The interface defines `target template CSV` then uses `target template` consistently. | copy audit; `@claim:conversion-workflow`. |
| F-1-21 | Privacy, Terms, and 404 H1s name their pages plainly. | route metadata test; `polish-3-live-{privacy,terms}/verify.json`; live 404 check. |
| F-1-22 | README opens with the plain job statement. | `.factory/copy-audit.md`; README review. |
| F-1-23 | README workflow directions are short, separate task sentences. | `.factory/copy-audit.md`; README review. |
| F-1-24 | README build instructions are split and under the word limit. | `.factory/copy-audit.md`; fresh `npm run build` pass. |
| F-1-25 | README test instructions are short and name the actual checks. | `.factory/copy-audit.md`; fresh full suite 37/37. |
| F-1-26 | The claim registry now contains every retained product/legal promise and each has exactly one tagged test. | `claim registry covers retained metadata and legal promises`; all 15 listed claim commands passed. |
| F-2-1 | The compact demo status bar is sticky below the masthead and keeps its exact warning, reset, and exit controls visible. | `keeps the demo identity and controls in the settled mobile workspace viewport`; `polish-3-live-check.json` shows `banner/reset/startReal: true`; [direct demo](https://csv-import-cleanroom.sociobot.in/?demo=1). |
| F-2-2 | Ordinary real routes and focused headings restore Home URL, title, document, focus, and announcement on Back. | `restores the Home document, title, focus, and announcement with browser Back`; [live home](https://csv-import-cleanroom.sociobot.in/). |
| F-2-3 | Added and retained the free-tier entitlement claim for rejection reports, one saved recipe, and the next-save Plus gate. | `@claim:free-tier-entitlements exports rejection reports and saves one recipe before Plus`; [live home](https://csv-import-cleanroom.sociobot.in/). |
| F-2-4 | Saved recipes is an H2 below the demo H1; the full live Axe checks are clean. | `has no serious or critical accessibility violations in every workflow state`; live demo Axe 0. |
| F-3-1 | Demo’s How it works link is now `/#how`; Home scrolls and focuses `#how-title`. | `routes the demo How it works link to Home and focuses every workspace destination`; live check asserts the href; [live demo](https://csv-import-cleanroom.sociobot.in/demo/). |
| F-3-2 | Rebuilt `offline.html` with self-hosted CSS, route metadata, the shared skeleton, plain offline copy, and offline CSS precaching. | `ships a CSP-compatible offline fallback with route metadata and no console errors`; `polish-3-live-offline/verify.json`; [live offline route](https://csv-import-cleanroom.sociobot.in/offline.html). |
| F-3-3 | Added `local-data-lifecycle` and a normal-workspace refresh, recipe deletion, reset, and IndexedDB-record test. | `@claim:local-data-lifecycle persists normal work, deletes recipes, and resets the active workspace`; [live privacy](https://csv-import-cleanroom.sociobot.in/privacy/). |
| F-3-4 | Added `no-tracking-resources`, covering fresh-context cookies, every route, resource origins, fonts, scripts, and pixel/analytics elements. | `@claim:no-tracking-resources loads every product route without cookies or third-party resources`; [live privacy](https://csv-import-cleanroom.sociobot.in/privacy/). |
| F-3-5 | Added the four-state `license-revocation` claim and fail-closed fixture checks. | `@claim:license-revocation locks refunded, revoked, expired, and wrong-product licenses`; [live terms](https://csv-import-cleanroom.sociobot.in/terms/). |
| F-3-6 | Removed the untestable accessibility-entitlement phrase; remaining free export and safety promises have registered claims. | `claim registry covers retained metadata and legal promises`; [live terms](https://csv-import-cleanroom.sociobot.in/terms/). |
| F-3-7 | Header Plus action now states `View Cleanroom Plus — $19 once`, matching the result and footer. | `@claim:plus-price`; `polish-3-live-root/screenshot-desktop.png`. |
| F-3-8 | Inspection eyebrow now says `Export inspection results`. | `sample workflow validates, explains, and exports without console errors`; [live demo](https://csv-import-cleanroom.sociobot.in/demo/). |
| F-3-9 | Formula notice now says `Formula-like values will be escaped.` | `@claim:formula-safe-export neutralizes sample spreadsheet formulas`; [live demo](https://csv-import-cleanroom.sociobot.in/demo/). |
| F-3-10 | Runtime messages now identify saved-workspace restoration, an actionable failure, and workspace reset. | full Playwright 37/37; `.factory/copy-audit.md`. |
| F-3-11 | 404 copy/actions now use CSV workspace and the established demo action label. | route/404 test; `polish-3-live-404.html`; [live missing page](https://csv-import-cleanroom.sociobot.in/not-a-real-cleanroom-route). |
| F-3-12 | Manifest wording and start URL are plain/current; the postbuild script derives the service-worker cache version from `package.json` and footer version is 1.0.8. | PWA route test; live check `workerVersion: true`; [live manifest](https://csv-import-cleanroom.sociobot.in/manifest.webmanifest). |

The calibration-bench visual identity remains intact: paper/enamel colors, engraved stage plates, and the dense mapping work surface were preserved rather than replaced with a generic SaaS presentation.
