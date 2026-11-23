// Mémoire du Profil et des Paramètres.
// Mode « demo » : données de démonstration. Mode « api » : profil, réglages et consentements distants.
import { useSyncExternalStore } from 'react';

import { userMessage } from '@/lib/api';
import { appLock } from '@/lib/app-lock';
import { IS_DEMO } from '@/lib/config';
import { DEMO_TODAY, addDays } from '@/lib/demo-dates';
import { getThemeMode, setThemeMode, subscribeTheme, type ThemeMode } from '@/lib/theme';

import { DELETION_GRACE_DAYS, SESSIONS, type ConsentKey } from './data';
import { privacyApi, profileApi, settingsApi } from './services/profile.service';

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
    theme: getThemeMode(),
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

// L'apparence peut aussi changer depuis le bouton soleil/lune de l'accueil : on la reflète ici.
subscribeTheme(() => {
  const theme = getThemeMode();
  if (state.preferences.theme !== theme) emit({ preferences: { ...state.preferences, theme } });
});

export function useProfileState(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Mode « api » : envoie la requête ; en cas d'échec, annule la modification locale. */
function remote(call: () => Promise<unknown>, rollback?: () => void) {
  if (IS_DEMO) return;
  call().catch((error: unknown) => {
    rollback?.();
    emit({ flash: { text: userMessage(error) } });
  });
}

/** Charge profil, réglages et consentements depuis l'API (mode « api »). */
export async function syncProfile(): Promise<void> {
  if (IS_DEMO) return;
  try {
    const [me, settings, consents] = await Promise.all([
      profileApi.me(),
      settingsApi.get(),
      privacyApi.consents(),
    ]);
    const names = (me.full_name ?? '').trim().split(/\s+/);
    const dateFormat = settings.formats.date_format === 'auto' ? 'dmy' : settings.formats.date_format;
    const timeFormat = settings.formats.time_format === 'auto' ? '24h' : settings.formats.time_format;
    const weekStart = settings.formats.first_day_of_week === 'sunday' ? 'sunday' : 'monday';
    const aiConsent = consents.find((consent) => consent.purpose === 'ai_processing');
    emit({
      user: {
        firstName: names[0] ?? '',
        lastName: names.slice(1).join(' ') ?? '',
        phone: '',
        birthdate: new Date(1988, 2, 14),
        address: '',
        city: '',
        hasPhoto: false,
      },
      preferences: {
        ...state.preferences,
        language: settings.locale,
        timezone: settings.timezone,
        currency: settings.currency,
        dateFormat,
        timeFormat,
        weekStart,
        textSize: settings.accessibility.text_size ?? 'normal',
        reduceMotion: settings.accessibility.reduced_motion === 'reduce',
      },
      consents: {
        aiDocuments: aiConsent?.granted ?? false,
        suggestions: state.consents.suggestions,
        product: state.consents.product,
        anonymous: state.consents.anonymous,
      },
    });
  } catch (error) {
    emit({ flash: { text: userMessage(error) } });
  }
}

export const profileActions = {
  savePreferences(preferences: Preferences) {
    emit({ preferences });
    setThemeMode(preferences.theme as ThemeMode);
    remote(() =>
      settingsApi.update({
        locale: preferences.language,
        timezone: preferences.timezone,
        currency: preferences.currency,
        formats: {
          date_format: preferences.dateFormat,
          time_format: preferences.timeFormat,
          first_day_of_week: preferences.weekStart,
        },
        accessibility: { text_size: preferences.textSize, reduced_motion: preferences.reduceMotion ? 'reduce' : 'no-preference' },
      }),
    );
  },
  setBiometric(biometric: boolean) {
    emit({ biometric });
    appLock.configure({ enabled: biometric });
  },
  saveUser(user: PersonalInfo) {
    emit({ user });
    const fullName = `${user.firstName} ${user.lastName}`.trim();
    if (fullName.length >= 2) remote(() => profileApi.updateMe({ full_name: fullName }));
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
    remote(() => profileApi.revokeSession(id), () => emit({ sessions: previous }));
    return () => emit({ sessions: previous });
  },
  /** Change un consentement et renvoie de quoi l'annuler. */
  setConsent(key: ConsentKey, value: boolean): () => void {
    emit({ consents: { ...state.consents, [key]: value } });
    // Le backend ne connaît qu'un consentement à l'analyse par l'IA (`ai_processing`).
    if (key === 'aiDocuments') remote(() => privacyApi.setConsent('ai_processing', value));
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
