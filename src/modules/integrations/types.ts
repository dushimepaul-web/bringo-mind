// Types du module Intégrations (S10) : comptes externes et e-mails importés.

export type LinkKind = 'task' | 'event' | 'document';

export type ImportedEmail = {
  id: string;
  from: string;
  address: string;
  subject: string;
  receivedAt: Date;
  preview: string;
  body: string[];
  attachment?: { name: string; size: string };
  /** review : Kora a repéré quelque chose à vérifier ; done : déjà traité. */
  status: 'review' | 'done';
  extracted: { label: string; value: string; icon: string }[];
  /** Éléments qui existent déjà dans l'app (pas de doublon). */
  links: { kind: LinkKind; id: string; title: string }[];
  /** Proposition de création quand rien n'existe encore. */
  suggestion?: { title: string; due?: Date };
};

export type CalendarKey = 'personal' | 'work' | 'family';
