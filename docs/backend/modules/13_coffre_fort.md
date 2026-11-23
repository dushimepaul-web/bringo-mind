<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Coffre-fort documentaire

Dossier du code : [app/modules/document_vault/](../../app/modules/document_vault/) · lettre ou numéro de la spécification : **H** · priorité **3** · documentation générée le 19/11/2026 17:30.

**7 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 6 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 1 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Coffre-fort**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-COF-001](#api-cof-001--liste-des-documents-du-coffre-fort) | GET | `/api/v1/vault` | Liste des documents du coffre-fort | Terminée et opérationnelle | oui |
| [API-COF-002](#api-cof-002--ajout-dun-document-au-coffre-fort) | POST | `/api/v1/vault` | Ajout d'un document au coffre-fort | Terminée et opérationnelle | oui |
| [API-COF-003](#api-cof-003--modification-dune-fiche-du-coffre-fort) | PATCH | `/api/v1/vault/{record_id}` | Modification d'une fiche du coffre-fort | Terminée et opérationnelle | oui |
| [API-COF-004](#api-cof-004--nouvelle-version-dun-document-du-coffre-fort) | POST | `/api/v1/vault/{record_id}/versions` | Nouvelle version d'un document du coffre-fort | Terminée, en attente de configuration | oui |
| [API-COF-005](#api-cof-005--historique-des-versions-et-des-accès) | GET | `/api/v1/vault/{record_id}/history` | Historique des versions et des accès | Terminée et opérationnelle | oui |
| [API-COF-006](#api-cof-006--téléchargement-depuis-le-coffre-fort) | GET | `/api/v1/vault/{record_id}/download` | Téléchargement depuis le coffre-fort | Terminée et opérationnelle | oui |
| [API-COF-007](#api-cof-007--retrait-du-coffre-fort) | DELETE | `/api/v1/vault/{record_id}` | Retrait du coffre-fort | Terminée et opérationnelle | oui |

## Sous-module : Coffre-fort

### API-COF-001 — Liste des documents du coffre-fort

| Élément | Valeur |
|---|---|
| Module | Coffre-fort documentaire (`app/modules/document_vault`, spéc. H) |
| Sous-module | Coffre-fort |
| Méthode | `GET` |
| Chemin | `/api/v1/vault` |
| Fonction | `list_records` — [app/modules/document_vault/router.py:113](../../app/modules/document_vault/router.py#L113) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 5 test(s) (test_accounts, test_fonctions_plan, test_inbox_reminders_actions, test_integrations, test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/document_vault/pages/VaultPage.jsx`) |

**Description** (commentaire et docstring du code). Documents du coffre-fort (derniere version uniquement), avec filtres

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `category` | requête | string (énumération VaultCategory) (ou null) | non | valeurs : `warranty`, `receipt`, `insurance`, `travel`, `identity`, `health`, `education`, `housing`, `other` | — |
| `expiring_before` | requête | string (date) (ou null) | non | — | — |
| `search` | requête | string (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Sous-requete : versions remplacees par une version plus recente (exclues de la liste)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet VaultRecordOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `document_id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `category` | string (énumération VaultCategory) | oui | valeurs : `warranty`, `receipt`, `insurance`, `travel`, `identity`, `health`, `education`, `housing`, `other` | — |
| `notes` | string (ou null) | oui | — | — |
| `expires_on` | string (date) (ou null) | oui | — | — |
| `version` | integer | oui | — | — |
| `previous_version_id` | string (uuid) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (4) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-COF-002 — Ajout d'un document au coffre-fort

| Élément | Valeur |
|---|---|
| Module | Coffre-fort documentaire (`app/modules/document_vault`, spéc. H) |
| Sous-module | Coffre-fort |
| Méthode | `POST` |
| Chemin | `/api/v1/vault` |
| Fonction | `add_record` — [app/modules/document_vault/router.py:130](../../app/modules/document_vault/router.py#L130) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 6 test(s) (test_api_sans_test_auparavant, test_fonctions_plan, test_inbox_reminders_actions, test_integrations, test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/document_vault/pages/VaultPage.jsx`) |

**Description** (commentaire et docstring du code). Ajout au coffre-fort : le document recoit ses informations de coffre

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `VaultRecordIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `document_id` | string (uuid) | oui | — | — |
| `title` | string | oui | longueur min. 1 ; longueur max. 200 | — |
| `category` | string (énumération VaultCategory) | non | valeurs : `warranty`, `receipt`, `insurance`, `travel`, `identity`, `health`, `education`, `housing`, `other` ; défaut `"other"` | — |
| `notes` | string (ou null) | non | longueur max. 5000 | — |
| `expires_on` | string (date) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `life_inbox.service.get_document` ([app/modules/life_inbox/service.py:371](../../app/modules/life_inbox/service.py#L371))
  - Requete : document demande ; il doit appartenir a l'utilisateur et ne pas etre supprime
- Fonction `document_vault.models.write_vault` ([app/modules/document_vault/models.py:67](../../app/modules/document_vault/models.py#L67)) : Ecrit les informations du coffre d'un document (extraction « metadata », cle « vault ») ; None : retire du coffre
- Fonction `document_vault.router._log` ([app/modules/document_vault/router.py:95](../../app/modules/document_vault/router.py#L95))
  - Journal des acces (document_access_logs) : actions du schema seulement
- Fonction `document_vault.router._reload` ([app/modules/document_vault/router.py:89](../../app/modules/document_vault/router.py#L89))
  - Relecture de la fiche apres une modification du document

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Document ajoute au coffre-fort ».
- `result` : objet VaultRecordOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `document_id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `category` | string (énumération VaultCategory) | oui | valeurs : `warranty`, `receipt`, `insurance`, `travel`, `identity`, `health`, `education`, `housing`, `other` | — |
| `notes` | string (ou null) | oui | — | — |
| `expires_on` | string (date) (ou null) | oui | — | — |
| `version` | integer | oui | — | — |
| `previous_version_id` | string (uuid) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (8) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Document introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-COF-003 — Modification d'une fiche du coffre-fort

| Élément | Valeur |
|---|---|
| Module | Coffre-fort documentaire (`app/modules/document_vault`, spéc. H) |
| Sous-module | Coffre-fort |
| Méthode | `PATCH` |
| Chemin | `/api/v1/vault/{record_id}` |
| Fonction | `update_record` — [app/modules/document_vault/router.py:143](../../app/modules/document_vault/router.py#L143) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/document_vault/pages/VaultPage.jsx`) |

**Description** (commentaire et docstring du code). Modification des informations d'un document

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `record_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `VaultRecordUpdate`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `title` | string (ou null) | non | longueur min. 1 ; longueur max. 200 | — |
| `category` | string (énumération VaultCategory) (ou null) | non | valeurs : `warranty`, `receipt`, `insurance`, `travel`, `identity`, `health`, `education`, `housing`, `other` | — |
| `notes` | string (ou null) | non | longueur max. 5000 | — |
| `expires_on` | string (date) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `document_vault.router._get` ([app/modules/document_vault/router.py:81](../../app/modules/document_vault/router.py#L81))
  - Fiche du coffre-fort (document du coffre) ; seul son proprietaire y a acces
- Fonction `life_inbox.service.get_document` ([app/modules/life_inbox/service.py:371](../../app/modules/life_inbox/service.py#L371))
  - Requete : document demande ; il doit appartenir a l'utilisateur et ne pas etre supprime
- Fonction `document_vault.models.write_vault` ([app/modules/document_vault/models.py:67](../../app/modules/document_vault/models.py#L67)) : Ecrit les informations du coffre d'un document (extraction « metadata », cle « vault ») ; None : retire du coffre
- Fonction `document_vault.router._reload` ([app/modules/document_vault/router.py:89](../../app/modules/document_vault/router.py#L89))
  - Relecture de la fiche apres une modification du document

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Document modifié ».
- `result` : objet VaultRecordOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `document_id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `category` | string (énumération VaultCategory) | oui | valeurs : `warranty`, `receipt`, `insurance`, `travel`, `identity`, `health`, `education`, `housing`, `other` | — |
| `notes` | string (ou null) | oui | — | — |
| `expires_on` | string (date) (ou null) | oui | — | — |
| `version` | integer | oui | — | — |
| `previous_version_id` | string (uuid) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | non |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Document introuvable »; « Document introuvable dans le coffre-fort » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-COF-004 — Nouvelle version d'un document du coffre-fort

| Élément | Valeur |
|---|---|
| Module | Coffre-fort documentaire (`app/modules/document_vault`, spéc. H) |
| Sous-module | Coffre-fort |
| Méthode | `POST` |
| Chemin | `/api/v1/vault/{record_id}/versions` |
| Fonction | `new_version` — [app/modules/document_vault/router.py:156](../../app/modules/document_vault/router.py#L156) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 1 test(s) (test_integrations) |
| Utilisée par l'interface web | oui (`src/modules/document_vault/pages/VaultPage.jsx`) |

**Description** (commentaire et docstring du code). Nouvelle version d'un document (ex. attestation d'assurance renouvelee) ; l'ancienne reste consultable

**État détaillé.**

- Dépendance non configurée (É-01) : Antivirus ClamAV (CLAMAV_HOST vide) : l'analyse est ignorée (SKIPPED), le fichier est traité sans antivirus.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `record_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `VersionIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `document_id` | string (uuid) | oui | — | — |
| `expires_on` | string (date) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `document_vault.router._get` ([app/modules/document_vault/router.py:81](../../app/modules/document_vault/router.py#L81))
  - Fiche du coffre-fort (document du coffre) ; seul son proprietaire y a acces
- Fonction `life_inbox.service.get_document` ([app/modules/life_inbox/service.py:371](../../app/modules/life_inbox/service.py#L371))
  - Requete : document demande ; il doit appartenir a l'utilisateur et ne pas etre supprime
- Fonction `document_vault.models.write_vault` ([app/modules/document_vault/models.py:67](../../app/modules/document_vault/models.py#L67)) : Ecrit les informations du coffre d'un document (extraction « metadata », cle « vault ») ; None : retire du coffre
- Fonction `document_vault.router._log` ([app/modules/document_vault/router.py:95](../../app/modules/document_vault/router.py#L95))
  - Journal des acces (document_access_logs) : actions du schema seulement
- Fonction `document_vault.router._reload` ([app/modules/document_vault/router.py:89](../../app/modules/document_vault/router.py#L89))
  - Relecture de la fiche apres une modification du document

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Nouvelle version enregistrée ».
- `result` : objet VaultRecordOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `document_id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `category` | string (énumération VaultCategory) | oui | valeurs : `warranty`, `receipt`, `insurance`, `travel`, `identity`, `health`, `education`, `housing`, `other` | — |
| `notes` | string (ou null) | oui | — | — |
| `expires_on` | string (date) (ou null) | oui | — | — |
| `version` | integer | oui | — | — |
| `previous_version_id` | string (uuid) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Document introuvable »; « Document introuvable dans le coffre-fort » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-COF-005 — Historique des versions et des accès

| Élément | Valeur |
|---|---|
| Module | Coffre-fort documentaire (`app/modules/document_vault`, spéc. H) |
| Sous-module | Coffre-fort |
| Méthode | `GET` |
| Chemin | `/api/v1/vault/{record_id}/history` |
| Fonction | `history` — [app/modules/document_vault/router.py:172](../../app/modules/document_vault/router.py#L172) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_integrations, test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/document_vault/pages/VaultPage.jsx`) |

**Description** (commentaire et docstring du code). Historique : toutes les versions et les 100 derniers acces

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `record_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `document_vault.router._chain` ([app/modules/document_vault/router.py:101](../../app/modules/document_vault/router.py#L101))
  - Remonte la chaine des versions, de la plus recente a la plus ancienne
- Fonction `document_vault.router._get` ([app/modules/document_vault/router.py:81](../../app/modules/document_vault/router.py#L81))
  - Fiche du coffre-fort (document du coffre) ; seul son proprietaire y a acces

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet app__modules__document_vault__router__HistoryOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `versions` | liste de objet VaultRecordOut | oui | — | — |
| `versions[].id` | string (uuid) | oui | — | — |
| `versions[].document_id` | string (uuid) | oui | — | — |
| `versions[].title` | string | oui | — | — |
| `versions[].category` | string (énumération VaultCategory) | oui | valeurs : `warranty`, `receipt`, `insurance`, `travel`, `identity`, `health`, `education`, `housing`, `other` | — |
| `versions[].notes` | string (ou null) | oui | — | — |
| `versions[].expires_on` | string (date) (ou null) | oui | — | — |
| `versions[].version` | integer | oui | — | — |
| `versions[].previous_version_id` | string (uuid) (ou null) | oui | — | — |
| `versions[].created_at` | string (date-time) | oui | — | — |
| `access` | liste de objet AccessLogOut | oui | — | — |
| `access[].action` | string | oui | — | — |
| `access[].ip_address` | string (ou null) | oui | — | — |
| `access[].created_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Document introuvable dans le coffre-fort » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-COF-006 — Téléchargement depuis le coffre-fort

| Élément | Valeur |
|---|---|
| Module | Coffre-fort documentaire (`app/modules/document_vault`, spéc. H) |
| Sous-module | Coffre-fort |
| Méthode | `GET` |
| Chemin | `/api/v1/vault/{record_id}/download` |
| Fonction | `download` — [app/modules/document_vault/router.py:182](../../app/modules/document_vault/router.py#L182) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_integrations, test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/document_vault/pages/VaultPage.jsx`) |

**Description** (commentaire et docstring du code). Telechargement du fichier d'un document du coffre-fort (acces journalise)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `record_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `document_vault.router._get` ([app/modules/document_vault/router.py:81](../../app/modules/document_vault/router.py#L81))
  - Fiche du coffre-fort (document du coffre) ; seul son proprietaire y a acces
- Fonction `life_inbox.service.get_document` ([app/modules/life_inbox/service.py:371](../../app/modules/life_inbox/service.py#L371))
  - Requete : document demande ; il doit appartenir a l'utilisateur et ne pas etre supprime
- Fonction `document_vault.router._log` ([app/modules/document_vault/router.py:95](../../app/modules/document_vault/router.py#L95))
  - Journal des acces (document_access_logs) : actions du schema seulement

**Réponse en cas de succès.**

- Réponse directe hors enveloppe possible (Response) : fichier, flux, redirection ou réponse sans contenu selon le cas (voir le code).
- Code HTTP **200**.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Document introuvable »; « Document introuvable dans le coffre-fort » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-COF-007 — Retrait du coffre-fort

| Élément | Valeur |
|---|---|
| Module | Coffre-fort documentaire (`app/modules/document_vault`, spéc. H) |
| Sous-module | Coffre-fort |
| Méthode | `DELETE` |
| Chemin | `/api/v1/vault/{record_id}` |
| Fonction | `remove_record` — [app/modules/document_vault/router.py:193](../../app/modules/document_vault/router.py#L193) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_fonctions_plan, test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/document_vault/pages/VaultPage.jsx`) |

**Description** (commentaire et docstring du code). Retire le document du coffre-fort (toutes versions) ; delete_file=true supprime aussi les fichiers

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `manage_members` (propriétaire seulement) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `documents.service._visible`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `record_id` | chemin | string (uuid) | oui | — | — |
| `delete_file` | requête | boolean | non | défaut `false` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : confirm : ['La suppression doit être confirmée explicitement']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `document_vault.router._chain` ([app/modules/document_vault/router.py:101](../../app/modules/document_vault/router.py#L101))
  - Remonte la chaine des versions, de la plus recente a la plus ancienne
- Fonction `document_vault.router._get` ([app/modules/document_vault/router.py:81](../../app/modules/document_vault/router.py#L81))
  - Fiche du coffre-fort (document du coffre) ; seul son proprietaire y a acces
- Fonction `life_inbox.service.get_document` ([app/modules/life_inbox/service.py:371](../../app/modules/life_inbox/service.py#L371))
  - Requete : document demande ; il doit appartenir a l'utilisateur et ne pas etre supprime
- Fonction `document_vault.models.write_vault` ([app/modules/document_vault/models.py:67](../../app/modules/document_vault/models.py#L67)) : Ecrit les informations du coffre d'un document (extraction « metadata », cle « vault ») ; None : retire du coffre
- Fonction `documents.service.delete_document` ([app/modules/documents/service.py:475](../../app/modules/documents/service.py#L475))
  - Proprietaire, ou administrateur du foyer pour un document partage
  - Retrait immediat de tous les liens ; le fichier et ses versions sont purges apres 30 jours

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Document retiré du coffre-fort ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous ne pouvez pas supprimer ce document » | non |
| `404` | Introuvable ou inaccessible | « Document introuvable »; « Document introuvable dans le coffre-fort » | oui (1) |
| `409` | Conflit avec l'état actuel | « Traitement en cours : la suppression sera possible lorsqu'il sera terminé » | non |
| `422` | Données invalides | « confirm : ['La suppression doit être confirmée explicitement'] »; données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
