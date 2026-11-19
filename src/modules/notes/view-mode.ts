// Affichage choisi pour la liste des notes (liste, cartes, grille), gardé sur l'appareil.
import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';

export type NotesView = 'list' | 'cards' | 'grid';

export const NOTES_VIEWS: { key: NotesView; label: string; hint: string; icon: string }[] = [
  { key: 'list', label: 'Liste', hint: 'Miniature, titre et date', icon: 'view_list' },
  { key: 'cards', label: 'Cartes', hint: 'Une carte par note, avec le début du texte', icon: 'view_agenda' },
  { key: 'grid', label: 'Grille', hint: 'Deux notes par ligne, comme des pages', icon: 'grid_view' },
];

const KEY = 'bm.notes.view';
let view: NotesView = 'list';
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

export function useNotesView(): NotesView {
  return useSyncExternalStore(subscribe, () => view, () => view);
}

export function setNotesView(next: NotesView) {
  if (next === view) return;
  view = next;
  emit();
  SecureStore.setItemAsync(KEY, next).catch(() => undefined);
}
