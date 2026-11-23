// API Reporting / Analyses (contrat 2.11.0) : rapports métier, exports, vues enregistrées, planifications.
import { api } from '@/lib/api';

export type ReportArea = 'summary' | 'tasks' | 'planning' | 'reminders' | 'inbox-ocr' | 'household' | 'subscriptions' | 'vault' | 'ai-actions';

export const reportsApi = {
  /** Rapport principal (kpis, graphiques, ventilations). */
  report: (area: ReportArea, query?: Record<string, string | number | boolean | null | undefined>) =>
    api.get<Record<string, unknown>>(`/reports/${area}`, { query }),

  /** Détail (lignes) d'un rapport. */
  details: (area: ReportArea, query?: Record<string, string | number | boolean | null | undefined>) =>
    api.get<Record<string, unknown>>(`/reports/${area}/details`, { query }),

  exports: () => api.get<unknown[]>('/reports/exports'),
  createExport: (body: Record<string, unknown>) => api.post<unknown>('/reports/exports', body),
  exportStatus: (id: string) => api.get<unknown>(`/reports/exports/${id}`),

  savedViews: () => api.get<unknown[]>('/reports/saved-views'),
  createSavedView: (body: Record<string, unknown>) => api.post<unknown>('/reports/saved-views', body),
  updateSavedView: (id: string, body: Record<string, unknown>) => api.patch(`/reports/saved-views/${id}`, body),
  deleteSavedView: (id: string) => api.delete(`/reports/saved-views/${id}`),

  schedules: () => api.get<unknown[]>('/reports/schedules'),
  createSchedule: (body: Record<string, unknown>) => api.post<unknown>('/reports/schedules', body),
  updateSchedule: (id: string, body: Record<string, unknown>) => api.patch(`/reports/schedules/${id}`, body),
  deleteSchedule: (id: string) => api.delete(`/reports/schedules/${id}`),
};
