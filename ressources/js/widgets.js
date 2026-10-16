/* ============================================================
   JOS DORE CORPORATE — WIDGETS & COMPOSANTS UI
   ------------------------------------------------------------
   Composants réutilisables :
   - Toasts (notifications éphémères)
   - Modales (dialogues personnalisés)
   - Confirmations (remplace confirm() natif)
   - Loaders (spinners, overlay plein écran)
   - Bannière cookies (RGPD)
   - Notations par étoiles
   - Copier-coller avec feedback
   - Partage natif (Web Share API)
   ------------------------------------------------------------
   À charger APRÈS config.js.
   ============================================================ */

(function (global) {
  'use strict';

  const { CONFIG, CONST, STORAGE, UTILS, LOG } = global.JosDore;

  /* ============================================================
     1. INJECTION DES STYLES (une seule fois)
     ============================================================ */
  function injecterStyles() {
    if (document.getElementById('josdore-widgets-styles')) return;

    const style = document.createElement('style');
    style.id = 'josdore-widgets-styles';
    style.textContent = `
      /* --- Toasts --- */
      .toast-conteneur {
        position: fixed;
        top: calc(var(--header-h, 72px) + 16px);
        right: 16px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
        width: calc(100% - 32px);
        pointer-events: none;
      }
      .toast {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 14px 16px;
        background: #fff;
        border: 1px solid var(--gris-200, #E2E8F0);
        border-radius: var(--rayon-md, 14px);
        box-shadow: 0 12px 32px rgba(10, 37, 64, 0.15);
        font-size: 14px;
        line-height: 1.5;
        color: var(--gris-700, #334155);
        animation: toastIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
        border-left: 4px solid var(--bleu, #2563EB);
      }
      .toast--succes { border-left-color: var(--vert, #16A34A); }
      .toast--erreur { border-left-color: var(--rouge, #DC2626); }
      .toast--alerte { border-left-color: var(--or, #F59E0B); }
      .toast--info   { border-left-color: var(--bleu, #2563EB); }
      .toast.is-sortie { animation: toastOut 0.25s ease forwards; }
      .toast__icone {
        font-size: 20px;
        flex-shrink: 0;
        margin-top: 1px;
        color: var(--bleu, #2563EB);
      }
      .toast--succes .toast__icone { color: var(--vert, #16A34A); }
      .toast--erreur .toast__icone { color: var(--rouge, #DC2626); }
      .toast--alerte .toast__icone { color: var(--or-fonce, #D97706); }
      .toast__contenu { flex: 1; min-width: 0; }
      .toast__titre {
        font-weight: 800;
        color: var(--gris-900, #0F172A);
        margin-bottom: 2px;
      }
      .toast__texte { color: var(--gris-500, #64748B); font-size: 13px; }
      .toast__fermer {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--gris-500, #64748B);
        font-size: 14px;
        flex-shrink: 0;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        background: none;
      }
      .toast__fermer:hover {
        background: var(--gris-100, #F1F5F9);
        color: var(--gris-900, #0F172A);
      }
      @keyframes toastIn {
        from { transform: translateX(120%); opacity: 0; }
        to   { transform: translateX(0); opacity: 1; }
      }
      @keyframes toastOut {
        from { transform: translateX(0); opacity: 1; }
        to   { transform: translateX(120%); opacity: 0; }
      }

      /* --- Overlay de chargement --- */
      .chargement-overlay {
        position: fixed;
        inset: 0;
        background: rgba(10, 37, 64, 0.5);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 9998;
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 20px;
      }
      .chargement-overlay.is-visible { display: flex; }
      .chargement-overlay__spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(255, 255, 255, 0.2);
        border-top-color: var(--or, #F59E0B);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      .chargement-overlay__texte {
        color: #fff;
        font-family: var(--police-titre, sans-serif);
        font-weight: 700;
        font-size: 15px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* --- Modale générique --- */
      .modale {
        position: fixed;
        inset: 0;
        z-index: 9997;
        background: rgba(10, 37, 64, 0.55);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.2s ease;
      }
      .modale.is-visible { display: flex; }
      .modale__contenu {
        background: #fff;
        border-radius: 20px;
        max-width: 520px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        animation: popIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes popIn {
        from { transform: scale(0.9); opacity: 0; }
        to   { transform: scale(1); opacity: 1; }
      }
      .modale__head {
        padding: 20px 24px;
        border-bottom: 1px solid var(--gris-100, #F1F5F9);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .modale__titre {
        font-family: var(--police-titre, sans-serif);
        font-size: 18px;
        font-weight: 800;
        color: var(--gris-900, #0F172A);
      }
      .modale__close {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--gris-500, #64748B);
        font-size: 18px;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        background: none;
      }
      .modale__close:hover {
        background: var(--gris-100, #F1F5F9);
        color: var(--gris-900, #0F172A);
      }
      .modale__corps { padding: 24px; }
      .modale__pied {
        padding: 16px 24px;
        border-top: 1px solid var(--gris-100, #F1F5F9);
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        flex-wrap: wrap;
      }
      .modale__icone {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        margin: 0 auto 16px;
        background: rgba(245, 158, 11, 0.12);
        color: var(--or-fonce, #D97706);
      }
      .modale__icone--succes { background: rgba(22, 163, 74, 0.12); color: var(--vert, #16A34A); }
      .modale__icone--erreur { background: rgba(220, 38, 38, 0.12); color: var(--rouge, #DC2626); }
      .modale__icone--info   { background: rgba(37, 99, 235, 0.12); color: var(--bleu, #2563EB); }

      /* --- Étoiles de notation --- */
      .etoiles {
        display: inline-flex;
        gap: 4px;
        font-size: 20px;
        color: var(--gris-300, #CBD5E1);
      }
      .etoiles--interactive { cursor: pointer; }
      .etoiles__etoile {
        transition: all 0.15s ease;
      }
      .etoiles__etoile.is-active { color: var(--or, #F59E0B); }
      .etoiles--interactive .etoiles__etoile:hover {
        transform: scale(1.15);
        color: var(--or, #F59E0B);
      }

      /* --- Badge bouton copier --- */
      .btn-copier {
        position: relative;
      }
      .btn-copier.is-copie::after {
        content: 'Copié !';
        position: absolute;
        top: -32px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--vert, #16A34A);
        color: #fff;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 800;
        white-space: nowrap;
        animation: fadeIn 0.2s ease;
      }

      /* --- Responsive --- */
      @media (max-width: 640px) {
        .toast-conteneur {
          top: auto;
          bottom: 16px;
          right: 8px;
          left: 8px;
          width: auto;
          max-width: none;
        }
        .toast { animation: toastUp 0.3s ease; }
        @keyframes toastUp {
          from { transform: translateY(120%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     2. TOASTS
     ============================================================ */

  let conteneurToast = null;

  function obtenirConteneurToast() {
    if (conteneurToast && document.body.contains(conteneurToast)) {
      return conteneurToast;
    }
    conteneurToast = document.createElement('div');
    conteneurToast.className = 'toast-conteneur';
    document.body.appendChild(conteneurToast);
    return conteneurToast;
  }

  /**
   * Affiche un toast
   * @param {Object|string} options
   */
  function toast(options) {
    // Support raccourci : toast('message')
    if (typeof options === 'string') {
      options = { message: options };
    }

    const {
      type = 'info',       // 'info' | 'succes' | 'erreur' | 'alerte'
      titre = '',
      message = '',
      duree = 4000,
      icone = null,
      fermable = true
    } = options;

    const icones = {
      succes: 'fi fi-rr-check-circle',
      erreur: 'fi fi-rr-cross-circle',
      alerte: 'fi fi-rr-triangle-warning',
      info:   'fi fi-rr-info'
    };

    const conteneur = obtenirConteneurToast();

    const el = document.createElement('div');
    el.className = 'toast toast--' + type;
    el.innerHTML = `
      <i class="${icone || icones[type] || icones.info} toast__icone"></i>
      <div class="toast__contenu">
        ${titre ? '<div class="toast__titre">' + UTILS.escapeHtml(titre) + '</div>' : ''}
        ${message ? '<div class="toast__texte">' + UTILS.escapeHtml(message) + '</div>' : ''}
      </div>
      ${fermable ? '<button class="toast__fermer" aria-label="Fermer"><i class="fi fi-rr-cross-small"></i></button>' : ''}
    `;

    conteneur.appendChild(el);

    // Bouton fermer
    const btnFermer = el.querySelector('.toast__fermer');
    if (btnFermer) {
      btnFermer.addEventListener('click', () => fermerToast(el));
    }

    // Auto-fermeture
    if (duree > 0) {
      setTimeout(() => fermerToast(el), duree);
    }

    return el;
  }

  function fermerToast(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('is-sortie');
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 250);
  }

  // Raccourcis
  function toastSucces(message, titre = '') { return toast({ type: 'succes', message, titre }); }
  function toastErreur(message, titre = '') { return toast({ type: 'erreur', message, titre }); }
  function toastInfo(message, titre = '')   { return toast({ type: 'info', message, titre }); }
  function toastAlerte(message, titre = '') { return toast({ type: 'alerte', message, titre }); }

  /* ============================================================
     3. CHARGEMENT (overlay plein écran)
     ============================================================ */

  let overlayChargement = null;

  function obtenirOverlayChargement() {
    if (overlayChargement && document.body.contains(overlayChargement)) {
      return overlayChargement;
    }
    overlayChargement = document.createElement('div');
    overlayChargement.className = 'chargement-overlay';
    overlayChargement.innerHTML = `
      <div class="chargement-overlay__spinner"></div>
      <div class="chargement-overlay__texte">Chargement…</div>
    `;
    document.body.appendChild(overlayChargement);
    return overlayChargement;
  }

  /**
   * Affiche ou masque l'overlay de chargement
   */
  function chargement(visible, texte = 'Chargement…') {
    const overlay = obtenirOverlayChargement();
    const txtEl = overlay.querySelector('.chargement-overlay__texte');
    if (txtEl) txtEl.textContent = texte;
    overlay.classList.toggle('is-visible', !!visible);
  }

  /* ============================================================
     4. MODALES
     ============================================================ */

  /**
   * Affiche une modale personnalisée
   * @param {Object} options - { titre, contenu, actions, fermerAuClic }
   * @returns {Object} - { element, fermer }
   */
  function modale(options = {}) {
    const {
      titre = '',
      contenu = '',
      actions = [],
      fermerAuClic = true,
      icone = null,
      type = null
    } = options;

    const el = document.createElement('div');
    el.className = 'modale';

    let html = '<div class="modale__contenu">';

    if (titre) {
      html += `
        <div class="modale__head">
          <div class="modale__titre">${UTILS.escapeHtml(titre)}</div>
          <button class="modale__close" aria-label="Fermer">
            <i class="fi fi-rr-cross-small"></i>
          </button>
        </div>
      `;
    }

    html += '<div class="modale__corps">';

    if (icone) {
      const iconeClasse = type ? ' modale__icone--' + type : '';
      html += `<div class="modale__icone${iconeClasse}"><i class="${icone}"></i></div>`;
    }

    html += typeof contenu === 'string' ? contenu : '';
    html += '</div>';

    if (actions.length > 0) {
      html += '<div class="modale__pied">';
      actions.forEach((a, i) => {
        html += `<button class="btn btn--${a.variante || 'ghost'}" data-action-index="${i}">
          ${a.icone ? '<i class="' + a.icone + '"></i>' : ''}
          ${UTILS.escapeHtml(a.libelle || 'OK')}
        </button>`;
      });
      html += '</div>';
    }

    html += '</div>';
    el.innerHTML = html;

    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';

    // Animation
    requestAnimationFrame(() => el.classList.add('is-visible'));

    // Fonction de fermeture
    const fermer = () => {
      el.classList.remove('is-visible');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 250);
    };

    // Bouton fermer
    const btnClose = el.querySelector('.modale__close');
    if (btnClose) btnClose.addEventListener('click', fermer);

    // Clic sur l'overlay
    if (fermerAuClic) {
      el.addEventListener('click', (e) => {
        if (e.target === el) fermer();
      });
    }

    // Touche Échap
    const gererEchap = (e) => {
      if (e.key === 'Escape') {
        fermer();
        document.removeEventListener('keydown', gererEchap);
      }
    };
    document.addEventListener('keydown', gererEchap);

    // Actions
    el.querySelectorAll('[data-action-index]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.actionIndex, 10);
        const action = actions[i];
        if (action && typeof action.onClick === 'function') {
          const resultat = action.onClick();
          if (resultat !== false) fermer();
        } else {
          fermer();
        }
      });
    });

    return { element: el, fermer };
  }

  /**
   * Confirmation (remplace confirm() natif)
   * @returns {Promise<boolean>}
   */
  function confirmer(message, options = {}) {
    return new Promise((resolve) => {
      const {
        titre = 'Confirmation',
        libelleConfirmer = 'Confirmer',
        libelleAnnuler = 'Annuler',
        variante = 'rouge',
        icone = 'fi fi-rr-triangle-warning'
      } = options;

      modale({
        titre,
        icone,
        type: 'info',
        contenu: `<p style="text-align:center;color:var(--gris-700,#334155);line-height:1.6;">${UTILS.escapeHtml(message)}</p>`,
        actions: [
          {
            libelle: libelleAnnuler,
            variante: 'ghost',
            onClick: () => { resolve(false); }
          },
          {
            libelle: libelleConfirmer,
            variante,
            onClick: () => { resolve(true); }
          }
        ],
        fermerAuClic: false
      });

      // Si fermé via X, on résout false
      setTimeout(() => {
        document.querySelectorAll('.modale__close').forEach(btn => {
          btn.addEventListener('click', () => resolve(false));
        });
      }, 0);
    });
  }

  /**
   * Alerte simple (remplace alert() natif)
   */
  function alerter(message, options = {}) {
    return new Promise((resolve) => {
      const {
        titre = 'Information',
        libelle = 'Compris',
        icone = 'fi fi-rr-info',
        type = 'info'
      } = options;

      modale({
        titre,
        icone,
        type,
        contenu: `<p style="text-align:center;color:var(--gris-700,#334155);line-height:1.6;">${UTILS.escapeHtml(message)}</p>`,
        actions: [
          { libelle, variante: 'or', onClick: () => resolve(true) }
        ]
      });
    });
  }

  /* ============================================================
     5. BANNIÈRE COOKIES
     ============================================================ */

  /**
   * Initialise la bannière cookies
   * À appeler au chargement si tu veux la proposer.
   */
  function initCookies(options = {}) {
    const {
      delai = 800,
      onAccept = null,
      onRefuse = null
    } = options;

    // Vérifie si déjà fait
    const choix = STORAGE.get(CONFIG.cles.cookies, null);
    if (choix) {
      LOG.info('Cookies déjà configurés :', choix);
      return;
    }

    // Cherche la bannière dans le DOM
    const banniere = document.getElementById('cookies');
    if (!banniere) {
      LOG.warn('Bannière cookies introuvable (#cookies)');
      return;
    }

    // Affiche après un délai
    setTimeout(() => {
      banniere.classList.add('is-open');
    }, delai);

    // Boutons
    const btnAccept = document.getElementById('cookiesAccept');
    const btnRefuse = document.getElementById('cookiesRefuse');

    if (btnAccept) {
      btnAccept.addEventListener('click', () => {
        STORAGE.set(CONFIG.cles.cookies, 'accepte');
        banniere.classList.remove('is-open');
        if (typeof onAccept === 'function') onAccept();
        LOG.info('Cookies acceptés');
      });
    }

    if (btnRefuse) {
      btnRefuse.addEventListener('click', () => {
        STORAGE.set(CONFIG.cles.cookies, 'refuse');
        banniere.classList.remove('is-open');
        if (typeof onRefuse === 'function') onRefuse();
        LOG.info('Cookies refusés');
      });
    }
  }

  /**
   * Réouvre la bannière cookies (pour la modifier)
   */
  function revoirCookies() {
    const banniere = document.getElementById('cookies');
    if (!banniere) return;
    STORAGE.remove(CONFIG.cles.cookies);
    banniere.classList.add('is-open');
  }

  /* ============================================================
     6. ÉTOILES DE NOTATION
     ============================================================ */

  /**
   * Crée un composant de notation par étoiles
   * @param {Object} options - { note, interactive, onChange, taille }
   * @returns {HTMLElement}
   */
  function etoiles(options = {}) {
    const {
      note = 0,
      interactive = false,
      onChange = null,
      taille = 20
    } = options;

    const el = document.createElement('div');
    el.className = 'etoiles' + (interactive ? ' etoiles--interactive' : '');
    el.style.fontSize = taille + 'px';
    el.setAttribute('role', interactive ? 'radiogroup' : 'img');
    el.setAttribute('aria-label', 'Note : ' + note + ' sur 5');

    let noteActuelle = note;

    function rendre() {
      el.innerHTML = '';
      for (let i = 1; i <= 5; i++) {
        const etoile = document.createElement('i');
        etoile.className = 'fi ' + (i <= noteActuelle ? 'fi-sr-star' : 'fi-rr-star') + ' etoiles__etoile';
        if (i <= noteActuelle) etoile.classList.add('is-active');

        if (interactive) {
          etoile.setAttribute('role', 'radio');
          etoile.setAttribute('aria-checked', i === noteActuelle ? 'true' : 'false');
          etoile.setAttribute('tabindex', '0');

          etoile.addEventListener('click', () => {
            noteActuelle = i;
            rendre();
            if (typeof onChange === 'function') onChange(i);
          });

          etoile.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              noteActuelle = i;
              rendre();
              if (typeof onChange === 'function') onChange(i);
            }
          });
        }

        el.appendChild(etoile);
      }
    }

    rendre();

    // Expose la note actuelle
    el.obtenirNote = () => noteActuelle;
    el.definirNote = (n) => {
      noteActuelle = Math.max(0, Math.min(5, n));
      rendre();
    };

    return el;
  }

  /* ============================================================
     7. COPIER AVEC FEEDBACK
     ============================================================ */

  /**
   * Copie un texte et affiche un feedback sur le bouton
   */
  async function copier(texte, bouton = null) {
    const succes = await UTILS.copier(texte);

    if (succes) {
      if (bouton) {
        const contenuOriginal = bouton.innerHTML;
        bouton.classList.add('is-copie');
        bouton.innerHTML = '<i class="fi fi-rr-check"></i> Copié';
        setTimeout(() => {
          bouton.classList.remove('is-copie');
          bouton.innerHTML = contenuOriginal;
        }, 2000);
      } else {
        toastSucces('Lien copié dans le presse-papier.');
      }
    } else {
      toastErreur('Impossible de copier. Copie manuellement.');
    }

    return succes;
  }

  /* ============================================================
     8. PARTAGE NATIF (Web Share API)
     ============================================================ */

  /**
   * Partage du contenu (mobile : natif, desktop : copie)
   */
  async function partager(options = {}) {
    const {
      titre = CONFIG.nom,
      texte = CONFIG.description,
      url = window.location.href
    } = options;

    if (navigator.share) {
      try {
        await navigator.share({ title: titre, text: texte, url });
        return true;
      } catch (e) {
        // Utilisateur a annulé
        return false;
      }
    }

    // Fallback : copie le lien
    await copier(url);
    return true;
  }

  /* ============================================================
     9. INITIALISATION AUTOMATIQUE
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    injecterStyles();
    LOG.info('Widgets UI prêts');
  });

  /* ============================================================
     10. EXPOSITION GLOBALE
     ============================================================ */
  global.JosDore.Widgets = {
    // Toasts
    toast,
    toastSucces,
    toastErreur,
    toastInfo,
    toastAlerte,

    // Chargement
    chargement,

    // Modales
    modale,
    confirmer,
    alerter,

    // Cookies
    initCookies,
    revoirCookies,

    // Composants
    etoiles,
    copier,
    partager,

    // Styles
    injecterStyles
  };

})(window);