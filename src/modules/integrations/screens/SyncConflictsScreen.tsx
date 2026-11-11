// Mobile - Conflits de synchronisation | Module M11 Calendrier externe | Phase S10
// Guide d'API CI-009 / CI-010 : un conflit est enregistré, jamais écrasé en silence, et jamais résolu
// sans le choix de la personne. Elle garde la version Bringo Mind ou celle de Google Agenda ; c'est définitif.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { PrimaryButton, SecondaryButton, TopBar, UndoToast, kitStyles } from '@/components/ui/kit';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';

import { integrationActions, useIntegrationsState } from '../store';
import type { SyncConflict } from '../types';

type Choice = 'keep_local' | 'keep_provider';

export default function SyncConflictsScreen() {
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
      <TopBar title="Conflits de synchronisation" fallback="/integrations" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Icon name="sync_problem" size={22} color="#b45309" />
          <Text style={styles.introText}>
            Ces événements ont été modifiés à la fois dans Bringo Mind et dans Google Agenda. Rien n’a été écrasé :
            choisissez la version à garder.
          </Text>
        </View>

        {conflicts.length === 0 ? (
          <View style={[kitStyles.card, styles.empty]}>
            <View style={styles.emptyIcon}>
              <Icon name="check" size={30} color={Serene.onPrimary} />
            </View>
            <Text style={kitStyles.title}>Tout est synchronisé</Text>
            <Text style={[kitStyles.muted, styles.center]}>Bringo Mind et Google Agenda sont identiques.</Text>
            <SecondaryButton label="Retour aux connexions" onPress={() => (router.canGoBack() ? router.back() : router.replace('/integrations'))} />
          </View>
        ) : (
          conflicts.map((conflict) => {
            const choice = choices[conflict.id];
            return (
              <View key={conflict.id} style={[kitStyles.card, styles.conflict]}>
                <View style={styles.head}>
                  <View style={styles.flex}>
                    <Text style={kitStyles.title}>{conflict.title}</Text>
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
                  value={conflict.local.value}
                  meta={conflict.local.changedAt}
                  selected={choice === 'keep_local'}
                  onPress={() => setChoices((current) => ({ ...current, [conflict.id]: 'keep_local' }))}
                />
                <Option
                  label="Google Agenda"
                  icon="event"
                  value={conflict.provider.value}
                  meta={conflict.provider.changedAt}
                  selected={choice === 'keep_provider'}
                  onPress={() => setChoices((current) => ({ ...current, [conflict.id]: 'keep_provider' }))}
                />

                <PrimaryButton
                  label={choice ? 'Garder cette version' : 'Choisissez une version'}
                  icon="check"
                  disabled={!choice}
                  onPress={() => resolve(conflict)}
                />
                <Text style={styles.hint}>L’autre version sera remplacée des deux côtés. Ce choix est définitif.</Text>
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
  meta,
  selected,
  onPress,
}: {
  label: string;
  icon: string;
  value: string;
  meta: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label} : ${value}`}
      onPress={onPress}>
      <View style={styles.optionTop}>
        <Icon name={icon} size={18} color={Tint.navy} />
        <Text style={styles.optionLabel}>{label}</Text>
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected ? <Icon name="check" size={14} color={Serene.onPrimary} /> : null}
        </View>
      </View>
      <Text style={styles.optionValue}>{value}</Text>
      <Text style={styles.optionMeta}>{meta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: 4,
    paddingBottom: 40,
    gap: 14,
  },
  intro: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  introText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Tint.navy,
  },
  conflict: {
    gap: 10,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  field: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: '#b45309',
  },
  link: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.primary,
  },
  option: {
    gap: 4,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: Tint.black,
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
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#b9c4d6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: Tint.black,
    borderColor: Tint.black,
  },
  optionValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    lineHeight: 22,
    color: Tint.navy,
  },
  optionMeta: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  hint: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
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
    backgroundColor: Tint.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
