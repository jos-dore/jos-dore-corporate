/* ============================================================
   JOS DORE CORPORATE — SERVICE WORKER (PWA)
   ------------------------------------------------------------
   Gère :
   - Le cache des ressources (CSS, JS, images, pages)
   - Le mode hors ligne
   - Les mises à jour automatiques
   ============================================================ */

'use strict';

/* ============================================================
   1. CONFIGURATION
   ============================================================ */

// ⚠️ IMPORTANT : Change ce numéro à chaque fois que tu modifies un fichier CSS/JS/HTML
const VERSION = 'v2.0.0';
const CACHE_NOM = 'jos-dore-' + VERSION;
const CACHE_ASSETS = 'jos-dore-assets-' + VERSION;
const CACHE_PAGES = 'jos-dore-pages-' + VERSION;

/* Fichiers essentiels à mettre en cache dès l'installation */
const ASSETS_A_PRECACHER = [
  '/',
  '/index.html',
  '/services.html',
  '/service-maintenance.html',
  '/service-formation.html',
  '/contact.html',
  '/a-propos.html',
  '/vision.html',
  '/partenariat.html',
  '/404.html',
  
  // ✅ Nouvelles pages
  '/boutique.html',
  '/produit.html',
  '/academie.html',
  '/outils.html',
  '/outil.html',
  '/jeux.html',
  '/jeu.html',
  
  // Dossiers
  '/blog/',
  '/blog/index.html',
  '/blog/article.html',
  '/aide/',
  '/aide/index.html',
  '/aide/faq.html',
  '/aide/contact-support.html',
  '/legal/cgu.html',
  '/legal/confidentialite.html',
  '/legal/mentions-legales.html',
  
  // ✅ CSS de base
  '/ressources/css/variables.css',
  '/ressources/css/style.css',
  '/ressources/css/header.css',
  '/ressources/css/footer.css',
  '/ressources/css/responsive.css',
  
  // ✅ CSS spécifiques aux nouvelles fonctionnalités
  '/ressources/css/games.css',
  '/ressources/css/game.css',
  '/ressources/css/game-arcade.css',
  '/ressources/css/game-arcade-classique.css',
  '/ressources/css/game-memoire.css',
  '/ressources/css/game-english.css',
  
  // ✅ JS de base
  '/ressources/js/config.js',
  '/ressources/js/auth.js',
  '/ressources/js/roles.js',
  '/ressources/js/header.js',
  '/ressources/js/widgets.js',
  '/ressources/js/scripts.js',
  
  // ✅ JS spécifiques aux nouvelles fonctionnalités
  '/ressources/js/games-data.js',
  '/ressources/js/games-liste.js',
  '/ressources/js/game.js',
  '/ressources/js/game-arcade.js',
  '/ressources/js/game-arcade-classique.js',
  '/ressources/js/game-memoire.js',
  '/ressources/js/game-english.js',
  '/ressources/js/english-ai-config.js',
  
  '/manifest.webmanifest'
];

/* Extensions d'assets statiques (stratégie cache-first) */
const EXTENSIONS_ASSETS = [
  '.css', '.js', '.png', '.jpg', '.jpeg', '.webp',
  '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'
];

/* ============================================================
   2. INSTALLATION — Mise en cache initiale
   ============================================================ */

self.addEventListener('install', (event) => {
  console.log('[SW] Installation — version', VERSION);

  event.waitUntil(
    caches.open(CACHE_ASSETS)
      .then((cache) => {
        console.log('[SW] Pré-cache des assets essentiels…');
        return Promise.all(
          ASSETS_A_PRECACHER.map((url) => {
            return cache.add(url).catch((err) => {
              console.warn('[SW] Impossible de cacher :', url, err);
            });
          })
        );
      })
      .then(() => {
        console.log('[SW] Installation terminée');
        return self.skipWaiting();
      })
  );
});

/* ============================================================
   3. ACTIVATION — Nettoyage des anciens caches
   ============================================================ */

self.addEventListener('activate', (event) => {
  console.log('[SW] Activation — version', VERSION);

  event.waitUntil(
    caches.keys()
      .then((nomsCaches) => {
        const cachesASupprimer = nomsCaches.filter((nom) => {
          return nom.startsWith('jos-dore-') &&
                 nom !== CACHE_ASSETS &&
                 nom !== CACHE_PAGES;
        });

        return Promise.all(
          cachesASupprimer.map((nom) => {
            console.log('[SW] Suppression ancien cache :', nom);
            return caches.delete(nom);
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation terminée');
        return self.clients.claim();
      })
  );
});

/* ============================================================
   4. INTERCEPTION DES REQUÊTES (fetch)
   ============================================================ */

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;
  if (url.protocol === 'chrome-extension:') return;

  // Requêtes externes → Stale-while-revalidate
  if (url.origin !== self.location.origin) {
    event.respondWith(strategieStaleWhileRevalidate(request));
    return;
  }

  // Fichiers statiques → Cache-first
  const extension = url.pathname.substring(url.pathname.lastIndexOf('.'));
  if (EXTENSIONS_ASSETS.includes(extension)) {
    event.respondWith(strategieCacheFirst(request));
    return;
  }

  // Pages HTML → Network-first
  event.respondWith(strategieNetworkFirst(request));
});

/* ============================================================
   5. STRATÉGIES DE CACHE
   ============================================================ */

async function strategieCacheFirst(request) {
  const cache = await caches.open(CACHE_ASSETS);
  const reponse = await cache.match(request);

  if (reponse) return reponse;

  try {
    const reponseReseau = await fetch(request);
    if (reponseReseau && reponseReseau.status === 200) {
      cache.put(request, reponseReseau.clone());
    }
    return reponseReseau;
  } catch (err) {
    console.warn('[SW] Échec réseau (cache-first) :', request.url);
    return new Response('Ressource indisponible hors ligne.', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

async function strategieNetworkFirst(request) {
  const cache = await caches.open(CACHE_PAGES);

  try {
    const reponseReseau = await fetch(request);
    if (reponseReseau && reponseReseau.status === 200) {
      cache.put(request, reponseReseau.clone());
    }
    return reponseReseau;
  } catch (err) {
    const reponseCache = await cache.match(request);
    if (reponseCache) return reponseCache;

    const reponseAssets = await caches.match(request);
    if (reponseAssets) return reponseAssets;

    const page404 = await caches.match('/404.html');
    if (page404) return page404;

    return new Response('Vous êtes hors ligne. Reconnectez-vous pour accéder à cette page.', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

async function strategieStaleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_ASSETS);
  const reponseCache = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((reponseReseau) => {
      if (reponseReseau && reponseReseau.status === 200) {
        cache.put(request, reponseReseau.clone());
      }
      return reponseReseau;
    })
    .catch(() => null);

  return reponseCache || fetchPromise || new Response('', { status: 504 });
}

/* ============================================================
   6. MESSAGES DEPUIS LA PAGE
   ============================================================ */

self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Mise à jour immédiate demandée');
    self.skipWaiting();
  }

  if (event.data.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: VERSION });
  }

  if (event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((noms) => {
      return Promise.all(noms.map((nom) => caches.delete(nom)));
    }).then(() => {
      console.log('[SW] Tous les caches supprimés');
    });
  }
});

/* ============================================================
   7. NOTIFICATIONS PUSH
   ============================================================ */

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { titre: 'Jos Dore', message: event.data.text() };
  }

  const options = {
    body: data.message || 'Nouvelle notification Jos Dore',
    icon: '/ressources/images/logo/icon-192.png',
    badge: '/ressources/images/logo/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.titre || 'Jos Dore', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlCible = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientsList) => {
        for (const client of clientsList) {
          if (client.url.includes(urlCible) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlCible);
        }
      })
  );
});

/* ============================================================
   8. INITIALISATION
   ============================================================ */

console.log('[SW] Service Worker Jos Dore chargé — version', VERSION);