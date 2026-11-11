export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Contenu de `data` renvoyé par POST /auth/login (AUTH-004), /auth/refresh (AUTH-005)
 * et /auth/verify-email (guide d'API v1.0). Accès 15 min, rafraîchissement 30 jours, tourné à chaque usage.
 */
export type TokenResponse = {
  token_type?: 'Bearer' | 'bearer';
  access_token: string;
  expires_in?: number;
  refresh_token: string;
  refresh_expires_in?: number;
  user?: {
    id: string;
    email: string;
    status?: string;
    locale?: string;
    time_zone?: string;
  };
};

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';
