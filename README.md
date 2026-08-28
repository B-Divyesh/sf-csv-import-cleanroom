# CSV Import Cleanroom

CSV Import Cleanroom is an offline-first browser utility for operations staff who need to turn a messy CSV into a strict SaaS import template without editing the original file or writing a script.

The product loads a source CSV and target header template, lets the operator explicitly map each field, applies named date/currency/ID transforms, validates every output row, explains rejects in target-column language, and exports both a safe target CSV and reusable JSON recipe. Spreadsheet content is processed and stored only in the browser.

Live product: <https://csv-import-cleanroom.sociobot.in>

## Capabilities

- Local CSV parsing up to 10 MB and 50,000 data rows per file
- Side-by-side target/source wiring with explicit fallbacks
- Trim, ISO date, currency, integer, ID uppercase, and lowercase transforms
- Required, email, ISO date, number, and whole-number validation
- Accepted-only target CSV plus a rejected-row explanation report
- CSV formula-injection protection at export
- Portable JSON recipes and IndexedDB draft recovery
- Installable PWA with an offline-cached app shell
- Free workflow with one saved local recipe; $19 one-time Plus license for unlimited local recipe saves

## Develop and verify

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

The required production build command is:

```sh
npm run build
```

It type-checks the app, builds with Vite, injects hashed assets into the service-worker precache, and writes the deployable site to `dist/` with `dist/index.html` at its root.

Run verification with:

```sh
npm test
npm run test:e2e
```

The Playwright suite uses Chromium 1.58.2 and covers the sample conversion, export, serious/critical axe checks, and operation after `context.setOffline(true)`.

## Privacy and billing

No spreadsheet rows, recipes, analytics, fonts, or scripts are sent to third parties. License verification is the only background API request and runs at most daily when a license is present. Checkout and license verification use the Sociobot billing API; no payment provider is embedded. See [`/privacy`](https://csv-import-cleanroom.sociobot.in/privacy/) and [`/terms`](https://csv-import-cleanroom.sociobot.in/terms/).

## Deployment

Deploy the contents of `dist/` as a static site with directory routing enabled. Do not deploy the repository root. The factory owns DNS and production registration of the billing product.

The product brief and visual system are recorded in [`.factory/brief.json`](.factory/brief.json) and [`.factory/design.md`](.factory/design.md).

## License

MIT. See [LICENSE](LICENSE).
