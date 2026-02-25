
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    // Take control of all open clients immediately
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Only intercept http/https requests (skip chrome-extension://, etc.)
    if (event.request.url.startsWith('http')) {
        event.respondWith(fetch(event.request));
    }
});
