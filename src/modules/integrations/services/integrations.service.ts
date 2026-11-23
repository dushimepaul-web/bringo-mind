// API Intégrations (contrat 2.11.0) : comptes e-mail (gmail/outlook) et calendriers externes.
import { api } from '@/lib/api';

export type MailAccountDto = {
  id: string;
  provider: 'gmail' | 'outlook';
  status: string;
  last_synced_at: string | null;
  account_email: string | null;
  can_send: boolean;
};

export type MailMessageDto = {
  id: string;
  account_id: string;
  sender: string | null;
  subject: string | null;
  received_at: string;
  snippet: string | null;
  summary: string | null;
  category_id: string | null;
  importance: string | null;
  proposals: Record<string, unknown>[];
  excluded: boolean;
  archived_at: string | null;
};

export type CalendarLinkDto = {
  id: string;
  provider: string;
  status: string;
  last_synced_at: string | null;
  last_error: string | null;
  account_email: string | null;
};

export const mailApi = {
  authorize: (provider: 'gmail' | 'outlook') => api.get<{ url: string }>(`/mail/${provider}/authorize`),
  accounts: () => api.get<MailAccountDto[]>('/mail/accounts'),
  removeAccount: (id: string) => api.delete(`/mail/accounts/${id}`),
  sync: (id: string) => api.post(`/mail/accounts/${id}/sync`),
  messages: (query?: { q?: string; archived?: boolean; page?: number; page_size?: number }) =>
    api.get<{ items: MailMessageDto[]; total: number }>('/mail/messages', { query }),
  message: (id: string) => api.get<MailMessageDto>(`/mail/messages/${id}`),
  archive: (id: string) => api.post(`/mail/messages/${id}/archive`),
  exclude: (id: string) => api.post(`/mail/messages/${id}/exclude`),
  removeMessage: (id: string) => api.delete(`/mail/messages/${id}`),
  sendDraft: (accountId: string, to: string, subject: string, body: string) =>
    api.post('/mail/drafts', { account_id: accountId, to, subject, body }),
  acceptProposal: (messageId: string, index: number, proposal: Record<string, unknown>) =>
    api.post(`/mail/messages/${messageId}/proposals/${index}/accept`, proposal),
  rejectProposal: (messageId: string, index: number) =>
    api.post(`/mail/messages/${messageId}/proposals/${index}/reject`),
};

export const calendarLinksApi = {
  authorize: (provider: string) => api.get<{ url: string }>(`/calendars/${provider}/authorize`),
  providers: () => api.get<unknown[]>('/calendars/providers'),
  list: () => api.get<CalendarLinkDto[]>('/calendars'),
  remove: (linkId: string) => api.delete(`/calendars/${linkId}`),
  sources: (linkId: string) => api.get<{ id: string; name: string; is_primary: boolean; selected: boolean }[]>(`/calendars/${linkId}/sources`),
  select: (linkId: string, calendarId: string, selected: boolean) =>
    api.put(`/calendars/${linkId}/sources/${calendarId}`, { selected }),
  sync: (linkId: string) => api.post(`/calendars/${linkId}/sync`),
};
