<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Localisation

Dossier du code : [app/modules/localization/](../../app/modules/localization/) · lettre ou numéro de la spécification : **-** · priorité **1** · documentation générée le 19/11/2026 17:30.

**2 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 0 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 2 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Devises**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-LOC-001](#api-loc-001--conversion-de-devises) | GET | `/api/v1/localization/convert` | Conversion de devises | Terminée, en attente de configuration | oui |

**Traduction**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-LOC-002](#api-loc-002--traduction-dun-texte) | POST | `/api/v1/localization/translate` | Traduction d'un texte | Terminée, en attente de configuration | oui |

## Sous-module : Devises

### API-LOC-001 — Conversion de devises

| Élément | Valeur |
|---|---|
| Module | Localisation (`app/modules/localization`, spéc. -) |
| Sous-module | Devises |
| Méthode | `GET` |
| Chemin | `/api/v1/localization/convert` |
| Fonction | `convert` — [app/modules/localization/router.py:43](../../app/modules/localization/router.py#L43) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 1 test(s) (test_integrations) |
| Utilisée par l'interface web | oui (`src/modules/life_inbox/api.js`) |

**Description** (commentaire et docstring du code). Conversion d'un montant d'une devise vers une autre Conversion indicative (taux de reference BCE) ; `to` vaut par défaut la devise de l'utilisateur

**État détaillé.**

- Dépendance non configurée (É-29) : Taux de change Frankfurter (fournisseur « frankfurter » désactivé) : réponse 503.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `amount` | requête | number | oui | min. 0 | — |
| `from` | requête | string | oui | motif `^[A-Za-z]{3}$` | — |
| `to` | requête | string (ou null) | non | motif `^[A-Za-z]{3}$` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : from : [f'Devise non prise en charge : {base}']
- Contrôle dans le code (422) : to : [f'Devise non prise en charge : {quote}']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `localization.service.convert` ([app/modules/localization/service.py:71](../../app/modules/localization/service.py#L71))
  - Taux, puis montant converti arrondi a 2 decimales

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet ConversionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `amount` | number | oui | — | — |
| `from` | string | oui | — | — |
| `to` | string | oui | — | — |
| `rate` | number | oui | — | — |
| `converted` | number | oui | — | — |
| `rate_date` | string (date) | oui | — | — |
| `is_latest` | boolean | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides; « from : [f'Devise non prise en charge : {base}'] »; « to : [f'Devise non prise en charge : {quote}'] » | non |
| `503` | Service indisponible ou non configuré | « Service de taux de change indisponible » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Traduction

### API-LOC-002 — Traduction d'un texte

| Élément | Valeur |
|---|---|
| Module | Localisation (`app/modules/localization`, spéc. -) |
| Sous-module | Traduction |
| Méthode | `POST` |
| Chemin | `/api/v1/localization/translate` |
| Fonction | `translate` — [app/modules/localization/router.py:52](../../app/modules/localization/router.py#L52) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 4 test(s) (test_integrations, test_module_10_integrations) |
| Utilisée par l'interface web | oui (`src/modules/life_inbox/api.js`) |

**Description** (commentaire et docstring du code). Traduction d'un texte (DeepL)

**État détaillé.**

- Dépendance non configurée (É-29) : DeepL (DEEPL_API_KEY vide) : réponse 503 « Service de traduction non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `integrations.service.require`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `TranslateIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `text` | string | oui | longueur min. 1 ; longueur max. 20000 | — |
| `target` | string | oui | motif `^[a-z]{2}$` | — |
| `source` | string (ou null) | non | motif `^[a-z]{2}$` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : target : ['Langue cible non prise en charge']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `localization.service.translate` ([app/modules/localization/service.py:78](../../app/modules/localization/service.py#L78))
  - Traduction indisponible sans cle DeepL
  - Code de langue DeepL de la langue cible
  - Corps de la requete : texte, langue cible et langue source eventuelle
  - Catalogue des fournisseurs : service desactive ou plafond atteint (503), sinon mesure des caracteres envoyes
  - Requete : appel de l'API DeepL
  - Code 456 : quota de caracteres DeepL atteint
  - Texte traduit et langue source detectee

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet TranslateOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `text` | string | oui | — | — |
| `detected_source` | string | oui | — | — |
| `target` | string | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (8) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides; « target : ['Langue cible non prise en charge'] » | non |
| `503` | Service indisponible ou non configuré | « Quota de traduction atteint »; « Service de traduction indisponible »; « Service de traduction non configuré »; « Service indisponible ou non configuré » | oui (3) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
