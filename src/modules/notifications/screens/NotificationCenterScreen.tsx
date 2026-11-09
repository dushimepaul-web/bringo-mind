// S-22 (centre) - Centre de notifications | Module M10 Notifications | Phase S8
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

type NotificationType = 'task' | 'event' | 'document' | 'household';

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  group: 'today' | 'yesterday';
  href:
    | '/tasks/detail'
    | '/tasks'
    | '/calendar/detail'
    | '/documents/detail'
    | '/household'
    | '/household/members'
    | '/reminders';
};

const FILTERS = [
  { key: 'all', label: 'Tout' },
  { key: 'unread', label: 'Non lues' },
  { key: 'task', label: 'Tâches' },
  { key: 'household', label: 'Foyer' },
] as const;

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'task',
    title: 'Échéance dans 1 heure',
    body: 'Renvoyer attestation de domicile signée • aujourd’hui à 17h00',
    time: 'Il y a 5 min',
    group: 'today',
    href: '/tasks/detail',
  },
  {
    id: 'n2',
    type: 'document',
    title: 'Analyse IA terminée',
    body: 'Attestation_domicile_2024.pdf • 6 données extraites, fiabilité 98,4 %',
    time: 'Il y a 42 min',
    group: 'today',
    href: '/documents/detail',
  },
  {
    id: 'n3',
    type: 'household',
    title: 'Nouvelle activité du foyer',
    body: 'Thomas a ajouté l’événement « Réunion parents d’élèves »',
    time: 'Il y a 2 h',
    group: 'today',
    href: '/household',
  },
  {
    id: 'n4',
    type: 'event',
    title: 'Rappel de rendez-vous',
    body: 'Rendez-vous dentiste demain à 09h30 • Dr. Moreau',
    time: 'Il y a 4 h',
    group: 'today',
    href: '/calendar/detail',
  },
  {
    id: 'n5',
    type: 'task',
    title: 'Tâche en retard',
    body: 'Contrôle technique Peugeot 208 • en retard de 2 jours',
    time: 'Hier à 18:20',
    group: 'yesterday',
    href: '/tasks',
  },
  {
    id: 'n6',
    type: 'household',
    title: 'Invitation en attente',
    body: 'jeanne.martin@email.fr n’a pas encore répondu à l’invitation',
    time: 'Hier à 11:05',
    group: 'yesterday',
    href: '/household/members',
  },
];

export default function NotificationCenterScreen() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all');
  const [readAll, setReadAll] = useState(false);

  const unreadCount = readAll ? 0 : 4;

  const visible = NOTIFICATIONS.filter((item) => {
    if (filter === 'unread') return !readAll && item.group === 'today';
    if (filter === 'task') return item.type === 'task';
    if (filter === 'household') return item.type === 'household';
    return true;
  });

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
        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 ? (
            <View style={styles.unreadPill}>
              <Text style={styles.unreadPillText}>{unreadCount}</Text>
            </View>
          ) : null}
        </View>
        <Pressable
          style={styles.headerButton}
          accessibilityLabel="Paramètres des notifications"
          onPress={() => router.push('/notifications/settings')}>
          <Icon name="settings" size={20} color={Serene.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.actionRow}>
          <Text style={styles.actionHint}>
            {unreadCount > 0 ? `${unreadCount} notifications non lues` : 'Tout est à jour'}
          </Text>
          <Pressable
            style={styles.markAllButton}
            onPress={() => setReadAll(true)}
            accessibilityRole="button">
            <Icon name="done_all" size={15} color={Serene.secondary} />
            <Text style={styles.markAllText}>Tout marquer lu</Text>
          </Pressable>
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

        {(['today', 'yesterday'] as const).map((group) => {
          const items = visible.filter((item) => item.group === group);
          if (items.length === 0) return null;

          return (
            <View key={group} style={styles.group}>
              <Text style={styles.groupTitle}>
                {group === 'today' ? "Aujourd'hui" : 'Hier'}
              </Text>

              <View style={styles.groupList}>
                {items.map((item, index) => {
                  const unread = !readAll && group === 'today' && index < 4;

                  return (
                    <Pressable
                      key={item.id}
                      style={[styles.card, unread && styles.cardUnread]}
                      onPress={() => router.push(item.href)}
                      accessibilityRole="button">
                      <View
                        style={[
                          styles.iconBubble,
                          item.type === 'task'
                            ? styles.iconTask
                            : item.type === 'event'
                              ? styles.iconEvent
                              : item.type === 'document'
                                ? styles.iconDocument
                                : styles.iconHousehold,
                        ]}>
                        <Icon
                          name={typeIcon(item.type)}
                          size={18}
                          color={typeColor(item.type)}
                        />
                      </View>

                      <View style={styles.cardBody}>
                        <View style={styles.cardTitleRow}>
                          <Text style={styles.cardTitle} numberOfLines={1}>
                            {item.title}
                          </Text>
                          {unread ? <View style={styles.unreadDot} /> : null}
                        </View>
                        <Text style={styles.cardText} numberOfLines={2}>
                          {item.body}
                        </Text>
                        <Text style={styles.cardTime}>{item.time}</Text>
                      </View>

                      <Icon name="chevron_right" size={18} color={Serene.outlineVariant} />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}

        {visible.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Icon name="notifications_off" size={26} color={Serene.secondary} />
            </View>
            <Text style={styles.emptyTitle}>Aucune notification</Text>
            <Text style={styles.emptyText}>
              Vous êtes à jour. Les nouvelles alertes apparaîtront ici.
            </Text>
          </View>
        ) : null}

        <Pressable
          style={styles.footerButton}
          accessibilityRole="button"
          onPress={() => router.push('/notifications/settings')}>
          <Icon name="tune" size={18} color={Serene.onSurface} />
          <Text style={styles.footerButtonText}>Gérer mes préférences de notification</Text>
          <Icon name="chevron_right" size={18} color={Serene.outlineVariant} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function typeIcon(type: NotificationType) {
  if (type === 'task') return 'task_alt';
  if (type === 'event') return 'event';
  if (type === 'document') return 'folder';
  return 'family_restroom';
}

function typeColor(type: NotificationType) {
  if (type === 'task') return Serene.primary;
  if (type === 'event') return Serene.secondary;
  if (type === 'document') return Serene.warning;
  return Serene.secondary;
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
  headerTitleBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  headerTitle: {
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  unreadPill: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadPillText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    lineHeight: 13,
    color: Serene.onPrimary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.sm,
    paddingBottom: Space.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionHint: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  markAllText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.secondary,
  },
  filtersScroll: {
    marginTop: 10,
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
  groupTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
    marginBottom: Space.sm,
  },
  groupList: {
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  cardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: Serene.secondary,
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTask: {
    backgroundColor: Serene.surfaceContainerHigh,
  },
  iconEvent: {
    backgroundColor: Serene.secondaryContainer,
  },
  iconDocument: {
    backgroundColor: Serene.warningContainer,
  },
  iconHousehold: {
    backgroundColor: Serene.secondaryContainer,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    flexShrink: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
  },
  cardText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
    marginTop: 1,
  },
  cardTime: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.outlineVariant,
    marginTop: 3,
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
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Space.md,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  footerButtonText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
});
