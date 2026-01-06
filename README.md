# Quiz Friends

Application Next.js de quiz multi-écrans avec synchronisation temps réel via Supabase.

## 🎯 Version Cœur (v1)

Cette version se concentre sur la **gestion du cycle de vie des sessions** et l'inscription des joueurs. Les modules de jeu et questions seront ajoutés dans les versions futures.

### Fonctionnalités

- ✅ Création de sessions de jeu
- ✅ États de session : `DRAFT` → `PUBLISHED` → `OPEN` → `LOCKED` → `IN_PROGRESS` → `FINISHED`
- ✅ Inscription des joueurs avec QR code
- ✅ Gestion automatique des doublons de noms
- ✅ Synchronisation temps réel sur toutes les interfaces
- ✅ Trois interfaces distinctes : `/host`, `/game`, `/player`

## 🚀 Installation

### Prérequis

- Node.js 18+
- PostgreSQL (ou compte Supabase)
- Compte Supabase (pour Realtime)

### Étapes

1. **Cloner et installer les dépendances**

```bash
cd quizz-friends
npm install
```

2. **Configurer les variables d'environnement**

Copier `.env.example` vers `.env` et remplir les valeurs :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/quizz_friends"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. **Configurer Supabase**

- Créer un projet sur [supabase.com](https://supabase.com)
- Copier l'URL du projet et la clé anonyme
- **Important** : Activer Realtime dans les paramètres du projet

4. **Initialiser la base de données**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. **Lancer le serveur de développement**

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📱 Interfaces

### `/host` - Panneau d'administration

Interface pour l'animateur :

- Créer une nouvelle session
- Gérer les sessions existantes
- Voir la liste des joueurs en temps réel
- **Contrôler les scores manuellement** (ajout/retrait de points)
- Publier, verrouiller et lancer les sessions
- **Système de Score** :

  - Calcul automatique des points
  - Classement en temps réel
  - **Interface Host** : Contrôle manuel (bonus/malus)
  - Podium fin de partie

- **Gestion Multi-Écrans (v1.3.0)** :

  - Support **Display 1** (`/game`) & **Display 2** (`/game-2`)
  - **Routage Automatique** : Distribution intelligente (QR, Liste Joueurs, Scoreboard)
  - **Split View** : Affichage combiné si un seul écran
  - **Régie Complète** : Interface de contrôle, indicateurs de connexion, sélection de source.

- **Redesign Visuel & Expérience (NOUVEAU - v1.4.0)** :
  - **Refonte Display** : Interface TV modernisée, animations fluides.
  - **Refonte Host** : Panneau de contrôle épuré et plus intuitif.
  - **Refonte Player** : UI Mobile-first optimisée.

## 🛠️ Stack Technique

### `/game/[sessionId]` - Écran TV

Affichage principal pour les participants :

- QR code pour rejoindre la session
- Liste des joueurs connectés
- États du jeu (attente, verrouillé, en cours, terminé)
- Synchronisation temps réel

### `/player` - Interface joueur (mobile)

Interface pour les participants :

- Scanner le QR code ou saisir le code manuellement
- Entrer son nom
- Salle d'attente avec liste des joueurs
- Synchronisation temps réel

## 🧪 Tester une session complète

Voir le fichier [`docs/tests/v1.0.0-tests.md`](docs/tests/v1.0.0-tests.md) pour le guide de test détaillé.

## 📁 Structure du projet

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
│   └── player/               # Composants player
├── domain/                   # Services métier
│   ├── session/              # Gestion sessions
│   └── player/               # Gestion joueurs
├── hooks/                    # Hooks React personnalisés
├── lib/                      # Utilitaires
│   ├── prisma.ts             # Client Prisma
│   ├── supabase/             # Client et Realtime Supabase
│   └── utils/                # Fonctions utilitaires
└── prisma/                   # Schéma et migrations
```

## 🔧 Technologies

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Prisma v6** - ORM pour PostgreSQL
- **Supabase** - Realtime et base de données
- **Tailwind CSS** - Styling
- **QRCode** - Génération de QR codes
- **Zod** - Validation de schémas

## 🎨 Architecture

### Cycle de vie d'une session

```
DRAFT → PUBLISHED → OPEN → LOCKED → IN_PROGRESS → FINISHED
```

1. **DRAFT** : Session créée, non publiée
2. **PUBLISHED** : Session publiée (transition auto vers OPEN)
3. **OPEN** : Joueurs peuvent rejoindre
4. **LOCKED** : Inscriptions fermées
5. **IN_PROGRESS** : Jeu en cours
6. **FINISHED** : Jeu terminé

### Événements Realtime

- `session:updated` - État de session modifié
- `session:published` - Session publiée
- `session:locked` - Inscriptions fermées
- `session:started` - Jeu démarré
- `session:finished` - Jeu terminé
- `player:joined` - Nouveau joueur
- `player:left` - Joueur déconnecté

## 🚧 Roadmap v2

- [ ] Modules de jeu (Quiz, Rapid-fire, etc.)
- [ ] Système de questions et réponses
- [ ] Calcul des scores
- [ ] Classements et podiums
- [ ] Animations avancées
- [ ] Authentification Supabase
- [ ] Éditeur de questions graphique

Toute la documentation du projet est centralisée dans le dossier [`/docs`](docs/):

- **[Changelog](docs/changelog/)** : Historique des versions
- **[Tests](docs/tests/)** : Guides de test par version
- **[Features](docs/features/)** : Documentation des fonctionnalités (Score, Session, Reconnexion)
- **[Organisation](docs/ORGANIZATION.md)** : Guide d'organisation de la documentation

### Version Actuelle

**v1.4.0** - Affichée en bas à gauche de chaque écran

Pour mettre à jour la version, modifier `lib/version.ts`.

## 📝 License

MIT
