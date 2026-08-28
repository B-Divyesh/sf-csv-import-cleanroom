# CSV Import Cleanroom — adversarial review 3 handoff

## Result

Review 3 is complete with verdict **FAIL**. The report records six blocking and ten minor findings at `.factory/review-3.md`. Product code was not modified.

The blocking items are a dead `/demo/#how` link, four partially fixed earlier findings (workspace focus, metadata claim, mapping terminology, and claim-registry completeness), and a CSP-broken/structurally incomplete offline page. The report also records unlisted Privacy/Terms claims and remaining metaphorical or result-mismatched interface copy.

## Verification performed

- Opened production cold in fresh Chromium contexts at 390 × 844 and 1440 × 900 before scrolling.
- Exercised the live one-click demo, sample mapping, Reset demo, Start for real, isolated IndexedDB namespaces, and outgoing-request log.
- Ran every command in `.factory/claims.json` individually from clean clone `/tmp/csv-cleanroom-review3-ZO2LWZ`; all 12 passed.
- Ran `npm test` (9/9), `npm run lint`, `npm run build`, and `npm run test:e2e` (30/30).
- Ran `npm run test:e2e -- tests/e2e/update.spec.ts --repeat-each=5` (5/5).
- Crawled live links and fragment targets, checked route metadata/HTTP status, tested Home → Demo/Privacy → Back, and scanned Home, Demo, Privacy, Terms, and 404 with Axe; the main routes had zero Axe violations.
- Opened `/offline.html` directly and confirmed its CSP style violation and missing route skeleton.

## Next steps

Resolve every finding in `.factory/review-3.md`, preserving the working demo isolation and deterministic local workflow. Add claim entries and tagged tests before retaining the unlisted promises. Re-run the review from scratch after deployment; do not accept the prior polish status as closure for F-1-3, F-1-8, F-1-15, or F-1-26.
