// Skyle Service Worker
const CACHE_NAME = 'skyle-v1';
const RUNTIME_CACHE = 'skyle-runtime-v1';

// キャッシュするファイル（プリキャッシュ）
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  // 必要に応じて追加
  // '/assets/main.js',
  // '/assets/main.css',
];

// インストール時：必要なファイルをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] プリキャッシュ開始');
      return cache.addAll(PRECACHE_URLS);
    })
  );
  // 新しいService Workerをすぐにアクティブ化
  self.skipWaiting();
});

// アクティベート時：古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => {
            console.log('[SW] 古いキャッシュを削除:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // すぐに制御を開始
  return self.clients.claim();
});

// フェッチ時：キャッシュ優先戦略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // APIリクエストは常にネットワークから取得（新鮮なデータが必要）
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 成功したレスポンスをランタイムキャッシュに保存
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // ネットワークエラー時はキャッシュから返す（オフライン対応）
          return caches.match(request);
        })
    );
    return;
  }

  // 静的ファイルはキャッシュファースト戦略
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('[SW] キャッシュから返却:', request.url);
        return cachedResponse;
      }

      // キャッシュになければネットワークから取得
      return fetch(request)
        .then((response) => {
          // 有効なレスポンスのみキャッシュ
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch((error) => {
          console.error('[SW] フェッチエラー:', error);
          // フォールバック用のオフラインページを返すこともできる
          // return caches.match('/offline.html');
        });
    })
  );
});

// プッシュ通知用（将来の実装）
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'マジックアワーの時間です',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'magic-hour-notification',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification('Skyle', options)
  );
});

// 通知クリック時の動作
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
