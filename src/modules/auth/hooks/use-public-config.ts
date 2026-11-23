// Réglages publics du backend (GET /auth/public-config), chargés une fois et partagés par les écrans d'accès.
import { useEffect, useState } from 'react';

import { IS_DEMO } from '@/lib/config';

import { getPublicConfig } from '../services/auth.service';
import type { PublicConfig } from '../types';

let cache: PublicConfig | null = null;
let pending: Promise<PublicConfig | null> | null = null;

function load(): Promise<PublicConfig | null> {
  pending ??= getPublicConfig()
    .then((config) => {
      cache = config;
      return config;
    })
    .catch(() => {
      pending = null;
      return null;
    });
  return pending;
}

/** null tant que la configuration n'est pas connue (démo, chargement ou hors ligne). */
export function usePublicConfig(): PublicConfig | null {
  const [config, setConfig] = useState<PublicConfig | null>(cache);
  useEffect(() => {
    if (IS_DEMO || cache) return;
    let active = true;
    void load().then((value) => {
      if (active) setConfig(value);
    });
    return () => {
      active = false;
    };
  }, []);
  return config;
}
