// S-07 - Tableau de bord | Module M03 Tableau de bord | Phase S3
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Greeting />
        <AiSuggestionCard />
        <QuickActions />

        <SectionHeader
          title="Mes priorités du jour"
          count={3}
          action="Tout voir"
          onPressAction={() => router.push('/tasks')}
        />
        <View style={styles.stack}>
          <DeclarationCard />
          <CarInspectionCard />
          <HealthRefundCard />
        </View>

        <SectionHeader
          title="Prochains rendez-vous & Échéances"
          action="Calendrier"
          onPressAction={() => router.push('/calendar')}
        />
        <View style={styles.stack}>
          <AppointmentCard />
          <TaxDeadlineCard />
        </View>

        <SectionHeader
          title="Document récent"
          action="Archives"
          onPressAction={() => router.push('/documents')}
        />
        <View style={styles.stack}>
          <RecentDocumentCard />
        </View>

        <HouseholdInviteCard />
      </ScrollView>
    </SafeAreaView>
  );
}

function Greeting() {
  return (
    <View style={styles.greeting}>
      <View style={styles.greetingRow}>
        <View style={styles.greetingNameRow}>
          <Text style={styles.greetingName}>Bonjour Claire</Text>
          <View style={styles.verified}>
            <Icon name="verified" size={15} filled color={Serene.onSecondaryFixed} />
          </View>
        </View>
        <View style={styles.veille}>
          <View style={styles.veilleDot} />
          <Text style={styles.veilleText}>Veille active</Text>
        </View>
      </View>
      <View style={styles.subRow}>
        <Text style={styles.subText}>Mardi 14 mai</Text>
        <View style={styles.bullet} />
        <Text style={styles.subStrong}>3 actions en attente</Text>
      </View>
    </View>
  );
}

function AiSuggestionCard() {
  return (
    <View style={styles.aiCard}>
      <View style={styles.aiBlob} />
      <View style={styles.aiRow}>
        <View style={styles.aiIcon}>
          <Icon name="bolt" size={20} filled color={Serene.onSecondaryContainer} />
        </View>
        <View style={styles.flex}>
          <View style={styles.aiLabelRow}>
            <Icon name="auto_awesome" size={14} color={Serene.secondary} />
            <Text style={styles.aiLabel}>Suggestion Kora IA</Text>
          </View>
          <Text style={styles.title}>Facture EDF reçue</Text>
          <Text style={styles.aiBody}>
            <Text style={styles.aiAmount}>84,20 €</Text> prévu le 21 mai • Prélèvement automatique
          </Text>

          <View style={styles.aiActions}>
            <Pressable style={styles.primaryButton} onPress={() => router.push('/documents')}>
              <Text style={styles.primaryButtonText}>Vérifier</Text>
              <Icon name="arrow_forward" size={16} color={Serene.onPrimary} />
            </Pressable>
            <Pressable style={styles.ghostButton}>
              <Text style={styles.ghostButtonText}>Ignorer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function QuickActions() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.quickRow}
      style={styles.quickScroll}>
      <Pressable style={styles.quickAction} onPress={() => router.push('/documents')}>
        <View style={[styles.quickIcon, { backgroundColor: Serene.secondaryContainer }]}>
          <Icon name="document_scanner" size={16} color={Serene.onSecondaryContainer} />
        </View>
        <Text style={styles.quickLabel}>Scanner document</Text>
      </Pressable>

      <Pressable style={styles.quickAction} onPress={() => router.push('/tasks/add')}>
        <View style={[styles.quickIcon, { backgroundColor: Serene.surfaceContainerHigh }]}>
          <Icon name="add_task" size={16} color={Serene.onSurface} />
        </View>
        <Text style={styles.quickLabel}>Nouvelle tâche</Text>
      </Pressable>

      <Pressable style={styles.koraButton} onPress={() => router.push('/assistant')}>
        <Icon name="arrow_back_ios_new" size={16} color={Serene.secondaryFixed} />
        <Text style={styles.koraButtonText}>Demander à Kora</Text>
      </Pressable>
    </ScrollView>
  );
}

function SectionHeader({
  title,
  count,
  action,
  onPressAction,
}: {
  title: string;
  count?: number;
  action?: string;
  onPressAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {count != null ? (
          <View style={styles.countPill}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        ) : null}
      </View>
      {action ? (
        <Pressable onPress={onPressAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function DeclarationCard() {
  return (
    <View style={styles.card}>
      <View style={styles.priorityTop}>
        <View style={styles.priorityLeft}>
          <View style={[styles.priorityIcon, { backgroundColor: Serene.errorContainer }]}>
            <Icon name="draw" size={18} color={Serene.onErrorContainer} />
          </View>
          <View style={styles.flexMin}>
            <Text style={styles.title} numberOfLines={1}>
              Renvoyer attestation de domicile signée
            </Text>
            <Text style={styles.muted}>Bailleur Foncia • Format PDF certifié</Text>
          </View>
        </View>
        <View style={styles.urgentBadge}>
          <Text style={styles.urgentBadgeText}>Aujourd&apos;hui 17h</Text>
        </View>
      </View>

      <View style={styles.priorityBottom}>
        <View style={styles.highRow}>
          <View style={styles.highDot} />
          <Text style={styles.highText}>Haute priorité</Text>
        </View>
        <Pressable style={styles.tealButton} onPress={() => router.push('/documents')}>
          <Text style={styles.tealButtonText}>Signer &amp; joindre</Text>
          <Icon name="send" size={15} color={Serene.onSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

function CarInspectionCard() {
  return (
    <View style={[styles.card, styles.rowBetween]}>
      <View style={styles.priorityLeft}>
        <View style={[styles.priorityIcon, { backgroundColor: Serene.surfaceContainerHigh }]}>
          <Icon name="directions_car" size={18} color={Serene.onSurface} />
        </View>
        <View style={styles.flexMin}>
          <Text style={styles.title} numberOfLines={1}>
            Contrôle technique Peugeot 208
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.mutedNoMargin}>AutoSécurité République</Text>
            <View style={styles.bullet} />
            <Text style={styles.metaStrong}>Demain</Text>
          </View>
        </View>
      </View>
      <Pressable
        style={styles.squareButton}
        accessibilityLabel="Ajouter au calendrier"
        onPress={() => router.push('/calendar/add')}>
        <Icon name="calendar_add_on" size={18} color={Serene.onSurface} />
      </Pressable>
    </View>
  );
}

function HealthRefundCard() {
  return (
    <View style={[styles.card, styles.rowBetween]}>
      <View style={styles.priorityLeft}>
        <View style={[styles.priorityIcon, { backgroundColor: Serene.secondaryContainer }]}>
          <Icon name="health_and_safety" size={18} color={Serene.onSecondaryContainer} />
        </View>
        <View style={styles.flexMin}>
          <Text style={styles.title} numberOfLines={1}>
            Remboursement soins dentaires
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaTeal}>142,50 €</Text>
            <View style={styles.bullet} />
            <Text style={styles.mutedNoMargin} numberOfLines={1}>
              Harmonie Mutuelle
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.statusPill}>
        <Text style={styles.statusPillText}>En cours</Text>
      </View>
    </View>
  );
}

function AppointmentCard() {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.metaRow}>
          <Icon name="medical_services" size={20} color={Serene.secondary} />
          <Text style={styles.eyebrow}>RDV Médical</Text>
        </View>
        <View style={styles.jBadge}>
          <Text style={styles.jBadgeText}>J-2</Text>
        </View>
      </View>

      <View>
        <Text style={styles.title}>Contrôle ophtalmologique</Text>
        <Text style={styles.muted}>Dr. Vasseur • Centre Médical Saint-Honoré</Text>
      </View>

      <View style={styles.timePill}>
        <Icon name="schedule" size={18} color={Serene.secondary} />
        <Text style={styles.timeText}>Jeudi 16 mai à 14h30</Text>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.smallButton} onPress={() => router.push('/calendar/detail')}>
          <Icon name="directions" size={16} color={Serene.onSurface} />
          <Text style={styles.smallButtonText}>Itinéraire</Text>
        </Pressable>
        <Pressable style={styles.smallButton} onPress={() => router.push('/reminders/add')}>
          <Icon name="notifications_active" size={16} color={Serene.onSurface} />
          <Text style={styles.smallButtonText}>Rappel (1h)</Text>
        </Pressable>
      </View>
    </View>
  );
}

function TaxDeadlineCard() {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.metaRow}>
          <Icon name="account_balance" size={20} color={Serene.onSurface} />
          <Text style={styles.eyebrow}>Échéance Fiscale</Text>
        </View>
        <View style={styles.neutralPill}>
          <Text style={styles.neutralPillText}>Dans 12 jours</Text>
        </View>
      </View>

      <View>
        <Text style={styles.title}>Déclaration de revenus 2023</Text>
        <Text style={styles.muted}>Données pré-remplies analysées et consolidées</Text>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.rowBetween}>
          <Text style={styles.progressLabel}>Progression du dossier</Text>
          <Text style={styles.progressValue}>75%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>

      <View style={styles.rowBetween}>
        <View style={styles.metaRow}>
          <Icon name="check_circle" size={16} color={Serene.secondary} />
          <Text style={styles.mutedNoMargin}>Frais réels vérifiés</Text>
        </View>
        <Pressable onPress={() => router.push('/tasks')}>
          <Text style={styles.sectionAction}>Finaliser</Text>
        </Pressable>
      </View>
    </View>
  );
}

function RecentDocumentCard() {
  return (
    <View style={[styles.card, styles.rowBetween]}>
      <View style={styles.priorityLeft}>
        <View style={styles.docIcon}>
          <Icon name="picture_as_pdf" size={20} color={Serene.onSurface} />
        </View>
        <View style={styles.flexMin}>
          <Text style={styles.title} numberOfLines={1}>
            Facture_Engie_Mai2024.pdf
          </Text>
          <View style={styles.metaRow}>
            <Icon name="arrow_back_ios_new" size={13} color={Serene.secondary} />
            <Text style={styles.mutedNoMargin} numberOfLines={1}>
              Analysé par IA • Classé dans Énergie
            </Text>
          </View>
        </View>
      </View>
      <Pressable
        style={styles.squareButton}
        accessibilityLabel="Voir le document"
        onPress={() => router.push('/documents/detail')}>
        <Icon name="visibility" size={18} color={Serene.onSurface} />
      </Pressable>
    </View>
  );
}

function HouseholdInviteCard() {
  return (
    <View style={styles.householdCard}>
      <View style={styles.householdLeft}>
        <View style={styles.householdIcon}>
          <Icon name="group" size={16} color={Serene.onPrimary} />
        </View>
        <View style={styles.flexMin}>
          <Text style={styles.title} numberOfLines={1}>
            Partager avec votre foyer ?
          </Text>
          <Text style={styles.muted} numberOfLines={1}>
            Découvrez le mode Foyer collaboratif
          </Text>
        </View>
      </View>
      <Pressable style={styles.exploreButton} onPress={() => router.push('/household')}>
        <Text style={styles.exploreButtonText}>Explorer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Serene.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: Space.lg,
  },
  greeting: {
    paddingHorizontal: Space.gutter,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 4,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingName: {
    ...Typography.headlineMd,
    color: Serene.onSurface,
  },
  verified: {
    padding: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  veille: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  veilleDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
  },
  veilleText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.secondary,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subText: {
    ...Typography.bodyMd,
    color: Serene.onSurfaceVariant,
  },
  subStrong: {
    ...Typography.labelMd,
    color: Serene.onSurface,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.outlineVariant,
  },
  aiCard: {
    marginHorizontal: Space.gutter,
    marginTop: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLow,
    padding: 16,
    overflow: 'hidden',
  },
  aiBlob: {
    position: 'absolute',
    right: -24,
    bottom: -24,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(134,242,228,0.4)',
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  flexMin: {
    flex: 1,
    minWidth: 0,
  },
  aiLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  aiLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Serene.secondary,
  },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: 16,
    lineHeight: 22,
    color: Serene.onSurface,
  },
  aiBody: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
    marginTop: 2,
  },
  aiAmount: {
    fontFamily: FontFamily.bodySemiBold,
    color: Serene.onSurface,
  },
  aiActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  primaryButton: {
    flex: 1,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onPrimary,
  },
  ghostButton: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  quickScroll: {
    marginTop: 16,
  },
  quickRow: {
    paddingHorizontal: Space.gutter,
    paddingVertical: 4,
    gap: 8,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  quickIcon: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  koraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: Radius.lg,
    backgroundColor: Serene.primary,
    ...Shadow.card,
  },
  koraButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: Space.gutter,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
  },
  countPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  countText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  sectionAction: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.secondary,
  },
  stack: {
    paddingHorizontal: Space.gutter,
    gap: 10,
  },
  card: {
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    padding: 14,
    gap: 12,
    ...Shadow.card,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  priorityTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  priorityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  priorityIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
    marginTop: 2,
  },
  mutedNoMargin: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaStrong: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  metaTeal: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.secondary,
  },
  urgentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    backgroundColor: Serene.errorContainer,
  },
  urgentBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onErrorContainer,
  },
  priorityBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  highRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  highDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.error,
  },
  highText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.error,
  },
  tealButton: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: Serene.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    ...Shadow.card,
  },
  tealButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSecondary,
  },
  squareButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
  },
  statusPillText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurface,
  },
  eyebrow: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
  },
  jBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryFixed,
  },
  jBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSecondaryFixed,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Serene.surfaceContainerLow,
    padding: 8,
    borderRadius: Radius.lg,
  },
  timeText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    flex: 1,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  smallButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  neutralPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  neutralPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurface,
  },
  progressBlock: {
    gap: 6,
  },
  progressLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  progressValue: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.secondary,
  },
  progressTrack: {
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '75%',
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  householdCard: {
    marginHorizontal: Space.gutter,
    marginTop: 24,
    marginBottom: 8,
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  householdLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  householdIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreButton: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  exploreButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
});
