import { readFile, writeFile } from 'node:fs/promises';

const pages = ['dist/index.html', 'dist/privacy/index.html', 'dist/terms/index.html'];
const assets = new Set();
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) assets.add(match[1]);
}
const serviceWorkerPath = 'dist/sw.js';
const serviceWorker = await readFile(serviceWorkerPath, 'utf8');
const manifest = `const BUILD_ASSETS = ${JSON.stringify([...assets].sort())};`;
if (!serviceWorker.includes('const BUILD_ASSETS = [];')) throw new Error('Service worker asset marker not found');
await writeFile(serviceWorkerPath, serviceWorker.replace('const BUILD_ASSETS = [];', manifest));
console.log(`Injected ${assets.size} built assets into the offline precache.`);
