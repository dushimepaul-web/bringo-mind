// Mémoire de démonstration partagée par les écrans du module Rappels.
import { useSyncExternalStore } from 'react';

import { IS_DEMO } from '@/lib/config';

import { DEMO_REMINDERS } from './data';
import { remindersApi, toReminder } from './services/reminders.service';
import type { Reminder, ReminderDraft } from './types';

type Snapshot = {
  reminders: Reminder[];
  /** Démo : notifications autorisées sur ce téléphone. */
  notificationsAllowed: boolean;
  flash: { text: string; undo?: () => void } | null;
};

let state: Snapshot = { reminders: DEMO_REMINDERS, notificationsAllowed: false, flash: null };
const listeners = new Set<() => void>();

function emit(next: Partial<Snapshot>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;

function update(id: string, patch: Partial<Reminder>) {
  emit({ reminders: state.reminders.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
}

export function useReminderState(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useReminder(id: string | undefined): Reminder | undefined {
  return useReminderState().reminders.find((item) => item.id === id);
}

export const reminderActions = {
  setPaused(id: string, paused: boolean) {
    update(id, { paused });
  },
  /** Repousse le rappel de quelques minutes. */
  snooze(id: string, minutes: number) {
    const item = state.reminders.find((entry) => entry.id === id);
    if (item) update(id, { at: new Date(item.at.getTime() + minutes * 60000) });
  },
  /** Reprise d'un envoi manqué (démo : l'envoi réussit). */
  resend(id: string) {
    update(id, { delivery: { status: 'sent', detail: 'Renvoyé avec succès' } });
  },
  allowNotifications(allowed: boolean) {
    emit({ notificationsAllowed: allowed });
  },
  remove(id: string): () => void {
    const index = state.reminders.findIndex((entry) => entry.id === id);
    const item = state.reminders[index];
    emit({ reminders: state.reminders.filter((entry) => entry.id !== id) });
    return () => {
      if (!item || state.reminders.some((entry) => entry.id === id)) return;
      const copy = [...state.reminders];
      copy.splice(Math.max(index, 0), 0, item);
      emit({ reminders: copy });
    };
  },
  create(draft: ReminderDraft): string {
    const id = `r-${Date.now().toString(36)}`;
    emit({ reminders: [{ ...draft, id, paused: false }, ...state.reminders] });
    return id;
  },
  save(id: string, draft: ReminderDraft) {
    update(id, draft);
  },
  setFlash(flash: Snapshot['flash']) {
    emit({ flash });
  },
};

/** Charge les rappels depuis l'API (mode « api ») ; ne fait rien en démo. */
export async function syncReminders(): Promise<void> {
  if (IS_DEMO) return;
  const items = await remindersApi.list();
  emit({ reminders: items.map(toReminder) });
}
