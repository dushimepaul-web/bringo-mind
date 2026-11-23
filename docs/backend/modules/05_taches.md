<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Gestion des tâches et obligations

Dossier du code : [app/modules/tasks/](../../app/modules/tasks/) · lettre ou numéro de la spécification : **C** · priorité **1** · documentation générée le 19/11/2026 17:30.

**19 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 19 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 0 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Catégories de tâches**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-TSK-001](#api-tsk-001--liste-des-catégories-de-tâches) | GET | `/api/v1/categories` | Liste des catégories de tâches | Terminée et opérationnelle | oui |
| [API-TSK-002](#api-tsk-002--création-dune-catégorie-de-tâches) | POST | `/api/v1/categories` | Création d'une catégorie de tâches | Terminée et opérationnelle | oui |
| [API-TSK-003](#api-tsk-003--renommage-dune-catégorie-de-tâches) | PATCH | `/api/v1/categories/{category_id}` | Renommage d'une catégorie de tâches | Terminée et opérationnelle | oui |
| [API-TSK-004](#api-tsk-004--suppression-dune-catégorie-de-tâches) | DELETE | `/api/v1/categories/{category_id}` | Suppression d'une catégorie de tâches | Terminée et opérationnelle | oui |

**Tâches**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-TSK-005](#api-tsk-005--liste-et-recherche-des-tâches) | GET | `/api/v1/tasks` | Liste et recherche des tâches | Terminée et opérationnelle | oui |
| [API-TSK-006](#api-tsk-006--création-dune-tâche) | POST | `/api/v1/tasks` | Création d'une tâche | Terminée et opérationnelle | oui |
| [API-TSK-008](#api-tsk-008--fiche-dune-tâche) | GET | `/api/v1/tasks/{task_id}` | Fiche d'une tâche | Terminée et opérationnelle | oui |
| [API-TSK-009](#api-tsk-009--modification-dune-tâche) | PATCH | `/api/v1/tasks/{task_id}` | Modification d'une tâche | Terminée et opérationnelle | oui |
| [API-TSK-010](#api-tsk-010--suppression-dune-tâche-corbeille) | DELETE | `/api/v1/tasks/{task_id}` | Suppression d'une tâche (corbeille) | Terminée et opérationnelle | oui |
| [API-TSK-012](#api-tsk-012--archivage-dune-tâche) | POST | `/api/v1/tasks/{task_id}/archive` | Archivage d'une tâche | Terminée et opérationnelle | oui |
| [API-TSK-013](#api-tsk-013--désarchivage-dune-tâche) | POST | `/api/v1/tasks/{task_id}/unarchive` | Désarchivage d'une tâche | Terminée et opérationnelle | oui |
| [API-TSK-014](#api-tsk-014--achèvement-dune-tâche) | POST | `/api/v1/tasks/{task_id}/complete` | Achèvement d'une tâche | Terminée et opérationnelle | oui |
| [API-TSK-016](#api-tsk-016--confirmation-dune-tâche-proposée) | POST | `/api/v1/tasks/{task_id}/confirm` | Confirmation d'une tâche proposée | Terminée et opérationnelle | oui |

**Corbeille**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-TSK-007](#api-tsk-007--corbeille-des-tâches) | GET | `/api/v1/tasks/trash` | Corbeille des tâches | Terminée et opérationnelle | oui |
| [API-TSK-011](#api-tsk-011--restauration-dune-tâche-supprimée) | POST | `/api/v1/tasks/{task_id}/restore` | Restauration d'une tâche supprimée | Terminée et opérationnelle | oui |

**Récurrences**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-TSK-015](#api-tsk-015--prochaines-occurrences-dune-tâche-récurrente) | GET | `/api/v1/tasks/{task_id}/occurrences` | Prochaines occurrences d'une tâche récurrente | Terminée et opérationnelle | oui |

**Attribution**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-TSK-017](#api-tsk-017--réponse-à-une-attribution-accepter-ou-refuser) | POST | `/api/v1/tasks/{task_id}/assignment` | Réponse à une attribution (accepter ou refuser) | Terminée et opérationnelle | oui |

**Historique**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-TSK-018](#api-tsk-018--historique-dune-tâche) | GET | `/api/v1/tasks/{task_id}/history` | Historique d'une tâche | Terminée et opérationnelle | oui |

**Tâches du foyer**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-TSK-019](#api-tsk-019--tâches-partagées-dun-foyer) | GET | `/api/v1/households/{household_id}/tasks` | Tâches partagées d'un foyer | Terminée et opérationnelle | oui |

## Sous-module : Catégories de tâches

### API-TSK-001 — Liste des catégories de tâches

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Catégories de tâches |
| Méthode | `GET` |
| Chemin | `/api/v1/categories` |
| Fonction | `list_categories` — [app/modules/tasks/router.py:179](../../app/modules/tasks/router.py#L179) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 6 test(s) (test_i18n_extensible, test_lot4_taches_et_rappels, test_module_4_tasks) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Liste des catégories de tâches.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : categories dans leur ordre d'affichage
- Categories proposees par l'application (code enregistre dans categories.name pour chaque utilisateur), puis categories personnelles de l'utilisateur
- Fonction `tasks.service.custom_categories` ([app/modules/tasks/service.py:125](../../app/modules/tasks/service.py#L125)) : Categories creees par l'utilisateur (les codes proposes par l'application en sont exclus)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet app__modules__tasks__router__CategoryOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string | oui | — | — |
| `name` | string | oui | — | — |
| `custom` | boolean (ou null) | non | — | — |
| `custom_id` | string (uuid) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (7) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-TSK-002 — Création d'une catégorie de tâches

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Catégories de tâches |
| Méthode | `POST` |
| Chemin | `/api/v1/categories` |
| Fonction | `create_category` — [app/modules/tasks/router.py:189](../../app/modules/tasks/router.py#L189) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 5 test(s) (test_lot4_taches_et_rappels) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Création d'une catégorie de tâches.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `CategoryNameIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `name` | string | oui | longueur min. 1 ; longueur max. 48 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : name : ['48 caractères au maximum']
- Contrôle dans le code (422) : name : ['Le nom de la catégorie est obligatoire']

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Catégorie créée ».
- `result` : objet app__modules__tasks__router__CategoryOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string | oui | — | — |
| `name` | string | oui | — | — |
| `custom` | boolean (ou null) | non | — | — |
| `custom_id` | string (uuid) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `409` | Conflit avec l'état actuel | « Cette catégorie existe déjà » | oui (4) |
| `422` | Données invalides | données ou paramètres invalides; « name : ['48 caractères au maximum'] »; « name : ['Le nom de la catégorie est obligatoire'] » | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-TSK-003 — Renommage d'une catégorie de tâches

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Catégories de tâches |
| Méthode | `PATCH` |
| Chemin | `/api/v1/categories/{category_id}` |
| Fonction | `rename_category` — [app/modules/tasks/router.py:194](../../app/modules/tasks/router.py#L194) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_lot4_taches_et_rappels) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Renommage d'une catégorie de tâches.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service._own_custom_category`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `category_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `CategoryNameIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `name` | string | oui | longueur min. 1 ; longueur max. 48 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : name : ['48 caractères au maximum']
- Contrôle dans le code (422) : name : ['Le nom de la catégorie est obligatoire']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Renommage : les taches gardent leur categorie

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Catégorie renommée ».
- `result` : objet app__modules__tasks__router__CategoryOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string | oui | — | — |
| `name` | string | oui | — | — |
| `custom` | boolean (ou null) | non | — | — |
| `custom_id` | string (uuid) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Catégorie introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Cette catégorie existe déjà »; « Les catégories proposées par l'application ne peuvent pas être modifiées » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « name : ['48 caractères au maximum'] »; « name : ['Le nom de la catégorie est obligatoire'] » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-TSK-004 — Suppression d'une catégorie de tâches

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Catégories de tâches |
| Méthode | `DELETE` |
| Chemin | `/api/v1/categories/{category_id}` |
| Fonction | `delete_category` — [app/modules/tasks/router.py:200](../../app/modules/tasks/router.py#L200) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_lot4_taches_et_rappels) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Suppression d'une catégorie de tâches.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service._own_custom_category`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `category_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Suppression : les taches concernees deviennent sans categorie
- Fonction `tasks.service.delete_category` ([app/modules/tasks/service.py:176](../../app/modules/tasks/service.py#L176)) : Suppression : les taches concernees deviennent sans categorie (categories -> ON DELETE SET NULL)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Catégorie supprimée ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Catégorie introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Les catégories proposées par l'application ne peuvent pas être modifiées » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Tâches

### API-TSK-005 — Liste et recherche des tâches

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Tâches |
| Méthode | `GET` |
| Chemin | `/api/v1/tasks` |
| Fonction | `list_tasks` — [app/modules/tasks/router.py:208](../../app/modules/tasks/router.py#L208) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 34 test(s) (test_accounts, test_cas_limites, test_lot4_taches_et_rappels, test_lot6_assistant_voix_api, test_module_12_administration, test_module_3_assistant, …) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Liste des taches visibles, avec filtres combines, tri et pagination

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `status` | requête | liste de string (énumération TaskStatus) | non | valeurs : `needs_review`, `planned`, `in_progress`, `completed`, `cancelled`, `archived`, `inbox`, `deferred`, `blocked` | — |
| `priority` | requête | string (énumération TaskPriority) ou integer (ou null) | non | — | — |
| `category` | requête | string (ou null) | non | — | — |
| `category_id` | requête | string (ou null) | non | — | — |
| `household_id` | requête | string (uuid) (ou null) | non | — | — |
| `origin` | requête | string (énumération TaskOrigin) (ou null) | non | valeurs : `manual`, `ai_extraction`, `document`, `email`, `voice`, `calendar`, `recurrence` | — |
| `q` | requête | string (ou null) | non | longueur max. 200 | — |
| `search` | requête | string (ou null) | non | — | — |
| `due_before` | requête | string (date-time) (ou null) | non | — | — |
| `due_after` | requête | string (date-time) (ou null) | non | — | — |
| `due_from` | requête | string (date) (ou null) | non | — | — |
| `due_to` | requête | string (date) (ou null) | non | — | — |
| `confirmed` | requête | boolean (ou null) | non | — | — |
| `archived` | requête | boolean | non | défaut `false` | — |
| `scope` | requête | string | non | motif `^(all\|personal\|shared\|assigned)$` ; défaut `"all"` | — |
| `sort` | requête | string (ou null) | non | valeurs : `due_at`, `priority`, `created_at` | — |
| `limit` | requête | integer (ou null) | non | min. 1 ; max. 100 | — |
| `cursor` | requête | string (ou null) | non | longueur max. 500 | — |
| `page` | requête | integer | non | min. 1 ; défaut `1` | — |
| `page_size` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : cursor : ['Curseur invalide']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Priorite donnee de 1 a 4 ou par son nom
- Requete de base : taches non supprimees visibles par l'utilisateur ; archives exclues par defaut
- Portee choisie
- Bornes d'echeance : une date sans fuseau est lue dans le fuseau de l'utilisateur
- Pagination historique par numero de page, sauf si un tri ou un curseur est demande
- Requete : une tache de plus que demande, pour savoir s'il reste une page
- Fonction `tasks.router._reject_unknown` ([app/modules/tasks/router.py:43](../../app/modules/tasks/router.py#L43))
  - Parametre inconnu : 422, plutot qu'un filtre silencieusement ignore
- Fonction `tasks.router._filtered` ([app/modules/tasks/router.py:63](../../app/modules/tasks/router.py#L63))
  - Fuseau de l'utilisateur : les dates de filtre sont des dates locales
  - Recherche dans le titre et la description (insensible a la casse)
  - Echeance a partir du debut du jour "du" et jusqu'a la fin du jour "au"
- Fonction `tasks.service.visible_filter` ([app/modules/tasks/service.py:69](../../app/modules/tasks/service.py#L69))
  - Condition SQL des taches visibles : creees par l'utilisateur, attribuees a lui, ou partagees avec un de ses foyers
- Fonction `tasks.router._search` ([app/modules/tasks/router.py:50](../../app/modules/tasks/router.py#L50))
  - Mots de la recherche ; sans mot exploitable, aucun resultat
  - Recherche par prefixe : « fact » trouve « facture », « factures » aussi (racine francaise)
  - Autre base (tests) : chaque mot doit apparaitre
- Fonction `tasks.router._page` ([app/modules/tasks/router.py:151](../../app/modules/tasks/router.py#L151))
  - Requete : page demandee, echeances les plus proches d'abord (taches sans echeance a la fin)
  - Resultat pagine, echeances converties dans le fuseau de chaque tache
- Fonction `tasks.router._encode_cursor` ([app/modules/tasks/router.py:88](../../app/modules/tasks/router.py#L88))
  - Valeur de tri de la derniere tache de la page et identifiant (departage les egalites)
  - Rang de la base : 1 = urgente ... 4 = basse (meme valeur que PRIORITY_RANK)
- Fonction `tasks.router._ordered` ([app/modules/tasks/router.py:111](../../app/modules/tasks/router.py#L111))
  - Tri : echeances proches d'abord (sans echeance a la fin), priorites elevees d'abord, ou plus recentes d'abord
  - Taches situees strictement apres la derniere tache de la page precedente

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet TaskListOut (ou null).
- Liste paginée : `items`, `total`, `page`, `page_size`, `next_cursor` (voir CONVENTIONS.md).

| Champ de `result` (élément de `items`) | Type | Toujours présent | Contraintes | Description |
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
| `200` | Succès | succès | oui (40) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (8) |
| `422` | Données invalides | « Problème de validation des données »; « cursor : ['Curseur invalide'] »; données ou paramètres invalides | oui (5) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-TSK-006 — Création d'une tâche

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Tâches |
| Méthode | `POST` |
| Chemin | `/api/v1/tasks` |
| Fonction | `create_task` — [app/modules/tasks/router.py:252](../../app/modules/tasks/router.py#L252) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 242 test(s) (test_api_sans_test_auparavant, test_bd4_administrateur_foyer, test_cas_limites, test_fonctions_plan, test_inbox_reminders_actions, test_integrations, …) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Creation d'une tache

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `assign_tasks` (propriétaire, membre) ; `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `Idempotency-Key` | en-tête | string (ou null) | non | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`application/json`, schéma `TaskIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `description` | string (ou null) | non | longueur max. 10000 | — |
| `category` | string (ou null) | non | longueur max. 48 | — |
| `priority` | string (énumération TaskPriority) (ou null) | non | valeurs : `low`, `normal`, `high`, `critical` | — |
| `due_date` | string (date) (ou null) | non | — | — |
| `due_time` | string (time) (ou null) | non | — | — |
| `timezone` | string (ou null) | non | — | — |
| `estimated_minutes` | integer (ou null) | non | min. 1.0 ; max. 43200.0 | — |
| `recurrence_rule` | string (ou null) | non | — | — |
| `household_id` | string (uuid) (ou null) | non | — | — |
| `assignee_id` | string (uuid) (ou null) | non | — | — |
| `reminder_offsets` | liste de integer (ou null) | non | éléments max. 5 | — |
| `title` | string | oui | longueur min. 1 ; longueur max. 255 | — |
| `status` | string (énumération TaskStatus) | non | valeurs : `needs_review`, `planned`, `in_progress`, `completed`, `cancelled`, `archived`, `inbox`, `deferred`, `blocked` ; défaut `"planned"` | — |
| `depends_on` | liste de string (uuid) | non | défaut `[]` | — |
| `origin` | string | non | valeurs : `manual`, `ai_extraction`, `email` ; défaut `"manual"` | — |

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

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- En-tete Idempotency-Key facultatif (compatibilite des clients existants) : une requete rejouee dans les
- 24 heures renvoie la tache deja creee (200), sans doublon
- Fonction `tasks.service.create_idempotent` ([app/modules/tasks/service.py:270](../../app/modules/tasks/service.py#L270)) : A4 : une requete rejouee (double clic, reseau instable) renvoie la tache deja creee, sans doublon

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Tâche créée », « Tâche déjà enregistrée ».
- `result` : objet TaskOut (ou null).

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
| `200` | Succès | succès | oui (1) |
| `201` | Créé | succès | oui (373) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | — | oui (1) |
| `404` | Introuvable ou inaccessible | « Catégorie introuvable » | oui (4) |
| `422` | Données invalides | « assignee_id : ["Cette personne n'est pas membre du foyer"] »; « assignee_id : ['Seule une tâche partagée avec un foyer peut être attribuée'] »; données ou paramètres invalides; « due_date : ["Une heure d'échéance nécessite une date"] »; « due_date : ['Une tâche récurrente nécessite une date de départ'] »; « recurrence_rule : ['Cette règle ne produit aucune date'] » | oui (27) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-TSK-008 — Fiche d'une tâche

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Tâches |
| Méthode | `GET` |
| Chemin | `/api/v1/tasks/{task_id}` |
| Fonction | `get_task` — [app/modules/tasks/router.py:273](../../app/modules/tasks/router.py#L273) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 31 test(s) (test_cas_limites, test_lot4_taches_et_rappels, test_lot5_foyer_et_compte, test_module_12_administration, test_module_13_privacy, test_module_15_household, …) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Detail d'une tache

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `tasks.router._outputs` ([app/modules/tasks/router.py:129](../../app/modules/tasks/router.py#L129)) : Sorties des taches ; signale les sources supprimees (jamais de lien mort)
  - Requete : documents rattaches aux elements sources
  - E-mails encore disponibles (non supprimes localement)
- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet TaskOut (ou null).

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
| `200` | Succès | succès | oui (26) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | oui (13) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-TSK-009 — Modification d'une tâche

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Tâches |
| Méthode | `PATCH` |
| Chemin | `/api/v1/tasks/{task_id}` |
| Fonction | `update_task` — [app/modules/tasks/router.py:279](../../app/modules/tasks/router.py#L279) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 46 test(s) (test_cas_limites, test_lot5_foyer_et_compte, test_module_13_privacy, test_module_2_dashboard, test_module_4_tasks, test_parcours, …) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Modification d'une tache (version attendue obligatoire)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `assign_tasks` (propriétaire, membre) ; `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service._check_category`, `tasks.service._check_sharing`, `tasks.service._check_transition`, `tasks.service._require_edit`, `tasks.service._require_not_archived`, `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `TaskPatch`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `description` | string (ou null) | non | longueur max. 10000 | — |
| `category` | string (ou null) | non | longueur max. 48 | — |
| `priority` | string (énumération TaskPriority) (ou null) | non | valeurs : `low`, `normal`, `high`, `critical` | — |
| `due_date` | string (date) (ou null) | non | — | — |
| `due_time` | string (time) (ou null) | non | — | — |
| `timezone` | string (ou null) | non | — | — |
| `estimated_minutes` | integer (ou null) | non | min. 1.0 ; max. 43200.0 | — |
| `recurrence_rule` | string (ou null) | non | — | — |
| `household_id` | string (uuid) (ou null) | non | — | — |
| `assignee_id` | string (uuid) (ou null) | non | — | — |
| `reminder_offsets` | liste de integer (ou null) | non | éléments max. 5 | — |
| `title` | string (ou null) | non | longueur min. 1 ; longueur max. 255 | — |
| `status` | string (énumération TaskStatus) (ou null) | non | valeurs : `needs_review`, `planned`, `in_progress`, `completed`, `cancelled`, `archived`, `inbox`, `deferred`, `blocked` | — |
| `reason` | string (ou null) | non | longueur max. 2000 | — |
| `scope` | string | non | valeurs : `this`, `future` ; défaut `"this"` | — |
| `version` | integer | oui | min. 1.0 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `TaskPatch._rrule` (champ(s) recurrence_rule) ([app/modules/tasks/schemas.py:30](../../app/modules/tasks/schemas.py#L30)) : Validation d'une regle de recurrence iCalendar (RRULE) ; renvoie la regle nettoyee Le prefixe "RRULE:" eventuel est retire Sous-ensemble accepte : frequences quotidienne a annuelle et parties utiles de la RFC 5545 La regle doit pouvoir etre interpretee par dateutil — refus (422) : « règle de récurrence invalide (format iCalendar RRULE, ex. FREQ=MONTHLY;BYMONTHDAY=25) » ; « fréquence de récurrence trop rapprochée »
- Validateur `TaskPatch._tz` (champ(s) timezone) ([app/modules/tasks/schemas.py:51](../../app/modules/tasks/schemas.py#L51)) : Validation d'un fuseau horaire (None accepte) — refus (422) : « fuseau horaire inconnu »
- Validateur `TaskPatch._priority` (champ(s) priority) ([app/modules/tasks/schemas.py:19](../../app/modules/tasks/schemas.py#L19)) : Priorite : de 1 a 4, ou son nom ; toute autre valeur est refusee — refus (422) : « priorité hors plage (1 à 4) »
- Validateur `TaskPatch.check_offsets` (champ(s) reminder_offsets) ([app/modules/tasks/schemas.py:93](../../app/modules/tasks/schemas.py#L93)) : Delais de rappel : positifs, 60 jours au plus, sans doublon, du plus lointain au plus proche — refus (422) : « délai de rappel invalide (minutes avant l'échéance, au plus 60 jours) »
- Validateur `TaskPatch.category_alias` (modèle entier) ([app/modules/tasks/schemas.py:85](../../app/modules/tasks/schemas.py#L85)) : category_id (nom de la specification) et category (nom historique) designent la meme information
- Contrôle dans le code (422) : assignee_id : ["Cette personne n'est pas membre du foyer"]
- Contrôle dans le code (422) : assignee_id : ['Seule une tâche partagée avec un foyer peut être attribuée']
- Contrôle dans le code (422) : due_date : ["Une heure d'échéance nécessite une date"]
- Contrôle dans le code (422) : due_date : ['Un report nécessite une nouvelle date']
- Contrôle dans le code (422) : due_date : ['Une tâche récurrente nécessite une date de départ']
- Contrôle dans le code (422) : reason : ['Le motif de réouverture est obligatoire']
- Contrôle dans le code (422) : reason : ['Le motif du blocage est obligatoire']
- Contrôle dans le code (422) : recurrence_rule : ['Cette règle ne produit aucune date']
- Contrôle dans le code (422) : scope : ["Cette tâche n'appartient à aucune série récurrente"]
- Contrôle dans le code (422) : scope : ["Modifier la règle s'applique à toutes les occurrences à venir"]

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `tasks.service.update` ([app/modules/tasks/service.py:374](../../app/modules/tasks/service.py#L374))
  - Droit de modification, puis verrou : deux modifications simultanees sont traitees l'une apres l'autre
  - Echeance modifiee : recalcul a partir des nouvelles valeurs et des valeurs actuelles
  - Portee d'une tache (personnelle / foyer) : fixee a la creation dans le schema partage
  - (trg_tasks_owner_immutable refuse tout changement par modification)
  - Application : une entree d'historique par champ modifie (avant, apres, auteur, date)
  - Nouvelle personne attribuee : attribution de nouveau « en attente »
  - Delais propres a la tache : derniere valeur relue par les rappels (cle « offsets »)
  - Echeance modifiee : action native « rescheduled » (lue par le mobile), evenement « updated » pour l'API
  - Occurrence personnalisee : les occurrences suivantes ne sont pas concernees (AC2)
- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Tâche modifiée ».
- `result` : objet TaskOut (ou null).

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
| `200` | Succès | succès | oui (30) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Seul le créateur de la tâche peut modifier son partage »; « Vous n'avez pas la permission requise dans ce foyer »; « Vous ne pouvez pas modifier cette tâche » | non |
| `404` | Introuvable ou inaccessible | « Catégorie introuvable »; « Foyer introuvable »; « Tâche introuvable » | oui (5) |
| `409` | Conflit avec l'état actuel | « Cette tâche a été modifiée entre-temps : rechargez-la avant de l'enregistrer »; « Cette tâche est archivée : désarchivez-la pour la modifier »; « Cette tâche est déjà annulée »; « Le partage d'une tâche ne peut pas être modifié : créez la tâche dans l'espace voulu »; « Transition impossible : {task.status.value} vers {target.value} » | oui (18) |
| `422` | Données invalides | « assignee_id : ["Cette personne n'est pas membre du foyer"] »; « assignee_id : ['Seule une tâche partagée avec un foyer peut être attribuée'] »; données ou paramètres invalides; « due_date : ["Une heure d'échéance nécessite une date"] »; « due_date : ['Un report nécessite une nouvelle date'] »; « due_date : ['Une tâche récurrente nécessite une date de départ'] »; « reason : ['Le motif de réouverture est obligatoire'] »; « reason : ['Le motif du blocage est obligatoire'] » ; … | oui (8) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-TSK-010 — Suppression d'une tâche (corbeille)

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Tâches |
| Méthode | `DELETE` |
| Chemin | `/api/v1/tasks/{task_id}` |
| Fonction | `delete_task` — [app/modules/tasks/router.py:286](../../app/modules/tasks/router.py#L286) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 17 test(s) (test_cas_limites, test_lot4_taches_et_rappels, test_module_13_privacy, test_module_3_assistant, test_module_4_tasks, test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Suppression (logique) d'une tache, restaurable pendant 30 jours

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Tâche supprimée ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (13) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Seul le créateur peut supprimer cette tâche » | oui (2) |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | oui (3) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-TSK-012 — Archivage d'une tâche

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Tâches |
| Méthode | `POST` |
| Chemin | `/api/v1/tasks/{task_id}/archive` |
| Fonction | `archive_task` — [app/modules/tasks/router.py:299](../../app/modules/tasks/router.py#L299) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 5 test(s) (test_module_4_tasks) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Archivage : retiree des vues actives, rappels suspendus

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service._require_owner`, `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Tâche archivée ».
- `result` : objet TaskOut (ou null).

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
| `200` | Succès | succès | oui (4) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé » | oui (1) |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | non |
| `409` | Conflit avec l'état actuel | « Cette tâche est déjà archivée » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-TSK-013 — Désarchivage d'une tâche

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Tâches |
| Méthode | `POST` |
| Chemin | `/api/v1/tasks/{task_id}/unarchive` |
| Fonction | `unarchive_task` — [app/modules/tasks/router.py:305](../../app/modules/tasks/router.py#L305) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_4_tasks) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Retour dans les vues actives

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service._require_owner`, `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Tâche désarchivée ».
- `result` : objet TaskOut (ou null).

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
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé » | non |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | non |
| `409` | Conflit avec l'état actuel | « Cette tâche n'est pas archivée » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-TSK-014 — Achèvement d'une tâche

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Tâches |
| Méthode | `POST` |
| Chemin | `/api/v1/tasks/{task_id}/complete` |
| Fonction | `complete_task` — [app/modules/tasks/router.py:311](../../app/modules/tasks/router.py#L311) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 26 test(s) (test_cas_limites, test_inbox_reminders_actions, test_module_2_dashboard, test_module_4_tasks, test_parcours, test_reporting, …) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Realisation d'une tache (et creation de l'occurrence suivante si elle est recurrente)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service._require_edit`, `tasks.service._require_not_archived`, `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `objet CompleteIn (ou null)`, facultatif).

Type : objet CompleteIn (ou null).

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `tasks.service.complete` ([app/modules/tasks/service.py:651](../../app/modules/tasks/service.py#L651))
  - Preuve facultative : un document de l'utilisateur
- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet TaskOut (ou null).

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
| `200` | Succès | succès | oui (21) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous ne pouvez pas modifier cette tâche » | non |
| `404` | Introuvable ou inaccessible | « Document introuvable »; « Tâche introuvable » | oui (2) |
| `409` | Conflit avec l'état actuel | « Cette tâche est archivée : désarchivez-la pour la modifier »; « Transition impossible : {task.status.value} vers completed » | oui (4) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-TSK-016 — Confirmation d'une tâche proposée

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Tâches |
| Méthode | `POST` |
| Chemin | `/api/v1/tasks/{task_id}/confirm` |
| Fonction | `confirm_task` — [app/modules/tasks/router.py:326](../../app/modules/tasks/router.py#L326) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_api_sans_test_auparavant) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Confirmation d'une tache proposee par l'IA

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `tasks.service.confirm` ([app/modules/tasks/service.py:693](../../app/modules/tasks/service.py#L693)) : Validation par l'utilisateur d'une tâche proposee par l'IA
- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Tâche confirmée ».
- `result` : objet TaskOut (ou null).

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
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé » | non |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Corbeille

### API-TSK-007 — Corbeille des tâches

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Corbeille |
| Méthode | `GET` |
| Chemin | `/api/v1/tasks/trash` |
| Fonction | `trash` — [app/modules/tasks/router.py:265](../../app/modules/tasks/router.py#L265) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_4_tasks) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Corbeille : taches supprimees encore restaurables

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : taches supprimees par leur createur, les plus recentes d'abord

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
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
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-TSK-011 — Restauration d'une tâche supprimée

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Corbeille |
| Méthode | `POST` |
| Chemin | `/api/v1/tasks/{task_id}/restore` |
| Fonction | `restore_task` — [app/modules/tasks/router.py:293](../../app/modules/tasks/router.py#L293) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_4_tasks) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Restauration d'une tache supprimee

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Tâche restaurée ».
- `result` : objet TaskOut (ou null).

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
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | oui (1) |
| `410` | Expiré ou n'existe plus | « Le délai de restauration de 30 jours est dépassé » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Récurrences

### API-TSK-015 — Prochaines occurrences d'une tâche récurrente

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Récurrences |
| Méthode | `GET` |
| Chemin | `/api/v1/tasks/{task_id}/occurrences` |
| Fonction | `task_occurrences` — [app/modules/tasks/router.py:320](../../app/modules/tasks/router.py#L320) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_4_tasks) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Occurrences a venir d'une tache recurrente (12 mois au plus, sans rien enregistrer)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `tasks.service.preview_occurrences` ([app/modules/tasks/service.py:635](../../app/modules/tasks/service.py#L635)) : Occurrences a venir sur 12 mois, calculees sans rien enregistrer
- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de string (date-time) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Attribution

### API-TSK-017 — Réponse à une attribution (accepter ou refuser)

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Attribution |
| Méthode | `POST` |
| Chemin | `/api/v1/tasks/{task_id}/assignment` |
| Fonction | `respond_assignment` — [app/modules/tasks/router.py:332](../../app/modules/tasks/router.py#L332) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_15_household, test_tasks_planning) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Reponse a une attribution (accepter / refuser)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `AssignmentIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `accept` | boolean | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : assignment : ['Aucune attribution en attente pour vous sur cette tâche']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `tasks.service.respond_assignment` ([app/modules/tasks/service.py:674](../../app/modules/tasks/service.py#L674))
  - Seule la personne attribuee peut repondre a une attribution en attente
  - Acceptee ou refusee (task_assignments.status) ; un refus retire l'attribution
  - FAM-002 : l'auteur de l'attribution est prevenu de la reponse
- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet TaskOut (ou null).

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
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | non |
| `422` | Données invalides | « assignment : ['Aucune attribution en attente pour vous sur cette tâche'] »; données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Historique

### API-TSK-018 — Historique d'une tâche

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Historique |
| Méthode | `GET` |
| Chemin | `/api/v1/tasks/{task_id}/history` |
| Fonction | `task_history` — [app/modules/tasks/router.py:339](../../app/modules/tasks/router.py#L339) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 7 test(s) (test_api_sans_test_auparavant, test_cas_limites, test_module_4_tasks, test_tasks_planning) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Historique d'une tache, le plus recent d'abord

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : evenements de l'historique de la tache
- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet app__modules__tasks__schemas__HistoryOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | integer | oui | — | — |
| `actor_id` | string (uuid) (ou null) | oui | — | — |
| `event` | string | oui | — | — |
| `changes` | objet (clés libres) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Tâches du foyer

### API-TSK-019 — Tâches partagées d'un foyer

| Élément | Valeur |
|---|---|
| Module | Gestion des tâches et obligations (`app/modules/tasks`, spéc. C) |
| Sous-module | Tâches du foyer |
| Méthode | `GET` |
| Chemin | `/api/v1/households/{household_id}/tasks` |
| Fonction | `household_tasks` — [app/modules/tasks/router.py:349](../../app/modules/tasks/router.py#L349) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_cas_limites) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Taches partagees d'un foyer (permission "view_tasks" exigee)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `households.service.has_permission`, `households.service.membership`, `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |
| `status` | requête | liste de string (énumération TaskStatus) | non | valeurs : `needs_review`, `planned`, `in_progress`, `completed`, `cancelled`, `archived`, `inbox`, `deferred`, `blocked` | — |
| `page` | requête | integer | non | min. 1 ; défaut `1` | — |
| `page_size` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |
| `cursor` | requête | string (ou null) | non | longueur max. 500 | — |
| `limit` | requête | integer (ou null) | non | min. 1 ; max. 100 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : taches non supprimees et non archivees du foyer, filtrees par etat
- Fonction `households.service.require_permission` ([app/modules/households/service.py:72](../../app/modules/households/service.py#L72))
  - Non membre : le foyer est « introuvable » (on ne revele pas son existence)
- Fonction `tasks.router._filtered` ([app/modules/tasks/router.py:63](../../app/modules/tasks/router.py#L63))
  - Fuseau de l'utilisateur : les dates de filtre sont des dates locales
  - Recherche dans le titre et la description (insensible a la casse)
  - Echeance a partir du debut du jour "du" et jusqu'a la fin du jour "au"
- Fonction `tasks.router._page` ([app/modules/tasks/router.py:151](../../app/modules/tasks/router.py#L151))
  - Requete : page demandee, echeances les plus proches d'abord (taches sans echeance a la fin)
  - Resultat pagine, echeances converties dans le fuseau de chaque tache

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet TaskListOut (ou null).
- Liste paginée : `items`, `total`, `page`, `page_size`, `next_cursor` (voir CONVENTIONS.md).

| Champ de `result` (élément de `items`) | Type | Toujours présent | Contraintes | Description |
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
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous n'avez pas la permission requise dans ce foyer » | non |
| `404` | Introuvable ou inaccessible | « Foyer introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
