// Affichage choisi pour la liste des tâches (liste, cartes, grille), gardé sur l'appareil.
import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';

export type TaskView = 'list' | 'cards' | 'grid';

export const TASK_VIEWS: { key: TaskView; label: string; hint: string; icon: string }[] = [
  { key: 'list', label: 'Liste', hint: 'Une ligne par tâche, compacte', icon: 'view_list' },
  { key: 'cards', label: 'Cartes', hint: 'Une carte par tâche, plus de détails', icon: 'view_agenda' },
  { key: 'grid', label: 'Grille', hint: 'Deux tuiles par ligne', icon: 'grid_view' },
];

const KEY = 'bm.tasks.view';
let view: TaskView = 'list';
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

export function useTaskView(): TaskView {
  return useSyncExternalStore(subscribe, () => view, () => view);
}

export function setTaskView(next: TaskView) {
  if (next === view) return;
  view = next;
  emit();
  SecureStore.setItemAsync(KEY, next).catch(() => undefined);
}
