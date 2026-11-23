// API Assistant vocal (contrat 2.11.0) : capacités et synthèse vocale d'un message.
// Les commandes/notes vocales passent par multipart/form-data (audio) ; elles ne sont pas
// encore exposées ici car le client HTTP actuel est JSON uniquement.
import { api } from '@/lib/api';

export type CapabilitiesDto = {
  enabled: boolean;
  notes: boolean;
  commands: boolean;
  speech: boolean;
  realtime: boolean;
  max_mb: number;
  max_seconds: number;
  min_confidence: number;
};

export const voiceApi = {
  capabilities: () => api.get<CapabilitiesDto>('/voice/capabilities'),
  /** Synthèse vocale (texte lu) d'un message de l'assistant. */
  speech: (messageId: string) => api.post<unknown>('/voice/speech', { message_id: messageId }),
};
