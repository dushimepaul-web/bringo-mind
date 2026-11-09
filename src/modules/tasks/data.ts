// Données de démonstration et formatage des dates du module Tâches.
import type { Task, TaskCategory, TaskGroup, TaskPriority } from './types';

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
export function formatDue(task: Pick<Task, 'dueAt' | 'hasTime'>): string {
  const offset = dayOffset(task.dueAt);
  const time = task.hasTime ? ` • ${formatTime(task.dueAt)}` : '';
  if (offset === 0) return `Aujourd’hui${time}`;
  if (offset === 1) return `Demain${time}`;
  if (offset === -1) return `Hier${time}`;
  if (offset > 1 && offset < 7) return `${DAYS_SHORT[task.dueAt.getDay()]} ${formatDay(task.dueAt)}${time}`;
  return `${formatDay(task.dueAt)}${time}`;
}

/** Libellé complet pour le détail : « Aujourd'hui à 17h00 », « Jeudi 16 mai à 14h30 ». */
export function formatDueLong(task: Pick<Task, 'dueAt' | 'hasTime'>): string {
  const offset = dayOffset(task.dueAt);
  const time = task.hasTime ? ` à ${formatTime(task.dueAt)}` : '';
  if (offset === 0) return `Aujourd’hui${time}`;
  if (offset === 1) return `Demain${time}`;
  if (offset === -1) return `Hier${time}`;
  return `${formatLongDay(task.dueAt)}${time}`;
}

/** Retard en jours (0 si la tâche n'est pas en retard). */
export function lateDays(task: Task): number {
  if (task.status !== 'open') return 0;
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

export const CATEGORIES: TaskCategory[] = ['Logement', 'Santé', 'Impôts', 'Famille', 'Véhicule', 'Autre'];

export const CATEGORY_ICONS: Record<TaskCategory, string> = {
  Logement: 'home',
  Santé: 'health_and_safety',
  Impôts: 'account_balance',
  Famille: 'family_restroom',
  Véhicule: 'directions_car',
  Autre: 'label',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  1: 'Basse',
  2: 'Normale',
  3: 'Haute',
  4: 'Urgente',
};

/** Membres du foyer de démo (Claire est l'utilisatrice connectée). */
export const HOUSEHOLD = { name: 'Foyer Martin', members: ['Claire', 'Thomas'] } as const;

const today = DEMO_TODAY;

/** Tâches de démonstration. */
export const DEMO_TASKS: Task[] = [
  {
    id: 'caf',
    title: 'Répondre au courrier de la CAF',
    context: 'Caisse d’allocations familiales • Justificatif demandé',
    description:
      'La CAF demande un justificatif de domicile récent pour maintenir les aides au logement. Réponse à envoyer en ligne depuis l’espace allocataire.',
    priority: 4,
    status: 'open',
    dueAt: atTime(addDays(today, -1), 18),
    hasTime: false,
    category: 'Famille',
    household: null,
    sharedWith: [],
    assignee: 'Claire',
    reminder: true,
    createdAt: addDays(today, -6),
    subtasks: [
      { id: 'caf-1', title: 'Scanner le justificatif', done: true },
      { id: 'caf-2', title: 'Envoyer depuis l’espace allocataire', done: false },
    ],
  },
  {
    id: 'remboursement',
    title: 'Suivre le remboursement des soins dentaires',
    context: 'Harmonie Mutuelle • 142,50 €',
    description:
      'Vérifier que la mutuelle a bien reçu la feuille de soins du 2 mai et relancer si le remboursement n’apparaît pas.',
    priority: 1,
    status: 'open',
    dueAt: atTime(addDays(today, -4), 12),
    hasTime: false,
    category: 'Santé',
    household: HOUSEHOLD.name,
    sharedWith: ['Thomas'],
    assignee: 'Claire',
    reminder: false,
    createdAt: addDays(today, -12),
    subtasks: [],
  },
  {
    id: 'attestation',
    title: 'Renvoyer l’attestation de domicile signée',
    context: 'Bailleur Foncia • Format PDF certifié',
    description:
      'Renvoyer l’attestation de domicile signée au bailleur avant 17h. Le document est déjà scanné, signé électroniquement et prêt à être joint.',
    priority: 3,
    status: 'open',
    dueAt: atTime(today, 17),
    hasTime: true,
    category: 'Logement',
    household: HOUSEHOLD.name,
    sharedWith: ['Thomas'],
    assignee: 'Claire',
    reminder: true,
    createdAt: addDays(today, -2),
    subtasks: [
      { id: 'att-1', title: 'Télécharger le formulaire', done: true },
      { id: 'att-2', title: 'Signer électroniquement', done: true },
      { id: 'att-3', title: 'Envoyer au bailleur', done: false },
    ],
    document: { name: 'Attestation_domicile_2024.pdf', meta: 'PDF • 248 Ko • Signé' },
  },
  {
    id: 'controle-technique',
    title: 'Contrôle technique Peugeot 208',
    context: 'AutoSécurité République',
    description: 'Présenter la carte grise et le dernier procès-verbal. Prévoir 45 minutes sur place.',
    priority: 2,
    status: 'open',
    dueAt: atTime(addDays(today, 1), 9),
    hasTime: true,
    category: 'Véhicule',
    household: null,
    sharedWith: [],
    assignee: 'Claire',
    reminder: true,
    createdAt: addDays(today, -9),
    subtasks: [
      { id: 'ct-1', title: 'Préparer la carte grise', done: false },
      { id: 'ct-2', title: 'Retrouver le dernier procès-verbal', done: false },
    ],
  },
  {
    id: 'ophtalmo',
    title: 'Préparer le contrôle ophtalmologique',
    context: 'Dr. Vasseur • Centre Médical Saint-Honoré',
    description: 'Apporter l’ordonnance de lunettes actuelle et la carte Vitale.',
    priority: 2,
    status: 'open',
    dueAt: atTime(addDays(today, 2), 14, 30),
    hasTime: true,
    category: 'Santé',
    household: null,
    sharedWith: [],
    assignee: 'Claire',
    reminder: true,
    createdAt: addDays(today, -5),
    subtasks: [],
  },
  {
    id: 'inscription',
    title: 'Renouveler l’inscription scolaire de Léo',
    context: 'Mairie • Dossier périscolaire',
    description: 'Compléter le dossier périscolaire en ligne et joindre l’attestation d’assurance.',
    priority: 2,
    status: 'open',
    dueAt: atTime(addDays(today, 11), 12),
    hasTime: false,
    category: 'Famille',
    household: HOUSEHOLD.name,
    sharedWith: ['Thomas'],
    assignee: 'Thomas',
    reminder: false,
    createdAt: addDays(today, -3),
    subtasks: [],
  },
  {
    id: 'declaration',
    title: 'Finaliser la déclaration de revenus 2023',
    context: 'impots.gouv.fr • Frais réels vérifiés',
    description:
      'Les données pré-remplies ont été analysées et consolidées. Il reste à vérifier les frais de garde puis à signer la déclaration.',
    priority: 3,
    status: 'open',
    dueAt: atTime(addDays(today, 12), 23, 59),
    hasTime: false,
    category: 'Impôts',
    household: null,
    sharedWith: [],
    assignee: 'Claire',
    reminder: true,
    createdAt: addDays(today, -20),
    subtasks: [
      { id: 'dec-1', title: 'Vérifier les revenus pré-remplis', done: true },
      { id: 'dec-2', title: 'Ajouter les frais de garde', done: false },
      { id: 'dec-3', title: 'Signer la déclaration', done: false },
    ],
  },
  {
    id: 'cantine',
    title: 'Régler la cantine scolaire du 2e trimestre',
    context: 'Mairie • 186,00 €',
    description: 'Paiement effectué en ligne sur le portail famille.',
    priority: 2,
    status: 'done',
    dueAt: atTime(addDays(today, -3), 12),
    hasTime: false,
    category: 'Famille',
    household: HOUSEHOLD.name,
    sharedWith: ['Thomas'],
    assignee: 'Thomas',
    reminder: false,
    createdAt: addDays(today, -15),
    completedAt: addDays(today, -2),
    subtasks: [],
  },
  {
    id: 'dentiste-leo',
    title: 'Prendre rendez-vous chez le dentiste pour Léo',
    context: 'Cabinet Dr Lemoine',
    description: 'Rendez-vous obtenu pour le vendredi 17 mai à 10h.',
    priority: 2,
    status: 'done',
    dueAt: atTime(addDays(today, -4), 12),
    hasTime: false,
    category: 'Santé',
    household: null,
    sharedWith: [],
    assignee: 'Claire',
    reminder: false,
    createdAt: addDays(today, -10),
    completedAt: addDays(today, -4),
    subtasks: [],
  },
];
