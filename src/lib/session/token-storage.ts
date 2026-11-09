import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import type { AuthTokens } from './types';

/**
 * Persistance des jetons.
 * - iOS / Android : Keychain / Keystore via expo-secure-store.
 * - Web : mémoire uniquement. Aucun jeton n'est écrit dans localStorage ;
 *   la session web ne survit donc pas à un rechargement (à revoir avec l'équipe Web).
 */
const ACCESS_KEY = 'plaa.access_token';
const REFRESH_KEY = 'plaa.refresh_token';

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

let memory: AuthTokens | null = null;

export async function readTokens(): Promise<AuthTokens | null> {
  if (!isNative) {
    return memory;
  }

  try {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_KEY),
      SecureStore.getItemAsync(REFRESH_KEY),
    ]);
    return accessToken && refreshToken ? { accessToken, refreshToken } : null;
  } catch {
    // Trousseau illisible (ex. restauration d'appareil) : on repart d'une session vide.
    return null;
  }
}

export async function writeTokens(tokens: AuthTokens): Promise<void> {
  if (!isNative) {
    memory = tokens;
    return;
  }

  await Promise.all([
    SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken),
  ]);
}

export async function deleteTokens(): Promise<void> {
  if (!isNative) {
    memory = null;
    return;
  }

  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
  ]);
}
