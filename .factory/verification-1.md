# Independent product verification — FAIL

- Candidate: `1e2e829d3ca58846f43db4176aec34f8acc0e399`
- Live URL: <https://csv-import-cleanroom.sociobot.in>
- Verified: 2026-08-28 UTC
- Work order: `csv-import-cleanroom-verify-1`
- Result: **FAIL — do not release this candidate**

The core local CSV conversion works, the candidate builds cleanly, and the live deployment byte-matches the candidate's production output. Release is nevertheless blocked by the missing claim registry, the failed first-read contract, a non-isolated demo that can overwrite a real local draft, and a critical axe finding in the mapping UI.

## Release-blocking findings

### BLOCKER — required claim registry and claim tests are absent

`.factory/claims.json` does not exist at the tested commit. Per the work order, a missing registry is an automatic release failure. Therefore there were no listed claim commands to run before other checks and no `@claim:<id>` tests. `rg '@claim:' tests` also finds no claim-tagged test.

This leaves material live/README claims unregistered, including “100% on-device,” “Files never leave this device,” “Works offline,” “Formula-safe exports,” the 10 MB/50,000-row limits, local recipe persistence, and the one-recipe free limit. Several were independently verified below, but ad hoc verification is not a substitute for the required registry and per-claim demo tests.

### BLOCKER — first screen does not identify the intended user

Cold desktop and 390 px mobile opens showed:

- Headline: “Make the CSV fit. Keep the original intact.”
- Explanation: “Wire messy source columns to an exact template, inspect every rejected row, then keep the conversion as an auditable recipe.”
- Primary action: “Try the calibration sample”

The page explains what it does and what to click, but never says that it is for operations staff or solo administrators preparing strict SaaS imports. It therefore fails the mandatory what/for-whom/first-action test. The action also avoids the required plain label “Try it with sample data,” and the three facts omit price even though the product has a paid tier.

### HIGH — sample demo is not sandboxed and can replace real local work

The one-click sample is useful, but it is not the required demo mode:

- `/demo` and `/?demo=1` both show “Set up the bench”; neither loads sample data.
- No persistent “Demo — sample data, nothing is saved” banner, “Reset demo,” or “Start for real” action exists.
- Clicking the sample keeps the URL at `/` and writes the full sample draft into the normal `csv-import-cleanroom` IndexedDB database.
- Reload restores `customer-source-sample.csv`, proving the sample is saved.
- After loading `real-ops.csv` and `real-template.csv`, clicking the sample immediately changed the workspace to `customer-source-sample.csv`; reloading retained the sample. There was no warning or confirmation.
- `.factory/demo.md` is absent.

This violates demo isolation and creates a realistic local data-loss path.

### HIGH — mapping stage has a critical axe violation

Live axe scans on desktop and 390 px mobile report `label` with impact `critical` on `#recipe-file`:

```html
<input class="sr-only" id="recipe-file" type="file" accept="application/json,.json">
```

The existing E2E accessibility test misses this state: it scans the landing page and then advances directly from mapping to inspection. Inspection also has one moderate `landmark-complementary-is-top-level` violation because its `aside` is nested inside another landmark.

### HIGH — file pickers have no visible keyboard focus

The source and target file inputs are keyboard-operable with Enter, but focus lands on a clipped 1×1 px input. The visible “Choose CSV” label receives no outline or other focus treatment. This fails the visible-focus requirement. The implicit checkbox targets in the mapping table are about 26 px high, below the 44 px touch-target baseline.

## Other findings

### MEDIUM — required site structure and security policy are incomplete

- `/sitemap.xml` returns 404.
- Any unknown path returns the home application with HTTP 200; there is no designed 404 route.
- `staticwebapp.config.json` is absent.
- Canonical, Open Graph, Twitter card, apple-touch icon metadata, and the required 1200×630 social image references are absent.
- The footer has no build/version identity and does not say “Built by Param Factory.”
- Live responses have HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`, but no Content-Security-Policy, `frame-ancestors`/X-Frame-Options, or Permissions-Policy.
- `.factory/copy-audit.md` is absent.

### MEDIUM — immutable asset caching is not configured

HTML, service worker, manifest, hashed JS/CSS, icons, and artwork all return the same short policy: `Cache-Control: public, must-revalidate, max-age=30`. Hashed assets are not long-lived/immutable as required. The manifest is served as `application/octet-stream`, although Chromium still parsed it and reported no installability errors.

### LOW — malformed recipe error exposes parser jargon

Importing `{broken` displays “Expected property name or '}' in JSON at position 1 (line 1 column 2).” It identifies the failure but does not give the plain next action requested by the copy contract.

## Passing evidence

### Clean local gates

Run from the clean candidate checkout after `npm ci`:

- `npm ci`: 61 packages installed; 0 vulnerabilities.
- `npm test`: 2 files, 8/8 tests passed.
- `npm run build`: passed; includes `tsc --noEmit`; `dist/index.html` produced.
- `npm run test:e2e`: 4/4 Playwright tests passed.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- No lint script exists in `package.json`.

Build output is comfortably within static budgets:

- Main JS: 30,282 B raw / 10,773 B gzip.
- Module preload helper: 771 B raw.
- Main CSS: 17,276 B raw / 4,731 B gzip.
- No downloaded fonts.
- Hero: 110,434 B desktop / 53,668 B mobile.

### Core workflow and recovery paths

The sample flow produced 3 input rows, 2 accepted rows, 1 rejected row, and 6 visibly reviewable changed values. The target export contained only accepted rows. The formula-like ID exported as `'=2+2`; the rejection report retained source row 3 and the target-language email error. Recipe JSON included only targets/mappings/rules, not spreadsheet rows.

The UI rejected and recovered from a non-CSV file, duplicate headers, an unclosed quote, an empty file, a file over 10 MB, a file with 50,001 rows, malformed recipe JSON, a mismatched recipe, and a run with no connected mapping. Exactly 50,000 rows loaded successfully. Draft reload, one free saved recipe, and the second-save Plus gate worked.

During the complete normal/sample flow, browser requests were same-origin only and there were no console or page errors. A license-present flow made only the documented Sociobot verify request, stripped the token from the URL, stored it under `sb_license:csv-import-cleanroom`, and relocked after an invalid verdict.

### Live deployment identity and billing

The deployed `index.html`, main JS, main CSS, `sw.js`, and `manifest.webmanifest` are byte-for-byte identical to the files produced from the candidate. The matching content hashes provide stronger evidence than the absent visible build ID that the live deployment is this candidate.

The earlier billing-registration concern is resolved in current evidence:

- `GET /api/v1/products/csv-import-cleanroom/checkout` returned 303 to hosted Dodo checkout.
- Invalid license verification returned HTTP 200 with `{"expires_at":null,"reason":"invalid","valid":false}` and correct CORS for the product origin.
- In a 120-request concurrent verification burst, 30 returned 200 and 90 returned 429. Every 429 included `Retry-After`; observed values were 0–4 seconds. The observed burst allowance was 30 requests.

### PWA/offline

Chromium reported no manifest installability errors. The active deployed worker controlled the app and the `cleanroom-v1.0.3-shell` cache held the app shell, legal pages, icons, artwork, JS, and CSS. After switching the browser context offline, a true page reload succeeded, the status changed to “Offline · local processing ready,” the sample inspection still produced 2 accepted/1 rejected, and `/privacy/` opened offline.

A local two-version service-worker simulation, without changing repository files, displayed “An app update is ready,” activated after “Update now,” reloaded under the new controller, and removed the old cache.

### Accessibility, responsive behavior, and motion

- Live axe: landing, privacy, and terms had no violations; mapping had the critical label defect above; inspection had one moderate nested-landmark defect.
- One `<h1>`, `lang`, title, main landmark, skip link, and image alt text are present.
- Keyboard Tab/Enter reaches and opens the sample. The license dialog opens on its close button, traps forward/backward Tab, closes with Escape, and restores focus.
- The skip link becomes visible with a 3 px focus outline.
- At 390 px and 320 px, the shell does not permit page-level horizontal scrolling; dense tables use their own horizontal scroller. Desktop and mobile workflows remain readable.
- `prefers-reduced-motion: reduce` is detected; smooth scrolling becomes `auto` and animations/transitions are reduced.

### Performance

Live Lighthouse 12.5.1 mobile results:

- Performance 96, Accessibility 100, Best Practices 100, SEO 100.
- FCP 1.0 s, LCP 1.3 s, CLS 0, Speed Index 1.0 s.
- Total Blocking Time 240 ms; Max Potential FID 300 ms. Lighthouse did not produce field INP.

The Lighthouse accessibility score covers the landing state only and does not negate the state-specific critical axe failure.

## Required before release

1. Add `.factory/claims.json`, one observable `@claim:<id>` test per claim, and run each command through the isolated demo entry point.
2. Rewrite the first screen to name the intended user, use the plain sample-data action, and include privacy/offline/price facts.
3. Implement `/demo` or `?demo=1` with a separate storage namespace, persistent demo banner, reset, and start-for-real controls. Never overwrite the normal draft without confirmation.
4. Label `#recipe-file`, expose visible focus for both CSV file inputs, enlarge checkbox targets, and clear all serious/critical axe findings in every workflow state.
5. Add the required route/metadata/security/caching files and policies, `.factory/demo.md`, and `.factory/copy-audit.md`.
