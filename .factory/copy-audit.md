# Landing copy audit — polish 4

Word counts are whitespace-delimited. Every visible landing-page copy unit is
22 words or fewer and contains no banned marketing language.

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Skip link | Skip to workspace | 3 | Pass |
| Header/footer | CSV Import Cleanroom | 3 | Pass |
| Header | Demo; How it works; Privacy | 1; 3; 1 | Pass |
| Plus action | View Cleanroom Plus — $19 once | 6 | Pass |
| Status | Local processing ready | 3 | Pass |
| Status | Files never leave this device | 5 | Pass; `on-device-processing` |
| Hero label | Map, validate, and export CSV rows | 6 | Pass |
| Hero H1 | Prepare CSV imports. | 3 | Pass |
| Hero sentence | For operations staff and solo admins preparing a target template from messy spreadsheets. | 13 | Pass |
| Hero actions | Try it with sample data; Choose CSV files | 5; 3 | Pass |
| Hero sentence | The sample opens a mapped import with one explained rejection. | 10 | Pass; `demo-isolation`, `conversion-workflow` |
| Hero facts | Files stay on this device; Works offline after first visit; $19 once for unlimited recipes | 5; 5; 5 | Pass; registered claims |
| Figure caption | Accepted rows follow your target template. | 6 | Pass; `conversion-workflow` |
| Workspace | CSV import workspace | 3 | Pass |
| Workspace H2 | Choose the source and target CSV files | 7 | Pass |
| Stages | Load; Source + target template; Map; Map + transform; Inspect; Validate + export | 1; 4; 1; 3; 1; 3 | Pass |
| Source input | Input A; CSV; Messy source CSV | 2; 1; 3 | Pass |
| Source help/action | The rows you need to clean.; Choose source CSV | 6; 3 | Pass |
| Target input | Input B; CSV; Target template CSV | 2; 1; 3 | Pass |
| Target help | An empty template or example export.; Its header defines the output. | 6; 5 | Pass |
| Target action | Choose target template CSV | 4 | Pass |
| Limits | Local limits; CSV only; 10 MB per file; 50,000 data rows; UTF-8 recommended | 2; 2; 4; 3; 2 | Pass; `file-limits` |
| Workspace actions | Use sample files; Map target fields | 3; 3 | Pass |
| How section | How CSV cleanup works; Reuse the same import settings | 4; 5 | Pass |
| Step 1 | Load two files; Load a source CSV and define the target template CSV once. | 3; 11 | Pass |
| Step 2 | Map target fields; Map columns, choose explicit transforms, and add strict rules. | 3; 9 | Pass; `conversion-workflow` |
| Step 3 | Inspect before export; Separate accepted rows from explained rejects and reuse the JSON recipe. | 3; 11 | Pass; `conversion-workflow` |
| Privacy section | Privacy and limits; Process CSV files on this device | 3; 6 | Pass |
| Privacy sentence | Spreadsheet rows stay in your browser during normal and demo processing. | 11 | Pass; `on-device-processing` |
| Privacy sentence | Review the exported CSV before importing it into your target service. | 11 | Pass |
| Privacy action | Read the privacy policy | 4 | Pass |
| Plus section | Cleanroom Plus; Save unlimited recipes for $19 once | 2; 6 | Pass; `plus-price` |
| Plus sentence | No subscription. | 2 | Pass; `plus-price` |
| Plus sentence | CSV export, recipe export, rejection reports, and safety checks stay free. | 11 | Pass; registered export and entitlement claims |
| Free tier | Free; Save one recipe and export every result. | 1; 7 | Pass; `free-tier-entitlements` |
| Plus tier | Plus · $19 once; Unlimited saved recipes on this device. | 4; 6 | Pass; `plus-price` |
| Footer sentence | Local CSV preparation for strict imports. | 6 | Pass |
| Footer links | Demo; Privacy; Terms | 1; 1; 1 | Pass |
| Provenance | Built by Param Factory · v1.0.9 · Hero artwork generated for this product with factory-image. | 15 | Pass |

## Workflow and state copy

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved | 7 | Pass; `demo-isolation` |
| This demo uses separate local storage. | 6 | Pass; `demo-isolation` |
| Reset demo; Start for real | 2; 3 | Pass |
| Restoring your saved workspace… | 4 | Pass |
| Could not continue. | 3 | Pass |
| Workspace reset. | 2 | Pass |
| Formula-like values will be escaped. | 6 | Pass; `formula-safe-export` |
| Export inspection results | 3 | Pass |
| Back to mapping | 3 | Pass |
| This page is unavailable offline | 6 | Pass |
| Return to CSV workspace | 4 | Pass |
| Page not found. | 3 | Pass |
| Return to the CSV workspace or try it with sample data. | 11 | Pass |

## Terminology

| Concept | One term |
| --- | --- |
| Input spreadsheet | source CSV |
| Destination header definition | target template |
| Saved mapping and rules | recipe |
| Test conversion result | inspection |
| Isolated sample workspace | demo |

No audited sentence exceeds 22 words. The catalogue sentence is 98 characters,
starts with “Prepare,” and contains no banned term.
