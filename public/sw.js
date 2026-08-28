const VERSION = 'cleanroom-v1.0.3';
const SHELL = `${VERSION}-shell`;
const ASSETS = `${VERSION}-assets`;
const BUILD_ASSETS = [];
const PRECACHE = [...new Set(['/', '/index.html', '/manifest.webmanifest', '/offline.html', '/privacy/', '/terms/', '/assets/icon.svg', '/assets/icon-192.png', '/assets/icon-512.png', '/assets/calibration-bench-mobile.webp', '/assets/calibration-bench.webp', ...BUILD_ASSETS])];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(async cache => {
    for (const path of PRECACHE) {
      const response = await fetch(new Request(path, { cache: 'reload' }));
      if (!response.ok) throw new Error(`Could not precache ${path}`);
      await cache.put(path, response);
    }
  }));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => !key.startsWith(VERSION)).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(SHELL).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(async () => (await caches.match(event.request)) || (await caches.match('/')) || caches.match('/offline.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) caches.open(ASSETS).then(cache => cache.put(event.request, response.clone()));
    return response;
  })));
});
