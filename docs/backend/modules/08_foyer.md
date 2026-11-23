<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Coordination du foyer

Dossier du code : [app/modules/households/](../../app/modules/households/) · lettre ou numéro de la spécification : **F** · priorité **2** · documentation générée le 19/11/2026 17:30.

**19 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 17 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 2 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Foyers**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-FOY-001](#api-foy-001--liste-de-ses-foyers) | GET | `/api/v1/households` | Liste de ses foyers | Terminée et opérationnelle | oui |
| [API-FOY-002](#api-foy-002--création-dun-foyer) | POST | `/api/v1/households` | Création d'un foyer | Terminée et opérationnelle | oui |
| [API-FOY-009](#api-foy-009--modification-dun-foyer-nom-fuseau-devise) | PATCH | `/api/v1/households/{household_id}` | Modification d'un foyer (nom, fuseau, devise) | Terminée et opérationnelle | oui |
| [API-FOY-011](#api-foy-011--activité-récente-du-foyer) | GET | `/api/v1/households/{household_id}/activity` | Activité récente du foyer | Terminée et opérationnelle | oui |

**Membres et rôles**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-FOY-003](#api-foy-003--membres-dun-foyer) | GET | `/api/v1/households/{household_id}/members` | Membres d'un foyer | Terminée et opérationnelle | oui |
| [API-FOY-010](#api-foy-010--transfert-de-la-propriété-du-foyer) | POST | `/api/v1/households/{household_id}/transfer` | Transfert de la propriété du foyer | Terminée et opérationnelle | oui |
| [API-FOY-013](#api-foy-013--changement-du-rôle-dun-membre) | PATCH | `/api/v1/households/{household_id}/members/{member_id}` | Changement du rôle d'un membre | Terminée et opérationnelle | oui |
| [API-FOY-015](#api-foy-015--retrait-dun-membre-ou-départ-du-foyer) | DELETE | `/api/v1/households/{household_id}/members/{member_id}` | Retrait d'un membre ou départ du foyer | Terminée et opérationnelle | oui |

**Invitations**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-FOY-004](#api-foy-004--invitation-dun-membre) | POST | `/api/v1/households/{household_id}/invitations` | Invitation d'un membre | Terminée, en attente de configuration | oui |
| [API-FOY-005](#api-foy-005--aperçu-dune-invitation) | GET | `/api/v1/households/invitations/preview` | Aperçu d'une invitation | Terminée et opérationnelle | oui |
| [API-FOY-006](#api-foy-006--refus-dune-invitation) | POST | `/api/v1/households/invitations/decline` | Refus d'une invitation | Terminée et opérationnelle | oui |
| [API-FOY-007](#api-foy-007--invitations-en-attente-dun-foyer) | GET | `/api/v1/households/{household_id}/invitations` | Invitations en attente d'un foyer | Terminée et opérationnelle | oui |
| [API-FOY-008](#api-foy-008--renvoi-dune-invitation) | POST | `/api/v1/households/{household_id}/invitations/{invitation_id}/resend` | Renvoi d'une invitation | Terminée, en attente de configuration | oui |
| [API-FOY-012](#api-foy-012--annulation-dune-invitation) | DELETE | `/api/v1/households/{household_id}/invitations/{invitation_id}` | Annulation d'une invitation | Terminée et opérationnelle | oui |
| [API-FOY-014](#api-foy-014--acceptation-dune-invitation) | POST | `/api/v1/households/invitations/accept` | Acceptation d'une invitation | Terminée et opérationnelle | oui |

**Calendrier du foyer**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-FOY-016](#api-foy-016--calendrier-du-foyer) | GET | `/api/v1/households/{household_id}/events` | Calendrier du foyer | Terminée et opérationnelle | oui |
| [API-FOY-017](#api-foy-017--création-dun-événement-du-foyer) | POST | `/api/v1/households/{household_id}/events` | Création d'un événement du foyer | Terminée et opérationnelle | oui |
| [API-FOY-018](#api-foy-018--modification-dun-événement-du-foyer) | PATCH | `/api/v1/households/{household_id}/events/{event_id}` | Modification d'un événement du foyer | Terminée et opérationnelle | oui |
| [API-FOY-019](#api-foy-019--annulation-dun-événement-du-foyer) | DELETE | `/api/v1/households/{household_id}/events/{event_id}` | Annulation d'un événement du foyer | Terminée et opérationnelle | oui |

## Sous-module : Foyers

### API-FOY-001 — Liste de ses foyers

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Foyers |
| Méthode | `GET` |
| Chemin | `/api/v1/households` |
| Fonction | `list_households` — [app/modules/households/router.py:24](../../app/modules/households/router.py#L24) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 10 test(s) (test_accounts, test_bd4_administrateur_foyer, test_cas_limites, test_drapeaux_fonctionnalites, test_phase3_foyer, test_phase3_suppression_foyers) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdCalendarPage.jsx`, `src/modules/households/pages/HouseholdsPage.jsx`, `src/modules/reporting/pages/ReportsPage.jsx`, …) |

**Description** (commentaire et docstring du code). Foyers dont l'utilisateur est membre actif, avec son role

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `households.models.load_role_ids`, `households.service._roles`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : foyers et role de l'utilisateur (jointure sur les adhesions actives), par nom
- Fonction `households.service._roles` ([app/modules/households/service.py:47](../../app/modules/households/service.py#L47))
  - Identifiants des roles du foyer (donnees de reference), charges une fois

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet HouseholdOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `name` | string | oui | — | — |
| `owner_id` | string (uuid) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `role` | string (énumération HouseholdRole) (ou null) | non | valeurs : `owner`, `admin`, `member`, `viewer` | — |
| `time_zone` | string | non | défaut `"UTC"` | — |
| `version` | integer | non | défaut `1` | — |
| `currency` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (10) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-002 — Création d'un foyer

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Foyers |
| Méthode | `POST` |
| Chemin | `/api/v1/households` |
| Fonction | `create_household` — [app/modules/households/router.py:37](../../app/modules/households/router.py#L37) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 67 test(s) (test_api_sans_test_auparavant, test_bd4_administrateur_foyer, test_cas_limites, test_drapeaux_fonctionnalites, test_fonctions_plan, test_integrations, …) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdsPage.jsx`) |

**Description** (commentaire et docstring du code). Creation d'un foyer (l'utilisateur en devient proprietaire)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `households.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `households.models.load_role_ids`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `HouseholdIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `name` | string | oui | longueur min. 2 ; longueur max. 120 | — |
| `time_zone` | string (ou null) | non | longueur max. 64 | — |
| `currency` | string (ou null) | non | motif `^[A-Za-z]{3}$` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `HouseholdIn._zone` (champ(s) time_zone) ([app/modules/households/schemas.py:16](../../app/modules/households/schemas.py#L16)) : refus (422) : « fuseau horaire inconnu (ex. Africa/Bujumbura, Europe/Paris) »

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `households.service.create` ([app/modules/households/service.py:96](../../app/modules/households/service.py#L96)) : Foyer et adhesion « proprietaire », ensemble (session privilegiee : voir l'en-tete du module). E-42 : fuseau et devise saisis a la creation ; a defaut, ceux du createur. La devise est rangee dans households.settings (aucune colonne dediee dans le schema partage).

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Foyer créé ».
- `result` : objet HouseholdOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `name` | string | oui | — | — |
| `owner_id` | string (uuid) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `role` | string (énumération HouseholdRole) (ou null) | non | valeurs : `owner`, `admin`, `member`, `viewer` | — |
| `time_zone` | string | non | défaut `"UTC"` | — |
| `version` | integer | non | défaut `1` | — |
| `currency` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (69) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-009 — Modification d'un foyer (nom, fuseau, devise)

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Foyers |
| Méthode | `PATCH` |
| Chemin | `/api/v1/households/{household_id}` |
| Fonction | `update_household` — [app/modules/households/router.py:93](../../app/modules/households/router.py#L93) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 8 test(s) (test_bd4_administrateur_foyer, test_drapeaux_fonctionnalites, test_lot5_foyer_et_compte, test_phase3_foyer) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdsPage.jsx`) |

**Description** (commentaire et docstring du code). B11 : modification du nom ou du fuseau horaire du foyer (proprietaire)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `households.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `manage_members` (propriétaire seulement). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `HouseholdUpdateIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `version` | integer | oui | min. 1.0 | — |
| `name` | string (ou null) | non | longueur min. 2 ; longueur max. 120 | — |
| `time_zone` | string (ou null) | non | longueur max. 64 | — |
| `currency` | string (ou null) | non | motif `^[A-Za-z]{3}$` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `HouseholdUpdateIn._zone` (champ(s) time_zone) ([app/modules/households/schemas.py:16](../../app/modules/households/schemas.py#L16)) : refus (422) : « fuseau horaire inconnu (ex. Africa/Bujumbura, Europe/Paris) »

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Proprietaire ou administrateur (BD-4) : role reel de l'auteur
- Fonction `households.service.update_settings` ([app/modules/households/service.py:283](../../app/modules/households/service.py#L283)) : Modification du nom, du fuseau ou de la devise du foyer (proprietaire ou administrateur : household.settings.write), avec verrou de version
  - E-42 : devise du foyer (households.settings) ; le dictionnaire est remplace pour que la modification soit enregistree
  - Details sans donnee personnelle : noms des champs modifies seulement

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Foyer mis à jour ».
- `result` : objet HouseholdOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `name` | string | oui | — | — |
| `owner_id` | string (uuid) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `role` | string (énumération HouseholdRole) (ou null) | non | valeurs : `owner`, `admin`, `member`, `viewer` | — |
| `time_zone` | string | non | défaut `"UTC"` | — |
| `version` | integer | non | défaut `1` | — |
| `currency` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; « Vous n'avez pas la permission requise dans ce foyer »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (3) |
| `404` | Introuvable ou inaccessible | « Foyer introuvable » | non |
| `409` | Conflit avec l'état actuel | « Ce foyer a été modifié entre-temps : rechargez-le » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-011 — Activité récente du foyer

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Foyers |
| Méthode | `GET` |
| Chemin | `/api/v1/households/{household_id}/activity` |
| Fonction | `household_activity` — [app/modules/households/router.py:109](../../app/modules/households/router.py#L109) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 5 test(s) (test_bd4_administrateur_foyer, test_phase3_foyer) |
| Utilisée par l'interface web | oui (`src/modules/households/components/HouseholdActivity.jsx`) |

**Description** (commentaire et docstring du code). B9 : fil d'activite du foyer (tous les membres ; elements partages seulement)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |
| `limit` | requête | integer | non | min. 1 ; max. 100 ; défaut `30` | — |
| `before` | requête | string (date-time) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `households.service.activity` ([app/modules/households/service.py:409](../../app/modules/households/service.py#L409)) : Fil d'activite : evenements du foyer (journal d'audit rattache au foyer) et historique des taches partagees. Limite aux elements partages ; aucune valeur modifiee ni adresse e-mail. Ordre antichronologique ; « before » permet de charger la suite (date du dernier element recu).
  - Evenements du foyer : politique p_audit_logs_select (household.activity.read, tous les roles)
  - Historique des taches du foyer : politique p_task_history_select (acces a la tache)
  - Noms des membres actuels (vue native, sans adresse e-mail) ; ancien membre ou systeme sinon
  - Seuls des details surs : role attribue et champs modifies (noms)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet ActivityOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `at` | string (date-time) | oui | — | — |
| `kind` | string | oui | valeurs : `household`, `task`, `event` | — |
| `action` | string | oui | — | — |
| `actor_name` | string | oui | — | — |
| `is_me` | boolean | oui | — | — |
| `target_id` | string (uuid) (ou null) | non | — | — |
| `target_title` | string (ou null) | non | — | — |
| `role` | string (ou null) | non | — | — |
| `fields` | liste de string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous n'avez pas la permission requise dans ce foyer » | non |
| `404` | Introuvable ou inaccessible | « Foyer introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Membres et rôles

### API-FOY-003 — Membres d'un foyer

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Membres et rôles |
| Méthode | `GET` |
| Chemin | `/api/v1/households/{household_id}/members` |
| Fonction | `members` — [app/modules/households/router.py:44](../../app/modules/households/router.py#L44) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 9 test(s) (test_bd4_administrateur_foyer, test_cas_limites, test_fonctions_plan, test_module_15_household, test_parcours, test_tasks_planning) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdsPage.jsx`, `src/modules/reporting/components/ReportFilters.jsx`, `src/modules/tasks/components/TaskDialog.jsx`) |

**Description** (commentaire et docstring du code). Membres d'un foyer (il faut en etre membre)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `households.service.has_permission`, `households.service.membership`, `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Vue native v_household_members : nom affiche et role des co-membres (sans adresse e-mail : donnee personnelle)
- Fonction `households.service.require_permission` ([app/modules/households/service.py:72](../../app/modules/households/service.py#L72))
  - Non membre : le foyer est « introuvable » (on ne revele pas son existence)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet MemberOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `user_id` | string (uuid) | oui | — | — |
| `full_name` | string | oui | — | — |
| `email` | string (ou null) | non | — | — |
| `role` | string (énumération HouseholdRole) | oui | valeurs : `owner`, `admin`, `member`, `viewer` | — |
| `joined_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous n'avez pas la permission requise dans ce foyer » | non |
| `404` | Introuvable ou inaccessible | « Foyer introuvable » | oui (5) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-010 — Transfert de la propriété du foyer

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Membres et rôles |
| Méthode | `POST` |
| Chemin | `/api/v1/households/{household_id}/transfer` |
| Fonction | `transfer_household` — [app/modules/households/router.py:102](../../app/modules/households/router.py#L102) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 5 test(s) (test_bd4_administrateur_foyer, test_drapeaux_fonctionnalites, test_phase3_foyer) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdsPage.jsx`) |

**Description** (commentaire et docstring du code). B7 : transfert de propriete a un membre actif (l'ancien proprietaire reste membre)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `households.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `manage_members` (propriétaire seulement). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `households.service.require_permission`, `households.service.transfer_ownership`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `TransferIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `new_owner_id` | string (uuid) | oui | — | — |
| `version` | integer | oui | min. 1.0 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : new_owner_id : ["Cette personne n'est pas membre actif du foyer"]
- Contrôle dans le code (422) : new_owner_id : ['Vous êtes déjà propriétaire de ce foyer']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `households.service.transfer_ownership` ([app/modules/households/service.py:358](../../app/modules/households/service.py#L358)) : Le proprietaire cede le foyer a un membre actif. Dans une seule transaction : le membre devient proprietaire, l'ancien proprietaire devient membre (il reste dans le foyer et peut ensuite le quitter), owner_user_id change. Le declencheur differe du schema verifie a la validation qu'il reste exactement un proprietaire actif.
  - BD-4 : la propriete ne se transmet que par le proprietaire (un administrateur gere les membres, pas le foyer)
  - Nouveau proprietaire prevenu dans l'application

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Propriété transférée ».
- `result` : objet HouseholdOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `name` | string | oui | — | — |
| `owner_id` | string (uuid) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `role` | string (énumération HouseholdRole) (ou null) | non | valeurs : `owner`, `admin`, `member`, `viewer` | — |
| `time_zone` | string | non | défaut `"UTC"` | — |
| `version` | integer | non | défaut `1` | — |
| `currency` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (4) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; « Seul le propriétaire peut transférer le foyer »; « Vous n'avez pas la permission requise dans ce foyer »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (3) |
| `404` | Introuvable ou inaccessible | « Foyer introuvable » | non |
| `409` | Conflit avec l'état actuel | « Ce foyer a été modifié entre-temps : rechargez-le » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « new_owner_id : ["Cette personne n'est pas membre actif du foyer"] »; « new_owner_id : ['Vous êtes déjà propriétaire de ce foyer'] » | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-013 — Changement du rôle d'un membre

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Membres et rôles |
| Méthode | `PATCH` |
| Chemin | `/api/v1/households/{household_id}/members/{member_id}` |
| Fonction | `change_role` — [app/modules/households/router.py:123](../../app/modules/households/router.py#L123) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_bd4_administrateur_foyer, test_drapeaux_fonctionnalites, test_fonctions_plan) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdsPage.jsx`) |

**Description** (commentaire et docstring du code). Changement du role d'un membre (gestionnaires)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `households.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `manage_members` (propriétaire seulement). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `households.service._owner_only_for_admins`, `households.service.change_role`, `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |
| `member_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `RoleIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `role` | string (énumération HouseholdRole) | oui | valeurs : `owner`, `admin`, `member`, `viewer` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : role : ['Le rôle du propriétaire ne peut pas être attribué ni modifié']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `households.service.change_role` ([app/modules/households/service.py:211](../../app/modules/households/service.py#L211)) : Changement du role d'un membre par le proprietaire ou un administrateur ; le role owner est intouchable ; nommer ou retirer un administrateur : proprietaire seulement (BD-4)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Rôle modifié ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; « Vous n'avez pas la permission requise dans ce foyer »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (5) |
| `404` | Introuvable ou inaccessible | « Foyer introuvable »; « Membre introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides; « role : ['Le rôle du propriétaire ne peut pas être attribué ni modifié'] » | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-015 — Retrait d'un membre ou départ du foyer

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Membres et rôles |
| Méthode | `DELETE` |
| Chemin | `/api/v1/households/{household_id}/members/{member_id}` |
| Fonction | `remove_member` — [app/modules/households/router.py:136](../../app/modules/households/router.py#L136) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 6 test(s) (test_bd4_administrateur_foyer, test_cas_limites, test_phase3_foyer, test_phase3_suppression_foyers, test_reporting) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdsPage.jsx`) |

**Description** (commentaire et docstring du code). Retrait d'un membre (ou depart volontaire)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `manage_members` (propriétaire seulement). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `households.service._owner_only_for_admins`, `households.service.membership`, `households.service.remove_member`, `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |
| `member_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : user_id : ['Le propriétaire ne peut pas quitter son foyer']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `households.service.remove_member` ([app/modules/households/service.py:255](../../app/modules/households/service.py#L255))
  - Un administrateur ne retire pas un autre administrateur (il peut en revanche quitter le foyer)
  - Depart volontaire (session privilegiee : voir l'en-tete du module)
  - Nom d'evenement inchange ; « left » distingue un depart volontaire dans le fil d'activite

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Membre retiré du foyer ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (8) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; « Vous n'avez pas la permission requise dans ce foyer » | oui (1) |
| `404` | Introuvable ou inaccessible | « Foyer introuvable »; « Membre introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides; « user_id : ['Le propriétaire ne peut pas quitter son foyer'] » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Invitations

### API-FOY-004 — Invitation d'un membre

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Invitations |
| Méthode | `POST` |
| Chemin | `/api/v1/households/{household_id}/invitations` |
| Fonction | `invite` — [app/modules/households/router.py:56](../../app/modules/households/router.py#L56) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 50 test(s) (test_bd4_administrateur_foyer, test_cas_limites, test_drapeaux_fonctionnalites, test_fonctions_plan, test_integrations, test_lot5_foyer_et_compte, …) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdsPage.jsx`) |

**Description** (commentaire et docstring du code). Invitation d'une personne par e-mail (anti-robot obligatoire)

**État détaillé.**

- Dépendance non configurée (É-02) : Relais d'e-mails (MAIL_HOST vide) : les e-mails sont seulement journalisés, aucun n'est envoyé.
- Remarque : L'invitation est créée, l'e-mail n'est pas envoyé.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `households.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôle anti-robot (Cloudflare Turnstile) quand `TURNSTILE_SECRET_KEY` est renseignée (503 si le service de vérification ne répond pas).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `manage_members` (propriétaire seulement). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `households.service._owner_only_for_admins`, `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `InvitationIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `email` | string (email) | oui | — | — |
| `role` | string (énumération HouseholdRole) | non | valeurs : `owner`, `admin`, `member`, `viewer` ; défaut `"member"` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : role : ["Un foyer n'a qu'un seul propriétaire"]

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `households.service.invite` ([app/modules/households/service.py:114](../../app/modules/households/service.py#L114))
  - Proprietaire ou administrateur ; le role proprietaire ne peut pas etre propose, le role administrateur l'est par le proprietaire seulement
  - Une seule invitation en attente par adresse et par foyer (uq_household_memberships_pending_email)

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Invitation envoyée ».
- `result` : objet InvitationOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `email` | string | oui | — | — |
| `role` | string (énumération HouseholdRole) | oui | valeurs : `owner`, `admin`, `member`, `viewer` | — |
| `expires_at` | string (date-time) | oui | — | — |
| `accepted_at` | string (date-time) (ou null) | oui | — | — |
| `token` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (74) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; « Vous n'avez pas la permission requise dans ce foyer »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (4) |
| `404` | Introuvable ou inaccessible | « Foyer introuvable » | non |
| `409` | Conflit avec l'état actuel | « Une invitation est déjà en attente pour cette adresse » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « role : ["Un foyer n'a qu'un seul propriétaire"] » | oui (3) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-005 — Aperçu d'une invitation

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Invitations |
| Méthode | `GET` |
| Chemin | `/api/v1/households/invitations/preview` |
| Fonction | `preview_invitation` — [app/modules/households/router.py:64](../../app/modules/households/router.py#L64) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_bd4_administrateur_foyer, test_fonctions_plan) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdsPage.jsx`) |

**Description** (commentaire et docstring du code). Acceptation d'une invitation par l'utilisateur connecte Apercu d'une invitation (foyer, role, auteur) avant de l'accepter ou de la refuser

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `token` | requête | string | oui | longueur min. 10 ; longueur max. 200 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `households.service.preview` ([app/modules/households/service.py:169](../../app/modules/households/service.py#L169)) : Apercu d'une invitation valide pour son destinataire : foyer, role propose, auteur, expiration
  - Le foyer et l'auteur ne sont pas encore lisibles par l'invite (securite par ligne) : lus par le serveur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet InvitationPreviewOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `household_name` | string | oui | — | — |
| `role` | string (énumération HouseholdRole) | oui | valeurs : `owner`, `admin`, `member`, `viewer` | — |
| `invited_by` | string (ou null) | oui | — | — |
| `expires_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Invitation invalide ou expirée » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-006 — Refus d'une invitation

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Invitations |
| Méthode | `POST` |
| Chemin | `/api/v1/households/invitations/decline` |
| Fonction | `decline_invitation` — [app/modules/households/router.py:71](../../app/modules/households/router.py#L71) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_fonctions_plan) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdsPage.jsx`) |

**Description** (commentaire et docstring du code). Refus d'une invitation par son destinataire

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `AcceptInvitationIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `token` | string | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `households.service.decline` ([app/modules/households/service.py:180](../../app/modules/households/service.py#L180)) : Refus d'une invitation par son destinataire (session privilegiee : voir l'en-tete du module)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Invitation refusée ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Invitation invalide ou expirée » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-007 — Invitations en attente d'un foyer

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Invitations |
| Méthode | `GET` |
| Chemin | `/api/v1/households/{household_id}/invitations` |
| Fonction | `list_invitations` — [app/modules/households/router.py:78](../../app/modules/households/router.py#L78) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_bd4_administrateur_foyer, test_fonctions_plan, test_phase3_foyer) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdsPage.jsx`) |

**Description** (commentaire et docstring du code). Invitations en attente d'un foyer (gestionnaires)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `manage_members` (propriétaire seulement). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |
| `include_expired` | requête | boolean | non | défaut `false` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- include_expired (B10) : ajoute les invitations echues, pour pouvoir les relancer (par defaut : inchange)
- Fonction `households.service.pending_invitations` ([app/modules/households/service.py:191](../../app/modules/households/service.py#L191)) : Invitations en attente d'un foyer (proprietaire seulement) ; include_expired : aussi les echues (B10)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet InvitationOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `email` | string | oui | — | — |
| `role` | string (énumération HouseholdRole) | oui | valeurs : `owner`, `admin`, `member`, `viewer` | — |
| `expires_at` | string (date-time) | oui | — | — |
| `accepted_at` | string (date-time) (ou null) | oui | — | — |
| `token` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous n'avez pas la permission requise dans ce foyer » | non |
| `404` | Introuvable ou inaccessible | « Foyer introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-008 — Renvoi d'une invitation

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Invitations |
| Méthode | `POST` |
| Chemin | `/api/v1/households/{household_id}/invitations/{invitation_id}/resend` |
| Fonction | `resend_invitation` — [app/modules/households/router.py:85](../../app/modules/households/router.py#L85) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 4 test(s) (test_bd4_administrateur_foyer, test_drapeaux_fonctionnalites, test_phase3_foyer) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdsPage.jsx`) |

**Description** (commentaire et docstring du code). B10 : relance d'une invitation (nouveau lien valable 7 jours, l'ancien est invalide)

**État détaillé.**

- Dépendance non configurée (É-02) : Relais d'e-mails (MAIL_HOST vide) : les e-mails sont seulement journalisés, aucun n'est envoyé.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `households.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôle anti-robot (Cloudflare Turnstile) quand `TURNSTILE_SECRET_KEY` est renseignée (503 si le service de vérification ne répond pas).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `manage_members` (propriétaire seulement). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `households.service._owner_only_for_admins`, `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |
| `invitation_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `households.service.resend_invitation` ([app/modules/households/service.py:320](../../app/modules/households/service.py#L320)) : Relance par le proprietaire d'une invitation en attente, expiree ou non : nouveau jeton (l'ancien lien cesse de fonctionner), nouvelle echeance de 7 jours, nouvel e-mail. Le role propose est inchange.
  - Relancer une invitation d'administrateur revient a nommer un administrateur : proprietaire seulement
  - Pas de rattachement au fil d'activite : l'adresse de la personne invitee ne doit pas etre visible des membres

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Invitation relancée ».
- `result` : objet InvitationOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `email` | string | oui | — | — |
| `role` | string (énumération HouseholdRole) | oui | valeurs : `owner`, `admin`, `member`, `viewer` | — |
| `expires_at` | string (date-time) | oui | — | — |
| `accepted_at` | string (date-time) (ou null) | oui | — | — |
| `token` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; « Vous n'avez pas la permission requise dans ce foyer »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (3) |
| `404` | Introuvable ou inaccessible | « Foyer introuvable »; « Invitation introuvable ou déjà traitée » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-012 — Annulation d'une invitation

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Invitations |
| Méthode | `DELETE` |
| Chemin | `/api/v1/households/{household_id}/invitations/{invitation_id}` |
| Fonction | `revoke_invitation` — [app/modules/households/router.py:116](../../app/modules/households/router.py#L116) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_bd4_administrateur_foyer, test_fonctions_plan, test_phase3_foyer) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdsPage.jsx`) |

**Description** (commentaire et docstring du code). Revocation d'une invitation en attente (gestionnaires)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `manage_members` (propriétaire seulement). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |
| `invitation_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `households.service.revoke_invitation` ([app/modules/households/service.py:200](../../app/modules/households/service.py#L200)) : Revocation d'une invitation en attente par le proprietaire ou un administrateur (statut « removed »)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Invitation révoquée ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous n'avez pas la permission requise dans ce foyer » | non |
| `404` | Introuvable ou inaccessible | « Foyer introuvable »; « Invitation introuvable ou déjà traitée » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-014 — Acceptation d'une invitation

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Invitations |
| Méthode | `POST` |
| Chemin | `/api/v1/households/invitations/accept` |
| Fonction | `accept_invitation` — [app/modules/households/router.py:129](../../app/modules/households/router.py#L129) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 47 test(s) (test_bd4_administrateur_foyer, test_cas_limites, test_drapeaux_fonctionnalites, test_fonctions_plan, test_lot5_foyer_et_compte, test_module_15_household, …) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdsPage.jsx`) |

**Description** (commentaire et docstring du code). Acceptation d'une invitation.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `households.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `households.models.load_role_ids`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `AcceptInvitationIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `token` | string | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `households.service.accept` ([app/modules/households/service.py:230](../../app/modules/households/service.py#L230))
  - Pas de verrou ici : SELECT ... FOR UPDATE exige le droit de modifier (reserve au proprietaire) ; la fonction native d'acceptation verrouille elle-meme l'invitation
  - Ancien membre (retire ou parti) : son adhesion est reactivee, l'invitation est close
  - (une seule adhesion par personne et par foyer : uq_household_memberships_user)
  - Fonction native : verifie l'adresse et l'expiration, puis rend l'adhesion active

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Bienvenue dans le foyer ».
- `result` : objet HouseholdOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `name` | string | oui | — | — |
| `owner_id` | string (uuid) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `role` | string (énumération HouseholdRole) (ou null) | non | valeurs : `owner`, `admin`, `member`, `viewer` | — |
| `time_zone` | string | non | défaut `"UTC"` | — |
| `version` | integer | non | défaut `1` | — |
| `currency` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (63) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Invitation invalide ou expirée » | oui (8) |
| `409` | Conflit avec l'état actuel | « Vous êtes déjà membre de ce foyer » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Calendrier du foyer

### API-FOY-016 — Calendrier du foyer

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Calendrier du foyer |
| Méthode | `GET` |
| Chemin | `/api/v1/households/{household_id}/events` |
| Fonction | `household_events` — [app/modules/households/router.py:180](../../app/modules/households/router.py#L180) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_15_household) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdCalendarPage.jsx`) |

**Description** (commentaire et docstring du code). Calendrier du foyer.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |
| `start` | requête | string (date-time) | oui | — | — |
| `end` | requête | string (date-time) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet HouseholdEventOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `household_id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `starts_at` | string (date-time) | oui | — | — |
| `ends_at` | string (date-time) | oui | — | — |
| `all_day` | boolean | oui | — | — |
| `location` | string (ou null) | oui | — | — |
| `description` | string (ou null) | oui | — | — |
| `version` | integer | oui | — | — |
| `created_by` | string (uuid) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous n'avez pas la permission requise dans ce foyer » | non |
| `404` | Introuvable ou inaccessible | « Foyer introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-017 — Création d'un événement du foyer

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Calendrier du foyer |
| Méthode | `POST` |
| Chemin | `/api/v1/households/{household_id}/events` |
| Fonction | `create_household_event` — [app/modules/households/router.py:185](../../app/modules/households/router.py#L185) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_bd4_administrateur_foyer, test_drapeaux_fonctionnalites, test_module_15_household, test_phase3_foyer) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdCalendarPage.jsx`, `src/modules/households/pages/HouseholdsPage.jsx`) |

**Description** (commentaire et docstring du code). Création d'un événement du foyer.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `households.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `edit_tasks` (propriétaire, membre). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `households.calendar._check`, `households.calendar._notify_members`, `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `HouseholdEventIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `title` | string | oui | longueur min. 1 ; longueur max. 255 | — |
| `starts_at` | string (date-time) | oui | — | — |
| `ends_at` | string (date-time) | oui | — | — |
| `all_day` | boolean | non | défaut `false` | — |
| `location` | string (ou null) | non | longueur max. 500 | — |
| `description` | string (ou null) | non | longueur max. 5000 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : ends_at : ['La fin doit suivre le début']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `households.calendar.create_event` ([app/modules/households/calendar.py:51](../../app/modules/households/calendar.py#L51))
  - B11 : heure annoncee dans le fuseau du foyer (avec son nom), et non plus en UTC

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Événement ajouté au calendrier du foyer ».
- `result` : objet HouseholdEventOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `household_id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `starts_at` | string (date-time) | oui | — | — |
| `ends_at` | string (date-time) | oui | — | — |
| `all_day` | boolean | oui | — | — |
| `location` | string (ou null) | oui | — | — |
| `description` | string (ou null) | oui | — | — |
| `version` | integer | oui | — | — |
| `created_by` | string (uuid) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; « Vous n'avez pas la permission requise dans ce foyer »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (2) |
| `404` | Introuvable ou inaccessible | « Foyer introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides; « ends_at : ['La fin doit suivre le début'] » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-018 — Modification d'un événement du foyer

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Calendrier du foyer |
| Méthode | `PATCH` |
| Chemin | `/api/v1/households/{household_id}/events/{event_id}` |
| Fonction | `update_household_event` — [app/modules/households/router.py:190](../../app/modules/households/router.py#L190) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_drapeaux_fonctionnalites, test_module_15_household) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdCalendarPage.jsx`) |

**Description** (commentaire et docstring du code). Modification d'un événement du foyer.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `households.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `edit_tasks` (propriétaire, membre). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `households.calendar._check`, `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |
| `event_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `HouseholdEventUpdate`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `version` | integer | oui | — | — |
| `title` | string (ou null) | non | longueur min. 1 ; longueur max. 255 | — |
| `starts_at` | string (date-time) (ou null) | non | — | — |
| `ends_at` | string (date-time) (ou null) | non | — | — |
| `all_day` | boolean (ou null) | non | — | — |
| `location` | string (ou null) | non | longueur max. 500 | — |
| `description` | string (ou null) | non | longueur max. 5000 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : ends_at : ['La fin doit suivre le début']

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Événement modifié ».
- `result` : objet HouseholdEventOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `household_id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `starts_at` | string (date-time) | oui | — | — |
| `ends_at` | string (date-time) | oui | — | — |
| `all_day` | boolean | oui | — | — |
| `location` | string (ou null) | oui | — | — |
| `description` | string (ou null) | oui | — | — |
| `version` | integer | oui | — | — |
| `created_by` | string (uuid) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; « Vous n'avez pas la permission requise dans ce foyer »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (2) |
| `404` | Introuvable ou inaccessible | « Foyer introuvable »; « Événement introuvable » | non |
| `409` | Conflit avec l'état actuel | « Cet événement a été modifié entre-temps : rechargez-le » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « ends_at : ['La fin doit suivre le début'] » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-FOY-019 — Annulation d'un événement du foyer

| Élément | Valeur |
|---|---|
| Module | Coordination du foyer (`app/modules/households`, spéc. F) |
| Sous-module | Calendrier du foyer |
| Méthode | `DELETE` |
| Chemin | `/api/v1/households/{household_id}/events/{event_id}` |
| Fonction | `cancel_household_event` — [app/modules/households/router.py:195](../../app/modules/households/router.py#L195) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_15_household) |
| Utilisée par l'interface web | oui (`src/modules/households/pages/HouseholdCalendarPage.jsx`) |

**Description** (commentaire et docstring du code). Annulation d'un événement du foyer.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `edit_tasks` (propriétaire, membre). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `households.calendar._notify_members`, `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `household_id` | chemin | string (uuid) | oui | — | — |
| `event_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Événement annulé ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous n'avez pas la permission requise dans ce foyer » | non |
| `404` | Introuvable ou inaccessible | « Foyer introuvable »; « Événement introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
