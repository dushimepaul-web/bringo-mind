// Chargement d'une ressource par un service de module, avec états chargement / erreur / succès,
// rechargement (tirer pour actualiser, bouton « Réessayer ») et annulation au démontage.
// En mode démo, la réponse est immédiate : pas de flash de chargement.
import { useCallback, useEffect, useState } from 'react';

import { IS_DEMO } from '@/lib/config';
import { NetworkError, isNetworkError } from '@/lib/api';
import { useDemoState } from '@/lib/demo-state';

export type QueryStatus = 'loading' | 'success' | 'error';

export type QueryState = {
  status: QueryStatus;
  error?: unknown;
  /** true pendant un rechargement alors que des données sont déjà affichées. */
  refreshing: boolean;
  /** true si la démo simule une liste vide (nouveau compte). */
  empty: boolean;
  reload: () => void;
};

export function useQuery(key: string, load: (signal: AbortSignal) => Promise<unknown>): QueryState {
  const demoState = useDemoState();
  const [status, setStatus] = useState<QueryStatus>(IS_DEMO ? 'success' : 'loading');
  const [error, setError] = useState<unknown>(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Démo : états simulés pour relire le design sans backend.
    // « Hors ligne » : les données déjà chargées restent affichées (le bandeau prévient).
    if (IS_DEMO && (demoState === 'loading' || demoState === 'error')) {
      const timer = setTimeout(() => {
        if (demoState === 'loading') {
          setStatus('loading');
        } else {
          setError(new NetworkError(false));
          setStatus('error');
        }
        setRefreshing(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const controller = new AbortController();
    load(controller.signal)
      .then(() => {
        if (controller.signal.aborted) return;
        setError(undefined);
        setStatus('success');
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setError(reason);
        // Sans réseau, on garde les dernières données si elles existent déjà.
        setStatus((current) => (isNetworkError(reason) && current === 'success' ? 'success' : 'error'));
      })
      .finally(() => {
        if (!controller.signal.aborted) setRefreshing(false);
      });
    return () => controller.abort();
    // `load` vient d'un service (référence stable) ; `key` identifie la ressource.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt, demoState]);

  const reload = useCallback(() => {
    setRefreshing(true);
    setAttempt((value) => value + 1);
  }, []);

  return { status, error, refreshing, empty: IS_DEMO && demoState === 'empty', reload };
}
