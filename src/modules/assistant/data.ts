// Conversation de démonstration de Kora, cohérente avec Tâches, Calendrier, Rappels et Documents.
// Kora propose ; rien n'est appliqué sans que la personne ouvre et valide le formulaire.
import type { Href } from 'expo-router';

import { DEMO_TODAY, addDays, atTime } from '@/lib/demo-dates';

const today = DEMO_TODAY;

export type ActionCard = {
  id: string;
  icon: string;
  tone: 'event' | 'task' | 'reminder' | 'document';
  label: string;
  title: string;
  detail: string;
  action: string;
  href: Href;
};

export type Message = {
  id: string;
  from: 'kora' | 'me';
  text: string;
  at: Date;
  cards?: ActionCard[];
};

export type Topic = 'payments' | 'passport' | 'tomorrow' | 'dentist' | 'unknown';

export const QUICK_QUESTIONS: { topic: Topic; label: string; icon: string }[] = [
  { topic: 'payments', label: 'Que dois-je payer ?', icon: 'payments' },
  { topic: 'tomorrow', label: 'Qu’est-ce que j’ai demain ?', icon: 'event' },
  { topic: 'passport', label: 'Quand expire mon passeport ?', icon: 'badge' },
  { topic: 'dentist', label: 'Le dentiste de Léo', icon: 'medical_services' },
];

const dentistCards: ActionCard[] = [
  {
    id: 'dentist-event',
    icon: 'event',
    tone: 'event',
    label: 'Déjà dans votre calendrier',
    title: 'Dentiste de Léo',
    detail: 'Vendredi 17 mai • 10h00 – 10h30 • Cabinet Dr Lemoine',
    action: 'Voir l’événement',
    href: { pathname: '/calendar/detail', params: { id: 'dentiste-leo' } },
  },
  {
    id: 'dentist-reminder',
    icon: 'notifications',
    tone: 'reminder',
    label: 'Proposition de rappel',
    title: 'Rappel : dentiste de Léo',
    detail: 'Jeudi 16 mai à 18h00, la veille • préparer le carnet de santé',
    action: 'Créer le rappel',
    href: {
      pathname: '/reminders/add',
      params: {
        linkKind: 'event',
        linkId: 'dentiste-leo',
        linkTitle: 'Dentiste de Léo — Dr Lemoine',
        at: atTime(addDays(today, 2), 18).toISOString(),
      },
    },
  },
  {
    id: 'dentist-task',
    icon: 'add_task',
    tone: 'task',
    label: 'Proposition de tâche partagée',
    title: 'Accompagner Léo chez le dentiste',
    detail: 'Pour Thomas • vendredi 17 mai',
    action: 'Créer la tâche',
    href: {
      pathname: '/tasks/add',
      params: {
        title: 'Accompagner Léo chez le dentiste',
        description: 'Pour Thomas : rendez-vous à 10h00 au cabinet du Dr Lemoine, apporter le carnet de santé.',
        due: atTime(addDays(today, 3), 10).toISOString(),
      },
    },
  },
];

/** Réponse de Kora selon le sujet reconnu. */
export function answer(topic: Topic): Pick<Message, 'text' | 'cards'> {
  switch (topic) {
    case 'payments':
      return {
        text: 'Deux paiements arrivent : la facture Engie sera prélevée le 27 mai, et l’assurance habitation MAIF se renouvelle le 30 juin.',
        cards: [
          {
            id: 'pay-engie',
            icon: 'receipt_long',
            tone: 'document',
            label: 'À vérifier',
            title: 'Facture Engie • 118,50 €',
            detail: 'Prélèvement le lundi 27 mai',
            action: 'Voir le document',
            href: { pathname: '/documents/detail', params: { id: 'engie' } },
          },
          {
            id: 'pay-maif',
            icon: 'verified_user',
            tone: 'document',
            label: 'Renouvellement',
            title: 'Assurance habitation MAIF • 312,00 €',
            detail: 'Dimanche 30 juin',
            action: 'Voir le document',
            href: { pathname: '/documents/detail', params: { id: 'assurance' } },
          },
        ],
      };
    case 'passport':
      return {
        text: 'Votre passeport est valable jusqu’en mars 2027. Je vous préviendrai six mois avant. En revanche, la carte d’identité de Léo a expiré le 2 avril.',
        cards: [
          {
            id: 'passport',
            icon: 'badge',
            tone: 'document',
            label: 'Identité',
            title: 'Passeport de Claire',
            detail: 'Valide jusqu’en mars 2027',
            action: 'Voir le document',
            href: { pathname: '/documents/detail', params: { id: 'passeport' } },
          },
          {
            id: 'cni-leo',
            icon: 'badge',
            tone: 'document',
            label: 'À renouveler',
            title: 'Carte d’identité de Léo',
            detail: 'Expirée le 2 avril 2024',
            action: 'Voir le document',
            href: { pathname: '/documents/detail', params: { id: 'cni-leo' } },
          },
        ],
      };
    case 'tomorrow':
      return {
        text: 'Demain, mercredi 15 mai : le contrôle technique de la Peugeot 208 est à faire avant 9h00, et vous avez votre séance de kinésithérapie à 18h30.',
        cards: [
          {
            id: 'ct',
            icon: 'task_alt',
            tone: 'task',
            label: 'Tâche',
            title: 'Contrôle technique Peugeot 208',
            detail: 'Mercredi 15 mai • 9h00',
            action: 'Voir la tâche',
            href: { pathname: '/tasks/detail', params: { id: 'controle-technique' } },
          },
          {
            id: 'kine',
            icon: 'event',
            tone: 'event',
            label: 'Événement',
            title: 'Séance de kinésithérapie',
            detail: 'Mercredi 15 mai • 18h30 – 19h15',
            action: 'Voir l’événement',
            href: { pathname: '/calendar/detail', params: { id: 'kine' } },
          },
        ],
      };
    case 'dentist':
      return {
        text: 'Léo a déjà rendez-vous chez le Dr Lemoine vendredi 17 mai à 10h00 : inutile d’en prendre un autre. Je peux vous proposer un rappel la veille, ou demander à Thomas de l’accompagner.',
        cards: dentistCards,
      };
    default:
      return {
        text: 'Je peux vous aider pour vos tâches, rappels, événements et documents. Essayez une des questions ci-dessous.',
      };
  }
}

/** Reconnaissance très simple pour la démo. */
export function topicOf(text: string): Topic {
  const value = text.toLowerCase();
  if (/(payer|facture|paiement|prélèv)/.test(value)) return 'payments';
  if (/(passeport|identité|expire)/.test(value)) return 'passport';
  if (/(demain|prévu)/.test(value)) return 'tomorrow';
  if (/(dentiste|léo|leo)/.test(value)) return 'dentist';
  return 'unknown';
}

/** Début de conversation de la démo (avant 9h30). */
export function initialConversation(): Message[] {
  return [
    {
      id: 'm1',
      from: 'kora',
      text: 'Bonjour Claire. Aujourd’hui : l’attestation de domicile est à renvoyer avant 17h00 et Thomas récupère Léo à l’école à 16h45. Une facture Engie (118,50 €) attend votre vérification.',
      at: atTime(today, 9, 27),
      cards: [
        {
          id: 'm1-task',
          icon: 'task_alt',
          tone: 'task',
          label: 'Priorité du jour',
          title: 'Renvoyer l’attestation de domicile signée',
          detail: 'Aujourd’hui avant 17h00',
          action: 'Voir la tâche',
          href: { pathname: '/tasks/detail', params: { id: 'attestation' } },
        },
      ],
    },
    {
      id: 'm2',
      from: 'me',
      text: 'Peux-tu prendre un rendez-vous chez le dentiste pour Léo, et prévenir Thomas pour qu’il l’accompagne ?',
      at: atTime(today, 9, 29),
    },
    { id: 'm3', from: 'kora', at: atTime(today, 9, 29), ...answer('dentist') },
  ];
}
