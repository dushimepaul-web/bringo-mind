// Types partagés et questions rapides de l'assistant Kora.
// Les messages et réponses viennent de l'API Assistant (voir services/assistant.service.ts).
import type { Href } from 'expo-router';

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

export const QUICK_QUESTIONS: { label: string; icon: string }[] = [
  { label: 'Que dois-je payer ?', icon: 'payments' },
  { label: 'Qu’est-ce que j’ai demain ?', icon: 'event' },
  { label: 'Quand expire mon passeport ?', icon: 'badge' },
  { label: 'Le dentiste de Léo', icon: 'medical_services' },
];
