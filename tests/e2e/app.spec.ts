import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, readdir } from 'node:fs/promises';

const LICENSE_KEY = 'sb_license:csv-import-cleanroom';
const VERDICT_KEY = 'sb_license_verdict:csv-import-cleanroom';
const VERIFY_URL = '**/api/v1/products/csv-import-cleanroom/verify?license=*';

async function openDemo(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/demo/');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('customer-source-sample.csv')).toBeVisible();
}

async function waitForOfflineReady(page: import('@playwright/test').Page): Promise<void> {
  await page.waitForFunction(async () => {
    const registration = await navigator.serviceWorker?.ready;
    return registration?.active?.state === 'activated' && navigator.serviceWorker.controller?.state === 'activated' && (await caches.keys()).some(name => name.endsWith('-shell'));
  });
  await page.waitForTimeout(250);
}

test('@claim:demo-isolation keeps sample work separate and preserves a real draft', async ({ page }) => {
  await page.goto('/');
  await page.locator('#source-file').setInputFiles({ name: 'real-ops.csv', mimeType: 'text/csv', buffer: Buffer.from('ID\nreal-1\n') });
  await page.locator('#target-file').setInputFiles({ name: 'real-template.csv', mimeType: 'text/csv', buffer: Buffer.from('external_id\n') });
  await expect(page.getByText('real-ops.csv', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('customer-source-sample.csv')).toBeVisible();
  await page.reload();
  await expect(page.getByText('customer-source-sample.csv')).toBeVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('real-ops.csv', { exact: true })).toBeVisible();
});

test('@claim:csv-export keeps accepted CSV and reusable recipe exports free', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: /Run inspection/ }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export target CSV' }).click();
  const path = await (await downloadPromise).path();
  const csv = await readFile(path!, 'utf8');
  expect(csv).toContain('external_id,name,email,started_on,balance_usd');
  expect(csv).toContain('AC-001,Ada Rivera,ada@example.com,2026-01-31,1240.5');
  expect(csv).not.toContain('not-an-email');
  expect(csv.trim().split(/\r?\n/)).toHaveLength(3);
  const recipeDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export recipe JSON' }).click();
  const recipePath = await (await recipeDownload).path();
  const recipe = JSON.parse((await readFile(recipePath!, 'utf8')).replace(/^\uFEFF/, ''));
  expect(recipe.kind).toBe('csv-import-cleanroom-recipe');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('@claim:formula-safe-export neutralizes sample spreadsheet formulas', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: /Run inspection/ }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export target CSV' }).click();
  const path = await (await downloadPromise).path();
  expect(await readFile(path!, 'utf8')).toContain("'=2+2");
});

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo/');
  await waitForOfflineReady(page);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Offline · local processing ready/)).toBeVisible();
  await expect(page.getByText('customer-source-sample.csv')).toBeVisible();
  await page.getByRole('button', { name: /Run inspection/ }).click();
  await expect(page.getByText('1 rejected')).toBeVisible();
});

test('@claim:on-device-processing keeps normal and demo spreadsheet processing on-device', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await page.locator('#source-file').setInputFiles({ name: 'private.csv', mimeType: 'text/csv', buffer: Buffer.from('ID,Email\nsecret-1,private@example.com\n') });
  await page.locator('#target-file').setInputFiles({ name: 'target.csv', mimeType: 'text/csv', buffer: Buffer.from('external_id,email\n') });
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByRole('button', { name: /Run inspection/ }).click();
  expect(requests.every(url => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  expect(requests.join('\n')).not.toContain('private@example.com');
});

test('@claim:plus-price shows the $19 one-time, no-subscription local-recipe license', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'View Cleanroom Plus — $19 once' }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('.price')).toHaveText('$19 once');
  await expect(dialog.getByText('unlimited on-device saved recipes')).toBeVisible();
  await expect(dialog.getByText('No spreadsheet uploads or subscription')).toBeVisible();
});

test('@claim:recipe-data-separation exports rules without spreadsheet rows', async ({ page }) => {
  await openDemo(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export current recipe' }).click();
  const path = await (await downloadPromise).path();
  const text = (await readFile(path!, 'utf8')).replace(/^\uFEFF/, '');
  const recipe = JSON.parse(text);
  expect(recipe).toMatchObject({ kind: 'csv-import-cleanroom-recipe', version: 1 });
  expect(recipe.mappings).toHaveLength(5);
  for (const spreadsheetValue of ['Ada Rivera', 'ada@example.com', 'Noor Malik', 'not-an-email', 'Sam Chen', '=2+2', '1240.50']) {
    expect(text).not.toContain(spreadsheetValue);
  }
  expect(Object.keys(recipe).sort()).toEqual(['createdAt', 'id', 'kind', 'mappings', 'name', 'targetHeaders', 'updatedAt', 'version']);
});

test('@claim:conversion-workflow transforms, validates, explains, and reuses a recipe', async ({ page }) => {
  await openDemo(page);
  await expect(page.locator('#transform-0')).toHaveValue('id-upper');
  await expect(page.locator('#transform-3')).toHaveValue('date-iso');
  await expect(page.locator('#transform-4')).toHaveValue('currency');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export current recipe' }).click();
  const recipePath = await (await downloadPromise).path();
  const recipeBuffer = await readFile(recipePath!);
  await page.locator('#source-0').selectOption('');
  await expect(page.locator('#source-0')).toHaveValue('');
  await page.locator('#recipe-file').setInputFiles({ name: 'reusable-recipe.json', mimeType: 'application/json', buffer: recipeBuffer });
  await expect(page.locator('#source-0')).toHaveValue('Customer ID');
  await expect(page.getByText(/Recipe “strict-template-sample” applied/)).toBeVisible();
  await page.getByRole('button', { name: /Run inspection/ }).click();
  await expect(page.getByText('Inspection complete: 2 accepted, 1 rejected.')).toBeVisible();
  await expect(page.getByText('email is not a valid email address')).toBeVisible();
  await expect(page.locator('.preview-table')).toContainText('2026-01-31');
  await expect(page.locator('.preview-table')).toContainText('1240.5');
});

test('@claim:license-request-policy sends only the token to verification at most once daily', async ({ page }) => {
  let checks = 0;
  const externalRequests: { url: string; body: string | null }[] = [];
  await page.addInitScript(({ licenseKey }) => localStorage.setItem(licenseKey, 'daily-token'), { licenseKey: LICENSE_KEY });
  await page.route(VERIFY_URL, async route => {
    checks += 1;
    externalRequests.push({ url: route.request().url(), body: route.request().postData() });
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) });
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Cleanroom Plus', exact: true })).toBeVisible();
  await page.locator('#source-file').setInputFiles({ name: 'private.csv', mimeType: 'text/csv', buffer: Buffer.from('secret\nprivate-row\n') });
  await page.reload();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Cleanroom Plus', exact: true })).toBeVisible();
  expect(checks).toBe(1);
  expect(externalRequests).toHaveLength(1);
  expect(externalRequests[0]?.url).toBe('https://api.sociobot.in/api/v1/products/csv-import-cleanroom/verify?license=daily-token');
  expect(externalRequests[0]?.body).toBeNull();
  expect(JSON.stringify(externalRequests)).not.toContain('private-row');
});

test('@claim:billing-route uses Sociobot checkout without embedded payment providers', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await page.getByRole('button', { name: 'View Cleanroom Plus — $19 once' }).first().click();
  const checkout = page.getByRole('link', { name: 'Buy Cleanroom Plus' });
  await expect(checkout).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/csv-import-cleanroom/checkout');
  expect(await page.locator('iframe').count()).toBe(0);
  expect(await page.locator('script[src*="stripe" i], script[src*="paypal" i], script[src*="dodo" i]').count()).toBe(0);
  expect(requests.some(url => /stripe|paypal|dodo/i.test(url))).toBe(false);
});

test('@claim:free-tier-entitlements exports rejection reports and saves one recipe before Plus', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: /Run inspection/ }).click();
  const rejectionDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export rejection report' }).click();
  const reportPath = await (await rejectionDownload).path();
  const report = await readFile(reportPath!, 'utf8');
  expect(report).toContain('source_row,reasons,external_id,name,email,started_on,balance_usd');
  expect(report).toContain('email is not a valid email address');
  await page.getByRole('button', { name: 'Back to mapping' }).click();
  page.once('dialog', dialog => dialog.accept('First local recipe'));
  await page.getByRole('button', { name: /Save this recipe/ }).click();
  await expect(page.getByRole('button', { name: 'First local recipe', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Save this recipe.*Plus/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('The free workspace saves one recipe locally. JSON export always stays free.')).toBeVisible();
});

test('@claim:local-data-lifecycle persists normal work, deletes recipes, and resets the active workspace', async ({ page }) => {
  await page.goto('/');
  await page.locator('#source-file').setInputFiles({ name: 'persistent-source.csv', mimeType: 'text/csv', buffer: Buffer.from('ID,Email\nreal-1,operator@example.com\n') });
  await page.locator('#target-file').setInputFiles({ name: 'persistent-template.csv', mimeType: 'text/csv', buffer: Buffer.from('external_id,email\n') });
  await page.reload();
  await expect(page.getByText('persistent-source.csv', { exact: true })).toBeVisible();
  await expect(page.getByText('persistent-template.csv', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Map target fields' }).click();
  page.once('dialog', dialog => dialog.accept('Persistent recipe'));
  await page.getByRole('button', { name: /Save this recipe/ }).click();
  await expect(page.getByRole('button', { name: 'Persistent recipe', exact: true })).toBeVisible();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete Persistent recipe' }).click();
  await expect(page.getByRole('button', { name: 'Persistent recipe', exact: true })).toHaveCount(0);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Reset workspace' }).click();
  await expect(page.getByText('Choose the source and target CSV files')).toBeVisible();
  const records = await page.evaluate(async () => new Promise<{ draft: unknown; recipes: unknown[] }>((resolve, reject) => {
    const request = indexedDB.open('csv-import-cleanroom');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction(['drafts', 'recipes'], 'readonly');
      const draftRequest = transaction.objectStore('drafts').get('active');
      const recipesRequest = transaction.objectStore('recipes').getAll();
      transaction.oncomplete = () => { resolve({ draft: draftRequest.result ?? null, recipes: recipesRequest.result ?? [] }); database.close(); };
      transaction.onerror = () => reject(transaction.error);
    };
  }));
  expect(records).toEqual({ draft: null, recipes: [] });
});

test('@claim:no-tracking-resources loads every product route without cookies or third-party resources', async ({ page, context }) => {
  const origins = new Set<string>();
  page.on('request', request => origins.add(new URL(request.url()).origin));
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html', '/offline.html']) {
    await page.goto(path);
    const loaded = await page.evaluate(() => ({
      cookie: document.cookie,
      resources: performance.getEntriesByType('resource').map(entry => entry.name),
      remoteScripts: [...document.querySelectorAll('script[src]')].map(script => (script as HTMLScriptElement).src),
      remoteStyles: [...document.styleSheets].map(sheet => sheet.href).filter(Boolean),
      trackingElements: document.querySelectorAll('[data-analytics], iframe, img[src*="pixel" i], img[src*="analytics" i]').length
    }));
    expect(loaded.cookie, path).toBe('');
    expect(loaded.resources.every(resource => new URL(resource).origin === 'http://127.0.0.1:4173'), path).toBe(true);
    expect([...loaded.remoteScripts, ...loaded.remoteStyles].every(resource => new URL(resource).origin === 'http://127.0.0.1:4173'), path).toBe(true);
    expect(loaded.trackingElements, path).toBe(0);
  }
  expect(await context.cookies()).toEqual([]);
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
});

test('@claim:license-revocation locks refunded, revoked, expired, and wrong-product licenses', async ({ page }) => {
  let responseReason = 'refunded';
  await page.route(VERIFY_URL, route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: responseReason }) }));
  for (const reason of ['refunded', 'revoked', 'expired', 'wrong_product']) {
    responseReason = reason;
    await page.goto('/');
    await page.evaluate(({ licenseKey, verdictKey }) => {
      localStorage.setItem(licenseKey, 'previously-valid-license');
      localStorage.setItem(verdictKey, JSON.stringify({ valid: true, reason: 'ok', checkedAt: 0 }));
    }, { licenseKey: LICENSE_KEY, verdictKey: VERDICT_KEY });
    await page.reload();
    await expect(page.getByRole('button', { name: 'View Cleanroom Plus — $19 once' }).first(), reason).toBeVisible();
    await expect(page.getByText('Your saved license is no longer active.'), reason).toBeVisible();
  }
});

test('claim registry covers retained metadata and legal promises', async () => {
  const claims = JSON.parse(await readFile('.factory/claims.json', 'utf8')) as { id: string; test: string }[];
  const ids = claims.map(claim => claim.id);
  expect(new Set(ids).size).toBe(ids.length);
  const tests = `${await readFile('tests/e2e/app.spec.ts', 'utf8')}\n${await readFile('tests/csv.test.ts', 'utf8')}`;
  for (const claim of claims) {
    expect(claim.test).toContain(`@claim:${claim.id}`);
    expect(tests.match(new RegExp(`@claim:${claim.id}`, 'g'))).toHaveLength(1);
  }
  const [home, privacy, terms] = await Promise.all([
    readFile('index.html', 'utf8'),
    readFile('privacy/index.html', 'utf8'),
    readFile('terms/index.html', 'utf8')
  ]);
  expect(home).not.toContain('without changing the source CSV');
  expect(privacy).toContain('work can survive a refresh');
  expect(privacy).toContain('There are no advertising pixels');
  expect(terms).toContain('A refunded, revoked, expired, or wrong-product license');
  expect(terms).not.toContain('accessibility features remain free');
  expect(ids).toEqual(expect.arrayContaining(['local-data-lifecycle', 'no-tracking-resources', 'license-revocation', 'free-tier-entitlements']));
});

test.describe('license verification fail-closed policy', () => {
  test('checkout-return token is stripped and unlocks only after online verification', async ({ page }) => {
    await page.route(VERIFY_URL, route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) }));
    await page.goto('/?license=checkout-return-token');
    await expect(page).toHaveURL('http://127.0.0.1:4173/');
    await expect(page.getByRole('button', { name: 'Cleanroom Plus', exact: true })).toBeVisible();
    expect(await page.evaluate(licenseKey => localStorage.getItem(licenseKey), LICENSE_KEY)).toBe('checkout-return-token');
  });

  test('online valid token unlocks Plus and caches the verdict', async ({ page }) => {
    await page.route(VERIFY_URL, route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) }));
    await page.goto('/');
    await page.getByRole('button', { name: 'View Cleanroom Plus — $19 once' }).first().click();
    await page.locator('#license-token').fill('valid-token');
    await page.getByRole('button', { name: 'Verify license' }).click();
    await expect(page.getByRole('button', { name: 'Cleanroom Plus', exact: true })).toBeVisible();
    const stored = await page.evaluate(({ licenseKey, verdictKey }) => ({ token: localStorage.getItem(licenseKey), verdict: JSON.parse(localStorage.getItem(verdictKey) ?? 'null') }), { licenseKey: LICENSE_KEY, verdictKey: VERDICT_KEY });
    expect(stored.token).toBe('valid-token');
    expect(stored.verdict).toMatchObject({ valid: true, reason: 'ok' });
  });

  test('first-use token remains locked when verification is offline', async ({ page, context }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'View Cleanroom Plus — $19 once' }).first().click();
    await context.setOffline(true);
    await page.locator('#license-token').fill('definitely-not-a-real-license');
    await page.getByRole('button', { name: 'Verify license' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/License verification is unavailable/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'View Cleanroom Plus — $19 once' }).first()).toBeVisible();
    expect(await page.evaluate(verdictKey => localStorage.getItem(verdictKey), VERDICT_KEY)).toBeNull();
  });

  test('invalid token remains locked and caches the invalid verdict', async ({ page }) => {
    await page.route(VERIFY_URL, route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid' }) }));
    await page.goto('/');
    await page.getByRole('button', { name: 'View Cleanroom Plus — $19 once' }).first().click();
    await page.locator('#license-token').fill('invalid-token');
    await page.getByRole('button', { name: 'Verify license' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('That license is not active. Check the token or buy a new license.')).toBeVisible();
    expect(await page.evaluate(verdictKey => JSON.parse(localStorage.getItem(verdictKey) ?? 'null').valid, VERDICT_KEY)).toBe(false);
  });

  test('revoked cached license is reconciled back to locked', async ({ page }) => {
    await page.addInitScript(({ licenseKey, verdictKey }) => {
      localStorage.setItem(licenseKey, 'revoked-token');
      localStorage.setItem(verdictKey, JSON.stringify({ valid: true, reason: 'ok', checkedAt: 0 }));
    }, { licenseKey: LICENSE_KEY, verdictKey: VERDICT_KEY });
    await page.route(VERIFY_URL, route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'revoked' }) }));
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'View Cleanroom Plus — $19 once' }).first()).toBeVisible();
    await expect(page.getByText('Your saved license is no longer active.')).toBeVisible();
  });

  test('previously cached valid verdict remains unlocked offline', async ({ page, context }) => {
    await page.goto('/');
    await waitForOfflineReady(page);
    await page.evaluate(({ licenseKey, verdictKey }) => {
      localStorage.setItem(licenseKey, 'cached-valid-token');
      localStorage.setItem(verdictKey, JSON.stringify({ valid: true, reason: 'ok', checkedAt: Date.now() }));
    }, { licenseKey: LICENSE_KEY, verdictKey: VERDICT_KEY });
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: 'Cleanroom Plus', exact: true })).toBeVisible();
  });

  test('rate-limited first verification remains locked', async ({ page }) => {
    await page.route(VERIFY_URL, route => route.fulfill({ status: 429, headers: { 'Retry-After': '4' }, body: 'rate limited' }));
    await page.goto('/');
    await page.getByRole('button', { name: 'View Cleanroom Plus — $19 once' }).first().click();
    await page.locator('#license-token').fill('rate-limited-token');
    await page.getByRole('button', { name: 'Verify license' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/License verification is unavailable/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'View Cleanroom Plus — $19 once' }).first()).toBeVisible();
  });
});

test('sample workflow validates, explains, and exports without console errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => consoleErrors.push(error.message));
  await openDemo(page);
  await page.getByRole('button', { name: /Run inspection/ }).click();
  await expect(page.getByText('email is not a valid email address')).toBeVisible();
  await expect(page.getByText(/Formula-like values will be escaped/)).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test('has no serious or critical accessibility violations in every workflow state', async ({ page }) => {
  for (const path of ['/', '/demo/', '/privacy/', '/terms/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? '')), path).toEqual([]);
  }
  await openDemo(page);
  const mapping = await new AxeBuilder({ page }).analyze();
  expect(mapping.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? '')), 'mapping').toEqual([]);
  expect(mapping.violations.filter(item => item.id === 'heading-order'), 'demo mapping heading outline').toEqual([]);
  await page.getByRole('button', { name: /Inspect/ }).click();
  const emptyInspection = await new AxeBuilder({ page }).analyze();
  expect(emptyInspection.violations.filter(item => item.id === 'heading-order'), 'empty inspection heading outline').toEqual([]);
  await page.getByRole('button', { name: 'Return to mapping' }).click();
  await page.getByRole('button', { name: /Run inspection/ }).click();
  const inspection = await new AxeBuilder({ page }).analyze();
  expect(inspection.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? '')), 'inspection').toEqual([]);
  expect(inspection.violations.filter(item => item.id === 'heading-order'), 'inspection heading outline').toEqual([]);
  await page.getByRole('button', { name: 'View Cleanroom Plus — $19 once' }).first().click();
  const license = await new AxeBuilder({ page }).analyze();
  expect(license.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? '')), 'license dialog').toEqual([]);
});

test('keyboard operates the demo action and trapped license dialog with visible focus', async ({ page }) => {
  await page.goto('/');
  const sample = page.getByRole('button', { name: 'Try it with sample data' });
  await expect(page.locator('#page-title')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(sample).toBeFocused();
  await expect(sample).toHaveCSS('outline-width', '3px');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('http://127.0.0.1:4173/?demo=1');
  await expect(page.getByText('customer-source-sample.csv')).toBeVisible();
  await expect(page.locator('#workspace-title')).toBeFocused();
  const licenseButton = page.getByRole('button', { name: 'View Cleanroom Plus — $19 once' }).first();
  await licenseButton.focus();
  await page.keyboard.press('Enter');
  const close = page.getByRole('button', { name: 'Close license panel' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('link', { name: 'Terms' }).last()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(licenseButton).toBeFocused();
});

test('reduced motion removes travel and continuous animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo/');
  expect(await page.locator('.primary').first().evaluate(element => parseFloat(getComputedStyle(element).transitionDuration))).toBeLessThanOrEqual(0.00001);
  await page.evaluate(() => { const spinner = document.createElement('span'); spinner.className = 'spinner'; document.body.append(spinner); });
  expect(await page.locator('.spinner').evaluate(element => parseFloat(getComputedStyle(element).animationDuration))).toBeLessThanOrEqual(0.00001);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('file controls expose visible focus, checkbox targets are 44px, and malformed recipes give a next step', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Back to files' }).click();
  await page.locator('#source-file').focus();
  await expect(page.locator('label[for="source-file"]')).toHaveCSS('outline-width', '3px');
  await page.getByRole('button', { name: 'Map target fields' }).click();
  expect(await page.locator('.check').first().evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  await page.locator('#recipe-file').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{broken') });
  await expect(page.getByRole('alert')).toContainText('Export a recipe from Cleanroom');
});

test('serves product routes, metadata, a real 404, and a versioned PWA', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://csv-import-cleanroom.sociobot.in/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-card\.webp$/);
  const config = JSON.parse(await readFile('staticwebapp.config.json', 'utf8'));
  expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  const manifest = await page.request.get('/manifest.webmanifest');
  expect(manifest.headers()['content-type']).toContain('application/manifest+json');
  for (const path of ['/demo/', '/privacy/', '/terms/', '/404.html', '/offline.html']) {
    await page.goto(path);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(1);
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
  }
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { name: 'Page not found.' })).toBeVisible();
  const packageVersion = JSON.parse(await readFile('package.json', 'utf8')).version;
  const builtWorker = await readFile('dist/sw.js', 'utf8');
  expect(builtWorker).toContain(`cleanroom-v${packageVersion}`);
  expect(builtWorker).not.toContain('__BUILD_VERSION__');
  const manifestJson = await manifest.json();
  expect(manifestJson).toMatchObject({ start_url: '/', description: 'Prepare strict CSV imports locally with reusable mappings and validation.' });
});

test('route inventory keeps the sitemap aligned with every indexable shipped page', async ({ page }) => {
  const htmlFiles = (await readdir('dist', { recursive: true }))
    .filter(file => file.endsWith('.html'))
    .sort();
  expect(htmlFiles).toEqual([
    '404.html',
    'demo/index.html',
    'index.html',
    'offline.html',
    'privacy/index.html',
    'terms/index.html'
  ]);

  const shipped = await Promise.all(htmlFiles.map(async file => {
    const html = await readFile(`dist/${file}`, 'utf8');
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    expect(canonical, `${file} canonical`).toBeTruthy();
    return { canonical: canonical!, noindex: /<meta name="robots" content="[^"]*noindex/.test(html) };
  }));
  const indexable = shipped.filter(route => !route.noindex).map(route => route.canonical).sort();
  const excluded = shipped.filter(route => route.noindex).map(route => route.canonical).sort();

  const sitemapResponse = await page.request.get('/sitemap.xml');
  expect(sitemapResponse.ok()).toBe(true);
  const sitemapUrls = [...(await sitemapResponse.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]).sort();
  expect(sitemapUrls).toEqual(indexable);
  expect(excluded).toEqual(['https://csv-import-cleanroom.sociobot.in/404.html']);
  expect(sitemapUrls).toContain('https://csv-import-cleanroom.sociobot.in/offline.html');
});

test('ships a CSP-compatible offline fallback with route metadata and no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/offline.html');
  await expect(page).toHaveTitle('Offline — CSV Import Cleanroom');
  await expect(page.getByRole('heading', { name: 'This page is unavailable offline' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to CSV workspace' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://csv-import-cleanroom.sociobot.in/offline.html');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://csv-import-cleanroom.sociobot.in/offline.html');
  await expect(page.locator('style')).toHaveCount(0);
  expect(await page.locator('link[rel="stylesheet"]').getAttribute('href')).toBe('/offline.css');
  const config = await readFile('staticwebapp.config.json', 'utf8');
  expect(config).toContain("style-src 'self'");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  expect(errors).toEqual([]);
});

test('opens the mapped demo workspace in the first viewport and keeps stage focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page.getByText('customer-source-sample.csv')).toBeVisible();
  await expect(page.locator('.mapping-scroll')).toBeVisible();
  const mappingTop = await page.locator('.mapping-scroll').evaluate(element => element.getBoundingClientRect().top);
  expect(mappingTop).toBeLessThan(844);
  await page.getByRole('button', { name: /Run inspection/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#workspace-title')).toBeFocused();
  await expect(page.getByText('Inspection complete: 2 accepted, 1 rejected.')).toBeVisible();
});

test('keeps the demo identity and controls in the settled mobile workspace viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo/');
  await expect(page.locator('#workspace-title')).toBeFocused();
  const demoMessage = page.getByText('Demo — sample data, nothing is saved');
  const workspaceTitle = page.locator('#workspace-title');
  const workspaceReset = page.getByRole('button', { name: 'Reset workspace' });
  for (const control of [
    demoMessage,
    page.getByRole('button', { name: 'Reset demo' }),
    page.getByRole('button', { name: 'Start for real' })
  ]) {
    await expect(control).toBeInViewport();
  }
  await expect(workspaceReset).toBeInViewport();
  const mastheadBox = await page.locator('.masthead').boundingBox();
  const messageBox = await demoMessage.boundingBox();
  const bannerBox = await page.locator('.demo-banner').boundingBox();
  const titleBox = await workspaceTitle.boundingBox();
  const workspaceResetBox = await workspaceReset.boundingBox();
  expect(messageBox!.y).toBeGreaterThanOrEqual(mastheadBox!.y + mastheadBox!.height);
  expect(titleBox!.y).toBeGreaterThanOrEqual(bannerBox!.y + bannerBox!.height);
  expect(workspaceResetBox!.y).toBeGreaterThanOrEqual(bannerBox!.y + bannerBox!.height);
  expect(titleBox!.y + titleBox!.height).toBeLessThan(844);
});

test('moves focus to headings for route and in-page navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'How it works' }).click();
  await expect(page.locator('#how-title')).toBeFocused();
  await page.goBack();
  await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).not.toBe('BODY');
  await page.getByLabel('Primary navigation').getByRole('link', { name: 'Privacy' }).click();
  await expect(page.getByRole('heading', { name: 'How your CSV data is handled' })).toBeFocused();
});

test('routes the demo How it works link to Home and focuses every workspace destination', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByLabel('Primary navigation').getByRole('link', { name: 'How it works' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/#how');
  await expect(page.locator('#how-title')).toBeVisible();
  await expect(page.locator('#how-title')).toBeFocused();
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.getByRole('link', { name: 'Choose CSV files' }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4173/#workspace');
    await expect(page.locator('#workspace-title')).toBeFocused();
    await page.goBack();
    await expect(page.locator('#page-title')).toBeFocused();
    await page.goForward();
    await expect(page.locator('#workspace-title')).toBeFocused();
    await page.goto('/#workspace');
    await expect(page.locator('#workspace-title')).toBeFocused();
  }
});

test('opens an isolated sample directly with ?demo=1 and preserves its banner controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — CSV Import Cleanroom');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Start for real' })).toBeInViewport();
  await expect(page.getByText('customer-source-sample.csv')).toBeVisible();
  await page.locator('#source-0').selectOption('');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#source-0')).toHaveValue('Customer ID');
});

test('restores the Home document, title, focus, and announcement with browser Back', async ({ page }) => {
  for (const destination of ['Demo', 'Privacy'] as const) {
    await page.goto('/');
    await page.getByLabel('Primary navigation').getByRole('link', { name: destination }).click();
    await page.goBack();
    await expect(page).toHaveURL('http://127.0.0.1:4173/');
    await expect(page).toHaveTitle('CSV Import Cleanroom — Prepare CSV imports');
    await expect(page.locator('#page-title')).toHaveText('Prepare CSV imports.');
    await expect(page.locator('#page-title')).toBeFocused();
    await expect(page.locator('.route-announcer')).toHaveText('Home page loaded.');
  }
});

test('keeps the 390px workflow usable without page-level sideways scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openDemo(page);
  await expect(page.locator('.mapping-scroll')).toBeVisible();
  expect(await page.evaluate(() => { window.scrollTo(500, 0); return window.scrollX; })).toBe(0);
  await page.getByRole('button', { name: /Run inspection/ }).click();
  await expect(page.getByRole('button', { name: 'Export target CSV' })).toBeVisible();
});
