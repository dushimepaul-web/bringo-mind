// Sélecteur de date façon agenda du téléphone : un mois navigable, toucher un jour le choisit.
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';

import { Icon } from '@/components/icon';
import { BottomSheet } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
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
/** Années proposées, de la plus récente à la plus ancienne. */
const YEARS = Array.from({ length: 2030 - 1930 + 1 }, (_, index) => 2030 - index);

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
  maxDate,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  value: Date;
  /** Jours antérieurs désactivés (ex. fin avant le début). */
  minDate?: Date;
  /** Jours postérieurs désactivés (ex. date de naissance). */
  maxDate?: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}) {
  const { c, styles } = useLook();
  const [cursor, setCursor] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1));
  const [lastValue, setLastValue] = useState(value);
  // Toucher le mois affiche la liste des années (utile pour une date de naissance).
  const [yearMode, setYearMode] = useState(false);
  const yearsRef = useRef<ScrollViewInstance>(null);
  // Années possibles selon les limites (pas d'année future pour une date de naissance).
  const years = YEARS.filter(
    (year) => (!maxDate || year <= maxDate.getFullYear()) && (!minDate || year >= minDate.getFullYear()),
  );

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
          <Icon name="chevron_left" size={24} color={c.text} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.monthButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={yearMode ? 'Revenir aux jours' : 'Choisir l’année'}
          onPress={() => setYearMode((open) => !open)}>
          <Text style={styles.month}>
            {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
          </Text>
          <Icon name={yearMode ? 'expand_less' : 'expand_more'} size={22} color={c.text} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Mois suivant"
          onPress={() => move(1)}>
          <Icon name="chevron_right" size={24} color={c.text} />
        </Pressable>
      </View>

      {yearMode ? (
        <ScrollView
          ref={yearsRef}
          style={styles.years}
          contentContainerStyle={styles.yearsGrid}
          showsVerticalScrollIndicator={false}
          onLayout={() => {
            // Ouvre la liste sur l'année affichée.
            const row = Math.floor(Math.max(0, years.indexOf(cursor.getFullYear())) / 4);
            yearsRef.current?.scrollTo({ y: Math.max(0, (row - 2) * 52), animated: false });
          }}>
          {years.map((year) => {
            const selected = year === cursor.getFullYear();
            return (
              <Pressable
                key={year}
                style={[styles.year, selected && styles.selected]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  setCursor(new Date(year, cursor.getMonth(), 1));
                  setYearMode(false);
                }}>
                <Text style={[styles.dayText, selected && styles.selectedText]}>{year}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <>
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
            const disabled =
            (minDate ? startOfDay(date) < startOfDay(minDate) : false) ||
            (maxDate ? startOfDay(date) > startOfDay(maxDate) : false);
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
        </>
      )}
    </BottomSheet>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
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
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    monthButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
    },
    years: {
      maxHeight: 300,
    },
    yearsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    year: {
      width: '22%',
      height: 44,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    month: {
      fontFamily: FontFamily.headingBold,
      fontSize: 18,
      lineHeight: 24,
      color: c.text,
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
      color: c.muted,
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
      borderColor: c.link,
    },
    selected: {
      backgroundColor: c.solid,
      borderColor: c.solid,
    },
    dayText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    outText: {
      color: '#b6bfcd',
    },
    disabledText: {
      color: '#d3d9e3',
    },
    selectedText: {
      color: c.solidText,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
