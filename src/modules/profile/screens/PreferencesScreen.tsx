// S-21 - Préférences | Module M09 Profil | Phase S8
// Langue, région (fuseau, formats, devise), affichage et accessibilité. Aperçu en direct.
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, Chip, PrimaryButton, TopBar, useKitStyles } from '@/components/ui/kit';
import { FieldLabel, RadioRow, SettingsRow, SettingsSection, ToggleSwitch, settingsStyles } from '@/components/ui/settings';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily } from '@/constants/design';

import {
  CALENDAR_VIEWS,
  CURRENCIES,
  DATE_FORMATS,
  LANGUAGES,
  TEXT_SIZES,
  THEMES,
  TIME_FORMATS,
  timezoneOptions,
  WEEK_STARTS,
} from '../data';
import { profileActions, useProfileState, type Preferences } from '../store';

export default function PreferencesScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const saved = useProfileState().preferences;
  const [draft, setDraft] = useState<Preferences>(saved);
  const [zoneSheet, setZoneSheet] = useState(false);
  const TIMEZONES = timezoneOptions(saved.timezone);

  const set = <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const dirty = (Object.keys(draft) as (keyof Preferences)[]).some((key) => draft[key] !== saved[key]);

  const zone = TIMEZONES.find((entry) => entry.key === draft.timezone);
  const sample = [
    `Mardi ${DATE_FORMATS.find((entry) => entry.key === draft.dateFormat)?.sample}`,
    TIME_FORMATS.find((entry) => entry.key === draft.timeFormat)?.sample,
    CURRENCIES.find((entry) => entry.key === draft.currency)?.sample,
  ].join(' • ');

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top', 'bottom']}>
      <TopBar title="Préférences" fallback="/profile" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        {/* Aperçu en direct : la personne voit l'effet avant d'enregistrer */}
        <View style={styles.preview}>
          <Icon name="visibility" size={20} color={c.link} />
          <View style={styles.flex}>
            <Text style={styles.previewLabel}>Aperçu</Text>
            <Text style={styles.previewText}>{sample}</Text>
          </View>
        </View>

        <SettingsSection title="Langue" icon="language">
          {LANGUAGES.map((entry, index) => (
            <RadioRow
              key={entry.key}
              first={index === 0}
              badge={entry.badge}
              title={entry.title}
              subtitle={entry.subtitle}
              selected={draft.language === entry.key}
              onPress={() => set('language', entry.key)}
            />
          ))}
        </SettingsSection>

        <SettingsSection title="Région" icon="public" footer="Les dates et heures s’affichent dans votre fuseau horaire.">
          <SettingsRow
            first
            icon="schedule"
            title="Fuseau horaire"
            subtitle={zone ? `${zone.title} • ${zone.subtitle}` : draft.timezone}
            onPress={() => setZoneSheet(true)}
          />
          <ChipGroup label="Format de date">
            {DATE_FORMATS.map((entry) => (
              <Chip key={entry.key} label={entry.label} selected={draft.dateFormat === entry.key} onPress={() => set('dateFormat', entry.key)} />
            ))}
          </ChipGroup>
          <ChipGroup label="Format de l’heure">
            {TIME_FORMATS.map((entry) => (
              <Chip key={entry.key} label={entry.label} selected={draft.timeFormat === entry.key} onPress={() => set('timeFormat', entry.key)} />
            ))}
          </ChipGroup>
          <ChipGroup label="Devise">
            {CURRENCIES.map((entry) => (
              <Chip key={entry.key} label={entry.label} selected={draft.currency === entry.key} onPress={() => set('currency', entry.key)} />
            ))}
          </ChipGroup>
          <ChipGroup label="Premier jour de la semaine">
            {WEEK_STARTS.map((entry) => (
              <Chip key={entry.key} label={entry.label} selected={draft.weekStart === entry.key} onPress={() => set('weekStart', entry.key)} />
            ))}
          </ChipGroup>
        </SettingsSection>

        <SettingsSection title="Affichage" icon="palette">
          <ChipGroup label="Thème" first>
            {THEMES.map((entry) => (
              <Chip key={entry.key} label={entry.label} icon={entry.icon} selected={draft.theme === entry.key} onPress={() => set('theme', entry.key)} />
            ))}
          </ChipGroup>
          <ChipGroup label="Taille du texte">
            {TEXT_SIZES.map((entry) => (
              <Chip key={entry.key} label={entry.label} selected={draft.textSize === entry.key} onPress={() => set('textSize', entry.key)} />
            ))}
          </ChipGroup>
          <ChipGroup label="Vue du calendrier à l’ouverture">
            {CALENDAR_VIEWS.map((entry) => (
              <Chip key={entry.key} label={entry.label} selected={draft.calendarView === entry.key} onPress={() => set('calendarView', entry.key)} />
            ))}
          </ChipGroup>
        </SettingsSection>

        <SettingsSection title="Accessibilité" icon="accessibility_new">
          <SettingsRow
            first
            icon="motion_photos_off"
            title="Réduire les animations"
            subtitle="Limiter les transitions et le carrousel"
            right={<ToggleSwitch value={draft.reduceMotion} label="Réduire les animations" onValueChange={(value) => set('reduceMotion', value)} />}
          />
          <SettingsRow
            icon="vibration"
            title="Retour haptique"
            subtitle="Vibrations légères lors des actions"
            right={<ToggleSwitch value={draft.haptics} label="Retour haptique" onValueChange={(value) => set('haptics', value)} />}
          />
        </SettingsSection>

        <View style={styles.sync}>
          <Icon name="sync" size={18} color={c.muted} />
          <Text style={styles.syncText}>Vos préférences sont synchronisées sur tous vos appareils.</Text>
        </View>
      </ScrollView>

      {/* « Enregistrer » apparaît seulement quand quelque chose a changé */}
      {dirty ? (
      <View style={styles.footer}>
        <PrimaryButton
          label="Enregistrer les préférences"
          icon="check"
          disabled={!dirty}
          onPress={() => {
            profileActions.savePreferences(draft);
            profileActions.setFlash({ text: 'Préférences enregistrées' });
            if (router.canGoBack()) router.back();
            else router.replace('/profile');
          }}
        />
      </View>
      ) : null}

      <BottomSheet visible={zoneSheet} title="Fuseau horaire" subtitle="Choisissez où vous vivez" onClose={() => setZoneSheet(false)}>
        <View style={styles.zoneList}>
          {TIMEZONES.map((entry, index) => (
            <RadioRow
              key={entry.key}
              first={index === 0}
              title={entry.title}
              subtitle={entry.subtitle}
              selected={draft.timezone === entry.key}
              onPress={() => {
                set('timezone', entry.key);
                setZoneSheet(false);
              }}
            />
          ))}
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

/** Groupe de puces défilant horizontalement, avec son libellé. */
function ChipGroup({ label, children, first }: { label: string; children: React.ReactNode; first?: boolean }) {
  return (
    <View style={[settingsStyles.inset, !first && settingsStyles.insetBorder]}>
      <FieldLabel>{label}</FieldLabel>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={settingsStyles.chips}>
        {children}
      </ScrollView>
    </View>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    content: {
      paddingTop: 4,
      paddingBottom: 24,
    },
    preview: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 14,
      borderRadius: 16,
      backgroundColor: c.tintMint,
      borderWidth: 1,
      borderColor: c.border,
    },
    previewLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.link,
    },
    previewText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 22,
      color: c.text,
    },
    sync: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 18,
      paddingHorizontal: 4,
    },
    syncText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    zoneList: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
    },
    footer: {
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
      backgroundColor: c.page,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
