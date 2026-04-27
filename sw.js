const CACHE = 'topik1-v2';
const ASSETS = [
  '/topik-vocabulario/',
  '/topik-vocabulario/index.html',
  '/topik-vocabulario/manifest.json',
  '/topik-vocabulario/icon-192.png',
  '/topik-vocabulario/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;700&family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => caches.match('/topik-vocabulario/index.html'));
    })
  );
});
