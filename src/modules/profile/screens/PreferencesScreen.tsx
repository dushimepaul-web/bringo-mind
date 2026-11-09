// S-21 - Préférences | Module M09 Profil et paramètres | Phase S8
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

const LANGUAGES = [
  { key: 'fr', label: 'Français', native: 'Français' },
  { key: 'en', label: 'English', native: 'English' },
  { key: 'es', label: 'Español', native: 'Español' },
];

const THEMES = ['Clair', 'Sombre', 'Système'];
const DATE_FORMATS = ['JJ/MM/AAAA', 'MM/JJ/AAAA', 'AAAA-MM-JJ'];
const WEEK_STARTS = ['Lundi', 'Dimanche'];
const TEXT_SIZES = ['Normal', 'Grand', 'Très grand'];
const DEFAULT_VIEWS = ['Mois', 'Semaine', 'Jour'];

export default function PreferencesScreen() {
  const [language, setLanguage] = useState('fr');
  const [theme, setTheme] = useState('Clair');
  const [dateFormat, setDateFormat] = useState(DATE_FORMATS[0]);
  const [weekStart, setWeekStart] = useState(WEEK_STARTS[0]);
  const [textSize, setTextSize] = useState(TEXT_SIZES[0]);
  const [defaultView, setDefaultView] = useState(DEFAULT_VIEWS[0]);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [haptics, setHaptics] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={() => router.back()}>
          <Icon name="arrow_back" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Préférences</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <SectionTitle icon="language" title="Langue et région" />
        <View style={styles.card}>
          {LANGUAGES.map((option, index) => {
            const active = language === option.key;

            return (
              <View key={option.key}>
                {index > 0 ? <View style={styles.divider} /> : null}
                <Pressable
                  style={styles.radioRow}
                  onPress={() => setLanguage(option.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}>
                  <View style={styles.flagBox}>
                    <Text style={styles.flagText}>{option.key.toUpperCase()}</Text>
                  </View>
                  <View style={styles.radioBody}>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                    <Text style={styles.radioHint}>
                      {option.key === 'fr'
                        ? 'Langue de l’interface et des notifications'
                        : option.key === 'en'
                          ? 'Interface language and notifications'
                          : 'Idioma de la interfaz y notificaciones'}
                    </Text>
                  </View>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active ? <Icon name="check" size={12} color={Serene.onPrimary} /> : null}
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Fuseau horaire</Text>
          <View style={styles.selectCard}>
            <View style={styles.selectIcon}>
              <Icon name="public" size={18} color={Serene.secondary} />
            </View>
            <View style={styles.selectBody}>
              <Text style={styles.selectValue}>Europe/Paris</Text>
              <Text style={styles.selectHint}>UTC+2 • Heure d’été</Text>
            </View>
            <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
          </View>
        </View>

        <ChipField label="Format de date" options={DATE_FORMATS} value={dateFormat} onChange={setDateFormat} />
        <ChipField label="Premier jour de la semaine" options={WEEK_STARTS} value={weekStart} onChange={setWeekStart} />

        <SectionTitle icon="palette" title="Affichage" />
        <ChipField label="Thème" options={THEMES} value={theme} onChange={setTheme} />
        <ChipField label="Taille du texte" options={TEXT_SIZES} value={textSize} onChange={setTextSize} />
        <ChipField label="Vue par défaut du calendrier" options={DEFAULT_VIEWS} value={defaultView} onChange={setDefaultView} />

        <SectionTitle icon="accessibility_new" title="Accessibilité" />
        <View style={styles.card}>
          <ToggleRow
            icon="motion_photos_off"
            label="Réduire les animations"
            hint="Limiter les transitions et effets"
            value={reduceMotion}
            onChange={setReduceMotion}
          />
          <View style={styles.divider} />
          <ToggleRow
            icon="vibration"
            label="Retour haptique"
            hint="Vibrations légères lors des actions"
            value={haptics}
            onChange={setHaptics}
          />
        </View>

        <View style={styles.infoCard}>
          <Icon name="sync" size={16} color={Serene.onSurfaceVariant} />
          <Text style={styles.infoText}>
            Ces préférences sont synchronisées sur tous vos appareils connectés à votre compte.
          </Text>
        </View>

        <Pressable
          style={styles.saveButton}
          accessibilityRole="button"
          onPress={() => router.back()}>
          <Icon name="check" size={18} color={Serene.onPrimary} />
          <Text style={styles.saveButtonText}>Enregistrer les préférences</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Icon name={icon} size={17} color={Serene.onSurfaceVariant} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function ChipField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.chipsWrap}>
        {options.map((option) => {
          const active = value === option;

          return (
            <Pressable
              key={option}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange(option)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ToggleRow({
  icon,
  label,
  hint,
  value,
  onChange,
}: {
  icon: string;
  label: string;
  hint: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleIcon}>
        <Icon name={icon} size={18} color={Serene.onSurfaceVariant} />
      </View>
      <View style={styles.toggleBody}>
        <Text style={styles.radioLabel}>{label}</Text>
        <Text style={styles.radioHint}>{hint}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Serene.surfaceContainerHigh, true: Serene.secondary }}
        thumbColor={Serene.surfaceContainerLowest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Serene.surface,
  },
  header: {
    height: 56,
    paddingHorizontal: Space.gutter,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Serene.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Serene.surfaceContainerHigh,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.md,
    paddingBottom: Space.lg,
    gap: Space.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Space.sm,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
  },
  card: {
    paddingHorizontal: Space.sm,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  flagBox: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  radioBody: {
    flex: 1,
    minWidth: 0,
  },
  radioLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  radioHint: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Serene.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderWidth: 0,
    backgroundColor: Serene.secondary,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
  },
  selectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  selectIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBody: {
    flex: 1,
  },
  selectValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  selectHint: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  chipActive: {
    backgroundColor: Serene.primary,
  },
  chipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  chipTextActive: {
    color: Serene.onPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  toggleIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBody: {
    flex: 1,
    minWidth: 0,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  infoText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
  saveButton: {
    height: 48,
    borderRadius: Radius.xl,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.floating,
  },
  saveButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
});
