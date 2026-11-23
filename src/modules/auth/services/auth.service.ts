// Service d'authentification : routes publiques /auth/* et première utilisation (/settings/onboarding).
// Contrat 2.11.0 (docs/backend/modules/01_comptes_et_abonnements.md et 17_parametres.md).
// Passe par le client unique : enveloppe, erreurs, Accept-Language, X-Request-Id, Idempotency-Key, cookie.
import { api } from '@/lib/api';
import { deviceLocale, deviceName, deviceTimeZone } from '@/lib/device-info';
import type { SessionUser, TokenResponse } from '@/lib/session';

import type { LoginPayload, OnboardingState, PublicConfig, RegisterPayload, ResetPasswordPayload } from '../types';

/** En-tête du jeton anti-robot (Cloudflare Turnstile), exigé si captcha_site_key est renseignée. */
function captchaHeaders(captchaToken?: string): Record<string, string> | undefined {
  return captchaToken ? { 'X-Captcha-Token': captchaToken } : undefined;
}

/** GET /auth/public-config : clé anti-robot, inscriptions ouvertes, message de maintenance, langues. */
export function getPublicConfig() {
  return api.get<PublicConfig>('/auth/public-config', { auth: false });
}

/**
 * POST /auth/register → 202, sans session. Réponse identique que l'adresse soit libre ou déjà prise :
 * l'utilisateur doit ouvrir le lien reçu par e-mail (24 h), puis se connecter.
 * Anti-robot obligatoire si captcha_site_key est renseignée.
 */
export function register(payload: RegisterPayload, captchaToken?: string) {
  return api.post<null>(
    '/auth/register',
    {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      full_name: payload.fullName?.trim() || null,
      locale: deviceLocale(),
      timezone: deviceTimeZone(),
      // Une seule case « conditions d'utilisation et politique de confidentialité » dans l'écran.
      accept_terms: true,
      accept_privacy: true,
    },
    { auth: false, headers: captchaHeaders(captchaToken) },
  );
}

/** POST /auth/resend-verification → 202 (60 s entre deux envois, 5 par heure). Anti-robot obligatoire. */
export function resendVerification(email: string, captchaToken?: string) {
  return api.post<null>(
    '/auth/resend-verification',
    { email: email.trim().toLowerCase() },
    { auth: false, headers: captchaHeaders(captchaToken) },
  );
}

/** POST /auth/verify-email avec le jeton du lien reçu → utilisateur (aucune session ouverte). */
export function verifyEmail(token: string) {
  return api.post<SessionUser>('/auth/verify-email', { token }, { auth: false });
}

/**
 * POST /auth/login → jeton d'accès (15 min) + utilisateur ; le cookie `bm_refresh` est déposé.
 * Erreurs à gérer par l'écran (ApiError.details) :
 * - 401 { mfa_required: true } : demander le code de double authentification ;
 * - 401 { mfa_code: [...] } : code incorrect ;
 * - 403 { email_not_verified: true } : adresse à confirmer ;
 * - 423 { retry_after } : compte verrouillé 15 min après 5 échecs.
 */
export function login(payload: LoginPayload) {
  return api.post<TokenResponse>(
    '/auth/login',
    {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      mfa_code: payload.mfaCode?.trim() || null,
      remember_me: payload.rememberMe ?? true,
      device_name: deviceName(),
    },
    { auth: false },
  );
}

/** POST /auth/forgot-password → 202, réponse identique que le compte existe ou non. Anti-robot obligatoire. */
export function forgotPassword(email: string, captchaToken?: string) {
  return api.post<null>(
    '/auth/forgot-password',
    { email: email.trim().toLowerCase() },
    { auth: false, headers: captchaHeaders(captchaToken) },
  );
}

/** POST /auth/reset-password avec le jeton du lien (valable 60 min, usage unique). */
export function resetPassword(payload: ResetPasswordPayload) {
  return api.post<null>('/auth/reset-password', { token: payload.token, password: payload.password }, { auth: false });
}

/** POST /auth/confirm-email-change avec le jeton reçu à la nouvelle adresse → utilisateur à jour. */
export function confirmEmailChange(token: string) {
  return api.post<SessionUser>('/auth/confirm-email-change', { token }, { auth: false });
}

/** GET /settings/onboarding : l'assistant de première utilisation est-il à proposer ? */
export function getOnboarding() {
  return api.get<OnboardingState>('/settings/onboarding');
}

/** POST /settings/onboarding/complete : assistant terminé ou passé, il ne sera plus proposé. */
export function completeOnboarding() {
  return api.post<OnboardingState>('/settings/onboarding/complete');
}

/**
 * Extrait le jeton d'un lien reçu par e-mail (…/verify-email?token=…, …/reset-password?token=…,
 * …/confirm-email?token=…) ou renvoie la saisie telle quelle si c'est déjà un jeton.
 */
export function tokenFromLink(input: string): string {
  const value = input.trim();
  const match = /[?&]token=([^&#\s]+)/.exec(value);
  return match ? decodeURIComponent(match[1]) : value;
}
