// Mémoire du Profil et des Paramètres, alimentée par l'API (contrat 2.11.0) :
// compte (GET/PATCH /accounts/me), sessions, double authentification, réglages (GET/PATCH /settings),
// consentements et demandes RGPD (/privacy). L'apparence, la vue du calendrier, les vibrations
// et le verrouillage restent des réglages de l'appareil.
import { useSyncExternalStore } from 'react';

import { userMessage } from '@/lib/api';
import { appLock } from '@/lib/app-lock';
import { sessionStore, type SessionUser } from '@/lib/session';
import { getThemeMode, setThemeMode, subscribeTheme, type ThemeMode } from '@/lib/theme';

import { CONSENT_META } from './data';
import {
  privacyApi,
  profileApi,
  settingsApi,
  type ConsentDto,
  type MfaSetupDto,
  type PrivacyRequestDto,
  type SessionDto,
  type SettingsDto,
} from './services/profile.service';

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
  email: string;
  emailVerified: boolean;
  memberSince: Date | null;
};

export type LockDelay = 'now' | '1min' | '5min';

export type DeviceSession = { id: string; device: string; detail: string; icon: string; current: boolean };

export type Consent = { purpose: string; granted: boolean; required: boolean; icon: string; title: string; subtitle: string };

type Snapshot = {
  loaded: boolean;
  preferences: Preferences;
  settingsVersion: number | null;
  user: PersonalInfo;
  biometric: boolean;
  confirmSensitive: boolean;
  fallbackCode: boolean;
  lockDelay: LockDelay;
  twoFactor: boolean;
  sessions: DeviceSession[];
  consents: Consent[];
  deletionAt: Date | null;
  /** Dernière demande d'export (statut affiché sur l'écran Confidentialité). */
  lastExport: PrivacyRequestDto | null;
  flash: { text: string; undo?: () => void } | null;
};

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') };
}

function userFrom(me: SessionUser | null): PersonalInfo {
  return {
    ...splitName(me?.full_name ?? ''),
    email: me?.email ?? '',
    emailVerified: Boolean(me?.email_verified_at),
    memberSince: me?.created_at ? new Date(me.created_at) : null,
  };
}

function initialState(): Snapshot {
  const me = sessionStore.getUser();
  return {
    loaded: false,
    preferences: {
      language: me?.locale ?? 'fr',
      timezone: me?.timezone ?? 'UTC',
      dateFormat: 'dmy',
      timeFormat: '24h',
      currency: me?.currency ?? 'EUR',
      weekStart: 'monday',
      theme: getThemeMode(),
      textSize: 'normal',
      calendarView: 'month',
      reduceMotion: false,
      haptics: true,
    },
    settingsVersion: null,
    user: userFrom(me),
    // Verrouillage biométrique : désactivé tant que la vraie reconnaissance n'est pas intégrée.
    biometric: false,
    confirmSensitive: true,
    fallbackCode: true,
    lockDelay: '1min',
    twoFactor: Boolean(me?.mfa_enabled),
    sessions: [],
    consents: [],
    deletionAt: null,
    lastExport: null,
    flash: null,
  };
}

let state: Snapshot = initialState();
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

// Connexion / déconnexion : on repart du compte de la session.
sessionStore.subscribe((session) => {
  if (!session) {
    state = initialState();
    for (const listener of listeners) listener();
  } else if (session.user && session.user.id && !state.loaded) {
    emit({ user: userFrom(session.user), twoFactor: Boolean(session.user.mfa_enabled) });
  }
});

// L'apparence peut aussi changer depuis le bouton soleil/lune de l'accueil : on la reflète ici.
subscribeTheme(() => {
  const theme = getThemeMode();
  if (state.preferences.theme !== theme) emit({ preferences: { ...state.preferences, theme } });
});

export function useProfileState(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Envoie la requête ; en cas d'échec, annule la modification locale et explique pourquoi. */
function remote<T>(call: () => Promise<T>, onSuccess?: (result: T) => void, rollback?: () => void) {
  call()
    .then((result) => onSuccess?.(result))
    .catch((error: unknown) => {
      rollback?.();
      emit({ flash: { text: userMessage(error) } });
    });
}

function preferencesFrom(settings: SettingsDto): Partial<Preferences> {
  const formats = settings.formats ?? {};
  const pick = (value: string | null | undefined, fallback: string) => (value && value !== 'auto' ? value : fallback);
  return {
    language: settings.locale,
    timezone: settings.timezone,
    currency: settings.currency,
    dateFormat: pick(formats.date_format, 'dmy'),
    timeFormat: pick(formats.time_format, '24h'),
    weekStart: formats.first_day_of_week === 'sunday' ? 'sunday' : 'monday',
    textSize: settings.accessibility?.text_size ?? 'normal',
    reduceMotion: settings.accessibility?.reduced_motion === 'reduce',
  };
}

function iconOf(session: SessionDto): string {
  const agent = `${session.device_name ?? ''} ${session.user_agent ?? ''}`.toLowerCase();
  if (/iphone|android|mobile|expo|okhttp|cfnetwork/.test(agent)) return 'phone_iphone';
  if (/ipad|tablet/.test(agent)) return 'tablet_mac';
  return 'laptop_mac';
}

function deviceLabel(session: SessionDto): string {
  if (session.device_name) return session.device_name;
  const agent = session.user_agent ?? '';
  const browser = /Edg\//.test(agent) ? 'Edge' : /Chrome\//.test(agent) ? 'Chrome' : /Firefox\//.test(agent) ? 'Firefox' : /Safari\//.test(agent) ? 'Safari' : '';
  const system = /iPhone/.test(agent) ? 'iPhone' : /Android/.test(agent) ? 'Android' : /Mac OS/.test(agent) ? 'Mac' : /Windows/.test(agent) ? 'Windows' : '';
  return [system, browser].filter(Boolean).join(' • ') || 'Appareil inconnu';
}

function whenLabel(iso: string | null): string {
  if (!iso) return 'Date inconnue';
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getDate()} ${MONTHS[date.getMonth()]} à ${pad(date.getHours())}h${pad(date.getMinutes())}`;
}

function toSession(dto: SessionDto): DeviceSession {
  return {
    id: dto.id,
    device: deviceLabel(dto),
    detail: dto.current
      ? 'Cet appareil • actif maintenant'
      : `${dto.ip_address ? `${dto.ip_address} • ` : ''}dernière activité le ${whenLabel(dto.last_used_at ?? dto.created_at)}`,
    icon: iconOf(dto),
    current: Boolean(dto.current),
  };
}

function toConsent(dto: ConsentDto): Consent {
  const meta = CONSENT_META[dto.purpose] ?? { icon: 'toggle_on', title: dto.purpose.replace(/_/g, ' '), subtitle: '' };
  return { purpose: dto.purpose, granted: dto.granted, required: Boolean(dto.required), ...meta };
}

/** Date de suppression prévue d'après les demandes RGPD en cours. */
function deletionFrom(requests: PrivacyRequestDto[]): Date | null {
  const pending = requests.find(
    (request) => request.request_type.includes('delet') && !['cancelled', 'canceled', 'completed', 'rejected'].includes(request.status),
  );
  return pending?.scheduled_for ? new Date(pending.scheduled_for) : null;
}

function latestExport(requests: PrivacyRequestDto[]): PrivacyRequestDto | null {
  return (
    requests
      .filter((request) => request.request_type.includes('export'))
      .sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null
  );
}

/** Charge compte, réglages, sessions, consentements et demandes RGPD. */
export async function syncProfile(): Promise<void> {
  const [me, settings, consents, sessions, requests] = await Promise.all([
    profileApi.me(),
    settingsApi.get(),
    privacyApi.consents().catch(() => null),
    profileApi.sessions().catch(() => null),
    privacyApi.requests().catch(() => null),
  ]);
  emit({
    loaded: true,
    user: userFrom(me),
    twoFactor: Boolean(me.mfa_enabled),
    preferences: { ...state.preferences, ...preferencesFrom(settings) },
    settingsVersion: settings.version,
    ...(consents ? { consents: consents.map(toConsent) } : {}),
    ...(sessions ? { sessions: sessions.map(toSession).sort((a, b) => Number(b.current) - Number(a.current)) } : {}),
    ...(requests ? { deletionAt: deletionFrom(requests), lastExport: latestExport(requests) } : {}),
  });
}

export const profileActions = {
  savePreferences(preferences: Preferences) {
    const before = state.preferences;
    emit({ preferences });
    setThemeMode(preferences.theme as ThemeMode);
    remote(
      () =>
        settingsApi.update({
          ...(state.settingsVersion !== null ? { version: state.settingsVersion } : {}),
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
      (settings) => emit({ preferences: { ...state.preferences, ...preferencesFrom(settings) }, settingsVersion: settings.version }),
      () => emit({ preferences: before }),
    );
  },
  /** Prénom et nom (enregistrés ensemble dans `full_name`). */
  saveName(firstName: string, lastName: string) {
    const before = state.user;
    emit({ user: { ...state.user, firstName, lastName } });
    remote(
      () => profileApi.updateMe({ full_name: `${firstName} ${lastName}`.trim() }),
      (me) => emit({ user: userFrom(me) }),
      () => emit({ user: before }),
    );
  },
  /** Demande de changement d'e-mail : un lien de confirmation part à la nouvelle adresse. */
  changeEmail: (newEmail: string, password: string) => profileApi.changeEmail(newEmail, password),
  changePassword: (current: string, next: string) => profileApi.changePassword(current, next),
  resendVerification: () => profileApi.resendVerification(),
  /** Double authentification : 1. clé à saisir dans l'application d'authentification… */
  startTwoFactor: (): Promise<MfaSetupDto> => profileApi.mfaSetup(),
  /** … 2. code à 6 chiffres ; renvoie les codes de secours. */
  async enableTwoFactor(code: string): Promise<string[]> {
    const result = await profileApi.mfaEnable(code);
    emit({ twoFactor: true });
    return result.recovery_codes ?? [];
  },
  async disableTwoFactor(password: string): Promise<void> {
    await profileApi.mfaDisable(password);
    emit({ twoFactor: false });
  },
  setBiometric(biometric: boolean) {
    emit({ biometric });
    appLock.configure({ enabled: biometric });
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
  /** Déconnecte un autre appareil (définitif côté serveur). */
  signOutSession(id: string) {
    const previous = state.sessions;
    emit({ sessions: state.sessions.filter((session) => session.id !== id) });
    remote(() => profileApi.revokeSession(id), undefined, () => emit({ sessions: previous }));
  },
  setConsent(purpose: string, granted: boolean) {
    const previous = state.consents;
    emit({ consents: state.consents.map((consent) => (consent.purpose === purpose ? { ...consent, granted } : consent)) });
    remote(
      () => privacyApi.setConsent(purpose, granted),
      (list) => {
        if (Array.isArray(list)) emit({ consents: list.map(toConsent) });
      },
      () => emit({ consents: previous }),
    );
  },
  /** Export de toutes les données (archive préparée par le serveur). */
  async requestExport(): Promise<PrivacyRequestDto> {
    const request = await privacyApi.requestExport();
    emit({ lastExport: request });
    return request;
  },
  /** Suppression du compte (mot de passe requis) ; renvoie la date prévue. */
  async requestDeletion(password: string): Promise<Date | null> {
    const request = await privacyApi.requestDeletion(password);
    const deletionAt = request.scheduled_for ? new Date(request.scheduled_for) : null;
    emit({ deletionAt });
    return deletionAt;
  },
  cancelDeletion() {
    const before = state.deletionAt;
    emit({ deletionAt: null });
    remote(() => privacyApi.cancelDeletion(), undefined, () => emit({ deletionAt: before }));
  },
  ownedHouseholds: () => privacyApi.ownedHouseholds(),
  setFlash(flash: Snapshot['flash']) {
    emit({ flash });
  },
};

export const LOCK_DELAYS: { key: LockDelay; label: string }[] = [
  { key: 'now', label: 'Immédiatement' },
  { key: '1min', label: 'Après 1 min' },
  { key: '5min', label: 'Après 5 min' },
];

export const initialsOf = (user: Pick<PersonalInfo, 'firstName' | 'lastName' | 'email'>) =>
  (`${user.firstName.trim()[0] ?? ''}${user.lastName.trim()[0] ?? ''}` || user.email.charAt(0) || '?').toUpperCase();
