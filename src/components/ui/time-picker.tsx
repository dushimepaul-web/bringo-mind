// Sélecteur d'heure libre partagé : toutes les heures, minutes par pas de 5.
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { FontFamily, Serene, Tint } from '@/constants/design';

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const MINUTES = Array.from({ length: 12 }, (_, index) => index * 5);
const pad = (value: number) => String(value).padStart(2, '0');

export function formatHour(hours: number, minutes: number): string {
  return `${pad(hours)}h${pad(minutes)}`;
}

export function TimePicker({
  hours,
  minutes,
  onChange,
  onDone,
}: {
  hours: number;
  minutes: number;
  onChange: (hours: number, minutes: number) => void;
  onDone: () => void;
}) {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.label}>Choisir l’heure</Text>
        <Text style={styles.value} accessibilityLiveRegion="polite">
          {formatHour(hours, minutes)}
        </Text>
      </View>

      <Text style={styles.caption}>Heures</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {HOURS.map((hour) => {
          const selected = hour === hours;
          return (
            <Pressable
              key={hour}
              style={[styles.cell, selected && styles.cellSelected]}
              accessibilityRole="button"
              accessibilityLabel={`${pad(hour)} heures`}
              accessibilityState={{ selected }}
              onPress={() => onChange(hour, minutes)}>
              <Text style={[styles.cellText, selected && styles.cellTextSelected]}>{pad(hour)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.caption}>Minutes</Text>
      <View style={styles.grid}>
        {MINUTES.map((minute) => {
          const selected = minute === minutes;
          return (
            <Pressable
              key={minute}
              style={[styles.cell, styles.minuteCell, selected && styles.cellSelected]}
              accessibilityRole="button"
              accessibilityLabel={`${pad(minute)} minutes`}
              accessibilityState={{ selected }}
              onPress={() => onChange(hours, minute)}>
              <Text style={[styles.cellText, selected && styles.cellTextSelected]}>{pad(minute)}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={({ pressed }) => [styles.done, pressed && styles.donePressed]}
        accessibilityRole="button"
        onPress={onDone}>
        <Icon name="check" size={18} color={Tint.primary} />
        <Text style={styles.doneText}>Valider {formatHour(hours, minutes)}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Tint.softer,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
  },
  value: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    color: Tint.navy,
    fontVariant: ['tabular-nums'],
  },
  caption: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  row: {
    gap: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cell: {
    width: 52,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minuteCell: {
    height: 44,
    borderRadius: 12,
  },
  cellSelected: {
    backgroundColor: Tint.black,
    borderColor: Tint.black,
  },
  cellText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
    fontVariant: ['tabular-nums'],
  },
  cellTextSelected: {
    color: Serene.onPrimary,
  },
  done: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  donePressed: {
    backgroundColor: Tint.soft,
  },
  doneText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.primary,
  },
});
