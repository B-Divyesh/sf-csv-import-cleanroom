# Polish round 2 — full review closure

Repair commit: `3f07771462fac63bd95454daf00980790b8df266`. Evidence is captured by the named Playwright or Vitest test; live evidence is recorded in the handoff after deployment.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 / F-2-1 | The demo keeps its exact isolation message, Reset demo, and Start for real controls in a sticky compact status bar while the seeded workspace is focused. | `keeps the demo identity and controls in the settled mobile workspace viewport`; mobile screenshot/live check pending deployment. |
| F-1-2 | The update test waits for a waiting worker, confirms the replacement controller and cache, then cold-reloads its shell; its worker fixture remains isolated. | `activates a waiting service-worker update from the in-app notice --repeat-each=5`. |
| F-1-3 / F-2-2 | Removed mixed `pushState` plus `location.replace` handling. Real routes now use ordinary same-origin document navigation; home headings are focusable and route announcements remain available. | `restores the Home document, title, focus, and announcement with browser Back`. |
| F-1-4 | Stage changes focus the workspace heading after render. | `opens the mapped demo workspace in the first viewport and keeps stage focus`. |
| F-1-5 | Legal and 404 pages retain the shared header, legal footer, factory credit, and build id. | `serves product routes, metadata, sitemap, and a real 404`. |
| F-1-6 | Landing includes dedicated privacy/limits and visible Free/Plus sections. | `serves product routes…`; landing cold check. |
| F-1-7 | Every route has canonical, manifest, icons, and route-specific Open Graph/Twitter metadata. | `serves product routes, metadata, sitemap, and a real 404`. |
| F-1-8 | Untestable source-immutability wording remains removed. | Landing copy audit; `conversion-workflow`. |
| F-1-9 | Sociobot checkout-only billing claim is registered and tested. | `@claim:billing-route`. |
| F-1-10 | Home title remains “CSV Import Cleanroom — Prepare CSV imports”. | route/history test and URL verification. |
| F-1-11 | Hero eyebrow uses task language. | cold landing check; copy audit. |
| F-1-12 | Hero caption states the qualified target-template result. | `@claim:conversion-workflow`. |
| F-1-13 | Workspace eyebrow names the CSV import workspace. | demo/mobile test. |
| F-1-14 | Workspace heading identifies source and target CSV selection. | route and form tests. |
| F-1-15 | Mapping terminology is used consistently. | `@claim:conversion-workflow`; copy audit. |
| F-1-16 | How-it-works eyebrow names its section. | cold landing check; copy audit. |
| F-1-17 | Recipe heading explains reusable settings. | cold landing check; copy audit. |
| F-1-18 | Source and target controls retain distinct accessible names. | `file controls expose visible focus…`. |
| F-1-19 | Plus actions name the destination and price. | `@claim:plus-price`. |
| F-1-20 | Target-template terminology stays consistent. | copy audit; `conversion-workflow`. |
| F-1-21 | Legal and 404 H1s identify their pages plainly. | `serves product routes, metadata, sitemap, and a real 404`. |
| F-1-22 | README job statement is plain and split. | `.factory/copy-audit.md`. |
| F-1-23 | README workflow uses short task sentences. | `.factory/copy-audit.md`. |
| F-1-24 | README build description is split and under the word limit. | `.factory/copy-audit.md`. |
| F-1-25 | README verification description is short and specific. | `.factory/copy-audit.md`. |
| F-1-26 | README explains the claim registry in plain words. | `.factory/copy-audit.md`. |
| F-2-3 | Registered `free-tier-entitlements`; it proves a free rejection report, one free saved recipe, and the second-save Plus gate. | `@claim:free-tier-entitlements`. |
| F-2-4 | Demo Saved recipes is now an H2 beneath the demo H1, with an explicit Axe heading-order assertion. | `has no serious or critical accessibility violations in every workflow state`. |

The visual system is unchanged: the warm calibration bench, paper/enamel palette, engraved stage plates, and local-first work surface remain product-specific.
