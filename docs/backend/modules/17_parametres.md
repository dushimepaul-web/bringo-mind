<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Paramètres et personnalisation

Dossier du code : [app/modules/settings/](../../app/modules/settings/) · lettre ou numéro de la spécification : **M11** · priorité **1** · documentation générée le 19/11/2026 17:30.

**4 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 4 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 0 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Préférences**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-PAR-001](#api-par-001--paramètres-personnels) | GET | `/api/v1/settings` | Paramètres personnels | Terminée et opérationnelle | oui |
| [API-PAR-002](#api-par-002--modification-des-paramètres-personnels) | PATCH | `/api/v1/settings` | Modification des paramètres personnels | Terminée et opérationnelle | oui |

**Première utilisation**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-PAR-003](#api-par-003--état-du-parcours-de-première-utilisation) | GET | `/api/v1/settings/onboarding` | État du parcours de première utilisation | Terminée et opérationnelle | oui |
| [API-PAR-004](#api-par-004--fin-du-parcours-de-première-utilisation) | POST | `/api/v1/settings/onboarding/complete` | Fin du parcours de première utilisation | Terminée et opérationnelle | oui |

## Sous-module : Préférences

### API-PAR-001 — Paramètres personnels

| Élément | Valeur |
|---|---|
| Module | Paramètres et personnalisation (`app/modules/settings`, spéc. M11) |
| Sous-module | Préférences |
| Méthode | `GET` |
| Chemin | `/api/v1/settings` |
| Fonction | `get_settings_` — [app/modules/settings/router.py:74](../../app/modules/settings/router.py#L74) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 6 test(s) (test_module_11_settings) |
| Utilisée par l'interface web | oui (`src/modules/settings/api.js`, `src/shared/layout/AppShell.jsx`) |

**Description** (commentaire et docstring du code). Paramètres personnels.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Parametres de l'utilisateur, valeurs effectives et choix possibles
- Fonction `settings.service.view` ([app/modules/settings/service.py:87](../../app/modules/settings/service.py#L87)) : Parametres complets, valeurs effectives et choix possibles (pour l'ecran)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet SettingsOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `version` | integer | oui | — | — |
| `locale` | string | oui | — | — |
| `timezone` | string | oui | — | — |
| `currency` | string | oui | — | — |
| `formats` | objet (clés libres) | oui | — | — |
| `effective_formats` | objet (clés libres) | oui | — | — |
| `assistant` | objet (clés libres) | oui | — | — |
| `accessibility` | objet (clés libres) | oui | — | — |
| `choices` | objet (clés libres) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PAR-002 — Modification des paramètres personnels

| Élément | Valeur |
|---|---|
| Module | Paramètres et personnalisation (`app/modules/settings`, spéc. M11) |
| Sous-module | Préférences |
| Méthode | `PATCH` |
| Chemin | `/api/v1/settings` |
| Fonction | `update_settings` — [app/modules/settings/router.py:80](../../app/modules/settings/router.py#L80) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 10 test(s) (test_i18n_extensible, test_module_11_settings) |
| Utilisée par l'interface web | oui (`src/modules/settings/api.js`) |

**Description** (commentaire et docstring du code). Modification des paramètres personnels.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `core.i18n.ensure_offered`, `settings.service._check`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `SettingsIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `version` | integer (ou null) | non | — | — |
| `locale` | string (ou null) | non | — | — |
| `timezone` | string (ou null) | non | — | — |
| `currency` | string (ou null) | non | longueur min. 3 ; longueur max. 3 ; motif `^[A-Za-z]{3}$` | — |
| `formats` | objet FormatsIn (ou null) | non | — | — |
| `formats.date_format` | string (ou null) | non | — | — |
| `formats.time_format` | string (ou null) | non | — | — |
| `formats.decimal_separator` | string (ou null) | non | — | — |
| `formats.first_day_of_week` | string (ou null) | non | — | — |
| `assistant` | objet AssistantIn (ou null) | non | — | — |
| `assistant.tone` | string (ou null) | non | — | — |
| `assistant.response_language` | string (ou null) | non | — | — |
| `assistant.confirmation` | objet (clés libres -> string) (ou null) | non | — | — |
| `accessibility` | objet AccessibilityIn (ou null) | non | — | — |
| `accessibility.text_size` | string (ou null) | non | — | — |
| `accessibility.high_contrast` | boolean (ou null) | non | — | — |
| `accessibility.reduced_motion` | string (ou null) | non | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `SettingsIn.check_tz` (champ(s) timezone) ([app/modules/settings/router.py:49](../../app/modules/settings/router.py#L49)) : normalisation de la valeur, sans refus explicite
- Validateur `SettingsIn.check_locale` (champ(s) locale) ([app/modules/settings/router.py:54](../../app/modules/settings/router.py#L54)) : refus (422) : « langue non prise en charge ({', '.join(i18n.installed())}) »
- Contrôle dans le code (422) : locale : ['Langue non proposée sur la plateforme']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Modification partielle ; la reponse sert a appliquer immediatement les changements (sans reconnexion)
- Fonction `settings.service.update` ([app/modules/settings/service.py:105](../../app/modules/settings/service.py#L105)) : Modification partielle avec verrou optimiste (version) ; chaque changement est trace
  - Categories 4 et 5 : aucune preference ne peut supprimer la confirmation
  - Langue, fuseau et devise : colonnes du compte et du profil
  - Langue : seulement une langue proposee par l'administrateur
  - user_profiles.preferences porte aussi d'autres reglages (alias, devise, tableau de bord, MFA...) : fusion, jamais remplacement
  - Nouvelle version : une autre fenetre encore ouverte sur l'ancienne recevra un conflit (409)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Paramètres enregistrés ».
- `result` : objet SettingsOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `version` | integer | oui | — | — |
| `locale` | string | oui | — | — |
| `timezone` | string | oui | — | — |
| `currency` | string | oui | — | — |
| `formats` | objet (clés libres) | oui | — | — |
| `effective_formats` | objet (clés libres) | oui | — | — |
| `assistant` | objet (clés libres) | oui | — | — |
| `accessibility` | objet (clés libres) | oui | — | — |
| `choices` | objet (clés libres) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `409` | Conflit avec l'état actuel | « Vos paramètres ont été modifiés entre-temps : rechargez la page » | oui (1) |
| `422` | Données invalides | « Problème de validation des données »; données ou paramètres invalides; « locale : ['Langue non proposée sur la plateforme'] » | oui (12) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Première utilisation

### API-PAR-003 — État du parcours de première utilisation

| Élément | Valeur |
|---|---|
| Module | Paramètres et personnalisation (`app/modules/settings`, spéc. M11) |
| Sous-module | Première utilisation |
| Méthode | `GET` |
| Chemin | `/api/v1/settings/onboarding` |
| Fonction | `onboarding` — [app/modules/settings/router.py:94](../../app/modules/settings/router.py#L94) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_lot5_foyer_et_compte) |
| Utilisée par l'interface web | oui (`src/modules/planning/components/OnboardingDialog.jsx`) |

**Description** (commentaire et docstring du code). État du parcours de première utilisation.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `settings.service.onboarding_state` ([app/modules/settings/service.py:182](../../app/modules/settings/service.py#L182)) : Assistant propose a un compte neuf : ni termine ni passe, aucune tache et aucun foyer. Les comptes deja utilises (taches ou foyer existants) ne le voient jamais.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet OnboardingOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `pending` | boolean | oui | — | — |
| `completed_at` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-PAR-004 — Fin du parcours de première utilisation

| Élément | Valeur |
|---|---|
| Module | Paramètres et personnalisation (`app/modules/settings`, spéc. M11) |
| Sous-module | Première utilisation |
| Méthode | `POST` |
| Chemin | `/api/v1/settings/onboarding/complete` |
| Fonction | `complete_onboarding` — [app/modules/settings/router.py:99](../../app/modules/settings/router.py#L99) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_lot5_foyer_et_compte) |
| Utilisée par l'interface web | oui (`src/modules/planning/components/OnboardingDialog.jsx`) |

**Description** (commentaire et docstring du code). Fin du parcours de première utilisation.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Assistant termine ou passe : il ne sera plus propose

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Bienvenue sur BringoMind ».
- `result` : objet OnboardingOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `pending` | boolean | oui | — | — |
| `completed_at` | string (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
