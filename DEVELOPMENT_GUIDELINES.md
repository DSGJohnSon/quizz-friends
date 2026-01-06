# Guide de Développement - Quiz Friends

> **📌 Document de référence pour l'assistant IA**  
> Ce document doit être lu et suivi pour toute nouvelle tâche sur ce projet.

---

## 🌍 Langue de Communication

**TOUJOURS communiquer en FRANÇAIS** avec l'utilisateur.

---

## 📋 Workflow de Développement

### 1️⃣ Phase de Questions (OBLIGATOIRE)

**Avant toute chose**, poser TOUTES les questions nécessaires en chat direct :

- Clarifier les besoins exacts
- Comprendre les cas d'usage
- Identifier les contraintes techniques
- Valider les choix d'architecture

**Objectif** : Gagner du temps et de la clarté dès le départ.

### 2️⃣ Plan d'Implémentation (OBLIGATOIRE)

Créer un **plan d'implémentation détaillé** :

- Description du problème
- Changements proposés (par composant/fichier)
- Plan de vérification
- Points nécessitant validation utilisateur

**⚠️ ATTENDRE LA VALIDATION** de l'utilisateur avant de commencer l'implémentation.

### 3️⃣ Implémentation

Une fois le plan validé :

- Suivre le plan à la lettre
- Mettre à jour la liste de tâches au fur et à mesure
- Documenter les décisions importantes

### 4️⃣ Documentation Post-Implémentation (OBLIGATOIRE)

À la fin de chaque tâche/version, **TOUJOURS** :

#### ✅ Créer/Mettre à jour le Changelog

- Fichier : `docs/changelog/vX.X.X.md`
- Documenter TOUTES les modifications
- Suivre le format existant (voir `v1.0.0.md`)

#### ✅ Créer le Guide de Test

- Fichier : `docs/tests/vX.X.X-tests.md`
- Décrire les parcours de test
- Lister les points de vérification
- Inclure les cas limites

#### ✅ Mettre à jour le README Principal

- Ajouter les nouvelles fonctionnalités
- Mettre à jour la roadmap
- Corriger les liens si nécessaire

#### ✅ Mettre à jour la Version

- Fichier : `lib/version.ts`
- Incrémenter selon SemVer :
  - **MAJOR** (X.0.0) : Breaking changes
  - **MINOR** (1.X.0) : Nouvelles features
  - **PATCH** (1.0.X) : Bug fixes

#### ✅ Mettre à jour CE FICHIER

- Section "Structure du Projet" ci-dessous
- Section "Fonctionnalités Principales"
- Garder à jour pour les futures tâches

> **📌 NOTICE**  
> Le détails du fonctionnement dossier docs/ est disponible dans le fichier docs/README.md.

---

## 🏗️ Structure du Projet

### Architecture Globale

```
quizz-friends/
├── app/                      # Pages Next.js (App Router)
│   ├── api/                  # API Routes
│   │   └── sessions/         # Endpoints sessions
│   ├── host/                 # Interface animateur
│   ├── game/                 # Interface TV
│   └── player/               # Interface joueur
├── components/               # Composants React
│   ├── ui/                   # Composants UI de base
│   ├── host/                 # Composants host
│   ├── game/                 # Composants game
│   ├── player/               # Composants player
├── domain/                   # Services métier
│   ├── session/              # Gestion sessions
│   └── player/               # Gestion joueurs
├── hooks/                    # Hooks React personnalisés
├── lib/                      # Utilitaires
│   ├── prisma.ts             # Client Prisma
│   ├── version.ts            # Configuration version
│   ├── supabase/             # Client et Realtime
│   └── utils/                # Fonctions utilitaires
├── prisma/                   # Schéma et migrations
├── docs/                     # Documentation centralisée
│   ├── changelog/            # Historique versions
│   ├── tests/                # Guides de test
│   ├── features/             # Documentation des features
│   └── *.md                  # Docs techniques
└── README.md                 # Documentation principale
```

### Composants Clés

- **Domain Services** : Logique métier isolée et testable
- **API Routes** : Endpoints REST pour les mutations
- **Hooks** : `use-realtime-session.ts` pour la synchronisation
- **UI Components** : shadcn/ui style, réutilisables

---

## ✨ Fonctionnalités Principales

### Version 1.0.0 (Actuelle)

#### Gestion des Sessions

- ✅ Création de sessions (titre, description, nb joueurs)
- ✅ États : DRAFT → PUBLISHED → OPEN → LOCKED → IN_PROGRESS → FINISHED
- ✅ Codes uniques 6 caractères
- ✅ Publication et ouverture
- ✅ Verrouillage des inscriptions
- ✅ Lancement du jeu

#### Interface /host (Animateur)

- ✅ Liste des sessions
- ✅ Création de session
- ✅ Panneau de contrôle
- ✅ Liste joueurs temps réel
- ✅ Boutons d'action (publier, verrouiller, lancer)

#### Interface /game (TV)

- ✅ Génération QR code
- ✅ Affichage code session
- ✅ Liste joueurs connectés
- ✅ États visuels selon statut
- ✅ Design grand écran

#### Interface /player (Mobile)

- ✅ Formulaire connexion
- ✅ Salle d'attente
- ✅ Reconnexion automatique (localStorage)
- ✅ Bouton "Quitter"
- ✅ Design mobile-first

#### Reconnexion & Session (v1.1.0)

- ✅ Système de heartbeat (signal toutes les 5s)
- ✅ Détection automatique des déconnexions (10s)
- ✅ Overlay de blocage sur l'interface joueur
- ✅ Alertes Host (reconnexion/déconnexion)
- ✅ Expiration des sessions (24h)
- ✅ Page de résultats publique (`/sessions/[id]/results`)

#### Système de Score (v1.2.0)

- ✅ Modèle `ScoreEntry` et cache `totalScore`.
- ✅ Service `awardPoints` atomique.
- ✅ Affichage temps réel Host/Player.
- ✅ Page de résultats avec Podium (Top 3).
- ✅ **Contrôle manuel des scores** : Interface host pour ajout/retrait de points.
- ✅ Bouton "Terminer session" temporaire.

#### Système Multi-Écrans (v1.3.0)

- ✅ Support **Display 1** (`/game`) & **Display 2** (`/game-2`).
- ✅ **Routage Automatique** : Distribution intelligente des contenus (QR, Players, Scoreboard).
- ✅ **Split View** : Affichage combiné QR + Joueurs si display unique.
- ✅ **Régie Host** : Interface de contrôle avec indicateurs de statut (Heartbeat) et modale de sélection.
- ✅ Persistance totale de l'état des écrans.

#### Redesign Visuel & Expérience (v1.4.0)

- ✅ **Refonte Display** : Interface TV modernisée, animations fluides.
- ✅ **Refonte Host** : Panneau de contrôle épuré et plus intuitif.
- ✅ **Refonte Player** : UI Mobile-first optimisée (couleurs, espacements).
- ✅ **Harmonisation UI** : Cohérence graphique globale (typographie, composants cards).

#### Système de Versioning

- ✅ Affichage version (bas gauche)
- ✅ Configuration centralisée
- ✅ Documentation versionnée

### Roadmap v2 (À venir)

- [ ] Modules de jeu (Quiz, Rapid-fire)
- [ ] Système de questions et réponses
- [x] Système de scores (extensible & manuel)
- [x] Classements et podiums
- [x] Gestion Multi-Écrans (Displays)
- [x] Redesign Visuel (v1.4.0)
- [ ] Animations avancées
- [ ] Authentification Supabase
- [ ] Éditeur de questions

**⚠️ Mettre à jour cette section après chaque nouvelle feature !**

---

## 🎨 Bonnes Pratiques de Développement

### 1. UX/UI - Priorité ABSOLUE

**L'expérience utilisateur est CRITIQUE** :

- ✅ **Design moderne et attrayant** : Pas de MVP basique
- ✅ **Animations fluides** : Transitions, hover effects
- ✅ **Feedback visuel** : Loading states, confirmations
- ✅ **Responsive** : Mobile, tablet, desktop, TV
- ✅ **Accessibilité** : Couleurs contrastées, textes lisibles
- ✅ **Performance** : < 500ms pour les interactions

### 2. Code Quality

- ✅ **TypeScript strict** : Pas de `any`
- ✅ **Composants réutilisables** : DRY principle
- ✅ **Nommage clair** : Variables, fonctions, fichiers
- ✅ **Commentaires** : Expliquer le "pourquoi", pas le "quoi"
- ✅ **Error handling** : Try/catch, messages utilisateur

### 3. Architecture

- ✅ **Séparation des responsabilités** : Domain / API / UI
- ✅ **Services isolés** : Logique métier testable
- ✅ **Hooks personnalisés** : Réutilisation de la logique
- ✅ **Server Components** : Par défaut (Next.js)
- ✅ **Client Components** : Uniquement si nécessaire

### 4. Base de Données

- ✅ **Migrations versionnées** : Prisma migrate
- ✅ **Relations claires** : Foreign keys, cascades
- ✅ **Indexes** : Sur les champs recherchés
- ✅ **Validation** : Zod pour les schémas

### 5. Temps Réel

- ✅ **Événements typés** : Interfaces claires
- ✅ **Cleanup** : Unsubscribe lors du démontage
- ✅ **Optimistic updates** : UI réactive
- ✅ **Feedback Visuel** : L'état des boutons doit refléter l'état réel serveur (pas juste un 'toggle' local).
- ✅ **Fallback & Fiabilité** : TOUJOURS prévoir un polling (ex: 2-5s) en secours du Realtime pour les états critiques (Jeu, Affichage).

### 6. Documentation

- ✅ **README à jour** : Toujours synchronisé
- ✅ **Changelog détaillé** : Chaque version
- ✅ **Tests documentés** : Parcours complets
- ✅ **Code commenté** : Décisions importantes

---

## 🔧 Stack Technique

### Core

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**

### Base de Données

- **Prisma 5.22.0** (ORM)
- **PostgreSQL** (via Supabase)

### Temps Réel

- **Supabase Realtime**

### Styling

- **Tailwind CSS**
- **shadcn/ui** (composants de base)
- **Framer Motion** (Animations)

### Utilitaires

- **QRCode** (génération QR)
- **Zod** (validation)

---

## 📝 Checklist Avant Chaque Commit

- [ ] Code fonctionne localement
- [ ] Tests manuels effectués
- [ ] Documentation mise à jour
- [ ] Changelog créé/mis à jour
- [ ] Version incrémentée si nécessaire
- [ ] README synchronisé
- [ ] Ce fichier mis à jour (structure/features)
- [ ] Pas de console.log oubliés
- [ ] Pas de TODO non résolus critiques

---

## 🎯 Rappels Importants

### Communication

- 🇫🇷 **TOUJOURS en français**
- ❓ **Poser des questions AVANT** le plan
- 📋 **Plan d'implémentation OBLIGATOIRE**
- ✅ **Attendre validation** avant implémentation

### Documentation

- 📚 **Changelog** pour chaque version
- 🧪 **Tests** documentés
- 📖 **README** à jour
- 🔢 **Version** incrémentée

### Qualité

- 🎨 **UX prioritaire** : Design moderne
- 🧹 **Code propre** : TypeScript strict
- 🏗️ **Architecture** : Modulaire et testable
- ⚡ **Performance** : Rapide et fluide

---

## 📞 En Cas de Doute

**TOUJOURS** :

1. Poser des questions à l'utilisateur
2. Proposer plusieurs options
3. Expliquer les compromis
4. Attendre validation

**NE JAMAIS** :

1. Faire des suppositions
2. Implémenter sans plan validé
3. Oublier la documentation
4. Négliger l'UX

---

**Version de ce document** : 1.4.0
**Dernière mise à jour** : 2026-01-05
**Maintenir à jour après chaque tâche importante !**
