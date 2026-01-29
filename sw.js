const CACHE_NAME = 'ciao-cache-v11';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './ciao_engine.js',
    './ciao_physics.js',
    './ciao_nutrition.js',
    './ciao_storage.js',
    './AppImages/android/android-launchericon-192-192.png',
    './AppImages/android/android-launchericon-512-512.png',
    'https://unpkg.com/react@18/umd/react.development.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
    'https://unpkg.com/@babel/standalone/babel.min.js'
];

// Install Event: Cache Core Assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Fetch Event: Cache First Strategy
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});

// Activate Event: Cleanup Old Caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
