// Mobile - Conflits de synchronisation | Module M11 Calendrier externe | Phase S10
// Guide d'API CI-009 / CI-010 : un conflit est enregistré, jamais écrasé en silence, et jamais résolu
// sans le choix de la personne. Elle garde la version Bringo Mind ou celle de Google Agenda ; c'est définitif.
// La partie qui change (heure, lieu…) est surlignée ; le bouton n'apparaît qu'une fois une version touchée.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { TURQUOISE } from '@/components/rings';
import { PrimaryButton, SecondaryButton, TopBar, UndoToast, useKitStyles } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';

import { integrationActions, useIntegrationsState } from '../store';
import type { SyncConflict } from '../types';

type Choice = 'keep_local' | 'keep_provider';

/** Découpe « Vendredi 17 mai • 10h00 – 10h30 » en morceaux pour repérer ce qui diffère de l'autre version. */
const parts = (value: string) => value.split(' • ');

export default function SyncConflictsScreen() {
  const { styles } = useLook();
  const kitStyles = useKitStyles();
  const { conflicts } = useIntegrationsState();
  const [choices, setChoices] = useState<Record<string, Choice>>({});
  const [toast, setToast] = useState<string | null>(null);

  const resolve = (conflict: SyncConflict) => {
    const choice = choices[conflict.id];
    if (!choice) return;
    integrationActions.resolveConflict(conflict.id, choice);
    setToast(
      choice === 'keep_local'
        ? `« ${conflict.title} » : version Bringo Mind gardée`
        : `« ${conflict.title} » : version Google Agenda gardée`,
    );
  };

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar title="Conflits" fallback="/integrations" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        {conflicts.length ? <Text style={styles.intro}>Modifiés des deux côtés : choisissez la version à garder.</Text> : null}

        {conflicts.length === 0 ? (
          <View style={[kitStyles.card, styles.empty]}>
            <View style={styles.emptyIcon}>
              <Icon name="check" size={30} color="#FFFFFF" />
            </View>
            <Text style={kitStyles.title}>Tout est synchronisé</Text>
            <Text style={[kitStyles.muted, styles.center]}>Bringo Mind et Google Agenda sont identiques.</Text>
            <SecondaryButton label="Retour aux comptes" onPress={() => (router.canGoBack() ? router.back() : router.replace('/integrations'))} />
          </View>
        ) : (
          conflicts.map((conflict) => {
            const choice = choices[conflict.id];
            const local = parts(conflict.local.value);
            const provider = parts(conflict.provider.value);
            return (
              <View key={conflict.id} style={styles.conflict}>
                <View style={styles.head}>
                  <View style={styles.flex}>
                    <Text style={styles.title}>{conflict.title}</Text>
                    <Text style={styles.field}>{conflict.field} différent</Text>
                  </View>
                  <Pressable
                    hitSlop={8}
                    accessibilityRole="link"
                    onPress={() => router.push({ pathname: '/calendar/detail', params: { id: conflict.eventId } })}>
                    <Text style={styles.link}>Voir</Text>
                  </Pressable>
                </View>

                <Option
                  label="Bringo Mind"
                  icon="smartphone"
                  value={local}
                  other={provider}
                  meta={conflict.local.changedAt}
                  selected={choice === 'keep_local'}
                  onPress={() => setChoices((current) => ({ ...current, [conflict.id]: 'keep_local' }))}
                />
                <Option
                  label="Google Agenda"
                  icon="event"
                  value={provider}
                  other={local}
                  meta={conflict.provider.changedAt}
                  selected={choice === 'keep_provider'}
                  onPress={() => setChoices((current) => ({ ...current, [conflict.id]: 'keep_provider' }))}
                />

                {choice ? (
                  <>
                    <PrimaryButton label="Garder cette version" icon="check" onPress={() => resolve(conflict)} />
                    <Text style={styles.hint}>L’autre version sera remplacée des deux côtés. Ce choix est définitif.</Text>
                  </>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>

      {toast ? <UndoToast key={toast} text={toast} onHide={() => setToast(null)} bottom={24} /> : null}
    </SafeAreaView>
  );
}

function Option({
  label,
  icon,
  value,
  other,
  meta,
  selected,
  onPress,
}: {
  label: string;
  icon: string;
  value: string[];
  other: string[];
  meta: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { c, styles } = useLook();
  return (
    <Pressable
      style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label} : ${value.join(', ')}`}
      onPress={onPress}>
      <View style={styles.optionTop}>
        <Icon name={icon} size={18} color={c.muted} />
        <Text style={styles.optionLabel}>{label}</Text>
        <View style={[styles.radio, selected && styles.radioOn]}>{selected ? <Icon name="check" size={14} color="#FFFFFF" /> : null}</View>
      </View>
      <Text style={styles.optionValue}>
        {value.map((part, index) => (
          <Text key={`${part}-${index}`}>
            {index > 0 ? ' • ' : ''}
            <Text style={other.includes(part) ? undefined : styles.changed}>{part}</Text>
          </Text>
        ))}
      </Text>
      <Text style={styles.optionMeta}>{meta}</Text>
    </Pressable>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    center: {
      textAlign: 'center',
    },
    pressed: {
      opacity: 0.85,
    },
    content: {
      paddingTop: 0,
      paddingBottom: 40,
      gap: 14,
    },
    intro: {
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 20,
      color: c.muted,
    },
    conflict: {
      gap: 10,
      padding: 14,
      borderRadius: 18,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    head: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    title: {
      fontFamily: FontFamily.headingBold,
      fontSize: 17,
      lineHeight: 23,
      color: c.text,
    },
    field: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.amberText,
    },
    link: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.link,
    },
    option: {
      gap: 4,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.dark ? '#0F1B33' : '#F7F9FB',
    },
    optionSelected: {
      borderWidth: 2,
      borderColor: TURQUOISE,
      padding: 13,
    },
    optionTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    optionLabel: {
      flex: 1,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    radio: {
      width: 24,
      height: 24,
      borderRadius: Radius.full,
      borderWidth: 2,
      borderColor: c.divider,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOn: {
      backgroundColor: TURQUOISE,
      borderColor: TURQUOISE,
    },
    optionValue: {
      fontFamily: FontFamily.headingBold,
      fontSize: 16,
      lineHeight: 24,
      color: c.text,
    },
    // La partie qui diffère de l'autre version, surlignée comme au marqueur.
    changed: {
      backgroundColor: c.tintAmber,
      color: c.dark ? c.text : c.amberText,
    },
    optionMeta: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    hint: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
      textAlign: 'center',
    },
    empty: {
      alignItems: 'center',
      gap: 8,
      paddingVertical: 24,
    },
    emptyIcon: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: c.link,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
