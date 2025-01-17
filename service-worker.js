const CACHE_NAME = 'newparty-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/สมัครสมาชิก.html',
    '/บริจาค.html',
    '/css/style.css',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&display=swap'
];

// Add API endpoints to cache
const API_ENDPOINTS = [
    'YOUR_COMPLAINTS_API_ENDPOINT',
    'YOUR_FEEDBACK_API_ENDPOINT',
    'YOUR_AI_API_ENDPOINT'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );
});

// Cache API responses
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (API_ENDPOINTS.includes(url.origin + url.pathname)) {
        event.respondWith(
            caches.open('api-cache').then(cache =>
                fetch(event.request).then(response => {
                    cache.put(event.request, response.clone());
                    return response;
                }).catch(() => cache.match(event.request))
            )
        );
        return;
    }
    // ...existing fetch handler code...
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request)
                .then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
        })
    );
});