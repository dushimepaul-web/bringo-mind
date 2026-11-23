/** Contrats du module Calendrier (dossier directeur, phase S6). */

export type EventTone = 'health' | 'work' | 'family' | 'admin' | 'leisure';

export type EventRecurrence = 'none' | 'weekly' | 'monthly';

export type CalendarEvent = {
  id: string;
  title: string;
  /** Début et fin dans le fuseau de l'utilisatrice (stockés en UTC côté API). */
  start: Date;
  end: Date;
  allDay: boolean;
  location: string;
  description: string;
  tone: EventTone;
  /** false : événement personnel (par défaut). true : partagé avec le foyer. */
  shared: boolean;
  /** Membres du foyer invités (si partagé). */
  members: string[];
  /** Participant externe (praticien, école…). */
  external?: { name: string; detail: string };
  /** Rappel en minutes avant le début, ou null. */
  reminder: number | null;
  recurrence: EventRecurrence;
  cancelled: boolean;
  /** Version de la ligne côté serveur (verrouillage optimiste, mode « api »). */
  version?: number;
};

export type EventDraft = Omit<CalendarEvent, 'id' | 'cancelled'>;

/** Échéance de tâche affichée dans le calendrier (lecture seule, ouvre la tâche). */
export type TaskDeadline = {
  id: string;
  title: string;
  due: Date;
  hasTime: boolean;
  shared: boolean;
};
