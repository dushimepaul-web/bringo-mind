/**
 * Outils communs du contrat d'API (guide v1.0) : listes paginées (§ 2.7), travaux asynchrones
 * (§ 2.8 et annexe B) et envoi de fichiers par URL signée (§ 2.10).
 */
import { CryptoDigestAlgorithm, digest } from 'expo-crypto';

import { apiRequest, apiRequestEnvelope, type RequestOptions } from './client';
import { NetworkError } from './errors';

/** Métadonnées de pagination renvoyées dans data.pagination et meta. */
export type Pagination = { page: number; per_page: number; total: number; total_pages: number };

export type Page<T> = { items: T[]; pagination: Pagination };

/** Paramètres communs des listes : page commence à 1, per_page de 1 à 100 (20 par défaut). */
export type ListParams = { page?: number; per_page?: number; sort?: string; q?: string };

/** Récupère une page d'une liste. */
export async function getPage<T>(
  path: string,
  query: Record<string, string | number | boolean | null | undefined> = {},
  options: Omit<RequestOptions, 'method' | 'body' | 'query'> = {},
): Promise<Page<T>> {
  const { data } = await apiRequestEnvelope<{ items?: T[]; pagination?: Pagination } | T[]>(path, {
    ...options,
    method: 'GET',
    query,
  });
  if (Array.isArray(data)) {
    return { items: data, pagination: { page: 1, per_page: data.length, total: data.length, total_pages: 1 } };
  }
  const items = data.items ?? [];
  return {
    items,
    pagination: data.pagination ?? { page: 1, per_page: items.length, total: items.length, total_pages: 1 },
  };
}

/** Récupère toutes les pages (à réserver aux petites listes : catégories, membres…). */
export async function getAll<T>(path: string, query: Record<string, string | number | boolean | null | undefined> = {}): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  for (;;) {
    const result = await getPage<T>(path, { ...query, page, per_page: 100 });
    items.push(...result.items);
    if (page >= result.pagination.total_pages || result.items.length === 0) return items;
    page += 1;
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

/** Réponse de DOC-001 POST /documents/uploads. */
type UploadInit = { document_id: string; upload_url: string; upload_method?: 'PUT'; headers?: Record<string, string>; expires_at?: string };

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Envoie un document en trois temps (DOC-001 → PUT signé → DOC-002) :
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
    method: init.upload_method ?? 'PUT',
    headers: { 'Content-Type': file.mimeType, ...init.headers },
    body: blob,
  });
  if (!put.ok) throw new NetworkError();

  await apiRequest(`/documents/${init.document_id}/complete-upload`, {
    method: 'POST',
    body: { size_bytes: bytes.byteLength, sha256 },
  });
  return { documentId: init.document_id };
}
