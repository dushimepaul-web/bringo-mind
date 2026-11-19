// Données de démonstration des Intégrations, cohérentes avec Tâches, Documents et Calendrier.
import { DEMO_TODAY, addDays, atTime, dayOffset, formatDay, formatTime } from '@/lib/demo-dates';

import type { CalendarKey, ImportedEmail, SyncConflict } from './types';

const today = DEMO_TODAY;

export const GMAIL_ADDRESS = 'claire.martin@gmail.com';

export const PERMISSIONS = [
  { key: 'read', icon: 'mark_email_read', title: 'Lire les e-mails de mes organismes', subtitle: 'Seulement les expéditeurs autorisés ci-dessous' },
  { key: 'extract', icon: 'auto_awesome', title: 'Repérer dates et montants', subtitle: 'Kora propose, vous vérifiez' },
  { key: 'attachments', icon: 'attach_file', title: 'Enregistrer les pièces jointes', subtitle: 'Rangées dans Documents, en mode personnel' },
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number]['key'];

export const SENDERS = ['Foncia', 'Engie', 'MAIF', 'CAF', 'Cabinet Dr Lemoine', 'Pharmacie Bastille'];

export const CALENDARS: { key: CalendarKey; title: string; subtitle: string; color: string }[] = [
  { key: 'personal', title: 'Personnel', subtitle: '42 événements', color: '#16A34A' },
  { key: 'work', title: 'Travail', subtitle: '18 événements', color: '#2F7BE0' },
  { key: 'family', title: 'Famille', subtitle: 'Partagé avec Thomas • 9 événements', color: '#E08A00' },
];

export const DEMO_EMAILS: ImportedEmail[] = [
  {
    id: 'foncia',
    from: 'Foncia',
    address: 'contact@foncia.fr',
    subject: 'Votre attestation de domicile 2024',
    receivedAt: atTime(today, 8, 42),
    preview: 'Veuillez trouver ci-joint votre attestation de domicile pour l’année 2024…',
    body: [
      'Bonjour Madame Martin,',
      'Veuillez trouver ci-joint votre attestation de domicile pour l’année 2024. Merci de bien vouloir la signer et nous la retourner avant ce soir 17h00.',
      'Cordialement,\nService locataires — Foncia',
    ],
    attachment: { name: 'Attestation de domicile 2024', size: 'PDF • 248 Ko' },
    status: 'done',
    extracted: [
      { label: 'Type', value: 'Attestation de domicile', icon: 'description' },
      { label: 'Action attendue', value: 'Signer et renvoyer aujourd’hui avant 17h00', icon: 'task_alt' },
    ],
    links: [
      { kind: 'task', id: 'attestation', title: 'Renvoyer l’attestation de domicile signée' },
      { kind: 'document', id: 'attestation-domicile', title: 'Attestation de domicile' },
    ],
  },
  {
    id: 'engie',
    from: 'Engie',
    address: 'factures@engie.fr',
    subject: 'Votre facture d’électricité de mai est disponible',
    receivedAt: atTime(today, 7, 58),
    preview: 'Le montant de votre facture est de 118,50 €. Il sera prélevé le 27 mai…',
    body: [
      'Bonjour,',
      'Votre facture d’électricité de mai 2024 est disponible. Son montant est de 118,50 € TTC. Il sera prélevé automatiquement le 27 mai 2024.',
      'L’équipe Engie',
    ],
    attachment: { name: 'Facture d’électricité Engie — mai 2024', size: 'PDF • 1,2 Mo' },
    status: 'review',
    extracted: [
      { label: 'Montant', value: '118,50 €', icon: 'payments' },
      { label: 'Prélèvement', value: 'Lundi 27 mai', icon: 'event_repeat' },
    ],
    links: [{ kind: 'document', id: 'engie', title: 'Facture d’électricité Engie — mai 2024' }],
    suggestion: { title: 'Vérifier le prélèvement Engie (118,50 €)', due: atTime(addDays(today, 13), 12) },
  },
  {
    id: 'lemoine',
    from: 'Cabinet Dr Lemoine',
    address: 'rdv@cabinet-lemoine.fr',
    subject: 'Confirmation du rendez-vous de Léo',
    receivedAt: atTime(addDays(today, -1), 18, 5),
    preview: 'Nous vous confirmons le rendez-vous de Léo vendredi 17 mai à 10h00…',
    body: [
      'Bonjour,',
      'Nous vous confirmons le rendez-vous de Léo Martin le vendredi 17 mai à 10h00. Pensez à apporter son carnet de santé.',
      'Le secrétariat du Dr Lemoine',
    ],
    status: 'done',
    extracted: [
      { label: 'Événement', value: 'Vendredi 17 mai à 10h00', icon: 'event' },
      { label: 'À apporter', value: 'Carnet de santé de Léo', icon: 'backpack' },
    ],
    links: [{ kind: 'event', id: 'dentiste-leo', title: 'Dentiste de Léo' }],
  },
  {
    id: 'maif',
    from: 'MAIF',
    address: 'contrats@maif.fr',
    subject: 'Renouvellement de votre assurance habitation',
    receivedAt: atTime(addDays(today, -3), 10, 40),
    preview: 'Votre contrat sera renouvelé le 30 juin pour 312,00 € par an…',
    body: [
      'Madame, Monsieur,',
      'Votre contrat d’assurance habitation sera renouvelé le 30 juin 2024. La cotisation annuelle sera de 312,00 €.',
      'Votre conseiller MAIF',
    ],
    attachment: { name: 'Assurance habitation 2024 — MAIF', size: 'PDF • 860 Ko' },
    status: 'review',
    extracted: [
      { label: 'Cotisation', value: '312,00 € par an', icon: 'payments' },
      { label: 'Renouvellement', value: 'Dimanche 30 juin', icon: 'event_repeat' },
    ],
    links: [{ kind: 'document', id: 'assurance', title: 'Assurance habitation 2024 — MAIF' }],
    suggestion: { title: 'Renouvellement assurance habitation MAIF', due: atTime(addDays(today, 47), 12) },
  },
  {
    id: 'caf',
    from: 'CAF',
    address: 'ne-pas-repondre@caf.fr',
    subject: 'Un nouveau courrier est disponible',
    receivedAt: atTime(addDays(today, -5), 9, 15),
    preview: 'Un courrier vous attend dans votre espace allocataire…',
    body: ['Bonjour,', 'Un nouveau courrier est disponible dans votre espace allocataire. Merci d’y répondre rapidement.', 'Votre CAF'],
    status: 'done',
    extracted: [{ label: 'Action attendue', value: 'Répondre depuis l’espace allocataire', icon: 'task_alt' }],
    links: [{ kind: 'task', id: 'caf', title: 'Répondre au courrier de la CAF' }],
  },
  {
    id: 'pharmacie',
    from: 'Pharmacie Bastille',
    address: 'contact@pharmacie-bastille.fr',
    subject: 'Votre commande est prête',
    receivedAt: atTime(addDays(today, -1), 11, 20),
    preview: 'Votre commande est disponible au comptoir jusqu’au 18 mai…',
    body: ['Bonjour,', 'Votre commande est disponible au comptoir jusqu’au samedi 18 mai.', 'Pharmacie Bastille'],
    status: 'review',
    extracted: [{ label: 'À récupérer avant', value: 'Samedi 18 mai', icon: 'event_busy' }],
    links: [],
    suggestion: { title: 'Récupérer la commande à la pharmacie', due: atTime(addDays(today, 4), 12) },
  },
];

/** « 8h42 », « hier », « 11 mai ». */
export function receivedLabel(date: Date): string {
  const offset = dayOffset(date);
  if (offset === 0) return formatTime(date);
  if (offset === -1) return 'Hier';
  return formatDay(date);
}

export const LINK_META = {
  task: { icon: 'task_alt', label: 'Voir la tâche liée' },
  event: { icon: 'event', label: 'Voir l’événement' },
  document: { icon: 'description', label: 'Voir le document' },
} as const;

/** Conflits de la démo : modifiés dans Bringo Mind ET dans Google Agenda depuis la dernière synchronisation. */
export const DEMO_CONFLICTS: SyncConflict[] = [
  {
    id: 'c-dentiste',
    eventId: 'dentiste-leo',
    title: 'Dentiste de Léo',
    field: 'Horaire',
    local: { value: 'Vendredi 17 mai • 10h00 – 10h30', changedAt: 'Modifié dans Bringo Mind hier à 18h10' },
    provider: { value: 'Vendredi 17 mai • 10h30 – 11h00', changedAt: 'Modifié dans Google Agenda ce matin à 8h05' },
  },
  {
    id: 'c-parents',
    eventId: 'parents',
    title: 'Réunion parents d’élèves',
    field: 'Lieu',
    local: { value: 'École Jean Moulin', changedAt: 'Modifié dans Bringo Mind lundi à 20h30' },
    provider: { value: 'Salle polyvalente • École Jean Moulin', changedAt: 'Modifié par Thomas dans Google Agenda hier' },
  },
];
