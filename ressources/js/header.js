/* ============================================================
   JOS DORE CORPORATE — HEADER DYNAMIQUE
   ============================================================ */

(function (global) {
  'use strict';

  const { CONFIG, CONST, STORAGE, UTILS, LOG } = global.JosDore;
  const Auth  = global.JosDore.Auth;
  const Roles = global.JosDore.Roles;

  const etat = { sidebarOuverte: false, menuOuvert: false, dernierScroll: 0 };

  /* ============================================================
     SIDEBAR & BURGER
     ============================================================ */
  function ouvrirSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuIcon = document.getElementById('menuIcon');
    if (!sidebar || !overlay) return;
    sidebar.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (menuIcon) menuIcon.className = 'fi fi-rr-cross-small';
    etat.sidebarOuverte = true;
  }

  function fermerSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuIcon = document.getElementById('menuIcon');
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (menuIcon) menuIcon.className = 'fi fi-rr-menu-burger';
    etat.sidebarOuverte = false;
  }

  function basculerSidebar() {
    if (etat.sidebarOuverte) { fermerSidebar(); } else { ouvrirSidebar(); }
  }

  function initSidebar() {
    const menuBtn = document.getElementById('menuBtn');
    const overlay = document.getElementById('overlay');
    const sidebar = document.getElementById('sidebar');

    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => { e.stopPropagation(); basculerSidebar(); });
    }
    if (overlay) { overlay.addEventListener('click', fermerSidebar); }

    if (sidebar) {
      sidebar.querySelectorAll('a').forEach(lien => {
        lien.addEventListener('click', () => { if (window.innerWidth < 1024) fermerSidebar(); });
      });
    }

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && etat.sidebarOuverte) fermerSidebar(); });
    window.addEventListener('resize', () => { if (window.innerWidth >= 1024 && etat.sidebarOuverte) fermerSidebar(); });
  }

  /* ============================================================
     HEADER AU SCROLL
     ============================================================ */
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
     SMOOTH SCROLL
     ============================================================ */
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
     BOUTON RETOUR EN HAUT
     ============================================================ */
  function initBoutonHaut() {
    let bouton = document.getElementById('btnHaut');
    if (!bouton) {
      bouton = document.createElement('button');
      bouton.id = 'btnHaut';
      bouton.className = 'btn-haut';
      bouton.setAttribute('aria-label', 'Retour en haut');
      bouton.innerHTML = '<i class="fi fi-rr-angle-up"></i>';
      document.body.appendChild(bouton);
    }

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 400) {
        bouton.classList.add('is-visible');
      } else {
        bouton.classList.remove('is-visible');
      }
    }, { passive: true });

    bouton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     INJECTION UTILISATEUR
     ============================================================ */
  function injecterUtilisateur() {
    const session = Auth.sessionActuelle();
    if (!session) return;
    const initiales = UTILS.initiales(session.nom);

    document.querySelectorAll('[data-user-initiales]').forEach(el => { el.textContent = initiales; });
    document.querySelectorAll('[data-user-nom]').forEach(el => { el.textContent = session.nom; });
    document.querySelectorAll('[data-user-prenom]').forEach(el => { el.textContent = String(session.nom).split(' ')[0]; });
    document.querySelectorAll('[data-user-email]').forEach(el => { el.textContent = session.email; });
    document.querySelectorAll('[data-user-role]').forEach(el => { el.textContent = session.role; });
    document.querySelectorAll('[data-user-entreprise]').forEach(el => { el.textContent = session.entreprise || '—'; });
    
    if (session.avatar) {
      document.querySelectorAll('[data-user-avatar]').forEach(el => {
        el.innerHTML = '<img src="' + session.avatar + '" alt="Avatar">';
        el.style.background = 'transparent';
      });
    }
  }

  /* ============================================================
     COMPTEURS & VISIBILITÉ
     ============================================================ */
  function majCompteurs() {
    const notifsLues = STORAGE.get(CONFIG.cles.notifsLues, {});
    const notifsTotal = Object.keys(notifsLues).length;
    const messagesNonLus = STORAGE.get(CONFIG.cles.messagesNonLus, {});
    const messagesTotal = Object.values(messagesNonLus).reduce((acc, val) => acc + (Number(val) || 0), 0);

    document.querySelectorAll('[data-badge-notifs]').forEach(el => {
      if (notifsTotal > 0) { el.textContent = notifsTotal > 99 ? '99+' : notifsTotal; el.style.display = 'flex'; } else { el.style.display = 'none'; }
    });
    document.querySelectorAll('[data-badge-messages]').forEach(el => {
      if (messagesTotal > 0) { el.textContent = messagesTotal > 99 ? '99+' : messagesTotal; el.style.display = 'flex'; } else { el.style.display = 'none'; }
    });
  }

  /* ============================================================
     DÉCONNEXION (CORRIGÉE)
     ============================================================ */
  function initDeconnexion() {
    document.querySelectorAll('[data-action="deconnexion"]').forEach(btn => {
      btn.addEventListener('click', async (e) => { // ✅ Ajout de async
        e.preventDefault();
        
        // On utilise le widget de confirmation si disponible, sinon confirm() natif
        let confirmation = false;
        if (window.JosDore.Widgets && window.JosDore.Widgets.confirmer) {
          confirmation = await window.JosDore.Widgets.confirmer(
            'Voulez-vous vraiment vous déconnecter ?',
            { titre: 'Déconnexion', libelleConfirmer: 'Oui, me déconnecter', variante: 'rouge' }
          );
        } else {
          confirmation = confirm('Veux-tu vraiment te déconnecter ?');
        }

        if (confirmation) {
          // ✅ On attend (await) la fin de la déconnexion avant de continuer
          await Auth.deconnecter();
        }
      });
    });
  }

  function initVisibiliteHeader() {
    const estCo = Auth.estConnecte();
    document.querySelectorAll('[data-header="connecte"]').forEach(el => { el.style.display = estCo ? '' : 'none'; });
    document.querySelectorAll('[data-header="invite"]').forEach(el => { el.style.display = estCo ? 'none' : ''; });
  }

  function initRaccourcis() {
    document.addEventListener('keydown', (e) => {
      const dansInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement && document.activeElement.tagName);
      if (dansInput) return;
      if (e.key === '/') {
        const recherche = document.querySelector('.header__recherche input, [data-recherche]');
        if (recherche) { e.preventDefault(); recherche.focus(); }
      }
      if (e.key === 'Escape') { if (etat.sidebarOuverte) fermerSidebar(); }
    });
  }

  function initClicExterieur() {
    document.addEventListener('click', (e) => {
      if (!etat.sidebarOuverte) return;
      const sidebar = document.getElementById('sidebar');
      const menuBtn = document.getElementById('menuBtn');
      if (!sidebar) return;
      const dansSidebar = sidebar.contains(e.target);
      const surBouton = menuBtn && menuBtn.contains(e.target);
      if (!dansSidebar && !surBouton) fermerSidebar();
    });
  }

  /* ============================================================
     INITIALISATION
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.JosDore.Header = {
    ouvrirSidebar, fermerSidebar, basculerSidebar, majCompteurs, injecterUtilisateur,
    rafraichir() { injecterUtilisateur(); majCompteurs(); initVisibiliteHeader(); }
  };

})(window);