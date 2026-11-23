/**
 * Contrats du module Rappels, alignés sur l'API (contrat 2.11.0, docs/backend/modules/06_rappels_et_notifications.md).
 * Un rappel est toujours rattaché à une tâche ou à un événement ; son titre est celui de cet objet.
 */

/** Canaux : `app` = in_app, `push` = web_push (navigateurs et téléphones inscrits), `email`. */
export type ReminderChannel = 'app' | 'push' | 'email';

/** « Une fois », ou relance chaque jour (jusqu'à 3 fois) tant que ce n'est pas traité. */
export type ReminderRepeat = 'once' | 'daily';

/** Objet auquel le rappel est rattaché. */
export type ReminderLink = { kind: 'task' | 'event'; id: string; title: string };

/** Résultat d'un envoi passé. */
export type DeliveryStatus = 'sent' | 'missed';

export type Reminder = {
  id: string;
  /** Titre de la tâche ou de l'événement. */
  title: string;
  /** Instant d'envoi prévu (ou d'envoi effectif pour un rappel passé). */
  at: Date;
  repeat: ReminderRepeat;
  /** Relances restantes (rappel répété). */
  repeatsLeft: number;
  channels: ReminderChannel[];
  link: ReminderLink;
  /** Désactivé côté serveur (annulé) : peut être réactivé. */
  paused: boolean;
  /** Décalé par les heures de silence. */
  deferred: boolean;
  /** Renseigné pour les rappels passés. */
  delivery?: { status: DeliveryStatus; detail: string };
};

export type ReminderDraft = {
  at: Date;
  repeat: ReminderRepeat;
  channels: ReminderChannel[];
  /** null tant que l'utilisateur n'a pas choisi de tâche ou d'événement. */
  link: ReminderLink | null;
};

/** Heures de silence de l'utilisateur (GET /notifications/preferences). */
export type QuietHours = { start: [number, number]; end: [number, number] } | null;
