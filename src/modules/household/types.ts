// Types du module Foyer (S7). Le foyer est optionnel : tout fonctionne aussi sans lui.
import type { Href } from 'expo-router';

export type HouseholdRole = 'owner' | 'admin' | 'member' | 'child';

export type Member = {
  id: string;
  name: string;
  email: string;
  role: HouseholdRole;
  color: string;
  /** Membre connecté (Claire dans la démo). */
  you?: boolean;
  detail?: string;
};

export type Invitation = {
  id: string;
  email: string;
  role: 'admin' | 'member';
  sentAt: Date;
  expiresAt: Date;
};

export type ActivityKind = 'task' | 'event' | 'document' | 'member';

export type Activity = {
  id: string;
  /** Identifiant du membre, ou « kora » pour l'assistant. */
  who: string;
  kind: ActivityKind;
  verb: string;
  target: string;
  at: Date;
  href?: Href;
};

export type SharedTask = {
  id: string;
  title: string;
  due: Date;
  hasTime: boolean;
  assignee: string;
  /** Membres concernés (filtre par personne). */
  people: string[];
  done: boolean;
};

export type SharedEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location: string;
  who: string;
  /** Membres concernés (filtre par personne). */
  people: string[];
};

export type SharedDoc = {
  id: string;
  title: string;
  meta: string;
  icon: string;
};
