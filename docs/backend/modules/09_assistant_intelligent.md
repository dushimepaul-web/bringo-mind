<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Assistant intelligent central

Dossier du code : [app/modules/assistant/](../../app/modules/assistant/) · lettre ou numéro de la spécification : **M3** · priorité **1** · documentation générée le 19/11/2026 17:30.

**15 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 13 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 2 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Conversations et messages**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-AST-001](#api-ast-001--liste-des-conversations) | GET | `/api/v1/assistant/conversations` | Liste des conversations | Terminée et opérationnelle | oui |
| [API-AST-002](#api-ast-002--création-dune-conversation) | POST | `/api/v1/assistant/conversations` | Création d'une conversation | Terminée et opérationnelle | oui |
| [API-AST-003](#api-ast-003--conversation-et-ses-messages) | GET | `/api/v1/assistant/conversations/{conversation_id}` | Conversation et ses messages | Terminée et opérationnelle | oui |
| [API-AST-004](#api-ast-004--renommage-dune-conversation) | PATCH | `/api/v1/assistant/conversations/{conversation_id}` | Renommage d'une conversation | Terminée et opérationnelle | oui |
| [API-AST-005](#api-ast-005--archivage-dune-conversation) | POST | `/api/v1/assistant/conversations/{conversation_id}/archive` | Archivage d'une conversation | Terminée et opérationnelle | oui |
| [API-AST-006](#api-ast-006--désarchivage-dune-conversation) | POST | `/api/v1/assistant/conversations/{conversation_id}/unarchive` | Désarchivage d'une conversation | Terminée et opérationnelle | oui |
| [API-AST-007](#api-ast-007--restauration-dune-conversation-supprimée) | POST | `/api/v1/assistant/conversations/{conversation_id}/restore` | Restauration d'une conversation supprimée | Terminée et opérationnelle | oui |
| [API-AST-008](#api-ast-008--suppression-dune-conversation-corbeille) | DELETE | `/api/v1/assistant/conversations/{conversation_id}` | Suppression d'une conversation (corbeille) | Terminée et opérationnelle | oui |
| [API-AST-009](#api-ast-009--envoi-dun-message-à-lassistant) | POST | `/api/v1/assistant/conversations/{conversation_id}/messages` | Envoi d'un message à l'assistant | Terminée, en attente de configuration | oui |
| [API-AST-010](#api-ast-010--suppression-dun-message) | DELETE | `/api/v1/assistant/conversations/{conversation_id}/messages/{message_id}` | Suppression d'un message | Terminée et opérationnelle | oui |

**Pièces jointes**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-AST-011](#api-ast-011--ajout-dune-pièce-jointe) | POST | `/api/v1/assistant/attachments` | Ajout d'une pièce jointe | Terminée, en attente de configuration | oui |
| [API-AST-012](#api-ast-012--téléchargement-dune-pièce-jointe) | GET | `/api/v1/assistant/attachments/{attachment_id}/download` | Téléchargement d'une pièce jointe | Terminée et opérationnelle | oui |
| [API-AST-013](#api-ast-013--suppression-dune-pièce-jointe) | DELETE | `/api/v1/assistant/attachments/{attachment_id}` | Suppression d'une pièce jointe | Terminée et opérationnelle | oui |

**Historique et consommation**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-AST-014](#api-ast-014--historique-des-exécutions-de-lassistant) | GET | `/api/v1/assistant/history` | Historique des exécutions de l'assistant | Terminée et opérationnelle | oui |
| [API-AST-015](#api-ast-015--consommation-de-lassistant) | GET | `/api/v1/assistant/usage` | Consommation de l'assistant | Terminée et opérationnelle | oui |

## Sous-module : Conversations et messages

### API-AST-001 — Liste des conversations

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Conversations et messages |
| Méthode | `GET` |
| Chemin | `/api/v1/assistant/conversations` |
| Fonction | `list_conversations` — [app/modules/assistant/router.py:216](../../app/modules/assistant/router.py#L216) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 7 test(s) (test_lot6_assistant_voix_api, test_module_3_assistant) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). Historique des conversations (actives ou archivees), les plus recentes d'abord

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `status` | requête | string | non | valeurs : `active`, `archived`, `deleted` ; défaut `"active"` | — |
| `page` | requête | integer | non | min. 1 ; défaut `1` | — |
| `page_size` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |
| `cursor` | requête | string (ou null) | non | longueur max. 500 | — |
| `limit` | requête | integer (ou null) | non | min. 1 ; max. 100 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- E-14 : « deleted » = corbeille (conversations supprimees depuis moins de 30 jours)
- Fonction `assistant.service.deleted_conversations` ([app/modules/assistant/service.py:286](../../app/modules/assistant/service.py#L286)) : Conversations supprimees depuis moins de 30 jours (restaurables), les plus recentes d'abord

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet Page_ConversationOut_ (ou null).
- Liste paginée : `items`, `total`, `page`, `page_size`, `next_cursor` (voir CONVENTIONS.md).

| Champ de `result` (élément de `items`) | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `last_message_at` | string (date-time) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `deleted_at` | string (date-time) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (9) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-AST-002 — Création d'une conversation

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Conversations et messages |
| Méthode | `POST` |
| Chemin | `/api/v1/assistant/conversations` |
| Fonction | `create_conversation` — [app/modules/assistant/router.py:227](../../app/modules/assistant/router.py#L227) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 121 test(s) (test_drapeaux_fonctionnalites, test_lot6_assistant_voix_api, test_module_11_settings, test_module_13_privacy, test_module_3_assistant, test_module_3_attachments, …) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). Creation au premier message

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `ai.assistant.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `assistant.service._require_open`, `core.auth.check_feature`, `core.auth.require_feature`, `privacy.service.require_ai`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `Idempotency-Key` | en-tête | string (ou null) | non | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`application/json`, schéma `MessageIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `content` | string | oui | longueur min. 1 ; longueur max. 4000 | — |
| `choice` | objet ChoiceIn (ou null) | non | — | — |
| `choice.key` | string | oui | longueur max. 80 | — |
| `choice.id` | string | oui | longueur max. 80 | — |
| `attachment_ids` | liste de string (uuid) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `MessageIn.not_blank` (champ(s) content) ([app/modules/assistant/router.py:46](../../app/modules/assistant/router.py#L46)) : Un message compose uniquement d'espaces est refuse — refus (422) : « le message ne peut pas être vide »
- Contrôle dans le code (422) : Fichier illisible : retirez-le ou remplacez-le
- Contrôle dans le code (422) : attachment_ids : ['5 fichiers au plus par message']
- Contrôle dans le code (422) : choice : ["Aucun choix n'est attendu"]
- Contrôle dans le code (422) : choice : ["Ce choix n'est pas proposé"]

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `assistant.router._posted` ([app/modules/assistant/router.py:233](../../app/modules/assistant/router.py#L233))
  - Reponse commune : la demande est enregistree, son traitement se poursuit en arriere-plan
- Fonction `assistant.service.post_message` ([app/modules/assistant/service.py:381](../../app/modules/assistant/service.py#L381)) : Enregistre le message et programme son traitement ; renvoie (conversation, message, traitement)
  - Requete rejouee : le message deja enregistre est renvoye, sans doublon
  - Aucun fournisseur configure : refus immediat, rien n'est enregistre
  - Consentement au traitement par l'IA retire (PRIV-003) : refus explicite (409)
  - Le quota bloque la demande avant tout enregistrement (AI-006 AC1), sauf pour un choix deja interprete
  - Delais appliques d'abord : leur commit libererait le verrou pose juste apres
  - Verrou : deux envois simultanes dans une conversation ne creent pas deux traitements
  - Fichiers joints : droits, etat et volume controles avant tout enregistrement
  - Premiere demande : creation de la conversation, avec un titre provisoire
  - Enregistrement du message et du traitement dans une seule transaction : aucune perte, aucun message orphelin
  - Les fichiers restent associes a cette conversation et a ce message

**Réponse en cas de succès.**

- Code HTTP **202**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet PostedOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `conversation_id` | string (uuid) | oui | — | — |
| `message_id` | string (uuid) | oui | — | — |
| `run_id` | string (uuid) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `202` | Accepté, traité en arrière-plan | succès | oui (110) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; « Vous n'avez pas accès à ce fichier »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Conversation introuvable »; « Fichier introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Ce fichier est déjà joint à un message »; « Cette conversation est archivée : elle ne peut plus être modifiée »; « Une demande est déjà en cours de traitement dans cette conversation »; « Vous avez retiré votre accord au traitement par l'IA : réactivez-le dans Données personnelles pour utiliser cette fonction » | oui (2) |
| `413` | Fichier trop volumineux | « Ces fichiers sont trop volumineux pour être analysés ensemble » | oui (1) |
| `422` | Données invalides | « Fichier illisible : retirez-le ou remplacez-le »; « attachment_ids : ['5 fichiers au plus par message'] »; « choice : ["Aucun choix n'est attendu"] »; « choice : ["Ce choix n'est pas proposé"] »; données ou paramètres invalides | oui (10) |
| `429` | Trop de requêtes | « Trop de requêtes » | oui (1) |
| `503` | Service indisponible ou non configuré | « L'assistant est momentanément indisponible : votre demande précédente sera relancée automatiquement »; « L'assistant est momentanément indisponible, réessayez plus tard » | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-AST-003 — Conversation et ses messages

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Conversations et messages |
| Méthode | `GET` |
| Chemin | `/api/v1/assistant/conversations/{conversation_id}` |
| Fonction | `get_conversation` — [app/modules/assistant/router.py:239](../../app/modules/assistant/router.py#L239) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 100 test(s) (test_lot6_assistant_voix_api, test_module_11_settings, test_module_3_assistant, test_module_3_attachments, test_module_8_voice) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). Conversation avec ses messages

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `conversation_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `assistant.router._detail` ([app/modules/assistant/router.py:191](../../app/modules/assistant/router.py#L191))
  - Delais appliques avant la lecture : l'affichage ne depend pas de la maintenance horaire
  - Requete : messages non supprimes, du plus ancien au plus recent
  - Requete : actions proposees dans cette conversation
  - Requete : fichiers non supprimes de la conversation
  - Requete : traitement en cours eventuel
- Fonction `assistant.service.get_conversation` ([app/modules/assistant/service.py:219](../../app/modules/assistant/service.py#L219))
  - Conversation d'autrui ou supprimee : introuvable (404), sans reveler son existence

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet ConversationDetail (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `last_message_at` | string (date-time) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `deleted_at` | string (date-time) (ou null) | non | — | — |
| `messages` | liste de objet app__modules__assistant__router__MessageOut | oui | — | — |
| `messages[].id` | string (uuid) | oui | — | — |
| `messages[].role` | string (énumération MessageRole) | oui | valeurs : `user`, `assistant` | — |
| `messages[].kind` | string (énumération MessageKind) | oui | valeurs : `message`, `clarification`, `error`, `expiry` | — |
| `messages[].content` | string | oui | — | — |
| `messages[].sources` | liste de objet SourceOut | oui | — | — |
| `messages[].unverified` | liste de string | oui | — | — |
| `messages[].needs_verification` | boolean | oui | — | — |
| `messages[].choices` | liste de objet (clés libres) | oui | — | — |
| `messages[].actions` | liste de objet ActionOut | oui | — | — |
| `messages[].attachments` | liste de objet AttachmentOut | oui | — | — |
| `messages[].created_at` | string (date-time) | oui | — | — |
| `active_run` | objet ActiveRunOut (ou null) | oui | — | — |
| `active_run.id` | string (uuid) | oui | — | — |
| `active_run.status` | string (énumération RunStatus) | oui | valeurs : `queued`, `running`, `retrying`, `awaiting_clarification`, `completed`, `failed`, `expired`, `cancelled` | — |
| `active_run.next_retry_at` | string (date-time) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (122) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Conversation introuvable » | oui (3) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-AST-004 — Renommage d'une conversation

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Conversations et messages |
| Méthode | `PATCH` |
| Chemin | `/api/v1/assistant/conversations/{conversation_id}` |
| Fonction | `rename_conversation` — [app/modules/assistant/router.py:245](../../app/modules/assistant/router.py#L245) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_3_assistant) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). Renommage

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `assistant.service._require_open`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `conversation_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `RenameIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `title` | string | oui | longueur min. 1 ; longueur max. 200 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `RenameIn.not_blank` (champ(s) title) ([app/modules/assistant/router.py:60](../../app/modules/assistant/router.py#L60)) : refus (422) : « le titre ne peut pas être vide »

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `assistant.service.rename` ([app/modules/assistant/service.py:234](../../app/modules/assistant/service.py#L234))
  - Titre choisi par l'utilisateur : il ne sera plus remplace par le titre genere

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Conversation renommée ».
- `result` : objet ConversationOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `last_message_at` | string (date-time) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `deleted_at` | string (date-time) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Conversation introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Cette conversation est archivée : elle ne peut plus être modifiée » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-AST-005 — Archivage d'une conversation

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Conversations et messages |
| Méthode | `POST` |
| Chemin | `/api/v1/assistant/conversations/{conversation_id}/archive` |
| Fonction | `archive_conversation` — [app/modules/assistant/router.py:251](../../app/modules/assistant/router.py#L251) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 7 test(s) (test_lot6_assistant_voix_api, test_module_3_assistant, test_module_3_attachments) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). Archivage : plus de nouveau message

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `assistant.service._require_open`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `conversation_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `assistant.service.archive` ([app/modules/assistant/service.py:249](../../app/modules/assistant/service.py#L249))
  - Archivage : plus de nouveau message, les traitements en cours sont annules

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Conversation archivée ».
- `result` : objet ConversationOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `last_message_at` | string (date-time) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `deleted_at` | string (date-time) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Conversation introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Cette conversation est archivée : elle ne peut plus être modifiée » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-AST-006 — Désarchivage d'une conversation

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Conversations et messages |
| Méthode | `POST` |
| Chemin | `/api/v1/assistant/conversations/{conversation_id}/unarchive` |
| Fonction | `unarchive_conversation` — [app/modules/assistant/router.py:257](../../app/modules/assistant/router.py#L257) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_lot6_assistant_voix_api) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). E-14 : desarchivage (la conversation accepte de nouveau des messages)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `conversation_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `assistant.service.unarchive` ([app/modules/assistant/service.py:275](../../app/modules/assistant/service.py#L275)) : Conversation archivee rendue active : elle accepte de nouveau des messages

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Conversation désarchivée ».
- `result` : objet ConversationOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `last_message_at` | string (date-time) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `deleted_at` | string (date-time) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Conversation introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Cette conversation n'est pas archivée » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-AST-007 — Restauration d'une conversation supprimée

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Conversations et messages |
| Méthode | `POST` |
| Chemin | `/api/v1/assistant/conversations/{conversation_id}/restore` |
| Fonction | `restore_conversation` — [app/modules/assistant/router.py:263](../../app/modules/assistant/router.py#L263) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_lot6_assistant_voix_api) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). E-14 : restauration d'une conversation supprimee (30 jours)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `conversation_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `assistant.service.restore_conversation` ([app/modules/assistant/service.py:292](../../app/modules/assistant/service.py#L292)) : Restauration d'une conversation supprimee, avec les fichiers retires en meme temps qu'elle. Les traitements et propositions d'action annules a la suppression restent annules (aucune action ne repart seule).
  - Fichiers supprimes avec la conversation (meme instant, a quelques secondes pres), hors messages supprimes a part

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Conversation restaurée ».
- `result` : objet ConversationOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `last_message_at` | string (date-time) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `deleted_at` | string (date-time) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Conversation introuvable dans la corbeille » | oui (1) |
| `410` | Expiré ou n'existe plus | « Le délai de restauration de 30 jours est dépassé » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-AST-008 — Suppression d'une conversation (corbeille)

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Conversations et messages |
| Méthode | `DELETE` |
| Chemin | `/api/v1/assistant/conversations/{conversation_id}` |
| Fonction | `delete_conversation` — [app/modules/assistant/router.py:269](../../app/modules/assistant/router.py#L269) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 6 test(s) (test_lot6_assistant_voix_api, test_module_3_assistant, test_module_3_attachments) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). Suppression logique (purge apres 30 jours)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `conversation_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `assistant.service.delete_conversation` ([app/modules/assistant/service.py:259](../../app/modules/assistant/service.py#L259))
  - Suppression logique (purge apres 30 jours), fichiers, traitements et propositions en attente annules

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Conversation supprimée ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Conversation introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-AST-009 — Envoi d'un message à l'assistant

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Conversations et messages |
| Méthode | `POST` |
| Chemin | `/api/v1/assistant/conversations/{conversation_id}/messages` |
| Fonction | `post_message` — [app/modules/assistant/router.py:276](../../app/modules/assistant/router.py#L276) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 18 test(s) (test_drapeaux_fonctionnalites, test_lot6_assistant_voix_api, test_module_3_assistant, test_module_3_attachments) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). Nouveau message dans une conversation

**État détaillé.**

- Dépendance non configurée (É-03) : Fournisseur d'IA (ANTHROPIC_API_KEY vide, fournisseur « anthropic » désactivé) : réponse 503 ou repli sur des règles.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `ai.assistant.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `assistant.service._require_open`, `core.auth.check_feature`, `core.auth.require_feature`, `privacy.service.require_ai`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `conversation_id` | chemin | string (uuid) | oui | — | — |
| `Idempotency-Key` | en-tête | string (ou null) | non | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`application/json`, schéma `MessageIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `content` | string | oui | longueur min. 1 ; longueur max. 4000 | — |
| `choice` | objet ChoiceIn (ou null) | non | — | — |
| `choice.key` | string | oui | longueur max. 80 | — |
| `choice.id` | string | oui | longueur max. 80 | — |
| `attachment_ids` | liste de string (uuid) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `MessageIn.not_blank` (champ(s) content) ([app/modules/assistant/router.py:46](../../app/modules/assistant/router.py#L46)) : Un message compose uniquement d'espaces est refuse — refus (422) : « le message ne peut pas être vide »
- Contrôle dans le code (422) : Fichier illisible : retirez-le ou remplacez-le
- Contrôle dans le code (422) : attachment_ids : ['5 fichiers au plus par message']
- Contrôle dans le code (422) : choice : ["Aucun choix n'est attendu"]
- Contrôle dans le code (422) : choice : ["Ce choix n'est pas proposé"]

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `assistant.router._posted` ([app/modules/assistant/router.py:233](../../app/modules/assistant/router.py#L233))
  - Reponse commune : la demande est enregistree, son traitement se poursuit en arriere-plan
- Fonction `assistant.service.post_message` ([app/modules/assistant/service.py:381](../../app/modules/assistant/service.py#L381)) : Enregistre le message et programme son traitement ; renvoie (conversation, message, traitement)
  - Requete rejouee : le message deja enregistre est renvoye, sans doublon
  - Aucun fournisseur configure : refus immediat, rien n'est enregistre
  - Consentement au traitement par l'IA retire (PRIV-003) : refus explicite (409)
  - Le quota bloque la demande avant tout enregistrement (AI-006 AC1), sauf pour un choix deja interprete
  - Delais appliques d'abord : leur commit libererait le verrou pose juste apres
  - Verrou : deux envois simultanes dans une conversation ne creent pas deux traitements
  - Fichiers joints : droits, etat et volume controles avant tout enregistrement
  - Premiere demande : creation de la conversation, avec un titre provisoire
  - Enregistrement du message et du traitement dans une seule transaction : aucune perte, aucun message orphelin
  - Les fichiers restent associes a cette conversation et a ce message

**Réponse en cas de succès.**

- Code HTTP **202**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet PostedOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `conversation_id` | string (uuid) | oui | — | — |
| `message_id` | string (uuid) | oui | — | — |
| `run_id` | string (uuid) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `202` | Accepté, traité en arrière-plan | succès | oui (13) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; « Vous n'avez pas accès à ce fichier »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Conversation introuvable »; « Fichier introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Ce fichier est déjà joint à un message »; « Cette conversation est archivée : elle ne peut plus être modifiée »; « Une demande est déjà en cours de traitement dans cette conversation »; « Vous avez retiré votre accord au traitement par l'IA : réactivez-le dans Données personnelles pour utiliser cette fonction » | oui (10) |
| `413` | Fichier trop volumineux | « Ces fichiers sont trop volumineux pour être analysés ensemble » | non |
| `422` | Données invalides | « Fichier illisible : retirez-le ou remplacez-le »; « attachment_ids : ['5 fichiers au plus par message'] »; « choice : ["Aucun choix n'est attendu"] »; « choice : ["Ce choix n'est pas proposé"] »; données ou paramètres invalides | oui (1) |
| `429` | Trop de requêtes | « Trop de requêtes » | non |
| `503` | Service indisponible ou non configuré | « L'assistant est momentanément indisponible : votre demande précédente sera relancée automatiquement »; « L'assistant est momentanément indisponible, réessayez plus tard » | oui (3) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-AST-010 — Suppression d'un message

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Conversations et messages |
| Méthode | `DELETE` |
| Chemin | `/api/v1/assistant/conversations/{conversation_id}/messages/{message_id}` |
| Fonction | `delete_message` — [app/modules/assistant/router.py:284](../../app/modules/assistant/router.py#L284) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_module_3_assistant, test_module_3_attachments) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). Suppression d'un message : il sort immediatement du contexte

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `assistant.service._require_open`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `conversation_id` | chemin | string (uuid) | oui | — | — |
| `message_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `assistant.service.delete_message` ([app/modules/assistant/service.py:314](../../app/modules/assistant/service.py#L314))
  - Requete : message non supprime de cette conversation
  - Les fichiers joints a ce message sortent aussi du contexte
  - Une demande en cours ou en attente fondee sur ce message n'est pas poursuivie

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Message supprimé ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Conversation introuvable »; « Message introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Cette conversation est archivée : elle ne peut plus être modifiée » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Pièces jointes

### API-AST-011 — Ajout d'une pièce jointe

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Pièces jointes |
| Méthode | `POST` |
| Chemin | `/api/v1/assistant/attachments` |
| Fonction | `upload_attachment` — [app/modules/assistant/router.py:291](../../app/modules/assistant/router.py#L291) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 63 test(s) (test_drapeaux_fonctionnalites, test_module_3_attachments) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). Televersement d'un fichier, ensuite joint a un message

**État détaillé.**

- Dépendance non configurée (É-01) : Antivirus ClamAV (CLAMAV_HOST vide) : l'analyse est ignorée (SKIPPED), le fichier est traité sans antivirus.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `ai.assistant.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `assistant.attachments.check_file`, `core.auth.check_feature`, `core.auth.require_feature`.
- Limitation de débit : 60 requêtes POST par minute et par adresse IP (préfixe `/api/v1/assistant/attachments`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`multipart/form-data`, schéma `Body_upload_attachment_api_v1_assistant_attachments_post`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `file` | fichier | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : Fichier illisible : il a été conservé, mais il ne peut pas être analysé

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Lecture limitee : un octet de plus que le maximum suffit a detecter un fichier trop volumineux
- AC8 : erreur signalee, fichier conserve et renvoye pour que l'interface puisse l'afficher
- Fonction `assistant.attachments.upload` ([app/modules/assistant/attachments.py:263](../../app/modules/assistant/attachments.py#L263)) : Controle, analyse antivirus, stockage puis lecture ; le fichier reste conserve si la lecture echoue
  - Limite des fichiers televerses mais pas encore envoyes
  - Fichier infecte : refus, trace d'audit conservee malgre l'erreur
  - Enregistrement du fichier d'origine dans le stockage securise (jamais public)
  - Empreinte SHA-256 obligatoire (documents.sha256)
  - AC8 : l'erreur est signalee, le fichier d'origine n'est pas perdu

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Fichier prêt à analyser ».
- `result` : objet AttachmentOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `conversation_id` | string (uuid) (ou null) | oui | — | — |
| `message_id` | string (uuid) (ou null) | oui | — | — |
| `file_name` | string | oui | — | — |
| `mime_type` | string | oui | — | — |
| `file_size` | integer | oui | — | — |
| `processing_status` | string (énumération AttachmentStatus) | oui | valeurs : `processing`, `ready`, `failed` | — |
| `error_code` | string (ou null) | oui | — | — |
| `page_count` | integer (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (52) |
| `400` | Requête invalide | « Fichier invalide : il est vide »; « Fichier invalide : nom manquant »; « Fichier invalide : son contenu ne correspond pas à son extension »; « Fichier refusé : un logiciel malveillant a été détecté » | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `413` | Fichier trop volumineux | « Le fichier dépasse {settings.max_upload_mb} Mo » | oui (1) |
| `415` | Type de fichier non accepté | « Format non pris en charge : JPG, PNG, WEBP, DOC, DOCX ou PDF uniquement »; « Format non pris en charge : les documents Word contenant des macros sont refusés » | oui (7) |
| `422` | Données invalides | « Fichier illisible : il a été conservé, mais il ne peut pas être analysé »; données ou paramètres invalides | oui (7) |
| `429` | Trop de requêtes | « Trop de fichiers en attente : envoyez-les ou retirez-en »; limite de débit atteinte | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-AST-012 — Téléchargement d'une pièce jointe

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Pièces jointes |
| Méthode | `GET` |
| Chemin | `/api/v1/assistant/attachments/{attachment_id}/download` |
| Fonction | `download_attachment` — [app/modules/assistant/router.py:304](../../app/modules/assistant/router.py#L304) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 13 test(s) (test_module_3_attachments) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). Telechargement authentifie du fichier d'origine

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `assistant.attachments.get_owned`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `attachment_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Telechargement force, sans interpretation du contenu par le navigateur
- Fonction `assistant.attachments.get_owned` ([app/modules/assistant/attachments.py:304](../../app/modules/assistant/attachments.py#L304))
  - Fichier d'un autre utilisateur : acces refuse (AC5) ; fichier supprime : introuvable
  - Securite par ligne : le fichier d'autrui est invisible (404), mais la tentative reste journalisee

**Réponse en cas de succès.**

- Réponse directe hors enveloppe possible (Response) : fichier, flux, redirection ou réponse sans contenu selon le cas (voir le code).
- Code HTTP **200**.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (11) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous n'avez pas accès à ce fichier » | non |
| `404` | Introuvable ou inaccessible | « Fichier introuvable » | oui (3) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-AST-013 — Suppression d'une pièce jointe

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Pièces jointes |
| Méthode | `DELETE` |
| Chemin | `/api/v1/assistant/attachments/{attachment_id}` |
| Fonction | `delete_attachment` — [app/modules/assistant/router.py:315](../../app/modules/assistant/router.py#L315) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_module_3_attachments) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). Suppression d'un fichier : il n'est plus utilise par l'assistant

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `assistant.attachments.get_owned`, `assistant.service._require_open`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `attachment_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `assistant.service.delete_attachment` ([app/modules/assistant/service.py:334](../../app/modules/assistant/service.py#L334))
  - Un fichier deja envoye fait partie de sa conversation : une conversation archivee n'est plus modifiable

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Fichier supprimé ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous n'avez pas accès à ce fichier » | non |
| `404` | Introuvable ou inaccessible | « Conversation introuvable »; « Fichier introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Cette conversation est archivée : elle ne peut plus être modifiée » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Historique et consommation

### API-AST-014 — Historique des exécutions de l'assistant

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Historique et consommation |
| Méthode | `GET` |
| Chemin | `/api/v1/assistant/history` |
| Fonction | `history` — [app/modules/assistant/router.py:322](../../app/modules/assistant/router.py#L322) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_3_assistant) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). Historique des traitements et des actions de l'assistant

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `page` | requête | integer | non | min. 1 ; défaut `1` | — |
| `page_size` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |
| `cursor` | requête | string (ou null) | non | longueur max. 500 | — |
| `limit` | requête | integer (ou null) | non | min. 1 ; max. 100 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requetes : outils appeles et actions de ces traitements
- Fonction `assisted_actions.service.expire_stale` ([app/modules/assisted_actions/service.py:213](../../app/modules/assisted_actions/service.py#L213)) : Passe a « expirée » les actions en attente dont le delai d'approbation est depasse
  - Requete : actions en attente et perimees (de cet utilisateur, ou de tous pour la maintenance)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet Page_HistoryOut_ (ou null).
- Liste paginée : `items`, `total`, `page`, `page_size`, `next_cursor` (voir CONVENTIONS.md).

| Champ de `result` (élément de `items`) | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `conversation_id` | string (uuid) (ou null) | oui | — | — |
| `intent` | string (ou null) | oui | — | — |
| `status` | string (énumération RunStatus) | oui | valeurs : `queued`, `running`, `retrying`, `awaiting_clarification`, `completed`, `failed`, `expired`, `cancelled` | — |
| `error_code` | string (ou null) | oui | — | — |
| `result` | string (ou null) | oui | — | — |
| `tools` | liste de objet ToolCallOut | oui | — | — |
| `tools[].tool_name` | string | oui | — | — |
| `tools[].status` | string (énumération ToolCallStatus) | oui | valeurs : `executed`, `proposed`, `refused`, `failed` | — |
| `tools[].error_code` | string (ou null) | oui | — | — |
| `actions` | liste de objet HistoryActionOut | oui | — | — |
| `actions[].id` | string (uuid) | oui | — | — |
| `actions[].action_type` | string (énumération ActionType) | oui | valeurs : `draft_reply`, `appointment_request`, `calendar_event`, `form_preparation`, `payment_instruction`, `cancellation_inquiry`, `renewal_inquiry`, `booking_request`, `task_create`, `task_update`, `task_complete`, `email_draft`, `event_update`, `event_cancel` | — |
| `actions[].status` | string (énumération ActionStatus) | oui | valeurs : `pending_approval`, `expired`, `approved`, `rejected`, `executing`, `succeeded`, `failed`, `cancelled` | — |
| `actions[].preview` | string (ou null) | oui | — | — |
| `actions[].executed_at` | string (date-time) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-AST-015 — Consommation de l'assistant

| Élément | Valeur |
|---|---|
| Module | Assistant intelligent central (`app/modules/assistant`, spéc. M3) |
| Sous-module | Historique et consommation |
| Méthode | `GET` |
| Chemin | `/api/v1/assistant/usage` |
| Fonction | `usage` — [app/modules/assistant/router.py:354](../../app/modules/assistant/router.py#L354) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_module_3_assistant, test_module_3_attachments, test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/assistant/api.js`) |

**Description** (commentaire et docstring du code). Consommation mensuelle de l'assistant

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `assistant.service.usage` ([app/modules/assistant/service.py:162](../../app/modules/assistant/service.py#L162))
  - Consommation affichee a l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet app__modules__assistant__router__UsageOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `period` | string | oui | — | — |
| `used` | integer | oui | — | — |
| `limit` | integer | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (4) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
