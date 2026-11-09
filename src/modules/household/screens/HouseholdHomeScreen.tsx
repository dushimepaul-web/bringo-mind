// S-16 - Tableau de bord foyer | Module M08 Foyer partagé | Phase S7
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

export default function HouseholdHomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ContextSwitcher />
        <MembersRail />
        <AiAlertCard />
        <SharedTasks />
        <SharedCalendar />
        <SharedDocuments />
        <PrivacyBanner />
      </ScrollView>
    </SafeAreaView>
  );
}

function ContextSwitcher() {
  return (
    <View style={styles.contextBlock}>
      <View style={styles.contextHeader}>
        <View style={styles.contextTitleRow}>
          <Icon name="family_restroom" size={18} color={Serene.secondary} />
          <Text style={styles.contextTitle} numberOfLines={1}>
            Foyer Delorme-Martin
          </Text>
        </View>
        <View style={styles.sharedPill}>
          <Text style={styles.sharedPillText}>Partagé</Text>
        </View>
      </View>

      <View style={styles.switcher}>
        <Pressable
          style={styles.switcherTab}
          accessibilityRole="button"
          onPress={() => router.push('/dashboard')}>
          <Text style={styles.switcherTabText}>Mon Espace</Text>
        </Pressable>
        <View style={[styles.switcherTab, styles.switcherTabActive]}>
          <View style={styles.switcherDot} />
          <Text style={styles.switcherTabTextActive}>Foyer Partagé</Text>
        </View>
      </View>
    </View>
  );
}

function MembersRail() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.membersRow}
      style={styles.membersScroll}>
      <MemberCard name="Claire" role="Vous • Admin" initial="C" online />
      <MemberCard name="Thomas" role="Co-gestion" initial="T" />
      <MemberCard name="Léo" role="Enfant • 6ème" initial="L" />

      <Pressable
        style={styles.inviteButton}
        accessibilityRole="button"
        onPress={() => router.push('/household/invite')}>
        <Icon name="person_add" size={18} color={Serene.onSurfaceVariant} />
        <Text style={styles.inviteText}>Inviter</Text>
      </Pressable>

      <Pressable
        style={styles.inviteButton}
        accessibilityRole="button"
        onPress={() => router.push('/household/activity')}>
        <Icon name="history" size={18} color={Serene.onSurfaceVariant} />
        <Text style={styles.inviteText}>Activité</Text>
      </Pressable>
    </ScrollView>
  );
}

function MemberCard({
  name,
  role,
  initial,
  online,
}: {
  name: string;
  role: string;
  initial: string;
  online?: boolean;
}) {
  return (
    <Pressable
      style={styles.memberCard}
      accessibilityRole="button"
      onPress={() => router.push('/household/members')}>
      <View style={styles.memberAvatar}>
        <Text style={styles.memberInitial}>{initial}</Text>
        {online ? <View style={styles.onlineDot} /> : null}
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.memberRole} numberOfLines={1}>
          {role}
        </Text>
      </View>
    </Pressable>
  );
}

function AiAlertCard() {
  return (
    <View style={styles.alertWrap}>
      <View style={styles.alertCard}>
        <View style={styles.alertTop}>
          <View style={styles.alertIcon}>
            <Icon name="arrow_back_ios_new" size={17} color={Serene.onSecondary} />
          </View>
          <View style={styles.alertBodyWrap}>
            <View style={styles.alertLabelRow}>
              <Text style={styles.alertLabel}>IA Partagée Kora</Text>
              <View style={styles.alertDot} />
              <Text style={styles.alertContext}>Priorité foyer</Text>
            </View>
            <Text style={styles.alertBody}>
              Renouvellement inscription scolaire de <Text style={styles.bold}>Léo</Text> : date
              limite <Text style={styles.alertAccent}>25 mai</Text>. Certificat de domicile vérifié
              &amp; valide.
            </Text>
          </View>
        </View>

        <View style={styles.alertBottom}>
          <Text style={styles.alertHint}>Prêt à téléverser</Text>
          <Pressable
            style={styles.alertButton}
            accessibilityRole="button"
            onPress={() => router.push('/documents')}>
            <Text style={styles.alertButtonText}>Voir le dossier</Text>
            <Icon name="arrow_forward" size={16} color={Serene.onSecondary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function SharedTasks() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="task_alt" size={20} color={Serene.onSurface} />
          <Text style={styles.sectionTitle}>Tâches réparties</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countText}>3 actives</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersScroll}>
        <View style={[styles.filterChip, styles.filterChipActive]}>
          <Text style={styles.filterChipTextActive}>Toutes</Text>
        </View>
        <Pressable style={styles.filterChip} onPress={() => router.push('/tasks')}>
          <Text style={styles.filterChipText}>À moi (2)</Text>
        </Pressable>
        <Pressable style={styles.filterChip} onPress={() => router.push('/tasks')}>
          <Text style={styles.filterChipText}>Thomas (1)</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.list}>
        <TaskCard
          status="urgent"
          due="Échéance demain"
          title="Déclaration de sinistre fuite d'eau"
          footer="Assigné à Claire (Vous)"
          trailing="Ouvrir"
        />
        <TaskCard
          status="progress"
          due="17 mai"
          title="Vaccin rappel 11 ans (Léo)"
          footer="Assigné à Thomas"
          trailing="Santé"
          avatar="T"
        />
        <CompletedTaskCard />
      </View>
    </View>
  );
}

function TaskCard({
  status,
  due,
  title,
  footer,
  trailing,
  avatar,
}: {
  status: 'urgent' | 'progress';
  due: string;
  title: string;
  footer: string;
  trailing: string;
  avatar?: string;
}) {
  const urgent = status === 'urgent';

  return (
    <Pressable
      style={styles.taskCard}
      accessibilityRole="button"
      onPress={() => router.push('/tasks/detail')}>
      <View style={styles.checkbox} />

      <View style={styles.taskBody}>
        <View style={styles.taskTopRow}>
          <View style={[styles.taskPill, urgent ? styles.taskPillUrgent : styles.taskPillProgress]}>
            {urgent ? <View style={styles.taskPillDot} /> : null}
            <Text
              style={[
                styles.taskPillText,
                urgent ? styles.taskPillTextUrgent : styles.taskPillTextProgress,
              ]}>
              {urgent ? 'Urgent' : 'En cours'}
            </Text>
          </View>
          <Text style={[styles.taskDue, urgent && styles.taskDueUrgent]}>{due}</Text>
        </View>

        <Text style={styles.taskTitle} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.taskBottomRow}>
          <View style={styles.taskAssignee}>
            {avatar ? (
              <View style={styles.assigneeAvatar}>
                <Text style={styles.assigneeInitial}>{avatar}</Text>
              </View>
            ) : (
              <Icon name="assignment_ind" size={15} color={Serene.onSurfaceVariant} />
            )}
            <Text style={styles.taskFooter} numberOfLines={1}>
              {footer}
            </Text>
          </View>
          <Pressable onPress={() => router.push('/tasks/detail')}>
            <Text style={styles.taskTrailing}>{trailing}</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function CompletedTaskCard() {
  return (
    <Pressable
      style={[styles.taskCard, styles.taskCardDone]}
      accessibilityRole="button"
      onPress={() => router.push('/tasks/detail')}>
      <View style={styles.checkboxDone}>
        <Icon name="check" size={14} color={Serene.onSecondary} />
      </View>

      <View style={styles.taskBody}>
        <View style={styles.taskTopRow}>
          <Text style={styles.doneText}>Clôturé le 12 mai</Text>
          <Icon name="verified" size={15} color={Serene.secondary} />
        </View>

        <Text style={styles.taskTitleDone} numberOfLines={1}>
          Règlement cantine scolaire 2ème trimestre
        </Text>
        <Text style={styles.taskFooter}>Payé 148,50 € • Reçu archivé</Text>
      </View>
    </Pressable>
  );
}

function SharedCalendar() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="calendar_month" size={20} color={Serene.onSurface} />
          <Text style={styles.sectionTitle}>Calendrier &amp; RDV</Text>
        </View>
        <Pressable onPress={() => router.push('/calendar')}>
          <Text style={styles.sectionAction}>Tout voir</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        <EventCard
          day="Ven"
          date="17"
          month="Mai"
          title="Réunion parents d'élèves 6ème B"
          icon="schedule"
          detail="18h00 • Collège Victor Hugo"
          people="Claire & Thomas"
          accentDay
        />
        <EventCard
          day="Mar"
          date="21"
          month="Mai"
          title="Passage ramoneur cheminée"
          icon="home"
          detail="À domicile • Présence requise"
          people="Thomas assure l'accueil"
        />
      </View>
    </View>
  );
}

function EventCard({
  day,
  date,
  month,
  title,
  icon,
  detail,
  people,
  accentDay,
}: {
  day: string;
  date: string;
  month: string;
  title: string;
  icon: string;
  detail: string;
  people: string;
  accentDay?: boolean;
}) {
  return (
    <Pressable
      style={styles.eventCard}
      accessibilityRole="button"
      onPress={() => router.push('/calendar/detail')}>
      <View style={styles.eventDate}>
        <Text style={[styles.eventDay, accentDay && styles.eventDayAccent]}>{day}</Text>
        <Text style={styles.eventNumber}>{date}</Text>
        <Text style={styles.eventMonth}>{month}</Text>
      </View>

      <View style={styles.eventBody}>
        <Text style={styles.eventTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.eventMeta}>
          <Icon name={icon} size={14} color={Serene.onSurfaceVariant} />
          <Text style={styles.eventMetaText} numberOfLines={1}>
            {detail}
          </Text>
        </View>
        <View style={styles.eventPeople}>
          {accentDay ? (
            <View style={styles.avatarGroup}>
              <View style={[styles.miniAvatar, styles.miniAvatarPrimary]}>
                <Text style={styles.miniAvatarText}>C</Text>
              </View>
              <View style={[styles.miniAvatar, styles.miniAvatarSecondary, styles.miniAvatarOverlap]}>
                <Text style={styles.miniAvatarText}>T</Text>
              </View>
            </View>
          ) : (
            <View style={[styles.miniAvatar, styles.miniAvatarSecondary]}>
              <Text style={styles.miniAvatarText}>T</Text>
            </View>
          )}
          <Text style={styles.eventPeopleText} numberOfLines={1}>
            {people}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function SharedDocuments() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="folder_shared" size={20} color={Serene.onSurface} />
          <Text style={styles.sectionTitle}>Documents communs récents</Text>
        </View>
        <Pressable
          style={styles.addButton}
          accessibilityRole="button"
          accessibilityLabel="Ajouter un document"
          onPress={() => router.push('/documents')}>
          <Icon name="add" size={18} color={Serene.onSurfaceVariant} />
        </Pressable>
      </View>

      <View style={styles.docsGrid}>
        <Pressable
          style={styles.docCard}
          accessibilityRole="button"
          onPress={() => router.push('/documents/detail')}>
          <View style={styles.docTop}>
            <View style={styles.docIcon}>
              <Icon name="description" size={20} color={Serene.secondary} />
            </View>
            <Icon name="more_vert" size={18} color={Serene.onSurfaceVariant} />
          </View>
          <View>
            <Text style={styles.docTitle} numberOfLines={1}>
              Bail locatif signé
            </Text>
            <Text style={styles.docMeta}>PDF • Partagé foyer</Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.docCard}
          accessibilityRole="button"
          onPress={() => router.push('/documents/detail')}>
          <View style={styles.docTop}>
            <View style={styles.docIconTeal}>
              <Icon name="menu_book" size={20} color={Serene.secondary} />
            </View>
            <Icon name="more_vert" size={18} color={Serene.onSurfaceVariant} />
          </View>
          <View>
            <Text style={styles.docTitle} numberOfLines={1}>
              Livret de famille num.
            </Text>
            <Text style={styles.docMeta}>Certifié • 3 pages</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function PrivacyBanner() {
  return (
    <View style={styles.privacyWrap}>
      <View style={styles.privacyCard}>
        <View style={styles.privacyIcon}>
          <Icon name="lock" size={16} color={Serene.secondary} />
        </View>
        <Text style={styles.privacyText}>
          <Text style={styles.bold}>Cloisonnement garanti :</Text> vos bulletins de paie, santé et
          impôts individuels restent strictement privés.
        </Text>
      </View>
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
  contextBlock: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.sm,
    paddingBottom: Space.md,
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.xs,
    marginBottom: Space.sm,
  },
  contextTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  contextTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
    flexShrink: 1,
  },
  sharedPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
  },
  sharedPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSecondaryContainer,
  },
  switcher: {
    padding: 4,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainer,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    ...Shadow.card,
  },
  switcherTab: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  switcherTabActive: {
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  switcherDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
  },
  switcherTabText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  switcherTabTextActive: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  membersScroll: {
    marginBottom: Space.sm,
  },
  membersRow: {
    paddingLeft: Space.gutter,
    paddingRight: Space.gutter,
    paddingBottom: Space.sm,
    gap: 10,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitial: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  onlineDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
    borderWidth: 1,
    borderColor: Serene.surfaceContainerLowest,
  },
  memberInfo: {
    minWidth: 0,
  },
  memberName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  memberRole: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainer,
    alignSelf: 'center',
  },
  inviteText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  alertWrap: {
    paddingHorizontal: Space.gutter,
    marginTop: Space.sm,
  },
  alertCard: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: 'rgba(134, 242, 228, 0.32)',
    gap: 10,
    ...Shadow.card,
  },
  alertTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  alertIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.md,
    backgroundColor: Serene.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  alertBodyWrap: {
    flex: 1,
    minWidth: 0,
  },
  alertLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.secondary,
  },
  alertDot: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
  },
  alertContext: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  alertBody: {
    ...Typography.bodyMd,
    color: Serene.onSurface,
    marginTop: 4,
  },
  bold: {
    fontFamily: FontFamily.bodySemiBold,
    color: Serene.onSurface,
  },
  alertAccent: {
    fontFamily: FontFamily.bodySemiBold,
    color: Serene.secondary,
  },
  alertBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  alertHint: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.md,
    backgroundColor: Serene.secondary,
    ...Shadow.card,
  },
  alertButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSecondary,
  },
  section: {
    paddingHorizontal: Space.gutter,
    marginTop: Space.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: Space.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
    flexShrink: 1,
  },
  countPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainer,
  },
  countText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  sectionAction: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.secondary,
  },
  filtersScroll: {
    marginBottom: Space.sm,
    marginHorizontal: -Space.gutter,
  },
  filtersRow: {
    paddingHorizontal: Space.gutter,
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainer,
  },
  filterChipActive: {
    backgroundColor: Serene.primary,
  },
  filterChipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  filterChipTextActive: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onPrimary,
  },
  list: {
    gap: 10,
  },
  taskCard: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    ...Shadow.card,
  },
  taskCardDone: {
    backgroundColor: Serene.surfaceContainerLow,
    opacity: 0.85,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: Serene.surfaceContainerHigh,
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxDone: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: Serene.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  taskBody: {
    flex: 1,
    minWidth: 0,
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 4,
  },
  taskPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  taskPillUrgent: {
    backgroundColor: Serene.errorContainer,
  },
  taskPillProgress: {
    backgroundColor: Serene.surfaceContainerHighest,
  },
  taskPillDot: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.error,
  },
  taskPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
  },
  taskPillTextUrgent: {
    color: Serene.onErrorContainer,
  },
  taskPillTextProgress: {
    color: Serene.onSurfaceVariant,
  },
  taskDue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  taskDueUrgent: {
    color: Serene.error,
  },
  taskTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onSurface,
  },
  taskTitleDone: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(11, 28, 48, 0.7)',
    textDecorationLine: 'line-through',
  },
  taskBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
    paddingTop: 4,
  },
  taskAssignee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  assigneeAvatar: {
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assigneeInitial: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 9,
    lineHeight: 12,
    color: Serene.onSurfaceVariant,
  },
  taskFooter: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  taskTrailing: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.secondary,
    textDecorationLine: 'underline',
  },
  doneText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.secondary,
  },
  eventCard: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Shadow.card,
  },
  eventDate: {
    width: 48,
    height: 52,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  eventDay: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    lineHeight: 12,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
  },
  eventDayAccent: {
    color: Serene.secondary,
  },
  eventNumber: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 24,
    color: Serene.onSurface,
  },
  eventMonth: {
    fontFamily: FontFamily.body,
    fontSize: 9,
    lineHeight: 12,
    color: Serene.onSurfaceVariant,
  },
  eventBody: {
    flex: 1,
    minWidth: 0,
  },
  eventTitle: {
    fontFamily: FontFamily.heading,
    fontSize: 16,
    lineHeight: 22,
    color: Serene.onSurface,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  eventMetaText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
    flexShrink: 1,
  },
  eventPeople: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  miniAvatar: {
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarPrimary: {
    backgroundColor: Serene.primary,
  },
  miniAvatarSecondary: {
    backgroundColor: Serene.secondary,
  },
  miniAvatarOverlap: {
    marginLeft: -4,
  },
  miniAvatarText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 9,
    lineHeight: 12,
    color: Serene.onPrimary,
  },
  eventPeopleText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
    flexShrink: 1,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  docCard: {
    flex: 1,
    height: 112,
    padding: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    justifyContent: 'space-between',
    ...Shadow.card,
  },
  docTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  docIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconTeal: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(134, 242, 228, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docTitle: {
    fontFamily: FontFamily.heading,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  docMeta: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
    marginTop: 2,
  },
  privacyWrap: {
    paddingHorizontal: Space.gutter,
    marginTop: Space.lg,
  },
  privacyCard: {
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainer,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  privacyIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  privacyText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
});
