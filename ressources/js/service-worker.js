/* ============================================================
   JOS DORE CORPORATE — SERVICE WORKER (PWA)
   ============================================================ */

// ⚠️ IMPORTANT : Change ce numéro de version à chaque fois que tu
// déploies une mise à jour majeure sur Vercel (ex: 'josdore-v2').
// Cela forcera les navigateurs à télécharger la nouvelle version.
const CACHE_NAME = 'josdore-v2'; // Version incrémentée

// Liste des fichiers essentiels à mettre en cache dès l'installation
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html', 
  '/ressources/css/variables.css',
  '/ressources/css/style.css',
  '/ressources/css/header.css',
  '/ressources/css/footer.css',
  '/ressources/css/responsive.css',
  '/ressources/js/config.js',
  '/ressources/js/auth.js',
  '/ressources/js/roles.js',
  '/ressources/js/header.js',
  '/ressources/js/widgets.js',
  '/ressources/js/scripts.js',
  '/ressources/images/logo/favicon.ico'
];

/* ------------------------------------------------------------
   1. INSTALLATION
   ------------------------------------------------------------ */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Mise en cache des fichiers statiques');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) 
  );
});

/* ------------------------------------------------------------
   2. ACTIVATION
   ------------------------------------------------------------ */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Suppression de l\'ancien cache :', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

/* ------------------------------------------------------------
   3. FETCH (CORRIGÉ POUR ÉVITER L'ERREUR "Failed to convert value")
   ------------------------------------------------------------ */
self.addEventListener('fetch', (event) => {
  // 1. On ignore totalement les requêtes non-GET (comme les POST de Supabase)
  if (event.request.method !== 'GET') return;

  // 2. On ignore totalement les requêtes vers Supabase (API, Auth, etc.)
  if (event.request.url.includes('supabase.co')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la réponse est bonne, on la clone et on la met en cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(async () => {
        // Le réseau a échoué (hors ligne). On cherche dans le cache.
        const cachedResponse = await caches.match(event.request);
        
        // ✅ LA CORRECTION EST ICI
        // Si on trouve le fichier dans le cache, on le renvoie
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Si on ne trouve RIEN, on DOIT renvoyer une vraie Response pour ne pas planter.
        // On renvoie une erreur 404 propre.
        return new Response('Fichier non trouvé et hors ligne.', {
          status: 404,
          statusText: 'Not Found',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
        });
      })
  );
});

/* ------------------------------------------------------------
   4. MESSAGES
   ------------------------------------------------------------ */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});