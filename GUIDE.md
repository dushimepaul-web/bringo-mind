# GUIDE DE DÉVELOPPEMENT — PLAA (bringo-mind)

Guide destiné aux développeurs qui rejoignent le projet : comprendre la structure, créer un écran, respecter le design system et éviter les pièges du stack Expo actuel.

## Sommaire

1. [La règle d'or](#1-la-règle-dor)
2. [Comprendre la structure](#2-comprendre-la-structure)
3. [Le flux d'une route](#3-le-flux-dune-route)
4. [Créer un nouvel écran](#4-créer-un-nouvel-écran)
5. [Construire une interface cohérente](#5-construire-une-interface-cohérente)
6. [Navigation](#6-navigation)
7. [Formulaires et états](#7-formulaires-et-états)
8. [Polices et icônes](#8-polices-et-icônes)
9. [Commandes et vérifications](#9-commandes-et-vérifications)
10. [Erreurs fréquentes](#10-erreurs-fréquentes)
11. [Checklist avant validation](#11-checklist-avant-validation)

---

## 1. La règle d'or

```text
app/            -> ROUTAGE SEULEMENT
src/modules/    -> ÉCRANS + LOGIQUE MÉTIER
src/components/ -> UI PARTAGÉE
src/constants/  -> TOKENS DE DESIGN
src/lib/        -> SOCLE TECHNIQUE (API, session)
src/types/      -> TYPES TRANSVERSES
```

Quatre contraintes non négociables :

1. Un fichier de `app/` ne contient qu'un ré-export.
2. Un module n'importe jamais un autre module.
3. Une route n'importe que l'API publique du module (`@/modules/<domaine>`).
4. Le code partagé (`src/lib`, `src/types`, `src/components`, `src/hooks`, `src/constants`) n'importe jamais un module.

Ces règles sont appliquées par `eslint.config.js` :

```js
// app/**/*.tsx : interdiction d'importer les sous-dossiers
group: ['@/modules/*/screens/*', '@/modules/*/components/*', ...]

// src/modules/<module>/** : interdiction d'importer les autres modules
group: ['@/modules/calendar', '@/modules/calendar/*', ...]
```

Une violation est une **erreur ESLint**, pas un avertissement.

---

## 2. Comprendre la structure

```text
app/
  _layout.tsx                 # Stack racine
  (auth)/                     # routes sans segment d'URL
  (main)/
    _layout.tsx               # Stack + BottomTabBar
    dashboard/index.tsx       # /dashboard
    tasks/index.tsx           # /tasks
    tasks/detail.tsx          # /tasks/detail
    ...

src/
  components/                 # header, tab bar, icône
  constants/design.ts         # Serene, FontFamily, Radius, Space, Shadow, Typography
  hooks/use-app-fonts.ts      # chargement des fontes
  modules/
    tasks/
      screens/TaskListScreen.tsx
      screens/TaskDetailScreen.tsx
      screens/TaskFormScreen.tsx
      types.ts
      index.ts
```

### Pourquoi cette séparation ?

- Les routes restent triviales et lisibles.
- Un module peut être déplacé, testé ou remplacé sans toucher au routage.
- Les dépendances entre domaines restent explicites : elles passent par du code partagé.
- Les écrans ne dépendent que des tokens et des composants communs.

### Modules disponibles

`assistant`, `auth`, `billing`, `calendar`, `dashboard`, `documents`, `household`, `integrations`, `notifications`, `profile`, `reminders`, `support`, `tasks`, `voice`.

Les types transverses (langue, recherche, rôles) vivent dans `src/types`. Le client HTTP et la session vivent dans `src/lib` (voir `API.md`).

---

## 3. Le flux d'une route

Prenons `/tasks` :

```tsx
// 1. app/(main)/tasks/index.tsx — routage
export { TaskListScreen as default } from '@/modules/tasks';
```

```ts
// 2. src/modules/tasks/index.ts — API publique
export { default as TaskListScreen } from './screens/TaskListScreen';
```

```tsx
// 3. src/modules/tasks/screens/TaskListScreen.tsx — écran
import { router } from 'expo-router';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Serene, Space, Typography } from '@/constants/design';

export default function TaskListScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Serene.surface }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: Space.gutter }}>
        <Text style={{ ...Typography.titleMd, color: Serene.onSurface }}>Mes tâches</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
```

Le composant est monté dans le Stack de `app/(main)/_layout.tsx`, sous la `BottomTabBar` persistante.

### Layouts

- `app/_layout.tsx` : charge les fontes, attend `SplashScreen.hideAsync`, fournit `SafeAreaProvider`.
- `app/(auth)/_layout.tsx` : Stack sans header natif.
- `app/(main)/_layout.tsx` : conteneur + `Stack` + `BottomTabBar`.
- Chaque module possède un `_layout.tsx` qui déclare ses écrans dans un Stack sans header natif.

---

## 4. Créer un nouvel écran

Exemple : ajouter « Archives des tâches » à `/tasks/archives`.

### Étape 1 — Écran

```tsx
// src/modules/tasks/screens/TaskArchiveScreen.tsx
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

export default function TaskArchiveScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={() => router.back()}>
          <Icon name="arrow_back" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Tâches archivées</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.emptyTitle}>Aucune tâche archivée</Text>
        <Text style={styles.emptyText}>
          Les tâches terminées depuis plus de 30 jours apparaîtront ici.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Serene.surface },
  header: {
    height: 56,
    paddingHorizontal: Space.gutter,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Serene.surfaceContainerHigh,
  },
  headerButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', ...Typography.titleMd, color: Serene.onSurface },
  content: { padding: Space.gutter, alignItems: 'center', gap: 6 },
  emptyTitle: { fontFamily: FontFamily.bodySemiBold, fontSize: 14, color: Serene.onSurface },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
  },
});
```

### Étape 2 — Export public

```ts
// src/modules/tasks/index.ts
export { default as TaskArchiveScreen } from './screens/TaskArchiveScreen';
```

### Étape 3 — Route

```tsx
// app/(main)/tasks/archives.tsx
export { TaskArchiveScreen as default } from '@/modules/tasks';
```

### Étape 4 — Déclaration dans le layout du module

```tsx
// app/(main)/tasks/_layout.tsx
<Stack.Screen name="archives" />
```

### Étape 5 — Régénérer les routes typées

Les types de routes sont produits par le serveur de développement. Relancer `npx expo start` puis redémarrer le serveur TypeScript. Voir [les erreurs fréquentes](#erreurs-fréquentes) pour une commande sans interaction.

---

## 5. Construire une interface cohérente

Tous les écrans suivent les mêmes briques visuelles.

### Tokens

```ts
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';
```

- `Serene.primary` : action principale, onglet actif, bouton fort.
- `Serene.secondary` : accents IA, sélection, informations.
- `Serene.warning` : troisième tonalité (il n'y a **pas** de `tertiary`).
- `Serene.surfaceContainerLowest` : carte blanche sur fond `surface`.
- `Serene.surfaceContainerLow` : champ, pastille, bloc secondaire.

### Header standard

Hauteur 56, trois zones : bouton gauche (40×40), titre centré `Typography.titleMd`, action droite.

```tsx
<View style={styles.header}>
  <Pressable style={styles.headerButton} onPress={() => router.back()}>
    <Icon name="arrow_back" size={22} color={Serene.onSurface} />
  </Pressable>
  <Text style={styles.headerTitle}>Titre de l'écran</Text>
  <Pressable style={styles.headerButton}>
    <Icon name="more_vert" size={22} color={Serene.onSurfaceVariant} />
  </Pressable>
</View>
```

### Carte

```tsx
<View
  style={{
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  }}
/>
```

### Bouton principal collé en bas

Hauteur 48–50, `Radius.xl`, `Shadow.floating`, libellé `bodySemiBold`.

### Chips

```tsx
<Pressable
  style={[styles.chip, active && styles.chipActive]}
  onPress={() => setValue(item)}>
  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
</Pressable>
```

Actif : fond `Serene.primary`, texte `Serene.onPrimary`.

### Ligne d'information

Icône 15–18 dans un carré `surfaceContainerLow`, libellé `onSurfaceVariant`, valeur alignée à droite `bodyMedium` / `onSurface`.

### États

- Succès : fond `successContainer`, texte/icône `success`.
- Erreur : fond `errorContainer`, texte/icône `error`.
- Avertissement : fond `warningContainer`, texte `warning`.
- Vide : icône centrée + titre + texte secondaire.
- Chargement : libellé « Synchronisation... » ou bouton désactivé, sans spinner externe.

### Interactivité de démonstration

Les écrans sont volontairement autonomes. Une action simulée utilise un état local :

```tsx
const [saved, setSaved] = useState(false);

<Pressable onPress={() => setSaved(true)}>
  <Text>{saved ? 'Enregistré' : 'Enregistrer'}</Text>
</Pressable>
```

Rester cohérent : un état affiché doit correspondre à l'action (bannière, libellé, coche), pas seulement à un changement de style.

---

## 6. Navigation

Importer depuis `expo-router` :

```ts
import { router, usePathname, useLocalSearchParams } from 'expo-router';
```

| Intention | Code |
|---|---|
| Aller à un écran | `router.push('/tasks/detail')` |
| Remplacer l'historique | `router.replace('/dashboard')` |
| Revenir | `router.back()` |
| Mode création / édition | `const isEdit = usePathname().includes('/edit')` |

### Barre d'onglets

`src/components/bottom-tab-bar.tsx` est persistante dans `(main)`. Cinq entrées :

- Accueil → `/dashboard`
- Tâches → `/tasks`
- Assistant → `/assistant` (central surélevé, badge)
- Calendrier → `/calendar`
- Profil → `/profile`

La barre utilise `usePathname()` pour déterminer l'onglet actif.

### Routes typées

`app.json` active `typedRoutes`. Les chemins invalides échouent à la compilation. Après ajout d'une route, les types doivent être régénérés par le serveur de développement.

---

## 7. Formulaires et états

### Structure type

```tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const valid = email.includes('@') && password.length >= 8;
```

- Label : 11 px, `bodySemiBold`, majuscules, `letterSpacing: 0.5`, astérisque `error` si requis.
- Champ : hauteur 46–50, `surfaceContainerLow`, `Radius.lg`.
- Afficher/masquer un mot de passe : icône `visibility` / `visibility_off`.
- Validation : bouton désactivé avec fond `surfaceContainerHigh` tant que la condition n'est pas remplie.
- Erreur de correspondance : bordure `error` + message sous le champ.
- Éviter `Alert` : préférer les bannières intégrées et les états de succès.

### Clavier

```tsx
<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
  <ScrollView keyboardShouldPersistTaps="handled" />
</KeyboardAvoidingView>
```

### Détection de conflit (calendrier)

`EventFormScreen` illustre une validation métier locale :

```tsx
const conflict = start === '14:00' && end === '15:00';
```

- Conflit : bannière `errorContainer` nommant l'événement concurrent + créneau, CTA désactivé.
- Aucun conflit : bannière `successContainer` « Aucun conflit détecté ».

---

## 8. Polices et icônes

### Fontes

Déclarées dans `src/hooks/use-app-fonts.ts` avec `expo-font` :

- Plus Jakarta Sans : `FontFamily.heading`, `headingBold`
- Inter : `body`, `bodyMedium`, `bodySemiBold`, `bodyBold`
- Material Symbols : `icon`, `iconFilled`

`app/_layout.tsx` attend le chargement (ou une erreur) avant de masquer le splash.

### Icônes

```tsx
import { Icon } from '@/components/icon';

<Icon name="home" size={22} color={Serene.primary} />
```

`Icon` utilise la ligature Material Symbols. Le nom correspond au nom officiel du glyphe (`arrow_back`, `task_alt`, `picture_as_pdf`, `fingerprint`, `auto_awesome`, etc.).

> Le rendu console ne montre pas les ligatures. Vérifier visuellement sur appareil, simulateur ou navigateur.

---

## 9. Commandes et vérifications

```bash
npx expo start                 # développement
npx expo lint                  # ESLint + isolation des modules
npx tsc --noEmit               # TypeScript strict
npx expo export --platform web # vérifie aussi le bundle web
```

Ordre recommandé avant de déclarer une tâche terminée :

1. `npx tsc --noEmit`
2. `npx expo lint`
3. `npx expo export --platform web --output-dir <dossier-temporaire>`

---

## 10. Erreurs fréquentes

### `Type '"/tasks"' is not assignable to type ...`

Les routes typées sont obsolètes. Relancer le serveur de développement. Sans interaction, générer les types avec un serveur temporaire :

```powershell
$p = Start-Process npx.cmd -ArgumentList "expo","start","--offline","--port","8091" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 25
taskkill.exe /PID $p.Id /T /F
```

Vérifier ensuite `.expo/types/router.d.ts`.

### `Property 'headline' does not exist on type ...`

`FontFamily` n'a pas de clé `headline`. Utiliser `heading` ou `headingBold`. De même, `Typography` n'a pas de `titleLg` : utiliser `headlineLg` / `headlineMd`.

### `Property 'tertiary' does not exist on type ...`

`Serene` n'a pas de `tertiary` ni `tertiaryContainer`. Utiliser `warning` / `warningContainer`.

### `Property 'focus' does not exist on type 'TextInputType'`

Avec React Native 0.88, typer la ref avec l'instance :

```tsx
import { TextInput, type TextInputInstance } from 'react-native';

const inputRef = useRef<TextInputInstance>(null);
```

Même logique pour les ScrollView : `ScrollViewInstance`.

### `React Hook "useExample" cannot be called inside a callback`

ESLint considère toute fonction préfixée par `use` comme un hook. Renommer les fonctions utilitaires (`applyExample`, `handleSend`, etc.).

### `Switch` aux couleurs par défaut

Toujours fournir :

```tsx
<Switch
  value={value}
  onValueChange={setValue}
  trackColor={{ false: Serene.surfaceContainerHigh, true: Serene.secondary }}
  thumbColor={Serene.surfaceContainerLowest}
/>
```

### Accents altérés après une commande PowerShell

`Set-Content` sans encodage explicite peut corrompre l'UTF-8. Utiliser les outils d'édition du projet ou `Set-Content -Encoding utf8`.

### Routage circulaire

Un module ne doit pas importer un autre module pour réutiliser un écran. Extraire la partie commune dans `src/components` ou `src/hooks`.

---

## 11. Checklist avant validation

- [ ] La route est un ré-export d'une seule ligne.
- [ ] L'écran vit dans le bon module.
- [ ] Aucun import vers un autre module.
- [ ] Les couleurs, polices, rayons et espacements viennent de `@/constants/design`.
- [ ] Le header respecte le standard 56 px.
- [ ] Les actions mènent à une route existante ou produisent un état local visible.
- [ ] Les états vide / succès / erreur sont couverts lorsque pertinent.
- [ ] `npx tsc --noEmit` passe.
- [ ] `npx expo lint` passe.
- [ ] L'export web passe si la modification touche le routage ou les layouts.
