# PLAA — bringo-mind

Application mobile **Expo / React Native** de gestion de vie administrative personnelle et partagée. Le dépôt contient une interface complète et navigable, alimentée par des données de démonstration locales.

- **14 modules métier**, **39 écrans** du catalogue, **8 écrans d'authentification**
- **Expo Router** avec routes typées et React Compiler
- Design system **Serene** : tokens de couleur, typographie, espacement, rayons et ombres centralisés
- Aucun backend requis pour parcourir l'application

## Sommaire

1. [Stack](#stack)
2. [Démarrage](#démarrage)
3. [Commandes](#commandes)
4. [Architecture](#architecture)
5. [Carte des routes](#carte-des-routes)
6. [Design system](#design-system)
7. [Composants partagés](#composants-partagés)
8. [Conventions](#conventions)
9. [État du projet](#état-du-projet)
10. [Dépannage](#dépannage)

## Stack

| Élément | Version |
|---|---|
| Expo | ~58.0.23 |
| React Native | 0.88.1 |
| React | 19.3.0 |
| Expo Router | ~58.0.30 |
| TypeScript | ~6.0.3 (strict) |
| Reanimated | 4.7.1 |
| Safe Area Context | ~5.11.1 |

Le projet utilise `npm` (`package-lock.json`). Les commandes `npx expo ...` respectent les versions compatibles avec le SDK.

## Démarrage

```bash
npm install
npx expo start
```

Puis ouvrir sur :

- **iOS** : simulateur ou appareil via Expo Go / development build
- **Android** : émulateur ou appareil via Expo Go / development build
- **Web** : `w` dans le terminal, ou `npx expo start --web`

Le point d'entrée de développement est `app/(main)/index.tsx`, qui redirige vers `/dashboard`.
Les fonts (Inter, Plus Jakarta Sans, Material Symbols) sont chargées au démarrage ; l'écran de démarrage natif reste affiché jusqu'à leur disponibilité.

## Commandes

```bash
npx expo start            # serveur de développement
npx expo start --web      # serveur web
npx expo lint             # ESLint (règles d'isolation incluses)
npx tsc --noEmit          # vérification TypeScript
npx expo install <pkg>    # ajouter une dépendance compatible SDK
npx expo install --fix    # aligner les versions sur le SDK
npx expo-doctor           # diagnostic de configuration
npx expo export --platform web --output-dir dist   # build web statique
```

## Architecture

```text
app/                        # ROUTAGE UNIQUEMENT
  _layout.tsx               # Stack racine + fonts + SafeAreaProvider
  (auth)/                   # groupe d'authentification (URL sans segment)
  (main)/                   # application : Stack + BottomTabBar persistante

src/
  components/               # UI transversale (header, tab bar, icône)
  constants/design.ts       # tokens Serene, Typography, Radius, Space, Shadow
  hooks/                    # hooks partagés (fonts, theme, clé d'idempotence)
  lib/                      # socle technique partagé (sans UI)
    config.ts               # URL de l'API + préfixe /api/v1
    api/                    # client HTTP unique, erreurs RFC 7807
    session/                # jetons (stockage sécurisé), SessionProvider, useSession
  types/                    # types transverses (langue, recherche, rôles)
  modules/<domaine>/
    screens/                # écrans du domaine
    components/             # composants internes (facultatif)
    hooks/                  # hooks internes (facultatif)
    services/               # accès réseau (facultatif)
    types.ts                # contrats du domaine
    index.ts                # API publique du module
```

### Règle d'or

1. `app/` ne contient **que** du routage : un fichier de route ré-exporte un écran.
2. Un écran vit dans `src/modules/<domaine>/screens/`.
3. Un module **n'importe jamais** un autre module. Le partage passe par `src/lib`, `src/types`, `src/components`, `src/hooks` et `src/constants`.
4. Une route importe uniquement l'API publique `@/modules/<domaine>`, jamais un sous-dossier.
5. Le code partagé **n'importe jamais** un module.
6. Seuls les services des modules appellent le réseau, et toujours via `@/lib/api`.

Ces règles sont vérifiées par `eslint.config.js` via `no-restricted-imports`.

### Anatomie d'un module

```text
src/modules/tasks/
  index.ts
  types.ts
  screens/
    TaskListScreen.tsx
    TaskDetailScreen.tsx
    TaskFormScreen.tsx
```

```ts
// src/modules/tasks/index.ts
export { default as TaskListScreen } from './screens/TaskListScreen';
export { default as TaskDetailScreen } from './screens/TaskDetailScreen';
export { default as TaskFormScreen } from './screens/TaskFormScreen';
```

```tsx
// app/(main)/tasks/index.tsx
export { TaskListScreen as default } from '@/modules/tasks';
```

## Carte des routes

### Authentification

| Route | Écran | Module |
|---|---|---|
| `/splash` | Démarrage | `auth` |
| `/welcome` | Bienvenue / présentation (S-01) | `auth` |
| `/onboarding` | Onboarding 3 étapes | `auth` |
| `/register` | Inscription (S-02) | `auth` |
| `/login` | Connexion (S-03) | `auth` |
| `/forgot-password` | Mot de passe oublié (S-04) | `auth` |
| `/reset-password` | Nouveau mot de passe (S-05) | `auth` |
| `/verify-email` | Vérification e-mail (S-06) | `auth` |

### Application

| Route | Écran | Module |
|---|---|---|
| `/dashboard` | Tableau de bord personnel (S-07) | `dashboard` |
| `/tasks` | Liste des tâches (S-08) | `tasks` |
| `/tasks/detail` | Détail d'une tâche (S-09) | `tasks` |
| `/tasks/add`, `/tasks/edit` | Création / édition de tâche (S-10) | `tasks` |
| `/reminders` | Rappels (S-11) | `reminders` |
| `/reminders/add`, `/reminders/edit` | Formulaire de rappel (S-12) | `reminders` |
| `/calendar` | Calendrier mois / semaine / jour (S-13) | `calendar` |
| `/calendar/agenda` | Vue agenda | `calendar` |
| `/calendar/detail` | Détail d'un événement (S-14) | `calendar` |
| `/calendar/add`, `/calendar/edit` | Création / édition + conflits (S-15) | `calendar` |
| `/household` | Tableau de bord foyer (S-16) | `household` |
| `/household/create` | Création d'un foyer (S-17) | `household` |
| `/household/members` | Membres et invitations (S-18) | `household` |
| `/household/invite` | Inviter un membre | `household` |
| `/household/invitation` | Accepter / refuser une invitation | `household` |
| `/household/transfer` | Transfert de propriété | `household` |
| `/household/activity` | Activité du foyer (S-19) | `household` |
| `/documents` | Coffre-fort documents (S-25) | `documents` |
| `/documents/detail` | Détail d'un document (S-26) | `documents` |
| `/assistant` | Assistant Kora (S-27) | `assistant` |
| `/voice` | Commande vocale (S-28) | `voice` |
| `/integrations` | Connexions externes (S-24) | `integrations` |
| `/integrations/email` | E-mail importé + extraction IA | `integrations` |
| `/notifications` | Centre de notifications | `notifications` |
| `/notifications/settings` | Préférences de notifications (S-22) | `notifications` |
| `/profile` | Profil et paramètres (S-20) | `profile` |
| `/profile/complete` | Compléter le profil | `profile` |
| `/profile/preferences` | Préférences (S-21) | `profile` |
| `/profile/privacy` | Confidentialité et données (S-23) | `profile` |
| `/profile/biometric` | Déverrouillage biométrique | `profile` |
| `/billing` | Abonnement (S-31) | `billing` |
| `/support` | Aide et support (S-32) | `support` |

Les types transverses (langue, devise, recherche, rôles du foyer) sont dans `src/types`.

## Design system

Tous les tokens sont dans `src/constants/design.ts`.

```ts
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';
```

### Couleurs principales

| Token | Usage |
|---|---|
| `Serene.primary` | Actions principales, navigation active, accents forts |
| `Serene.onPrimary` | Texte et icônes sur `primary` |
| `Serene.secondary` / `secondaryContainer` | Accents IA, sélections, badges |
| `Serene.surface` / `surfaceContainerLow` / `surfaceContainerLowest` | Fonds et cartes |
| `Serene.onSurface` / `onSurfaceVariant` | Texte principal / secondaire |
| `Serene.success` / `successContainer` | Confirmations |
| `Serene.warning` / `warningContainer` | Avertissements (troisième tonalité) |
| `Serene.error` / `errorContainer` | Erreurs, actions destructives |
| `Serene.outlineVariant` | Bordures discrètes |

> Il n'existe **pas** de token `tertiary`. Utiliser `warning` / `warningContainer` comme troisième tonalité.

### Typographie

`Typography` contient `displayLg`, `displayLgMobile`, `headlineLg`, `headlineMd`, `headlineSm`, `titleMd`, `bodyLg`, `bodyMd`, `bodySm`, etc. Les fontes sont exposées par `FontFamily` :

- `heading` / `headingBold` — Plus Jakarta Sans
- `body`, `bodyMedium`, `bodySemiBold`, `bodyBold` — Inter
- `icon`, `iconFilled` — Material Symbols

> `FontFamily.headline` n'existe pas. Pour les chiffres et grands titres, utiliser `headingBold`.

### Espacement et formes

`Space` (`xs`, `sm`, `md`, `lg`, `xl`, `gutter`), `Radius` (`sm`, `md`, `lg`, `xl`, `full`), `Shadow` (`card`, `floating`).

## Composants partagés

| Composant | Rôle |
|---|---|
| `src/components/app-header.tsx` | Header applicatif : logo → `/household`, cloche → `/notifications`, avatar → `/profile` |
| `src/components/bottom-tab-bar.tsx` | Barre persistante : Accueil, Tâches, Assistant (central surélevé, badge), Calendrier, Profil |
| `src/components/icon.tsx` | Icône Material Symbols via ligature (`name`, `size`, `color`) |

## Conventions

- Écrans : fonction par défaut, état local via `useState`, données de démo en constantes de module.
- Chaque écran possède un header cohérent (haut 56 px, retour/fermeture, titre centré, action droite).
- Formulaires : labels en majuscules 11 px, champs `surfaceContainerLow`, CTA collé en bas (`Radius.xl`, hauteur 48–50).
- Les états (succès, erreur, vide, chargement) sont rendus en place, sans `Alert` natif.
- Aucune dépendance nouvelle n'est nécessaire pour la démo : tout repose sur React Native + Expo.
- Les textes utilisateur sont en français ; les noms de variables et commentaires d'en-tête en français également.

## État du projet

- Tous les écrans du catalogue sont implémentés et interconnectés.
- L'application est une **démo UI navigable** : les données sont locales et les actions simulées.
- Le socle réseau est en place (`src/lib/api`, `src/lib/session`) mais aucun écran ne l'utilise encore. Voir [API.md](API.md).
- `src/modules/auth/services/auth.service.ts` est l'ancien service d'authentification ; il sera réécrit sur `@/lib/api` à la phase 2.
- Vérifications de référence : `npx tsc --noEmit`, `npx expo lint`, `npx expo export --platform web`.

## Dépannage

### « Type '"/tasks"' is not assignable to type ... »

Les routes typées sont générées par le serveur de développement et peuvent être obsolètes après l'ajout d'une route. Relancer `npx expo start`, puis redémarrer TypeScript.

Sans interaction, générer les types avec un serveur temporaire :

```powershell
$p = Start-Process npx.cmd -ArgumentList "expo","start","--offline","--port","8091" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 25
taskkill.exe /PID $p.Id /T /F
```

### Erreurs d'installation réseau

Si `npm install` échoue avec `ECONNRESET`, relancer avec un registre explicite ou installer les paquets un par un. Éviter d'ajouter des dépendances pour la démo.

### Polices / icônes

Les fontes sont versionnées dans `assets/fonts/` et chargées par `src/hooks/use-app-fonts.ts`. Les icônes s'affichent en ligatures ; vérifier le rendu sur un appareil ou un navigateur (le rendu console ne reflète pas les glyphes).

### Encodage des fichiers

Sous PowerShell 5.1, `Set-Content` sans `-Encoding utf8` peut altérer les accents. Préférer les outils d'édition ou `Set-Content -Encoding utf8`.
