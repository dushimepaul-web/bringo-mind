<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Intelligence documentaire

Dossier du code : [app/modules/document_intelligence/](../../app/modules/document_intelligence/) · lettre ou numéro de la spécification : **B** · priorité **1** · documentation générée le 19/11/2026 17:30.

**5 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 5 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 0 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Revue des extractions**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-EXT-001](#api-ext-001--liste-des-extractions-à-revoir) | GET | `/api/v1/extractions` | Liste des extractions à revoir | Terminée et opérationnelle | oui |
| [API-EXT-002](#api-ext-002--détail-dune-extraction) | GET | `/api/v1/extractions/{extraction_id}` | Détail d'une extraction | Terminée et opérationnelle | oui |
| [API-EXT-003](#api-ext-003--correction-dun-champ-extrait) | PATCH | `/api/v1/extractions/{extraction_id}/fields` | Correction d'un champ extrait | Terminée et opérationnelle | oui |
| [API-EXT-004](#api-ext-004--confirmation-dune-extraction-création-des-tâches) | POST | `/api/v1/extractions/{extraction_id}/confirm` | Confirmation d'une extraction (création des tâches) | Terminée et opérationnelle | oui |
| [API-EXT-005](#api-ext-005--rejet-dune-extraction) | POST | `/api/v1/extractions/{extraction_id}/reject` | Rejet d'une extraction | Terminée et opérationnelle | oui |

## Sous-module : Revue des extractions

### API-EXT-001 — Liste des extractions à revoir

| Élément | Valeur |
|---|---|
| Module | Intelligence documentaire (`app/modules/document_intelligence`, spéc. B) |
| Sous-module | Revue des extractions |
| Méthode | `GET` |
| Chemin | `/api/v1/extractions` |
| Fonction | `list_extractions` — [app/modules/document_intelligence/router.py:19](../../app/modules/document_intelligence/router.py#L19) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 21 test(s) (test_inbox_reminders_actions, test_integrations, test_module_2_dashboard, test_module_5_documents, test_parcours, test_phase2_idempotence, …) |
| Utilisée par l'interface web | oui (`src/modules/document_intelligence/api.js`) |

**Description** (commentaire et docstring du code). Extractions d'un element de la boite de reception, les plus recentes d'abord

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `source_item_id` | requête | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : extractions de l'utilisateur pour cet element

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet ExtractionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `source_item_id` | string (uuid) | oui | — | — |
| `document_id` | string (uuid) (ou null) | oui | — | — |
| `provider` | string | oui | — | — |
| `model` | string (ou null) | oui | — | — |
| `document_type` | string (ou null) | oui | — | — |
| `issuer` | string (ou null) | oui | — | — |
| `fields` | liste de quelconque | oui | — | — |
| `proposed_tasks` | liste de quelconque | oui | — | — |
| `confidence` | number (ou null) | oui | — | — |
| `review_status` | string (énumération ReviewStatus) | oui | valeurs : `pending`, `confirmed`, `rejected`, `not_required` | — |
| `reviewed_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `requires_review` | boolean | non | défaut `false` | — |
| `field_history` | liste de quelconque | non | défaut `[]` | — |
| `version_id` | string (uuid) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (22) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-EXT-002 — Détail d'une extraction

| Élément | Valeur |
|---|---|
| Module | Intelligence documentaire (`app/modules/document_intelligence`, spéc. B) |
| Sous-module | Revue des extractions |
| Méthode | `GET` |
| Chemin | `/api/v1/extractions/{extraction_id}` |
| Fonction | `get_extraction` — [app/modules/document_intelligence/router.py:29](../../app/modules/document_intelligence/router.py#L29) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/document_intelligence/api.js`) |

**Description** (commentaire et docstring du code). Detail d'une extraction

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `extraction_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `document_intelligence.service.get_extraction` ([app/modules/document_intelligence/service.py:173](../../app/modules/document_intelligence/service.py#L173))
  - Requete : extraction demandee ; seul son proprietaire y a acces

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet ExtractionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `source_item_id` | string (uuid) | oui | — | — |
| `document_id` | string (uuid) (ou null) | oui | — | — |
| `provider` | string | oui | — | — |
| `model` | string (ou null) | oui | — | — |
| `document_type` | string (ou null) | oui | — | — |
| `issuer` | string (ou null) | oui | — | — |
| `fields` | liste de quelconque | oui | — | — |
| `proposed_tasks` | liste de quelconque | oui | — | — |
| `confidence` | number (ou null) | oui | — | — |
| `review_status` | string (énumération ReviewStatus) | oui | valeurs : `pending`, `confirmed`, `rejected`, `not_required` | — |
| `reviewed_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `requires_review` | boolean | non | défaut `false` | — |
| `field_history` | liste de quelconque | non | défaut `[]` | — |
| `version_id` | string (uuid) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | non |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Extraction introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-EXT-003 — Correction d'un champ extrait

| Élément | Valeur |
|---|---|
| Module | Intelligence documentaire (`app/modules/document_intelligence`, spéc. B) |
| Sous-module | Revue des extractions |
| Méthode | `PATCH` |
| Chemin | `/api/v1/extractions/{extraction_id}/fields` |
| Fonction | `correct_field` — [app/modules/document_intelligence/router.py:35](../../app/modules/document_intelligence/router.py#L35) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/document_intelligence/api.js`) |

**Description** (commentaire et docstring du code). Correction d'un champ extrait, avant la decision

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `documents.processing._checked`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `extraction_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `FieldCorrectionIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `name` | string | oui | longueur max. 48 | — |
| `value` | string (ou null) | non | longueur max. 500 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : value : ['Valeur invalide pour ce champ']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `document_intelligence.service.correct_field` ([app/modules/document_intelligence/service.py:229](../../app/modules/document_intelligence/service.py#L229)) : Correction d'un champ : la valeur d'origine est conservee dans l'historique (AC2)
  - Format verifie par l'application selon la nature du champ
- Fonction `document_intelligence.service.get_extraction` ([app/modules/document_intelligence/service.py:173](../../app/modules/document_intelligence/service.py#L173))
  - Requete : extraction demandee ; seul son proprietaire y a acces

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Valeur corrigée ».
- `result` : objet ExtractionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `source_item_id` | string (uuid) | oui | — | — |
| `document_id` | string (uuid) (ou null) | oui | — | — |
| `provider` | string | oui | — | — |
| `model` | string (ou null) | oui | — | — |
| `document_type` | string (ou null) | oui | — | — |
| `issuer` | string (ou null) | oui | — | — |
| `fields` | liste de quelconque | oui | — | — |
| `proposed_tasks` | liste de quelconque | oui | — | — |
| `confidence` | number (ou null) | oui | — | — |
| `review_status` | string (énumération ReviewStatus) | oui | valeurs : `pending`, `confirmed`, `rejected`, `not_required` | — |
| `reviewed_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `requires_review` | boolean | non | défaut `false` | — |
| `field_history` | liste de quelconque | non | défaut `[]` | — |
| `version_id` | string (uuid) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Champ introuvable »; « Extraction introuvable » | non |
| `409` | Conflit avec l'état actuel | « Une décision a déjà été prise pour cette extraction » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « value : ['Valeur invalide pour ce champ'] » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-EXT-004 — Confirmation d'une extraction (création des tâches)

| Élément | Valeur |
|---|---|
| Module | Intelligence documentaire (`app/modules/document_intelligence`, spéc. B) |
| Sous-module | Revue des extractions |
| Méthode | `POST` |
| Chemin | `/api/v1/extractions/{extraction_id}/confirm` |
| Fonction | `confirm` — [app/modules/document_intelligence/router.py:42](../../app/modules/document_intelligence/router.py#L42) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 15 test(s) (test_inbox_reminders_actions, test_module_2_dashboard, test_module_5_documents, test_parcours, test_phase2_idempotence, test_reporting, …) |
| Utilisée par l'interface web | oui (`src/modules/document_intelligence/api.js`) |

**Description** (commentaire et docstring du code). Confirmation : creation des taches retenues (eventuellement corrigees)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `assign_tasks` (propriétaire, membre) ; `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `extraction_id` | chemin | string (uuid) | oui | — | — |
| `Idempotency-Key` | en-tête | string (ou null) | non | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`application/json`, schéma `ConfirmIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `tasks` | liste de objet TaskIn | oui | éléments min. 1 ; éléments max. 20 | — |
| `tasks[].description` | string (ou null) | non | longueur max. 10000 | — |
| `tasks[].category` | string (ou null) | non | longueur max. 48 | — |
| `tasks[].priority` | string (énumération TaskPriority) (ou null) | non | valeurs : `low`, `normal`, `high`, `critical` | — |
| `tasks[].due_date` | string (date) (ou null) | non | — | — |
| `tasks[].due_time` | string (time) (ou null) | non | — | — |
| `tasks[].timezone` | string (ou null) | non | — | — |
| `tasks[].estimated_minutes` | integer (ou null) | non | min. 1.0 ; max. 43200.0 | — |
| `tasks[].recurrence_rule` | string (ou null) | non | — | — |
| `tasks[].household_id` | string (uuid) (ou null) | non | — | — |
| `tasks[].assignee_id` | string (uuid) (ou null) | non | — | — |
| `tasks[].reminder_offsets` | liste de integer (ou null) | non | éléments max. 5 | — |
| `tasks[].title` | string | oui | longueur min. 1 ; longueur max. 255 | — |
| `tasks[].status` | string (énumération TaskStatus) | non | valeurs : `needs_review`, `planned`, `in_progress`, `completed`, `cancelled`, `archived`, `inbox`, `deferred`, `blocked` ; défaut `"planned"` | — |
| `tasks[].depends_on` | liste de string (uuid) | non | défaut `[]` | — |
| `tasks[].origin` | string | non | valeurs : `manual`, `ai_extraction`, `email` ; défaut `"manual"` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `TaskIn._rrule` (champ(s) recurrence_rule) ([app/modules/tasks/schemas.py:30](../../app/modules/tasks/schemas.py#L30)) : Validation d'une regle de recurrence iCalendar (RRULE) ; renvoie la regle nettoyee Le prefixe "RRULE:" eventuel est retire Sous-ensemble accepte : frequences quotidienne a annuelle et parties utiles de la RFC 5545 La regle doit pouvoir etre interpretee par dateutil — refus (422) : « règle de récurrence invalide (format iCalendar RRULE, ex. FREQ=MONTHLY;BYMONTHDAY=25) » ; « fréquence de récurrence trop rapprochée »
- Validateur `TaskIn._tz` (champ(s) timezone) ([app/modules/tasks/schemas.py:51](../../app/modules/tasks/schemas.py#L51)) : Validation d'un fuseau horaire (None accepte) — refus (422) : « fuseau horaire inconnu »
- Validateur `TaskIn._priority` (champ(s) priority) ([app/modules/tasks/schemas.py:19](../../app/modules/tasks/schemas.py#L19)) : Priorite : de 1 a 4, ou son nom ; toute autre valeur est refusee — refus (422) : « priorité hors plage (1 à 4) »
- Validateur `TaskIn.check_offsets` (champ(s) reminder_offsets) ([app/modules/tasks/schemas.py:93](../../app/modules/tasks/schemas.py#L93)) : Delais de rappel : positifs, 60 jours au plus, sans doublon, du plus lointain au plus proche — refus (422) : « délai de rappel invalide (minutes avant l'échéance, au plus 60 jours) »
- Validateur `TaskIn.title_not_blank` (champ(s) title) ([app/modules/tasks/schemas.py:110](../../app/modules/tasks/schemas.py#L110)) : Un titre fait d'espaces est un titre manquant — refus (422) : « le titre est obligatoire »
- Validateur `TaskIn.initial_status` (champ(s) status) ([app/modules/tasks/schemas.py:118](../../app/modules/tasks/schemas.py#L118)) : Une tache ne peut pas etre creee dans un etat final ou d'attente : ces etats passent par la matrice — refus (422) : « statut initial non autorisé »
- Validateur `TaskIn.category_alias` (modèle entier) ([app/modules/tasks/schemas.py:85](../../app/modules/tasks/schemas.py#L85)) : category_id (nom de la specification) et category (nom historique) designent la meme information
- Contrôle dans le code (422) : assignee_id : ["Cette personne n'est pas membre du foyer"]
- Contrôle dans le code (422) : assignee_id : ['Seule une tâche partagée avec un foyer peut être attribuée']
- Contrôle dans le code (422) : due_date : ["Une heure d'échéance nécessite une date"]
- Contrôle dans le code (422) : due_date : ['Une tâche récurrente nécessite une date de départ']
- Contrôle dans le code (422) : recurrence_rule : ['Cette règle ne produit aucune date']
- Contrôle dans le code (422) : tasks : ["Confirmez au moins une tâche, ou rejetez l'extraction"]

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- A5 : confirmation rejouee avec la meme cle -> memes taches, sans doublon ni erreur (sans cle : 409 inchange)
- Fonction `document_intelligence.service.get_extraction` ([app/modules/document_intelligence/service.py:173](../../app/modules/document_intelligence/service.py#L173))
  - Requete : extraction demandee ; seul son proprietaire y a acces
- Fonction `document_intelligence.service.confirmed_with_key` ([app/modules/document_intelligence/service.py:189](../../app/modules/document_intelligence/service.py#L189)) : A5 : confirmation deja faite avec cette cle -> taches alors creees (requete rejouee), sinon None
- Fonction `document_intelligence.service.confirm` ([app/modules/document_intelligence/service.py:203](../../app/modules/document_intelligence/service.py#L203)) : Crée les tâches validées (éventuellement corrigées) par l'utilisateur
  - Une extraction ne peut etre traitee qu'une fois
  - Creation des taches confirmees, liees a l'element et a l'extraction d'origine
  - Cle d'idempotence facultative, rangee avec chaque tache (prefixe « extraction: » : jamais confondue avec POST /tasks)
  - Extraction confirmee : auteur, date et indicateur de correction
  - Requete : l'element d'origine passe a l'etat "converti"
  - Trace d'audit puis enregistrement

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Extraction déjà confirmée », « {len(created)} tâche(s) créée(s) ».
- `result` : liste de objet TaskOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `owner_id` | string (uuid) | oui | — | — |
| `household_id` | string (uuid) (ou null) | oui | — | — |
| `assignee_id` | string (uuid) (ou null) | oui | — | — |
| `assignment_status` | string (énumération AssignmentStatus) (ou null) | oui | valeurs : `pending`, `accepted`, `rejected` | — |
| `title` | string | oui | — | — |
| `description` | string (ou null) | oui | — | — |
| `category` | string (ou null) | oui | — | — |
| `priority` | string (énumération TaskPriority) | oui | valeurs : `low`, `normal`, `high`, `critical` | — |
| `status` | string (énumération TaskStatus) | oui | valeurs : `needs_review`, `planned`, `in_progress`, `completed`, `cancelled`, `archived`, `inbox`, `deferred`, `blocked` | — |
| `due_at` | string (date-time) (ou null) | oui | — | — |
| `due_all_day` | boolean | oui | — | — |
| `due_date` | string (date) (ou null) | non | — | — |
| `due_time` | string (time) (ou null) | non | — | — |
| `timezone` | string | oui | — | — |
| `estimated_minutes` | integer (ou null) | oui | — | — |
| `recurrence_rule` | string (ou null) | oui | — | — |
| `recurrence_parent_id` | string (uuid) (ou null) | oui | — | — |
| `origin` | string (énumération TaskOrigin) | oui | valeurs : `manual`, `ai_extraction`, `document`, `email`, `voice`, `calendar`, `recurrence` | — |
| `source_item_id` | string (uuid) (ou null) | oui | — | — |
| `extraction_id` | string (uuid) (ou null) | oui | — | — |
| `is_confirmed` | boolean | oui | — | — |
| `version` | integer | non | défaut `1` | — |
| `priority_level` | integer | non | défaut `2` | — |
| `archived_at` | string (date-time) (ou null) | non | — | — |
| `deleted_at` | string (date-time) (ou null) | non | — | — |
| `status_reason` | string (ou null) | non | — | — |
| `recurrence_rule_id` | string (uuid) (ou null) | non | — | — |
| `occurrence_at` | string (date-time) (ou null) | non | — | — |
| `is_exception` | boolean | non | défaut `false` | — |
| `source_deleted` | boolean | non | défaut `false` | — |
| `source_email_id` | string (uuid) (ou null) | non | — | — |
| `completion_proof_id` | string (uuid) (ou null) | non | — | — |
| `completed_at` | string (date-time) (ou null) | oui | — | — |
| `completion_note` | string (ou null) | oui | — | — |
| `reminder_offsets` | liste de integer (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `updated_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (10) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Catégorie introuvable »; « Extraction introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Une décision a déjà été prise pour cette extraction » | oui (4) |
| `422` | Données invalides | « assignee_id : ["Cette personne n'est pas membre du foyer"] »; « assignee_id : ['Seule une tâche partagée avec un foyer peut être attribuée'] »; données ou paramètres invalides; « due_date : ["Une heure d'échéance nécessite une date"] »; « due_date : ['Une tâche récurrente nécessite une date de départ'] »; « recurrence_rule : ['Cette règle ne produit aucune date'] »; « tasks : ["Confirmez au moins une tâche, ou rejetez l'extraction"] » | oui (7) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-EXT-005 — Rejet d'une extraction

| Élément | Valeur |
|---|---|
| Module | Intelligence documentaire (`app/modules/document_intelligence`, spéc. B) |
| Sous-module | Revue des extractions |
| Méthode | `POST` |
| Chemin | `/api/v1/extractions/{extraction_id}/reject` |
| Fonction | `reject` — [app/modules/document_intelligence/router.py:55](../../app/modules/document_intelligence/router.py#L55) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_5_documents, test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/document_intelligence/api.js`) |

**Description** (commentaire et docstring du code). Rejet de l'extraction (aucune tache creee)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `extraction_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `document_intelligence.service.reject` ([app/modules/document_intelligence/service.py:249](../../app/modules/document_intelligence/service.py#L249))
  - Une extraction ne peut etre traitee qu'une fois
  - Extraction rejetee : auteur, date, trace d'audit
- Fonction `document_intelligence.service.get_extraction` ([app/modules/document_intelligence/service.py:173](../../app/modules/document_intelligence/service.py#L173))
  - Requete : extraction demandee ; seul son proprietaire y a acces

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Extraction rejetée ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | non |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Extraction introuvable » | non |
| `409` | Conflit avec l'état actuel | « Une décision a déjà été prise pour cette extraction » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
