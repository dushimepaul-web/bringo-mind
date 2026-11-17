// Apparence de l'app : clair, sombre ou comme le téléphone (« système »).
// Partagé : bouton soleil/lune de l'accueil et Préférences > Apparence. Le choix est gardé sur l'appareil.
import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

const KEY = 'bm.theme';
const MODES: ThemeMode[] = ['light', 'dark', 'system'];

let mode: ThemeMode = 'light';
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/** Abonnement aux changements d'apparence (utilisé aussi par le module Profil). */
export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Reprend le dernier choix enregistré sur l'appareil.
SecureStore.getItemAsync(KEY)
  .then((saved) => {
    if (saved && MODES.includes(saved as ThemeMode) && saved !== mode) {
      mode = saved as ThemeMode;
      emit();
    }
  })
  .catch(() => undefined);

export function getThemeMode(): ThemeMode {
  return mode;
}

export function setThemeMode(next: ThemeMode) {
  if (!MODES.includes(next) || next === mode) return;
  mode = next;
  emit();
  SecureStore.setItemAsync(KEY, next).catch(() => undefined);
}

export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(subscribeTheme, getThemeMode, getThemeMode);
}

/** true si l'app doit s'afficher en sombre (choix « sombre », ou « système » sur un téléphone en sombre). */
export function useIsDark(): boolean {
  const current = useThemeMode();
  const system = useColorScheme();
  return current === 'dark' || (current === 'system' && system === 'dark');
}
