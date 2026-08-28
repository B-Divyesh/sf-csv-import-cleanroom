const VERSION = 'cleanroom-v__BUILD_VERSION__';
const SHELL = `${VERSION}-shell`;
const ASSETS = `${VERSION}-assets`;
const BUILD_ASSETS = [];
const PRECACHE = [...new Set(['/', '/index.html', '/demo/', '/privacy/', '/terms/', '/404.html', '/manifest.webmanifest', '/offline.html', '/offline.css', '/sitemap.xml', '/robots.txt', '/assets/icon.svg', '/assets/icon-192.png', '/assets/icon-512.png', '/assets/calibration-bench-mobile.webp', '/assets/calibration-bench.webp', '/assets/social-card.webp', ...BUILD_ASSETS])];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(async cache => {
    for (const path of PRECACHE) {
      const url = new URL(path, self.location.origin).toString();
      const response = await fetch(new Request(url, { cache: 'reload' }));
      if (!response.ok) throw new Error(`Could not precache ${path}`);
      await cache.put(url, response);
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
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        const copy = response.clone();
        void caches.open(SHELL).then(cache => cache.put(event.request, copy));
        return response;
      } catch {
        const shell = await caches.open(SHELL);
        return (await shell.match(event.request, { ignoreVary: true })) || (await shell.match(new URL(url.pathname, self.location.origin).href, { ignoreVary: true })) || (await shell.match(new URL('/', self.location.origin).href, { ignoreVary: true })) || (await shell.match(new URL('/offline.html', self.location.origin).href, { ignoreVary: true })) || new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })());
    return;
  }
  event.respondWith(caches.match(event.request, { ignoreVary: true }).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) caches.open(ASSETS).then(cache => cache.put(event.request, response.clone()));
    return response;
  })));
});
