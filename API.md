# API — guide d'intégration

Ce document décrit la couche réseau du projet PLAA et la manière de brancher une API HTTP sans casser l'isolation des modules.

## État actuel

L'application est une **interface de démonstration navigable**. Les écrans utilisent des données locales (`useState`, constantes de module) et les actions sont simulées.

Le **socle réseau partagé** est en place mais n'est encore appelé par aucun écran :

```text
src/lib/
  config.ts                 # API_URL + préfixe /api/v1
  id.ts                     # UUID (Idempotency-Key, X-Request-Id)
  api/
    client.ts               # apiRequest / api.get|post|patch|put|delete
    errors.ts               # ApiError (RFC 7807), NetworkError, userMessage
  session/
    token-storage.ts        # Keychain / Keystore (expo-secure-store), mémoire sur Web
    session-store.ts        # source unique des jetons, hors React
    session-context.tsx     # SessionProvider + useSession
src/hooks/
  use-idempotency-key.ts    # même clé tant qu'un formulaire n'a pas réussi
```

`src/modules/auth/services/auth.service.ts` est l'ancien service ; il sera réécrit sur `@/lib/api` à la phase 2.

## 1. Architecture en couches

```text
Route (app/...)
   |
Écran (src/modules/<domaine>/screens/)
   |
Hook (src/modules/<domaine>/hooks/)        <- facultatif
   |
Service (src/modules/<domaine>/services/)
   |
Client partagé (src/lib/api)               <- jetons, en-têtes, erreurs
   |
API FastAPI /api/v1
```

Règles :

- un écran ne fait jamais `fetch` ;
- un hook ne connaît pas l'URL de l'API ;
- seul le service connaît les endpoints, et il passe toujours par `@/lib/api` ;
- aucune règle métier critique ni contrôle d'autorisation côté mobile : l'API décide ;
- les types décrivent les données échangées ;
- un module ne dépend jamais d'un autre module.

## 2. Configuration

Créer un fichier `.env` à la racine (modèle dans `.env.example`) :

```text
EXPO_PUBLIC_API_URL=https://api.exemple.com
```

La valeur est l'hôte **sans** `/api/v1` : le préfixe est ajouté par `src/lib/config.ts`. Expo expose au runtime uniquement les variables préfixées `EXPO_PUBLIC_`. Redémarrer le serveur après modification.

> Ne jamais placer de secret (clé privée, token d'administration) dans une variable `EXPO_PUBLIC_*` : elle est embarquée dans le bundle client.

Dépendances du socle (à installer avec `npx expo install expo-secure-store expo-crypto`) :

| Paquet | Usage |
|---|---|
| `expo-secure-store` | Stockage des jetons dans le Keychain / Keystore |
| `expo-crypto` | Génération des UUID |

## 3. Contrats du module auth

```ts
// src/modules/auth/types.ts
export type AuthUser = {
  id: string;
  email: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};
```

## 4. Client HTTP partagé

`src/lib/api/client.ts` applique les conventions du dossier directeur (§ 6.4) à chaque appel :

| Convention | Comportement |
|---|---|
| Base | `EXPO_PUBLIC_API_URL` + `/api/v1` |
| Authentification | `Authorization: Bearer <access_token>` sauf `auth: false` |
| Traçabilité | `X-Request-Id` (UUID) sur chaque requête |
| Idempotence | `Idempotency-Key` sur chaque `POST` (générée, ou fournie par l'appelant) |
| Session expirée | sur `401`, un seul `POST /auth/refresh` partagé entre requêtes, puis nouvel essai avec les mêmes en-têtes ; si le refresh est refusé, la session locale est effacée |
| Erreurs | corps RFC 7807 converti en `ApiError` (`status`, `code`, `title`, `detail`, `errors[]`, `requestId`, `retryAfter`) |
| Réseau | absence de réponse ou délai dépassé (15 s) → `NetworkError` |
| `204` | renvoie `undefined` |

```ts
import { api } from '@/lib/api';

// Endpoint public
await api.post<TokenResponse>('/auth/login', { email, password }, { auth: false });

// Endpoint authentifié avec filtres
await api.get<Task[]>('/tasks', { query: { status: 'open', household_id: null } });

// Création protégée contre les doubles envois
await api.post<Task>('/tasks', payload, { idempotencyKey });
```

### Session

```tsx
import { useSession } from '@/lib/session';

const { status, signIn, signOut } = useSession();
// status : 'loading' | 'authenticated' | 'unauthenticated'
```

- `SessionProvider` enveloppe l'application dans `app/_layout.tsx`.
- `signIn(response)` enregistre les jetons renvoyés par `/auth/login` ou `/auth/register`.
- `signOut()` appelle `POST /auth/logout` (au mieux) puis efface les jetons.
- Sur Web, les jetons restent en mémoire : la session ne survit pas à un rechargement.
- Le format `TokenResponse` (`access_token`, `refresh_token`, `expires_in`) est à confirmer avec l'OpenAPI v0.

### Idempotence dans un formulaire

```tsx
import { useIdempotencyKey } from '@/hooks/use-idempotency-key';

const idempotency = useIdempotencyKey();

async function handleSubmit() {
  await createTask(payload, idempotency.get()); // même clé si l'utilisateur réessaie
  idempotency.reset();                          // nouvelle clé après succès seulement
}
```

## 5. Ajouter un service à un domaine

Exemple pour les tâches.

### Étape 1 — Types

Les types reprennent le contrat de l'API (dossier directeur § 6.6) : noms de champs en `snake_case`, dates ISO 8601 UTC.

```ts
// src/modules/tasks/types.ts
export type TaskPriority = 1 | 2 | 3 | 4; // basse, normale, haute, urgente

export type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: 'open' | 'done' | 'archived'; // à confirmer avec l'OpenAPI v0
  due_at: string | null;
  owner_user_id: string;
  household_id: string | null;
  assigned_to: string | null;
  version: number;
  created_at: string;
  updated_at: string;
};

export type CreateTaskPayload = Pick<Task, 'title'> &
  Partial<Pick<Task, 'description' | 'priority' | 'due_at' | 'household_id' | 'assigned_to'>>;

export type UpdateTaskPayload = Partial<CreateTaskPayload>;
```

### Étape 2 — Service

```ts
// src/modules/tasks/services/tasks.service.ts
import { api } from '@/lib/api';

import type { CreateTaskPayload, Task, UpdateTaskPayload } from '../types';

export function listTasks(): Promise<Task[]> {
  return api.get<Task[]>('/tasks');
}

export function getTask(id: string): Promise<Task> {
  return api.get<Task>(`/tasks/${id}`);
}

export function createTask(payload: CreateTaskPayload, idempotencyKey: string): Promise<Task> {
  return api.post<Task>('/tasks', payload, { idempotencyKey });
}

export function updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
  return api.patch<Task>(`/tasks/${id}`, payload);
}
```

### Étape 3 — Hook

```ts
// src/modules/tasks/hooks/use-tasks.ts
import { useCallback, useEffect, useState } from 'react';

import { listTasks } from '../services/tasks.service';
import type { Task } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTasks(await listTasks());
    } catch {
      setError('Impossible de charger les tâches.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { tasks, loading, error, reload };
}
```

### Étape 4 — Écran

```tsx
import { useTasks } from '../hooks/use-tasks';

export default function TaskListScreen() {
  const { tasks, loading, error, reload } = useTasks();

  if (loading) {
    return <StateMessage title="Chargement..." />;
  }

  if (error) {
    return <StateMessage title={error} actionLabel="Réessayer" onAction={reload} />;
  }

  return <TaskList tasks={tasks} />;
}
```

Le hook reste interne au module. Aucun autre module ne doit l'importer.

## 6. Gestion des erreurs

```ts
import { isApiError, userMessage } from '@/lib/api';

try {
  await createTask(payload, idempotency.get());
} catch (error) {
  if (isApiError(error) && error.code === 'VALIDATION_ERROR') {
    setFieldErrors(error.fieldErrors()); // { title: 'Champ requis', ... }
  } else {
    setBanner(userMessage(error));       // message français sans détail technique
  }
} finally {
  setLoading(false);
}
```

| Code | Réaction attendue côté écran |
|---|---|
| `401 UNAUTHENTICATED` | déjà géré par le client (refresh, puis session effacée) ; la garde de navigation renvoie vers `/login` |
| `403 FORBIDDEN` / `404 NOT_FOUND` | message neutre, ne pas révéler la ressource |
| `409 CONFLICT` | recharger et proposer une résolution |
| `410 GONE` | lien expiré : proposer de recommencer |
| `422 VALIDATION_ERROR` | erreurs par champ via `fieldErrors()` |
| `429 RATE_LIMITED` | attendre `retryAfter` secondes |
| `5xx` / `NetworkError` | message générique + bouton Réessayer (même clé d'idempotence) |

## 7. Sécurité

- Ne jamais journaliser de token, mot de passe ou contenu de document.
- Les jetons sont stockés dans le Keychain / Keystore (`src/lib/session/token-storage.ts`) ; ne jamais utiliser `AsyncStorage` ni `localStorage` pour des secrets.
- L'en-tête `Authorization` est ajouté à un seul endroit : `src/lib/api/client.ts`.
- Les écrans de confidentialité (`/profile/privacy`) décrivent les engagements produit ; l'implémentation réseau doit les respecter (chiffrement, suppression, export).
- Valider les données reçues avant affichage si elles proviennent d'un tiers.

## 8. Vérifications

```bash
npx tsc --noEmit
npx expo lint
npx expo export --platform web
```

- TypeScript vérifie les contrats de payload et de réponse.
- ESLint vérifie qu'aucun module n'importe un autre module.
- L'export web détecte les imports cassés et les problèmes de rendu serveur.

## 9. Feuille de route d'intégration

1. ~~Client HTTP partagé et session sécurisée~~ (fait : `src/lib`).
2. Réécrire `auth.service.ts` sur `@/lib/api`, le brancher sur `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, puis protéger `(main)`.
3. Ajouter les services `tasks`, `calendar`, `reminders`, `documents`, `household`.
4. Remplacer progressivement les données de démonstration par des hooks de chargement.
5. Ajouter un état global minimal (session + foyer actif) sans introduire de dépendance lourde.
