# Historique des versions du contrat d'API

Contrat complet : `docs/openapi.json`, aussi servi par l'API à l'adresse `/openapi.json` et consultable sur `/docs`.

**Règles de version :**
- **Majeure** : une opération est retirée ou devient incompatible ; les clients, dont l'application mobile, doivent s'adapter.
- **Mineure** : ajout compatible (nouvelle opération, champ ou en-tête facultatif).
- **Corrective** : documentation ou correction sans changement de contrat.

À chaque modification de l'API, le contrat se régénère avec `python -m tools.contrat_openapi`. L'intégration continue lance `python -m tools.contrat_openapi --verifier` et refuse :
- un contrat publié qui n'est pas à jour ;
- une opération ajoutée sans changement de version ;
- une opération retirée sans version majeure.

## 2.11.0 — 19 novembre 2026

**Ajout compatible** et **évolution de la base PLAA approuvée par le client (BD-4)**. Aucune opération ajoutée ni retirée.

- **Rôle « administrateur de foyer » (É-46)** : nouvelle valeur `admin` dans tous les champs `role` du module Foyer (`HouseholdRole` : `owner`, `admin`, `member`, `viewer`), en entrée (`POST /households/{id}/invitations`, `PATCH /households/{id}/members/{member_id}`) comme en sortie (foyers, membres, invitations, aperçu d'une invitation). Dans la base, le code de rôle est `admin` (`v_household_members.role_code`). **Le mobile doit accepter et afficher cette valeur.**
- **Règles** :
  - l'administrateur invite, retire et change le rôle des membres et des lecteurs, liste, relance et révoque les invitations, modifie le nom, le fuseau et la devise du foyer, et a les droits d'un membre sur les éléments partagés ;
  - réservé au propriétaire, sinon **403** : nommer ou retirer un administrateur (invitation, relance d'une invitation d'administrateur, changement de rôle, retrait ; message « Seul le propriétaire du foyer peut nommer ou retirer un administrateur ») et transférer le foyer (« Seul le propriétaire peut transférer le foyer ») ; la facturation du foyer reste au propriétaire (`household.billing.manage`).
- `PATCH /api/v1/households/{id}` : `role` de la réponse est le rôle réel de l'auteur (`owner` ou `admin`), et non plus toujours `owner`.
- **Base** : `database/evolutions/2026-11-19_BD4_administrateur_foyer.sql` (deux contraintes de `household_roles` élargies, rôle `admin` au rang 2 ; `member` passe au rang 3, `reader` au rang 4). Empreinte `database/schema_reference.json` mise à jour.

## 2.10.0 — 19 novembre 2026

**Ajouts compatibles** et **changements de comportement**. Aucune opération retirée, aucune modification de la structure de la base PLAA. Détail : `API/README.md`.

- **Applications mobiles (É-41)** : deux opérations ajoutées.
  - `POST /api/v1/notifications/push-devices` : enregistrement de l'application (`platform` : `android` ou `ios`, `token` : jeton FCM, `device_name`, `os_version`, `app_version` facultatifs). 201, ou 200 si le jeton est déjà enregistré ; 409 si le jeton appartient à un autre compte.
  - `DELETE /api/v1/notifications/push-devices` (corps `{token}`) : désinscription à la déconnexion de l'application.
  - `GET /api/v1/notifications/web-push/devices` : champs ajoutés `platform`, `device_name`, `os_version`, `app_version`, `last_seen_at`.
  - Envoi par Firebase Cloud Messaging (Android et iOS), actif quand `FCM_PROJECT_ID`, `FCM_SERVICE_ACCOUNT_FILE` et le fournisseur `fcm` sont configurés.
- **Format `problem+json` (É-30)** : un client qui envoie `Accept: application/problem+json` reçoit ses erreurs au format RFC 9457. **Sans cet en-tête, rien ne change.**
- **Comportement : drapeaux de fonctionnalité contrôlés par l'API (C1, C2)**. Quand l'administrateur désactive une fonction, ses routes répondent **403** « Fonction non activée par l'administrateur », avec `result = {"feature": "<clé>"}`. Dans PLAA, `voice.enabled`, `email.sync.enabled`, `billing.enabled` et `calendar.external.enabled` sont désactivés : **le mobile doit lire `GET /api/v1/feature-flags` et masquer ces fonctions**. Liste des routes : `API/CONVENTIONS.md` § 5 bis.
  - `GET /api/v1/voice/capabilities` : champ ajouté `enabled`.
- **Corrections** :
  - `GET /api/v1/calendars` et `GET /api/v1/mail/accounts` : `account_email` peut valoir `null` (compte connecté sans adresse, admis par le schéma) ; ces listes répondaient 500 dans ce cas.
  - `GET /api/v1/reports/vault` : répondait 500 dès que le coffre-fort contenait un document.

## 2.9.1 — 17 novembre 2026

**Corrective** : contrat inchangé (mêmes opérations et mêmes schémas). Deux comportements changent.

- **9 langues installées** : français, anglais, espagnol, portugais, allemand, arabe (de droite à gauche), swahili, kirundi et kinyarwanda. Les catalogues sont dans `app/locales/`.
  - Sans réglage de l'administrateur, `GET /api/v1/auth/public-config` renvoie les 9 langues dans `languages`.
  - La langue par défaut reste le français.
  - Les 7 langues ajoutées portent le statut « à relire ».
- **Notifications** (`GET /api/v1/notifications`) : les titres et textes produits par le système sont traduits dans la langue de la requête. Les textes absents du catalogue sont inchangés, par exemple un rappel déjà rédigé dans la langue de l'utilisateur.

## 2.9.0 — 17 novembre 2026

**Ajouts compatibles** : internationalisation extensible (`docs/INTERNATIONALISATION.md`). Aucune opération retirée, et aucune modification de la base PLAA.

- **`GET /api/v1/auth/public-config`** : deux champs ajoutés.
  - `languages` : langues proposées aux utilisateurs.
  - `default_locale` : langue par défaut de la plateforme.
  - Sans réglage de l'administrateur, leurs valeurs sont `["fr", "en"]` et `"fr"`.
- **`PUT /api/v1/admin/settings/{key}`** : `value` accepte aussi une liste de textes, pour le paramètre `i18n.available_locales`.
  - Nouveau paramètre `i18n.default_locale`.
  - `GET /api/v1/admin/settings` donne `choices`, la liste des langues installées, pour ces deux paramètres.
  - 422 dans deux cas :
    - une langue n'est pas installée ;
    - la langue par défaut ne fait pas partie des langues proposées.
- **Choix de la langue du compte** (`POST /auth/register`, `PATCH /accounts/me`, `PATCH /settings`) : 422 « Langue non proposée sur la plateforme » si la langue est installée mais non proposée. La langue déjà enregistrée reste acceptée.
- **`Accept-Language`** : les étiquettes régionales se ramènent à la langue installée la plus proche (`pt-BR`, puis `pt`). Une langue inconnue donne toujours le français.
- **Messages en anglais** : 171 messages de l'API jusque-là renvoyés en français ont maintenant leur traduction anglaise.
- **E-mails de rappel** : les dates suivent les formats de l'utilisateur, ou ceux de sa langue. Elles suivaient jusqu'ici jj/mm/aaaa à 24 h dans toutes les langues.

## 2.8.0 — 16 novembre 2026

**Ajouts compatibles** (lot 8, avant l'activation des fournisseurs ; fournisseurs simulés dans les tests).

- **`POST /api/v1/documents/{id}/summary`** : résumé à la demande de la version active, par le service d'analyse (écart É-50).
  - Chaque résumé compte comme une analyse dans le quota de la formule.
  - `DocumentOut.summary` dans la fiche ; absent des listes.
  - 409 si le document n'est pas lu, n'a pas de texte, ou est sensible sans accord à l'analyse.
  - 503 si le service d'analyse est indisponible ; 423 si le document est en quarantaine.
  - L'analyse automatique des documents est inchangée : aucun résumé n'y est ajouté.
- **`GET /api/v1/subscriptions/me/invoices/{id}/download?redirect=false`** : renvoie `{url}` en JSON, pour l'écran (écart É-37). Sans le paramètre, la redirection 307 est inchangée.
- **`POST /api/v1/subscriptions/me/change`** (écart É-20, RM-14, DEC-5) : le changement **vers une formule payante inférieure** est programmé à la fin de la période payée, par un échéancier du prestataire.
  - La formule actuelle reste en place jusque-là.
  - Message : « Changement programmé à la fin de la période payée ».
  - 409 si un changement est déjà programmé.
  - Le passage vers une formule supérieure reste immédiat avec prorata, et vers la gratuite, en fin de période.
  - Rien de cela n'a été essayé avec le vrai prestataire.

## 2.7.0 — 16 novembre 2026

**Ajouts compatibles uniquement** (administration, lot 7).

- **Rôles de plateforme** (écart É-17, annexe E) : la permission est vérifiée selon le rôle, d'après le référentiel `role_permissions` de PLAA.
  - **`GET /api/v1/admin/users`** : ouvert au rôle SUPPORT (`platform.user.read`), en lecture seule. Chaque consultation du support est journalisée (`support.users_viewed`). Les actions restent réservées à ADMIN_TECH.
  - `AdminUserOut` gagne `role` et `support_access_until`.
  - **`POST /api/v1/admin/users/{id}/support-access`** (`hours`, de 1 à 72 ; ADMIN_TECH) : accorde le rôle SUPPORT pour une durée limitée, avec la date d'expiration de `user_roles`. 409 si le compte a déjà un rôle d'administration.
  - **`DELETE /api/v1/admin/users/{id}/support-access`** : retire cet accès. Les deux opérations sont journalisées.
  - **`GET /api/v1/admin/business/overview`** (ADMIN_BUSINESS, `platform.billing.manage`) donne, en agrégats sans aucune donnée personnelle, avec consultation journalisée :
    - les formules ;
    - les abonnements par formule et par état ;
    - le revenu mensuel récurrent par devise ;
    - les inscriptions.
- **`GET /api/v1/admin/deliveries?days=1..90`** (ADMIN_TECH) : supervision des envois de rappels et de notifications (écart É-51).
  - Contenu : nombres par canal et par état, échecs par code d'erreur, échecs par jour.
  - Ni contenu, ni adresse, ni détail d'erreur.
- **Conservation** (écart É-18, sans changement de route) : le journal d'audit, les événements de webhook et les tentatives d'envoi des rappels sont purgés selon `retention_policies`. Les événements de sécurité sont gardés 12 mois (90 jours auparavant).

## 2.6.0 — 16 novembre 2026

**Ajouts compatibles uniquement** (assistant, voix et API, lot 6). Sans les nouveaux paramètres ou en-têtes, le comportement est inchangé.

- **Conversations** (écart É-14) :
  - `POST /api/v1/assistant/conversations/{id}/unarchive` : la conversation accepte de nouveau des messages ; 409 si elle n'est pas archivée.
  - `GET /api/v1/assistant/conversations?status=deleted` : la corbeille, c'est-à-dire les conversations supprimées depuis moins de 30 jours. `ConversationOut` gagne `deleted_at`.
  - `POST /api/v1/assistant/conversations/{id}/restore` : restaure la conversation et ses fichiers, pendant 30 jours ; 410 au-delà. Les traitements et propositions annulés lors de la suppression le restent.
- **En-tête `Idempotency-Key` facultatif** (écart É-12, décision DEC-6) :
  - **`POST /api/v1/action-requests/{id}/approve`** : une approbation rejouée par le même utilisateur, pour la même version, renvoie l'action (200) sans seconde exécution.
  - **`POST /api/v1/subscriptions/checkout`** : la clé est transmise au prestataire de paiement, qui renvoie la même session pendant 24 h.
  - **`POST /api/v1/events/local`** : une requête rejouée dans les 24 heures renvoie l'événement déjà créé (200), sans doublon.
  - Sans en-tête, le comportement est inchangé.
- **Aide** (écart É-47) :
  - `POST /api/v1/voice/commands` : `CommandOut.help` (exemples de commandes) quand rien n'a été reconnu.
  - L'assistant ajoute la même aide quand une demande n'est pas prise en charge et qu'il n'a pas de réponse à donner.
- **Pagination par curseur** (écart É-31), sur toutes les listes paginées par page : `?cursor=` et `?limit=` (1 à 100) en plus de `?page=` et `?page_size=`.
  - Les réponses paginées gagnent `next_cursor`, null en fin de liste.
  - Les tâches et les documents gardent leur propre curseur, inchangé.

## 2.5.0 — 16 novembre 2026

**Ajouts compatibles uniquement** (foyer et compte, lot 5). Les nouveaux champs sont facultatifs.

- **`POST /api/v1/households`** : `time_zone` (nom IANA) et `currency` (code ISO 4217) facultatifs (écart É-42). À défaut, ce sont ceux du créateur.
  - `HouseholdOut` renvoie `currency`.
  - `PATCH /api/v1/households/{id}` accepte aussi `currency`.
  - La devise est rangée dans `households.settings` : aucune modification de structure.
- **`POST /api/v1/privacy/deletion`** : nouvelle action par foyer `keep`, pour « conserver les données partagées » (écart É-45, décision DEC-9).
  - Le foyer reste actif, repris par le membre actif le plus ancien.
  - Les tâches partagées par le compte supprimé y restent, avec un auteur anonymisé.
  - 422 si le foyer n'a aucun autre membre.
  - `GET /api/v1/privacy/deletion/households` peut renvoyer `choice.action = "keep"`.
  - À l'effacement : les connexions Google sont révoquées chez le fournisseur, s'il est activé ; un e-mail confirme la clôture.
- **`GET /api/v1/settings/onboarding`** (`pending`, `completed_at`) et **`POST /api/v1/settings/onboarding/complete`** : parcours de première utilisation (écart É-54).
  - Il est proposé une seule fois, aux comptes sans tâche ni foyer.
- **Notifications** (sans changement de route) : les membres d'un foyer ayant le droit de lecture sont prévenus quand une tâche y est partagée et quand son statut change (écart É-43). L'auteur du changement et la personne déjà prévenue de son attribution ne reçoivent pas de notification en double.

## 2.4.0 — 16 novembre 2026

**Ajouts compatibles uniquement** (tâches et rappels, lot 4). Les réponses existantes gardent leur forme.

- **`GET /api/v1/reminders?scope=upcoming|past|all&page=…&page_size=…`** : tous les rappels de l'utilisateur (écart É-16, annexe D API-033).
  - Rappels de tâches et de rendez-vous, hors éléments supprimés.
  - `upcoming` (par défaut) : rappels programmés, du plus proche au plus lointain.
  - `past` : rappels envoyés, annulés ou en échec ; `all` : tous. Ces deux portées listent du plus récent au plus ancien.
  - Chaque élément reprend `ReminderOut`, avec `target_type` (`task` ou `event`) et `target_title`.
- **`POST /api/v1/reminders`** : programme un rappel sur une tâche (`task_id`) **ou** un rendez-vous (`event_id`), avec les mêmes champs et règles que les routes de la tâche ou de l'événement.
  - 422 si aucune cible n'est indiquée, ou si les deux le sont.
- **Catégories personnelles de tâches** (écart É-33) :
  - `POST /api/v1/categories` (`name`, 48 caractères au plus) ; 409 si le nom est réservé (code ou libellé d'une catégorie proposée) ou s'il existe déjà.
  - `PATCH /api/v1/categories/{custom_id}` : renommage ; les tâches suivent le nouveau nom.
  - `DELETE /api/v1/categories/{custom_id}` : suppression ; les tâches concernées deviennent sans catégorie.
  - Les catégories proposées par l'application ne se modifient pas (409).
  - `GET /api/v1/categories` ajoute les catégories personnelles après les catégories proposées, avec `custom: true` et `custom_id`. Les catégories proposées gardent la forme `{ id, name }`.
  - Le champ `category` d'une tâche accepte le nom d'une catégorie personnelle de son créateur.

## 2.3.0 — 16 novembre 2026

**Ajouts compatibles uniquement** (documents, lot 3 du traitement des écarts). Aucune opération existante n'est modifiée.

- **`GET /api/v1/documents/trash`** : corbeille des documents (écart É-13).
  - Contenu : documents supprimés par l'utilisateur depuis moins de 30 jours, les plus récents d'abord.
  - Chaque élément reprend `DocumentOut`, avec en plus `deleted_at` et `restorable_until`.
- **`POST /api/v1/documents/{id}/restore`** : restaure un document de la corbeille. Il retrouve ses versions, son extraction et sa place dans la recherche.
  - 404 si le document n'est pas dans la corbeille de l'utilisateur.
  - 410 après 30 jours, ou si les fichiers ont été purgés.
- **`POST /api/v1/documents/{id}/reprocess`** : relance un traitement en échec (écart É-15, annexe D API-026). Réponse **202** avec l'état du nouveau traitement (`ProcessingOut`).
  - 409 si un traitement est en cours, si aucun traitement n'est en échec, ou si le document est archivé.
  - 423 si le document est en quarantaine.
  - 503 si l'échec venait du service d'analyse et que celui-ci est toujours indisponible.
  - 429 au-delà de 5 relances par document et par 24 heures.
  - Le quota d'analyses n'est pas décompté une seconde fois.
- **`POST /api/v1/documents/{id}/versions/{number}/restore`** : restaure une ancienne version (écart É-34).
  - L'ancienne version est recopiée en une **nouvelle version active**, avec le numéro suivant. Toutes les versions sont conservées.
  - Son analyse est recopiée : aucun nouvel appel au service d'analyse.
  - L'antivirus analyse de nouveau le fichier ; s'il est infecté, le document passe en quarantaine.
  - 409 si la version est déjà active, si le document atteint 10 versions, si un envoi est en cours ou si le fichier est altéré.
  - 404 si la version n'existe pas.
- **`PATCH /api/v1/document-categories/{id}`** (`name`) : renomme une catégorie de documents ; les documents la conservent (écart É-33).
  - 409 si le nom existe déjà, 422 s'il est vide.

## 2.2.0 — 16 novembre 2026

**Ajouts compatibles uniquement** (foyer). Les nouveaux champs et paramètres sont facultatifs ; les réponses gagnent des champs sans en perdre.

- **`PATCH /api/v1/households/{id}`** (propriétaire) : modifie le nom et/ou le fuseau horaire (`time_zone`, nom IANA).
  - Verrou de version (`version`) : 409 si le foyer a changé entre-temps.
  - `HouseholdOut` renvoie désormais `time_zone` et `version`.
- **`POST /api/v1/households/{id}/transfer`** (propriétaire) : transmet la propriété à un membre actif (`new_owner_id`, `version`).
  - L'ancien propriétaire devient membre et reste dans le foyer ; le nouveau est prévenu dans l'application.
- **`POST /api/v1/households/{id}/invitations/{invitation_id}/resend`** (propriétaire, anti-robot) : relance une invitation en attente, expirée ou non.
  - Nouveau lien valable 7 jours ; l'ancien lien ne fonctionne plus ; le rôle proposé est inchangé.
- **`GET /api/v1/households/{id}/invitations`** : paramètre facultatif `include_expired` (faux par défaut, comportement inchangé).
- **`GET /api/v1/households/{id}/activity?limit=…&before=…`** (tous les membres) : fil d'activité du foyer.
  - Contenu : événements du foyer et historique des tâches partagées, du plus récent au plus ancien.
  - Ni adresse e-mail ni valeur modifiée ; `before` (date du dernier élément reçu) charge la suite.
  - Les événements du foyer ne sont journalisés pour le fil qu'à partir de cette version ; l'historique des tâches partagées est complet.
- **`GET /api/v1/privacy/deletion/households`** : foyers dont l'utilisateur est propriétaire, membres pouvant les reprendre, choix par défaut et choix enregistré.
- **`POST /api/v1/privacy/deletion`** : champ facultatif `households` (choix par foyer : `transfer` avec `new_owner_id`, ou `dissolve`).
  - Sans choix pour un foyer, la règle automatique est inchangée : membre actif le plus ancien, sinon fermeture.
  - Le choix s'applique à la fin du délai de réflexion et est oublié si la suppression est annulée.

**Correction de comportement :** l'effacement d'un compte propriétaire d'un foyer sans autre membre échouait, à cause du déclencheur du schéma qui exige un propriétaire actif dans tout foyer, même fermé. Le compte anonymisé reste désormais propriétaire du foyer fermé, et l'effacement aboutit.

## 2.1.0 — 15 novembre 2026

**Ajouts compatibles uniquement** : aucun client existant n'a besoin de changer. Tous les nouveaux champs et en-têtes sont facultatifs.

- **Nouvelle opération** `GET /api/v1/events/conflicts/check?starts_at=…&ends_at=…[&exclude_event_id=…]` :
  - vérifie un créneau candidat avant l'enregistrement d'un événement ;
  - renvoie les événements confirmés et les tâches horodatées ouvertes qui le chevauchent (`type`, `id`, `title`, `starts_at`, `ends_at`) ;
  - les dates doivent porter un fuseau horaire ;
  - c'est un avertissement : l'enregistrement n'est jamais bloqué.
- **`POST /api/v1/tasks`** : nouvel en-tête facultatif `Idempotency-Key` (8 à 80 caractères).
  - Une création rejouée avec la même clé, par le même compte et dans les 24 heures, renvoie la tâche déjà créée (200, « Tâche déjà enregistrée »), sans doublon.
  - Sans clé, le comportement est inchangé (201).
- **`POST /api/v1/extractions/{id}/confirm`** : nouvel en-tête facultatif `Idempotency-Key`.
  - Une confirmation rejouée avec la même clé renvoie les mêmes tâches (200).
  - Sans clé ou avec une autre clé, une seconde confirmation renvoie toujours 409.
- **`POST /api/v1/auth/login`** : nouveau champ facultatif `remember_me`, qui vaut `true` par défaut (comportement inchangé).
  - Avec `false`, le cookie de session est effacé à la fermeture du navigateur, accompagné du marqueur `bm_remember=0`.
  - Côté serveur, la session expire alors après `SHORT_SESSION_HOURS` heures (12 par défaut) sans renouvellement.
  - Le choix est conservé à chaque `POST /api/v1/auth/refresh`.
- **`POST /api/v1/events/local`** : nouveau champ facultatif `reminder_minutes_before`.
  - Il accepte 3 valeurs au plus, chacune entre 0 et 10 080 minutes avant le début.
  - L'événement et ses rappels sont enregistrés ensemble. Un rappel qui tomberait dans le passé est refusé (422) et rien n'est écrit.

## 2.0.0 — 15 novembre 2026

**Rupture de compatibilité : préfixe des routes.** Toutes les routes passent de `/v1/...` à `/api/v1/...`, comme le prévoit le cahier des charges (partie V). Les clients doivent remplacer le préfixe ; les chemins, méthodes et corps restent inchangés. Les adresses de retour OAuth suivent le même changement (`docs/CONFIGURATION_OAUTH.md`).

**Ajouts compatibles depuis la 1.0.0 :**
- Calendrier BringoMind local, sans compte Google ou Microsoft (CAL-003) :
  - `POST /api/v1/events/local` ;
  - `PATCH /api/v1/events/{event_id}/local` ;
  - `POST /api/v1/events/{event_id}/local/cancel`.

  Un événement local s'écrit directement, sans approbation. Les événements d'un calendrier connecté restent soumis à approbation : la voie d'approbation renvoie 409 pour un événement local.
- Base de données partagée PLAA (schéma figé) : conventions de stockage décrites dans `docs/NOTE_EQUIPE_MOBILE.md`.

**Comportements précisés :**
- `GET /api/v1/accounts/me` : `inbox_alias` peut valoir `null` pour un compte repris sans alias.

## 1.0.0 — 9 novembre 2026

Première version publiée (préfixe `/v1`).
