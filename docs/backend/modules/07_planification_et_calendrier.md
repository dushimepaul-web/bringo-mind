<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Moteur de planification

Dossier du code : [app/modules/planning/](../../app/modules/planning/) · lettre ou numéro de la spécification : **D** · priorité **2** · documentation générée le 19/11/2026 17:30.

**32 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 23 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 9 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Tableau de bord**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-PLN-001](#api-pln-001--tableau-de-bord-du-jour) | GET | `/api/v1/dashboard` | Tableau de bord du jour | Terminée et opérationnelle | oui |

**Synthèses quotidiennes et hebdomadaires**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-PLN-002](#api-pln-002--synthèse-quotidienne) | GET | `/api/v1/briefings/daily` | Synthèse quotidienne | Terminée et opérationnelle | oui |
| [API-PLN-003](#api-pln-003--synthèse-hebdomadaire) | GET | `/api/v1/briefings/weekly` | Synthèse hebdomadaire | Terminée et opérationnelle | oui |
| [API-PLN-031](#api-pln-031--préférences-des-synthèses) | GET | `/api/v1/planning/summary-preferences` | Préférences des synthèses | Terminée et opérationnelle | oui |
| [API-PLN-032](#api-pln-032--modification-des-préférences-des-synthèses) | PUT | `/api/v1/planning/summary-preferences` | Modification des préférences des synthèses | Terminée et opérationnelle | oui |

**Planification intelligente**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-PLN-004](#api-pln-004--créneaux-libres-dune-journée) | GET | `/api/v1/planning/slots` | Créneaux libres d'une journée | Terminée et opérationnelle | oui |
| [API-PLN-005](#api-pln-005--découpage-dune-tâche-en-étapes-ia) | POST | `/api/v1/tasks/{task_id}/breakdown` | Découpage d'une tâche en étapes (IA) | Terminée, en attente de configuration | oui |
| [API-PLN-026](#api-pln-026--score-de-priorité-des-tâches) | GET | `/api/v1/planning/priorities` | Score de priorité des tâches | Terminée et opérationnelle | oui |
| [API-PLN-027](#api-pln-027--calcul-de-suggestions-de-priorité) | POST | `/api/v1/planning/priorities/suggestions` | Calcul de suggestions de priorité | Terminée et opérationnelle | oui |
| [API-PLN-028](#api-pln-028--suggestions-de-priorité-en-attente) | GET | `/api/v1/planning/priorities/suggestions` | Suggestions de priorité en attente | Terminée et opérationnelle | oui |
| [API-PLN-029](#api-pln-029--décision-sur-une-suggestion-de-priorité) | POST | `/api/v1/planning/priorities/suggestions/{suggestion_id}` | Décision sur une suggestion de priorité | Terminée et opérationnelle | oui |
| [API-PLN-030](#api-pln-030--proposition-de-replanification-dune-tâche) | POST | `/api/v1/planning/tasks/{task_id}/reschedule` | Proposition de replanification d'une tâche | Terminée et opérationnelle | oui |

**Calendriers connectés**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-PLN-006](#api-pln-006--liste-des-calendriers-connectés) | GET | `/api/v1/calendars` | Liste des calendriers connectés | Terminée et opérationnelle | oui |
| [API-PLN-007](#api-pln-007--fournisseurs-de-calendrier-disponibles) | GET | `/api/v1/calendars/providers` | Fournisseurs de calendrier disponibles | Terminée et opérationnelle | oui |
| [API-PLN-008](#api-pln-008--connexion-dun-calendrier-externe-début-oauth) | GET | `/api/v1/calendars/{provider}/authorize` | Connexion d'un calendrier externe (début OAuth) | Terminée, en attente de configuration | oui |
| [API-PLN-009](#api-pln-009--retour-oauth-du-fournisseur-de-calendrier) | GET | `/api/v1/calendars/{provider}/callback` | Retour OAuth du fournisseur de calendrier | Terminée, en attente de configuration | oui |
| [API-PLN-010](#api-pln-010--synchronisation-dun-calendrier-connecté) | POST | `/api/v1/calendars/{link_id}/sync` | Synchronisation d'un calendrier connecté | Terminée, en attente de configuration | oui |
| [API-PLN-011](#api-pln-011--déconnexion-dun-calendrier) | DELETE | `/api/v1/calendars/{link_id}` | Déconnexion d'un calendrier | Terminée et opérationnelle | oui |
| [API-PLN-012](#api-pln-012--calendriers-disponibles-dans-un-compte-connecté) | GET | `/api/v1/calendars/{link_id}/sources` | Calendriers disponibles dans un compte connecté | Terminée, en attente de configuration | oui |
| [API-PLN-013](#api-pln-013--sélection-dun-calendrier-à-synchroniser) | PUT | `/api/v1/calendars/{link_id}/sources/{calendar_id}` | Sélection d'un calendrier à synchroniser | Terminée, en attente de configuration | oui |

**Événements**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-PLN-014](#api-pln-014--liste-des-événements-jour-semaine-mois) | GET | `/api/v1/events` | Liste des événements (jour, semaine, mois) | Terminée et opérationnelle | oui |
| [API-PLN-015](#api-pln-015--vérification-de-conflit-pour-un-créneau) | GET | `/api/v1/events/conflicts/check` | Vérification de conflit pour un créneau | Terminée et opérationnelle | oui |
| [API-PLN-016](#api-pln-016--conflits-dagenda-dune-période) | GET | `/api/v1/events/conflicts` | Conflits d'agenda d'une période | Terminée et opérationnelle | oui |
| [API-PLN-017](#api-pln-017--création-dun-événement-dans-un-calendrier-externe) | POST | `/api/v1/events` | Création d'un événement dans un calendrier externe | Terminée, en attente de configuration | oui |
| [API-PLN-018](#api-pln-018--modification-dun-événement-externe) | PATCH | `/api/v1/events/{event_id}` | Modification d'un événement externe | Terminée, en attente de configuration | oui |
| [API-PLN-019](#api-pln-019--annulation-dun-événement-externe) | POST | `/api/v1/events/{event_id}/cancel` | Annulation d'un événement externe | Terminée, en attente de configuration | oui |
| [API-PLN-020](#api-pln-020--création-dun-événement-local) | POST | `/api/v1/events/local` | Création d'un événement local | Terminée et opérationnelle | oui |
| [API-PLN-021](#api-pln-021--modification-dun-événement-local) | PATCH | `/api/v1/events/{event_id}/local` | Modification d'un événement local | Terminée et opérationnelle | oui |
| [API-PLN-022](#api-pln-022--annulation-dun-événement-local) | POST | `/api/v1/events/{event_id}/local/cancel` | Annulation d'un événement local | Terminée et opérationnelle | oui |
| [API-PLN-023](#api-pln-023--réponse-dun-participant) | PUT | `/api/v1/events/{event_id}/attendees/{attendee_id}` | Réponse d'un participant | Terminée et opérationnelle | oui |

**Horaires de travail**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-PLN-024](#api-pln-024--horaires-de-travail) | GET | `/api/v1/calendar/work-hours` | Horaires de travail | Terminée et opérationnelle | oui |
| [API-PLN-025](#api-pln-025--modification-des-horaires-de-travail) | PUT | `/api/v1/calendar/work-hours` | Modification des horaires de travail | Terminée et opérationnelle | oui |

## Sous-module : Tableau de bord

### API-PLN-001 — Tableau de bord du jour

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Tableau de bord |
| Méthode | `GET` |
| Chemin | `/api/v1/dashboard` |
| Fonction | `get_dashboard` — [app/modules/planning/router.py:118](../../app/modules/planning/router.py#L118) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 25 test(s) (test_module_2_dashboard) |
| Utilisée par l'interface web | oui (`src/modules/planning/api.js`) |

**Description** (commentaire et docstring du code). Tableau de bord du jour (aujourd'hui par defaut)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Une section en erreur n'empeche pas les autres : la reponse reste 200
- Fonction `planning.dashboard.build` ([app/modules/planning/dashboard.py:210](../../app/modules/planning/dashboard.py#L210)) : Tableau de bord complet ; une section en erreur n'empeche jamais les autres (AC3)
  - Lus avant toute section : une annulation de transaction ne doit pas les rendre illisibles
  - Cause journalisee, transaction annulee pour que les sections suivantes puissent lire la base

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet DashboardOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `date` | string (date) | oui | — | — |
| `timezone` | string | oui | — | — |
| `preferences` | objet DashboardPreferencesOut | oui | — | — |
| `preferences.order` | liste de string | oui | — | — |
| `preferences.hidden` | liste de string | oui | — | — |
| `preferences.default_order` | liste de string | oui | — | — |
| `sections` | objet (clés libres -> objet DashboardSectionOut) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (27) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Synthèses quotidiennes et hebdomadaires

### API-PLN-002 — Synthèse quotidienne

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Synthèses quotidiennes et hebdomadaires |
| Méthode | `GET` |
| Chemin | `/api/v1/briefings/daily` |
| Fonction | `daily` — [app/modules/planning/router.py:124](../../app/modules/planning/router.py#L124) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_accounts, test_module_4_tasks, test_tasks_planning) |
| Utilisée par l'interface web | oui (`src/modules/planning/api.js`) |

**Description** (commentaire et docstring du code). Synthèse quotidienne.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `assign_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `day` | requête | string (date) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.service.briefing` ([app/modules/planning/service.py:83](../../app/modules/planning/service.py#L83))
  - Fuseau de l'utilisateur, jour de reference et dernier jour de la periode
  - Requete : taches ouvertes (non terminees, non supprimees) visibles par l'utilisateur
  - Repartition des taches dans les listes du tableau de bord
  - Taches proposees par l'IA et pas encore confirmees : a verifier
  - Classement selon la date d'echeance locale
  - Debut et fin de la periode, en heure locale
  - Requete : evenements du calendrier qui chevauchent la periode
  - Taches de la periode qui ont une heure precise (detection des conflits)
  - Tri par score decroissant, puis par echeance
  - Contenu du tableau de bord
  - Les 3 taches les plus importantes du moment

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet BriefingOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `date` | string (date) | oui | — | — |
| `period_end` | string (date) | oui | — | — |
| `timezone` | string | oui | — | — |
| `focus` | liste de objet TaskOut | oui | — | — |
| `focus[].id` | string (uuid) | oui | — | — |
| `focus[].owner_id` | string (uuid) | oui | — | — |
| `focus[].household_id` | string (uuid) (ou null) | oui | — | — |
| `focus[].assignee_id` | string (uuid) (ou null) | oui | — | — |
| `focus[].assignment_status` | string (énumération AssignmentStatus) (ou null) | oui | valeurs : `pending`, `accepted`, `rejected` | — |
| `focus[].title` | string | oui | — | — |
| `focus[].description` | string (ou null) | oui | — | — |
| `focus[].category` | string (ou null) | oui | — | — |
| `focus[].priority` | string (énumération TaskPriority) | oui | valeurs : `low`, `normal`, `high`, `critical` | — |
| `focus[].status` | string (énumération TaskStatus) | oui | valeurs : `needs_review`, `planned`, `in_progress`, `completed`, `cancelled`, `archived`, `inbox`, `deferred`, `blocked` | — |
| `focus[].due_at` | string (date-time) (ou null) | oui | — | — |
| `focus[].due_all_day` | boolean | oui | — | — |
| `focus[].due_date` | string (date) (ou null) | non | — | — |
| `focus[].due_time` | string (time) (ou null) | non | — | — |
| `focus[].timezone` | string | oui | — | — |
| `focus[].estimated_minutes` | integer (ou null) | oui | — | — |
| `focus[].recurrence_rule` | string (ou null) | oui | — | — |
| `focus[].recurrence_parent_id` | string (uuid) (ou null) | oui | — | — |
| `focus[].origin` | string (énumération TaskOrigin) | oui | valeurs : `manual`, `ai_extraction`, `document`, `email`, `voice`, `calendar`, `recurrence` | — |
| `focus[].source_item_id` | string (uuid) (ou null) | oui | — | — |
| `focus[].extraction_id` | string (uuid) (ou null) | oui | — | — |
| `focus[].is_confirmed` | boolean | oui | — | — |
| `focus[].version` | integer | non | défaut `1` | — |
| `focus[].priority_level` | integer | non | défaut `2` | — |
| `focus[].archived_at` | string (date-time) (ou null) | non | — | — |
| `focus[].deleted_at` | string (date-time) (ou null) | non | — | — |
| `focus[].status_reason` | string (ou null) | non | — | — |
| `focus[].recurrence_rule_id` | string (uuid) (ou null) | non | — | — |
| `focus[].occurrence_at` | string (date-time) (ou null) | non | — | — |
| `focus[].is_exception` | boolean | non | défaut `false` | — |
| `focus[].source_deleted` | boolean | non | défaut `false` | — |
| `focus[].source_email_id` | string (uuid) (ou null) | non | — | — |
| `focus[].completion_proof_id` | string (uuid) (ou null) | non | — | — |
| `focus[].completed_at` | string (date-time) (ou null) | oui | — | — |
| `focus[].completion_note` | string (ou null) | oui | — | — |
| `focus[].reminder_offsets` | liste de integer (ou null) | oui | — | — |
| `focus[].created_at` | string (date-time) | oui | — | — |
| `focus[].updated_at` | string (date-time) | oui | — | — |
| `overdue` | liste de objet TaskOut | oui | — | — |
| `overdue[].id` | string (uuid) | oui | — | — |
| `overdue[].owner_id` | string (uuid) | oui | — | — |
| `overdue[].household_id` | string (uuid) (ou null) | oui | — | — |
| `overdue[].assignee_id` | string (uuid) (ou null) | oui | — | — |
| `overdue[].assignment_status` | string (énumération AssignmentStatus) (ou null) | oui | valeurs : `pending`, `accepted`, `rejected` | — |
| `overdue[].title` | string | oui | — | — |
| `overdue[].description` | string (ou null) | oui | — | — |
| `overdue[].category` | string (ou null) | oui | — | — |
| `overdue[].priority` | string (énumération TaskPriority) | oui | valeurs : `low`, `normal`, `high`, `critical` | — |
| `overdue[].status` | string (énumération TaskStatus) | oui | valeurs : `needs_review`, `planned`, `in_progress`, `completed`, `cancelled`, `archived`, `inbox`, `deferred`, `blocked` | — |
| `overdue[].due_at` | string (date-time) (ou null) | oui | — | — |
| `overdue[].due_all_day` | boolean | oui | — | — |
| `overdue[].due_date` | string (date) (ou null) | non | — | — |
| `overdue[].due_time` | string (time) (ou null) | non | — | — |
| `overdue[].timezone` | string | oui | — | — |
| `overdue[].estimated_minutes` | integer (ou null) | oui | — | — |
| `overdue[].recurrence_rule` | string (ou null) | oui | — | — |

219 champ(s) supplémentaire(s) : voir le schéma dans docs/openapi.json.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-003 — Synthèse hebdomadaire

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Synthèses quotidiennes et hebdomadaires |
| Méthode | `GET` |
| Chemin | `/api/v1/briefings/weekly` |
| Fonction | `weekly` — [app/modules/planning/router.py:130](../../app/modules/planning/router.py#L130) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_api_sans_test_auparavant) |
| Utilisée par l'interface web | oui (`src/modules/planning/api.js`) |

**Description** (commentaire et docstring du code). Tableau de bord de la semaine

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `assign_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `start` | requête | string (date) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.service.briefing` ([app/modules/planning/service.py:83](../../app/modules/planning/service.py#L83))
  - Fuseau de l'utilisateur, jour de reference et dernier jour de la periode
  - Requete : taches ouvertes (non terminees, non supprimees) visibles par l'utilisateur
  - Repartition des taches dans les listes du tableau de bord
  - Taches proposees par l'IA et pas encore confirmees : a verifier
  - Classement selon la date d'echeance locale
  - Debut et fin de la periode, en heure locale
  - Requete : evenements du calendrier qui chevauchent la periode
  - Taches de la periode qui ont une heure precise (detection des conflits)
  - Tri par score decroissant, puis par echeance
  - Contenu du tableau de bord
  - Les 3 taches les plus importantes du moment

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet BriefingOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `date` | string (date) | oui | — | — |
| `period_end` | string (date) | oui | — | — |
| `timezone` | string | oui | — | — |
| `focus` | liste de objet TaskOut | oui | — | — |
| `focus[].id` | string (uuid) | oui | — | — |
| `focus[].owner_id` | string (uuid) | oui | — | — |
| `focus[].household_id` | string (uuid) (ou null) | oui | — | — |
| `focus[].assignee_id` | string (uuid) (ou null) | oui | — | — |
| `focus[].assignment_status` | string (énumération AssignmentStatus) (ou null) | oui | valeurs : `pending`, `accepted`, `rejected` | — |
| `focus[].title` | string | oui | — | — |
| `focus[].description` | string (ou null) | oui | — | — |
| `focus[].category` | string (ou null) | oui | — | — |
| `focus[].priority` | string (énumération TaskPriority) | oui | valeurs : `low`, `normal`, `high`, `critical` | — |
| `focus[].status` | string (énumération TaskStatus) | oui | valeurs : `needs_review`, `planned`, `in_progress`, `completed`, `cancelled`, `archived`, `inbox`, `deferred`, `blocked` | — |
| `focus[].due_at` | string (date-time) (ou null) | oui | — | — |
| `focus[].due_all_day` | boolean | oui | — | — |
| `focus[].due_date` | string (date) (ou null) | non | — | — |
| `focus[].due_time` | string (time) (ou null) | non | — | — |
| `focus[].timezone` | string | oui | — | — |
| `focus[].estimated_minutes` | integer (ou null) | oui | — | — |
| `focus[].recurrence_rule` | string (ou null) | oui | — | — |
| `focus[].recurrence_parent_id` | string (uuid) (ou null) | oui | — | — |
| `focus[].origin` | string (énumération TaskOrigin) | oui | valeurs : `manual`, `ai_extraction`, `document`, `email`, `voice`, `calendar`, `recurrence` | — |
| `focus[].source_item_id` | string (uuid) (ou null) | oui | — | — |
| `focus[].extraction_id` | string (uuid) (ou null) | oui | — | — |
| `focus[].is_confirmed` | boolean | oui | — | — |
| `focus[].version` | integer | non | défaut `1` | — |
| `focus[].priority_level` | integer | non | défaut `2` | — |
| `focus[].archived_at` | string (date-time) (ou null) | non | — | — |
| `focus[].deleted_at` | string (date-time) (ou null) | non | — | — |
| `focus[].status_reason` | string (ou null) | non | — | — |
| `focus[].recurrence_rule_id` | string (uuid) (ou null) | non | — | — |
| `focus[].occurrence_at` | string (date-time) (ou null) | non | — | — |
| `focus[].is_exception` | boolean | non | défaut `false` | — |
| `focus[].source_deleted` | boolean | non | défaut `false` | — |
| `focus[].source_email_id` | string (uuid) (ou null) | non | — | — |
| `focus[].completion_proof_id` | string (uuid) (ou null) | non | — | — |
| `focus[].completed_at` | string (date-time) (ou null) | oui | — | — |
| `focus[].completion_note` | string (ou null) | oui | — | — |
| `focus[].reminder_offsets` | liste de integer (ou null) | oui | — | — |
| `focus[].created_at` | string (date-time) | oui | — | — |
| `focus[].updated_at` | string (date-time) | oui | — | — |
| `overdue` | liste de objet TaskOut | oui | — | — |
| `overdue[].id` | string (uuid) | oui | — | — |
| `overdue[].owner_id` | string (uuid) | oui | — | — |
| `overdue[].household_id` | string (uuid) (ou null) | oui | — | — |
| `overdue[].assignee_id` | string (uuid) (ou null) | oui | — | — |
| `overdue[].assignment_status` | string (énumération AssignmentStatus) (ou null) | oui | valeurs : `pending`, `accepted`, `rejected` | — |
| `overdue[].title` | string | oui | — | — |
| `overdue[].description` | string (ou null) | oui | — | — |
| `overdue[].category` | string (ou null) | oui | — | — |
| `overdue[].priority` | string (énumération TaskPriority) | oui | valeurs : `low`, `normal`, `high`, `critical` | — |
| `overdue[].status` | string (énumération TaskStatus) | oui | valeurs : `needs_review`, `planned`, `in_progress`, `completed`, `cancelled`, `archived`, `inbox`, `deferred`, `blocked` | — |
| `overdue[].due_at` | string (date-time) (ou null) | oui | — | — |
| `overdue[].due_all_day` | boolean | oui | — | — |
| `overdue[].due_date` | string (date) (ou null) | non | — | — |
| `overdue[].due_time` | string (time) (ou null) | non | — | — |
| `overdue[].timezone` | string | oui | — | — |
| `overdue[].estimated_minutes` | integer (ou null) | oui | — | — |
| `overdue[].recurrence_rule` | string (ou null) | oui | — | — |

219 champ(s) supplémentaire(s) : voir le schéma dans docs/openapi.json.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-031 — Préférences des synthèses

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Synthèses quotidiennes et hebdomadaires |
| Méthode | `GET` |
| Chemin | `/api/v1/planning/summary-preferences` |
| Fonction | `summary_preferences` — [app/modules/planning/router.py:518](../../app/modules/planning/router.py#L518) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_api_sans_test_auparavant) |
| Utilisée par l'interface web | oui (`src/modules/planning/pages/PrioritiesPage.jsx`) |

**Description** (commentaire et docstring du code). Préférences des synthèses.

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
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-032 — Modification des préférences des synthèses

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Synthèses quotidiennes et hebdomadaires |
| Méthode | `PUT` |
| Chemin | `/api/v1/planning/summary-preferences` |
| Fonction | `update_summary_preferences` — [app/modules/planning/router.py:523](../../app/modules/planning/router.py#L523) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_api_sans_test_auparavant, test_module_16_planning) |
| Utilisée par l'interface web | oui (`src/modules/planning/pages/PrioritiesPage.jsx`) |

**Description** (commentaire et docstring du code). Modification des préférences des synthèses.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `SummaryPrefsIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `summary_hour` | integer | oui | min. 0.0 ; max. 23.0 | — |
| `weekly_day` | integer | oui | min. 0.0 ; max. 6.0 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : summary_hour : ['Heure de 0 à 23, jour de 0 (lundi) à 6 (dimanche)']

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Préférences enregistrées ».
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides; « summary_hour : ['Heure de 0 à 23, jour de 0 (lundi) à 6 (dimanche)'] » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Planification intelligente

### API-PLN-004 — Créneaux libres d'une journée

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Planification intelligente |
| Méthode | `GET` |
| Chemin | `/api/v1/planning/slots` |
| Fonction | `slots` — [app/modules/planning/router.py:135](../../app/modules/planning/router.py#L135) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 5 test(s) (test_integrations, test_module_16_planning, test_module_7_calendar, test_phase2_calendrier) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Creneaux libres d'une journee, compte tenu du calendrier et des tâches horodatees

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `day` | requête | string (date) | oui | — | — |
| `duration` | requête | integer | non | min. 5 ; max. 600 ; défaut `30` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.service.free_slots` ([app/modules/planning/service.py:159](../../app/modules/planning/service.py#L159)) : Creneaux libres d'une journee (08:00-20:00, heure locale), au pas de 15 minutes
  - Debut et fin de la journee de recherche, convertis en UTC
  - Horaires de travail declares, sinon la plage par defaut
  - Horaires de travail : preferences du profil (user_profiles.preferences.planning)
  - Aujourd'hui : on commence au prochain quart d'heure
  - pas de creneau dans le passe
  - Duree du creneau recherche ; le curseur avance de plage libre en plage libre
  - Parcours des plages occupees (plus une plage fictive en fin de journee)
  - Creneaux libres avant la prochaine plage occupee
  - Le curseur saute apres la plage occupee

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet SlotOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `starts_at` | string (date-time) | oui | — | — |
| `ends_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-005 — Découpage d'une tâche en étapes (IA)

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Planification intelligente |
| Méthode | `POST` |
| Chemin | `/api/v1/tasks/{task_id}/breakdown` |
| Fonction | `breakdown` — [app/modules/planning/router.py:141](../../app/modules/planning/router.py#L141) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 2 test(s) (test_integrations, test_module_13_privacy) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Propose un découpage en étapes (rien n'est créé : l'utilisateur choisit les étapes à ajouter)

**État détaillé.**

- Dépendance non configurée (É-03) : Fournisseur d'IA (ANTHROPIC_API_KEY vide, fournisseur « anthropic » désactivé) : réponse 503 ou repli sur des règles.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `privacy.service.require_ai`, `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : tache visible par l'utilisateur, puis suggestion d'etapes
- Retrait du consentement a l'IA (PRIV-003) : refus (409)
- Suggestion impossible (IA indisponible) : 503
- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur
- Fonction `privacy.service.require_ai` ([app/modules/privacy/service.py:85](../../app/modules/privacy/service.py#L85))
  - Retrait du consentement : la fonction qui envoie du contenu a l'IA est refusee (409)
- Fonction `planning.service.breakdown` ([app/modules/planning/service.py:242](../../app/modules/planning/service.py#L242))
  - Requete : appel du modele (effort faible, reponse courte)
  - Etapes nettoyees : 6 au plus, titre tronque, duree bornee entre 5 et 600 minutes

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet StepOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `title` | string | oui | — | — |
| `estimated_minutes` | integer | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | non |
| `409` | Conflit avec l'état actuel | « Vous avez retiré votre accord au traitement par l'IA : réactivez-le dans Données personnelles pour utiliser cette fonction » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `503` | Service indisponible ou non configuré | « Suggestion indisponible : {exc} » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-026 — Score de priorité des tâches

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Planification intelligente |
| Méthode | `GET` |
| Chemin | `/api/v1/planning/priorities` |
| Fonction | `priorities` — [app/modules/planning/router.py:490](../../app/modules/planning/router.py#L490) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_16_planning) |
| Utilisée par l'interface web | oui (`src/modules/planning/pages/PrioritiesPage.jsx`) |

**Description** (commentaire et docstring du code). Score de priorité des tâches.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service.visible_filter`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- PLAN-002 : classement deterministe et detail du score de chaque tache
- Fonction `planning.intelligence.ranked` ([app/modules/planning/intelligence.py:66](../../app/modules/planning/intelligence.py#L66)) : Taches ouvertes et confirmees classees par score detaille

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet ScoredTaskOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `task_id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `priority` | integer | oui | — | — |
| `total` | integer | oui | — | — |
| `parts` | objet (clés libres) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-027 — Calcul de suggestions de priorité

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Planification intelligente |
| Méthode | `POST` |
| Chemin | `/api/v1/planning/priorities/suggestions` |
| Fonction | `suggest_priorities` — [app/modules/planning/router.py:497](../../app/modules/planning/router.py#L497) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_16_planning) |
| Utilisée par l'interface web | oui (`src/modules/planning/pages/PrioritiesPage.jsx`) |

**Description** (commentaire et docstring du code). Calcul de suggestions de priorité.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.intelligence.suggest` ([app/modules/planning/intelligence.py:93](../../app/modules/planning/intelligence.py#L93)) : Nouvelles suggestions (les precedentes en attente expirent) : modele si autorise et disponible, sinon regles
  - Historique borne : seules les suggestions recentes sont gardees

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Suggestions préparées ».
- `result` : liste de objet SuggestionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) | oui | — | — |
| `current_priority` | integer | oui | — | — |
| `suggested_priority` | integer | oui | — | — |
| `applied_priority` | integer (ou null) | oui | — | — |
| `score` | integer | oui | — | — |
| `source` | string | oui | — | — |
| `reason` | string | oui | — | — |
| `status` | string | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-028 — Suggestions de priorité en attente

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Planification intelligente |
| Méthode | `GET` |
| Chemin | `/api/v1/planning/priorities/suggestions` |
| Fonction | `pending_suggestions` — [app/modules/planning/router.py:502](../../app/modules/planning/router.py#L502) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_16_planning) |
| Utilisée par l'interface web | oui (`src/modules/planning/pages/PrioritiesPage.jsx`) |

**Description** (commentaire et docstring du code). Suggestions de priorité en attente.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet SuggestionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) | oui | — | — |
| `current_priority` | integer | oui | — | — |
| `suggested_priority` | integer | oui | — | — |
| `applied_priority` | integer (ou null) | oui | — | — |
| `score` | integer | oui | — | — |
| `source` | string | oui | — | — |
| `reason` | string | oui | — | — |
| `status` | string | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-029 — Décision sur une suggestion de priorité

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Planification intelligente |
| Méthode | `POST` |
| Chemin | `/api/v1/planning/priorities/suggestions/{suggestion_id}` |
| Fonction | `decide_suggestion` — [app/modules/planning/router.py:507](../../app/modules/planning/router.py#L507) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_16_planning) |
| Utilisée par l'interface web | oui (`src/modules/planning/pages/PrioritiesPage.jsx`) |

**Description** (commentaire et docstring du code). Décision sur une suggestion de priorité.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `assign_tasks` (propriétaire, membre) ; `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service.get_visible`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `suggestion_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `DecisionIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `decision` | string | oui | valeurs : `accept`, `modify`, `reject` | — |
| `priority` | integer (ou null) | non | min. 1.0 ; max. 4.0 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : assignee_id : ["Cette personne n'est pas membre du foyer"]
- Contrôle dans le code (422) : assignee_id : ['Seule une tâche partagée avec un foyer peut être attribuée']
- Contrôle dans le code (422) : decision : ['accept, modify ou reject']
- Contrôle dans le code (422) : due_date : ["Une heure d'échéance nécessite une date"]
- Contrôle dans le code (422) : due_date : ['Un report nécessite une nouvelle date']
- Contrôle dans le code (422) : due_date : ['Une tâche récurrente nécessite une date de départ']
- Contrôle dans le code (422) : priority : ['Priorité de 1 à 4']
- Contrôle dans le code (422) : reason : ['Le motif de réouverture est obligatoire']
- Contrôle dans le code (422) : reason : ['Le motif du blocage est obligatoire']
- Contrôle dans le code (422) : recurrence_rule : ['Cette règle ne produit aucune date']
- Contrôle dans le code (422) : scope : ["Cette tâche n'appartient à aucune série récurrente"]
- Contrôle dans le code (422) : scope : ["Modifier la règle s'applique à toutes les occurrences à venir"]

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.intelligence.decide` ([app/modules/planning/intelligence.py:154](../../app/modules/planning/intelligence.py#L154)) : Accepter (niveau suggere), modifier (niveau choisi) ou rejeter ; seule une suggestion en attente est decidee
  - Regles habituelles de modification (droits, historique, verrou de version)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Décision enregistrée ».
- `result` : objet SuggestionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) | oui | — | — |
| `current_priority` | integer | oui | — | — |
| `suggested_priority` | integer | oui | — | — |
| `applied_priority` | integer (ou null) | oui | — | — |
| `score` | integer | oui | — | — |
| `source` | string | oui | — | — |
| `reason` | string | oui | — | — |
| `status` | string | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Seul le créateur de la tâche peut modifier son partage »; « Vous ne pouvez pas modifier cette tâche » | non |
| `404` | Introuvable ou inaccessible | « Catégorie introuvable »; « Suggestion introuvable »; « Tâche introuvable » | non |
| `409` | Conflit avec l'état actuel | « Cette suggestion a déjà été traitée »; « Cette tâche a été modifiée entre-temps : rechargez-la avant de l'enregistrer »; « Cette tâche est archivée : désarchivez-la pour la modifier »; « Cette tâche est déjà annulée »; « Le partage d'une tâche ne peut pas être modifié : créez la tâche dans l'espace voulu »; « Transition impossible : {task.status.value} vers {target.value} » | oui (1) |
| `422` | Données invalides | « assignee_id : ["Cette personne n'est pas membre du foyer"] »; « assignee_id : ['Seule une tâche partagée avec un foyer peut être attribuée'] »; « decision : ['accept, modify ou reject'] »; données ou paramètres invalides; « due_date : ["Une heure d'échéance nécessite une date"] »; « due_date : ['Un report nécessite une nouvelle date'] »; « due_date : ['Une tâche récurrente nécessite une date de départ'] »; « priority : ['Priorité de 1 à 4'] » ; … | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-030 — Proposition de replanification d'une tâche

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Planification intelligente |
| Méthode | `POST` |
| Chemin | `/api/v1/planning/tasks/{task_id}/reschedule` |
| Fonction | `reschedule` — [app/modules/planning/router.py:512](../../app/modules/planning/router.py#L512) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_16_planning) |
| Utilisée par l'interface web | oui (`src/modules/planning/pages/PrioritiesPage.jsx`) |

**Description** (commentaire et docstring du code). Proposition de replanification d'une tâche.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `tasks.service.get_visible`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |
| `duration` | requête | integer (ou null) | non | min. 5 ; max. 600 | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : calendar_link_id : ["Choisissez le calendrier ou créer l'événement"]
- Contrôle dans le code (422) : starts_at : ['Date et heure de début requises (ISO 8601 avec fuseau)']
- Contrôle dans le code (422) : starts_at : ['Le fuseau horaire est requis']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- PLAN-003 : proposition soumise a approbation (aucun deplacement sans accord)
- Fonction `planning.intelligence.propose_reschedule` ([app/modules/planning/intelligence.py:186](../../app/modules/planning/intelligence.py#L186)) : Prochain creneau libre sans conflit, propose comme demande d'action : la tache ne bouge qu'apres approbation

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Replanification proposée : approuvez-la pour l'appliquer ».
- `result` : objet ActionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) (ou null) | oui | — | — |
| `action_type` | string (énumération ActionType) | oui | valeurs : `draft_reply`, `appointment_request`, `calendar_event`, `form_preparation`, `payment_instruction`, `cancellation_inquiry`, `renewal_inquiry`, `booking_request`, `task_create`, `task_update`, `task_complete`, `email_draft`, `event_update`, `event_cancel` | — |
| `parameters` | objet (clés libres) | oui | — | — |
| `preview` | string (ou null) | oui | — | — |
| `status` | string (énumération ActionStatus) | oui | valeurs : `pending_approval`, `expired`, `approved`, `rejected`, `executing`, `succeeded`, `failed`, `cancelled` | — |
| `approved_at` | string (date-time) (ou null) | oui | — | — |
| `executed_at` | string (date-time) (ou null) | oui | — | — |
| `result` | objet (clés libres) (ou null) | oui | — | — |
| `error` | string (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `category` | integer | oui | — | — |
| `expires_at` | string (date-time) (ou null) | oui | — | — |
| `parameters_hash` | string (ou null) | oui | — | — |
| `conversation_id` | string (uuid) (ou null) | oui | — | — |
| `executable` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | non |
| `409` | Conflit avec l'état actuel | « Aucun créneau libre dans les 7 prochains jours »; « Cette tâche est terminée »; « Vous avez retiré votre accord au traitement par l'IA : réactivez-le dans Données personnelles pour utiliser cette fonction » | non |
| `422` | Données invalides | « Problème de validation des données »; « calendar_link_id : ["Choisissez le calendrier ou créer l'événement"] »; données ou paramètres invalides; « starts_at : ['Date et heure de début requises (ISO 8601 avec fuseau)'] »; « starts_at : ['Le fuseau horaire est requis'] » | non |
| `503` | Service indisponible ou non configuré | « Rédaction automatique indisponible : saisissez le message vous-même ou réessayez plus tard » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Calendriers connectés

### API-PLN-006 — Liste des calendriers connectés

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Calendriers connectés |
| Méthode | `GET` |
| Chemin | `/api/v1/calendars` |
| Fonction | `list_calendars` — [app/modules/planning/router.py:162](../../app/modules/planning/router.py#L162) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_api_sans_test_auparavant, test_integrations) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`, `src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Calendriers connectes (hors calendriers deconnectes)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : liens de calendrier de l'utilisateur non revoques

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet CalendarLinkOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `provider` | string (énumération CalendarProvider) | oui | valeurs : `google`, `microsoft` | — |
| `account_email` | string (ou null) | non | — | — |
| `status` | string (énumération CalendarLinkStatus) | oui | valeurs : `active`, `revoked`, `error` | — |
| `last_synced_at` | string (date-time) (ou null) | oui | — | — |
| `last_error` | string (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-007 — Fournisseurs de calendrier disponibles

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Calendriers connectés |
| Méthode | `GET` |
| Chemin | `/api/v1/calendars/providers` |
| Fonction | `providers` — [app/modules/planning/router.py:171](../../app/modules/planning/router.py#L171) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_api_sans_test_auparavant, test_drapeaux_fonctionnalites) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Fournisseurs disponibles (identifiants OAuth configures)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `calendar.external.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet ProvidersOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `google` | boolean | oui | — | connexion Google configurée |
| `microsoft` | boolean | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-008 — Connexion d'un calendrier externe (début OAuth)

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Calendriers connectés |
| Méthode | `GET` |
| Chemin | `/api/v1/calendars/{provider}/authorize` |
| Fonction | `authorize` — [app/modules/planning/router.py:179](../../app/modules/planning/router.py#L179) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 2 test(s) (test_drapeaux_fonctionnalites, test_integrations) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Adresse d'autorisation OAuth du fournisseur choisi

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `calendar.external.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `planning.calendars.authorize_url`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `provider` | chemin | string (énumération CalendarProvider) | oui | valeurs : `google`, `microsoft` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.calendars.authorize_url` ([app/modules/planning/calendars.py:84](../../app/modules/planning/calendars.py#L84))
  - Identifiant de l'application et parametres du fournisseur
  - l'etat signe lie le retour OAuth a l'utilisateur et expire vite (protection CSRF)
  - Adresse d'autorisation : application, retour, droits demandes, etat signe

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet AuthorizeOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `url` | string | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `503` | Service indisponible ou non configuré | « Connexion à ce calendrier non configurée » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-009 — Retour OAuth du fournisseur de calendrier

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Calendriers connectés |
| Méthode | `GET` |
| Chemin | `/api/v1/calendars/{provider}/callback` |
| Fonction | `callback` — [app/modules/planning/router.py:184](../../app/modules/planning/router.py#L184) |
| Contrat OpenAPI | non (route cachée du contrat : `include_in_schema=False`) |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 2 test(s) (test_drapeaux_fonctionnalites, test_integrations) |
| Utilisée par l'interface web | non |

**Description** (commentaire et docstring du code). Retour du fournisseur OAuth (navigateur) : l'utilisateur est identifie par l'etat signe

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle propre à cette route : Retour du navigateur après OAuth : l'utilisateur est identifié par le paramètre `state`, jeton signé (HS256) émis par `/calendars/{provider}/authorize`, propre au fournisseur et valable 10 minutes (protection CSRF) ; sinon 422. Pas de PKCE pour les calendriers. Réponse : redirection vers l'interface.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `provider` | chemin | string (énumération CalendarProvider) | oui | valeurs : `google`, `microsoft` | — |
| `state` | requête | string | non | défaut `""` | — |
| `code` | requête | string | non | défaut `""` | — |
| `error` | requête | string | non | défaut `""` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : state : ['Lien de connexion expire, recommencez']
- Contrôle dans le code (422) : state : ['Lien de connexion invalide']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Page du frontend vers laquelle l'utilisateur est renvoye
- Refus ou annulation chez le fournisseur
- Echange du code contre les jetons et creation du lien
- Requete anonyme (retour du fournisseur) : le lien est enregistre au nom de l'utilisateur du « state » signe
- C2 : calendriers externes desactives par l'administrateur (calendar.external.enabled) -> refus
- Echec : renvoi vers le frontend avec le code d'erreur
- Fonction `planning.calendars.read_state` ([app/modules/planning/calendars.py:98](../../app/modules/planning/calendars.py#L98))
  - Verification de la signature et de l'expiration de l'etat
  - L'etat doit etre un etat OAuth emis pour ce fournisseur
  - Identifiant de l'utilisateur qui a lance la connexion
- Fonction `planning.calendars.connect` ([app/modules/planning/calendars.py:141](../../app/modules/planning/calendars.py#L141))
  - Echange du code d'autorisation contre les jetons
  - Adresse du compte connecte
  - Requete : lien deja existant pour ce compte ? sinon creation
  - Le jeton de rafraichissement precedent est conserve si le fournisseur n'en renvoie pas de nouveau
  - Jetons chiffres, droits, etat actif
  - flush : identifiant du lien ; trace d'audit puis premiere synchronisation

**Réponse en cas de succès.**

- Réponse directe hors enveloppe possible (RedirectResponse) : fichier, flux, redirection ou réponse sans contenu selon le cas (voir le code).
- Code HTTP **200**.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | non |
| `307` | Redirection | — | oui (4) |
| `403` | Accès refusé | « Accès refusé » | non |
| `422` | Données invalides | données ou paramètres invalides; « state : ['Lien de connexion expire, recommencez'] »; « state : ['Lien de connexion invalide'] » | non |
| `502` | Fournisseur externe en erreur | « Le fournisseur de calendrier a refusé la connexion » | non |
| `503` | Service indisponible ou non configuré | « Connexion à ce calendrier non configurée » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-010 — Synchronisation d'un calendrier connecté

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Calendriers connectés |
| Méthode | `POST` |
| Chemin | `/api/v1/calendars/{link_id}/sync` |
| Fonction | `sync` — [app/modules/planning/router.py:209](../../app/modules/planning/router.py#L209) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 2 test(s) (test_api_sans_test_auparavant, test_drapeaux_fonctionnalites) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Synchronisation immediate d'un calendrier (en arriere-plan)

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `calendar.external.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `link_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : le lien doit appartenir a l'utilisateur ; puis job de synchronisation
- Fonction `planning.calendars.get_link` ([app/modules/planning/calendars.py:464](../../app/modules/planning/calendars.py#L464))
  - Requete : lien demande ; il doit appartenir a l'utilisateur et ne pas etre deconnecte

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Synchronisation lancée ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Calendrier introuvable » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-011 — Déconnexion d'un calendrier

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Calendriers connectés |
| Méthode | `DELETE` |
| Chemin | `/api/v1/calendars/{link_id}` |
| Fonction | `disconnect` — [app/modules/planning/router.py:219](../../app/modules/planning/router.py#L219) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_drapeaux_fonctionnalites, test_integrations, test_module_7_calendar) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Deconnexion d'un calendrier

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `link_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.calendars.disconnect` ([app/modules/planning/calendars.py:472](../../app/modules/planning/calendars.py#L472))
  - Lien deconnecte, jetons effaces, evenements importes supprimes, trace d'audit

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Calendrier déconnecté ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Calendrier introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-012 — Calendriers disponibles dans un compte connecté

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Calendriers connectés |
| Méthode | `GET` |
| Chemin | `/api/v1/calendars/{link_id}/sources` |
| Fonction | `calendar_sources` — [app/modules/planning/router.py:329](../../app/modules/planning/router.py#L329) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 2 test(s) (test_drapeaux_fonctionnalites, test_module_7_calendar) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Calendriers disponibles dans un compte connecté.

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `calendar.external.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `link_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.calendars.get_link` ([app/modules/planning/calendars.py:464](../../app/modules/planning/calendars.py#L464))
  - Requete : lien demande ; il doit appartenir a l'utilisateur et ne pas etre deconnecte
- Fonction `planning.calendars.refresh_calendars` ([app/modules/planning/calendars.py:204](../../app/modules/planning/calendars.py#L204)) : Liste des calendriers du compte ; le principal est selectionne par defaut
  - Liste indisponible : seul le calendrier principal est utilise

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet CalendarOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `name` | string | oui | — | — |
| `is_primary` | boolean | oui | — | — |
| `selected` | boolean | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | « Autorisation du calendrier expirée : reconnectez-le »; jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Calendrier introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides | non |
| `502` | Fournisseur externe en erreur | « Le fournisseur de calendrier a refusé la connexion » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-013 — Sélection d'un calendrier à synchroniser

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Calendriers connectés |
| Méthode | `PUT` |
| Chemin | `/api/v1/calendars/{link_id}/sources/{calendar_id}` |
| Fonction | `select_source` — [app/modules/planning/router.py:337](../../app/modules/planning/router.py#L337) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 2 test(s) (test_drapeaux_fonctionnalites, test_module_7_calendar) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Sélection d'un calendrier à synchroniser.

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `calendar.external.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `link_id` | chemin | string (uuid) | oui | — | — |
| `calendar_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `CalendarSelectIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `selected` | boolean | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.calendars.select_calendar` ([app/modules/planning/calendars.py:361](../../app/modules/planning/calendars.py#L361))
  - Calendrier retire : ses evenements importes sont supprimes

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Sélection enregistrée ».
- `result` : objet CalendarOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `name` | string | oui | — | — |
| `is_primary` | boolean | oui | — | — |
| `selected` | boolean | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Calendrier introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Événements

### API-PLN-014 — Liste des événements (jour, semaine, mois)

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Événements |
| Méthode | `GET` |
| Chemin | `/api/v1/events` |
| Fonction | `list_events` — [app/modules/planning/router.py:342](../../app/modules/planning/router.py#L342) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 29 test(s) (test_calendrier_local, test_module_7_calendar) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Liste des événements (jour, semaine, mois).

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `view` | requête | string | non | valeurs : `day`, `week`, `month` ; défaut `"week"` | — |
| `date` | requête | string (date) | oui | — | — |
| `include_cancelled` | requête | boolean | non | défaut `false` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.router._event_outputs` ([app/modules/planning/router.py:319](../../app/modules/planning/router.py#L319))
  - Horaires convertis dans le fuseau de l'utilisateur
- Fonction `planning.events.list_events` ([app/modules/planning/events.py:45](../../app/modules/planning/events.py#L45))
  - Un evenement annule est masque par defaut

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet EventOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `starts_at` | string | oui | — | — |
| `ends_at` | string | oui | — | — |
| `all_day` | boolean | oui | — | — |
| `status` | string (énumération EventStatus) | oui | valeurs : `confirmed`, `cancelled` | — |
| `version` | integer | oui | — | — |
| `location` | string (ou null) | oui | — | — |
| `conference_url` | string (ou null) | oui | — | — |
| `description` | string (ou null) | oui | — | — |
| `calendar_link_id` | string (uuid) (ou null) | non | — | — |
| `is_owner` | boolean | oui | — | — |
| `attendees` | liste de objet AttendeeOut | oui | — | — |
| `attendees[].id` | string (uuid) | oui | — | — |
| `attendees[].email` | string | oui | — | — |
| `attendees[].response` | string (énumération AttendeeResponse) | oui | valeurs : `needs_action`, `accepted`, `declined`, `tentative` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (37) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-015 — Vérification de conflit pour un créneau

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Événements |
| Méthode | `GET` |
| Chemin | `/api/v1/events/conflicts/check` |
| Fonction | `check_event_slot` — [app/modules/planning/router.py:357](../../app/modules/planning/router.py#L357) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 7 test(s) (test_phase2_calendrier) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). A1 : verification d'un creneau avant l'enregistrement d'un evenement (avertissement, jamais un blocage)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `planning.events._check_range`, `planning.events.check_slot`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `starts_at` | requête | string (date-time) | oui | — | — |
| `ends_at` | requête | string (date-time) | oui | — | — |
| `exclude_event_id` | requête | string (uuid) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : ends_at : ['La fin doit être postérieure au début']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.events.check_slot` ([app/modules/planning/events.py:242](../../app/modules/planning/events.py#L242)) : A1 : verification d'un creneau candidat AVANT l'enregistrement d'un evenement. Renvoie les evenements confirmes (hors journee entiere, dans la portee de l'utilisateur) et les taches ouvertes horodatees qui chevauchent [starts, ends). Calcul deterministe en UTC ; rien n'est bloque : l'utilisateur garde ou change le creneau.
  - import differe : planning importe deja ce module indirectement
  - Evenements confirmes qui chevauchent le creneau (l'evenement modifie lui-meme est exclu)
  - Taches horodatees ouvertes : meme plage occupee que pour les creneaux libres (duree estimee ou 30 minutes)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet SlotConflictOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `type` | string | oui | valeurs : `event`, `task` | — |
| `id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `starts_at` | string (date-time) | oui | — | — |
| `ends_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | « Problème de validation des données »; données ou paramètres invalides; « ends_at : ['La fin doit être postérieure au début'] » | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-016 — Conflits d'agenda d'une période

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Événements |
| Méthode | `GET` |
| Chemin | `/api/v1/events/conflicts` |
| Fonction | `event_conflicts` — [app/modules/planning/router.py:366](../../app/modules/planning/router.py#L366) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 5 test(s) (test_calendrier_local, test_module_7_calendar) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Conflits d'agenda d'une période.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `view` | requête | string | non | valeurs : `day`, `week`, `month` ; défaut `"week"` | — |
| `date` | requête | string (date) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.events.conflicts` ([app/modules/planning/events.py:229](../../app/modules/planning/events.py#L229)) : Chevauchements d'intervalles en UTC, sans appel au modele
  - Liste triee par debut : le premier evenement sans chevauchement arrete la recherche

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet ConflictOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `first_id` | string (uuid) | oui | — | — |
| `first_title` | string | oui | — | — |
| `second_id` | string (uuid) | oui | — | — |
| `second_title` | string | oui | — | — |
| `starts_at` | string (date-time) | oui | — | — |
| `ends_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-017 — Création d'un événement dans un calendrier externe

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Événements |
| Méthode | `POST` |
| Chemin | `/api/v1/events` |
| Fonction | `create_event` — [app/modules/planning/router.py:372](../../app/modules/planning/router.py#L372) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 12 test(s) (test_drapeaux_fonctionnalites, test_module_7_calendar) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Ecritures : chaque operation cree une demande d'action a approuver

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».
- Remarque : Création dans un calendrier externe connecté ; un événement local passe par POST /events/local (opérationnel).

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `calendar.external.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `planning.events._check_range`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `Idempotency-Key` | en-tête | string | oui | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`application/json`, schéma `EventCreateIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `title` | string | oui | longueur min. 1 ; longueur max. 255 | — |
| `description` | string (ou null) | non | longueur max. 8000 | — |
| `location` | string (ou null) | non | longueur max. 500 | — |
| `conference_url` | string (uri) (ou null) | non | longueur min. 1 | — |
| `starts_at` | string (date-time) | oui | — | — |
| `ends_at` | string (date-time) | oui | — | — |
| `attendees` | liste de string (email) | non | éléments max. 100 | — |
| `calendar_link_id` | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `EventCreateIn.with_timezone` (champ(s) starts_at, ends_at) ([app/modules/planning/router.py:276](../../app/modules/planning/router.py#L276)) : Un instant sans fuseau serait ambigu — refus (422) : « le fuseau horaire est requis »
- Contrôle dans le code (422) : calendar_link_id : ["Choisissez le calendrier ou créer l'événement"]
- Contrôle dans le code (422) : ends_at : ['La fin doit être postérieure au début']
- Contrôle dans le code (422) : starts_at : ['Date et heure de début requises (ISO 8601 avec fuseau)']
- Contrôle dans le code (422) : starts_at : ['Le fuseau horaire est requis']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.events.propose_create` ([app/modules/planning/events.py:82](../../app/modules/planning/events.py#L82)) : Creation : une demande d'action de categorie 4, jamais une ecriture directe

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Événement préparé : vérifiez-le puis approuvez-le ».
- `result` : objet ActionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) (ou null) | oui | — | — |
| `action_type` | string (énumération ActionType) | oui | valeurs : `draft_reply`, `appointment_request`, `calendar_event`, `form_preparation`, `payment_instruction`, `cancellation_inquiry`, `renewal_inquiry`, `booking_request`, `task_create`, `task_update`, `task_complete`, `email_draft`, `event_update`, `event_cancel` | — |
| `parameters` | objet (clés libres) | oui | — | — |
| `preview` | string (ou null) | oui | — | — |
| `status` | string (énumération ActionStatus) | oui | valeurs : `pending_approval`, `expired`, `approved`, `rejected`, `executing`, `succeeded`, `failed`, `cancelled` | — |
| `approved_at` | string (date-time) (ou null) | oui | — | — |
| `executed_at` | string (date-time) (ou null) | oui | — | — |
| `result` | objet (clés libres) (ou null) | oui | — | — |
| `error` | string (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `category` | integer | oui | — | — |
| `expires_at` | string (date-time) (ou null) | oui | — | — |
| `parameters_hash` | string (ou null) | oui | — | — |
| `conversation_id` | string (uuid) (ou null) | oui | — | — |
| `executable` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Calendrier introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Vous avez retiré votre accord au traitement par l'IA : réactivez-le dans Données personnelles pour utiliser cette fonction » | non |
| `422` | Données invalides | « Problème de validation des données »; « calendar_link_id : ["Choisissez le calendrier ou créer l'événement"] »; données ou paramètres invalides; « ends_at : ['La fin doit être postérieure au début'] »; « starts_at : ['Date et heure de début requises (ISO 8601 avec fuseau)'] »; « starts_at : ['Le fuseau horaire est requis'] » | oui (5) |
| `503` | Service indisponible ou non configuré | « Rédaction automatique indisponible : saisissez le message vous-même ou réessayez plus tard » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-018 — Modification d'un événement externe

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Événements |
| Méthode | `PATCH` |
| Chemin | `/api/v1/events/{event_id}` |
| Fonction | `update_event` — [app/modules/planning/router.py:377](../../app/modules/planning/router.py#L377) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 11 test(s) (test_calendrier_local, test_drapeaux_fonctionnalites, test_module_7_calendar) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Modification d'un événement externe.

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `calendar.external.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `planning.events._check_range`, `planning.events._own`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `event_id` | chemin | string (uuid) | oui | — | — |
| `Idempotency-Key` | en-tête | string | oui | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`application/json`, schéma `EventUpdateIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `title` | string (ou null) | non | longueur min. 1 ; longueur max. 255 | — |
| `description` | string (ou null) | non | longueur max. 8000 | — |
| `location` | string (ou null) | non | longueur max. 500 | — |
| `conference_url` | string (uri) (ou null) | non | longueur min. 1 | — |
| `starts_at` | string (date-time) (ou null) | non | — | — |
| `ends_at` | string (date-time) (ou null) | non | — | — |
| `attendees` | liste de string (email) (ou null) | non | éléments max. 100 | — |
| `version` | integer | oui | min. 1.0 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `EventUpdateIn.with_timezone` (champ(s) starts_at, ends_at) ([app/modules/planning/router.py:276](../../app/modules/planning/router.py#L276)) : Un instant sans fuseau serait ambigu — refus (422) : « le fuseau horaire est requis »
- Contrôle dans le code (422) : calendar_link_id : ["Choisissez le calendrier ou créer l'événement"]
- Contrôle dans le code (422) : ends_at : ['La fin doit être postérieure au début']
- Contrôle dans le code (422) : starts_at : ['Date et heure de début requises (ISO 8601 avec fuseau)']
- Contrôle dans le code (422) : starts_at : ['Le fuseau horaire est requis']
- Contrôle dans le code (422) : version : ['Aucune modification demandée']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.events.propose_update` ([app/modules/planning/events.py:200](../../app/modules/planning/events.py#L200))
  - Conflit de version : l'evenement a change depuis son affichage
  - Une action vide n'aurait rien a faire approuver

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Modification préparée : vérifiez-la puis approuvez-la ».
- `result` : objet ActionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) (ou null) | oui | — | — |
| `action_type` | string (énumération ActionType) | oui | valeurs : `draft_reply`, `appointment_request`, `calendar_event`, `form_preparation`, `payment_instruction`, `cancellation_inquiry`, `renewal_inquiry`, `booking_request`, `task_create`, `task_update`, `task_complete`, `email_draft`, `event_update`, `event_cancel` | — |
| `parameters` | objet (clés libres) | oui | — | — |
| `preview` | string (ou null) | oui | — | — |
| `status` | string (énumération ActionStatus) | oui | valeurs : `pending_approval`, `expired`, `approved`, `rejected`, `executing`, `succeeded`, `failed`, `cancelled` | — |
| `approved_at` | string (date-time) (ou null) | oui | — | — |
| `executed_at` | string (date-time) (ou null) | oui | — | — |
| `result` | objet (clés libres) (ou null) | oui | — | — |
| `error` | string (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `category` | integer | oui | — | — |
| `expires_at` | string (date-time) (ou null) | oui | — | — |
| `parameters_hash` | string (ou null) | oui | — | — |
| `conversation_id` | string (uuid) (ou null) | oui | — | — |
| `executable` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; « Seul l'organisateur peut modifier cet événement »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (2) |
| `404` | Introuvable ou inaccessible | « Événement introuvable » | non |
| `409` | Conflit avec l'état actuel | « Cet événement a été modifié entre-temps : rechargez-le »; « Vous avez retiré votre accord au traitement par l'IA : réactivez-le dans Données personnelles pour utiliser cette fonction »; « Événement du calendrier BringoMind : modifiez-le directement, sans approbation » | oui (2) |
| `410` | Expiré ou n'existe plus | « Cet événement a été annulé » | oui (1) |
| `422` | Données invalides | « Problème de validation des données »; « calendar_link_id : ["Choisissez le calendrier ou créer l'événement"] »; données ou paramètres invalides; « ends_at : ['La fin doit être postérieure au début'] »; « starts_at : ['Date et heure de début requises (ISO 8601 avec fuseau)'] »; « starts_at : ['Le fuseau horaire est requis'] »; « version : ['Aucune modification demandée'] » | oui (1) |
| `503` | Service indisponible ou non configuré | « Rédaction automatique indisponible : saisissez le message vous-même ou réessayez plus tard » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-019 — Annulation d'un événement externe

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Événements |
| Méthode | `POST` |
| Chemin | `/api/v1/events/{event_id}/cancel` |
| Fonction | `cancel_event` — [app/modules/planning/router.py:382](../../app/modules/planning/router.py#L382) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 5 test(s) (test_drapeaux_fonctionnalites, test_module_7_calendar) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Annulation d'un événement externe.

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `calendar.external.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `planning.events._own`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `event_id` | chemin | string (uuid) | oui | — | — |
| `Idempotency-Key` | en-tête | string | oui | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`application/json`, schéma `EventCancelIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `version` | integer | oui | min. 1.0 | — |
| `notify_attendees` | boolean | non | défaut `false` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : calendar_link_id : ["Choisissez le calendrier ou créer l'événement"]
- Contrôle dans le code (422) : starts_at : ['Date et heure de début requises (ISO 8601 avec fuseau)']
- Contrôle dans le code (422) : starts_at : ['Le fuseau horaire est requis']

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Annulation préparée : vérifiez-la puis approuvez-la ».
- `result` : objet ActionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) (ou null) | oui | — | — |
| `action_type` | string (énumération ActionType) | oui | valeurs : `draft_reply`, `appointment_request`, `calendar_event`, `form_preparation`, `payment_instruction`, `cancellation_inquiry`, `renewal_inquiry`, `booking_request`, `task_create`, `task_update`, `task_complete`, `email_draft`, `event_update`, `event_cancel` | — |
| `parameters` | objet (clés libres) | oui | — | — |
| `preview` | string (ou null) | oui | — | — |
| `status` | string (énumération ActionStatus) | oui | valeurs : `pending_approval`, `expired`, `approved`, `rejected`, `executing`, `succeeded`, `failed`, `cancelled` | — |
| `approved_at` | string (date-time) (ou null) | oui | — | — |
| `executed_at` | string (date-time) (ou null) | oui | — | — |
| `result` | objet (clés libres) (ou null) | oui | — | — |
| `error` | string (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `category` | integer | oui | — | — |
| `expires_at` | string (date-time) (ou null) | oui | — | — |
| `parameters_hash` | string (ou null) | oui | — | — |
| `conversation_id` | string (uuid) (ou null) | oui | — | — |
| `executable` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; « Seul l'organisateur peut modifier cet événement »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Événement introuvable » | non |
| `409` | Conflit avec l'état actuel | « Cet événement a été modifié entre-temps : rechargez-le »; « Vous avez retiré votre accord au traitement par l'IA : réactivez-le dans Données personnelles pour utiliser cette fonction »; « Événement du calendrier BringoMind : modifiez-le directement, sans approbation » | oui (1) |
| `410` | Expiré ou n'existe plus | « Cet événement a été annulé » | oui (1) |
| `422` | Données invalides | « Problème de validation des données »; « calendar_link_id : ["Choisissez le calendrier ou créer l'événement"] »; données ou paramètres invalides; « starts_at : ['Date et heure de début requises (ISO 8601 avec fuseau)'] »; « starts_at : ['Le fuseau horaire est requis'] » | non |
| `503` | Service indisponible ou non configuré | « Rédaction automatique indisponible : saisissez le message vous-même ou réessayez plus tard » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-020 — Création d'un événement local

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Événements |
| Méthode | `POST` |
| Chemin | `/api/v1/events/local` |
| Fonction | `create_local_event` — [app/modules/planning/router.py:409](../../app/modules/planning/router.py#L409) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 24 test(s) (test_calendrier_local, test_drapeaux_fonctionnalites, test_lot4_taches_et_rappels, test_lot6_assistant_voix_api, test_phase2_calendrier) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Création d'un événement local.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `planning.events._check_range`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `Idempotency-Key` | en-tête | string (ou null) | non | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`application/json`, schéma `LocalEventIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `title` | string | oui | longueur min. 1 ; longueur max. 255 | — |
| `description` | string (ou null) | non | longueur max. 8000 | — |
| `location` | string (ou null) | non | longueur max. 500 | — |
| `conference_url` | string (uri) (ou null) | non | longueur min. 1 | — |
| `starts_at` | string (date-time) | oui | — | — |
| `ends_at` | string (date-time) | oui | — | — |
| `attendees` | liste de string (email) | non | éléments max. 100 | — |
| `reminder_minutes_before` | liste de integer | non | éléments max. 3 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `LocalEventIn.with_timezone` (champ(s) starts_at, ends_at) ([app/modules/planning/router.py:276](../../app/modules/planning/router.py#L276)) : Un instant sans fuseau serait ambigu — refus (422) : « le fuseau horaire est requis »
- Validateur `LocalEventIn._offsets` (champ(s) reminder_minutes_before) ([app/modules/planning/router.py:397](../../app/modules/planning/router.py#L397)) : refus (422) : « Entre 0 et 10080 minutes avant le début »
- Contrôle dans le code (422) : channels : ["Ce canal n'est pas disponible"]
- Contrôle dans le code (422) : ends_at : ['La fin doit être postérieure au début']
- Contrôle dans le code (422) : remind_at : ['Un rappel ne peut pas être programmé dans le passé']
- Contrôle dans le code (422) : reminder_minutes_before : ['Ce rappel tomberait dans le passé']
- Contrôle dans le code (422) : repeat_every_hours : ["L'intervalle de répétition est requis"]
- Contrôle dans le code (422) : task : ["Cette tâche n'accepte plus de rappel"]

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- E-12 (en-tete facultatif, DEC-6) : requete rejouee dans les 24 heures -> evenement deja cree renvoye (200), sans doublon
- Fonction `planning.events.by_idempotency_key` ([app/modules/planning/events.py:117](../../app/modules/planning/events.py#L117)) : Evenement local deja cree par cet utilisateur avec cette cle depuis moins de 24 heures (cle gardee dans l'entree « created » de calendar_event_history : calendar_events n'a pas de colonne pour elle)
- Fonction `planning.router._event_outputs` ([app/modules/planning/router.py:319](../../app/modules/planning/router.py#L319))
  - Horaires convertis dans le fuseau de l'utilisateur
- Fonction `planning.events.create_local` ([app/modules/planning/events.py:132](../../app/modules/planning/events.py#L132))
  - A3 : rappels demandes a la creation (minutes avant le debut), verifies AVANT toute ecriture
  - A3 : rappels de l'evenement, dans la meme transaction (aucun evenement sans ses rappels en cas d'erreur)
  - E-12 : cle anti-doublons gardee dans l'historique de l'evenement (relue en cas de requete rejouee)

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Événement ajouté à votre calendrier », « Événement déjà enregistré ».
- `result` : objet EventOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `starts_at` | string | oui | — | — |
| `ends_at` | string | oui | — | — |
| `all_day` | boolean | oui | — | — |
| `status` | string (énumération EventStatus) | oui | valeurs : `confirmed`, `cancelled` | — |
| `version` | integer | oui | — | — |
| `location` | string (ou null) | oui | — | — |
| `conference_url` | string (ou null) | oui | — | — |
| `description` | string (ou null) | oui | — | — |
| `calendar_link_id` | string (uuid) (ou null) | non | — | — |
| `is_owner` | boolean | oui | — | — |
| `attendees` | liste de objet AttendeeOut | oui | — | — |
| `attendees[].id` | string (uuid) | oui | — | — |
| `attendees[].email` | string | oui | — | — |
| `attendees[].response` | string (énumération AttendeeResponse) | oui | valeurs : `needs_action`, `accepted`, `declined`, `tentative` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `201` | Créé | succès | oui (26) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `409` | Conflit avec l'état actuel | « Un rappel identique est déjà programmé ou envoyé » | non |
| `422` | Données invalides | « channels : ["Ce canal n'est pas disponible"] »; données ou paramètres invalides; « ends_at : ['La fin doit être postérieure au début'] »; « remind_at : ['Un rappel ne peut pas être programmé dans le passé'] »; « reminder_minutes_before : ['Ce rappel tomberait dans le passé'] »; « repeat_every_hours : ["L'intervalle de répétition est requis"] »; « task : ["Cette tâche n'accepte plus de rappel"] » | oui (5) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-021 — Modification d'un événement local

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Événements |
| Méthode | `PATCH` |
| Chemin | `/api/v1/events/{event_id}/local` |
| Fonction | `update_local_event` — [app/modules/planning/router.py:420](../../app/modules/planning/router.py#L420) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_calendrier_local) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Modification d'un événement local.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `planning.events._check_range`, `planning.events._own_local`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `event_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `EventUpdateIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `title` | string (ou null) | non | longueur min. 1 ; longueur max. 255 | — |
| `description` | string (ou null) | non | longueur max. 8000 | — |
| `location` | string (ou null) | non | longueur max. 500 | — |
| `conference_url` | string (uri) (ou null) | non | longueur min. 1 | — |
| `starts_at` | string (date-time) (ou null) | non | — | — |
| `ends_at` | string (date-time) (ou null) | non | — | — |
| `attendees` | liste de string (email) (ou null) | non | éléments max. 100 | — |
| `version` | integer | oui | min. 1.0 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `EventUpdateIn.with_timezone` (champ(s) starts_at, ends_at) ([app/modules/planning/router.py:276](../../app/modules/planning/router.py#L276)) : Un instant sans fuseau serait ambigu — refus (422) : « le fuseau horaire est requis »
- Contrôle dans le code (422) : ends_at : ['La fin doit être postérieure au début']
- Contrôle dans le code (422) : version : ['Aucune modification demandée']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.router._event_outputs` ([app/modules/planning/router.py:319](../../app/modules/planning/router.py#L319))
  - Horaires convertis dans le fuseau de l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Événement modifié ».
- `result` : objet EventOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `starts_at` | string | oui | — | — |
| `ends_at` | string | oui | — | — |
| `all_day` | boolean | oui | — | — |
| `status` | string (énumération EventStatus) | oui | valeurs : `confirmed`, `cancelled` | — |
| `version` | integer | oui | — | — |
| `location` | string (ou null) | oui | — | — |
| `conference_url` | string (ou null) | oui | — | — |
| `description` | string (ou null) | oui | — | — |
| `calendar_link_id` | string (uuid) (ou null) | non | — | — |
| `is_owner` | boolean | oui | — | — |
| `attendees` | liste de objet AttendeeOut | oui | — | — |
| `attendees[].id` | string (uuid) | oui | — | — |
| `attendees[].email` | string | oui | — | — |
| `attendees[].response` | string (énumération AttendeeResponse) | oui | valeurs : `needs_action`, `accepted`, `declined`, `tentative` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Seul l'organisateur peut modifier cet événement » | non |
| `404` | Introuvable ou inaccessible | — | oui (1) |
| `409` | Conflit avec l'état actuel | « Cet événement a été modifié entre-temps : rechargez-le »; « Cet événement n'appartient pas à votre calendrier BringoMind » | oui (1) |
| `410` | Expiré ou n'existe plus | « Cet événement a été annulé » | non |
| `422` | Données invalides | données ou paramètres invalides; « ends_at : ['La fin doit être postérieure au début'] »; « version : ['Aucune modification demandée'] » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-022 — Annulation d'un événement local

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Événements |
| Méthode | `POST` |
| Chemin | `/api/v1/events/{event_id}/local/cancel` |
| Fonction | `cancel_local_event` — [app/modules/planning/router.py:425](../../app/modules/planning/router.py#L425) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_calendrier_local, test_phase2_calendrier) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Annulation d'un événement local.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `planning.events._own_local`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `event_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `LocalEventCancelIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `version` | integer | oui | min. 1.0 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `planning.router._event_outputs` ([app/modules/planning/router.py:319](../../app/modules/planning/router.py#L319))
  - Horaires convertis dans le fuseau de l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Événement annulé ».
- `result` : objet EventOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `starts_at` | string | oui | — | — |
| `ends_at` | string | oui | — | — |
| `all_day` | boolean | oui | — | — |
| `status` | string (énumération EventStatus) | oui | valeurs : `confirmed`, `cancelled` | — |
| `version` | integer | oui | — | — |
| `location` | string (ou null) | oui | — | — |
| `conference_url` | string (ou null) | oui | — | — |
| `description` | string (ou null) | oui | — | — |
| `calendar_link_id` | string (uuid) (ou null) | non | — | — |
| `is_owner` | boolean | oui | — | — |
| `attendees` | liste de objet AttendeeOut | oui | — | — |
| `attendees[].id` | string (uuid) | oui | — | — |
| `attendees[].email` | string | oui | — | — |
| `attendees[].response` | string (énumération AttendeeResponse) | oui | valeurs : `needs_action`, `accepted`, `declined`, `tentative` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Seul l'organisateur peut modifier cet événement » | non |
| `404` | Introuvable ou inaccessible | — | oui (1) |
| `409` | Conflit avec l'état actuel | « Cet événement a été modifié entre-temps : rechargez-le »; « Cet événement n'appartient pas à votre calendrier BringoMind » | non |
| `410` | Expiré ou n'existe plus | « Cet événement a été annulé » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-023 — Réponse d'un participant

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Événements |
| Méthode | `PUT` |
| Chemin | `/api/v1/events/{event_id}/attendees/{attendee_id}` |
| Fonction | `attendee_response` — [app/modules/planning/router.py:430](../../app/modules/planning/router.py#L430) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_7_calendar) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Réponse d'un participant.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `planning.events._own`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `event_id` | chemin | string (uuid) | oui | — | — |
| `attendee_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `AttendeeResponseIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `response` | string (énumération AttendeeResponse) | oui | valeurs : `needs_action`, `accepted`, `declined`, `tentative` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Réponse enregistrée ».
- `result` : objet AttendeeOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `email` | string | oui | — | — |
| `response` | string (énumération AttendeeResponse) | oui | valeurs : `needs_action`, `accepted`, `declined`, `tentative` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Seul l'organisateur peut modifier cet événement » | non |
| `404` | Introuvable ou inaccessible | « Participant introuvable »; « Événement introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Horaires de travail

### API-PLN-024 — Horaires de travail

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Horaires de travail |
| Méthode | `GET` |
| Chemin | `/api/v1/calendar/work-hours` |
| Fonction | `get_work_hours` — [app/modules/planning/router.py:435](../../app/modules/planning/router.py#L435) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_api_sans_test_auparavant) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Horaires de travail.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Horaires de travail : preferences du profil (user_profiles.preferences.planning)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PLN-025 — Modification des horaires de travail

| Élément | Valeur |
|---|---|
| Module | Moteur de planification (`app/modules/planning`, spéc. D) |
| Sous-module | Horaires de travail |
| Méthode | `PUT` |
| Chemin | `/api/v1/calendar/work-hours` |
| Fonction | `set_work_hours` — [app/modules/planning/router.py:442](../../app/modules/planning/router.py#L442) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_api_sans_test_auparavant, test_module_7_calendar) |
| Utilisée par l'interface web | oui (`src/modules/calendar/api.js`) |

**Description** (commentaire et docstring du code). Modification des horaires de travail.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `WorkHoursIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `work_start` | string (time) | oui | — | — |
| `work_end` | string (time) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : work_end : ['La fin doit être postérieure au début']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Horaires de travail : preferences du profil (user_profiles.preferences.planning)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Horaires enregistrés ».
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides; « work_end : ['La fin doit être postérieure au début'] » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
