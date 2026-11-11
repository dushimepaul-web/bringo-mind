// Lecture de l'API Documents (guide d'API v1.0, module 06 : DOC-003 / DOC-004) et conversion
// vers le modèle des écrans. L'envoi de fichiers passe par uploadDocument (src/lib/api).
import { getAll } from '@/lib/api';

import type { DocCategory, DocItem } from '../types';

/** Document tel que renvoyé par l'API (DOC-004). */
export type DocumentDto = {
  id: string;
  title: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  status: 'pending_upload' | 'processing' | 'ready' | 'failed' | 'quarantined';
  is_sensitive: boolean;
  visibility: 'personal' | 'household';
  category: { id: string; code?: string; name: string } | null;
  tags?: { id: string; name: string }[];
  latest_extraction?: { id: string; review_status: 'pending' | 'confirmed' | 'rejected'; confidence: number } | null;
  version: number;
  created_at: string;
};

const CATEGORY_BY_CODE: Record<string, DocCategory> = {
  identity: 'identity',
  housing: 'housing',
  health: 'health',
  taxes: 'taxes',
  tax: 'taxes',
  bills: 'bills',
  invoice: 'bills',
  utilities: 'bills',
};

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`;
  return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
}

export function toDocument(dto: DocumentDto): DocItem {
  const key = (dto.category?.code ?? dto.tags?.[0]?.name ?? '').toLowerCase();
  return {
    id: dto.id,
    title: dto.title,
    fileType: dto.mime_type === 'application/pdf' ? 'PDF' : 'Image',
    size: formatSize(dto.size_bytes),
    category: CATEGORY_BY_CODE[key] ?? 'bills',
    scope: dto.visibility === 'household' ? 'household' : 'personal',
    addedAt: new Date(dto.created_at),
    addedBy: 'Moi',
    status: dto.status === 'processing' ? 'Analyse en cours…' : dto.status === 'failed' ? 'Analyse impossible' : undefined,
    review: dto.latest_extraction?.review_status === 'pending',
    confidence: dto.latest_extraction ? Math.round(dto.latest_extraction.confidence * 1000) / 10 : undefined,
  };
}

export const documentsApi = {
  /** DOC-003 : documents visibles, du plus récent au plus ancien. */
  list: () => getAll<DocumentDto>('/documents', { sort: '-created_at' }),
};
