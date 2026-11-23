// API Documents (contrat 2.11.0, docs/backend/modules/03_documents.md) et conversion
// vers le modèle des écrans. L'envoi de fichiers passe par uploadDocument (src/lib/api).
import { api, getAll, uploadDocument } from '@/lib/api';

import type { DocCategory, DocItem } from '../types';

/** Document tel que renvoyé par l'API (`DocumentOut`). */
export type DocumentDto = {
  id: string;
  title: string | null;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  status: 'uploaded' | 'processing' | 'ready' | 'archived' | 'quarantined' | 'failed_unreadable' | 'awaiting_ai_consent' | 'deleted';
  version: number;
  current_version: number;
  is_sensitive: boolean;
  ai_allowed: boolean;
  document_type: string | null;
  category_id: string | null;
  household_id: string | null;
  source_item_id: string | null;
  expiry_date: string | null;
  retention_until: string | null;
  archived_at: string | null;
  created_at: string;
  summary: string | null;
  tags: string[];
};

export type DocumentCategoryDto = { id: string; name: string };

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`;
  return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
}

const CATEGORY_NAME: Record<DocCategory, string> = {
  identity: 'identité',
  housing: 'logement',
  health: 'santé',
  taxes: 'impôts',
  bills: 'facture',
};

function categoryOf(categoryId: string | null, categories: DocumentCategoryDto[]): DocCategory {
  const found = categories.find((entry) => entry.id === categoryId);
  if (!found) return 'bills';
  const name = found.name.toLowerCase();
  return (Object.keys(CATEGORY_NAME) as DocCategory[]).find((key) => name.includes(CATEGORY_NAME[key])) ?? 'bills';
}

export function toDocument(dto: DocumentDto, categories: DocumentCategoryDto[] = []): DocItem {
  const status =
    dto.status === 'processing'
      ? 'Analyse en cours…'
      : dto.status === 'failed_unreadable'
        ? 'Analyse impossible'
        : dto.status === 'awaiting_ai_consent'
          ? 'Consentement IA requis'
          : dto.status === 'quarantined'
            ? 'En quarantaine'
            : undefined;
  return {
    id: dto.id,
    title: dto.title ?? dto.original_filename,
    fileType: dto.mime_type.includes('pdf') ? 'PDF' : 'Image',
    size: formatSize(dto.size_bytes),
    category: categoryOf(dto.category_id, categories),
    scope: dto.household_id ? 'household' : 'personal',
    addedAt: new Date(dto.created_at),
    addedBy: 'Moi',
    status,
    ...(dto.expiry_date ? { due: { date: new Date(dto.expiry_date), label: 'Expire le' } } : {}),
    version: dto.version,
  };
}

export const documentsApi = {
  /** DOC-003 : documents visibles, du plus récent au plus ancien. */
  list: () => getAll<DocumentDto>('/documents', { sort: 'created_at', limit: 100 }),

  /** DOC-004 : détail d'un document. */
  get: (id: string) => api.get<DocumentDto>(`/documents/${id}`),

  /** DOC-005 : modifier les métadonnées (titre, catégorie, tags…). */
  update: (id: string, version: number, patch: { title?: string; category_id?: string | null; tags?: string[] }) =>
    api.patch<DocumentDto>(`/documents/${id}`, { ...patch, version }),

  /** Archiver / désarchiver / restaurer (corbeille). */
  archive: (id: string) => api.post<DocumentDto>(`/documents/${id}/archive`),
  unarchive: (id: string) => api.post<DocumentDto>(`/documents/${id}/unarchive`),
  restore: (id: string) => api.post<DocumentDto>(`/documents/${id}/restore`),

  /** Suppression (définitive, `confirm=true` court-circuite la corbeille). */
  remove: (id: string, confirm = true) => api.delete(`/documents/${id}`, { query: { confirm } }),
  trash: () => getAll<DocumentDto>('/documents/trash'),

  /** Envoi d'un nouveau document (trois temps : init → PUT signé → confirm). */
  upload: (file: { uri: string; name: string; mimeType: string; extra?: Record<string, unknown> }) => uploadDocument(file),

  /** Analyse et OCR. */
  reprocess: (id: string) => api.post<DocumentDto>(`/documents/${id}/reprocess`),
  processing: (id: string) => api.get<Record<string, unknown>>(`/documents/${id}/processing`),
  summary: (id: string) => api.post<Record<string, unknown>>(`/documents/${id}/summary`),

  /** Consentement à l'analyse par l'IA. */
  setAiConsent: (id: string, allowed: boolean) => api.post<DocumentDto>(`/documents/${id}/ai-consent`, { allowed }),

  /** Échéance de conservation. */
  setExpiry: (id: string, expiryDate: string | null) => api.put(`/documents/${id}/expiry`, { expiry_date: expiryDate }),

  /** Liens de partage. */
  links: (id: string) => api.post<unknown>(`/documents/${id}/links`),

  /** Versions. */
  versions: (id: string) => api.get<unknown[]>(`/documents/${id}/versions`),
  deleteVersion: (id: string, number: number) => api.delete(`/documents/${id}/versions/${number}`),
  restoreVersion: (id: string, number: number) => api.post(`/documents/${id}/versions/${number}/restore`),

  /** Catégories et étiquettes disponibles. */
  categories: () => api.get<DocumentCategoryDto[]>('/document-categories'),
  tags: () => api.get<string[]>('/document-tags'),
};

/** Retrouve l'identifiant d'une catégorie à partir de son nom affiché. */
export function categoryIdOf(category: DocCategory, categories: DocumentCategoryDto[]): string | null {
  const key = CATEGORY_NAME[category];
  return categories.find((entry) => entry.name.toLowerCase().includes(key))?.id ?? null;
}
