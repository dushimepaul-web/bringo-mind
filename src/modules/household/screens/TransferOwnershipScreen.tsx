// S-18 - Transfert de propriété du foyer | Module M08 Foyer partagé | Phase S7
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

const CANDIDATES = [
  {
    id: 'thomas',
    initial: 'T',
    name: 'Thomas Martin',
    email: 'thomas.martin@email.fr',
    role: 'Admin',
    eligible: true,
  },
  {
    id: 'leo',
    initial: 'L',
    name: 'Léo Martin',
    email: 'leo.martin@email.fr',
    role: 'Membre',
    eligible: false,
  },
];

export default function TransferOwnershipScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);

  const selected = CANDIDATES.find((candidate) => candidate.id === selectedId);
  const canTransfer = Boolean(selected) && confirmed;

  if (done && selected) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <Icon name="arrow_back" size={22} color={Serene.onSurface} />
          </Pressable>
          <Text style={styles.headerTitle}>Transfert de propriété</Text>
          <View style={styles.headerButton} />
        </View>

        <View style={styles.doneWrap}>
          <View style={styles.doneIcon}>
            <Icon name="swap_horiz" size={34} color={Serene.success} />
          </View>
          <Text style={styles.doneTitle}>Propriété transférée</Text>
          <Text style={styles.doneText}>
            {selected.name} est désormais propriétaire du Foyer Martin. Vous conservez votre
            accès en tant qu’administrateur.
          </Text>
          <Pressable
            style={styles.transferButton}
            accessibilityRole="button"
            onPress={() => router.replace('/household/members')}>
            <Icon name="group" size={18} color={Serene.onPrimary} />
            <Text style={styles.transferButtonText}>Retour aux membres</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Transfert de propriété</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.warningCard}>
          <Icon name="warning" size={20} color={Serene.error} />
          <View style={styles.warningBody}>
            <Text style={styles.warningTitle}>Action sensible</Text>
            <Text style={styles.warningText}>
              Le nouveau propriétaire pourra gérer les membres, les rôles et supprimer le
              foyer. Vous deviendrez administrateur.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Propriétaire actuel</Text>
        <View style={styles.currentCard}>
          <View style={styles.avatarOwner}>
            <Text style={styles.avatarInitial}>C</Text>
          </View>
          <View style={styles.currentBody}>
            <Text style={styles.currentName}>Claire Martin</Text>
            <Text style={styles.currentEmail}>claire.martin@email.fr</Text>
          </View>
          <View style={styles.ownerPill}>
            <Text style={styles.ownerPillText}>Propriétaire</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Choisir le nouveau propriétaire</Text>
        <View style={styles.list}>
          {CANDIDATES.map((candidate) => {
            const active = selectedId === candidate.id;

            return (
              <Pressable
                key={candidate.id}
                style={[
                  styles.candidateCard,
                  active && styles.candidateCardActive,
                  !candidate.eligible && styles.candidateCardDisabled,
                ]}
                disabled={!candidate.eligible}
                onPress={() => setSelectedId(candidate.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active, disabled: !candidate.eligible }}>
                <View
                  style={[
                    styles.avatar,
                    candidate.eligible ? styles.avatarMember : styles.avatarChild,
                  ]}>
                  <Text style={styles.avatarInitial}>{candidate.initial}</Text>
                </View>
                <View style={styles.candidateBody}>
                  <Text style={styles.candidateName}>{candidate.name}</Text>
                  <Text style={styles.candidateEmail}>{candidate.email}</Text>
                  <Text style={styles.candidateRole}>
                    {candidate.eligible ? candidate.role : 'Compte enfant • non éligible'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    active && styles.radioActive,
                    !candidate.eligible && styles.radioDisabled,
                  ]}>
                  {active ? <Icon name="check" size={12} color={Serene.onPrimary} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={styles.confirmRow}
          onPress={() => setConfirmed((value) => !value)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: confirmed }}>
          <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
            {confirmed ? <Icon name="check" size={13} color={Serene.onPrimary} /> : null}
          </View>
          <Text style={styles.confirmText}>
            Je comprends que cette action transfère définitivement la propriété du foyer.
          </Text>
        </Pressable>

        <View style={styles.infoCard}>
          <Icon name="info" size={16} color={Serene.onSurfaceVariant} />
          <Text style={styles.infoText}>
            Une notification sera envoyée à tous les membres. Le transfert est journalisé dans
            l’activité du foyer.
          </Text>
        </View>

        <Pressable
          style={[styles.transferButton, !canTransfer && styles.transferButtonDisabled]}
          disabled={!canTransfer}
          onPress={() => setDone(true)}
          accessibilityRole="button">
          <Icon name="swap_horiz" size={18} color={Serene.onPrimary} />
          <Text style={styles.transferButtonText}>
            {selected ? `Transférer à ${selected.name.split(' ')[0]}` : 'Transférer la propriété'}
          </Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
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
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: Radius.lg,
    backgroundColor: Serene.errorContainer,
  },
  warningBody: {
    flex: 1,
  },
  warningTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onErrorContainer,
  },
  warningText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onErrorContainer,
    marginTop: 2,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
    marginTop: Space.lg,
    marginBottom: Space.sm,
  },
  currentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  avatarOwner: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMember: {
    backgroundColor: Serene.secondary,
  },
  avatarChild: {
    backgroundColor: Serene.outlineVariant,
  },
  avatarInitial: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
  currentBody: {
    flex: 1,
    minWidth: 0,
  },
  currentName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  currentEmail: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  ownerPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
  },
  ownerPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 9,
    lineHeight: 13,
    color: Serene.onPrimary,
  },
  list: {
    gap: 10,
  },
  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  candidateCardActive: {
    borderColor: Serene.secondary,
    backgroundColor: Serene.secondaryContainer,
  },
  candidateCardDisabled: {
    backgroundColor: Serene.surfaceContainerLow,
    opacity: 0.7,
  },
  candidateBody: {
    flex: 1,
    minWidth: 0,
  },
  candidateName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  candidateEmail: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  candidateRole: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
    marginTop: 1,
  },
  radio: {
    width: 22,
    height: 22,
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
  radioDisabled: {
    backgroundColor: Serene.surfaceContainerHigh,
    borderColor: Serene.surfaceContainerHigh,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: Space.lg,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Serene.outlineVariant,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    borderWidth: 0,
    backgroundColor: Serene.secondary,
  },
  confirmText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
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
  transferButton: {
    height: 48,
    marginTop: Space.lg,
    borderRadius: Radius.xl,
    backgroundColor: Serene.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.floating,
  },
  transferButtonDisabled: {
    backgroundColor: Serene.surfaceDim,
  },
  transferButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
  cancelButton: {
    height: 40,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  doneWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Space.gutter,
    paddingTop: Space.xl,
    gap: 8,
  },
  doneIcon: {
    width: 76,
    height: 76,
    borderRadius: Radius.full,
    backgroundColor: Serene.successContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  doneTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
  },
  doneText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
  },
});
