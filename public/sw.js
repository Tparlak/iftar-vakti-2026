const CACHE_NAME = "iftar-vakti-v1";

self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
    // Basit bir ağ öncelikli strateji (Network First)
    // Çevrimdışı desteği için en azından ana sayfayı önbelleğe almayı deneyebiliriz
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Başarılı olursa önbelleğe al
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    if (event.request.url.startsWith("http")) { // Sadece http/https
                        cache.put(event.request, responseClone);
                    }
                });
                return response;
            })
            .catch(() => {
                // Ağ başarısızsa önbellekten dön
                return caches.match(event.request);
            })
    );
});
