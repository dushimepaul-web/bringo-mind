# Documentation du backend (copie de référence)

Copie, faite le 23/11/2026, des documents du dépôt backend `pascalniyo/biringomind-backend-ref` (branche `main`, contrat **2.11.0**). **Ne pas modifier ces fichiers à la main** : ils sont produits par le backend. Pour les mettre à jour, recopier les mêmes fichiers depuis le dépôt backend.

| Fichier | Contenu | Origine dans le backend |
|---|---|---|
| [`openapi.json`](openapi.json) | Contrat OpenAPI complet (schémas, champs, valeurs permises) | `docs/openapi.json` |
| [`CONVENTIONS.md`](CONVENTIONS.md) | Enveloppe, erreurs, jeton, droits, langue, pagination, idempotence, débit | `API/CONVENTIONS.md` |
| [`CATALOGUE.md`](CATALOGUE.md) | Tableau de toutes les API | `API/CATALOGUE.md` |
| [`NOTE_EQUIPE_MOBILE.md`](NOTE_EQUIPE_MOBILE.md) | Conventions partagées web / mobile, changements récents | `docs/NOTE_EQUIPE_MOBILE.md` |
| [`API_CHANGELOG.md`](API_CHANGELOG.md) | Historique des versions du contrat | `docs/API_CHANGELOG.md` |
| [`modules/`](modules/) | Une fiche détaillée par API, un fichier par module | `API/modules/*.md` |

Les fiches citent des fichiers du backend (`app/...`, `tests/...`) : ces liens ne fonctionnent pas dans ce dépôt, ils servent de repère dans le code backend.

**Point d'entrée pour le mobile :** [`API_BACKEND.md`](../../API_BACKEND.md) à la racine, qui classe les 227 routes utiles par écran.

**Adresse de l'API :** `https://app.bringomind.com/api/v1`. Le Swagger en ligne (`/docs`) est fermé au public : utiliser `openapi.json` ci-dessus. Pour une lecture confortable, l'ouvrir dans [editor.swagger.io](https://editor.swagger.io) (Fichier › Importer).
