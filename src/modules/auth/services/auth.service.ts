import type {
  AuthSession,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/password/forgot',
  resetPassword: '/auth/password/reset',
  verifyEmail: '/auth/email/verify',
  resendVerification: '/auth/email/resend',
} as const;

class HttpError extends Error {
  constructor(public readonly status: number) {
    super(`Erreur ${status}`);
    this.name = 'HttpError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL est manquant');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function login(payload: LoginPayload): Promise<AuthSession> {
  return request<AuthSession>(ENDPOINTS.login, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload): Promise<AuthSession> {
  return request<AuthSession>(ENDPOINTS.register, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function requestPasswordReset(email: string): Promise<void> {
  return request<void>(ENDPOINTS.forgotPassword, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  return request<void>(ENDPOINTS.resetPassword, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function verifyEmail(token: string): Promise<void> {
  return request<void>(ENDPOINTS.verifyEmail, {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function resendVerificationEmail(email: string): Promise<void> {
  return request<void>(ENDPOINTS.resendVerification, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
