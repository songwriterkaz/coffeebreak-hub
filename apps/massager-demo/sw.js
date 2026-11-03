const C="cbm-v1",F=["./","index.html","demo.html","style.css","app.js","logo.png","manifest.json"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
