// Appels de l'API Tâches (guide d'API v1.0, module 03 : TASK-001 à TASK-013) et conversion
// entre le format du contrat (snake_case, statuts de la base, dates UTC) et le modèle des écrans.
// Ce fichier ne touche pas à la mémoire de démo : c'est le store qui l'appelle en mode « api ».
import { api, getAll } from '@/lib/api';

import { HOUSEHOLD } from '../data';
import type { Task, TaskCategory, TaskDraft, TaskStatus } from '../types';

/** Tâche telle que renvoyée par l'API (TASK-003). */
export type TaskDto = {
  id: string;
  title: string;
  description: string | null;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 1 | 2 | 3 | 4;
  visibility: 'personal' | 'household';
  household_id: string | null;
  category: { id: string; name: string } | null;
  assignment: { user_id: string; display_name?: string; status?: string } | null;
  reminder: { id: string; remind_at: string; status: string } | null;
  due_date?: string | null;
  due_at?: string | null;
  completed_at?: string | null;
  version: number;
  created_at: string;
  updated_at?: string;
};

const CATEGORIES: TaskCategory[] = ['Logement', 'Santé', 'Impôts', 'Famille', 'Véhicule', 'Autre'];

function toStatus(status: TaskDto['status']): TaskStatus {
  if (status === 'completed') return 'done';
  if (status === 'cancelled') return 'archived';
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

export function toTask(dto: TaskDto): Task {
  const category = CATEGORIES.find((entry) => entry === dto.category?.name) ?? 'Autre';
  const shared = dto.visibility === 'household' || dto.household_id !== null;
  return {
    id: dto.id,
    title: dto.title,
    context: shared ? `Partagée • ${HOUSEHOLD.name}` : (dto.category?.name ?? 'Personnelle'),
    description: dto.description ?? '',
    priority: dto.priority,
    status: toStatus(dto.status),
    dueAt: dto.due_at ? new Date(dto.due_at) : dto.due_date ? fromDateOnly(dto.due_date) : new Date(dto.created_at),
    hasTime: Boolean(dto.due_at),
    category,
    household: shared ? HOUSEHOLD.name : null,
    sharedWith: [],
    assignee: dto.assignment?.display_name ?? 'Moi',
    reminder: Boolean(dto.reminder),
    createdAt: new Date(dto.created_at),
    completedAt: dto.completed_at ? new Date(dto.completed_at) : undefined,
    subtasks: [],
    version: dto.version,
  };
}

/** Champs d'échéance du contrat : une date seule, ou un instant UTC si l'heure compte. */
function dueFields(draft: Pick<TaskDraft, 'dueAt' | 'hasTime'>) {
  return draft.hasTime
    ? { due_date: null, due_at: draft.dueAt.toISOString() }
    : { due_date: toDateOnly(draft.dueAt), due_at: null };
}

export const tasksApi = {
  /** TASK-002 : toutes les tâches visibles (personnelles et du foyer). */
  list: () => getAll<TaskDto>('/tasks', { scope: 'all', sort: 'due_date' }),

  /** TASK-001 : création (rappel facultatif créé dans la même transaction). */
  create: (draft: TaskDraft) =>
    api.post<TaskDto>('/tasks', {
      title: draft.title,
      description: draft.description || null,
      priority: draft.priority,
      status: 'planned',
      visibility: draft.household ? 'household' : 'personal',
      household_id: null, // résolu par le serveur depuis le foyer actif (jamais imposé par le client)
      category_id: null,
      ...dueFields(draft),
      assigned_to: null,
      reminder: draft.reminder ? { enabled: true, advance_minutes: 1440, channels: ['in_app', 'push'] } : null,
    }),

  /** TASK-004 : modification partielle avec verrouillage optimiste. */
  update: (id: string, version: number, draft: Partial<TaskDraft>) =>
    api.patch<TaskDto>(`/tasks/${id}`, {
      ...(draft.title !== undefined ? { title: draft.title } : {}),
      ...(draft.description !== undefined ? { description: draft.description || null } : {}),
      ...(draft.priority !== undefined ? { priority: draft.priority } : {}),
      ...(draft.dueAt !== undefined ? dueFields({ dueAt: draft.dueAt, hasTime: draft.hasTime ?? false }) : {}),
      version,
    }),

  /** TASK-006 / TASK-007 : terminer ou rouvrir. */
  complete: (id: string, version: number) =>
    api.post<TaskDto>(`/tasks/${id}/complete`, { completed_at: new Date().toISOString(), version }),
  reopen: (id: string, version: number) => api.post<TaskDto>(`/tasks/${id}/reopen`, { version }),

  /** TASK-012 : changement de statut (archiver = annuler, désarchiver = planifiée). */
  setStatus: (id: string, version: number, status: TaskDto['status']) =>
    api.post<TaskDto>(`/tasks/${id}/status`, { status, version }),

  /** TASK-005 / TASK-013 : suppression logique et restauration. */
  remove: (id: string) => api.delete(`/tasks/${id}`),
  restore: (id: string) => api.post<TaskDto>(`/tasks/${id}/restore`),
};
