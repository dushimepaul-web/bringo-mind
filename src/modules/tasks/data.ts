// Outils d'affichage du module Tâches (aucune donnée de démonstration : tout vient de l'API).
import { dayOffset, formatDay } from '@/lib/demo-dates';

import type { Task, TaskCategory, TaskGroup, TaskPriority } from './types';

export {
  addDays,
  atTime,
  dayOffset,
  formatDay,
  formatDue,
  formatDueLong,
  formatLongDay,
  formatTime,
  startOfDay,
  today,
} from '@/lib/demo-dates';

/** Retard en jours (0 si la tâche n'est pas en retard ou n'a pas d'échéance). */
export function lateDays(task: Task): number {
  if (task.status !== 'open' || !task.hasDue) return 0;
  const offset = dayOffset(task.dueAt);
  return offset < 0 ? -offset : 0;
}

export function groupOf(task: Task): TaskGroup {
  if (task.status === 'archived') return 'archived';
  if (task.status === 'done') return 'done';
  const offset = dayOffset(task.dueAt);
  if (offset < 0) return 'late';
  if (offset === 0) return 'today';
  return 'upcoming';
}

export const GROUP_LABELS: Record<TaskGroup, string> = {
  late: 'En retard',
  today: 'Aujourd’hui',
  upcoming: 'À venir',
  done: 'Terminées',
  archived: 'Archivées',
};

/** Libellés français des codes de catégorie proposés par le backend (categories.name). */
const CATEGORY_LABELS: Record<string, string> = {
  bills: 'Factures',
  health: 'Santé',
  housing: 'Logement',
  home: 'Logement',
  insurance: 'Assurance',
  admin: 'Administratif',
  administrative: 'Administratif',
  taxes: 'Impôts',
  tax: 'Impôts',
  family: 'Famille',
  children: 'Enfants',
  school: 'École',
  education: 'École',
  vehicle: 'Véhicule',
  car: 'Véhicule',
  work: 'Travail',
  finance: 'Finances',
  bank: 'Banque',
  shopping: 'Courses',
  travel: 'Voyages',
  other: 'Autre',
};

const CATEGORY_ICON_BY_CODE: Record<string, string> = {
  bills: 'receipt_long',
  health: 'health_and_safety',
  housing: 'home',
  home: 'home',
  insurance: 'verified_user',
  admin: 'description',
  administrative: 'description',
  taxes: 'account_balance',
  tax: 'account_balance',
  family: 'family_restroom',
  children: 'child_care',
  school: 'school',
  education: 'school',
  vehicle: 'directions_car',
  car: 'directions_car',
  work: 'work',
  finance: 'payments',
  bank: 'account_balance',
  shopping: 'shopping_cart',
  travel: 'flight',
  other: 'label',
};

/** Libellé affiché d'une catégorie : traduction du code, sinon le nom saisi par l'utilisateur. */
export function categoryLabel(code: TaskCategory | null | undefined): string {
  if (!code) return 'Sans catégorie';
  return CATEGORY_LABELS[code.toLowerCase()] ?? `${code.charAt(0).toUpperCase()}${code.slice(1)}`;
}

export function categoryIcon(code: TaskCategory | null | undefined): string {
  if (!code) return 'label_off';
  return CATEGORY_ICON_BY_CODE[code.toLowerCase()] ?? 'label';
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  1: 'Basse',
  2: 'Normale',
  3: 'Haute',
  4: 'Urgente',
};

const SHORT_DAYS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];

/** « Aujourd'hui », « Demain », sinon « Sam. 18 mai ». */
export function dayLabel(day: Date): string {
  const offset = dayOffset(day);
  if (offset === 0) return 'Aujourd’hui';
  if (offset === 1) return 'Demain';
  const short = SHORT_DAYS[day.getDay()];
  return `${short.charAt(0).toUpperCase()}${short.slice(1)} ${formatDay(day)}`;
}

const two = (value: number) => String(value).padStart(2, '0');

/** « Demain à 16h00 ». */
export function reminderText(at: Date): string {
  return `${dayLabel(at)} à ${two(at.getHours())}h${two(at.getMinutes())}`;
}

export function remindersSummary(task: Pick<Task, 'reminderAt'>): string {
  const list = task.reminderAt;
  return list.length ? [...list].sort((a, b) => a.getTime() - b.getTime()).map(reminderText).join(' · ') : 'Aucun';
}

/** Initiales d'un nom (« Thomas Martin » → « TM »). */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}
