// Affichage choisi pour la liste des rappels (liste, cartes, grille), gardé sur l'appareil.
import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';

export type ReminderView = 'list' | 'cards' | 'grid';

export const REMINDER_VIEWS: { key: ReminderView; label: string; hint: string; icon: string }[] = [
  { key: 'list', label: 'Liste', hint: 'Comme le réveil du téléphone', icon: 'view_list' },
  { key: 'cards', label: 'Cartes', hint: 'Une carte par rappel, avec ses détails', icon: 'view_agenda' },
  { key: 'grid', label: 'Grille', hint: 'Deux rappels par ligne', icon: 'grid_view' },
];

const KEY = 'bm.reminders.view';
let view: ReminderView = 'list';
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

export function useReminderView(): ReminderView {
  return useSyncExternalStore(subscribe, () => view, () => view);
}

export function setReminderView(next: ReminderView) {
  if (next === view) return;
  view = next;
  emit();
  SecureStore.setItemAsync(KEY, next).catch(() => undefined);
}
