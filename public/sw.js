/**
 * Ka-CSE Reviewer - Progressive Web App Service Worker
 * Provides full offline study capabilities: caches pages, question JSON data, and UI assets.
 */

const CACHE_NAME = 'kacse-offline-v1';

// Static Shell and Core Question Datasets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/pages/practice.html',
  '/pages/exam.html',
  '/pages/vocabulary.html',
  '/pages/vocab-quiz.html',
  '/pages/about.html',
  '/pages/dashboard.html',
  '/404.html',
  '/site.webmanifest',
  '/img/logo.png',
  '/img/cse-reviewer-logo.png',
  '/img/og-image.png',
  // Offline Question Datasets
  '/data/numerical.json',
  '/data/verbal.json',
  '/data/analytical.json',
  '/data/clerical.json',
  '/data/gen-info.json',
  '/data/vocabulary.json',
  '/data/vocab-quiz.json',
];

// Install: Cache core application assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Use allSettled so one missing file won't abort the entire caching process
      const results = await Promise.allSettled(
        PRECACHE_URLS.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (err) {
            console.warn(`[SW] Precache failed for ${url}:`, err);
          }
        })
      );
      return results;
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old cache versions and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log(`[SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate strategy for static and external CDN assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip chrome-extension requests or other non-http(s) schemes
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Background network fetch to update cache (Stale-While-Revalidate)
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback if offline and asset not in cache
          if (request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/404.html');
          }
          return null;
        });

      // Return cached version immediately if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
