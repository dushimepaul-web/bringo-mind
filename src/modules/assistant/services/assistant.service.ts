// API Assistant intelligent (contrat 2.11.0) : conversations, messages, pièces jointes, historique, usage.
import { api, getAll } from '@/lib/api';

export type ConversationDto = {
  id: string;
  title: string;
  last_message_at: string;
  archived_at: string | null;
  created_at: string;
};

export type MessageDto = {
  id: string;
  role: string;
  kind: string;
  content: string;
  created_at: string;
  choices: Record<string, unknown>[];
  actions: Record<string, unknown>[];
  attachments: Record<string, unknown>[];
  needs_verification: boolean;
};

export type ConversationDetail = ConversationDto & { messages: MessageDto[]; active_run: unknown | null };

export type PostedOut = { conversation_id: string; message_id: string; run_id: string | null };

export const assistantApi = {
  list: (status?: 'active' | 'archived') => getAll<ConversationDto>('/assistant/conversations', { ...(status ? { status } : {}) }),
  create: (content: string) => api.post<PostedOut>('/assistant/conversations', { content }),
  get: (id: string) => api.get<ConversationDetail>(`/assistant/conversations/${id}`),
  rename: (id: string, title: string) => api.patch<ConversationDto>(`/assistant/conversations/${id}`, { title }),
  send: (id: string, content: string) => api.post<PostedOut>(`/assistant/conversations/${id}/messages`, { content }),
  remove: (id: string) => api.delete(`/assistant/conversations/${id}`),
  archive: (id: string) => api.post(`/assistant/conversations/${id}/archive`),
  unarchive: (id: string) => api.post(`/assistant/conversations/${id}/unarchive`),
  deleteMessage: (conversationId: string, messageId: string) =>
    api.delete(`/assistant/conversations/${conversationId}/messages/${messageId}`),
  history: () => api.get<unknown[]>('/assistant/history'),
  usage: () => api.get<unknown>('/assistant/usage'),
};
