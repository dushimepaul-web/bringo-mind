import { randomUUID } from 'expo-crypto';

/** UUID v4 pour Idempotency-Key et X-Request-Id. */
export function newId(): string {
  return randomUUID();
}
