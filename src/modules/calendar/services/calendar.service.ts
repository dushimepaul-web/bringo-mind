// API Calendrier (contrat 2.11.0, docs/backend/modules/07_planification_et_calendrier.md) et conversion
// vers le modèle des écrans. GET /events renvoie la vue demandée (`day` | `week` | `month`) autour d'une date.
import { api, getAll } from '@/lib/api';

import type { CalendarEvent, EventDraft, TaskDeadline } from '../types';

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

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    // L'API n'accepte que des adresses e-mail (les prénoms du foyer ne sont pas envoyés).
    attendees: draft.members.filter((member) => EMAIL.test(member)),
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

/** Tâche réduite à ce que le calendrier affiche (`TaskOut` de GET /tasks). */
type TaskDueDto = {
  id: string;
  title: string;
  status: string;
  household_id: string | null;
  due_at: string | null;
  due_date: string | null;
  due_all_day: boolean;
};

const CLOSED = new Set(['completed', 'cancelled', 'archived']);

/** Échéances des tâches ouvertes (lecture seule dans le calendrier). */
export async function listTaskDeadlines(): Promise<TaskDeadline[]> {
  const tasks = await getAll<TaskDueDto>('/tasks', { scope: 'all', sort: 'due_at' });
  return tasks
    .filter((task) => !CLOSED.has(task.status) && (task.due_at || task.due_date))
    .map((task) => {
      const [y, m, d] = (task.due_date ?? '').split('-').map(Number);
      const due = task.due_at ? new Date(task.due_at) : new Date(y, m - 1, d);
      return { id: task.id, title: task.title, due, hasTime: Boolean(task.due_at) && !task.due_all_day, shared: Boolean(task.household_id) };
    });
}
