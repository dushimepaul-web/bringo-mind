// S-11 - Rappels | Module M05 Rappels | Phase S5
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

type ReminderGroup = 'today' | 'tomorrow' | 'week';
type ReminderKind = 'task' | 'event' | 'personal';

type Reminder = {
  id: string;
  title: string;
  time: string;
  group: ReminderGroup;
  kind: ReminderKind;
  detail: string;
  icon: string;
  accent: 'primary' | 'secondary' | 'error';
  paused?: boolean;
};

const FILTERS = [
  { key: 'upcoming', label: 'À venir' },
  { key: 'all', label: 'Tous' },
  { key: 'paused', label: 'En pause' },
] as const;

const GROUP_LABELS: Record<ReminderGroup, string> = {
  today: "Aujourd'hui • Jeudi 9 mai",
  tomorrow: 'Demain • Vendredi 10 mai',
  week: 'Cette semaine',
};

const GROUP_ORDER: ReminderGroup[] = ['today', 'tomorrow', 'week'];

const KIND_LABELS: Record<ReminderKind, string> = {
  task: 'Tâche liée',
  event: 'Rendez-vous',
  personal: 'Personnel',
};

const REMINDERS: Reminder[] = [
  {
    id: 'medecin',
    title: 'Appeler le médecin',
    time: '08:00',
    group: 'today',
    kind: 'personal',
    detail: 'Chaque matin',
    icon: 'call',
    accent: 'primary',
  },
  {
    id: 'electricite',
    title: "Payer la facture d'électricité",
    time: '12:30',
    group: 'today',
    kind: 'task',
    detail: 'Échéance aujourd’hui',
    icon: 'bolt',
    accent: 'error',
  },
  {
    id: 'leo-ecole',
    title: 'Récupérer Léo à l’école',
    time: '16:45',
    group: 'today',
    kind: 'event',
    detail: 'Partagé avec Thomas',
    icon: 'school',
    accent: 'secondary',
  },
  {
    id: 'medicaments',
    title: 'Acheter des médicaments',
    time: '08:00',
    group: 'tomorrow',
    kind: 'task',
    detail: 'Pharmacie du centre',
    icon: 'medication',
    accent: 'primary',
  },
  {
    id: 'parents-eleves',
    title: 'Réunion parents d’élèves',
    time: '18:00',
    group: 'tomorrow',
    kind: 'event',
    detail: 'École Jean Moulin',
    icon: 'groups',
    accent: 'secondary',
  },
  {
    id: 'assurance',
    title: 'Renouveler l’assurance habitation',
    time: 'Mer. 10:00',
    group: 'week',
    kind: 'task',
    detail: 'Échéance le 15 mai',
    icon: 'shield',
    accent: 'error',
    paused: true,
  },
  {
    id: 'dentiste',
    title: 'Rendez-vous dentiste',
    time: 'Ven. 09:30',
    group: 'week',
    kind: 'event',
    detail: 'Dr. Moreau • Cabinet Voltaire',
    icon: 'medical_services',
    accent: 'secondary',
  },
];

export default function ReminderListScreen() {
  const [selectedFilter, setSelectedFilter] =
    useState<(typeof FILTERS)[number]['key']>('upcoming');
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    REMINDERS.reduce<Record<string, boolean>>((acc, reminder) => {
      acc[reminder.id] = !reminder.paused;
      return acc;
    }, {}),
  );

  const visibleReminders = useMemo(() => {
    if (selectedFilter === 'paused') {
      return REMINDERS.filter((reminder) => !enabled[reminder.id]);
    }
    if (selectedFilter === 'upcoming') {
      return REMINDERS.filter((reminder) => enabled[reminder.id]);
    }
    return REMINDERS;
  }, [selectedFilter, enabled]);

  const activeCount = REMINDERS.filter((reminder) => enabled[reminder.id]).length;

  const toggleReminder = (id: string) => {
    setEnabled((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <View style={styles.titleTextBlock}>
            <Text style={styles.eyebrow}>Notifications</Text>
            <Text style={styles.title}>Rappels</Text>
          </View>
          <View style={styles.activePill}>
            <Text style={styles.activePillText}>{activeCount} actifs</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Aujourd’hui</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Demain</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Fiabilité</Text>
          </View>
        </View>

        <Pressable
          style={styles.silenceCard}
          accessibilityRole="button"
          onPress={() => router.push('/notifications/settings')}>
          <View style={styles.silenceIcon}>
            <Icon name="bedtime" size={18} color={Serene.secondary} />
          </View>
          <View style={styles.silenceBody}>
            <Text style={styles.silenceTitle}>Heures de silence</Text>
            <Text style={styles.silenceText}>
              Aucune notification entre 22h00 et 07h00
            </Text>
          </View>
          <Text style={styles.silenceAction}>Modifier</Text>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersRow}>
          {FILTERS.map((filter) => {
            const active = filter.key === selectedFilter;

            return (
              <Pressable
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                style={[styles.filterChip, active && styles.filterChipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}>
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {GROUP_ORDER.map((group) => {
          const groupReminders = visibleReminders.filter(
            (reminder) => reminder.group === group,
          );
          if (groupReminders.length === 0) return null;

          return (
            <View key={group} style={styles.group}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{GROUP_LABELS[group]}</Text>
                <View style={styles.groupCount}>
                  <Text style={styles.groupCountText}>{groupReminders.length}</Text>
                </View>
              </View>

              <View style={styles.groupList}>
                {groupReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    enabled={enabled[reminder.id]}
                    onToggle={() => toggleReminder(reminder.id)}
                  />
                ))}
              </View>
            </View>
          );
        })}

        {visibleReminders.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Icon name="notifications_off" size={28} color={Serene.secondary} />
            </View>
            <Text style={styles.emptyTitle}>Aucun rappel ici</Text>
            <Text style={styles.emptyText}>
              Créez un rappel pour ne plus oublier vos échéances.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.addButton}
          accessibilityRole="button"
          onPress={() => router.push('/reminders/add')}>
          <Icon name="add_alert" size={20} color={Serene.onPrimary} />
          <Text style={styles.addButtonText}>Nouveau rappel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ReminderCard({
  reminder,
  enabled,
  onToggle,
}: {
  reminder: Reminder;
  enabled: boolean;
  onToggle: () => void;
}) {
  const accentStyle =
    reminder.accent === 'error'
      ? styles.iconError
      : reminder.accent === 'secondary'
        ? styles.iconSecondary
        : styles.iconPrimary;

  const accentColor =
    reminder.accent === 'error'
      ? Serene.error
      : reminder.accent === 'secondary'
        ? Serene.secondary
        : Serene.primary;

  return (
    <View style={[styles.card, !enabled && styles.cardPaused]}>
      <View style={styles.timeColumn}>
        <Text style={[styles.time, !enabled && styles.textPaused]}>{reminder.time}</Text>
        <View style={[styles.kindDot, { backgroundColor: accentColor }]} />
      </View>

      <View style={[styles.iconBubble, accentStyle]}>
        <Icon name={reminder.icon} size={18} color={accentColor} />
      </View>

      <Pressable
        style={styles.cardBody}
        accessibilityRole="button"
        onPress={() => router.push('/reminders/edit')}>
        <Text style={[styles.cardTitle, !enabled && styles.textPaused]} numberOfLines={1}>
          {reminder.title}
        </Text>
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardKind}>{KIND_LABELS[reminder.kind]}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.cardDetail} numberOfLines={1}>
            {reminder.detail}
          </Text>
        </View>
      </Pressable>

      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: Serene.surfaceContainerHigh, true: Serene.secondary }}
        thumbColor={Serene.surfaceContainerLowest}
        style={styles.switch}
      />
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
    paddingHorizontal: Space.gutter,
    paddingTop: Space.sm,
    paddingBottom: Space.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleTextBlock: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.secondary,
  },
  title: {
    ...Typography.headlineMd,
    color: Serene.onSurface,
  },
  activePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  activePillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Space.md,
  },
  statCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  statValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
    color: Serene.onSurface,
  },
  statLabel: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
    marginTop: 1,
  },
  silenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  silenceIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  silenceBody: {
    flex: 1,
    minWidth: 0,
  },
  silenceTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  silenceText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  silenceAction: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.secondary,
  },
  filtersScroll: {
    marginTop: 12,
    marginHorizontal: -Space.gutter,
  },
  filtersRow: {
    paddingHorizontal: Space.gutter,
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
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
    color: Serene.onPrimary,
  },
  group: {
    marginTop: Space.md,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Space.sm,
  },
  groupTitle: {
    flexShrink: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  groupCount: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupCountText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  groupList: {
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  cardPaused: {
    backgroundColor: Serene.surfaceContainerLow,
  },
  timeColumn: {
    width: 52,
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  kindDot: {
    width: 5,
    height: 5,
    borderRadius: Radius.full,
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPrimary: {
    backgroundColor: Serene.primaryContainer,
  },
  iconSecondary: {
    backgroundColor: Serene.secondaryContainer,
  },
  iconError: {
    backgroundColor: Serene.errorContainer,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  cardKind: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.secondary,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.outlineVariant,
  },
  cardDetail: {
    flexShrink: 1,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  textPaused: {
    color: Serene.onSurfaceVariant,
  },
  switch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Space.xl,
    gap: 6,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Space.gutter,
    paddingVertical: 10,
    backgroundColor: Serene.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Serene.surfaceContainerHigh,
  },
  addButton: {
    height: 48,
    borderRadius: Radius.xl,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.floating,
  },
  addButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
});
