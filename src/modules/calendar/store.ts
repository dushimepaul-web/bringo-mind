// Mémoire partagée par les écrans du module Calendrier.
import { useSyncExternalStore } from 'react';

import { userMessage } from '@/lib/api';
import { IS_DEMO } from '@/lib/config';

import { DEMO_EVENTS, TASK_DEADLINES } from './data';
import { calendarApi, listTaskDeadlines, toEvent, type EventDto } from './services/calendar.service';
import type { CalendarEvent, EventDraft, TaskDeadline } from './types';

type Snapshot = {
  events: CalendarEvent[];
  /** Échéances des tâches affichées dans le calendrier. */
  deadlines: TaskDeadline[];
  flash: { text: string; undo?: () => void } | null;
};

let state: Snapshot = { events: IS_DEMO ? DEMO_EVENTS : [], deadlines: IS_DEMO ? TASK_DEADLINES : [], flash: null };
const listeners = new Set<() => void>();

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

function update(id: string, patch: Partial<CalendarEvent>) {
  emit({ events: state.events.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
}

function replace(localId: string, dto: EventDto) {
  emit({ events: state.events.map((item) => (item.id === localId ? toEvent(dto) : item)) });
}

/** Mode « api » : envoie la requête ; en cas d'échec, annule la modification locale. */
function remote<T>(call: () => Promise<T>, onSuccess: (result: T) => void, rollback: () => void) {
  if (IS_DEMO) return;
  call()
    .then(onSuccess)
    .catch((error: unknown) => {
      rollback();
      emit({ flash: { text: userMessage(error) } });
    });
}

export function useCalendarState(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useEvent(id: string | undefined): CalendarEvent | undefined {
  // Sans identifiant (lien générique), on ouvre le prochain rendez-vous médical.
  // Démo uniquement : sans identifiant (lien générique), on ouvre le prochain rendez-vous médical.
  const key = id ?? (IS_DEMO ? 'ophtalmo' : undefined);
  return useCalendarState().events.find((item) => item.id === key);
}

export const eventActions = {
  cancel(id: string) {
    const before = state.events.find((entry) => entry.id === id);
    if (!before) return;
    update(id, { cancelled: true });
    remote(() => calendarApi.cancel(id, before.version ?? 1), (dto) => replace(id, dto), () => update(id, before));
  },
  /** Annule l'annulation. Démo seulement : l'API n'a pas de route pour rétablir un événement annulé. */
  restore(id: string) {
    if (!IS_DEMO) return;
    update(id, { cancelled: false });
  },
  /** Les annulations et suppressions peuvent-elles être défaites ? (non en mode « api »). */
  canUndo: IS_DEMO,
  remove(id: string): () => void {
    // L'API n'a pas de suppression d'événement : on l'annule côté serveur (il disparaît de l'agenda).
    if (!IS_DEMO) {
      eventActions.cancel(id);
      return () => undefined;
    }
    const index = state.events.findIndex((entry) => entry.id === id);
    const item = state.events[index];
    emit({ events: state.events.filter((entry) => entry.id !== id) });
    return () => {
      if (!item || state.events.some((entry) => entry.id === id)) return;
      const copy = [...state.events];
      copy.splice(Math.max(index, 0), 0, item);
      emit({ events: copy });
    };
  },
  create(draft: EventDraft): string {
    const id = `e-${Date.now().toString(36)}`;
    emit({ events: [...state.events, { ...draft, id, cancelled: false }] });
    remote(() => calendarApi.create(draft), (dto) => replace(id, dto), () => emit({ events: state.events.filter((entry) => entry.id !== id) }));
    return id;
  },
  save(id: string, draft: EventDraft) {
    const before = state.events.find((entry) => entry.id === id);
    if (!before) return;
    update(id, draft);
    remote(() => calendarApi.update(id, before.version ?? 1, draft), (dto) => replace(id, dto), () => update(id, before));
  },
  setFlash(flash: Snapshot['flash']) {
    emit({ flash });
  },
};

/** Charge les événements depuis l'API (mode « api ») ; ne fait rien en démo. */
export async function syncEvents(): Promise<void> {
  if (IS_DEMO) return;
  // Mois en cours et deux mois suivants (agenda et « prochains rendez-vous »).
  const today = new Date();
  const [, deadlines] = await Promise.all([
    loadMonths([0, 1, 2].map((offset) => new Date(today.getFullYear(), today.getMonth() + offset, 1))),
    listTaskDeadlines(),
  ]);
  emit({ deadlines });
}

/** Mois déjà demandés à l'API (clé « année-mois »). */
const loadedMonths = new Set<string>();
const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

/** Charge les événements des mois donnés et remplace ceux de ces mois dans la mémoire. */
async function loadMonths(months: Date[]): Promise<void> {
  const keys = new Set(months.map(monthKey));
  // Marqués dès l'envoi : évite de redemander un mois déjà en cours de chargement.
  for (const key of keys) loadedMonths.add(key);
  let lists: EventDto[][];
  try {
    lists = await Promise.all(months.map((month) => calendarApi.list('month', month)));
  } catch (error) {
    for (const key of keys) loadedMonths.delete(key);
    throw error;
  }
  const fresh = new Map<string, CalendarEvent>();
  for (const dto of lists.flat()) fresh.set(dto.id, toEvent(dto));
  const kept = state.events.filter((event) => !keys.has(monthKey(event.start)) && !fresh.has(event.id));
  emit({ events: [...kept, ...fresh.values()].sort((a, b) => a.start.getTime() - b.start.getTime()) });
}

/** Mode « api » : charge le mois affiché s'il ne l'a pas encore été (navigation dans le calendrier). */
export function ensureMonth(date: Date): void {
  if (IS_DEMO || loadedMonths.has(monthKey(date))) return;
  loadMonths([new Date(date.getFullYear(), date.getMonth(), 1)]).catch((error: unknown) => {
    emit({ flash: { text: userMessage(error) } });
  });
}
