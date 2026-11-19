import { Stack } from 'expo-router';

import { ThemedScreen } from '@/components/themed-screen';

// Module Rappels converti au mode sombre : ses écrans et les éléments partagés suivent l'apparence choisie.
export default function Layout() {
  return (
    <ThemedScreen>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemedScreen>
  );
}
