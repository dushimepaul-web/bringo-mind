// API Calendrier (contrat 2.11.0) et conversion vers le modèle des écrans.
// - événements personnels et agendas connectés : docs/backend/modules/07_planification_et_calendrier.md ;
// - événements du foyer : docs/backend/modules/08_foyer.md (API-FOY-016 à 019).
// Seul le store de ce module appelle ce fichier.
import { api, getAll, isApiError } from '@/lib/api';
import { sessionStore } from '@/lib/session';

import type { CalendarEvent, EventDraft, TaskDeadline } from '../types';

/** Événement personnel ou d'un agenda connecté (`EventOut`). */
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
  calendar_link_id?: string | null;
  attendees: { id: string; email: string; response: string }[];
};

/** Événement du foyer (`HouseholdEventOut`). */
export type HouseholdEventDto = {
  id: string;
  household_id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  all_day: boolean;
  location: string | null;
  description: string | null;
  version: number;
  created_by: string;
};

type HouseholdDto = { id: string; name: string };
type MemberDto = { user_id: string; full_name: string | null; email: string | null };
type TaskDto = {
  id: string;
  title: string;
  status: string;
  household_id: string | null;
  due_at: string | null;
  due_date?: string | null;
  due_all_day: boolean;
};
type ReminderDto = { id: string; offset_minutes: number; sent_at: string | null; status: string };

/** Foyer actif et noms de ses membres (pour les événements partagés). */
export type HouseholdInfo = { id: string; name: string; members: string[] };

const pad = (value: number) => String(value).padStart(2, '0');
const dateOnly = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** « 2026-11-15 » → Date locale à midi. */
function fromDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * Un événement personnel n'a pas de champ « journée entière » à la création :
 * l'app l'enregistre de 00h00 à 23h59 et le relit comme tel.
 */
function looksAllDay(start: Date, end: Date): boolean {
  return (
    start.getHours() === 0 &&
    start.getMinutes() === 0 &&
    end.getHours() === 23 &&
    end.getMinutes() === 59 &&
    end.getTime() > start.getTime()
  );
}

export function toEvent(dto: EventDto, reminder: number | null = null): CalendarEvent {
  const start = new Date(dto.starts_at);
  const end = new Date(dto.ends_at);
  const external = Boolean(dto.calendar_link_id);
  return {
    id: dto.id,
    title: dto.title,
    start,
    end,
    allDay: dto.all_day || looksAllDay(start, end),
    location: dto.location ?? '',
    description: dto.description ?? '',
    source: external ? 'external' : 'personal',
    tone: external ? 'work' : 'admin',
    shared: false,
    householdId: null,
    members: (dto.attendees ?? []).map((attendee) => attendee.email),
    reminder,
    cancelled: dto.status === 'cancelled',
    readOnly: external || !dto.is_owner,
    version: dto.version,
  };
}

export function toHouseholdEvent(dto: HouseholdEventDto, household: HouseholdInfo | null, reminder: number | null = null): CalendarEvent {
  return {
    id: dto.id,
    title: dto.title,
    start: new Date(dto.starts_at),
    end: new Date(dto.ends_at),
    allDay: dto.all_day,
    location: dto.location ?? '',
    description: dto.description ?? '',
    source: 'household',
    tone: 'family',
    shared: true,
    householdId: dto.household_id,
    members: household?.id === dto.household_id ? household.members : [],
    reminder,
    cancelled: false,
    readOnly: false,
    version: dto.version,
  };
}

function toDeadline(dto: TaskDto): TaskDeadline | null {
  const hasTime = Boolean(dto.due_at) && !dto.due_all_day;
  const due = hasTime && dto.due_at ? new Date(dto.due_at) : dto.due_date ? fromDateOnly(dto.due_date) : dto.due_at ? new Date(dto.due_at) : null;
  if (!due) return null;
  return { id: dto.id, title: dto.title, due, hasTime, shared: dto.household_id !== null };
}

/** Bornes d'un événement « journée entière » : 00h00 le premier jour → 23h59 le dernier jour. */
function bounds(draft: Pick<EventDraft, 'start' | 'end' | 'allDay'>): { starts_at: string; ends_at: string } {
  if (!draft.allDay) return { starts_at: draft.start.toISOString(), ends_at: draft.end.toISOString() };
  const first = draft.start;
  const last = draft.end.getTime() > draft.start.getTime() ? draft.end : draft.start;
  return {
    starts_at: new Date(first.getFullYear(), first.getMonth(), first.getDate(), 0, 0).toISOString(),
    ends_at: new Date(last.getFullYear(), last.getMonth(), last.getDate(), 23, 59).toISOString(),
  };
}

/** Corps d'un événement personnel (`LocalEventIn` / `EventUpdateIn`). */
function localFields(draft: EventDraft) {
  return {
    title: draft.title,
    ...bounds(draft),
    description: draft.description || null,
    location: draft.location || null,
    attendees: draft.members,
  };
}

/** Corps d'un événement du foyer (`HouseholdEventIn` / `HouseholdEventUpdate`). */
function householdFields(draft: EventDraft) {
  return {
    title: draft.title,
    starts_at: draft.allDay ? bounds(draft).starts_at : draft.start.toISOString(),
    ends_at: draft.allDay ? bounds(draft).ends_at : draft.end.toISOString(),
    all_day: draft.allDay,
    description: draft.description || null,
    location: draft.location || null,
  };
}

async function loadHousehold(): Promise<HouseholdInfo | null> {
  try {
    const households = await getAll<HouseholdDto>('/households');
    const first = households[0];
    if (!first) return null;
    const me = sessionStore.getUser()?.id;
    const members = await getAll<MemberDto>(`/households/${first.id}/members`).catch(() => [] as MemberDto[]);
    return {
      id: first.id,
      name: first.name,
      members: members.map((member) => (member.user_id === me ? 'Vous' : member.full_name || member.email || 'Membre')),
    };
  } catch (error) {
    // Foyers désactivés ou aucun foyer : calendrier personnel seulement.
    if (isApiError(error)) return null;
    throw error;
  }
}

export const calendarApi = {
  household: loadHousehold,

  /** API-CAL : événements personnels et des agendas connectés d'un mois (vue « month »). */
  month: (date: Date) => api.get<EventDto[] | null>('/events', { query: { view: 'month', date: dateOnly(date) } }),

  /** API-FOY-016 : événements du foyer entre deux instants. */
  householdEvents: (householdId: string, start: Date, end: Date) =>
    api.get<HouseholdEventDto[] | null>(`/households/${householdId}/events`, {
      query: { start: start.toISOString(), end: end.toISOString() },
    }),

  /** Échéances des tâches entre deux dates (affichées dans le calendrier). */
  deadlines: async (from: Date, to: Date): Promise<TaskDeadline[]> => {
    const tasks = await getAll<TaskDto>('/tasks', { scope: 'all', due_from: dateOnly(from), due_to: dateOnly(to), limit: 100 });
    return tasks
      .filter((task) => !['completed', 'cancelled', 'archived'].includes(task.status))
      .map(toDeadline)
      .filter((deadline): deadline is TaskDeadline => deadline !== null);
  },

  /** Événement personnel : création, avec le rappel dans la même transaction. */
  createLocal: (draft: EventDraft, idempotencyKey: string) =>
    api.post<EventDto>(
      '/events/local',
      { ...localFields(draft), reminder_minutes_before: draft.reminder !== null ? [draft.reminder] : [] },
      { idempotencyKey },
    ),

  /** Événement personnel : modification (verrouillage optimiste). */
  updateLocal: (id: string, version: number, draft: EventDraft) =>
    api.patch<EventDto>(`/events/${id}/local`, { ...localFields(draft), version }),

  /** Événement personnel : annulation. */
  cancelLocal: (id: string, version: number) => api.post<EventDto>(`/events/${id}/local/cancel`, { version }),

  /** API-FOY-017 : événement du foyer (les membres sont prévenus par le serveur). */
  createShared: (householdId: string, draft: EventDraft, idempotencyKey: string) =>
    api.post<HouseholdEventDto>(`/households/${householdId}/events`, householdFields(draft), { idempotencyKey }),

  /** API-FOY-018 : modification d'un événement du foyer. */
  updateShared: (householdId: string, id: string, version: number, draft: EventDraft) =>
    api.patch<HouseholdEventDto>(`/households/${householdId}/events/${id}`, { ...householdFields(draft), version }),

  /** API-FOY-019 : annulation d'un événement du foyer. */
  cancelShared: (householdId: string, id: string) => api.delete(`/households/${householdId}/events/${id}`),

  /** API-NOT-012 : rappel à venir de l'événement (minutes avant le début), ou null. */
  reminder: async (id: string): Promise<number | null> => {
    const items = await api.get<ReminderDto[] | null>(`/events/${id}/reminders`);
    const next = (items ?? []).find((item) => !item.sent_at);
    return next ? next.offset_minutes : null;
  },

  /** API-NOT-013 : ajoute un rappel à un événement (minutes avant le début). */
  addReminder: (id: string, start: Date, minutes: number) =>
    api.post(`/events/${id}/reminders`, { remind_at: new Date(start.getTime() - minutes * 60000).toISOString() }),

  /** Remplace le rappel à venir de l'événement (supprime les rappels non envoyés, puis en crée un). */
  replaceReminder: async (id: string, start: Date, minutes: number | null) => {
    const items = (await api.get<ReminderDto[] | null>(`/events/${id}/reminders`)) ?? [];
    await Promise.all(items.filter((item) => !item.sent_at).map((item) => api.delete(`/reminders/${item.id}`)));
    if (minutes !== null) await calendarApi.addReminder(id, start, minutes);
  },
};
