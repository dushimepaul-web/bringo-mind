import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { api } from '@/lib/api/client';

import { sessionStore, toAuthTokens } from './session-store';
import type { SessionStatus, TokenResponse } from './types';

type SessionContextValue = {
  status: SessionStatus;
  /** Enregistre la session renvoyée par /auth/login ou /auth/register. */
  signIn: (response: TokenResponse) => Promise<void>;
  /** Révoque la session côté serveur (au mieux) puis efface les jetons locaux. */
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function statusOf(hasTokens: boolean): SessionStatus {
  return hasTokens ? 'authenticated' : 'unauthenticated';
}

async function signIn(response: TokenResponse) {
  await sessionStore.setTokens(toAuthTokens(response));
}

async function signOut() {
  try {
    await api.post<void>('/auth/logout');
  } catch {
    // Hors ligne ou session déjà expirée : la déconnexion locale reste prioritaire.
  } finally {
    await sessionStore.clear();
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>('loading');

  useEffect(() => {
    let active = true;
    void sessionStore.hydrate().then((tokens) => {
      if (active) {
        setStatus(statusOf(tokens !== null));
      }
    });
    const unsubscribe = sessionStore.subscribe((tokens) => {
      setStatus(statusOf(tokens !== null));
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return <SessionContext value={{ status, signIn, signOut }}>{children}</SessionContext>;
}

export function useSession(): SessionContextValue {
  const context = use(SessionContext);
  if (!context) {
    throw new Error('useSession doit être utilisé sous <SessionProvider>.');
  }
  return context;
}
