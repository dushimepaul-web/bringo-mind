// API Actions assistées par l'IA (contrat 2.11.0) : demandes d'action (e-mail, calendrier…) à approuver.
import { api } from '@/lib/api';

export type ActionRequestDto = {
  id: string;
  task_id: string | null;
  action_type: string;
  parameters: Record<string, unknown>;
  preview: string | null;
  status: string;
  approved_at: string | null;
  executed_at: string | null;
  result: Record<string, unknown> | null;
  error: string | null;
  created_at: string;
  expires_at: string | null;
  conversation_id: string | null;
  executable: boolean;
};

export const actionRequestsApi = {
  list: (status?: string) => api.get<ActionRequestDto[]>('/action-requests', { query: { ...(status ? { status } : {}) } }),
  create: (actionType: string, parameters: Record<string, unknown>, instructions?: string) =>
    api.post<ActionRequestDto>('/action-requests', { action_type: actionType, parameters, instructions: instructions ?? null }),
  update: (id: string, patch: Record<string, unknown>) => api.patch<ActionRequestDto>(`/action-requests/${id}`, patch),
  approve: (id: string) => api.post<ActionRequestDto>(`/action-requests/${id}/approve`),
  confirmDone: (id: string) => api.post<ActionRequestDto>(`/action-requests/${id}/confirm-done`),
  reject: (id: string) => api.post<ActionRequestDto>(`/action-requests/${id}/reject`),
};
