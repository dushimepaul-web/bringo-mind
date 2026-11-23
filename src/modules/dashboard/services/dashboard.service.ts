// API Tableau de bord et briefings de planification (contrat 2.11.0).
import { api } from '@/lib/api';

export type DashboardDto = {
  date: string;
  timezone: string;
  preferences: Record<string, unknown>;
  sections: Record<string, { status: string; data: Record<string, unknown> }>;
};

export const dashboardApi = {
  /** Tableau de bord du jour. */
  get: () => api.get<DashboardDto>('/dashboard'),
  /** Briefing quotidien / hebdomadaire. */
  dailyBriefing: () => api.get<unknown>('/briefings/daily'),
  weeklyBriefing: () => api.get<unknown>('/briefings/weekly'),
};
