// Mémoire du module Intégrations.
import { useSyncExternalStore } from 'react';

import { IS_DEMO } from '@/lib/config';
import { DEMO_TODAY } from '@/lib/demo-dates';

import { DEMO_CONFLICTS, DEMO_EMAILS, SENDERS, type PermissionKey } from './data';
import { calendarLinksApi, mailApi } from './services/integrations.service';
import type { CalendarKey, ImportedEmail, SyncConflict } from './types';

type Snapshot = {
  gmail: boolean;
  calendar: boolean;
  outlook: boolean;
  lastSync: Date;
  permissions: Record<PermissionKey, boolean>;
  senders: string[];
  /** Tous les expéditeurs affichés en puces (autorisés ou non). */
  known: string[];
  calendars: Record<CalendarKey, boolean>;
  twoWay: boolean;
  emails: ImportedEmail[];
  /** Conflits ouverts du calendrier, jamais résolus sans le choix de la personne. */
  conflicts: SyncConflict[];
  flash: { text: string; undo?: () => void } | null;
};

let state: Snapshot = {
  gmail: true,
  calendar: true,
  outlook: false,
  lastSync: new Date(DEMO_TODAY.getTime() - 12 * 60000),
  permissions: { read: true, extract: true, attachments: true },
  senders: SENDERS,
  known: SENDERS,
  calendars: { personal: true, work: false, family: true },
  twoWay: false,
  emails: IS_DEMO ? DEMO_EMAILS : [],
  conflicts: IS_DEMO ? DEMO_CONFLICTS : [],
  flash: null,
};
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

const getSnapshot = () => state;

export function useIntegrationsState(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Charge les comptes connectés (e-mail et calendrier) depuis l'API (mode « api »). */
export async function syncIntegrations(): Promise<void> {
  if (IS_DEMO) return;
  try {
    const [accounts, links] = await Promise.all([mailApi.accounts(), calendarLinksApi.list()]);
    emit({
      gmail: accounts.some((account) => account.provider === 'gmail'),
      outlook: accounts.some((account) => account.provider === 'outlook'),
      calendar: links.length > 0,
      lastSync: new Date(),
    });
  } catch {
    // Fonction désactivée (403) ou hors ligne : rien n'est connecté.
    emit({ gmail: false, outlook: false, calendar: false });
  }
}

export const integrationActions = {
  sync() {
    emit({ lastSync: new Date(DEMO_TODAY) });
  },
  /** Connecte ou déconnecte un compte ; renvoie de quoi annuler. */
  setConnected(account: 'gmail' | 'calendar' | 'outlook', value: boolean): () => void {
    // CI-005 : déconnecter le calendrier retire ses événements importés, donc ses conflits n'ont plus d'objet.
    emit({ [account]: value, ...(account === 'calendar' && !value ? { conflicts: [] } : {}) });
    return () => emit({ [account]: !value });
  },
  setPermission(key: PermissionKey, value: boolean) {
    emit({ permissions: { ...state.permissions, [key]: value } });
  },
  setCalendar(key: CalendarKey, value: boolean) {
    emit({ calendars: { ...state.calendars, [key]: value } });
  },
  setTwoWay(twoWay: boolean) {
    emit({ twoWay });
  },
  markDone(id: string) {
    emit({ emails: state.emails.map((email) => (email.id === id ? { ...email, status: 'done' } : email)) });
  },
  /** Autorise ou non la lecture d'un expéditeur (puce touchée dans les réglages Gmail). */
  toggleSender(name: string) {
    emit({ senders: state.senders.includes(name) ? state.senders.filter((sender) => sender !== name) : [...state.senders, name] });
  },
  /** Ajoute un expéditeur autorisé (démo : en mémoire). */
  addSender(name: string) {
    const clean = name.trim();
    if (!clean) return;
    emit({ known: state.known.includes(clean) ? state.known : [...state.known, clean], senders: state.senders.includes(clean) ? state.senders : [...state.senders, clean] });
  },
  /** Arrête d'importer un expéditeur ; ses e-mails disparaissent de la liste. */
  blockSender(from: string): () => void {
    const previous = state;
    emit({
      senders: state.senders.filter((sender) => sender !== from),
      emails: state.emails.filter((email) => email.from !== from),
    });
    return () => emit({ senders: previous.senders, emails: previous.emails });
  },
  /** CI-010 : garder la version Bringo Mind (keep_local) ou celle du fournisseur (keep_provider). Définitif. */
  resolveConflict(id: string, resolution: 'keep_local' | 'keep_provider'): SyncConflict | undefined {
    const conflict = state.conflicts.find((entry) => entry.id === id);
    emit({ conflicts: state.conflicts.filter((entry) => entry.id !== id) });
    void resolution;
    return conflict;
  },
  setFlash(flash: Snapshot['flash']) {
    emit({ flash });
  },
};
