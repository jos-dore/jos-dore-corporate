/* ============================================================
   JOS DORE CORPORATE — SCRIPTS GÉNÉRAUX & PWA
   ============================================================ */

(function (global) {
  'use strict';

  const { CONFIG, CONST, STORAGE, UTILS, LOG } = global.JosDore;
  const Auth    = global.JosDore.Auth;
  const Widgets = global.JosDore.Widgets;

  /* ============================================================
     1. ANNÉE DYNAMIQUE
     ============================================================ */
  function injecterAnnee() {
    const annee = new Date().getFullYear();
    document.querySelectorAll('#annee, [data-annee]').forEach(el => { el.textContent = annee; });
    LOG.info('Année injectée :', annee);
  }

  /* ============================================================
     2. INJECTION DES LIENS SOCIAUX & CONTACT
     ============================================================ */
  function injecterLiensSociaux() {
    const sociaux = CONFIG.sociaux;
    const contact = CONFIG.contact;

    document.querySelectorAll('[data-social]').forEach(el => {
      const cle = el.dataset.social;
      if (sociaux[cle]) {
        el.setAttribute('href', sociaux[cle]);
        if (!el.getAttribute('target')) {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
        }
      }
    });

    document.querySelectorAll('[data-contact="telephone"]').forEach(el => {
      el.setAttribute('href', 'tel:' + contact.telephone.replace(/\s/g, ''));
      if (el.textContent.trim() === '') el.textContent = contact.telephone;
    });

    document.querySelectorAll('[data-contact="whatsapp"]').forEach(el => {
      el.setAttribute('href', contact.whatsappLien);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
  }

  /* ============================================================
     3. SERVICE WORKER (MOTEUR PWA)
     ============================================================ */
  function enregistrerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      LOG.warn('Service Worker non supporté.');
      return;
    }

    // 🛑 DÉSACTIVATION EN MODE DÉVELOPPEMENT (Live Server)
    // Empêche le cache de bloquer les modifications locales.
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      LOG.info('Service Worker désactivé en mode développement (Live Server).');
      return;
    }

    // Le SW a besoin de HTTPS en production
    if (location.protocol === 'http:') {
      LOG.warn('Service Worker ignoré (http).');
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => {
          LOG.info('Service Worker enregistré :', reg.scope);

          // Détection des mises à jour du SW
          reg.addEventListener('updatefound', () => {
            const nouveauSW = reg.installing;
            if (!nouveauSW) return;

            nouveauSW.addEventListener('statechange', () => {
              if (nouveauSW.state === 'installed' && navigator.serviceWorker.controller) {
                LOG.info('Nouvelle version disponible. Recharge pour mettre à jour.');
              }
            });
          });
        })
        .catch(err => LOG.warn('Échec enregistrement SW :', err));
    });
  }

  /* ============================================================
     4. INVITE D'INSTALLATION PWA (LA BANNIÈRE)
     ============================================================ */
  function initInviteInstallation() {
    let inviteDifferee = null;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      inviteDifferee = e;
      LOG.info('Installation PWA disponible.');

      const dejaRefusee = STORAGE.get(CONFIG.cles.pwaRefusee, false);
      if (dejaRefusee || estDejaInstallee()) return;

      afficherBanniereInstallation();
    });

    function afficherBanniereInstallation() {
      if (document.getElementById('banniere-pwa')) return;

      const banniere = document.createElement('div');
      banniere.id = 'banniere-pwa';

      banniere.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 24px;
        right: 24px;
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
        animation: slideUpPwa 0.4s ease forwards;
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

      if (!document.getElementById('pwa-anim-style')) {
        const styleAnim = document.createElement('style');
        styleAnim.id = 'pwa-anim-style';
        styleAnim.innerHTML = `@keyframes slideUpPwa { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;
        document.head.appendChild(styleAnim);
      }

      document.body.appendChild(banniere);

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

      document.getElementById('pwa-refuser').addEventListener('click', () => {
        STORAGE.set(CONFIG.cles.pwaRefusee, true);
        banniere.remove();
      });
    }

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

  function estDejaInstallee() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  /* ============================================================
     5. ONLINE / OFFLINE
     ============================================================ */
  function initOnlineOffline() {
    let bandeau = document.getElementById('bandeau-offline');
    if (!bandeau) {
      bandeau = document.createElement('div');
      bandeau.id = 'bandeau-offline';
      bandeau.style.cssText = `position:fixed;bottom:0;left:0;right:0;background:#DC2626;color:#fff;padding:12px 16px;text-align:center;font-size:14px;font-weight:700;font-family:'Poppins',sans-serif;transform:translateY(100%);transition:transform 0.3s ease;z-index:9999;display:flex;align-items:center;justify-content:center;gap:8px;`;
      bandeau.innerHTML = '<i class="fi fi-rr-wifi-slash"></i> Tu es hors ligne. Certaines fonctions sont limitées.';
      document.body.appendChild(bandeau);
    }
    function afficher() { bandeau.style.transform = 'translateY(0)'; }
    function cacher()   { bandeau.style.transform = 'translateY(100%)'; }

    window.addEventListener('online', () => {
      LOG.info('Connexion rétablie');
      cacher();
      if (Widgets && Widgets.toastSucces) Widgets.toastSucces('Connexion rétablie.');
    });
    window.addEventListener('offline', () => {
      LOG.warn('Connexion perdue');
      afficher();
    });
    if (!navigator.onLine) afficher();
  }

  /* ============================================================
     6. MODE SOMBRE
     ============================================================ */
  function initModeSombre() {
    const CLE = CONFIG.cles.theme;
    const themeSauvegarde = STORAGE.get(CLE, null);
    const prefereSombre = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = themeSauvegarde || (prefereSombre ? 'sombre' : 'clair');
    appliquerTheme(theme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!STORAGE.get(CLE, null)) appliquerTheme(e.matches ? 'sombre' : 'clair');
    });
  }

  function appliquerTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function basculerTheme() {
    const CLE = CONFIG.cles.theme;
    const actuel = document.documentElement.getAttribute('data-theme') || 'clair';
    const nouveau = actuel === 'sombre' ? 'clair' : 'sombre';
    STORAGE.set(CLE, nouveau);
    appliquerTheme(nouveau);
    return nouveau;
  }

  /* ============================================================
     7. LIENS EXTERNES & IMAGES DE SECOURS
     ============================================================ */
  function initLiensExternes() {
    document.querySelectorAll('a[href^="http"]').forEach(lien => {
      try {
        const url = new URL(lien.href);
        const estInterne =
          url.hostname === location.hostname ||
          url.hostname === 'josdore.com' ||
          url.hostname === 'www.josdore.com';
        if (!estInterne && !lien.hasAttribute('target')) {
          lien.setAttribute('target', '_blank');
          lien.setAttribute('rel', 'noopener noreferrer');
        }
      } catch (e) { /* URL invalide, on ignore */ }
    });
  }

  function initFallbackImages() {
    const PLACEHOLDER = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#F1F5F9"/><text x="50%" y="50%" font-family="sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle" dy=".3em">Image indisponible</text></svg>`
    );
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => {
        if (img.src !== PLACEHOLDER) img.src = PLACEHOLDER;
      }, { once: true });
    });
  }

  /* ============================================================
     8. INITIALISATION
     ============================================================ */
  function init() {
    LOG.info('Scripts généraux — démarrage');
    injecterAnnee();
    injecterLiensSociaux();
    enregistrerServiceWorker();
    initInviteInstallation();
    initOnlineOffline();
    initModeSombre();
    initLiensExternes();
    initFallbackImages();
    LOG.info('Tous les scripts sont prêts.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ============================================================
     EXPOSITION PUBLIQUE
     ============================================================ */
  global.JosDore.Scripts = {
    injecterAnnee,
    injecterLiensSociaux,
    basculerTheme,
    appliquerTheme
  };

})(window);