const cacheName = "faidlix-portfolio-1.4.0";
const contentToCache = [
    "index.html",
    "plugins.html",
    "ux.html",
    "services.html",
    "play.html",
    "assets/site.css",
    "assets/site.js",
    "assets/plugins.js",
    "assets/play.js",
    "assets/brand/faidlix-logo-horizontal.png",
    "assets/brand/faidlix-logo-stacked.png",
    "assets/brand/faidlix-symbol.png",
    "assets/brand/faidlix-symbol-transparent.png",
    "assets/brand/18fx-portrait.jpg",
    "data/plugins.json"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('activate', function (e) {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key)))));
});

self.addEventListener('fetch', function (e) {
    if (e.request.method !== 'GET') return;
    e.respondWith((async function () {
      try {
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        cache.put(e.request, response.clone());
        return response;
      } catch (_) {
        return caches.match(e.request);
      }
    })());
});
