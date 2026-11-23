<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Gestion intelligente des e-mails

Dossier du code : [app/modules/mail/](../../app/modules/mail/) · lettre ou numéro de la spécification : **M6** · priorité **3** · documentation générée le 19/11/2026 17:30.

**13 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 1 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 12 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Comptes de messagerie**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-MEL-001](#api-mel-001--comptes-de-messagerie-connectés) | GET | `/api/v1/mail/accounts` | Comptes de messagerie connectés | Terminée et opérationnelle | oui |
| [API-MEL-002](#api-mel-002--connexion-dune-messagerie-début-oauth) | GET | `/api/v1/mail/{provider}/authorize` | Connexion d'une messagerie (début OAuth) | Terminée, en attente de configuration | oui |
| [API-MEL-003](#api-mel-003--retour-oauth-du-fournisseur-de-messagerie) | GET | `/api/v1/mail/{provider}/callback` | Retour OAuth du fournisseur de messagerie | Terminée, en attente de configuration | oui |
| [API-MEL-004](#api-mel-004--synchronisation-dune-messagerie) | POST | `/api/v1/mail/accounts/{account_id}/sync` | Synchronisation d'une messagerie | Terminée, en attente de configuration | oui |
| [API-MEL-005](#api-mel-005--déconnexion-dune-messagerie) | DELETE | `/api/v1/mail/accounts/{account_id}` | Déconnexion d'une messagerie | Terminée, en attente de configuration | oui |

**Messages analysés**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-MEL-006](#api-mel-006--liste-des-e-mails-analysés) | GET | `/api/v1/mail/messages` | Liste des e-mails analysés | Terminée, en attente de configuration | oui |
| [API-MEL-007](#api-mel-007--détail-dun-e-mail-analysé) | GET | `/api/v1/mail/messages/{message_id}` | Détail d'un e-mail analysé | Terminée, en attente de configuration | oui |
| [API-MEL-008](#api-mel-008--acceptation-dune-proposition-tirée-dun-e-mail) | POST | `/api/v1/mail/messages/{message_id}/proposals/{index}/accept` | Acceptation d'une proposition tirée d'un e-mail | Terminée, en attente de configuration | oui |
| [API-MEL-009](#api-mel-009--rejet-dune-proposition-tirée-dun-e-mail) | POST | `/api/v1/mail/messages/{message_id}/proposals/{index}/reject` | Rejet d'une proposition tirée d'un e-mail | Terminée, en attente de configuration | oui |
| [API-MEL-010](#api-mel-010--exclusion-dun-e-mail-de-lanalyse) | POST | `/api/v1/mail/messages/{message_id}/exclude` | Exclusion d'un e-mail de l'analyse | Terminée, en attente de configuration | oui |
| [API-MEL-011](#api-mel-011--archivage-dun-e-mail) | POST | `/api/v1/mail/messages/{message_id}/archive` | Archivage d'un e-mail | Terminée, en attente de configuration | oui |
| [API-MEL-012](#api-mel-012--suppression-dun-e-mail-analysé) | DELETE | `/api/v1/mail/messages/{message_id}` | Suppression d'un e-mail analysé | Terminée, en attente de configuration | oui |

**Brouillons**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-MEL-013](#api-mel-013--préparation-dun-brouillon-de-réponse) | POST | `/api/v1/mail/drafts` | Préparation d'un brouillon de réponse | Terminée, en attente de configuration | oui |

## Sous-module : Comptes de messagerie

### API-MEL-001 — Comptes de messagerie connectés

| Élément | Valeur |
|---|---|
| Module | Gestion intelligente des e-mails (`app/modules/mail`, spéc. M6) |
| Sous-module | Comptes de messagerie |
| Méthode | `GET` |
| Chemin | `/api/v1/mail/accounts` |
| Fonction | `accounts` — [app/modules/mail/router.py:87](../../app/modules/mail/router.py#L87) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 46 test(s) (test_drapeaux_fonctionnalites, test_module_10_integrations, test_module_15_household, test_module_6_mail) |
| Utilisée par l'interface web | oui (`src/modules/mail/api.js`) |

**Description** (commentaire et docstring du code). Comptes de messagerie connectés.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `email.sync.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `mail.providers.can_send`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet AccountOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `provider` | string (énumération MailProvider) | oui | valeurs : `gmail`, `outlook` | — |
| `account_email` | string (ou null) | non | — | — |
| `status` | string (énumération AccountStatus) | oui | valeurs : `active`, `expired`, `revoked` | — |
| `last_synced_at` | string (date-time) (ou null) | oui | — | — |
| `can_send` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (47) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-MEL-002 — Connexion d'une messagerie (début OAuth)

| Élément | Valeur |
|---|---|
| Module | Gestion intelligente des e-mails (`app/modules/mail`, spéc. M6) |
| Sous-module | Comptes de messagerie |
| Méthode | `GET` |
| Chemin | `/api/v1/mail/{provider}/authorize` |
| Fonction | `authorize` — [app/modules/mail/router.py:94](../../app/modules/mail/router.py#L94) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 48 test(s) (test_drapeaux_fonctionnalites, test_module_10_integrations, test_module_6_mail) |
| Utilisée par l'interface web | oui (`src/modules/mail/api.js`) |

**Description** (commentaire et docstring du code). Lancement de la connexion ; le droit d'envoi n'est demande qu'explicitement

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `email.sync.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `mail.providers.authorize_url`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `provider` | chemin | string (énumération MailProvider) | oui | valeurs : `gmail`, `outlook` | — |
| `send` | requête | boolean | non | défaut `false` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `mail.providers.authorize_url` ([app/modules/mail/providers.py:95](../../app/modules/mail/providers.py#L95))
  - PKCE : le verificateur voyage chiffre dans l'etat signe, le fournisseur n'en recoit que l'empreinte

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet AuthorizeOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `url` | string | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (48) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `503` | Service indisponible ou non configuré | « Connexion à cette messagerie non configurée » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-MEL-003 — Retour OAuth du fournisseur de messagerie

| Élément | Valeur |
|---|---|
| Module | Gestion intelligente des e-mails (`app/modules/mail`, spéc. M6) |
| Sous-module | Comptes de messagerie |
| Méthode | `GET` |
| Chemin | `/api/v1/mail/{provider}/callback` |
| Fonction | `callback` — [app/modules/mail/router.py:100](../../app/modules/mail/router.py#L100) |
| Contrat OpenAPI | non (route cachée du contrat : `include_in_schema=False`) |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 48 test(s) (test_drapeaux_fonctionnalites, test_module_10_integrations, test_module_6_mail) |
| Utilisée par l'interface web | non |

**Description** (commentaire et docstring du code). Retour du fournisseur : redirection vers l'interface, sans aucun jeton dans l'adresse

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle propre à cette route : Retour du navigateur après OAuth : l'utilisateur est identifié par le paramètre `state`, jeton signé valable 10 minutes qui transporte, chiffré, le vérificateur PKCE. Réponse : redirection vers l'interface.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `mail.providers.can_send`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `provider` | chemin | string (énumération MailProvider) | oui | valeurs : `gmail`, `outlook` | — |
| `state` | requête | string | non | défaut `""` | — |
| `code` | requête | string (ou null) | non | — | — |
| `error` | requête | string (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete anonyme (retour du fournisseur) : le compte est enregistre au nom de l'utilisateur du « state » signe
- C1 : messagerie desactivee par l'administrateur (email.sync.enabled) -> retour avec mail_error=403
- Fonction `mail.providers.read_state` ([app/modules/mail/providers.py:107](../../app/modules/mail/providers.py#L107))
  - Etat falsifie, expire ou emis pour autre chose : refuse (400)
- Fonction `mail.service.connect` ([app/modules/mail/service.py:50](../../app/modules/mail/service.py#L50))
  - Reconnexion en lecture seule d'un compte deja autorise a envoyer : le droit est conserve

**Réponse en cas de succès.**

- Réponse directe hors enveloppe possible (RedirectResponse) : fichier, flux, redirection ou réponse sans contenu selon le cas (voir le code).
- Code HTTP **200**.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | non |
| `307` | Redirection | — | oui (50) |
| `400` | Requête invalide | « Lien de connexion invalide ou expiré : recommencez » | non |
| `403` | Accès refusé | « Accès refusé » | non |
| `422` | Données invalides | données ou paramètres invalides | non |
| `502` | Fournisseur externe en erreur | « Le fournisseur de messagerie a refusé la connexion » | non |
| `503` | Service indisponible ou non configuré | « Connexion à cette messagerie non configurée » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-MEL-004 — Synchronisation d'une messagerie

| Élément | Valeur |
|---|---|
| Module | Gestion intelligente des e-mails (`app/modules/mail`, spéc. M6) |
| Sous-module | Comptes de messagerie |
| Méthode | `POST` |
| Chemin | `/api/v1/mail/accounts/{account_id}/sync` |
| Fonction | `sync` — [app/modules/mail/router.py:119](../../app/modules/mail/router.py#L119) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 6 test(s) (test_drapeaux_fonctionnalites, test_module_6_mail) |
| Utilisée par l'interface web | oui (`src/modules/mail/api.js`) |

**Description** (commentaire et docstring du code). Synchronisation d'une messagerie.

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `email.sync.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `account_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `mail.service.request_sync` ([app/modules/mail/service.py:104](../../app/modules/mail/service.py#L104))
  - Une fois par 5 minutes

**Réponse en cas de succès.**

- Code HTTP **202**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Synchronisation lancée ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `202` | Accepté, traité en arrière-plan | succès | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Compte introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Ce compte doit être reconnecté » | non |
| `422` | Données invalides | données ou paramètres invalides | non |
| `429` | Trop de requêtes | « Synchronisation déjà demandée récemment : réessayez dans quelques minutes » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-MEL-005 — Déconnexion d'une messagerie

| Élément | Valeur |
|---|---|
| Module | Gestion intelligente des e-mails (`app/modules/mail`, spéc. M6) |
| Sous-module | Comptes de messagerie |
| Méthode | `DELETE` |
| Chemin | `/api/v1/mail/accounts/{account_id}` |
| Fonction | `disconnect` — [app/modules/mail/router.py:125](../../app/modules/mail/router.py#L125) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 5 test(s) (test_drapeaux_fonctionnalites, test_module_6_mail) |
| Utilisée par l'interface web | oui (`src/modules/mail/api.js`) |

**Description** (commentaire et docstring du code). Déconnexion d'une messagerie.

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `account_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `mail.service.disconnect` ([app/modules/mail/service.py:80](../../app/modules/mail/service.py#L80))
  - Jetons effaces, plus aucune synchronisation ; messages effaces sous 30 jours

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Compte déconnecté ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Compte introuvable » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Messages analysés

### API-MEL-006 — Liste des e-mails analysés

| Élément | Valeur |
|---|---|
| Module | Gestion intelligente des e-mails (`app/modules/mail`, spéc. M6) |
| Sous-module | Messages analysés |
| Méthode | `GET` |
| Chemin | `/api/v1/mail/messages` |
| Fonction | `messages` — [app/modules/mail/router.py:131](../../app/modules/mail/router.py#L131) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 17 test(s) (test_drapeaux_fonctionnalites, test_module_15_household, test_module_6_mail) |
| Utilisée par l'interface web | oui (`src/modules/mail/api.js`) |

**Description** (commentaire et docstring du code). Liste des e-mails analysés.

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `email.sync.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `q` | requête | string (ou null) | non | longueur max. 200 | — |
| `account_id` | requête | string (uuid) (ou null) | non | — | — |
| `archived` | requête | boolean | non | défaut `false` | — |
| `category` | requête | string (ou null) | non | — | — |
| `page` | requête | integer | non | min. 1 ; défaut `1` | — |
| `page_size` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet app__modules__mail__router__ListOut (ou null).
- Liste paginée : `items`, `total`, `page`, `page_size`, `next_cursor` (voir CONVENTIONS.md).

| Champ de `result` (élément de `items`) | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `account_id` | string (uuid) | oui | — | — |
| `sender` | string (ou null) | oui | — | — |
| `subject` | string (ou null) | oui | — | — |
| `received_at` | string (date-time) | oui | — | — |
| `labels` | liste de quelconque | oui | — | — |
| `snippet` | string (ou null) | oui | — | — |
| `category_id` | string (ou null) | oui | — | — |
| `importance` | string (ou null) | oui | — | — |
| `summary` | string (ou null) | oui | — | — |
| `proposals` | liste de quelconque | oui | — | — |
| `excluded` | boolean | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (20) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-MEL-007 — Détail d'un e-mail analysé

| Élément | Valeur |
|---|---|
| Module | Gestion intelligente des e-mails (`app/modules/mail`, spéc. M6) |
| Sous-module | Messages analysés |
| Méthode | `GET` |
| Chemin | `/api/v1/mail/messages/{message_id}` |
| Fonction | `message` — [app/modules/mail/router.py:138](../../app/modules/mail/router.py#L138) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 2 test(s) (test_drapeaux_fonctionnalites, test_module_6_mail) |
| Utilisée par l'interface web | oui (`src/modules/mail/api.js`) |

**Description** (commentaire et docstring du code). Détail d'un e-mail analysé.

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `email.sync.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `message_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet app__modules__mail__router__MessageOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `account_id` | string (uuid) | oui | — | — |
| `sender` | string (ou null) | oui | — | — |
| `subject` | string (ou null) | oui | — | — |
| `received_at` | string (date-time) | oui | — | — |
| `labels` | liste de quelconque | oui | — | — |
| `snippet` | string (ou null) | oui | — | — |
| `category_id` | string (ou null) | oui | — | — |
| `importance` | string (ou null) | oui | — | — |
| `summary` | string (ou null) | oui | — | — |
| `proposals` | liste de quelconque | oui | — | — |
| `excluded` | boolean | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | non |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Message introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-MEL-008 — Acceptation d'une proposition tirée d'un e-mail

| Élément | Valeur |
|---|---|
| Module | Gestion intelligente des e-mails (`app/modules/mail`, spéc. M6) |
| Sous-module | Messages analysés |
| Méthode | `POST` |
| Chemin | `/api/v1/mail/messages/{message_id}/proposals/{index}/accept` |
| Fonction | `accept` — [app/modules/mail/router.py:144](../../app/modules/mail/router.py#L144) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 6 test(s) (test_drapeaux_fonctionnalites, test_module_6_mail) |
| Utilisée par l'interface web | oui (`src/modules/mail/api.js`) |

**Description** (commentaire et docstring du code). Acceptation d'une proposition tirée d'un e-mail.

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `email.sync.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `assign_tasks` (propriétaire, membre) ; `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `message_id` | chemin | string (uuid) | oui | — | — |
| `index` | chemin | integer | oui | — | — |

**Corps de la requête** (`application/json`, schéma `ProposalIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `title` | string (ou null) | non | longueur min. 1 ; longueur max. 200 | — |
| `date` | string (date) (ou null) | non | — | — |
| `time` | string (time) (ou null) | non | — | — |
| `calendar_link_id` | string (uuid) (ou null) | non | — | — |
| `duration_minutes` | integer (ou null) | non | min. 1.0 ; max. 1440.0 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : assignee_id : ["Cette personne n'est pas membre du foyer"]
- Contrôle dans le code (422) : assignee_id : ['Seule une tâche partagée avec un foyer peut être attribuée']
- Contrôle dans le code (422) : calendar_link_id : ["Choisissez le calendrier ou créer l'événement"]
- Contrôle dans le code (422) : date : ["La date, l'heure et le calendrier sont requis pour un rendez-vous"]
- Contrôle dans le code (422) : due_date : ["Une heure d'échéance nécessite une date"]
- Contrôle dans le code (422) : due_date : ['Une tâche récurrente nécessite une date de départ']
- Contrôle dans le code (422) : recurrence_rule : ['Cette règle ne produit aucune date']
- Contrôle dans le code (422) : starts_at : ['Date et heure de début requises (ISO 8601 avec fuseau)']
- Contrôle dans le code (422) : starts_at : ['Le fuseau horaire est requis']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `mail.service.accept_proposal` ([app/modules/mail/service.py:305](../../app/modules/mail/service.py#L305)) : Une proposition devient une tache ou un evenement, seulement apres validation (AC1)
  - Valeurs eventuellement modifiees par l'utilisateur
  - Lien vers le message source enregistre a la creation (historique de la tache)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Proposition validée ».
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Catégorie introuvable »; « Message introuvable »; « Proposition introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Cette proposition a déjà été traitée »; « Vous avez retiré votre accord au traitement par l'IA : réactivez-le dans Données personnelles pour utiliser cette fonction » | oui (1) |
| `422` | Données invalides | « Problème de validation des données »; « assignee_id : ["Cette personne n'est pas membre du foyer"] »; « assignee_id : ['Seule une tâche partagée avec un foyer peut être attribuée'] »; « calendar_link_id : ["Choisissez le calendrier ou créer l'événement"] »; « date : ["La date, l'heure et le calendrier sont requis pour un rendez-vous"] »; données ou paramètres invalides; « due_date : ["Une heure d'échéance nécessite une date"] »; « due_date : ['Une tâche récurrente nécessite une date de départ'] » ; … | oui (1) |
| `503` | Service indisponible ou non configuré | « Rédaction automatique indisponible : saisissez le message vous-même ou réessayez plus tard » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-MEL-009 — Rejet d'une proposition tirée d'un e-mail

| Élément | Valeur |
|---|---|
| Module | Gestion intelligente des e-mails (`app/modules/mail`, spéc. M6) |
| Sous-module | Messages analysés |
| Méthode | `POST` |
| Chemin | `/api/v1/mail/messages/{message_id}/proposals/{index}/reject` |
| Fonction | `reject` — [app/modules/mail/router.py:149](../../app/modules/mail/router.py#L149) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 2 test(s) (test_drapeaux_fonctionnalites, test_module_6_mail) |
| Utilisée par l'interface web | oui (`src/modules/mail/api.js`) |

**Description** (commentaire et docstring du code). Rejet d'une proposition tirée d'un e-mail.

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `email.sync.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `message_id` | chemin | string (uuid) | oui | — | — |
| `index` | chemin | integer | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Proposition écartée ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | non |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Message introuvable »; « Proposition introuvable » | non |
| `409` | Conflit avec l'état actuel | « Cette proposition a déjà été traitée » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-MEL-010 — Exclusion d'un e-mail de l'analyse

| Élément | Valeur |
|---|---|
| Module | Gestion intelligente des e-mails (`app/modules/mail`, spéc. M6) |
| Sous-module | Messages analysés |
| Méthode | `POST` |
| Chemin | `/api/v1/mail/messages/{message_id}/exclude` |
| Fonction | `exclude` — [app/modules/mail/router.py:155](../../app/modules/mail/router.py#L155) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 2 test(s) (test_drapeaux_fonctionnalites, test_module_6_mail) |
| Utilisée par l'interface web | oui (`src/modules/mail/api.js`) |

**Description** (commentaire et docstring du code). Exclusion d'un e-mail de l'analyse.

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `email.sync.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `message_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `app__modules__mail__router__FlagIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `value` | boolean | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `mail.service.set_excluded` ([app/modules/mail/service.py:349](../../app/modules/mail/service.py#L349))
  - Un message exclu n'est plus analyse et perd son analyse

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet app__modules__mail__router__MessageOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `account_id` | string (uuid) | oui | — | — |
| `sender` | string (ou null) | oui | — | — |
| `subject` | string (ou null) | oui | — | — |
| `received_at` | string (date-time) | oui | — | — |
| `labels` | liste de quelconque | oui | — | — |
| `snippet` | string (ou null) | oui | — | — |
| `category_id` | string (ou null) | oui | — | — |
| `importance` | string (ou null) | oui | — | — |
| `summary` | string (ou null) | oui | — | — |
| `proposals` | liste de quelconque | oui | — | — |
| `excluded` | boolean | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Message introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-MEL-011 — Archivage d'un e-mail

| Élément | Valeur |
|---|---|
| Module | Gestion intelligente des e-mails (`app/modules/mail`, spéc. M6) |
| Sous-module | Messages analysés |
| Méthode | `POST` |
| Chemin | `/api/v1/mail/messages/{message_id}/archive` |
| Fonction | `archive` — [app/modules/mail/router.py:160](../../app/modules/mail/router.py#L160) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 2 test(s) (test_drapeaux_fonctionnalites, test_module_6_mail) |
| Utilisée par l'interface web | oui (`src/modules/mail/api.js`) |

**Description** (commentaire et docstring du code). Archivage d'un e-mail.

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `email.sync.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `message_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `app__modules__mail__router__FlagIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `value` | boolean | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet app__modules__mail__router__MessageOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `account_id` | string (uuid) | oui | — | — |
| `sender` | string (ou null) | oui | — | — |
| `subject` | string (ou null) | oui | — | — |
| `received_at` | string (date-time) | oui | — | — |
| `labels` | liste de quelconque | oui | — | — |
| `snippet` | string (ou null) | oui | — | — |
| `category_id` | string (ou null) | oui | — | — |
| `importance` | string (ou null) | oui | — | — |
| `summary` | string (ou null) | oui | — | — |
| `proposals` | liste de quelconque | oui | — | — |
| `excluded` | boolean | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Message introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-MEL-012 — Suppression d'un e-mail analysé

| Élément | Valeur |
|---|---|
| Module | Gestion intelligente des e-mails (`app/modules/mail`, spéc. M6) |
| Sous-module | Messages analysés |
| Méthode | `DELETE` |
| Chemin | `/api/v1/mail/messages/{message_id}` |
| Fonction | `delete_message` — [app/modules/mail/router.py:166](../../app/modules/mail/router.py#L166) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 3 test(s) (test_drapeaux_fonctionnalites, test_module_6_mail) |
| Utilisée par l'interface web | oui (`src/modules/mail/api.js`) |

**Description** (commentaire et docstring du code). Suppression locale : le message reste chez le fournisseur, et cela est dit explicitement

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `email.sync.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `message_id` | chemin | string (uuid) | oui | — | — |
| `confirm` | requête | boolean | non | défaut `false` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : confirm : ['La suppression doit être confirmée explicitement']

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Message introuvable » | non |
| `422` | Données invalides | « confirm : ['La suppression doit être confirmée explicitement'] »; données ou paramètres invalides | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Brouillons

### API-MEL-013 — Préparation d'un brouillon de réponse

| Élément | Valeur |
|---|---|
| Module | Gestion intelligente des e-mails (`app/modules/mail`, spéc. M6) |
| Sous-module | Brouillons |
| Méthode | `POST` |
| Chemin | `/api/v1/mail/drafts` |
| Fonction | `draft` — [app/modules/mail/router.py:173](../../app/modules/mail/router.py#L173) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 11 test(s) (test_drapeaux_fonctionnalites, test_module_6_mail) |
| Utilisée par l'interface web | oui (`src/modules/mail/api.js`) |

**Description** (commentaire et docstring du code). Brouillon soumis a approbation : l'envoi passe par /api/v1/action-requests/{id}/approve

**État détaillé.**

- Dépendance non configurée (É-28) : OAuth Google et Microsoft (identifiants vides, fournisseurs désactivés) : réponse 503 « non configuré ».
- Dépendance non configurée (É-03) : Fournisseur d'IA (ANTHROPIC_API_KEY vide, fournisseur « anthropic » désactivé) : réponse 503 ou repli sur des règles.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `email.sync.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `mail.providers.can_send`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `Idempotency-Key` | en-tête | string | oui | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`application/json`, schéma `DraftIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `account_id` | string (uuid) | oui | — | — |
| `message_id` | string (uuid) (ou null) | non | — | — |
| `to` | string (email) | oui | — | — |
| `subject` | string | oui | longueur min. 1 ; longueur max. 200 | — |
| `body` | string | oui | longueur min. 1 ; longueur max. 20000 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : account_id : ["Autorisez l'envoi depuis ce compte pour répondre"]
- Contrôle dans le code (422) : calendar_link_id : ["Choisissez le calendrier ou créer l'événement"]
- Contrôle dans le code (422) : starts_at : ['Date et heure de début requises (ISO 8601 avec fuseau)']
- Contrôle dans le code (422) : starts_at : ['Le fuseau horaire est requis']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `mail.service.prepare_draft` ([app/modules/mail/service.py:376](../../app/modules/mail/service.py#L376)) : Brouillon : une demande d'action soumise a approbation (categorie 5), jamais un envoi direct

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Brouillon préparé : vérifiez-le puis approuvez l'envoi ».
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
| `201` | Créé | succès | oui (8) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Compte introuvable »; « Message introuvable » | non |
| `409` | Conflit avec l'état actuel | « Ce compte doit être reconnecté »; « Vous avez retiré votre accord au traitement par l'IA : réactivez-le dans Données personnelles pour utiliser cette fonction » | non |
| `422` | Données invalides | « Problème de validation des données »; « account_id : ["Autorisez l'envoi depuis ce compte pour répondre"] »; « calendar_link_id : ["Choisissez le calendrier ou créer l'événement"] »; données ou paramètres invalides; « starts_at : ['Date et heure de début requises (ISO 8601 avec fuseau)'] »; « starts_at : ['Le fuseau horaire est requis'] » | oui (2) |
| `503` | Service indisponible ou non configuré | « Rédaction automatique indisponible : saisissez le message vous-même ou réessayez plus tard » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
