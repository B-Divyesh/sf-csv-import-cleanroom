import { expect, test } from '@playwright/test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('activates a waiting service-worker update from the in-app notice', async ({ page }) => {
  const workerPath = 'dist/sw.js';
  const original = await readFile(workerPath, 'utf8');
  const fixture = await mkdtemp(join(tmpdir(), 'cleanroom-worker-'));
  await writeFile(join(fixture, 'sw.original.js'), original);
  await page.goto('/');
  await page.waitForFunction(async () => {
    const registration = await navigator.serviceWorker.ready;
    return registration.active?.state === 'activated' && navigator.serviceWorker.controller?.state === 'activated';
  });

  try {
    await writeFile(workerPath, original.replace(/cleanroom-v[\d.]+/, `cleanroom-update-${Date.now()}`));
    await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration())?.update(); });
    await page.waitForFunction(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      return registration?.waiting?.state === 'installed';
    });
    const notice = page.getByRole('status').filter({ hasText: 'An app update is ready.' });
    await expect(notice).toBeVisible();
    const controllerChange = page.waitForEvent('framenavigated');
    const navigation = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await notice.getByRole('button', { name: 'Update now' }).click();
    await Promise.all([navigation, controllerChange]);
    await page.waitForFunction(async () => (await caches.keys()).some(key => key.includes('cleanroom-update-')));
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Prepare CSV imports.');
  } finally {
    await writeFile(workerPath, await readFile(join(fixture, 'sw.original.js'), 'utf8'));
    await rm(fixture, { recursive: true, force: true });
  }
});
