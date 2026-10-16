/* ============================================================
   JOS DORE CORPORATE — AUTHENTIFICATION
   ------------------------------------------------------------
   Gestion des comptes, sessions, connexion, inscription,
   déconnexion, protection des pages.
   ------------------------------------------------------------
   ⚠️ IMPORTANT : cette version est une SIMULATION côté front.
   En production, la logique sera déplacée vers le backend
   (Supabase Auth, Firebase Auth, ou API custom).
   Les mots de passe ne doivent JAMAIS être stockés en clair.
   ============================================================ */

(function (global) {
  'use strict';

  const { CONFIG, CONST, STORAGE, UTILS, LOG } = global.JosDore;

  /* ============================================================
     1. GESTION DES UTILISATEURS (base locale simulée)
     ------------------------------------------------------------
     Structure :
     {
       id: 'u-xxx',
       nom: 'Koffi Adande',
       email: 'koffi@example.com',
       telephone: '+229...',
       motDePasse: 'hash_simulé',
       role: 'client' | 'admin',
       entreprise: 'SARL Exemple',
       ville: 'Abomey-Calavi',
       avatar: null,
       verifie: false,
       creeLe: '2026-10-15T10:00:00.000Z'
     }
     ============================================================ */

  const CLE_UTILISATEURS = 'josdore_utilisateurs';

  /**
   * Récupère tous les utilisateurs enregistrés
   */
  function chargerUtilisateurs() {
    return STORAGE.get(CLE_UTILISATEURS, []);
  }

  /**
   * Enregistre la liste des utilisateurs
   */
  function sauvegarderUtilisateurs(liste) {
    return STORAGE.set(CLE_UTILISATEURS, liste);
  }

  /**
   * Cherche un utilisateur par email
   */
  function trouverParEmail(email) {
    const liste = chargerUtilisateurs();
    const e = String(email || '').toLowerCase().trim();
    return liste.find(u => String(u.email).toLowerCase().trim() === e) || null;
  }

  /**
   * Cherche un utilisateur par ID
   */
  function trouverParId(id) {
    const liste = chargerUtilisateurs();
    return liste.find(u => u.id === id) || null;
  }

  /* ============================================================
     2. HACHAGE SIMULÉ (démo uniquement)
     ------------------------------------------------------------
     Ne remplace pas un vrai hash (bcrypt/argon2 côté serveur).
     Utilisé ici uniquement pour éviter de stocker en clair.
     ============================================================ */
  function hacher(motDePasse) {
    let hash = 0;
    const str = String(motDePasse || '');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'sim_' + Math.abs(hash).toString(36);
  }

  function verifierMotDePasse(motDePasse, hash) {
    return hacher(motDePasse) === hash;
  }

  /* ============================================================
     3. SESSION UTILISATEUR
     ============================================================ */

  /**
   * Enregistre la session (qui est connecté)
   */
  function demarrerSession(utilisateur) {
    const session = {
      id: utilisateur.id,
      email: utilisateur.email,
      nom: utilisateur.nom,
      role: utilisateur.role,
      entreprise: utilisateur.entreprise || null,
      avatar: utilisateur.avatar || null,
      connecteLe: new Date().toISOString()
    };
    STORAGE.set(CONFIG.cles.session, session);
    LOG.info('Session démarrée pour', utilisateur.email);
    return session;
  }

  /**
   * Retourne la session actuelle ou null
   */
  function sessionActuelle() {
    return STORAGE.get(CONFIG.cles.session, null);
  }

  /**
   * Vérifie si un utilisateur est connecté
   */
  function estConnecte() {
    return sessionActuelle() !== null;
  }

  /**
   * Retourne l'utilisateur connecté (objet complet)
   */
  function utilisateurCourant() {
    const session = sessionActuelle();
    if (!session) return null;
    return trouverParId(session.id);
  }

  /**
   * Retourne le rôle de l'utilisateur connecté
   */
  function roleCourant() {
    const session = sessionActuelle();
    return session ? session.role : null;
  }

  /**
   * Retourne true si l'utilisateur a un des rôles demandés
   */
  function aRole(...roles) {
    const role = roleCourant();
    return roles.includes(role);
  }

  /* ============================================================
     4. INSCRIPTION
     ============================================================ */

  /**
   * Crée un nouveau compte
   * @param {Object} donnees - { nom, email, telephone, motDePasse, entreprise?, role? }
   * @returns {Object} - { succes: boolean, erreur?: string, utilisateur?: Object }
   */
  function inscrire(donnees) {
    const { nom, email, telephone, motDePasse } = donnees;

    /* --- Validations --- */
    if (!nom || String(nom).trim().length < 2) {
      return { succes: false, erreur: 'Le nom doit contenir au moins 2 caractères.' };
    }
    if (!UTILS.validerEmail(email)) {
      return { succes: false, erreur: 'Adresse email invalide.' };
    }
    if (telephone && !UTILS.validerTelephone(telephone)) {
      return { succes: false, erreur: 'Numéro de téléphone invalide.' };
    }
    if (!motDePasse || String(motDePasse).length < 8) {
      return { succes: false, erreur: 'Le mot de passe doit contenir au moins 8 caractères.' };
    }

    /* --- Vérification doublon email --- */
    if (trouverParEmail(email)) {
      return { succes: false, erreur: 'Un compte existe déjà avec cet email.' };
    }

    /* --- Création --- */
    const utilisateur = {
      id: UTILS.idUnique('u'),
      nom: String(nom).trim(),
      email: String(email).toLowerCase().trim(),
      telephone: telephone ? String(telephone).trim() : null,
      motDePasse: hacher(motDePasse),
      role: donnees.role || CONST.ROLES.CLIENT,
      entreprise: donnees.entreprise || null,
      ville: donnees.ville || null,
      avatar: null,
      verifie: false,
      creeLe: new Date().toISOString()
    };

    const liste = chargerUtilisateurs();
    liste.push(utilisateur);
    sauvegarderUtilisateurs(liste);

    /* --- Session immédiate --- */
    demarrerSession(utilisateur);

    /* --- Onboarding en attente --- */
    STORAGE.set(CONFIG.cles.onboardingNom, utilisateur.nom);

    LOG.info('Inscription réussie :', utilisateur.email);
    return { succes: true, utilisateur };
  }

  /* ============================================================
     5. CONNEXION
     ============================================================ */

  /**
   * Connecte un utilisateur
   * @param {string} email
   * @param {string} motDePasse
   * @returns {Object} - { succes: boolean, erreur?: string, utilisateur?: Object }
   */
  function connecter(email, motDePasse) {
    if (!email || !motDePasse) {
      return { succes: false, erreur: 'Email et mot de passe requis.' };
    }

    const utilisateur = trouverParEmail(email);
    if (!utilisateur) {
      return { succes: false, erreur: 'Email ou mot de passe incorrect.' };
    }

    if (!verifierMotDePasse(motDePasse, utilisateur.motDePasse)) {
      return { succes: false, erreur: 'Email ou mot de passe incorrect.' };
    }

    demarrerSession(utilisateur);
    LOG.info('Connexion réussie :', utilisateur.email);
    return { succes: true, utilisateur };
  }

  /* ============================================================
     6. DÉCONNEXION
     ============================================================ */
  function deconnecter(rediriger = true) {
    STORAGE.remove(CONFIG.cles.session);
    LOG.info('Déconnexion');
    if (rediriger) {
      window.location.href = '/compte/connexion.html';
    }
  }

  /* ============================================================
     7. MISE À JOUR DU PROFIL
     ============================================================ */

  /**
   * Met à jour les informations de l'utilisateur connecté
   */
  function mettreAJourProfil(modifications) {
    const utilisateur = utilisateurCourant();
    if (!utilisateur) return { succes: false, erreur: 'Non connecté.' };

    const liste = chargerUtilisateurs();
    const index = liste.findIndex(u => u.id === utilisateur.id);
    if (index === -1) return { succes: false, erreur: 'Utilisateur introuvable.' };

    // Champs autorisés à la modification
    const champsAutorises = ['nom', 'telephone', 'entreprise', 'ville', 'avatar', 'bio'];
    champsAutorises.forEach(champ => {
      if (modifications[champ] !== undefined) {
        liste[index][champ] = modifications[champ];
      }
    });

    sauvegarderUtilisateurs(liste);

    // Met à jour la session si le nom, l'entreprise ou l'avatar a changé
    const session = sessionActuelle();
    if (session) {
      if (modifications.nom) session.nom = modifications.nom;
      if (modifications.entreprise !== undefined) session.entreprise = modifications.entreprise;
      if (modifications.avatar !== undefined) session.avatar = modifications.avatar;
      STORAGE.set(CONFIG.cles.session, session);
    }

    LOG.info('Profil mis à jour');
    return { succes: true, utilisateur: liste[index] };
  }

  /**
   * Change le mot de passe de l'utilisateur connecté
   */
  function changerMotDePasse(ancien, nouveau) {
    const utilisateur = utilisateurCourant();
    if (!utilisateur) return { succes: false, erreur: 'Non connecté.' };

    if (!verifierMotDePasse(ancien, utilisateur.motDePasse)) {
      return { succes: false, erreur: 'Mot de passe actuel incorrect.' };
    }
    if (!nouveau || String(nouveau).length < 8) {
      return { succes: false, erreur: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' };
    }

    const liste = chargerUtilisateurs();
    const index = liste.findIndex(u => u.id === utilisateur.id);
    if (index === -1) return { succes: false, erreur: 'Utilisateur introuvable.' };

    liste[index].motDePasse = hacher(nouveau);
    sauvegarderUtilisateurs(liste);

    LOG.info('Mot de passe modifié');
    return { succes: true };
  }

  /* ============================================================
     8. RÉCUPÉRATION DE MOT DE PASSE (simulée)
     ============================================================ */
  function demanderReinitialisation(email) {
    const utilisateur = trouverParEmail(email);
    if (!utilisateur) {
      // Pour la sécurité, on retourne toujours "succès"
      return { succes: true };
    }
    // En production : envoyer un email avec un lien signé
    LOG.info('Demande de réinitialisation pour', email);
    return { succes: true };
  }

  /* ============================================================
     9. PROTECTION DES PAGES
     ------------------------------------------------------------
     À appeler en haut de chaque page privée.
     ============================================================ */

  /**
   * Redirige vers connexion si l'utilisateur n'est pas connecté.
   * @param {Object} options - { redirection: '/compte/connexion.html', roles: ['admin'] }
   */
  function proteger(options = {}) {
    const redirection = options.redirection || '/compte/connexion.html';
    const rolesRequis = options.roles || null;

    // Pas connecté → redirige
    if (!estConnecte()) {
      LOG.warn('Accès refusé : non connecté. Redirection vers', redirection);
      const urlActuelle = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = redirection + '?redirect=' + urlActuelle;
      return false;
    }

    // Rôle non autorisé → redirige
    if (rolesRequis && !aRole(...rolesRequis)) {
      LOG.warn('Accès refusé : rôle insuffisant.');
      window.location.href = '/espace-client/tableau-de-bord.html';
      return false;
    }

    return true;
  }

  /**
   * Redirige vers l'espace client si l'utilisateur est déjà connecté.
   * À utiliser sur les pages connexion/inscription.
   */
  function redirigerSiConnecte(destination = '/espace-client/tableau-de-bord.html') {
    if (estConnecte()) {
      LOG.info('Déjà connecté, redirection vers', destination);
      window.location.href = destination;
      return true;
    }
    return false;
  }

  /* ============================================================
     10. UTILITAIRES DE SESSION
     ============================================================ */

  /**
   * Retourne les initiales de l'utilisateur connecté
   */
  function initialesCourant() {
    const session = sessionActuelle();
    if (!session || !session.nom) return '?';
    return UTILS.initiales(session.nom);
  }

  /**
   * Retourne le prénom de l'utilisateur connecté
   */
  function prenomCourant() {
    const session = sessionActuelle();
    if (!session || !session.nom) return 'visiteur';
    return String(session.nom).split(' ')[0];
  }

  /**
   * Met à jour les éléments du DOM qui affichent le nom/initiales
   * de l'utilisateur connecté.
   */
  function injecterDansDOM() {
    const session = sessionActuelle();
    if (!session) return;

    const initiales = UTILS.initiales(session.nom);

    document.querySelectorAll('[data-user-initiales]').forEach(el => {
      el.textContent = initiales;
    });

    document.querySelectorAll('[data-user-nom]').forEach(el => {
      el.textContent = session.nom;
    });

    document.querySelectorAll('[data-user-prenom]').forEach(el => {
      el.textContent = session.nom ? String(session.nom).split(' ')[0] : '';
    });

    document.querySelectorAll('[data-user-email]').forEach(el => {
      el.textContent = session.email;
    });

    document.querySelectorAll('[data-user-role]').forEach(el => {
      el.textContent = session.role;
    });

    document.querySelectorAll('[data-user-entreprise]').forEach(el => {
      el.textContent = session.entreprise || '—';
    });

    // Avatars avec image
    if (session.avatar) {
      document.querySelectorAll('[data-user-avatar]').forEach(el => {
        el.innerHTML = '<img src="' + session.avatar + '" alt="Avatar">';
      });
    }
  }

  /* ============================================================
     11. INITIALISATION
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    injecterDansDOM();
    LOG.info('Auth prêt. Connecté :', estConnecte());
  });

  /* ============================================================
     12. EXPOSITION GLOBALE
     ============================================================ */
  global.JosDore.Auth = {
    // Utilisateurs
    chargerUtilisateurs,
    trouverParEmail,
    trouverParId,

    // Session
    demarrerSession,
    sessionActuelle,
    estConnecte,
    utilisateurCourant,
    roleCourant,
    aRole,

    // Actions
    inscrire,
    connecter,
    deconnecter,
    mettreAJourProfil,
    changerMotDePasse,
    demanderReinitialisation,

    // Protection
    proteger,
    redirigerSiConnecte,

    // Utilitaires
    initialesCourant,
    prenomCourant,
    injecterDansDOM
  };

})(window);