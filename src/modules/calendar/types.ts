/**
 * Contrats du module Calendrier, alignés sur l'API (contrat 2.11.0) :
 * événements personnels (calendrier local « BringoMind »), événements du foyer et événements
 * des agendas connectés (Google, Microsoft), ces derniers en lecture seule dans l'app.
 */

/** Origine de l'événement ; sert aussi de couleur à l'écran. */
export type EventSource = 'personal' | 'household' | 'external';

/** Couleur d'affichage (déduite de l'origine : personnel, foyer, agenda externe). */
export type EventTone = 'admin' | 'family' | 'work';

export type CalendarEvent = {
  id: string;
  title: string;
  /** Début et fin dans le fuseau du téléphone (stockés en UTC côté API). */
  start: Date;
  end: Date;
  allDay: boolean;
  location: string;
  description: string;
  source: EventSource;
  tone: EventTone;
  /** true : événement du foyer, visible par ses membres. */
  shared: boolean;
  /** Foyer de l'événement partagé. */
  householdId: string | null;
  /** Invités : adresses e-mail (événement personnel) ou membres du foyer. */
  members: string[];
  /** Rappel en minutes avant le début (connu à la création ou chargé depuis l'API), ou null. */
  reminder: number | null;
  cancelled: boolean;
  /** Agenda externe ou événement d'un autre : pas de modification depuis l'app. */
  readOnly: boolean;
  /** Version de la ligne côté serveur (verrouillage optimiste). */
  version: number;
};

export type EventDraft = {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location: string;
  description: string;
  shared: boolean;
  /** Invités par e-mail (événement personnel uniquement). */
  members: string[];
  reminder: number | null;
};

/** Échéance de tâche affichée dans le calendrier (lecture seule, ouvre la tâche). */
export type TaskDeadline = {
  id: string;
  title: string;
  due: Date;
  hasTime: boolean;
  shared: boolean;
};
