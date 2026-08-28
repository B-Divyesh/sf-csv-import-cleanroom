import { expect, test } from '@playwright/test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('activates a waiting service-worker update from the in-app notice', async ({ page }) => {
  test.setTimeout(60_000);
  const workerPath = 'dist/sw.js';
  const original = await readFile(workerPath, 'utf8');
  const fixture = await mkdtemp(join(tmpdir(), 'cleanroom-worker-'));
  await writeFile(join(fixture, 'sw.original.js'), original);
  await page.goto('/');
  await page.waitForFunction(async () => {
    const registration = await navigator.serviceWorker.ready;
    return registration.active?.state === 'activated' && navigator.serviceWorker.controller?.state === 'activated';
  });
  // Reload once under the installed controller. The application now knows this
  // is an update (not a first install), so controllerchange owns the one reload.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(async () => {
    const registration = await navigator.serviceWorker.ready;
    return registration.active?.state === 'activated' && navigator.serviceWorker.controller?.state === 'activated';
  });

  try {
    const updateVersion = `cleanroom-update-${Date.now()}`;
    await writeFile(workerPath, original.replace(/cleanroom-v[\d.]+/, updateVersion));
    await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration())?.update(); });
    await page.waitForFunction(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      return registration?.waiting?.state === 'installed';
    });
    const notice = page.getByRole('status').filter({ hasText: 'An app update is ready.' });
    await expect(notice).toBeVisible({ timeout: 10_000 });

    let resolveControllerChange: (() => void) | undefined;
    const controllerChange = new Promise<void>(resolve => { resolveControllerChange = resolve; });
    await page.exposeFunction('recordControllerChange', () => resolveControllerChange?.());
    await page.evaluate(() => navigator.serviceWorker.addEventListener('controllerchange', () => {
      (window as typeof window & { recordControllerChange: () => void }).recordControllerChange();
    }, { once: true }));
    const navigation = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await notice.getByRole('button', { name: 'Update now' }).click();
    await Promise.all([navigation, controllerChange]);
    await page.waitForFunction(async version => {
      const registration = await navigator.serviceWorker.getRegistration();
      return navigator.serviceWorker.controller?.scriptURL.includes(version) && registration?.active?.scriptURL.includes(version) && (await caches.keys()).some(key => key.includes(version));
    }, updateVersion);
    // The controller-change handler deliberately reloads the shell. Waiting for
    // its replacement controller and then asserting this rendered document
    // verifies that cold post-update shell without issuing a competing reload.
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Prepare CSV imports.');
  } finally {
    await writeFile(workerPath, await readFile(join(fixture, 'sw.original.js'), 'utf8'));
    await rm(fixture, { recursive: true, force: true });
  }
});
