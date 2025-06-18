// Name of cache storing static resources of the site
const version = "v1.2";
const staticCacheName = `site-static-${version}`;

// Assets/resources to be cached
const assets = [
    "/",
    "/index.html",
    "/favicons/large.png",
    "/js/app-register.js",
    "/js/info-box.js",
    "/js/buttons.js",
    "/js/index.js", 
    "/style.css",
    "https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Noto+Sans+TC:wght@100..900&display=swap",
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0&icon_names=add_box,info,ios_share",
    "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js",
    "/bingo-manifest.json",
];

// Whenever a service worker is installed
self.addEventListener('install', evt => {
    console.log("Service worker has been installed");
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log("Caching assets");
            cache.addAll(assets);
        })
    );
    
});

// Whenever a service worker is activated
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// Whenever a fetch request is initiated
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheResponse => {
            return cacheResponse || fetch(evt.request);
        })
    )
});