// S-07 - Tableau de bord | Module M03 Tableau de bord | Phase S3
import { router, type Href } from 'expo-router';
import { useCallback, useState, type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';

import { KoraSuggestions } from '../components/kora-suggestions';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);

  // Démo : simule le rechargement de la synthèse.
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Tint.primary}
            colors={[Tint.primary]}
          />
        }>
        <View style={styles.glow} pointerEvents="none" />

        <Greeting />
        <KoraSuggestions />
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
          title="Prochains événements & échéances"
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
        <RecentDocumentCard />

        <HouseholdInviteCard />
      </ScrollView>
    </SafeAreaView>
  );
}

/** Carte blanche du style validé ; cliquable si `href` est fourni. */
function Card({
  children,
  href,
  label,
  style,
}: {
  children: ReactNode;
  href?: Href;
  label?: string;
  style?: StyleProp<ViewStyle>;
}) {
  if (!href) {
    return <View style={[styles.card, style]}>{children}</View>;
  }
  return (
    <Pressable
      style={({ pressed }) => [styles.card, style, pressed && styles.cardPressed]}
      // Sur le web, un rôle « button » produirait un <button> contenant d'autres boutons (HTML invalide).
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      accessibilityLabel={label}
      onPress={() => router.push(href)}>
      {children}
    </Pressable>
  );
}

function Greeting() {
  return (
    <View style={styles.greeting}>
      <View style={styles.greetingRow}>
        <View style={styles.greetingNameRow}>
          <Text style={styles.greetingName} numberOfLines={1}>
            Bonjour <Text style={styles.accent}>Claire</Text>
          </Text>
          <Icon name="verified" size={18} filled color={Tint.primary} />
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

function QuickActions() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.quickRow}
      style={styles.quickScroll}>
      <QuickAction
        icon="document_scanner"
        label="Scanner document"
        tone="teal"
        onPress={() => router.push('/documents')}
      />
      <QuickAction
        icon="add_task"
        label="Nouvelle tâche"
        tone="soft"
        onPress={() => router.push('/tasks/add')}
      />
      <Pressable
        style={({ pressed }) => [styles.koraButton, pressed && styles.blackButtonPressed]}
        accessibilityRole="button"
        onPress={() => router.push('/assistant')}>
        <Icon name="auto_awesome" size={18} color={Serene.secondaryFixed} />
        <Text style={styles.koraButtonText}>Demander à Kora</Text>
      </Pressable>
    </ScrollView>
  );
}

function QuickAction({
  icon,
  label,
  tone,
  onPress,
}: {
  icon: string;
  label: string;
  tone: 'teal' | 'soft';
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.quickAction, pressed && styles.cardPressed]}
      accessibilityRole="button"
      onPress={onPress}>
      <View style={[styles.quickIcon, tone === 'teal' ? styles.iconTeal : styles.iconSoft]}>
        <Icon
          name={icon}
          size={18}
          color={tone === 'teal' ? Serene.onSecondaryContainer : Tint.navy}
        />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
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
        <Pressable
          style={({ pressed }) => [pressed && styles.linkPressed]}
          hitSlop={8}
          accessibilityRole="link"
          onPress={onPressAction}>
          <Text style={styles.linkText}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function DeclarationCard() {
  return (
    <Card href={{ pathname: '/tasks/detail', params: { id: 'attestation' } }} label="Renvoyer attestation de domicile signée">
      <View style={styles.rowTop}>
        <View style={[styles.rowIcon, { backgroundColor: Serene.errorContainer }]}>
          <Icon name="draw" size={20} color={Serene.onErrorContainer} />
        </View>
        <View style={styles.flexMin}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            Renvoyer attestation de domicile signée
          </Text>
          <Text style={styles.muted} numberOfLines={2}>
            Bailleur Foncia • Format PDF certifié
          </Text>
        </View>
        <View style={styles.urgentBadge}>
          <Text style={styles.urgentBadgeText}>Aujourd’hui 17h</Text>
        </View>
      </View>

      <View style={styles.priorityBottom}>
        <View style={styles.highRow}>
          <View style={styles.highDot} />
          <Text style={styles.highText}>Haute priorité</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.tealButton, pressed && styles.tealButtonPressed]}
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/documents/detail', params: { id: 'attestation-domicile' } })}>
          <Text style={styles.tealButtonText}>Signer &amp; joindre</Text>
          <Icon name="send" size={16} color={Serene.onSecondary} />
        </Pressable>
      </View>
    </Card>
  );
}

function CarInspectionCard() {
  return (
    <Card href={{ pathname: '/tasks/detail', params: { id: 'controle-technique' } }} label="Contrôle technique Peugeot 208">
      <View style={styles.rowCenter}>
        <View style={[styles.rowIcon, styles.iconSoft]}>
          <Icon name="directions_car" size={20} color={Tint.navy} />
        </View>
        <View style={styles.flexMin}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            Contrôle technique Peugeot 208
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.mutedInline} numberOfLines={1}>
              AutoSécurité République
            </Text>
            <View style={styles.bullet} />
            <Text style={styles.metaStrong}>Demain</Text>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [styles.squareButton, pressed && styles.outlinePressed]}
          accessibilityRole="button"
          accessibilityLabel="Ajouter au calendrier"
          onPress={() => router.push('/calendar/add')}>
          <Icon name="calendar_add_on" size={20} color={Tint.navy} />
        </Pressable>
      </View>
    </Card>
  );
}

function HealthRefundCard() {
  return (
    <Card href={{ pathname: '/tasks/detail', params: { id: 'remboursement' } }} label="Remboursement soins dentaires">
      <View style={styles.rowCenter}>
        <View style={[styles.rowIcon, styles.iconTeal]}>
          <Icon name="health_and_safety" size={20} color={Serene.onSecondaryContainer} />
        </View>
        <View style={styles.flexMin}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            Remboursement soins dentaires
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaTeal}>142,50 €</Text>
            <View style={styles.bullet} />
            <Text style={styles.mutedInline} numberOfLines={1}>
              Harmonie Mutuelle
            </Text>
          </View>
        </View>
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>En cours</Text>
        </View>
      </View>
    </Card>
  );
}

function AppointmentCard() {
  return (
    <Card
      href={{ pathname: '/calendar/detail', params: { id: 'ophtalmo' } }}
      label="Contrôle ophtalmologique"
      style={styles.cardGap}>
      <View style={styles.rowBetween}>
        <View style={styles.metaRow}>
          <Icon name="medical_services" size={20} color={Tint.primary} />
          <Text style={styles.eyebrow}>Événement santé</Text>
        </View>
        <View style={styles.jBadge}>
          <Text style={styles.jBadgeText}>J-2</Text>
        </View>
      </View>

      <View>
        <Text style={styles.cardTitle}>Contrôle ophtalmologique</Text>
        <Text style={styles.muted}>Dr. Vasseur • Centre Médical Saint-Honoré</Text>
      </View>

      <View style={styles.timePill}>
        <Icon name="schedule" size={18} color={Tint.primary} />
        <Text style={styles.timeText}>Jeudi 16 mai à 14h30</Text>
      </View>

      <View style={styles.actionRow}>
        <SmallButton
          icon="directions"
          label="Itinéraire"
          onPress={() => router.push({ pathname: '/calendar/detail', params: { id: 'ophtalmo' } })}
        />
        <SmallButton
          icon="notifications_active"
          label="Rappel (1h)"
          onPress={() =>
            router.push({
              pathname: '/reminders/add',
              params: {
                linkKind: 'event',
                linkId: 'ophtalmo',
                linkTitle: 'Contrôle ophtalmologique',
                at: new Date(2024, 4, 16, 13, 30).toISOString(),
              },
            })
          }
        />
      </View>
    </Card>
  );
}

function SmallButton({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.smallButton, pressed && styles.outlinePressed]}
      accessibilityRole="button"
      onPress={onPress}>
      <Icon name={icon} size={18} color={Tint.navy} />
      <Text style={styles.smallButtonText}>{label}</Text>
    </Pressable>
  );
}

function TaxDeadlineCard() {
  return (
    <Card
      href={{ pathname: '/tasks/detail', params: { id: 'declaration' } }}
      label="Déclaration de revenus 2023"
      style={styles.cardGap}>
      <View style={styles.rowBetween}>
        <View style={styles.metaRow}>
          <Icon name="account_balance" size={20} color={Tint.navy} />
          <Text style={styles.eyebrow}>Échéance fiscale</Text>
        </View>
        <View style={styles.neutralPill}>
          <Text style={styles.neutralPillText}>Dans 12 jours</Text>
        </View>
      </View>

      <View>
        <Text style={styles.cardTitle}>Déclaration de revenus 2023</Text>
        <Text style={styles.muted}>Données pré-remplies analysées et consolidées</Text>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.rowBetween}>
          <Text style={styles.progressLabel}>Progression du dossier</Text>
          <Text style={styles.progressValue}>75 %</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>

      <View style={styles.rowBetween}>
        <View style={styles.metaRow}>
          <Icon name="check_circle" size={18} color={Tint.primary} />
          <Text style={styles.mutedInline}>Frais réels vérifiés</Text>
        </View>
        <Pressable
          style={({ pressed }) => [pressed && styles.linkPressed]}
          hitSlop={8}
          accessibilityRole="link"
          onPress={() =>
            router.push({ pathname: '/tasks/detail', params: { id: 'declaration' } })
          }>
          <Text style={styles.linkText}>Finaliser</Text>
        </Pressable>
      </View>
    </Card>
  );
}

function RecentDocumentCard() {
  return (
    <Card href={{ pathname: '/documents/detail', params: { id: 'engie' } }} label="Facture d’électricité Engie — mai 2024">
      <View style={styles.rowCenter}>
        <View style={[styles.rowIcon, styles.iconSoft]}>
          <Icon name="picture_as_pdf" size={22} color={Tint.navy} />
        </View>
        <View style={styles.flexMin}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            Facture d’électricité Engie — mai 2024
          </Text>
          <View style={styles.metaRow}>
            <Icon name="auto_awesome" size={15} color={Tint.primary} />
            <Text style={styles.mutedInline} numberOfLines={1}>
              Analysé par IA • Classé dans Énergie
            </Text>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [styles.squareButton, pressed && styles.outlinePressed]}
          accessibilityRole="button"
          accessibilityLabel="Voir le document"
          onPress={() => router.push({ pathname: '/documents/detail', params: { id: 'engie' } })}>
          <Icon name="visibility" size={20} color={Tint.navy} />
        </Pressable>
      </View>
    </Card>
  );
}

function HouseholdInviteCard() {
  return (
    <View style={styles.householdCard}>
      <View style={styles.householdIcon}>
        <Icon name="group" size={20} color={Serene.onPrimary} />
      </View>
      <View style={styles.flexMin}>
        <Text style={styles.cardTitle}>Partager avec votre foyer ?</Text>
        <Text style={styles.muted}>Découvrez le mode Foyer collaboratif</Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.exploreButton, pressed && styles.outlinePressed]}
        accessibilityRole="button"
        onPress={() => router.push('/household')}>
        <Text style={styles.exploreButtonText}>Explorer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Tint.softer,
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: Space.gutter,
    paddingBottom: 48,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -140,
    right: -120,
    width: 300,
    height: 300,
    borderRadius: Radius.full,
    backgroundColor: Tint.glow,
    opacity: 0.18,
  },
  flexMin: {
    flex: 1,
    minWidth: 0,
  },
  accent: {
    color: Tint.primary,
  },

  // Salutation
  greeting: {
    paddingTop: 16,
    paddingBottom: 8,
    gap: 6,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  greetingNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
    minWidth: 0,
  },
  greetingName: {
    flexShrink: 1,
    fontFamily: FontFamily.headingBold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: Tint.navy,
  },
  veille: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
  },
  veilleDot: {
    width: 7,
    height: 7,
    borderRadius: Radius.full,
    backgroundColor: Tint.primary,
  },
  veilleText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Serene.onSecondaryContainer,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subText: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onSurfaceVariant,
  },
  subStrong: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.outlineVariant,
  },

  // Cartes
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    shadowColor: Tint.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  cardGap: {
    gap: 14,
  },
  cardPressed: {
    backgroundColor: Tint.soft,
    transform: [{ scale: 0.995 }],
  },
  cardTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
    lineHeight: 23,
    color: Tint.navy,
  },
  muted: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onSurfaceVariant,
    marginTop: 2,
  },
  mutedInline: {
    flexShrink: 1,
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onSurfaceVariant,
  },
  stack: {
    gap: 12,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTeal: {
    backgroundColor: Serene.secondaryContainer,
  },
  iconSoft: {
    backgroundColor: Tint.soft,
    borderWidth: 1,
    borderColor: Tint.border,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    minWidth: 0,
  },
  metaStrong: {
    flexShrink: 0,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Tint.navy,
  },
  metaTeal: {
    flexShrink: 0,
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    lineHeight: 20,
    color: Tint.primary,
  },

  // Suggestion IA
  blackButtonPressed: {
    backgroundColor: Tint.blackPressed,
    transform: [{ scale: 0.99 }],
  },
  outlinePressed: {
    backgroundColor: Tint.soft,
  },

  // Actions rapides
  quickScroll: {
    marginTop: Space.md,
    marginHorizontal: -Space.gutter,
  },
  quickRow: {
    gap: 10,
    paddingHorizontal: Space.gutter,
  },
  quickAction: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 8,
    paddingRight: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  quickIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  koraButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Tint.black,
  },
  koraButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onPrimary,
  },

  // En-têtes de section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    flexShrink: 1,
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
    color: Tint.navy,
  },
  countPill: {
    minWidth: 26,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    backgroundColor: Tint.soft,
    borderWidth: 1,
    borderColor: Tint.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    color: Tint.navy,
  },
  linkText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.primary,
  },
  linkPressed: {
    opacity: 0.65,
  },

  // Priorités
  urgentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Serene.errorContainer,
  },
  urgentBadgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 17,
    color: Serene.onErrorContainer,
  },
  priorityBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 14,
  },
  highRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  highDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Serene.error,
  },
  highText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.error,
  },
  tealButton: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: Tint.primary,
  },
  tealButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  tealButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onSecondary,
  },
  squareButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: Tint.soft,
    borderWidth: 1,
    borderColor: Tint.border,
  },
  statusPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 17,
    color: Tint.navy,
  },

  // Rendez-vous et échéances
  eyebrow: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
  },
  jBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
  },
  jBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    color: Serene.onSecondaryContainer,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 14,
    backgroundColor: Tint.soft,
  },
  timeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  smallButton: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  smallButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  neutralPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Tint.soft,
    borderWidth: 1,
    borderColor: Tint.border,
  },
  neutralPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 17,
    color: Tint.navy,
  },
  progressBlock: {
    gap: 8,
  },
  progressLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
  },
  progressValue: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.primary,
  },
  progressTrack: {
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Tint.soft,
    overflow: 'hidden',
  },
  progressFill: {
    width: '75%',
    height: '100%',
    borderRadius: Radius.full,
    backgroundColor: Tint.primary,
  },

  // Foyer
  householdCard: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Tint.lavender,
  },
  householdIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Tint.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreButton: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
});
