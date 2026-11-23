// Mémoire partagée par les écrans du module Tâches.
// Mode « demo » : données de démonstration, rien ne part sur le réseau.
// Mode « api » : chaque action s'affiche tout de suite (mise à jour optimiste), puis la requête part ;
// en cas d'échec, l'écran revient à l'état précédent et un message explique pourquoi.
import { useSyncExternalStore } from 'react';

import { userMessage } from '@/lib/api';
import { IS_DEMO } from '@/lib/config';

import { addDays, DEMO_TASKS, DEMO_TODAY } from './data';
import { tasksApi, toTask, type TaskDto } from './services/tasks.service';
import type { Task, TaskDraft } from './types';

type Snapshot = {
  tasks: Task[];
  /** Message à afficher à l'arrivée sur la liste (après création ou suppression). */
  flash: { text: string; undo?: () => void } | null;
};

let state: Snapshot = { tasks: IS_DEMO ? DEMO_TASKS : [], flash: null };
const listeners = new Set<() => void>();

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

function update(id: string, patch: Partial<Task>) {
  emit({ tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)) });
}

function find(id: string): Task | undefined {
  return state.tasks.find((task) => task.id === id);
}

/** Remplace une tâche par la version renvoyée par le serveur (nouvel identifiant possible). */
function replace(localId: string, dto: TaskDto) {
  const next = toTask(dto);
  emit({ tasks: state.tasks.map((task) => (task.id === localId ? { ...next, subtasks: task.subtasks } : task)) });
}

/** Mode « api » : envoie la requête ; en cas d'échec, annule la modification locale. */
function remote<T>(call: () => Promise<T>, onSuccess: (result: T) => void, rollback: () => void) {
  if (IS_DEMO) return;
  call()
    .then(onSuccess)
    .catch((error: unknown) => {
      rollback();
      emit({ flash: { text: userMessage(error) } });
    });
}

/** Charge les tâches depuis l'API (mode « api ») ; ne fait rien en démo. */
export async function syncTasks(): Promise<void> {
  if (IS_DEMO) return;
  const items = await tasksApi.list();
  emit({ tasks: items.map(toTask) });
}

export function useTasks(): Task[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).tasks;
}

export function useTask(id: string | undefined): Task | undefined {
  const tasks = useTasks();
  // Sans identifiant (lien générique), on ouvre la tâche prioritaire du jour.
  return tasks.find((task) => task.id === (id ?? 'attestation'));
}

export function useFlash() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).flash;
}

export const taskActions = {
  complete(id: string) {
    const before = find(id);
    if (!before) return;
    // La démo vit au mardi 14 mai : on date l'achèvement en conséquence.
    update(id, { status: 'done', completedAt: DEMO_TODAY });
    remote(() => tasksApi.complete(id), (dto) => replace(id, dto), () => update(id, before));
  },
  reopen(id: string) {
    const before = find(id);
    if (!before) return;
    update(id, { status: 'open', completedAt: undefined });
    remote(() => tasksApi.reopen(id, before.version ?? 1), (dto) => replace(id, dto), () => update(id, before));
  },
  archive(id: string) {
    const before = find(id);
    if (!before) return;
    update(id, { status: 'archived' });
    remote(() => tasksApi.archive(id), (dto) => replace(id, dto), () => update(id, before));
  },
  restore(id: string) {
    const before = find(id);
    if (!before) return;
    update(id, { status: 'open' });
    remote(() => tasksApi.unarchive(id), (dto) => replace(id, dto), () => update(id, before));
  },
  postpone(id: string, days: number) {
    const before = find(id);
    if (!before) return;
    const dueAt = addDays(before.dueAt, days);
    update(id, { dueAt });
    remote(
      () => tasksApi.update(id, before.version ?? 1, { dueAt, hasTime: before.hasTime }),
      (dto) => replace(id, dto),
      () => update(id, before),
    );
  },
  setDue(id: string, dueAt: Date) {
    const before = find(id);
    if (!before) return;
    update(id, { dueAt });
    remote(
      () => tasksApi.update(id, before.version ?? 1, { dueAt, hasTime: before.hasTime }),
      (dto) => replace(id, dto),
      () => update(id, before),
    );
  },
  /** Ajoute une étape à la fin de la liste. */
  addSubtask(id: string, title: string) {
    const task = state.tasks.find((entry) => entry.id === id);
    const clean = title.trim();
    if (!task || !clean) return;
    update(id, { subtasks: [...task.subtasks, { id: `${id}-${Date.now().toString(36)}`, title: clean, done: false }] });
  },
  toggleSubtask(id: string, subtaskId: string) {
    const task = state.tasks.find((entry) => entry.id === id);
    if (!task) return;
    update(id, {
      subtasks: task.subtasks.map((sub) => (sub.id === subtaskId ? { ...sub, done: !sub.done } : sub)),
    });
  },
  /** Suppression logique : la tâche peut être rétablie tant que le message est affiché. */
  remove(id: string): () => void {
    const index = state.tasks.findIndex((entry) => entry.id === id);
    const task = state.tasks[index];
    emit({ tasks: state.tasks.filter((entry) => entry.id !== id) });
    const putBack = () => {
      if (!task || state.tasks.some((entry) => entry.id === id)) return;
      const copy = [...state.tasks];
      copy.splice(Math.max(index, 0), 0, task);
      emit({ tasks: copy });
    };
    remote(() => tasksApi.remove(id), () => undefined, putBack);
    return () => {
      putBack();
      // « Annuler » : la suppression est logique côté serveur, on la restaure (TASK-013).
      remote(() => tasksApi.restore(id), (dto) => replace(id, dto), () => emit({ tasks: state.tasks.filter((entry) => entry.id !== id) }));
    };
  },
  create(draft: TaskDraft): string {
    const id = `t-${Date.now().toString(36)}`;
    const { steps = [], assignee = 'Claire', ...fields } = draft;
    const task: Task = {
      ...fields,
      id,
      context: draft.household ? `Partagée • ${draft.household}` : 'Personnelle',
      status: 'open',
      assignee,
      createdAt: DEMO_TODAY,
      subtasks: steps
        .map((title) => title.trim())
        .filter(Boolean)
        .map((title, index) => ({ id: `${id}-${index + 1}`, title, done: false })),
    };
    emit({ tasks: [task, ...state.tasks] });
    remote(() => tasksApi.create(draft), (dto) => replace(id, dto), () => emit({ tasks: state.tasks.filter((entry) => entry.id !== id) }));
    return id;
  },
  save(id: string, draft: TaskDraft) {
    const before = find(id);
    if (!before) return;
    update(id, draft);
    remote(() => tasksApi.update(id, before.version ?? 1, draft), (dto) => replace(id, dto), () => update(id, before));
  },
  setFlash(flash: Snapshot['flash']) {
    emit({ flash });
  },
};
