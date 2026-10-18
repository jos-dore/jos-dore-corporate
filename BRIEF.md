# 📋 BRIEF — Projet Jos Dore Corporate

> Document de référence pour toute IA ou développeur qui reprend le projet.
> Dernière mise à jour : 17 octobre 2026

---

## 👤 Propriétaire du projet

| Information | Valeur |
|---|---|
| **Nom** | Ulrich Hounkpe |
| **Rôle** | Fondateur & Technicien informatique |
| **Localisation** | 98RQ+HW Godomey, Abomey-Calavi, Bénin |
| **Email** | contact@josdore.com |
| **WhatsApp** | +229 01 53 21 62 76 |
| **Lien WhatsApp** | `https://wa.me/message/JWTG7DIGJR4XA1` |
| **Domaine** | josdore.com (déjà acheté) |
| **Niveau technique** | Débutant, apprend vite, utilise VS Code + Live Server |
| **Langue** | Français |

---

## 🎯 Vision du projet

Ulrich construit **un écosystème numérique complet** pour son entreprise **Jos Dore** (maintenance informatique & infogérance au Bénin).

Sa stratégie est progressive (land and expand) :

1. **Phase 1 — Site corporate & Boutique** (ACTUEL) : Présenter l'entreprise, vendre du matériel/logiciels (Boutique) et proposer des formations (Académie).
2. **Phase 2 — Espace client** (PROCHAIN) : Connexion Supabase, dashboard, suivi des commandes et factures.
3. **Phase 3 — App complète** (FUTUR) : Migration vers JosDore Réseau.

> **« Construire un peu, un peu. Le client s'inscrit, découvre les mises à jour de jour en jour, jusqu'à venir sur l'app. »**

---

## 🏢 Informations sur l'entreprise

| Information | Valeur |
|---|---|
| **Nom** | Jos Dore — Maintenance & Infogérance Informatique |
| **Slogan** | Votre partenaire informatique de proximité |
| **Activité** | Maintenance informatique sur site, infogérance, vente de matériel |
| **Cibles** | TPE/PME, professions libérales, écoles, particuliers |
| **Zone** | Cotonou, Abomey-Calavi, Bénin |

### L'écosystème Jos Dore
1. **Maintenance & Services** : Contrats préventifs, dépannage, sécurisation.
2. **Boutique** : Matériel, Logiciels, Livres, Ebooks, Accessoires (avec filtres et page produit).
3. **Académie** : Formations en ligne (initiation, bureautique, web).
4. **Outils gratuits** : Calculateurs, générateurs.
5. **Jeux & Quiz** : Pour apprendre en s'amusant.
6. **Blog & Conseils** : Guides pratiques, actualités tech.

---

## 🏗️ Architecture du site (Mise à jour)

```text
jos-dore-corporate/
├── index.html                    → Accueil (TERMINÉ)
├── contact.html                  → Contact + Carte Maps (TERMINÉ)
├── a-propos.html                 → Histoire + vision (TERMINÉ)
├── boutique.html                 → Catalogue avec filtres (TERMINÉ)
├── produit.html                  → Fiche produit + Galerie 10 photos (TERMINÉ)
├── academie.html                 → Formations en ligne (TERMINÉ)
├── outils.html                   → Outils gratuits (TERMINÉ)
├── jeux.html                     → Quiz interactifs (TERMINÉ)
├── 404.html                      → Page d'erreur (TERMINÉ)
├── service-maintenance.html      → (À faire)
├── service-formation.html        → (À faire)
├── vision.html                   → (À faire)
├── partenariat.html              → (À faire)
│
├── blog/                         → (À faire)
├── compte/                       → Connexion / Inscription (À faire)
├── espace-client/                → Dashboard client (À faire)
├── admin/                        → Back-office (À faire)
├── aide/                         → Centre d'aide (À faire)
├── legal/                        → CGU, Mentions (À faire)
│
└── ressources/
    ├── css/
    │   ├── variables.css         → ✅ Terminé
    │   ├── style.css             → ✅ Terminé
    │   ├── header.css            → ✅ Terminé
    │   ├── footer.css            → ✅ Terminé
    │   └── responsive.css        → ✅ Terminé
    │
    ├── js/
    │   ├── config.js             → ✅ Terminé (Supabase inclus)
    │   ├── auth.js               → ✅ Terminé (Connecté à Supabase)
    │   ├── roles.js              → ✅ Terminé
    │   ├── header.js             → ✅ Terminé
    │   ├── widgets.js            → ✅ Terminé
    │   └── scripts.js            → ✅ Terminé (PWA inclus)
    │
    └── images/
        ├── logo/                 → Logo + favicons
        ├── produits/             → (À remplir : photos des produits)
        └── og/                   → (À remplir : images réseaux sociaux)
🎨 Design system
Couleurs
Variable	Code	Usage
--or	#F59E0B	Couleur principale
--or-fonce	#D97706	Accents
--nuit	#0A2540	Fond hero, header
--bleu	#2563EB	Liens, accents
--vert	#16A34A	Succès, boutons WhatsApp
--rouge	#DC2626	Erreurs, admin
Polices
Titres : Poppins (400, 600, 700, 800, 900)

Texte : Inter (400, 500, 600, 700)

Icônes : Uicons Flaticon (via CDN)

Style
Mobile-first (menu Burger + Sidebar).

PWA installable (bannière d'installation en bas de l'écran).

Coins arrondis (8px à 20px), ombres douces.

✅ Ce qui est déjà fait (Mise à jour)
1. Fondations CSS/JS
Tous les fichiers CSS et JS sont codés, nettoyés et connectés.

Le fichier config.js contient toutes les clés Supabase et les bons liens sociaux.

Le fichier auth.js est prêt pour l'authentification via Supabase.

Le fichier scripts.js gère la bannière d'installation PWA.

Le menu mobile (Header/Sidebar) est entièrement fonctionnel sur toutes les pages.

2. Pages publiques terminées
index.html (Accueil avec l'écosystème mis en avant)

contact.html (Formulaire + intégration Google Maps avec l'adresse Godomey)

a-propos.html

boutique.html (Filtres : Matériel, Logiciel, Livre, Ebook, Accessoire)

produit.html (Gère l'affichage dynamique jusqu'à 10 photos par produit)

academie.html

outils.html

jeux.html

404.html

3. Configuration & Hébergement
Supabase : Projet créé, URL et clés intégrées.

GitHub : Dépôt initialisé et connecté.

Vercel : Hébergement configuré.

LWS : Nom de domaine josdore.com en cours de propagation DNS vers Vercel.

🔴 Ce qu'il reste à faire
PRIORITÉ 1 — Finir les pages publiques
service-maintenance.html

service-formation.html

vision.html

partenariat.html

blog/index.html + blog/article.html

aide/* et legal/*

PRIORITÉ 2 — Espace Client (Supabase)
compte/connexion.html

compte/inscription.html

espace-client/tableau-de-bord.html

Pages associées (mes commandes, mon profil, etc.)

PRIORITÉ 3 — Admin
admin/index.html (Dashboard)

Gestion des produits (Boutique)

Gestion des clients et des commandes.

PRIORITÉ 4 — Images et contenus
Ajouter les photos dans ressources/images/produits/ pour la boutique (jusqu'à 10 par produit).

Créer les images OG (1200×630) pour le partage sur les réseaux sociaux.

Remplir le catalogue de la boutique avec les vrais produits.

🤝 Méthode de collaboration
Préférences d'Ulrich
Langue : Français

Codes : Complets, jamais de fragments, jamais de « … ».

Rythme : Une page à la fois, on corrige le fichier entier.

Explications : Simples, pas trop techniques.

Environnement : VS Code + Live Server.

Dossier : C:\Users\HP\OneDrive\Desktop\jos-dore-corporate\

Règles absolues
❌ Ne JAMAIS utiliser l'ancien numéro : +2290128621407.

✅ Toujours utiliser le lien court : https://wa.me/message/JWTG7DIGJR4XA1.

✅ Toujours vérifier que le script Supabase est chargé en haut des pages HTML.

✅ Ne jamais mettre la mention "Fait avec ❤️ à Abomey-Calavi" dans le footer.

⚠️ Points de vigilance
Live Server obligatoire
Les chemins CSS sont absolus (/ressources/...). Il faut un serveur local (Live Server sur VS Code) pour que le site s'affiche correctement.

Base de données Supabase
Le projet Supabase est configuré. Il faudra créer les tables (profiles, produits, commandes) dans le tableau de bord Supabase pour que l'authentification et la boutique dynamique fonctionnent.

📅 Feuille de route synthétique
Période	Tâches
Fait	5 CSS, 6 JS, Index, Contact, À-propos, Boutique, Produit, Académie, Outils, Jeux, 404.
Semaine 1	Pages Services (Maintenance, Formation), Vision, Partenariat.
Semaine 2	Blog, Centre d'aide, Pages légales.
Semaine 3	Espace Client (Connexion, Inscription, Dashboard).
Semaine 4	Back-office Admin.
Semaine 5	Ajout des photos produits + Tests finaux.
📞 Contacts
Rôle	Contact
Propriétaire	Ulrich Hounkpe
Email	contact@josdore.com
WhatsApp	+229 01 53 21 62 76
📌 Message de passation
Cher assistant qui reprends :

Ulrich a déjà accompli un travail énorme. Les fondations CSS/JS sont posées, le site est sécurisé avec Supabase, et les pages principales (dont la Boutique et l'Académie) sont prêtes.

Ton rôle est de l'accompagner sur la création des pages restantes (Services, Blog, Espace Client, Admin), en livrant du code complet à chaque fois.

Respecte scrupuleusement le design system (or #F59E0B + bleu nuit #0A2540) et n'oublie jamais le menu mobile (Burger + Sidebar).

Objectif final : Avoir un site e-commerce et de services complet, en ligne sur josdore.com.

text

---

Ce nouveau brief est beaucoup plus précis. Il servira de feuille de route parfaite si tu ouvres une nouvelle discussion avec une IA. 

Dis-moi si tu veux qu'on continue sur une page spécifique en attendant !