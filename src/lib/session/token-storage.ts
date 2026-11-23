import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import type { StoredSession } from './types';

/**
 * Persistance de la session locale (jeton d'accès + utilisateur) :
 * - iOS / Android : Keychain / Keystore via expo-secure-store ;
 * - Web : mémoire uniquement (aucun jeton dans localStorage).
 *
 * Le jeton de renouvellement n'est pas ici : le backend le garde dans un cookie httpOnly.
 * Ce stockage sert à rouvrir l'app sans réseau et à savoir qu'une session existait.
 */
const SESSION_KEY = 'bringomind.session';
/** Clés de l'ancien format (jetons séparés), effacées au passage. */
const LEGACY_KEYS = ['bringomind.access_token', 'bringomind.refresh_token'];

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

let memory: StoredSession | null = null;

export async function readSession(): Promise<StoredSession | null> {
  if (!isNative) return memory;
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    return typeof parsed?.accessToken === 'string' ? parsed : null;
  } catch {
    // Trousseau illisible (restauration d'appareil, données corrompues) : session vide.
    return null;
  }
}

export async function writeSession(session: StoredSession): Promise<void> {
  if (!isNative) {
    memory = session;
    return;
  }
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function deleteSession(): Promise<void> {
  if (!isNative) {
    memory = null;
    return;
  }
  await Promise.all([SESSION_KEY, ...LEGACY_KEYS].map((key) => SecureStore.deleteItemAsync(key).catch(() => undefined)));
}
