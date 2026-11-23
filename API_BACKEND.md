# API du backend BringoMind pour l'application mobile

Référence préparée à partir du dépôt `pascalniyo/biringomind-backend-ref` (cloné le 23/11/2026) :
contrat OpenAPI **2.11.0** (`docs/openapi.json`), catalogue `API/catalogue_api.json`, `API/CONVENTIONS.md`
et `docs/NOTE_EQUIPE_MOBILE.md`.

- **297 routes** au total dans le backend.
- **227 routes utiles au mobile**, listées ci-dessous par écran.
- **70 routes écartées** : administration, rapports, webhooks, retours OAuth, Web Push du navigateur (voir § 5).

Le détail complet de chaque route (champs, validations, codes d'erreur) est copié dans ce dépôt :
[`docs/backend/`](docs/backend/README.md) : contrat `openapi.json`, conventions et une fiche par module.

## Environnement

| Élément | Valeur |
|---|---|
| Domaine (VPS) | `https://app.bringomind.com` : interface web et API sur le même domaine |
| Base de l'API | `https://app.bringomind.com/api/v1` |
| Supervision | `GET https://app.bringomind.com/health` (hors préfixe) |
| Variable du mobile | `EXPO_PUBLIC_API_URL=https://app.bringomind.com` : **sans** `/api/v1`, ajouté par `src/lib/config.ts` |
| Swagger (`/docs`, `/openapi.json`) | **Fermé au public** par Nginx (accès local au serveur seulement) : utiliser `docs/backend/openapi.json` |
| HTTPS | Obligatoire (redirection 80 → 443, HSTS) ; le cookie `bm_refresh` est `Secure` en production |
| Limites Nginx | Connexion, inscription, mot de passe oublié, renvoi de vérification : 10 requêtes/min par IP ; reste de l'API : 20 requêtes/s |
| Taille maximale d'un envoi | 30 Mo (documents : 25 Mo) |

Pour tester sur un backend local (`start-dev.bat`, port 8000), mettre l'adresse IP du PC dans `.env.local`, par exemple `EXPO_PUBLIC_API_URL=http://192.168.1.10:8000`. `localhost` désigne le téléphone lui-même, pas le PC.

---

## 1. Conventions du backend (différentes de notre socle actuel)

### 1.1 Enveloppe de réponse

Toute réponse JSON (succès comme erreur) est enveloppée :

```json
{ "statusCode": 201, "httpStatus": "CREATED", "message": "Tâche créée", "result": { "...": "..." } }
```

→ Le client mobile doit **renvoyer `result`** aux services, pas le corps entier.
Exceptions (pas d'enveloppe) : téléchargements de fichiers, `GET /accounts/me/export`, `GET /health`.

### 1.2 Erreurs

- Par défaut : même enveloppe, `message` traduit, et pour une 422 `result = {"champ": ["message", ...]}`.
- **Sur demande** (`Accept: application/problem+json`) : format RFC 9457 `{type, title, status, detail, instance, errors: [{field, message}], result}`.
  → Le mobile enverra cet en-tête : notre `ApiError` sait déjà le lire.
- Il n'y a **pas de champ `code`** : le code d'erreur se déduit du statut HTTP.
- `403` avec `result.feature` = fonction désactivée par l'administrateur (§ 1.6).
- `429` : `Retry-After` (secondes).
- `404` aussi pour une donnée qui existe mais appartient à un autre utilisateur.

### 1.3 Authentification ⚠️ point clé pour le mobile

| Élément | Règle du backend |
|---|---|
| Connexion | `POST /auth/login` `{email, password, mfa_code?, remember_me=true, device_name?}` → `result = {access_token, token_type, expires_in, user}` |
| Jeton d'accès | JWT de **15 minutes**, envoyé en `Authorization: Bearer` |
| Jeton de renouvellement | **uniquement dans un cookie `httpOnly` `bm_refresh`** (chemin `/api/v1/auth`, 30 jours). **Il n'apparaît jamais dans le corps de la réponse** |
| Renouvellement | `POST /auth/refresh` **sans corps** : le cookie est renvoyé automatiquement. Rotation à chaque appel ; une réutilisation révoque toute la famille de sessions |
| Déconnexion | `POST /auth/logout` : la session est retrouvée par le cookie, qui est effacé |
| Inscription | `POST /auth/register` → **202 sans jeton** : l'utilisateur doit vérifier son e-mail, puis se connecter |

**Conséquences pour notre socle `src/lib`** :
- le client doit envoyer les requêtes `/auth/*` avec `credentials: 'include'`. React Native stocke les cookies dans le magasin natif (iOS et Android), qui les conserve entre deux lancements ;
- `TokenResponse` n'a pas de `refresh_token`, et `refreshTokens()` ne doit pas envoyer de corps ;
- seul le jeton d'accès est gardé (mémoire, ou Keychain pour un démarrage plus rapide). Au lancement, la session se restaure par `POST /auth/refresh` : succès = connecté, 401 = écran de connexion ;
- un appel `refresh` à la fois (déjà le cas), sinon la rotation révoque la session ;
- **à valider avec l'équipe backend** : ce mode par cookie fonctionne, mais un renouvellement par jeton dans le corps (`refresh_token` en entrée et en sortie, rangé dans le Keychain) serait plus classique pour une application mobile. À demander si les cookies posent problème sur un appareil.

### 1.4 Idempotence

- En-tête `Idempotency-Key` de **8 à 80 caractères** (nos UUID font 36 : OK).
- **Obligatoire** sur `POST /events`, `PATCH /events/{id}`, `POST /events/{id}/cancel`, `POST /action-requests`, `POST /mail/drafts`.
- Facultatif (mais conseillé) sur `POST /tasks`, `POST /events/local`, messages de l'assistant, confirmation d'extraction, etc.
- Notre client l'ajoute déjà sur tout `POST` ; il faudra aussi le passer sur les deux routes `PATCH`/`cancel` d'événement externe.

### 1.5 Pagination

`page` / `page_size` (1 à 100, 20 par défaut) **ou** `cursor` / `limit`.
Réponse : `result = {items, total, page, page_size, next_cursor}` (`next_cursor = null` en fin de liste).
`GET /tasks` refuse les paramètres inconnus (422) : n'envoyer que les filtres documentés.

### 1.6 Drapeaux de fonctionnalité

`GET /feature-flags` après connexion. **Désactivés dans PLAA** :

| Drapeau | Écrans mobiles concernés |
|---|---|
| `voice.enabled` | VoiceCommandScreen |
| `email.sync.enabled` | ConnectedAccounts (messagerie), EmailViewerScreen |
| `billing.enabled` | SubscriptionScreen : souscription, changement et reprise de formule |
| `calendar.external.enabled` | ConnectedAccounts (calendriers), événements externes |

Activés : `households.enabled`, `ai.assistant.enabled`, `documents.ocr.enabled`. Masquer toute fonction désactivée plutôt qu'afficher une erreur.

### 1.7 Langue, limites, push

- `Accept-Language` sur chaque requête (`fr` par défaut ; 9 langues dont `rn`, `rw`, `sw`) : les messages arrivent déjà traduits.
- Limites par minute sur les `POST` : connexion 20, inscription 10, mot de passe oublié 5, renvoi de vérification 5, documents 60, voix 30.
- Notifications push : `POST /notifications/push-devices` `{platform: android|ios, token (FCM), device_name?, os_version?, app_version?}` à la connexion, `DELETE` à la déconnexion. Jeton **FCM** (Firebase), pas un jeton Expo.

### 1.8 Valeurs à respecter (écarts avec notre doc API.md)

| Donnée | Valeurs du backend |
|---|---|
| Priorité de tâche (`priority`) | `low`, `normal`, `high`, `critical` (texte) ; `priority_level` entier en lecture |
| Statut de tâche | `inbox`, `needs_review`, `planned`, `in_progress`, `deferred`, `blocked`, `completed`, `cancelled`, `archived` |
| Échéance de tâche | `due_date` (AAAA-MM-JJ) + `due_time` facultatif en entrée ; `due_at` calculé en sortie |
| Version | `version` obligatoire dans `PATCH /tasks/{id}` (409 si modifiée entre-temps) |
| Rôle dans un foyer | `owner`, `admin`, `member`, `viewer` (s'appuyer sur le code, jamais sur le rang) |
| Statut d'événement | `confirmed`, `cancelled` |
| Utilisateur (`UserOut`) | `id, email, full_name, locale, timezone, currency, status, role, is_admin, mfa_enabled, email_verified_at, inbox_alias, dashboard_preferences, created_at` |

---

## 2. Les routes par écran mobile

### 0. Démarrage (3)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| GET | `/auth/public-config` | Paramètres publics de l'interface | Splash : config publique | public |
| GET | `/feature-flags` | Drapeaux de fonctionnalité de l'utilisateur | Splash + après connexion : fonctions actives |  |
| GET | `/health` | État de santé de l'API | Vérifier que l'API répond | public |

### 1. Authentification (11)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| POST | `/auth/register` | Inscription | RegisterScreen | fournisseur à configurer, public |
| POST | `/auth/resend-verification` | Renvoi du lien de vérification (sans connexion) | VerifyEmailScreen | fournisseur à configurer, public |
| POST | `/auth/login` | Connexion | LoginScreen | public |
| POST | `/auth/refresh` | Renouvellement du jeton d'accès | Client HTTP (automatique) | public |
| POST | `/auth/logout` | Déconnexion | Profil › Déconnexion | public |
| POST | `/auth/confirm-email-change` | Confirmation du changement d'adresse e-mail | Lien profond (changement d'e-mail) | public |
| POST | `/auth/verify-email` | Vérification de l'adresse e-mail | VerifyEmailScreen (lien profond) | public |
| POST | `/auth/forgot-password` | Mot de passe oublié | ForgotPasswordScreen | fournisseur à configurer, public |
| POST | `/auth/reset-password` | Réinitialisation du mot de passe | ResetPasswordScreen (lien profond) | public |
| GET | `/settings/onboarding` | État du parcours de première utilisation | OnboardingScreen |  |
| POST | `/settings/onboarding/complete` | Fin du parcours de première utilisation | OnboardingScreen |  |

### 2. Profil et compte (25)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| GET | `/accounts/me` | Profil de l'utilisateur connecté | ProfileSettings / CompleteProfile |  |
| PATCH | `/accounts/me` | Modification du profil | ProfileSettings / CompleteProfile |  |
| POST | `/accounts/me/email` | Demande de changement d'adresse e-mail | ProfileSettings | fournisseur à configurer |
| POST | `/accounts/me/password` | Changement du mot de passe | ProfileSettings |  |
| GET | `/accounts/me/sessions` | Liste des sessions et appareils | PrivacyData › Sessions et appareils |  |
| DELETE | `/accounts/me/sessions` | Révocation de toutes les autres sessions | PrivacyData › Sessions et appareils |  |
| DELETE | `/accounts/me/sessions/{session_id}` | Révocation d'une session | PrivacyData › Sessions et appareils |  |
| POST | `/accounts/me/mfa/setup` | Préparation de la double authentification | ProfileSettings › Double authentification |  |
| POST | `/accounts/me/mfa/enable` | Activation de la double authentification | ProfileSettings › Double authentification |  |
| GET | `/accounts/me/mfa` | État de la double authentification | ProfileSettings › Double authentification |  |
| POST | `/accounts/me/mfa/recovery-codes` | Régénération des codes de secours | ProfileSettings › Double authentification |  |
| POST | `/accounts/me/mfa/disable` | Désactivation de la double authentification | ProfileSettings › Double authentification |  |
| POST | `/accounts/me/verification` | Renvoi du lien de vérification (connecté) | ProfileSettings (e-mail non vérifié) | fournisseur à configurer |
| GET | `/accounts/me/export` | Export immédiat des données du compte (JSON) | PrivacyData |  |
| POST | `/accounts/me/delete` | Demande de suppression du compte (confirmée par mot de passe, délai de 7 jours) | PrivacyData |  |
| GET | `/settings` | Paramètres personnels | PreferencesScreen |  |
| PATCH | `/settings` | Modification des paramètres personnels | PreferencesScreen |  |
| GET | `/privacy/requests` | Historique des demandes (export, suppression) | PrivacyDataScreen |  |
| POST | `/privacy/exports` | Demande d'export des données | PrivacyDataScreen |  |
| GET | `/privacy/exports/{request_id}/download` | Téléchargement de l'export des données | PrivacyDataScreen |  |
| GET | `/privacy/deletion/households` | Foyers à traiter avant la suppression du compte | PrivacyDataScreen |  |
| POST | `/privacy/deletion` | Demande de suppression du compte (délai de 7 jours) | PrivacyDataScreen | fournisseur à configurer |
| POST | `/privacy/deletion/cancel` | Annulation de la demande de suppression | PrivacyDataScreen |  |
| GET | `/privacy/consents` | Consentements | PrivacyDataScreen |  |
| PUT | `/privacy/consents/{purpose}` | Modification d'un consentement | PrivacyDataScreen |  |

### 3. Tableau de bord (5)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| GET | `/dashboard` | Tableau de bord du jour | DashboardScreen |  |
| GET | `/briefings/daily` | Synthèse quotidienne | DashboardScreen |  |
| GET | `/briefings/weekly` | Synthèse hebdomadaire | DashboardScreen |  |
| GET | `/planning/summary-preferences` | Préférences des synthèses | DashboardScreen |  |
| PUT | `/planning/summary-preferences` | Modification des préférences des synthèses | DashboardScreen |  |

### 4. Tâches (25)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| GET | `/categories` | Liste des catégories de tâches | TaskList / TaskDetail / TaskForm |  |
| POST | `/categories` | Création d'une catégorie de tâches | TaskList / TaskDetail / TaskForm |  |
| PATCH | `/categories/{category_id}` | Renommage d'une catégorie de tâches | TaskList / TaskDetail / TaskForm |  |
| DELETE | `/categories/{category_id}` | Suppression d'une catégorie de tâches | TaskList / TaskDetail / TaskForm |  |
| GET | `/tasks` | Liste et recherche des tâches | TaskList / TaskDetail / TaskForm |  |
| POST | `/tasks` | Création d'une tâche | TaskList / TaskDetail / TaskForm | Idempotency-Key conseillée |
| GET | `/tasks/trash` | Corbeille des tâches | TaskList / TaskDetail / TaskForm |  |
| GET | `/tasks/{task_id}` | Fiche d'une tâche | TaskList / TaskDetail / TaskForm |  |
| PATCH | `/tasks/{task_id}` | Modification d'une tâche | TaskList / TaskDetail / TaskForm |  |
| DELETE | `/tasks/{task_id}` | Suppression d'une tâche (corbeille) | TaskList / TaskDetail / TaskForm |  |
| POST | `/tasks/{task_id}/restore` | Restauration d'une tâche supprimée | TaskList / TaskDetail / TaskForm |  |
| POST | `/tasks/{task_id}/archive` | Archivage d'une tâche | TaskList / TaskDetail / TaskForm |  |
| POST | `/tasks/{task_id}/unarchive` | Désarchivage d'une tâche | TaskList / TaskDetail / TaskForm |  |
| POST | `/tasks/{task_id}/complete` | Achèvement d'une tâche | TaskList / TaskDetail / TaskForm |  |
| GET | `/tasks/{task_id}/occurrences` | Prochaines occurrences d'une tâche récurrente | TaskList / TaskDetail / TaskForm |  |
| POST | `/tasks/{task_id}/confirm` | Confirmation d'une tâche proposée | TaskList / TaskDetail / TaskForm |  |
| POST | `/tasks/{task_id}/assignment` | Réponse à une attribution (accepter ou refuser) | TaskList / TaskDetail / TaskForm |  |
| GET | `/tasks/{task_id}/history` | Historique d'une tâche | TaskList / TaskDetail / TaskForm |  |
| GET | `/planning/slots` | Créneaux libres d'une journée | TaskList (priorités, créneaux) |  |
| POST | `/tasks/{task_id}/breakdown` | Découpage d'une tâche en étapes (IA) | TaskDetail (planification intelligente) | fournisseur à configurer |
| GET | `/planning/priorities` | Score de priorité des tâches | TaskList (priorités, créneaux) |  |
| POST | `/planning/priorities/suggestions` | Calcul de suggestions de priorité | TaskList (priorités, créneaux) |  |
| GET | `/planning/priorities/suggestions` | Suggestions de priorité en attente | TaskList (priorités, créneaux) |  |
| POST | `/planning/priorities/suggestions/{suggestion_id}` | Décision sur une suggestion de priorité | TaskList (priorités, créneaux) |  |
| POST | `/planning/tasks/{task_id}/reschedule` | Proposition de replanification d'une tâche | TaskDetail (planification intelligente) |  |

### 5. Rappels (10)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| GET | `/tasks/{task_id}/reminders` | Rappels d'une tâche | TaskDetail › Rappels |  |
| POST | `/tasks/{task_id}/reminders` | Création d'un rappel sur une tâche | TaskDetail › Rappels |  |
| GET | `/events/{event_id}/reminders` | Rappels d'un événement | EventDetail › Rappels |  |
| POST | `/events/{event_id}/reminders` | Création d'un rappel sur un événement | EventDetail › Rappels |  |
| GET | `/reminders` | Liste de tous ses rappels | ReminderList / ReminderForm |  |
| POST | `/reminders` | Création d'un rappel (tâche ou événement) | ReminderList / ReminderForm |  |
| PATCH | `/reminders/{reminder_id}` | Modification d'un rappel | ReminderList / ReminderForm |  |
| POST | `/reminders/{reminder_id}/snooze` | Report d'un rappel | ReminderList / ReminderForm |  |
| POST | `/reminders/{reminder_id}/reactivate` | Réactivation d'un rappel | ReminderList / ReminderForm |  |
| DELETE | `/reminders/{reminder_id}` | Suppression d'un rappel | ReminderList / ReminderForm |  |

### 5 bis. Notifications (12)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| POST | `/notifications/push-devices` | Enregistrement d'une application mobile (Android, iOS) pour les notifications | Au login / logout (jeton push) | fournisseur à configurer |
| DELETE | `/notifications/push-devices` | Désinscription d'une application mobile | Au login / logout (jeton push) |  |
| GET | `/notifications/preferences` | Préférences de notification | NotificationSettingsScreen |  |
| PUT | `/notifications/preferences` | Modification des préférences de notification | NotificationSettingsScreen |  |
| GET | `/notifications` | Liste des notifications | NotificationCenter / NotificationSettings |  |
| GET | `/notifications/unread-count` | Nombre de notifications non lues | NotificationCenter / NotificationSettings |  |
| POST | `/notifications/{notification_id}/read` | Marquer une notification comme lue | NotificationCenter / NotificationSettings |  |
| POST | `/notifications/read-all` | Marquer toutes les notifications comme lues | NotificationCenter / NotificationSettings |  |
| DELETE | `/notifications/{notification_id}` | Suppression d'une notification | NotificationCenter / NotificationSettings |  |
| GET | `/notifications/deliveries` | Historique de ses envois | NotificationCenter / NotificationSettings |  |
| GET | `/notifications/web-push/devices` | Liste des appareils abonnés (navigateurs et applications mobiles) | Appareils connectés (liste/révocation) |  |
| DELETE | `/notifications/web-push/devices/{device_id}` | Révocation d'un appareil abonné (navigateur ou mobile) | Appareils connectés (liste/révocation) |  |

### 6. Calendrier (12)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| GET | `/events` | Liste des événements (jour, semaine, mois) | Calendar / Agenda / EventDetail / EventForm |  |
| GET | `/events/conflicts/check` | Vérification de conflit pour un créneau | Calendar / Agenda / EventDetail / EventForm |  |
| GET | `/events/conflicts` | Conflits d'agenda d'une période | Calendar / Agenda / EventDetail / EventForm |  |
| POST | `/events` | Création d'un événement dans un calendrier externe | Calendar / Agenda / EventDetail / EventForm | drapeau `calendar.external.enabled`, **Idempotency-Key obligatoire**, fournisseur à configurer |
| PATCH | `/events/{event_id}` | Modification d'un événement externe | Calendar / Agenda / EventDetail / EventForm | drapeau `calendar.external.enabled`, **Idempotency-Key obligatoire**, fournisseur à configurer |
| POST | `/events/{event_id}/cancel` | Annulation d'un événement externe | Calendar / Agenda / EventDetail / EventForm | drapeau `calendar.external.enabled`, **Idempotency-Key obligatoire**, fournisseur à configurer |
| POST | `/events/local` | Création d'un événement local | Calendar / Agenda / EventDetail / EventForm | Idempotency-Key conseillée |
| PATCH | `/events/{event_id}/local` | Modification d'un événement local | Calendar / Agenda / EventDetail / EventForm |  |
| POST | `/events/{event_id}/local/cancel` | Annulation d'un événement local | Calendar / Agenda / EventDetail / EventForm |  |
| PUT | `/events/{event_id}/attendees/{attendee_id}` | Réponse d'un participant | Calendar / Agenda / EventDetail / EventForm |  |
| GET | `/calendar/work-hours` | Horaires de travail | Calendar / Agenda / EventDetail / EventForm |  |
| PUT | `/calendar/work-hours` | Modification des horaires de travail | Calendar / Agenda / EventDetail / EventForm |  |

### 7. Foyer (20)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| GET | `/households/{household_id}/tasks` | Tâches partagées d'un foyer | HouseholdHome › Tâches partagées |  |
| GET | `/households` | Liste de ses foyers | Écrans household/* |  |
| POST | `/households` | Création d'un foyer | Écrans household/* | drapeau `households.enabled` |
| GET | `/households/{household_id}/members` | Membres d'un foyer | Écrans household/* |  |
| POST | `/households/{household_id}/invitations` | Invitation d'un membre | Écrans household/* | drapeau `households.enabled`, fournisseur à configurer |
| GET | `/households/invitations/preview` | Aperçu d'une invitation | Écrans household/* |  |
| POST | `/households/invitations/decline` | Refus d'une invitation | Écrans household/* |  |
| GET | `/households/{household_id}/invitations` | Invitations en attente d'un foyer | Écrans household/* |  |
| POST | `/households/{household_id}/invitations/{invitation_id}/resend` | Renvoi d'une invitation | Écrans household/* | drapeau `households.enabled`, fournisseur à configurer |
| PATCH | `/households/{household_id}` | Modification d'un foyer (nom, fuseau, devise) | Écrans household/* | drapeau `households.enabled` |
| POST | `/households/{household_id}/transfer` | Transfert de la propriété du foyer | Écrans household/* | drapeau `households.enabled` |
| GET | `/households/{household_id}/activity` | Activité récente du foyer | Écrans household/* |  |
| DELETE | `/households/{household_id}/invitations/{invitation_id}` | Annulation d'une invitation | Écrans household/* |  |
| PATCH | `/households/{household_id}/members/{member_id}` | Changement du rôle d'un membre | Écrans household/* | drapeau `households.enabled` |
| POST | `/households/invitations/accept` | Acceptation d'une invitation | Écrans household/* | drapeau `households.enabled` |
| DELETE | `/households/{household_id}/members/{member_id}` | Retrait d'un membre ou départ du foyer | Écrans household/* |  |
| GET | `/households/{household_id}/events` | Calendrier du foyer | Écrans household/* |  |
| POST | `/households/{household_id}/events` | Création d'un événement du foyer | Écrans household/* | drapeau `households.enabled` |
| PATCH | `/households/{household_id}/events/{event_id}` | Modification d'un événement du foyer | Écrans household/* | drapeau `households.enabled` |
| DELETE | `/households/{household_id}/events/{event_id}` | Annulation d'un événement du foyer | Écrans household/* |  |

### 8. Documents (40)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| POST | `/documents` | Dépôt direct d'un document | DocumentList / DocumentDetail | fournisseur à configurer |
| DELETE | `/documents/{document_id}` | Suppression d'un document (corbeille) | DocumentList / DocumentDetail |  |
| GET | `/documents/{document_id}/download` | Téléchargement d'un document | DocumentList / DocumentDetail |  |
| POST | `/documents/uploads` | Téléversement, étape 1 : ouverture de l'envoi | DocumentList / DocumentDetail | fournisseur à configurer |
| PUT | `/documents/uploads/{upload_id}/content` | Téléversement, étape 2 : envoi du contenu (URL signée) | DocumentList / DocumentDetail | fournisseur à configurer, public |
| POST | `/documents/uploads/{upload_id}/confirm` | Téléversement, étape 3 : confirmation et lancement du traitement | DocumentList / DocumentDetail | fournisseur à configurer |
| POST | `/documents/reauthenticate` | Confirmation d'identité avant l'accès à un document sensible | DocumentList / DocumentDetail |  |
| GET | `/documents` | Liste et recherche des documents | DocumentList / DocumentDetail |  |
| GET | `/document-categories` | Liste des catégories de documents | DocumentList / DocumentDetail |  |
| POST | `/document-categories` | Création d'une catégorie de documents | DocumentList / DocumentDetail |  |
| PATCH | `/document-categories/{category_id}` | Renommage d'une catégorie de documents | DocumentList / DocumentDetail |  |
| DELETE | `/document-categories/{category_id}` | Suppression d'une catégorie de documents | DocumentList / DocumentDetail |  |
| GET | `/document-tags` | Liste des étiquettes de documents | DocumentList / DocumentDetail |  |
| GET | `/documents/trash` | Corbeille des documents | DocumentList / DocumentDetail |  |
| GET | `/documents/{document_id}` | Fiche d'un document | DocumentList / DocumentDetail |  |
| GET | `/documents/{document_id}/processing` | Suivi du traitement d'un document | DocumentList / DocumentDetail |  |
| POST | `/documents/{document_id}/reprocess` | Relance d'un traitement en échec | DocumentList / DocumentDetail | fournisseur à configurer |
| POST | `/documents/{document_id}/summary` | Résumé d'un document par l'IA | DocumentList / DocumentDetail | fournisseur à configurer |
| POST | `/documents/{document_id}/restore` | Restauration d'un document supprimé | DocumentList / DocumentDetail |  |
| PATCH | `/documents/{document_id}` | Modification d'un document (titre, catégorie, étiquettes, conservation) | DocumentList / DocumentDetail |  |
| POST | `/documents/{document_id}/links` | Création d'un lien temporaire de consultation ou de téléchargement | DocumentList / DocumentDetail |  |
| POST | `/documents/{document_id}/archive` | Archivage d'un document | DocumentList / DocumentDetail |  |
| POST | `/documents/{document_id}/unarchive` | Désarchivage d'un document | DocumentList / DocumentDetail |  |
| POST | `/documents/{document_id}/ai-consent` | Autorisation de l'analyse par l'IA pour un document | DocumentList / DocumentDetail |  |
| PUT | `/documents/{document_id}/expiry` | Date d'expiration d'un document | DocumentList / DocumentDetail |  |
| GET | `/documents/{document_id}/versions` | Liste des versions d'un document | DocumentList / DocumentDetail |  |
| POST | `/documents/{document_id}/versions/{number}/restore` | Restauration d'une ancienne version | DocumentList / DocumentDetail |  |
| DELETE | `/documents/{document_id}/versions/{number}` | Suppression d'une version non active | DocumentList / DocumentDetail |  |
| GET | `/extractions` | Liste des extractions à revoir | Revue des extractions (pas encore d'écran) |  |
| GET | `/extractions/{extraction_id}` | Détail d'une extraction | Revue des extractions (pas encore d'écran) |  |
| PATCH | `/extractions/{extraction_id}/fields` | Correction d'un champ extrait | Revue des extractions (pas encore d'écran) |  |
| POST | `/extractions/{extraction_id}/confirm` | Confirmation d'une extraction (création des tâches) | Revue des extractions (pas encore d'écran) | Idempotency-Key conseillée |
| POST | `/extractions/{extraction_id}/reject` | Rejet d'une extraction | Revue des extractions (pas encore d'écran) |  |
| GET | `/vault` | Liste des documents du coffre-fort | Coffre-fort (pas encore d'écran) |  |
| POST | `/vault` | Ajout d'un document au coffre-fort | Coffre-fort (pas encore d'écran) |  |
| PATCH | `/vault/{record_id}` | Modification d'une fiche du coffre-fort | Coffre-fort (pas encore d'écran) |  |
| POST | `/vault/{record_id}/versions` | Nouvelle version d'un document du coffre-fort | Coffre-fort (pas encore d'écran) | fournisseur à configurer |
| GET | `/vault/{record_id}/history` | Historique des versions et des accès | Coffre-fort (pas encore d'écran) |  |
| GET | `/vault/{record_id}/download` | Téléchargement depuis le coffre-fort | Coffre-fort (pas encore d'écran) |  |
| DELETE | `/vault/{record_id}` | Retrait du coffre-fort | Coffre-fort (pas encore d'écran) |  |

### 9. Assistant (21)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| GET | `/assistant/conversations` | Liste des conversations | AssistantScreen |  |
| POST | `/assistant/conversations` | Création d'une conversation | AssistantScreen | drapeau `ai.assistant.enabled`, Idempotency-Key conseillée |
| GET | `/assistant/conversations/{conversation_id}` | Conversation et ses messages | AssistantScreen |  |
| PATCH | `/assistant/conversations/{conversation_id}` | Renommage d'une conversation | AssistantScreen |  |
| POST | `/assistant/conversations/{conversation_id}/archive` | Archivage d'une conversation | AssistantScreen |  |
| POST | `/assistant/conversations/{conversation_id}/unarchive` | Désarchivage d'une conversation | AssistantScreen |  |
| POST | `/assistant/conversations/{conversation_id}/restore` | Restauration d'une conversation supprimée | AssistantScreen |  |
| DELETE | `/assistant/conversations/{conversation_id}` | Suppression d'une conversation (corbeille) | AssistantScreen |  |
| POST | `/assistant/conversations/{conversation_id}/messages` | Envoi d'un message à l'assistant | AssistantScreen | drapeau `ai.assistant.enabled`, Idempotency-Key conseillée, fournisseur à configurer |
| DELETE | `/assistant/conversations/{conversation_id}/messages/{message_id}` | Suppression d'un message | AssistantScreen |  |
| POST | `/assistant/attachments` | Ajout d'une pièce jointe | AssistantScreen | drapeau `ai.assistant.enabled`, fournisseur à configurer |
| GET | `/assistant/attachments/{attachment_id}/download` | Téléchargement d'une pièce jointe | AssistantScreen |  |
| DELETE | `/assistant/attachments/{attachment_id}` | Suppression d'une pièce jointe | AssistantScreen |  |
| GET | `/assistant/history` | Historique des exécutions de l'assistant | AssistantScreen |  |
| GET | `/assistant/usage` | Consommation de l'assistant | AssistantScreen |  |
| GET | `/action-requests` | Liste des demandes d'action | AssistantScreen (actions à valider) |  |
| POST | `/action-requests` | Préparation d'une action | AssistantScreen (actions à valider) | **Idempotency-Key obligatoire**, fournisseur à configurer |
| PATCH | `/action-requests/{action_id}` | Modification d'une action en attente | AssistantScreen (actions à valider) |  |
| POST | `/action-requests/{action_id}/approve` | Approbation et exécution d'une action | AssistantScreen (actions à valider) | Idempotency-Key conseillée, fournisseur à configurer |
| POST | `/action-requests/{action_id}/reject` | Rejet d'une action | AssistantScreen (actions à valider) |  |
| POST | `/action-requests/{action_id}/confirm-done` | Confirmation d'une action réalisée par l'utilisateur | AssistantScreen (actions à valider) |  |

### 10. Voix (4)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| GET | `/voice/capabilities` | Capacités vocales disponibles | VoiceCommandScreen |  |
| POST | `/voice/notes` | Note vocale (transcription) | VoiceCommandScreen | drapeau `voice.enabled`, Idempotency-Key conseillée, fournisseur à configurer |
| POST | `/voice/commands` | Commande vocale | VoiceCommandScreen | drapeau `voice.enabled`, Idempotency-Key conseillée, fournisseur à configurer |
| POST | `/voice/speech` | Texte à lire à voix haute | VoiceCommandScreen | drapeau `voice.enabled` |

### 11. Intégrations (désactivées dans PLAA) (19)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| GET | `/calendars` | Liste des calendriers connectés | ConnectedAccountsScreen (calendriers) |  |
| GET | `/calendars/providers` | Fournisseurs de calendrier disponibles | ConnectedAccountsScreen (calendriers) | drapeau `calendar.external.enabled` |
| GET | `/calendars/{provider}/authorize` | Connexion d'un calendrier externe (début OAuth) | ConnectedAccountsScreen (calendriers) | drapeau `calendar.external.enabled`, fournisseur à configurer |
| POST | `/calendars/{link_id}/sync` | Synchronisation d'un calendrier connecté | ConnectedAccountsScreen (calendriers) | drapeau `calendar.external.enabled`, fournisseur à configurer |
| DELETE | `/calendars/{link_id}` | Déconnexion d'un calendrier | ConnectedAccountsScreen (calendriers) |  |
| GET | `/calendars/{link_id}/sources` | Calendriers disponibles dans un compte connecté | ConnectedAccountsScreen (calendriers) | drapeau `calendar.external.enabled`, fournisseur à configurer |
| PUT | `/calendars/{link_id}/sources/{calendar_id}` | Sélection d'un calendrier à synchroniser | ConnectedAccountsScreen (calendriers) | drapeau `calendar.external.enabled`, fournisseur à configurer |
| GET | `/mail/accounts` | Comptes de messagerie connectés | ConnectedAccounts (messagerie) / EmailViewerScreen | drapeau `email.sync.enabled` |
| GET | `/mail/{provider}/authorize` | Connexion d'une messagerie (début OAuth) | ConnectedAccounts (messagerie) / EmailViewerScreen | drapeau `email.sync.enabled`, fournisseur à configurer |
| POST | `/mail/accounts/{account_id}/sync` | Synchronisation d'une messagerie | ConnectedAccounts (messagerie) / EmailViewerScreen | drapeau `email.sync.enabled`, fournisseur à configurer |
| DELETE | `/mail/accounts/{account_id}` | Déconnexion d'une messagerie | ConnectedAccounts (messagerie) / EmailViewerScreen | fournisseur à configurer |
| GET | `/mail/messages` | Liste des e-mails analysés | ConnectedAccounts (messagerie) / EmailViewerScreen | drapeau `email.sync.enabled`, fournisseur à configurer |
| GET | `/mail/messages/{message_id}` | Détail d'un e-mail analysé | ConnectedAccounts (messagerie) / EmailViewerScreen | drapeau `email.sync.enabled`, fournisseur à configurer |
| POST | `/mail/messages/{message_id}/proposals/{index}/accept` | Acceptation d'une proposition tirée d'un e-mail | ConnectedAccounts (messagerie) / EmailViewerScreen | drapeau `email.sync.enabled`, fournisseur à configurer |
| POST | `/mail/messages/{message_id}/proposals/{index}/reject` | Rejet d'une proposition tirée d'un e-mail | ConnectedAccounts (messagerie) / EmailViewerScreen | drapeau `email.sync.enabled`, fournisseur à configurer |
| POST | `/mail/messages/{message_id}/exclude` | Exclusion d'un e-mail de l'analyse | ConnectedAccounts (messagerie) / EmailViewerScreen | drapeau `email.sync.enabled`, fournisseur à configurer |
| POST | `/mail/messages/{message_id}/archive` | Archivage d'un e-mail | ConnectedAccounts (messagerie) / EmailViewerScreen | drapeau `email.sync.enabled`, fournisseur à configurer |
| DELETE | `/mail/messages/{message_id}` | Suppression d'un e-mail analysé | ConnectedAccounts (messagerie) / EmailViewerScreen | drapeau `email.sync.enabled`, fournisseur à configurer |
| POST | `/mail/drafts` | Préparation d'un brouillon de réponse | ConnectedAccounts (messagerie) / EmailViewerScreen | drapeau `email.sync.enabled`, **Idempotency-Key obligatoire**, fournisseur à configurer |

### 12. Abonnement (10)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| GET | `/subscriptions/plans` | Liste des formules | SubscriptionScreen | public |
| GET | `/subscriptions/me` | Abonnement en cours | SubscriptionScreen |  |
| GET | `/subscriptions/me/usage` | Consommation des quotas | SubscriptionScreen |  |
| POST | `/subscriptions/checkout` | Souscription (session de paiement) | SubscriptionScreen | drapeau `billing.enabled`, Idempotency-Key conseillée, fournisseur à configurer |
| POST | `/subscriptions/portal` | Accès au portail de facturation | SubscriptionScreen | fournisseur à configurer |
| GET | `/subscriptions/me/invoices` | Liste des factures | SubscriptionScreen | fournisseur à configurer |
| POST | `/subscriptions/me/change` | Changement de formule | SubscriptionScreen | drapeau `billing.enabled`, fournisseur à configurer |
| POST | `/subscriptions/me/cancel` | Résiliation de l'abonnement | SubscriptionScreen | fournisseur à configurer |
| POST | `/subscriptions/me/resume` | Reprise d'un abonnement résilié | SubscriptionScreen | drapeau `billing.enabled`, fournisseur à configurer |
| GET | `/subscriptions/me/invoices/{invoice_id}/download` | Téléchargement d'une facture | SubscriptionScreen | fournisseur à configurer |

### 13. Boîte de réception (sans écran mobile pour l'instant) (8)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| GET | `/source-items` | Liste des éléments reçus | Pas encore d'écran |  |
| POST | `/source-items` | Saisie d'un élément (texte, lien, fichier) | Pas encore d'écran | Idempotency-Key conseillée, fournisseur à configurer |
| GET | `/source-items/{item_id}` | Détail d'un élément reçu | Pas encore d'écran |  |
| POST | `/source-items/{item_id}/convert` | Conversion d'un élément en tâche | Pas encore d'écran |  |
| POST | `/source-items/{item_id}/discard` | Mise à l'écart d'un élément | Pas encore d'écran |  |
| GET | `/inbox/settings` | Réglages de la boîte de réception (adresse de transfert, expéditeurs) | Pas encore d'écran |  |
| PUT | `/inbox/settings` | Modification des réglages de la boîte de réception | Pas encore d'écran |  |
| DELETE | `/source-items/{item_id}` | Archivage d'un élément reçu | Pas encore d'écran |  |

### 14. Autres (facultatif) (2)

| Méthode | Chemin | Rôle | Écran mobile | Notes |
|---|---|---|---|---|
| GET | `/localization/convert` | Conversion de devises | Utilitaire (traduction, devises) | fournisseur à configurer |
| POST | `/localization/translate` | Traduction d'un texte | Utilitaire (traduction, devises) | fournisseur à configurer |

---

## 3. Écrans mobiles sans route backend

| Écran mobile | Situation |
|---|---|
| HelpSupportScreen | Aucune route de support (ticket, contact, FAQ) : contenu statique ou lien e-mail, à confirmer |
| Recherche globale | Pas de route commune : utiliser `q` / `search` de `GET /tasks` et `q` de `GET /documents` |
| BiometricSettingsScreen | Fonction locale (`expo-local-authentication`) : pas de route |
| SplashScreen / WelcomeScreen | `GET /auth/public-config` et `GET /feature-flags` suffisent |

## 4. Points à clarifier avec l'équipe backend

1. **Renouvellement de session sur mobile** : garder le cookie `bm_refresh` (fonctionne avec React Native) ou ajouter un mode par jeton dans le corps ? (§ 1.3)
2. **Liens des e-mails** (vérification, réinitialisation, invitation, changement d'e-mail) : ils pointent vers `https://app.bringomind.com/...`. Pour les ouvrir dans l'application, publier sur ce domaine `/.well-known/apple-app-site-association` (iOS) et `/.well-known/assetlinks.json` (Android) ; le schéma `bringomind://` est déjà déclaré dans `app.json`.
3. **Push** : projet Firebase commun (fichiers `google-services.json` et `GoogleService-Info.plist`) pour obtenir le jeton FCM.
4. ~~URL de l'API~~ : production `https://app.bringomind.com` (fait). Reste à savoir s'il existe un serveur de recette distinct.
5. **Compte de test** sur `app.bringomind.com` pour les essais du mobile, et fonctions activées (`GET /feature-flags`).

## 5. Routes écartées (70)

| Groupe | Nombre | Raison |
|---|---|---|
| Administration (`/admin/*`, `/reports/admin/*`) | 31 | Réservé à l'interface web d'administration |
| Rapports (`/reports/*`) | 30 | Pas d'écran de rapport prévu sur mobile |
| Webhooks, retours OAuth, `/inbound/*`, Web Push du navigateur, URL signée de fichier | 9 | Appelés par des services externes ou par le navigateur, jamais par l'application |

## 6. Ordre de branchement proposé

1. **Socle** : adapter `src/lib/api` (enveloppe `result`, `Accept: application/problem+json`, `Accept-Language`, cookie + refresh sans corps, restauration au lancement).
2. **Phase 2 — Authentification** : register, verify-email, resend, login (MFA), forgot/reset, logout, `GET /accounts/me`, onboarding, garde sur `(main)`, `GET /feature-flags`.
3. **Phase 3 — Tableau de bord** : `GET /dashboard`, `GET /notifications/unread-count`.
4. **Phase 4 — Tâches**, puis **rappels et notifications** (+ push), **calendrier local**, **foyer**, **profil et paramètres**.
5. **Après** : documents (téléversement en 3 étapes), assistant, abonnement ; voix et intégrations quand les drapeaux seront activés.
