// API Rappels (contrat 2.11.0, docs/backend/modules/06_rappels_et_notifications.md) et conversion
// vers le modèle des écrans. `ReminderListOut` est la forme renvoyée par GET /reminders.
import { api, getAll } from '@/lib/api';

import type { Reminder, ReminderChannel, ReminderRepeat } from '../types';

/** Rappel tel que renvoyé par l'API (`ReminderListOut`). */
export type ReminderDto = {
  id: string;
  channel: 'in_app' | 'email' | 'web_push';
  channels: ('in_app' | 'email' | 'web_push')[];
  offset_minutes: number;
  scheduled_for: string;
  status: string;
  sent_at: string | null;
  target_type: 'task' | 'event';
  target_title: string | null;
  task_id: string | null;
  event_id: string | null;
  deferred: boolean;
  repeats_left: number;
  repeat_every_hours: number | null;
  attempts: number;
  last_error: string | null;
  source: string;
};

const CHANNELS: Record<ReminderDto['channel'], ReminderChannel> = { in_app: 'app', web_push: 'push', email: 'email' };

function repeatOf(dto: ReminderDto): ReminderRepeat {
  if (dto.repeat_every_hours === 24) return 'daily';
  if (dto.repeats_left > 0) return 'custom';
  return 'once';
}

export function toReminder(dto: ReminderDto): Reminder {
  const title = dto.target_title ?? 'Rappel';
  return {
    id: dto.id,
    title,
    at: new Date(dto.scheduled_for),
    repeat: repeatOf(dto),
    weekdays: [],
    channels: dto.channels.length ? dto.channels.map((channel) => CHANNELS[channel]) : [CHANNELS[dto.channel]],
    link:
      dto.target_type === 'task' && dto.task_id
        ? { kind: 'task', id: dto.task_id, title }
        : dto.target_type === 'event' && dto.event_id
          ? { kind: 'event', id: dto.event_id, title }
          : { kind: 'personal' },
    shared: false,
    note: '',
    paused: dto.status === 'paused',
    ...(dto.sent_at ? { delivery: { status: 'sent' as const, detail: 'Envoyé' } } : {}),
  };
}

/** Convertit un rappel de l'écran vers `ReminderTargetIn` (création d'un rappel rattaché). */
function toTarget(draft: Pick<Reminder, 'at' | 'channels' | 'link' | 'repeat'>) {
  return {
    task_id: draft.link.kind === 'task' ? draft.link.id : null,
    event_id: draft.link.kind === 'event' ? draft.link.id : null,
    remind_at: draft.at.toISOString(),
    channels: draft.channels.map((channel) => (channel === 'app' ? 'in_app' : channel === 'push' ? 'web_push' : 'email')),
    repeat_count: draft.repeat === 'once' ? 0 : 3,
    repeat_every_hours: draft.repeat === 'daily' ? 24 : null,
  };
}

export const remindersApi = {
  /** REM-002 : tous les rappels. */
  list: () => getAll<ReminderDto>('/reminders'),

  /** REM-001 : création d'un rappel rattaché à une tâche ou un événement. */
  create: (draft: Pick<Reminder, 'at' | 'channels' | 'link' | 'repeat'>) => api.post<ReminderDto>('/reminders', toTarget(draft)),

  /** REM-004 : décaler un rappel (nouvelle heure d'envoi). */
  update: (id: string, remindAt: Date) => api.patch<ReminderDto>(`/reminders/${id}`, { remind_at: remindAt.toISOString() }),

  /** Repousser un rappel de quelques minutes. */
  snooze: (id: string, minutes: number) => api.post<ReminderDto>(`/reminders/${id}/snooze`, { minutes }),

  /** Reprise d'un envoi manqué. */
  reactivate: (id: string) => api.post<ReminderDto>(`/reminders/${id}/reactivate`),

  /** REM-005 : suppression. */
  remove: (id: string) => api.delete(`/reminders/${id}`),
};
