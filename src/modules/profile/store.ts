// Mémoire de démonstration du Profil et des Paramètres.
import { useSyncExternalStore } from 'react';

import { appLock } from '@/lib/app-lock';
import { DEMO_TODAY, addDays } from '@/lib/demo-dates';

import { DELETION_GRACE_DAYS, SESSIONS, type ConsentKey } from './data';

export type Preferences = {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  weekStart: string;
  theme: string;
  textSize: string;
  calendarView: string;
  reduceMotion: boolean;
  haptics: boolean;
};

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: Date;
  address: string;
  city: string;
  hasPhoto: boolean;
};

export type LockDelay = 'now' | '1min' | '5min';

type Snapshot = {
  preferences: Preferences;
  user: PersonalInfo;
  biometric: boolean;
  /** Réglages liés à la biométrie. */
  confirmSensitive: boolean;
  fallbackCode: boolean;
  lockDelay: LockDelay;
  twoFactor: boolean;
  sessions: typeof SESSIONS;
  consents: Record<ConsentKey, boolean>;
  deletionAt: Date | null;
  flash: { text: string; undo?: () => void } | null;
};

let state: Snapshot = {
  preferences: {
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'dmy',
    timeFormat: '24h',
    currency: 'EUR',
    weekStart: 'monday',
    theme: 'light',
    textSize: 'normal',
    calendarView: 'month',
    reduceMotion: false,
    haptics: true,
  },
  user: {
    firstName: 'Claire',
    lastName: 'Martin',
    phone: '+33 6 12 34 56 78',
    birthdate: new Date(1988, 2, 14),
    address: '12 rue de la Roquette',
    city: '75011 Paris',
    hasPhoto: false,
  },
  biometric: true,
  confirmSensitive: true,
  fallbackCode: true,
  lockDelay: '1min',
  twoFactor: false,
  sessions: SESSIONS,
  consents: { aiDocuments: true, suggestions: true, product: false, anonymous: false },
  deletionAt: null,
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

export function useProfileState(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const profileActions = {
  savePreferences(preferences: Preferences) {
    emit({ preferences });
  },
  setBiometric(biometric: boolean) {
    emit({ biometric });
    appLock.configure({ enabled: biometric });
  },
  saveUser(user: PersonalInfo) {
    emit({ user });
  },
  setPhoto(hasPhoto: boolean) {
    emit({ user: { ...state.user, hasPhoto } });
  },
  setConfirmSensitive(confirmSensitive: boolean) {
    emit({ confirmSensitive });
  },
  setFallbackCode(fallbackCode: boolean) {
    emit({ fallbackCode });
  },
  setLockDelay(lockDelay: LockDelay) {
    emit({ lockDelay });
    appLock.configure({ delay: lockDelay });
  },
  setTwoFactor(twoFactor: boolean) {
    emit({ twoFactor });
  },
  signOutSession(id: string): () => void {
    const previous = state.sessions;
    emit({ sessions: state.sessions.filter((session) => session.id !== id) });
    return () => emit({ sessions: previous });
  },
  /** Change un consentement et renvoie de quoi l'annuler. */
  setConsent(key: ConsentKey, value: boolean): () => void {
    emit({ consents: { ...state.consents, [key]: value } });
    return () => emit({ consents: { ...state.consents, [key]: !value } });
  },
  requestDeletion() {
    emit({ deletionAt: addDays(DEMO_TODAY, DELETION_GRACE_DAYS) });
  },
  cancelDeletion() {
    emit({ deletionAt: null });
  },
  setFlash(flash: Snapshot['flash']) {
    emit({ flash });
  },
};

export const LOCK_DELAYS: { key: LockDelay; label: string }[] = [
  { key: 'now', label: 'Immédiatement' },
  { key: '1min', label: 'Après 1 min' },
  { key: '5min', label: 'Après 5 min' },
];

export const initialsOf = (user: PersonalInfo) =>
  `${user.firstName.trim()[0] ?? ''}${user.lastName.trim()[0] ?? ''}`.toUpperCase();
