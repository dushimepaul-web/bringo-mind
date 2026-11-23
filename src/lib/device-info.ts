// Informations de l'appareil envoyées au backend : langue, fuseau horaire et nom de l'appareil.
import * as Device from 'expo-device';

/** Langues installées sur le backend (app/locales). Une autre langue donne le français. */
export const API_LOCALES = ['fr', 'en', 'es', 'pt', 'de', 'ar', 'sw', 'rn', 'rw'] as const;
export type ApiLocale = (typeof API_LOCALES)[number];

function resolved(): Intl.ResolvedDateTimeFormatOptions | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions();
  } catch {
    return null;
  }
}

/** Langue du téléphone si le backend la propose, sinon le français. */
export function deviceLocale(): ApiLocale {
  const language = (resolved()?.locale ?? 'fr').slice(0, 2).toLowerCase();
  return (API_LOCALES as readonly string[]).includes(language) ? (language as ApiLocale) : 'fr';
}

/** Fuseau IANA du téléphone (ex. Africa/Bujumbura). */
export function deviceTimeZone(): string {
  return resolved()?.timeZone ?? 'Africa/Bujumbura';
}

/** Nom affiché dans « Sessions et appareils » (120 caractères maximum côté backend). */
export function deviceName(): string {
  const name = Device.deviceName ?? Device.modelName ?? 'Application mobile';
  return `${name} · Bringo Mind`.slice(0, 120);
}
