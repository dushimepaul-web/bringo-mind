// Mobile - Centre de notifications | Module M10 Notifications | Phase S5
// Regroupées par jour ; toucher ouvre l'élément concerné ; balayer pour marquer lu ou supprimer (avec « Annuler »).
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Chip, IconButton, SwipeRow, TopBar, UndoToast, kitStyles } from '@/components/ui/kit';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';
import { dayOffset, formatDay, formatTime } from '@/lib/demo-dates';

import { notificationActions, useNotifications, type AppNotification, type NotificationKind } from '../store';

type Filter = 'all' | 'unread' | NotificationKind;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'unread', label: 'Non lues' },
  { key: 'task', label: 'Tâches' },
  { key: 'event', label: 'Événements' },
  { key: 'document', label: 'Documents' },
  { key: 'household', label: 'Foyer' },
];

const KINDS: Record<NotificationKind, { icon: string; bg: string; fg: string }> = {
  task: { icon: 'task_alt', bg: Serene.secondaryContainer, fg: Serene.onSecondaryContainer },
  event: { icon: 'event', bg: '#e2dfff', fg: '#3323cc' },
  document: { icon: 'description', bg: '#dce9ff', fg: '#1e3a8a' },
  household: { icon: 'family_restroom', bg: '#fef3c7', fg: '#92400e' },
};

function groupOf(date: Date): string {
  const offset = dayOffset(date);
  if (offset === 0) return 'Aujourd’hui';
  if (offset === -1) return 'Hier';
  return 'Plus tôt';
}

export default function NotificationCenterScreen() {
  const { items } = useNotifications();
  const [filter, setFilter] = useState<Filter>('all');
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);

  const unread = items.filter((item) => !item.read).length;
  const list = items.filter((item) => (filter === 'all' ? true : filter === 'unread' ? !item.read : item.kind === filter));
  const groups: { label: string; items: AppNotification[] }[] = [];
  for (const item of list) {
    const label = groupOf(item.at);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }

  const open = (item: AppNotification) => {
    notificationActions.setRead(item.id, true);
    router.push(item.href);
  };

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar
        title="Notifications"
        right={<IconButton icon="settings" label="Réglages des notifications" onPress={() => router.push('/notifications/settings')} />}
      />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <Text style={kitStyles.muted}>
            {unread ? `${unread} non lue${unread > 1 ? 's' : ''}` : 'Tout est lu'}
          </Text>
          {unread ? (
            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              onPress={() => {
                const undo = notificationActions.readAll();
                setToast({ text: 'Toutes les notifications sont lues', undo });
              }}>
              <Text style={styles.link}>Tout lire</Text>
            </Pressable>
          ) : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipsScroll}>
          {FILTERS.map((entry) => (
            <Chip
              key={entry.key}
              label={entry.label}
              count={entry.key === 'unread' ? unread : undefined}
              selected={filter === entry.key}
              onPress={() => setFilter(entry.key)}
            />
          ))}
        </ScrollView>

        <View style={styles.quiet}>
          <Icon name="bedtime" size={18} color={Serene.onSurfaceVariant} />
          <Text style={styles.quietText}>Heures de silence de 22h00 à 07h00 • rappels critiques autorisés</Text>
        </View>

        {groups.length === 0 ? (
          <View style={[kitStyles.card, styles.empty]}>
            <Icon name="notifications_off" size={28} color={Tint.primary} />
            <Text style={kitStyles.title}>Rien ici</Text>
            <Text style={[kitStyles.muted, styles.center]}>
              {filter === 'unread' ? 'Vous avez tout lu.' : 'Aucune notification de ce type pour le moment.'}
            </Text>
          </View>
        ) : (
          groups.map((group) => (
            <View key={group.label}>
              <Text style={styles.group}>{group.label}</Text>
              <View style={styles.stack}>
                {group.items.map((item) => {
                  const kind = KINDS[item.kind];
                  return (
                    <SwipeRow
                      key={item.id}
                      rightLabel={item.read ? 'Non lue' : 'Lue'}
                      rightIcon={item.read ? 'mark_email_unread' : 'mark_email_read'}
                      leftLabel="Supprimer"
                      leftIcon="delete"
                      leftColor={Serene.error}
                      onSwipeRight={() => notificationActions.setRead(item.id, !item.read)}
                      onSwipeLeft={() => {
                        const undo = notificationActions.remove(item.id);
                        setToast({ text: 'Notification supprimée', undo });
                      }}>
                      <Pressable
                        style={({ pressed }) => [kitStyles.card, styles.row, !item.read && styles.rowUnread, pressed && kitStyles.cardPressed]}
                        accessibilityRole="button"
                        accessibilityLabel={`${item.read ? '' : 'Non lue. '}${item.title}. ${item.body}`}
                        onPress={() => open(item)}>
                        <View style={[styles.icon, { backgroundColor: kind.bg }]}>
                          <Icon name={kind.icon} size={20} color={kind.fg} />
                        </View>
                        <View style={styles.flex}>
                          <View style={styles.rowTop}>
                            <Text style={[styles.title, !item.read && styles.titleUnread]} numberOfLines={2}>
                              {item.title}
                            </Text>
                            <Text style={styles.time}>
                              {dayOffset(item.at) < -1 ? formatDay(item.at) : formatTime(item.at)}
                            </Text>
                          </View>
                          <Text style={styles.body} numberOfLines={2}>
                            {item.body}
                          </Text>
                        </View>
                        {!item.read ? <View style={styles.dot} /> : null}
                      </Pressable>
                    </SwipeRow>
                  );
                })}
              </View>
            </View>
          ))
        )}

        <Text style={styles.hint}>Balayez vers la droite pour marquer lu, vers la gauche pour supprimer.</Text>
      </ScrollView>

      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={24} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    minWidth: 0,
  },
  center: {
    textAlign: 'center',
  },
  content: {
    paddingTop: 4,
    paddingBottom: 40,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.primary,
  },
  chipsScroll: {
    marginTop: 12,
  },
  chips: {
    gap: 8,
  },
  quiet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  quietText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  group: {
    marginTop: 20,
    marginBottom: 8,
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
    color: Tint.navy,
  },
  stack: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  rowUnread: {
    borderColor: '#99f6e4',
    backgroundColor: '#f7fffd',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  titleUnread: {
    fontFamily: FontFamily.bodyBold,
  },
  time: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  body: {
    marginTop: 2,
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: Tint.primary,
  },
  empty: {
    marginTop: 18,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  hint: {
    marginTop: 18,
    textAlign: 'center',
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
});
