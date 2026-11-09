/**
 * Contrats du module Tâches, alignés sur le dossier directeur (§ 6.6) :
 * priorité 1 = basse, 2 = normale, 3 = haute, 4 = urgente (défaut 2).
 */
export type TaskPriority = 1 | 2 | 3 | 4;

export type TaskStatus = 'open' | 'done' | 'archived';

export type TaskCategory = 'Logement' | 'Santé' | 'Impôts' | 'Famille' | 'Véhicule' | 'Autre';

/** Regroupement de la liste, calculé à partir de l'échéance. */
export type TaskGroup = 'late' | 'today' | 'upcoming' | 'done' | 'archived';

export type Subtask = {
  id: string;
  title: string;
  done: boolean;
};

export type Task = {
  id: string;
  title: string;
  /** Ligne secondaire courte (organisme, format…). */
  context: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  /** Échéance (heure locale de l'utilisateur). */
  dueAt: Date;
  /** false : seule la date compte (pas d'heure affichée). */
  hasTime: boolean;
  category: TaskCategory;
  /** null : tâche personnelle. Sinon nom du foyer. */
  household: string | null;
  sharedWith: string[];
  assignee: string;
  reminder: boolean;
  createdAt: Date;
  completedAt?: Date;
  subtasks: Subtask[];
  document?: { name: string; meta: string };
};

export type TaskDraft = Pick<
  Task,
  | 'title'
  | 'description'
  | 'priority'
  | 'dueAt'
  | 'hasTime'
  | 'category'
  | 'household'
  | 'sharedWith'
  | 'reminder'
>;
