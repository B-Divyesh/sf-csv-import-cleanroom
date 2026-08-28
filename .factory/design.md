# Visual thesis — Calibration bench

## Direction and rationale

CSV Import Cleanroom is styled as a **mid-century instrument panel**: a warm enamel bench, dark phenolic controls, paper labels, precise tick marks, and restrained signal lamps. Operations staff are calibrating a conversion rather than editing the only copy of a spreadsheet. The metaphor makes the three-stage workflow—load, wire, inspect—legible while keeping the data itself dominant. It is intentionally single-mode; the explicitly painted warm workbench is core to the product's identity and all tokens are contrast-checked for that treatment.

## Tokens

- Background `#e9e1cf` (aged drafting paper); surface `#f8f2e5`; raised surface `#fffaf0`; ink `#1d2927`; muted ink `#59645f`.
- Panel `#213532` and panel ink `#f8f1df`; accent `#c64d32` (signal red); accent dark `#8f2f20`; brass `#b98a3d`.
- Success `#216a50`; warning `#8b5c08`; danger `#9f3027`; hairline `#aa9f88`. Status always includes a word or icon, never color alone.
- Type: system sans (`Inter`-like UI stack, no download) for prose and labels; `ui-monospace` for column names, counts, and samples. This keeps first load small and makes field-level work scan quickly.
- Type scale: 12, 14, 16, 20, 26, 42 px. Body never below 16 px; small sizes are restricted to supplemental labels.
- Spacing follows a 4 px base: 4, 8, 12, 16, 24, 32, 48, 64. Controls are at least 44 px high.

## Layout and interaction grammar

The app is a linear console: a compact masthead and assurance strip lead to one active work surface. Stage tabs resemble engraved selector plates. The mapping bench places target sockets beside source plugs, while inspection reads like a test printout. Primary actions are red lever-like buttons; secondary actions are outlined enamel keys. Mobile stacks every control, keeps data tables horizontally scrollable, and replaces side-by-side density with labeled blocks.

Feedback is immediate and physical: a selected stage depresses, success lamps illuminate with text, and the first rejected row expands into a diagnostic slip. Destructive reset requires a specific confirmation. Lossy transforms carry an amber “Review” marker before export.

## Motion

State changes use 180–240 ms opacity and 4 px vertical travel, with a single needle-sweep flourish on a successful run. Nothing loops. Under `prefers-reduced-motion: reduce`, travel and needle movement are removed and transitions become near-instant opacity changes.

## Asset plan and provenance

One original hero still life, `public/assets/calibration-bench.webp`, supports the instrument-panel world and explains the product as a physical calibration path. It is decorative/contextual, not a capability claim. App icons are authored SVG geometry derived from a CSV grid and calibration dial, then rendered locally to PNG for the manifest.

Art direction prompt sheet:

> Use case: stylized-concept. Asset type: compact landing/product hero. Scene: a 1960s data calibration bench viewed slightly from above, with two small stacks of punched paper cards feeding through brass guide rollers into one pristine aligned stack, knobs, meter ticks, red and green indicator lamps. Style: tactile editorial still life, screen-printed gouache with subtle paper grain, precise simplified geometry. Composition: wide 3:2 crop, apparatus weighted to the right with quiet negative space at left, no people. Light: warm desk lamp, soft short shadows. Palette: drafting-paper cream, deep bottle green, oxidized brass, restrained vermilion. Materials: enamel metal, phenolic knobs, paper, brushed brass. Avoid: readable text, letters, numbers, brand marks, logos, watermarks, laptops, sci-fi neon, gradients, generic dashboard UI, distorted machinery.

Generated with the factory Azure image deployment (`factory-image`) on 2026-08-28. Original commissioned asset for this product; no people, brands, or copyrighted characters. Source PNG and prompt sidecar are retained under `assets/src/`; shipping WebP is optimized to ≤300 KB.
