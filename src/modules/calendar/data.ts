// Outils d'affichage du module Calendrier (aucune donnée de démonstration : tout vient de l'API).
import { addDays, atTime, dayOffset, startOfDay, today } from '@/lib/demo-dates';
import { deviceTimeZone } from '@/lib/device-info';

import type { CalendarEvent, EventTone } from './types';

/** Fuseau du téléphone (« Africa/Bujumbura » → « Heure de Bujumbura »). */
export function timeZoneLabel(): string {
  const zone = deviceTimeZone();
  const city = zone.split('/').pop()?.replace(/_/g, ' ');
  return city ? `Heure de ${city}` : zone;
}

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

/** Couleurs selon l'origine de l'événement (mode clair). */
export const TONES: Record<EventTone, ToneStyle> = {
  admin: { label: 'Personnel', icon: 'person', bg: '#E4E3FB', fg: '#4338CA', bar: '#5B5BD6' },
  family: { label: 'Foyer', icon: 'family_restroom', bg: '#FCEFC4', fg: '#8A6100', bar: '#F2B01E' },
  work: { label: 'Agenda connecté', icon: 'sync', bg: '#DDE9FB', fg: '#1D5ED0', bar: '#1D6FE0' },
};

/** Mêmes couleurs en mode sombre : fonds foncés, textes clairs. */
export const TONES_DARK: Record<EventTone, ToneStyle> = {
  admin: { ...TONES.admin, bg: '#262A55', fg: '#A5B4FC' },
  family: { ...TONES.family, bg: '#3D3216', fg: '#F5C84B' },
  work: { ...TONES.work, bg: '#1B3058', fg: '#8DBBFF' },
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
  const now = today();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
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
