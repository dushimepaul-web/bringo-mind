<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Documents et intelligence documentaire

Dossier du code : [app/modules/documents/](../../app/modules/documents/) · lettre ou numéro de la spécification : **M5** · priorité **1** · documentation générée le 19/11/2026 17:30.

**26 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 21 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 5 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Téléversement en trois étapes**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-DOC-001](#api-doc-001--téléversement-étape-1--ouverture-de-lenvoi) | POST | `/api/v1/documents/uploads` | Téléversement, étape 1 : ouverture de l'envoi | Terminée, en attente de configuration | oui |
| [API-DOC-002](#api-doc-002--téléversement-étape-2--envoi-du-contenu-url-signée) | PUT | `/api/v1/documents/uploads/{upload_id}/content` | Téléversement, étape 2 : envoi du contenu (URL signée) | Terminée, en attente de configuration | oui |
| [API-DOC-003](#api-doc-003--téléversement-étape-3--confirmation-et-lancement-du-traitement) | POST | `/api/v1/documents/uploads/{upload_id}/confirm` | Téléversement, étape 3 : confirmation et lancement du traitement | Terminée, en attente de configuration | oui |
| [API-DOC-004](#api-doc-004--confirmation-didentité-avant-laccès-à-un-document-sensible) | POST | `/api/v1/documents/reauthenticate` | Confirmation d'identité avant l'accès à un document sensible | Terminée et opérationnelle | oui |

**Consultation et gestion**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-DOC-005](#api-doc-005--liste-et-recherche-des-documents) | GET | `/api/v1/documents` | Liste et recherche des documents | Terminée et opérationnelle | oui |
| [API-DOC-013](#api-doc-013--fiche-dun-document) | GET | `/api/v1/documents/{document_id}` | Fiche d'un document | Terminée et opérationnelle | oui |
| [API-DOC-018](#api-doc-018--modification-dun-document-titre-catégorie-étiquettes-conservation) | PATCH | `/api/v1/documents/{document_id}` | Modification d'un document (titre, catégorie, étiquettes, conservation) | Terminée et opérationnelle | oui |
| [API-DOC-019](#api-doc-019--création-dun-lien-temporaire-de-consultation-ou-de-téléchargement) | POST | `/api/v1/documents/{document_id}/links` | Création d'un lien temporaire de consultation ou de téléchargement | Terminée et opérationnelle | oui |
| [API-DOC-020](#api-doc-020--archivage-dun-document) | POST | `/api/v1/documents/{document_id}/archive` | Archivage d'un document | Terminée et opérationnelle | oui |
| [API-DOC-021](#api-doc-021--désarchivage-dun-document) | POST | `/api/v1/documents/{document_id}/unarchive` | Désarchivage d'un document | Terminée et opérationnelle | oui |
| [API-DOC-023](#api-doc-023--date-dexpiration-dun-document) | PUT | `/api/v1/documents/{document_id}/expiry` | Date d'expiration d'un document | Terminée et opérationnelle | oui |

**Catégories et étiquettes**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-DOC-006](#api-doc-006--liste-des-catégories-de-documents) | GET | `/api/v1/document-categories` | Liste des catégories de documents | Terminée et opérationnelle | oui |
| [API-DOC-007](#api-doc-007--création-dune-catégorie-de-documents) | POST | `/api/v1/document-categories` | Création d'une catégorie de documents | Terminée et opérationnelle | oui |
| [API-DOC-008](#api-doc-008--renommage-dune-catégorie-de-documents) | PATCH | `/api/v1/document-categories/{category_id}` | Renommage d'une catégorie de documents | Terminée et opérationnelle | oui |
| [API-DOC-009](#api-doc-009--suppression-dune-catégorie-de-documents) | DELETE | `/api/v1/document-categories/{category_id}` | Suppression d'une catégorie de documents | Terminée et opérationnelle | oui |
| [API-DOC-010](#api-doc-010--liste-des-étiquettes-de-documents) | GET | `/api/v1/document-tags` | Liste des étiquettes de documents | Terminée et opérationnelle | oui |

**Fichiers (URL signées)**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-DOC-011](#api-doc-011--lecture-dun-fichier-par-url-signée) | GET | `/api/v1/documents/files/{version_id}` | Lecture d'un fichier par URL signée | Terminée et opérationnelle | oui |

**Corbeille**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-DOC-012](#api-doc-012--corbeille-des-documents) | GET | `/api/v1/documents/trash` | Corbeille des documents | Terminée et opérationnelle | oui |
| [API-DOC-017](#api-doc-017--restauration-dun-document-supprimé) | POST | `/api/v1/documents/{document_id}/restore` | Restauration d'un document supprimé | Terminée et opérationnelle | oui |

**Traitement et analyse**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-DOC-014](#api-doc-014--suivi-du-traitement-dun-document) | GET | `/api/v1/documents/{document_id}/processing` | Suivi du traitement d'un document | Terminée et opérationnelle | oui |
| [API-DOC-015](#api-doc-015--relance-dun-traitement-en-échec) | POST | `/api/v1/documents/{document_id}/reprocess` | Relance d'un traitement en échec | Terminée, en attente de configuration | oui |
| [API-DOC-016](#api-doc-016--résumé-dun-document-par-lia) | POST | `/api/v1/documents/{document_id}/summary` | Résumé d'un document par l'IA | Terminée, en attente de configuration | oui |
| [API-DOC-022](#api-doc-022--autorisation-de-lanalyse-par-lia-pour-un-document) | POST | `/api/v1/documents/{document_id}/ai-consent` | Autorisation de l'analyse par l'IA pour un document | Terminée et opérationnelle | oui |

**Versions**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-DOC-024](#api-doc-024--liste-des-versions-dun-document) | GET | `/api/v1/documents/{document_id}/versions` | Liste des versions d'un document | Terminée et opérationnelle | oui |
| [API-DOC-025](#api-doc-025--restauration-dune-ancienne-version) | POST | `/api/v1/documents/{document_id}/versions/{number}/restore` | Restauration d'une ancienne version | Terminée et opérationnelle | oui |
| [API-DOC-026](#api-doc-026--suppression-dune-version-non-active) | DELETE | `/api/v1/documents/{document_id}/versions/{number}` | Suppression d'une version non active | Terminée et opérationnelle | oui |

## Sous-module : Téléversement en trois étapes

### API-DOC-001 — Téléversement, étape 1 : ouverture de l'envoi

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Téléversement en trois étapes |
| Méthode | `POST` |
| Chemin | `/api/v1/documents/uploads` |
| Fonction | `init_upload` — [app/modules/documents/router.py:152](../../app/modules/documents/router.py#L152) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 122 test(s) (test_lot3_documents, test_lot8_preparation, test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Etape 1 : metadonnees et URL signee

**État détaillé.**

- Dépendance non configurée (É-01) : Antivirus ClamAV (CLAMAV_HOST vide) : l'analyse est ignorée (SKIPPED), le fichier est traité sans antivirus.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `documents.service._check_capacity`, `documents.service._require_version_room`.
- Limitation de débit : 60 requêtes POST par minute et par adresse IP (préfixe `/api/v1/documents`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `UploadIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `file_name` | string | oui | longueur min. 1 ; longueur max. 255 | — |
| `mime_type` | string | oui | longueur max. 100 | — |
| `size_bytes` | integer | oui | strictement > 0.0 | — |
| `sha256` | string | oui | motif `^[0-9a-fA-F]{64}$` | — |
| `title` | string (ou null) | non | longueur max. 255 | — |
| `is_sensitive` | boolean | non | défaut `false` | — |
| `document_id` | string (uuid) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.init_upload` ([app/modules/documents/service.py:77](../../app/modules/documents/service.py#L77)) : Etape 1 : controle des metadonnees et URL signee de 15 minutes
  - Envoi en cours : version inactive d'un document (« uploaded » pour un premier envoi)

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Envoi initialisé ».
- `result` : objet app__modules__documents__router__UploadOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `upload_id` | string (uuid) | oui | — | — |
| `upload_url` | string | oui | — | — |
| `expires_at` | string (date-time) | oui | — | — |
| `duplicate_of` | string (uuid) (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (144) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous ne pouvez pas modifier ce document » | non |
| `404` | Introuvable ou inaccessible | « Document introuvable » | non |
| `409` | Conflit avec l'état actuel | « Limite de 10 versions atteinte : supprimez une ancienne version » | oui (1) |
| `413` | Fichier trop volumineux | « Le fichier dépasse {get_settings().max_document_mb} Mo » | oui (1) |
| `415` | Type de fichier non accepté | « Format non pris en charge : PDF, PNG, JPEG, WebP ou texte uniquement » | oui (5) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `429` | Trop de requêtes | limite de débit atteinte | non |
| `507` | Espace de stockage insuffisant | « Espace de stockage insuffisant : réessayez plus tard » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-002 — Téléversement, étape 2 : envoi du contenu (URL signée)

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Téléversement en trois étapes |
| Méthode | `PUT` |
| Chemin | `/api/v1/documents/uploads/{upload_id}/content` |
| Fonction | `upload_content` — [app/modules/documents/router.py:159](../../app/modules/documents/router.py#L159) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 112 test(s) (test_lot3_documents, test_lot8_preparation, test_module_5_documents) |
| Utilisée par l'interface web | non |

**Description** (commentaire et docstring du code). Etape 2 : envoi du fichier, authentifie par la signature de l'URL

**État détaillé.**

- Dépendance non configurée (É-01) : Antivirus ClamAV (CLAMAV_HOST vide) : l'analyse est ignorée (SKIPPED), le fichier est traité sans antivirus.

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle propre à cette route : URL signée (`expires`, `signature`) renvoyée par l'étape 1 du téléversement ; aucun jeton d'accès.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `upload_id` | chemin | string (uuid) | oui | — | — |
| `expires` | requête | integer | oui | — | — |
| `signature` | requête | string | oui | longueur max. 128 | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Lecture progressive : l'envoi s'arrete des que la limite est depassee
- Fonction `documents.service.receive_content` ([app/modules/documents/service.py:110](../../app/modules/documents/service.py#L110)) : Etape 2 : reception du fichier via l'URL signee (aucun document n'existe encore)
  - Lien signe sans session : version lue par le role du worker (aucune donnee personnelle exposee)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Fichier reçu ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (137) |
| `403` | Accès refusé | « Lien d'envoi invalide » | oui (1) |
| `404` | Introuvable ou inaccessible | « Envoi introuvable » | non |
| `410` | Expiré ou n'existe plus | « Ce lien d'envoi a expiré : recommencez l'envoi » | oui (1) |
| `413` | Fichier trop volumineux | « Le fichier dépasse {get_settings().max_document_mb} Mo » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-003 — Téléversement, étape 3 : confirmation et lancement du traitement

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Téléversement en trois étapes |
| Méthode | `POST` |
| Chemin | `/api/v1/documents/uploads/{upload_id}/confirm` |
| Fonction | `confirm_upload` — [app/modules/documents/router.py:174](../../app/modules/documents/router.py#L174) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 111 test(s) (test_lot3_documents, test_lot8_preparation, test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Etape 3 : verifications reelles et lancement du traitement

**État détaillé.**

- Dépendance non configurée (É-01) : Antivirus ClamAV (CLAMAV_HOST vide) : l'analyse est ignorée (SKIPPED), le fichier est traité sans antivirus.
- Dépendance non configurée (É-04) : OCR (fournisseur « google_cloud » désactivé) : un scan ou une photo reste illisible ; les PDF à texte sont lus.
- Dépendance non configurée (É-03) : Fournisseur d'IA (ANTHROPIC_API_KEY vide, fournisseur « anthropic » désactivé) : réponse 503 ou repli sur des règles.
- Remarque : Le traitement lancé après la confirmation lit les PDF à texte par règles ; l'OCR et l'extraction par l'IA attendent leurs fournisseurs.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `documents.service._require_version_room`.
- Limitation de débit : 60 requêtes POST par minute et par adresse IP (préfixe `/api/v1/documents`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `upload_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : file : ["Le fichier n'a pas été reçu"]
- Contrôle dans le code (422) : file : ['Le fichier reçu ne correspond pas à celui annoncé']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.confirm_upload` ([app/modules/documents/service.py:148](../../app/modules/documents/service.py#L148)) : Etape 3 : controles reels (signature, taille, antivirus) ; renvoie (document, doublon)
  - Confirmation rejouee : le document deja cree est renvoye, sans doublon
  - Type reel : une image renommee en .pdf est refusee (AC2)
  - Antivirus avant tout traitement ; indisponible : l'envoi reste en attente
  - Quota de la formule, comme pour tout document analyse

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet ConfirmedOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `document` | objet app__modules__documents__router__DocumentOut | oui | — | — |
| `document.id` | string (uuid) | oui | — | — |
| `document.title` | string (ou null) | oui | — | — |
| `document.original_filename` | string | oui | — | — |
| `document.mime_type` | string | oui | — | — |
| `document.size_bytes` | integer | oui | — | — |
| `document.status` | string (énumération DocumentStatus) | oui | valeurs : `uploaded`, `processing`, `ready`, `archived`, `quarantined`, `failed_unreadable`, `awaiting_ai_consent`, `deleted` | — |
| `document.version` | integer | oui | — | — |
| `document.current_version` | integer | oui | — | — |
| `document.is_sensitive` | boolean | oui | — | — |
| `document.ai_allowed` | boolean | oui | — | — |
| `document.document_type` | string (ou null) | oui | — | — |
| `document.category_id` | string (uuid) (ou null) | oui | — | — |
| `document.household_id` | string (uuid) (ou null) | oui | — | — |
| `document.source_item_id` | string (uuid) (ou null) | oui | — | — |
| `document.expiry_date` | string (date) (ou null) | oui | — | — |
| `document.retention_until` | string (date-time) (ou null) | oui | — | — |
| `document.archived_at` | string (date-time) (ou null) | oui | — | — |
| `document.created_at` | string (date-time) | oui | — | — |
| `document.tags` | liste de string | non | défaut `[]` | — |
| `document.summary` | string (ou null) | non | — | — |
| `duplicate` | boolean | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (134) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Document introuvable »; « Envoi introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Limite de 10 versions atteinte : supprimez une ancienne version » | non |
| `413` | Fichier trop volumineux | « Le fichier dépasse {get_settings().max_document_mb} Mo » | non |
| `415` | Type de fichier non accepté | « Format non pris en charge : le contenu du fichier ne correspond pas à son type » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « file : ["Le fichier n'a pas été reçu"] »; « file : ['Le fichier reçu ne correspond pas à celui annoncé'] » | oui (2) |
| `429` | Trop de requêtes | « Quota mensuel d'analyses de documents atteint pour votre formule »; limite de débit atteinte | non |
| `503` | Service indisponible ou non configuré | « Analyse antivirus momentanément indisponible, réessayez » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-004 — Confirmation d'identité avant l'accès à un document sensible

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Téléversement en trois étapes |
| Méthode | `POST` |
| Chemin | `/api/v1/documents/reauthenticate` |
| Fonction | `reauthenticate` — [app/modules/documents/router.py:181](../../app/modules/documents/router.py#L181) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Authentification recente, exigee pour un document sensible

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `core.security.verify_password`.
- Limitation de débit : 10 requêtes POST par minute et par adresse IP (préfixe `/api/v1/documents/reauthenticate`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `app__modules__documents__router__PasswordIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `password` | string | oui | longueur min. 1 ; longueur max. 256 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.reauthenticate` ([app/modules/documents/service.py:293](../../app/modules/documents/service.py#L293))
  - Derniere confirmation du mot de passe pour cette session (user_profiles.preferences["auth"]["reauth"])

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Identité confirmée ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | « Mot de passe incorrect »; jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `429` | Trop de requêtes | limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Consultation et gestion

### API-DOC-005 — Liste et recherche des documents

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Consultation et gestion |
| Méthode | `GET` |
| Chemin | `/api/v1/documents` |
| Fonction | `search_documents` — [app/modules/documents/router.py:188](../../app/modules/documents/router.py#L188) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 13 test(s) (test_lot3_documents, test_lot8_preparation, test_module_5_documents, test_module_8_voice) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Recherche documentaire

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `q` | requête | string (ou null) | non | longueur max. 200 | — |
| `category` | requête | string (uuid) (ou null) | non | — | — |
| `tag` | requête | string (ou null) | non | longueur max. 60 | — |
| `date_from` | requête | string (date) (ou null) | non | — | — |
| `date_to` | requête | string (date) (ou null) | non | — | — |
| `status` | requête | string (énumération DocumentStatus) (ou null) | non | valeurs : `uploaded`, `processing`, `ready`, `archived`, `quarantined`, `failed_unreadable`, `awaiting_ai_consent`, `deleted` | — |
| `archived` | requête | boolean | non | défaut `false` | — |
| `sort` | requête | string | non | valeurs : `created_at`, `title` ; défaut `"created_at"` | — |
| `cursor` | requête | string (ou null) | non | — | — |
| `limit` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : cursor : ['Curseur invalide']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.search` ([app/modules/documents/service.py:569](../../app/modules/documents/service.py#L569))
  - Documents du proprietaire et documents partages avec ses foyers ; jamais ceux d'autrui
  - Seuls les documents geres par la bibliotheque : les fichiers du coffre-fort et les pieces historiques restent inclus
  - L'audio temporaire des notes vocales n'appartient pas a la bibliotheque
  - Exclus de la bibliotheque : televersements non termines, audio des notes vocales et texte des elements de l'inbox
  - (document technique « inbox/… » exige par document_extractions, absent de la bibliotheque avant l'alignement)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet app__modules__documents__router__ListOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `items` | liste de objet app__modules__documents__router__DocumentOut | oui | — | — |
| `items[].id` | string (uuid) | oui | — | — |
| `items[].title` | string (ou null) | oui | — | — |
| `items[].original_filename` | string | oui | — | — |
| `items[].mime_type` | string | oui | — | — |
| `items[].size_bytes` | integer | oui | — | — |
| `items[].status` | string (énumération DocumentStatus) | oui | valeurs : `uploaded`, `processing`, `ready`, `archived`, `quarantined`, `failed_unreadable`, `awaiting_ai_consent`, `deleted` | — |
| `items[].version` | integer | oui | — | — |
| `items[].current_version` | integer | oui | — | — |
| `items[].is_sensitive` | boolean | oui | — | — |
| `items[].ai_allowed` | boolean | oui | — | — |
| `items[].document_type` | string (ou null) | oui | — | — |
| `items[].category_id` | string (uuid) (ou null) | oui | — | — |
| `items[].household_id` | string (uuid) (ou null) | oui | — | — |
| `items[].source_item_id` | string (uuid) (ou null) | oui | — | — |
| `items[].expiry_date` | string (date) (ou null) | oui | — | — |
| `items[].retention_until` | string (date-time) (ou null) | oui | — | — |
| `items[].archived_at` | string (date-time) (ou null) | oui | — | — |
| `items[].created_at` | string (date-time) | oui | — | — |
| `items[].tags` | liste de string | non | défaut `[]` | — |
| `items[].summary` | string (ou null) | non | — | — |
| `next_cursor` | string (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (22) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | « cursor : ['Curseur invalide'] »; données ou paramètres invalides | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-013 — Fiche d'un document

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Consultation et gestion |
| Méthode | `GET` |
| Chemin | `/api/v1/documents/{document_id}` |
| Fonction | `get_document` — [app/modules/documents/router.py:247](../../app/modules/documents/router.py#L247) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 30 test(s) (test_lot3_documents, test_lot8_preparation, test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Detail d'un document et etat de son traitement

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `documents.service._visible`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet app__modules__documents__router__DocumentOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `original_filename` | string | oui | — | — |
| `mime_type` | string | oui | — | — |
| `size_bytes` | integer | oui | — | — |
| `status` | string (énumération DocumentStatus) | oui | valeurs : `uploaded`, `processing`, `ready`, `archived`, `quarantined`, `failed_unreadable`, `awaiting_ai_consent`, `deleted` | — |
| `version` | integer | oui | — | — |
| `current_version` | integer | oui | — | — |
| `is_sensitive` | boolean | oui | — | — |
| `ai_allowed` | boolean | oui | — | — |
| `document_type` | string (ou null) | oui | — | — |
| `category_id` | string (uuid) (ou null) | oui | — | — |
| `household_id` | string (uuid) (ou null) | oui | — | — |
| `source_item_id` | string (uuid) (ou null) | oui | — | — |
| `expiry_date` | string (date) (ou null) | oui | — | — |
| `retention_until` | string (date-time) (ou null) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `tags` | liste de string | non | défaut `[]` | — |
| `summary` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (37) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Document introuvable » | oui (3) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-018 — Modification d'un document (titre, catégorie, étiquettes, conservation)

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Consultation et gestion |
| Méthode | `PATCH` |
| Chemin | `/api/v1/documents/{document_id}` |
| Fonction | `update_document` — [app/modules/documents/router.py:278](../../app/modules/documents/router.py#L278) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 11 test(s) (test_lot3_documents, test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Modification d'un document (titre, catégorie, étiquettes, conservation).

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `households.service.require_permission`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `MetadataIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `version` | integer | oui | min. 1.0 | — |
| `title` | string (ou null) | non | longueur min. 1 ; longueur max. 255 | — |
| `category_id` | string (uuid) (ou null) | non | — | — |
| `household_id` | string (uuid) (ou null) | non | — | — |
| `tags` | liste de string (ou null) | non | — | — |
| `retention_until` | string (date) (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : retention_until : ['La date de conservation doit être dans le futur']
- Contrôle dans le code (422) : tags : ['20 étiquettes au maximum par document']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.update_metadata` ([app/modules/documents/service.py:373](../../app/modules/documents/service.py#L373))
  - Verrou optimiste
  - E-19 : a cette date le fichier est definitivement efface ; une date passee ou du jour l'effacerait aussitot

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Document modifié ».
- `result` : objet app__modules__documents__router__DocumentOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `original_filename` | string | oui | — | — |
| `mime_type` | string | oui | — | — |
| `size_bytes` | integer | oui | — | — |
| `status` | string (énumération DocumentStatus) | oui | valeurs : `uploaded`, `processing`, `ready`, `archived`, `quarantined`, `failed_unreadable`, `awaiting_ai_consent`, `deleted` | — |
| `version` | integer | oui | — | — |
| `current_version` | integer | oui | — | — |
| `is_sensitive` | boolean | oui | — | — |
| `ai_allowed` | boolean | oui | — | — |
| `document_type` | string (ou null) | oui | — | — |
| `category_id` | string (uuid) (ou null) | oui | — | — |
| `household_id` | string (uuid) (ou null) | oui | — | — |
| `source_item_id` | string (uuid) (ou null) | oui | — | — |
| `expiry_date` | string (date) (ou null) | oui | — | — |
| `retention_until` | string (date-time) (ou null) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `tags` | liste de string | non | défaut `[]` | — |
| `summary` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (12) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Seul le propriétaire peut partager ce document »; « Vous n'avez pas la permission requise dans ce foyer »; « Vous ne pouvez pas modifier ce document » | non |
| `404` | Introuvable ou inaccessible | « Catégorie introuvable »; « Document introuvable »; « Foyer introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Ce document a été modifié entre-temps : rechargez-le avant d'enregistrer » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « retention_until : ['La date de conservation doit être dans le futur'] »; « tags : ['20 étiquettes au maximum par document'] » | oui (3) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-019 — Création d'un lien temporaire de consultation ou de téléchargement

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Consultation et gestion |
| Méthode | `POST` |
| Chemin | `/api/v1/documents/{document_id}/links` |
| Fonction | `create_link` — [app/modules/documents/router.py:284](../../app/modules/documents/router.py#L284) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 12 test(s) (test_lot3_documents, test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Lien signe de previsualisation ou de telechargement

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `documents.service._visible`, `documents.service.require_file_access`.
- Limitation de débit : 60 requêtes POST par minute et par adresse IP (préfixe `/api/v1/documents`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `LinkIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `purpose` | string | oui | valeurs : `preview`, `download` | — |
| `version` | integer (ou null) | non | min. 1.0 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.file_link` ([app/modules/documents/service.py:329](../../app/modules/documents/service.py#L329)) : URL signee : 5 minutes pour la previsualisation, 15 minutes pour le telechargement

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet LinkOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `url` | string | oui | — | — |
| `expires_in` | integer | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (12) |
| `401` | Non authentifié ou session invalide | « Confirmez votre mot de passe pour accéder à ce document sensible »; jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `404` | Introuvable ou inaccessible | « Document introuvable »; « Version introuvable » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `423` | Verrouillé (quarantaine) | « Ce document est en quarantaine : son accès est bloqué » | oui (1) |
| `429` | Trop de requêtes | limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-020 — Archivage d'un document

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Consultation et gestion |
| Méthode | `POST` |
| Chemin | `/api/v1/documents/{document_id}/archive` |
| Fonction | `archive` — [app/modules/documents/router.py:290](../../app/modules/documents/router.py#L290) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_api_sans_test_auparavant, test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Archivage d'un document.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Limitation de débit : 60 requêtes POST par minute et par adresse IP (préfixe `/api/v1/documents`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Document archivé ».
- `result` : objet app__modules__documents__router__DocumentOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `original_filename` | string | oui | — | — |
| `mime_type` | string | oui | — | — |
| `size_bytes` | integer | oui | — | — |
| `status` | string (énumération DocumentStatus) | oui | valeurs : `uploaded`, `processing`, `ready`, `archived`, `quarantined`, `failed_unreadable`, `awaiting_ai_consent`, `deleted` | — |
| `version` | integer | oui | — | — |
| `current_version` | integer | oui | — | — |
| `is_sensitive` | boolean | oui | — | — |
| `ai_allowed` | boolean | oui | — | — |
| `document_type` | string (ou null) | oui | — | — |
| `category_id` | string (uuid) (ou null) | oui | — | — |
| `household_id` | string (uuid) (ou null) | oui | — | — |
| `source_item_id` | string (uuid) (ou null) | oui | — | — |
| `expiry_date` | string (date) (ou null) | oui | — | — |
| `retention_until` | string (date-time) (ou null) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `tags` | liste de string | non | défaut `[]` | — |
| `summary` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous ne pouvez pas modifier ce document » | non |
| `404` | Introuvable ou inaccessible | « Document introuvable » | non |
| `409` | Conflit avec l'état actuel | « Conflit avec l'état actuel »; « Traitement en cours : réessayez lorsqu'il sera terminé » | non |
| `422` | Données invalides | données ou paramètres invalides | non |
| `423` | Verrouillé (quarantaine) | « Ce document est en quarantaine : son accès est bloqué » | non |
| `429` | Trop de requêtes | limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-021 — Désarchivage d'un document

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Consultation et gestion |
| Méthode | `POST` |
| Chemin | `/api/v1/documents/{document_id}/unarchive` |
| Fonction | `unarchive` — [app/modules/documents/router.py:295](../../app/modules/documents/router.py#L295) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_api_sans_test_auparavant) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Désarchivage d'un document.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Limitation de débit : 60 requêtes POST par minute et par adresse IP (préfixe `/api/v1/documents`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Document désarchivé ».
- `result` : objet app__modules__documents__router__DocumentOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `original_filename` | string | oui | — | — |
| `mime_type` | string | oui | — | — |
| `size_bytes` | integer | oui | — | — |
| `status` | string (énumération DocumentStatus) | oui | valeurs : `uploaded`, `processing`, `ready`, `archived`, `quarantined`, `failed_unreadable`, `awaiting_ai_consent`, `deleted` | — |
| `version` | integer | oui | — | — |
| `current_version` | integer | oui | — | — |
| `is_sensitive` | boolean | oui | — | — |
| `ai_allowed` | boolean | oui | — | — |
| `document_type` | string (ou null) | oui | — | — |
| `category_id` | string (uuid) (ou null) | oui | — | — |
| `household_id` | string (uuid) (ou null) | oui | — | — |
| `source_item_id` | string (uuid) (ou null) | oui | — | — |
| `expiry_date` | string (date) (ou null) | oui | — | — |
| `retention_until` | string (date-time) (ou null) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `tags` | liste de string | non | défaut `[]` | — |
| `summary` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous ne pouvez pas modifier ce document » | non |
| `404` | Introuvable ou inaccessible | « Document introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Conflit avec l'état actuel »; « Traitement en cours : réessayez lorsqu'il sera terminé » | non |
| `422` | Données invalides | données ou paramètres invalides | non |
| `423` | Verrouillé (quarantaine) | « Ce document est en quarantaine : son accès est bloqué » | non |
| `429` | Trop de requêtes | limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-023 — Date d'expiration d'un document

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Consultation et gestion |
| Méthode | `PUT` |
| Chemin | `/api/v1/documents/{document_id}/expiry` |
| Fonction | `set_expiry` — [app/modules/documents/router.py:305](../../app/modules/documents/router.py#L305) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 7 test(s) (test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Date d'expiration d'un document.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `assign_tasks` (propriétaire, membre) ; `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `ExpiryIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `expiry_date` | string (date) (ou null) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : assignee_id : ["Cette personne n'est pas membre du foyer"]
- Contrôle dans le code (422) : assignee_id : ['Seule une tâche partagée avec un foyer peut être attribuée']
- Contrôle dans le code (422) : due_date : ["Une heure d'échéance nécessite une date"]
- Contrôle dans le code (422) : due_date : ['Un report nécessite une nouvelle date']
- Contrôle dans le code (422) : due_date : ['Une tâche récurrente nécessite une date de départ']
- Contrôle dans le code (422) : expiry_date : ["La date d'expiration doit être dans le futur"]
- Contrôle dans le code (422) : reason : ['Le motif de réouverture est obligatoire']
- Contrôle dans le code (422) : reason : ['Le motif du blocage est obligatoire']
- Contrôle dans le code (422) : recurrence_rule : ['Cette règle ne produit aucune date']
- Contrôle dans le code (422) : scope : ["Cette tâche n'appartient à aucune série récurrente"]
- Contrôle dans le code (422) : scope : ["Modifier la règle s'applique à toutes les occurrences à venir"]

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.set_expiry` ([app/modules/documents/service.py:658](../../app/modules/documents/service.py#L658)) : Date confirmee par l'utilisateur : la seule qui declenche des rappels (AC1)
  - Tache d'expiration : ses rappels sont des rappels de tache (60 et 30 jours avant)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Date d'expiration enregistrée ».
- `result` : objet app__modules__documents__router__DocumentOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `original_filename` | string | oui | — | — |
| `mime_type` | string | oui | — | — |
| `size_bytes` | integer | oui | — | — |
| `status` | string (énumération DocumentStatus) | oui | valeurs : `uploaded`, `processing`, `ready`, `archived`, `quarantined`, `failed_unreadable`, `awaiting_ai_consent`, `deleted` | — |
| `version` | integer | oui | — | — |
| `current_version` | integer | oui | — | — |
| `is_sensitive` | boolean | oui | — | — |
| `ai_allowed` | boolean | oui | — | — |
| `document_type` | string (ou null) | oui | — | — |
| `category_id` | string (uuid) (ou null) | oui | — | — |
| `household_id` | string (uuid) (ou null) | oui | — | — |
| `source_item_id` | string (uuid) (ou null) | oui | — | — |
| `expiry_date` | string (date) (ou null) | oui | — | — |
| `retention_until` | string (date-time) (ou null) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `tags` | liste de string | non | défaut `[]` | — |
| `summary` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Seul le créateur de la tâche peut modifier son partage »; « Seul le créateur peut supprimer cette tâche »; « Vous ne pouvez pas modifier ce document »; « Vous ne pouvez pas modifier cette tâche » | non |
| `404` | Introuvable ou inaccessible | « Catégorie introuvable »; « Document introuvable » | non |
| `409` | Conflit avec l'état actuel | « Cette tâche a été modifiée entre-temps : rechargez-la avant de l'enregistrer »; « Cette tâche est archivée : désarchivez-la pour la modifier »; « Cette tâche est déjà annulée »; « Le partage d'une tâche ne peut pas être modifié : créez la tâche dans l'espace voulu »; « Transition impossible : {task.status.value} vers {target.value} » | non |
| `422` | Données invalides | « assignee_id : ["Cette personne n'est pas membre du foyer"] »; « assignee_id : ['Seule une tâche partagée avec un foyer peut être attribuée'] »; données ou paramètres invalides; « due_date : ["Une heure d'échéance nécessite une date"] »; « due_date : ['Un report nécessite une nouvelle date'] »; « due_date : ['Une tâche récurrente nécessite une date de départ'] »; « expiry_date : ["La date d'expiration doit être dans le futur"] »; « reason : ['Le motif de réouverture est obligatoire'] » ; … | oui (3) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Catégories et étiquettes

### API-DOC-006 — Liste des catégories de documents

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Catégories et étiquettes |
| Méthode | `GET` |
| Chemin | `/api/v1/document-categories` |
| Fonction | `list_categories` — [app/modules/documents/router.py:198](../../app/modules/documents/router.py#L198) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_api_sans_test_auparavant) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Categories et etiquettes

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet app__modules__documents__router__CategoryOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `name` | string | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-007 — Création d'une catégorie de documents

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Catégories et étiquettes |
| Méthode | `POST` |
| Chemin | `/api/v1/document-categories` |
| Fonction | `create_category` — [app/modules/documents/router.py:203](../../app/modules/documents/router.py#L203) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 9 test(s) (test_api_sans_test_auparavant, test_lot3_documents, test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Création d'une catégorie de documents.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `CategoryIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `name` | string | oui | longueur min. 1 ; longueur max. 80 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **201**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Catégorie créée ».
- `result` : objet app__modules__documents__router__CategoryOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `name` | string | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `201` | Créé | succès | oui (10) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `409` | Conflit avec l'état actuel | « Cette catégorie existe déjà » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-008 — Renommage d'une catégorie de documents

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Catégories et étiquettes |
| Méthode | `PATCH` |
| Chemin | `/api/v1/document-categories/{category_id}` |
| Fonction | `rename_category` — [app/modules/documents/router.py:208](../../app/modules/documents/router.py#L208) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_lot3_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Renommage d'une catégorie de documents.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `category_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `CategoryIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `name` | string | oui | longueur min. 1 ; longueur max. 80 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : name : ['Le nom de la catégorie est obligatoire']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Renommage : les documents gardent leur categorie (ecart E-33)
- Fonction `documents.service.rename_category` ([app/modules/documents/service.py:879](../../app/modules/documents/service.py#L879))
  - Meme nom qu'une autre categorie de documents de l'utilisateur (uq_categories_user_kind_name)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Catégorie renommée ».
- `result` : objet app__modules__documents__router__CategoryOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `name` | string | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Catégorie introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Cette catégorie existe déjà » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « name : ['Le nom de la catégorie est obligatoire'] » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-009 — Suppression d'une catégorie de documents

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Catégories et étiquettes |
| Méthode | `DELETE` |
| Chemin | `/api/v1/document-categories/{category_id}` |
| Fonction | `delete_category` — [app/modules/documents/router.py:214](../../app/modules/documents/router.py#L214) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Suppression d'une catégorie de documents.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `category_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.delete_category` ([app/modules/documents/service.py:447](../../app/modules/documents/service.py#L447))
  - Les documents redeviennent « Non classé » : aucun n'est supprime (AC2)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Catégorie supprimée ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Catégorie introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-010 — Liste des étiquettes de documents

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Catégories et étiquettes |
| Méthode | `GET` |
| Chemin | `/api/v1/document-tags` |
| Fonction | `list_tags` — [app/modules/documents/router.py:220](../../app/modules/documents/router.py#L220) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Liste des étiquettes de documents.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de string (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Fichiers (URL signées)

### API-DOC-011 — Lecture d'un fichier par URL signée

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Fichiers (URL signées) |
| Méthode | `GET` |
| Chemin | `/api/v1/documents/files/{version_id}` |
| Fonction | `signed_file` — [app/modules/documents/router.py:226](../../app/modules/documents/router.py#L226) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 7 test(s) (test_lot3_documents, test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`, `src/modules/life_inbox/api.js`) |

**Description** (commentaire et docstring du code). Fichier lu par URL signee : previsualisation ou telechargement

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle propre à cette route : URL signée (`purpose`, `expires`, `signature`) renvoyée par la création d'un lien ; aucun jeton d'accès.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `version_id` | chemin | string (uuid) | oui | — | — |
| `purpose` | requête | string | oui | valeurs : `preview`, `download` | — |
| `expires` | requête | integer | oui | — | — |
| `signature` | requête | string | oui | longueur max. 128 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Un fichier ouvert dans le navigateur ne peut executer aucun script
- Fonction `documents.service.read_signed_file` ([app/modules/documents/service.py:339](../../app/modules/documents/service.py#L339))
  - Lien signe sans session : lecture par le role du worker
  - Retrait immediat des liens a la suppression

**Réponse en cas de succès.**

- Réponse directe hors enveloppe possible (Response) : fichier, flux, redirection ou réponse sans contenu selon le cas (voir le code).
- Code HTTP **200**.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `403` | Accès refusé | « Lien invalide » | oui (1) |
| `404` | Introuvable ou inaccessible | « Document introuvable » | oui (1) |
| `410` | Expiré ou n'existe plus | « Ce lien a expiré » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `423` | Verrouillé (quarantaine) | « Ce document est en quarantaine : son accès est bloqué » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Corbeille

### API-DOC-012 — Corbeille des documents

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Corbeille |
| Méthode | `GET` |
| Chemin | `/api/v1/documents/trash` |
| Fonction | `trash` — [app/modules/documents/router.py:237](../../app/modules/documents/router.py#L237) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_lot3_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Corbeille : documents supprimes encore restaurables pendant 30 jours (declaree avant /documents/{document_id})

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.trash` ([app/modules/documents/service.py:741](../../app/modules/documents/service.py#L741)) : Documents supprimes par l'utilisateur depuis moins de 30 jours (fichiers non encore purges), les plus recents d'abord
  - Memes exclusions que la bibliotheque : envois non termines, documents purges, audio des notes vocales, texte de l'inbox

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet TrashOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `original_filename` | string | oui | — | — |
| `mime_type` | string | oui | — | — |
| `size_bytes` | integer | oui | — | — |
| `status` | string (énumération DocumentStatus) | oui | valeurs : `uploaded`, `processing`, `ready`, `archived`, `quarantined`, `failed_unreadable`, `awaiting_ai_consent`, `deleted` | — |
| `version` | integer | oui | — | — |
| `current_version` | integer | oui | — | — |
| `is_sensitive` | boolean | oui | — | — |
| `ai_allowed` | boolean | oui | — | — |
| `document_type` | string (ou null) | oui | — | — |
| `category_id` | string (uuid) (ou null) | oui | — | — |
| `household_id` | string (uuid) (ou null) | oui | — | — |
| `source_item_id` | string (uuid) (ou null) | oui | — | — |
| `expiry_date` | string (date) (ou null) | oui | — | — |
| `retention_until` | string (date-time) (ou null) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `tags` | liste de string | non | défaut `[]` | — |
| `summary` | string (ou null) | non | — | — |
| `deleted_at` | string (date-time) | oui | — | — |
| `restorable_until` | string (date-time) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (4) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-017 — Restauration d'un document supprimé

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Corbeille |
| Méthode | `POST` |
| Chemin | `/api/v1/documents/{document_id}/restore` |
| Fonction | `restore` — [app/modules/documents/router.py:273](../../app/modules/documents/router.py#L273) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 5 test(s) (test_lot3_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Restauration d'un document de la corbeille

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `manage_members` (propriétaire seulement). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Limitation de débit : 60 requêtes POST par minute et par adresse IP (préfixe `/api/v1/documents`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.restore_document` ([app/modules/documents/service.py:751](../../app/modules/documents/service.py#L751)) : Restauration d'un document supprime : il retrouve sa place, ses versions, son extraction et ses liens
  - Fichiers deja purges, ou delai de 30 jours depasse : restauration impossible (410)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Document restauré ».
- `result` : objet app__modules__documents__router__DocumentOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `original_filename` | string | oui | — | — |
| `mime_type` | string | oui | — | — |
| `size_bytes` | integer | oui | — | — |
| `status` | string (énumération DocumentStatus) | oui | valeurs : `uploaded`, `processing`, `ready`, `archived`, `quarantined`, `failed_unreadable`, `awaiting_ai_consent`, `deleted` | — |
| `version` | integer | oui | — | — |
| `current_version` | integer | oui | — | — |
| `is_sensitive` | boolean | oui | — | — |
| `ai_allowed` | boolean | oui | — | — |
| `document_type` | string (ou null) | oui | — | — |
| `category_id` | string (uuid) (ou null) | oui | — | — |
| `household_id` | string (uuid) (ou null) | oui | — | — |
| `source_item_id` | string (uuid) (ou null) | oui | — | — |
| `expiry_date` | string (date) (ou null) | oui | — | — |
| `retention_until` | string (date-time) (ou null) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `tags` | liste de string | non | défaut `[]` | — |
| `summary` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Document introuvable dans la corbeille » | oui (2) |
| `410` | Expiré ou n'existe plus | « Le délai de restauration de 30 jours est dépassé » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `429` | Trop de requêtes | limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Traitement et analyse

### API-DOC-014 — Suivi du traitement d'un document

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Traitement et analyse |
| Méthode | `GET` |
| Chemin | `/api/v1/documents/{document_id}/processing` |
| Fonction | `processing` — [app/modules/documents/router.py:252](../../app/modules/documents/router.py#L252) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_lot3_documents, test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Suivi du traitement d'un document.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `documents.service._visible`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet ProcessingOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `status` | string | oui | — | — |
| `retry_count` | integer | oui | — | — |
| `next_retry_at` | string (date-time) (ou null) | oui | — | — |
| `error_code` | string (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (4) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Document introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-015 — Relance d'un traitement en échec

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Traitement et analyse |
| Méthode | `POST` |
| Chemin | `/api/v1/documents/{document_id}/reprocess` |
| Fonction | `reprocess` — [app/modules/documents/router.py:260](../../app/modules/documents/router.py#L260) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 7 test(s) (test_lot3_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Relance d'un traitement en echec : 202 (traitement en arriere-plan), 409 si un traitement est deja en cours

**État détaillé.**

- Dépendance non configurée (É-01) : Antivirus ClamAV (CLAMAV_HOST vide) : l'analyse est ignorée (SKIPPED), le fichier est traité sans antivirus.
- Dépendance non configurée (É-04) : OCR (fournisseur « google_cloud » désactivé) : un scan ou une photo reste illisible ; les PDF à texte sont lus.
- Dépendance non configurée (É-03) : Fournisseur d'IA (ANTHROPIC_API_KEY vide, fournisseur « anthropic » désactivé) : réponse 503 ou repli sur des règles.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Limitation de débit : 60 requêtes POST par minute et par adresse IP (préfixe `/api/v1/documents`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.reprocess` ([app/modules/documents/service.py:772](../../app/modules/documents/service.py#L772)) : Nouveau traitement de la version active, apres un echec ; le quota n'est pas decompte une seconde fois
  - Dernier traitement : il doit etre en echec (document illisible, ou extraction des champs refusee)
  - Limite anti-abus : traitements de ce document crees dans les dernieres 24 heures (le premier compris)
  - Nouveau suivi (le role applicatif ne modifie jamais un suivi existant) et document remis en traitement

**Réponse en cas de succès.**

- Code HTTP **202**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Traitement relancé ».
- `result` : objet ProcessingOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `status` | string | oui | — | — |
| `retry_count` | integer | oui | — | — |
| `next_retry_at` | string (date-time) (ou null) | oui | — | — |
| `error_code` | string (ou null) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `202` | Accepté, traité en arrière-plan | succès | oui (7) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous ne pouvez pas modifier ce document » | non |
| `404` | Introuvable ou inaccessible | « Document introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Aucun traitement en échec à relancer pour ce document »; « Désarchivez ce document avant de relancer son traitement »; « Un traitement est déjà en cours pour ce document » | oui (3) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `423` | Verrouillé (quarantaine) | « Ce document est en quarantaine : son accès est bloqué » | non |
| `429` | Trop de requêtes | limite de débit atteinte; « {MAX_REPROCESS_PER_DAY} relances au plus par jour pour un document : réessayez demain » | oui (1) |
| `503` | Service indisponible ou non configuré | « Le service d'analyse n'est pas disponible pour le moment : réessayez plus tard ou saisissez les informations manuellement » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-016 — Résumé d'un document par l'IA

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Traitement et analyse |
| Méthode | `POST` |
| Chemin | `/api/v1/documents/{document_id}/summary` |
| Fonction | `summarize` — [app/modules/documents/router.py:267](../../app/modules/documents/router.py#L267) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 6 test(s) (test_lot8_preparation) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). E-50 : resume a la demande (service d'analyse ; compte comme une analyse dans le quota)

**État détaillé.**

- Dépendance non configurée (É-03) : Fournisseur d'IA (ANTHROPIC_API_KEY vide, fournisseur « anthropic » désactivé) : réponse 503 ou repli sur des règles.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Limitation de débit : 60 requêtes POST par minute et par adresse IP (préfixe `/api/v1/documents`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.summarize_document` ([app/modules/documents/service.py:694](../../app/modules/documents/service.py#L694)) : E-50 : resume a la demande de la version active (bouton « Resumer »), produit par le modele a partir du texte deja lu. Memes protections que l'analyse : document sensible seulement avec l'accord de l'utilisateur, consentement a l'IA, fournisseur active ; chaque resume compte comme une analyse dans le quota de la formule.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Résumé produit ».
- `result` : objet app__modules__documents__router__DocumentOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `original_filename` | string | oui | — | — |
| `mime_type` | string | oui | — | — |
| `size_bytes` | integer | oui | — | — |
| `status` | string (énumération DocumentStatus) | oui | valeurs : `uploaded`, `processing`, `ready`, `archived`, `quarantined`, `failed_unreadable`, `awaiting_ai_consent`, `deleted` | — |
| `version` | integer | oui | — | — |
| `current_version` | integer | oui | — | — |
| `is_sensitive` | boolean | oui | — | — |
| `ai_allowed` | boolean | oui | — | — |
| `document_type` | string (ou null) | oui | — | — |
| `category_id` | string (uuid) (ou null) | oui | — | — |
| `household_id` | string (uuid) (ou null) | oui | — | — |
| `source_item_id` | string (uuid) (ou null) | oui | — | — |
| `expiry_date` | string (date) (ou null) | oui | — | — |
| `retention_until` | string (date-time) (ou null) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `tags` | liste de string | non | défaut `[]` | — |
| `summary` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous ne pouvez pas modifier ce document » | non |
| `404` | Introuvable ou inaccessible | « Document introuvable »; « Version introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Aucun texte lisible : ce document ne peut pas être résumé »; « Document sensible : autorisez d'abord son analyse »; « Le document doit être lu avant d'être résumé » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `423` | Verrouillé (quarantaine) | « Ce document est en quarantaine : son accès est bloqué » | non |
| `429` | Trop de requêtes | « Quota mensuel d'analyses de documents atteint pour votre formule »; limite de débit atteinte | non |
| `503` | Service indisponible ou non configuré | « Le résumé n'a pas pu être produit : réessayez plus tard »; « Le service d'analyse n'est pas disponible pour le moment » | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-022 — Autorisation de l'analyse par l'IA pour un document

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Traitement et analyse |
| Méthode | `POST` |
| Chemin | `/api/v1/documents/{document_id}/ai-consent` |
| Fonction | `ai_consent` — [app/modules/documents/router.py:300](../../app/modules/documents/router.py#L300) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Autorisation de l'analyse par l'IA pour un document.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `documents.service._visible`.
- Limitation de débit : 60 requêtes POST par minute et par adresse IP (préfixe `/api/v1/documents`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `app__modules__documents__router__ConsentIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `allowed` | boolean | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.set_ai_consent` ([app/modules/documents/service.py:633](../../app/modules/documents/service.py#L633))
  - Traitement en attente de ce choix : repris
  - Suivi du traitement modifie par le role du worker (aucune politique UPDATE pour le role applicatif)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Choix enregistré ».
- `result` : objet app__modules__documents__router__DocumentOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `original_filename` | string | oui | — | — |
| `mime_type` | string | oui | — | — |
| `size_bytes` | integer | oui | — | — |
| `status` | string (énumération DocumentStatus) | oui | valeurs : `uploaded`, `processing`, `ready`, `archived`, `quarantined`, `failed_unreadable`, `awaiting_ai_consent`, `deleted` | — |
| `version` | integer | oui | — | — |
| `current_version` | integer | oui | — | — |
| `is_sensitive` | boolean | oui | — | — |
| `ai_allowed` | boolean | oui | — | — |
| `document_type` | string (ou null) | oui | — | — |
| `category_id` | string (uuid) (ou null) | oui | — | — |
| `household_id` | string (uuid) (ou null) | oui | — | — |
| `source_item_id` | string (uuid) (ou null) | oui | — | — |
| `expiry_date` | string (date) (ou null) | oui | — | — |
| `retention_until` | string (date-time) (ou null) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `tags` | liste de string | non | défaut `[]` | — |
| `summary` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Seul le propriétaire peut autoriser cette analyse » | non |
| `404` | Introuvable ou inaccessible | « Document introuvable » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `429` | Trop de requêtes | limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Versions

### API-DOC-024 — Liste des versions d'un document

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Versions |
| Méthode | `GET` |
| Chemin | `/api/v1/documents/{document_id}/versions` |
| Fonction | `versions` — [app/modules/documents/router.py:311](../../app/modules/documents/router.py#L311) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_lot3_documents, test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Versions

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `documents.service._visible`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet VersionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `version_number` | integer | oui | — | — |
| `file_name` | string | oui | — | — |
| `mime_type` | string | oui | — | — |
| `size_bytes` | integer | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Document introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-025 — Restauration d'une ancienne version

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Versions |
| Méthode | `POST` |
| Chemin | `/api/v1/documents/{document_id}/versions/{number}/restore` |
| Fonction | `restore_version` — [app/modules/documents/router.py:318](../../app/modules/documents/router.py#L318) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 9 test(s) (test_lot3_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Restauration d'une ancienne version : recopiee en une nouvelle version active (l'historique est conserve)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.
- Contrôles d'accès et de propriété appelés dans le code : `documents.service._require_version_room`.
- Limitation de débit : 60 requêtes POST par minute et par adresse IP (préfixe `/api/v1/documents`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |
| `number` | chemin | integer | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.restore_version` ([app/modules/documents/service.py:809](../../app/modules/documents/service.py#L809)) : L'ancienne version est recopiee en une NOUVELLE version, qui devient active : l'historique reste complet et aucune version n'est effacee. (Rendre simplement active l'ancienne version laisserait les versions plus recentes au-dessus de la version active : la purge des envois abandonnes les effacerait.) Le fichier etant identique, son analyse est recopiee : aucun nouvel appel au service d'analyse, aucun quota.
  - Envoi d'une nouvelle version en cours : son numero est deja reserve
  - Fichier de l'ancienne version, controle par son empreinte
  - Nouvelle analyse antivirus (les signatures evoluent) ; indisponible : rien n'est modifie
  - Une seule version active (uq_document_versions_active) : l'actuelle est desactivee d'abord
  - Analyse de l'ancienne version recopiee pour la nouvelle (sauf les metadonnees, communes au document)
  - Ancienne version jamais lue : illisible, sa lecture pourra etre relancee
  - Aucune trace partielle : la copie du fichier est retiree

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Version restaurée : elle devient la version active ».
- `result` : objet app__modules__documents__router__DocumentOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `title` | string (ou null) | oui | — | — |
| `original_filename` | string | oui | — | — |
| `mime_type` | string | oui | — | — |
| `size_bytes` | integer | oui | — | — |
| `status` | string (énumération DocumentStatus) | oui | valeurs : `uploaded`, `processing`, `ready`, `archived`, `quarantined`, `failed_unreadable`, `awaiting_ai_consent`, `deleted` | — |
| `version` | integer | oui | — | — |
| `current_version` | integer | oui | — | — |
| `is_sensitive` | boolean | oui | — | — |
| `ai_allowed` | boolean | oui | — | — |
| `document_type` | string (ou null) | oui | — | — |
| `category_id` | string (uuid) (ou null) | oui | — | — |
| `household_id` | string (uuid) (ou null) | oui | — | — |
| `source_item_id` | string (uuid) (ou null) | oui | — | — |
| `expiry_date` | string (date) (ou null) | oui | — | — |
| `retention_until` | string (date-time) (ou null) | oui | — | — |
| `archived_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `tags` | liste de string | non | défaut `[]` | — |
| `summary` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous ne pouvez pas modifier ce document » | non |
| `404` | Introuvable ou inaccessible | « Document introuvable »; « Version introuvable » | oui (2) |
| `409` | Conflit avec l'état actuel | « Cette version est déjà la version active »; « Le fichier de cette version est altéré : restauration impossible »; « Limite de 10 versions atteinte : supprimez une ancienne version »; « Traitement en cours : réessayez lorsqu'il sera terminé »; « Un envoi de nouvelle version est en cours : réessayez dans quelques minutes » | oui (4) |
| `410` | Expiré ou n'existe plus | « Le fichier de cette version n'est plus disponible » | non |
| `422` | Données invalides | données ou paramètres invalides | non |
| `423` | Verrouillé (quarantaine) | « Ce document est en quarantaine : son accès est bloqué » | non |
| `429` | Trop de requêtes | limite de débit atteinte | non |
| `503` | Service indisponible ou non configuré | « Analyse antivirus momentanément indisponible, réessayez » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-DOC-026 — Suppression d'une version non active

| Élément | Valeur |
|---|---|
| Module | Documents et intelligence documentaire (`app/modules/documents`, spéc. M5) |
| Sous-module | Versions |
| Méthode | `DELETE` |
| Chemin | `/api/v1/documents/{document_id}/versions/{number}` |
| Fonction | `delete_version` — [app/modules/documents/router.py:323](../../app/modules/documents/router.py#L323) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_5_documents) |
| Utilisée par l'interface web | oui (`src/modules/documents/api.js`) |

**Description** (commentaire et docstring du code). Suppression d'une version non active.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Quand la donnée relève d'un foyer, permission de foyer vérifiée dans le code (`households.service.require_permission` et fonctions voisines, route et fonctions appelées) : `edit_tasks` (propriétaire, membre) ; `view_tasks` (propriétaire, membre, lecteur). Non-membre : 404 « Foyer introuvable » ; membre sans la permission : 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `document_id` | chemin | string (uuid) | oui | — | — |
| `number` | chemin | integer | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `documents.service.delete_version` ([app/modules/documents/service.py:616](../../app/modules/documents/service.py#L616))
  - Seule une ancienne version peut etre supprimee (AC2)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Version supprimée ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Vous ne pouvez pas modifier ce document » | non |
| `404` | Introuvable ou inaccessible | « Document introuvable »; « Version introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « La version active ne peut pas être supprimée » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
