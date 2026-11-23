// Drapeaux de fonctionnalité de l'utilisateur connecté (GET /feature-flags, contrat 2.11.0).
// Une fonction désactivée par l'administrateur est masquée dans l'app ; l'API la refuse de toute façon
// (403 « Fonction non activée par l'administrateur », result.feature).
import { useSyncExternalStore } from 'react';

import { api } from '@/lib/api/client';
import { IS_DEMO } from '@/lib/config';

/** Drapeaux connus du backend (db/donnees_reference/feature_flags.csv). */
export type FeatureKey =
  | 'voice.enabled'
  | 'email.sync.enabled'
  | 'billing.enabled'
  | 'calendar.external.enabled'
  | 'households.enabled'
  | 'ai.assistant.enabled'
  | 'documents.ocr.enabled'
  | (string & {});

let flags: Record<string, boolean> = {};
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Charge les drapeaux après la connexion ou la reprise de session. Sans réseau, garde les précédents. */
export async function loadFeatureFlags(): Promise<void> {
  if (IS_DEMO) return;
  try {
    flags = (await api.get<Record<string, boolean>>('/feature-flags')) ?? {};
    emit();
  } catch {
    // Hors ligne ou refus : les fonctions restent affichées, l'API tranchera.
  }
}

export function resetFeatureFlags() {
  flags = {};
  emit();
}

/** Fonction active ? Démo, ou drapeau pas encore chargé : oui. */
export function isFeatureEnabled(key: FeatureKey): boolean {
  if (IS_DEMO) return true;
  return flags[key] ?? true;
}

export function useFeatureFlag(key: FeatureKey): boolean {
  return useSyncExternalStore(subscribe, () => isFeatureEnabled(key), () => isFeatureEnabled(key));
}
