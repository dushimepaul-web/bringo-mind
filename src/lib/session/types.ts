export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Réponse attendue de POST /auth/login, /auth/register et /auth/refresh.
 * À confirmer avec l'OpenAPI v0 de l'équipe API.
 */
export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type?: 'bearer';
  expires_in?: number;
};

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';
