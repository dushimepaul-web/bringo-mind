<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Rappels et notifications

Dossier du code : [app/modules/reminders/](../../app/modules/reminders/) · lettre ou numéro de la spécification : **E** · priorité **1** · documentation générée le 19/11/2026 17:30.

**25 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 23 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 2 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Notifications dans l'application**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-NOT-001](#api-not-001--enregistrement-dune-application-mobile-android-ios-pour-les-notifications) | POST | `/api/v1/notifications/push-devices` | Enregistrement d'une application mobile (Android, iOS) pour les notifications | Terminée, en attente de configuration | oui |
| [API-NOT-002](#api-not-002--désinscription-dune-application-mobile) | DELETE | `/api/v1/notifications/push-devices` | Désinscription d'une application mobile | Terminée et opérationnelle | oui |
| [API-NOT-005](#api-not-005--liste-des-notifications) | GET | `/api/v1/notifications` | Liste des notifications | Terminée et opérationnelle | oui |
| [API-NOT-006](#api-not-006--nombre-de-notifications-non-lues) | GET | `/api/v1/notifications/unread-count` | Nombre de notifications non lues | Terminée et opérationnelle | oui |
| [API-NOT-007](#api-not-007--marquer-une-notification-comme-lue) | POST | `/api/v1/notifications/{notification_id}/read` | Marquer une notification comme lue | Terminée et opérationnelle | oui |
| [API-NOT-008](#api-not-008--marquer-toutes-les-notifications-comme-lues) | POST | `/api/v1/notifications/read-all` | Marquer toutes les notifications comme lues | Terminée et opérationnelle | oui |
| [API-NOT-009](#api-not-009--suppression-dune-notification) | DELETE | `/api/v1/notifications/{notification_id}` | Suppression d'une notification | Terminée et opérationnelle | oui |

**Préférences de notification**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-NOT-003](#api-not-003--préférences-de-notification) | GET | `/api/v1/notifications/preferences` | Préférences de notification | Terminée et opérationnelle | oui |
| [API-NOT-004](#api-not-004--modification-des-préférences-de-notification) | PUT | `/api/v1/notifications/preferences` | Modification des préférences de notification | Terminée et opérationnelle | oui |

**Rappels**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-NOT-010](#api-not-010--rappels-dune-tâche) | GET | `/api/v1/tasks/{task_id}/reminders` | Rappels d'une tâche | Terminée et opérationnelle | oui |
| [API-NOT-011](#api-not-011--création-dun-rappel-sur-une-tâche) | POST | `/api/v1/tasks/{task_id}/reminders` | Création d'un rappel sur une tâche | Terminée et opérationnelle | oui |
| [API-NOT-012](#api-not-012--rappels-dun-événement) | GET | `/api/v1/events/{event_id}/reminders` | Rappels d'un événement | Terminée et opérationnelle | oui |
| [API-NOT-013](#api-not-013--création-dun-rappel-sur-un-événement) | POST | `/api/v1/events/{event_id}/reminders` | Création d'un rappel sur un événement | Terminée et opérationnelle | oui |
| [API-NOT-014](#api-not-014--liste-de-tous-ses-rappels) | GET | `/api/v1/reminders` | Liste de tous ses rappels | Terminée et opérationnelle | oui |
| [API-NOT-015](#api-not-015--création-dun-rappel-tâche-ou-événement) | POST | `/api/v1/reminders` | Création d'un rappel (tâche ou événement) | Terminée et opérationnelle | oui |
| [API-NOT-016](#api-not-016--modification-dun-rappel) | PATCH | `/api/v1/reminders/{reminder_id}` | Modification d'un rappel | Terminée et opérationnelle | oui |
| [API-NOT-017](#api-not-017--report-dun-rappel) | POST | `/api/v1/reminders/{reminder_id}/snooze` | Report d'un rappel | Terminée et opérationnelle | oui |
| [API-NOT-018](#api-not-018--réactivation-dun-rappel) | POST | `/api/v1/reminders/{reminder_id}/reactivate` | Réactivation d'un rappel | Terminée et opérationnelle | oui |
| [API-NOT-019](#api-not-019--suppression-dun-rappel) | DELETE | `/api/v1/reminders/{reminder_id}` | Suppression d'un rappel | Terminée et opérationnelle | oui |

**Historique des envois**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-NOT-020](#api-not-020--historique-de-ses-envois) | GET | `/api/v1/notifications/deliveries` | Historique de ses envois | Terminée et opérationnelle | oui |

**Notifications du navigateur (Web Push)**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-NOT-021](#api-not-021--clé-publique-web-push-vapid) | GET | `/api/v1/notifications/web-push/public-key` | Clé publique Web Push (VAPID) | Terminée et opérationnelle | oui |
| [API-NOT-022](#api-not-022--abonnement-du-navigateur-aux-notifications) | POST | `/api/v1/notifications/web-push/subscriptions` | Abonnement du navigateur aux notifications | Terminée, en attente de configuration | oui |
| [API-NOT-023](#api-not-023--désabonnement-du-navigateur) | DELETE | `/api/v1/notifications/web-push/subscriptions` | Désabonnement du navigateur | Terminée et opérationnelle | oui |
| [API-NOT-024](#api-not-024--liste-des-appareils-abonnés-navigateurs-et-applications-mobiles) | GET | `/api/v1/notifications/web-push/devices` | Liste des appareils abonnés (navigateurs et applications mobiles) | Terminée et opérationnelle | oui |
| [API-NOT-025](#api-not-025--révocation-dun-appareil-abonné-navigateur-ou-mobile) | DELETE | `/api/v1/notifications/web-push/devices/{device_id}` | Révocation d'un appareil abonné (navigateur ou mobile) | Terminée et opérationnelle | oui |

## Sous-module : Notifications dans l'application

### API-NOT-001 — Enregistrement d'une application mobile (Android, iOS) pour les notifications

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Notifications dans l'application |
| Méthode | `POST` |
| Chemin | `/api/v1/notifications/push-devices` |
| Fonction | `register_mobile_device` — [app/modules/reminders/router.py:330](../../app/modules/reminders/router.py#L330) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 17 test(s) (test_push_mobile) |
| Utilisée par l'interface web | non |

**Description** (commentaire et docstring du code). E-41 : enregistrement d'une application mobile (Android ou iOS) pour les notifications push (jeton FCM)

**État détaillé.**

- Dépendance non configurée (É-41) : Firebase Cloud Messaging (FCM_PROJECT_ID et FCM_SERVICE_ACCOUNT_FILE vides, fournisseur « fcm » désactivé) : appareil enregistré, aucun envoi réel ; essai : python -m tools.essai_fournisseurs essai "push mobile".
- Remarque : Route destinée à l'application mobile (hors de ce dépôt) ; l'interface web n'en a pas l'usage.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `MobilePushIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `platform` | string | oui | valeurs : `android`, `ios` | — |
| `token` | string | oui | longueur min. 20 ; longueur max. 4096 ; motif `^[A-Za-z0-9_:\-.]+$` | — |
| `device_name` | string (ou null) | non | longueur max. 120 | — |
| `os_version` | string (ou null) | non | longueur max. 60 | — |
| `app_version` | string (ou null) | non | longueur max. 40 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `MobilePushIn._blank_to_none` (champ(s) device_name, os_version, app_version) ([app/modules/reminders/schemas.py:110](../../app/modules/reminders/schemas.py#L110)) : Texte vide ou blanc : non renseigne

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Le canal push est ajoute aux preferences (comme pour un navigateur)
- Meme jeton deja actif (redemarrage de l'application) : mis a jour, sans doublon
- Fonction `reminders.service.register_mobile_push` ([app/modules/reminders/service.py:644](../../app/modules/reminders/service.py#L644)) : E-41 : appareil mobile (jeton FCM) ; le meme jeton n'est enregistre qu'une fois, un jeton d'un autre compte est repris
  - Jeton deja connu pour un autre compte (meme telephone, autre connexion) : invisible sous la securite par ligne ; un jeton FCM appartient a l'application installee, qui ne sert qu'un compte a la fois : conflit
  - Point de sauvegarde : un jeton deja enregistre par un autre compte est invisible sous la securite par ligne, seule la contrainte d'unicite (uq_push_devices_endpoint) le revele
- Fonction `reminders.service.preferences` ([app/modules/reminders/service.py:72](../../app/modules/reminders/service.py#L72)) : Preferences de notification (user_profiles.preferences["notifications"], lisibles par le worker)
- Fonction `reminders.service.save_preferences` ([app/modules/reminders/service.py:78](../../app/modules/reminders/service.py#L78)) : Enregistre les preferences et reporte les canaux par type dans notification_preferences (lu par le mobile)
- Fonction `reminders.router._device_out` ([app/modules/reminders/router.py:302](../../app/modules/reminders/router.py#L302))
  - Navigateur ou application mobile, avec le nom et les versions de user_devices pour un mobile

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Appareil déjà enregistré », « Notifications de l'application activées ».
- `result` : objet PushDeviceOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `user_agent` | string (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `platform` | string | non | défaut `"web"` | — |
| `device_name` | string (ou null) | non | — | — |
| `os_version` | string (ou null) | non | — | — |
| `app_version` | string (ou null) | non | — | — |
| `last_seen_at` | string (date-time) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `201` | Créé | succès | oui (13) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `409` | Conflit avec l'état actuel | « Cet appareil est déjà enregistré pour un autre compte : déconnectez-le d'abord » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | oui (4) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-002 — Désinscription d'une application mobile

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Notifications dans l'application |
| Méthode | `DELETE` |
| Chemin | `/api/v1/notifications/push-devices` |
| Fonction | `unregister_mobile_device` — [app/modules/reminders/router.py:351](../../app/modules/reminders/router.py#L351) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_push_mobile) |
| Utilisée par l'interface web | oui (`src/modules/reminders/pages/NotificationsPage.jsx`) |

**Description** (commentaire et docstring du code). E-41 : desinscription de l'application mobile (deconnexion de l'application) : plus aucun envoi vers ce jeton

**État détaillé.**

- Remarque : Route destinée à l'application mobile (déconnexion de l'application).

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `MobilePushOutIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `token` | string | oui | longueur min. 20 ; longueur max. 4096 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `reminders.service.revoke_push_device` ([app/modules/reminders/service.py:690](../../app/modules/reminders/service.py#L690)) : Appareil revoque : plus aucun envoi ; l'historique reste (revoked_at)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Notifications de l'application désactivées pour cet appareil ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `404` | Introuvable ou inaccessible | « Appareil introuvable » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-005 — Liste des notifications

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Notifications dans l'application |
| Méthode | `GET` |
| Chemin | `/api/v1/notifications` |
| Fonction | `list_notifications` — [app/modules/reminders/router.py:65](../../app/modules/reminders/router.py#L65) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 18 test(s) (test_accounts, test_cas_limites, test_conservation_bd3_dec14, test_lot6_assistant_voix_api, test_module_4_tasks, test_module_5_documents, …) |
| Utilisée par l'interface web | oui (`src/modules/reminders/pages/NotificationsPage.jsx`) |

**Description** (commentaire et docstring du code). Notifications de l'utilisateur (toutes ou non lues), les plus recentes d'abord

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `reminders.router._visible`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `unread` | requête | boolean | non | défaut `false` | — |
| `page` | requête | integer | non | min. 1 ; défaut `1` | — |
| `page_size` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |
| `cursor` | requête | string (ou null) | non | longueur max. 500 | — |
| `limit` | requête | integer (ou null) | non | min. 1 ; max. 100 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : notifications de l'utilisateur, filtrees si demande
- Fonction `reminders.router._visible` ([app/modules/reminders/router.py:29](../../app/modules/reminders/router.py#L29))
  - Notifications de l'utilisateur, ni supprimees ni expirees (90 jours)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet Page_NotificationOut_ (ou null).
- Liste paginée : `items`, `total`, `page`, `page_size`, `next_cursor` (voir CONVENTIONS.md).

| Champ de `result` (élément de `items`) | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `body` | string (ou null) | oui | — | — |
| `link` | string (ou null) | oui | — | — |
| `read_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `category` | string | non | défaut `"general"` | — |
| `priority` | integer | non | défaut `2` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (20) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-006 — Nombre de notifications non lues

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Notifications dans l'application |
| Méthode | `GET` |
| Chemin | `/api/v1/notifications/unread-count` |
| Fonction | `unread_count` — [app/modules/reminders/router.py:75](../../app/modules/reminders/router.py#L75) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 8 test(s) (test_module_9_notifications) |
| Utilisée par l'interface web | oui (`src/modules/reminders/pages/NotificationsPage.jsx`, `src/shared/layout/Header.jsx`) |

**Description** (commentaire et docstring du code). Nombre de notifications non lues (badge de l'en-tete)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `reminders.router._visible`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : comptage des notifications non lues
- Fonction `reminders.router._visible` ([app/modules/reminders/router.py:29](../../app/modules/reminders/router.py#L29))
  - Notifications de l'utilisateur, ni supprimees ni expirees (90 jours)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : integer (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (9) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-007 — Marquer une notification comme lue

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Notifications dans l'application |
| Méthode | `POST` |
| Chemin | `/api/v1/notifications/{notification_id}/read` |
| Fonction | `mark_read` — [app/modules/reminders/router.py:82](../../app/modules/reminders/router.py#L82) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_9_notifications) |
| Utilisée par l'interface web | oui (`src/modules/planning/pages/DashboardPage.jsx`, `src/modules/reminders/pages/NotificationsPage.jsx`) |

**Description** (commentaire et docstring du code). Marque une notification comme lue

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `reminders.router._own_notification`, `reminders.router._visible`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `notification_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : notification ; elle doit appartenir a l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet NotificationOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string | oui | — | — |
| `body` | string (ou null) | oui | — | — |
| `link` | string (ou null) | oui | — | — |
| `read_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `category` | string | non | défaut `"general"` | — |
| `priority` | integer | non | défaut `2` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Notification introuvable » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-008 — Marquer toutes les notifications comme lues

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Notifications dans l'application |
| Méthode | `POST` |
| Chemin | `/api/v1/notifications/read-all` |
| Fonction | `mark_all_read` — [app/modules/reminders/router.py:92](../../app/modules/reminders/router.py#L92) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_9_notifications) |
| Utilisée par l'interface web | oui (`src/modules/reminders/pages/NotificationsPage.jsx`) |

**Description** (commentaire et docstring du code). Marque toutes les notifications comme lues

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : mise a jour de toutes les notifications non lues en une fois

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Notifications marquées comme lues ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-009 — Suppression d'une notification

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Notifications dans l'application |
| Méthode | `DELETE` |
| Chemin | `/api/v1/notifications/{notification_id}` |
| Fonction | `delete_notification` — [app/modules/reminders/router.py:102](../../app/modules/reminders/router.py#L102) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_9_notifications) |
| Utilisée par l'interface web | oui (`src/modules/reminders/pages/NotificationsPage.jsx`) |

**Description** (commentaire et docstring du code). Suppression logique : la notification disparait de l'historique et du compteur

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `reminders.router._own_notification`, `reminders.router._visible`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `notification_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Notification supprimée ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Notification introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Préférences de notification

### API-NOT-003 — Préférences de notification

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Préférences de notification |
| Méthode | `GET` |
| Chemin | `/api/v1/notifications/preferences` |
| Fonction | `get_preferences` — [app/modules/reminders/router.py:43](../../app/modules/reminders/router.py#L43) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_integrations, test_module_9_notifications, test_push_mobile) |
| Utilisée par l'interface web | oui (`src/modules/reminders/pages/NotificationsPage.jsx`) |

**Description** (commentaire et docstring du code). Preferences de notification (creees avec les valeurs par defaut si besoin)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `reminders.service.preferences` ([app/modules/reminders/service.py:72](../../app/modules/reminders/service.py#L72)) : Preferences de notification (user_profiles.preferences["notifications"], lisibles par le worker)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet PreferencesOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `channels` | liste de string (énumération Channel) | oui | valeurs : `in_app`, `email`, `web_push` | — |
| `default_offsets` | liste de integer | oui | — | — |
| `same_day_reminder` | boolean | non | défaut `true` | — |
| `quiet_hours_start` | string (time) (ou null) | oui | — | — |
| `quiet_hours_end` | string (time) (ou null) | oui | — | — |
| `all_day_reminder_time` | string (time) | oui | — | — |
| `repeat_unresolved_hours` | integer (ou null) | oui | — | — |
| `daily_summary` | boolean | oui | — | — |
| `weekly_summary` | boolean | oui | — | — |
| `escalate_critical` | boolean | oui | — | — |
| `category_overrides` | objet (clés libres) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (4) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-004 — Modification des préférences de notification

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Préférences de notification |
| Méthode | `PUT` |
| Chemin | `/api/v1/notifications/preferences` |
| Fonction | `update_preferences` — [app/modules/reminders/router.py:49](../../app/modules/reminders/router.py#L49) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 19 test(s) (test_module_4_tasks, test_module_9_notifications) |
| Utilisée par l'interface web | oui (`src/modules/reminders/pages/NotificationsPage.jsx`) |

**Description** (commentaire et docstring du code). Modification des preferences

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `PreferencesIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `channels` | liste de string (énumération Channel) (ou null) | non | valeurs : `in_app`, `email`, `web_push` | — |
| `default_offsets` | liste de integer (ou null) | non | éléments max. 5 | — |
| `same_day_reminder` | boolean (ou null) | non | — | — |
| `quiet_hours_start` | string (time) (ou null) | non | — | — |
| `quiet_hours_end` | string (time) (ou null) | non | — | — |
| `all_day_reminder_time` | string (time) (ou null) | non | — | — |
| `repeat_unresolved_hours` | integer (ou null) | non | min. 1.0 ; max. 168.0 | — |
| `daily_summary` | boolean (ou null) | non | — | — |
| `weekly_summary` | boolean (ou null) | non | — | — |
| `escalate_critical` | boolean (ou null) | non | — | — |
| `category_overrides` | objet (clés libres) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `PreferencesIn.check_offsets` (champ(s) default_offsets) ([app/modules/reminders/schemas.py:46](../../app/modules/reminders/schemas.py#L46)) : Delais : positifs, 60 jours au plus, sans doublon, du plus lointain au plus proche — refus (422) : « délai de rappel invalide (minutes avant l'échéance, au plus 60 jours) »
- Validateur `PreferencesIn.check_overrides` (champ(s) category_overrides) ([app/modules/reminders/schemas.py:54](../../app/modules/reminders/schemas.py#L54)) : Canaux par categorie : categories et canaux connus uniquement — refus (422) : « canaux par catégorie invalides »

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Seuls les champs envoyes ; canaux enregistres sous forme de texte
- Enregistrement dans user_profiles.preferences et notification_preferences
- Fonction `reminders.service.preferences` ([app/modules/reminders/service.py:72](../../app/modules/reminders/service.py#L72)) : Preferences de notification (user_profiles.preferences["notifications"], lisibles par le worker)
- Fonction `reminders.service.save_preferences` ([app/modules/reminders/service.py:78](../../app/modules/reminders/service.py#L78)) : Enregistre les preferences et reporte les canaux par type dans notification_preferences (lu par le mobile)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Préférences enregistrées ».
- `result` : objet PreferencesOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `channels` | liste de string (énumération Channel) | oui | valeurs : `in_app`, `email`, `web_push` | — |
| `default_offsets` | liste de integer | oui | — | — |
| `same_day_reminder` | boolean | non | défaut `true` | — |
| `quiet_hours_start` | string (time) (ou null) | oui | — | — |
| `quiet_hours_end` | string (time) (ou null) | oui | — | — |
| `all_day_reminder_time` | string (time) | oui | — | — |
| `repeat_unresolved_hours` | integer (ou null) | oui | — | — |
| `daily_summary` | boolean | oui | — | — |
| `weekly_summary` | boolean | oui | — | — |
| `escalate_critical` | boolean | oui | — | — |
| `category_overrides` | objet (clés libres) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (19) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Rappels

### API-NOT-010 — Rappels d'une tâche

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Rappels |
| Méthode | `GET` |
| Chemin | `/api/v1/tasks/{task_id}/reminders` |
| Fonction | `task_reminders` — [app/modules/reminders/router.py:110](../../app/modules/reminders/router.py#L110) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 18 test(s) (test_cas_limites, test_inbox_reminders_actions, test_module_4_tasks, test_parcours) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Rappels planifies d'une tache pour l'utilisateur, dans l'ordre chronologique

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

- Requete : rappels de la tache destines a l'utilisateur
- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet ReminderOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) (ou null) | non | — | — |
| `event_id` | string (uuid) (ou null) | non | — | — |
| `source` | string | non | défaut `"auto"` | — |
| `repeat_every_hours` | integer (ou null) | non | — | — |
| `repeats_left` | integer | non | défaut `0` | — |
| `channel` | string (énumération Channel) | oui | valeurs : `in_app`, `email`, `web_push` | — |
| `channels` | liste de string (énumération Channel) | non | valeurs : `in_app`, `email`, `web_push` ; défaut `[]` | — |
| `offset_minutes` | integer | oui | — | — |
| `scheduled_for` | string (date-time) | oui | — | — |
| `status` | string | oui | — | — |
| `sent_at` | string (date-time) (ou null) | oui | — | — |
| `attempts` | integer | non | défaut `0` | — |
| `last_error` | string (ou null) | non | — | — |
| `deferred` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (22) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-011 — Création d'un rappel sur une tâche

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Rappels |
| Méthode | `POST` |
| Chemin | `/api/v1/tasks/{task_id}/reminders` |
| Fonction | `create_task_reminder` — [app/modules/reminders/router.py:120](../../app/modules/reminders/router.py#L120) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 26 test(s) (test_lot4_taches_et_rappels, test_module_4_tasks) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Programmation d'un rappel sur une tache (un rappel par canal)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `reminders.service._check_future`, `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `task_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `ReminderIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `remind_at` | string (date-time) | oui | — | — |
| `channels` | liste de string (énumération Channel) (ou null) | non | éléments min. 1 ; éléments max. 3 ; valeurs : `in_app`, `email`, `web_push` | — |
| `repeat_every_hours` | constante « 24 » (ou null) | non | — | — |
| `repeat_count` | integer | non | min. 0.0 ; max. 3.0 ; défaut `0` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `ReminderIn._tz` (champ(s) remind_at) ([app/modules/reminders/schemas.py:123](../../app/modules/reminders/schemas.py#L123)) : Un instant sans fuseau serait ambigu — refus (422) : « le fuseau horaire est requis »
- Contrôle dans le code (422) : channels : ["Ce canal n'est pas disponible"]
- Contrôle dans le code (422) : remind_at : ['Un rappel ne peut pas être programmé dans le passé']
- Contrôle dans le code (422) : repeat_every_hours : ["L'intervalle de répétition est requis"]
- Contrôle dans le code (422) : task : ["Cette tâche n'accepte plus de rappel"]

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `reminders.service.create_reminder` ([app/modules/reminders/service.py:445](../../app/modules/reminders/service.py#L445)) : Programme un rappel (canaux regroupes) ; heures de silence appliquees, sauf priorite 4. commit=False : l'appelant valide lui-meme (A3 : evenement et rappels enregistres ensemble)
  - Doublon : meme cible, meme instant, memes canaux (AC2)
- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Rappel programmé ».
- `result` : liste de objet ReminderOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) (ou null) | non | — | — |
| `event_id` | string (uuid) (ou null) | non | — | — |
| `source` | string | non | défaut `"auto"` | — |
| `repeat_every_hours` | integer (ou null) | non | — | — |
| `repeats_left` | integer | non | défaut `0` | — |
| `channel` | string (énumération Channel) | oui | valeurs : `in_app`, `email`, `web_push` | — |
| `channels` | liste de string (énumération Channel) | non | valeurs : `in_app`, `email`, `web_push` ; défaut `[]` | — |
| `offset_minutes` | integer | oui | — | — |
| `scheduled_for` | string (date-time) | oui | — | — |
| `status` | string | oui | — | — |
| `sent_at` | string (date-time) (ou null) | oui | — | — |
| `attempts` | integer | non | défaut `0` | — |
| `last_error` | string (ou null) | non | — | — |
| `deferred` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (25) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Tâche introuvable » | non |
| `409` | Conflit avec l'état actuel | « Un rappel identique est déjà programmé ou envoyé » | oui (1) |
| `422` | Données invalides | « channels : ["Ce canal n'est pas disponible"] »; données ou paramètres invalides; « remind_at : ['Un rappel ne peut pas être programmé dans le passé'] »; « repeat_every_hours : ["L'intervalle de répétition est requis"] »; « task : ["Cette tâche n'accepte plus de rappel"] » | oui (7) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-012 — Rappels d'un événement

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Rappels |
| Méthode | `GET` |
| Chemin | `/api/v1/events/{event_id}/reminders` |
| Fonction | `event_reminders` — [app/modules/reminders/router.py:137](../../app/modules/reminders/router.py#L137) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_calendrier_local, test_phase2_calendrier) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Rappels d'un evenement de calendrier

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `reminders.router._own_event`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `event_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `reminders.router._own_event` ([app/modules/reminders/router.py:126](../../app/modules/reminders/router.py#L126))
  - Requete : evenement de l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet ReminderOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) (ou null) | non | — | — |
| `event_id` | string (uuid) (ou null) | non | — | — |
| `source` | string | non | défaut `"auto"` | — |
| `repeat_every_hours` | integer (ou null) | non | — | — |
| `repeats_left` | integer | non | défaut `0` | — |
| `channel` | string (énumération Channel) | oui | valeurs : `in_app`, `email`, `web_push` | — |
| `channels` | liste de string (énumération Channel) | non | valeurs : `in_app`, `email`, `web_push` ; défaut `[]` | — |
| `offset_minutes` | integer | oui | — | — |
| `scheduled_for` | string (date-time) | oui | — | — |
| `status` | string | oui | — | — |
| `sent_at` | string (date-time) (ou null) | oui | — | — |
| `attempts` | integer | non | défaut `0` | — |
| `last_error` | string (ou null) | non | — | — |
| `deferred` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Événement introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-013 — Création d'un rappel sur un événement

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Rappels |
| Méthode | `POST` |
| Chemin | `/api/v1/events/{event_id}/reminders` |
| Fonction | `create_event_reminder` — [app/modules/reminders/router.py:145](../../app/modules/reminders/router.py#L145) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_calendrier_local, test_module_4_tasks) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Programmation d'un rappel sur un evenement de calendrier

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `reminders.router._own_event`, `reminders.service._check_future`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `event_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `ReminderIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `remind_at` | string (date-time) | oui | — | — |
| `channels` | liste de string (énumération Channel) (ou null) | non | éléments min. 1 ; éléments max. 3 ; valeurs : `in_app`, `email`, `web_push` | — |
| `repeat_every_hours` | constante « 24 » (ou null) | non | — | — |
| `repeat_count` | integer | non | min. 0.0 ; max. 3.0 ; défaut `0` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `ReminderIn._tz` (champ(s) remind_at) ([app/modules/reminders/schemas.py:123](../../app/modules/reminders/schemas.py#L123)) : Un instant sans fuseau serait ambigu — refus (422) : « le fuseau horaire est requis »
- Contrôle dans le code (422) : channels : ["Ce canal n'est pas disponible"]
- Contrôle dans le code (422) : remind_at : ['Un rappel ne peut pas être programmé dans le passé']
- Contrôle dans le code (422) : repeat_every_hours : ["L'intervalle de répétition est requis"]
- Contrôle dans le code (422) : task : ["Cette tâche n'accepte plus de rappel"]

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `reminders.service.create_reminder` ([app/modules/reminders/service.py:445](../../app/modules/reminders/service.py#L445)) : Programme un rappel (canaux regroupes) ; heures de silence appliquees, sauf priorite 4. commit=False : l'appelant valide lui-meme (A3 : evenement et rappels enregistres ensemble)
  - Doublon : meme cible, meme instant, memes canaux (AC2)
- Fonction `reminders.router._own_event` ([app/modules/reminders/router.py:126](../../app/modules/reminders/router.py#L126))
  - Requete : evenement de l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Rappel programmé ».
- `result` : liste de objet ReminderOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) (ou null) | non | — | — |
| `event_id` | string (uuid) (ou null) | non | — | — |
| `source` | string | non | défaut `"auto"` | — |
| `repeat_every_hours` | integer (ou null) | non | — | — |
| `repeats_left` | integer | non | défaut `0` | — |
| `channel` | string (énumération Channel) | oui | valeurs : `in_app`, `email`, `web_push` | — |
| `channels` | liste de string (énumération Channel) | non | valeurs : `in_app`, `email`, `web_push` ; défaut `[]` | — |
| `offset_minutes` | integer | oui | — | — |
| `scheduled_for` | string (date-time) | oui | — | — |
| `status` | string | oui | — | — |
| `sent_at` | string (date-time) (ou null) | oui | — | — |
| `attempts` | integer | non | défaut `0` | — |
| `last_error` | string (ou null) | non | — | — |
| `deferred` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Événement introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Un rappel identique est déjà programmé ou envoyé » | non |
| `422` | Données invalides | « channels : ["Ce canal n'est pas disponible"] »; données ou paramètres invalides; « remind_at : ['Un rappel ne peut pas être programmé dans le passé'] »; « repeat_every_hours : ["L'intervalle de répétition est requis"] »; « task : ["Cette tâche n'accepte plus de rappel"] » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-014 — Liste de tous ses rappels

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Rappels |
| Méthode | `GET` |
| Chemin | `/api/v1/reminders` |
| Fonction | `list_reminders` — [app/modules/reminders/router.py:165](../../app/modules/reminders/router.py#L165) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 5 test(s) (test_lot4_taches_et_rappels) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Rappels de l'utilisateur : a venir (ordre chronologique), passes ou tous (les plus recents d'abord)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `scope` | requête | string | non | valeurs : `upcoming`, `past`, `all` ; défaut `"upcoming"` | — |
| `page` | requête | integer | non | min. 1 ; défaut `1` | — |
| `page_size` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |
| `cursor` | requête | string (ou null) | non | longueur max. 500 | — |
| `limit` | requête | integer (ou null) | non | min. 1 ; max. 100 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Rappels destines a l'utilisateur, hors taches et evenements supprimes
- Titres des taches et evenements de la page (une requete par type)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet Page_ReminderListOut_ (ou null).
- Liste paginée : `items`, `total`, `page`, `page_size`, `next_cursor` (voir CONVENTIONS.md).

| Champ de `result` (élément de `items`) | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) (ou null) | non | — | — |
| `event_id` | string (uuid) (ou null) | non | — | — |
| `source` | string | non | défaut `"auto"` | — |
| `repeat_every_hours` | integer (ou null) | non | — | — |
| `repeats_left` | integer | non | défaut `0` | — |
| `channel` | string (énumération Channel) | oui | valeurs : `in_app`, `email`, `web_push` | — |
| `channels` | liste de string (énumération Channel) | non | valeurs : `in_app`, `email`, `web_push` ; défaut `[]` | — |
| `offset_minutes` | integer | oui | — | — |
| `scheduled_for` | string (date-time) | oui | — | — |
| `status` | string | oui | — | — |
| `sent_at` | string (date-time) (ou null) | oui | — | — |
| `attempts` | integer | non | défaut `0` | — |
| `last_error` | string (ou null) | non | — | — |
| `deferred` | boolean | non | défaut `false` | — |
| `target_type` | string | oui | valeurs : `task`, `event` | — |
| `target_title` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (7) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-015 — Création d'un rappel (tâche ou événement)

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Rappels |
| Méthode | `POST` |
| Chemin | `/api/v1/reminders` |
| Fonction | `create_reminder` — [app/modules/reminders/router.py:195](../../app/modules/reminders/router.py#L195) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_lot4_taches_et_rappels) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Programmation d'un rappel sur une tache ou un evenement (memes regles que les routes de la tache ou de l'evenement)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `reminders.router._own_event`, `reminders.service._check_future`, `tasks.service.get_visible`, `tasks.service.visible_filter`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `ReminderTargetIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `remind_at` | string (date-time) | oui | — | — |
| `channels` | liste de string (énumération Channel) (ou null) | non | éléments min. 1 ; éléments max. 3 ; valeurs : `in_app`, `email`, `web_push` | — |
| `repeat_every_hours` | constante « 24 » (ou null) | non | — | — |
| `repeat_count` | integer | non | min. 0.0 ; max. 3.0 ; défaut `0` | — |
| `task_id` | string (uuid) (ou null) | non | — | — |
| `event_id` | string (uuid) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `ReminderTargetIn._tz` (champ(s) remind_at) ([app/modules/reminders/schemas.py:123](../../app/modules/reminders/schemas.py#L123)) : Un instant sans fuseau serait ambigu — refus (422) : « le fuseau horaire est requis »
- Contrôle dans le code (422) : channels : ["Ce canal n'est pas disponible"]
- Contrôle dans le code (422) : remind_at : ['Un rappel ne peut pas être programmé dans le passé']
- Contrôle dans le code (422) : repeat_every_hours : ["L'intervalle de répétition est requis"]
- Contrôle dans le code (422) : task : ["Cette tâche n'accepte plus de rappel"]
- Contrôle dans le code (422) : task_id : ['Indiquez une tâche ou un événement (un seul)']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `reminders.service.create_reminder` ([app/modules/reminders/service.py:445](../../app/modules/reminders/service.py#L445)) : Programme un rappel (canaux regroupes) ; heures de silence appliquees, sauf priorite 4. commit=False : l'appelant valide lui-meme (A3 : evenement et rappels enregistres ensemble)
  - Doublon : meme cible, meme instant, memes canaux (AC2)
- Fonction `tasks.service.get_visible` ([app/modules/tasks/service.py:78](../../app/modules/tasks/service.py#L78))
  - Requete : tache non supprimee et visible par l'utilisateur
- Fonction `reminders.router._own_event` ([app/modules/reminders/router.py:126](../../app/modules/reminders/router.py#L126))
  - Requete : evenement de l'utilisateur

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Rappel programmé ».
- `result` : liste de objet ReminderOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) (ou null) | non | — | — |
| `event_id` | string (uuid) (ou null) | non | — | — |
| `source` | string | non | défaut `"auto"` | — |
| `repeat_every_hours` | integer (ou null) | non | — | — |
| `repeats_left` | integer | non | défaut `0` | — |
| `channel` | string (énumération Channel) | oui | valeurs : `in_app`, `email`, `web_push` | — |
| `channels` | liste de string (énumération Channel) | non | valeurs : `in_app`, `email`, `web_push` ; défaut `[]` | — |
| `offset_minutes` | integer | oui | — | — |
| `scheduled_for` | string (date-time) | oui | — | — |
| `status` | string | oui | — | — |
| `sent_at` | string (date-time) (ou null) | oui | — | — |
| `attempts` | integer | non | défaut `0` | — |
| `last_error` | string (ou null) | non | — | — |
| `deferred` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Tâche introuvable »; « Événement introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Un rappel identique est déjà programmé ou envoyé » | non |
| `422` | Données invalides | « channels : ["Ce canal n'est pas disponible"] »; données ou paramètres invalides; « remind_at : ['Un rappel ne peut pas être programmé dans le passé'] »; « repeat_every_hours : ["L'intervalle de répétition est requis"] »; « task : ["Cette tâche n'accepte plus de rappel"] »; « task_id : ['Indiquez une tâche ou un événement (un seul)'] » | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-016 — Modification d'un rappel

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Rappels |
| Méthode | `PATCH` |
| Chemin | `/api/v1/reminders/{reminder_id}` |
| Fonction | `update_reminder` — [app/modules/reminders/router.py:209](../../app/modules/reminders/router.py#L209) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_4_tasks) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Nouvel instant d'un rappel

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `reminders.service._check_future`, `reminders.service._require_not_sent`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `reminder_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `ReminderUpdate`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `remind_at` | string (date-time) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `ReminderUpdate._tz` (champ(s) remind_at) ([app/modules/reminders/schemas.py:123](../../app/modules/reminders/schemas.py#L123)) : Un instant sans fuseau serait ambigu — refus (422) : « le fuseau horaire est requis »
- Contrôle dans le code (422) : remind_at : ['Un rappel ne peut pas être programmé dans le passé']
- Contrôle dans le code (422) : status : ['Réactivez ce rappel avant de le modifier']

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Rappel modifié ».
- `result` : objet ReminderOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) (ou null) | non | — | — |
| `event_id` | string (uuid) (ou null) | non | — | — |
| `source` | string | non | défaut `"auto"` | — |
| `repeat_every_hours` | integer (ou null) | non | — | — |
| `repeats_left` | integer | non | défaut `0` | — |
| `channel` | string (énumération Channel) | oui | valeurs : `in_app`, `email`, `web_push` | — |
| `channels` | liste de string (énumération Channel) | non | valeurs : `in_app`, `email`, `web_push` ; défaut `[]` | — |
| `offset_minutes` | integer | oui | — | — |
| `scheduled_for` | string (date-time) | oui | — | — |
| `status` | string | oui | — | — |
| `sent_at` | string (date-time) (ou null) | oui | — | — |
| `attempts` | integer | non | défaut `0` | — |
| `last_error` | string (ou null) | non | — | — |
| `deferred` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Rappel introuvable » | non |
| `409` | Conflit avec l'état actuel | « Ce rappel a déjà été envoyé »; « Un rappel identique est déjà programmé ou envoyé » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « remind_at : ['Un rappel ne peut pas être programmé dans le passé'] »; « status : ['Réactivez ce rappel avant de le modifier'] » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-017 — Report d'un rappel

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Rappels |
| Méthode | `POST` |
| Chemin | `/api/v1/reminders/{reminder_id}/snooze` |
| Fonction | `snooze_reminder` — [app/modules/reminders/router.py:216](../../app/modules/reminders/router.py#L216) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 8 test(s) (test_module_4_tasks) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Report de 10 minutes a 24 heures

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `reminders.service._require_not_sent`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `reminder_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `SnoozeIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `minutes` | integer | oui | min. 10.0 ; max. 1440.0 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : status : ['Réactivez ce rappel avant de le reporter']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `reminders.service.snooze` ([app/modules/reminders/service.py:511](../../app/modules/reminders/service.py#L511)) : Report de 10 minutes a 24 heures, a partir de l'instant prevu (ou de maintenant s'il est depasse)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Rappel reporté ».
- `result` : objet ReminderOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) (ou null) | non | — | — |
| `event_id` | string (uuid) (ou null) | non | — | — |
| `source` | string | non | défaut `"auto"` | — |
| `repeat_every_hours` | integer (ou null) | non | — | — |
| `repeats_left` | integer | non | défaut `0` | — |
| `channel` | string (énumération Channel) | oui | valeurs : `in_app`, `email`, `web_push` | — |
| `channels` | liste de string (énumération Channel) | non | valeurs : `in_app`, `email`, `web_push` ; défaut `[]` | — |
| `offset_minutes` | integer | oui | — | — |
| `scheduled_for` | string (date-time) | oui | — | — |
| `status` | string | oui | — | — |
| `sent_at` | string (date-time) (ou null) | oui | — | — |
| `attempts` | integer | non | défaut `0` | — |
| `last_error` | string (ou null) | non | — | — |
| `deferred` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (4) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Rappel introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Ce rappel a déjà été envoyé »; « Un rappel identique est déjà programmé ou envoyé » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « status : ['Réactivez ce rappel avant de le reporter'] » | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-018 — Réactivation d'un rappel

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Rappels |
| Méthode | `POST` |
| Chemin | `/api/v1/reminders/{reminder_id}/reactivate` |
| Fonction | `reactivate_reminder` — [app/modules/reminders/router.py:223](../../app/modules/reminders/router.py#L223) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_4_tasks) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Reactivation d'un rappel annule

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `reminders.service._check_future`, `reminders.service._require_not_sent`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `reminder_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : remind_at : ['Un rappel ne peut pas être programmé dans le passé']
- Contrôle dans le code (422) : status : ['Ce rappel est déjà actif']
- Contrôle dans le code (422) : task : ["Cette tâche n'accepte plus de rappel"]

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `reminders.service.reactivate` ([app/modules/reminders/service.py:519](../../app/modules/reminders/service.py#L519))
  - Le rappel devient manuel : un recalcul de l'echeance ne l'annulera plus

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Rappel réactivé ».
- `result` : objet ReminderOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `task_id` | string (uuid) (ou null) | non | — | — |
| `event_id` | string (uuid) (ou null) | non | — | — |
| `source` | string | non | défaut `"auto"` | — |
| `repeat_every_hours` | integer (ou null) | non | — | — |
| `repeats_left` | integer | non | défaut `0` | — |
| `channel` | string (énumération Channel) | oui | valeurs : `in_app`, `email`, `web_push` | — |
| `channels` | liste de string (énumération Channel) | non | valeurs : `in_app`, `email`, `web_push` ; défaut `[]` | — |
| `offset_minutes` | integer | oui | — | — |
| `scheduled_for` | string (date-time) | oui | — | — |
| `status` | string | oui | — | — |
| `sent_at` | string (date-time) (ou null) | oui | — | — |
| `attempts` | integer | non | défaut `0` | — |
| `last_error` | string (ou null) | non | — | — |
| `deferred` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Rappel introuvable » | non |
| `409` | Conflit avec l'état actuel | « Ce rappel a déjà été envoyé »; « Un rappel identique est déjà programmé ou envoyé » | non |
| `422` | Données invalides | données ou paramètres invalides; « remind_at : ['Un rappel ne peut pas être programmé dans le passé'] »; « status : ['Ce rappel est déjà actif'] »; « task : ["Cette tâche n'accepte plus de rappel"] » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-019 — Suppression d'un rappel

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Rappels |
| Méthode | `DELETE` |
| Chemin | `/api/v1/reminders/{reminder_id}` |
| Fonction | `delete_reminder` — [app/modules/reminders/router.py:230](../../app/modules/reminders/router.py#L230) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_lot4_taches_et_rappels, test_module_4_tasks) |
| Utilisée par l'interface web | oui (`src/modules/tasks/api.js`) |

**Description** (commentaire et docstring du code). Suppression d'un rappel : il ne sera pas envoye

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `reminders.service._require_not_sent`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `reminder_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `reminders.service.delete_reminder` ([app/modules/reminders/service.py:538](../../app/modules/reminders/service.py#L538))
  - Suppression definitive (occurrences en cascade) : le job d'envoi deja programme ne trouvera plus rien (AC3)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Rappel supprimé ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Rappel introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Ce rappel a déjà été envoyé » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Historique des envois

### API-NOT-020 — Historique de ses envois

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Historique des envois |
| Méthode | `GET` |
| Chemin | `/api/v1/notifications/deliveries` |
| Fonction | `deliveries` — [app/modules/reminders/router.py:256](../../app/modules/reminders/router.py#L256) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_fonctions_plan, test_module_9_notifications) |
| Utilisée par l'interface web | oui (`src/modules/reminders/pages/NotificationsPage.jsx`) |

**Description** (commentaire et docstring du code). Journal des tentatives de livraison des rappels de l'utilisateur, les plus recentes d'abord

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `reminder_id` | requête | string (uuid) (ou null) | non | — | — |
| `page` | requête | integer | non | min. 1 ; défaut `1` | — |
| `page_size` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |
| `cursor` | requête | string (ou null) | non | longueur max. 500 | — |
| `limit` | requête | integer (ou null) | non | min. 1 ; max. 100 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Essais des rappels (reminder_delivery_attempts) et des notifications (notification_deliveries) de l'utilisateur
- Fonction `reminders.service.delivery_log` ([app/modules/reminders/service.py:545](../../app/modules/reminders/service.py#L545)) : Journal des essais d'envoi de l'utilisateur (rappels et notifications), du plus recent au plus ancien

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet Page_DeliveryOut_ (ou null).
- Liste paginée : `items`, `total`, `page`, `page_size`, `next_cursor` (voir CONVENTIONS.md).

| Champ de `result` (élément de `items`) | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `reminder_id` | string (uuid) (ou null) | oui | — | — |
| `notification_id` | string (uuid) (ou null) | non | — | — |
| `category` | string (ou null) | non | — | — |
| `channel` | string (énumération Channel) | oui | valeurs : `in_app`, `email`, `web_push` | — |
| `provider` | string | oui | — | — |
| `attempt_number` | integer | oui | — | — |
| `status` | string | oui | — | — |
| `scheduled_for` | string (date-time) | oui | — | — |
| `attempted_at` | string (date-time) | oui | — | — |
| `accepted_at` | string (date-time) (ou null) | oui | — | — |
| `error_message` | string (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Notifications du navigateur (Web Push)

### API-NOT-021 — Clé publique Web Push (VAPID)

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Notifications du navigateur (Web Push) |
| Méthode | `GET` |
| Chemin | `/api/v1/notifications/web-push/public-key` |
| Fonction | `push_public_key` — [app/modules/reminders/router.py:272](../../app/modules/reminders/router.py#L272) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_integrations) |
| Utilisée par l'interface web | oui (`src/shared/helpers/webPush.js`) |

**Description** (commentaire et docstring du code). Clé publique VAPID à fournir au navigateur (None si Web Push n'est pas configuré)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : string (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-022 — Abonnement du navigateur aux notifications

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Notifications du navigateur (Web Push) |
| Méthode | `POST` |
| Chemin | `/api/v1/notifications/web-push/subscriptions` |
| Fonction | `push_subscribe` — [app/modules/reminders/router.py:279](../../app/modules/reminders/router.py#L279) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 8 test(s) (test_api_sans_test_auparavant, test_integrations, test_module_9_notifications) |
| Utilisée par l'interface web | oui (`src/shared/helpers/webPush.js`) |

**Description** (commentaire et docstring du code). Enregistrement de l'abonnement Web Push du navigateur

**État détaillé.**

- Dépendance non configurée (É-27) : Web Push (fournisseur « web_push » désactivé, aucun essai depuis un navigateur) : abonnement enregistré, aucun envoi réel.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `PushSubscriptionIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `endpoint` | string | oui | longueur min. 10 ; longueur max. 2000 ; motif `^https://` | — |
| `p256dh` | string | oui | longueur max. 255 | — |
| `auth` | string | oui | longueur max. 255 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Abonnement du navigateur (push_devices, adresse et cles chiffrees) ; deja connu : mis a jour
- Le canal Web Push est ajoute aux preferences
- Fonction `reminders.service.register_push` ([app/modules/reminders/service.py:627](../../app/modules/reminders/service.py#L627)) : Abonnement Web Push du navigateur (push_devices) ; le meme navigateur n'est enregistre qu'une fois
- Fonction `reminders.service.preferences` ([app/modules/reminders/service.py:72](../../app/modules/reminders/service.py#L72)) : Preferences de notification (user_profiles.preferences["notifications"], lisibles par le worker)
- Fonction `reminders.service.save_preferences` ([app/modules/reminders/service.py:78](../../app/modules/reminders/service.py#L78)) : Enregistre les preferences et reporte les canaux par type dans notification_preferences (lu par le mobile)

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Notifications du navigateur activées ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (8) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-023 — Désabonnement du navigateur

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Notifications du navigateur (Web Push) |
| Méthode | `DELETE` |
| Chemin | `/api/v1/notifications/web-push/subscriptions` |
| Fonction | `push_unsubscribe` — [app/modules/reminders/router.py:293](../../app/modules/reminders/router.py#L293) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_api_sans_test_auparavant) |
| Utilisée par l'interface web | oui (`src/shared/helpers/webPush.js`) |

**Description** (commentaire et docstring du code). Desabonnement Web Push de cet appareil

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `PushSubscriptionIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `endpoint` | string | oui | longueur min. 10 ; longueur max. 2000 ; motif `^https://` | — |
| `p256dh` | string | oui | longueur max. 255 | — |
| `auth` | string | oui | longueur max. 255 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Abonnement de cet appareil revoque (push_devices.revoked_at : l'historique reste)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Notifications du navigateur désactivées pour cet appareil ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-024 — Liste des appareils abonnés (navigateurs et applications mobiles)

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Notifications du navigateur (Web Push) |
| Méthode | `GET` |
| Chemin | `/api/v1/notifications/web-push/devices` |
| Fonction | `push_devices` — [app/modules/reminders/router.py:313](../../app/modules/reminders/router.py#L313) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 5 test(s) (test_api_sans_test_auparavant, test_module_9_notifications, test_push_mobile) |
| Utilisée par l'interface web | oui (`src/modules/reminders/pages/NotificationsPage.jsx`) |

**Description** (commentaire et docstring du code). Appareils abonnes (navigateurs et applications mobiles), pour les revoquer un par un

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `reminders.router._device_out` ([app/modules/reminders/router.py:302](../../app/modules/reminders/router.py#L302))
  - Navigateur ou application mobile, avec le nom et les versions de user_devices pour un mobile

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet PushDeviceOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `user_agent` | string (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `platform` | string | non | défaut `"web"` | — |
| `device_name` | string (ou null) | non | — | — |
| `os_version` | string (ou null) | non | — | — |
| `app_version` | string (ou null) | non | — | — |
| `last_seen_at` | string (date-time) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (7) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-NOT-025 — Révocation d'un appareil abonné (navigateur ou mobile)

| Élément | Valeur |
|---|---|
| Module | Rappels et notifications (`app/modules/reminders`, spéc. E) |
| Sous-module | Notifications du navigateur (Web Push) |
| Méthode | `DELETE` |
| Chemin | `/api/v1/notifications/web-push/devices/{device_id}` |
| Fonction | `revoke_push_device` — [app/modules/reminders/router.py:319](../../app/modules/reminders/router.py#L319) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_9_notifications, test_push_mobile) |
| Utilisée par l'interface web | oui (`src/modules/reminders/pages/NotificationsPage.jsx`) |

**Description** (commentaire et docstring du code). Révocation d'un appareil abonné (navigateur ou mobile).

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `device_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `reminders.service.revoke_push_device` ([app/modules/reminders/service.py:690](../../app/modules/reminders/service.py#L690)) : Appareil revoque : plus aucun envoi ; l'historique reste (revoked_at)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Appareil révoqué ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Appareil introuvable » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
