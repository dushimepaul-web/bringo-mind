// Mémoire partagée par les écrans du module Documents.
// Mode « demo » : données de démonstration. Mode « api » : mise à jour optimiste puis requête.
import { useSyncExternalStore } from 'react';

import { userMessage } from '@/lib/api';
import { IS_DEMO } from '@/lib/config';

import { DEMO_DOCUMENTS, scannedDocument } from './data';
import { categoryIdOf, documentsApi, toDocument, type DocumentCategoryDto, type DocumentDto } from './services/documents.service';
import type { DocCategory, DocItem, DocScope } from './types';

type Snapshot = {
  documents: DocItem[];
  flash: { text: string; undo?: () => void } | null;
};

let state: Snapshot = { documents: DEMO_DOCUMENTS, flash: null };
let categories: DocumentCategoryDto[] = [];
const listeners = new Set<() => void>();

function emit(next: Partial<Snapshot>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;

function update(id: string, patch: Partial<DocItem>) {
  emit({ documents: state.documents.map((doc) => (doc.id === id ? { ...doc, ...patch } : doc)) });
}

function replace(localId: string, dto: DocumentDto) {
  emit({ documents: state.documents.map((doc) => (doc.id === localId ? toDocument(dto, categories) : doc)) });
}

/** Mode « api » : envoie la requête ; en cas d'échec, annule la modification locale. */
function remote<T>(call: () => Promise<T>, onSuccess: (result: T) => void, rollback: () => void) {
  if (IS_DEMO) return;
  call()
    .then(onSuccess)
    .catch((error: unknown) => {
      rollback();
      emit({ flash: { text: userMessage(error) } });
    });
}

export function useDocumentsState(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useDocument(id: string | undefined): DocItem | undefined {
  const { documents } = useDocumentsState();
  // Sans identifiant (lien générique), on ouvre le document à vérifier.
  return documents.find((doc) => doc.id === (id ?? 'engie'));
}

export const documentActions = {
  rename(id: string, title: string) {
    const before = state.documents.find((doc) => doc.id === id);
    if (!before) return;
    update(id, { title: title.trim() });
    remote(() => documentsApi.update(id, before.version ?? 1, { title: title.trim() }), (dto) => replace(id, dto), () => update(id, before));
  },
  move(id: string, category: DocCategory) {
    const before = state.documents.find((doc) => doc.id === id);
    if (!before) return;
    update(id, { category });
    remote(
      () => documentsApi.update(id, before.version ?? 1, { category_id: categoryIdOf(category, categories) }),
      (dto) => replace(id, dto),
      () => update(id, before),
    );
  },
  setScope(id: string, scope: DocScope): () => void {
    const previous = state.documents.find((doc) => doc.id === id)?.scope;
    update(id, { scope });
    return () => previous && update(id, { scope: previous });
  },
  /** Archiver un document (corbeille). */
  archive(id: string): () => void {
    const before = state.documents.find((doc) => doc.id === id);
    if (!before) return () => undefined;
    emit({ documents: state.documents.filter((entry) => entry.id !== id) });
    const putBack = () => {
      if (state.documents.some((entry) => entry.id === id)) return;
      emit({ documents: [before, ...state.documents] });
    };
    remote(() => documentsApi.archive(id), () => undefined, putBack);
    return putBack;
  },
  confirmReview(id: string) {
    update(id, { review: false });
  },
  saveFields(id: string, values: Record<string, string>) {
    const doc = state.documents.find((entry) => entry.id === id);
    if (!doc?.extracted) return;
    update(id, {
      review: false,
      extracted: doc.extracted.map((field) => (values[field.key] != null ? { ...field, value: values[field.key] } : field)),
    });
  },
  remove(id: string): () => void {
    const index = state.documents.findIndex((doc) => doc.id === id);
    const doc = state.documents[index];
    emit({ documents: state.documents.filter((entry) => entry.id !== id) });
    const putBack = () => {
      if (!doc || state.documents.some((entry) => entry.id === id)) return;
      const copy = [...state.documents];
      copy.splice(index, 0, doc);
      emit({ documents: copy });
    };
    remote(() => documentsApi.remove(id), () => undefined, putBack);
    return putBack;
  },
  /** Démo : un scan ajoute une quittance à vérifier. */
  scan(): string {
    const doc = scannedDocument();
    emit({ documents: [doc, ...state.documents] });
    return doc.id;
  },
  setFlash(flash: Snapshot['flash']) {
    emit({ flash });
  },
};

/** Charge les documents depuis l'API (mode « api ») ; ne fait rien en démo. */
export async function syncDocuments(): Promise<void> {
  if (IS_DEMO) return;
  const [items, cats] = await Promise.all([documentsApi.list(), documentsApi.categories()]);
  categories = cats;
  emit({ documents: items.map((dto) => toDocument(dto, categories)) });
}
