import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('sample workflow validates, explains, and exports', async ({ page }) => {
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
});

test('has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('opens the cached workspace offline', async ({ page, context }) => {
  await page.goto('/');
  await page.waitForFunction(async () => {
    if (!navigator.serviceWorker?.controller) return false;
    const names = await caches.keys();
    if (!names[0]) return false;
    const ready = await navigator.serviceWorker.ready;
    return ready.active?.state === 'activated' && (await (await caches.open(names[0])).keys()).length >= 10;
  });
  await page.waitForTimeout(750);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText(/Offline · local processing ready/)).toBeVisible();
  await page.getByRole('button', { name: 'Try the calibration sample' }).click();
  await expect(page.getByRole('button', { name: /Run inspection/ })).toBeVisible();
});
