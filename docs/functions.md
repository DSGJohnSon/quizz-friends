# Fonctions d'Affichage (Display System)

Ce document liste les fonctions contrôlables par l'hôte pour gérer les écrans d'affichage (`/game` et `/game-2`).

## Principes Généraux

- **Mode AUTO (Par défaut)** : Le système décide intelligemment où afficher le contenu.
- **Logique Toggle** : Si une commande affiche une vue déjà active sur la cible (automatique ou manuelle), elle est **désactivée** (retour à `EMPTY` / Défaut).
- **Persistance** : L'état est sauvegardé en base de données.

## Liste des Fonctions

### `showLobby` (Infos Connexion)

Affiche les informations de connexion (QR Code + Liste des Joueurs).

- **Comportement AUTO** :
  - **Toujours sur Display 1** (D1).
  - Écrase toute vue précédente sur D1.

### `showScoreboard`

Affiche le tableau des scores (Classement).

- **Comportement AUTO** :
  - **Cas 1 : Display 2 Disponible**
    - **Display 1** : Inchangé.
    - **Display 2** : Affiche le Scoreboard.
  - **Cas 2 : Display 2 Absent**
    - **Display 1** : Affiche le Scoreboard (remplace le contenu précédent).

## Typage TypeScript

Les types sont définis dans `domain/display/display.types.ts`.

```typescript
type DisplayActionType = "SHOW_LOBBY" | "SHOW_SCOREBOARD";
type DisplayTarget = "AUTO" | "DISPLAY_1" | "DISPLAY_2";
```
