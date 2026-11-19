// Documents de démonstration, cohérents avec le Foyer, les Tâches, le Calendrier et le Tableau de bord.
import { DEMO_TODAY, addDays, atTime, dayOffset, formatDay, formatTime } from '@/lib/demo-dates';

import type { DocCategory, DocItem } from './types';

const today = DEMO_TODAY;

type CategoryStyle = { label: string; icon: string; bg: string; fg: string };

/** Catégories (couleurs de l'app, mode clair). */
export const CATEGORIES: Record<DocCategory, CategoryStyle> = {
  identity: { label: 'Identité', icon: 'badge', bg: '#E4E3FB', fg: '#4338CA' },
  housing: { label: 'Logement', icon: 'home', bg: '#DDE9FB', fg: '#1D5ED0' },
  health: { label: 'Santé', icon: 'medical_services', bg: '#D3F5EE', fg: '#0B7A6E' },
  taxes: { label: 'Impôts', icon: 'account_balance', bg: '#FCEFC4', fg: '#8A6100' },
  bills: { label: 'Factures', icon: 'receipt_long', bg: '#FBDDE8', fg: '#B0306A' },
};

/** Mêmes catégories en mode sombre. */
export const CATEGORIES_DARK: Record<DocCategory, CategoryStyle> = {
  identity: { ...CATEGORIES.identity, bg: '#262A55', fg: '#A5B4FC' },
  housing: { ...CATEGORIES.housing, bg: '#1B3058', fg: '#8DBBFF' },
  health: { ...CATEGORIES.health, bg: '#0F3B3B', fg: '#5EEAD4' },
  taxes: { ...CATEGORIES.taxes, bg: '#3D3216', fg: '#F5C84B' },
  bills: { ...CATEGORIES.bills, bg: '#4A2233', fg: '#F9A8D4' },
};

/** Stockage du coffre (démo). */
export const STORAGE = { used: 86, total: 10240, unit: 'Mo' } as const;

export const HOUSEHOLD_NAME = 'Foyer Martin';

export const DEMO_DOCUMENTS: DocItem[] = [
  {
    id: 'engie',
    title: 'Facture d’électricité Engie — mai 2024',
    fileType: 'PDF',
    size: '1,2 Mo',
    category: 'bills',
    scope: 'household',
    addedAt: atTime(today, 8, 47),
    addedBy: 'Kora',
    due: { date: atTime(addDays(today, 13), 12), label: 'Prélèvement', amount: '118,50 €' },
    review: true,
    confidence: 98.4,
    extracted: [
      { key: 'issuer', label: 'Émetteur', value: 'ENGIE Énergie France', icon: 'corporate_fare' },
      { key: 'amount', label: 'Montant TTC', value: '118,50 €', icon: 'payments' },
      { key: 'due', label: 'Échéance', value: '27 mai 2024', icon: 'event_repeat' },
      { key: 'date', label: 'Date du document', value: '12 mai 2024', icon: 'calendar_today' },
    ],
  },
  {
    id: 'attestation-domicile',
    title: 'Attestation de domicile',
    fileType: 'PDF',
    size: '320 Ko',
    category: 'housing',
    scope: 'household',
    addedAt: atTime(today, 9, 12),
    addedBy: 'Kora',
    status: 'Signée électroniquement',
    linked: { kind: 'task', id: 'attestation', title: 'Renvoyer l’attestation de domicile signée' },
  },
  {
    id: 'assurance',
    title: 'Assurance habitation 2024 — MAIF',
    fileType: 'PDF',
    size: '860 Ko',
    category: 'housing',
    scope: 'household',
    addedAt: atTime(addDays(today, -3), 11, 5),
    addedBy: 'Thomas',
    due: { date: atTime(addDays(today, 47), 12), label: 'Renouvellement', amount: '312,00 €' },
    extracted: [
      { key: 'issuer', label: 'Assureur', value: 'MAIF', icon: 'corporate_fare' },
      { key: 'amount', label: 'Cotisation annuelle', value: '312,00 €', icon: 'payments' },
      { key: 'due', label: 'Échéance', value: '30 juin 2024', icon: 'event_repeat' },
    ],
  },
  {
    id: 'cantine',
    title: 'Reçu cantine — 2e trimestre',
    fileType: 'PDF',
    size: '140 Ko',
    category: 'bills',
    scope: 'household',
    addedAt: atTime(addDays(today, -2), 10, 30),
    addedBy: 'Thomas',
    status: 'Payé 148,50 €',
    linked: { kind: 'task', id: 'cantine', title: 'Régler la cantine scolaire du 2e trimestre' },
  },
  {
    id: 'remboursement',
    title: 'Décompte mutuelle — soins dentaires',
    fileType: 'PDF',
    size: '210 Ko',
    category: 'health',
    scope: 'household',
    addedAt: atTime(addDays(today, -6), 18, 20),
    addedBy: 'Claire',
    status: 'Remboursement attendu : 64,00 €',
    linked: { kind: 'task', id: 'remboursement', title: 'Suivre le remboursement des soins dentaires' },
  },
  {
    id: 'ordonnance',
    title: 'Ordonnance de lunettes — Dr. Vasseur',
    fileType: 'Image',
    size: '1,8 Mo',
    category: 'health',
    scope: 'personal',
    addedAt: atTime(addDays(today, -20), 17, 40),
    addedBy: 'Claire',
    status: 'À apporter au contrôle du 16 mai',
    linked: { kind: 'event', id: 'ophtalmo', title: 'Contrôle ophtalmologique' },
  },
  {
    id: 'vitale',
    title: 'Attestation carte Vitale',
    fileType: 'PDF',
    size: '95 Ko',
    category: 'health',
    scope: 'personal',
    addedAt: atTime(addDays(today, -60), 9, 0),
    addedBy: 'Claire',
    status: 'Valide jusqu’en 2026',
  },
  {
    id: 'bail',
    title: 'Bail de l’appartement',
    fileType: 'PDF',
    size: '2,4 Mo',
    category: 'housing',
    scope: 'household',
    addedAt: new Date(2023, 4, 12, 15, 0),
    addedBy: 'Claire',
    status: 'Signé',
  },
  {
    id: 'livret',
    title: 'Livret de famille',
    fileType: 'Image',
    size: '3,1 Mo',
    category: 'identity',
    scope: 'household',
    addedAt: new Date(2023, 4, 12, 15, 20),
    addedBy: 'Claire',
    status: 'Scan • 3 pages',
  },
  {
    id: 'cni-leo',
    title: 'Carte d’identité de Léo',
    fileType: 'Image',
    size: '1,1 Mo',
    category: 'identity',
    scope: 'household',
    addedAt: atTime(addDays(today, -30), 19, 0),
    addedBy: 'Thomas',
    status: 'Expirée le 2 avril 2024 • renouvellement en cours',
  },
  {
    id: 'passeport',
    title: 'Passeport de Claire',
    fileType: 'Image',
    size: '1,4 Mo',
    category: 'identity',
    scope: 'personal',
    addedAt: new Date(2023, 8, 3, 10, 0),
    addedBy: 'Claire',
    status: 'Valide jusqu’en mars 2027',
  },
  {
    id: 'impots',
    title: 'Avis d’imposition 2023',
    fileType: 'PDF',
    size: '540 Ko',
    category: 'taxes',
    scope: 'personal',
    addedAt: new Date(2024, 3, 12, 20, 0),
    addedBy: 'Claire',
    status: 'Archivé',
    linked: { kind: 'task', id: 'declaration', title: 'Finaliser la déclaration de revenus 2023' },
  },
];

/** Document ajouté par le scan de démonstration. */
export function scannedDocument(): DocItem {
  return {
    id: `scan-${Date.now().toString(36)}`,
    title: 'Quittance de loyer — mai 2024',
    fileType: 'PDF',
    size: '180 Ko',
    category: 'housing',
    scope: 'personal',
    addedAt: new Date(DEMO_TODAY),
    addedBy: 'Claire',
    review: true,
    confidence: 96.1,
    extracted: [
      { key: 'issuer', label: 'Émetteur', value: 'Foncia Paris Bastille', icon: 'corporate_fare' },
      { key: 'amount', label: 'Montant', value: '1 240,00 €', icon: 'payments' },
      { key: 'date', label: 'Période', value: 'Mai 2024', icon: 'calendar_today' },
    ],
  };
}

/** « aujourd'hui à 8h47 », « hier à 18h20 », « le 12 avril 2024 ». */
export function addedLabel(date: Date): string {
  const offset = dayOffset(date);
  if (offset === 0) return `aujourd’hui à ${formatTime(date)}`;
  if (offset === -1) return `hier à ${formatTime(date)}`;
  if (offset > -7) return `il y a ${-offset} jours`;
  return `le ${formatDay(date)}`;
}

export function percent(value: number): string {
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %`;
}
