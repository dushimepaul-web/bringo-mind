// Appels de l'API Tâches (contrat 2.11.0, docs/backend/modules/05_taches.md) et conversion
// entre le format du contrat (snake_case, statuts et priorités de la base, dates UTC) et le
// modèle des écrans. Ce fichier ne touche pas à la mémoire de démo : le store l'appelle en mode « api ».
import { api, getAll } from '@/lib/api';
import { deviceTimeZone } from '@/lib/device-info';

import { HOUSEHOLD } from '../data';
import type { Task, TaskCategory, TaskDraft, TaskStatus } from '../types';

/** Tâche telle que renvoyée par l'API (`TaskOut`). */
export type TaskDto = {
  id: string;
  owner_id: string;
  household_id: string | null;
  assignee_id: string | null;
  assignment_status: 'pending' | 'accepted' | 'rejected' | null;
  title: string;
  description: string | null;
  category: string | null;
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: 'needs_review' | 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'archived' | 'inbox' | 'deferred' | 'blocked';
  due_at: string | null;
  due_date: string | null;
  due_time: string | null;
  due_all_day: boolean;
  timezone: string;
  estimated_minutes: number | null;
  reminder_offsets: number[] | null;
  is_confirmed: boolean;
  completed_at: string | null;
  completion_note: string | null;
  completion_proof_id: string | null;
  origin: string;
  created_at: string;
  updated_at: string;
  version: number;
};

const CATEGORIES: TaskCategory[] = ['Logement', 'Santé', 'Impôts', 'Famille', 'Véhicule', 'Autre'];
const PRIORITY_BY_VALUE: Record<Task['priority'], TaskDto['priority']> = {
  1: 'low',
  2: 'normal',
  3: 'high',
  4: 'critical',
};
const VALUE_BY_PRIORITY: Record<TaskDto['priority'], Task['priority']> = { low: 1, normal: 2, high: 3, critical: 4 };

function toStatus(status: TaskDto['status']): TaskStatus {
  if (status === 'completed') return 'done';
  if (status === 'cancelled' || status === 'archived') return 'archived';
  return 'open';
}

/** « 2026-11-15 » → Date locale à midi (évite les décalages de fuseau sur une date seule). */
function fromDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

function toDateOnly(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toTimeOnly(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toTask(dto: TaskDto): Task {
  const category = CATEGORIES.find((entry) => entry === dto.category) ?? 'Autre';
  const shared = dto.household_id !== null;
  const dueAt = dto.due_at
    ? new Date(dto.due_at)
    : dto.due_date
      ? fromDateOnly(dto.due_date)
      : new Date(dto.created_at);
  return {
    id: dto.id,
    title: dto.title,
    context: shared ? `Partagée • ${HOUSEHOLD.name}` : (dto.category ?? 'Personnelle'),
    description: dto.description ?? '',
    priority: VALUE_BY_PRIORITY[dto.priority] ?? 2,
    status: toStatus(dto.status),
    dueAt,
    hasTime: Boolean(dto.due_at) && !dto.due_all_day,
    category,
    household: shared ? HOUSEHOLD.name : null,
    sharedWith: [],
    assignee: dto.assignee_id ? 'Membre' : 'Moi',
    reminder: Boolean(dto.reminder_offsets && dto.reminder_offsets.length > 0),
    createdAt: new Date(dto.created_at),
    completedAt: dto.completed_at ? new Date(dto.completed_at) : undefined,
    subtasks: [],
    version: dto.version,
  };
}

/** Champs d'échéance du contrat : `due_date` (date) et `due_time` (heure, si l'heure compte). */
function dueFields(draft: Pick<TaskDraft, 'dueAt' | 'hasTime'>) {
  return draft.hasTime
    ? { due_date: toDateOnly(draft.dueAt), due_time: toTimeOnly(draft.dueAt) }
    : { due_date: toDateOnly(draft.dueAt), due_time: null };
}

export const tasksApi = {
  /** TASK-002 : toutes les tâches visibles (personnelles et du foyer). */
  list: () => getAll<TaskDto>('/tasks', { scope: 'all', sort: 'due_at' }),

  /** TASK-001 : création (rappels créés dans la même transaction via `reminder_offsets`). */
  create: (draft: TaskDraft) =>
    api.post<TaskDto>('/tasks', {
      title: draft.title,
      description: draft.description || null,
      priority: PRIORITY_BY_VALUE[draft.priority] ?? 'normal',
      status: 'planned',
      category: draft.category === 'Autre' ? null : draft.category,
      household_id: null, // résolu par le serveur depuis le foyer actif (jamais imposé par le client)
      ...dueFields(draft),
      reminder_offsets: draft.reminder ? [1440] : null,
      timezone: deviceTimeZone(),
    }),

  /** TASK-004 : modification partielle avec verrouillage optimiste (`TaskPatch`). */
  update: (id: string, version: number, draft: Partial<TaskDraft>) =>
    api.patch<TaskDto>(`/tasks/${id}`, {
      ...(draft.title !== undefined ? { title: draft.title } : {}),
      ...(draft.description !== undefined ? { description: draft.description || null } : {}),
      ...(draft.priority !== undefined ? { priority: PRIORITY_BY_VALUE[draft.priority] ?? 'normal' } : {}),
      ...(draft.category !== undefined ? { category: draft.category === 'Autre' ? null : draft.category } : {}),
      ...(draft.dueAt !== undefined ? dueFields({ dueAt: draft.dueAt, hasTime: draft.hasTime ?? false }) : {}),
      ...(draft.reminder !== undefined ? { reminder_offsets: draft.reminder ? [1440] : [] } : {}),
      version,
    }),

  /** TASK-006 : terminer (note et justificatif facultatifs). */
  complete: (id: string, note?: string) =>
    api.post<TaskDto>(`/tasks/${id}/complete`, { note: note ?? null, proof_document_id: null }),

  /** Rouvrir une tâche terminée : repasse en planifiée (PATCH `status`). */
  reopen: (id: string, version: number) => api.patch<TaskDto>(`/tasks/${id}`, { status: 'planned', version }),

  /** TASK-012 : archiver / désarchiver. */
  archive: (id: string) => api.post<TaskDto>(`/tasks/${id}/archive`),
  unarchive: (id: string) => api.post<TaskDto>(`/tasks/${id}/unarchive`),

  /** TASK-005 / TASK-013 : suppression logique et restauration. */
  remove: (id: string) => api.delete(`/tasks/${id}`),
  restore: (id: string) => api.post<TaskDto>(`/tasks/${id}/restore`),

  /** TASK-009 : confirmer une tâche suggérée par Kora. */
  confirm: (id: string) => api.post<TaskDto>(`/tasks/${id}/confirm`),

  /** TASK-010 : accepter ou refuser une assignation. */
  assign: (id: string, accept: boolean) => api.post<TaskDto>(`/tasks/${id}/assignment`, { accept }),
};
