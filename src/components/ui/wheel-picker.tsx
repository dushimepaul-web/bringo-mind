// Roue à faire défiler façon téléphone (heures / minutes).
import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';

import { BottomSheet, PrimaryButton } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily } from '@/constants/design';

const ITEM = 44;
const VISIBLE = 5;
const PAD = ((VISIBLE - 1) / 2) * ITEM;
const pad2 = (value: number) => String(value).padStart(2, '0');

/** Une colonne de la roue. La valeur au centre est la valeur choisie. */
export function WheelColumn({
  values,
  value,
  onChange,
  label,
}: {
  values: number[];
  value: number;
  onChange: (value: number) => void;
  label: string;
}) {
  const { styles } = useLook();
  const ref = useRef<ScrollViewInstance>(null);
  const placed = useRef(false);
  const index = Math.max(0, values.indexOf(value));

  const indexAt = (y: number) => Math.min(values.length - 1, Math.max(0, Math.round(y / ITEM)));

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = values[indexAt(event.nativeEvent.contentOffset.y)];
    if (next !== value) onChange(next);
  };

  // Recale exactement sur une ligne à la fin du geste (utile sur le web).
  const settle = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const target = indexAt(event.nativeEvent.contentOffset.y);
    ref.current?.scrollTo({ y: target * ITEM, animated: true });
  };

  return (
    <View style={styles.column} accessibilityLabel={`${label} : ${pad2(value)}`}>
      <View style={styles.band} pointerEvents="none" />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScroll}
        onMomentumScrollEnd={settle}
        onScrollEndDrag={settle}
        onLayout={() => {
          if (placed.current) return;
          placed.current = true;
          ref.current?.scrollTo({ y: index * ITEM, animated: false });
        }}
        contentContainerStyle={styles.content}>
        {values.map((item, itemIndex) => {
          const distance = Math.abs(itemIndex - index);
          return (
            <Pressable
              key={item}
              style={styles.item}
              accessibilityRole="button"
              accessibilityLabel={`${pad2(item)} ${label}`}
              accessibilityState={{ selected: item === value }}
              onPress={() => {
                onChange(item);
                ref.current?.scrollTo({ y: itemIndex * ITEM, animated: true });
              }}>
              <Text
                style={[
                  styles.text,
                  item === value && styles.textSelected,
                  distance === 1 && styles.textNear,
                  distance >= 2 && styles.textFar,
                ]}>
                {pad2(item)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const MINUTES = Array.from({ length: 60 }, (_, minute) => minute);

/** Feuille « Choisir l'heure » avec deux roues ; la valeur n'est appliquée qu'à la validation. */
export function TimeWheelSheet({
  visible,
  title,
  hours,
  minutes,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  title: string;
  hours: number;
  minutes: number;
  onConfirm: (hours: number, minutes: number) => void;
  onClose: () => void;
}) {
  const { styles } = useLook();
  const [h, setH] = useState(hours);
  const [m, setM] = useState(minutes);
  const [opened, setOpened] = useState(false);

  // À chaque ouverture, repart de l'heure actuelle du champ.
  if (visible && !opened) {
    setOpened(true);
    setH(hours);
    setM(minutes);
  } else if (!visible && opened) {
    setOpened(false);
  }

  return (
    <BottomSheet visible={visible} title={title} subtitle={`${pad2(h)}h${pad2(m)}`} onClose={onClose}>
      {visible ? (
        <View style={styles.wheels}>
          <WheelColumn values={HOURS} value={h} onChange={setH} label="heures" />
          <Text style={styles.separator}>:</Text>
          <WheelColumn values={MINUTES} value={m} onChange={setM} label="minutes" />
        </View>
      ) : null}
      <PrimaryButton
        label={`Valider ${pad2(h)}h${pad2(m)}`}
        icon="check"
        onPress={() => {
          onConfirm(h, m);
          onClose();
        }}
      />
    </BottomSheet>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    wheels: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 8,
    },
    separator: {
      fontFamily: FontFamily.headingBold,
      fontSize: 28,
      lineHeight: 34,
      color: c.text,
    },
    column: {
      width: 96,
      height: ITEM * VISIBLE,
      overflow: 'hidden',
    },
    band: {
      position: 'absolute',
      top: PAD,
      left: 0,
      right: 0,
      height: ITEM,
      borderRadius: 12,
      backgroundColor: c.soft,
      borderWidth: 1,
      borderColor: c.border,
    },
    content: {
      paddingVertical: PAD,
    },
    item: {
      height: ITEM,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontFamily: FontFamily.headingBold,
      fontSize: 22,
      lineHeight: 28,
      color: c.text,
      fontVariant: ['tabular-nums'],
    },
    textSelected: {
      fontSize: 26,
      lineHeight: 32,
    },
    textNear: {
      color: c.muted,
      opacity: 0.7,
    },
    textFar: {
      color: c.muted,
      opacity: 0.35,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
