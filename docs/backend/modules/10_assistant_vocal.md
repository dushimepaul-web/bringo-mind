<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Assistant vocal

Dossier du code : [app/modules/voice/](../../app/modules/voice/) · lettre ou numéro de la spécification : **M8** · priorité **1** · documentation générée le 19/11/2026 17:30.

**4 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 2 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 2 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Assistant vocal**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-VOX-001](#api-vox-001--capacités-vocales-disponibles) | GET | `/api/v1/voice/capabilities` | Capacités vocales disponibles | Terminée et opérationnelle | oui |
| [API-VOX-002](#api-vox-002--note-vocale-transcription) | POST | `/api/v1/voice/notes` | Note vocale (transcription) | Terminée, en attente de configuration | oui |
| [API-VOX-003](#api-vox-003--commande-vocale) | POST | `/api/v1/voice/commands` | Commande vocale | Terminée, en attente de configuration | oui |
| [API-VOX-004](#api-vox-004--texte-à-lire-à-voix-haute) | POST | `/api/v1/voice/speech` | Texte à lire à voix haute | Terminée et opérationnelle | oui |

## Sous-module : Assistant vocal

### API-VOX-001 — Capacités vocales disponibles

| Élément | Valeur |
|---|---|
| Module | Assistant vocal (`app/modules/voice`, spéc. M8) |
| Sous-module | Assistant vocal |
| Méthode | `GET` |
| Chemin | `/api/v1/voice/capabilities` |
| Fonction | `capabilities` — [app/modules/voice/router.py:50](../../app/modules/voice/router.py#L50) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_drapeaux_fonctionnalites, test_module_12_administration, test_module_8_voice) |
| Utilisée par l'interface web | oui (`src/modules/voice/api.js`) |

**Description** (commentaire et docstring du code). Capacités vocales disponibles.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `voice.service.capabilities` ([app/modules/voice/service.py:45](../../app/modules/voice/service.py#L45))
  - Fonctions disponibles : l'interface propose la saisie au clavier quand la transcription est absente
  - Drapeau de fonctionnalite « voice.commands » (ADM-004) : deploiement progressif possible
  - C1 : module vocal desactive par l'administrateur (voice.enabled) -> aucune fonction proposee (les routes repondent 403)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet CapabilitiesOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `enabled` | boolean | non | défaut `true` | — |
| `notes` | boolean | oui | — | — |
| `commands` | boolean | oui | — | — |
| `speech` | boolean | oui | — | — |
| `realtime` | boolean | oui | — | — |
| `max_mb` | integer | oui | — | — |
| `max_seconds` | integer | oui | — | — |
| `min_confidence` | number | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (4) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-VOX-002 — Note vocale (transcription)

| Élément | Valeur |
|---|---|
| Module | Assistant vocal (`app/modules/voice`, spéc. M8) |
| Sous-module | Assistant vocal |
| Méthode | `POST` |
| Chemin | `/api/v1/voice/notes` |
| Fonction | `create_note` — [app/modules/voice/router.py:56](../../app/modules/voice/router.py#L56) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 18 test(s) (test_drapeaux_fonctionnalites, test_module_8_voice) |
| Utilisée par l'interface web | oui (`src/modules/voice/api.js`) |

**Description** (commentaire et docstring du code). Note vocale : transcrite en arriere-plan puis visible dans la boite de reception

**État détaillé.**

- Dépendance non configurée (É-05) : Transcription vocale (fournisseur « stt_openai » désactivé) : réponse 503, saisie au clavier proposée.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `voice.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `privacy.service.require_ai`, `voice.service._check_note_quota`, `voice.service._require_stt`.
- Limitation de débit : 30 requêtes POST par minute et par adresse IP (préfixe `/api/v1/voice/`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `Idempotency-Key` | en-tête | string (ou null) | non | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`multipart/form-data`, schéma `Body_create_note_api_v1_voice_notes_post`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `file` | fichier | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : file : ["L'enregistrement est vide"]
- Contrôle dans le code (422) : file : ['Fichier refusé : un logiciel malveillant a été détecté']
- Contrôle dans le code (422) : file : ['Le contenu du fichier ne correspond pas à son type']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `voice.service.create_note` ([app/modules/voice/service.py:93](../../app/modules/voice/service.py#L93)) : Enregistre l'audio temporaire et programme sa transcription ; renvoie (element, deja_existant)
  - Retrait du consentement a l'IA (PRIV-003) : l'audio n'est pas envoye au service de transcription
  - Requete rejouee : l'element deja cree est renvoye
  - Audio temporaire : la purge horaire l'efface a l'echeance, la transcription reste
  - Version du fichier audio : support des informations de l'element (extraction « metadata »)
  - Trois essais : une panne passagere du fournisseur ne perd pas la note

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Note déjà enregistrée », « Note enregistrée, transcription en cours ».
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
| `201` | Créé | succès | oui (12) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `409` | Conflit avec l'état actuel | « Vous avez retiré votre accord au traitement par l'IA : réactivez-le dans Données personnelles pour utiliser cette fonction » | non |
| `413` | Fichier trop volumineux | « L'enregistrement dépasse {limit} Mo » | oui (1) |
| `415` | Type de fichier non accepté | « Format audio non pris en charge » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « file : ["L'enregistrement est vide"] »; « file : ['Fichier refusé : un logiciel malveillant a été détecté'] »; « file : ['Le contenu du fichier ne correspond pas à son type'] » | oui (2) |
| `429` | Trop de requêtes | « Quota mensuel de notes vocales atteint pour votre formule »; limite de débit atteinte | oui (1) |
| `503` | Service indisponible ou non configuré | « La transcription n'est pas disponible : saisissez votre texte au clavier » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-VOX-003 — Commande vocale

| Élément | Valeur |
|---|---|
| Module | Assistant vocal (`app/modules/voice`, spéc. M8) |
| Sous-module | Assistant vocal |
| Méthode | `POST` |
| Chemin | `/api/v1/voice/commands` |
| Fonction | `command` — [app/modules/voice/router.py:67](../../app/modules/voice/router.py#L67) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 13 test(s) (test_drapeaux_fonctionnalites, test_lot6_assistant_voix_api, test_module_8_voice) |
| Utilisée par l'interface web | oui (`src/modules/voice/api.js`) |

**Description** (commentaire et docstring du code). Commande vocale : l'audio n'est pas conserve

**État détaillé.**

- Dépendance non configurée (É-05) : Transcription vocale (fournisseur « stt_openai » désactivé) : réponse 503, saisie au clavier proposée.
- Dépendance non configurée (É-03) : Fournisseur d'IA (ANTHROPIC_API_KEY vide, fournisseur « anthropic » désactivé) : réponse 503 ou repli sur des règles.
- Remarque : Le drapeau « voice.commands » est bien contrôlé par cette route.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `voice.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`, `privacy.service.require_ai`, `voice.service._require_stt`.
- Limitation de débit : 30 requêtes POST par minute et par adresse IP (préfixe `/api/v1/voice/`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `Idempotency-Key` | en-tête | string (ou null) | non | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`multipart/form-data`, schéma `Body_command_api_v1_voice_commands_post`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `file` | fichier | oui | — | — |
| `conversation_id` | string (uuid) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : Fichier illisible : retirez-le ou remplacez-le
- Contrôle dans le code (422) : attachment_ids : ['5 fichiers au plus par message']
- Contrôle dans le code (422) : choice : ["Aucun choix n'est attendu"]
- Contrôle dans le code (422) : file : ["L'enregistrement est vide"]
- Contrôle dans le code (422) : file : ['Le contenu du fichier ne correspond pas à son type']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `voice.service.run_command` ([app/modules/voice/service.py:195](../../app/modules/voice/service.py#L195)) : Commande vocale : transcription, puis meme traitement qu'une demande ecrite (VOC-002)
  - Retrait du consentement a l'IA (PRIV-003) : l'audio n'est pas envoye au service de transcription
  - Quota controle avant l'appel payant au fournisseur de transcription
  - E-47 : rien de reconnu -> aide et exemples de commandes (texte fixe, sans appel au modele)
  - Reconnaissance incertaine : rien n'est execute, l'utilisateur confirme ou reprend sa phrase (VOC-004)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet CommandOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `status` | string | oui | — | — |
| `text` | string | oui | — | — |
| `confidence` | number (ou null) | oui | — | — |
| `conversation_id` | string (uuid) (ou null) | non | — | — |
| `message_id` | string (uuid) (ou null) | non | — | — |
| `run_id` | string (uuid) (ou null) | non | — | — |
| `help` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (8) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `404` | Introuvable ou inaccessible | « Commandes vocales non activées »; « Conversation introuvable » | oui (2) |
| `409` | Conflit avec l'état actuel | « Ce fichier est déjà joint à un message »; « Cette conversation est archivée : elle ne peut plus être modifiée »; « Une demande est déjà en cours de traitement dans cette conversation »; « Vous avez retiré votre accord au traitement par l'IA : réactivez-le dans Données personnelles pour utiliser cette fonction » | non |
| `413` | Fichier trop volumineux | « Ces fichiers sont trop volumineux pour être analysés ensemble »; « L'enregistrement dépasse {limit} Mo » | non |
| `415` | Type de fichier non accepté | « Format audio non pris en charge » | non |
| `422` | Données invalides | « Fichier illisible : retirez-le ou remplacez-le »; « attachment_ids : ['5 fichiers au plus par message'] »; « choice : ["Aucun choix n'est attendu"] »; données ou paramètres invalides; « file : ["L'enregistrement est vide"] »; « file : ['Le contenu du fichier ne correspond pas à son type'] » | non |
| `429` | Trop de requêtes | « Trop de requêtes »; limite de débit atteinte | oui (1) |
| `503` | Service indisponible ou non configuré | « L'assistant est momentanément indisponible : votre demande précédente sera relancée automatiquement »; « L'assistant est momentanément indisponible, réessayez plus tard »; « La transcription est momentanément indisponible, réessayez ou écrivez votre demande »; « La transcription n'est pas disponible : saisissez votre texte au clavier » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-VOX-004 — Texte à lire à voix haute

| Élément | Valeur |
|---|---|
| Module | Assistant vocal (`app/modules/voice`, spéc. M8) |
| Sous-module | Assistant vocal |
| Méthode | `POST` |
| Chemin | `/api/v1/voice/speech` |
| Fonction | `speech` — [app/modules/voice/router.py:74](../../app/modules/voice/router.py#L74) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 7 test(s) (test_drapeaux_fonctionnalites, test_module_8_voice) |
| Utilisée par l'interface web | oui (`src/modules/voice/api.js`) |

**Description** (commentaire et docstring du code). Lecture a voix haute : le texte et la langue de la voix ; le navigateur lit et peut s'arreter a tout moment

**État détaillé.**

- Remarque : La synthèse vocale est faite par le navigateur (aucun fournisseur) ; la route renvoie le texte à lire.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `voice.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `core.auth.check_feature`, `core.auth.require_feature`.
- Limitation de débit : 30 requêtes POST par minute et par adresse IP (préfixe `/api/v1/voice/`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `SpeechIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `message_id` | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `voice.service.prepare_speech` ([app/modules/voice/service.py:230](../../app/modules/voice/service.py#L230)) : Texte a lire : la voix est celle du navigateur, seule sa longueur est mesuree (VOC-003)
  - Requete : message de l'assistant dans une conversation active de l'utilisateur (controles faits apres lecture)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet SpeechOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `text` | string | oui | — | — |
| `language` | string | oui | — | — |
| `characters` | integer | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (2) |
| `404` | Introuvable ou inaccessible | « Commandes vocales non activées »; « Message introuvable » | oui (5) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `429` | Trop de requêtes | limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
