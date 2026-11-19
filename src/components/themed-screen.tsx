// Enveloppe des écrans d'un module converti au mode sombre : active la portée sombre des éléments
// partagés (en-tête, boutons, puces, fenêtres…) et adapte la barre d'état du téléphone.
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';

import { DarkModeScope, useAppColors } from '@/constants/app-colors';

export function ThemedScreen({ children }: { children: ReactNode }) {
  const c = useAppColors();
  return (
    <DarkModeScope value>
      <StatusBar style={c.dark ? 'light' : 'dark'} />
      {children}
    </DarkModeScope>
  );
}
