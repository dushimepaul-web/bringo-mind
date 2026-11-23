// API Profil / Paramètres / Confidentialité (contrat 2.11.0) :
// GET/PATCH /accounts/me, sessions, MFA, mot de passe, e-mail, suppression, export,
// GET/PATCH /settings, GET/PUT /privacy/consents, demandes de suppression/export.
import { api } from '@/lib/api';
import type { SessionUser } from '@/lib/session';

export type SessionDto = {
  id: string;
  device_name: string | null;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
  last_used_at: string | null;
  current: boolean;
};

export type SettingsDto = {
  version: number;
  locale: string;
  timezone: string;
  currency: string;
  formats: { date_format: string; time_format: string; decimal_separator: string; first_day_of_week: string };
  effective_formats: Record<string, unknown>;
  assistant: Record<string, unknown>;
  accessibility: { text_size?: string; high_contrast?: boolean; reduced_motion?: string };
  choices: Record<string, unknown>;
};

export type ConsentDto = {
  purpose: string;
  required: boolean;
  current_version: string;
  granted: boolean;
  accepted_version: string | null;
  up_to_date: boolean;
};

export const profileApi = {
  me: () => api.get<SessionUser>('/accounts/me'),
  updateMe: (patch: { full_name?: string; locale?: string; timezone?: string; currency?: string }) =>
    api.patch<SessionUser>('/accounts/me', patch),

  sessions: () => api.get<SessionDto[]>('/accounts/me/sessions'),
  revokeSession: (id: string) => api.delete(`/accounts/me/sessions/${id}`),
  revokeAllSessions: () => api.delete('/accounts/me/sessions'),

  mfa: () => api.get<unknown>('/accounts/me/mfa'),
  mfaSetup: () => api.post<unknown>('/accounts/me/mfa/setup'),
  mfaEnable: (code: string) => api.post<unknown>('/accounts/me/mfa/enable', { code }),
  mfaDisable: (password: string) => api.post('/accounts/me/mfa/disable', { password }),
  mfaRecoveryCodes: (code: string) => api.post<unknown>('/accounts/me/mfa/recovery-codes', { code }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/accounts/me/password', { current_password: currentPassword, new_password: newPassword }),
  changeEmail: (newEmail: string, password: string) => api.post('/accounts/me/email', { new_email: newEmail, password }),

  deleteAccount: (password: string, reason?: string) =>
    api.post('/accounts/me/delete', { password, reason: reason ?? null }),
  exportAccount: () => api.get<unknown>('/accounts/me/export'),
  requestVerification: () => api.post('/accounts/me/verification'),
};

export const settingsApi = {
  get: () => api.get<SettingsDto>('/settings'),
  update: (patch: { locale?: string; timezone?: string; currency?: string; formats?: Record<string, unknown>; accessibility?: Record<string, unknown> }) =>
    api.patch<SettingsDto>('/settings', patch),
};

export const privacyApi = {
  consents: () => api.get<ConsentDto[]>('/privacy/consents'),
  setConsent: (purpose: string, granted: boolean) => api.put(`/privacy/consents/${purpose}`, { granted }),
  requestDeletion: (password: string, reason?: string) => api.post('/privacy/deletion', { password, reason: reason ?? null }),
  cancelDeletion: () => api.post('/privacy/deletion/cancel'),
  requests: () => api.get<unknown[]>('/privacy/requests'),
  requestExport: () => api.post<unknown>('/privacy/exports'),
  deletionHouseholds: () => api.get<unknown[]>('/privacy/deletion/households'),
};
