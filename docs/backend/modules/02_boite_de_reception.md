<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Boîte de réception universelle

Dossier du code : [app/modules/life_inbox/](../../app/modules/life_inbox/) · lettre ou numéro de la spécification : **A** · priorité **1** · documentation générée le 19/11/2026 17:30.

**13 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 9 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 4 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Éléments de la boîte de réception**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-INB-001](#api-inb-001--liste-des-éléments-reçus) | GET | `/api/v1/source-items` | Liste des éléments reçus | Terminée et opérationnelle | oui |
| [API-INB-002](#api-inb-002--saisie-dun-élément-texte-lien-fichier) | POST | `/api/v1/source-items` | Saisie d'un élément (texte, lien, fichier) | Terminée, en attente de configuration | oui |
| [API-INB-003](#api-inb-003--détail-dun-élément-reçu) | GET | `/api/v1/source-items/{item_id}` | Détail d'un élément reçu | Terminée et opérationnelle | oui |
| [API-INB-004](#api-inb-004--conversion-dun-élément-en-tâche) | POST | `/api/v1/source-items/{item_id}/convert` | Conversion d'un élément en tâche | Terminée et opérationnelle | oui |
| [API-INB-005](#api-inb-005--mise-à-lécart-dun-élément) | POST | `/api/v1/source-items/{item_id}/discard` | Mise à l'écart d'un élément | Terminée et opérationnelle | oui |
| [API-INB-006](#api-inb-006--réglages-de-la-boîte-de-réception-adresse-de-transfert-expéditeurs) | GET | `/api/v1/inbox/settings` | Réglages de la boîte de réception (adresse de transfert, expéditeurs) | Terminée et opérationnelle | oui |
| [API-INB-007](#api-inb-007--modification-des-réglages-de-la-boîte-de-réception) | PUT | `/api/v1/inbox/settings` | Modification des réglages de la boîte de réception | Terminée et opérationnelle | oui |
| [API-INB-008](#api-inb-008--archivage-dun-élément-reçu) | DELETE | `/api/v1/source-items/{item_id}` | Archivage d'un élément reçu | Terminée et opérationnelle | oui |

**Dépôt direct de documents**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-INB-009](#api-inb-009--dépôt-direct-dun-document) | POST | `/api/v1/documents` | Dépôt direct d'un document | Terminée, en attente de configuration | oui |
| [API-INB-010](#api-inb-010--suppression-dun-document-corbeille) | DELETE | `/api/v1/documents/{document_id}` | Suppression d'un document (corbeille) | Terminée et opérationnelle | oui |
| [API-INB-011](#api-inb-011--téléchargement-dun-document) | GET | `/api/v1/documents/{document_id}/download` | Téléchargement d'un document | Terminée et opérationnelle | oui |

**Réception des e-mails transférés (webhooks)**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-INB-012](#api-inb-012--webhook-de-réception-dun-e-mail-transféré) | POST | `/api/v1/inbound/email` | Webhook de réception d'un e-mail transféré | Terminée, en attente de configuration | oui |
| [API-INB-013](#api-inb-013--webhook-des-événements-denvoi-de-mails-rebonds-plaintes) | POST | `/api/v1/inbound/email-events` | Webhook des événements d'envoi d'e-mails (rebonds, plaintes) | Terminée, en attente de configuration | oui |

## Sous-module : Éléments de la boîte de réception

### API-INB-001 — Liste des éléments reçus

| Élément | Valeur |
|---|---|
| Module | Boîte de réception universelle (`app/modules/life_inbox`, spéc. A) |
| Sous-module | Éléments de la boîte de réception |
| Méthode | `GET` |
| Chemin | `/api/v1/source-items` |
| Fonction | `list_items` — [app/modules/life_inbox/router.py:29](../../app/modules/life_inbox/router.py#L29) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 20 test(s) (test_accounts, test_fonctions_plan, test_integrations, test_module_14_inbox, test_module_15_household, test_module_8_voice, …) |
| Utilisée par l'interface web | oui (`src/modules/life_inbox/api.js`, `src/modules/voice/api.js`) |

**Description** (commentaire et docstring du code). Liste paginee des elements ; par defaut, tous sauf les elements archives

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `status` | requête | string (énumération SourceStatus) (ou null) | non | valeurs : `captured`, `processing`, `needs_review`, `converted`, `failed`, `archived`, `discarded` | — |
| `source_type` | requête | string (énumération SourceType) (ou null) | non | valeurs : `manual`, `text`, `voice`, `document`, `image`, `email`, `calendar`, `share`, `link` | — |
| `queue` | requête | string (ou null) | non | motif `^(review\|processed)$` | — |
| `page` | requête | integer | non | min. 1 ; défaut `1` | — |
| `page_size` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |
| `cursor` | requête | string (ou null) | non | longueur max. 500 | — |
| `limit` | requête | integer (ou null) | non | min. 1 ; max. 100 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : elements de l'utilisateur, filtres par etat, les plus recents d'abord
- File de revue (INB-004) : elements recus, en analyse, a verifier ou en echec
- Archives : elements convertis, ecartes ou archives

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet Page_SourceItemOut_ (ou null).
- Liste paginée : `items`, `total`, `page`, `page_size`, `next_cursor` (voir CONVENTIONS.md).

| Champ de `result` (élément de `items`) | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `source_type` | string (énumération SourceType) | oui | valeurs : `manual`, `text`, `voice`, `document`, `image`, `email`, `calendar`, `share`, `link` | — |
| `origin` | string | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `body_text` | string (ou null) | oui | — | — |
| `status` | string (énumération SourceStatus) | oui | valeurs : `captured`, `processing`, `needs_review`, `converted`, `failed`, `archived`, `discarded` | — |
| `received_at` | string (date-time) | oui | — | — |
| `processing_error` | string (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (26) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-INB-002 — Saisie d'un élément (texte, lien, fichier)

| Élément | Valeur |
|---|---|
| Module | Boîte de réception universelle (`app/modules/life_inbox`, spéc. A) |
| Sous-module | Éléments de la boîte de réception |
| Méthode | `POST` |
| Chemin | `/api/v1/source-items` |
| Fonction | `create_item` — [app/modules/life_inbox/router.py:48](../../app/modules/life_inbox/router.py#L48) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 34 test(s) (test_cas_limites, test_fonctions_plan, test_inbox_reminders_actions, test_integrations, test_module_13_privacy, test_module_14_inbox, …) |
| Utilisée par l'interface web | oui (`src/modules/life_inbox/api.js`) |

**Description** (commentaire et docstring du code). Saisie d'un texte : creation de l'element et lancement de l'analyse

**État détaillé.**

- Dépendance non configurée (É-01) : Antivirus ClamAV (CLAMAV_HOST vide) : l'analyse est ignorée (SKIPPED), le fichier est traité sans antivirus.
- Remarque : Concerne seulement les éléments accompagnés d'un fichier.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `Idempotency-Key` | en-tête | string (ou null) | non | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`application/json`, schéma `SourceItemIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `title` | string (ou null) | non | longueur max. 255 | — |
| `text` | string | oui | longueur min. 1 ; longueur max. 20000 | — |
| `source_type` | string (énumération SourceType) | non | valeurs : `manual`, `text`, `voice`, `document`, `image`, `email`, `calendar`, `share`, `link` ; défaut `"text"` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- En-tete Idempotency-Key facultatif : une requete rejouee renvoie l'element deja cree (200, sans doublon)
- Fonction `life_inbox.service.capture_text` ([app/modules/life_inbox/service.py:48](../../app/modules/life_inbox/service.py#L48)) : Retourne (element, deja_existant). Une meme cle d'idempotence ne cree qu'un element.
  - Requete rejouee (double clic, nouvelle tentative reseau) : l'element deja cree est renvoye
  - Creation de l'element ; le titre par defaut est la premiere ligne du texte
  - flush : obtient l'identifiant (et applique la contrainte d'unicite de la cle d'idempotence)
  - Deux requetes identiques simultanees : la seconde renvoie l'element cree par la premiere
  - Document texte de l'element des la capture : document_extractions (informations de l'element, cle d'idempotence, etat) exige un document ; l'analyse le reutilise
  - Lancement de l'analyse en arriere-plan

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Élément ajouté à la boîte de réception », « Élément déjà enregistré ».
- `result` : objet SourceItemOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `source_type` | string (énumération SourceType) | oui | valeurs : `manual`, `text`, `voice`, `document`, `image`, `email`, `calendar`, `share`, `link` | — |
| `origin` | string | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `body_text` | string (ou null) | oui | — | — |
| `status` | string (énumération SourceStatus) | oui | valeurs : `captured`, `processing`, `needs_review`, `converted`, `failed`, `archived`, `discarded` | — |
| `received_at` | string (date-time) | oui | — | — |
| `processing_error` | string (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `201` | Créé | succès | oui (36) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-INB-003 — Détail d'un élément reçu

| Élément | Valeur |
|---|---|
| Module | Boîte de réception universelle (`app/modules/life_inbox`, spéc. A) |
| Sous-module | Éléments de la boîte de réception |
| Méthode | `GET` |
| Chemin | `/api/v1/source-items/{item_id}` |
| Fonction | `get_item` — [app/modules/life_inbox/router.py:61](../../app/modules/life_inbox/router.py#L61) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 8 test(s) (test_fonctions_plan, test_inbox_reminders_actions, test_module_13_privacy, test_module_14_inbox, test_module_15_household, test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/life_inbox/api.js`) |

**Description** (commentaire et docstring du code). Detail d'un element avec ses documents

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `item_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `life_inbox.service.get_item` ([app/modules/life_inbox/service.py:32](../../app/modules/life_inbox/service.py#L32)) : Les elements de la boîte de réception sont toujours prives (jamais partages via un foyer)
  - Requete : element demande ; seul son proprietaire y a acces
- Fonction `life_inbox.service.item_documents` ([app/modules/life_inbox/service.py:366](../../app/modules/life_inbox/service.py#L366))
  - Requete : documents non supprimes d'un element

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet SourceItemDetail (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `source_type` | string (énumération SourceType) | oui | valeurs : `manual`, `text`, `voice`, `document`, `image`, `email`, `calendar`, `share`, `link` | — |
| `origin` | string | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `body_text` | string (ou null) | oui | — | — |
| `status` | string (énumération SourceStatus) | oui | valeurs : `captured`, `processing`, `needs_review`, `converted`, `failed`, `archived`, `discarded` | — |
| `received_at` | string (date-time) | oui | — | — |
| `processing_error` | string (ou null) | oui | — | — |
| `documents` | liste de objet app__modules__life_inbox__schemas__DocumentOut | non | défaut `[]` | — |
| `documents[].id` | string (uuid) | oui | — | — |
| `documents[].source_item_id` | string (uuid) (ou null) | oui | — | — |
| `documents[].original_filename` | string | oui | — | — |
| `documents[].mime_type` | string | oui | — | — |
| `documents[].size_bytes` | integer | oui | — | — |
| `documents[].scan_status` | string (énumération ScanStatus) | oui | valeurs : `pending`, `clean`, `infected`, `skipped` | — |
| `documents[].created_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Élément introuvable » | oui (3) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-INB-004 — Conversion d'un élément en tâche

| Élément | Valeur |
|---|---|
| Module | Boîte de réception universelle (`app/modules/life_inbox`, spéc. A) |
| Sous-module | Éléments de la boîte de réception |
| Méthode | `POST` |
| Chemin | `/api/v1/source-items/{item_id}/convert` |
| Fonction | `convert_item` — [app/modules/life_inbox/router.py:79](../../app/modules/life_inbox/router.py#L79) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_14_inbox) |
| Utilisée par l'interface web | oui (`src/modules/life_inbox/api.js`) |

**Description** (commentaire et docstring du code). Conversion explicite en tache ou en document (INB-004)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `assign_tasks` (propriétaire, membre) ; `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `item_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `ConvertIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `target` | string | oui | motif `^(task\|document)$` | — |
| `title` | string (ou null) | non | longueur max. 255 | — |
| `due_date` | string (date) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : assignee_id : ["Cette personne n'est pas membre du foyer"]
- Contrôle dans le code (422) : assignee_id : ['Seule une tâche partagée avec un foyer peut être attribuée']
- Contrôle dans le code (422) : due_date : ["Une heure d'échéance nécessite une date"]
- Contrôle dans le code (422) : due_date : ['Une tâche récurrente nécessite une date de départ']
- Contrôle dans le code (422) : file : ['Fichier refusé : un logiciel malveillant a été détecté']
- Contrôle dans le code (422) : file : ['Le contenu du fichier ne correspond pas à son type']
- Contrôle dans le code (422) : file : ['Le fichier est vide']
- Contrôle dans le code (422) : file : ['Le fichier texte contient des données binaires']
- Contrôle dans le code (422) : file : ['Type de fichier non accepte (PDF, PNG, JPEG, WEBP ou texte)']
- Contrôle dans le code (422) : recurrence_rule : ['Cette règle ne produit aucune date']
- Contrôle dans le code (422) : target : ['Cible invalide (task ou document)']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `life_inbox.service.convert` ([app/modules/life_inbox/service.py:275](../../app/modules/life_inbox/service.py#L275)) : Conversion explicite en tache (a faire) ou en document de la bibliotheque ; l'element quitte la file de revue
  - Texte seul : enregistre comme document texte dans la bibliotheque

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Élément converti ».
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Catégorie introuvable »; « Élément introuvable » | non |
| `409` | Conflit avec l'état actuel | « Cet élément est déjà traité » | oui (1) |
| `413` | Fichier trop volumineux | « Le fichier depasse {settings.max_upload_mb} Mo » | non |
| `422` | Données invalides | « assignee_id : ["Cette personne n'est pas membre du foyer"] »; « assignee_id : ['Seule une tâche partagée avec un foyer peut être attribuée'] »; données ou paramètres invalides; « due_date : ["Une heure d'échéance nécessite une date"] »; « due_date : ['Une tâche récurrente nécessite une date de départ'] »; « file : ['Fichier refusé : un logiciel malveillant a été détecté'] »; « file : ['Le contenu du fichier ne correspond pas à son type'] »; « file : ['Le fichier est vide'] » ; … | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-INB-005 — Mise à l'écart d'un élément

| Élément | Valeur |
|---|---|
| Module | Boîte de réception universelle (`app/modules/life_inbox`, spéc. A) |
| Sous-module | Éléments de la boîte de réception |
| Méthode | `POST` |
| Chemin | `/api/v1/source-items/{item_id}/discard` |
| Fonction | `discard_item` — [app/modules/life_inbox/router.py:85](../../app/modules/life_inbox/router.py#L85) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_14_inbox) |
| Utilisée par l'interface web | oui (`src/modules/life_inbox/api.js`) |

**Description** (commentaire et docstring du code). Ecarter un element : il quitte la file de revue (conserve dans les archives)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `item_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `life_inbox.service.discard` ([app/modules/life_inbox/service.py:264](../../app/modules/life_inbox/service.py#L264)) : Ecarter un element : il quitte la file de revue et reste consultable dans les archives

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Élément écarté ».
- `result` : objet SourceItemOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `source_type` | string (énumération SourceType) | oui | valeurs : `manual`, `text`, `voice`, `document`, `image`, `email`, `calendar`, `share`, `link` | — |
| `origin` | string | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `body_text` | string (ou null) | oui | — | — |
| `status` | string (énumération SourceStatus) | oui | valeurs : `captured`, `processing`, `needs_review`, `converted`, `failed`, `archived`, `discarded` | — |
| `received_at` | string (date-time) | oui | — | — |
| `processing_error` | string (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Élément introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Cet élément est déjà traité » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-INB-006 — Réglages de la boîte de réception (adresse de transfert, expéditeurs)

| Élément | Valeur |
|---|---|
| Module | Boîte de réception universelle (`app/modules/life_inbox`, spéc. A) |
| Sous-module | Éléments de la boîte de réception |
| Méthode | `GET` |
| Chemin | `/api/v1/inbox/settings` |
| Fonction | `inbox_settings` — [app/modules/life_inbox/router.py:91](../../app/modules/life_inbox/router.py#L91) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_api_sans_test_auparavant) |
| Utilisée par l'interface web | oui (`src/modules/life_inbox/api.js`) |

**Description** (commentaire et docstring du code). Adresse de transfert et expediteurs autorises (INB-002)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-INB-007 — Modification des réglages de la boîte de réception

| Élément | Valeur |
|---|---|
| Module | Boîte de réception universelle (`app/modules/life_inbox`, spéc. A) |
| Sous-module | Éléments de la boîte de réception |
| Méthode | `PUT` |
| Chemin | `/api/v1/inbox/settings` |
| Fonction | `update_inbox_settings` — [app/modules/life_inbox/router.py:96](../../app/modules/life_inbox/router.py#L96) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_api_sans_test_auparavant, test_integrations, test_module_14_inbox) |
| Utilisée par l'interface web | oui (`src/modules/life_inbox/api.js`) |

**Description** (commentaire et docstring du code). Modification des réglages de la boîte de réception.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `SendersIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `allowed_senders` | liste de string | oui | éléments max. 50 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : allowed_senders : [f"Adresse ou domaine invalide : {', '.join(errors[:5])}"]
- Contrôle dans le code (422) : allowed_senders : [f'{MAX_ALLOWED_SENDERS} expéditeurs au plus']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `life_inbox.service.update_allowed_senders` ([app/modules/life_inbox/service.py:239](../../app/modules/life_inbox/service.py#L239)) : Liste des expediteurs autorises : adresses valides ou domaines (@exemple.com), sans doublon

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Expéditeurs enregistrés ».
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | « allowed_senders : [f"Adresse ou domaine invalide : {', '.join(errors[:5])}"] »; « allowed_senders : [f'{MAX_ALLOWED_SENDERS} expéditeurs au plus'] »; données ou paramètres invalides | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-INB-008 — Archivage d'un élément reçu

| Élément | Valeur |
|---|---|
| Module | Boîte de réception universelle (`app/modules/life_inbox`, spéc. A) |
| Sous-module | Éléments de la boîte de réception |
| Méthode | `DELETE` |
| Chemin | `/api/v1/source-items/{item_id}` |
| Fonction | `archive_item` — [app/modules/life_inbox/router.py:102](../../app/modules/life_inbox/router.py#L102) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/life_inbox/api.js`) |

**Description** (commentaire et docstring du code). Archivage d'un element

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `item_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `life_inbox.service.archive` ([app/modules/life_inbox/service.py:379](../../app/modules/life_inbox/service.py#L379))
  - Element de l'utilisateur marque archive

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Élément archive ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | non |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Élément introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Dépôt direct de documents

### API-INB-009 — Dépôt direct d'un document

| Élément | Valeur |
|---|---|
| Module | Boîte de réception universelle (`app/modules/life_inbox`, spéc. A) |
| Sous-module | Dépôt direct de documents |
| Méthode | `POST` |
| Chemin | `/api/v1/documents` |
| Fonction | `upload_document` — [app/modules/life_inbox/router.py:109](../../app/modules/life_inbox/router.py#L109) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 28 test(s) (test_api_sans_test_auparavant, test_cas_limites, test_conservation_bd3_dec14, test_fonctions_plan, test_inbox_reminders_actions, test_integrations, …) |
| Utilisée par l'interface web | oui (`src/modules/life_inbox/api.js`) |

**Description** (commentaire et docstring du code). Televersement d'un document (analyse par l'IA, ou simple conservation si analyze=false)

**État détaillé.**

- Dépendance non configurée (É-01) : Antivirus ClamAV (CLAMAV_HOST vide) : l'analyse est ignorée (SKIPPED), le fichier est traité sans antivirus.
- Dépendance non configurée (É-04) : OCR (fournisseur « google_cloud » désactivé) : un scan ou une photo reste illisible ; les PDF à texte sont lus.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `life_inbox.service._check_file`.
- Limitation de débit : 60 requêtes POST par minute et par adresse IP (préfixe `/api/v1/documents`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`multipart/form-data`, schéma `Body_upload_document_api_v1_documents_post`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `file` | fichier | oui | — | — |
| `analyze` | boolean | non | défaut `true` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : file : ['Fichier refusé : un logiciel malveillant a été détecté']
- Contrôle dans le code (422) : file : ['Le contenu du fichier ne correspond pas à son type']
- Contrôle dans le code (422) : file : ['Le fichier est vide']
- Contrôle dans le code (422) : file : ['Le fichier texte contient des données binaires']
- Contrôle dans le code (422) : file : ['Type de fichier non accepte (PDF, PNG, JPEG, WEBP ou texte)']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Lecture du fichier envoye
- Doublon : rien n'est cree ni facture, le document existant est renvoye (200)
- Fonction `life_inbox.service.upload_document` ([app/modules/life_inbox/service.py:150](../../app/modules/life_inbox/service.py#L150)) : analyze=True  : document de la boîte de réception, analyse par l'IA (compte dans le quota) ; analyze=False : simple conservation (coffre-fort), sans analyse ni consommation de quota. Retourne (element, document, doublon) ; un doublon ne cree rien et ne consomme pas de quota.
  - Validation du fichier (type, taille, contenu) avant toute recherche de doublon
  - Simple conservation : enregistrement du fichier sans analyse
  - Analyse demandee : consommation du quota de la formule
  - Type de source selon le fichier (image ou document)
  - Creation de l'element de la boite de reception
  - Enregistrement du fichier rattache a l'element, puis lancement de l'analyse

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Ce document est déjà enregistré : aucun nouvel envoi ».
- `result` : objet app__modules__life_inbox__schemas__UploadOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `document` | objet app__modules__life_inbox__schemas__DocumentOut | oui | — | — |
| `document.id` | string (uuid) | oui | — | — |
| `document.source_item_id` | string (uuid) (ou null) | oui | — | — |
| `document.original_filename` | string | oui | — | — |
| `document.mime_type` | string | oui | — | — |
| `document.size_bytes` | integer | oui | — | — |
| `document.scan_status` | string (énumération ScanStatus) | oui | valeurs : `pending`, `clean`, `infected`, `skipped` | — |
| `document.created_at` | string (date-time) | oui | — | — |
| `item` | objet SourceItemOut (ou null) | non | — | — |
| `item.id` | string (uuid) | oui | — | — |
| `item.source_type` | string (énumération SourceType) | oui | valeurs : `manual`, `text`, `voice`, `document`, `image`, `email`, `calendar`, `share`, `link` | — |
| `item.origin` | string | oui | — | — |
| `item.title` | string (ou null) | oui | — | — |
| `item.body_text` | string (ou null) | oui | — | — |
| `item.status` | string (énumération SourceStatus) | oui | valeurs : `captured`, `processing`, `needs_review`, `converted`, `failed`, `archived`, `discarded` | — |
| `item.received_at` | string (date-time) | oui | — | — |
| `item.processing_error` | string (ou null) | oui | — | — |
| `duplicate` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `201` | Créé | succès | oui (28) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `413` | Fichier trop volumineux | « Le fichier depasse {settings.max_upload_mb} Mo » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « file : ['Fichier refusé : un logiciel malveillant a été détecté'] »; « file : ['Le contenu du fichier ne correspond pas à son type'] »; « file : ['Le fichier est vide'] »; « file : ['Le fichier texte contient des données binaires'] »; « file : ['Type de fichier non accepte (PDF, PNG, JPEG, WEBP ou texte)'] » | oui (4) |
| `429` | Trop de requêtes | « Quota mensuel d'analyses de documents atteint pour votre formule »; limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-INB-010 — Suppression d'un document (corbeille)

| Élément | Valeur |
|---|---|
| Module | Boîte de réception universelle (`app/modules/life_inbox`, spéc. A) |
| Sous-module | Dépôt direct de documents |
| Méthode | `DELETE` |
| Chemin | `/api/v1/documents/{document_id}` |
| Fonction | `delete_document` — [app/modules/life_inbox/router.py:126](../../app/modules/life_inbox/router.py#L126) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 14 test(s) (test_lot3_documents, test_module_5_documents, test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Suppression d'un document : confirmation explicite obligatoire, purge apres 30 jours

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `manage_members` (propriétaire seulement) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `documents.service._visible`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |
| `confirm` | requête | boolean | non | défaut `false` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : confirm : ['La suppression doit être confirmée explicitement']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.delete_document` ([app/modules/documents/service.py:475](../../app/modules/documents/service.py#L475))
  - Proprietaire, ou administrateur du foyer pour un document partage
  - Retrait immediat de tous les liens ; le fichier et ses versions sont purges apres 30 jours

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Document supprimé ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (11) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous ne pouvez pas supprimer ce document » | oui (1) |
| `404` | Introuvable ou inaccessible | « Document introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Traitement en cours : la suppression sera possible lorsqu'il sera terminé » | oui (1) |
| `422` | Données invalides | « confirm : ['La suppression doit être confirmée explicitement'] »; données ou paramètres invalides | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-INB-011 — Téléchargement d'un document

| Élément | Valeur |
|---|---|
| Module | Boîte de réception universelle (`app/modules/life_inbox`, spéc. A) |
| Sous-module | Dépôt direct de documents |
| Méthode | `GET` |
| Chemin | `/api/v1/documents/{document_id}/download` |
| Fonction | `download_document` — [app/modules/life_inbox/router.py:207](../../app/modules/life_inbox/router.py#L207) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 6 test(s) (test_fonctions_plan, test_inbox_reminders_actions, test_module_5_documents, test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/life_inbox/api.js`) |

**Description** (commentaire et docstring du code). Telechargement d'un document (proprietaire uniquement), trace dans le journal d'audit

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `documents.service.require_file_access`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Memes controles que les liens signes : quarantaine et authentification recente
- Lecture du fichier dans le stockage et envoi en piece jointe (jamais mis en cache)
- Fonction `life_inbox.service.get_document` ([app/modules/life_inbox/service.py:371](../../app/modules/life_inbox/service.py#L371))
  - Requete : document demande ; il doit appartenir a l'utilisateur et ne pas etre supprime
- Fonction `documents.service.require_file_access` ([app/modules/documents/service.py:279](../../app/modules/documents/service.py#L279)) : Controles communs a toute lecture du fichier : quarantaine (423) et authentification recente (401)
  - Chaque acces a un document sensible est journalise (AC3)

**Réponse en cas de succès.**

- Réponse directe hors enveloppe possible (Response) : fichier, flux, redirection ou réponse sans contenu selon le cas (voir le code).
- Code HTTP **200**.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | « Confirmez votre mot de passe pour accéder à ce document sensible »; jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `404` | Introuvable ou inaccessible | « Document introuvable » | oui (3) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `423` | Verrouillé (quarantaine) | « Ce document est en quarantaine : son accès est bloqué » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Réception des e-mails transférés (webhooks)

### API-INB-012 — Webhook de réception d'un e-mail transféré

| Élément | Valeur |
|---|---|
| Module | Boîte de réception universelle (`app/modules/life_inbox`, spéc. A) |
| Sous-module | Réception des e-mails transférés (webhooks) |
| Méthode | `POST` |
| Chemin | `/api/v1/inbound/email` |
| Fonction | `inbound_email` — [app/modules/life_inbox/router.py:155](../../app/modules/life_inbox/router.py#L155) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 3 test(s) (test_integrations, test_module_14_inbox) |
| Utilisée par l'interface web | non |

**Description** (commentaire et docstring du code). Webhook du fournisseur d'e-mails entrants (format Postmark Inbound). Authentification : mot de passe HTTP Basic ou ?token= egal à INBOUND_EMAIL_SECRET.

**État détaillé.**

- Dépendance non configurée (É-07) : Réception des e-mails transférés (INBOUND_EMAIL_SECRET vide, aucun MX) : aucun appel réel possible.

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle propre à cette route : Secret partagé `INBOUND_EMAIL_SECRET`, fourni dans l'URL (`?token=`) ou en mot de passe HTTP Basic ; refus 401 « Webhook non autorisé » si le secret est absent ou faux (toujours refusé tant que le secret n'est pas configuré).
- Contrôles d'accès et de propriété appelés dans le code : `life_inbox.router._inbound_authorized`.
- Limitation de débit : 120 requêtes POST par minute et par adresse IP (préfixe `/api/v1/inbound/`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.
- Contrôle dans le code (422) : file : ['Fichier refusé : un logiciel malveillant a été détecté']
- Contrôle dans le code (422) : file : ['Le contenu du fichier ne correspond pas à son type']
- Contrôle dans le code (422) : file : ['Le fichier est vide']
- Contrôle dans le code (422) : file : ['Le fichier texte contient des données binaires']
- Contrôle dans le code (422) : file : ['Type de fichier non accepte (PDF, PNG, JPEG, WEBP ou texte)']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Refus si le secret ne correspond pas
- Contenu JSON envoye par Postmark et domaine de reception configure
- Destinataires du message ; l'alias est la partie avant @ de l'adresse a notre domaine
- Decodage des pieces jointes (base64) ; une piece jointe illisible est ignoree
- Creation de l'element (et de ses documents) pour l'utilisateur de l'alias
- Indicateur anti-spam du fournisseur (en-tete X-Spam-Status : Yes)
- toujours 200 : le fournisseur ne doit pas reessayer un destinataire inconnu
- Fonction `life_inbox.service.receive_email` ([app/modules/life_inbox/service.py:304](../../app/modules/life_inbox/service.py#L304)) : E-mail transfere à l'adresse personnelle u-xxxx@<domaine> : créé un élément de la boîte de réception avec ses pieces jointes, puis lance l'analyse. Le contenu reste une donnée : aucune action n'est declenchee.
  - Compte actif correspondant a l'alias (user_profiles.preferences["inbox"]["alias"]) ; inconnu -> message ignore.
  - Message recu sans utilisateur connecte : recherche sous le role du worker, puis traitement au nom du titulaire
  - Anti-abus (INB-002) : expediteur autorise, message non marque comme indesirable, volume journalier limite
  - Consommation du quota d'analyses (l'e-mail est conserve meme si le quota est atteint)
  - quota atteint : l'e-mail est conserve, l'analyse sera relancee par l'utilisateur
  - Creation de l'element : expediteur, objet et texte (tronques)
  - Pieces jointes (10 au plus) enregistrees comme documents de l'element
  - piece jointe refusee : l'e-mail est quand meme conserve
  - Lancement de l'analyse si le quota le permet
  - Trace d'audit puis enregistrement
- Fonction `life_inbox.router._inbound_authorized` ([app/modules/life_inbox/router.py:139](../../app/modules/life_inbox/router.py#L139))
  - Secret fourni dans l'URL (?token=) ou, a defaut, en mot de passe HTTP Basic
  - Comparaison a temps constant

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Destinataire inconnu : message ignoré ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (10) |
| `401` | Non authentifié ou session invalide | « Webhook non autorisé » | oui (1) |
| `413` | Fichier trop volumineux | « Le fichier depasse {settings.max_upload_mb} Mo » | non |
| `422` | Données invalides | « file : ['Fichier refusé : un logiciel malveillant a été détecté'] »; « file : ['Le contenu du fichier ne correspond pas à son type'] »; « file : ['Le fichier est vide'] »; « file : ['Le fichier texte contient des données binaires'] »; « file : ['Type de fichier non accepte (PDF, PNG, JPEG, WEBP ou texte)'] » | non |
| `429` | Trop de requêtes | « Quota mensuel d'analyses de documents atteint pour votre formule »; limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-INB-013 — Webhook des événements d'envoi d'e-mails (rebonds, plaintes)

| Élément | Valeur |
|---|---|
| Module | Boîte de réception universelle (`app/modules/life_inbox`, spéc. A) |
| Sous-module | Réception des e-mails transférés (webhooks) |
| Méthode | `POST` |
| Chemin | `/api/v1/inbound/email-events` |
| Fonction | `email_events` — [app/modules/life_inbox/router.py:192](../../app/modules/life_inbox/router.py#L192) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_9_notifications) |
| Utilisée par l'interface web | non |

**Description** (commentaire et docstring du code). Rejets et remises signales par le fournisseur d'e-mails (format Postmark)

**État détaillé.**

- Dépendance non configurée (É-07) : Réception des e-mails transférés (INBOUND_EMAIL_SECRET vide, aucun MX) : aucun appel réel possible.
- Dépendance non configurée (É-02) : Relais d'e-mails (MAIL_HOST vide) : les e-mails sont seulement journalisés, aucun n'est envoyé.

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle propre à cette route : Secret partagé `INBOUND_EMAIL_SECRET` (`?token=` ou HTTP Basic) ; refus 401 « Webhook non autorisé ».
- Contrôles d'accès et de propriété appelés dans le code : `life_inbox.router._inbound_authorized`.
- Limitation de débit : 120 requêtes POST par minute et par adresse IP (préfixe `/api/v1/inbound/`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `reminders.service.record_provider_event` ([app/modules/reminders/service.py:869](../../app/modules/reminders/service.py#L869)) : Rejet ou remise signale par le fournisseur : seule source du statut delivered pour un e-mail (NOT-006 AC2). Webhook sans utilisateur connecte : traite par le role du worker.
  - Journal en ajout seul : la confirmation ou le rejet est un nouvel essai
- Fonction `life_inbox.router._inbound_authorized` ([app/modules/life_inbox/router.py:139](../../app/modules/life_inbox/router.py#L139))
  - Secret fourni dans l'URL (?token=) ou, a defaut, en mot de passe HTTP Basic
  - Comparaison a temps constant

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Événement reçu ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | « Webhook non autorisé » | oui (1) |
| `429` | Trop de requêtes | limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
