/**
 * Utilisateur renvoyé par le backend (`UserOut`) : POST /auth/login, POST /auth/refresh,
 * GET /accounts/me, POST /auth/verify-email (contrat 2.11.0, docs/backend/openapi.json).
 */
export type SessionUser = {
  id: string;
  email: string;
  full_name: string;
  locale: string;
  timezone: string;
  currency: string;
  status: string;
  role: string;
  is_admin: boolean;
  mfa_enabled: boolean;
  email_verified_at: string | null;
  inbox_alias?: string | null;
  dashboard_preferences?: Record<string, unknown> | null;
  created_at: string;
};

/**
 * `result` de POST /auth/login et POST /auth/refresh (`TokenOut`).
 * Le jeton de renouvellement n'est jamais dans le corps : il est dans le cookie httpOnly `bm_refresh`,
 * conservé par le magasin de cookies natif (iOS / Android) et renvoyé automatiquement à /api/v1/auth.
 */
export type TokenResponse = {
  access_token: string;
  token_type?: string;
  /** Durée de validité du jeton d'accès, en secondes (900 = 15 min). */
  expires_in: number;
  user: SessionUser;
};

/** Session locale : jeton d'accès (15 min) et utilisateur connecté. */
export type StoredSession = {
  accessToken: string;
  user: SessionUser | null;
};

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';
