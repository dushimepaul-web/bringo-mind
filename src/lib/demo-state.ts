// Démo uniquement : simule un état réseau pour relire le design des écrans
// (chargement, erreur, hors ligne) sans backend. Réglable depuis Mon profil → Démo.
import { useSyncExternalStore } from 'react';

export type DemoState = 'normal' | 'loading' | 'error' | 'offline' | 'empty';

let current: DemoState = 'normal';
const listeners = new Set<() => void>();

export function setDemoState(next: DemoState) {
  current = next;
  for (const listener of listeners) listener();
}

export function getDemoState(): DemoState {
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useDemoState(): DemoState {
  return useSyncExternalStore(subscribe, getDemoState, getDemoState);
}

export const DEMO_STATES: { key: DemoState; label: string; hint: string }[] = [
  { key: 'normal', label: 'Normal', hint: 'Les données de démonstration s’affichent' },
  { key: 'loading', label: 'Chargement', hint: 'Les listes restent en cours de chargement' },
  { key: 'error', label: 'Erreur', hint: 'Le serveur ne répond pas' },
  { key: 'offline', label: 'Hors ligne', hint: 'Le téléphone n’a plus de réseau' },
  { key: 'empty', label: 'Vide', hint: 'Un nouveau compte, sans aucun élément' },
];
