// API Abonnement / Facturation (contrat 2.11.0) : GET /subscriptions/*, plans, factures, usage, portail.
import { api } from '@/lib/api';

export type SubscriptionDto = {
  id: string;
  plan_code: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

export type PlanDto = {
  code: string;
  name: string;
  price_cents: number;
  currency: string;
  billing_interval: string;
  ai_documents_per_month: number;
  max_household_members: number;
  features: Record<string, unknown>;
};

export type InvoiceDto = {
  id: string;
  number: string | null;
  status: string;
  amount_cents: number;
  currency: string;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
};

export const subscriptionsApi = {
  me: () => api.get<SubscriptionDto | null>('/subscriptions/me'),
  plans: () => api.get<PlanDto[]>('/subscriptions/plans'),
  usage: () => api.get<unknown>('/subscriptions/me/usage'),
  invoices: () => api.get<InvoiceDto[]>('/subscriptions/me/invoices'),
  change: (planCode: string) => api.post<unknown>('/subscriptions/me/change', { plan_code: planCode }),
  cancel: () => api.post('/subscriptions/me/cancel'),
  resume: () => api.post('/subscriptions/me/resume'),
  checkout: (planCode: string) => api.post<unknown>('/subscriptions/checkout', { plan_code: planCode }),
  portal: () => api.post<unknown>('/subscriptions/portal'),
};
