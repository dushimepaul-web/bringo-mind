<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Actions assistées par l'IA

Dossier du code : [app/modules/assisted_actions/](../../app/modules/assisted_actions/) · lettre ou numéro de la spécification : **G** · priorité **3** · documentation générée le 19/11/2026 17:30.

**6 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 4 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 2 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Demandes d'action**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-ACT-001](#api-act-001--liste-des-demandes-daction) | GET | `/api/v1/action-requests` | Liste des demandes d'action | Terminée et opérationnelle | oui |
| [API-ACT-002](#api-act-002--préparation-dune-action) | POST | `/api/v1/action-requests` | Préparation d'une action | Terminée, en attente de configuration | oui |
| [API-ACT-003](#api-act-003--modification-dune-action-en-attente) | PATCH | `/api/v1/action-requests/{action_id}` | Modification d'une action en attente | Terminée et opérationnelle | oui |
| [API-ACT-004](#api-act-004--approbation-et-exécution-dune-action) | POST | `/api/v1/action-requests/{action_id}/approve` | Approbation et exécution d'une action | Terminée, en attente de configuration | oui |
| [API-ACT-005](#api-act-005--rejet-dune-action) | POST | `/api/v1/action-requests/{action_id}/reject` | Rejet d'une action | Terminée et opérationnelle | oui |
| [API-ACT-006](#api-act-006--confirmation-dune-action-réalisée-par-lutilisateur) | POST | `/api/v1/action-requests/{action_id}/confirm-done` | Confirmation d'une action réalisée par l'utilisateur | Terminée et opérationnelle | oui |

## Sous-module : Demandes d'action

### API-ACT-001 — Liste des demandes d'action

| Élément | Valeur |
|---|---|
| Module | Actions assistées par l'IA (`app/modules/assisted_actions`, spéc. G) |
| Sous-module | Demandes d'action |
| Méthode | `GET` |
| Chemin | `/api/v1/action-requests` |
| Fonction | `list_actions` — [app/modules/assisted_actions/router.py:110](../../app/modules/assisted_actions/router.py#L110) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 22 test(s) (test_accounts, test_integrations, test_module_3_assistant, test_module_6_mail, test_module_7_calendar) |
| Utilisée par l'interface web | oui (`src/modules/assisted_actions/api.js`) |

**Description** (commentaire et docstring du code). Demandes d'action de l'utilisateur (filtre par etat facultatif), les plus recentes d'abord

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `status` | requête | string (énumération ActionStatus) (ou null) | non | valeurs : `pending_approval`, `expired`, `approved`, `rejected`, `executing`, `succeeded`, `failed`, `cancelled` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Les delais depasses sont appliques avant la lecture (sans attendre la maintenance horaire)
- Requete : demandes de l'utilisateur
- Fonction `assisted_actions.service.expire_stale` ([app/modules/assisted_actions/service.py:213](../../app/modules/assisted_actions/service.py#L213)) : Passe a « expirée » les actions en attente dont le delai d'approbation est depasse
  - Requete : actions en attente et perimees (de cet utilisateur, ou de tous pour la maintenance)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet ActionOut (ou null).

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
| `200` | Succès | succès | oui (22) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACT-002 — Préparation d'une action

| Élément | Valeur |
|---|---|
| Module | Actions assistées par l'IA (`app/modules/assisted_actions`, spéc. G) |
| Sous-module | Demandes d'action |
| Méthode | `POST` |
| Chemin | `/api/v1/action-requests` |
| Fonction | `prepare` — [app/modules/assisted_actions/router.py:122](../../app/modules/assisted_actions/router.py#L122) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 12 test(s) (test_cas_limites, test_inbox_reminders_actions, test_integrations, test_lot6_assistant_voix_api, test_module_17_execution, test_module_3_assistant) |
| Utilisée par l'interface web | oui (`src/modules/assisted_actions/api.js`) |

**Description** (commentaire et docstring du code). Preparation d'une action (en-tete Idempotency-Key obligatoire)

**État détaillé.**

- Dépendance non configurée (É-03) : Fournisseur d'IA (ANTHROPIC_API_KEY vide, fournisseur « anthropic » désactivé) : réponse 503 ou repli sur des règles.
- Remarque : Seule la rédaction automatique du message dépend de l'IA ; une action saisie par l'utilisateur fonctionne.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `assisted_actions.payments.check`, `assisted_actions.service._check_event_parameters`, `privacy.service.require_ai`, `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `Idempotency-Key` | en-tête | string | oui | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`application/json`, schéma `ActionIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `action_type` | string (énumération ActionType) | oui | valeurs : `draft_reply`, `appointment_request`, `calendar_event`, `form_preparation`, `payment_instruction`, `cancellation_inquiry`, `renewal_inquiry`, `booking_request`, `task_create`, `task_update`, `task_complete`, `email_draft`, `event_update`, `event_cancel` | — |
| `task_id` | string (uuid) (ou null) | non | — | — |
| `instructions` | string (ou null) | non | longueur max. 3000 | consignes pour la rédaction |
| `parameters` | objet (clés libres) | non | — | to, subject, body / calendar_link_id, starts_at... |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : calendar_link_id : ["Choisissez le calendrier ou créer l'événement"]
- Contrôle dans le code (422) : starts_at : ['Date et heure de début requises (ISO 8601 avec fuseau)']
- Contrôle dans le code (422) : starts_at : ['Le fuseau horaire est requis']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : demande deja creee avec cette cle ?
- meme requete rejouee : on renvoie la demande deja creee, sans doublon
- Tache liee (doit etre visible par l'utilisateur), puis preparation
- Fonction `assisted_actions.service.prepare` ([app/modules/assisted_actions/service.py:105](../../app/modules/assisted_actions/service.py#L105))
  - Meme cle d'idempotence : la demande deja creee est renvoyee (nouvel essai de l'assistant, sans doublon)
  - Copie des parametres recus
  - Message sans texte fourni : redaction par l'IA
  - Retrait du consentement a l'IA (PRIV-003) : pas de redaction automatique
  - Le detail reste dans le journal : aucune information technique n'est montree a l'utilisateur
  - Objet, texte et informations manquantes proposes
  - Evenement de calendrier : verification et completion des horaires
  - Instruction de paiement (EXE-002) : controles et points a verifier par l'utilisateur, jamais d'execution
  - Apercu de ce qui sera fait
  - Creation de la demande, en attente d'approbation, avec son delai et son empreinte
  - flush : identifiant de la demande ; trace d'audit puis enregistrement
- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Action préparée : vérifiez-la puis approuvez-la », « Demande d'action déjà enregistrée ».
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
| `201` | Créé | succès | oui (13) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | non |
| `409` | Conflit avec l'état actuel | « Vous avez retiré votre accord au traitement par l'IA : réactivez-le dans Données personnelles pour utiliser cette fonction » | non |
| `422` | Données invalides | « Problème de validation des données »; « calendar_link_id : ["Choisissez le calendrier ou créer l'événement"] »; données ou paramètres invalides; « starts_at : ['Date et heure de début requises (ISO 8601 avec fuseau)'] »; « starts_at : ['Le fuseau horaire est requis'] » | oui (4) |
| `503` | Service indisponible ou non configuré | « Rédaction automatique indisponible : saisissez le message vous-même ou réessayez plus tard » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACT-003 — Modification d'une action en attente

| Élément | Valeur |
|---|---|
| Module | Actions assistées par l'IA (`app/modules/assisted_actions`, spéc. G) |
| Sous-module | Demandes d'action |
| Méthode | `PATCH` |
| Chemin | `/api/v1/action-requests/{action_id}` |
| Fonction | `update` — [app/modules/assisted_actions/router.py:137](../../app/modules/assisted_actions/router.py#L137) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_integrations, test_module_3_assistant) |
| Utilisée par l'interface web | oui (`src/modules/assisted_actions/api.js`) |

**Description** (commentaire et docstring du code). Modification de l'apercu d'un message avant approbation

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `action_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `ActionUpdate`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `to` | string (ou null) | non | longueur max. 254 | — |
| `subject` | string (ou null) | non | longueur max. 200 | — |
| `body` | string (ou null) | non | longueur max. 20000 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : action_type : ['Seuls les messages sont modifiables']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Modifiable seulement en attente d'approbation (409 / 410 sinon), et seulement pour un message
- Fonction `assisted_actions.service.update_parameters` ([app/modules/assisted_actions/service.py:253](../../app/modules/assisted_actions/service.py#L253))
  - Modification par l'utilisateur avant sa decision : nouvel apercu et nouvelle empreinte

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Action modifiée ».
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
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Demande d'action introuvable » | non |
| `409` | Conflit avec l'état actuel | « Une décision a déjà été prise pour cette action » | non |
| `410` | Expiré ou n'existe plus | « Cette action a expiré : demandez une nouvelle proposition » | non |
| `422` | Données invalides | « action_type : ['Seuls les messages sont modifiables'] »; données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACT-004 — Approbation et exécution d'une action

| Élément | Valeur |
|---|---|
| Module | Actions assistées par l'IA (`app/modules/assisted_actions`, spéc. G) |
| Sous-module | Demandes d'action |
| Méthode | `POST` |
| Chemin | `/api/v1/action-requests/{action_id}/approve` |
| Fonction | `approve` — [app/modules/assisted_actions/router.py:146](../../app/modules/assisted_actions/router.py#L146) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 44 test(s) (test_inbox_reminders_actions, test_integrations, test_lot6_assistant_voix_api, test_module_16_planning, test_module_17_execution, test_module_3_assistant, …) |
| Utilisée par l'interface web | oui (`src/modules/assisted_actions/api.js`) |

**Description** (commentaire et docstring du code). Approbation explicite par l'utilisateur, pour la version exacte qui lui a ete presentee

**État détaillé.**

- Dépendance non configurée (É-02) : Relais d'e-mails (MAIL_HOST vide) : les e-mails sont seulement journalisés, aucun n'est envoyé.
- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».
- Remarque : L'exécution d'une action externe (envoi d'e-mail, écriture d'événement) exige le relais SMTP ou un compte connecté ; rien n'est déclaré réussi sans exécution réelle.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `core.captcha.require_captcha`, `core.captcha.verify`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `action_id` | chemin | string (uuid) | oui | — | — |
| `Idempotency-Key` | en-tête | string (ou null) | non | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`application/json`, schéma `ApproveIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `parameters_hash` | string | oui | longueur min. 64 ; longueur max. 64 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : Vérification anti-robot requise
- Contrôle dans le code (422) : Vérification anti-robot échouée
- Contrôle dans le code (422) : body : ["Complétez les informations manquantes avant d'approuver l'envoi"]
- Contrôle dans le code (422) : parameters_hash : ['Les paramètres ont changé depuis la proposition : vérifiez-les puis approuvez de nouveau']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- E-12 (en-tete facultatif, DEC-6) : approbation rejouee (double clic, nouvelle tentative du reseau) pour la meme version deja approuvee par cet utilisateur : l'action est renvoyee telle quelle, sans erreur ni seconde execution
- l'approbation va envoyer un e-mail a un tiers
- Approbation (et execution en arriere-plan si possible)
- Fonction `assisted_actions.service.approve` ([app/modules/assisted_actions/service.py:265](../../app/modules/assisted_actions/service.py#L265))
  - Seule une action en attente et non expiree peut etre approuvee (verrou pose ici)
  - L'utilisateur doit approuver la version exacte presentee, et celle-ci ne doit pas avoir change en base
  - Un message a envoyer ne doit plus contenir de passage "[a completer]"
  - Approbation enregistree (auteur, date, decision) et tracee ; l'execution doit debuter dans le delai
  - Action executable : job d'execution unique (jamais rejoue automatiquement apres un debut d'execution)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Action déjà approuvée ».
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
| `200` | Succès | succès | oui (40) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Seul le propriétaire de cette action peut la décider » | non |
| `404` | Introuvable ou inaccessible | « Demande d'action introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Une décision a déjà été prise pour cette action » | oui (9) |
| `410` | Expiré ou n'existe plus | « Cette action a expiré : demandez une nouvelle proposition » | oui (3) |
| `422` | Données invalides | « Vérification anti-robot requise »; « Vérification anti-robot échouée »; « body : ["Complétez les informations manquantes avant d'approuver l'envoi"] »; données ou paramètres invalides; « parameters_hash : ['Les paramètres ont changé depuis la proposition : vérifiez-les puis approuvez de nouveau'] » | oui (4) |
| `503` | Service indisponible ou non configuré | « Vérification anti-robot momentanément indisponible, réessayez » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACT-005 — Rejet d'une action

| Élément | Valeur |
|---|---|
| Module | Actions assistées par l'IA (`app/modules/assisted_actions`, spéc. G) |
| Sous-module | Demandes d'action |
| Méthode | `POST` |
| Chemin | `/api/v1/action-requests/{action_id}/reject` |
| Fonction | `reject` — [app/modules/assisted_actions/router.py:165](../../app/modules/assisted_actions/router.py#L165) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_module_3_assistant) |
| Utilisée par l'interface web | oui (`src/modules/assisted_actions/api.js`) |

**Description** (commentaire et docstring du code). Refus d'une action en attente de decision

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `action_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `assisted_actions.service.reject` ([app/modules/assisted_actions/service.py:290](../../app/modules/assisted_actions/service.py#L290))
  - Le rejet est une decision explicite, soumise aux memes controles que l'approbation

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Action refusée ».
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
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Seul le propriétaire de cette action peut la décider » | non |
| `404` | Introuvable ou inaccessible | « Demande d'action introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Une décision a déjà été prise pour cette action » | oui (1) |
| `410` | Expiré ou n'existe plus | « Cette action a expiré : demandez une nouvelle proposition » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACT-006 — Confirmation d'une action réalisée par l'utilisateur

| Élément | Valeur |
|---|---|
| Module | Actions assistées par l'IA (`app/modules/assisted_actions`, spéc. G) |
| Sous-module | Demandes d'action |
| Méthode | `POST` |
| Chemin | `/api/v1/action-requests/{action_id}/confirm-done` |
| Fonction | `confirm_done` — [app/modules/assisted_actions/router.py:172](../../app/modules/assisted_actions/router.py#L172) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_inbox_reminders_actions, test_module_17_execution, test_module_3_assistant) |
| Utilisée par l'interface web | oui (`src/modules/assisted_actions/api.js`) |

**Description** (commentaire et docstring du code). L'utilisateur confirme avoir realise lui-meme l'action approuvée (ou echouee)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `action_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `CompletionIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `note` | string (ou null) | non | longueur max. 2000 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : status : ["Cette action est en cours d'exécution par l'application"]
- Contrôle dans le code (422) : status : [f"Action impossible depuis l'etat '{action.status.value}'"]

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : demande de l'utilisateur ; elle passe a l'etat reussi avec confirmation par l'utilisateur
- Une action que l'application execute elle-meme attend la confirmation du service (sauf apres un echec)
- Fonction `assisted_actions.service.executable` ([app/modules/assisted_actions/service.py:300](../../app/modules/assisted_actions/service.py#L300))
  - Paiements et formulaires : jamais executes par l'application
  - sans destinataire, c'est un brouillon a copier
  - Evenement de calendrier, brouillon d'e-mail et actions internes : executables

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Réalisation confirmée ».
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
| `404` | Introuvable ou inaccessible | « Demande d'action introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides; « status : ["Cette action est en cours d'exécution par l'application"] »; « status : [f"Action impossible depuis l'etat '{action.status.value}'"] » | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
