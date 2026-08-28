# Demo sandbox

- URL: `https://csv-import-cleanroom.sociobot.in/?demo=1` (or `/demo/`). The landing action opens the query URL in one click.
- The demo loads a realistic three-row customer-import source and a five-column strict target template. It opens on the mapped stage so the first screen is already useful.
- Demo state is stored only in the IndexedDB database `demo:csv-import-cleanroom`. Real work uses `csv-import-cleanroom`; the two namespaces are never read together.
- The persistent banner identifies demo mode. **Reset demo** deletes only the demo database and reloads the sample. **Start for real** deletes the demo database and returns to `/`; it does not change real work.
- The sample is available from the service-worker cache after the first visit, so `/demo/` can be reloaded and inspected offline.
