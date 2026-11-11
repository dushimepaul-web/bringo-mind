// Verrouillage de l'app par Face ID / empreinte (réglé dans Mon profil → Déverrouillage biométrique).
// Partagé : le module Profil configure ce verrou, l'écran de verrouillage le lit.
// Démo : la reconnaissance est simulée. Version réelle : expo-local-authentication (à ajouter au build).
import { useSyncExternalStore } from 'react';

export type LockDelay = 'now' | '1min' | '5min';

const DELAY_MS: Record<LockDelay, number> = { now: 0, '1min': 60_000, '5min': 300_000 };

type State = {
  enabled: boolean;
  delay: LockDelay;
  /** Verrouillé au démarrage à froid si la biométrie est activée. */
  locked: boolean;
  backgroundAt: number | null;
};

let state: State = { enabled: true, delay: '1min', locked: true, backgroundAt: null };
const listeners = new Set<() => void>();

function emit(next: Partial<State>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAppLock(): State {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export const appLock = {
  configure(next: { enabled?: boolean; delay?: LockDelay }) {
    emit({ ...next, ...(next.enabled === false ? { locked: false } : {}) });
  },
  /** L'app passe en arrière-plan. */
  wentBackground() {
    emit({ backgroundAt: Date.now() });
  },
  /** L'app revient au premier plan : verrouille si le délai choisi est dépassé. */
  cameBack() {
    if (!state.enabled || state.backgroundAt === null) return;
    const away = Date.now() - state.backgroundAt;
    emit({ backgroundAt: null, ...(away >= DELAY_MS[state.delay] ? { locked: true } : {}) });
  },
  lockNow(): boolean {
    if (!state.enabled) return false;
    emit({ locked: true });
    return true;
  },
  unlock() {
    emit({ locked: false });
  },
};
