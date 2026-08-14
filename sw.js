const CACHE_NAME = 'escola-intercessao-v1';
const APP_SHELL = [
  '/Escola-Intercessao/',
  '/Escola-Intercessao/index.html',
  '/Escola-Intercessao/manifest.json',
  '/Escola-Intercessao/icon-192.png',
  '/Escola-Intercessao/icon-512.png'
];

// Ao instalar, guarda uma cópia das páginas/ícones do próprio site (não do chat/quiz)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Ao ativar, apaga versões antigas de cache (evita acumular lixo)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Só usa o cache para arquivos do próprio site.
// Pedidos para Supabase, Vercel e Gemini sempre vão direto pra internet (nunca cacheados),
// pra garantir que o chat e o login sempre usem dados atuais.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
