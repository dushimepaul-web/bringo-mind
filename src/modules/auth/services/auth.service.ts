// Service d'authentification : endpoints AUTH-001 à AUTH-008 du guide d'API v1.0.
// Passe par le client unique (enveloppe, erreurs, X-Request-Id, Idempotency-Key).
import { api } from '@/lib/api';
import type { TokenResponse } from '@/lib/session';

import type { LoginPayload, RegisterPayload, ResetPasswordPayload } from '../types';

const ENDPOINTS = {
  register: '/auth/register', // AUTH-001
  verifyEmail: '/auth/verify-email', // AUTH-002
  resendVerification: '/auth/resend-verification', // AUTH-003
  login: '/auth/login', // AUTH-004
  logout: '/auth/logout', // AUTH-006
  passwordReset: '/auth/password-reset', // AUTH-007
  passwordResetConfirm: '/auth/password-reset/confirm', // AUTH-008
} as const;

/** Version des conditions acceptées à l'inscription (à confirmer avec l'équipe produit). */
const TERMS_VERSION = '2026-11-01';

export function register(payload: RegisterPayload & { locale?: string; timeZone?: string }) {
  return api.post<{ user_id: string; email_verification_required?: boolean }>(
    ENDPOINTS.register,
    {
      email: payload.email,
      password: payload.password,
      locale: payload.locale ?? 'fr',
      time_zone: payload.timeZone ?? 'Europe/Paris',
      terms_accepted: true,
      consents: [{ purpose_code: 'terms', policy_version: TERMS_VERSION, granted: true, source: 'mobile' }],
    },
    { auth: false },
  );
}

/** Renvoie les jetons : à passer à `signIn` de la session. */
export function verifyEmail(token: string) {
  return api.post<TokenResponse | undefined>(ENDPOINTS.verifyEmail, { token }, { auth: false });
}

export function resendVerificationEmail(email: string) {
  return api.post<void>(ENDPOINTS.resendVerification, { email }, { auth: false });
}

/** Renvoie les jetons (accès 15 min, rafraîchissement 30 j) et l'utilisateur. */
export function login(payload: LoginPayload) {
  return api.post<TokenResponse>(ENDPOINTS.login, payload, { auth: false });
}

export function logout(refreshToken: string) {
  return api.post<void>(ENDPOINTS.logout, { refresh_token: refreshToken });
}

/** Répond toujours de la même façon, que l'adresse existe ou non. */
export function requestPasswordReset(email: string) {
  return api.post<void>(ENDPOINTS.passwordReset, { email }, { auth: false });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return api.post<void>(
    ENDPOINTS.passwordResetConfirm,
    { token: payload.token, new_password: payload.password },
    { auth: false },
  );
}
