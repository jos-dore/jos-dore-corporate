/* ============================================================
   JOS DORE CORPORATE — AUTHENTIFICATION (SUPABASE)
   ------------------------------------------------------------
   Gestion des comptes, sessions, connexion, inscription,
   déconnexion, protection des pages via Supabase.
   ============================================================ */

(function (global) {
  'use strict';

  const { CONFIG, CONST, STORAGE, UTILS, LOG } = global.JosDore;
  
  // ✅ FIX CRITIQUE : On récupère le client initialisé dans config.js
  const supabase = global.JosDore ? global.JosDore.supabase : null;

  /* ============================================================
     1. SESSION UTILISATEUR
     ============================================================ */

  function demarrerSession(utilisateur, profil = {}) {
    const session = {
      id: utilisateur.id,
      email: utilisateur.email,
      nom: profil.nom || utilisateur.user_metadata?.nom || 'Client',
      role: profil.role || 'client',
      entreprise: profil.entreprise || null,
      telephone: profil.telephone || null,
      ville: profil.ville || null,
      avatar: profil.avatar_url || null,
      bio: profil.bio || null,
      rccm: profil.rccm || null,
      ifu: profil.ifu || null,
      adresse_facturation: profil.adresse_facturation || null,
      connecteLe: new Date().toISOString()
    };
    STORAGE.set(CONFIG.cles.session, session);
    LOG.info('Session démarrée pour', session.email);
    return session;
  }

  function sessionActuelle() {
    return STORAGE.get(CONFIG.cles.session, null);
  }

  function estConnecte() {
    return sessionActuelle() !== null;
  }

  function utilisateurCourant() {
    return sessionActuelle();
  }

  function roleCourant() {
    const session = sessionActuelle();
    return session ? session.role : null;
  }

  function aRole(...roles) {
    const role = roleCourant();
    return roles.includes(role);
  }

  /* ============================================================
     2. INSCRIPTION
     ============================================================ */
  async function inscrire(donnees) {
    const { nom, email, telephone, motDePasse, entreprise } = donnees;

    if (!nom || String(nom).trim().length < 2) return { succes: false, erreur: 'Le nom doit contenir au moins 2 caractères.' };
    if (!UTILS.validerEmail(email)) return { succes: false, erreur: 'Adresse email invalide.' };
    if (!motDePasse || String(motDePasse).length < 8) return { succes: false, erreur: 'Le mot de passe doit contenir au moins 8 caractères.' };

    if (!supabase) return { succes: false, erreur: 'Erreur de configuration (Supabase non chargé).' };

    // 1. Création du compte dans Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: motDePasse,
      options: {
        data: { nom: nom, telephone: telephone, entreprise: entreprise }
      }
    });

    if (error) return { succes: false, erreur: error.message };

    // 2. Mise à jour du profil (créé automatiquement par le trigger SQL)
    if (data.user) {
      await supabase.from('profiles').update({
        telephone: telephone,
        entreprise: entreprise
      }).eq('id', data.user.id);

      // 3. Connexion immédiate
      return await connecter(email, motDePasse);
    }

    return { succes: false, erreur: 'Erreur inconnue lors de l\'inscription.' };
  }

  /* ============================================================
     3. CONNEXION
     ============================================================ */
  async function connecter(email, motDePasse) {
    if (!email || !motDePasse) return { succes: false, erreur: 'Email et mot de passe requis.' };
    if (!supabase) return { succes: false, erreur: 'Erreur de configuration (Supabase non chargé).' };

    // 1. Connexion
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: motDePasse,
    });

    if (error) return { succes: false, erreur: 'Email ou mot de passe incorrect.' };

    // 2. Récupération du profil complet depuis la table
    const { data: profil, error: profilError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profilError) {
      console.warn('[Auth] Impossible de charger le profil complet :', profilError.message);
    }

    // 3. Démarrage de la session locale
    demarrerSession(data.user, profil || {});

    LOG.info('Connexion réussie :', data.user.email);
    return { succes: true, utilisateur: data.user };
  }

  /* ============================================================
     4. DÉCONNEXION (CORRIGÉE POUR ÊTRE INFÂILLIBLE)
     ============================================================ */
  async function deconnecter(rediriger = true) {
    try {
      // On tente de déconnecter de Supabase
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.warn("Erreur lors de la déconnexion Supabase (on continue quand même) :", error);
    } finally {
      // ✅ QUOI QU'IL ARRIVE, on nettoie le stockage local
      STORAGE.remove(CONFIG.cles.session);
      LOG.info('Déconnexion locale effectuée');
      
      if (rediriger) {
        // ⚠️ ATTENTION AU CHEMIN POUR LIVE SERVER :
        // Si ton fichier est dans un dossier "compte", garde "/compte/connexion.html"
        // Si ton fichier est à la racine du projet, utilise "/connexion.html"
        window.location.href = '/compte/connexion.html';
      }
    }
  }

  /* ============================================================
     5. MISE À JOUR DU PROFIL
     ============================================================ */
  async function mettreAJourProfil(modifications) {
    const session = sessionActuelle();
    if (!session) return { succes: false, erreur: 'Non connecté.' };
    if (!supabase) return { succes: false, erreur: 'Erreur de configuration (Supabase non chargé).' };

    // Préparation des données pour Supabase
    const updateData = {};
    if (modifications.nom) updateData.nom = modifications.nom;
    if (modifications.telephone) updateData.telephone = modifications.telephone;
    if (modifications.entreprise) updateData.entreprise = modifications.entreprise;
    if (modifications.ville) updateData.ville = modifications.ville;
    if (modifications.avatar) updateData.avatar_url = modifications.avatar;
    if (modifications.bio) updateData.bio = modifications.bio;
    if (modifications.rccm) updateData.rccm = modifications.rccm;
    if (modifications.ifu) updateData.ifu = modifications.ifu;
    if (modifications.adresse_facturation) updateData.adresse_facturation = modifications.adresse_facturation;

    // Mise à jour dans Supabase
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', session.id);

    if (error) return { succes: false, erreur: error.message };

    // Mise à jour de la session locale pour refléter les changements immédiatement
    Object.assign(session, modifications);
    if (modifications.avatar) session.avatar = modifications.avatar;
    
    STORAGE.set(CONFIG.cles.session, session);

    return { succes: true };
  }

  async function changerMotDePasse(ancien, nouveau) {
    if (!nouveau || String(nouveau).length < 8) {
      return { succes: false, erreur: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' };
    }
    if (!supabase) return { succes: false, erreur: 'Erreur de configuration (Supabase non chargé).' };

    const { error } = await supabase.auth.updateUser({ password: nouveau });
    
    if (error) return { succes: false, erreur: error.message };
    return { succes: true };
  }

  /* ============================================================
     6. RÉCUPÉRATION DE MOT DE PASSE
     ============================================================ */
  async function demanderReinitialisation(email) {
    if (!supabase) return { succes: false, erreur: 'Erreur de configuration.' };

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/compte/connexion.html',
    });

    if (error) return { succes: false, erreur: error.message };
    return { succes: true };
  }

  /* ============================================================
     7. PROTECTION DES PAGES
     ============================================================ */
  function proteger(options = {}) {
    const redirection = options.redirection || '/compte/connexion.html';
    const rolesRequis = options.roles || null;

    if (!estConnecte()) {
      const urlActuelle = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = redirection + '?redirect=' + urlActuelle;
      return false;
    }

    // Si la page exige un rôle (ex: admin) et que l'utilisateur ne l'a pas
    if (rolesRequis && !aRole(...rolesRequis)) {
      window.location.href = '/espace-client/tableau-de-bord.html';
      return false;
    }

    return true;
  }

  function redirigerSiConnecte(destination = '/espace-client/tableau-de-bord.html') {
    if (estConnecte()) {
      window.location.href = destination;
      return true;
    }
    return false;
  }

  /* ============================================================
     8. UTILITAIRES DE SESSION & DOM
     ============================================================ */
  function initialesCourant() {
    const session = sessionActuelle();
    if (!session || !session.nom) return '?';
    return UTILS.initiales(session.nom);
  }

  function prenomCourant() {
    const session = sessionActuelle();
    if (!session || !session.nom) return 'visiteur';
    return String(session.nom).split(' ')[0];
  }

  function injecterDansDOM() {
    const session = sessionActuelle();
    if (!session) return;

    const initiales = UTILS.initiales(session.nom);

    document.querySelectorAll('[data-user-initiales]').forEach(el => el.textContent = initiales);
    document.querySelectorAll('[data-user-nom]').forEach(el => el.textContent = session.nom);
    document.querySelectorAll('[data-user-prenom]').forEach(el => el.textContent = String(session.nom).split(' ')[0]);
    document.querySelectorAll('[data-user-email]').forEach(el => el.textContent = session.email);
    document.querySelectorAll('[data-user-role]').forEach(el => el.textContent = session.role);
    document.querySelectorAll('[data-user-entreprise]').forEach(el => el.textContent = session.entreprise || '—');

    if (session.avatar) {
      document.querySelectorAll('[data-user-avatar]').forEach(el => {
        el.innerHTML = '<img src="' + session.avatar + '" alt="Avatar">';
      });
    }
  }

  /* ============================================================
     9. INITIALISATION
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    injecterDansDOM();
    LOG.info('Auth Supabase prêt. Connecté :', estConnecte());
  });

  /* ============================================================
     10. EXPOSITION GLOBALE
     ============================================================ */
  global.JosDore.Auth = {
    sessionActuelle,
    estConnecte,
    utilisateurCourant,
    roleCourant,
    aRole,
    inscrire,
    connecter,
    deconnecter,
    mettreAJourProfil,
    changerMotDePasse,
    demanderReinitialisation,
    proteger,
    redirigerSiConnecte,
    initialesCourant,
    prenomCourant,
    injecterDansDOM
  };

})(window);