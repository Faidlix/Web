const cacheName = "faidlix-portfolio-1.9.0";
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
    "assets/ux-history.js",
    "assets/home-pager.js",
    "assets/brand/faidlix-logo-horizontal.png",
    "assets/brand/faidlix-logo-stacked.png",
    "assets/brand/faidlix-symbol.png",
    "assets/brand/faidlix-symbol-transparent.png",
    "assets/brand/18fx-portrait.jpg",
    "assets/ux/navigation-before-desktop.png",
    "assets/ux/navigation-before-mobile.png",
    "assets/ux/navigation-after-desktop.svg",
    "assets/ux/navigation-after-mobile.svg",
    "assets/ux/plugin-history-placeholder-before.png",
    "assets/ux/homepage-wheel-before.png",
    "assets/ux/mobile-menu-before.png",
    "assets/ux/mobile-menu-reference.png",
    "data/plugins.json",
    "data/ux-history.json"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
      await self.skipWaiting();
    })());
});

self.addEventListener('activate', function (e) {
    e.waitUntil(Promise.all([caches.keys().then(keys => Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key)))), self.clients.claim()]));
});

self.addEventListener('fetch', function (e) {
    if (e.request.method !== 'GET') return;
    e.respondWith((async function () {
      try {
        const response = await fetch(e.request, e.request.mode === 'navigate' ? { cache: 'no-store' } : undefined);
        const cache = await caches.open(cacheName);
        cache.put(e.request, response.clone());
        return response;
      } catch (_) {
        return caches.match(e.request, { ignoreSearch: e.request.mode === 'navigate' });
      }
    })());
});
