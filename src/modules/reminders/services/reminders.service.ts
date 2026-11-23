// API Rappels (contrat 2.11.0, docs/backend/modules/06_rappels_et_notifications.md) et conversion
// vers le modèle des écrans. Seul le store de ce module appelle ce fichier.
import { api, getAll } from '@/lib/api';

import type { QuietHours, Reminder, ReminderChannel, ReminderDraft, ReminderLink } from '../types';

type ApiChannel = 'in_app' | 'email' | 'web_push';

/** Rappel tel que renvoyé par l'API (`ReminderListOut` ; `ReminderOut` sans titre ni type de cible). */
export type ReminderDto = {
  id: string;
  channel: ApiChannel;
  channels?: ApiChannel[];
  offset_minutes: number;
  scheduled_for: string;
  status: string;
  sent_at: string | null;
  target_type?: 'task' | 'event';
  target_title?: string | null;
  task_id?: string | null;
  event_id?: string | null;
  deferred?: boolean;
  repeats_left?: number;
  repeat_every_hours?: number | null;
  attempts?: number;
  last_error?: string | null;
  source?: string;
};

type PreferencesDto = { quiet_hours_start: string | null; quiet_hours_end: string | null };
type TaskDto = { id: string; title: string; status: string };
type EventDto = { id: string; title: string; starts_at: string; status: string };

const FROM_API: Record<ApiChannel, ReminderChannel> = { in_app: 'app', web_push: 'push', email: 'email' };
const TO_API: Record<ReminderChannel, ApiChannel> = { app: 'in_app', push: 'web_push', email: 'email' };
/** Nombre de relances d'un rappel « chaque jour » (maximum accepté par l'API). */
const DAILY_REPEATS = 3;

const FAILED = new Set(['failed', 'error', 'missed', 'expired']);
const INACTIVE = new Set(['cancelled', 'canceled', 'inactive', 'disabled', 'paused']);

/**
 * Conversion d'un rappel du serveur. `fallback` complète un `ReminderOut` (création, report…),
 * qui ne renvoie ni le titre ni le type de la cible.
 */
export function toReminder(dto: ReminderDto, fallback?: Pick<Reminder, 'link' | 'title'>): Reminder {
  const kind = dto.target_type ?? (dto.event_id ? 'event' : dto.task_id ? 'task' : fallback?.link.kind ?? 'task');
  const targetId = (kind === 'event' ? dto.event_id : dto.task_id) ?? fallback?.link.id ?? '';
  const title = dto.target_title ?? fallback?.title ?? (kind === 'event' ? 'Événement' : 'Tâche');
  const channels = (dto.channels?.length ? dto.channels : [dto.channel]).map((channel) => FROM_API[channel] ?? 'app');
  const status = dto.status.toLowerCase();
  const failed = FAILED.has(status);
  const delivery = dto.sent_at
    ? { status: 'sent' as const, detail: `Envoyé · ${channels.length > 1 ? `${channels.length} canaux` : 'notification'}` }
    : failed
      ? { status: 'missed' as const, detail: dto.last_error ? `Échec : ${dto.last_error}` : 'Envoi manqué' }
      : undefined;

  return {
    id: dto.id,
    title,
    at: new Date(dto.sent_at ?? dto.scheduled_for),
    repeat: dto.repeat_every_hours ? 'daily' : 'once',
    repeatsLeft: dto.repeats_left ?? 0,
    channels: [...new Set(channels)],
    link: { kind, id: targetId, title },
    paused: !delivery && INACTIVE.has(status),
    deferred: Boolean(dto.deferred),
    delivery,
  };
}

/** Rappel de l'écran → `ReminderTargetIn` (création d'un rappel rattaché). */
function toTarget(draft: ReminderDraft & { link: ReminderLink }) {
  return {
    task_id: draft.link.kind === 'task' ? draft.link.id : null,
    event_id: draft.link.kind === 'event' ? draft.link.id : null,
    // ISO avec fuseau : l'API refuse un instant sans fuseau.
    remind_at: draft.at.toISOString(),
    channels: draft.channels.map((channel) => TO_API[channel]),
    repeat_count: draft.repeat === 'daily' ? DAILY_REPEATS : 0,
    repeat_every_hours: draft.repeat === 'daily' ? 24 : null,
  };
}

/** « 22:00:00 » → [22, 0]. */
function toPair(value: string | null): [number, number] | null {
  if (!value) return null;
  const [hours, minutes] = value.split(':').map(Number);
  return Number.isFinite(hours) ? [hours, Number.isFinite(minutes) ? minutes : 0] : null;
}

const pad = (value: number) => String(value).padStart(2, '0');
const dateOnly = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const remindersApi = {
  /** API-NOT-014 : rappels à venir et passés. */
  list: () => getAll<ReminderDto>('/reminders', { scope: 'all', limit: 100 }),

  /** API-NOT-015 : création d'un rappel rattaché à une tâche ou un événement. */
  create: async (draft: ReminderDraft & { link: ReminderLink }, idempotencyKey: string) => {
    const created = await api.post<ReminderDto[] | ReminderDto>('/reminders', toTarget(draft), { idempotencyKey });
    const first = Array.isArray(created) ? created[0] : created;
    if (!first) throw new Error('Rappel non créé');
    return first;
  },

  /** API-NOT-016 : nouvelle heure d'envoi (seul champ modifiable). */
  reschedule: (id: string, at: Date) => api.patch<ReminderDto>(`/reminders/${id}`, { remind_at: at.toISOString() }),

  /** API-NOT-017 : report de 10 minutes à 24 heures. */
  snooze: (id: string, minutes: number) => api.post<ReminderDto>(`/reminders/${id}/snooze`, { minutes }),

  /** API-NOT-018 : réactivation (rappel désactivé ou envoi manqué). */
  reactivate: (id: string) => api.post<ReminderDto>(`/reminders/${id}/reactivate`),

  /** API-NOT-019 : suppression. */
  remove: (id: string) => api.delete(`/reminders/${id}`),

  /** API-NOT-003 : heures de silence (pour prévenir dans le formulaire). */
  quietHours: async (): Promise<QuietHours> => {
    const prefs = await api.get<PreferencesDto>('/notifications/preferences');
    const start = toPair(prefs?.quiet_hours_start ?? null);
    const end = toPair(prefs?.quiet_hours_end ?? null);
    return start && end ? { start, end } : null;
  },

  /** Objets auxquels rattacher un rappel : tâches ouvertes et événements des deux prochains mois. */
  targets: async (): Promise<ReminderLink[]> => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const [tasks, thisMonth, laterMonth] = await Promise.all([
      getAll<TaskDto>('/tasks', { scope: 'all', sort: 'due_at', limit: 100 }),
      api.get<EventDto[] | null>('/events', { query: { view: 'month', date: dateOnly(now) } }).catch(() => []),
      api.get<EventDto[] | null>('/events', { query: { view: 'month', date: dateOnly(nextMonth) } }).catch(() => []),
    ]);
    const openTasks = tasks
      .filter((task) => !['completed', 'cancelled', 'archived'].includes(task.status))
      .map((task): ReminderLink => ({ kind: 'task', id: task.id, title: task.title }));
    const seen = new Set<string>();
    const events = [...(thisMonth ?? []), ...(laterMonth ?? [])]
      .filter((event) => event.status !== 'cancelled' && new Date(event.starts_at).getTime() > now.getTime())
      .filter((event) => (seen.has(event.id) ? false : (seen.add(event.id), true)))
      .map((event): ReminderLink => ({ kind: 'event', id: event.id, title: event.title }));
    return [...openTasks, ...events];
  },
};
