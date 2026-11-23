import { deleteSession, readSession, writeSession } from './token-storage';
import type { SessionUser, StoredSession, TokenResponse } from './types';

/**
 * Source unique de la session, indépendante de React.
 * Le client HTTP y lit le jeton à chaque requête ; SessionProvider s'y abonne pour l'interface.
 */
type Listener = (session: StoredSession | null) => void;

let current: StoredSession | null = null;
let hydration: Promise<StoredSession | null> | null = null;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener(current);
}

export function toStoredSession(response: TokenResponse): StoredSession {
  return { accessToken: response.access_token, user: response.user ?? null };
}

export const sessionStore = {
  /** Charge la session enregistrée, une seule fois au démarrage. */
  hydrate(): Promise<StoredSession | null> {
    hydration ??= readSession().then((stored) => {
      current ??= stored;
      return current;
    });
    return hydration;
  },

  get(): StoredSession | null {
    return current;
  },

  getAccessToken(): string | null {
    return current?.accessToken ?? null;
  },

  getUser(): SessionUser | null {
    return current?.user ?? null;
  },

  async set(session: StoredSession): Promise<void> {
    current = session;
    emit();
    await writeSession(session);
  },

  /** Met à jour l'utilisateur (après GET /accounts/me ou une modification du profil). */
  async setUser(user: SessionUser): Promise<void> {
    if (!current) return;
    await sessionStore.set({ ...current, user });
  },

  async clear(): Promise<void> {
    const had = current !== null;
    current = null;
    if (had) emit();
    await deleteSession();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
