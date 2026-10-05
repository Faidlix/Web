const cacheName = "faidlix-portfolio-2.1.1";
const contentToCache = [
    "index.html",
    "tools.html",
    "plugins.html",
    "ux.html",
    "services.html",
    "play.html",
    "assets/site.css?v=12",
    "assets/site.js?v=12",
    "assets/plugins.js?v=12",
    "assets/play.js?v=12",
    "assets/ux-history.js?v=12",
    "assets/home-pager.js?v=12",
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
    "assets/ux/section-dots-before.png",
    "assets/ux/top-navigation-horizontal-desktop.png",
    "assets/ux/top-navigation-horizontal-mobile.png",
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
