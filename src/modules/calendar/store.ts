// Mémoire partagée par les écrans du module Calendrier, alimentée uniquement par l'API (contrat 2.11.0).
// Les événements sont chargés mois par mois (navigation du calendrier, agenda des semaines à venir).
// Chaque action s'affiche tout de suite (mise à jour optimiste), puis la requête part ;
// en cas d'échec, l'écran revient à l'état précédent et un message explique pourquoi.
import { useSyncExternalStore } from 'react';

import { isApiError, userMessage } from '@/lib/api';
import { newId } from '@/lib/id';
import { sessionStore } from '@/lib/session';

import { monthGrid } from './data';
import { calendarApi, toEvent, toHouseholdEvent, type HouseholdInfo } from './services/calendar.service';
import type { CalendarEvent, EventDraft, TaskDeadline } from './types';

type Snapshot = {
  events: CalendarEvent[];
  deadlines: TaskDeadline[];
  household: HouseholdInfo | null;
  flash: { text: string; undo?: () => void } | null;
};

const EMPTY: Snapshot = { events: [], deadlines: [], household: null, flash: null };

let state: Snapshot = EMPTY;
const listeners = new Set<() => void>();
/** Identifiants chargés pour chaque mois (« 2026-11 »), pour remplacer proprement au rechargement. */
const monthIds = new Map<string, { events: Set<string>; deadlines: Set<string> }>();
let householdLoaded = false;

function emit(next: Partial<Snapshot>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;

// Déconnexion : on oublie l'agenda du compte précédent.
sessionStore.subscribe((session) => {
  if (!session) {
    monthIds.clear();
    householdLoaded = false;
    state = EMPTY;
    for (const listener of listeners) listener();
  }
});

const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}`;

function find(id: string): CalendarEvent | undefined {
  return state.events.find((item) => item.id === id);
}

function update(id: string, patch: Partial<CalendarEvent>) {
  emit({ events: state.events.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
}

function replace(id: string, next: CalendarEvent) {
  emit({ events: state.events.map((item) => (item.id === id ? next : item)) });
}

/** Envoie la requête ; en cas d'échec, annule la modification locale et explique pourquoi. */
function remote<T>(call: () => Promise<T>, onSuccess: (result: T) => void, rollback: () => void) {
  call()
    .then(onSuccess)
    .catch((error: unknown) => {
      rollback();
      emit({ flash: { text: userMessage(error) } });
      // Conflit de version (modifié ailleurs) : on recharge le mois concerné.
      if (isApiError(error) && error.status === 409) void syncMonth(new Date()).catch(() => undefined);
    });
}

async function ensureHousehold(): Promise<HouseholdInfo | null> {
  if (!householdLoaded) {
    const household = await calendarApi.household();
    householdLoaded = true;
    emit({ household });
  }
  return state.household;
}

/** Charge (ou recharge) un mois : événements personnels et connectés, du foyer, et échéances des tâches. */
export async function syncMonth(date: Date): Promise<void> {
  const household = await ensureHousehold();
  const grid = monthGrid(date.getFullYear(), date.getMonth());
  const gridStart = grid[0].date;
  const last = grid[grid.length - 1].date;
  const gridEnd = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);

  const [personal, shared, deadlines] = await Promise.all([
    calendarApi.month(date),
    household ? calendarApi.householdEvents(household.id, gridStart, gridEnd).catch(() => []) : Promise.resolve([]),
    calendarApi.deadlines(gridStart, last).catch(() => [] as TaskDeadline[]),
  ]);

  const known = new Map(state.events.map((event) => [event.id, event]));
  const fresh: CalendarEvent[] = [
    // On garde le rappel déjà chargé pour un événement connu.
    ...(personal ?? []).map((dto) => toEvent(dto, known.get(dto.id)?.reminder ?? null)),
    ...(shared ?? []).map((dto) => toHouseholdEvent(dto, household, known.get(dto.id)?.reminder ?? null)),
  ];
  const freshIds = new Set(fresh.map((event) => event.id));
  const previous = monthIds.get(monthKey(date));
  const events = [
    ...state.events.filter((event) => !freshIds.has(event.id) && !previous?.events.has(event.id)),
    ...fresh,
  ];
  const deadlineIds = new Set(deadlines.map((deadline) => deadline.id));
  const keptDeadlines = state.deadlines.filter(
    (deadline) => !deadlineIds.has(deadline.id) && !previous?.deadlines.has(deadline.id),
  );
  monthIds.set(monthKey(date), { events: freshIds, deadlines: deadlineIds });
  emit({ events, deadlines: [...keptDeadlines, ...deadlines] });
}

/** Agenda : le mois en cours et les deux suivants. */
export async function syncUpcoming(): Promise<void> {
  const now = new Date();
  await syncMonth(now);
  await Promise.all([1, 2].map((offset) => syncMonth(new Date(now.getFullYear(), now.getMonth() + offset, 1))));
}

/** Événement ouvert depuis un autre écran : on charge le mois en cours et le suivant s'il manque. */
export async function ensureEvent(id: string | undefined): Promise<void> {
  if (!id || find(id) || id.startsWith('local-')) return;
  const now = new Date();
  await syncMonth(now);
  if (!find(id)) await syncMonth(new Date(now.getFullYear(), now.getMonth() + 1, 1));
}

/** Rappel de l'événement (pour le détail) : chargé une fois depuis l'API. */
export async function loadEventReminder(id: string | undefined): Promise<void> {
  const event = id ? find(id) : undefined;
  if (!event || event.id.startsWith('local-') || event.source === 'external') return;
  const reminder = await calendarApi.reminder(event.id);
  update(event.id, { reminder });
}

export function useCalendarState(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useEvent(id: string | undefined): CalendarEvent | undefined {
  const events = useCalendarState().events;
  return id ? events.find((item) => item.id === id) : undefined;
}

/** Rappel refusé alors que l'événement est enregistré : on le garde et on prévient. */
async function reminderOrWarn(call: () => Promise<unknown>, wanted: number | null, fallback: number | null): Promise<number | null> {
  try {
    await call();
    return wanted;
  } catch (error) {
    emit({ flash: { text: `Événement enregistré, mais le rappel n’a pas pu être programmé : ${userMessage(error)}` } });
    return fallback;
  }
}

export const eventActions = {
  /** Annule l'événement (l'API ne propose pas de le rétablir) ; il disparaît du calendrier. */
  cancel(id: string) {
    const before = find(id);
    if (!before || before.readOnly) return;
    update(id, { cancelled: true });
    const call: () => Promise<unknown> =
      before.source === 'household' && before.householdId
        ? () => calendarApi.cancelShared(before.householdId as string, id)
        : () => calendarApi.cancelLocal(id, before.version);
    remote(call, () => undefined, () => update(id, before));
  },
  create(draft: EventDraft): string {
    const id = `local-${newId()}`;
    const household = draft.shared ? state.household : null;
    const optimistic: CalendarEvent = {
      ...draft,
      id,
      source: household ? 'household' : 'personal',
      tone: household ? 'family' : 'admin',
      shared: Boolean(household),
      householdId: household?.id ?? null,
      members: household ? household.members : draft.members,
      cancelled: false,
      readOnly: false,
      version: 1,
    };
    emit({ events: [...state.events, optimistic] });
    remote(
      async () => {
        if (household) {
          const dto = await calendarApi.createShared(household.id, draft, newId());
          const event = toHouseholdEvent(dto, household, null);
          if (draft.reminder !== null) {
            event.reminder = await reminderOrWarn(() => calendarApi.addReminder(event.id, event.start, draft.reminder as number), draft.reminder, null);
          }
          return event;
        }
        return toEvent(await calendarApi.createLocal(draft, newId()), draft.reminder);
      },
      (event) => replace(id, event),
      () => emit({ events: state.events.filter((entry) => entry.id !== id) }),
    );
    return id;
  },
  save(id: string, draft: EventDraft) {
    const before = find(id);
    if (!before || before.readOnly) return;
    update(id, { ...draft, shared: before.shared, members: before.shared ? before.members : draft.members });
    remote(
      async () => {
        const event =
          before.source === 'household' && before.householdId
            ? toHouseholdEvent(
                await calendarApi.updateShared(before.householdId, id, before.version, draft),
                state.household,
                before.reminder,
              )
            : toEvent(await calendarApi.updateLocal(id, before.version, draft), before.reminder);
        // Rappel modifié, ou événement déplacé avec un rappel : on le reprogramme.
        const moved = before.start.getTime() !== event.start.getTime();
        if (draft.reminder !== before.reminder || (moved && draft.reminder !== null)) {
          const reminder = await reminderOrWarn(() => calendarApi.replaceReminder(id, event.start, draft.reminder), draft.reminder, before.reminder);
          return { ...event, reminder };
        }
        return event;
      },
      (event) => replace(id, event),
      () => update(id, before),
    );
  },
  setFlash(flash: Snapshot['flash']) {
    emit({ flash });
  },
};
