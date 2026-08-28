import { expect, test } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

test('activates a waiting service-worker update from the in-app notice', async ({ page }) => {
  const workerPath = 'dist/sw.js';
  const original = await readFile(workerPath, 'utf8');
  await page.goto('/');
  await page.waitForFunction(async () => {
    const registration = await navigator.serviceWorker.ready;
    return registration.active?.state === 'activated' && navigator.serviceWorker.controller?.state === 'activated';
  });

  try {
    await writeFile(workerPath, original.replace("cleanroom-v1.0.5", "cleanroom-v1.0.6"));
    await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration())?.update(); });
    const notice = page.getByRole('status').filter({ hasText: 'An app update is ready.' });
    await expect(notice).toBeVisible();
    const navigation = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await notice.getByRole('button', { name: 'Update now' }).click();
    await navigation;
    await page.waitForFunction(async () => (await caches.keys()).includes('cleanroom-v1.0.6-shell'));
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Prepare CSV imports.');
  } finally {
    await writeFile(workerPath, original);
  }
});
