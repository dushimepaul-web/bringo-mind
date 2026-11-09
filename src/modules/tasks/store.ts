// Mémoire de démonstration partagée par les écrans du module Tâches.
// Elle remplace l'API tant que le backend n'est pas branché : les actions
// (terminer, reporter, archiver, supprimer, créer, modifier) sont visibles
// immédiatement dans la liste, le détail et le formulaire.
import { useSyncExternalStore } from 'react';

import { addDays, DEMO_TASKS, DEMO_TODAY } from './data';
import type { Task, TaskDraft } from './types';

type Snapshot = {
  tasks: Task[];
  /** Message à afficher à l'arrivée sur la liste (après création ou suppression). */
  flash: { text: string; undo?: () => void } | null;
};

let state: Snapshot = { tasks: DEMO_TASKS, flash: null };
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
    // La démo vit au mardi 14 mai : on date l'achèvement en conséquence.
    update(id, { status: 'done', completedAt: DEMO_TODAY });
  },
  reopen(id: string) {
    update(id, { status: 'open', completedAt: undefined });
  },
  archive(id: string) {
    update(id, { status: 'archived' });
  },
  restore(id: string) {
    update(id, { status: 'open' });
  },
  postpone(id: string, days: number) {
    const task = state.tasks.find((entry) => entry.id === id);
    if (task) update(id, { dueAt: addDays(task.dueAt, days) });
  },
  setDue(id: string, dueAt: Date) {
    update(id, { dueAt });
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
    return () => {
      if (!task || state.tasks.some((entry) => entry.id === id)) return;
      const copy = [...state.tasks];
      copy.splice(Math.max(index, 0), 0, task);
      emit({ tasks: copy });
    };
  },
  create(draft: TaskDraft): string {
    const id = `t-${Date.now().toString(36)}`;
    const task: Task = {
      ...draft,
      id,
      context: draft.household ? `Partagée • ${draft.household}` : 'Personnelle',
      status: 'open',
      assignee: 'Claire',
      createdAt: DEMO_TODAY,
      subtasks: [],
    };
    emit({ tasks: [task, ...state.tasks] });
    return id;
  },
  save(id: string, draft: TaskDraft) {
    update(id, draft);
  },
  setFlash(flash: Snapshot['flash']) {
    emit({ flash });
  },
};
