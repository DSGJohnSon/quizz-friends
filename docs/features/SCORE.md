# Système de Score

Quiz Friends utilise un système de points centralisé et extensible. Ce document explique son fonctionnement et comment l'utiliser dans de futurs modules.

## 📊 Modèle de Données

Le système repose sur deux piliers dans la base de données :

1.  **`Player.totalScore` (Int)** : Un champ cache sur le modèle `Player` qui contient la somme actuelle des points. Utilisé pour les affichages rapides (Host, Player Dashboard).
2.  **`ScoreEntry` (Model)** : L'historique détaillé de chaque attribution de points.
    - `points` : Nombre de points (positif ou négatif).
    - `reason` : Texte expliquant l'attribution (ex: "Bonne réponse - Rapidité").
    - `createdAt` : Date de l'attribution.

## 🚀 Utilisation (Service)

Le service est situé dans `domain/score/score.service.ts`.

### Attribuer des points

Pour attribuer des points à un joueur, utilisez la fonction `awardPoints` :

```typescript
import { awardPoints } from "@/domain/score/score.service";

// Exemple : +10 points pour une bonne réponse
await awardPoints(playerId, 10, "Bonne réponse !");

// Exemple : -5 points de malus
await awardPoints(playerId, -5, "Mauvaise réponse !");
```

**Note technique** : Cette fonction utilise une transaction Prisma pour garantir l'atomicité entre la création de l'`ScoreEntry` et l'incrémentation de `totalScore`. Elle publie également un événement temps réel `player:score_updated`.

## 📡 Événements Temps Réel

L'événement `player:score_updated` contient :

- `playerId` : L'ID du joueur concerné.
- `points` : Les points attribués (delta).
- `reason` : La raison.
- `totalScore` : Le nouveau score total du joueur.

L'interface Host et l'interface Player écoutent cet événement pour mettre à jour l'affichage instantanément.

## 🏗️ Extensibilité (Futurs Modules)

Le système est conçu pour être "déclenché" par n'importe quel module :

- **Quiz Rapide** : Attribue des points à la fin de chaque question.
- **Vote** : Attribue des points selon les choix des autres joueurs.
- **Manuel (Host)** : Une interface dans la liste des joueurs permet à l'animateur de récompenser ou pénaliser un joueur arbitrairement.
  - Endpoint : `POST /api/players/[id]/score`
  - Payload : `{ points: number, reason: string }`

Chaque module est responsable du calcul de ses points, mais doit passer par `awardPoints` pour la persistance et l'affichage.
