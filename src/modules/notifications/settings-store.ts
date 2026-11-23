// Réglages des notifications : enregistrés dès qu'on touche un interrupteur, partagés entre
// le centre de notifications (pastille « Silence ») et l'écran des réglages.
// Mode « api » : synchronisés avec GET/PUT /notifications/preferences.
import { useSyncExternalStore } from 'react';

import { IS_DEMO } from '@/lib/config';
import { DEMO_TODAY } from '@/lib/demo-dates';

import { notificationsApi } from './services/notifications.service';

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
  if (!IS_DEMO) persist();
}

/** Convertit l'état local en PreferencesIn et l'envoie (au mieux). */
function persist() {
  const toTime = ([hours, minutes]: [number, number]) =>
    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  notificationsApi
    .savePreferences({
      channels: [
        ...(state.channels.email ? ['email'] : []),
        ...(state.channels.push ? ['in_app'] : []),
      ],
      quiet_hours_start: state.quiet ? toTime(state.quietStart) : null,
      quiet_hours_end: state.quiet ? toTime(state.quietEnd) : null,
      escalate_critical: state.critical,
    })
    .catch(() => undefined);
}

/** Charge les préférences depuis l'API (mode « api »). */
export async function syncNotificationPreferences(): Promise<void> {
  if (IS_DEMO) return;
  try {
    const prefs = await notificationsApi.preferences();
    const channels = Array.isArray(prefs.channels) ? prefs.channels : [];
    const toPair = (value: unknown, fallback: [number, number]): [number, number] => {
      if (typeof value !== 'string') return fallback;
      const [hours, minutes] = value.split(':').map(Number);
      return [Number.isFinite(hours) ? hours : fallback[0], Number.isFinite(minutes) ? minutes : fallback[1]];
    };
    state = {
      ...state,
      channels: {
        push: channels.some((channel) => channel === 'in_app' || channel === 'web_push'),
        email: channels.some((channel) => channel === 'email'),
        sms: state.channels.sms,
      },
      quiet: Boolean(prefs.quiet_hours_start && prefs.quiet_hours_end),
      quietStart: toPair(prefs.quiet_hours_start, state.quietStart),
      quietEnd: toPair(prefs.quiet_hours_end, state.quietEnd),
      critical: Boolean(prefs.escalate_critical),
    };
    listeners.forEach((listener) => listener());
  } catch {
    // Hors ligne : on garde l'état local.
  }
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
