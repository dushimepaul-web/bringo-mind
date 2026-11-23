// Notifications de démonstration (cohérentes avec Tâches, Calendrier, Documents, Foyer, Intégrations).
import type { Href } from 'expo-router';
import { useSyncExternalStore } from 'react';

import { userMessage } from '@/lib/api';
import { IS_DEMO } from '@/lib/config';
import { DEMO_TODAY, addDays, atTime } from '@/lib/demo-dates';

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

const today = DEMO_TODAY;

const DEMO: AppNotification[] = [
  {
    id: 'n-attestation',
    kind: 'task',
    title: 'Échéance aujourd’hui à 17h00',
    body: 'Renvoyer l’attestation de domicile signée',
    at: atTime(today, 9, 0),
    read: false,
    href: { pathname: '/tasks/detail', params: { id: 'attestation' } },
  },
  {
    id: 'n-engie',
    kind: 'document',
    title: 'Facture Engie à vérifier',
    body: 'Kora a repéré 118,50 €, prélevés le 27 mai',
    at: atTime(today, 8, 47),
    read: false,
    href: { pathname: '/documents/detail', params: { id: 'engie' } },
  },
  {
    id: 'n-foncia',
    kind: 'document',
    title: 'Nouvel e-mail importé',
    body: 'Foncia : votre attestation de domicile 2024',
    at: atTime(today, 8, 42),
    read: false,
    href: { pathname: '/integrations/email', params: { id: 'foncia' } },
  },
  {
    id: 'n-foot',
    kind: 'household',
    title: 'Thomas a ajouté un événement',
    body: 'Match de football de Léo • samedi 18 mai à 10h00',
    at: atTime(today, 8, 40),
    read: true,
    href: { pathname: '/calendar/detail', params: { id: 'foot' } },
  },
  {
    id: 'n-ecole',
    kind: 'event',
    title: 'Aujourd’hui à 16h45',
    body: 'Thomas récupère Léo à l’école Jean Moulin',
    at: atTime(today, 7, 30),
    read: true,
    href: { pathname: '/calendar/detail', params: { id: 'leo-ecole' } },
  },
  {
    id: 'n-jeanne',
    kind: 'household',
    title: 'Invitation envoyée',
    body: 'jeanne.martin@email.fr n’a pas encore répondu',
    at: atTime(addDays(today, -1), 18, 40),
    read: true,
    href: '/household/members',
  },
  {
    id: 'n-caf',
    kind: 'task',
    title: 'Tâche en retard',
    body: 'Répondre au courrier de la CAF • prévue hier',
    at: atTime(addDays(today, -1), 18, 0),
    read: false,
    href: { pathname: '/tasks/detail', params: { id: 'caf' } },
  },
  {
    id: 'n-ophtalmo',
    kind: 'event',
    title: 'Rappel : événement jeudi',
    body: 'Contrôle ophtalmologique • 16 mai à 14h30',
    at: atTime(addDays(today, -1), 9, 0),
    read: true,
    href: { pathname: '/calendar/detail', params: { id: 'ophtalmo' } },
  },
  {
    id: 'n-cantine',
    kind: 'household',
    title: 'Tâche terminée par Thomas',
    body: 'Régler la cantine scolaire du 2e trimestre',
    at: atTime(addDays(today, -2), 10, 30),
    read: true,
    href: { pathname: '/tasks/detail', params: { id: 'cantine' } },
  },
];

type Snapshot = { items: AppNotification[]; error: string | null };

let state: Snapshot = { items: DEMO, error: null };

/** Mode « api » : envoie la requête ; en cas d'échec, annule la modification locale. */
function remote(call: () => Promise<unknown>, rollback: () => void) {
  if (IS_DEMO) return;
  call().catch((reason: unknown) => {
    rollback();
    emit({ error: userMessage(reason) });
  });
}
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

export function useNotifications(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const notificationActions = {
  setRead(id: string, read: boolean) {
    const previous = state.items;
    emit({ items: state.items.map((item) => (item.id === id ? { ...item, read } : item)) });
    // Le serveur ne connaît que « marquer comme lu » : pas d'appel pour repasser non lue.
    if (read) remote(() => notificationsApi.read(id), () => emit({ items: previous }));
  },
  /** Marque tout comme lu et renvoie de quoi annuler. */
  readAll(): () => void {
    const previous = state.items;
    emit({ items: state.items.map((item) => ({ ...item, read: true })) });
    remote(() => notificationsApi.readAll(), () => emit({ items: previous }));
    return () => emit({ items: previous });
  },
  remove(id: string): () => void {
    const previous = state.items;
    emit({ items: state.items.filter((item) => item.id !== id) });
    remote(() => notificationsApi.remove(id), () => emit({ items: previous }));
    return () => emit({ items: previous });
  },
};

/** Charge les notifications depuis l'API (mode « api ») ; ne fait rien en démo. */
export async function syncNotifications(): Promise<void> {
  if (IS_DEMO) return;
  const items = await notificationsApi.list();
  emit({ items: items.map(toNotification) });
}
