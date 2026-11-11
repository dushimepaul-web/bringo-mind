// Lecture de l'API Rappels (guide d'API v1.0, module 04 : REM-002 / REM-003) et conversion
// vers le modèle des écrans. Les modifications restent locales tant que le backend n'est pas prêt.
import { getAll } from '@/lib/api';

import type { Reminder, ReminderChannel } from '../types';

/** Rappel tel que renvoyé par l'API (REM-003). */
export type ReminderDto = {
  id: string;
  title?: string | null;
  task_id: string | null;
  event_id?: string | null;
  remind_at: string;
  advance_minutes: number | null;
  time_zone: string;
  channels: ('in_app' | 'push' | 'email')[];
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  version: number;
};

const CHANNELS: Record<ReminderDto['channels'][number], ReminderChannel> = { in_app: 'app', push: 'push', email: 'email' };

export function toReminder(dto: ReminderDto): Reminder {
  return {
    id: dto.id,
    title: dto.title ?? 'Rappel',
    at: new Date(dto.remind_at),
    repeat: 'once',
    weekdays: [],
    channels: dto.channels.map((channel) => CHANNELS[channel]),
    link: dto.task_id
      ? { kind: 'task', id: dto.task_id, title: dto.title ?? 'Tâche liée' }
      : dto.event_id
        ? { kind: 'event', id: dto.event_id, title: dto.title ?? 'Événement lié' }
        : { kind: 'personal' },
    shared: false,
    note: '',
    paused: dto.status === 'paused',
  };
}

export const remindersApi = {
  /** REM-002 : rappels actifs ou en pause. */
  list: () => getAll<ReminderDto>('/reminders', { status: 'active,paused' }),
};
