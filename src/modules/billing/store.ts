// Données de l'abonnement, alimentées par l'API Facturation (GET /subscriptions/*).
import { useSyncExternalStore } from 'react';

import { IS_DEMO } from '@/lib/config';

import { subscriptionsApi, type InvoiceDto, type PlanDto, type SubscriptionDto } from './services/subscriptions.service';

export type BillingPlan = { code: string; name: string; price: string; per: string; perks: string[] };
export type InvoiceRow = { id: string; month: string; date: string; amount: string };
export type UsageTile = { key: string; icon: string; tint: string; value: string; label: string; ratio?: number };

export type BillingState = {
  plans: BillingPlan[];
  current: string;
  cancelAtPeriodEnd: boolean;
  invoices: InvoiceRow[];
  usage: UsageTile[];
  loaded: boolean;
};

const EMPTY: BillingState = { plans: [], current: '', cancelAtPeriodEnd: false, invoices: [], usage: [], loaded: false };

let state: BillingState = EMPTY;
const listeners = new Set<() => void>();

function emit(next: Partial<BillingState>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', EUR: '€', XOF: 'FCFA', RWF: 'FRw' };

function money(cents: number, currency: string): string {
  const symbol = CURRENCY_SYMBOL[currency] ?? `${currency} `;
  const amount = (cents / 100).toFixed(2).replace('.', ',');
  return currency === 'EUR' || currency === 'XOF' || currency === 'RWF' ? `${amount} ${symbol}` : `${symbol}${amount}`;
}

const FEATURE_LABELS: Record<string, string> = {
  'tasks.recurring': 'Tâches récurrentes',
  'integrations.connected': 'Messagerie et calendrier connectés',
  'planning.advanced': 'Planification avancée',
  'household.permissions': 'Rôles et permissions du foyer',
  'household.shared': 'Foyer partagé',
  'reminders.basic': 'Rappels',
  'tasks.basic': 'Tâches et calendrier',
};

function planOf(dto: PlanDto): BillingPlan {
  const featureNames = Object.keys(dto.features ?? {}).map((key) => FEATURE_LABELS[key]).filter(Boolean);
  return {
    code: dto.code,
    name: dto.name,
    price: money(dto.price_cents, dto.currency),
    per: dto.billing_interval === 'month' ? '/ mois' : '/ an',
    perks: [`${dto.ai_documents_per_month} documents avec Kora / mois`, `Foyer jusqu’à ${dto.max_household_members} membres`, ...featureNames.slice(0, 2)],
  };
}

function invoiceOf(dto: InvoiceDto): InvoiceRow {
  const date = dto.created_at ? new Date(dto.created_at) : null;
  return {
    id: dto.id,
    month: date ? `${date.getMonth() + 1}/${date.getFullYear()}` : '',
    date: date ? date.toLocaleDateString('fr-FR') : '',
    amount: money(dto.amount_cents, dto.currency),
  };
}

export function useBilling(): BillingState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state,
  );
}

/** Charge abonnement, offres, utilisation et factures depuis l'API (mode « api »). */
export async function syncBilling(): Promise<void> {
  if (IS_DEMO) return;
  try {
    const [subscription, plans, invoices, usage] = await Promise.all([
      subscriptionsApi.me(),
      subscriptionsApi.plans(),
      subscriptionsApi.invoices(),
      subscriptionsApi.usage(),
    ]);
    const sub = (subscription ?? null) as SubscriptionDto | null;
    const usageRecord = (usage ?? {}) as Record<string, unknown>;
    const used = Number(usageRecord.ai_documents_used ?? 0);
    const limit = Number(usageRecord.ai_documents_limit ?? 0);
    emit({
      plans: plans.map(planOf),
      current: sub?.plan_code ?? 'free',
      cancelAtPeriodEnd: sub?.cancel_at_period_end ?? false,
      invoices: invoices.map(invoiceOf),
      usage: [
        {
          key: 'ai',
          icon: 'auto_awesome',
          tint: '#8B5CF6',
          value: String(used),
          label: 'documents analysés par Kora',
          ratio: limit ? used / limit : undefined,
        },
      ],
      loaded: true,
    });
  } catch {
    // Hors ligne : on garde l'état précédent.
  }
}

/** Change d'offre, résilie ou reprend l'abonnement. */
export const billingActions = {
  change: (planCode: string) => subscriptionsApi.change(planCode),
  cancel: () => subscriptionsApi.cancel(),
  resume: () => subscriptionsApi.resume(),
};
