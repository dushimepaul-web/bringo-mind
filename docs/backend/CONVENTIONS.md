# Conventions communes à toutes les API

Ces règles s'appliquent à chaque API décrite dans [modules/](modules/). Elles ont été relevées dans le code, aux emplacements indiqués.

## 1. Adresse et version

| Élément | Valeur | Code |
|---|---|---|
| Préfixe de toutes les routes fonctionnelles | `/api/v1` | `APIRouter(prefix="/api/v1/...")` dans chaque `router.py` |
| Route hors préfixe | `GET /health` (supervision) | [app/main.py](../app/main.py) |
| Version du contrat | **2.11.0** (majeure = rupture, mineure = ajout compatible) | `FastAPI(version=...)` dans [app/main.py](../app/main.py) ; historique : [docs/API_CHANGELOG.md](../docs/API_CHANGELOG.md) |
| Contrat OpenAPI en direct | `/openapi.json`, `/docs` (Swagger), `/redoc` | FastAPI |
| Contrat figé | [docs/openapi.json](../docs/openapi.json) (294 opérations ; les 3 routes cachées n'y figurent pas) | `tools/contrat_openapi.py` |

## 2. Format des réponses

Toute réponse JSON, succès ou erreur, suit la même enveloppe ([app/core/responses.py](../app/core/responses.py)) :

```json
{
  "statusCode": 201,
  "httpStatus": "CREATED",
  "message": "Tâche créée",
  "result": { "...": "contenu propre à la route" }
}
```

| Champ | Contenu |
|---|---|
| `statusCode` | Code HTTP, répété dans le corps |
| `httpStatus` | Libellé du code : `OK`, `CREATED`, `ACCEPTED`, `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `PAYLOAD_TOO_LARGE`, `UNSUPPORTED_MEDIA_TYPE`, `UNPROCESSABLE_ENTITY`, `LOCKED`, `TOO_MANY_REQUESTS`, `INTERNAL_SERVER_ERROR`, `BAD_GATEWAY`, `SERVICE_UNAVAILABLE`, `INSUFFICIENT_STORAGE` |
| `message` | Message lisible, traduit dans la langue de la requête (§ 6) |
| `result` | Données de la route, `null` si aucune ; pour une erreur, détails éventuels (par exemple `{champ: [messages]}`) |

Exceptions, signalées dans chaque fiche (« Réponse directe hors enveloppe ») : téléchargements de fichiers, redirections OAuth, export JSON du compte (`GET /accounts/me/export`), webhook Stripe (`{received, processed}`), et `GET /health` (`{status, env, database, worker}`).

## 3. Erreurs

Gestionnaires centralisés : [app/core/errors.py](../app/core/errors.py).

| Code | Fonction du code | Usage |
|---|---|---|
| 400 | `bad_request` | Requête inexploitable (lien inconnu, signature invalide…) |
| 401 | `unauthorized` | Non connecté, jeton invalide ou expiré, session révoquée, identifiants refusés |
| 403 | `forbidden` | Connecté, mais sans le droit nécessaire |
| 404 | `not_found` | Élément absent **ou inaccessible** : l'API ne révèle pas l'existence d'une donnée d'un autre utilisateur |
| 409 | `conflict` | Conflit avec l'état actuel (version modifiée entre-temps, doublon, état incompatible) |
| 410 | `gone` | A existé, mais n'est plus valable (lien expiré, corbeille dépassée) |
| 422 | `validation_error` et validation automatique | Données invalides ; `result` = `{"champ": ["message", ...]}`, le chemin d'un champ imbriqué est écrit `items.0.title` |
| 429 | `too_many_requests` et limitation de débit | `result.retry_after` et en-tête `Retry-After` (secondes) |
| 500 | gestionnaire général | « Erreur interne du serveur », journalisée avec sa trace, aucun détail exposé |
| 502, 503, 507… | `AppError(code, message)` | Fournisseur externe en erreur ou non configuré, stockage plein |

Les autres erreurs HTTP de FastAPI (route inconnue 404, méthode non autorisée 405) sont remises dans l'enveloppe.

### Format `application/problem+json` (É-30, partie V du cahier des charges)

Disponible depuis le 19/11/2026, **sur demande** : un client qui envoie `Accept: application/problem+json` reçoit toutes ses erreurs au format RFC 9457. Sans cet en-tête, l'enveloppe ci-dessus est inchangée (aucune rupture pour l'interface web et le mobile). Code : `problem()` et `wants_problem_json()` dans [app/core/errors.py](../app/core/errors.py) ; limitation de débit comprise ([app/core/ratelimit.py](../app/core/ratelimit.py)).

```json
{
  "type": "https://bringomind.com/problems/unprocessable-entity",
  "title": "Problème de validation des données",
  "status": 422,
  "detail": "Problème de validation des données",
  "instance": "/api/v1/tasks",
  "errors": [{"field": "title", "message": "Ce champ est obligatoire"}]
}
```

| Membre | Contenu |
|---|---|
| `type` | `https://bringomind.com/problems/<httpStatus en minuscules, tirets>` |
| `title` | Titre court et stable du code, traduit |
| `status` | Code HTTP |
| `detail` | Message précis de l'erreur, traduit |
| `instance` | Chemin de la requête |
| `errors[]` | Erreurs par champ (422) : `{field, message}` |
| `result` | Membre d'extension : détail de l'enveloppe quand il ne s'agit pas d'erreurs par champ (par exemple `{"feature": "billing.enabled"}`, `{"retry_after": 12}`) |

Tests : [tests/test_problem_json.py](../tests/test_problem_json.py).

## 4. Authentification

Code : [app/core/auth.py](../app/core/auth.py), [app/core/security.py](../app/core/security.py), [app/modules/accounts/router.py](../app/modules/accounts/router.py).

| Élément | Règle |
|---|---|
| Jeton d'accès | JWT signé, durée **15 minutes** (`ACCESS_TOKEN_MINUTES`), envoyé dans `Authorization: Bearer <jeton>` |
| Contrôle à chaque requête | Signature et expiration du jeton ; session existante, non révoquée, non expirée et du même utilisateur ; compte au statut actif. Sinon 401 |
| Renouvellement | `POST /api/v1/auth/refresh` avec le cookie `bm_refresh` : `httpOnly`, `Secure` (si `COOKIE_SECURE=true`), `SameSite=Strict`, limité au chemin `/api/v1/auth`. Session de 30 jours (`REFRESH_TOKEN_DAYS`). Le jeton est remplacé à chaque usage ; sa réutilisation révoque toute la famille de sessions |
| « Rester connecté » | Sans cette option, cookie de session effacé à la fermeture du navigateur (marqueur `bm_remember=0`) |
| Double authentification | TOTP, codes de secours ; exigée à la connexion quand elle est activée |
| Applications mobiles | `POST /api/v1/notifications/push-devices` enregistre le jeton FCM de l'application (Android ou iOS) ; `DELETE` le retire à la déconnexion. Voir [modules/06_rappels_et_notifications.md](modules/06_rappels_et_notifications.md) |
| Routes publiques | 19 : inscription, connexion, renouvellement, déconnexion, vérification d'adresse, mot de passe oublié, configuration publique, liste des formules, webhooks (secret ou signature), retours OAuth (état signé), URL signées des documents, `/health`. Le contrôle propre à chacune est décrit dans sa fiche |

## 5. Autorisations

| Niveau | Dépendance du code | Contrôle | Nombre d'API |
|---|---|---|---|
| Utilisateur connecté | `CurrentUser` | Jeton valide ; les lectures et écritures sont limitées aux données de l'utilisateur par la **sécurité par ligne** de PostgreSQL (`use_user_context`) et par les contrôles de propriété du service | 247 |
| Administrateur | `AdminUser` (`require_admin`) | `is_admin` (rôle de plateforme ADMIN_TECH) ; sinon 403 | 29 |
| Permission de plateforme | `require_permission(...)` : `SupportUser` (`platform.user.read`), `BusinessUser` (`platform.billing.manage`) | Rôles PLAA en cours de validité (`user_roles.expires_at`), référentiel `role_permissions` ; sinon 403 | 2 |
| Rôle dans un foyer | `households.service.require_permission(db, foyer, utilisateur, permission)` | `view_tasks` : propriétaire, administrateur, membre, lecteur ; `edit_tasks` et `assign_tasks` : propriétaire, administrateur, membre ; `manage_members` : propriétaire et administrateur (`ROLE_PERMISSIONS`, d'après `household_role_permissions` de PLAA). Réservé au propriétaire (BD-4), sinon 403 : nommer ou retirer un administrateur, transférer le foyer. Non-membre : 404 « Foyer introuvable » (l'existence du foyer n'est pas révélée) ; membre sans la permission : 403 | indiqué dans chaque fiche concernée |
| Fonction activée | `require_feature("<clé>")` ([app/core/auth.py](../app/core/auth.py)) | Drapeau de `feature_flags` actif pour cet utilisateur (fenêtre de dates, déploiement progressif). Sinon 403 « Fonction non activée par l'administrateur », `result = {"feature": "<clé>"}`. Voir § 5 bis | 37 (colonne `drapeau` de [catalogue_api.csv](catalogue_api.csv)) |
| Public | aucune | Voir § 4 | 19 |

### 5 bis. Fonctions soumises à un drapeau (écarts C1 et C2, corrigés le 19/11/2026)

| Drapeau | Valeur dans PLAA | Routes refusées quand il est désactivé | Toujours permis (protection de l'utilisateur) |
|---|---|---|---|
| `voice.enabled` | désactivé | `POST /voice/notes`, `/voice/commands`, `/voice/speech` ; `GET /voice/capabilities` renvoie `enabled: false` | — |
| `email.sync.enabled` | désactivé | les routes `/mail/...` (comptes, autorisation, synchronisation, messages, brouillons) ; retour OAuth redirigé avec `mail_error=403` ; aucune synchronisation périodique | déconnexion d'une messagerie (`DELETE /mail/accounts/{id}`) |
| `billing.enabled` | désactivé | `POST /subscriptions/checkout`, `/me/change`, `/me/resume` | formules, abonnement en cours, consommation, portail, résiliation, factures |
| `calendar.external.enabled` | désactivé | fournisseurs, autorisation, synchronisation, sources, événements externes (`POST /events`, `PATCH /events/{id}`, `POST /events/{id}/cancel`) ; retour OAuth redirigé avec `calendar_error=403` ; aucune synchronisation périodique | liste et déconnexion des calendriers, événements locaux |
| `households.enabled` | activé | création, invitations, modification, transfert, changement de rôle, événements du foyer | consultation, départ ou retrait d'un membre, annulation d'une invitation |
| `ai.assistant.enabled` | activé | création d'une conversation, envoi d'un message, ajout d'une pièce jointe | consultation, archivage, suppression |
| `documents.ocr.enabled` | activé | lecture des scans et images (le document est marqué illisible, comme sans fournisseur) | lecture des PDF à texte |

L'interface lit les mêmes drapeaux (`GET /feature-flags`) : menu masqué et page remplacée par « Fonction non activée ». Tests : [tests/test_drapeaux_fonctionnalites.py](../tests/test_drapeaux_fonctionnalites.py) et le parcours `e2e/09-api-completes.spec.mjs` du frontend.

Les contrôles d'accès appelés par chaque route (fonctions `require_*`, `get_visible`, `*_role`…) sont listés dans sa fiche.

## 6. Langue

- La langue est lue dans l'en-tête **`Accept-Language`** de chaque requête ([app/core/i18n.py](../app/core/i18n.py), `LocaleMiddleware`, exécuté avant tout autre traitement).
- 9 langues : `fr` (par défaut), `en`, `es`, `pt`, `de`, `ar`, `sw`, `rn`, `rw` (catalogues dans [app/locales/](../app/locales/)). Une langue non prise en charge donne le français.
- Sont traduits : le champ `message`, les messages d'erreur par champ, et les titres des notifications produites par le système.

## 7. Pagination et filtres

Code : [app/core/pagination.py](../app/core/pagination.py).

| Paramètre | Règle |
|---|---|
| `page`, `page_size` | Page à partir de 1 ; taille de 1 à 100, 20 par défaut |
| `cursor`, `limit` | Curseur opaque (valeur de `next_cursor`) et taille de 1 à 100 ; prioritaire sur `page` ; curseur illisible : 422 |
| Réponse | `result = {items, total, page, page_size, next_cursor}` ; `next_cursor` vaut `null` en fin de liste |
| Listes à curseur propre | Tâches, documents et e-mails gèrent leur propre curseur |
| Paramètre inconnu | **Refusé (422) seulement sur `GET /api/v1/tasks`** ; les autres listes l'ignorent (écart É-32, décision requise : un refus général serait une rupture de compatibilité) |

## 8. Idempotence

En-tête `Idempotency-Key` (8 à 80 caractères) : une requête rejouée avec la même clé renvoie le premier résultat, sans doublon.

| Route | En-tête |
|---|---|
| `POST /action-requests`, `POST /mail/drafts`, `POST /events`, `PATCH /events/{event_id}`, `POST /events/{event_id}/cancel` | **obligatoire** |
| `POST /tasks`, `POST /source-items`, `POST /extractions/{id}/confirm`, `POST /action-requests/{id}/approve`, `POST /subscriptions/checkout`, `POST /events/local`, `POST /assistant/conversations…` (2 routes), `POST /voice/notes`, `POST /voice/commands` | facultatif (décision DEC-6 : compatibilité des clients existants) |

**Écart connu (É-12)** : le cahier des charges rend l'en-tête obligatoire pour la souscription, l'approbation d'action, la confirmation d'extraction et la création d'événement. Le rendre obligatoire partout est une rupture (version majeure).

## 9. Limitation de débit

Code : [app/core/ratelimit.py](../app/core/ratelimit.py). Seules les requêtes **POST** sont comptées, par adresse IP, sur une fenêtre glissante d'une minute (désactivable par `RATE_LIMIT_ENABLED=false`, utilisé par les tests). Au-delà : 429 et `Retry-After`. En production, Nginx ajoute une limite globale.

| Préfixe | Requêtes par minute |
|---|---|
| `/api/v1/auth/login` | 20 |
| `/api/v1/auth/register` | 10 |
| `/api/v1/auth/forgot-password` | 5 |
| `/api/v1/auth/reset-password` | 10 |
| `/api/v1/auth/verify-email` | 20 |
| `/api/v1/auth/resend-verification` | 5 |
| `/api/v1/auth/confirm-email-change` | 20 |
| `/api/v1/accounts/me/email` | 10 |
| `/api/v1/inbound/` | 120 |
| `/api/v1/documents/reauthenticate` | 10 |
| `/api/v1/documents` (toutes les routes qui commencent ainsi) | 60 |
| `/api/v1/assistant/attachments` | 60 |
| `/api/v1/voice/` | 30 |

## 10. Sécurité des échanges

- En-têtes ajoutés à chaque réponse : `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` ([app/main.py](../app/main.py)).
- CORS : seules les origines de `CORS_ORIGINS` peuvent appeler l'API avec les cookies.
- Fichiers servis : `Cache-Control: private, no-store` et, pour un affichage dans le navigateur, `Content-Security-Policy: sandbox` (aucun script exécuté).
- Les sorties de l'IA sont des données non fiables : rien ne devient une tâche confirmée ni une action exécutée sans validation explicite de l'utilisateur.
- En production, l'application refuse de démarrer sans clé JWT forte, clé de chiffrement, cookies sécurisés, relais e-mail, antivirus et sauvegarde chiffrée (`check_production_settings`).
