# Gestion des Sessions

Ce document décrit le cycle de vie d'une session de jeu dans Quiz Friends et les fonctions associées.

## 🔄 Cycle de Vie (États)

La session suit une machine à états linéaire gérée par le `SessionStatus` dans Prisma :

1.  **DRAFT** : La session est créée mais pas encore visible.
2.  **PUBLISHED** : La session est publiée, un code de 6 caractères est généré.
3.  **OPEN** : La session est ouverte, les joueurs peuvent rejoindre via le code. (Transition automatique après PUBLISHED).
4.  **LOCKED** : Les inscriptions sont fermées. Plus aucun nouveau joueur ne peut rejoindre.
5.  **IN_PROGRESS** : Le jeu a commencé. Les modules de jeu sont actifs.
6.  **FINISHED** : Le jeu est terminé. Les joueurs sont redirigés vers la page des résultats.

## 🛠️ Fonctions (Service)

Toutes les fonctions sont situées dans `domain/session/session.service.ts`.

- `createSession(data)` : Initialise une session en état `DRAFT`.
- `publishSession(id)` : Passe à `PUBLISHED` puis `OPEN`.
- `lockSession(id)` : Verrouille les inscriptions.
- `startSession(id)` : Lance le jeu (`IN_PROGRESS`).
- `finishSession(id)` : Termine la session (`FINISHED`) et enregistre `finishedAt`.
- `getSession(id)` : Récupère les détails complets avec joueurs et modules.
- `checkPlayersConnectivity(id)` : Fonction interne pour mettre à jour le statut `isConnected` des joueurs. Un joueur est considéré déconnecté s'il n'a pas envoyé de heartbeat depuis plus de 7 secondes.

## 📡 Événements Temps Réel

Chaque changement d'état publie un événement via Supabase Realtime :

- `session:published`
- `session:updated` (pour OPEN)
- `session:locked`
- `session:started`
- `session:finished`
