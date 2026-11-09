// S-19 - Activité du foyer | Module M08 Foyer partagé | Phase S7
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

type ActivityType = 'task' | 'event' | 'document' | 'member';
type ActivityGroup = 'today' | 'yesterday' | 'week';

type ActivityItem = {
  id: string;
  actor: string;
  actorInitial: string;
  actorTone: 'primary' | 'secondary' | 'warning';
  action: string;
  target: string;
  time: string;
  group: ActivityGroup;
  type: ActivityType;
};

const FILTERS = [
  { key: 'all', label: 'Tout' },
  { key: 'task', label: 'Tâches' },
  { key: 'event', label: 'Événements' },
  { key: 'document', label: 'Documents' },
  { key: 'member', label: 'Membres' },
] as const;

const GROUP_LABELS: Record<ActivityGroup, string> = {
  today: "Aujourd'hui",
  yesterday: 'Hier',
  week: 'Cette semaine',
};

const GROUP_ORDER: ActivityGroup[] = ['today', 'yesterday', 'week'];

const ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    actor: 'Claire',
    actorInitial: 'C',
    actorTone: 'primary',
    action: 'a terminé la tâche',
    target: 'Renvoyer attestation de domicile',
    time: '14:20',
    group: 'today',
    type: 'task',
  },
  {
    id: 'a2',
    actor: 'Thomas',
    actorInitial: 'T',
    actorTone: 'secondary',
    action: 'a ajouté un événement',
    target: 'Réunion parents d’élèves',
    time: '11:05',
    group: 'today',
    type: 'event',
  },
  {
    id: 'a3',
    actor: 'Kora',
    actorInitial: 'K',
    actorTone: 'warning',
    action: 'a classé le document',
    target: 'Attestation_domicile_2024.pdf',
    time: '09:12',
    group: 'today',
    type: 'document',
  },
  {
    id: 'a4',
    actor: 'Claire',
    actorInitial: 'C',
    actorTone: 'primary',
    action: 'a invité',
    target: 'jeanne.martin@email.fr',
    time: '18:40',
    group: 'yesterday',
    type: 'member',
  },
  {
    id: 'a5',
    actor: 'Thomas',
    actorInitial: 'T',
    actorTone: 'secondary',
    action: 'a commenté la tâche',
    target: 'Acheter les fournitures scolaires',
    time: '16:15',
    group: 'yesterday',
    type: 'task',
  },
  {
    id: 'a6',
    actor: 'Léo',
    actorInitial: 'L',
    actorTone: 'warning',
    action: 'a terminé la tâche',
    target: 'Ranger sa chambre',
    time: '10:30',
    group: 'yesterday',
    type: 'task',
  },
  {
    id: 'a7',
    actor: 'Thomas',
    actorInitial: 'T',
    actorTone: 'secondary',
    action: 'a partagé un document',
    target: 'Assurance habitation 2024.pdf',
    time: 'Lun. 09:22',
    group: 'week',
    type: 'document',
  },
  {
    id: 'a8',
    actor: 'Claire',
    actorInitial: 'C',
    actorTone: 'primary',
    action: 'a créé le foyer',
    target: 'Foyer Martin',
    time: 'Dim. 17:05',
    group: 'week',
    type: 'member',
  },
];

export default function HouseholdActivityScreen() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all');

  const visible = useMemo(
    () => (filter === 'all' ? ACTIVITY : ACTIVITY.filter((item) => item.type === filter)),
    [filter],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Retour au foyer"
          onPress={() => router.back()}>
          <Icon name="arrow_back" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Activité du foyer</Text>
        <Pressable style={styles.headerButton} accessibilityLabel="Filtrer l’activité">
          <Icon name="tune" size={20} color={Serene.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Icon name="history" size={22} color={Serene.secondary} />
          </View>
          <View style={styles.summaryBody}>
            <Text style={styles.summaryTitle}>Foyer Martin</Text>
            <Text style={styles.summaryText}>
              {ACTIVITY.length} actions récentes • Visible par les membres
            </Text>
          </View>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>En direct</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersRow}>
          {FILTERS.map((option) => {
            const active = filter === option.key;

            return (
              <Pressable
                key={option.key}
                onPress={() => setFilter(option.key)}
                style={[styles.filterChip, active && styles.filterChipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}>
                <Text
                  style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {GROUP_ORDER.map((group) => {
          const items = visible.filter((item) => item.group === group);
          if (items.length === 0) return null;

          return (
            <View key={group} style={styles.group}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{GROUP_LABELS[group]}</Text>
                <View style={styles.groupCount}>
                  <Text style={styles.groupCountText}>{items.length}</Text>
                </View>
              </View>

              <View style={styles.timeline}>
                {items.map((item, index) => (
                  <View key={item.id} style={styles.timelineRow}>
                    <View style={styles.timelineRail}>
                      <View
                        style={[
                          styles.actorAvatar,
                          item.actorTone === 'warning'
                            ? styles.actorWarning
                            : item.actorTone === 'secondary'
                              ? styles.actorSecondary
                              : styles.actorPrimary,
                        ]}>
                        <Text style={styles.actorInitial}>{item.actorInitial}</Text>
                      </View>
                      {index < items.length - 1 ? <View style={styles.railLine} /> : null}
                    </View>

                    <View style={styles.activityCard}>
                      <View style={styles.activityTopRow}>
                        <Text style={styles.activityText} numberOfLines={3}>
                          <Text style={styles.activityActor}>{item.actor}</Text>{' '}
                          {item.action}{' '}
                          <Text style={styles.activityTarget}>{item.target}</Text>
                        </Text>
                        <View style={styles.typeIcon}>
                          <Icon
                            name={typeIcon(item.type)}
                            size={15}
                            color={Serene.onSurfaceVariant}
                          />
                        </View>
                      </View>
                      <View style={styles.activityMeta}>
                        <Icon name="schedule" size={12} color={Serene.onSurfaceVariant} />
                        <Text style={styles.activityTime}>{item.time}</Text>
                        <View style={styles.metaDot} />
                        <Text style={styles.activityType}>{typeLabel(item.type)}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {visible.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Icon name="history_toggle_off" size={26} color={Serene.secondary} />
            </View>
            <Text style={styles.emptyTitle}>Aucune activité</Text>
            <Text style={styles.emptyText}>
              Rien à afficher pour ce filtre. Essayez une autre catégorie.
            </Text>
          </View>
        ) : null}

        <View style={styles.privacyCard}>
          <Icon name="visibility_off" size={16} color={Serene.onSurfaceVariant} />
          <Text style={styles.privacyText}>
            L’historique ne contient que les actions partagées. Les modifications personnelles
            restent invisibles.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function typeIcon(type: ActivityType) {
  if (type === 'task') return 'task_alt';
  if (type === 'event') return 'event';
  if (type === 'document') return 'folder';
  return 'person_add';
}

function typeLabel(type: ActivityType) {
  if (type === 'task') return 'Tâche';
  if (type === 'event') return 'Événement';
  if (type === 'document') return 'Document';
  return 'Membre';
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
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryBody: {
    flex: 1,
    minWidth: 0,
  },
  summaryTitle: {
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  summaryText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.successContainer,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.success,
  },
  liveText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.success,
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
    ...Typography.headlineSm,
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
  timeline: {
    gap: 0,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timelineRail: {
    width: 36,
    alignItems: 'center',
  },
  actorAvatar: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actorPrimary: {
    backgroundColor: Serene.primary,
  },
  actorSecondary: {
    backgroundColor: Serene.secondary,
  },
  actorWarning: {
    backgroundColor: Serene.warning,
  },
  actorInitial: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onPrimary,
  },
  railLine: {
    flex: 1,
    width: 2,
    backgroundColor: Serene.surfaceContainerHigh,
    marginVertical: 4,
  },
  activityCard: {
    flex: 1,
    marginBottom: 10,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  activityTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  activityText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  activityActor: {
    fontFamily: FontFamily.bodySemiBold,
    color: Serene.onSurface,
  },
  activityTarget: {
    fontFamily: FontFamily.bodyMedium,
    color: Serene.secondary,
  },
  typeIcon: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  activityTime: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.outlineVariant,
    marginHorizontal: 2,
  },
  activityType: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
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
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: Space.md,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  privacyText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
});
