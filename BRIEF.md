# 📋 BRIEF — Projet Jos Dore Corporate

> Document de référence pour toute IA ou développeur qui reprend le projet.
> Dernière mise à jour : 15 octobre 2026

---

## 👤 Propriétaire du projet

| Information | Valeur |
|---|---|
| **Nom** | Ulrich Hounkpe |
| **Rôle** | Fondateur & Technicien informatique |
| **Localisation** | Abomey-Calavi, Bénin |
| **Email** | contact@josdore.com |
| **WhatsApp** | +229 01 28 62 14 07 |
| **Domaine** | josdore.com (déjà acheté) |
| **Niveau technique** | Débutant, apprend vite, utilise VS Code + Live Server |
| **Langue** | Français |

---

## 🎯 Vision du projet

Ulrich veut construire **un site corporate professionnel** pour son entreprise **Jos Dore** (maintenance informatique & infogérance au Bénin).

Sa stratégie est progressive (land and expand) :

1. **Phase 1 — Site corporate** (MAINTENANT) : Présenter l'entreprise + 3 services
2. **Phase 2 — Espace client** (dans 1 mois) : Connexion, dashboard, suivi
3. **Phase 3 — App complète** (dans 3-6 mois) : Migration vers JosDore Réseau

> **« Construire un peu, un peu. Le client s'inscrit, découvre les mises à jour de jour en jour, jusqu'à venir sur l'app. »**

---

## 🏢 Informations sur l'entreprise

| Information | Valeur |
|---|---|
| **Nom** | Jos Dore — Maintenance & Infogérance Informatique |
| **Slogan** | Votre partenaire informatique de proximité |
| **Activité** | Maintenance informatique sur site, infogérance |
| **Cibles** | TPE/PME, professions libérales, écoles, particuliers |
| **Zone** | Cotonou, Abomey-Calavi, Bénin |
| **Statut juridique** | Entreprise Individuelle (à créer, RCCM + IFU à obtenir) |
| **Fiscalité** | 5% sur bénéfice (< 50 M FCFA de CA) |
| **Objectif rentabilité** | 12 mois |
| **Objectif CA** | 400 000 FCFA/mois récurrents (10 clients × 40 000 F) |

### 3 services proposés

1. **Maintenance informatique**
   - Contrats préventifs TPE/PME (40 000 F/mois)
   - Dépannage ponctuel particuliers
   - Gestion de parc informatique
   - Sécurisation (antivirus, sauvegardes)

2. **Formation initiation informatique**
   - Initiation à l'ordinateur
   - Word, Excel, PowerPoint
   - Navigation internet et email
   - Bonnes pratiques de sécurité

3. **Articles & conseils** (blog)
   - Guides pratiques
   - Conseils d'achat
   - Astuces de sécurité
   - Actualités tech au Bénin

### Offre de lancement

- **Diagnostic initial** : GRATUIT (produit d'appel)

---

## 🏗️ Architecture du site

### Arborescence
jos-dore-corporate/
├── index.html → Accueil (LIVRÉ)
├── services.html → Détail des 3 services
├── service-maintenance.html → Page maintenance
├── service-formation.html → Page formation
├── a-propos.html → Histoire + équipe
├── vision.html → Vision entreprise
├── partenariat.html → Partenaires
├── contact.html → Contact + devis
├── 404.html
├── robots.txt → LIVRÉ
├── sitemap.xml → LIVRÉ
├── manifest.webmanifest → LIVRÉ
├── service-worker.js
├── README.md → LIVRÉ
├── BRIEF.md → Ce document
├── .gitignore → LIVRÉ
│
├── blog/
│ ├── index.html → Liste des articles
│ └── article.html → Modèle d'article
│
├── compte/
│ ├── connexion.html
│ ├── inscription.html
│ └── mot-de-passe-oublie.html
│
├── espace-client/
│ ├── tableau-de-bord.html
│ ├── mes-services.html
│ ├── mes-formations.html
│ ├── mes-factures.html
│ ├── mises-a-jour.html
│ ├── mon-profil.html
│ └── parametres.html
│
├── admin/
│ ├── index.html
│ ├── clients.html
│ ├── client-detail.html
│ ├── contrats.html
│ ├── interventions.html
│ ├── intervention-detail.html
│ ├── formations.html
│ ├── articles.html
│ ├── article-editer.html
│ ├── factures.html
│ ├── messages.html
│ ├── notifications.html
│ └── parametres.html
│
├── aide/
│ ├── index.html
│ ├── faq.html
│ └── contact-support.html
│
├── legal/
│ ├── cgu.html
│ ├── confidentialite.html
│ └── mentions-legales.html
│
└── ressources/
├── css/
│ ├── variables.css → À remplir
│ ├── style.css → À remplir
│ ├── header.css → À remplir
│ ├── footer.css → À remplir
│ └── responsive.css → À remplir
│
├── js/
│ ├── config.js → À remplir
│ ├── auth.js → À remplir
│ ├── roles.js → À remplir
│ ├── header.js → À remplir
│ ├── widgets.js → À remplir
│ └── scripts.js → À remplir
│
├── donnees/
│ ├── services.json → []
│ ├── articles.json → []
│ ├── clients.json → []
│ ├── interventions.json → []
│ ├── formations.json → []
│ ├── factures.json → []
│ ├── contrats.json → []
│ └── messages.json → []
│
└── images/
├── logo/ → logo.png (existant)
├── og/ → À remplir
├── services/ → À remplir
├── formations/ → À remplir
├── blog/ → À remplir
└── clients/ → À remplir

text

---

## 🎨 Design system

### Couleurs

| Variable | Code | Usage |
|---|---|---|
| `--or` | `#F59E0B` | Couleur principale |
| `--or-fonce` | `#D97706` | Accents |
| `--nuit` | `#0A2540` | Fond hero |
| `--bleu` | `#2563EB` | Liens, accents |
| `--vert` | `#16A34A` | Succès |
| `--rouge` | `#DC2626` | Erreurs, admin |

### Polices

- **Titres** : Poppins (400, 600, 700, 800, 900)
- **Texte** : Inter (400, 500, 600, 700)

### Icônes

- **Uicons Flaticon** (via CDN)

### Style

- Mobile-first
- PWA installable
- Coins arrondis (8px à 20px)
- Ombres douces
- Boutons arrondis avec transitions

### Logo

- **Fichier** : `ressources/images/logo/logo.png`
- **Description** : « J » doré `#F59E0B` sur fond bleu nuit `#0A2540` avec un point doré
- **Taille** : 1254×1254 px

---

## ✅ Ce qui est déjà fait

### 1. Fichier `index.html` corporate

Page d'accueil complète avec :
- Header (logo + nav + 2 CTA)
- Hero (badge, h1, p, 2 CTA, 3 points forts)
- Carte visuelle des formules
- Section Services (3 cartes)
- Section Pour qui (4 cibles)
- Section Comment ça marche (3 étapes)
- Section Avantages (4 points)
- Aperçu du Blog (3 articles à venir)
- CTA final
- Footer complet
- Bouton WhatsApp flottant
- Cookies banner

**Code livré. Ulrich doit le coller dans `index.html`.**

### 2. Fichiers de configuration

- `robots.txt` ✅
- `sitemap.xml` ✅
- `manifest.webmanifest` ✅
- `README.md` ✅
- `.gitignore` ✅

### 3. Script PowerShell

Un script complet a été livré pour créer automatiquement toute l'arborescence (~82 fichiers).

### 4. Logo

Fichier `logo.png` déjà présent dans `ressources/images/logo/`.

---

## 🔴 Ce qu'il reste à faire

### PRIORITÉ 1 — Fondations CSS/JS

Dans cet ordre :

1. `ressources/css/variables.css` — Variables CSS globales
2. `ressources/css/style.css` — Composants réutilisables
3. `ressources/css/header.css` — Header + navigation
4. `ressources/css/footer.css` — Footer
5. `ressources/css/responsive.css` — Media queries
6. `ressources/js/config.js` — Configuration globale
7. `ressources/js/auth.js` — Authentification
8. `ressources/js/roles.js` — Rôles et permissions
9. `ressources/js/header.js` — Header dynamique
10. `ressources/js/widgets.js` — Toasts, modales, cookies
11. `ressources/js/scripts.js` — PWA, année dynamique

**Modèle à suivre :** reprendre exactement les fichiers CSS/JS de `josdore-platform/` et les adapter.

### PRIORITÉ 2 — Pages publiques

1. `services.html` — Les 3 services détaillés
2. `service-maintenance.html` — Page dédiée
3. `service-formation.html` — Page dédiée
4. `contact.html` — Formulaire de contact + devis
5. `a-propos.html` — Histoire + vision
6. `vision.html` — Vision entreprise
7. `partenariat.html` — Partenaires
8. `blog/index.html` — Liste articles
9. `blog/article.html` — Modèle article
10. `404.html`
11. `aide/*` — Centre d'aide
12. `legal/*` — Pages légales

### PRIORITÉ 3 — Espace client

1. `compte/connexion.html`
2. `compte/inscription.html`
3. `compte/mot-de-passe-oublie.html`
4. `espace-client/tableau-de-bord.html`
5. `espace-client/mes-services.html`
6. `espace-client/mes-formations.html`
7. `espace-client/mes-factures.html`
8. `espace-client/mises-a-jour.html`
9. `espace-client/mon-profil.html`
10. `espace-client/parametres.html`

### PRIORITÉ 4 — Admin

1. `admin/index.html`
2. `admin/clients.html`, `admin/client-detail.html`
3. `admin/contrats.html`
4. `admin/interventions.html`, `admin/intervention-detail.html`
5. `admin/formations.html`
6. `admin/articles.html`, `admin/article-editer.html`
7. `admin/factures.html`
8. `admin/messages.html`, `admin/notifications.html`
9. `admin/parametres.html`

### PRIORITÉ 5 — Images et icônes

1. Générer les 5 icônes via [favicon.io](https://favicon.io) :
   - `favicon.svg`
   - `favicon-180.png`
   - `icon-192.png`
   - `icon-512.png`
   - `favicon.ico`
2. Placer dans `ressources/images/logo/`
3. Créer les images OG (1200×630)

### PRIORITÉ 6 — Déploiement

1. Pousser sur GitHub
2. Déployer sur Vercel
3. Pointer `josdore.com`
4. Tester en ligne

### PRIORITÉ 7 — Backend

1. Créer un projet Supabase
2. Créer les tables
3. Brancher l'authentification
4. Brancher les données dynamiques

---

## 🤝 Méthode de collaboration

### Préférences d'Ulrich

- **Langue** : français
- **Codes** : complets, jamais de fragments, jamais de « … »
- **Rythme** : une étape à la fois, avec tests clairs
- **Explications** : simples, pas trop techniques
- **Environnement** : VS Code + Live Server
- **Dossier** : `C:\Users\HP\OneDrive\Desktop\jos-dore-corporate\`

### Ce qu'il faut faire

- ✅ Livrer des codes complets et testés
- ✅ Expliquer chaque étape
- ✅ Proposer des tests concrets
- ✅ Rester dans le design system (or + bleu nuit)
- ✅ Utiliser les mêmes conventions que JosDore Réseau
- ✅ Poser une question à la fois

### Ce qu'il faut éviter

- ❌ Fragments de code avec « … »
- ❌ Réponses trop longues ou trop techniques
- ❌ Casser l'architecture existante
- ❌ Dupliquer inutilement
- ❌ Sauter des étapes

---

## ⚠️ Points de vigilance

### Ne pas mélanger avec JosDore Réseau

Deux projets séparés :
- `josdore-platform/` → Marketplace de techniciens (déjà fait)
- `jos-dore-corporate/` → Site de l'entreprise Jos Dore

**Ils partagent le même design system mais sont indépendants.**

### Live Server obligatoire

Les chemins CSS sont absolus (`/ressources/...`). Il faut un serveur local.

### RCCM et IFU pas encore obtenus

Ulrich n'a pas encore ses numéros. Utiliser des placeholders dans le footer et les mentions légales.

### WhatsApp partout

Numéro : **+229 01 28 62 14 07**  
Lien : `https://wa.me/2290128621407`

---

## 🚀 Première étape recommandée

**Demander à Ulrich :**

> « Où en es-tu exactement ?
> - Est-ce que le dossier `jos-dore-corporate` a été créé ?
> - Est-ce que le script PowerShell a été exécuté ?
> - Est-ce que le fichier `index.html` corporate a été collé et testé ?
>
> En fonction de tes réponses, on avance étape par étape. »

**Puis, selon ses réponses :**

- S'il n'a pas créé le dossier → le guider dans PowerShell
- S'il n'a pas collé le `index.html` → lui redonner le code
- S'il a tout fait → attaquer les 5 CSS un par un

---

## 📅 Feuille de route synthétique

| Période | Tâches |
|---|---|
| **Semaine 1** | 5 CSS + 6 JS + test du index.html |
| **Semaine 2** | services.html + service-maintenance.html + service-formation.html |
| **Semaine 3** | contact.html + a-propos.html + vision.html + partenariat.html |
| **Semaine 4** | blog/ + aide/ + legal/ + 404.html |
| **Semaine 5** | compte/ + espace-client/ |
| **Semaine 6** | admin/ |
| **Semaine 7** | Icônes + OG + GitHub + Vercel + josdore.com |
| **Semaine 8+** | Backend Supabase + migrations |

---

## 🔗 Ressources utiles

| Besoin | Lien |
|---|---|
| Favicon gratuit | https://favicon.io |
| OG images | https://og-image.vercel.app |
| Hébergement | https://vercel.com |
| Backend | https://supabase.com |
| Paiement | https://kkiapay.me |
| Test performance | https://pagespeed.web.dev |

---

## 💰 Coûts prévus

| Poste | Coût |
|---|---|
| Domaine josdore.com | ~7 000 FCFA/an (déjà payé) |
| Vercel (hébergement) | 0 FCFA |
| Supabase (backend) | 0 FCFA |
| GitHub | 0 FCFA |
| Favicon + OG | 0 FCFA |
| **TOTAL pour lancer** | **0 FCFA** |

---

## 📞 Contacts

| Rôle | Contact |
|---|---|
| **Propriétaire** | Ulrich Hounkpe |
| **Email** | contact@josdore.com |
| **WhatsApp** | +229 01 28 62 14 07 |
| **Localisation** | Abomey-Calavi, Bénin |

---

## 📌 Message de passation

> **Cher assistant qui reprends :**
>
> Ulrich est un fondateur motivé, rigoureux, qui apprend vite. Il construit son entreprise de maintenance informatique au Bénin et veut créer un site corporate professionnel pour attirer ses premiers clients TPE/PME.
>
> Sa stratégie est progressive : commencer par un site vitrine, puis ajouter un espace client, puis migrer vers une app complète.
>
> Tu dois l'accompagner **étape par étape**, avec des **codes complets**, dans le **respect du design system** (or `#F59E0B` + bleu nuit `#0A2540`).
>
> Le plus dur reste à faire : construire les 5 CSS, les 6 JS, et toutes les pages HTML. Mais avec méthode et rigueur, c'est faisable en 6-8 semaines.
>
> **Ton objectif final :** que `josdore.com` soit en ligne avec un site corporate professionnel qui convertit les visiteurs en clients.
>
> **Bonne chance.**

---

*Fin du brief de passation.*

---

## 📌 Instructions pour Ulrich

**Copie ce document** dans un fichier `BRIEF.md` à la racine de ton dossier `jos-dore-corporate/`.

**Puis, à chaque nouvelle discussion** que tu ouvres avec une IA, tu peux :

1. Soit copier-coller le contenu de ce brief au début
2. Soit dire : « Lis le fichier BRIEF.md dans mon dossier, puis on continue »

**Ainsi, l'IA saura exactement où on en est et ce qu'il faut faire.**

---

## 🎯 Actions immédiates

1. **Crée le fichier `BRIEF.md`** dans `jos-dore-corporate/`
2. **Colle le contenu ci-dessus**
3. **Enregistre** (Ctrl+S)
4. **Ouvre une nouvelle discussion** avec une IA
5. **Envoie ce message** :
Bonjour,

Je suis Ulrich Hounkpe, fondateur de Jos Dore, une entreprise de
maintenance informatique au Bénin.

J'ai un fichier BRIEF.md dans mon dossier jos-dore-corporate/ qui
contient tout le contexte du projet. Peux-tu me demander de te le
partager, puis on continuera ensemble ?

Merci.

text

**L'IA lira le brief et saura exactement quoi faire.**

---

**Bonne chance Ulrich. Ton projet est solide. Continue comme ça.** 🚀