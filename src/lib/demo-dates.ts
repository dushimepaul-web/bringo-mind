// Date de démonstration et formatage des dates en français, partagés par les modules.
// La démo « vit » au mardi 14 mai 2024 pour que tous les écrans restent cohérents.

type Due = { dueAt: Date; hasTime: boolean };

/** « Aujourd'hui » de la démo : mardi 14 mai 2024 (cohérent avec le tableau de bord). */
export const DEMO_TODAY = new Date(2024, 4, 14, 9, 30);

const DAY_MS = 24 * 60 * 60 * 1000;

const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const DAYS_SHORT = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Nombre de jours entre aujourd'hui (démo) et la date. */
export function dayOffset(date: Date): number {
  return Math.round((startOfDay(date).getTime() - startOfDay(DEMO_TODAY).getTime()) / DAY_MS);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function atTime(date: Date, hours: number, minutes = 0): Date {
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

export function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`;
}

/** « 16 mai », ou « 16 mai 2025 » hors de l'année en cours. */
export function formatDay(date: Date): string {
  const sameYear = date.getFullYear() === DEMO_TODAY.getFullYear();
  return `${date.getDate()} ${MONTHS[date.getMonth()]}${sameYear ? '' : ` ${date.getFullYear()}`}`;
}

/** « Jeudi 16 mai ». */
export function formatLongDay(date: Date): string {
  const day = DAYS[date.getDay()];
  return `${day.charAt(0).toUpperCase()}${day.slice(1)} ${formatDay(date)}`;
}

/** Libellé court de l'échéance pour la liste : « Aujourd'hui • 17h00 », « Hier », « Jeu. 16 mai »… */
export function formatDue(task: Due): string {
  const offset = dayOffset(task.dueAt);
  const time = task.hasTime ? ` • ${formatTime(task.dueAt)}` : '';
  if (offset === 0) return `Aujourd’hui${time}`;
  if (offset === 1) return `Demain${time}`;
  if (offset === -1) return `Hier${time}`;
  if (offset > 1 && offset < 7) return `${DAYS_SHORT[task.dueAt.getDay()]} ${formatDay(task.dueAt)}${time}`;
  return `${formatDay(task.dueAt)}${time}`;
}

/** Libellé complet pour le détail : « Aujourd'hui à 17h00 », « Jeudi 16 mai à 14h30 ». */
export function formatDueLong(task: Due): string {
  const offset = dayOffset(task.dueAt);
  const time = task.hasTime ? ` à ${formatTime(task.dueAt)}` : '';
  if (offset === 0) return `Aujourd’hui${time}`;
  if (offset === 1) return `Demain${time}`;
  if (offset === -1) return `Hier${time}`;
  return `${formatLongDay(task.dueAt)}${time}`;
}

