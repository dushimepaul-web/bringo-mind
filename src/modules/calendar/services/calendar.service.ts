// Lecture de l'API Calendrier (guide d'API v1.0, module 05 : CAL-002 / CAL-003) et conversion
// vers le modèle des écrans. Les modifications restent locales tant que le backend n'est pas prêt.
import { getAll } from '@/lib/api';

import type { CalendarEvent } from '../types';

/** Événement tel que renvoyé par l'API (CAL-003). */
export type EventDto = {
  id: string;
  calendar_id: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string;
  all_day: boolean;
  time_zone: string;
  status: 'tentative' | 'confirmed' | 'cancelled';
  visibility: 'personal' | 'household';
  attendees?: { user_id: string; display_name?: string; response_status: string }[];
  reminders?: { id: string; advance_minutes: number }[];
  version: number;
  created_at: string;
};

export function toEvent(dto: EventDto): CalendarEvent {
  return {
    id: dto.id,
    title: dto.title,
    start: new Date(dto.starts_at),
    end: new Date(dto.ends_at),
    allDay: dto.all_day,
    location: dto.location ?? '',
    description: dto.description ?? '',
    tone: 'admin',
    shared: dto.visibility === 'household',
    members: (dto.attendees ?? []).map((attendee) => attendee.display_name ?? 'Membre'),
    reminder: dto.reminders?.[0]?.advance_minutes ?? null,
    recurrence: 'none',
    cancelled: dto.status === 'cancelled',
  };
}

export const calendarApi = {
  /** CAL-002 : événements de trois mois autour d'aujourd'hui. */
  list: () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const to = new Date(now.getFullYear(), now.getMonth() + 3, 0).toISOString();
    return getAll<EventDto>('/calendar/events', { from, to });
  },
};
