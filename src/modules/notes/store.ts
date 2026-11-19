// Notes : types, notes de démonstration et mémoire partagée par les écrans du module.
// Le texte reste du texte simple ; les lignes peuvent commencer par « • », « 1. », « ☐ » ou « ☑ »
// (listes et cases à cocher insérées depuis la barre d'outils de l'éditeur).
import { useSyncExternalStore } from 'react';

import { DEMO_TODAY, addDays, atTime } from '@/lib/demo-dates';

export type NoteColor = 'mint' | 'lime' | 'blue' | 'lavender' | 'pink' | 'amber';

export type Note = {
  id: string;
  title: string;
  body: string;
  color: NoteColor;
  pinned: boolean;
  updatedAt: Date;
  /** Taille du texte de la note (points). Défaut : 15. */
  fontSize?: number;
  /** Police : « normale » (Inter) ou « arrondie » (Plus Jakarta Sans). */
  font?: NoteFont;
};

export type NoteFont = 'normal' | 'rounded';

export type NoteDraft = Pick<Note, 'title' | 'body' | 'color' | 'pinned' | 'fontSize' | 'font'>;

export type NoteSort = 'recent' | 'alpha' | 'color';

const today = DEMO_TODAY;

const DEMO_NOTES: Note[] = [
  {
    id: 'courses',
    title: 'Courses du week-end',
    body: '☐ Lait\n☐ Pain complet\n☑ Fruits pour Léo\n☐ Café\n☐ Lessive',
    color: 'lime',
    pinned: true,
    updatedAt: atTime(today, 8, 40),
  },
  {
    id: 'questions-dentiste',
    title: 'Questions pour le dentiste',
    body: '• Léo doit-il porter un appareil ?\n• Tarif du détartrage\n• Prochain contrôle',
    color: 'blue',
    pinned: true,
    updatedAt: atTime(addDays(today, -1), 19, 5),
  },
  {
    id: 'impots',
    title: 'Déclaration de revenus 2023',
    body: 'Vérifier les frais réels et ajouter le don à la Croix-Rouge (120 €). Garder les justificatifs de garde de Léo.',
    color: 'mint',
    pinned: false,
    updatedAt: atTime(addDays(today, -2), 21, 15),
  },
  {
    id: 'cadeau',
    title: 'Idée cadeau pour Thomas',
    body: 'Montre connectée ou livre de cuisine italienne — budget 80 €.',
    color: 'pink',
    pinned: false,
    updatedAt: atTime(addDays(today, -3), 12, 30),
  },
  {
    id: 'vacances',
    title: 'Vacances à Biarritz',
    body: '1. Réserver le train\n2. Prévenir l’école\n3. Crème solaire et maillots\n4. Clés chez la voisine',
    color: 'amber',
    pinned: false,
    updatedAt: atTime(addDays(today, -4), 18, 0),
  },
  {
    id: 'wifi',
    title: 'Box internet',
    body: 'Contrat Orange n° 4812 • assistance : 3900.',
    color: 'lavender',
    pinned: false,
    updatedAt: atTime(addDays(today, -6), 10, 0),
  },
];

type Snapshot = { notes: Note[]; sort: NoteSort };

let state: Snapshot = { notes: DEMO_NOTES, sort: 'recent' };
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

export function useNotesState(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useNotes(): Note[] {
  return useNotesState().notes;
}

export function findNote(id: string | undefined): Note | undefined {
  return id ? state.notes.find((note) => note.id === id) : undefined;
}

/** Crée (sans `id`) ou met à jour une note ; renvoie son identifiant. */
export function saveNote(draft: NoteDraft, id?: string): string {
  const now = new Date(DEMO_TODAY.getTime());
  if (id && state.notes.some((note) => note.id === id)) {
    emit({ notes: state.notes.map((note) => (note.id === id ? { ...note, ...draft, updatedAt: now } : note)) });
    return id;
  }
  const created: Note = { ...draft, id: id ?? `note-${Date.now()}`, updatedAt: now };
  emit({ notes: [created, ...state.notes] });
  return created.id;
}

export function deleteNote(id: string) {
  emit({ notes: state.notes.filter((note) => note.id !== id) });
}

export function togglePin(id: string) {
  emit({ notes: state.notes.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note)) });
}

export function setNoteSort(sort: NoteSort) {
  emit({ sort });
}
