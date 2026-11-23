// État de l'assistant vocal : capacités renvoyées par GET /voice/capabilities.
import { useSyncExternalStore } from 'react';

import { IS_DEMO } from '@/lib/config';

import { voiceApi, type CapabilitiesDto } from './services/voice.service';

type VoiceState = { capabilities: CapabilitiesDto | null; loaded: boolean };

let state: VoiceState = { capabilities: null, loaded: false };
const listeners = new Set<() => void>();

function emit(next: VoiceState) {
  state = next;
  for (const listener of listeners) listener();
}

export function useVoiceCapabilities(): VoiceState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state,
  );
}

export async function syncVoiceCapabilities(): Promise<void> {
  if (IS_DEMO) return;
  try {
    const capabilities = await voiceApi.capabilities();
    emit({ capabilities, loaded: true });
  } catch {
    emit({ capabilities: null, loaded: true });
  }
}
