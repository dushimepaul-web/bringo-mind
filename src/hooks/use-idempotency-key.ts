import { useCallback, useRef } from 'react';

import { newId } from '@/lib/id';

/**
 * Garde la même Idempotency-Key pour un formulaire tant que l'envoi n'a pas réussi.
 * Un double appui ou une nouvelle tentative après une coupure réseau
 * renvoie donc la même clé, et le serveur ne crée pas de doublon.
 *
 *   const idempotency = useIdempotencyKey();
 *   await createTask(payload, idempotency.get());
 *   idempotency.reset(); // après succès uniquement
 */
export function useIdempotencyKey() {
  const keyRef = useRef<string | null>(null);

  const get = useCallback(() => {
    keyRef.current ??= newId();
    return keyRef.current;
  }, []);

  const reset = useCallback(() => {
    keyRef.current = null;
  }, []);

  return { get, reset };
}
