// Mémoire de démonstration partagée par les écrans du module Calendrier.
import { useSyncExternalStore } from 'react';

import { DEMO_EVENTS } from './data';
import type { CalendarEvent, EventDraft } from './types';

type Snapshot = {
  events: CalendarEvent[];
  flash: { text: string; undo?: () => void } | null;
};

let state: Snapshot = { events: DEMO_EVENTS, flash: null };
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

export function useCalendarState(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useEvent(id: string | undefined): CalendarEvent | undefined {
  // Sans identifiant (lien générique), on ouvre le prochain rendez-vous médical.
  return useCalendarState().events.find((item) => item.id === (id ?? 'ophtalmo'));
}

export const eventActions = {
  cancel(id: string) {
    update(id, { cancelled: true });
  },
  restore(id: string) {
    update(id, { cancelled: false });
  },
  remove(id: string): () => void {
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
    return id;
  },
  save(id: string, draft: EventDraft) {
    update(id, draft);
  },
  setFlash(flash: Snapshot['flash']) {
    emit({ flash });
  },
};
