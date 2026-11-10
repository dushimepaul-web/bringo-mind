/** Contrats du module Rappels (dossier directeur, phase S5). */

export type ReminderChannel = 'app' | 'push' | 'email';

export type ReminderRepeat = 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';

/** Objet auquel le rappel est rattaché (tâche ou rendez-vous), ou rappel personnel. */
export type ReminderLink =
  | { kind: 'personal' }
  | { kind: 'task'; id: string; title: string }
  | { kind: 'event'; id: string; title: string };

/** Résultat d'un envoi passé. */
export type DeliveryStatus = 'sent' | 'missed';

export type Reminder = {
  id: string;
  title: string;
  /** Prochaine occurrence (ou date d'envoi pour un rappel passé). */
  at: Date;
  repeat: ReminderRepeat;
  /** Jours de la semaine (0 = dimanche) pour la répétition personnalisée. */
  weekdays: number[];
  channels: ReminderChannel[];
  link: ReminderLink;
  /** Partagé avec le foyer (rappel collectif). */
  shared: boolean;
  note: string;
  paused: boolean;
  /** Renseigné pour les rappels passés. */
  delivery?: { status: DeliveryStatus; detail: string };
};

export type ReminderDraft = Pick<
  Reminder,
  'title' | 'at' | 'repeat' | 'weekdays' | 'channels' | 'link' | 'shared' | 'note'
>;
