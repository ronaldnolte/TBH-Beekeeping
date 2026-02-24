
self.addEventListener('install', (event) => {
    // Use latest version
    console.log('Service Worker: Installed');
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // Standard passthrough required for PWA "functional fetch handler" check
    event.respondWith(fetch(event.request));
});
