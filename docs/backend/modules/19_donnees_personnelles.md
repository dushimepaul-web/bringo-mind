<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Sécurité et données personnelles

Dossier du code : [app/modules/privacy/](../../app/modules/privacy/) · lettre ou numéro de la spécification : **M13** · priorité **1** · documentation générée le 19/11/2026 17:30.

**8 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 7 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 1 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Export des données**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-PRV-001](#api-prv-001--historique-des-demandes-export-suppression) | GET | `/api/v1/privacy/requests` | Historique des demandes (export, suppression) | Terminée et opérationnelle | oui |
| [API-PRV-002](#api-prv-002--demande-dexport-des-données) | POST | `/api/v1/privacy/exports` | Demande d'export des données | Terminée et opérationnelle | oui |
| [API-PRV-003](#api-prv-003--téléchargement-de-lexport-des-données) | GET | `/api/v1/privacy/exports/{request_id}/download` | Téléchargement de l'export des données | Terminée et opérationnelle | oui |

**Suppression du compte**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-PRV-004](#api-prv-004--foyers-à-traiter-avant-la-suppression-du-compte) | GET | `/api/v1/privacy/deletion/households` | Foyers à traiter avant la suppression du compte | Terminée et opérationnelle | oui |
| [API-PRV-005](#api-prv-005--demande-de-suppression-du-compte-délai-de-7-jours) | POST | `/api/v1/privacy/deletion` | Demande de suppression du compte (délai de 7 jours) | Terminée, en attente de configuration | oui |
| [API-PRV-006](#api-prv-006--annulation-de-la-demande-de-suppression) | POST | `/api/v1/privacy/deletion/cancel` | Annulation de la demande de suppression | Terminée et opérationnelle | oui |

**Consentements**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-PRV-007](#api-prv-007--consentements) | GET | `/api/v1/privacy/consents` | Consentements | Terminée et opérationnelle | oui |
| [API-PRV-008](#api-prv-008--modification-dun-consentement) | PUT | `/api/v1/privacy/consents/{purpose}` | Modification d'un consentement | Terminée et opérationnelle | oui |

## Sous-module : Export des données

### API-PRV-001 — Historique des demandes (export, suppression)

| Élément | Valeur |
|---|---|
| Module | Sécurité et données personnelles (`app/modules/privacy`, spéc. M13) |
| Sous-module | Export des données |
| Méthode | `GET` |
| Chemin | `/api/v1/privacy/requests` |
| Fonction | `requests` — [app/modules/privacy/router.py:65](../../app/modules/privacy/router.py#L65) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_13_privacy) |
| Utilisée par l'interface web | oui (`src/modules/privacy/api.js`) |

**Description** (commentaire et docstring du code). Historique des demandes (export, suppression).

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Demandes d'export et de suppression de l'utilisateur, les plus recentes d'abord

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet RequestOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `request_type` | string | oui | — | — |
| `status` | string | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `scheduled_for` | string (date-time) (ou null) | oui | — | — |
| `completed_at` | string (date-time) (ou null) | oui | — | — |
| `expires_at` | string (date-time) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PRV-002 — Demande d'export des données

| Élément | Valeur |
|---|---|
| Module | Sécurité et données personnelles (`app/modules/privacy`, spéc. M13) |
| Sous-module | Export des données |
| Méthode | `POST` |
| Chemin | `/api/v1/privacy/exports` |
| Fonction | `request_export` — [app/modules/privacy/router.py:71](../../app/modules/privacy/router.py#L71) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_13_privacy) |
| Utilisée par l'interface web | oui (`src/modules/privacy/api.js`) |

**Description** (commentaire et docstring du code). Demande d'export des données.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `privacy.service.request_export` ([app/modules/privacy/service.py:128](../../app/modules/privacy/service.py#L128)) : Nouvelle demande d'export, produite en arriere-plan (une seule en cours)

**Réponse en cas de succès.**

- Code HTTP **202**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Export en préparation : vous serez prévenu quand il sera prêt ».
- `result` : objet RequestOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `request_type` | string | oui | — | — |
| `status` | string | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `scheduled_for` | string (date-time) (ou null) | oui | — | — |
| `completed_at` | string (date-time) (ou null) | oui | — | — |
| `expires_at` | string (date-time) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `202` | Accepté, traité en arrière-plan | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `409` | Conflit avec l'état actuel | « Un export est déjà en préparation » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PRV-003 — Téléchargement de l'export des données

| Élément | Valeur |
|---|---|
| Module | Sécurité et données personnelles (`app/modules/privacy`, spéc. M13) |
| Sous-module | Export des données |
| Méthode | `GET` |
| Chemin | `/api/v1/privacy/exports/{request_id}/download` |
| Fonction | `download` — [app/modules/privacy/router.py:76](../../app/modules/privacy/router.py#L76) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_13_privacy) |
| Utilisée par l'interface web | oui (`src/modules/privacy/api.js`) |

**Description** (commentaire et docstring du code). Téléchargement de l'export des données.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `request_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `privacy.service.download` ([app/modules/privacy/service.py:207](../../app/modules/privacy/service.py#L207)) : Telechargement de l'archive : demande d'autrui = 404 ; lien expire = 410 ; telechargement trace

**Réponse en cas de succès.**

- Réponse directe hors enveloppe possible (Response) : fichier, flux, redirection ou réponse sans contenu selon le cas (voir le code).
- Code HTTP **200**.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Export introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « L'export est encore en préparation » | oui (1) |
| `410` | Expiré ou n'existe plus | « Ce lien a expiré : demandez un nouvel export » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Suppression du compte

### API-PRV-004 — Foyers à traiter avant la suppression du compte

| Élément | Valeur |
|---|---|
| Module | Sécurité et données personnelles (`app/modules/privacy`, spéc. M13) |
| Sous-module | Suppression du compte |
| Méthode | `GET` |
| Chemin | `/api/v1/privacy/deletion/households` |
| Fonction | `deletion_households` — [app/modules/privacy/router.py:83](../../app/modules/privacy/router.py#L83) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_lot5_foyer_et_compte, test_phase3_suppression_foyers) |
| Utilisée par l'interface web | oui (`src/modules/privacy/api.js`) |

**Description** (commentaire et docstring du code). B8 : foyers possedes et choix possibles avant de demander la suppression du compte

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `privacy.service.owned_households`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `privacy.service.owned_households` ([app/modules/privacy/service.py:250](../../app/modules/privacy/service.py#L250)) : B8 : foyers dont l'utilisateur est proprietaire, avec les membres qui peuvent les reprendre et le choix par defaut (membre actif le plus ancien ; sans autre membre, le foyer est ferme).
  - Membres actifs autres que le proprietaire, du plus ancien au plus recent (vue native, sans adresse e-mail)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet OwnedHouseholdOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `household_id` | string (uuid) | oui | — | — |
| `name` | string | oui | — | — |
| `members` | liste de objet HouseholdCandidateOut | oui | — | — |
| `members[].user_id` | string (uuid) | oui | — | — |
| `members[].name` | string | oui | — | — |
| `members[].role` | string | oui | — | — |
| `default` | objet HouseholdChoiceOut | oui | — | — |
| `default.action` | string | oui | valeurs : `transfer`, `dissolve`, `keep` | — |
| `default.new_owner_id` | string (uuid) (ou null) | non | — | — |
| `choice` | objet HouseholdChoiceOut (ou null) | non | — | — |
| `choice.action` | string | oui | valeurs : `transfer`, `dissolve`, `keep` | — |
| `choice.new_owner_id` | string (uuid) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (4) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PRV-005 — Demande de suppression du compte (délai de 7 jours)

| Élément | Valeur |
|---|---|
| Module | Sécurité et données personnelles (`app/modules/privacy`, spéc. M13) |
| Sous-module | Suppression du compte |
| Méthode | `POST` |
| Chemin | `/api/v1/privacy/deletion` |
| Fonction | `request_deletion` — [app/modules/privacy/router.py:88](../../app/modules/privacy/router.py#L88) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 13 test(s) (test_lot5_foyer_et_compte, test_module_13_privacy, test_phase3_suppression_foyers) |
| Utilisée par l'interface web | oui (`src/modules/privacy/api.js`) |

**Description** (commentaire et docstring du code). Demande de suppression du compte (délai de 7 jours).

**État détaillé.**

- Dépendance non configurée (É-02) : Relais d'e-mails (MAIL_HOST vide) : les e-mails sont seulement journalisés, aucun n'est envoyé.
- Remarque : L'e-mail de clôture (É-45) n'est pas envoyé sans relais SMTP.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `core.security.verify_password`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `DeletionIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `password` | string | oui | longueur min. 1 ; longueur max. 200 | — |
| `reason` | string (ou null) | non | longueur max. 500 | — |
| `households` | liste de objet HouseholdChoiceIn | non | éléments max. 50 | — |
| `households[].household_id` | string (uuid) | oui | — | — |
| `households[].action` | string | oui | valeurs : `transfer`, `dissolve`, `keep` | — |
| `households[].new_owner_id` | string (uuid) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : households : ["Vous n'êtes pas propriétaire de ce foyer"]
- Contrôle dans le code (422) : households : [f"Choisissez un membre actif du foyer « {item['name']} »"]
- Contrôle dans le code (422) : households : [f"Le foyer « {item['name']} » n'a aucun autre membre : il ne peut pas être conservé"]
- Contrôle dans le code (422) : password : ['Mot de passe incorrect']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `privacy.service.request_deletion` ([app/modules/privacy/service.py:297](../../app/modules/privacy/service.py#L297)) : Suppression programmee dans 7 jours (delai de reflexion), annulable jusque-la ; confirmee par mot de passe. households (B8, facultatif) : choix par foyer possede ; foyer sans choix = regle automatique inchangee.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Suppression programmée le {request.scheduled_for} : vous pouvez l'annuler d'ici là ».
- `result` : objet RequestOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `request_type` | string | oui | — | — |
| `status` | string | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `scheduled_for` | string (date-time) (ou null) | oui | — | — |
| `completed_at` | string (date-time) (ou null) | oui | — | — |
| `expires_at` | string (date-time) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (12) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `409` | Conflit avec l'état actuel | « Une suppression est déjà programmée » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « households : ["Vous n'êtes pas propriétaire de ce foyer"] »; « households : [f"Choisissez un membre actif du foyer « {item['name']} »"] »; « households : [f"Le foyer « {item['name']} » n'a aucun autre membre : il ne peut pas être conservé"] »; « password : ['Mot de passe incorrect'] » | oui (5) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PRV-006 — Annulation de la demande de suppression

| Élément | Valeur |
|---|---|
| Module | Sécurité et données personnelles (`app/modules/privacy`, spéc. M13) |
| Sous-module | Suppression du compte |
| Méthode | `POST` |
| Chemin | `/api/v1/privacy/deletion/cancel` |
| Fonction | `cancel_deletion` — [app/modules/privacy/router.py:94](../../app/modules/privacy/router.py#L94) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_13_privacy, test_phase3_suppression_foyers) |
| Utilisée par l'interface web | oui (`src/modules/privacy/api.js`) |

**Description** (commentaire et docstring du code). Annulation de la demande de suppression.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `privacy.service.cancel_deletion` ([app/modules/privacy/service.py:328](../../app/modules/privacy/service.py#L328))
  - B8 : les choix faits pour les foyers sont oublies avec la demande

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Suppression annulée ».
- `result` : objet RequestOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `request_type` | string | oui | — | — |
| `status` | string | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `scheduled_for` | string (date-time) (ou null) | oui | — | — |
| `completed_at` | string (date-time) (ou null) | oui | — | — |
| `expires_at` | string (date-time) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Aucune suppression programmée » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Consentements

### API-PRV-007 — Consentements

| Élément | Valeur |
|---|---|
| Module | Sécurité et données personnelles (`app/modules/privacy`, spéc. M13) |
| Sous-module | Consentements |
| Méthode | `GET` |
| Chemin | `/api/v1/privacy/consents` |
| Fonction | `consents` — [app/modules/privacy/router.py:99](../../app/modules/privacy/router.py#L99) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_13_privacy) |
| Utilisée par l'interface web | oui (`src/modules/privacy/api.js`) |

**Description** (commentaire et docstring du code). Consentements.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `privacy.service.consents` ([app/modules/privacy/service.py:65](../../app/modules/privacy/service.py#L65)) : Etat de chaque finalite : accord en vigueur, version acceptee, dates d'accord et de retrait
  - IA : sans aucun enregistrement, le traitement est celui prevu par les conditions d'utilisation (actif)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PRV-008 — Modification d'un consentement

| Élément | Valeur |
|---|---|
| Module | Sécurité et données personnelles (`app/modules/privacy`, spéc. M13) |
| Sous-module | Consentements |
| Méthode | `PUT` |
| Chemin | `/api/v1/privacy/consents/{purpose}` |
| Fonction | `set_consent` — [app/modules/privacy/router.py:104](../../app/modules/privacy/router.py#L104) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_13_privacy) |
| Utilisée par l'interface web | oui (`src/modules/privacy/api.js`) |

**Description** (commentaire et docstring du code). Modification d'un consentement.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `purpose` | chemin | string | oui | — | — |

**Corps de la requête** (`application/json`, schéma `app__modules__privacy__router__ConsentIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `granted` | boolean | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `privacy.service.set_consent` ([app/modules/privacy/service.py:91](../../app/modules/privacy/service.py#L91)) : Accord (version en vigueur) ou retrait ; la preuve est conservee dans consent_records et le journal d'audit
  - Nouvel accord sur la meme version : l'historique complet reste dans le journal d'audit
  - Refus explicite sans accord prealable

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Finalité inconnue » | oui (1) |
| `409` | Conflit avec l'état actuel | « Ce consentement est nécessaire au service : pour le retirer, supprimez votre compte » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
