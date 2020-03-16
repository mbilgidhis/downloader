( () => {
    const cacheName = 'ig';
    const staticAssets = [
        './',
        './index.html',
        './app.js',
        './manifest.json',
        './images/favicon.ico',
        './images/apple-touch-icon.png',
        './images/android-chrome-192x192.png',
        './images/android-chrome-512x512.png',
        './images/favicon-16x16.png',
        './images/favicon-32x32.png',
        'https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css'
    ];

    self.addEventListener('install', async function() {
        const cache = await caches.open(cacheName);
        cache.addAll(staticAssets);
    });

    self.addEventListener('activate', event => {
        event.waitUntil(self.clients.claim());
    });

    self.addEventListener('fetch', function (event) {
        console.log(event.request.url);
        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response || fetch(event.request);
            })
        );
    });
})();