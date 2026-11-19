// Roue à faire défiler, comme sur un téléphone : 3 lignes visibles (la précédente, la valeur choisie
// en grand et en gras, la suivante en gris clair), sur fond gris clair. On choisit en faisant défiler
// ou en touchant une ligne. Utilisée pour la date et pour l'heure (heures : minutes).
import { useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily } from '@/constants/design';

const ITEM = 54;
const VISIBLE = 3;
const PAD = ((VISIBLE - 1) / 2) * ITEM;

export type WheelItem = { key: string; label: string };

export function WheelList({
  items,
  index,
  onChange,
  label,
  size = 'large',
  style,
}: {
  items: WheelItem[];
  index: number;
  onChange: (index: number) => void;
  /** Nom de la roue pour le lecteur d'écran (« Date », « Heures », « Minutes »). */
  label: string;
  /** « large » pour les chiffres de l'heure, « medium » pour les dates. */
  size?: 'large' | 'medium';
  style?: StyleProp<ViewStyle>;
}) {
  const { styles } = useLook();
  const ref = useRef<ScrollViewInstance>(null);
  const placed = useRef(false);
  const current = Math.max(0, Math.min(items.length - 1, index));

  const indexAt = (y: number) => Math.min(items.length - 1, Math.max(0, Math.round(y / ITEM)));

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = indexAt(event.nativeEvent.contentOffset.y);
    if (next !== current) onChange(next);
  };

  // Recale exactement sur une ligne à la fin du geste (utile sur le web).
  const settle = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    ref.current?.scrollTo({ y: indexAt(event.nativeEvent.contentOffset.y) * ITEM, animated: true });
  };

  return (
    <View style={[styles.wheel, style]} accessibilityLabel={`${label} : ${items[current]?.label ?? ''}`}>
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM}
        decelerationRate="fast"
        scrollEventThrottle={16}
        nestedScrollEnabled
        onScroll={onScroll}
        onMomentumScrollEnd={settle}
        onScrollEndDrag={settle}
        onLayout={() => {
          if (placed.current) return;
          placed.current = true;
          ref.current?.scrollTo({ y: current * ITEM, animated: false });
        }}
        contentContainerStyle={styles.content}>
        {items.map((item, itemIndex) => {
          const selected = itemIndex === current;
          return (
            <Pressable
              key={item.key}
              style={styles.item}
              accessibilityRole="button"
              accessibilityLabel={`${label} : ${item.label}`}
              accessibilityState={{ selected }}
              onPress={() => {
                onChange(itemIndex);
                ref.current?.scrollTo({ y: itemIndex * ITEM, animated: true });
              }}>
              <Text
                numberOfLines={1}
                style={[
                  size === 'large' ? styles.textLarge : styles.textMedium,
                  selected ? styles.selected : styles.other,
                ]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

/** Deux-points entre les heures et les minutes. */
export function WheelSeparator() {
  const { styles } = useLook();
  return (
    <Text style={styles.separator} accessibilityElementsHidden importantForAccessibility="no">
      :
    </Text>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    wheel: {
      height: ITEM * VISIBLE,
    },
    content: {
      paddingVertical: PAD,
    },
    item: {
      height: ITEM,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    textLarge: {
      fontFamily: FontFamily.headingBold,
      fontSize: 34,
      lineHeight: 42,
    },
    textMedium: {
      fontFamily: FontFamily.headingBold,
      fontSize: 20,
      lineHeight: 26,
    },
    selected: {
      color: c.dark ? '#FFFFFF' : '#000000',
    },
    other: {
      color: c.dark ? '#4B5B7A' : '#C4C4C4',
    },
    separator: {
      fontFamily: FontFamily.headingBold,
      fontSize: 30,
      lineHeight: 40,
      color: c.dark ? '#FFFFFF' : '#000000',
      marginBottom: 6,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
