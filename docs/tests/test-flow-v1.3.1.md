# Protocole de Test Rapide - Version 1.3.1 (Specs Strictes)

## Prérequis

- Ouvrir 3 fenêtres de navigateur :
  - **F1 (Host)** : `/host` (Panneau de contrôle)
  - **F2 (Display 1)** : `/game/SESSION_ID` (ou `/game-2/...` selon config) - Sélectionner "DISPLAY_1"
  - **F3 (Display 2)** : `/game/SESSION_ID` - Sélectionner "DISPLAY_2"

## Scénario de Test

### 1. DRAFT

- [ ] **D1 & D2** : Titre "QuizzFriends", sous-titre "En attente du début de la partie...".
- [ ] **Host** : Bouton unique "Publier la session".

### 2. PUBLISHED (Action: Clic sur "Publier")

- [ ] **D1 & D2** : Titre "Quizz Friends", sous-titre "L'ouverture des inscriptions va bientôt avoir lieu...".
- [ ] **Host** : Bouton unique "Ouvrir les inscriptions".

### 3. OPEN (Action: Clic sur "Ouvrir")

- [ ] **D1** : QR Code (Gros plan) OU Split View si D2 absent.
- [ ] **D2** : Liste des joueurs.
- [ ] **Host** : Bouton unique "Fermer les inscriptions".

### 4. LOCKED (Action: Clic sur "Fermer")

- [ ] **D1** : Liste des joueurs.
- [ ] **D2** : Vide (Empty / En attente).
- [ ] **Host** : 2 boutons ("Lancer la partie", "Réouvrir les inscriptions").
  - _Test Loop_ : Cliquer "Réouvrir" -> Vérifier retour état OPEN (D1 QR) -> Cliquer "Fermer" -> Retour LOCKED.

### 5. IN_PROGRESS (Action: Clic sur "Lancer")

- [ ] **D1** : "Jeu en cours" (Animé).
- [ ] **D2** : Vide (par défaut).
- [ ] **Host** :
  - [ ] Panneau "Contrôle des Écrans" est apparu.
  - [ ] Action "Afficher Joueurs" -> Vérifier D2 affiche joueurs.
  - [ ] Action "Afficher Scoreboard" -> Vérifier D2 affiche scoreboard.
  - [ ] Bouton "Terminer la session".

### 6. FINISHED (Action: Clic sur "Terminer")

- [ ] **D1** : "Partie terminée" (+ Scoreboard si dispo).
- [ ] **D2** : Vide.
- [ ] **Host** : "Aucune action disponible".
