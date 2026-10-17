/* ============================================================
   JOS DORE CORPORATE — CONFIGURATION GLOBALE & SUPABASE
   ============================================================ */

(function (global) {
  'use strict';

  /* ============================================================
     1. CONFIGURATION GÉNÉRALE
     ============================================================ */
  const CONFIG = {
    nom: 'Jos Dore', 
    nomCourt: 'Jos Dore',
    nomComplet: 'Jos Dore — Maintenance & Infogérance Informatique',
    slogan: 'Votre partenaire informatique de proximité',
    description: 'Maintenance informatique et infogérance à Cotonou et Abomey-Calavi, Bénin.',
    version: '1.0.0', 
    annee: new Date().getFullYear(),

    urlSite: 'https://josdore.com', 
    urlEspaceClient: '/espace-client/',
    urlAdmin: '/admin/', 
    urlApi: '/api/',
    urlImages: '/ressources/images/', 
    urlDonnees: '/ressources/donnees/',

    env: 'dev', 
    debug: true,

    /* --- Contact (MIS À JOUR) --- */
    contact: {
      email: 'contact@josdore.com',
      whatsapp: '+2290153216276',
      whatsappLien: 'https://wa.me/message/JWTG7DIGJR4XA1',
      telephone: '+229 01 53 21 62 76',
      ville: 'Abomey-Calavi, Bénin',
      adresse: '98RQ+HW Godomey, Abomey-Calavi',
      mapsLien: 'https://www.google.com/maps/search/?api=1&query=98RQ%2BHW+Godomey'
    },

    /* --- Réseaux sociaux (MIS À JOUR) --- */
    sociaux: {
      facebook:        'https://www.facebook.com/share/19inMddugC/',
      facebookPerso:   'https://www.facebook.com/share/1D5bYsSz5n/',
      linkedin:        'https://www.linkedin.com/company/jos-dore/',
      linkedinPerso:   'https://www.linkedin.com/in/ulrich-jos-dore-hounkpe/',
      youtube:         'https://www.youtube.com/@Josdore',
      whatsappChaine:  'https://whatsapp.com/channel/0029VbDlvsH7IUYeKsw8p32Q',
      whatsappGroupe:  'https://chat.whatsapp.com/L16NYw18Uk84JuAcYQYTNx'
    },

    cles: {
      cookies: 'josdore_cookies_choix', session: 'josdore_session',
      profil: 'josdore_profil_perso', theme: 'josdore_theme',
      onboardingNom: 'josdore_onboarding_nom', onboardingTermine: 'josdore_onboarding_termine',
      notifsLues: 'josdore_notifs_lues', prefsNotifs: 'josdore_prefs_notifs',
      messagesNonLus: 'josdore_messages_non_lus', premiereVisite: 'josdore_premiere_visite',
      nbVisites: 'josdore_nb_visites', pwaRefusee: 'josdore_pwa_refusee'
    },

    pagination: { 
      articlesParPage: 9, clientsParPage: 20, interventionsParPage: 20, 
      facturesParPage: 20, formationsParPage: 12 
    },
    upload: { 
      photoMaxSize: 5 * 1024 * 1024, avatarMaxSize: 2 * 1024 * 1024, 
      typesAcceptes: ['image/png', 'image/jpeg', 'image/webp'], maxPhotosArticle: 4 
    }
  };

  /* ============================================================
     2. CONSTANTES MÉTIER
     ============================================================ */
  const CONST = {
    ROLES: { CLIENT: 'client', ADMIN: 'admin' },
    STATUTS_CONTRAT: { ACTIF: 'actif', EN_PAUSE: 'en-pause', RESILIE: 'resilie' },
    STATUTS_INTERVENTION: { PLANIFIEE: 'planifiee', EN_COURS: 'en-cours', TERMINEE: 'terminee', ANNULEE: 'annulee' },
    STATUTS_FACTURE: { BROUILLON: 'brouillon', ENVOYEE: 'envoyee', PAYEE: 'payee', EN_RETARD: 'en-retard', ANNULEE: 'annulee' },
    STATUTS_FORMATION: { PLANIFIEE: 'planifiee', EN_COURS: 'en-cours', TERMINEE: 'terminee', ANNULEE: 'annulee' },
    STATUTS_ARTICLE: { BROUILLON: 'brouillon', PUBLIE: 'publie', ARCHIVE: 'archive' },
    SERVICES: { MAINTENANCE: 'maintenance', FORMATION: 'formation', ARTICLES: 'articles' },
    FORMULES: { DEPANNAGE: 'depannage', CONTRAT_TPE_PME: 'contrat-tpe-pme', FORMATION: 'formation', DIAGNOSTIC: 'diagnostic' },
    CIBLES: [ 
      { id: 'tpe-pme', libelle: 'TPE & PME' }, 
      { id: 'professions-liberales', libelle: 'Cabinets & professions libérales' }, 
      { id: 'ecoles', libelle: 'Écoles & centres de formation' }, 
      { id: 'particuliers', libelle: 'Particuliers' } 
    ],
    VILLES: ['Abomey-Calavi', 'Cotonou', 'Porto-Novo', 'Parakou', 'Bohicon', 'Natitingou', 'Ouidah', 'Lokossa', 'Djougou', 'Kandi'],
    ZONES: ['Cotonou', 'Abomey-Calavi', 'Porto-Novo', 'Ouidah'],
    TYPES_NOTIF: { INTERVENTION: 'intervention', FACTURE: 'facture', FORMATION: 'formation', MESSAGE: 'message', SYSTEME: 'systeme' },
    MOYENS_PAIEMENT: { MTN: 'mtn', MOOV: 'moov', VISA: 'visa', MASTERCARD: 'mastercard', ESPECES: 'especes', VIREMENT: 'virement' },
    PRIORITES: { BASSE: 'basse', NORMALE: 'normale', HAUTE: 'haute', URGENTE: 'urgente' }
  };

  /* ============================================================
     3. WRAPPER LOCALSTORAGE
     ============================================================ */
  const STORAGE = {
    get(cle, defaut = null) { 
      try { 
        const brut = localStorage.getItem(cle); 
        if (brut === null) return defaut; 
        try { return JSON.parse(brut); } catch (e) { return brut; } 
      } catch (e) { return defaut; } 
    },
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
    remove(cle) { try { localStorage.removeItem(cle); } catch (e) {} },
    clearAll() { try { Object.values(CONFIG.cles).forEach(cle => localStorage.removeItem(cle)); } catch (e) {} },
    disponible() { 
      try { 
        const test = '__josdore_test__'; 
        localStorage.setItem(test, '1'); 
        localStorage.removeItem(test); 
        return true; 
      } catch (e) { return false; } 
    }
  };

  /* ============================================================
     4. UTILITAIRES
     ============================================================ */
  const UTILS = {
    formaterDate(date, format = 'court') { 
      const d = date instanceof Date ? date : new Date(date); 
      if (isNaN(d.getTime())) return '—'; 
      const options = { 
        court: { day: '2-digit', month: 'short', year: 'numeric' }, 
        long: { day: 'numeric', month: 'long', year: 'numeric' }, 
        complet: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } 
      }; 
      if (format === 'relatif') return this.dateRelative(d); 
      return d.toLocaleDateString('fr-FR', options[format] || options.court); 
    },
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
    heureActuelle() { 
      const d = new Date(); 
      return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); 
    },
    dateISO(date = new Date()) { 
      const d = date instanceof Date ? date : new Date(date); 
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); 
    },
    formaterMontant(montant, devise = 'FCFA') { 
      const n = Number(montant) || 0; 
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + devise; 
    },
    escapeHtml(txt) { 
      return String(txt == null ? '' : txt).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); 
    },
    slugifier(txt) { 
      return String(txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); 
    },
    initiales(nom) { 
      if (!nom) return '?'; 
      const parts = String(nom).trim().split(/\s+/); 
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase(); 
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase(); 
    },
    tronquer(txt, max = 100) { 
      if (!txt) return ''; 
      const s = String(txt); 
      return s.length <= max ? s : s.slice(0, max).trim() + '…'; 
    },
    normaliser(txt) { 
      return String(txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); 
    },
    idUnique(prefix = 'id') { 
      return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7); 
    },
    debounce(fn, delai = 250) { 
      let timer = null; 
      return function (...args) { 
        clearTimeout(timer); 
        timer = setTimeout(() => fn.apply(this, args), delai); 
      }; 
    },
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
      } catch (e) { return false; } 
    },
    validerEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim()); },
    validerTelephone(tel) { return /^[+\d][\d\s().-]{6,}$/.test(String(tel || '').trim()); },
    parametreURL(nom, defaut = null) { 
      return new URLSearchParams(window.location.search).get(nom) || defaut; 
    }
  };

  /* ============================================================
     5. LOGGER
     ============================================================ */
  const LOG = {
    info(...args) { if (CONFIG.debug) console.log('[JosDore]', ...args); },
    warn(...args) { if (CONFIG.debug) console.warn('[JosDore]', ...args); },
    error(...args) { console.error('[JosDore]', ...args); }
  };

  /* ============================================================
     6. INITIALISATION SUPABASE
     ============================================================ */
  // Remplace par tes vraies clés (Settings > API dans Supabase)
  const SUPABASE_URL = 'https://jfzoqnzqtlluluvrxaof.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_MQl60Ye1pHseu--Qq2qTSw_yF8iwtsL';

  // On vérifie que la librairie Supabase est bien chargée dans le HTML
  let supabaseClient = null;
  if (global.supabase) {
    supabaseClient = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.error('[JosDore] ERREUR : La librairie Supabase n\'est pas chargée. Vérifie ton HTML.');
  }

  /* ============================================================
     7. EXPOSITION GLOBALE
     ============================================================ */
  global.JosDore = { 
    CONFIG, 
    CONST, 
    STORAGE, 
    UTILS, 
    LOG,
    supabase: supabaseClient // On expose le client pour que auth.js puisse l'utiliser
  };

  LOG.info('Configuration chargée — v' + CONFIG.version);
  if (!STORAGE.disponible()) LOG.warn('localStorage indisponible.');
  if (CONFIG.debug) {
    console.log(
      '%c Jos Dore — Corporate ', 
      'background: linear-gradient(135deg, #0A2540, #F59E0B); color: #fff; padding: 6px 16px; border-radius: 8px; font-weight: 900; font-size: 12px;'
    );
  }

})(window);