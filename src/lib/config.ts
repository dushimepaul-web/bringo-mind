/**
 * Configuration réseau.
 *
 * EXPO_PUBLIC_API_URL contient l'hôte de l'API, SANS le préfixe de version
 * (ex. https://api.exemple.com). Le préfixe /api/v1 est ajouté ici, une seule fois.
 * Ne jamais placer de secret dans une variable EXPO_PUBLIC_* : elle est embarquée dans l'app.
 */
/** Hôte de production utilisé si EXPO_PUBLIC_API_URL n'est pas défini. */
const DEFAULT_API_URL = 'https://app.bringomind.com';

const rawApiUrl = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;

export const API_URL = rawApiUrl.replace(/\/+$/, '');

export const API_VERSION_PREFIX = '/api/v1';

export const API_BASE_URL = API_URL ? `${API_URL}${API_VERSION_PREFIX}` : '';

/** Délai maximal d'une requête avant abandon. */
export const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Source des données :
 * - « api » (par défaut) : vraie API (EXPO_PUBLIC_API_URL, sinon l'hôte de production) ;
 * - « demo » : données de démonstration en mémoire (EXPO_PUBLIC_DATA_MODE=demo), aucune requête réseau.
 * Les écrans ne changent pas : seuls les services des modules lisent ce réglage.
 */
export const DATA_MODE: 'demo' | 'api' =
  process.env.EXPO_PUBLIC_DATA_MODE === 'demo' || !API_BASE_URL ? 'demo' : 'api';

export const IS_DEMO = DATA_MODE === 'demo';
