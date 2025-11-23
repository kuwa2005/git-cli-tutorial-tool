/**
 * Service Worker for Git & GitHub CLI Wizard
 * PWA対応 - オフライン動作を可能にする
 */

const CACHE_NAME = 'git-wizard-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/command-database.js',
    '/js/command-analyzer.js',
    '/js/wizard-data.js',
    '/js/app.js',
    '/manifest.json'
];

/**
 * Service Worker インストール時
 */
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

/**
 * Service Worker アクティベーション時
 */
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Activation complete');
            return self.clients.claim();
        })
    );
});

/**
 * フェッチイベント - ネットワークリクエストの処理
 * Cache First 戦略: キャッシュを優先、なければネットワークから取得
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // キャッシュにあればそれを返す
                if (response) {
                    console.log('[Service Worker] Serving from cache:', event.request.url);
                    return response;
                }

                // キャッシュになければネットワークから取得
                console.log('[Service Worker] Fetching from network:', event.request.url);
                return fetch(event.request).then((response) => {
                    // レスポンスが有効かチェック
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // レスポンスをクローンしてキャッシュに保存
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                });
            })
            .catch((error) => {
                console.error('[Service Worker] Fetch failed:', error);

                // オフライン時のフォールバック
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});

/**
 * メッセージイベント - アプリからのメッセージを処理
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(() => {
            console.log('[Service Worker] Cache cleared');
        });
    }
});
