const CACHE_ID = "travel-app-cache-v1";
const resourcesToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/main.js",
  // Add other assets like images, fonts, etc.
];

// Install event - caching the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_ID).then((cache) => {
      console.log("Cache opened successfully");
      return cache.addAll(resourcesToCache);
    })
  );
});

// Fetch event - serving cached content when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Activate event - removing old caches
self.addEventListener("activate", (event) => {
  const cacheAllowlist = [CACHE_ID];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheAllowlist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
