// Mémoire de démonstration partagée par les écrans du module Documents.
import { useSyncExternalStore } from 'react';

import { DEMO_DOCUMENTS, scannedDocument } from './data';
import type { DocCategory, DocItem, DocScope } from './types';

type Snapshot = {
  documents: DocItem[];
  flash: { text: string; undo?: () => void } | null;
};

let state: Snapshot = { documents: DEMO_DOCUMENTS, flash: null };
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
    update(id, { title: title.trim() });
  },
  move(id: string, category: DocCategory) {
    update(id, { category });
  },
  setScope(id: string, scope: DocScope): () => void {
    const previous = state.documents.find((doc) => doc.id === id)?.scope;
    update(id, { scope });
    return () => previous && update(id, { scope: previous });
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
    return () => {
      if (!doc || state.documents.some((entry) => entry.id === id)) return;
      const copy = [...state.documents];
      copy.splice(index, 0, doc);
      emit({ documents: copy });
    };
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
