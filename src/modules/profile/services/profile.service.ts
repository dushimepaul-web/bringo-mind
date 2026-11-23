// API Profil / Paramètres / Confidentialité (contrat 2.11.0) :
// docs/backend/modules/01_comptes_et_abonnements.md, 17_parametres.md, 19_donnees_personnelles.md.
// Seul le store de ce module appelle ce fichier.
import { api } from '@/lib/api';
import type { SessionUser } from '@/lib/session';

export type SessionDto = {
  id: string;
  device_name: string | null;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
  last_used_at: string | null;
  current?: boolean;
};

export type SettingsDto = {
  version: number;
  locale: string;
  timezone: string;
  currency: string;
  formats: { date_format?: string | null; time_format?: string | null; decimal_separator?: string | null; first_day_of_week?: string | null };
  effective_formats: Record<string, unknown>;
  assistant: Record<string, unknown>;
  accessibility: { text_size?: string | null; high_contrast?: boolean | null; reduced_motion?: string | null };
  choices: Record<string, unknown>;
};

export type ConsentDto = {
  purpose: string;
  required?: boolean;
  granted: boolean;
  current_version?: string;
  accepted_version?: string | null;
  up_to_date?: boolean;
};

/** Demande RGPD (`RequestOut`) : export ou suppression. */
export type PrivacyRequestDto = {
  id: string;
  request_type: string;
  status: string;
  created_at: string;
  scheduled_for: string | null;
  completed_at: string | null;
  expires_at: string | null;
};

export type MfaSetupDto = { secret: string; otpauth_uri: string };

export const profileApi = {
  me: () => api.get<SessionUser>('/accounts/me'),
  updateMe: (patch: { full_name?: string }) => api.patch<SessionUser>('/accounts/me', patch),

  sessions: () => api.get<SessionDto[] | null>('/accounts/me/sessions'),
  revokeSession: (id: string) => api.delete(`/accounts/me/sessions/${id}`),

  mfaSetup: () => api.post<MfaSetupDto>('/accounts/me/mfa/setup'),
  mfaEnable: (code: string) => api.post<{ user: SessionUser; recovery_codes: string[] }>('/accounts/me/mfa/enable', { code }),
  mfaDisable: (password: string) => api.post<SessionUser>('/accounts/me/mfa/disable', { password }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/accounts/me/password', { current_password: currentPassword, new_password: newPassword }),
  changeEmail: (newEmail: string, password: string) => api.post('/accounts/me/email', { new_email: newEmail, password }),
  resendVerification: () => api.post('/accounts/me/verification'),
};

export const settingsApi = {
  get: () => api.get<SettingsDto>('/settings'),
  update: (patch: {
    version?: number;
    locale?: string;
    timezone?: string;
    currency?: string;
    formats?: Record<string, unknown>;
    accessibility?: Record<string, unknown>;
  }) => api.patch<SettingsDto>('/settings', patch),
};

export const privacyApi = {
  consents: () => api.get<ConsentDto[] | null>('/privacy/consents'),
  setConsent: (purpose: string, granted: boolean) => api.put<ConsentDto[] | null>(`/privacy/consents/${purpose}`, { granted }),
  requests: () => api.get<PrivacyRequestDto[] | null>('/privacy/requests'),
  requestExport: () => api.post<PrivacyRequestDto>('/privacy/exports'),
  requestDeletion: (password: string, reason?: string) =>
    api.post<PrivacyRequestDto>('/privacy/deletion', { password, reason: reason ?? null, households: [] }),
  cancelDeletion: () => api.post<PrivacyRequestDto>('/privacy/deletion/cancel'),
  /** Foyers dont l'utilisateur est propriétaire (à transférer avant la suppression). */
  ownedHouseholds: () => api.get<{ household_id: string; name: string }[] | null>('/privacy/deletion/households'),
};
