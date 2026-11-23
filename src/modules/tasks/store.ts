// Mémoire partagée par les écrans du module Tâches, alimentée uniquement par l'API (contrat 2.11.0).
// Chaque action s'affiche tout de suite (mise à jour optimiste), puis la requête part ;
// en cas d'échec, l'écran revient à l'état précédent et un message explique pourquoi.
// Une tâche tout juste créée porte un identifiant local jusqu'à la réponse du serveur :
// les actions faites entre-temps attendent cet identifiant avant de partir.
import { useSyncExternalStore } from 'react';

import { isApiError, userMessage } from '@/lib/api';
import { newId } from '@/lib/id';
import { sessionStore } from '@/lib/session';

import { addDays, categoryLabel } from './data';
import { tasksApi, toTask, type TaskContext, type TaskDto } from './services/tasks.service';
import type { ActiveHousehold, CategoryOption, Task, TaskDraft } from './types';

type Snapshot = {
  tasks: Task[];
  categories: CategoryOption[];
  household: ActiveHousehold | null;
  /** true après le premier chargement réussi. */
  loaded: boolean;
  /** Message à afficher à l'arrivée sur la liste (après création, suppression ou échec). */
  flash: { text: string; undo?: () => void } | null;
};

const EMPTY: Snapshot = { tasks: [], categories: [], household: null, loaded: false, flash: null };

let state: Snapshot = EMPTY;
const listeners = new Set<() => void>();
/** Identifiant local → identifiant du serveur (tâches créées dans cette session). */
const serverIds = new Map<string, Promise<string>>();
/** Identifiant local d'une tâche créée → identifiant du serveur (pour les écrans ouverts entre-temps). */
const aliases = new Map<string, string>();

/** Identifiant à afficher : l'identifiant du serveur si la tâche locale a été enregistrée. */
export function currentTaskId(id: string | undefined): string | undefined {
  return id ? (aliases.get(id) ?? id) : undefined;
}

function emit(next: Partial<Snapshot>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

// Déconnexion : on oublie les tâches du compte précédent.
sessionStore.subscribe((session) => {
  if (!session) {
    serverIds.clear();
    aliases.clear();
    state = EMPTY;
    for (const listener of listeners) listener();
  }
});

function context(): TaskContext {
  return { household: state.household, meId: sessionStore.getUser()?.id ?? null };
}

function find(id: string): Task | undefined {
  const real = currentTaskId(id);
  return state.tasks.find((task) => task.id === real);
}

function update(id: string, patch: Partial<Task>) {
  const real = currentTaskId(id);
  emit({ tasks: state.tasks.map((task) => (task.id === real ? { ...task, ...patch, id: task.id } : task)) });
}

/** Remplace une tâche par la version du serveur (l'identifiant peut changer après une création). */
function replace(id: string, dto: TaskDto) {
  const next = toTask(dto, context());
  const real = currentTaskId(id);
  emit({ tasks: state.tasks.map((task) => (task.id === id || task.id === real || task.id === dto.id ? next : task)) });
}

/** Identifiant à utiliser pour l'API (attend la fin de la création si la tâche est encore locale). */
function serverId(id: string): Promise<string> {
  const current = find(id);
  return serverIds.get(id) ?? Promise.resolve(current?.id ?? id);
}

/** Envoie la requête ; en cas d'échec, annule la modification locale et explique pourquoi. */
function remote<T>(call: (id: string) => Promise<T>, id: string, onSuccess: (result: T) => void, rollback: () => void) {
  serverId(id)
    .then(call)
    .then(onSuccess)
    .catch((error: unknown) => {
      rollback();
      emit({ flash: { text: userMessage(error) } });
      // Conflit de version (modifiée ailleurs) : on recharge la version du serveur.
      if (isApiError(error) && error.status === 409) void syncTasks().catch(() => undefined);
    });
}

/** Charge les tâches, les catégories et le foyer actif. Appelé par la liste (tirer pour actualiser). */
export async function syncTasks(): Promise<void> {
  const [household, categories] = await Promise.all([
    tasksApi.household(),
    tasksApi.categories().catch(() => state.categories),
  ]);
  emit({ household, categories });
  const items = await tasksApi.list();
  const ctx = context();
  // Les tâches encore en cours de création restent affichées.
  const pending = state.tasks.filter((task) => serverIds.has(task.id) && task.id.startsWith('local-'));
  emit({ tasks: [...pending, ...items.map((dto) => toTask(dto, ctx))], loaded: true });
}

/** Charge une tâche absente de la liste (lien depuis le calendrier, le foyer, un e-mail…). */
export async function ensureTask(id: string | undefined): Promise<void> {
  if (!id || find(id) || id.startsWith('local-')) return;
  if (!state.loaded && !state.household) {
    const [household, categories] = await Promise.all([
      tasksApi.household(),
      tasksApi.categories().catch(() => state.categories),
    ]);
    emit({ household, categories });
  }
  const dto = await tasksApi.get(id);
  if (!find(dto.id)) emit({ tasks: [toTask(dto, context()), ...state.tasks] });
}

export function useTasks(): Task[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).tasks;
}

export function useTask(id: string | undefined): Task | undefined {
  const tasks = useTasks();
  const real = currentTaskId(id);
  return real ? tasks.find((task) => task.id === real) : undefined;
}

export function useTaskContext() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { categories: snapshot.categories, household: snapshot.household, loaded: snapshot.loaded };
}

export function useFlash() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).flash;
}

/** Tâche affichée tout de suite après « Créer », avant la réponse du serveur. */
function optimisticTask(id: string, draft: TaskDraft): Task {
  const household = draft.householdId && state.household?.id === draft.householdId ? state.household : null;
  const member = draft.assigneeId ? household?.members.find((entry) => entry.id === draft.assigneeId) : undefined;
  const label = draft.category ? categoryLabel(draft.category) : null;
  return {
    id,
    title: draft.title,
    context: [label, household ? `Partagée • ${household.name}` : 'Personnelle'].filter(Boolean).join(' • '),
    description: draft.description,
    priority: draft.priority,
    status: 'open',
    inProgress: false,
    dueAt: draft.dueAt,
    hasTime: draft.hasTime,
    hasDue: true,
    category: draft.category,
    householdId: draft.householdId,
    household: household?.name ?? null,
    assigneeId: draft.assigneeId,
    assignee: member ? (member.you ? 'Vous' : member.name) : '',
    assignedToMe: Boolean(member?.you),
    assignmentStatus: null,
    reminderAt: draft.reminderAt,
    createdAt: new Date(),
    suggested: false,
    version: 1,
  };
}

export const taskActions = {
  complete(id: string) {
    const before = find(id);
    if (!before) return;
    update(id, { status: 'done', inProgress: false, completedAt: new Date() });
    remote((sid) => tasksApi.complete(sid), id, (dto) => replace(id, dto), () => update(id, before));
  },
  reopen(id: string) {
    const before = find(id);
    if (!before) return;
    update(id, { status: 'open', completedAt: undefined });
    remote((sid) => tasksApi.reopen(sid, find(sid)?.version ?? before.version), id, (dto) => replace(id, dto), () => update(id, before));
  },
  archive(id: string) {
    const before = find(id);
    if (!before) return;
    update(id, { status: 'archived' });
    remote((sid) => tasksApi.archive(sid), id, (dto) => replace(id, dto), () => update(id, before));
  },
  restore(id: string) {
    const before = find(id);
    if (!before) return;
    update(id, { status: 'open' });
    remote((sid) => tasksApi.unarchive(sid), id, (dto) => replace(id, dto), () => update(id, before));
  },
  postpone(id: string, days: number) {
    const before = find(id);
    if (!before) return;
    taskActions.setDue(id, addDays(before.dueAt, days));
  },
  setDue(id: string, dueAt: Date) {
    const before = find(id);
    if (!before) return;
    update(id, { dueAt, hasDue: true });
    remote(
      (sid) => tasksApi.reschedule(sid, find(sid)?.version ?? before.version, dueAt, before.hasTime),
      id,
      (dto) => replace(id, dto),
      () => update(id, before),
    );
  },
  /** Garder une tâche proposée par Kora. */
  confirm(id: string) {
    const before = find(id);
    if (!before) return;
    update(id, { suggested: false });
    remote((sid) => tasksApi.confirm(sid), id, (dto) => replace(id, dto), () => update(id, before));
  },
  /** Accepter ou refuser une tâche confiée par un membre du foyer. */
  respond(id: string, accept: boolean) {
    const before = find(id);
    if (!before) return;
    update(id, { assignmentStatus: accept ? 'accepted' : 'rejected' });
    remote((sid) => tasksApi.respond(sid, accept), id, (dto) => replace(id, dto), () => update(id, before));
  },
  /** Mise à la corbeille : la tâche peut être rétablie tant que le message est affiché. */
  remove(id: string): () => void {
    const real = currentTaskId(id);
    const index = state.tasks.findIndex((entry) => entry.id === real);
    const task = state.tasks[index];
    if (!task) return () => undefined;
    emit({ tasks: state.tasks.filter((entry) => entry.id !== task.id) });
    const putBack = () => {
      if (state.tasks.some((entry) => entry.id === task.id)) return;
      const copy = [...state.tasks];
      copy.splice(Math.max(Math.min(index, copy.length), 0), 0, task);
      emit({ tasks: copy });
    };
    remote((sid) => tasksApi.remove(sid), id, () => undefined, putBack);
    return () => {
      putBack();
      // « Annuler » : la suppression est logique côté serveur, on la restaure (API-TSK-011).
      remote(
        (sid) => tasksApi.restore(sid),
        id,
        (dto) => replace(task.id, dto),
        () => emit({ tasks: state.tasks.filter((entry) => entry.id !== task.id) }),
      );
    };
  },
  /** Crée la tâche ; renvoie son identifiant local (valable aussi pour « Annuler »). */
  create(draft: TaskDraft): string {
    const localId = `local-${newId()}`;
    emit({ tasks: [optimisticTask(localId, draft), ...state.tasks] });
    const request = tasksApi.create(draft, newId()).then((dto) => {
      replace(localId, dto);
      // Les écrans qui gardaient l'identifiant local retrouvent la tâche.
      aliases.set(localId, dto.id);
      return dto.id;
    });
    serverIds.set(localId, request);
    request.catch((error: unknown) => {
      serverIds.delete(localId);
      emit({ tasks: state.tasks.filter((entry) => entry.id !== localId), flash: { text: userMessage(error) } });
    });
    return localId;
  },
  /** Enregistre le formulaire de modification. */
  save(id: string, draft: TaskDraft) {
    const before = find(id);
    if (!before) return;
    update(id, { ...optimisticTask(id, draft), createdAt: before.createdAt, status: before.status, version: before.version });
    remote((sid) => tasksApi.save(sid, find(sid)?.version ?? before.version, draft), id, (dto) => replace(id, dto), () => update(id, before));
  },
  setFlash(flash: Snapshot['flash']) {
    emit({ flash });
  },
};

