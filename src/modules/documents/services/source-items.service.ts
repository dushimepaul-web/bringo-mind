// API Boîte de réception universelle (contrat 2.11.0) : éléments sources (textes, documents, e-mails),
// conversions et réglages de la boîte de réception.
import { api, getAll } from '@/lib/api';

export type SourceItemDto = {
  id: string;
  source_type: string;
  origin: string;
  title: string | null;
  body_text: string | null;
  status: string;
  received_at: string;
  processing_error: string | null;
};

export const sourceItemsApi = {
  list: (query?: { status?: string; source_type?: string }) => getAll<SourceItemDto>('/source-items', query),
  create: (text: string, title?: string) => api.post<SourceItemDto>('/source-items', { text, title: title ?? null }),
  get: (id: string) => api.get<SourceItemDto>(`/source-items/${id}`),
  remove: (id: string) => api.delete(`/source-items/${id}`),
  convert: (id: string) => api.post<SourceItemDto>(`/source-items/${id}/convert`),
  discard: (id: string) => api.post<SourceItemDto>(`/source-items/${id}/discard`),

  inboxSettings: () => api.get<Record<string, unknown>>('/inbox/settings'),
  saveInboxSettings: (body: Record<string, unknown>) => api.put('/inbox/settings', body),
  inboundEmail: (body: Record<string, unknown>) => api.post('/inbound/email', body),
  inboundEmailEvent: (body: Record<string, unknown>) => api.post('/inbound/email-events', body),
};
