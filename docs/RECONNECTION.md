# Fonctionnalité de Reconnexion Automatique

## 🔄 Comment ça fonctionne

Lorsqu'un joueur ferme son onglet et revient, il est **automatiquement reconnecté** à sa session !

### Mécanisme

1. **Lors de la première connexion** :

   - Le joueur scanne le QR code ou entre le code de session
   - Il saisit son nom et rejoint
   - Ses informations sont **sauvegardées dans le localStorage** du navigateur :
     ```json
     {
       "playerId": "cmjx...",
       "sessionId": "cmjx...",
       "playerName": "Alice",
       "joinedAt": "2026-01-02T20:30:00Z"
     }
     ```

2. **Si le joueur ferme l'onglet et revient** :

   - Il scanne à nouveau le QR code (même URL)
   - L'application **détecte automatiquement** qu'il a déjà rejoint
   - Il est **redirigé instantanément** vers la salle d'attente
   - **Pas besoin de ressaisir son nom** !

3. **Pour quitter proprement** :
   - Le joueur clique sur "Quitter la session"
   - Le localStorage est nettoyé
   - Il retourne à la page d'accueil

## 📱 Scénarios d'Utilisation

### Scénario 1 : Fermeture accidentelle

1. Alice joue sur son téléphone
2. Elle ferme accidentellement l'onglet
3. Elle scanne à nouveau le QR code
4. ✅ Elle revient directement dans le jeu !

### Scénario 2 : Changement de navigateur

1. Bob joue sur Chrome
2. Il ouvre Safari
3. Il scanne le QR code
4. ❌ Il doit ressaisir son nom (localStorage différent par navigateur)
5. ⚠️ Il sera créé comme "Bob (1)" (doublon)

### Scénario 3 : Déconnexion volontaire

1. Charlie veut quitter
2. Il clique sur "Quitter la session"
3. ✅ Le localStorage est nettoyé
4. Il peut rejoindre une autre session

## 🔧 Détails Techniques

### Clé localStorage

```
player_[CODE_SESSION]
```

Exemple : `player_ABC123`

### Données sauvegardées

```typescript
{
  playerId: string; // ID unique du joueur
  sessionId: string; // ID de la session
  playerName: string; // Nom du joueur
  joinedAt: string; // Date de connexion (ISO)
}
```

### Nettoyage automatique

Le localStorage est nettoyé :

- ✅ Quand le joueur clique sur "Quitter"
- ❌ **PAS** automatiquement après la fin de la session (pour permettre de revenir voir les résultats)

## 🎯 Avantages

✅ **Expérience utilisateur fluide** : Pas de ressaisie du nom  
✅ **Résistant aux erreurs** : Fermeture accidentelle gérée  
✅ **Simple** : Aucune configuration nécessaire  
✅ **Persistant** : Fonctionne même après redémarrage du navigateur

## ⚠️ Limitations

- Le localStorage est **spécifique au navigateur**
- Si le joueur change de navigateur, il doit ressaisir son nom
- Le localStorage peut être effacé par l'utilisateur (paramètres du navigateur)
- Limite de ~5-10 MB par domaine (largement suffisant)

## 🧪 Test de la Fonctionnalité

1. **Rejoindre une session** :

   ```
   Scanner QR → Entrer "Alice" → Rejoindre
   ```

2. **Fermer l'onglet** :

   ```
   Fermer complètement l'onglet/navigateur
   ```

3. **Revenir** :

   ```
   Scanner à nouveau le QR code
   → Redirection automatique ! ✅
   ```

4. **Quitter proprement** :
   ```
   Cliquer "Quitter la session"
   → localStorage nettoyé
   → Retour à l'accueil
   ```

## 🚀 Améliorations Futures (v2)

- [ ] Synchroniser `isConnected` avec le statut réel du joueur
- [ ] Détecter les déconnexions réseau et reconnecter automatiquement
- [ ] Ajouter un timeout d'expiration (ex: 24h)
- [ ] Permettre de "reprendre" une session terminée pour voir les résultats
- [ ] Gérer plusieurs sessions simultanées par joueur
