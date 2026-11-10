// Types du module Documents (S9). Kora aide à lire les documents, mais tout reste modifiable à la main.

export type DocCategory = 'identity' | 'housing' | 'health' | 'taxes' | 'bills';
export type DocScope = 'personal' | 'household';

export type ExtractedField = { key: string; label: string; value: string; icon: string };

export type DocItem = {
  id: string;
  title: string;
  fileType: 'PDF' | 'Image';
  size: string;
  category: DocCategory;
  scope: DocScope;
  addedAt: Date;
  addedBy: string;
  /** Petite ligne d'état : « Signé », « Valide jusqu'en 2026 »… */
  status?: string;
  /** Échéance repérée (paiement, renouvellement…). */
  due?: { date: Date; label: string; amount?: string };
  /** Informations repérées par Kora. */
  extracted?: ExtractedField[];
  /** true : Kora vient de l'analyser, la personne doit vérifier. */
  review?: boolean;
  confidence?: number;
  /** Élément d'un autre module lié à ce document. */
  linked?: { kind: 'task' | 'event'; id: string; title: string };
};
