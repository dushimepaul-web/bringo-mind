/**
 * Outils communs du contrat d'API (contrat 2.11.0) : listes paginées par curseur,
 * travaux asynchrones et envoi de fichiers par URL signée.
 *
 * Pagination du backend : `result` est `{ items, total, page, page_size, next_cursor }`
 * (page/page_size peuvent être absents pour les listes en curseur pur, ex. documents).
 */
import { CryptoDigestAlgorithm, digest } from 'expo-crypto';

import { apiRequest, apiRequestEnvelope, type RequestOptions } from './client';
import { NetworkError } from './errors';

/** Métadonnées de pagination renvoyées dans `result`. */
export type Pagination = { total: number | null; next_cursor: string | null };

export type Page<T> = { items: T[]; total: number | null; next_cursor: string | null };

/** Paramètres communs des listes (le backend ignore les paramètres qu'il ne connaît pas). */
export type ListParams = {
  page?: number;
  page_size?: number;
  limit?: number;
  cursor?: string;
  sort?: string;
  q?: string;
};

/** Récupère une page d'une liste. Accepte un `result` tableau ou `{ items, next_cursor, total? }`. */
export async function getPage<T>(
  path: string,
  query: Record<string, string | number | boolean | null | undefined> = {},
  options: Omit<RequestOptions, 'method' | 'body' | 'query'> = {},
): Promise<Page<T>> {
  const { data } = await apiRequestEnvelope<
    { items?: T[]; next_cursor?: string | null; total?: number | null } | T[]
  >(path, { ...options, method: 'GET', query });
  if (Array.isArray(data)) {
    return { items: data, total: data.length, next_cursor: null };
  }
  return {
    items: data.items ?? [],
    total: data.total ?? null,
    next_cursor: data.next_cursor ?? null,
  };
}

/** Récupère toutes les pages d'une liste en suivant `next_cursor` (réservé aux petites listes). */
export async function getAll<T>(
  path: string,
  query: Record<string, string | number | boolean | null | undefined> = {},
  options: Omit<RequestOptions, 'method' | 'body' | 'query'> = {},
): Promise<T[]> {
  const items: T[] = [];
  let cursor: string | null = null;
  for (;;) {
    const result: Page<T> = await getPage<T>(path, { ...query, ...(cursor ? { cursor } : {}) }, options);
    items.push(...result.items);
    if (!result.next_cursor || result.items.length === 0 || result.next_cursor === cursor) {
      return items;
    }
    cursor = result.next_cursor;
  }
}

const TERMINAL = new Set(['succeeded', 'failed', 'cancelled', 'timeout', 'completed']);
/** Rythme recommandé : 1 s, 2 s, 4 s, 8 s, puis 30 s. */
const BACKOFF = [1, 2, 4, 8, 30];

export type JobState = { status: string; poll_after_seconds?: number; [key: string]: unknown };

const wait = (seconds: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, seconds * 1000);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('Annulé'));
    });
  });

/**
 * Suit un travail asynchrone (réponse 202 + identifiant) jusqu'à un état final.
 * Respecte poll_after_seconds quand le serveur l'indique ; ne boucle jamais sans pause.
 */
export async function pollJob<T extends JobState>(
  path: string,
  options: { signal?: AbortSignal; maxAttempts?: number; onUpdate?: (state: T) => void } = {},
): Promise<T> {
  const { signal, maxAttempts = 20, onUpdate } = options;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const state = await apiRequest<T>(path, { signal });
    onUpdate?.(state);
    if (TERMINAL.has(state.status)) return state;
    await wait(state.poll_after_seconds ?? BACKOFF[Math.min(attempt, BACKOFF.length - 1)], signal);
  }
  throw new NetworkError(true);
}

/** Réponse de DOC-001 POST /documents/uploads (`UploadOut`). */
type UploadInit = {
  upload_id: string;
  upload_url: string;
  expires_at?: string;
  duplicate_of?: string | null;
};

/** Réponse de DOC-002 POST /documents/uploads/{upload_id}/confirm (`ConfirmedOut`). */
type ConfirmedOut = {
  document: { id: string };
  duplicate: boolean;
};

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Envoie un document en trois temps (DOC-001 → PUT signé → confirm) :
 * 1. le serveur vérifie type, taille et quota puis renvoie une URL signée de courte durée ;
 * 2. l'app envoie les octets directement au stockage (jamais à travers l'API) ;
 * 3. l'app confirme ; le serveur vérifie taille et SHA-256 puis lance analyse et OCR.
 */
export async function uploadDocument(file: {
  uri: string;
  name: string;
  mimeType: string;
  extra?: Record<string, unknown>;
}): Promise<{ documentId: string }> {
  const blob = await (await fetch(file.uri)).blob();
  const bytes = await blob.arrayBuffer();
  const sha256 = toHex(await digest(CryptoDigestAlgorithm.SHA256, bytes));

  const init = await apiRequest<UploadInit>('/documents/uploads', {
    method: 'POST',
    body: { file_name: file.name, mime_type: file.mimeType, size_bytes: bytes.byteLength, sha256, ...file.extra },
  });

  const put = await fetch(init.upload_url, {
    method: 'PUT',
    headers: { 'Content-Type': file.mimeType },
    body: blob,
  });
  if (!put.ok) throw new NetworkError();

  const confirmed = await apiRequest<ConfirmedOut>(`/documents/uploads/${init.upload_id}/confirm`, {
    method: 'POST',
  });
  return { documentId: confirmed.document.id };
}
