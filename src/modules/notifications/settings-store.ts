// Réglages des notifications (démo) : enregistrés dès qu'on touche un interrupteur, partagés entre
// le centre de notifications (pastille « Silence ») et l'écran des réglages.
import { useSyncExternalStore } from 'react';

import { DEMO_TODAY } from '@/lib/demo-dates';

export type NotificationSettings = {
  enabled: boolean;
  channels: Record<'push' | 'email' | 'sms', boolean>;
  types: Record<'tasks' | 'reminders' | 'events' | 'documents' | 'household' | 'kora' | 'product', boolean>;
  quiet: boolean;
  quietStart: [number, number];
  quietEnd: [number, number];
  critical: boolean;
};

let state: NotificationSettings = {
  enabled: true,
  channels: { push: true, email: true, sms: false },
  types: { tasks: true, reminders: true, events: true, documents: true, household: true, kora: false, product: false },
  quiet: true,
  quietStart: [22, 0],
  quietEnd: [7, 0],
  critical: true,
};

const listeners = new Set<() => void>();

export function useNotificationSettings(): NotificationSettings {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state,
  );
}

export function updateNotificationSettings(change: (current: NotificationSettings) => NotificationSettings) {
  state = change(state);
  listeners.forEach((listener) => listener());
}

/** « 22h », « 7h », « 22h30 » : heure courte pour la pastille. */
export function shortHour([hours, minutes]: [number, number]): string {
  return minutes ? `${hours}h${String(minutes).padStart(2, '0')}` : `${hours}h`;
}

/** Vrai si l'heure de démo tombe dans la plage de silence (qui peut passer minuit). */
export function inQuietNow(settings: NotificationSettings, now: Date = DEMO_TODAY): boolean {
  if (!settings.enabled || !settings.quiet) return false;
  const minute = now.getHours() * 60 + now.getMinutes();
  const start = settings.quietStart[0] * 60 + settings.quietStart[1];
  const end = settings.quietEnd[0] * 60 + settings.quietEnd[1];
  return start <= end ? minute >= start && minute < end : minute >= start || minute < end;
}
