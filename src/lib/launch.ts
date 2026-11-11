// État du démarrage : animation d'ouverture (une fois par démarrage à froid, rejouable en démo)
// et mémorisation de la présentation déjà vue (première ouverture).
import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';

let introVisible = true;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** true tant que l'animation d'ouverture doit être affichée. */
export function useIntroVisible(): boolean {
  return useSyncExternalStore(subscribe, () => introVisible, () => introVisible);
}

export function finishIntro() {
  introVisible = false;
  emit();
}

/** Démo : rejouer l'animation d'ouverture. */
export function replayIntro() {
  introVisible = true;
  emit();
}

const ONBOARDED_KEY = 'bm.onboarded';

/** La présentation (3 écrans) a-t-elle déjà été vue sur cet appareil ? */
export async function hasOnboarded(): Promise<boolean> {
  try {
    return (await SecureStore.getItemAsync(ONBOARDED_KEY)) === '1';
  } catch {
    return false;
  }
}

export async function markOnboarded(): Promise<void> {
  try {
    await SecureStore.setItemAsync(ONBOARDED_KEY, '1');
  } catch {
    // Web ou stockage indisponible : la présentation pourra simplement réapparaître.
  }
}
