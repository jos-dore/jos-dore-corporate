/* ============================================================
   JOS DORE CORPORATE — SCRIPTS GÉNÉRAUX
   ------------------------------------------------------------
   Dernier fichier JS. Gère :
   - Année dynamique dans les footers
   - Enregistrement du Service Worker (PWA)
   - Détection online / offline
   - Invite d'installation PWA
   - Mode sombre
   - Liens externes automatiques
   - Fallback images cassées
   - Détection première visite
   - Nettoyage et initialisation globale
   ------------------------------------------------------------
   À charger EN DERNIER, après tous les autres JS.
   ============================================================ */

(function (global) {
  'use strict';

  const { CONFIG, CONST, STORAGE, UTILS, LOG } = global.JosDore;
  const Auth    = global.JosDore.Auth;
  const Widgets = global.JosDore.Widgets;

  /* ============================================================
     1. ANNÉE DYNAMIQUE
     ------------------------------------------------------------
     Remplace tous les <span id="annee"></span> par l'année en cours.
     ============================================================ */
  function injecterAnnee() {
    const annee = new Date().getFullYear();

    document.querySelectorAll('#annee, [data-annee]').forEach(el => {
      el.textContent = annee;
    });

    LOG.info('Année injectée :', annee);
  }

  /* ============================================================
     2. SERVICE WORKER (PWA)
     ------------------------------------------------------------
     Enregistre le service worker pour :
     - Mode hors ligne
     - Cache des assets
     - Notifications push
     ============================================================ */
  function enregistrerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      LOG.warn('Service Worker non supporté par ce navigateur.');
      return;
    }

    // Ne pas enregistrer en localhost avec http (dev)
    if (location.protocol === 'http:' &&
        location.hostname !== 'localhost' &&
        location.hostname !== '127.0.0.1') {
      LOG.warn('Service Worker ignoré (contexte non sécurisé).');
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(reg => {
          LOG.info('Service Worker enregistré :', reg.scope);

          // Détecte les mises à jour du SW
          reg.addEventListener('updatefound', () => {
            const nouveauSW = reg.installing;
            if (!nouveauSW) return;

            nouveauSW.addEventListener('statechange', () => {
              if (nouveauSW.state === 'installed' &&
                  navigator.serviceWorker.controller) {
                LOG.info('Nouvelle version disponible.');
                proposerMiseAJour();
              }
            });
          });
        })
        .catch(err => {
          LOG.warn('Échec enregistrement SW :', err);
        });
    });
  }

  /**
   * Propose à l'utilisateur de mettre à jour la page
   */
  function proposerMiseAJour() {
    if (!Widgets || typeof Widgets.toast !== 'function') return;

    const toast = Widgets.toast({
      type: 'info',
      titre: 'Mise à jour disponible',
      message: 'Recharge la page pour profiter des nouveautés.',
      duree: 0, // Ne se ferme pas tout seul
      icone: 'fi fi-rr-refresh'
    });

    // Ajoute un bouton "Recharger" dans le toast
    if (toast) {
      const contenu = toast.querySelector('.toast__contenu');
      if (contenu) {
        const btn = document.createElement('button');
        btn.className = 'btn btn--or btn--sm mt-2';
        btn.innerHTML = '<i class="fi fi-rr-refresh"></i> Recharger';
        btn.style.marginTop = '8px';
        btn.addEventListener('click', () => {
          window.location.reload();
        });
        contenu.appendChild(btn);
      }
    }
  }

  /* ============================================================
     3. DÉTECTION ONLINE / OFFLINE
     ------------------------------------------------------------
     Affiche un bandeau quand l'utilisateur perd la connexion.
     ============================================================ */
  function initOnlineOffline() {
    // Bandeau d'état
    let bandeau = document.getElementById('bandeau-offline');

    if (!bandeau) {
      bandeau = document.createElement('div');
      bandeau.id = 'bandeau-offline';
      bandeau.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #DC2626;
        color: #fff;
        padding: 12px 16px;
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        font-family: 'Poppins', sans-serif;
        transform: translateY(100%);
        transition: transform 0.3s ease;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      `;
      bandeau.innerHTML = '<i class="fi fi-rr-wifi-slash"></i> Tu es hors ligne. Certaines fonctions sont limitées.';
      document.body.appendChild(bandeau);
    }

    function afficher() {
      bandeau.style.transform = 'translateY(0)';
    }

    function cacher() {
      bandeau.style.transform = 'translateY(100%)';
    }

    window.addEventListener('online', () => {
      LOG.info('Connexion rétablie');
      cacher();
      if (Widgets && Widgets.toastSucces) {
        Widgets.toastSucces('Connexion rétablie.');
      }
    });

    window.addEventListener('offline', () => {
      LOG.warn('Connexion perdue');
      afficher();
    });

    // Vérifie l'état au démarrage
    if (!navigator.onLine) {
      afficher();
    }
  }

  /* ============================================================
     4. INVITE D'INSTALLATION PWA
     ------------------------------------------------------------
     Affiche une bannière discrète pour installer l'app.
     ============================================================ */
  function initInviteInstallation() {
    let inviteDifferee = null;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      inviteDifferee = e;
      LOG.info('Installation PWA disponible.');

      // Ne pas afficher si déjà installée ou déjà refusée
      const dejaRefusee = STORAGE.get(CONFIG.cles.pwaRefusee, false);
      if (dejaRefusee || estDejaInstallee()) return;

      afficherBanniereInstallation();
    });

    function afficherBanniereInstallation() {
      // Évite les doublons
      if (document.getElementById('banniere-pwa')) return;

      const banniere = document.createElement('div');
      banniere.id = 'banniere-pwa';
      banniere.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        max-width: 400px;
        margin: 0 auto;
        background: #fff;
        border: 1px solid #E2E8F0;
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 12px 32px rgba(10, 37, 64, 0.15);
        z-index: 9996;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: 'Inter', sans-serif;
        animation: slideUp 0.4s ease;
      `;

      banniere.innerHTML = `
        <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#F59E0B,#D97706);display:flex;align-items:center;justify-content:center;font-size:22px;color:#0A2540;flex-shrink:0;">
          <i class="fi fi-rr-download"></i>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:800;color:#0F172A;font-size:14px;margin-bottom:2px;">Installer Jos Dore</div>
          <div style="font-size:12px;color:#64748B;line-height:1.4;">Accès rapide, notifications, mode hors ligne.</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0;">
          <button id="pwa-installer" style="padding:8px 14px;background:#F59E0B;color:#0A2540;border:none;border-radius:8px;font-weight:800;font-size:12px;cursor:pointer;font-family:inherit;">Installer</button>
          <button id="pwa-refuser" style="padding:4px 8px;background:transparent;color:#64748B;border:none;font-size:11px;cursor:pointer;font-family:inherit;">Plus tard</button>
        </div>
      `;

      document.body.appendChild(banniere);

      // Bouton installer
      document.getElementById('pwa-installer').addEventListener('click', async () => {
        if (!inviteDifferee) return;
        inviteDifferee.prompt();
        const choix = await inviteDifferee.userChoice;
        LOG.info('Choix installation :', choix.outcome);
        inviteDifferee = null;
        banniere.remove();

        if (choix.outcome === 'accepted' && Widgets && Widgets.toastSucces) {
          Widgets.toastSucces('Installation en cours…');
        }
      });

      // Bouton plus tard
      document.getElementById('pwa-refuser').addEventListener('click', () => {
        STORAGE.set(CONFIG.cles.pwaRefusee, true);
        banniere.remove();
      });
    }

    // Détecte si l'app est installée
    window.addEventListener('appinstalled', () => {
      LOG.info('App installée !');
      STORAGE.set(CONFIG.cles.pwaRefusee, true);
      const banniere = document.getElementById('banniere-pwa');
      if (banniere) banniere.remove();
      if (Widgets && Widgets.toastSucces) {
        Widgets.toastSucces('Jos Dore est installée sur ton appareil.');
      }
    });
  }

  /**
   * Vérifie si l'app est déjà lancée en mode standalone
   */
  function estDejaInstallee() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  /* ============================================================
     5. MODE SOMBRE (optionnel)
     ------------------------------------------------------------
     Respecte la préférence utilisateur (système ou manuelle).
     ============================================================ */
  function initModeSombre() {
    const CLE = CONFIG.cles.theme;
    const themeSauvegarde = STORAGE.get(CLE, null);

    // Préférence système
    const prefereSombre = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = themeSauvegarde || (prefereSombre ? 'sombre' : 'clair');

    appliquerTheme(theme);

    // Écoute les changements système (si pas de choix manuel)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!STORAGE.get(CLE, null)) {
        appliquerTheme(e.matches ? 'sombre' : 'clair');
      }
    });
  }

  function appliquerTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    LOG.info('Thème appliqué :', theme);
  }

  /**
   * Bascule le mode sombre
   */
  function basculerTheme() {
    const CLE = CONFIG.cles.theme;
    const actuel = document.documentElement.getAttribute('data-theme') || 'clair';
    const nouveau = actuel === 'sombre' ? 'clair' : 'sombre';
    STORAGE.set(CLE, nouveau);
    appliquerTheme(nouveau);
    return nouveau;
  }

  /* ============================================================
     6. LIENS EXTERNES AUTOMATIQUES
     ------------------------------------------------------------
     Ajoute target="_blank" et rel="noopener" sur tous les liens
     externes (hors josdore.com).
     ============================================================ */
  function initLiensExternes() {
    document.querySelectorAll('a[href^="http"]').forEach(lien => {
      try {
        const url = new URL(lien.href);
        const estInterne = url.hostname === location.hostname ||
                            url.hostname === 'josdore.com' ||
                            url.hostname === 'www.josdore.com';

        if (!estInterne) {
          lien.setAttribute('target', '_blank');
          lien.setAttribute('rel', 'noopener noreferrer');
        }
      } catch (e) {
        // Ignore les URLs invalides
      }
    });
  }

  /* ============================================================
     7. FALLBACK IMAGES CASSÉES
     ------------------------------------------------------------
     Remplace les images cassées par un placeholder SVG.
     ============================================================ */
  function initFallbackImages() {
    const PLACEHOLDER = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#F1F5F9"/>
        <text x="50%" y="50%" font-family="sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle" dy=".3em">Image indisponible</text>
      </svg>
    `);

    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => {
        if (img.src !== PLACEHOLDER) {
          img.src = PLACEHOLDER;
        }
      }, { once: true });
    });
  }

  /* ============================================================
     8. DÉTECTION PREMIÈRE VISITE
     ------------------------------------------------------------
     Enregistre la date de première visite pour analyse.
     ============================================================ */
  function initPremiereVisite() {
    const CLE = CONFIG.cles.premiereVisite;
    const existante = STORAGE.get(CLE, null);

    if (!existante) {
      STORAGE.set(CLE, new Date().toISOString());
      LOG.info('Première visite enregistrée.');
    }

    // Nombre de visites
    const CLE_VISITES = CONFIG.cles.nbVisites;
    const nb = STORAGE.get(CLE_VISITES, 0) + 1;
    STORAGE.set(CLE_VISITES, nb);
  }

  /* ============================================================
     9. PROTECTION CONTRE LE DRAG DES IMAGES
     ------------------------------------------------------------
     Évite le drag & drop accidentel des images (UX).
     ============================================================ */
  function initProtectionImages() {
    document.querySelectorAll('img').forEach(img => {
      img.setAttribute('draggable', 'false');
    });
  }

  /* ============================================================
     10. SMOOTH SCROLL POUR ANCRES
     ------------------------------------------------------------
     (doublon avec header.js mais utile si header absent)
     ============================================================ */
  function initAncres() {
    document.querySelectorAll('a[href^="#"]:not([data-no-smooth])').forEach(lien => {
      lien.addEventListener('click', (e) => {
        const href = lien.getAttribute('href');
        if (href.length <= 1) return;

        const cible = document.querySelector(href);
        if (!cible) return;

        e.preventDefault();
        const header = document.querySelector('.header');
        const offset = header ? header.offsetHeight + 16 : 0;
        const top = cible.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, '', href);
      });
    });
  }

  /* ============================================================
     11. OUTILS DE DÉBOGAGE
     ------------------------------------------------------------
     Expose des fonctions utiles dans la console (dev uniquement).
     ============================================================ */
  function initDebug() {
    if (!CONFIG.debug) return;

    LOG.info('Commandes debug disponibles : JosDore.debug');

    global.JosDore.debug = {
      resetLocalStorage() {
        if (confirm('Effacer tout le stockage local Jos Dore ?')) {
          STORAGE.clearAll();
          console.log('Stockage effacé. Rechargement…');
          setTimeout(() => location.reload(), 500);
        }
      },
      voirStockage() {
        const data = {};
        Object.entries(CONFIG.cles).forEach(([nom, cle]) => {
          data[nom] = STORAGE.get(cle, null);
        });
        console.table(data);
        return data;
      },
      creerUtilisateurTest() {
        const r = Auth.inscrire({
          nom: 'Test Client',
          email: 'test@josdore.com',
          telephone: '+229 01 00 00 00 00',
          motDePasse: 'test1234',
          entreprise: 'Entreprise Test',
          role: 'client'
        });
        console.log(r);
        return r;
      },
      creerAdminTest() {
        const r = Auth.inscrire({
          nom: 'Ulrich Admin',
          email: 'admin@josdore.com',
          telephone: '+229 01 28 62 14 07',
          motDePasse: 'admin1234',
          role: 'admin'
        });
        console.log(r);
        return r;
      },
      allerEspaceClient() {
        location.href = '/espace-client/tableau-de-bord.html';
      },
      allerAdmin() {
        location.href = '/admin/index.html';
      }
    };
  }

  /* ============================================================
     12. INITIALISATION GÉNÉRALE
     ============================================================ */
  function init() {
    LOG.info('Scripts généraux — démarrage');

    injecterAnnee();
    enregistrerServiceWorker();
    initOnlineOffline();
    initInviteInstallation();
    initModeSombre();
    initLiensExternes();
    initFallbackImages();
    initPremiereVisite();
    initProtectionImages();
    initAncres();
    initDebug();

    LOG.info('Tous les scripts sont prêts.');
  }

  /* ============================================================
     13. APPLICATION
     ============================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ============================================================
     14. EXPOSITION GLOBALE
     ============================================================ */
  global.JosDore.Scripts = {
    injecterAnnee,
    basculerTheme,
    estDejaInstallee,
    appliquerTheme
  };

})(window);