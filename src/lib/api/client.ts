import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/lib/config';
import { newId } from '@/lib/id';
import { sessionStore, toAuthTokens } from '@/lib/session/session-store';
import type { TokenResponse } from '@/lib/session/types';

import { ApiError, NetworkError, parseProblem } from './errors';

/**
 * Client HTTP unique de l'application.
 * Seuls les services des modules (src/modules/<domaine>/services) l'appellent ;
 * un écran ou un hook ne fait jamais fetch directement.
 *
 * Conventions appliquées (dossier directeur § 6.4) :
 * - préfixe /api/v1, JSON UTF-8 ;
 * - Authorization: Bearer <access_token> ;
 * - X-Request-Id sur chaque requête ;
 * - Idempotency-Key sur chaque POST ;
 * - rafraîchissement automatique du jeton sur 401, une seule fois ;
 * - erreurs RFC 7807 converties en ApiError.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type QueryValue = string | number | boolean | null | undefined;

export type RequestOptions = {
  method?: HttpMethod;
  /** Corps sérialisé en JSON. */
  body?: unknown;
  query?: Record<string, QueryValue | QueryValue[]>;
  /** false pour les endpoints publics (login, register, reset...). Défaut : true. */
  auth?: boolean;
  /**
   * Clé d'idempotence. Générée automatiquement pour un POST si absente.
   * Pour un formulaire, réutiliser la même clé tant que l'envoi n'a pas réussi
   * (voir useIdempotencyKey) afin qu'un double appui ne crée pas de doublon.
   */
  idempotencyKey?: string;
  signal?: AbortSignal;
  timeoutMs?: number;
};

const REFRESH_PATH = '/auth/refresh';

function buildUrl(path: string, query?: RequestOptions['query']): string {
  if (!API_BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_URL est manquant (voir .env.example).');
  }

  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  if (!query) {
    return url;
  }

  const params: string[] = [];
  for (const [key, value] of Object.entries(query)) {
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (item !== undefined && item !== null) {
        params.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
      }
    }
  }
  return params.length ? `${url}?${params.join('&')}` : url;
}

/** fetch avec délai maximal, en conservant un éventuel signal d'annulation de l'appelant. */
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  external?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const onExternalAbort = () => controller.abort();
  external?.addEventListener('abort', onExternalAbort);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (external?.aborted) {
      throw error;
    }
    throw new NetworkError(timedOut);
  } finally {
    clearTimeout(timer);
    external?.removeEventListener('abort', onExternalAbort);
  }
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('json')) {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }
  const text = await response.text();
  return text || undefined;
}

async function toApiError(response: Response, requestId: string): Promise<ApiError> {
  const retryHeader = response.headers.get('retry-after');
  const retryAfter = retryHeader ? Number(retryHeader) : undefined;
  const body = await readBody(response);
  return parseProblem(response.status, body, {
    requestId: response.headers.get('x-request-id') ?? requestId,
    retryAfter: Number.isFinite(retryAfter) ? retryAfter : undefined,
  });
}

type RefreshResult = 'ok' | 'rejected' | 'network';

let refreshInFlight: Promise<RefreshResult> | null = null;

/** Rafraîchit les jetons. Les appels simultanés partagent la même requête. */
function refreshTokens(): Promise<RefreshResult> {
  refreshInFlight ??= (async (): Promise<RefreshResult> => {
    const refreshToken = sessionStore.getTokens()?.refreshToken;
    if (!refreshToken) {
      return 'rejected';
    }
    try {
      const response = await fetchWithTimeout(
        buildUrl(REFRESH_PATH),
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Request-Id': newId(),
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        },
        REQUEST_TIMEOUT_MS,
      );
      if (!response.ok) {
        return 'rejected';
      }
      const data = (await response.json()) as TokenResponse;
      await sessionStore.setTokens(toAuthTokens(data));
      return 'ok';
    } catch {
      return 'network';
    }
  })().finally(() => {
    // Remis à zéro après résolution, même si la fonction a répondu sans attendre.
    refreshInFlight = null;
  });
  return refreshInFlight;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    query,
    auth = true,
    signal,
    timeoutMs = REQUEST_TIMEOUT_MS,
  } = options;
  const url = buildUrl(path, query);
  const requestId = newId();
  const idempotencyKey =
    options.idempotencyKey ?? (method === 'POST' ? newId() : undefined);

  if (auth) {
    await sessionStore.hydrate();
  }

  const send = () => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'X-Request-Id': requestId,
    };
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    const accessToken = auth ? sessionStore.getTokens()?.accessToken : undefined;
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    return fetchWithTimeout(
      url,
      { method, headers, body: body === undefined ? undefined : JSON.stringify(body) },
      timeoutMs,
      signal,
    );
  };

  let response = await send();

  if (response.status === 401 && auth && sessionStore.getTokens()) {
    const result = await refreshTokens();
    if (result === 'ok') {
      // Même Request-Id et même Idempotency-Key : c'est le même envoi.
      response = await send();
    } else if (result === 'network') {
      throw new NetworkError();
    }
    if (response.status === 401) {
      await sessionStore.clear();
    }
  }

  if (!response.ok) {
    throw await toApiError(response, requestId);
  }

  return (await readBody(response)) as T;
}

/** Raccourcis lisibles pour les services. */
export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),
  delete: <T = void>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};
