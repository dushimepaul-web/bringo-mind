// Données de démonstration du Profil et des Paramètres (cohérentes avec les autres modules).
import { DEMO_TODAY, addDays } from '@/lib/demo-dates';

export const USER = {
  firstName: 'Claire',
  name: 'Claire Martin',
  email: 'claire.martin@email.fr',
  phone: '+33 6 12 34 56 78',
  memberSince: 'mai 2023',
  plan: 'Premium',
  household: { name: 'Foyer Martin', role: 'Propriétaire', members: 3 },
};

/** Chiffres de la démo (mêmes volumes que les modules Tâches, Calendrier et Documents). */
export const STATS = [
  { key: 'tasks', label: 'Tâches', value: 9, href: '/tasks' as const },
  { key: 'events', label: 'Événements', value: 12, href: '/calendar' as const },
  { key: 'household', label: 'Membres', value: 3, href: '/household' as const },
];

export const LANGUAGES = [
  { key: 'fr', badge: 'FR', title: 'Français', subtitle: 'Langue de l’interface et des notifications' },
  { key: 'en', badge: 'EN', title: 'English', subtitle: 'Interface and notifications language' },
  { key: 'es', badge: 'ES', title: 'Español', subtitle: 'Idioma de la interfaz y notificaciones' },
];

export const TIMEZONES = [
  { key: 'Europe/Paris', title: 'Europe/Paris', subtitle: 'UTC+2 • Heure d’été' },
  { key: 'Europe/Brussels', title: 'Europe/Bruxelles', subtitle: 'UTC+2 • Heure d’été' },
  { key: 'Africa/Kigali', title: 'Afrique/Kigali', subtitle: 'UTC+2' },
  { key: 'Africa/Kinshasa', title: 'Afrique/Kinshasa', subtitle: 'UTC+1' },
  { key: 'America/Montreal', title: 'Amérique/Montréal', subtitle: 'UTC−4 • Heure d’été' },
];

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

export const CONSENTS = [
  { key: 'aiDocuments', icon: 'auto_awesome', title: 'Analyse des documents par Kora', subtitle: 'Repérer les dates et montants dans vos documents' },
  { key: 'suggestions', icon: 'tips_and_updates', title: 'Suggestions personnalisées', subtitle: 'Priorités et rappels proposés par Kora' },
  { key: 'product', icon: 'campaign', title: 'Communications produit', subtitle: 'Nouveautés et conseils d’utilisation' },
  { key: 'anonymous', icon: 'insights', title: 'Statistiques anonymisées', subtitle: 'Aider à améliorer Bringo Mind' },
] as const;

export type ConsentKey = (typeof CONSENTS)[number]['key'];

export const EXPORT_ITEMS = [
  { key: 'tasks', label: 'Tâches et sous-tâches', icon: 'task_alt' },
  { key: 'reminders', label: 'Rappels', icon: 'notifications' },
  { key: 'events', label: 'Événements du calendrier', icon: 'event' },
  { key: 'documents', label: 'Documents et fichiers', icon: 'folder' },
  { key: 'preferences', label: 'Préférences et réglages', icon: 'tune' },
];

export const SESSIONS = [
  { id: 'iphone', device: 'iPhone 15', place: 'Paris', when: 'Cet appareil • actif maintenant', icon: 'phone_iphone', current: true },
  { id: 'mac', device: 'MacBook Air • Chrome', place: 'Paris', when: 'Hier à 21h40', icon: 'laptop_mac', current: false },
];

export const LOGIN_HISTORY = [
  { id: 'l1', device: 'iPhone 15', detail: 'Paris • aujourd’hui à 07h52', icon: 'phone_iphone' },
  { id: 'l2', device: 'MacBook Air • Chrome', detail: 'Paris • hier à 21h40', icon: 'laptop_mac' },
  { id: 'l3', device: 'iPhone 15', detail: 'Lyon • samedi 11 mai à 18h05', icon: 'phone_iphone' },
];

/** Délai pendant lequel on peut annuler la suppression du compte. */
export const DELETION_GRACE_DAYS = 30;
export const deletionDate = () => addDays(DEMO_TODAY, DELETION_GRACE_DAYS);
