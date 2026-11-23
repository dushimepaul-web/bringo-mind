// API Localisation (contrat 2.11.0) : conversion de devises et traduction.
import { api } from '@/lib/api';

export type ConversionDto = { amount: number; from: string; to: string; converted: number; rate: number };
export type TranslationDto = { text: string; detected_source: string; target: string };

export const localizationApi = {
  /** Convertit un montant d'une devise vers une autre. */
  convert: (amount: number, from: string, to: string) =>
    api.get<ConversionDto>('/localization/convert', { query: { amount, from, to } }),
  /** Traduit un texte vers la langue cible. */
  translate: (text: string, target: string, source?: string) =>
    api.post<TranslationDto>('/localization/translate', { text, target, source: source ?? null }),
};
