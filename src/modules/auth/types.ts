import type { SessionUser } from '@/lib/session';

/** Utilisateur connecté (UserOut du backend). */
export type AuthUser = SessionUser;

export type LoginPayload = {
  email: string;
  password: string;
  /** Code TOTP à 6 chiffres ou code de secours, si la double authentification est activée. */
  mfaCode?: string;
  /** « Rester connecté » : session de 30 jours (sinon session courte). */
  rememberMe?: boolean;
};

export type RegisterPayload = {
  email: string;
  password: string;
  fullName?: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

/** GET /auth/public-config : réglages connus avant la connexion. */
export type PublicConfig = {
  /** Clé Cloudflare Turnstile : si renseignée, inscription, renvoi de lien et mot de passe oublié exigent un jeton anti-robot. */
  captcha_site_key: string | null;
  registration_enabled: boolean;
  maintenance_message: string | null;
  languages: unknown[];
  default_locale: string;
};

/** GET /settings/onboarding : assistant de première utilisation (compte neuf, sans tâche ni foyer). */
export type OnboardingState = {
  pending: boolean;
  completed_at: string | null;
};

/** Règles du backend pour un mot de passe (app/core/passwords.py). */
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;
