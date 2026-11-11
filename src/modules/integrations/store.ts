// Mémoire de démonstration du module Intégrations.
import { useSyncExternalStore } from 'react';

import { DEMO_TODAY } from '@/lib/demo-dates';

import { DEMO_CONFLICTS, DEMO_EMAILS, SENDERS, type PermissionKey } from './data';
import type { CalendarKey, ImportedEmail, SyncConflict } from './types';

type Snapshot = {
  gmail: boolean;
  calendar: boolean;
  outlook: boolean;
  lastSync: Date;
  permissions: Record<PermissionKey, boolean>;
  senders: string[];
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
  calendars: { personal: true, work: false, family: true },
  twoWay: false,
  emails: DEMO_EMAILS,
  conflicts: DEMO_CONFLICTS,
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
