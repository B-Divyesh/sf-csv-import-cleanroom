import './styles.css';
import { guardFile, parseCsv, serializeCsv } from './csv';
import { blankMappings, makeRecipe, runRecipe, TRANSFORMS, validateRecipe, VALIDATIONS } from './engine';
import { captureLicense, CHECKOUT_URL, hasOptimisticLicense, storeLicense, verifyLicense } from './license';
import { clearDraft, deleteRecipe, listRecipes, loadDraft, saveDraft, saveRecipe } from './storage';
import type { CsvData, FieldMapping, Recipe, RunResult } from './types';

interface AppState {
  source: CsvData | null;
  target: CsvData | null;
  mappings: FieldMapping[];
  result: RunResult | null;
  stage: 1 | 2 | 3;
  recipes: Recipe[];
  paid: boolean;
  message: string;
  error: string;
  working: boolean;
  showLicense: boolean;
}

const state: AppState = { source: null, target: null, mappings: [], result: null, stage: 1, recipes: [], paid: false, message: '', error: '', working: true, showLicense: false };
const app = document.querySelector<HTMLDivElement>('#app')!;

const esc = (value: unknown) => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);
const options = (items: { id: string; label: string }[], selected: string) => items.map(item => `<option value="${esc(item.id)}" ${item.id === selected ? 'selected' : ''}>${esc(item.label)}</option>`).join('');

function render(): void {
  const ready = Boolean(state.source && state.target);
  app.innerHTML = `
    <header class="masthead">
      <a class="brand" href="/" aria-label="CSV Import Cleanroom home"><span class="brand-mark" aria-hidden="true">▦</span><span>CSV Import <strong>Cleanroom</strong></span></a>
      <nav aria-label="Primary navigation"><a href="#how">How it works</a><button class="text-button" data-action="license">${state.paid ? 'Cleanroom Plus' : 'Unlock Plus'}</button></nav>
    </header>
    <div class="network-strip" role="status"><span class="lamp ${navigator.onLine ? 'on' : ''}" aria-hidden="true"></span><span id="network-copy">${navigator.onLine ? 'Local processing ready' : 'Offline · local processing ready'}</span><span>Files never leave this device</span></div>
    <main id="main">
      <section class="hero" aria-labelledby="page-title">
        <div class="hero-copy">
          <p class="eyebrow">A preflight bench for strict imports</p>
          <h1 id="page-title">Make the CSV fit.<br><em>Keep the original intact.</em></h1>
          <p class="lede">Wire messy source columns to an exact template, inspect every rejected row, then keep the conversion as an auditable recipe.</p>
          <div class="hero-actions"><button class="primary" data-action="sample">Try the calibration sample</button><a class="secondary button-link" href="#workspace">Open your files</a></div>
          <ul class="assurances" aria-label="Product assurances"><li>100% on-device</li><li>Works offline</li><li>Formula-safe exports</li></ul>
        </div>
        <figure class="hero-visual"><picture><source media="(max-width: 600px)" srcset="/assets/calibration-bench-mobile.webp"><img src="/assets/calibration-bench.webp" width="1200" height="800" fetchpriority="high" alt="An illustrated mid-century calibration bench aligning stacks of punched data cards"></picture><figcaption>Source in. Exact template out.</figcaption></figure>
      </section>

      <section id="workspace" class="workspace" aria-labelledby="workspace-title">
        <div class="workspace-heading"><div><p class="eyebrow">Conversion console</p><h2 id="workspace-title">${ready ? 'Bench 01 · ' + esc(state.source?.name) : 'Set up the bench'}</h2></div>${ready ? '<button class="danger-link" data-action="reset">Reset bench</button>' : ''}</div>
        <ol class="stages" aria-label="Workflow stages">
          ${stageButton(1, 'Load', 'Source + template')}${stageButton(2, 'Wire', 'Map + transform', !ready)}${stageButton(3, 'Inspect', 'Validate + export', !ready)}
        </ol>
        <div class="announcer" aria-live="polite">${esc(state.message)}</div>
        ${state.error ? `<div class="alert error" role="alert"><strong>Bench stopped.</strong> ${esc(state.error)} <button class="text-button" data-action="clear-error">Dismiss</button></div>` : ''}
        ${state.working ? '<div class="loading" role="status"><span class="spinner" aria-hidden="true"></span> Restoring the last local bench…</div>' : stageView()}
      </section>

      <section id="how" class="how" aria-labelledby="how-title">
        <div><p class="eyebrow">Built for repeat work</p><h2 id="how-title">The recipe is the artifact.</h2></div>
        <ol><li><span>01</span><strong>Load two files</strong><p>Your untouched source and the target service’s header template.</p></li><li><span>02</span><strong>Name every decision</strong><p>Map columns, choose explicit transforms, and add strict rules.</p></li><li><span>03</span><strong>Inspect before export</strong><p>Separate accepted rows from explained rejects and reuse the JSON recipe.</p></li></ol>
      </section>
    </main>
    <footer><div><strong>CSV Import Cleanroom</strong><p>Independent local software by Sociobot.</p></div><nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><button class="text-button" data-action="license">${state.paid ? 'License active' : 'Cleanroom Plus · $19 once'}</button></nav><p class="provenance">Hero artwork generated for this product with factory-image.</p></footer>
    ${state.showLicense ? licensePanel() : ''}
    <div id="toast" class="toast" hidden role="status"><span>An app update is ready.</span><button data-action="update">Update now</button></div>`;
  bindEvents();
}

function stageButton(number: 1 | 2 | 3, title: string, detail: string, disabled = false): string {
  return `<li><button data-stage="${number}" ${disabled ? 'disabled' : ''} aria-current="${state.stage === number ? 'step' : 'false'}"><span>${number.toString().padStart(2, '0')}</span><strong>${title}</strong><small>${detail}</small></button></li>`;
}

function stageView(): string {
  if (state.stage === 1) return loadView();
  if (state.stage === 2) return mappingView();
  return inspectView();
}

function loadView(): string {
  return `<div class="load-grid">
    ${fileStation('source', 'A', 'Messy source CSV', 'The rows you need to clean. This file is only read.', state.source)}
    <div class="flow-arrow" aria-hidden="true">→</div>
    ${fileStation('target', 'B', 'Target template CSV', 'An empty template or example export. Its header defines the output.', state.target)}
  </div>
  <div class="limits"><strong>Local limits</strong><span>CSV only</span><span>10 MB per file</span><span>50,000 data rows</span><span>UTF-8 recommended</span></div>
  ${state.source?.warnings.length || state.target?.warnings.length ? `<div class="alert warning"><strong>Shape check:</strong> ${esc([...(state.source?.warnings ?? []), ...(state.target?.warnings ?? [])].join(' '))}</div>` : ''}
  <div class="stage-actions"><button class="secondary" data-action="sample">Use sample files</button><button class="primary" data-action="continue" ${!state.source || !state.target ? 'disabled' : ''}>Wire target fields <span aria-hidden="true">→</span></button></div>`;
}

function fileStation(kind: 'source' | 'target', letter: string, title: string, copy: string, file: CsvData | null): string {
  return `<article class="file-station ${file ? 'loaded' : ''}"><div class="station-tag">Input ${letter}</div><div class="file-icon" aria-hidden="true">${file ? '✓' : 'CSV'}</div><h3>${title}</h3><p>${copy}</p>${file ? `<div class="file-readout"><strong>${esc(file.name)}</strong><span>${file.headers.length} columns · ${file.rows.length.toLocaleString()} rows</span></div>` : ''}<label class="secondary file-label" for="${kind}-file">${file ? 'Replace CSV' : 'Choose CSV'}<input id="${kind}-file" type="file" accept=".csv,text/csv" data-file="${kind}"></label></article>`;
}

function mappingView(): string {
  if (!state.source || !state.target) return loadView();
  const rows = state.mappings.map((mapping, index) => `<tr>
    <th scope="row"><code>${esc(mapping.target)}</code>${mapping.required ? '<span class="required-mark">Required</span>' : ''}</th>
    <td><label class="sr-only" for="source-${index}">Source for ${esc(mapping.target)}</label><select id="source-${index}" data-map="source" data-index="${index}"><option value="">No source</option>${state.source!.headers.map(header => `<option ${header === mapping.source ? 'selected' : ''}>${esc(header)}</option>`).join('')}</select></td>
    <td><label class="sr-only" for="transform-${index}">Transform for ${esc(mapping.target)}</label><select id="transform-${index}" data-map="transform" data-index="${index}">${options(TRANSFORMS, mapping.transform)}</select>${mapping.transform !== 'copy' ? '<span class="review-tag">Review change</span>' : ''}</td>
    <td><label class="sr-only" for="rule-${index}">Validation for ${esc(mapping.target)}</label><select id="rule-${index}" data-map="validation" data-index="${index}">${options(VALIDATIONS, mapping.validation)}</select><label class="check"><input type="checkbox" data-map="required" data-index="${index}" ${mapping.required ? 'checked' : ''}> Required</label></td>
    <td><label class="sr-only" for="default-${index}">Default for ${esc(mapping.target)}</label><input id="default-${index}" data-map="defaultValue" data-index="${index}" value="${esc(mapping.defaultValue)}" placeholder="None"></td>
  </tr>`).join('');
  return `<div class="mapping-toolbar"><div><strong>${state.target.headers.length} target fields</strong><span>${state.mappings.filter(item => item.source || item.defaultValue).length} connected</span></div><div><button class="secondary compact" data-action="import-recipe">Import recipe</button><input class="sr-only" id="recipe-file" type="file" accept="application/json,.json"><button class="secondary compact" data-action="export-recipe">Export current recipe</button></div></div>
  <div class="table-scroll mapping-scroll" tabindex="0" aria-label="Target mapping table"><table class="mapping-table"><thead><tr><th>Target field</th><th>Source column</th><th>Transform</th><th>Rule</th><th>Fallback</th></tr></thead><tbody>${rows}</tbody></table></div>
  <p class="mapping-note"><span class="review-tag">Review change</span> marks transforms that can alter formatting or precision. The inspect stage shows every changed value before export.</p>
  <div class="recipe-shelf"><div><h3>Saved recipes</h3><p>Recipes contain field names and rules—never spreadsheet rows.</p></div>${recipeShelf()}</div>
  <div class="stage-actions"><button class="secondary" data-stage="1">Back to files</button><button class="primary" data-action="run">Run inspection <span aria-hidden="true">→</span></button></div>`;
}

function recipeShelf(): string {
  const saved = state.recipes.length ? `<ul>${state.recipes.map(recipe => `<li><button class="recipe-name" data-load-recipe="${esc(recipe.id)}">${esc(recipe.name)}</button><span>${recipe.mappings.length} fields</span><button class="icon-button" aria-label="Delete ${esc(recipe.name)}" data-delete-recipe="${esc(recipe.id)}">×</button></li>`).join('')}</ul>` : '<p class="empty-inline">No recipes saved on this device.</p>';
  return `<div class="recipe-list">${saved}<button class="secondary compact" data-action="save-recipe">Save this recipe ${!state.paid && state.recipes.length >= 1 ? '· Plus' : ''}</button></div>`;
}

function inspectView(): string {
  if (!state.result || !state.target) return `<div class="empty-inspect"><span class="dial" aria-hidden="true"></span><h3>No test run yet</h3><p>Wire the target fields, then run an inspection. No export is created until you review the results.</p><button class="primary" data-stage="2">Return to wiring</button></div>`;
  const result = state.result;
  const sampleRows = result.all.slice(0, 8);
  return `<div class="scoreboard" aria-label="Inspection summary"><div><span>Input rows</span><strong>${result.all.length.toLocaleString()}</strong></div><div class="good"><span>Accepted</span><strong>${result.accepted.length.toLocaleString()}</strong></div><div class="bad"><span>Rejected</span><strong>${result.rejected.length.toLocaleString()}</strong></div><div class="warn"><span>Values changed</span><strong>${result.lossyCount.toLocaleString()}</strong></div></div>
  ${result.formulaCount ? `<div class="alert safety"><strong>Formula shield active.</strong> ${result.formulaCount} ${result.formulaCount === 1 ? 'cell starts' : 'cells start'} like a spreadsheet formula. Export will prefix each with an apostrophe so opening the CSV cannot execute it.</div>` : ''}
  <div class="inspection-grid">
    <section aria-labelledby="preview-title"><div class="section-heading"><div><h3 id="preview-title">Output preview</h3><p>First ${sampleRows.length} rows · changed cells are marked.</p></div></div><div class="table-scroll" tabindex="0" aria-label="Output preview table"><table class="preview-table"><thead><tr><th>Source row</th>${state.target.headers.map(header => `<th>${esc(header)}</th>`).join('')}<th>Status</th></tr></thead><tbody>${sampleRows.map(row => `<tr class="${row.errors.length ? 'rejected' : ''}"><th>${row.sourceRow}</th>${row.values.map((value, index) => `<td class="${row.lossy.some(change => change.startsWith(state.target!.headers[index] + ':')) ? 'changed' : ''}"><span>${esc(value || '—')}</span></td>`).join('')}<td><span class="status-pill ${row.errors.length ? 'fail' : 'pass'}">${row.errors.length ? 'Rejected' : 'Accepted'}</span></td></tr>`).join('')}</tbody></table></div></section>
    <aside class="diagnostics" aria-labelledby="diagnostics-title"><div class="section-heading"><div><h3 id="diagnostics-title">Rejected-row notes</h3><p>Reasons use the target field names.</p></div></div>${rejectionList(result)}</aside>
  </div>
  <details class="change-log" ${result.lossyCount ? '' : 'hidden'}><summary>Review ${result.lossyCount} changed ${result.lossyCount === 1 ? 'value' : 'values'}</summary><ul>${result.all.flatMap(row => row.lossy.map(change => `<li><strong>Row ${row.sourceRow}</strong> ${esc(change)}</li>`)).slice(0, 100).join('')}</ul>${result.lossyCount > 100 ? '<p>Showing the first 100 changes.</p>' : ''}</details>
  <div class="export-rack"><div><p class="eyebrow">Export rack</p><h3>${result.accepted.length ? 'Accepted rows are ready.' : 'Fix the rejected rows before exporting.'}</h3><p>The target CSV contains accepted rows only. The rejection report preserves row numbers and explanations.</p></div><div><button class="primary" data-action="export-target" ${!result.accepted.length ? 'disabled' : ''}>Export target CSV</button><button class="secondary" data-action="export-rejects" ${!result.rejected.length ? 'disabled' : ''}>Export rejection report</button><button class="secondary" data-action="export-recipe">Export recipe JSON</button></div></div>
  <div class="stage-actions"><button class="secondary" data-stage="2">Adjust wiring</button><button class="secondary" data-action="run">Run inspection again</button></div>`;
}

function rejectionList(result: RunResult): string {
  if (!result.rejected.length) return '<div class="all-clear"><span aria-hidden="true">✓</span><strong>All rows passed</strong><p>No rejected rows in this run.</p></div>';
  return `<ol class="rejection-list">${result.rejected.slice(0, 12).map(row => `<li><strong>Source row ${row.sourceRow}</strong><ul>${row.errors.map(error => `<li>${esc(error)}</li>`).join('')}</ul></li>`).join('')}</ol>${result.rejected.length > 12 ? `<p>And ${result.rejected.length - 12} more in the downloadable report.</p>` : ''}`;
}

function licensePanel(): string {
  return `<div class="modal-backdrop"><section class="license-panel" role="dialog" aria-modal="true" aria-labelledby="license-title"><button class="modal-close" data-action="close-license" aria-label="Close license panel">×</button><p class="eyebrow">One-time license</p><h2 id="license-title">Cleanroom Plus</h2>${state.paid ? '<p class="license-active"><span class="lamp on"></span> License active on this device</p>' : '<p class="price"><strong>$19</strong> once</p>'}<p>Keep the free workflow forever, including safe CSV and recipe exports. Plus unlocks unlimited on-device saved recipes for recurring operations.</p><ul><li>Unlimited saved recipes on this device</li><li>Restore on every device with your license</li><li>No spreadsheet uploads or subscription</li></ul>${state.paid ? '' : `<a class="primary button-link full" href="${CHECKOUT_URL}">Buy Cleanroom Plus</a>`}<div class="restore"><label for="license-token">Have a license? Paste it here</label><div><input id="license-token" autocomplete="off" spellcheck="false" placeholder="License token"><button class="secondary" data-action="restore-license">Verify license</button></div></div><p class="legal-note">Sociobot/Dodo is the merchant of record. Refunds are handled there and revoke the license. <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></p></section></div>`;
}

function bindEvents(): void {
  app.querySelectorAll<HTMLElement>('[data-stage]').forEach(element => element.addEventListener('click', () => {
    if (element instanceof HTMLButtonElement && element.disabled) return;
    state.stage = Number(element.dataset.stage) as 1 | 2 | 3; state.error = ''; render(); scrollWorkspace();
  }));
  app.querySelectorAll<HTMLInputElement>('[data-file]').forEach(input => input.addEventListener('change', () => void loadFile(input)));
  app.querySelectorAll<HTMLElement>('[data-action]').forEach(element => element.addEventListener('click', () => void action(element.dataset.action ?? '')));
  app.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-map]').forEach(input => input.addEventListener('change', () => updateMapping(input)));
  app.querySelector<HTMLInputElement>('#recipe-file')?.addEventListener('change', event => void importRecipe((event.currentTarget as HTMLInputElement).files?.[0]));
  app.querySelectorAll<HTMLElement>('[data-load-recipe]').forEach(button => button.addEventListener('click', () => applySavedRecipe(button.dataset.loadRecipe!)));
  app.querySelectorAll<HTMLElement>('[data-delete-recipe]').forEach(button => button.addEventListener('click', () => void removeRecipe(button.dataset.deleteRecipe!)));
  const dialog = app.querySelector<HTMLElement>('[role="dialog"]');
  dialog?.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeLicense(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled])')];
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
}

async function loadFile(input: HTMLInputElement): Promise<void> {
  const file = input.files?.[0]; if (!file) return;
  try {
    guardFile(file); const data = parseCsv(await file.text(), file.name);
    if (input.dataset.file === 'source') state.source = data;
    else { state.target = data; state.mappings = blankMappings(data.headers); state.result = null; }
    state.error = ''; state.message = `${file.name} loaded locally.`; await persist(); render();
  } catch (error) { fail(error); }
}

async function action(name: string): Promise<void> {
  if (name === 'sample') loadSample();
  else if (name === 'continue') { state.stage = 2; render(); scrollWorkspace(); }
  else if (name === 'run') inspect();
  else if (name === 'reset') await resetBench();
  else if (name === 'clear-error') { state.error = ''; render(); }
  else if (name === 'export-target') exportTarget();
  else if (name === 'export-rejects') exportRejects();
  else if (name === 'export-recipe') exportRecipe();
  else if (name === 'import-recipe') app.querySelector<HTMLInputElement>('#recipe-file')?.click();
  else if (name === 'save-recipe') await saveCurrentRecipe();
  else if (name === 'license') { state.showLicense = true; render(); queueMicrotask(() => app.querySelector<HTMLButtonElement>('.modal-close')?.focus()); }
  else if (name === 'close-license') closeLicense();
  else if (name === 'restore-license') await restoreLicense();
  else if (name === 'update') location.reload();
}

function loadSample(): void {
  state.source = parseCsv('Customer ID,Full Name,Email,Start Date,Balance\n ac-001 ,Ada Rivera,ada@example.com,31/01/2026,"$1,240.50"\n ac-002 ,Noor Malik,not-an-email,2026-02-14,"(75.20)"\n=2+2,Sam Chen,sam@example.com,February 8 2026,19.95', 'customer-source-sample.csv');
  state.target = parseCsv('external_id,name,email,started_on,balance_usd\n', 'strict-template-sample.csv');
  state.mappings = [
    { target: 'external_id', source: 'Customer ID', transform: 'id-upper', validation: 'required', required: true, defaultValue: '' },
    { target: 'name', source: 'Full Name', transform: 'trim', validation: 'required', required: true, defaultValue: '' },
    { target: 'email', source: 'Email', transform: 'lowercase', validation: 'email', required: true, defaultValue: '' },
    { target: 'started_on', source: 'Start Date', transform: 'date-iso', validation: 'iso-date', required: true, defaultValue: '' },
    { target: 'balance_usd', source: 'Balance', transform: 'currency', validation: 'number', required: false, defaultValue: '0' }
  ];
  state.stage = 2; state.result = null; state.error = ''; state.message = 'Sample loaded. Review its explicit wiring, then run inspection.'; void persist(); render(); scrollWorkspace();
}

function updateMapping(input: HTMLInputElement | HTMLSelectElement): void {
  const mapping = state.mappings[Number(input.dataset.index)]; if (!mapping) return;
  const key = input.dataset.map as keyof FieldMapping;
  if (key === 'required' && input instanceof HTMLInputElement) mapping.required = input.checked;
  else (mapping as unknown as Record<string, string>)[key] = input.value;
  state.result = null; void persist();
}

function closeLicense(): void { state.showLicense = false; render(); queueMicrotask(() => app.querySelector<HTMLElement>('[data-action="license"]')?.focus()); }

function inspect(): void {
  if (!state.source || !state.target) return;
  if (!state.mappings.some(mapping => mapping.source || mapping.defaultValue)) { fail(new Error('Connect at least one target field to a source column or fallback value.')); state.stage = 2; return; }
  state.result = runRecipe(state.source.headers, state.source.rows, state.mappings); state.stage = 3;
  state.message = `Inspection complete: ${state.result.accepted.length} accepted, ${state.result.rejected.length} rejected.`; render(); scrollWorkspace();
}

async function resetBench(): Promise<void> {
  if (!confirm(`Reset “${state.source?.name ?? 'this bench'}”? Your source files and mappings will be removed from this device. Saved recipes stay available.`)) return;
  state.source = null; state.target = null; state.mappings = []; state.result = null; state.stage = 1; state.message = 'Bench reset.'; await clearDraft(); render();
}

function currentRecipe(): Recipe { return makeRecipe(state.target?.name.replace(/\.csv$/i, '') || 'Untitled recipe', state.mappings); }
function exportRecipe(): void { download(`${slug(state.target?.name ?? 'cleanroom')}-recipe.json`, JSON.stringify(currentRecipe(), null, 2), 'application/json'); state.message = 'Recipe JSON exported.'; render(); }
function exportTarget(): void { if (!state.result || !state.target) return; download(`${slug(state.target.name)}-accepted.csv`, serializeCsv(state.target.headers, state.result.accepted.map(row => row.values)), 'text/csv;charset=utf-8'); }
function exportRejects(): void { if (!state.result || !state.target) return; download('cleanroom-rejections.csv', serializeCsv(['source_row', 'reasons', ...state.target.headers], state.result.rejected.map(row => [`${row.sourceRow}`, row.errors.join('; '), ...row.values])), 'text/csv;charset=utf-8'); }

async function importRecipe(file?: File): Promise<void> {
  if (!file) return;
  try {
    const recipe = validateRecipe(JSON.parse(await file.text()));
    if (state.target && recipe.targetHeaders.join('\u0000') !== state.target.headers.join('\u0000')) throw new Error('This recipe does not match the loaded target headers or their order.');
    state.mappings = structuredClone(recipe.mappings); state.result = null; state.message = `Recipe “${recipe.name}” applied.`; await persist(); render();
  } catch (error) { fail(error); }
}

async function saveCurrentRecipe(): Promise<void> {
  if (!state.mappings.length) return;
  if (!state.paid && state.recipes.length >= 1) { state.showLicense = true; state.message = 'The free bench saves one recipe locally. JSON export always stays free.'; render(); return; }
  const suggested = state.target?.name.replace(/\.csv$/i, '') || 'My import';
  const name = prompt('Name this recipe', suggested)?.trim(); if (!name) return;
  const recipe = makeRecipe(name, state.mappings); await saveRecipe(recipe); state.recipes = await listRecipes(); state.message = `Recipe “${name}” saved on this device.`; render();
}

function applySavedRecipe(id: string): void {
  const recipe = state.recipes.find(item => item.id === id); if (!recipe) return;
  if (state.target && recipe.targetHeaders.join('\u0000') !== state.target.headers.join('\u0000')) { fail(new Error('That saved recipe does not match the current target template.')); return; }
  state.mappings = structuredClone(recipe.mappings); state.result = null; state.message = `Recipe “${recipe.name}” applied.`; void persist(); render();
}

async function removeRecipe(id: string): Promise<void> { const recipe = state.recipes.find(item => item.id === id); if (!recipe || !confirm(`Delete the saved recipe “${recipe.name}”?`)) return; await deleteRecipe(id); state.recipes = await listRecipes(); render(); }

async function restoreLicense(): Promise<void> {
  const token = app.querySelector<HTMLInputElement>('#license-token')?.value.trim(); if (!token) { fail(new Error('Paste the license token from your receipt.')); return; }
  storeLicense(token); const verdict = await verifyLicense(true); state.paid = verdict.valid; state.showLicense = !verdict.valid; state.message = verdict.valid ? 'Cleanroom Plus is active on this device.' : 'That license could not be verified. Check the token and try again.'; render();
}

function download(name: string, content: string, type: string): void { const url = URL.createObjectURL(new Blob(['\uFEFF', content], { type })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function slug(name: string): string { return name.replace(/\.csv$/i, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'cleanroom'; }
function persist(): Promise<IDBValidKey> { return saveDraft(state.source, state.target, state.mappings); }
function fail(error: unknown): void { state.error = error instanceof Error ? error.message : 'Something went wrong. Try the file again.'; state.message = ''; render(); }
function scrollWorkspace(): void { document.querySelector('#workspace')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }

async function initialise(): Promise<void> {
  captureLicense(); state.paid = hasOptimisticLicense(); render();
  try {
    const [draft, recipes] = await Promise.all([loadDraft(), listRecipes()]);
    if (draft) { state.source = draft.source; state.target = draft.target; state.mappings = draft.mappings; }
    state.recipes = recipes; state.working = false; render();
  } catch { state.working = false; state.error = 'Saved local work could not be opened. You can still start a new bench.'; render(); }
  if (localStorage.getItem('sb_license:csv-import-cleanroom')) {
    const verdict = await verifyLicense(); if (verdict.valid !== state.paid) { state.paid = verdict.valid; if (!verdict.valid) state.message = 'Your saved license is no longer active.'; render(); }
  }
  registerServiceWorker();
}

function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  const hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.register('/sw.js').then(registration => {
    if (registration.waiting) showUpdate(registration);
    registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', () => { if (registration.waiting && navigator.serviceWorker.controller) showUpdate(registration); }));
  }).catch(() => { /* The app remains usable without installation. */ });
  let refreshing = false; navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !refreshing) { refreshing = true; location.reload(); } });
}

function showUpdate(registration: ServiceWorkerRegistration): void { const toast = document.querySelector<HTMLDivElement>('#toast'); if (!toast) return; toast.hidden = false; toast.querySelector('button')?.addEventListener('click', () => registration.waiting?.postMessage({ type: 'SKIP_WAITING' })); }
window.addEventListener('online', render); window.addEventListener('offline', render);
void initialise();
