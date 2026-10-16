/* ============================================================
   JOS DORE CORPORATE — CONFIGURATION GLOBALE
   ------------------------------------------------------------
   À charger EN PREMIER dans toutes les pages HTML.
   Expose l'objet global `JosDore` avec :
   - CONFIG   : configuration générale
   - CONST    : constantes (rôles, statuts, villes…)
   - STORAGE  : wrapper localStorage
   - UTILS    : helpers (dates, montants, textes)
   ============================================================ */

(function (global) {
  'use strict';

  /* ============================================================
     1. CONFIGURATION GÉNÉRALE
     ============================================================ */
  const CONFIG = {
    /* --- Identité --- */
    nom: 'Jos Dore',
    nomCourt: 'Jos Dore',
    nomComplet: 'Jos Dore — Maintenance & Infogérance Informatique',
    slogan: 'Votre partenaire informatique de proximité',
    description: 'Maintenance informatique et infogérance à Cotonou et Abomey-Calavi, Bénin.',
    version: '1.0.0',
    annee: new Date().getFullYear(),

    /* --- URLs --- */
    urlSite: 'https://josdore.com',
    urlEspaceClient: '/espace-client/',
    urlAdmin: '/admin/',
    urlApi: '/api/',           // à remplacer plus tard par Supabase/backend
    urlImages: '/ressources/images/',
    urlDonnees: '/ressources/donnees/',

    /* --- Environnement --- */
    env: 'dev',                // 'dev' | 'prod'
    debug: true,

    /* --- Contact --- */
    contact: {
      email: 'contact@josdore.com',
      whatsapp: '+2290128621407',
      telephone: '+229 01 28 62 14 07',
      ville: 'Abomey-Calavi, Bénin',
      adresse: 'Abomey-Calavi, Bénin'
    },

    /* --- Réseaux sociaux --- */
    sociaux: {
      facebook: 'https://facebook.com/josdore',
      instagram: 'https://instagram.com/josdore',
      tiktok: 'https://tiktok.com/@josdore',
      linkedin: 'https://linkedin.com/company/josdore',
      youtube: 'https://youtube.com/@josdore'
    },

    /* --- Clés de stockage local --- */
    cles: {
      cookies: 'josdore_cookies_choix',
      session: 'josdore_session',
      profil: 'josdore_profil_perso',
      theme: 'josdore_theme',
      onboardingNom: 'josdore_onboarding_nom',
      onboardingTermine: 'josdore_onboarding_termine',
      notifsLues: 'josdore_notifs_lues',
      prefsNotifs: 'josdore_prefs_notifs',
      messagesNonLus: 'josdore_messages_non_lus',
      premiereVisite: 'josdore_premiere_visite',
      nbVisites: 'josdore_nb_visites',
      pwaRefusee: 'josdore_pwa_refusee'
    },

    /* --- Pagination --- */
    pagination: {
      articlesParPage: 9,
      clientsParPage: 20,
      interventionsParPage: 20,
      facturesParPage: 20,
      formationsParPage: 12
    },

    /* --- Upload --- */
    upload: {
      photoMaxSize: 5 * 1024 * 1024,   // 5 Mo
      avatarMaxSize: 2 * 1024 * 1024,  // 2 Mo
      typesAcceptes: ['image/png', 'image/jpeg', 'image/webp'],
      maxPhotosArticle: 4
    }
  };

  /* ============================================================
     2. CONSTANTES MÉTIER
     ============================================================ */
  const CONST = {
    /* --- Rôles utilisateur --- */
    ROLES: {
      CLIENT: 'client',
      ADMIN: 'admin'
    },

    /* --- Statuts de contrat --- */
    STATUTS_CONTRAT: {
      ACTIF: 'actif',
      EN_PAUSE: 'en-pause',
      RESILIE: 'resilie'
    },

    /* --- Statuts d'intervention --- */
    STATUTS_INTERVENTION: {
      PLANIFIEE: 'planifiee',
      EN_COURS: 'en-cours',
      TERMINEE: 'terminee',
      ANNULEE: 'annulee'
    },

    /* --- Statuts de facture --- */
    STATUTS_FACTURE: {
      BROUILLON: 'brouillon',
      ENVOYEE: 'envoyee',
      PAYEE: 'payee',
      EN_RETARD: 'en-retard',
      ANNULEE: 'annulee'
    },

    /* --- Statuts de formation --- */
    STATUTS_FORMATION: {
      PLANIFIEE: 'planifiee',
      EN_COURS: 'en-cours',
      TERMINEE: 'terminee',
      ANNULEE: 'annulee'
    },

    /* --- Statuts d'article --- */
    STATUTS_ARTICLE: {
      BROUILLON: 'brouillon',
      PUBLIE: 'publie',
      ARCHIVE: 'archive'
    },

    /* --- Services proposés --- */
    SERVICES: {
      MAINTENANCE: 'maintenance',
      FORMATION: 'formation',
      ARTICLES: 'articles'
    },

    /* --- Formules --- */
    FORMULES: {
      DEPANNAGE: 'depannage',
      CONTRAT_TPE_PME: 'contrat-tpe-pme',
      FORMATION: 'formation',
      DIAGNOSTIC: 'diagnostic'
    },

    /* --- Cibles --- */
    CIBLES: [
      { id: 'tpe-pme',              libelle: 'TPE & PME' },
      { id: 'professions-liberales', libelle: 'Cabinets & professions libérales' },
      { id: 'ecoles',               libelle: 'Écoles & centres de formation' },
      { id: 'particuliers',         libelle: 'Particuliers' }
    ],

    /* --- Villes du Bénin --- */
    VILLES: [
      'Abomey-Calavi',
      'Cotonou',
      'Porto-Novo',
      'Parakou',
      'Bohicon',
      'Natitingou',
      'Ouidah',
      'Lokossa',
      'Djougou',
      'Kandi'
    ],

    /* --- Zones d'intervention --- */
    ZONES: [
      'Cotonou',
      'Abomey-Calavi',
      'Porto-Novo',
      'Ouidah'
    ],

    /* --- Types de notification --- */
    TYPES_NOTIF: {
      INTERVENTION: 'intervention',
      FACTURE: 'facture',
      FORMATION: 'formation',
      MESSAGE: 'message',
      SYSTEME: 'systeme'
    },

    /* --- Moyens de paiement --- */
    MOYENS_PAIEMENT: {
      MTN: 'mtn',
      MOOV: 'moov',
      VISA: 'visa',
      MASTERCARD: 'mastercard',
      ESPECES: 'especes',
      VIREMENT: 'virement'
    },

    /* --- Niveaux de priorité --- */
    PRIORITES: {
      BASSE: 'basse',
      NORMALE: 'normale',
      HAUTE: 'haute',
      URGENTE: 'urgente'
    }
  };

  /* ============================================================
     3. WRAPPER LOCALSTORAGE SÉCURISÉ
     ------------------------------------------------------------
     Évite les erreurs si localStorage est désactivé (mode privé).
     ============================================================ */
  const STORAGE = {
    /**
     * Récupère une valeur (parsée en JSON si possible)
     * @param {string} cle
     * @param {*} defaut - Valeur par défaut si absent
     * @returns {*}
     */
    get(cle, defaut = null) {
      try {
        const brut = localStorage.getItem(cle);
        if (brut === null) return defaut;
        try {
          return JSON.parse(brut);
        } catch (e) {
          return brut;
        }
      } catch (e) {
        return defaut;
      }
    },

    /**
     * Enregistre une valeur (stringifiée en JSON)
     * @param {string} cle
     * @param {*} valeur
     * @returns {boolean} - true si succès
     */
    set(cle, valeur) {
      try {
        const str = typeof valeur === 'string' ? valeur : JSON.stringify(valeur);
        localStorage.setItem(cle, str);
        return true;
      } catch (e) {
        if (CONFIG.debug) console.warn('[JosDore.Storage] Erreur set :', e);
        return false;
      }
    },

    /**
     * Supprime une clé
     * @param {string} cle
     */
    remove(cle) {
      try { localStorage.removeItem(cle); } catch (e) {}
    },

    /**
     * Vide tout le stockage JosDore (pas les autres)
     */
    clearAll() {
      try {
        Object.values(CONFIG.cles).forEach(cle => {
          localStorage.removeItem(cle);
        });
      } catch (e) {}
    },

    /**
     * Vérifie si localStorage est disponible
     * @returns {boolean}
     */
    disponible() {
      try {
        const test = '__josdore_test__';
        localStorage.setItem(test, '1');
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  /* ============================================================
     4. UTILITAIRES
     ============================================================ */
  const UTILS = {

    /* ---------- DATES ---------- */

    /**
     * Formate une date en français
     * @param {Date|string|number} date
     * @param {string} format - 'court' | 'long' | 'complet' | 'relatif'
     */
    formaterDate(date, format = 'court') {
      const d = date instanceof Date ? date : new Date(date);
      if (isNaN(d.getTime())) return '—';

      const options = {
        court:   { day: '2-digit', month: 'short', year: 'numeric' },
        long:    { day: 'numeric', month: 'long', year: 'numeric' },
        complet: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
      };

      if (format === 'relatif') return this.dateRelative(d);

      return d.toLocaleDateString('fr-FR', options[format] || options.court);
    },

    /**
     * Retourne une date relative ("il y a 5 min", "hier"…)
     */
    dateRelative(date) {
      const d = date instanceof Date ? date : new Date(date);
      const maintenant = new Date();
      const diffMs = maintenant - d;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHeure = Math.floor(diffMin / 60);
      const diffJour = Math.floor(diffHeure / 24);

      if (diffSec < 60) return 'à l\'instant';
      if (diffMin < 60) return 'il y a ' + diffMin + ' min';
      if (diffHeure < 24) return 'il y a ' + diffHeure + 'h';
      if (diffJour === 1) return 'hier';
      if (diffJour < 7) return 'il y a ' + diffJour + ' jours';
      if (diffJour < 30) return 'il y a ' + Math.floor(diffJour / 7) + ' sem.';
      return this.formaterDate(d, 'court');
    },

    /**
     * Heure actuelle format HH:MM
     */
    heureActuelle() {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      return h + ':' + m;
    },

    /**
     * Date ISO (YYYY-MM-DD)
     */
    dateISO(date = new Date()) {
      const d = date instanceof Date ? date : new Date(date);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const j = String(d.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + j;
    },

    /* ---------- MONTANTS ---------- */

    /**
     * Formate un montant avec séparateurs de milliers
     * @param {number} montant
     * @param {string} devise - 'FCFA' par défaut
     */
    formaterMontant(montant, devise = 'FCFA') {
      const n = Number(montant) || 0;
      const str = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return str + ' ' + devise;
    },

    /* ---------- TEXTES ---------- */

    /**
     * Échappe le HTML pour éviter les injections XSS
     */
    escapeHtml(txt) {
      return String(txt == null ? '' : txt)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    },

    /**
     * Génère un slug depuis un texte
     */
    slugifier(txt) {
      return String(txt || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    },

    /**
     * Retourne les initiales d'un nom complet
     */
    initiales(nom) {
      if (!nom) return '?';
      const parts = String(nom).trim().split(/\s+/);
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    },

    /**
     * Tronque un texte
     */
    tronquer(txt, max = 100) {
      if (!txt) return '';
      const s = String(txt);
      return s.length <= max ? s : s.slice(0, max).trim() + '…';
    },

    /**
     * Normalise pour la recherche (sans accents, lowercase)
     */
    normaliser(txt) {
      return String(txt || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    },

    /* ---------- DIVERS ---------- */

    /**
     * Génère un ID unique
     */
    idUnique(prefix = 'id') {
      return prefix + '-' + Date.now().toString(36) + '-' +
             Math.random().toString(36).slice(2, 7);
    },

    /**
     * Debounce : limite la fréquence d'appel d'une fonction
     */
    debounce(fn, delai = 250) {
      let timer = null;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delai);
      };
    },

    /**
     * Copie dans le presse-papier
     */
    async copier(texte) {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(texte);
          return true;
        }
        const ta = document.createElement('textarea');
        ta.value = texte;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return true;
      } catch (e) {
        return false;
      }
    },

    /**
     * Valide une adresse email
     */
    validerEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
    },

    /**
     * Valide un numéro de téléphone (format Afrique de l'Ouest)
     */
    validerTelephone(tel) {
      return /^[+\d][\d\s().-]{6,}$/.test(String(tel || '').trim());
    },

    /**
     * Lit un paramètre de l'URL
     */
    parametreURL(nom, defaut = null) {
      const params = new URLSearchParams(window.location.search);
      return params.get(nom) || defaut;
    }
  };

  /* ============================================================
     5. LOGGER (console conditionnelle)
     ============================================================ */
  const LOG = {
    info(...args) {
      if (CONFIG.debug) console.log('[JosDore]', ...args);
    },
    warn(...args) {
      if (CONFIG.debug) console.warn('[JosDore]', ...args);
    },
    error(...args) {
      console.error('[JosDore]', ...args);
    }
  };

  /* ============================================================
     6. EXPOSITION GLOBALE
     ============================================================ */
  global.JosDore = {
    CONFIG,
    CONST,
    STORAGE,
    UTILS,
    LOG
  };

  /* ============================================================
     7. INITIALISATION
     ============================================================ */
  LOG.info('Configuration chargée — v' + CONFIG.version);

  if (!STORAGE.disponible()) {
    LOG.warn('localStorage indisponible (mode privé ?). Certaines fonctions seront limitées.');
  }

  // Affiche un bandeau dans la console
  if (CONFIG.debug) {
    console.log(
      '%c Jos Dore — Corporate ',
      'background: linear-gradient(135deg, #0A2540, #F59E0B); color: #fff; padding: 6px 16px; border-radius: 8px; font-weight: 900; font-size: 12px;'
    );
  }

})(window);