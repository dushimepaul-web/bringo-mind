// API Coffre-fort documentaire (contrat 2.11.0) : enregistrements confidentiels liés à des documents.
import { api } from '@/lib/api';

export type VaultRecordDto = {
  id: string;
  document_id: string;
  title: string;
  category: string;
  notes: string | null;
  expires_on: string | null;
  version: number;
  previous_version_id: string | null;
  created_at: string;
};

export const vaultApi = {
  list: (query?: { category?: string; expiring_before?: string; search?: string }) =>
    api.get<VaultRecordDto[]>('/vault', { query }),
  create: (documentId: string, title: string, notes?: string, category?: string) =>
    api.post<VaultRecordDto>('/vault', { document_id: documentId, title, notes: notes ?? null, category: category ?? 'other' }),
  update: (id: string, patch: { title?: string; notes?: string; expires_on?: string | null; category?: string }) =>
    api.patch<VaultRecordDto>(`/vault/${id}`, patch),
  remove: (id: string) => api.delete(`/vault/${id}`),
  history: (id: string) => api.get<unknown[]>(`/vault/${id}/history`),
  download: (id: string) => api.get<unknown>(`/vault/${id}/download`),
  addVersion: (id: string, documentId: string, expiresOn?: string) =>
    api.post<unknown>(`/vault/${id}/versions`, { document_id: documentId, expires_on: expiresOn ?? null }),
};
