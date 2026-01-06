# Documentation - Quiz Friends

Ce dossier contient toute la documentation du projet Quiz Friends.

## 📁 Structure

```
docs/
├── changelog/           # Historique des versions
│   ├── v1.0.0.md
│   ├── v1.1.0.md
│   ├── v1.2.0.md
│   ├── v1.3.0.md
│   └── v1.4.0.md
├── tests/              # Guides de test par version
│   ├── v1.0.0-tests.md
│   ├── v1.1.0-tests.md
│   └── v1.2.0-tests.md
├── features/           # Documentation des fonctionnalités
│   ├── RECONNECTION.md
│   ├── SCORE.md
│   └── SESSION.md
└── PRISMA_V7_FIX.md    # Documentation technique
```

## 📚 Documents Principaux

### [features/](./features/)

Documentation détaillée des fonctionnalités cœur :

- **[Reconnexion](./features/RECONNECTION.md)** : Système de reconnexion auto.
- **[Sessions](./features/SESSION.md)** : Cycle de vie et transitions.
- **[Scores](./features/SCORE.md)** : Moteur de points et extensibilité.
- **[Displays](./features/DISPLAY.md)** : Gestion multi-écrans et routage auto.

## 📝 Changelog

Consultez [changelog/](./changelog/) pour l'historique complet des versions.

## 🧪 Tests

Les guides de test détaillés sont disponibles dans le dossier [tests/](./tests/).

## 🔄 Mise à Jour de la Documentation

Lors de l'ajout de nouvelles fonctionnalités :

1. **Mettre à jour le changelog** dans `changelog/vX.X.X.md`
2. **Créer/mettre à jour les tests** dans `tests/vX.X.X-tests.md`
3. **Documenter les nouvelles features** dans des fichiers dédiés
4. **Mettre à jour la version** dans `lib/version.ts`

## 📖 README Principal

Le README principal du projet se trouve à la racine : [../README.md](../README.md)
