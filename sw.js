// Service Worker - MiCoche PWA (ParkLab)
// Estrategia: Cache-First para estáticos y teselas de mapa visitadas (Soporte Offline Parking Subterráneo)

const CACHE_NAME = 'micoche-v2.2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const promises = STATIC_ASSETS.map((asset) =>
        fetch(asset, { mode: asset.startsWith('http') ? 'cors' : 'same-origin' })
          .then((response) => {
            if (response.ok) {
              return cache.put(asset, response);
            }
          })
          .catch((err) => console.warn('[SW] No se pudo precachear:', asset, err))
      );
      await Promise.all(promises);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purgando caché obsoleta:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar peticiones que no sean GET
  if (event.request.method !== 'GET') return;

  // Teselas de mapa (Esri ArcGIS / OpenStreetMap mirrors) o CDNs de librerías: Cache-First
  const isMapTile = url.hostname.includes('arcgisonline.com') || url.hostname.includes('openstreetmap') || url.hostname.includes('cartocdn.com');
  const isCdn = url.hostname.includes('unpkg.com') || url.hostname.includes('cdn.tailwindcss.com');
  const isLocalAsset = url.origin === self.location.origin;

  if (isMapTile || isCdn || isLocalAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidación en segundo plano para estáticos locales
          if (isLocalAsset && !url.pathname.includes('/icons/')) {
            fetch(event.request)
              .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                  caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
                }
              })
              .catch(() => {});
          }
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            // Solo cachear respuestas exitosas 200 (NUNCA cachear errores 403 o 404)
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
            }
            return networkResponse;
          })
          .catch(() => {
            // Si no hay red y solicita HTML, devolver index.html cacheado
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('./index.html');
            }
          });
      })
    );
    return;
  }

  // Peticiones a Nominatim u otras APIs externas: Network-first
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
