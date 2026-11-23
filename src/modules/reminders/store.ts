// Mémoire partagée par les écrans du module Rappels.
// Mode « demo » : données de démonstration. Mode « api » : mise à jour optimiste puis requête.
import { useSyncExternalStore } from 'react';

import { userMessage } from '@/lib/api';
import { IS_DEMO } from '@/lib/config';

import { DEMO_REMINDERS } from './data';
import { remindersApi, toReminder, type ReminderDto } from './services/reminders.service';
import type { Reminder, ReminderDraft } from './types';

type Snapshot = {
  reminders: Reminder[];
  /** Démo : notifications autorisées sur ce téléphone. */
  notificationsAllowed: boolean;
  flash: { text: string; undo?: () => void } | null;
};

let state: Snapshot = { reminders: IS_DEMO ? DEMO_REMINDERS : [], notificationsAllowed: false, flash: null };
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

/** Remplace un rappel local par la version renvoyée par le serveur. */
function replace(localId: string, dto: ReminderDto) {
  emit({
    reminders: state.reminders.map((item) => (item.id === localId ? toReminder(dto) : item)),
  });
}

/** Mode « api » : envoie la requête ; en cas d'échec, annule la modification locale. */
function remote<T>(call: () => Promise<T>, onSuccess: (result: T) => void, rollback: () => void) {
  if (IS_DEMO) return;
  call()
    .then(onSuccess)
    .catch((error: unknown) => {
      rollback();
      emit({ flash: { text: userMessage(error) } });
    });
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
    const before = state.reminders.find((entry) => entry.id === id);
    if (!before) return;
    update(id, { at: new Date(before.at.getTime() + minutes * 60000) });
    remote(() => remindersApi.snooze(id, minutes), (dto) => replace(id, dto), () => update(id, before));
  },
  /** Reprise d'un envoi manqué. */
  resend(id: string) {
    const before = state.reminders.find((entry) => entry.id === id);
    if (!before) return;
    update(id, { delivery: { status: 'sent', detail: 'Renvoyé avec succès' } });
    remote(() => remindersApi.reactivate(id), (dto) => replace(id, dto), () => update(id, before));
  },
  allowNotifications(allowed: boolean) {
    emit({ notificationsAllowed: allowed });
  },
  remove(id: string): () => void {
    const index = state.reminders.findIndex((entry) => entry.id === id);
    const item = state.reminders[index];
    emit({ reminders: state.reminders.filter((entry) => entry.id !== id) });
    const putBack = () => {
      if (!item || state.reminders.some((entry) => entry.id === id)) return;
      const copy = [...state.reminders];
      copy.splice(Math.max(index, 0), 0, item);
      emit({ reminders: copy });
    };
    remote(() => remindersApi.remove(id), () => undefined, putBack);
    return putBack;
  },
  create(draft: ReminderDraft): string {
    const id = `r-${Date.now().toString(36)}`;
    emit({ reminders: [{ ...draft, id, paused: false }, ...state.reminders] });
    remote(() => remindersApi.create(draft), (dto) => replace(id, dto), () => emit({ reminders: state.reminders.filter((entry) => entry.id !== id) }));
    return id;
  },
  save(id: string, draft: ReminderDraft) {
    const before = state.reminders.find((entry) => entry.id === id);
    if (!before) return;
    update(id, draft);
    remote(() => remindersApi.update(id, draft.at), (dto) => replace(id, dto), () => update(id, before));
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
