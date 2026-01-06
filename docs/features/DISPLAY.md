# Gestion Multi-Écrans (Display System)

Le système de gestion multi-écrans permet de diffuser des contenus différents sur plusieurs appareils (`/game` et `/game-2`) tout en étant piloté depuis une interface unique (`/host`).

## Architecture

L'architecture repose sur 3 piliers :

1.  **Display State (DB)** : L'état de chaque écran est stocké dans le champ JSON `displayState` de la session.
2.  **Display Service (Domain)** : Logique métier qui décide quel contenu afficher sur quel écran (Routage AUTO).
3.  **Realtime (Supabase)** : Diffusion instantanée des changements d'état via l'événement `display:updated`.

### Types de Vues

- `LOBBY` : Vue combinée (QR Code + Liste des Joueurs).
- `SCOREBOARD` : Le classement des joueurs.
- `EMPTY` : Vue par défaut (suit le statut global de la session).

## Routage Automatique & Toggle

Le système utilise une logique de **"Toggle"** : Si une action est demandée alors qu'elle est déjà active sur l'écran cible, l'écran repasse en mode `EMPTY`.

| Action            | Display 2 Présent ? | Résultat D1    | Résultat D2    |
| :---------------- | :-----------------: | :------------- | :------------- |
| `SHOW_LOBBY`      |       Oui/Non       | **LOBBY**      | Inchangé       |
| `SHOW_SCOREBOARD` |       **Oui**       | Inchangé       | **SCOREBOARD** |
| `SHOW_SCOREBOARD` |       **Non**       | **SCOREBOARD** | -              |

_(Note : Si D1 affiche déjà LOBBY et qu'on demande SHOW_LOBBY -> D1 devient EMPTY)_

## Heartbeat & Détection

Chaque page de diffusion (`/game`, `/game-2`) envoie un "heartbeat" toutes les 5 secondes pour signaler sa présence.
L'interface Host utilise cette information (stockée dans le JSON `displayState`) pour afficher des indicateurs de statut (Vert/Rouge) et informer le service de la disponibilité du Display 2 lors des actions AUTO.

## API

- `POST /api/sessions/[id]/display` : Envoi d'une commande (Action).
- `GET /api/sessions/[id]/display` : Récupération de l'état actuel.
- `POST /api/sessions/[id]/display/heartbeat` : Signal de présence.
