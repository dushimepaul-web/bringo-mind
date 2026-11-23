// Outils d'affichage du module Rappels (aucune donnée de démonstration : tout vient de l'API).
import type { Href } from 'expo-router';

import { formatDay } from '@/lib/demo-dates';
import { deviceTimeZone } from '@/lib/device-info';

import type { QuietHours, Reminder, ReminderChannel, ReminderLink, ReminderRepeat } from './types';

export const REPEAT_LABELS: Record<ReminderRepeat, string> = {
  once: 'Une fois',
  daily: 'Relancer chaque jour',
};

export const REPEAT_HINTS: Record<ReminderRepeat, string> = {
  once: 'Un seul envoi, à l’heure choisie.',
  daily: 'Nouvel envoi chaque jour, 3 fois au plus, tant que ce n’est pas traité.',
};

export const CHANNEL_META: Record<ReminderChannel, { label: string; icon: string; hint: string }> = {
  app: { label: 'Dans l’application', icon: 'notifications', hint: 'Centre de notifications Bringo Mind' },
  push: { label: 'Notification push', icon: 'smartphone', hint: 'Sur vos appareils inscrits' },
  email: { label: 'E-mail', icon: 'mail', hint: 'À l’adresse de votre compte' },
};

/** Fuseau du téléphone, affiché sous l'heure du rappel (« Africa/Bujumbura » → « Bujumbura »). */
export function timeZoneLabel(): string {
  const zone = deviceTimeZone();
  const city = zone.split('/').pop()?.replace(/_/g, ' ');
  return city ? `Heure de ${city}` : zone;
}

export function linkLabel(link: ReminderLink): string {
  return link.kind === 'task' ? 'Tâche' : 'Événement';
}

export function linkIcon(link: Pick<ReminderLink, 'kind'>): string {
  return link.kind === 'task' ? 'task_alt' : 'event';
}

export function linkHref(link: ReminderLink): Href {
  return link.kind === 'task'
    ? { pathname: '/tasks/detail', params: { id: link.id } }
    : { pathname: '/calendar/detail', params: { id: link.id } };
}

/** Libellé court de la répétition pour la liste. */
export function repeatSummary(reminder: Pick<Reminder, 'repeat' | 'repeatsLeft'>): string {
  if (reminder.repeat === 'once') return 'Une fois';
  return reminder.repeatsLeft > 0
    ? `Relance quotidienne (${reminder.repeatsLeft} restante${reminder.repeatsLeft > 1 ? 's' : ''})`
    : 'Relance quotidienne';
}

const two = (value: number) => String(value).padStart(2, '0');

/** « 22h00 ». */
export function hourLabel([hours, minutes]: [number, number]): string {
  return `${two(hours)}h${two(minutes)}`;
}

/** L'heure tombe-t-elle pendant les heures de silence (la plage peut passer minuit) ? */
export function inQuietHours(date: Date, quiet: QuietHours): boolean {
  if (!quiet) return false;
  const minute = date.getHours() * 60 + date.getMinutes();
  const start = quiet.start[0] * 60 + quiet.start[1];
  const end = quiet.end[0] * 60 + quiet.end[1];
  return start <= end ? minute >= start && minute < end : minute >= start || minute < end;
}

export { formatDay };
