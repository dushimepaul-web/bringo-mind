<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Administration et supervision

Dossier du code : [app/modules/administration/](../../app/modules/administration/) · lettre ou numéro de la spécification : **M12** · priorité **1** · documentation générée le 19/11/2026 17:30.

**15 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 15 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 0 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Supervision et incidents**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-ADM-001](#api-adm-001--supervision-files-échecs-worker) | GET | `/api/v1/admin/supervision` | Supervision (files, échecs, worker) | Terminée et opérationnelle | oui |
| [API-ADM-002](#api-adm-002--traitements-en-échec) | GET | `/api/v1/admin/jobs/failed` | Traitements en échec | Terminée et opérationnelle | oui |
| [API-ADM-003](#api-adm-003--relance-dun-traitement-en-échec) | POST | `/api/v1/admin/jobs/{job_id}/retry` | Relance d'un traitement en échec | Terminée et opérationnelle | oui |
| [API-ADM-004](#api-adm-004--liste-des-incidents) | GET | `/api/v1/admin/incidents` | Liste des incidents | Terminée et opérationnelle | oui |
| [API-ADM-005](#api-adm-005--suivi-dun-incident) | PATCH | `/api/v1/admin/incidents/{incident_id}` | Suivi d'un incident | Terminée et opérationnelle | oui |

**Journaux et sécurité**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-ADM-006](#api-adm-006--journal-daudit) | GET | `/api/v1/admin/audit-logs` | Journal d'audit | Terminée et opérationnelle | oui |
| [API-ADM-007](#api-adm-007--synthèse-de-sécurité) | GET | `/api/v1/admin/security-summary` | Synthèse de sécurité | Terminée et opérationnelle | oui |

**Statistiques et envois**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-ADM-008](#api-adm-008--statistiques-dusage) | GET | `/api/v1/admin/statistics` | Statistiques d'usage | Terminée et opérationnelle | oui |
| [API-ADM-009](#api-adm-009--supervision-des-envois) | GET | `/api/v1/admin/deliveries` | Supervision des envois | Terminée et opérationnelle | oui |

**Paramètres globaux**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-ADM-010](#api-adm-010--paramètres-globaux) | GET | `/api/v1/admin/settings` | Paramètres globaux | Terminée et opérationnelle | oui |
| [API-ADM-011](#api-adm-011--modification-dun-paramètre-global) | PUT | `/api/v1/admin/settings/{key}` | Modification d'un paramètre global | Terminée et opérationnelle | oui |
| [API-ADM-012](#api-adm-012--historique-dun-paramètre-global) | GET | `/api/v1/admin/settings/{key}/history` | Historique d'un paramètre global | Terminée et opérationnelle | oui |

**Drapeaux de fonctionnalité**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-ADM-013](#api-adm-013--drapeaux-de-fonctionnalité-administration) | GET | `/api/v1/admin/feature-flags` | Drapeaux de fonctionnalité (administration) | Terminée et opérationnelle | oui |
| [API-ADM-014](#api-adm-014--modification-dun-drapeau-de-fonctionnalité) | PATCH | `/api/v1/admin/feature-flags/{key}` | Modification d'un drapeau de fonctionnalité | Terminée et opérationnelle | oui |
| [API-ADM-015](#api-adm-015--drapeaux-de-fonctionnalité-de-lutilisateur) | GET | `/api/v1/feature-flags` | Drapeaux de fonctionnalité de l'utilisateur | Terminée et opérationnelle | oui |

## Sous-module : Supervision et incidents

### API-ADM-001 — Supervision (files, échecs, worker)

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Supervision et incidents |
| Méthode | `GET` |
| Chemin | `/api/v1/admin/supervision` |
| Fonction | `supervision` — [app/modules/administration/router.py:63](../../app/modules/administration/router.py#L63) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 6 test(s) (test_lot7_administration, test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). Supervision (files, échecs, worker).

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Etat des files, du worker et des traitements metier
- Fonction `administration.service.supervision` ([app/modules/administration/service.py:49](../../app/modules/administration/service.py#L49)) : Etat des files : par type de traitement, en attente, en cours, bloques, echecs et reussites des 24 dernieres heures
  - Bloque : reservation expiree sans fin d'execution (worker arrete en cours de traitement)
  - Derniere activite du worker : job reserve ou termine le plus recemment (lecture de toutes les lignes)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (4) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | oui (3) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ADM-002 — Traitements en échec

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Supervision et incidents |
| Méthode | `GET` |
| Chemin | `/api/v1/admin/jobs/failed` |
| Fonction | `failed_jobs` — [app/modules/administration/router.py:69](../../app/modules/administration/router.py#L69) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). Traitements en échec.

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `job_type` | requête | string (ou null) | non | longueur max. 64 | — |
| `page` | requête | integer | non | min. 1 ; défaut `1` | — |
| `page_size` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |
| `cursor` | requête | string (ou null) | non | longueur max. 500 | — |
| `limit` | requête | integer (ou null) | non | min. 1 ; max. 100 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `administration.service.failed_jobs_query` ([app/modules/administration/service.py:108](../../app/modules/administration/service.py#L108)) : Traitements en echec definitif, les plus recents d'abord : type, nature de l'erreur, dates (jamais le contenu)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ADM-003 — Relance d'un traitement en échec

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Supervision et incidents |
| Méthode | `POST` |
| Chemin | `/api/v1/admin/jobs/{job_id}/retry` |
| Fonction | `retry_job` — [app/modules/administration/router.py:80](../../app/modules/administration/router.py#L80) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). Relance d'un traitement en échec.

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `job_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `administration.service.retry_job` ([app/modules/administration/service.py:115](../../app/modules/administration/service.py#L115)) : Relance d'un traitement en echec definitif : nouvel essai immediat, trace dans le journal
  - background_jobs : aucune politique UPDATE pour le role de l'application ; relance ecrite par le role du worker

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Traitement relancé ».
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | non |
| `404` | Introuvable ou inaccessible | « Traitement introuvable » | non |
| `409` | Conflit avec l'état actuel | « Seul un traitement en échec peut être relancé » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ADM-004 — Liste des incidents

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Supervision et incidents |
| Méthode | `GET` |
| Chemin | `/api/v1/admin/incidents` |
| Fonction | `incidents` — [app/modules/administration/router.py:85](../../app/modules/administration/router.py#L85) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). Liste des incidents.

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `status` | requête | string (ou null) | non | longueur max. 20 | — |
| `page` | requête | integer | non | min. 1 ; défaut `1` | — |
| `page_size` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |
| `cursor` | requête | string (ou null) | non | longueur max. 500 | — |
| `limit` | requête | integer (ou null) | non | min. 1 ; max. 100 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ADM-005 — Suivi d'un incident

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Supervision et incidents |
| Méthode | `PATCH` |
| Chemin | `/api/v1/admin/incidents/{incident_id}` |
| Fonction | `update_incident` — [app/modules/administration/router.py:94](../../app/modules/administration/router.py#L94) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). Suivi d'un incident.

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `incident_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `IncidentIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `status` | string | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : status : ['Statut invalide (investigating, resolved, discarded)']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `administration.service.update_incident` ([app/modules/administration/service.py:139](../../app/modules/administration/service.py#L139)) : Suivi d'un incident : en cours d'analyse, resolu ou ecarte (date et auteur de la resolution)
  - dead_letter_events : lecture seule pour le role de l'application ; mise a jour par le role du worker

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Incident mis à jour ».
- `result` : objet IncidentOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `source_type` | string | oui | — | — |
| `reason` | string | oui | — | — |
| `payload` | objet (clés libres) | oui | — | — |
| `status` | string | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `resolved_at` | string (date-time) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | non |
| `404` | Introuvable ou inaccessible | « Incident introuvable » | non |
| `409` | Conflit avec l'état actuel | « Cet incident est déjà clos » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « status : ['Statut invalide (investigating, resolved, discarded)'] » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Journaux et sécurité

### API-ADM-006 — Journal d'audit

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Journaux et sécurité |
| Méthode | `GET` |
| Chemin | `/api/v1/admin/audit-logs` |
| Fonction | `audit_logs` — [app/modules/administration/router.py:101](../../app/modules/administration/router.py#L101) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). Journal d'audit.

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `action` | requête | string (ou null) | non | longueur max. 64 | — |
| `page` | requête | integer | non | min. 1 ; défaut `1` | — |
| `page_size` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |
| `cursor` | requête | string (ou null) | non | longueur max. 500 | — |
| `limit` | requête | integer (ou null) | non | min. 1 ; max. 100 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `administration.service.audit_page` ([app/modules/administration/service.py:200](../../app/modules/administration/service.py#L200)) : Journal d'audit en lecture : action, type de ressource, date, acteur pseudonymise, IP tronquee ; jamais les details

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ADM-007 — Synthèse de sécurité

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Journaux et sécurité |
| Méthode | `GET` |
| Chemin | `/api/v1/admin/security-summary` |
| Fonction | `security_summary` — [app/modules/administration/router.py:106](../../app/modules/administration/router.py#L106) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). Synthèse de sécurité.

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `days` | requête | integer | non | min. 1 ; max. 90 ; défaut `7` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `administration.service.security_summary` ([app/modules/administration/service.py:213](../../app/modules/administration/service.py#L213)) : Evenements de securite agreges par type et par jour (aucune adresse, aucun compte)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | non |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Statistiques et envois

### API-ADM-008 — Statistiques d'usage

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Statistiques et envois |
| Méthode | `GET` |
| Chemin | `/api/v1/admin/statistics` |
| Fonction | `statistics` — [app/modules/administration/router.py:111](../../app/modules/administration/router.py#L111) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). Statistiques d'usage.

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `administration.service.statistics` ([app/modules/administration/service.py:225](../../app/modules/administration/service.py#L225)) : Statistiques agregees et anonymisees de la plateforme (aucune donnee personnelle, petits effectifs masques)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ADM-009 — Supervision des envois

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Statistiques et envois |
| Méthode | `GET` |
| Chemin | `/api/v1/admin/deliveries` |
| Fonction | `deliveries` — [app/modules/administration/router.py:117](../../app/modules/administration/router.py#L117) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_lot7_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). E-51 : supervision des envois (agregats par canal, etat et code d'erreur ; aucun contenu)

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `days` | requête | integer | non | min. 1 ; max. 90 ; défaut `30` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `administration.service.delivery_supervision` ([app/modules/administration/service.py:250](../../app/modules/administration/service.py#L250)) : Envois des rappels et des notifications, agreges par canal et par etat, sur la periode, et nombre d'echecs par code d'erreur et par jour. Aucun contenu, aucune adresse, aucun detail d'erreur (le detail peut contenir une adresse) : codes seulement. Lu sous le role de maintenance (tous les comptes).

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Paramètres globaux

### API-ADM-010 — Paramètres globaux

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Paramètres globaux |
| Méthode | `GET` |
| Chemin | `/api/v1/admin/settings` |
| Fonction | `settings` — [app/modules/administration/router.py:124](../../app/modules/administration/router.py#L124) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_i18n_extensible, test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). Paramètres globaux.

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `administration.service.settings_list` ([app/modules/administration/service.py:325](../../app/modules/administration/service.py#L325)) : Parametres connus du code, avec leur valeur courante, leur version et leurs bornes
  - Langues : choix possibles (langues installees)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (9) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ADM-011 — Modification d'un paramètre global

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Paramètres globaux |
| Méthode | `PUT` |
| Chemin | `/api/v1/admin/settings/{key}` |
| Fonction | `update_setting` — [app/modules/administration/router.py:129](../../app/modules/administration/router.py#L129) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_i18n_extensible, test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). Modification d'un paramètre global.

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.
- Contrôles d'accès et de propriété appelés dans le code : `administration.service._check_languages`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `key` | chemin | string | oui | — | — |

**Corps de la requête** (`application/json`, schéma `SettingIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `value` | boolean ou integer ou string ou liste de string (ou null) | oui | — | — |
| `version` | integer | oui | — | — |
| `reason` | string | oui | longueur min. 3 ; longueur max. 500 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : reason : ['Indiquez le motif du changement']
- Contrôle dans le code (422) : value : ['La langue par défaut doit faire partie des langues proposées']
- Contrôle dans le code (422) : value : ['Langue non installée sur la plateforme']
- Contrôle dans le code (422) : value : [f'Valeur invalide (type {spec.kind}' + (f', de {spec.minimum} à {spec.maximum}' if spec.kind == 'int' else '') + ')']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `administration.service.update_setting` ([app/modules/administration/service.py:342](../../app/modules/administration/service.py#L342)) : Nouvelle version d'un parametre : validation, verrou optimiste, historique, audit avant / apres
  - Verrou optimiste : la version attendue est celle du journal (nombre de changements)
  - Historique versionne : entree du journal d'audit (avant, apres, version, motif)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Paramètre enregistré ».
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | non |
| `404` | Introuvable ou inaccessible | « Paramètre inconnu » | oui (1) |
| `409` | Conflit avec l'état actuel | « Ce paramètre a été modifié entre-temps : rechargez la page »; « La valeur est identique à la valeur actuelle » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides; « reason : ['Indiquez le motif du changement'] »; « value : ['La langue par défaut doit faire partie des langues proposées'] »; « value : ['Langue non installée sur la plateforme'] »; « value : [f'Valeur invalide (type {spec.kind}' + (f', de {spec.minimum} à {spec.maximum}' if spec.kind == 'int' else '') + ')'] » | oui (5) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ADM-012 — Historique d'un paramètre global

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Paramètres globaux |
| Méthode | `GET` |
| Chemin | `/api/v1/admin/settings/{key}/history` |
| Fonction | `setting_history` — [app/modules/administration/router.py:134](../../app/modules/administration/router.py#L134) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). Historique d'un paramètre global.

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `key` | chemin | string | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `administration.service.setting_history` ([app/modules/administration/service.py:374](../../app/modules/administration/service.py#L374))
  - Version 1 : valeur initiale (celle d'avant le premier changement, sinon la valeur actuelle)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | non |
| `404` | Introuvable ou inaccessible | « Paramètre inconnu » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Drapeaux de fonctionnalité

### API-ADM-013 — Drapeaux de fonctionnalité (administration)

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Drapeaux de fonctionnalité |
| Méthode | `GET` |
| Chemin | `/api/v1/admin/feature-flags` |
| Fonction | `flags` — [app/modules/administration/router.py:139](../../app/modules/administration/router.py#L139) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). Drapeaux de fonctionnalité (administration).

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet FlagOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `key` | string | oui | — | — |
| `description` | string (ou null) | oui | — | — |
| `enabled` | boolean | oui | — | — |
| `rollout_percentage` | integer | oui | — | — |
| `starts_at` | string (date-time) (ou null) | oui | — | — |
| `ends_at` | string (date-time) (ou null) | oui | — | — |
| `updated_at` | string (date-time) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | non |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ADM-014 — Modification d'un drapeau de fonctionnalité

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Drapeaux de fonctionnalité |
| Méthode | `PATCH` |
| Chemin | `/api/v1/admin/feature-flags/{key}` |
| Fonction | `update_flag` — [app/modules/administration/router.py:144](../../app/modules/administration/router.py#L144) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/administration/api.js`) |

**Description** (commentaire et docstring du code). Modification d'un drapeau de fonctionnalité.

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `key` | chemin | string | oui | — | — |

**Corps de la requête** (`application/json`, schéma `app__modules__administration__router__FlagIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `enabled` | boolean (ou null) | non | — | — |
| `rollout_percentage` | integer (ou null) | non | min. 0.0 ; max. 100.0 | — |
| `starts_at` | string (date-time) (ou null) | non | — | — |
| `ends_at` | string (date-time) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : ends_at : ['La fin doit suivre le début']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `administration.service.update_flag` ([app/modules/administration/service.py:392](../../app/modules/administration/service.py#L392)) : Activation, pourcentage de deploiement et fenetre d'un drapeau, avec audit avant / apres

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Drapeau mis à jour ».
- `result` : objet FlagOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `key` | string | oui | — | — |
| `description` | string (ou null) | oui | — | — |
| `enabled` | boolean | oui | — | — |
| `rollout_percentage` | integer | oui | — | — |
| `starts_at` | string (date-time) (ou null) | oui | — | — |
| `ends_at` | string (date-time) (ou null) | oui | — | — |
| `updated_at` | string (date-time) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | non |
| `404` | Introuvable ou inaccessible | « Drapeau inconnu » | non |
| `422` | Données invalides | données ou paramètres invalides; « ends_at : ['La fin doit suivre le début'] » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ADM-015 — Drapeaux de fonctionnalité de l'utilisateur

| Élément | Valeur |
|---|---|
| Module | Administration et supervision (`app/modules/administration`, spéc. M12) |
| Sous-module | Drapeaux de fonctionnalité |
| Méthode | `GET` |
| Chemin | `/api/v1/feature-flags` |
| Fonction | `my_flags` — [app/modules/administration/router.py:150](../../app/modules/administration/router.py#L150) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_drapeaux_fonctionnalites, test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/shared/helpers/featureFlags.js`) |

**Description** (commentaire et docstring du code). Drapeaux evalues pour l'utilisateur connecte (l'interface masque ce qui n'est pas actif pour lui)

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
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
