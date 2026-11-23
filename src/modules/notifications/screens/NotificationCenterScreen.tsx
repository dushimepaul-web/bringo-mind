// Mobile - Centre de notifications | Module M10 Notifications | Phase S5
// Comme les notifications du téléphone : une carte par jour, une ligne par notification (icône de couleur,
// titre, détail, heure), point turquoise si non lue. Balayer : à droite lu, à gauche supprimer (avec « Annuler »).
import { router } from 'expo-router';
import { Fragment, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { TURQUOISE } from '@/components/rings';
import { Chip, IconButton, SwipeRow, TopBar, UndoToast, useKitStyles } from '@/components/ui/kit';
import { QueryView } from '@/components/ui/states';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Space } from '@/constants/design';
import { useQuery } from '@/hooks/use-query';
import { dayOffset, formatDay, formatTime } from '@/lib/demo-dates';

import { inQuietNow, shortHour, syncNotificationPreferences, useNotificationSettings } from '../settings-store';
import { notificationActions, syncNotifications, useNotifications, type AppNotification, type NotificationKind } from '../store';

type Filter = 'all' | 'unread' | NotificationKind;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'unread', label: 'Non lues' },
  { key: 'task', label: 'Tâches' },
  { key: 'event', label: 'Événements' },
  { key: 'document', label: 'Documents' },
  { key: 'household', label: 'Foyer' },
];

// Carré de couleur + icône blanche, comme les icônes d'application du téléphone (lisible dans les deux modes).
const KINDS: Record<NotificationKind, { icon: string; tint: string }> = {
  task: { icon: 'task_alt', tint: '#16A34A' },
  event: { icon: 'event', tint: '#2F7BE0' },
  document: { icon: 'description', tint: '#E08A00' },
  household: { icon: 'family_restroom', tint: '#8B5CF6' },
};

function groupOf(date: Date): string {
  const offset = dayOffset(date);
  if (offset === 0) return 'Aujourd’hui';
  if (offset === -1) return 'Hier';
  return 'Plus tôt';
}

export default function NotificationCenterScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const settings = useNotificationSettings();
  const { items, error } = useNotifications();
  const sync = useQuery('notifications', syncNotifications);
  // Pastille « Silence » : préférences chargées au mieux, sans bloquer la liste.
  useEffect(() => {
    void syncNotificationPreferences().catch(() => undefined);
  }, []);
  const [filter, setFilter] = useState<Filter>('all');
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);

  // Action refusée par le serveur : le message s'affiche une fois.
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setToast({ text: error });
      notificationActions.clearError();
    }, 0);
    return () => clearTimeout(timer);
  }, [error]);

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
    notificationActions.markRead(item.id);
    router.push(item.href);
  };

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar
        title="Notifications"
        right={
          <View style={styles.topActions}>
            {unread ? (
              <Pressable
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Tout marquer comme lu"
                onPress={() => {
                  notificationActions.readAll();
                  setToast({ text: 'Toutes les notifications sont lues' });
                }}>
                <Text style={styles.link}>Tout lire</Text>
              </Pressable>
            ) : null}
            <IconButton icon="settings" label="Réglages des notifications" onPress={() => router.push('/notifications/settings')} />
          </View>
        }
      />
      <ScrollView
        contentContainerStyle={[kitStyles.content, styles.content]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={sync.refreshing} onRefresh={sync.reload} tintColor={c.link} colors={[c.link]} />}>
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

        {inQuietNow(settings) ? (
          <Pressable
            style={styles.quiet}
            accessibilityRole="button"
            accessibilityLabel="Heures de silence en cours, ouvrir les réglages"
            onPress={() => router.push('/notifications/settings')}>
            <Icon name="bedtime" size={16} color={c.text} filled />
            <Text style={styles.quietText}>
              Silence {shortHour(settings.quietStart)}–{shortHour(settings.quietEnd)}
            </Text>
          </Pressable>
        ) : null}

        <QueryView query={sync} empty={{ icon: 'notifications_none', title: 'Aucune notification', text: 'Vos échéances, rappels et nouveautés du foyer apparaîtront ici.' }}>
          {groups.length === 0 ? (
            <View style={[kitStyles.card, styles.empty]}>
              <Icon name="notifications_off" size={28} color={c.link} />
              <Text style={kitStyles.title}>Rien ici</Text>
              <Text style={[kitStyles.muted, styles.center]}>
                {filter === 'unread' ? 'Vous avez tout lu.' : 'Aucune notification de ce type pour le moment.'}
              </Text>
            </View>
          ) : (
            groups.map((group) => (
              <View key={group.label}>
                <Text style={styles.group}>{group.label}</Text>
                <View style={styles.groupCard}>
                  {group.items.map((item, index) => {
                    const kind = KINDS[item.kind];
                    return (
                      <Fragment key={item.id}>
                        {index > 0 ? <View style={styles.divider} /> : null}
                        <SwipeRow
                          rightLabel="Lue"
                          rightIcon="mark_email_read"
                          leftLabel="Supprimer"
                          leftIcon="delete"
                          leftColor={c.error}
                          onSwipeRight={() => notificationActions.markRead(item.id)}
                          onSwipeLeft={() => {
                            const undo = notificationActions.remove(item.id);
                            setToast({ text: 'Notification supprimée', undo });
                          }}>
                          <Pressable
                            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                            accessibilityRole="button"
                            accessibilityLabel={`${item.read ? '' : 'Non lue. '}${item.title}. ${item.body}`}
                            onPress={() => open(item)}>
                            <View style={[styles.icon, { backgroundColor: kind.tint }]}>
                              <Icon name={kind.icon} size={20} color="#FFFFFF" filled />
                            </View>
                            <View style={styles.flex}>
                              <View style={styles.rowLine}>
                                <Text style={[styles.title, !item.read && styles.titleUnread]} numberOfLines={1}>
                                  {item.title}
                                </Text>
                                <Text style={[styles.time, !item.read && styles.timeUnread]}>
                                  {dayOffset(item.at) < -1 ? formatDay(item.at) : formatTime(item.at)}
                                </Text>
                              </View>
                              <View style={[styles.rowLine, styles.rowBottom]}>
                                <Text style={styles.body} numberOfLines={2}>
                                  {item.body}
                                </Text>
                                {!item.read ? <View style={styles.dot} /> : null}
                              </View>
                            </View>
                          </Pressable>
                        </SwipeRow>
                      </Fragment>
                    );
                  })}
                </View>
              </View>
            ))
          )}
        </QueryView>

        <Text style={styles.hint}>Balayez vers la droite pour marquer lu, vers la gauche pour supprimer.</Text>
      </ScrollView>

      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={24} />
      ) : null}
    </SafeAreaView>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
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
    topActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    link: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.link,
    },
    // La ligne de filtres va jusqu'aux bords de l'écran pour montrer qu'elle défile.
    chipsScroll: {
      marginHorizontal: -Space.gutter,
    },
    chips: {
      gap: 8,
      paddingHorizontal: Space.gutter,
    },
    quiet: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: Radius.full,
      backgroundColor: c.soft,
      borderWidth: 1,
      borderColor: c.border,
    },
    quietText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.text,
    },
    group: {
      marginTop: 20,
      marginBottom: 8,
      marginLeft: 4,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.muted,
    },
    groupCard: {
      borderRadius: 18,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      marginLeft: 66,
      backgroundColor: c.divider,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: c.card,
    },
    rowPressed: {
      backgroundColor: c.soft,
    },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    rowBottom: {
      marginTop: 2,
    },
    title: {
      flex: 1,
      fontFamily: FontFamily.bodyMedium,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    titleUnread: {
      fontFamily: FontFamily.bodyBold,
    },
    time: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    timeUnread: {
      fontFamily: FontFamily.bodySemiBold,
      color: c.text,
    },
    body: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 19,
      color: c.muted,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: Radius.full,
      backgroundColor: TURQUOISE,
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
      color: c.muted,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
