// Affichage choisi pour la liste des documents (liste, cartes, grille), gardé sur l'appareil.
import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';

export type DocsView = 'list' | 'cards' | 'grid';

export const DOCS_VIEWS: { key: DocsView; label: string; hint: string; icon: string }[] = [
  { key: 'list', label: 'Liste', hint: 'Icône, nom, taille et date', icon: 'view_list' },
  { key: 'cards', label: 'Cartes', hint: 'Une carte par document, avec ses détails', icon: 'view_agenda' },
  { key: 'grid', label: 'Grille', hint: 'Deux aperçus par ligne, comme la galerie', icon: 'grid_view' },
];

const KEY = 'bm.documents.view';
let view: DocsView = 'list';
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

SecureStore.getItemAsync(KEY)
  .then((saved) => {
    if (saved === 'list' || saved === 'cards' || saved === 'grid') {
      view = saved;
      emit();
    }
  })
  .catch(() => undefined);

export function useDocsView(): DocsView {
  return useSyncExternalStore(subscribe, () => view, () => view);
}

export function setDocsView(next: DocsView) {
  if (next === view) return;
  view = next;
  emit();
  SecureStore.setItemAsync(KEY, next).catch(() => undefined);
}
