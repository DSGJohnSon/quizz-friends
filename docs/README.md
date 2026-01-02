# Documentation - Quiz Friends

Ce dossier contient toute la documentation du projet Quiz Friends.

## 📁 Structure

```
docs/
├── changelog/           # Historique des versions
│   └── v1.0.0.md       # Changelog version 1.0.0
├── tests/              # Guides de test par version
│   └── v1.0.0-tests.md # Tests pour la v1.0.0
├── PRISMA_V7_FIX.md    # Documentation migration Prisma
└── reconnection.md     # Documentation reconnexion joueurs
```

## 📚 Documents Principaux

### [reconnection.md](./reconnection.md)

Documentation complète de la fonctionnalité de reconnexion automatique des joueurs via localStorage.

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
