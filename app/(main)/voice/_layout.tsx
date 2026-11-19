import { Stack } from 'expo-router';

import { ThemedScreen } from '@/components/themed-screen';

// Écrans convertis au mode sombre : ils et les éléments partagés suivent l'apparence choisie.
export default function Layout() {
  return (
    <ThemedScreen>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemedScreen>
  );
}
