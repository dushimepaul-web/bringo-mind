import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/lib/config';
import { deviceLocale } from '@/lib/device-info';
import { newId } from '@/lib/id';
import { sessionStore, toStoredSession } from '@/lib/session/session-store';
import type { TokenResponse } from '@/lib/session/types';

import { ApiError, NetworkError, parseProblem } from './errors';

/**
 * Client HTTP unique de l'application.
 * Seuls les services des modules (src/modules/<domaine>/services) l'appellent ;
 * un écran ou un hook ne fait jamais fetch directement.
 *
 * Conventions du backend BringoMind (contrat 2.11.0, docs/backend/CONVENTIONS.md) :
 * - préfixe /api/v1, JSON UTF-8, langue dans Accept-Language (messages déjà traduits) ;
 * - Authorization: Bearer <access_token> (15 min) ;
 * - X-Request-Id sur chaque requête, Idempotency-Key (8 à 80 caractères) sur chaque POST ;
 * - jeton de renouvellement dans le cookie httpOnly `bm_refresh` (chemin /api/v1/auth) :
 *   `credentials: 'include'` le laisse au magasin de cookies natif ; sur 401, un seul
 *   POST /auth/refresh sans corps, puis nouvel essai ;
 * - enveloppe { statusCode, httpStatus, message, result } : `apiRequest` renvoie `result` ;
 * - erreurs : même enveloppe, `result` = détails ({ champ: [messages] } pour une 422) → ApiError.
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
  /** En-têtes supplémentaires (ex. X-Captcha-Token). */
  headers?: Record<string, string>;
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
    // credentials: le cookie de session `bm_refresh` est déposé et renvoyé par le magasin natif.
    return await fetch(url, { credentials: 'include', ...init, signal: controller.signal });
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

/**
 * Renouvelle le jeton d'accès à partir du cookie `bm_refresh` (POST /auth/refresh, sans corps).
 * Les appels simultanés partagent la même requête : le backend fait tourner le cookie à chaque
 * usage et révoque toute la session si un ancien cookie est réutilisé.
 */
export function refreshSession(): Promise<RefreshResult> {
  refreshInFlight ??= (async (): Promise<RefreshResult> => {
    try {
      const response = await fetchWithTimeout(
        buildUrl(REFRESH_PATH),
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-Language': currentLocale(),
            'X-Request-Id': newId(),
          },
        },
        REQUEST_TIMEOUT_MS,
      );
      if (!response.ok) {
        return response.status >= 500 ? 'network' : 'rejected';
      }
      const envelope = (await response.json()) as unknown;
      await sessionStore.set(toStoredSession(unwrap<TokenResponse>(envelope).data));
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

/**
 * Au démarrage : rouvre la session à partir du cookie.
 * - « authenticated » : nouveau jeton obtenu ;
 * - « offline » : pas de réseau mais une session était enregistrée (l'app s'ouvre, les données
 *   se rechargeront au retour du réseau) ;
 * - « unauthenticated » : pas de session, ou session refusée (expirée, révoquée).
 */
export async function restoreSession(): Promise<'authenticated' | 'offline' | 'unauthenticated'> {
  const stored = await sessionStore.hydrate();
  const result = await refreshSession();
  if (result === 'ok') return 'authenticated';
  if (result === 'network' && stored) return 'offline';
  await sessionStore.clear();
  return 'unauthenticated';
}

/** Langue des messages du serveur : celle du compte, sinon celle du téléphone. */
function currentLocale(): string {
  return sessionStore.getUser()?.locale ?? deviceLocale();
}

/** Réponse complète : `data` plus les métadonnées (pagination) et le message du serveur. */
export type ApiEnvelope<T> = { data: T; meta: unknown; message?: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Retire l'enveloppe du backend { statusCode, httpStatus, message, result }.
 * Tolère l'ancien format { success, data, meta } et les réponses sans enveloppe
 * (téléchargements, GET /health, export du compte).
 */
function unwrap<T>(body: unknown): ApiEnvelope<T> {
  if (isRecord(body) && typeof body.statusCode === 'number' && 'httpStatus' in body) {
    return {
      data: (body.result ?? undefined) as T,
      meta: null,
      message: typeof body.message === 'string' ? body.message : undefined,
    };
  }
  if (isRecord(body) && body.success === true && 'data' in body) {
    return {
      data: body.data as T,
      meta: body.meta ?? null,
      message: typeof body.message === 'string' ? body.message : undefined,
    };
  }
  return { data: body as T, meta: null };
}

/** Requête renvoyant l'enveloppe complète (utile pour les listes paginées). */
export async function apiRequestEnvelope<T>(path: string, options: RequestOptions = {}): Promise<ApiEnvelope<T>> {
  return unwrap<T>(await send(path, options));
}

/** Requête renvoyant directement `data`. */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return unwrap<T>(await send(path, options)).data;
}

async function send(path: string, options: RequestOptions): Promise<unknown> {
  const {
    method = 'GET',
    body,
    query,
    auth = true,
    signal,
    timeoutMs = REQUEST_TIMEOUT_MS,
    headers: extraHeaders,
  } = options;
  const url = buildUrl(path, query);
  const requestId = newId();
  const idempotencyKey =
    options.idempotencyKey ?? (method === 'POST' ? newId() : undefined);

  if (auth) {
    await sessionStore.hydrate();
  }

  const attempt = () => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Accept-Language': currentLocale(),
      'X-Request-Id': requestId,
      ...extraHeaders,
    };
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    const accessToken = auth ? sessionStore.getAccessToken() : undefined;
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

  let response = await attempt();

  if (response.status === 401 && auth && sessionStore.getAccessToken()) {
    const result = await refreshSession();
    if (result === 'ok') {
      // Même Request-Id et même Idempotency-Key : c'est le même envoi.
      response = await attempt();
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

  return readBody(response);
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
