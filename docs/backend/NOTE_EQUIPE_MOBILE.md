# Note à l'équipe de l'application mobile — conventions de l'application web sur la base PLAA

**Date :** 13 novembre 2026. L'application web utilise la base PLAA telle que définie par `database/COMPLETE_DATABASE.sql`, **sans aucune modification de structure**. Elle range dans les colonnes JSON existantes les informations sans colonne native. Cette note décrit ce que la web écrit, pour que les deux applications lisent et écrivent les mêmes données de la même façon.

## 1. Données de référence à charger

`database/seed_reference.sql` (données uniquement, rejouable sans effet) :
- **formules d'abonnement** : free, personal_plus, personal_pro, family, avec leurs prix et quotas (`subscription_plan_features`) ;
- **fournisseurs absents du catalogue d'origine** : anthropic, stt_openai, deepl, frankfurter, google_mail. Ils sont créés **désactivés** ; l'administrateur les active ;
- **paramètres globaux de la web** : `registration.enabled`, `maintenance.message`, `notifications.email_hourly_limit`, `integrations.cap_warning_percent`, `supervision.failure_alert_minutes` ;
- **drapeau** `voice.commands`.

## 2. Valeurs et conventions

| Sujet | Convention de la web |
|---|---|
| Priorité des tâches | 1 = urgente … 4 = basse (valeur du schéma) |
| Fournisseurs de `connected_accounts` | `gmail`, `outlook` (messagerie) ; `google`, `microsoft` (calendriers) |
| Jetons OAuth | un seul blob chiffré dans `access_token_enc` + `access_token_key_id` ; `refresh_token_enc` non utilisé |
| Curseur de synchronisation des e-mails | `sync_cursors` (kind `email`, scope `default`) ; scope `manual` = dernière synchronisation à la demande ; valeur `-` = curseur effacé (le schéma n'admet ni valeur vide ni suppression par les rôles applicatifs) |
| Catégories | `categories.name` = code stable (`bills`, `health`…) pour les tâches et les e-mails |
| Notifications | `notifications.type` = catégorie, avec suffixe de priorité `.low`, `.high` ou `.critical` |
| Rappels | un rappel par cible et par instant ; canaux regroupés dans `reminders.channels` ; réglages d'une occurrence dans `reminder_occurrences.idempotency_key` (`origine\|intervalle\|restantes\|reporté\|rappel\|instant`) |
| Statuts de tâche « bloquée » / « reportée » | entrée `status_changed` de `task_history` : `changes = {substate, base}` ; valable tant que `tasks.status` vaut `base` |
| Texte collé dans la boîte de réception | document `.txt` (clé de stockage `inbox/…`), exclu de la bibliothèque |
| Informations d'un document ou d'un élément sans colonne | extraction `metadata` de la dernière version (`document_extractions.payload`), fusionnée : clés `processing_error`, `failed`, `archived`, `details`, `idempotency_key`, `vault`, `scan_status`, `ai_allowed`… |
| Élément archivé / écarté | tous deux `source_items.status = discarded` ; `archived: true` dans les métadonnées pour un élément archivé |
| Coffre-fort | un document du coffre porte la clé `vault` dans ses métadonnées ; une fiche par document |
| Assistant | état d'une exécution dans un message `role = tool` (JSON `run_state`), masqué ; mesures d'usage = lignes `ai_runs` dont `idempotency_key` commence par `usage\|` |
| Demandes d'action | compléments dans `action_requests.parameters_json["_meta"]` |
| Préférences | `user_profiles.preferences` : sections `display`, `dashboard`, `planning`, `inbox` (alias, expéditeurs autorisés), `notifications`, `mfa` (empreintes des codes de secours), `auth`, `formats`, `assistant`, `accessibility`, `reporting` (vues, planifications, exports) ; chaque application **fusionne** ses clés et ne remplace jamais l'objet entier |
| Paramètres globaux | historique dans `audit_logs` (action `admin.setting_changed`) ; registre des clés de chiffrement dans `system_settings.security.encryption_keys` |
| Battement du worker | ligne `background_jobs` (`job_type = worker.heartbeat`, `idempotency_key = worker`) |
| Suppression de compte | contenu personnel effacé, puis `app_anonymize_user` ; propriété d'un foyer transférée au membre actif le plus ancien |

## 3. Écarts du schéma constatés (à trancher d'un commun accord)

1. **Politiques de sécurité par ligne** : aucun rôle applicatif ne permet de créer un foyer avec son propriétaire, de refuser une invitation ou de quitter un foyer. La web utilise une session du propriétaire du schéma après ses propres contrôles.
2. **Rôle `plaa_worker`** : il n'a aucun droit sur les contenus utilisateurs (tâches, conversations, catégories, calendriers, `email_action_logs`, `privacy_requests`, `system_settings`). La web exécute ces traitements au nom de l'utilisateur concerné (`app.current_user_id`), ou en session privilégiée pour les purges système.
3. **Écritures impossibles** :
   - `invoices` : écrit par aucun rôle applicatif ;
   - `sync_cursors` et `sync_jobs` : modifiables par le seul worker ;
   - `ai_usage_records` : visible de son seul utilisateur ; les vues d'administration passent par `plaa_maintenance`.
4. **Journaux en ajout seul** (`app_prevent_update`) : même l'anonymisation de l'adresse IP est refusée, seule la suppression est possible.
5. **`app_anonymize_user`** : exécutable par `plaa_maintenance`, mais ce rôle n'a pas le droit UPDATE sur `users` (la fonction n'est pas SECURITY DEFINER).
6. **Absents du schéma** :
   - colonne pour l'usage précis d'une consommation d'IA ;
   - ~~type `household_roles` « administrateur »~~ : ajouté le 19/11/2026 (BD-4, § 7) ;
   - table de taux de change.

## 4. Contrôle de conformité

`python -m database.plaa_migrate` compare la base à `database/schema_reference.json` :
- tables, colonnes et contraintes ;
- index, politiques de sécurité par ligne, fonctions, déclencheurs et vues.

Le moindre écart arrête le démarrage de l'API web.

## 5. Contrat d'API partagé

- **Contrat :** `docs/openapi.json`, en version **2.2.0** (historique dans `docs/API_CHANGELOG.md`). La 2.2.0 ajoute la gestion du foyer (fuseau, transfert de propriété, relance d'invitation, fil d'activité, choix à la suppression du compte) ; à noter : les événements du foyer sont désormais journalisés avec `audit_logs.household_id` renseigné. La 2.1.0 n'ajoutait que des éléments facultatifs (en-tête `Idempotency-Key`, `remember_me`, vérification de créneau, rappels à la création d'un événement local).
- **Rupture de la 2.0.0 :** le préfixe des routes passe de `/v1` à `/api/v1`.
- **Règle des versions :** toute opération retirée impose une version majeure, contrôlée automatiquement par l'intégration continue.
- **Conventions ajoutées par la web le 15 novembre 2026 :**
  - les événements saisis dans l'application vont dans le calendrier local « BringoMind » de l'auteur (`calendars` sans compte connecté) ;
  - la devise d'un foyer sera rangée dans `households.settings.currency` (code ISO 4217).
- **Comportements comparés dans la base de test** (`python -m database.plaa_migrate`) : une base restaurée depuis une sauvegarde est reconnue conforme, car PostgreSQL réécrit certaines expressions sans en changer le sens.

## 6. Changements du 19 novembre 2026 (contrat 2.10.0)

À lire avant la prochaine version de l'application mobile. Détail : `docs/API_CHANGELOG.md` (2.10.0) et `API/CONVENTIONS.md`.

- **Drapeaux de fonctionnalité appliqués par l'API.** Une fonction désactivée répond 403 « Fonction non activée par l'administrateur », `result = {"feature": "<clé>"}`. Dans PLAA, `voice.enabled`, `email.sync.enabled`, `billing.enabled` et `calendar.external.enabled` sont désactivés : lisez `GET /api/v1/feature-flags` et masquez ces fonctions.
- **Notifications push mobiles.** `POST /api/v1/notifications/push-devices` (`platform` `android` ou `ios`, `token` FCM) à l'ouverture de session, `DELETE` à la déconnexion. Les jetons sont rangés chiffrés dans `push_devices`, l'appareil dans `user_devices` (tables existantes).
- **Base PLAA, évolution BD-3 appliquée** (accord du client) : droits DELETE de `plaa_maintenance` sur `notification_deliveries`, `sync_jobs`, `document_processing_jobs` ; UPDATE sur 3 colonnes de `ai_tool_calls` ; 3 lignes dans `retention_policies`. **Aucune structure modifiée** : l'empreinte `database/schema_reference.json` est inchangée. Script : `database/evolutions/2026-11-19_BD3_conservation.sql`.
- **Conservation** : le contenu des messages de l'assistant de plus de 12 mois est vidé (`conversation_messages.content = ''`) ; les lignes restent.
- **BD-4 appliquée** : voir § 7.

## 7. Rôle de foyer « administrateur » (BD-4, contrat 2.11.0)

Appliqué le 19/11/2026 avec l'accord du client. **Structure modifiée** : seules les contraintes `ck_household_roles_code` (`owner`, `admin`, `member`, `reader`) et `ck_household_roles_rank` (1 à 4) de `household_roles`. Script : `database/evolutions/2026-11-19_BD4_administrateur_foyer.sql` ; empreinte `database/schema_reference.json` mise à jour.

- **Nouveau code de rôle `admin`** (rang 2) dans `household_roles`, `household_memberships.role_id`, `v_household_members.role_code` et dans l'API (`role: "admin"`). Le mobile doit l'accepter et l'afficher (« Administrateur »).
- **Rangs décalés** : `member` passe de 2 à 3, `reader` de 3 à 4. Ne vous appuyez pas sur la valeur du rang, mais sur le code.
- **Permissions** : celles du membre, plus `household.members.manage`, `household.settings.write` et `household.billing.read`. Pas de `household.billing.manage`.
- **Règles de l'application** (la sécurité par ligne ne les distingue pas : appliquez-les aussi côté mobile) : un administrateur ne nomme pas d'administrateur, n'agit pas sur un autre administrateur et ne transfère pas le foyer (`owner_user_id`). L'API répond 403 dans ces cas.
- **Installations neuves** : appliquer les scripts de `database/evolutions/` (hors `*_retour.sql`) après `COMPLETE_DATABASE.sql` et `seed_reference.sql`, comme le font désormais l'intégration continue, Docker et `database/install_plaa.ps1`.

