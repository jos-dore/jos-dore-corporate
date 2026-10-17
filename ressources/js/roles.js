/* ============================================================
   JOS DORE CORPORATE — RÔLES & PERMISSIONS
   ------------------------------------------------------------
   Gestion des rôles utilisateur et des permissions associées.
   À charger APRÈS config.js et auth.js.
   ------------------------------------------------------------
   Rôles disponibles :
   - client  : accède à son espace client (services, formations,
               factures, profil…)
   - admin   : accès complet au back-office Jos Dore
   ============================================================ */

(function (global) {
  'use strict';

  const { CONFIG, CONST, STORAGE, UTILS, LOG } = global.JosDore;
  const Auth = global.JosDore.Auth;

  /* ============================================================
     1. DÉFINITION DES RÔLES
     ============================================================ */
  const ROLES_DETAILS = {
    [CONST.ROLES.CLIENT]: {
      id: 'client',
      libelle: 'Client',
      description: 'Accède à son espace client, ses services, ses formations et ses factures.',
      couleur: 'bleu',
      icone: 'fi fi-rr-user',
      niveau: 1
    },
    [CONST.ROLES.ADMIN]: {
      id: 'admin',
      libelle: 'Administrateur',
      description: 'Accès complet au back-office et à toutes les actions Jos Dore.',
      couleur: 'rouge',
      icone: 'fi fi-rr-shield-check',
      niveau: 2
    }
  };

  /* ============================================================
     2. PERMISSIONS PAR RÔLE
     ------------------------------------------------------------
     Chaque rôle possède une liste d'actions autorisées.
     Format : 'domaine:action'
     ============================================================ */
  const PERMISSIONS = {
    /* ----- CLIENT ----- */
    [CONST.ROLES.CLIENT]: [
      // Profil
      'profil:lire',
      'profil:modifier-soi',

      // Services
      'service:voir',
      'service:demander',

      // Contrats
      'contrat:voir-soi',
      'contrat:demander',

      // Interventions
      'intervention:voir-soi',
      'intervention:demander',

      // Formations
      'formation:voir-soi',
      'formation:demander',

      // Factures
      'facture:voir-soi',
      'facture:payer',

      // Messages
      'message:envoyer',
      'message:recevoir',

      // Notifications & mises à jour
      'notification:recevoir',
      'mise-a-jour:voir',

      // Paramètres
      'parametres:gerer-soi'
    ],

    /* ----- ADMIN ----- */
    [CONST.ROLES.ADMIN]: [
      // Profil
      'profil:lire',
      'profil:modifier-soi',
      'profil:modifier-tous',
      'profil:supprimer',

      // Clients
      'client:voir',
      'client:creer',
      'client:modifier',
      'client:supprimer',

      // Services
      'service:voir',
      'service:creer',
      'service:modifier',
      'service:supprimer',

      // Contrats
      'contrat:voir-tous',
      'contrat:creer',
      'contrat:modifier',
      'contrat:resilier',

      // Interventions
      'intervention:voir-toutes',
      'intervention:creer',
      'intervention:modifier',
      'intervention:annuler',
      'intervention:terminer',

      // Formations
      'formation:voir-toutes',
      'formation:creer',
      'formation:modifier',
      'formation:annuler',

      // Articles (blog)
      'article:voir',
      'article:creer',
      'article:modifier',
      'article:publier',
      'article:supprimer',

      // Factures
      'facture:voir-toutes',
      'facture:creer',
      'facture:modifier',
      'facture:envoyer',
      'facture:annuler',

      // Messages
      'message:envoyer',
      'message:recevoir',
      'message:moderer',

      // Notifications
      'notification:recevoir',
      'notification:envoyer',

      // Mises à jour
      'mise-a-jour:voir',
      'mise-a-jour:creer',
      'mise-a-jour:modifier',

      // Admin & paramètres
      'parametres:voir',
      'parametres:modifier',

      // Stats & journal
      'stats:voir',
      'journal:lire'
    ]
  };

  /* ============================================================
     3. HELPER : PEUT FAIRE UNE ACTION
     ============================================================ */

  /**
   * Vérifie si l'utilisateur connecté a la permission demandée.
   * @param {string} permission - Format 'domaine:action' (ex: 'contrat:creer')
   * @returns {boolean}
   */
  function peutFaire(permission) {
    const role = Auth.roleCourant();
    if (!role) return false;

    const permissions = PERMISSIONS[role] || [];
    return permissions.includes(permission);
  }

  /**
   * Vérifie plusieurs permissions (toutes obligatoires).
   */
  function peutFaireTout(...permissions) {
    return permissions.every(p => peutFaire(p));
  }

  /**
   * Vérifie au moins une permission.
   */
  function peutFaireAuMoinsUne(...permissions) {
    return permissions.some(p => peutFaire(p));
  }

  /* ============================================================
     4. HELPERS DE RÔLE
     ============================================================ */
  function roleActuel() {
    return Auth.roleCourant();
  }

  function estConnecte() {
    return Auth.estConnecte();
  }

  function estClient() {
    return roleActuel() === CONST.ROLES.CLIENT;
  }

  function estAdmin() {
    return roleActuel() === CONST.ROLES.ADMIN;
  }

  /**
   * Retourne true si le rôle a un niveau >= au niveau demandé.
   */
  function aNiveauMinimum(niveau) {
    const role = roleActuel();
    if (!role || !ROLES_DETAILS[role]) return false;
    return ROLES_DETAILS[role].niveau >= niveau;
  }

  /**
   * Retourne les détails d'un rôle (libellé, couleur, icône…).
   */
  function detailsRole(role) {
    return ROLES_DETAILS[role] || null;
  }

  /**
   * Retourne tous les rôles disponibles.
   */
  function tousLesRoles() {
    return Object.values(ROLES_DETAILS);
  }

  /* ============================================================
     5. PAGE D'ACCUEIL SELON LE RÔLE
     ============================================================ */

  /**
   * Retourne la page d'accueil par défaut selon le rôle.
   * Utilisée après connexion.
   */
  function pageAccueil() {
    const role = roleActuel();

    if (role === CONST.ROLES.ADMIN) {
      return '/admin/index.html';
    }

    return '/espace-client/tableau-de-bord.html';
  }

  /**
   * Redirige vers la page d'accueil selon le rôle.
   */
  function redirigerVersAccueil() {
    const destination = pageAccueil();
    LOG.info('Redirection vers', destination);
    window.location.href = destination;
  }

  /* ============================================================
     6. MASQUAGE AUTOMATIQUE D'ÉLÉMENTS HTML
     ------------------------------------------------------------
     Utilise des attributs data-* dans le HTML pour conditionner
     l'affichage selon le rôle ou les permissions.
     ------------------------------------------------------------
     Exemples :
       <div data-role="admin">…</div>
       <button data-permission="contrat:creer">…</button>
       <div data-auth="connecte">…</div>
       <div data-auth="invite">…</div>
       <div data-niveau-min="2">…</div>
     ============================================================ */

  /**
   * Applique le masquage selon les attributs data-*.
   */
  function appliquerVisibilite() {
    // Éléments conditionnés par rôle
    document.querySelectorAll('[data-role]').forEach(el => {
      const roles = el.dataset.role.split(',').map(r => r.trim());
      if (!Auth.aRole(...roles)) {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.style.display = '';
        el.removeAttribute('aria-hidden');
      }
    });

    // Éléments conditionnés par permission
    document.querySelectorAll('[data-permission]').forEach(el => {
      const perms = el.dataset.permission.split(',').map(p => p.trim());
      const ok = perms.some(p => peutFaire(p));
      if (!ok) {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.style.display = '';
        el.removeAttribute('aria-hidden');
      }
    });

    // Éléments conditionnés par statut de connexion
    document.querySelectorAll('[data-auth]').forEach(el => {
      const statut = el.dataset.auth;
      const estCo = estConnecte();

      if (statut === 'connecte' && !estCo) {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
      } else if (statut === 'invite' && estCo) {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.style.display = '';
        el.removeAttribute('aria-hidden');
      }
    });

    // Éléments conditionnés par niveau minimum
    document.querySelectorAll('[data-niveau-min]').forEach(el => {
      const niveau = parseInt(el.dataset.niveauMin, 10);
      if (!aNiveauMinimum(niveau)) {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.style.display = '';
        el.removeAttribute('aria-hidden');
      }
    });
  }

  /* ============================================================
     7. BADGE DE RÔLE (injection dans le DOM)
     ------------------------------------------------------------
     Ajoute un petit badge coloré à côté du nom de l'utilisateur.
     ============================================================ */
  function injecterBadgeRole() {
    const role = roleActuel();
    if (!role) return;

    const details = ROLES_DETAILS[role];
    if (!details) return;

    document.querySelectorAll('[data-role-badge]').forEach(el => {
      el.innerHTML = `
        <span class="badge badge--${details.couleur}">
          <i class="${details.icone}"></i> ${details.libelle}
        </span>
      `;
    });
  }

  /* ============================================================
     8. APPLICATION AU CHARGEMENT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    appliquerVisibilite();
    injecterBadgeRole();
    LOG.info('Rôles & permissions prêts. Rôle actuel :', roleActuel());
  });

  /* ============================================================
     9. EXPOSITION GLOBALE
     ============================================================ */
  global.JosDore.Roles = {
    // Détails
    ROLES_DETAILS,
    PERMISSIONS,
    detailsRole,
    tousLesRoles,

    // Permissions
    peutFaire,
    peutFaireTout,
    peutFaireAuMoinsUne,

    // Rôles
    roleActuel,
    estConnecte,
    estClient,
    estAdmin,
    aNiveauMinimum,

    // Navigation
    pageAccueil,
    redirigerVersAccueil,

    // DOM
    appliquerVisibilite,
    injecterBadgeRole
  };

})(window);