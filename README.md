# CSV Import Cleanroom

CSV Import Cleanroom is an offline-first browser utility for operations staff preparing a messy CSV for a strict SaaS import template.

It maps fields, runs named date, currency, and ID transforms, validates each row, explains rejects, and restores mappings from exported recipe JSON.

Live product: <https://csv-import-cleanroom.sociobot.in>

## Capabilities

- A one-click [isolated sample demo](https://csv-import-cleanroom.sociobot.in/demo/)
- Free accepted-row CSV and reusable recipe JSON exports
- Formula-like cells neutralized in every CSV export
- Offline reload after the first visit
- Local limits of 10 MB and 50,000 data rows per file
- Recipe JSON contains field names and rules, not spreadsheet rows
- A $19 one-time Plus license with no subscription for unlimited on-device saved recipes

Every visitor-facing claim and its executable regression test is listed in [`.factory/claims.json`](.factory/claims.json). The demo sandbox is documented in [`.factory/demo.md`](.factory/demo.md).

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
npm run lint
npm run test:e2e
```

The Playwright suite uses Chromium 1.58.2 and covers demo isolation, sample conversion/export, serious/critical axe checks in each workflow state, keyboard focus, a 390 px layout, and an offline reload.

## Privacy and billing

During normal and demo processing, spreadsheet rows remain in the browser. With a license present, verification is the only third-party background request. It includes no spreadsheet rows and runs at most daily. Checkout and license verification use the Sociobot billing API; no payment provider is embedded. See [`/privacy`](https://csv-import-cleanroom.sociobot.in/privacy/) and [`/terms`](https://csv-import-cleanroom.sociobot.in/terms/).

## Deployment

Deploy the contents of `dist/` as a static site with directory routing enabled. Do not deploy the repository root. The factory owns DNS and production registration of the billing product.

The product brief and visual system are recorded in [`.factory/brief.json`](.factory/brief.json) and [`.factory/design.md`](.factory/design.md).

## License

MIT. See [LICENSE](LICENSE).
