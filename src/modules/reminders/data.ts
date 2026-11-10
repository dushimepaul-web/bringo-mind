// Données de démonstration du module Rappels, cohérentes avec les Tâches et le tableau de bord.
import type { Href } from 'expo-router';

import { DEMO_TODAY, addDays, atTime, dayOffset, formatDay } from '@/lib/demo-dates';

import type { Reminder, ReminderChannel, ReminderLink, ReminderRepeat } from './types';

const today = DEMO_TODAY;

/** Fuseau de l'utilisatrice (démo). Les dates sont stockées en UTC côté API. */
export const USER_TIMEZONE = { label: 'Heure de Paris', offset: 'UTC+2' } as const;

export const QUIET_HOURS = { from: '22h00', to: '07h00' } as const;

export const REPEAT_LABELS: Record<ReminderRepeat, string> = {
  once: 'Une fois',
  daily: 'Chaque jour',
  weekly: 'Chaque semaine',
  monthly: 'Chaque mois',
  custom: 'Personnalisé',
};

export const CHANNEL_META: Record<ReminderChannel, { label: string; icon: string; hint: string }> = {
  app: { label: 'Dans l’application', icon: 'notifications', hint: 'Centre de notifications Bringo Mind' },
  push: { label: 'Notification push', icon: 'smartphone', hint: 'Sur ce téléphone' },
  email: { label: 'E-mail', icon: 'mail', hint: 'claire.martin@email.fr' },
};

export const WEEKDAY_LETTERS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const WEEKDAY_SHORT = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];

/** Tâches et événements de la démo auxquels un rappel peut être associé. */
export const LINK_TARGETS: Exclude<ReminderLink, { kind: 'personal' }>[] = [
  { kind: 'task', id: 'attestation', title: 'Renvoyer l’attestation de domicile signée' },
  { kind: 'task', id: 'caf', title: 'Répondre au courrier de la CAF' },
  { kind: 'task', id: 'remboursement', title: 'Suivre le remboursement des soins dentaires' },
  { kind: 'task', id: 'controle-technique', title: 'Contrôle technique Peugeot 208' },
  { kind: 'task', id: 'declaration', title: 'Finaliser la déclaration de revenus 2023' },
  { kind: 'event', id: 'ophtalmo', title: 'Contrôle ophtalmologique — Dr. Vasseur' },
  { kind: 'event', id: 'dentiste-leo', title: 'Dentiste de Léo — Dr Lemoine' },
];

export function linkLabel(link: ReminderLink): string {
  if (link.kind === 'task') return 'Tâche';
  if (link.kind === 'event') return 'Événement';
  if (link.kind === 'document') return 'Document';
  return 'Personnel';
}

export function linkIcon(link: ReminderLink): string {
  if (link.kind === 'task') return 'task_alt';
  if (link.kind === 'event') return 'event';
  if (link.kind === 'document') return 'description';
  return 'person';
}

export function linkHref(link: ReminderLink): Href | null {
  if (link.kind === 'task') return { pathname: '/tasks/detail', params: { id: link.id } };
  if (link.kind === 'event') return { pathname: '/calendar/detail', params: { id: link.id } };
  if (link.kind === 'document') return { pathname: '/documents/detail', params: { id: link.id } };
  return null;
}

/** Prochaines occurrences d'une répétition, pour l'aperçu du formulaire. */
export function nextOccurrences(at: Date, repeat: ReminderRepeat, weekdays: number[], count = 4): Date[] {
  if (repeat === 'once') return [at];
  const result: Date[] = [];
  let cursor = new Date(at);
  let guard = 0;
  while (result.length < count && guard < 400) {
    guard += 1;
    const keep =
      repeat === 'daily' ||
      (repeat === 'weekly' && cursor.getDay() === at.getDay()) ||
      (repeat === 'monthly' && cursor.getDate() === at.getDate()) ||
      (repeat === 'custom' && weekdays.includes(cursor.getDay()));
    if (keep && dayOffset(cursor) >= 0) result.push(new Date(cursor));
    cursor = addDays(cursor, 1);
  }
  return result;
}

export function formatOccurrence(date: Date): string {
  return `${WEEKDAY_SHORT[date.getDay()]} ${formatDay(date)}`;
}

/** Libellé court de la répétition pour la liste. */
export function repeatSummary(reminder: Pick<Reminder, 'repeat' | 'weekdays' | 'at'>): string {
  switch (reminder.repeat) {
    case 'daily':
      return 'Chaque jour';
    case 'weekly':
      return `Chaque ${['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][reminder.at.getDay()]}`;
    case 'monthly':
      return `Le ${reminder.at.getDate()} de chaque mois`;
    case 'custom':
      return [...reminder.weekdays]
        .sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7))
        .map((day) => WEEKDAY_SHORT[day])
        .join(' ');
    default:
      return 'Une fois';
  }
}

export const DEMO_REMINDERS: Reminder[] = [
  {
    id: 'medicaments',
    title: 'Prendre le traitement du matin',
    at: atTime(addDays(today, 1), 8),
    repeat: 'daily',
    weekdays: [],
    channels: ['app', 'push'],
    link: { kind: 'personal' },
    shared: false,
    note: '',
    paused: false,
  },
  {
    id: 'attestation-envoi',
    title: 'Envoyer l’attestation au bailleur',
    at: atTime(today, 15),
    repeat: 'once',
    weekdays: [],
    channels: ['app', 'push'],
    link: { kind: 'task', id: 'attestation', title: 'Renvoyer l’attestation de domicile signée' },
    shared: true,
    note: 'Deux heures avant l’échéance de 17h00.',
    paused: false,
  },
  {
    id: 'caf',
    title: 'Répondre à la CAF ce soir',
    at: atTime(today, 18),
    repeat: 'once',
    weekdays: [],
    channels: ['app', 'push', 'email'],
    link: { kind: 'task', id: 'caf', title: 'Répondre au courrier de la CAF' },
    shared: false,
    note: '',
    paused: false,
  },
  {
    id: 'controle-technique',
    title: 'Partir au contrôle technique',
    at: atTime(addDays(today, 1), 8, 15),
    repeat: 'once',
    weekdays: [],
    channels: ['app', 'push'],
    link: { kind: 'task', id: 'controle-technique', title: 'Contrôle technique Peugeot 208' },
    shared: false,
    note: 'Prendre la carte grise.',
    paused: false,
  },
  {
    id: 'ophtalmo',
    title: 'Rendez-vous chez l’ophtalmologue',
    at: atTime(addDays(today, 2), 13, 30),
    repeat: 'once',
    weekdays: [],
    channels: ['app', 'push'],
    link: { kind: 'event', id: 'ophtalmo', title: 'Contrôle ophtalmologique — Dr. Vasseur' },
    shared: false,
    note: 'Une heure avant le rendez-vous.',
    paused: false,
  },
  {
    id: 'dentiste-leo',
    title: 'Emmener Léo chez le dentiste',
    at: atTime(addDays(today, 3), 9),
    repeat: 'once',
    weekdays: [],
    channels: ['app', 'push'],
    link: { kind: 'event', id: 'dentiste-leo', title: 'Dentiste de Léo — Dr Lemoine' },
    shared: true,
    note: '',
    paused: false,
  },
  {
    id: 'declaration',
    title: 'Avancer la déclaration de revenus',
    at: atTime(addDays(today, 6), 19),
    repeat: 'weekly',
    weekdays: [],
    channels: ['app', 'email'],
    link: { kind: 'task', id: 'declaration', title: 'Finaliser la déclaration de revenus 2023' },
    shared: false,
    note: 'Jusqu’à l’échéance du 26 mai.',
    paused: false,
  },
  {
    id: 'compteur',
    title: 'Relever le compteur d’eau',
    at: atTime(addDays(today, 17), 10),
    repeat: 'monthly',
    weekdays: [],
    channels: ['app'],
    link: { kind: 'personal' },
    shared: true,
    note: '',
    paused: true,
  },
  // Rappels passés : historique des envois.
  {
    id: 'medicaments-hier',
    title: 'Prendre le traitement du matin',
    at: atTime(today, 8),
    repeat: 'daily',
    weekdays: [],
    channels: ['app', 'push'],
    link: { kind: 'personal' },
    shared: false,
    note: '',
    paused: false,
    delivery: { status: 'sent', detail: 'Notification push reçue' },
  },
  {
    id: 'attestation-hier',
    title: 'Préparer l’attestation de domicile',
    at: atTime(addDays(today, -1), 18),
    repeat: 'once',
    weekdays: [],
    channels: ['push'],
    link: { kind: 'task', id: 'attestation', title: 'Renvoyer l’attestation de domicile signée' },
    shared: false,
    note: '',
    paused: false,
    delivery: { status: 'missed', detail: 'Téléphone hors ligne — envoi non abouti' },
  },
  {
    id: 'cantine',
    title: 'Payer la cantine scolaire',
    at: atTime(addDays(today, -2), 9),
    repeat: 'once',
    weekdays: [],
    channels: ['app', 'email'],
    link: { kind: 'personal' },
    shared: true,
    note: '',
    paused: false,
    delivery: { status: 'sent', detail: 'E-mail et notification envoyés' },
  },
];

/** Démo : rappel prérempli pour la création. */
export function demoReminderTitle(): string {
  return 'Relancer Harmonie Mutuelle';
}
