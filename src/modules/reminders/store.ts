// Mémoire partagée par les écrans du module Rappels, alimentée uniquement par l'API (contrat 2.11.0).
// Chaque action s'affiche tout de suite (mise à jour optimiste), puis la requête part ;
// en cas d'échec, l'écran revient à l'état précédent et un message explique pourquoi.
import { useSyncExternalStore } from 'react';

import { userMessage } from '@/lib/api';
import { newId } from '@/lib/id';
import { sessionStore } from '@/lib/session';

import { remindersApi, toReminder, type ReminderDto } from './services/reminders.service';
import type { QuietHours, Reminder, ReminderDraft, ReminderLink } from './types';

type Snapshot = {
  reminders: Reminder[];
  /** Heures de silence de l'utilisateur (null : aucune). */
  quietHours: QuietHours;
  /** Tâches et événements auxquels un rappel peut être rattaché. */
  targets: ReminderLink[];
  flash: { text: string; undo?: () => void } | null;
};

const EMPTY: Snapshot = { reminders: [], quietHours: null, targets: [], flash: null };

let state: Snapshot = EMPTY;
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

// Déconnexion : on oublie les rappels du compte précédent.
sessionStore.subscribe((session) => {
  if (!session) {
    state = EMPTY;
    for (const listener of listeners) listener();
  }
});

function find(id: string): Reminder | undefined {
  return state.reminders.find((item) => item.id === id);
}

function update(id: string, patch: Partial<Reminder>) {
  emit({ reminders: state.reminders.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
}

/** Remplace un rappel par la version du serveur (garde le titre et la cible si la réponse ne les donne pas). */
function replace(id: string, dto: ReminderDto) {
  const before = find(id);
  const next = toReminder(dto, before);
  emit({ reminders: state.reminders.map((item) => (item.id === id ? next : item)) });
}

/** Envoie la requête ; en cas d'échec, annule la modification locale et explique pourquoi. */
function remote<T>(call: () => Promise<T>, onSuccess: (result: T) => void, rollback: () => void) {
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

/** Charge les rappels et les heures de silence. Appelé par la liste (tirer pour actualiser). */
export async function syncReminders(): Promise<void> {
  const [items, quietHours] = await Promise.all([
    remindersApi.list(),
    remindersApi.quietHours().catch(() => state.quietHours),
  ]);
  emit({ reminders: items.map((dto) => toReminder(dto)), quietHours });
}

/** Charge les tâches et événements proposés dans le formulaire (« Associer à »). */
export async function syncReminderTargets(): Promise<void> {
  const [targets, quietHours] = await Promise.all([
    remindersApi.targets(),
    remindersApi.quietHours().catch(() => state.quietHours),
  ]);
  emit({ targets, quietHours });
}

export const reminderActions = {
  /** Repousse le rappel (10 minutes à 24 heures) ; « Annuler » remet l'heure précédente. */
  snooze(id: string, minutes: number): () => void {
    const before = find(id);
    if (!before) return () => undefined;
    update(id, { at: new Date(Math.max(before.at.getTime(), Date.now()) + minutes * 60000) });
    remote(() => remindersApi.snooze(id, minutes), (dto) => replace(id, dto), () => update(id, before));
    return () => reminderActions.reschedule(id, before.at);
  },
  /** Nouvelle heure d'envoi. */
  reschedule(id: string, at: Date) {
    const before = find(id);
    if (!before) return;
    update(id, { at });
    remote(() => remindersApi.reschedule(id, at), (dto) => replace(id, dto), () => update(id, before));
  },
  /** Réactive un rappel désactivé ou un envoi manqué. */
  reactivate(id: string) {
    const before = find(id);
    if (!before) return;
    update(id, { paused: false, delivery: undefined });
    remote(() => remindersApi.reactivate(id), (dto) => replace(id, dto), () => update(id, before));
  },
  /** Suppression ; renvoie « Annuler », qui recrée le rappel à l'identique s'il est encore à venir. */
  remove(id: string): (() => void) | undefined {
    const index = state.reminders.findIndex((entry) => entry.id === id);
    const item = state.reminders[index];
    if (!item) return undefined;
    emit({ reminders: state.reminders.filter((entry) => entry.id !== id) });
    const putBack = () => {
      if (state.reminders.some((entry) => entry.id === item.id)) return;
      const copy = [...state.reminders];
      copy.splice(Math.max(Math.min(index, copy.length), 0), 0, item);
      emit({ reminders: copy });
    };
    remote(() => remindersApi.remove(id), () => undefined, putBack);
    // Le serveur supprime vraiment : « Annuler » n'est possible que pour un rappel encore à venir.
    if (item.delivery || item.at.getTime() <= Date.now()) return undefined;
    return () => {
      reminderActions.create({ at: item.at, repeat: item.repeat, channels: item.channels, link: item.link });
    };
  },
  /** Crée le rappel ; renvoie son identifiant local. */
  create(draft: ReminderDraft): string {
    const link = draft.link;
    const id = `local-${newId()}`;
    if (!link) return id;
    const optimistic: Reminder = {
      id,
      title: link.title,
      at: draft.at,
      repeat: draft.repeat,
      repeatsLeft: draft.repeat === 'daily' ? 3 : 0,
      channels: draft.channels,
      link,
      paused: false,
      deferred: false,
    };
    emit({ reminders: [optimistic, ...state.reminders] });
    remote(
      () => remindersApi.create({ ...draft, link }, newId()),
      (dto) => replace(id, dto),
      () => emit({ reminders: state.reminders.filter((entry) => entry.id !== id) }),
    );
    return id;
  },
  /**
   * Enregistre une modification. L'API ne modifie que l'heure d'envoi : si les canaux, la répétition
   * ou la cible changent, le rappel est recréé puis l'ancien supprimé.
   */
  save(id: string, draft: ReminderDraft) {
    const before = find(id);
    const link = draft.link;
    if (!before || !link) return;
    const sameShape =
      before.repeat === draft.repeat &&
      before.link.kind === link.kind &&
      before.link.id === link.id &&
      before.channels.length === draft.channels.length &&
      before.channels.every((channel) => draft.channels.includes(channel));
    if (sameShape) {
      reminderActions.reschedule(id, draft.at);
      return;
    }
    update(id, { at: draft.at, repeat: draft.repeat, channels: draft.channels, link, title: link.title });
    remote(
      async () => {
        const created = await remindersApi.create({ ...draft, link }, newId());
        await remindersApi.remove(id).catch(() => undefined);
        return created;
      },
      (dto) => replace(id, dto),
      () => update(id, before),
    );
  },
  setFlash(flash: Snapshot['flash']) {
    emit({ flash });
  },
};
