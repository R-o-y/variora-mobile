const VERSION = "0.0.1";
const CACHE_NAME = `VA-${VERSION}`;
const cacheAssets = [
  `/`,
  `/src/*`,
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker installed and cached data');
        return cache.addAll(cacheAssets).then(() => self.skipWaiting())
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker active and control this domain')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service worker clearing old cache ' + cache);
            return caches.delete(cache);
          }
        })
      )
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('user') || event.request.method != 'GET')
    return

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone()
        caches
          .open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request.url, responseClone)
          })
        return response
      })
      .catch(() => {
        return caches
          .open(CACHE_NAME).then(cache => cache.match(event.request.url))
          .then(response => {
            if (response) {
              console.log('Service worker offline: hit')
              console.log(event.request.url)
              return response
            }
          })
      })
  )
})
