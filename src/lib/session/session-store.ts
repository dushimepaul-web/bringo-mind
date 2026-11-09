import { deleteTokens, readTokens, writeTokens } from './token-storage';
import type { AuthTokens, TokenResponse } from './types';

/**
 * Source unique des jetons, indépendante de React.
 * Le client HTTP la lit à chaque requête ; SessionProvider s'y abonne pour l'UI.
 */
type Listener = (tokens: AuthTokens | null) => void;

let current: AuthTokens | null = null;
let hydration: Promise<AuthTokens | null> | null = null;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) {
    listener(current);
  }
}

export function toAuthTokens(response: TokenResponse): AuthTokens {
  return { accessToken: response.access_token, refreshToken: response.refresh_token };
}

export const sessionStore = {
  /** Charge les jetons persistés une seule fois au démarrage. */
  hydrate(): Promise<AuthTokens | null> {
    hydration ??= readTokens().then((tokens) => {
      current = tokens;
      return tokens;
    });
    return hydration;
  },

  getTokens(): AuthTokens | null {
    return current;
  },

  async setTokens(tokens: AuthTokens): Promise<void> {
    current = tokens;
    emit();
    await writeTokens(tokens);
  },

  async clear(): Promise<void> {
    if (current === null) {
      return;
    }
    current = null;
    emit();
    await deleteTokens();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
