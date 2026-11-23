/**
 * Contrats du module Tâches (écrans), alignés sur l'API Tâches (contrat 2.11.0) :
 * priorité 1 = basse, 2 = normale, 3 = haute, 4 = urgente (défaut 2) ;
 * l'API l'échange sous forme de nom (`low`, `normal`, `high`, `critical`).
 */
export type TaskPriority = 1 | 2 | 3 | 4;

export type TaskStatus = 'open' | 'done' | 'archived';

/** Code de catégorie renvoyé par GET /categories (`bills`, `health`… ou nom d'une catégorie personnelle). */
export type TaskCategory = string;

/** Catégorie proposée à l'écran (liste chargée depuis l'API). */
export type CategoryOption = { code: TaskCategory; label: string; icon: string; custom: boolean };

/** Regroupement de la liste, calculé à partir de l'échéance. */
export type TaskGroup = 'late' | 'today' | 'upcoming' | 'done' | 'archived';

/** Membre du foyer actif (GET /households/{id}/members). */
export type HouseholdMember = { id: string; name: string; you: boolean };

/** Foyer actif de l'utilisateur (le premier de GET /households). */
export type ActiveHousehold = { id: string; name: string; members: HouseholdMember[] };

export type Task = {
  id: string;
  title: string;
  /** Ligne secondaire courte (catégorie, foyer…). */
  context: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  /** Statut « en cours » côté serveur (`in_progress`). */
  inProgress: boolean;
  /** Échéance (heure locale de l'utilisateur). */
  dueAt: Date;
  /** false : seule la date compte (pas d'heure affichée). */
  hasTime: boolean;
  /** false : la tâche n'a pas d'échéance (dueAt vaut alors la date de création). */
  hasDue: boolean;
  /** null : sans catégorie. */
  category: TaskCategory | null;
  /** null : tâche personnelle. Sinon identifiant du foyer. */
  householdId: string | null;
  /** Nom du foyer (null : tâche personnelle). */
  household: string | null;
  /** Personne qui s'en charge (null : personne). */
  assigneeId: string | null;
  /** Nom affiché de la personne (vide si personne). */
  assignee: string;
  /** La tâche est confiée à l'utilisateur connecté. */
  assignedToMe: boolean;
  /** Réponse à l'attribution (tâche confiée par un autre membre). */
  assignmentStatus: 'pending' | 'accepted' | 'rejected' | null;
  /** Rappels : date et heure exactes de chaque notification. Vide : aucun rappel. */
  reminderAt: Date[];
  createdAt: Date;
  completedAt?: Date;
  /** Proposée par Kora (repérée dans un e-mail, un document…) : à vérifier avant de la garder. */
  suggested: boolean;
  /** Version de la ligne côté serveur (verrouillage optimiste). */
  version: number;
};

export type TaskDraft = {
  title: string;
  description: string;
  priority: TaskPriority;
  dueAt: Date;
  hasTime: boolean;
  category: TaskCategory | null;
  /** null : tâche personnelle ; sinon identifiant du foyer. */
  householdId: string | null;
  /** Personne qui s'en charge (seulement pour une tâche du foyer). */
  assigneeId: string | null;
  reminderAt: Date[];
};
