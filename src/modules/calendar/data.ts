// Données de démonstration et outils du module Calendrier, cohérents avec Tâches et Rappels.
import { DEMO_TODAY, addDays, atTime, dayOffset, startOfDay } from '@/lib/demo-dates';

import type { CalendarEvent, EventRecurrence, EventTone, TaskDeadline } from './types';

const today = DEMO_TODAY;

export const USER_TIMEZONE = { label: 'Heure de Paris', offset: 'UTC+2', id: 'Europe/Paris' } as const;

export const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];
export const WEEKDAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
export const WEEKDAY_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

type ToneStyle = { label: string; icon: string; bg: string; fg: string; bar: string };

/** Catégories d'événements (couleurs de l'app, mode clair). */
export const TONES: Record<EventTone, ToneStyle> = {
  health: { label: 'Santé', icon: 'medical_services', bg: '#D3F5EE', fg: '#0B7A6E', bar: '#0FB5A3' },
  work: { label: 'Travail', icon: 'work', bg: '#DDE9FB', fg: '#1D5ED0', bar: '#1D6FE0' },
  family: { label: 'Famille', icon: 'family_restroom', bg: '#FCEFC4', fg: '#8A6100', bar: '#F2B01E' },
  admin: { label: 'Démarche', icon: 'account_balance', bg: '#E4E3FB', fg: '#4338CA', bar: '#5B5BD6' },
  leisure: { label: 'Loisirs', icon: 'sports_soccer', bg: '#FCE4EF', fg: '#B0306A', bar: '#E0518E' },
};

/** Mêmes catégories en mode sombre : fonds foncés, textes clairs. */
export const TONES_DARK: Record<EventTone, ToneStyle> = {
  health: { ...TONES.health, bg: '#0F3B3B', fg: '#5EEAD4' },
  work: { ...TONES.work, bg: '#1B3058', fg: '#8DBBFF' },
  family: { ...TONES.family, bg: '#3D3216', fg: '#F5C84B' },
  admin: { ...TONES.admin, bg: '#262A55', fg: '#A5B4FC' },
  leisure: { ...TONES.leisure, bg: '#3B1D2E', fg: '#F9A8D4' },
};

export const RECURRENCE_LABELS: Record<EventRecurrence, string> = {
  none: 'Ne se répète pas',
  weekly: 'Chaque semaine',
  monthly: 'Chaque mois',
};

export const REMINDER_OPTIONS: { label: string; minutes: number | null }[] = [
  { label: 'Aucun', minutes: null },
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '1 h', minutes: 60 },
  { label: '1 jour', minutes: 1440 },
];

export const DURATIONS = [15, 30, 45, 60, 90, 120, 180];

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${String(rest).padStart(2, '0')}` : `${hours} h`;
}

export function reminderLabel(minutes: number | null): string {
  if (minutes === null) return 'Aucun';
  if (minutes >= 1440) return '1 jour avant';
  if (minutes >= 60) return `${minutes / 60} h avant`;
  return `${minutes} min avant`;
}

export function durationOf(event: Pick<CalendarEvent, 'start' | 'end'>): number {
  return Math.round((event.end.getTime() - event.start.getTime()) / 60000);
}

export function sameDay(a: Date, b: Date): boolean {
  return dayOffset(a) === dayOffset(b);
}

/** Événements du même jour qui chevauchent le créneau (hors annulés et hors lui-même). */
export function conflictsFor(
  slot: { start: Date; end: Date; allDay: boolean; id?: string },
  events: CalendarEvent[],
): CalendarEvent[] {
  if (slot.allDay) return [];
  return events.filter(
    (event) =>
      event.id !== slot.id &&
      !event.cancelled &&
      !event.allDay &&
      sameDay(event.start, slot.start) &&
      event.start < slot.end &&
      slot.start < event.end,
  );
}

/** Propose jusqu'à 3 créneaux libres le même jour, entre 08h00 et 20h00, par pas de 30 min. */
export function freeSlots(
  slot: { start: Date; end: Date; id?: string },
  events: CalendarEvent[],
  count = 3,
): Date[] {
  const duration = slot.end.getTime() - slot.start.getTime();
  const result: Date[] = [];
  // Aujourd'hui : uniquement des créneaux à venir (à partir de la prochaine demi-heure).
  const nowMinutes = DEMO_TODAY.getHours() * 60 + DEMO_TODAY.getMinutes();
  const firstMinute = dayOffset(slot.start) === 0 ? Math.max(8 * 60, Math.ceil(nowMinutes / 30) * 30) : 8 * 60;
  for (let minutes = firstMinute; minutes + duration / 60000 <= 20 * 60; minutes += 30) {
    const start = atTime(slot.start, Math.floor(minutes / 60), minutes % 60);
    const end = new Date(start.getTime() + duration);
    if (start.getTime() === slot.start.getTime()) continue;
    if (conflictsFor({ start, end, allDay: false, id: slot.id }, events).length === 0) {
      result.push(start);
      if (result.length === count) break;
    }
  }
  return result;
}

/** Grille du mois (semaines commençant le lundi), avec les jours des mois voisins. */
export function monthGrid(year: number, month: number): { date: Date; inMonth: boolean }[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const start = addDays(first, -lead);
  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let index = 0; index < 42; index += 1) {
    const date = addDays(start, index);
    cells.push({ date, inMonth: date.getMonth() === month });
  }
  // Retire la dernière semaine si elle est entièrement hors du mois.
  return cells.slice(35).every((cell) => !cell.inMonth) ? cells.slice(0, 35) : cells;
}

/** Les 7 jours (lundi → dimanche) de la semaine contenant la date. */
export function weekOf(date: Date): Date[] {
  const monday = addDays(startOfDay(date), -((date.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

function event(
  id: string,
  title: string,
  dayDelta: number,
  start: [number, number],
  minutes: number,
  extra: Partial<CalendarEvent>,
): CalendarEvent {
  const startAt = atTime(addDays(today, dayDelta), start[0], start[1]);
  return {
    id,
    title,
    start: startAt,
    end: new Date(startAt.getTime() + minutes * 60000),
    allDay: false,
    location: '',
    description: '',
    tone: 'admin',
    shared: false,
    members: [],
    reminder: 30,
    recurrence: 'none',
    cancelled: false,
    ...extra,
  };
}

export const DEMO_EVENTS: CalendarEvent[] = [
  event('garage', 'Révision de la Peugeot 208', -12, [8, 30], 60, {
    tone: 'admin',
    location: 'Garage Martin • Rue des Lilas',
    reminder: 60,
  }),
  event('pediatre', 'Pédiatre de Léo', -8, [17, 0], 30, {
    tone: 'health',
    location: 'Cabinet Dr Benali',
    shared: true,
    members: ['Thomas'],
    external: { name: 'Dr Benali', detail: 'Pédiatre' },
  }),
  event('reunion', 'Réunion projet Bringo Mind', 0, [14, 0], 60, {
    tone: 'work',
    location: 'Visioconférence',
    description: 'Point d’avancement hebdomadaire avec l’équipe produit.',
    reminder: 15,
    recurrence: 'weekly',
  }),
  event('leo-ecole', 'Récupérer Léo à l’école', 0, [16, 45], 30, {
    tone: 'family',
    location: 'École Jean Moulin',
    shared: true,
    members: ['Thomas'],
    reminder: 15,
    recurrence: 'weekly',
  }),
  event('kine', 'Séance de kinésithérapie', 1, [18, 30], 45, {
    tone: 'health',
    location: 'Cabinet Kiné Saint-Michel',
    external: { name: 'M. Garnier', detail: 'Kinésithérapeute' },
    reminder: 60,
  }),
  event('ophtalmo', 'Contrôle ophtalmologique', 2, [14, 30], 45, {
    tone: 'health',
    location: 'Dr. Vasseur • Centre Médical Saint-Honoré',
    description: 'Apporter l’ordonnance de lunettes actuelle et la carte Vitale.',
    external: { name: 'Dr. Vasseur', detail: 'Ophtalmologue' },
    reminder: 60,
  }),
  event('dentiste-leo', 'Dentiste de Léo', 3, [10, 0], 30, {
    tone: 'health',
    location: 'Cabinet Dr Lemoine • Paris 11e',
    description: 'Apporter le carnet de santé de Léo.',
    shared: true,
    members: ['Thomas'],
    external: { name: 'Dr Lemoine', detail: 'Chirurgien-dentiste' },
    reminder: 60,
  }),
  event('foot', 'Match de football de Léo', 4, [10, 0], 90, {
    tone: 'leisure',
    location: 'Stade municipal',
    shared: true,
    members: ['Thomas'],
    reminder: 60,
  }),
  event('parents', 'Réunion parents d’élèves', 6, [18, 0], 90, {
    tone: 'family',
    location: 'École Jean Moulin',
    shared: true,
    members: ['Thomas'],
  }),
  event('banque', 'Rendez-vous avec la conseillère bancaire', 9, [11, 0], 45, {
    tone: 'admin',
    location: 'Agence Crédit Mutuel • Bastille',
    external: { name: 'Mme Roussel', detail: 'Conseillère' },
  }),
  event('diner', 'Dîner chez les parents de Thomas', 11, [19, 30], 180, {
    tone: 'family',
    location: 'Vincennes',
    shared: true,
    members: ['Thomas'],
    reminder: 1440,
  }),
  {
    ...event('vacances', 'Départ en vacances', 18, [0, 0], 1440, {
      tone: 'leisure',
      location: 'Biarritz',
      shared: true,
      members: ['Thomas'],
      reminder: 1440,
    }),
    allDay: true,
  },
];

/** Échéances des tâches de la démo (mêmes identifiants que le module Tâches). */
export const TASK_DEADLINES: TaskDeadline[] = [
  { id: 'remboursement', title: 'Suivre le remboursement des soins dentaires', due: atTime(addDays(today, -4), 12), hasTime: false, shared: true },
  { id: 'caf', title: 'Répondre au courrier de la CAF', due: atTime(addDays(today, -1), 18), hasTime: false, shared: false },
  { id: 'attestation', title: 'Renvoyer l’attestation de domicile signée', due: atTime(today, 17), hasTime: true, shared: true },
  { id: 'controle-technique', title: 'Contrôle technique Peugeot 208', due: atTime(addDays(today, 1), 9), hasTime: true, shared: false },
  { id: 'inscription', title: 'Renouveler l’inscription scolaire de Léo', due: atTime(addDays(today, 11), 12), hasTime: false, shared: true },
  { id: 'declaration', title: 'Finaliser la déclaration de revenus 2023', due: atTime(addDays(today, 12), 23, 59), hasTime: false, shared: false },
];
