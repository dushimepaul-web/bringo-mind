// Bouton soleil/lune : passe l'app du mode clair au mode sombre (et inversement).
// Partagé : en-tête de l'accueil et haut des écrans d'accès (connexion, inscription…).
import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@/components/icon';
import { useAppColors } from '@/constants/app-colors';
import { Radius } from '@/constants/design';
import { setThemeMode } from '@/lib/theme';

export function ThemeToggle({ size = 40 }: { size?: number }) {
  const c = useAppColors();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { width: size, height: size, borderColor: c.border, backgroundColor: c.card },
        pressed && styles.pressed,
      ]}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={c.dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      onPress={() => setThemeMode(c.dark ? 'light' : 'dark')}>
      <Icon name={c.dark ? 'light_mode' : 'dark_mode'} size={Math.round(size * 0.55)} color={c.dark ? '#F5C84B' : c.text} filled />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
