// Notes : types, notes de démonstration et mémoire partagée par les écrans du module.
import { useSyncExternalStore } from 'react';

import { DEMO_TODAY, addDays, atTime } from '@/lib/demo-dates';

export type NoteColor = 'blue' | 'mint' | 'lime' | 'navy';

export type Note = {
  id: string;
  title: string;
  body: string;
  color: NoteColor;
  pinned: boolean;
  updatedAt: Date;
};

export type NoteDraft = Pick<Note, 'title' | 'body' | 'color' | 'pinned'>;

const today = DEMO_TODAY;

const DEMO_NOTES: Note[] = [
  {
    id: 'courses',
    title: 'Courses du week-end',
    body: 'Lait, pain complet, fruits pour Léo, café, lessive.',
    color: 'lime',
    pinned: true,
    updatedAt: atTime(today, 8, 40),
  },
  {
    id: 'questions-dentiste',
    title: 'Questions pour le dentiste',
    body: 'Demander si Léo doit porter un appareil, et le tarif du détartrage.',
    color: 'blue',
    pinned: true,
    updatedAt: atTime(addDays(today, -1), 19, 5),
  },
  {
    id: 'impots',
    title: 'Déclaration de revenus 2023',
    body: 'Vérifier les frais réels et ajouter le don à la Croix-Rouge (120 €).',
    color: 'mint',
    pinned: false,
    updatedAt: atTime(addDays(today, -2), 21, 15),
  },
  {
    id: 'wifi',
    title: 'Box internet',
    body: 'Contrat Orange n° 4812 • assistance : 3900.',
    color: 'navy',
    pinned: false,
    updatedAt: atTime(addDays(today, -6), 10, 0),
  },
];

type Snapshot = { notes: Note[] };

let state: Snapshot = { notes: DEMO_NOTES };
const listeners = new Set<() => void>();

function emit(next: Snapshot) {
  state = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;

export function useNotes(): Note[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).notes;
}

export function findNote(id: string | undefined): Note | undefined {
  return id ? state.notes.find((note) => note.id === id) : undefined;
}

/** Crée (sans `id`) ou met à jour une note ; renvoie son identifiant. */
export function saveNote(draft: NoteDraft, id?: string): string {
  const now = new Date(DEMO_TODAY.getTime());
  if (id) {
    emit({ notes: state.notes.map((note) => (note.id === id ? { ...note, ...draft, updatedAt: now } : note)) });
    return id;
  }
  const created: Note = { ...draft, id: `note-${Date.now()}`, updatedAt: now };
  emit({ notes: [created, ...state.notes] });
  return created.id;
}

export function deleteNote(id: string) {
  emit({ notes: state.notes.filter((note) => note.id !== id) });
}

export function togglePin(id: string) {
  emit({ notes: state.notes.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note)) });
}
