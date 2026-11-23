<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Comptes et abonnements

Dossier du code : [app/modules/accounts/](../../app/modules/accounts/) · lettre ou numéro de la spécification : **I** · priorité **1** · documentation générée le 19/11/2026 17:30.

**42 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 29 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 13 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Authentification**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-ACC-001](#api-acc-001--inscription) | POST | `/api/v1/auth/register` | Inscription | Terminée, en attente de configuration | oui |
| [API-ACC-002](#api-acc-002--renvoi-du-lien-de-vérification-sans-connexion) | POST | `/api/v1/auth/resend-verification` | Renvoi du lien de vérification (sans connexion) | Terminée, en attente de configuration | oui |
| [API-ACC-003](#api-acc-003--connexion) | POST | `/api/v1/auth/login` | Connexion | Terminée et opérationnelle | oui |
| [API-ACC-004](#api-acc-004--renouvellement-du-jeton-daccès) | POST | `/api/v1/auth/refresh` | Renouvellement du jeton d'accès | Terminée et opérationnelle | oui |
| [API-ACC-005](#api-acc-005--déconnexion) | POST | `/api/v1/auth/logout` | Déconnexion | Terminée et opérationnelle | oui |
| [API-ACC-006](#api-acc-006--confirmation-du-changement-dadresse-e-mail) | POST | `/api/v1/auth/confirm-email-change` | Confirmation du changement d'adresse e-mail | Terminée et opérationnelle | oui |
| [API-ACC-007](#api-acc-007--paramètres-publics-de-linterface) | GET | `/api/v1/auth/public-config` | Paramètres publics de l'interface | Terminée et opérationnelle | oui |
| [API-ACC-008](#api-acc-008--vérification-de-ladresse-e-mail) | POST | `/api/v1/auth/verify-email` | Vérification de l'adresse e-mail | Terminée et opérationnelle | oui |
| [API-ACC-009](#api-acc-009--mot-de-passe-oublié) | POST | `/api/v1/auth/forgot-password` | Mot de passe oublié | Terminée, en attente de configuration | oui |
| [API-ACC-010](#api-acc-010--réinitialisation-du-mot-de-passe) | POST | `/api/v1/auth/reset-password` | Réinitialisation du mot de passe | Terminée et opérationnelle | oui |

**Profil et compte**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-ACC-011](#api-acc-011--profil-de-lutilisateur-connecté) | GET | `/api/v1/accounts/me` | Profil de l'utilisateur connecté | Terminée et opérationnelle | oui |
| [API-ACC-012](#api-acc-012--modification-du-profil) | PATCH | `/api/v1/accounts/me` | Modification du profil | Terminée et opérationnelle | oui |
| [API-ACC-013](#api-acc-013--demande-de-changement-dadresse-e-mail) | POST | `/api/v1/accounts/me/email` | Demande de changement d'adresse e-mail | Terminée, en attente de configuration | oui |
| [API-ACC-014](#api-acc-014--changement-du-mot-de-passe) | POST | `/api/v1/accounts/me/password` | Changement du mot de passe | Terminée et opérationnelle | oui |
| [API-ACC-023](#api-acc-023--renvoi-du-lien-de-vérification-connecté) | POST | `/api/v1/accounts/me/verification` | Renvoi du lien de vérification (connecté) | Terminée, en attente de configuration | oui |
| [API-ACC-024](#api-acc-024--export-immédiat-des-données-du-compte-json) | GET | `/api/v1/accounts/me/export` | Export immédiat des données du compte (JSON) | Terminée et opérationnelle | oui |
| [API-ACC-025](#api-acc-025--demande-de-suppression-du-compte-confirmée-par-mot-de-passe-délai-de-7-jours) | POST | `/api/v1/accounts/me/delete` | Demande de suppression du compte (confirmée par mot de passe, délai de 7 jours) | Terminée et opérationnelle | oui |

**Sessions et appareils**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-ACC-015](#api-acc-015--liste-des-sessions-et-appareils) | GET | `/api/v1/accounts/me/sessions` | Liste des sessions et appareils | Terminée et opérationnelle | oui |
| [API-ACC-016](#api-acc-016--révocation-de-toutes-les-autres-sessions) | DELETE | `/api/v1/accounts/me/sessions` | Révocation de toutes les autres sessions | Terminée et opérationnelle | oui |
| [API-ACC-017](#api-acc-017--révocation-dune-session) | DELETE | `/api/v1/accounts/me/sessions/{session_id}` | Révocation d'une session | Terminée et opérationnelle | oui |

**Double authentification (MFA)**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-ACC-018](#api-acc-018--préparation-de-la-double-authentification) | POST | `/api/v1/accounts/me/mfa/setup` | Préparation de la double authentification | Terminée et opérationnelle | oui |
| [API-ACC-019](#api-acc-019--activation-de-la-double-authentification) | POST | `/api/v1/accounts/me/mfa/enable` | Activation de la double authentification | Terminée et opérationnelle | oui |
| [API-ACC-020](#api-acc-020--état-de-la-double-authentification) | GET | `/api/v1/accounts/me/mfa` | État de la double authentification | Terminée et opérationnelle | oui |
| [API-ACC-021](#api-acc-021--régénération-des-codes-de-secours) | POST | `/api/v1/accounts/me/mfa/recovery-codes` | Régénération des codes de secours | Terminée et opérationnelle | oui |
| [API-ACC-022](#api-acc-022--désactivation-de-la-double-authentification) | POST | `/api/v1/accounts/me/mfa/disable` | Désactivation de la double authentification | Terminée et opérationnelle | oui |

**Abonnements et facturation**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-ACC-026](#api-acc-026--liste-des-formules) | GET | `/api/v1/subscriptions/plans` | Liste des formules | Terminée et opérationnelle | oui |
| [API-ACC-027](#api-acc-027--abonnement-en-cours) | GET | `/api/v1/subscriptions/me` | Abonnement en cours | Terminée et opérationnelle | oui |
| [API-ACC-028](#api-acc-028--consommation-des-quotas) | GET | `/api/v1/subscriptions/me/usage` | Consommation des quotas | Terminée et opérationnelle | oui |
| [API-ACC-029](#api-acc-029--souscription-session-de-paiement) | POST | `/api/v1/subscriptions/checkout` | Souscription (session de paiement) | Terminée, en attente de configuration | oui |
| [API-ACC-030](#api-acc-030--accès-au-portail-de-facturation) | POST | `/api/v1/subscriptions/portal` | Accès au portail de facturation | Terminée, en attente de configuration | oui |
| [API-ACC-031](#api-acc-031--liste-des-factures) | GET | `/api/v1/subscriptions/me/invoices` | Liste des factures | Terminée, en attente de configuration | oui |
| [API-ACC-032](#api-acc-032--changement-de-formule) | POST | `/api/v1/subscriptions/me/change` | Changement de formule | Terminée, en attente de configuration | oui |
| [API-ACC-033](#api-acc-033--résiliation-de-labonnement) | POST | `/api/v1/subscriptions/me/cancel` | Résiliation de l'abonnement | Terminée, en attente de configuration | oui |
| [API-ACC-034](#api-acc-034--reprise-dun-abonnement-résilié) | POST | `/api/v1/subscriptions/me/resume` | Reprise d'un abonnement résilié | Terminée, en attente de configuration | oui |
| [API-ACC-035](#api-acc-035--téléchargement-dune-facture) | GET | `/api/v1/subscriptions/me/invoices/{invoice_id}/download` | Téléchargement d'une facture | Terminée, en attente de configuration | oui |
| [API-ACC-036](#api-acc-036--webhook-du-prestataire-de-paiement-stripe) | POST | `/api/v1/subscriptions/webhooks/stripe` | Webhook du prestataire de paiement (Stripe) | Terminée, en attente de configuration | oui |

**Administration des comptes (support, métier)**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-ACC-037](#api-acc-037--liste-des-comptes-administration-support) | GET | `/api/v1/admin/users` | Liste des comptes (administration, support) | Terminée et opérationnelle | oui |
| [API-ACC-038](#api-acc-038--octroi-dun-accès-support-temporaire) | POST | `/api/v1/admin/users/{user_id}/support-access` | Octroi d'un accès support temporaire | Terminée et opérationnelle | oui |
| [API-ACC-039](#api-acc-039--retrait-de-laccès-support) | DELETE | `/api/v1/admin/users/{user_id}/support-access` | Retrait de l'accès support | Terminée et opérationnelle | oui |
| [API-ACC-040](#api-acc-040--action-sur-un-compte-suspendre-réactiver-renvoyer-la-vérification) | POST | `/api/v1/admin/users/{user_id}/{action}` | Action sur un compte (suspendre, réactiver, renvoyer la vérification) | Terminée et opérationnelle | oui |
| [API-ACC-041](#api-acc-041--vue-densemble-métier-formules-abonnements) | GET | `/api/v1/admin/business/overview` | Vue d'ensemble métier (formules, abonnements) | Terminée et opérationnelle | oui |
| [API-ACC-042](#api-acc-042--statistiques-de-la-plateforme) | GET | `/api/v1/admin/stats` | Statistiques de la plateforme | Terminée et opérationnelle | oui |

## Sous-module : Authentification

### API-ACC-001 — Inscription

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Authentification |
| Méthode | `POST` |
| Chemin | `/api/v1/auth/register` |
| Fonction | `register` — [app/modules/accounts/router.py:76](../../app/modules/accounts/router.py#L76) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 1074 test(s) (test_accounts, test_api_sans_test_auparavant, test_bd4_administrateur_foyer, test_calendrier_local, test_cas_limites, test_conservation_bd3_dec14, …) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Inscription (anti-robot obligatoire) : reponse 202 identique que l'adresse soit libre ou deja utilisee. Aucune session n'est ouverte : le compte reste en attente jusqu'a la verification de l'adresse.

**État détaillé.**

- Dépendance non configurée (É-02) : Relais d'e-mails (MAIL_HOST vide) : les e-mails sont seulement journalisés, aucun n'est envoyé.
- Remarque : Le compte est créé, mais le lien de vérification n'est pas envoyé : le compte ne peut pas être activé par l'utilisateur.

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle anti-robot (Cloudflare Turnstile) quand `TURNSTILE_SECRET_KEY` est renseignée (503 si le service de vérification ne répond pas).
- Contrôles d'accès et de propriété appelés dans le code : `core.i18n.ensure_offered`, `core.passwords.ensure_password_allowed`.
- Limitation de débit : 10 requêtes POST par minute et par adresse IP (préfixe `/api/v1/auth/register`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `RegisterIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `email` | string (email) | oui | — | — |
| `password` | string | oui | longueur min. 12 ; longueur max. 128 | — |
| `full_name` | string (ou null) | non | longueur max. 160 | — |
| `locale` | string | oui | — | — |
| `timezone` | string | oui | — | — |
| `accept_terms` | boolean | oui | — | — |
| `accept_privacy` | boolean | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `RegisterIn.clean_name` (champ(s) full_name) ([app/modules/accounts/schemas.py:42](../../app/modules/accounts/schemas.py#L42)) : Nom affiche : espaces retires, valeur vide consideree comme absente
- Validateur `RegisterIn.check_consent` (champ(s) accept_terms, accept_privacy) ([app/modules/accounts/schemas.py:48](../../app/modules/accounts/schemas.py#L48)) : Sans consentement, aucune creation de compte (AC2 d'AUTH-001) — refus (422) : « ce consentement est obligatoire »
- Validateur `RegisterIn._tz` (champ(s) timezone) ([app/modules/accounts/schemas.py:24](../../app/modules/accounts/schemas.py#L24)) : Validation commune : le fuseau horaire doit exister (ex. "Europe/Paris") — refus (422) : « fuseau horaire inconnu (ex. Africa/Bujumbura, America/New_York) »
- Validateur `RegisterIn.check_locale` (champ(s) locale) ([app/modules/accounts/schemas.py:59](../../app/modules/accounts/schemas.py#L59)) : Verification de la langue choisie — refus (422) : « langue non prise en charge ({', '.join(i18n.installed())}) »
- Contrôle dans le code (422) : locale : ['Langue non proposée sur la plateforme']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.service.register` ([app/modules/accounts/service.py:121](../../app/modules/accounts/service.py#L121)) : Inscription ; reponse identique que l'adresse soit libre ou non (AUTH-001 AC3)
  - Nouveau compte : identifiant choisi ici, puis toute la creation se fait au nom de ce compte
  - Langue : seulement une langue proposee par l'administrateur
  - Inscription simultanee sur la meme adresse : traitee comme une adresse existante

**Réponse en cas de succès.**

- Code HTTP **202**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `202` | Accepté, traité en arrière-plan | succès | oui (1274) |
| `422` | Données invalides | « Problème de validation des données »; données ou paramètres invalides; « locale : ['Langue non proposée sur la plateforme'] » | oui (18) |
| `429` | Trop de requêtes | limite de débit atteinte | non |
| `503` | Service indisponible ou non configuré | « Les inscriptions sont momentanément fermées » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-002 — Renvoi du lien de vérification (sans connexion)

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Authentification |
| Méthode | `POST` |
| Chemin | `/api/v1/auth/resend-verification` |
| Fonction | `resend_verification_public` — [app/modules/accounts/router.py:84](../../app/modules/accounts/router.py#L84) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 7 test(s) (test_integrations, test_module_1_auth) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Renvoi public du lien de verification (anti-robot obligatoire) : 60 s d'attente, 5 envois par heure

**État détaillé.**

- Dépendance non configurée (É-02) : Relais d'e-mails (MAIL_HOST vide) : les e-mails sont seulement journalisés, aucun n'est envoyé.

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle anti-robot (Cloudflare Turnstile) quand `TURNSTILE_SECRET_KEY` est renseignée (503 si le service de vérification ne répond pas).
- Limitation de débit : 5 requêtes POST par minute et par adresse IP (préfixe `/api/v1/auth/resend-verification`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `ResendVerificationIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `email` | string (email) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.service.resend_verification` ([app/modules/accounts/service.py:169](../../app/modules/accounts/service.py#L169)) : Renvoi public du lien : limites par adresse, qu'un compte existe ou non

**Réponse en cas de succès.**

- Code HTTP **202**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `202` | Accepté, traité en arrière-plan | succès | oui (11) |
| `422` | Données invalides | données ou paramètres invalides | oui (1) |
| `429` | Trop de requêtes | « Trop de requêtes »; limite de débit atteinte | oui (5) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-003 — Connexion

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Authentification |
| Méthode | `POST` |
| Chemin | `/api/v1/auth/login` |
| Fonction | `login` — [app/modules/accounts/router.py:92](../../app/modules/accounts/router.py#L92) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1053 test(s) (test_accounts, test_api_sans_test_auparavant, test_bd4_administrateur_foyer, test_calendrier_local, test_cas_limites, test_conservation_bd3_dec14, …) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Connexion : verification des identifiants (et du code MFA) puis ouverture de session

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôles d'accès et de propriété appelés dans le code : `core.security.verify_password_constant_time`.
- Limitation de débit : 20 requêtes POST par minute et par adresse IP (préfixe `/api/v1/auth/login`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `LoginIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `email` | string (email) | oui | — | — |
| `password` | string | oui | — | — |
| `mfa_code` | string (ou null) | non | — | — |
| `device_name` | string (ou null) | non | longueur max. 120 | — |
| `remember_me` | boolean | non | défaut `true` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.service.authenticate` ([app/modules/accounts/service.py:236](../../app/modules/accounts/service.py#L236))
  - Reservation d'un essai avant le calcul : des essais simultanes ne peuvent pas depasser la limite
  - Le calcul Argon2 a toujours lieu : la duree ne revele pas si le compte existe
  - Mot de passe correct : etape suivante, ce n'est pas un echec
  - Succes : compteurs remis a zero (enregistre avec la session, par open_session)
- Fonction `accounts.service.open_session` ([app/modules/accounts/service.py:315](../../app/modules/accounts/service.py#L315)) : Cree une session (nouvelle famille de jetons) ; renvoie (jeton d'acces, jeton de rafraichissement)
- Fonction `accounts.router._set_refresh_cookie` ([app/modules/accounts/router.py:42](../../app/modules/accounts/router.py#L42))
  - Depot du cookie de session. « Rester connecte » : cookie persistant pour la duree de vie de la session ; sinon cookie sans duree (efface a la fermeture du navigateur) accompagne du marqueur REMEMBER_COOKIE
- Fonction `accounts.router._token_result` ([app/modules/accounts/router.py:64](../../app/modules/accounts/router.py#L64))
  - Reponse de connexion : jeton d'acces, duree de validite en secondes, utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Connexion réussie ».
- `result` : objet TokenOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `access_token` | string | oui | — | — |
| `token_type` | string | non | défaut `"bearer"` | — |
| `expires_in` | integer | oui | — | — |
| `user` | objet UserOut | oui | — | — |
| `user.id` | string (uuid) | oui | — | — |
| `user.email` | string | oui | — | — |
| `user.full_name` | string | oui | — | — |
| `user.locale` | string | oui | — | — |
| `user.timezone` | string | oui | — | — |
| `user.currency` | string | oui | — | — |
| `user.role` | string | oui | — | — |
| `user.status` | string | oui | — | — |
| `user.is_admin` | boolean | oui | — | — |
| `user.email_verified_at` | string (date-time) (ou null) | oui | — | — |
| `user.mfa_enabled` | boolean | oui | — | — |
| `user.inbox_alias` | string (ou null) | non | — | — |
| `user.created_at` | string (date-time) | oui | — | — |
| `user.dashboard_preferences` | objet (clés libres) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1279) |
| `401` | Non authentifié ou session invalide | « Code de vérification incorrect »; « Code de vérification requis »; « Veuillez vous connecter » | oui (97) |
| `403` | Accès refusé | « Ce compte est désactivé »; « Confirmez votre adresse e-mail avant de vous connecter » | oui (11) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `423` | Verrouillé (quarantaine) | « Compte temporairement verrouillé après plusieurs échecs, réessayez plus tard » | oui (8) |
| `429` | Trop de requêtes | limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-004 — Renouvellement du jeton d'accès

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Authentification |
| Méthode | `POST` |
| Chemin | `/api/v1/auth/refresh` |
| Fonction | `refresh` — [app/modules/accounts/router.py:102](../../app/modules/accounts/router.py#L102) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 12 test(s) (test_accounts, test_module_1_auth, test_phase2_rester_connecte) |
| Utilisée par l'interface web | oui (`src/shared/api/fetchApi.js`) |

**Description** (commentaire et docstring du code). Renouvellement du jeton d'acces a partir du cookie (rotation du cookie)

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle propre à cette route : Jeton de renouvellement lu dans le cookie `httpOnly` (SameSite=Strict) posé à la connexion ; il est tourné à chaque usage, et sa réutilisation révoque la session.
- Contrôles d'accès et de propriété appelés dans le code : `accounts.router._remembered`, `accounts.service._token_owner`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.router._remembered` ([app/modules/accounts/router.py:53](../../app/modules/accounts/router.py#L53))
  - Choix fait a la connexion, relu a chaque rafraichissement (absence du marqueur : session persistante)
- Fonction `accounts.service.refresh_session` ([app/modules/accounts/service.py:341](../../app/modules/accounts/service.py#L341)) : Rotation : chaque usage cree une nouvelle session de la meme famille et revoque la precedente
  - Jeton d'une session deja remplacee : il a ete copie, toute la famille est revoquee
- Fonction `accounts.router._set_refresh_cookie` ([app/modules/accounts/router.py:42](../../app/modules/accounts/router.py#L42))
  - Depot du cookie de session. « Rester connecte » : cookie persistant pour la duree de vie de la session ; sinon cookie sans duree (efface a la fermeture du navigateur) accompagne du marqueur REMEMBER_COOKIE
- Fonction `accounts.router._token_result` ([app/modules/accounts/router.py:64](../../app/modules/accounts/router.py#L64))
  - Reponse de connexion : jeton d'acces, duree de validite en secondes, utilisateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet TokenOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `access_token` | string | oui | — | — |
| `token_type` | string | non | défaut `"bearer"` | — |
| `expires_in` | integer | oui | — | — |
| `user` | objet UserOut | oui | — | — |
| `user.id` | string (uuid) | oui | — | — |
| `user.email` | string | oui | — | — |
| `user.full_name` | string | oui | — | — |
| `user.locale` | string | oui | — | — |
| `user.timezone` | string | oui | — | — |
| `user.currency` | string | oui | — | — |
| `user.role` | string | oui | — | — |
| `user.status` | string | oui | — | — |
| `user.is_admin` | boolean | oui | — | — |
| `user.email_verified_at` | string (date-time) (ou null) | oui | — | — |
| `user.mfa_enabled` | boolean | oui | — | — |
| `user.inbox_alias` | string (ou null) | non | — | — |
| `user.created_at` | string (date-time) | oui | — | — |
| `user.dashboard_preferences` | objet (clés libres) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (8) |
| `401` | Non authentifié ou session invalide | « Session expirée, veuillez vous reconnecter »; « Veuillez vous connecter » | oui (8) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-005 — Déconnexion

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Authentification |
| Méthode | `POST` |
| Chemin | `/api/v1/auth/logout` |
| Fonction | `logout` — [app/modules/accounts/router.py:113](../../app/modules/accounts/router.py#L113) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 5 test(s) (test_accounts, test_module_1_auth, test_module_2_dashboard, test_phase2_rester_connecte) |
| Utilisée par l'interface web | oui (`src/shared/layout/AppShell.jsx`) |

**Description** (commentaire et docstring du code). Deconnexion : revocation de la session et suppression du cookie. La session est retrouvee par le cookie : la deconnexion fonctionne donc aussi quand le jeton d'acces (15 minutes) a deja expire.

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle propre à cette route : Le cookie de renouvellement et, s'il est présent, le jeton d'accès identifient la session à révoquer.
- Contrôles d'accès et de propriété appelés dans le code : `accounts.service._token_owner`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.router._clear_refresh_cookie` ([app/modules/accounts/router.py:58](../../app/modules/accounts/router.py#L58))
  - Suppression des cookies de session (memes attributs qu'au depot)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Déconnexion réussie ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (5) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-006 — Confirmation du changement d'adresse e-mail

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Authentification |
| Méthode | `POST` |
| Chemin | `/api/v1/auth/confirm-email-change` |
| Fonction | `confirm_email_change` — [app/modules/accounts/router.py:148](../../app/modules/accounts/router.py#L148) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_1_auth) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Confirmation du changement d'adresse avec le jeton recu a la nouvelle adresse

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle propre à cette route : Jeton à usage unique reçu à la nouvelle adresse.
- Contrôles d'accès et de propriété appelés dans le code : `accounts.service._token_owner`.
- Limitation de débit : 20 requêtes POST par minute et par adresse IP (préfixe `/api/v1/auth/confirm-email-change`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `TokenIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `token` | string | oui | longueur min. 10 ; longueur max. 200 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.service.confirm_email_change` ([app/modules/accounts/service.py:452](../../app/modules/accounts/service.py#L452))
  - Lien deja utilise (demande effacee) ou remplace par une demande plus recente

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Adresse e-mail modifiée ».
- `result` : objet UserOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `email` | string | oui | — | — |
| `full_name` | string | oui | — | — |
| `locale` | string | oui | — | — |
| `timezone` | string | oui | — | — |
| `currency` | string | oui | — | — |
| `role` | string | oui | — | — |
| `status` | string | oui | — | — |
| `is_admin` | boolean | oui | — | — |
| `email_verified_at` | string (date-time) (ou null) | oui | — | — |
| `mfa_enabled` | boolean | oui | — | — |
| `inbox_alias` | string (ou null) | non | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `dashboard_preferences` | objet (clés libres) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `400` | Requête invalide | « Lien invalide » | oui (1) |
| `409` | Conflit avec l'état actuel | « Cette adresse e-mail est déjà utilisée »; « Conflit avec l'état actuel » | oui (2) |
| `410` | Expiré ou n'existe plus | « Expiré ou n'existe plus » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `429` | Trop de requêtes | limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-007 — Paramètres publics de l'interface

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Authentification |
| Méthode | `GET` |
| Chemin | `/api/v1/auth/public-config` |
| Fonction | `public_config` — [app/modules/accounts/router.py:231](../../app/modules/accounts/router.py#L231) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 5 test(s) (test_i18n_extensible, test_integrations, test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/accounts/pages/RegisterPage.jsx`, `src/shared/components/Captcha.jsx`, `src/shared/i18n/useLanguages.js`, …) |

**Description** (commentaire et docstring du code). Parametres publics du frontend : cle anti-robot, inscriptions ouvertes, message de maintenance (ADM-004), langues proposees et langue par defaut (connues avant la connexion)

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (5) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-008 — Vérification de l'adresse e-mail

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Authentification |
| Méthode | `POST` |
| Chemin | `/api/v1/auth/verify-email` |
| Fonction | `verify_email` — [app/modules/accounts/router.py:269](../../app/modules/accounts/router.py#L269) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1047 test(s) (test_accounts, test_api_sans_test_auparavant, test_bd4_administrateur_foyer, test_calendrier_local, test_cas_limites, test_conservation_bd3_dec14, …) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Confirmation de l'adresse e-mail avec le jeton recu

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle propre à cette route : Jeton à usage unique reçu par e-mail.
- Contrôles d'accès et de propriété appelés dans le code : `accounts.service.verify_email`.
- Limitation de débit : 20 requêtes POST par minute et par adresse IP (préfixe `/api/v1/auth/verify-email`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `TokenIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `token` | string | oui | longueur min. 10 ; longueur max. 200 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Adresse e-mail confirmée ».
- `result` : objet UserOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `email` | string | oui | — | — |
| `full_name` | string | oui | — | — |
| `locale` | string | oui | — | — |
| `timezone` | string | oui | — | — |
| `currency` | string | oui | — | — |
| `role` | string | oui | — | — |
| `status` | string | oui | — | — |
| `is_admin` | boolean | oui | — | — |
| `email_verified_at` | string (date-time) (ou null) | oui | — | — |
| `mfa_enabled` | boolean | oui | — | — |
| `inbox_alias` | string (ou null) | non | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `dashboard_preferences` | objet (clés libres) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1243) |
| `400` | Requête invalide | « Lien invalide » | oui (21) |
| `409` | Conflit avec l'état actuel | — | oui (2) |
| `410` | Expiré ou n'existe plus | « Expiré ou n'existe plus » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `429` | Trop de requêtes | limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-009 — Mot de passe oublié

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Authentification |
| Méthode | `POST` |
| Chemin | `/api/v1/auth/forgot-password` |
| Fonction | `forgot_password` — [app/modules/accounts/router.py:275](../../app/modules/accounts/router.py#L275) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 16 test(s) (test_integrations, test_module_13_privacy, test_module_1_auth, test_problem_json) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Mot de passe oublie (anti-robot obligatoire) : reponse 202 identique que le compte existe ou non

**État détaillé.**

- Dépendance non configurée (É-02) : Relais d'e-mails (MAIL_HOST vide) : les e-mails sont seulement journalisés, aucun n'est envoyé.
- Remarque : Le lien de réinitialisation n'est pas envoyé.

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle anti-robot (Cloudflare Turnstile) quand `TURNSTILE_SECRET_KEY` est renseignée (503 si le service de vérification ne répond pas).
- Limitation de débit : 5 requêtes POST par minute et par adresse IP (préfixe `/api/v1/auth/forgot-password`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `ForgotPasswordIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `email` | string (email) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.service.request_password_reset` ([app/modules/accounts/service.py:681](../../app/modules/accounts/service.py#L681)) : Reponse identique qu'un compte existe ou non ; 3 demandes par heure et par adresse

**Réponse en cas de succès.**

- Code HTTP **202**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Si un compte existe pour cette adresse, un lien de réinitialisation a été envoyé ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `202` | Accepté, traité en arrière-plan | succès | oui (34) |
| `422` | Données invalides | données ou paramètres invalides | oui (1) |
| `429` | Trop de requêtes | « Trop de requêtes »; limite de débit atteinte | oui (4) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-010 — Réinitialisation du mot de passe

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Authentification |
| Méthode | `POST` |
| Chemin | `/api/v1/auth/reset-password` |
| Fonction | `reset_password` — [app/modules/accounts/router.py:283](../../app/modules/accounts/router.py#L283) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 6 test(s) (test_integrations, test_module_1_auth) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Choix d'un nouveau mot de passe avec le jeton recu

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle propre à cette route : Jeton à usage unique reçu par e-mail.
- Contrôles d'accès et de propriété appelés dans le code : `core.passwords.ensure_password_allowed`.
- Limitation de débit : 10 requêtes POST par minute et par adresse IP (préfixe `/api/v1/auth/reset-password`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `ResetPasswordIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `token` | string | oui | longueur min. 10 ; longueur max. 200 | — |
| `password` | string | oui | longueur min. 12 ; longueur max. 128 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.service.reset_password` ([app/modules/accounts/service.py:716](../../app/modules/accounts/service.py#L716))
  - Le titulaire a prouve son identite : le verrouillage eventuel est leve

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Mot de passe modifié : vous pouvez vous connecter ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (5) |
| `400` | Requête invalide | « Lien invalide » | oui (2) |
| `410` | Expiré ou n'existe plus | « Expiré ou n'existe plus » | oui (1) |
| `422` | Données invalides | « Problème de validation des données »; données ou paramètres invalides | oui (2) |
| `429` | Trop de requêtes | limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Profil et compte

### API-ACC-011 — Profil de l'utilisateur connecté

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Profil et compte |
| Méthode | `GET` |
| Chemin | `/api/v1/accounts/me` |
| Fonction | `me` — [app/modules/accounts/router.py:122](../../app/modules/accounts/router.py#L122) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 36 test(s) (test_accounts, test_api_sans_test_auparavant, test_integrations, test_module_10_integrations, test_module_11_settings, test_module_13_privacy, …) |
| Utilisée par l'interface web | oui (`src/modules/settings/pages/SettingsPage.jsx`) |

**Description** (commentaire et docstring du code). Profil de l'utilisateur connecte

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet UserOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `email` | string | oui | — | — |
| `full_name` | string | oui | — | — |
| `locale` | string | oui | — | — |
| `timezone` | string | oui | — | — |
| `currency` | string | oui | — | — |
| `role` | string | oui | — | — |
| `status` | string | oui | — | — |
| `is_admin` | boolean | oui | — | — |
| `email_verified_at` | string (date-time) (ou null) | oui | — | — |
| `mfa_enabled` | boolean | oui | — | — |
| `inbox_alias` | string (ou null) | non | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `dashboard_preferences` | objet (clés libres) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (31) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (13) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-012 — Modification du profil

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Profil et compte |
| Méthode | `PATCH` |
| Chemin | `/api/v1/accounts/me` |
| Fonction | `update_me` — [app/modules/accounts/router.py:128](../../app/modules/accounts/router.py#L128) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 13 test(s) (test_i18n_extensible, test_module_1_auth, test_module_2_dashboard) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`, `src/shared/layout/Header.jsx`) |

**Description** (commentaire et docstring du code). Modification du profil : seuls les champs envoyes sont modifies (devise en majuscules)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `core.i18n.ensure_offered`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `ProfileIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `full_name` | string (ou null) | non | longueur min. 2 ; longueur max. 160 | — |
| `locale` | string (ou null) | non | — | — |
| `timezone` | string (ou null) | non | — | — |
| `currency` | string (ou null) | non | longueur min. 3 ; longueur max. 3 | — |
| `dashboard_preferences` | objet DashboardPreferencesIn (ou null) | non | — | — |
| `dashboard_preferences.order` | liste de string | non | éléments max. 9 | — |
| `dashboard_preferences.hidden` | liste de string | non | éléments max. 9 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Validateur `ProfileIn.check_tz` (champ(s) timezone) ([app/modules/accounts/schemas.py:139](../../app/modules/accounts/schemas.py#L139)) : Verification du fuseau horaire s'il est fourni
- Validateur `ProfileIn.check_locale` (champ(s) locale) ([app/modules/accounts/schemas.py:145](../../app/modules/accounts/schemas.py#L145)) : Verification de la langue si elle est fournie — refus (422) : « langue non prise en charge ({', '.join(i18n.installed())}) »
- Validateur `DashboardPreferencesIn.check_sections` (champ(s) order, hidden) ([app/modules/accounts/schemas.py:118](../../app/modules/accounts/schemas.py#L118)) : Chaque section doit etre connue et n'apparaitre qu'une fois — refus (422) : « section inconnue » ; « section en double »
- Contrôle dans le code (422) : locale : ['Langue non proposée sur la plateforme']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Langue : seulement une langue proposee par l'administrateur

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Profil mis à jour ».
- `result` : objet UserOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `email` | string | oui | — | — |
| `full_name` | string | oui | — | — |
| `locale` | string | oui | — | — |
| `timezone` | string | oui | — | — |
| `currency` | string | oui | — | — |
| `role` | string | oui | — | — |
| `status` | string | oui | — | — |
| `is_admin` | boolean | oui | — | — |
| `email_verified_at` | string (date-time) (ou null) | oui | — | — |
| `mfa_enabled` | boolean | oui | — | — |
| `inbox_alias` | string (ou null) | non | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `dashboard_preferences` | objet (clés libres) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (6) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | données ou paramètres invalides; « locale : ['Langue non proposée sur la plateforme'] » | oui (10) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-013 — Demande de changement d'adresse e-mail

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Profil et compte |
| Méthode | `POST` |
| Chemin | `/api/v1/accounts/me/email` |
| Fonction | `request_email_change` — [app/modules/accounts/router.py:141](../../app/modules/accounts/router.py#L141) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 4 test(s) (test_module_1_auth) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Changement d'adresse : lien envoye a la nouvelle adresse ; l'adresse du compte ne change qu'a sa confirmation

**État détaillé.**

- Dépendance non configurée (É-02) : Relais d'e-mails (MAIL_HOST vide) : les e-mails sont seulement journalisés, aucun n'est envoyé.
- Remarque : Le lien de confirmation de la nouvelle adresse n'est pas envoyé.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `accounts.service._check_current_password`.
- Limitation de débit : 10 requêtes POST par minute et par adresse IP (préfixe `/api/v1/accounts/me/email`), puis 429 avec l'en-tête `Retry-After`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `EmailChangeIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `new_email` | string (email) | oui | — | — |
| `password` | string | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : new_email : ["C'est déjà votre adresse actuelle"]

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.service.request_email_change` ([app/modules/accounts/service.py:430](../../app/modules/accounts/service.py#L430)) : Changement d'adresse : demande en attente dans les preferences ; rien ne change avant la verification
  - Empreintes des liens remplaces par cette demande (refus explicite 410 au lieu de « deja utilise »)

**Réponse en cas de succès.**

- Code HTTP **202**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Un lien de confirmation a été envoyé à la nouvelle adresse ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `202` | Accepté, traité en arrière-plan | succès | oui (5) |
| `401` | Non authentifié ou session invalide | « Mot de passe incorrect »; jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `409` | Conflit avec l'état actuel | « Cette adresse e-mail est déjà utilisée » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « new_email : ["C'est déjà votre adresse actuelle"] » | oui (2) |
| `429` | Trop de requêtes | limite de débit atteinte | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-014 — Changement du mot de passe

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Profil et compte |
| Méthode | `POST` |
| Chemin | `/api/v1/accounts/me/password` |
| Fonction | `change_password` — [app/modules/accounts/router.py:154](../../app/modules/accounts/router.py#L154) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_1_auth) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Changement de mot de passe (la session courante reste ouverte)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `accounts.service._check_current_password`, `core.passwords.ensure_password_allowed`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `PasswordChangeIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `current_password` | string | oui | — | — |
| `new_password` | string | oui | longueur min. 12 ; longueur max. 128 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Mot de passe modifié ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | « Mot de passe incorrect »; jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `422` | Données invalides | « Problème de validation des données »; données ou paramètres invalides | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-023 — Renvoi du lien de vérification (connecté)

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Profil et compte |
| Méthode | `POST` |
| Chemin | `/api/v1/accounts/me/verification` |
| Fonction | `resend_verification` — [app/modules/accounts/router.py:290](../../app/modules/accounts/router.py#L290) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 2 test(s) (test_api_sans_test_auparavant) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Renvoi de l'e-mail de confirmation a un utilisateur connecte (anti-robot obligatoire, memes limites)

**État détaillé.**

- Dépendance non configurée (É-02) : Relais d'e-mails (MAIL_HOST vide) : les e-mails sont seulement journalisés, aucun n'est envoyé.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôle anti-robot (Cloudflare Turnstile) quand `TURNSTILE_SECRET_KEY` est renseignée (503 si le service de vérification ne répond pas).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.
- Contrôle dans le code (422) : email : ['Adresse déjà confirmée']

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « E-mail de confirmation renvoyé ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `422` | Données invalides | « email : ['Adresse déjà confirmée'] » | oui (1) |
| `429` | Trop de requêtes | « Trop de requêtes » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-024 — Export immédiat des données du compte (JSON)

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Profil et compte |
| Méthode | `GET` |
| Chemin | `/api/v1/accounts/me/export` |
| Fonction | `export_data` — [app/modules/accounts/router.py:299](../../app/modules/accounts/router.py#L299) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_cas_limites, test_integrations, test_module_3_assistant, test_module_3_attachments) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Téléchargement JSON de toutes les données du compte

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Trace d'audit de l'export, puis telechargement du fichier JSON (jamais mis en cache)
- Fonction `accounts.service.export_data` ([app/modules/accounts/service.py:746](../../app/modules/accounts/service.py#L746)) : Export des donnees personnelles du compte (droit d'acces et de portabilite)
  - Messages de l'assistant (rattaches aux conversations : conversation_messages n'a pas de colonne user_id)
  - Fichiers joints a l'assistant : documents marques « attachment », sans emplacement interne du fichier

**Réponse en cas de succès.**

- Réponse directe hors enveloppe possible (JSONResponse) : fichier, flux, redirection ou réponse sans contenu selon le cas (voir le code).
- Code HTTP **200**.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-025 — Demande de suppression du compte (confirmée par mot de passe, délai de 7 jours)

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Profil et compte |
| Méthode | `POST` |
| Chemin | `/api/v1/accounts/me/delete` |
| Fonction | `delete_account` — [app/modules/accounts/router.py:313](../../app/modules/accounts/router.py#L313) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_cas_limites, test_integrations, test_module_1_auth) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Suppression du compte (confirmee par mot de passe) et du cookie de session

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `core.security.verify_password`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `app__modules__accounts__schemas__PasswordIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `password` | string | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : households : ["Vous n'êtes pas propriétaire de ce foyer"]
- Contrôle dans le code (422) : households : [f"Choisissez un membre actif du foyer « {item['name']} »"]
- Contrôle dans le code (422) : households : [f"Le foyer « {item['name']} » n'a aucun autre membre : il ne peut pas être conservé"]
- Contrôle dans le code (422) : password : ['Mot de passe incorrect']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- PRIV-002 : suppression programmee apres un delai de reflexion de 7 jours, annulable (module 13)
- Fonction `privacy.service.request_deletion` ([app/modules/privacy/service.py:297](../../app/modules/privacy/service.py#L297)) : Suppression programmee dans 7 jours (delai de reflexion), annulable jusque-la ; confirmee par mot de passe. households (B8, facultatif) : choix par foyer possede ; foyer sans choix = regle automatique inchangee.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Suppression programmée le {request.scheduled_for} : vous pouvez l'annuler d'ici là ».
- `result` : null.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `409` | Conflit avec l'état actuel | « Une suppression est déjà programmée » | non |
| `422` | Données invalides | données ou paramètres invalides; « households : ["Vous n'êtes pas propriétaire de ce foyer"] »; « households : [f"Choisissez un membre actif du foyer « {item['name']} »"] »; « households : [f"Le foyer « {item['name']} » n'a aucun autre membre : il ne peut pas être conservé"] »; « password : ['Mot de passe incorrect'] » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Sessions et appareils

### API-ACC-015 — Liste des sessions et appareils

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Sessions et appareils |
| Méthode | `GET` |
| Chemin | `/api/v1/accounts/me/sessions` |
| Fonction | `sessions` — [app/modules/accounts/router.py:161](../../app/modules/accounts/router.py#L161) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 5 test(s) (test_module_1_auth) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Appareils connectes : sessions actives, la plus recemment utilisee d'abord

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : sessions non revoquees et non expirees de l'utilisateur
- Appareil (nom enregistre ou deduit du navigateur), IP tronquee, marque de la session de la requete en cours
- Fonction `accounts.service.describe_device` ([app/modules/accounts/service.py:280](../../app/modules/accounts/service.py#L280)) : Nom lisible de l'appareil a partir de l'en-tete User-Agent (ex. « Chrome sur Windows »)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet SessionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `device_name` | string (ou null) | oui | — | — |
| `user_agent` | string (ou null) | oui | — | — |
| `ip_address` | string (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `last_used_at` | string (date-time) (ou null) | oui | — | — |
| `current` | boolean | non | défaut `false` | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-016 — Révocation de toutes les autres sessions

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Sessions et appareils |
| Méthode | `DELETE` |
| Chemin | `/api/v1/accounts/me/sessions` |
| Fonction | `revoke_all` — [app/modules/accounts/router.py:174](../../app/modules/accounts/router.py#L174) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_module_1_auth) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Deconnexion de tous les appareils, y compris celui de la demande (204 : reponse sans contenu)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.router._clear_refresh_cookie` ([app/modules/accounts/router.py:58](../../app/modules/accounts/router.py#L58))
  - Suppression des cookies de session (memes attributs qu'au depot)

**Réponse en cas de succès.**

- Réponse directe hors enveloppe possible (Response) : fichier, flux, redirection ou réponse sans contenu selon le cas (voir le code).
- Code HTTP **204**.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `204` | Sans contenu | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-017 — Révocation d'une session

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Sessions et appareils |
| Méthode | `DELETE` |
| Chemin | `/api/v1/accounts/me/sessions/{session_id}` |
| Fonction | `revoke` — [app/modules/accounts/router.py:183](../../app/modules/accounts/router.py#L183) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_module_1_auth) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Fermeture d'une session (appareil) de l'utilisateur (204 : reponse sans contenu)

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `session_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : la session doit appartenir a l'utilisateur (celle d'un autre compte reste introuvable)
- Session deja fermee : conflit

**Réponse en cas de succès.**

- Réponse directe hors enveloppe possible (Response) : fichier, flux, redirection ou réponse sans contenu selon le cas (voir le code).
- Code HTTP **204**.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `204` | Sans contenu | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Session introuvable » | oui (1) |
| `409` | Conflit avec l'état actuel | « Cette session est déjà fermée » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Double authentification (MFA)

### API-ACC-018 — Préparation de la double authentification

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Double authentification (MFA) |
| Méthode | `POST` |
| Chemin | `/api/v1/accounts/me/mfa/setup` |
| Fonction | `mfa_setup` — [app/modules/accounts/router.py:198](../../app/modules/accounts/router.py#L198) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 14 test(s) (test_accounts, test_fonctions_plan, test_integrations, test_module_10_integrations, test_module_13_privacy, test_module_1_auth) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Double authentification : generation du secret, activation, desactivation

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet MfaSetupOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `secret` | string | oui | — | — |
| `otpauth_uri` | string | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (14) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `409` | Conflit avec l'état actuel | « L'authentification multifacteur est déjà activée » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-019 — Activation de la double authentification

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Double authentification (MFA) |
| Méthode | `POST` |
| Chemin | `/api/v1/accounts/me/mfa/enable` |
| Fonction | `mfa_enable` — [app/modules/accounts/router.py:204](../../app/modules/accounts/router.py#L204) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 11 test(s) (test_accounts, test_fonctions_plan, test_module_1_auth) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Activation de la double authentification.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `MfaCodeIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `code` | string | oui | longueur min. 6 ; longueur max. 8 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : code : ['Code de vérification incorrect']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Activation : l'utilisateur et ses codes de recuperation (affiches une seule fois)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Authentification multifacteur activée ».
- `result` : objet MfaEnabledOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `user` | objet UserOut | oui | — | — |
| `user.id` | string (uuid) | oui | — | — |
| `user.email` | string | oui | — | — |
| `user.full_name` | string | oui | — | — |
| `user.locale` | string | oui | — | — |
| `user.timezone` | string | oui | — | — |
| `user.currency` | string | oui | — | — |
| `user.role` | string | oui | — | — |
| `user.status` | string | oui | — | — |
| `user.is_admin` | boolean | oui | — | — |
| `user.email_verified_at` | string (date-time) (ou null) | oui | — | — |
| `user.mfa_enabled` | boolean | oui | — | — |
| `user.inbox_alias` | string (ou null) | non | — | — |
| `user.created_at` | string (date-time) | oui | — | — |
| `user.dashboard_preferences` | objet (clés libres) (ou null) | non | — | — |
| `recovery_codes` | liste de string | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (10) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | « code : ['Code de vérification incorrect'] »; données ou paramètres invalides | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-020 — État de la double authentification

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Double authentification (MFA) |
| Méthode | `GET` |
| Chemin | `/api/v1/accounts/me/mfa` |
| Fonction | `mfa_status` — [app/modules/accounts/router.py:213](../../app/modules/accounts/router.py#L213) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_fonctions_plan, test_module_1_auth) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Etat de la double authentification et nombre de codes de recuperation restants

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet MfaStatusOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `enabled` | boolean | oui | — | — |
| `recovery_codes_left` | integer | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-021 — Régénération des codes de secours

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Double authentification (MFA) |
| Méthode | `POST` |
| Chemin | `/api/v1/accounts/me/mfa/recovery-codes` |
| Fonction | `mfa_recovery_codes` — [app/modules/accounts/router.py:219](../../app/modules/accounts/router.py#L219) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_fonctions_plan) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Nouveaux codes de recuperation (code TOTP exige) : les anciens deviennent inutilisables

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `MfaCodeIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `code` | string | oui | longueur min. 6 ; longueur max. 8 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : code : ['Code de vérification incorrect']

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Nouveaux codes de récupération générés ».
- `result` : liste de string (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `422` | Données invalides | « code : ['Code de vérification incorrect'] »; données ou paramètres invalides | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-022 — Désactivation de la double authentification

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Double authentification (MFA) |
| Méthode | `POST` |
| Chemin | `/api/v1/accounts/me/mfa/disable` |
| Fonction | `mfa_disable` — [app/modules/accounts/router.py:225](../../app/modules/accounts/router.py#L225) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_fonctions_plan, test_module_1_auth) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Desactivation de la double authentification : reconfirmation du mot de passe exigee

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `accounts.service._check_current_password`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `app__modules__accounts__schemas__PasswordIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `password` | string | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Authentification multifacteur désactivée ».
- `result` : objet UserOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `email` | string | oui | — | — |
| `full_name` | string | oui | — | — |
| `locale` | string | oui | — | — |
| `timezone` | string | oui | — | — |
| `currency` | string | oui | — | — |
| `role` | string | oui | — | — |
| `status` | string | oui | — | — |
| `is_admin` | boolean | oui | — | — |
| `email_verified_at` | string (date-time) (ou null) | oui | — | — |
| `mfa_enabled` | boolean | oui | — | — |
| `inbox_alias` | string (ou null) | non | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `dashboard_preferences` | objet (clés libres) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | « Mot de passe incorrect »; jeton absent, invalide, expiré ou session révoquée | oui (2) |
| `409` | Conflit avec l'état actuel | « L'authentification multifacteur n'est pas activée » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Abonnements et facturation

### API-ACC-026 — Liste des formules

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Abonnements et facturation |
| Méthode | `GET` |
| Chemin | `/api/v1/subscriptions/plans` |
| Fonction | `plans` — [app/modules/accounts/router.py:246](../../app/modules/accounts/router.py#L246) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 2 test(s) (test_accounts, test_drapeaux_fonctionnalites) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Formules commerciales disponibles

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : formules actives, triees par prix (le schema n'a pas de colonne d'ordre)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet PlanOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `code` | string | oui | — | — |
| `name` | string | oui | — | — |
| `price_cents` | integer | oui | — | — |
| `currency` | string | oui | — | — |
| `billing_interval` | string | oui | — | — |
| `ai_documents_per_month` | integer | oui | — | — |
| `max_household_members` | integer | oui | — | — |
| `features` | objet (clés libres) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-027 — Abonnement en cours

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Abonnements et facturation |
| Méthode | `GET` |
| Chemin | `/api/v1/subscriptions/me` |
| Fonction | `my_subscription` — [app/modules/accounts/router.py:254](../../app/modules/accounts/router.py#L254) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_accounts, test_drapeaux_fonctionnalites, test_integrations, test_module_18_subscriptions) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Abonnement en cours de l'utilisateur

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet SubscriptionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `plan_code` | string | oui | — | — |
| `status` | string | oui | — | — |
| `current_period_end` | string (date-time) (ou null) | oui | — | — |
| `cancel_at_period_end` | boolean | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (5) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-028 — Consommation des quotas

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Abonnements et facturation |
| Méthode | `GET` |
| Chemin | `/api/v1/subscriptions/me/usage` |
| Fonction | `my_usage` — [app/modules/accounts/router.py:261](../../app/modules/accounts/router.py#L261) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 6 test(s) (test_accounts, test_cas_limites, test_inbox_reminders_actions, test_integrations, test_module_18_subscriptions) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Consommation du mois et limite de la formule

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.service.usage_this_month` ([app/modules/accounts/service.py:589](../../app/modules/accounts/service.py#L589)) : Consommation du mois : lignes de ai_usage_records (mesure du schema) pour cet usage

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet app__modules__accounts__schemas__UsageOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `period` | string | oui | — | — |
| `ai_documents_used` | integer | oui | — | — |
| `ai_documents_limit` | integer | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (7) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-029 — Souscription (session de paiement)

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Abonnements et facturation |
| Méthode | `POST` |
| Chemin | `/api/v1/subscriptions/checkout` |
| Fonction | `checkout` — [app/modules/accounts/router.py:323](../../app/modules/accounts/router.py#L323) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 3 test(s) (test_drapeaux_fonctionnalites, test_integrations, test_lot6_assistant_voix_api) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Paiement d'une formule : renvoie l'adresse de la page de paiement Stripe

**État détaillé.**

- Dépendance non configurée (É-06) : Paiement Stripe (clés vides, fournisseur désactivé, décision DEC-1) : réponse 503.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `billing.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `accounts.billing.checkout`, `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `Idempotency-Key` | en-tête | string (ou null) | non | longueur min. 8 ; longueur max. 80 | — |

**Corps de la requête** (`application/json`, schéma `CheckoutIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `plan_code` | string | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : plan_code : ["Vous avez déjà un abonnement payant : utilisez la gestion d'abonnement"]
- Contrôle dans le code (422) : plan_code : ['Formule inconnue ou gratuite']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- E-12 (en-tete facultatif, DEC-6) : une souscription rejouee renvoie la meme page de paiement, sans doublon
- Fonction `accounts.billing.checkout` ([app/modules/accounts/billing.py:113](../../app/modules/accounts/billing.py#L113))
  - Requete : formule choisie ; elle doit exister, etre active et payante
  - Formule sans prix Stripe configure (subscription_prices.provider_price_id) : pas encore vendable
  - Un seul abonnement payant a la fois : les changements passent par le portail client
  - Adresse du frontend (retour apres paiement)
  - Parametres de la session de paiement Stripe Checkout ; le titulaire est repris dans les metadonnees
  - Client Stripe existant reutilise, sinon Stripe le creera avec l'adresse e-mail
  - Requete : creation de la session de paiement chez Stripe
  - Cle propre a l'utilisateur (une cle identique envoyee par deux comptes ne designe pas la meme requete)
  - Trace d'audit puis enregistrement ; renvoie l'adresse de la page de paiement

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet RedirectOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `url` | string | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « plan_code : ["Vous avez déjà un abonnement payant : utilisez la gestion d'abonnement"] »; « plan_code : ['Formule inconnue ou gratuite'] » | non |
| `502` | Fournisseur externe en erreur | « Erreur du prestataire de paiement » | non |
| `503` | Service indisponible ou non configuré | « Cette formule n'est pas encore disponible au paiement »; « Paiement en ligne non configuré »; « Prestataire de paiement injoignable » | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-030 — Accès au portail de facturation

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Abonnements et facturation |
| Méthode | `POST` |
| Chemin | `/api/v1/subscriptions/portal` |
| Fonction | `portal` — [app/modules/accounts/router.py:331](../../app/modules/accounts/router.py#L331) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 1 test(s) (test_api_sans_test_auparavant) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Portail client Stripe (moyen de paiement, changement de formule, resiliation)

**État détaillé.**

- Dépendance non configurée (É-06) : Paiement Stripe (clés vides, fournisseur désactivé, décision DEC-1) : réponse 503.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.
- Contrôle dans le code (422) : subscription : ['Aucun abonnement payant à gérer']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.billing.portal` ([app/modules/accounts/billing.py:155](../../app/modules/accounts/billing.py#L155))
  - Il faut un client Stripe pour ouvrir le portail
  - Requete : creation d'une session du portail client Stripe

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet RedirectOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `url` | string | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | oui (1) |
| `422` | Données invalides | « subscription : ['Aucun abonnement payant à gérer'] » | oui (1) |
| `502` | Fournisseur externe en erreur | « Erreur du prestataire de paiement » | non |
| `503` | Service indisponible ou non configuré | « Paiement en ligne non configuré »; « Prestataire de paiement injoignable » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-031 — Liste des factures

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Abonnements et facturation |
| Méthode | `GET` |
| Chemin | `/api/v1/subscriptions/me/invoices` |
| Fonction | `invoices` — [app/modules/accounts/router.py:337](../../app/modules/accounts/router.py#L337) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 3 test(s) (test_drapeaux_fonctionnalites, test_integrations, test_module_18_subscriptions) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Historique des factures

**État détaillé.**

- Dépendance non configurée (É-06) : Paiement Stripe (clés vides, fournisseur désactivé, décision DEC-1) : réponse 503.
- Remarque : Sans Stripe, la liste est vide.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Factures lues chez le prestataire et dans la table invoices, la plus recente d'abord
- Fonction `accounts.billing.list_invoices` ([app/modules/accounts/billing.py:275](../../app/modules/accounts/billing.py#L275)) : Factures de l'utilisateur : celles du prestataire (lues a la demande) et celles de la table invoices
  - Factures deja presentes dans la base partagee (lecture seule pour l'application web)
  - Factures du client Stripe de l'utilisateur (si le paiement est configure)
  - Prestataire non configure ou injoignable : seules les factures de la base sont affichees
  - La plus recente d'abord

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : liste de objet InvoiceOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string | oui | — | — |
| `number` | string (ou null) | oui | — | — |
| `status` | string | oui | — | — |
| `amount_cents` | integer | oui | — | — |
| `currency` | string | oui | — | — |
| `period_start` | string (date-time) (ou null) | oui | — | — |
| `period_end` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `502` | Fournisseur externe en erreur | « Erreur du prestataire de paiement » | non |
| `503` | Service indisponible ou non configuré | « Paiement en ligne non configuré »; « Prestataire de paiement injoignable » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-032 — Changement de formule

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Abonnements et facturation |
| Méthode | `POST` |
| Chemin | `/api/v1/subscriptions/me/change` |
| Fonction | `change_plan` — [app/modules/accounts/router.py:350](../../app/modules/accounts/router.py#L350) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 5 test(s) (test_drapeaux_fonctionnalites, test_lot8_preparation, test_module_18_subscriptions) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Changement de formule.

**État détaillé.**

- Dépendance non configurée (É-06) : Paiement Stripe (clés vides, fournisseur désactivé, décision DEC-1) : réponse 503.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `billing.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `accounts.billing._require_paid`, `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête** (`application/json`, schéma `PlanChangeIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `plan_code` | string | oui | longueur min. 2 ; longueur max. 32 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : plan_code : ['Formule inconnue ou gratuite']
- Contrôle dans le code (422) : subscription : ['Aucun abonnement payant à gérer']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- E-20 : formule inferieure (ou gratuite) programmee pour la fin de la periode payee
- Fonction `accounts.billing.change_plan` ([app/modules/accounts/billing.py:189](../../app/modules/accounts/billing.py#L189)) : Changement de formule payante (prorata calcule par le prestataire) ; vers la gratuite : annulation en fin de periode
  - Ligne de l'abonnement chez Stripe, puis remplacement du prix
  - E-20 / RM-14 (DEC-5) : vers une formule inferieure, le changement prend effet a la fin de la periode payee

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet SubscriptionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `plan_code` | string | oui | — | — |
| `status` | string | oui | — | — |
| `current_period_end` | string (date-time) (ou null) | oui | — | — |
| `cancel_at_period_end` | boolean | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (4) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (1) |
| `409` | Conflit avec l'état actuel | « L'annulation est déjà programmée »; « Un changement de formule est déjà programmé »; « Vous avez déjà cette formule » | oui (2) |
| `422` | Données invalides | données ou paramètres invalides; « plan_code : ['Formule inconnue ou gratuite'] »; « subscription : ['Aucun abonnement payant à gérer'] » | oui (2) |
| `502` | Fournisseur externe en erreur | « Erreur du prestataire de paiement » | non |
| `503` | Service indisponible ou non configuré | « Cette formule n'est pas encore disponible au paiement »; « Paiement en ligne non configuré »; « Prestataire de paiement injoignable » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-033 — Résiliation de l'abonnement

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Abonnements et facturation |
| Méthode | `POST` |
| Chemin | `/api/v1/subscriptions/me/cancel` |
| Fonction | `cancel_subscription` — [app/modules/accounts/router.py:358](../../app/modules/accounts/router.py#L358) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 2 test(s) (test_module_18_subscriptions) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Résiliation de l'abonnement.

**État détaillé.**

- Dépendance non configurée (É-06) : Paiement Stripe (clés vides, fournisseur désactivé, décision DEC-1) : réponse 503.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Contrôles d'accès et de propriété appelés dans le code : `accounts.billing._require_paid`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.
- Contrôle dans le code (422) : subscription : ['Aucun abonnement payant à gérer']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.billing.cancel_at_period_end` ([app/modules/accounts/billing.py:238](../../app/modules/accounts/billing.py#L238)) : Annulation effective en fin de periode payee : l'acces reste ouvert jusque-la

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Annulation programmée à la fin de la période payée ».
- `result` : objet SubscriptionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `plan_code` | string | oui | — | — |
| `status` | string | oui | — | — |
| `current_period_end` | string (date-time) (ou null) | oui | — | — |
| `cancel_at_period_end` | boolean | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `409` | Conflit avec l'état actuel | « L'annulation est déjà programmée » | oui (1) |
| `422` | Données invalides | « subscription : ['Aucun abonnement payant à gérer'] » | oui (1) |
| `502` | Fournisseur externe en erreur | « Erreur du prestataire de paiement » | non |
| `503` | Service indisponible ou non configuré | « Paiement en ligne non configuré »; « Prestataire de paiement injoignable » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-034 — Reprise d'un abonnement résilié

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Abonnements et facturation |
| Méthode | `POST` |
| Chemin | `/api/v1/subscriptions/me/resume` |
| Fonction | `resume_subscription` — [app/modules/accounts/router.py:363](../../app/modules/accounts/router.py#L363) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 4 test(s) (test_drapeaux_fonctionnalites, test_module_18_subscriptions, test_problem_json) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Reprise d'un abonnement résilié.

**État détaillé.**

- Dépendance non configurée (É-06) : Paiement Stripe (clés vides, fournisseur désactivé, décision DEC-1) : réponse 503.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).
- Fonction soumise au drapeau `billing.enabled` (table `feature_flags` : activation, fenêtre de dates, déploiement progressif par utilisateur) ; désactivée : 403 « Fonction non activée par l'administrateur », `result = {"feature": <clé>}`.
- Contrôles d'accès et de propriété appelés dans le code : `accounts.billing._require_paid`, `core.auth.check_feature`, `core.auth.require_feature`.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Aucune donnée d'entrée à valider.
- Contrôle dans le code (422) : subscription : ['Aucun abonnement payant à gérer']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.billing.resume` ([app/modules/accounts/billing.py:250](../../app/modules/accounts/billing.py#L250)) : Reprise d'un abonnement dont l'annulation est programmee (avant la fin de periode)

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Abonnement repris ».
- `result` : objet SubscriptionOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `plan_code` | string | oui | — | — |
| `status` | string | oui | — | — |
| `current_period_end` | string (date-time) (ou null) | oui | — | — |
| `cancel_at_period_end` | boolean | oui | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | « Accès refusé »; fonction désactivée par son drapeau (Fonction non activée par l'administrateur) | oui (3) |
| `409` | Conflit avec l'état actuel | « Aucune annulation programmée » | oui (1) |
| `422` | Données invalides | « subscription : ['Aucun abonnement payant à gérer'] » | non |
| `502` | Fournisseur externe en erreur | « Erreur du prestataire de paiement » | non |
| `503` | Service indisponible ou non configuré | « Paiement en ligne non configuré »; « Prestataire de paiement injoignable » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-035 — Téléchargement d'une facture

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Abonnements et facturation |
| Méthode | `GET` |
| Chemin | `/api/v1/subscriptions/me/invoices/{invoice_id}/download` |
| Fonction | `download_invoice` — [app/modules/accounts/router.py:368](../../app/modules/accounts/router.py#L368) |
| Contrat OpenAPI | oui |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 2 test(s) (test_lot8_preparation, test_module_18_subscriptions) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Téléchargement d'une facture.

**État détaillé.**

- Dépendance non configurée (É-06) : Paiement Stripe (clés vides, fournisseur désactivé, décision DEC-1) : réponse 503.

**Authentification et autorisations.**

- **Utilisateur connecté** : jeton d'accès valide (`Authorization: Bearer <jeton>`, 15 min), session non révoquée et compte actif ; sinon 401. Les données sont filtrées par la sécurité par ligne de PostgreSQL (utilisateur courant).

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `invoice_id` | chemin | string | oui | — | — |
| `redirect` | requête | boolean | non | défaut `true` | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Facture fournie par le prestataire : redirection vers son fichier (par defaut, comportement inchange).
- E-37 : redirect=false renvoie l'adresse en JSON, pour l'ecran (un appel authentifie ne suit pas une redirection vers un autre domaine). Dans les deux cas, la facture est verifiee et le telechargement journalise.
- Fonction `accounts.billing.invoice_file` ([app/modules/accounts/billing.py:297](../../app/modules/accounts/billing.py#L297)) : Adresse de la facture fournie par le prestataire (PDF, sinon page de la facture) ; facture d'autrui = 404
  - Facture lue chez le prestataire ; elle doit appartenir au client Stripe de l'utilisateur

**Réponse en cas de succès.**

- Réponse directe hors enveloppe possible (RedirectResponse) : fichier, flux, redirection ou réponse sans contenu selon le cas (voir le code).
- Code HTTP **200**.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `307` | Redirection | — | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `404` | Introuvable ou inaccessible | « Facture introuvable »; « Le prestataire n'a pas fourni de fichier pour cette facture » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `502` | Fournisseur externe en erreur | « Erreur du prestataire de paiement » | non |
| `503` | Service indisponible ou non configuré | « Paiement en ligne non configuré »; « Prestataire de paiement injoignable » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-036 — Webhook du prestataire de paiement (Stripe)

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Abonnements et facturation |
| Méthode | `POST` |
| Chemin | `/api/v1/subscriptions/webhooks/stripe` |
| Fonction | `stripe_webhook` — [app/modules/accounts/router.py:379](../../app/modules/accounts/router.py#L379) |
| Contrat OpenAPI | non (route cachée du contrat : `include_in_schema=False`) |
| État | **Terminée, en attente de configuration** |
| Tests automatisés | oui, appelée par 7 test(s) (test_integrations, test_lot8_preparation, test_module_18_subscriptions) |
| Utilisée par l'interface web | non |

**Description** (commentaire et docstring du code). Webhook du prestataire de paiement (Stripe).

**État détaillé.**

- Dépendance non configurée (É-06) : Paiement Stripe (clés vides, fournisseur désactivé, décision DEC-1) : réponse 503.

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle propre à cette route : Signature de l'en-tête `Stripe-Signature` vérifiée avec `STRIPE_WEBHOOK_SECRET` (400 « Signature du webhook invalide » si elle manque ou ne correspond pas) ; un événement déjà reçu n'est pas retraité (idempotence par identifiant d'événement). Réponse hors enveloppe : `{received, processed}`.
- Contrôles d'accès et de propriété appelés dans le code : `accounts.billing.verify_signature`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `Stripe-Signature` | en-tête | string | non | défaut `""` | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Lecture du contenu brut (necessaire a la verification de la signature)
- Fonction `accounts.billing.parse_webhook` ([app/modules/accounts/billing.py:439](../../app/modules/accounts/billing.py#L439))
  - Secret du webhook ; refus si absent ou si la signature ne correspond pas
  - Contenu de l'evenement, une fois authentifie
- Fonction `accounts.billing.handle_event` ([app/modules/accounts/billing.py:407](../../app/modules/accounts/billing.py#L407)) : Traite un événement Stripe déjà authentifie. Retourne False si l'événement avait déjà été traite.
  - Requete : evenement deja recu ? (table native webhook_events, ouverte au role applicatif)
  - Deja traite : rien a refaire (idempotence)
  - Enregistrement de l'evenement (signature verifiee en amont)
  - Objet concerne par l'evenement et type d'evenement
  - Paiement termine : lecture de l'abonnement cree chez Stripe puis synchronisation
  - Creation, modification ou fin d'abonnement
  - Factures : lues chez le prestataire a la demande (aucune ecriture possible dans invoices)
  - Evenement marque traite puis enregistrement

**Réponse en cas de succès.**

- Code HTTP **200**.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (12) |
| `400` | Requête invalide | « Signature du webhook invalide » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides | non |
| `502` | Fournisseur externe en erreur | « Erreur du prestataire de paiement » | non |
| `503` | Service indisponible ou non configuré | « Paiement en ligne non configuré »; « Prestataire de paiement injoignable » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

## Sous-module : Administration des comptes (support, métier)

### API-ACC-037 — Liste des comptes (administration, support)

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Administration des comptes (support, métier) |
| Méthode | `GET` |
| Chemin | `/api/v1/admin/users` |
| Fonction | `admin_users` — [app/modules/accounts/router.py:401](../../app/modules/accounts/router.py#L401) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 7 test(s) (test_integrations, test_lot7_administration) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Liste paginee des utilisateurs, avec recherche par e-mail ou nom

**Authentification et autorisations.**

- **Permission de plateforme** `platform.user.read` (rôles PLAA en cours de validité, référentiel `role_permissions`) avec un jeton d'accès valide ; sinon 401, puis 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `search` | requête | string (ou null) | non | — | — |
| `page` | requête | integer | non | min. 1 ; défaut `1` | — |
| `page_size` | requête | integer | non | min. 1 ; max. 100 ; défaut `20` | — |
| `cursor` | requête | string (ou null) | non | longueur max. 500 | — |
| `limit` | requête | integer (ou null) | non | min. 1 ; max. 100 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- E-17 : lecture accessible au support (platform.user.read) ; chaque consultation du support est journalisee
- Requete : comptes non supprimes, filtres par la recherche (insensible a la casse)
- Requete : nombre total, puis page demandee (plus recents d'abord)
- Fonction `accounts.router._admin_user_out` ([app/modules/accounts/router.py:393](../../app/modules/accounts/router.py#L393))
  - Utilisateur vu par l'administration, avec sa formule en cours

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet Page_AdminUserOut_ (ou null).
- Liste paginée : `items`, `total`, `page`, `page_size`, `next_cursor` (voir CONVENTIONS.md).

| Champ de `result` (élément de `items`) | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `email` | string | oui | — | — |
| `full_name` | string | oui | — | — |
| `status` | string | oui | — | — |
| `is_admin` | boolean | oui | — | — |
| `email_verified_at` | string (date-time) (ou null) | oui | — | — |
| `mfa_enabled` | boolean | oui | — | — |
| `last_login_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `plan_code` | string (ou null) | non | — | — |
| `role` | string (ou null) | non | — | — |
| `support_access_until` | string (date-time) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (4) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | oui (5) |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-038 — Octroi d'un accès support temporaire

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Administration des comptes (support, métier) |
| Méthode | `POST` |
| Chemin | `/api/v1/admin/users/{user_id}/support-access` |
| Fonction | `grant_support_access` — [app/modules/accounts/router.py:426](../../app/modules/accounts/router.py#L426) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 4 test(s) (test_lot7_administration) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Accorde le role SUPPORT pour une duree limitee (administrateur technique uniquement)

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.
- Contrôles d'accès et de propriété appelés dans le code : `accounts.service._role_id`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `user_id` | chemin | string (uuid) | oui | — | — |

**Corps de la requête** (`application/json`, schéma `SupportAccessIn`, obligatoire).

| Champ | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|
| `hours` | integer | oui | min. 1.0 ; max. 72.0 | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : user : ['Action impossible sur votre propre compte']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.router._admin_user_out` ([app/modules/accounts/router.py:393](../../app/modules/accounts/router.py#L393))
  - Utilisateur vu par l'administration, avec sa formule en cours
- Fonction `accounts.service.grant_support_access` ([app/modules/accounts/service.py:804](../../app/modules/accounts/service.py#L804)) : Role SUPPORT accorde pour une duree limitee (user_roles.expires_at) ; un role d'administration n'est jamais remplace

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Accès support accordé ».
- `result` : objet AdminUserOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `email` | string | oui | — | — |
| `full_name` | string | oui | — | — |
| `status` | string | oui | — | — |
| `is_admin` | boolean | oui | — | — |
| `email_verified_at` | string (date-time) (ou null) | oui | — | — |
| `mfa_enabled` | boolean | oui | — | — |
| `last_login_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `plan_code` | string (ou null) | non | — | — |
| `role` | string (ou null) | non | — | — |
| `support_access_until` | string (date-time) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (2) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | oui (1) |
| `404` | Introuvable ou inaccessible | « Utilisateur introuvable » | non |
| `409` | Conflit avec l'état actuel | « Ce compte a déjà un rôle d'administration » | oui (1) |
| `422` | Données invalides | données ou paramètres invalides; « user : ['Action impossible sur votre propre compte'] » | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-039 — Retrait de l'accès support

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Administration des comptes (support, métier) |
| Méthode | `DELETE` |
| Chemin | `/api/v1/admin/users/{user_id}/support-access` |
| Fonction | `revoke_support_access` — [app/modules/accounts/router.py:432](../../app/modules/accounts/router.py#L432) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_lot7_administration) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Retrait de l'accès support.

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.
- Contrôles d'accès et de propriété appelés dans le code : `accounts.service._role_id`.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `user_id` | chemin | string (uuid) | oui | — | — |

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.router._admin_user_out` ([app/modules/accounts/router.py:393](../../app/modules/accounts/router.py#L393))
  - Utilisateur vu par l'administration, avec sa formule en cours

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Accès support retiré ».
- `result` : objet AdminUserOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `email` | string | oui | — | — |
| `full_name` | string | oui | — | — |
| `status` | string | oui | — | — |
| `is_admin` | boolean | oui | — | — |
| `email_verified_at` | string (date-time) (ou null) | oui | — | — |
| `mfa_enabled` | boolean | oui | — | — |
| `last_login_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `plan_code` | string (ou null) | non | — | — |
| `role` | string (ou null) | non | — | — |
| `support_access_until` | string (date-time) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | non |
| `404` | Introuvable ou inaccessible | « Aucun accès support pour ce compte »; « Utilisateur introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-040 — Action sur un compte (suspendre, réactiver, renvoyer la vérification)

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Administration des comptes (support, métier) |
| Méthode | `POST` |
| Chemin | `/api/v1/admin/users/{user_id}/{action}` |
| Fonction | `admin_user_action` — [app/modules/accounts/router.py:438](../../app/modules/accounts/router.py#L438) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_integrations, test_lot7_administration, test_module_12_administration) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Action d'administration sur un compte : suspendre, reactiver, renvoyer la verification

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.**

| Nom | Emplacement | Type | Obligatoire | Contraintes | Description |
|---|---|---|---|---|---|
| `user_id` | chemin | string (uuid) | oui | — | — |
| `action` | chemin | string | oui | — | — |

**Corps de la requête.** Aucun corps attendu.

**Validations.**

- Validation automatique des types, des champs obligatoires et des contraintes ci-dessus : 422, erreurs par champ `{champ: [messages]}`.
- Contrôle dans le code (422) : user : ['Action impossible sur votre propre compte']

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : compte cible, qui doit exister et ne pas etre supprime
- Un administrateur ne peut pas agir sur son propre compte
- Suspension : le compte est bloque ; ses sessions (invisibles a l'administrateur sous la securite par ligne) deviennent inutilisables, car chaque requete verifie que le compte est actif
- Une adresse jamais confirmee reste a confirmer : le compte repasse en attente de verification
- Trace d'audit de l'action puis enregistrement
- Fonction `accounts.router._admin_user_out` ([app/modules/accounts/router.py:393](../../app/modules/accounts/router.py#L393))
  - Utilisateur vu par l'administration, avec sa formule en cours
- Fonction `accounts.service.send_verification` ([app/modules/accounts/service.py:663](../../app/modules/accounts/service.py#L663)) : Lien de verification mis en file ; commit fait par l'appelant

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`, message : « Action effectuée ».
- `result` : objet AdminUserOut (ou null).

| Champ de `result` | Type | Toujours présent | Contraintes | Description |
|---|---|---|---|---|
| `id` | string (uuid) | oui | — | — |
| `email` | string | oui | — | — |
| `full_name` | string | oui | — | — |
| `status` | string | oui | — | — |
| `is_admin` | boolean | oui | — | — |
| `email_verified_at` | string (date-time) (ou null) | oui | — | — |
| `mfa_enabled` | boolean | oui | — | — |
| `last_login_at` | string (date-time) (ou null) | oui | — | — |
| `created_at` | string (date-time) | oui | — | — |
| `plan_code` | string (ou null) | non | — | — |
| `role` | string (ou null) | non | — | — |
| `support_access_until` | string (date-time) (ou null) | non | — | — |

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (3) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | oui (1) |
| `404` | Introuvable ou inaccessible | « Action inconnue »; « Utilisateur introuvable » | non |
| `422` | Données invalides | données ou paramètres invalides; « user : ['Action impossible sur votre propre compte'] » | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-041 — Vue d'ensemble métier (formules, abonnements)

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Administration des comptes (support, métier) |
| Méthode | `GET` |
| Chemin | `/api/v1/admin/business/overview` |
| Fonction | `business_overview` — [app/modules/accounts/router.py:466](../../app/modules/accounts/router.py#L466) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 3 test(s) (test_lot7_administration) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Vue d'ensemble métier (formules, abonnements).

**Authentification et autorisations.**

- **Permission de plateforme** `platform.billing.manage` (rôles PLAA en cours de validité, référentiel `role_permissions`) avec un jeton d'accès valide ; sinon 401, puis 403.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Fonction `accounts.service.business_overview` ([app/modules/accounts/service.py:850](../../app/modules/accounts/service.py#L850)) : Indicateurs de l'administrateur metier : formules, abonnements par formule et par etat, revenu mensuel estime, inscriptions. Agregats seulement (aucune adresse, aucun nom), calcules sous le role de maintenance : la securite par ligne ne donne pas a ce role la lecture des abonnements des autres comptes. La consultation est journalisee.

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | oui (2) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---

### API-ACC-042 — Statistiques de la plateforme

| Élément | Valeur |
|---|---|
| Module | Comptes et abonnements (`app/modules/accounts`, spéc. I) |
| Sous-module | Administration des comptes (support, métier) |
| Méthode | `GET` |
| Chemin | `/api/v1/admin/stats` |
| Fonction | `admin_stats` — [app/modules/accounts/router.py:472](../../app/modules/accounts/router.py#L472) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_integrations) |
| Utilisée par l'interface web | oui (`src/modules/accounts/api.js`) |

**Description** (commentaire et docstring du code). Statistiques globales de la plateforme

**Authentification et autorisations.**

- **Administrateur** : jeton d'accès valide (`Authorization: Bearer <jeton>`, session active) et compte administrateur (`is_admin`, rôle de plateforme ADMIN_TECH) ; sinon 401, puis 403.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : nombre d'abonnements payants actifs
- Requetes : utilisateurs actifs, taches non supprimees, elements recus

**Réponse en cas de succès.**

- Code HTTP **200**, enveloppe commune `{statusCode, httpStatus, message, result}`.
- `result` : objet (clés libres) (ou null).

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |
| `401` | Non authentifié ou session invalide | jeton absent, invalide, expiré ou session révoquée | non |
| `403` | Accès refusé | droit d'administration ou permission manquant | non |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
