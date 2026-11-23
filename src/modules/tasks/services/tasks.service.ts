// Appels de l'API Tâches (contrat 2.11.0, docs/backend/modules/05_taches.md) et conversion
// entre le format du contrat (snake_case, statuts et priorités en toutes lettres, dates UTC)
// et le modèle des écrans. Seul le store de ce module appelle ce fichier.
import { api, getAll, isApiError } from '@/lib/api';
import { deviceTimeZone } from '@/lib/device-info';
import { sessionStore } from '@/lib/session';

import { categoryIcon, categoryLabel } from '../data';
import type { ActiveHousehold, CategoryOption, Task, TaskDraft, TaskStatus } from '../types';

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
  due_date?: string | null;
  due_time?: string | null;
  due_all_day: boolean;
  timezone: string;
  estimated_minutes: number | null;
  reminder_offsets: number[] | null;
  is_confirmed: boolean;
  completed_at: string | null;
  completion_note: string | null;
  archived_at?: string | null;
  origin: string;
  created_at: string;
  updated_at: string;
  version?: number;
};

/** Catégorie renvoyée par GET /categories. */
type CategoryDto = { id: string; name: string; custom?: boolean | null; custom_id?: string | null };

type HouseholdDto = { id: string; name: string };
type MemberDto = { user_id: string; full_name: string | null; email: string | null };

const PRIORITY_BY_VALUE = { 1: 'low', 2: 'normal', 3: 'high', 4: 'critical' } as const;
const VALUE_BY_PRIORITY: Record<TaskDto['priority'], Task['priority']> = { low: 1, normal: 2, high: 3, critical: 4 };

const MINUTE_MS = 60_000;
/** Délais de rappel acceptés par l'API : 60 jours au plus, 5 au plus. */
const MAX_OFFSET_MINUTES = 60 * 24 * 60;
const MAX_REMINDERS = 5;

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

const pad = (value: number) => String(value).padStart(2, '0');

function toDateOnly(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toTimeOnly(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Point de référence des rappels : l'heure d'échéance, ou minuit le jour même pour une tâche sans heure. */
function reminderBase(dueAt: Date, hasTime: boolean): Date {
  return hasTime ? dueAt : new Date(dueAt.getFullYear(), dueAt.getMonth(), dueAt.getDate());
}

/** Dates des rappels → `reminder_offsets` (minutes avant l'échéance, du plus lointain au plus proche). */
function toOffsets(draft: Pick<TaskDraft, 'dueAt' | 'hasTime' | 'reminderAt'>): number[] {
  const base = reminderBase(draft.dueAt, draft.hasTime).getTime();
  const offsets = draft.reminderAt
    .map((at) => Math.round((base - at.getTime()) / MINUTE_MS))
    .filter((minutes) => minutes > 0 && minutes <= MAX_OFFSET_MINUTES);
  return [...new Set(offsets)].sort((a, b) => b - a).slice(0, MAX_REMINDERS);
}

export type TaskContext = { household: ActiveHousehold | null; meId: string | null };

export function toTask(dto: TaskDto, ctx: TaskContext): Task {
  const hasDue = Boolean(dto.due_at || dto.due_date);
  const hasTime = Boolean(dto.due_at) && !dto.due_all_day;
  const dueAt = dto.due_at
    ? hasTime
      ? new Date(dto.due_at)
      : dto.due_date
        ? fromDateOnly(dto.due_date)
        : new Date(dto.due_at)
    : dto.due_date
      ? fromDateOnly(dto.due_date)
      : new Date(dto.created_at);
  const household = dto.household_id && ctx.household?.id === dto.household_id ? ctx.household : null;
  const householdName = dto.household_id ? (household?.name ?? 'Foyer') : null;
  const member = dto.assignee_id ? household?.members.find((entry) => entry.id === dto.assignee_id) : undefined;
  const assignedToMe = dto.assignee_id !== null && dto.assignee_id === ctx.meId;
  const base = reminderBase(dueAt, hasTime).getTime();
  const reminderAt = hasDue ? (dto.reminder_offsets ?? []).map((minutes) => new Date(base - minutes * MINUTE_MS)) : [];
  const label = dto.category ? categoryLabel(dto.category) : null;

  return {
    id: dto.id,
    title: dto.title,
    context: [label, householdName ? `Partagée • ${householdName}` : 'Personnelle'].filter(Boolean).join(' • '),
    description: dto.description ?? '',
    priority: VALUE_BY_PRIORITY[dto.priority] ?? 2,
    status: toStatus(dto.status),
    inProgress: dto.status === 'in_progress',
    dueAt,
    hasTime,
    hasDue,
    category: dto.category,
    householdId: dto.household_id,
    household: householdName,
    assigneeId: dto.assignee_id,
    assignee: assignedToMe ? 'Vous' : (member?.name ?? (dto.assignee_id ? 'Un membre du foyer' : '')),
    assignedToMe,
    assignmentStatus: dto.assignment_status,
    reminderAt,
    createdAt: new Date(dto.created_at),
    completedAt: dto.completed_at ? new Date(dto.completed_at) : undefined,
    suggested: !dto.is_confirmed || dto.status === 'needs_review',
    version: dto.version ?? 1,
  };
}

/** Champs d'échéance du contrat : `due_date` (date) et `due_time` (heure, si l'heure compte). */
function dueFields(draft: Pick<TaskDraft, 'dueAt' | 'hasTime'>) {
  return { due_date: toDateOnly(draft.dueAt), due_time: draft.hasTime ? toTimeOnly(draft.dueAt) : null };
}

/** Corps commun à la création et à la modification complète. */
function body(draft: TaskDraft) {
  const offsets = toOffsets(draft);
  return {
    title: draft.title,
    description: draft.description || null,
    priority: PRIORITY_BY_VALUE[draft.priority] ?? 'normal',
    category: draft.category,
    household_id: draft.householdId,
    // L'API refuse une attribution hors foyer.
    assignee_id: draft.householdId ? draft.assigneeId : null,
    ...dueFields(draft),
    reminder_offsets: offsets.length ? offsets : null,
    timezone: deviceTimeZone(),
  };
}

/** Foyer actif (le premier de la liste) et ses membres ; null si l'utilisateur n'a pas de foyer. */
async function loadHousehold(): Promise<ActiveHousehold | null> {
  const households = await getAll<HouseholdDto>('/households');
  const first = households[0];
  if (!first) return null;
  const me = sessionStore.getUser()?.id ?? null;
  let members: MemberDto[] = [];
  try {
    members = await getAll<MemberDto>(`/households/${first.id}/members`);
  } catch (error) {
    // Sans droit de lecture des membres, la liste des tâches reste utilisable.
    if (!isApiError(error)) throw error;
  }
  return {
    id: first.id,
    name: first.name,
    members: members.map((member) => ({
      id: member.user_id,
      name: member.full_name || member.email || 'Membre',
      you: member.user_id === me,
    })),
  };
}

export const tasksApi = {
  /** API-TSK-005 : tâches visibles (personnelles, attribuées et du foyer), échéances proches d'abord. */
  list: () => getAll<TaskDto>('/tasks', { scope: 'all', sort: 'due_at', limit: 100 }),

  /** API-TSK-008 : fiche d'une tâche (ouverte depuis un autre module). */
  get: (id: string) => api.get<TaskDto>(`/tasks/${id}`),

  /** API-TSK-001 : catégories proposées par l'application, puis catégories personnelles. */
  categories: async (): Promise<CategoryOption[]> => {
    const items = await api.get<CategoryDto[] | null>('/categories');
    return (items ?? []).map((item) => ({
      code: item.name,
      label: categoryLabel(item.name),
      icon: categoryIcon(item.name),
      custom: Boolean(item.custom),
    }));
  },

  /** Foyer actif et membres (attribution, nom affiché). */
  household: () => loadHousehold().catch((error: unknown) => {
    // Fonction « foyers » désactivée ou aucun foyer : tâches personnelles seulement.
    if (isApiError(error)) return null;
    throw error;
  }),

  /** API-TSK-006 : création (rappels créés dans la même transaction via `reminder_offsets`). */
  create: (draft: TaskDraft, idempotencyKey: string) =>
    api.post<TaskDto>('/tasks', { ...body(draft), status: 'planned', origin: 'manual' }, { idempotencyKey }),

  /** API-TSK-009 : modification complète depuis le formulaire (verrouillage optimiste). */
  save: (id: string, version: number, draft: TaskDraft) =>
    api.patch<TaskDto>(`/tasks/${id}`, { ...body(draft), reminder_offsets: toOffsets(draft), version }),

  /** API-TSK-009 : nouvelle échéance (report), rappels décalés d'autant côté serveur. */
  reschedule: (id: string, version: number, dueAt: Date, hasTime: boolean) =>
    api.patch<TaskDto>(`/tasks/${id}`, { ...dueFields({ dueAt, hasTime }), version }),

  /** API-TSK-014 : terminer (note et justificatif facultatifs). */
  complete: (id: string, note?: string) =>
    api.post<TaskDto>(`/tasks/${id}/complete`, { note: note ?? null, proof_document_id: null }),

  /** Rouvrir une tâche terminée : repasse en planifiée (PATCH `status`). */
  reopen: (id: string, version: number) => api.patch<TaskDto>(`/tasks/${id}`, { status: 'planned', version }),

  /** API-TSK-012 / 013 : archiver / désarchiver. */
  archive: (id: string) => api.post<TaskDto>(`/tasks/${id}/archive`),
  unarchive: (id: string) => api.post<TaskDto>(`/tasks/${id}/unarchive`),

  /** API-TSK-010 / 011 : mise à la corbeille et restauration. */
  remove: (id: string) => api.delete(`/tasks/${id}`),
  restore: (id: string) => api.post<TaskDto>(`/tasks/${id}/restore`),

  /** API-TSK-016 : garder une tâche proposée par Kora. */
  confirm: (id: string) => api.post<TaskDto>(`/tasks/${id}/confirm`),

  /** API-TSK-017 : accepter ou refuser une attribution. */
  respond: (id: string, accept: boolean) => api.post<TaskDto>(`/tasks/${id}/assignment`, { accept }),
};
