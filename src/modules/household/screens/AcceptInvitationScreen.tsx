// S-18 - Accepter une invitation | Module M08 Foyer partagé | Phase S7
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

type InvitationState = 'pending' | 'accepted' | 'declined';

const SHARED_ITEMS = [
  { icon: 'task_alt', label: 'Tâches partagées du foyer' },
  { icon: 'event', label: 'Événements et rendez-vous communs' },
  { icon: 'folder_shared', label: 'Documents explicitement partagés' },
  { icon: 'history', label: 'Activité visible du foyer' },
];

const PRIVATE_ITEMS = [
  { icon: 'lock', label: 'Vos notes personnelles' },
  { icon: 'visibility_off', label: 'Vos documents privés' },
  { icon: 'notifications_off', label: 'Vos rappels personnels' },
];

export default function AcceptInvitationScreen() {
  const [state, setState] = useState<InvitationState>('pending');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          onPress={() => router.replace('/dashboard')}>
          <Icon name="close" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Invitation</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {state === 'pending' ? (
          <>
            <View style={styles.hero}>
              <View style={styles.heroRing}>
                <View style={styles.heroIcon}>
                  <Icon name="family_restroom" size={30} color={Serene.onPrimary} />
                </View>
              </View>
              <Text style={styles.heroEyebrow}>Vous êtes invité·e</Text>
              <Text style={styles.heroTitle}>Foyer Martin</Text>
              <Text style={styles.heroText}>
                Claire Martin vous invite à rejoindre son foyer en tant que membre.
              </Text>

              <View style={styles.heroPills}>
                <View style={styles.heroPill}>
                  <Icon name="badge" size={13} color={Serene.onSurfaceVariant} />
                  <Text style={styles.heroPillText}>Rôle : Membre</Text>
                </View>
                <View style={styles.heroPill}>
                  <Icon name="schedule" size={13} color={Serene.onSurfaceVariant} />
                  <Text style={styles.heroPillText}>Expire dans 6 jours</Text>
                </View>
              </View>
            </View>

            <View style={styles.accountCard}>
              <Icon name="account_circle" size={20} color={Serene.secondary} />
              <View style={styles.accountBody}>
                <Text style={styles.accountLabel}>Compte connecté</Text>
                <Text style={styles.accountValue}>jeanne.martin@email.fr</Text>
              </View>
              <View style={styles.verifiedPill}>
                <Icon name="verified" size={12} color={Serene.success} />
                <Text style={styles.verifiedText}>Vérifié</Text>
              </View>
            </View>

            <SectionTitle icon="share" title="Ce que vous partagerez" />
            <View style={styles.listCard}>
              {SHARED_ITEMS.map((item, index) => (
                <View key={item.label}>
                  {index > 0 ? <View style={styles.divider} /> : null}
                  <View style={styles.listRow}>
                    <View style={styles.listIcon}>
                      <Icon name={item.icon} size={16} color={Serene.secondary} />
                    </View>
                    <Text style={styles.listText}>{item.label}</Text>
                    <Icon name="check" size={16} color={Serene.success} />
                  </View>
                </View>
              ))}
            </View>

            <SectionTitle icon="lock" title="Ce qui reste privé" />
            <View style={[styles.listCard, styles.listCardPrivate]}>
              {PRIVATE_ITEMS.map((item, index) => (
                <View key={item.label}>
                  {index > 0 ? <View style={styles.divider} /> : null}
                  <View style={styles.listRow}>
                    <View style={[styles.listIcon, styles.listIconPrivate]}>
                      <Icon name={item.icon} size={16} color={Serene.onSurfaceVariant} />
                    </View>
                    <Text style={[styles.listText, styles.listTextPrivate]}>
                      {item.label}
                    </Text>
                    <Icon name="lock" size={14} color={Serene.outlineVariant} />
                  </View>
                </View>
              ))}
            </View>

            <Pressable
              style={styles.acceptButton}
              accessibilityRole="button"
              onPress={() => setState('accepted')}>
              <Icon name="check_circle" size={18} color={Serene.onPrimary} />
              <Text style={styles.acceptButtonText}>Accepter l’invitation</Text>
            </Pressable>

            <Pressable
              style={styles.declineButton}
              accessibilityRole="button"
              onPress={() => setState('declined')}>
              <Text style={styles.declineButtonText}>Refuser</Text>
            </Pressable>

            <Text style={styles.legalText}>
              En acceptant, vous rejoignez le foyer et pouvez consulter les éléments partagés.
              Vous pouvez quitter le foyer à tout moment.
            </Text>
          </>
        ) : state === 'accepted' ? (
          <View style={styles.resultCard}>
            <View style={[styles.resultIcon, styles.resultIconSuccess]}>
              <Icon name="check_circle" size={34} color={Serene.success} />
            </View>
            <Text style={styles.resultTitle}>Bienvenue dans le foyer !</Text>
            <Text style={styles.resultText}>
              Vous faites désormais partie du Foyer Martin. Les tâches, événements et documents
              partagés sont disponibles dans votre espace foyer.
            </Text>

            <View style={styles.resultSummary}>
              <View style={styles.resultSummaryRow}>
                <Icon name="family_restroom" size={16} color={Serene.secondary} />
                <Text style={styles.resultSummaryText}>Foyer Martin • 4 membres</Text>
              </View>
              <View style={styles.resultSummaryRow}>
                <Icon name="badge" size={16} color={Serene.secondary} />
                <Text style={styles.resultSummaryText}>Rôle : Membre</Text>
              </View>
            </View>

            <Pressable
              style={styles.acceptButton}
              accessibilityRole="button"
              onPress={() => router.replace('/household')}>
              <Icon name="arrow_forward" size={18} color={Serene.onPrimary} />
              <Text style={styles.acceptButtonText}>Ouvrir le foyer</Text>
            </Pressable>
            <Pressable
              style={styles.declineButton}
              onPress={() => router.replace('/dashboard')}>
              <Text style={styles.declineButtonText}>Retour à mon espace</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.resultCard}>
            <View style={[styles.resultIcon, styles.resultIconMuted]}>
              <Icon name="mail" size={32} color={Serene.onSurfaceVariant} />
            </View>
            <Text style={styles.resultTitle}>Invitation refusée</Text>
            <Text style={styles.resultText}>
              Vous n’avez pas rejoint le Foyer Martin. L’invitation reste valable pendant 6
              jours si vous changez d’avis.
            </Text>
            <Pressable
              style={styles.acceptButton}
              accessibilityRole="button"
              onPress={() => router.replace('/dashboard')}>
              <Icon name="home" size={18} color={Serene.onPrimary} />
              <Text style={styles.acceptButtonText}>Retour à mon espace</Text>
            </Pressable>
            <Pressable style={styles.declineButton} onPress={() => setState('pending')}>
              <Text style={styles.declineButtonText}>Revoir l’invitation</Text>
            </Pressable>
          </View>
        )}
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
    paddingTop: Space.lg,
    paddingBottom: Space.lg,
  },
  hero: {
    alignItems: 'center',
    gap: 4,
  },
  heroRing: {
    width: 84,
    height: 84,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEyebrow: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.secondary,
  },
  heroTitle: {
    ...Typography.headlineMd,
    color: Serene.onSurface,
  },
  heroText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 300,
  },
  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  heroPillText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: Space.md,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  accountBody: {
    flex: 1,
    minWidth: 0,
  },
  accountLabel: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  accountValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.successContainer,
  },
  verifiedText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.success,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Space.lg,
    marginBottom: Space.sm,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
  },
  listCard: {
    paddingHorizontal: Space.sm,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  listCardPrivate: {
    backgroundColor: Serene.surfaceContainerLow,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  listIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listIconPrivate: {
    backgroundColor: Serene.surfaceContainerHigh,
  },
  listText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  listTextPrivate: {
    color: Serene.onSurfaceVariant,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  acceptButton: {
    height: 48,
    marginTop: Space.lg,
    borderRadius: Radius.xl,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.floating,
  },
  acceptButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
  declineButton: {
    height: 44,
    marginTop: 8,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  legalText: {
    marginTop: Space.sm,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
  },
  resultCard: {
    alignItems: 'center',
    paddingTop: Space.xl,
    gap: 8,
  },
  resultIcon: {
    width: 76,
    height: 76,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  resultIconSuccess: {
    backgroundColor: Serene.successContainer,
  },
  resultIconMuted: {
    backgroundColor: Serene.surfaceContainerLow,
  },
  resultTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
    textAlign: 'center',
  },
  resultText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
  },
  resultSummary: {
    alignSelf: 'stretch',
    gap: 8,
    marginTop: Space.md,
    padding: 14,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  resultSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultSummaryText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
});
