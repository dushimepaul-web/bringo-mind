// Centre de notifications, alimenté uniquement par l'API (contrat 2.11.0, API-NOT-005 à 009).
import type { Href } from 'expo-router';
import { useSyncExternalStore } from 'react';

import { userMessage } from '@/lib/api';
import { sessionStore } from '@/lib/session';

import { notificationsApi, toNotification } from './services/notifications.service';

export type NotificationKind = 'task' | 'event' | 'document' | 'household';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  at: Date;
  read: boolean;
  href: Href;
};

type Snapshot = { items: AppNotification[]; unread: number; error: string | null };

const EMPTY: Snapshot = { items: [], unread: 0, error: null };

/** Délai avant la suppression définitive côté serveur (le temps de pouvoir annuler). */
const DELETE_DELAY_MS = 5000;

let state: Snapshot = EMPTY;
const listeners = new Set<() => void>();
const pendingDeletes = new Map<string, ReturnType<typeof setTimeout>>();

function emit(next: Partial<Snapshot>) {
  state = { ...state, ...next };
  if (!('unread' in next) && next.items) state = { ...state, unread: next.items.filter((item) => !item.read).length };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;

// Déconnexion : on oublie les notifications du compte précédent.
sessionStore.subscribe((session) => {
  if (!session) {
    pendingDeletes.forEach((timer) => clearTimeout(timer));
    pendingDeletes.clear();
    state = EMPTY;
    for (const listener of listeners) listener();
  }
});

/** Envoie la requête ; en cas d'échec, annule la modification locale et garde le message. */
function remote(call: () => Promise<unknown>, rollback: () => void) {
  call().catch((reason: unknown) => {
    rollback();
    emit({ error: userMessage(reason) });
  });
}

export function useNotifications(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const notificationActions = {
  /** Marque comme lue (le serveur ne propose pas de repasser une notification en non lue). */
  markRead(id: string) {
    const item = state.items.find((entry) => entry.id === id);
    if (!item || item.read) return;
    const previous = state.items;
    emit({ items: state.items.map((entry) => (entry.id === id ? { ...entry, read: true } : entry)) });
    remote(() => notificationsApi.read(id), () => emit({ items: previous }));
  },
  readAll() {
    const previous = state.items;
    emit({ items: state.items.map((item) => ({ ...item, read: true })) });
    remote(() => notificationsApi.readAll(), () => emit({ items: previous }));
  },
  /** Retire la notification ; la suppression part au serveur après quelques secondes, sauf « Annuler ». */
  remove(id: string): () => void {
    const index = state.items.findIndex((entry) => entry.id === id);
    const item = state.items[index];
    if (!item) return () => undefined;
    emit({ items: state.items.filter((entry) => entry.id !== id) });
    const putBack = () => {
      if (state.items.some((entry) => entry.id === id)) return;
      const copy = [...state.items];
      copy.splice(Math.max(Math.min(index, copy.length), 0), 0, item);
      emit({ items: copy });
    };
    const timer = setTimeout(() => {
      pendingDeletes.delete(id);
      remote(() => notificationsApi.remove(id), putBack);
    }, DELETE_DELAY_MS);
    pendingDeletes.set(id, timer);
    return () => {
      clearTimeout(timer);
      pendingDeletes.delete(id);
      putBack();
    };
  },
  clearError() {
    emit({ error: null });
  },
};

/** Charge les notifications (les plus récentes d'abord). */
export async function syncNotifications(): Promise<void> {
  const items = await notificationsApi.list();
  // Les notifications en cours de suppression restent masquées.
  emit({ items: items.map(toNotification).filter((item) => !pendingDeletes.has(item.id)) });
}

/** Nombre de notifications non lues (pastille de l'en-tête). */
export async function syncUnreadCount(): Promise<void> {
  const unread = await notificationsApi.unreadCount();
  emit({ unread: typeof unread === 'number' ? unread : state.unread });
}
