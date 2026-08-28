# Polish round 1 — review closure

Repair commits: `f5f27f1a78484022df4726c0006c98990496a0b5` and `34f36f8857b06dbb46eda023bbd5ab9f8a014612`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo omits the landing hero and opens on the seeded Map workspace. | `opens the mapped demo workspace…`; `.factory/qa-evidence/polish-1-demo-mobile.png` |
| F-1-2 | Update test now isolates its worker fixture, waits for `installed`/`waiting`, activates it, and asserts the new cache. | `activates a waiting service-worker update…` |
| F-1-3 | In-page routing uses History API with heading focus; legal pages focus and announce their route. | `moves focus to headings…` |
| F-1-4 | Stage changes move focus to the workspace heading. | `opens the mapped demo workspace…` |
| F-1-5 | Legal and 404 pages now use the complete navigation/footer skeleton. | `serves product routes…` |
| F-1-6 | Landing now has dedicated privacy/limits and Free/Plus sections. | `serves product routes…`; root screenshot |
| F-1-7 | Added route-specific canonical, manifest, OG, Twitter, favicon, and apple-touch metadata. | `serves product routes…` |
| F-1-8 | Removed untested source-immutability wording. | Copy audit and `conversion-workflow` coverage |
| F-1-9 | Added `billing-route` claim and observable provider-free checkout test. | `@claim:billing-route` |
| F-1-10 | Home title is “CSV Import Cleanroom — Prepare CSV imports”. | `verify-url.sh` root report |
| F-1-11 | Replaced the hero eyebrow with “Map, validate, and export CSV rows”. | root screenshot |
| F-1-12 | Replaced the figure slogan with a qualified template statement. | `@claim:conversion-workflow` |
| F-1-13 | Renamed the workspace eyebrow. | demo screenshot |
| F-1-14 | Renamed the workspace heading. | demo screenshot |
| F-1-15 | Replaced “Wire” vocabulary with “Map” throughout. | full Playwright suite |
| F-1-16 | Renamed the steps eyebrow. | root screenshot |
| F-1-17 | Renamed the recipe section heading. | root screenshot |
| F-1-18 | File controls now have distinct source/template accessible names. | `file controls expose visible focus…` |
| F-1-19 | Footer action now says “View Cleanroom Plus — $19 once”. | `@claim:plus-price` |
| F-1-20 | Uses “target template CSV” once, then “target template”. | copy audit |
| F-1-21 | Rewrote legal and 404 H1s as page names. | `serves product routes…` |
| F-1-22 | Rewrote README introduction in plain language. | `.factory/copy-audit.md` |
| F-1-23 | Split README workflow statement into short sentences. | `.factory/copy-audit.md` |
| F-1-24 | Split README build description. | `.factory/copy-audit.md` |
| F-1-25 | Split README test description. | `.factory/copy-audit.md` |
| F-1-26 | Replaced README internal-jargon claim note. | `.factory/copy-audit.md` |

Local evidence: `npm test` 9/9, `npm run lint`, `npm run build`, and `npm run test:e2e` 27/27 passed. Every command in `.factory/claims.json` was run separately from fresh clone `/tmp/csv-cleanroom-polish-1-qEFR5i`; all 11 passed (the 10 Playwright claims plus Vitest file limits). `verify-url.sh` passed against local root and demo with no console errors, one H1, `lang=en`, main landmarks, and no missing alt text. Playwright axe scans in the full suite report no serious or critical issues.

Live recheck: deployed with Static Web Apps CLI to production, then opened cold at <https://csv-import-cleanroom.sociobot.in> and `/demo/`. `verify-url.sh` passed both. On the live 390 × 844 demo, the mapping table starts at y=484.8 (inside the first viewport), the demo has one H1, and there were no console errors. Evidence: `.factory/qa-evidence/polish-1-live-root/verify.json`, `.factory/qa-evidence/polish-1-live-demo/verify.json`, and `.factory/qa-evidence/polish-1-live-demo-mobile.png`.
