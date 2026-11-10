// Sélecteur de date façon agenda du téléphone : un mois navigable, toucher un jour le choisit.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { BottomSheet } from '@/components/ui/kit';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';
import { addDays, dayOffset, formatLongDay, startOfDay } from '@/lib/demo-dates';

const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];
const LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function grid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = addDays(first, -((first.getDay() + 6) % 7));
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index);
    return { date, inMonth: date.getMonth() === month };
  });
  return cells.slice(35).every((cell) => !cell.inMonth) ? cells.slice(0, 35) : cells;
}

export function DatePickerSheet({
  visible,
  title,
  value,
  minDate,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  value: Date;
  /** Jours antérieurs désactivés (ex. fin avant le début). */
  minDate?: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}) {
  const [cursor, setCursor] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1));
  const [lastValue, setLastValue] = useState(value);

  // Réaligne le mois affiché quand la valeur change de l'extérieur.
  if (lastValue.getTime() !== value.getTime()) {
    setLastValue(value);
    setCursor(new Date(value.getFullYear(), value.getMonth(), 1));
  }

  const cells = grid(cursor.getFullYear(), cursor.getMonth());
  const move = (delta: number) => setCursor((date) => new Date(date.getFullYear(), date.getMonth() + delta, 1));

  return (
    <BottomSheet visible={visible} title={title} subtitle={formatLongDay(value)} onClose={onClose}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Mois précédent"
          onPress={() => move(-1)}>
          <Icon name="chevron_left" size={24} color={Tint.navy} />
        </Pressable>
        <Text style={styles.month}>
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </Text>
        <Pressable
          style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Mois suivant"
          onPress={() => move(1)}>
          <Icon name="chevron_right" size={24} color={Tint.navy} />
        </Pressable>
      </View>

      <View style={styles.letters}>
        {LETTERS.map((letter, index) => (
          <Text key={`${letter}-${index}`} style={styles.letter}>
            {letter}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map(({ date, inMonth }) => {
          const selected = dayOffset(date) === dayOffset(value);
          const today = dayOffset(date) === 0;
          const disabled = minDate ? startOfDay(date) < startOfDay(minDate) : false;
          return (
            <Pressable
              key={date.toISOString()}
              style={styles.cell}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={formatLongDay(date)}
              accessibilityState={{ selected, disabled }}
              onPress={() => {
                onSelect(startOfDay(date));
                onClose();
              }}>
              <View style={[styles.day, today && styles.today, selected && styles.selected]}>
                <Text
                  style={[
                    styles.dayText,
                    !inMonth && styles.outText,
                    disabled && styles.disabledText,
                    selected && styles.selectedText,
                  ]}>
                  {date.getDate()}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Tint.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  month: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
    color: Tint.navy,
  },
  letters: {
    flexDirection: 'row',
  },
  letter: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  today: {
    borderWidth: 2,
    borderColor: Tint.primary,
  },
  selected: {
    backgroundColor: Tint.black,
    borderColor: Tint.black,
  },
  dayText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  outText: {
    color: '#b6bfcd',
  },
  disabledText: {
    color: '#d3d9e3',
  },
  selectedText: {
    color: Serene.onPrimary,
  },
});
