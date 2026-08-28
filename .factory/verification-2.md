# Independent product verification — FAIL

- Candidate: `fba08c8efa65fd79c149e1440b18a01dcb0b0e40`
- Live URL: <https://csv-import-cleanroom.sociobot.in>
- Verified: 2026-08-28 UTC
- Work order: `csv-import-cleanroom-verify-2`
- Result: **FAIL — do not release this candidate**

The local CSV workflow is useful and works end to end. The live deployment byte-matches the candidate, all repository commands pass, the real offline reload works, and the live page clears the first-read, accessibility, privacy-network, and performance checks. Release is still blocked by a paid-license fail-open and by an incomplete claims contract.

## Release-blocking findings

### HIGH — any first-time license token unlocks Plus when verification is unavailable

The live restore flow grants paid access when the browser is offline, even when the token has never received a valid verdict.

Fresh live reproduction:

1. Open `/` in a new browser context and wait for the page to load.
2. Open **Unlock Plus**.
3. Put the context offline.
4. Paste `definitely-not-a-real-license` and choose **Verify license**.
5. The dialog closes and the page says **Cleanroom Plus is active on this device**.

Observed storage and UI:

```json
{
  "offlineFakeTokenUnlocked": true,
  "paidButton": ["Cleanroom Plus", "License active"],
  "license": "definitely-not-a-real-license",
  "verdict": null,
  "dialog": false
}
```

The arbitrary token also unlocked the paid feature: in the offline demo, **Recipe One** and **Recipe Two** both saved and no Plus gate appeared.

The cause is `verifyLicense()` in `src/license.ts`: on a network error it returns `cached ?? { valid: true, reason: 'offline' }`. `storeLicense()` deliberately removes the cached verdict before first verification, so a failed first check becomes valid. The required behavior is optimistic access only from a previously cached valid verdict; an unverified first-time token must remain locked when verification cannot complete.

### BLOCKER — the claims registry does not cover all material visitor promises

All seven commands in `.factory/claims.json` exit successfully, but the registry/test contract is still incomplete:

- `@claim:offline-reload` turns the context offline and inspects Cache Storage, but never calls `page.reload()`. The registry's sandbox explicitly requires “switch the browser offline, reload,” so the tagged test does not assert the claimed outcome. Independent live QA did perform a real offline reload and it passed, but that does not repair the mandatory regression test.
- The landing/workspace says recipes contain field names and rules and **never spreadsheet rows**. There is no claim entry or tagged test that inspects the recipe payload for absence of spreadsheet data.
- The license panel says the free workflow remains available **forever**, including safe CSV and recipe exports, and says there is **no subscription**. These paid/free entitlement promises are not registered.
- README says named transforms run, every output row is validated, rejects are explained in target-column language, and a reusable recipe is exported. The registry only covers the accepted sample CSV, formula neutralization, and limits; it does not list this broader capability claim.
- README says normal and demo spreadsheet rows remain in the browser and that license verification is the only background request and runs at most daily. The registered privacy claim and request-log test are explicitly limited to the demo flow and do not prove the normal licensed flow or daily request frequency.

The attached claims contract says any unlisted claim-like landing/README sentence fails review until it is removed or receives exactly one observable `@claim:` test.

## Other finding

### MEDIUM — deployed manifest has the wrong MIME type

`GET /manifest.webmanifest` returns `Content-Type: application/octet-stream`. The candidate's `staticwebapp.config.json` requests `application/manifest+json`, but that header is not present live. Chromium still parsed the manifest and reported zero installability errors, so installation is currently functional, but the deployed response does not meet the site-structure/PWA MIME requirement.

## Mandatory claim commands

These were run first, individually and exactly as listed in `.factory/claims.json`:

| Claim | Command result | Observable evidence |
| --- | --- | --- |
| `demo-isolation` | PASS, 1/1 | Real draft preserved after entering and leaving `/demo/` |
| `csv-export` | PASS, 1/1 | Download has header plus two accepted rows and omits the reject |
| `formula-safe-export` | PASS, 1/1 | Export contains `'=2+2` |
| `offline-reload` | Command PASS, 1/1; contract test deficient | Test never reloads after going offline; independent real reload passed |
| `on-device-processing` | PASS, 1/1 | Demo requests are same-origin |
| `plus-price` | PASS, 1/1 | Dialog states `$19 once` and unlimited on-device recipes |
| `file-limits` | PASS, 1/1 | >10 MB and >50,000 rows rejected |

## First-read test

**PASS on desktop and 390 px mobile.** Before scrolling, the page answers all three questions in plain words:

- What: **Prepare CSV imports. Keep the source intact.**
- For whom: **For operations staff and solo admins preparing strict SaaS imports from messy spreadsheets.**
- First action: **Try it with sample data**, followed by “The sample opens a mapped import with one explained rejection.”

The privacy, offline, and price facts are also visible. At 390×844, the headline, audience sentence, action, outcome note, and three facts all fit in the first viewport. The action opens the populated isolated demo in one click.

Evidence: `.factory/qa-evidence/live-first-read/root-desktop.png` and `.factory/qa-evidence/live-first-read/root-mobile-390.png`.

## Clean local verification

Run at the exact candidate after `npm ci`:

- `npm ci`: PASS, 61 packages; 0 vulnerabilities.
- `npm test`: PASS, 2 files and 9/9 tests.
- `npm run lint`: PASS (`tsc --noEmit`).
- `npm run build`: PASS; `dist/` produced.
- `npm run test:e2e`: PASS, 11/11 Playwright tests.
- `npm audit --audit-level=high`: PASS, 0 vulnerabilities.

Production output:

- Main JS: 31.67 KB raw / 11.22 KB gzip.
- Main CSS: 17.98 KB raw / 4.88 KB gzip.
- Mobile hero: 53,668 B.
- No downloaded fonts.

## Live deployment identity

At verification start, local `HEAD`, `origin/main`, and the requested candidate were all `fba08c8efa65fd79c149e1440b18a01dcb0b0e40`.

Fresh SHA-256 comparisons between `dist/` and the live response matched for `/`, `/demo/`, `/privacy/`, `/terms/`, `/sw.js`, `/manifest.webmanifest`, main JS, and main CSS. Representative hashes:

- `/`: `6e5f1516bc88d55df6f1646ae0e9d776717f31de79b811518563b37e26f82db9`
- main JS: `7efb313d7a000fb246695d5eb9ca382adf3c078baea2c8509d78c8835d9bd7ac`
- `sw.js`: `52c600a522fd16bf1c0fd4c0cf086f0957e03f470966eae192526bcf610032b8`

The live deployment therefore matches the candidate production build.

## End-to-end product evidence

### Sample and representative normal flow

The shipped demo produced 3 input rows, 2 accepted rows, 1 rejected row, and 6 changed values. It explained `email is not a valid email address`, displayed the formula warning, and exported:

```csv
external_id,name,email,started_on,balance_usd
AC-001,Ada Rivera,ada@example.com,2026-01-31,1240.5
'=2+2,Sam Chen,sam@example.com,2026-02-08,19.95
```

The rejection report retained source row 3 and the target-field explanation. The recipe JSON exported successfully.

A separate custom live flow used quoted commas, whitespace, upper-case email, day-first dates, currency, an invalid calendar date, an invalid email, and a non-number. It produced 1 accepted and 1 rejected row; the accepted CSV contained:

```csv
external_id,full_name,email,started_on,balance_usd
ID-1,"Ada, A.",ada@example.com,2026-01-31,1234.5
```

The invalid row received three target-language errors. Recipe JSON round-tripped after a mapping was removed, restoring `Customer ID`; mismatched and malformed recipes produced actionable recovery text.

### Boundaries, invalid input, and recovery

- Exactly 10 MiB loaded; 10 MiB + 1 byte was rejected with the stated limit.
- Exactly 50,000 data rows loaded; 50,001 was rejected with the stated limit.
- `.xlsx`, empty CSV, duplicate headers, and an unclosed quote were rejected with specific next steps.
- A valid CSV loaded after an error and cleared the alert.
- Formula-like accepted values were neutralized in the downloaded CSV.

No console or page errors occurred in the normal, demo, export, invalid-input, mobile, or offline flows.

## Privacy, billing API, and headers

Playwright recorded the complete root → demo → inspection request log. Every request was same-origin; there were no analytics, fonts, scripts, or spreadsheet uploads to third parties. A licensed flow is documented to contact only `api.sociobot.in`, which is permitted by CSP.

Live root/demo headers include CSP, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and `X-Frame-Options: DENY`. Hashed JS/CSS and artwork use `public, max-age=31536000, immutable`; `sw.js` uses `no-cache`; HTML uses a 30-second revalidation policy. An unknown route returns the designed page with HTTP 404.

Billing checks:

- Checkout returned HTTP 303 to hosted Dodo checkout.
- Invalid verification returned HTTP 200 with `valid:false` and correct product-origin CORS.
- A fresh 45-request single-client burst returned 30×200 and 15×429. Every 429 had `Retry-After: 4`. Observed burst allowance: **30 requests**.

The API rate limit passes. It does not mitigate the client fail-open described above.

## PWA and offline evidence

- Chromium parsed the manifest and returned zero installability errors.
- The active `cleanroom-v1.0.4-shell` cache contained 21 shell entries.
- After a true `context.setOffline(true)` and `page.reload()`, `/demo/` reloaded, showed the offline status, retained sample data, and again produced 2 accepted / 1 rejected.
- A controlled two-version local simulation displayed **An app update is ready**, activated after **Update now**, reloaded under the new controller, and removed the old cache after activation.
- The only PWA defect observed is the live manifest MIME noted above.

## Accessibility, responsive behavior, and visual review

- `/opt/fleet/lib/verify-url.sh` passed live `/` and `/demo/`: HTTP 200, one `h1`, `lang=en`, main landmark, alt text, and no console errors.
- Playwright axe 4.10.2 found zero serious/critical violations—and zero violations of any impact—on landing with the license dialog, demo mapping, demo inspection, privacy, terms, and the live 404.
- The standalone `@axe-core/cli` was attempted; its Selenium launcher could not locate Chrome. The pinned Playwright Chromium axe scans above are the successful equivalent check.
- Keyboard-only Tab/Enter opens the demo. Focus rings are 3 px and visible after initialization; file-picker labels receive the designed `:focus-within` ring.
- The license dialog focuses its close button, traps forward/backward Tab, closes with Escape, and restores focus to **Unlock Plus**.
- At 390 px, page-level horizontal movement is prevented and the wide mapping/preview tables remain independently scrollable. Checkbox controls have 44 px label targets.
- Reduced-motion mode is detected; transitions/animations are reduced to 0.01 ms and smooth scrolling is disabled.
- Manual desktop and mobile review found the product-specific calibration-bench system clear and usable.

## Performance

Fresh Lighthouse 12.5.1 mobile results against the live root:

- Performance 100
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 0.9 s; LCP 1.2 s; Speed Index 0.9 s; TBT 0 ms; CLS 0; TTI 1.2 s
- Initial transfer: 71 KiB

Evidence: `.factory/qa-evidence/lighthouse-fba08c8-live.json`.

## Required before release

1. Keep first-time/unverified licenses locked when verification cannot complete; only a previously cached valid verdict may unlock optimistically offline. Add online, offline-first-use, invalid, revoked, cached-valid, and rate-limited license tests.
2. Make every material landing/README promise an exact `.factory/claims.json` entry with one observable `@claim:` test, or remove/narrow the copy. Make `@claim:offline-reload` perform an actual offline reload.
3. Serve `/manifest.webmanifest` as `application/manifest+json` and verify the live response header after deployment.
