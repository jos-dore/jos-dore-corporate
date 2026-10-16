/* ============================================================
   JOS DORE CORPORATE — HEADER DYNAMIQUE
   ------------------------------------------------------------
   Gère :
   - Ouverture / fermeture de la sidebar
   - Menu burger (mobile)
   - Ombre au scroll
   - Smooth scroll sur ancres
   - Injection du nom et avatar utilisateur
   - Compteurs notifications et messages
   - Déconnexion
   - Visibilité selon connexion
   ------------------------------------------------------------
   À charger APRÈS config.js, auth.js et roles.js.
   ============================================================ */

(function (global) {
  'use strict';

  const { CONFIG, CONST, STORAGE, UTILS, LOG } = global.JosDore;
  const Auth  = global.JosDore.Auth;
  const Roles = global.JosDore.Roles;

  /* ============================================================
     1. ÉTAT GLOBAL
     ============================================================ */
  const etat = {
    sidebarOuverte: false,
    menuOuvert: false,
    dernierScroll: 0
  };

  /* ============================================================
     2. SIDEBAR & BURGER
     ============================================================ */

  /**
   * Ouvre la sidebar + overlay
   */
  function ouvrirSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuIcon = document.getElementById('menuIcon');

    if (!sidebar || !overlay) return;

    sidebar.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (menuIcon) {
      menuIcon.className = 'fi fi-rr-cross-small';
    }

    etat.sidebarOuverte = true;
  }

  /**
   * Ferme la sidebar + overlay
   */
  function fermerSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuIcon = document.getElementById('menuIcon');

    if (!sidebar || !overlay) return;

    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';

    if (menuIcon) {
      menuIcon.className = 'fi fi-rr-menu-burger';
    }

    etat.sidebarOuverte = false;
  }

  /**
   * Bascule ouverture / fermeture
   */
  function basculerSidebar() {
    if (etat.sidebarOuverte) {
      fermerSidebar();
    } else {
      ouvrirSidebar();
    }
  }

  /**
   * Initialise les écouteurs de la sidebar
   */
  function initSidebar() {
    const menuBtn = document.getElementById('menuBtn');
    const overlay = document.getElementById('overlay');
    const sidebar = document.getElementById('sidebar');

    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        basculerSidebar();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', fermerSidebar);
    }

    // Fermer la sidebar au clic sur un lien (mobile)
    if (sidebar) {
      sidebar.querySelectorAll('a').forEach(lien => {
        lien.addEventListener('click', () => {
          if (window.innerWidth < 1024) {
            fermerSidebar();
          }
        });
      });
    }

    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && etat.sidebarOuverte) {
        fermerSidebar();
      }
    });

    // Fermer si on redimensionne vers desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && etat.sidebarOuverte) {
        fermerSidebar();
      }
    });
  }

  /* ============================================================
     3. HEADER AU SCROLL
     ============================================================ */

  /**
   * Ajoute une ombre au header quand on scrolle
   */
  function initScrollHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          header.classList.toggle('is-scrolled', scrollY > 8);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================================
     4. SMOOTH SCROLL SUR ANCRES
     ============================================================ */

  /**
   * Fait défiler en douceur vers les sections internes (#id)
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(lien => {
      lien.addEventListener('click', (e) => {
        const href = lien.getAttribute('href');

        if (href.length <= 1) return;

        const cible = document.querySelector(href);
        if (!cible) return;

        e.preventDefault();

        const header = document.querySelector('.header');
        const hauteurHeader = header ? header.offsetHeight : 0;
        const top = cible.getBoundingClientRect().top + window.scrollY - hauteurHeader - 16;

        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, '', href);
      });
    });
  }

  /* ============================================================
     5. BOUTON RETOUR EN HAUT
     ============================================================ */

  /**
   * Crée et gère un bouton "retour en haut"
   */
  function initBoutonHaut() {
    // Vérifie s'il existe déjà
    let bouton = document.getElementById('btnHaut');

    if (!bouton) {
      bouton = document.createElement('button');
      bouton.id = 'btnHaut';
      bouton.className = 'btn-haut';
      bouton.setAttribute('aria-label', 'Retour en haut');
      bouton.innerHTML = '<i class="fi fi-rr-angle-up"></i>';
      document.body.appendChild(bouton);

      // Ajoute les styles inline (petit composant auto-suffisant)
      bouton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 24px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--nuit, #0A2540);
        color: var(--or, #F59E0B);
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 8px 24px rgba(10, 37, 64, 0.25);
        transition: all 0.25s ease;
        z-index: 90;
      `;
    }

    // Affiche / cache selon scroll
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 400) {
        bouton.style.display = 'flex';
        bouton.style.opacity = '1';
      } else {
        bouton.style.opacity = '0';
        setTimeout(() => {
          if ((window.scrollY || window.pageYOffset) <= 400) {
            bouton.style.display = 'none';
          }
        }, 200);
      }
    }, { passive: true });

    // Clic → retour en haut
    bouton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     6. INJECTION DE L'UTILISATEUR DANS LE HEADER
     ============================================================ */

  /**
   * Affiche le nom, initiales et avatar de l'utilisateur connecté
   * dans tous les éléments marqués avec data-user-*
   */
  function injecterUtilisateur() {
    const session = Auth.sessionActuelle();
    if (!session) return;

    const initiales = UTILS.initiales(session.nom);

    // Initiales
    document.querySelectorAll('[data-user-initiales]').forEach(el => {
      el.textContent = initiales;
    });

    // Nom complet
    document.querySelectorAll('[data-user-nom]').forEach(el => {
      el.textContent = session.nom;
    });

    // Prénom
    document.querySelectorAll('[data-user-prenom]').forEach(el => {
      el.textContent = String(session.nom).split(' ')[0];
    });

    // Email
    document.querySelectorAll('[data-user-email]').forEach(el => {
      el.textContent = session.email;
    });

    // Rôle
    document.querySelectorAll('[data-user-role]').forEach(el => {
      el.textContent = session.role;
    });

    // Entreprise
    document.querySelectorAll('[data-user-entreprise]').forEach(el => {
      el.textContent = session.entreprise || '—';
    });

    // Avatar image
    if (session.avatar) {
      document.querySelectorAll('[data-user-avatar]').forEach(el => {
        el.innerHTML = '<img src="' + session.avatar + '" alt="Avatar">';
        el.style.background = 'transparent';
      });
    }
  }

  /* ============================================================
     7. COMPTEURS NOTIFICATIONS & MESSAGES
     ============================================================ */

  /**
   * Met à jour les badges de notifications et messages
   */
  function majCompteurs() {
    // Notifications non lues
    const notifsLues = STORAGE.get(CONFIG.cles.notifsLues, {});
    const notifsTotal = Object.keys(notifsLues).length;

    // Messages non lus
    const messagesNonLus = STORAGE.get(CONFIG.cles.messagesNonLus, {});
    const messagesTotal = Object.values(messagesNonLus)
      .reduce((acc, val) => acc + (Number(val) || 0), 0);

    // Badge notifications
    document.querySelectorAll('[data-badge-notifs]').forEach(el => {
      if (notifsTotal > 0) {
        el.textContent = notifsTotal > 99 ? '99+' : notifsTotal;
        el.style.display = 'flex';
      } else {
        el.style.display = 'none';
      }
    });

    // Badge messages
    document.querySelectorAll('[data-badge-messages]').forEach(el => {
      if (messagesTotal > 0) {
        el.textContent = messagesTotal > 99 ? '99+' : messagesTotal;
        el.style.display = 'flex';
      } else {
        el.style.display = 'none';
      }
    });
  }

  /* ============================================================
     8. BOUTON DÉCONNEXION
     ============================================================ */

  /**
   * Attache un écouteur sur tous les boutons de déconnexion
   */
  function initDeconnexion() {
    document.querySelectorAll('[data-action="deconnexion"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const confirmation = confirm('Veux-tu vraiment te déconnecter ?');
        if (confirmation) {
          Auth.deconnecter();
        }
      });
    });
  }

  /* ============================================================
     9. PROTECTION DU HEADER (afficher/masquer selon connexion)
     ============================================================ */

  /**
   * Affiche les éléments [data-header="connecte"] uniquement si connecté,
   * et [data-header="invite"] uniquement si déconnecté.
   */
  function initVisibiliteHeader() {
    const estCo = Auth.estConnecte();

    document.querySelectorAll('[data-header="connecte"]').forEach(el => {
      el.style.display = estCo ? '' : 'none';
    });

    document.querySelectorAll('[data-header="invite"]').forEach(el => {
      el.style.display = estCo ? 'none' : '';
    });
  }

  /* ============================================================
     10. RACCOURCIS CLAVIER
     ============================================================ */

  /**
   * Raccourcis globaux :
   * - `/` : focus sur la recherche
   * - `Échap` : fermer sidebar / modal
   */
  function initRaccourcis() {
    document.addEventListener('keydown', (e) => {
      // Ignore si on est dans un input
      const dansInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        document.activeElement && document.activeElement.tagName
      );

      if (dansInput) return;

      // "/" pour la recherche
      if (e.key === '/') {
        const recherche = document.querySelector('.header__recherche input, [data-recherche]');
        if (recherche) {
          e.preventDefault();
          recherche.focus();
        }
      }

      // "Échap" pour fermer
      if (e.key === 'Escape') {
        if (etat.sidebarOuverte) fermerSidebar();
      }
    });
  }

  /* ============================================================
     11. FERMETURE AUTOMATIQUE DE LA SIDEBAR (clic extérieur)
     ============================================================ */
  function initClicExterieur() {
    document.addEventListener('click', (e) => {
      if (!etat.sidebarOuverte) return;

      const sidebar = document.getElementById('sidebar');
      const menuBtn = document.getElementById('menuBtn');

      if (!sidebar) return;

      const dansSidebar = sidebar.contains(e.target);
      const surBouton = menuBtn && menuBtn.contains(e.target);

      if (!dansSidebar && !surBouton) {
        fermerSidebar();
      }
    });
  }

  /* ============================================================
     12. INITIALISATION GÉNÉRALE
     ============================================================ */
  function init() {
    initSidebar();
    initScrollHeader();
    initSmoothScroll();
    initBoutonHaut();
    injecterUtilisateur();
    majCompteurs();
    initDeconnexion();
    initVisibiliteHeader();
    initRaccourcis();
    initClicExterieur();

    LOG.info('Header dynamique prêt');
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
     14. RAFRAÎCHISSEMENT EXTERNE
     ------------------------------------------------------------
     Permet à d'autres scripts de forcer la mise à jour du header
     (par exemple après une connexion, un changement de profil…).
     ============================================================ */
  global.JosDore.Header = {
    ouvrirSidebar,
    fermerSidebar,
    basculerSidebar,
    majCompteurs,
    injecterUtilisateur,
    rafraichir() {
      injecterUtilisateur();
      majCompteurs();
      initVisibiliteHeader();
    }
  };

})(window);