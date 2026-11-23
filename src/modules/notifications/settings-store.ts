// Réglages des notifications, synchronisés avec GET / PUT /notifications/preferences (API-NOT-003 / 004).
// Chaque interrupteur s'enregistre tout de suite (mise à jour optimiste) ; en cas d'échec,
// l'interrupteur revient à sa position et un message explique pourquoi.
import { useSyncExternalStore } from 'react';

import { userMessage } from '@/lib/api';
import { today } from '@/lib/demo-dates';
import { sessionStore } from '@/lib/session';

import { notificationsApi, type PreferencesDto } from './services/notifications.service';

export type NotificationChannelKey = 'in_app' | 'web_push' | 'email';

export type NotificationSettings = {
  /** true après le premier chargement réussi. */
  loaded: boolean;
  channels: Record<NotificationChannelKey, boolean>;
  quiet: boolean;
  quietStart: [number, number];
  quietEnd: [number, number];
  /** Rappels des tâches urgentes envoyés même pendant le silence. */
  critical: boolean;
  /** Résumé du matin. */
  dailySummary: boolean;
  /** Résumé de la semaine. */
  weeklySummary: boolean;
  /** Rappel le jour même de l'échéance. */
  sameDay: boolean;
  /** Dernier message d'erreur (enregistrement refusé). */
  error: string | null;
};

const DEFAULTS: NotificationSettings = {
  loaded: false,
  channels: { in_app: true, web_push: false, email: false },
  quiet: false,
  quietStart: [22, 0],
  quietEnd: [7, 0],
  critical: true,
  dailySummary: false,
  weeklySummary: false,
  sameDay: true,
  error: null,
};

let state: NotificationSettings = DEFAULTS;
const listeners = new Set<() => void>();

function set(next: NotificationSettings) {
  state = next;
  listeners.forEach((listener) => listener());
}

sessionStore.subscribe((session) => {
  if (!session) set(DEFAULTS);
});

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

const pad = (value: number) => String(value).padStart(2, '0');
const toTime = ([hours, minutes]: [number, number]) => `${pad(hours)}:${pad(minutes)}:00`;

function toPair(value: string | null | undefined, fallback: [number, number]): [number, number] {
  if (!value) return fallback;
  const [hours, minutes] = value.split(':').map(Number);
  return [Number.isFinite(hours) ? hours : fallback[0], Number.isFinite(minutes) ? minutes : fallback[1]];
}

function fromDto(prefs: PreferencesDto): NotificationSettings {
  const channels = prefs.channels ?? [];
  return {
    loaded: true,
    channels: {
      in_app: channels.includes('in_app'),
      web_push: channels.includes('web_push'),
      email: channels.includes('email'),
    },
    quiet: Boolean(prefs.quiet_hours_start && prefs.quiet_hours_end),
    quietStart: toPair(prefs.quiet_hours_start, state.quietStart),
    quietEnd: toPair(prefs.quiet_hours_end, state.quietEnd),
    critical: Boolean(prefs.escalate_critical),
    dailySummary: Boolean(prefs.daily_summary),
    weeklySummary: Boolean(prefs.weekly_summary),
    sameDay: prefs.same_day_reminder ?? true,
    error: null,
  };
}

/** Champs de `PreferencesIn` qui ont changé (seuls les champs envoyés sont enregistrés). */
function diff(before: NotificationSettings, after: NotificationSettings): Partial<PreferencesDto> {
  const body: Partial<PreferencesDto> = {};
  const keys = Object.keys(after.channels) as NotificationChannelKey[];
  if (keys.some((key) => before.channels[key] !== after.channels[key])) {
    body.channels = keys.filter((key) => after.channels[key]);
  }
  const quietChanged =
    before.quiet !== after.quiet ||
    toTime(before.quietStart) !== toTime(after.quietStart) ||
    toTime(before.quietEnd) !== toTime(after.quietEnd);
  if (quietChanged) {
    body.quiet_hours_start = after.quiet ? toTime(after.quietStart) : null;
    body.quiet_hours_end = after.quiet ? toTime(after.quietEnd) : null;
  }
  if (before.critical !== after.critical) body.escalate_critical = after.critical;
  if (before.dailySummary !== after.dailySummary) body.daily_summary = after.dailySummary;
  if (before.weeklySummary !== after.weeklySummary) body.weekly_summary = after.weeklySummary;
  if (before.sameDay !== after.sameDay) body.same_day_reminder = after.sameDay;
  return body;
}

export function updateNotificationSettings(change: (current: NotificationSettings) => NotificationSettings) {
  const before = state;
  const after = { ...change(state), error: null };
  const body = diff(before, after);
  set(after);
  if (Object.keys(body).length === 0) return;
  notificationsApi
    .savePreferences(body)
    .then((prefs) => {
      if (prefs) set(fromDto(prefs));
    })
    .catch((error: unknown) => set({ ...before, error: userMessage(error) }));
}

export function clearNotificationSettingsError() {
  if (state.error) set({ ...state, error: null });
}

/** Charge les préférences du serveur (écran des réglages, pastille « Silence »). */
export async function syncNotificationPreferences(): Promise<void> {
  const prefs = await notificationsApi.preferences();
  if (prefs) set(fromDto(prefs));
}

/** « 22h », « 7h », « 22h30 » : heure courte pour la pastille. */
export function shortHour([hours, minutes]: [number, number]): string {
  return minutes ? `${hours}h${String(minutes).padStart(2, '0')}` : `${hours}h`;
}

/** Vrai si l'heure actuelle tombe dans la plage de silence (qui peut passer minuit). */
export function inQuietNow(settings: NotificationSettings, now: Date = today()): boolean {
  if (!settings.loaded || !settings.quiet) return false;
  const minute = now.getHours() * 60 + now.getMinutes();
  const start = settings.quietStart[0] * 60 + settings.quietStart[1];
  const end = settings.quietEnd[0] * 60 + settings.quietEnd[1];
  return start <= end ? minute >= start && minute < end : minute >= start || minute < end;
}
