// API Calendrier (contrat 2.11.0, docs/backend/modules/07_planification_et_calendrier.md) et conversion
// vers le modèle des écrans. GET /events renvoie la vue demandée (`day` | `week` | `month`) autour d'une date.
import { api } from '@/lib/api';

import type { CalendarEvent, EventDraft } from '../types';

/** Événement tel que renvoyé par l'API (`EventOut`). */
export type EventDto = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  all_day: boolean;
  status: 'confirmed' | 'cancelled';
  version: number;
  location: string | null;
  conference_url: string | null;
  description: string | null;
  is_owner: boolean;
  calendar_link_id: string | null;
  attendees: { id: string; email: string; response: string }[];
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
    shared: false,
    members: dto.attendees.map((attendee) => attendee.email),
    reminder: null,
    recurrence: 'none',
    cancelled: dto.status === 'cancelled',
    version: dto.version,
  };
}

function toDateOnly(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Corps de création/édition d'un événement local (sans calendrier externe). */
function eventFields(draft: EventDraft) {
  return {
    title: draft.title,
    starts_at: draft.start.toISOString(),
    ends_at: draft.end.toISOString(),
    description: draft.description || null,
    location: draft.location || null,
    conference_url: null,
    attendees: draft.members,
    ...(draft.reminder ? { reminder_minutes_before: [draft.reminder] } : {}),
  };
}

export const calendarApi = {
  /** CAL-002 : événements d'une vue (jour / semaine / mois). `date` est obligatoire. */
  list: (view: 'day' | 'week' | 'month' = 'month', date: Date = new Date()) =>
    api.get<EventDto[]>('/events', { query: { view, date: toDateOnly(date) } }),

  /** Événement local : création (sans calendrier externe). */
  create: (draft: EventDraft) => api.post<EventDto>('/events/local', eventFields(draft)),

  /** Événement local : modification partielle (`EventUpdateIn`, version requise). */
  update: (id: string, version: number, draft: EventDraft) =>
    api.patch<EventDto>(`/events/${id}/local`, { ...eventFields(draft), version }),

  /** Annuler un événement local. */
  cancel: (id: string, version: number) => api.post<EventDto>(`/events/${id}/local/cancel`, { version }),
};
