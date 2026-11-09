/**
 * Configuration réseau.
 *
 * EXPO_PUBLIC_API_URL contient l'hôte de l'API, SANS le préfixe de version
 * (ex. https://api.exemple.com). Le préfixe /api/v1 est ajouté ici, une seule fois.
 * Ne jamais placer de secret dans une variable EXPO_PUBLIC_* : elle est embarquée dans l'app.
 */
const rawApiUrl = process.env.EXPO_PUBLIC_API_URL ?? '';

export const API_URL = rawApiUrl.replace(/\/+$/, '');

export const API_VERSION_PREFIX = '/api/v1';

export const API_BASE_URL = API_URL ? `${API_URL}${API_VERSION_PREFIX}` : '';

/** Délai maximal d'une requête avant abandon. */
export const REQUEST_TIMEOUT_MS = 15_000;
