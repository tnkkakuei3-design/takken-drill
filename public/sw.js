const CACHE_NAME = 'takken-drill-v1';
const STATIC_ASSETS = [
  '/takken-drill/',
  '/takken-drill/index.html',
  '/takken-drill/manifest.json',
  '/takken-drill/icon-192.png',
  '/takken-drill/icon-512.png',
  '/takken-drill/apple-touch-icon.png',
];

// インストール時: 静的アセットをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// アクティベート時: 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// フェッチ時: キャッシュファースト戦略（ネットワーク優先でフォールバック）
self.addEventListener('fetch', (event) => {
  // POST リクエストはキャッシュしない
  if (event.request.method !== 'GET') return;

  // chrome-extension などのスキームはスキップ
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // バックグラウンドで更新（stale-while-revalidate）
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {});
        return cachedResponse;
      }

      // キャッシュになければネットワークから取得してキャッシュに保存
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      }).catch(() => {
        // オフライン時はindex.htmlを返す（SPAのフォールバック）
        return caches.match('/takken-drill/index.html');
      });
    })
  );
});
