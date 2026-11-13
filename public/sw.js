// EduCore PWA Service Worker — Network-first strategy to prevent stale chunk errors on new deployments
const CACHE_NAME = 'educore-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Always bypass external APIs, extensions, and non-GET requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;
  if (event.request.url.includes('supabase.co')) return;

  // Network-first: always fetch fresh bundle/HTML first, fallback to cache only when completely offline
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') return caches.match('/');
        });
      })
  );
});
