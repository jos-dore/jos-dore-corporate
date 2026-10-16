/* ============================================================
   JOS DORE CORPORATE — SERVICE WORKER (PWA)
   ------------------------------------------------------------
   Gère :
   - Le cache des ressources (CSS, JS, images, pages)
   - Le mode hors ligne
   - Les mises à jour automatiques
   ------------------------------------------------------------
   Stratégie :
   - Assets statiques (CSS, JS, images, fonts) → Cache-first
   - Pages HTML → Network-first (avec fallback cache)
   - Requêtes externes (Google Fonts, Uicons) → Stale-while-revalidate
   ------------------------------------------------------------
   Pour forcer une mise à jour : change le numéro de VERSION
   ci-dessous (ex : 'v2' → 'v3').
   ============================================================ */

'use strict';

/* ============================================================
   1. CONFIGURATION
   ============================================================ */

const VERSION = 'v1.0.0';
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

        // addAll échoue si UNE seule ressource échoue
        // → on utilise add() individuellement avec catch
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
        // Activer immédiatement (pas d'attente)
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
        // Supprimer tous les caches qui ne sont pas de la version actuelle
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
        // Prendre le contrôle immédiatement
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

  // ⚠️ Ignorer les requêtes non-GET (POST, etc.)
  if (request.method !== 'GET') return;

  // ⚠️ Ignorer les requêtes qui ne sont pas HTTP/HTTPS
  if (!url.protocol.startsWith('http')) return;

  // ⚠️ Ignorer les extensions Chrome / requêtes spéciales
  if (url.protocol === 'chrome-extension:') return;

  // ----------------------------------------
  // Requêtes externes (Google Fonts, Uicons…) → Stale-while-revalidate
  // ----------------------------------------
  if (url.origin !== self.location.origin) {
    event.respondWith(strategieStaleWhileRevalidate(request));
    return;
  }

  // ----------------------------------------
  // Fichiers statiques (CSS, JS, images) → Cache-first
  // ----------------------------------------
  const extension = url.pathname.substring(url.pathname.lastIndexOf('.'));
  if (EXTENSIONS_ASSETS.includes(extension)) {
    event.respondWith(strategieCacheFirst(request));
    return;
  }

  // ----------------------------------------
  // Pages HTML → Network-first (fallback cache + 404)
  // ----------------------------------------
  event.respondWith(strategieNetworkFirst(request));
});

/* ============================================================
   5. STRATÉGIES DE CACHE
   ============================================================ */

/**
 * Cache-first : sert depuis le cache, sinon réseau + mise en cache.
 * Idéal pour les assets qui ne changent pas souvent (CSS, JS, images).
 */
async function strategieCacheFirst(request) {
  const cache = await caches.open(CACHE_ASSETS);
  const reponse = await cache.match(request);

  if (reponse) {
    // Trouvé dans le cache → on sert immédiatement
    return reponse;
  }

  // Pas dans le cache → on va chercher sur le réseau
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

/**
 * Network-first : tente le réseau, sinon cache.
 * Idéal pour les pages HTML qui doivent rester à jour.
 */
async function strategieNetworkFirst(request) {
  const cache = await caches.open(CACHE_PAGES);

  try {
    const reponseReseau = await fetch(request);

    if (reponseReseau && reponseReseau.status === 200) {
      cache.put(request, reponseReseau.clone());
    }

    return reponseReseau;
  } catch (err) {
    // Réseau indisponible → on cherche dans le cache
    const reponseCache = await cache.match(request);

    if (reponseCache) {
      return reponseCache;
    }

    // Chercher aussi dans le cache des assets (au cas où)
    const reponseAssets = await caches.match(request);
    if (reponseAssets) return reponseAssets;

    // Page 404 en dernier recours
    const page404 = await caches.match('/404.html');
    if (page404) return page404;

    // Rien du tout
    return new Response('Vous êtes hors ligne. Reconnectez-vous pour accéder à cette page.', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

/**
 * Stale-while-revalidate : sert depuis le cache, mais met à jour en arrière-plan.
 * Idéal pour les ressources externes (Google Fonts, Uicons…).
 */
async function strategieStaleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_ASSETS);
  const reponseCache = await cache.match(request);

  // Lance une mise à jour en arrière-plan
  const fetchPromise = fetch(request)
    .then((reponseReseau) => {
      if (reponseReseau && reponseReseau.status === 200) {
        cache.put(request, reponseReseau.clone());
      }
      return reponseReseau;
    })
    .catch(() => null);

  // Retourne le cache immédiatement s'il existe, sinon attend le réseau
  return reponseCache || fetchPromise || new Response('', { status: 504 });
}

/* ============================================================
   6. MESSAGES DEPUIS LA PAGE (pour forcer la mise à jour)
   ============================================================ */

self.addEventListener('message', (event) => {
  if (!event.data) return;

  // Le site peut demander à activer immédiatement la nouvelle version
  if (event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Mise à jour immédiate demandée');
    self.skipWaiting();
  }

  // Le site peut demander le numéro de version
  if (event.data.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: VERSION });
  }

  // Nettoyage manuel du cache (debug)
  if (event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((noms) => {
      return Promise.all(noms.map((nom) => caches.delete(nom)));
    }).then(() => {
      console.log('[SW] Tous les caches supprimés');
    });
  }
});

/* ============================================================
   7. GESTION DES NOTIFICATIONS PUSH (optionnel, plus tard)
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
        // Si une fenêtre est déjà ouverte, on la focus
        for (const client of clientsList) {
          if (client.url.includes(urlCible) && 'focus' in client) {
            return client.focus();
          }
        }
        // Sinon, on ouvre une nouvelle fenêtre
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