import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { api, restoreSession } from '@/lib/api/client';
import { IS_DEMO } from '@/lib/config';
import { loadFeatureFlags, resetFeatureFlags } from '@/lib/feature-flags';

import { sessionStore, toStoredSession } from './session-store';
import type { SessionStatus, SessionUser, TokenResponse } from './types';

type SessionContextValue = {
  status: SessionStatus;
  /** Utilisateur connecté (null en démo ou sans session). */
  user: SessionUser | null;
  /** Enregistre la session renvoyée par POST /auth/login. */
  signIn: (response: TokenResponse) => Promise<void>;
  /** Révoque la session côté serveur (au mieux) puis efface la session locale. */
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

async function signIn(response: TokenResponse) {
  await sessionStore.set(toStoredSession(response));
  void loadFeatureFlags();
}

async function signOut() {
  if (!IS_DEMO) {
    try {
      // La session est retrouvée par le cookie : fonctionne même si le jeton d'accès a expiré.
      await api.post<void>('/auth/logout');
    } catch {
      // Hors ligne ou session déjà expirée : la déconnexion locale reste prioritaire.
    }
  }
  await sessionStore.clear();
  resetFeatureFlags();
}

export function SessionProvider({ children }: { children: ReactNode }) {
  // Démo : Claire est toujours connectée, aucune requête réseau.
  const [status, setStatus] = useState<SessionStatus>(IS_DEMO ? 'authenticated' : 'loading');
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    if (IS_DEMO) return;
    let active = true;
    void restoreSession().then((result) => {
      if (!active) return;
      setUser(sessionStore.getUser());
      setStatus(result === 'unauthenticated' ? 'unauthenticated' : 'authenticated');
      if (result === 'authenticated') void loadFeatureFlags();
    });
    const unsubscribe = sessionStore.subscribe((session) => {
      setUser(session?.user ?? null);
      setStatus(session ? 'authenticated' : 'unauthenticated');
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return <SessionContext value={{ status, user, signIn, signOut }}>{children}</SessionContext>;
}

export function useSession(): SessionContextValue {
  const context = use(SessionContext);
  if (!context) {
    throw new Error('useSession doit être utilisé sous <SessionProvider>.');
  }
  return context;
}
