// Bouton rond « + » flottant en bas à droite des listes (nouvelle tâche, nouveau rappel, nouvel événement).
// Bleu nuit en clair, clair en sombre (dans un module converti). Le libellé reste lu par le lecteur d'écran.
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { useScopedColors } from '@/constants/app-colors';
import { Radius } from '@/constants/design';

export function AddFab({ label, onPress }: { label: string; onPress: () => void }) {
  const c = useScopedColors();
  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable
        style={({ pressed }) => [styles.button, { backgroundColor: c.solid }, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={label}
        hitSlop={6}
        onPress={onPress}>
        <Icon name="add" size={32} color={c.solidText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0C1A37',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.92,
  },
});
