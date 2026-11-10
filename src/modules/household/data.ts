// Données de démonstration du Foyer, cohérentes avec les modules Tâches, Calendrier et Documents
// (mêmes identifiants, mêmes dates). Claire est l'utilisatrice connectée.
import { Tint } from '@/constants/design';
import { DEMO_TODAY, addDays, atTime } from '@/lib/demo-dates';

import type { Activity, HouseholdRole, Invitation, Member, SharedDoc, SharedEvent, SharedTask } from './types';

const today = DEMO_TODAY;

export const DEMO_HOUSEHOLD = { name: 'Foyer Martin', createdAt: new Date(2023, 4, 12) };

export const ROLE_LABELS: Record<HouseholdRole, string> = {
  owner: 'Propriétaire',
  admin: 'Admin',
  member: 'Membre',
  child: 'Enfant',
};

export const ROLE_HINTS: Record<HouseholdRole, string> = {
  owner: 'Gère tout le foyer, peut le transférer ou le supprimer',
  admin: 'Gère les membres et les invitations',
  member: 'Voit et modifie les éléments partagés',
  child: 'Compte encadré : voit seulement ce qui le concerne',
};

export const DEMO_MEMBERS: Member[] = [
  { id: 'claire', name: 'Claire Martin', email: 'claire.martin@email.fr', role: 'owner', color: Tint.primary, you: true },
  { id: 'thomas', name: 'Thomas Martin', email: 'thomas.martin@email.fr', role: 'admin', color: Tint.navy },
  { id: 'leo', name: 'Léo Martin', email: 'Géré par Claire et Thomas', role: 'child', color: '#d97706', detail: '8 ans • École Jean Moulin' },
];

export const DEMO_INVITATIONS: Invitation[] = [
  {
    id: 'inv-jeanne',
    email: 'jeanne.martin@email.fr',
    role: 'member',
    sentAt: atTime(addDays(today, -1), 18, 40),
    expiresAt: atTime(addDays(today, 6), 18, 40),
  },
];

/** Tâches partagées (identifiants du module Tâches). */
export const SHARED_TASKS: SharedTask[] = [
  { id: 'attestation', title: 'Renvoyer l’attestation de domicile signée', due: atTime(today, 17), hasTime: true, assignee: 'claire', people: ['claire'], done: false },
  { id: 'remboursement', title: 'Suivre le remboursement des soins dentaires', due: atTime(addDays(today, -4), 12), hasTime: false, assignee: 'claire', people: ['claire', 'leo'], done: false },
  { id: 'inscription', title: 'Renouveler l’inscription scolaire de Léo', due: atTime(addDays(today, 11), 12), hasTime: false, assignee: 'thomas', people: ['thomas', 'leo'], done: false },
  { id: 'cantine', title: 'Régler la cantine scolaire du 2e trimestre', due: atTime(addDays(today, -2), 12), hasTime: false, assignee: 'thomas', people: ['thomas', 'leo'], done: true },
];

function slot(day: number, hour: number, minute: number, minutes: number) {
  const start = atTime(addDays(today, day), hour, minute);
  return { start, end: new Date(start.getTime() + minutes * 60000) };
}

/** Événements partagés (identifiants du module Calendrier). */
export const SHARED_EVENTS: SharedEvent[] = [
  { id: 'leo-ecole', title: 'Récupérer Léo à l’école', ...slot(0, 16, 45, 30), allDay: false, location: 'École Jean Moulin', who: 'Thomas s’en charge', people: ['thomas', 'leo'] },
  { id: 'dentiste-leo', title: 'Dentiste de Léo', ...slot(3, 10, 0, 30), allDay: false, location: 'Cabinet Dr Lemoine • Paris 11e', who: 'Claire accompagne', people: ['claire', 'leo'] },
  { id: 'foot', title: 'Match de football de Léo', ...slot(4, 10, 0, 90), allDay: false, location: 'Stade municipal', who: 'Claire et Thomas', people: ['claire', 'thomas', 'leo'] },
  { id: 'parents', title: 'Réunion parents d’élèves', ...slot(6, 18, 0, 90), allDay: false, location: 'École Jean Moulin', who: 'Claire et Thomas', people: ['claire', 'thomas'] },
  { id: 'diner', title: 'Dîner chez les parents de Thomas', ...slot(11, 19, 30, 180), allDay: false, location: 'Vincennes', who: 'Tout le foyer', people: ['claire', 'thomas', 'leo'] },
  { id: 'vacances', title: 'Départ en vacances', ...slot(18, 0, 0, 1439), allDay: true, location: 'Biarritz', who: 'Tout le foyer', people: ['claire', 'thomas', 'leo'] },
];

export const SHARED_DOCS: SharedDoc[] = [
  { id: 'bail', title: 'Bail de l’appartement', meta: 'PDF • Signé • Partagé par Claire', icon: 'description' },
  { id: 'assurance', title: 'Assurance habitation 2024', meta: 'PDF • Partagé par Thomas', icon: 'verified_user' },
  { id: 'attestation-domicile', title: 'Attestation de domicile', meta: 'PDF • Classée par Kora ce matin', icon: 'home' },
  { id: 'livret', title: 'Livret de famille', meta: 'Scan • 3 pages', icon: 'menu_book' },
];

export const DEMO_ACTIVITY: Activity[] = [
  { id: 'a1', who: 'kora', kind: 'document', verb: 'a classé le document', target: 'Attestation de domicile', at: atTime(today, 9, 12), href: { pathname: '/documents/detail', params: { id: 'attestation-domicile' } } },
  { id: 'a2', who: 'thomas', kind: 'event', verb: 'a ajouté l’événement', target: 'Match de football de Léo', at: atTime(today, 8, 40), href: { pathname: '/calendar/detail', params: { id: 'foot' } } },
  { id: 'a3', who: 'claire', kind: 'task', verb: 'a signé l’étape « Signer électroniquement » de', target: 'Renvoyer l’attestation de domicile signée', at: atTime(today, 7, 55), href: { pathname: '/tasks/detail', params: { id: 'attestation' } } },
  { id: 'a4', who: 'claire', kind: 'member', verb: 'a invité', target: 'jeanne.martin@email.fr', at: atTime(addDays(today, -1), 18, 40), href: '/household/members' },
  { id: 'a5', who: 'thomas', kind: 'task', verb: 'a pris en charge la tâche', target: 'Renouveler l’inscription scolaire de Léo', at: atTime(addDays(today, -1), 16, 15), href: { pathname: '/tasks/detail', params: { id: 'inscription' } } },
  { id: 'a6', who: 'thomas', kind: 'task', verb: 'a terminé la tâche', target: 'Régler la cantine scolaire du 2e trimestre', at: atTime(addDays(today, -2), 10, 30), href: { pathname: '/tasks/detail', params: { id: 'cantine' } } },
  { id: 'a7', who: 'thomas', kind: 'document', verb: 'a partagé le document', target: 'Assurance habitation 2024', at: atTime(addDays(today, -3), 11, 5), href: { pathname: '/documents/detail', params: { id: 'assurance' } } },
  { id: 'a8', who: 'claire', kind: 'event', verb: 'a ajouté l’événement', target: 'Pédiatre de Léo', at: atTime(addDays(today, -9), 20, 10), href: { pathname: '/calendar/detail', params: { id: 'pediatre' } } },
];

export const KIND_LABELS: Record<Activity['kind'], { label: string; icon: string }> = {
  task: { label: 'Tâche', icon: 'task_alt' },
  event: { label: 'Événement', icon: 'event' },
  document: { label: 'Document', icon: 'folder' },
  member: { label: 'Membre', icon: 'person_add' },
};

export const WEEKDAY_SHORT = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];

export function initials(name: string): string {
  return name
    .split(/[\s.@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function firstName(name: string): string {
  return name.split(' ')[0];
}

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
