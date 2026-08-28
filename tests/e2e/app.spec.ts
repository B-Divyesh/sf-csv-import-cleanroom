import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

async function openDemo(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/demo/');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('customer-source-sample.csv')).toBeVisible();
}

test('@claim:demo-isolation keeps sample work separate and preserves a real draft', async ({ page }) => {
  await page.goto('/');
  await page.locator('#source-file').setInputFiles({ name: 'real-ops.csv', mimeType: 'text/csv', buffer: Buffer.from('ID\nreal-1\n') });
  await page.locator('#target-file').setInputFiles({ name: 'real-template.csv', mimeType: 'text/csv', buffer: Buffer.from('external_id\n') });
  await expect(page.getByText('real-ops.csv', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo\//);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('customer-source-sample.csv')).toBeVisible();
  await page.reload();
  await expect(page.getByText('customer-source-sample.csv')).toBeVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('real-ops.csv', { exact: true })).toBeVisible();
});

test('@claim:csv-export exports only accepted sample rows', async ({ page }) => {
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
  await page.waitForFunction(async () => Boolean(navigator.serviceWorker?.controller) && (await caches.keys()).length > 0);
  await context.setOffline(true);
  const cachedDocument = await page.evaluate(async () => {
    const names = await caches.keys();
    const cachesWithEntries = await Promise.all(names.map(async name => {
      const cache = await caches.open(name);
      return { name, entries: (await cache.keys()).map(entry => entry.url) };
    }));
    const shell = cachesWithEntries.find(cache => cache.name.endsWith('-shell') && cache.entries.length > 0);
    const cache = await caches.open(shell?.name ?? 'missing');
    const response = await cache.match(location.href);
    return { body: response ? await response.text() : '', entries: shell?.entries ?? [] };
  });
  expect(cachedDocument.entries).toContain('http://127.0.0.1:4173/demo/');
  expect(cachedDocument.body).toContain('<div id="app"></div>');
  await expect(page.getByText(/Offline · local processing ready/)).toBeVisible();
  await expect(page.getByText('customer-source-sample.csv')).toBeVisible();
  await page.getByRole('button', { name: /Run inspection/ }).click();
  await expect(page.getByText('1 rejected')).toBeVisible();
});

test('@claim:on-device-processing makes no third-party request during the demo flow', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await openDemo(page);
  await page.getByRole('button', { name: /Run inspection/ }).click();
  expect(requests.every(url => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:plus-price shows the $19 one-time local-recipe license', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Unlock Plus' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('.price')).toHaveText('$19 once');
  await expect(dialog.getByText('unlimited on-device saved recipes')).toBeVisible();
});

test('sample workflow validates, explains, and exports without console errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => consoleErrors.push(error.message));
  await openDemo(page);
  await page.getByRole('button', { name: /Run inspection/ }).click();
  await expect(page.getByText('email is not a valid email address')).toBeVisible();
  await expect(page.getByText(/Formula shield active/)).toBeVisible();
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
  await page.getByRole('button', { name: /Run inspection/ }).click();
  const inspection = await new AxeBuilder({ page }).analyze();
  expect(inspection.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? '')), 'inspection').toEqual([]);
});

test('file controls expose visible focus, checkbox targets are 44px, and malformed recipes give a next step', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button', { name: 'Back to files' }).click();
  await page.locator('#source-file').focus();
  await expect(page.locator('label[for="source-file"]')).toHaveCSS('outline-width', '3px');
  await page.getByRole('button', { name: 'Wire target fields' }).click();
  expect(await page.locator('.check').first().evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  await page.locator('#recipe-file').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{broken') });
  await expect(page.getByRole('alert')).toContainText('Export a recipe from Cleanroom');
});

test('serves product routes, metadata, sitemap, and a real 404', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://csv-import-cleanroom.sociobot.in/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-card\.webp$/);
  const sitemap = await page.request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('/demo/');
  const config = JSON.parse(await readFile('staticwebapp.config.json', 'utf8'));
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { name: 'This bench does not exist.' })).toBeVisible();
});

test('keeps the 390px workflow usable without page-level sideways scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openDemo(page);
  await expect(page.locator('.mapping-scroll')).toBeVisible();
  expect(await page.evaluate(() => { window.scrollTo(500, 0); return window.scrollX; })).toBe(0);
  await page.getByRole('button', { name: /Run inspection/ }).click();
  await expect(page.getByRole('button', { name: 'Export target CSV' })).toBeVisible();
});
