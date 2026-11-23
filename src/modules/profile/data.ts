// Listes de choix du Profil et des Paramètres (aucune donnée de démonstration : le compte vient de l'API).
import { deviceTimeZone } from '@/lib/device-info';

export const LANGUAGES = [
  { key: 'fr', badge: 'FR', title: 'Français', subtitle: 'Langue de l’interface et des notifications' },
  { key: 'en', badge: 'EN', title: 'English', subtitle: 'Interface and notifications language' },
  { key: 'es', badge: 'ES', title: 'Español', subtitle: 'Idioma de la interfaz y notificaciones' },
];

const BASE_TIMEZONES = [
  'Africa/Bujumbura',
  'Africa/Kigali',
  'Africa/Kinshasa',
  'Africa/Lubumbashi',
  'Africa/Nairobi',
  'Africa/Dar_es_Salaam',
  'Africa/Kampala',
  'Africa/Abidjan',
  'Africa/Dakar',
  'Europe/Paris',
  'Europe/Brussels',
  'America/Montreal',
  'UTC',
];

/** Décalage actuel d'un fuseau (« UTC+2 »), calculé par le téléphone. */
function offsetOf(zone: string): string {
  try {
    const part = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'shortOffset' })
      .formatToParts(new Date())
      .find((entry) => entry.type === 'timeZoneName')?.value;
    return part ? part.replace('GMT', 'UTC') : zone;
  } catch {
    return zone;
  }
}

/** Fuseaux proposés : celui du téléphone, celui du compte, puis une liste courante. */
export function timezoneOptions(current: string): { key: string; title: string; subtitle: string }[] {
  const device = deviceTimeZone();
  const keys = [...new Set([device, current, ...BASE_TIMEZONES].filter(Boolean))];
  return keys.map((key) => ({
    key,
    title: key.replace(/_/g, ' '),
    subtitle: `${offsetOf(key)}${key === device ? ' • fuseau du téléphone' : ''}`,
  }));
}

export const DATE_FORMATS = [
  { key: 'dmy', label: 'JJ/MM/AAAA', sample: '14/05/2024' },
  { key: 'mdy', label: 'MM/JJ/AAAA', sample: '05/14/2024' },
  { key: 'ymd', label: 'AAAA-MM-JJ', sample: '2024-05-14' },
];

export const TIME_FORMATS = [
  { key: '24h', label: '14h30', sample: '14h30' },
  { key: '12h', label: '2:30 PM', sample: '2:30 PM' },
];

export const CURRENCIES = [
  { key: 'EUR', label: '€ Euro', sample: '148,50 €' },
  { key: 'USD', label: '$ Dollar', sample: '$148.50' },
  { key: 'XOF', label: 'FCFA', sample: '97 400 FCFA' },
  { key: 'RWF', label: 'FRw Franc rwandais', sample: '211 000 FRw' },
  { key: 'BIF', label: 'FBu Franc burundais', sample: '440 000 FBu' },
  { key: 'CDF', label: 'FC Franc congolais', sample: '420 000 FC' },
];

export const WEEK_STARTS = [
  { key: 'monday', label: 'Lundi' },
  { key: 'sunday', label: 'Dimanche' },
];

export const THEMES = [
  { key: 'light', label: 'Clair', icon: 'light_mode' },
  { key: 'dark', label: 'Sombre', icon: 'dark_mode' },
  { key: 'system', label: 'Système', icon: 'contrast' },
];

export const TEXT_SIZES = [
  { key: 'normal', label: 'Normal' },
  { key: 'large', label: 'Grand' },
  { key: 'xlarge', label: 'Très grand' },
];

export const CALENDAR_VIEWS = [
  { key: 'planning', label: 'Planning' },
  { key: 'day', label: 'Jour' },
  { key: 'week', label: 'Semaine' },
  { key: 'month', label: 'Mois' },
  { key: 'year', label: 'Année' },
];

/** Présentation des consentements connus du backend ; un consentement inconnu garde son code. */
export const CONSENT_META: Record<string, { icon: string; title: string; subtitle: string }> = {
  ai_processing: { icon: 'auto_awesome', title: 'Analyse par Kora', subtitle: 'Repérer dates et montants dans vos documents, proposer des priorités' },
  marketing: { icon: 'campaign', title: 'Communications produit', subtitle: 'Nouveautés et conseils d’utilisation' },
  analytics: { icon: 'insights', title: 'Statistiques anonymisées', subtitle: 'Aider à améliorer Bringo Mind' },
  terms: { icon: 'gavel', title: 'Conditions d’utilisation', subtitle: 'Obligatoire pour utiliser Bringo Mind' },
  privacy: { icon: 'policy', title: 'Politique de confidentialité', subtitle: 'Obligatoire pour utiliser Bringo Mind' },
};
