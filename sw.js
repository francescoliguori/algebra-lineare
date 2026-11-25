// Service worker generato da genera_web.py: non modificare a mano.
const VERSIONE = "f58e981b351b";
const CACHE = "algebra-" + VERSIONE, CACHE_KATEX = "katex-0.16.11";
const BASE = ["./", "./index.html", "./manifest.webmanifest", "./font/plus-jakarta-sans-latin.woff2", "./icone/icona-192.png", "./icone/icona-512.png"].concat(["./teoria/introduzione-f0930c6258.json", "./teoria/insiemi-c193de3b84.json", "./teoria/sistemi-c0b0ec938f.json", "./teoria/spazi-f445c7458f.json", "./teoria/matrici-e71eee80aa.json", "./teoria/applicazioni-0b82fae73b.json", "./teoria/determinanti-84557dc29c.json", "./teoria/autovalori-1d9d8881b1.json"]);
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith("algebra-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === "https://cdn.jsdelivr.net") {   // KaTeX: non cambia mai, basta scaricarlo una volta
    e.respondWith(caches.open(CACHE_KATEX).then(async c => {
      const r = await c.match(req);
      if (r) return r;
      const n = await fetch(req);
      if (n.ok) c.put(req, n.clone());
      return n;
    }));
    return;
  }
  if (url.origin !== self.location.origin) return;
  // file dell'app: subito dalla cache, e intanto si aggiorna la copia dalla rete
  e.respondWith(caches.open(CACHE).then(async c => {
    const r = await c.match(req, { ignoreSearch: true });
    const rete = fetch(req).then(n => { if (n.ok) c.put(req, n.clone()); return n; }).catch(() => r);
    return r || rete;
  }));
});
