# Context Application: Quiz Friends

## 1. Identité du Projet

**Quiz Friends** est une application de quiz multi-écrans moderne, conçue pour être animée en direct (type bar-quiz ou événementiel). Les joueurs rejoignent une session sur leur mobile et voient les résultats sur un écran commun (TV/Projecteur).

## 2. Architecture & Interfaces

L'application repose sur une synchronisation en temps réel entre trois interfaces distinctes :

- **`/host` (Animateur)** : Panneau de contrôle pour gérer les sessions, valider les étapes, et modérer les scores manuellement.
- **`/game/[sessionId]` (Écran de Jeu/TV)** : Affichage public montrant le QR Code pour rejoindre, la liste des joueurs, les questions (v2) et le podium.
- **`/player` (Mobile Joueur)** : Interface de réponse simple, permettant de rejoindre via un code ou QR code, avec gestion de la reconnexion automatique.

## 3. Stack Technique

- **Framework** : Next.js 15 (App Router).
- **Langage** : TypeScript (typage strict).
- **Base de Données** : PostgreSQL via **Prisma ORM**.
- **Temps Réel** : **Supabase Realtime** pour la diffusion instantanée des changements d'état et des scores.
- **Validation** : **Zod** pour les schémas de données et les formulaires.
- **Style** : **Tailwind CSS** avec des composants **shadcn/ui**.

## 4. Concepts Clés & Logique Métier

### Cycle de Vie d'une Session (Machine à états) :

`DRAFT` → `PUBLISHED` → `OPEN` (joueurs rejoignent) → `LOCKED` (inscriptions closes) → `IN_PROGRESS` (jeu en cours) → `FINISHED` (résultats/podium).

### Gestion des Joueurs & Reconnexion :

- Les joueurs sont identifiés par un ID unique stocké en local (`localStorage`).
- Un système de **heartbeat** (signal toutes les 5s) permet de détecter les déconnexions.
- En cas de déconnexion, un overlay bloque l'interface joueur jusqu'à ce que la connexion soit rétablie.

### Système de Score :

- Gestion atomique des points via `ScoreEntry`.
- Cache `totalScore` sur le modèle `Player` pour des performances optimales.
- L'animateur dispose d'un contrôle manuel pour ajouter/retirer des points en direct.

## 5. Structure du Code

- `app/` : Routes et pages Next.js.
- `domain/` : Services métier isolés (logique pure, ex: `session.service.ts`, `player.service.ts`).
- `components/` : Composants UI organisés par interface (host/game/player).
- `lib/` : Utilitaires techniques (prisma, supabase client, versioning).
- `docs/` : Documentation exhaustive (Changelog par version, guides de tests, spécifications de features).

## 6. État Actuel (v1.2.0)

La version actuelle gère parfaitement le cycle de vie des sessions, l'inscription des joueurs, la reconnexion et le système de points manuel. La roadmap prochaine (v2) inclut les modules de jeu interactifs (quiz, rapid-fire) et la gestion des questions.

## 7. Directives de Développement

- **Langue** : Communication et documentation en français.
- **Rigueur** : Chaque feature doit être planifiée, validée, testée manuellement et documentée dans le changelog.
- **UX/UI** : Priorité absolue à un design premium, fluide et wouwou (animations, feedback visuel).
