# CSV Import Cleanroom

CSV Import Cleanroom helps operations staff turn messy CSV files into strict import templates. It works offline after the first visit.

Map source columns to target fields. Apply named date, currency, or ID transforms. Validate rows, explain rejects, and reuse an exported recipe.

Live product: <https://csv-import-cleanroom.sociobot.in>

## Capabilities

- A one-click [isolated sample demo](https://csv-import-cleanroom.sociobot.in/demo/)
- Free accepted-row CSV and reusable recipe JSON exports
- Free rejection-report exports and one saved local recipe
- Formula-like cells neutralized in every CSV export
- Offline reload after the first visit
- Local limits of 10 MB and 50,000 data rows per file
- Recipe JSON contains field names and rules, not spreadsheet rows
- A $19 one-time Plus license with no subscription for unlimited on-device saved recipes
- Normal work survives refresh until you reset it or delete a saved recipe

Every product promise and its test appears in [`.factory/claims.json`](.factory/claims.json). The demo sandbox is documented in [`.factory/demo.md`](.factory/demo.md).

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

The build type-checks the app and bundles it with Vite. It adds hashed assets to the offline cache and writes the site to `dist/`.

Run verification with:

```sh
npm test
npm run lint
npm run test:e2e
```

Playwright uses Chromium 1.58.2. It checks demo isolation, conversion, exports, keyboard focus, the 390 px layout, offline reload, and serious or critical accessibility issues.

## Privacy and billing

During normal and demo processing, spreadsheet rows remain in the browser. With a license present, verification is the only third-party background request. It includes no spreadsheet rows and runs at most daily. Checkout and license verification use the Sociobot billing API. No payment provider is embedded. See [`/privacy`](https://csv-import-cleanroom.sociobot.in/privacy/) and [`/terms`](https://csv-import-cleanroom.sociobot.in/terms/).

## Deployment

Deploy the contents of `dist/` as a static site with directory routing enabled. Do not deploy the repository root. The factory owns DNS and production registration of the billing product.

The product brief and visual system are recorded in [`.factory/brief.json`](.factory/brief.json) and [`.factory/design.md`](.factory/design.md).

## License

MIT. See [LICENSE](LICENSE).
