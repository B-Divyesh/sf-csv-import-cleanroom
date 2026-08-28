import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('sample workflow validates, explains, and exports', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => consoleErrors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await page.getByRole('button', { name: 'Try the calibration sample' }).click();
  await expect(page.getByRole('heading', { name: /Bench 01/ })).toBeVisible();
  await page.getByRole('button', { name: /Run inspection/ }).click();
  await expect(page.getByText('email is not a valid email address')).toBeVisible();
  await expect(page.getByText(/Formula shield active/)).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export target CSV' }).click();
  expect((await downloadPromise).suggestedFilename()).toContain('accepted.csv');
  expect(consoleErrors).toEqual([]);
});

test('has no serious accessibility violations', async ({ page }) => {
  for (const path of ['/', '/privacy/', '/terms/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? '')), path).toEqual([]);
  }
  await page.goto('/');
  await page.getByRole('button', { name: 'Try the calibration sample' }).click();
  await page.getByRole('button', { name: /Run inspection/ }).click();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? '')), 'inspection').toEqual([]);
});

test('keeps the cached workspace operational offline', async ({ page, context }) => {
  await page.goto('/');
  await page.waitForFunction(async () => {
    if (!navigator.serviceWorker?.controller) return false;
    const names = await caches.keys();
    if (!names[0]) return false;
    const ready = await navigator.serviceWorker.ready;
    return ready.active?.state === 'activated' && (await (await caches.open(names[0])).keys()).length >= 10;
  });
  const cachedBytes = await page.evaluate(async () => {
    const names = await caches.keys();
    const cache = await caches.open(names[0]!);
    const scripts = (await cache.keys()).filter(request => request.url.endsWith('.js'));
    return Promise.all(scripts.map(async request => (await (await cache.match(request))!.arrayBuffer()).byteLength));
  });
  expect(cachedBytes.every(size => size > 0)).toBe(true);
  await context.setOffline(true);
  await expect(page.getByText(/Offline · local processing ready/)).toBeVisible();
  await page.getByRole('button', { name: 'Try the calibration sample' }).click();
  await expect(page.getByRole('button', { name: /Run inspection/ })).toBeVisible();
});

test('keeps the 390px workflow usable without page-level sideways scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Try the calibration sample' }).click();
  await expect(page.locator('.mapping-scroll')).toBeVisible();
  expect(await page.evaluate(() => { window.scrollTo(500, 0); return window.scrollX; })).toBe(0);
  await page.getByRole('button', { name: /Run inspection/ }).click();
  await expect(page.getByRole('button', { name: 'Export target CSV' })).toBeVisible();
});
