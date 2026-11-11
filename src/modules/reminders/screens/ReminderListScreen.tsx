// S-11 - Rappels | Module M05 Rappels | Phase S5
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { Chip, PrimaryButton, SwipeRow, Tag, UndoToast, kitStyles } from '@/components/ui/kit';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';
import { dayOffset, formatDay, formatLongDay, formatTime } from '@/lib/demo-dates';

import { CHANNEL_META, QUIET_HOURS, linkIcon, linkLabel, repeatSummary } from '../data';
import { QueryView } from '@/components/ui/states';
import { useQuery } from '@/hooks/use-query';

import { reminderActions, syncReminders, useReminderState } from '../store';
import type { Reminder } from '../types';

type FilterKey = 'upcoming' | 'past' | 'paused' | 'all';
type SectionKey = 'today' | 'tomorrow' | 'week' | 'later' | 'paused' | 'past';
type Toast = { text: string; undo?: () => void };

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'upcoming', label: 'À venir' },
  { key: 'past', label: 'Passés' },
  { key: 'paused', label: 'En pause' },
  { key: 'all', label: 'Tous' },
];

const DAY_SHORT = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];

function sectionOf(reminder: Reminder): SectionKey {
  if (reminder.delivery) return 'past';
  if (reminder.paused) return 'paused';
  const offset = dayOffset(reminder.at);
  if (offset <= 0) return 'today';
  if (offset === 1) return 'tomorrow';
  if (offset < 7) return 'week';
  return 'later';
}

function sectionTitle(key: SectionKey, sample: Reminder): string {
  switch (key) {
    case 'today':
      return `Aujourd’hui • ${formatLongDay(sample.at)}`;
    case 'tomorrow':
      return `Demain • ${formatLongDay(sample.at)}`;
    case 'week':
      return 'Cette semaine';
    case 'later':
      return 'Plus tard';
    case 'paused':
      return 'En pause';
    default:
      return 'Passés';
  }
}

const ORDER: Record<FilterKey, SectionKey[]> = {
  upcoming: ['today', 'tomorrow', 'week', 'later'],
  past: ['past'],
  paused: ['paused'],
  all: ['today', 'tomorrow', 'week', 'later', 'paused', 'past'],
};

export default function ReminderListScreen() {
  const { reminders, notificationsAllowed, flash } = useReminderState();
  const [filter, setFilter] = useState<FilterKey>('upcoming');
  const [toast, setToast] = useState<Toast | null>(null);
  const sync = useQuery('reminders', syncReminders);

  useFocusEffect(
    useCallback(() => {
      if (flash) {
        setToast(flash);
        reminderActions.setFlash(null);
      }
    }, [flash]),
  );

  const counts = useMemo(() => {
    const result = { today: 0, tomorrow: 0, paused: 0, past: 0, missed: 0, upcoming: 0 };
    for (const item of reminders) {
      const section = sectionOf(item);
      if (section === 'today') result.today += 1;
      if (section === 'tomorrow') result.tomorrow += 1;
      if (section === 'paused') result.paused += 1;
      if (section === 'past') result.past += 1;
      if (item.delivery?.status === 'missed') result.missed += 1;
      if (!item.delivery && !item.paused) result.upcoming += 1;
    }
    return result;
  }, [reminders]);

  const sections = useMemo(
    () =>
      ORDER[filter]
        .map((key) => ({
          key,
          items: reminders
            .filter((item) => sectionOf(item) === key)
            .sort((a, b) =>
              key === 'past' ? b.at.getTime() - a.at.getTime() : a.at.getTime() - b.at.getTime(),
            ),
        }))
        .filter((section) => section.items.length > 0),
    [reminders, filter],
  );

  const refreshing = sync.refreshing;
  const onRefresh = sync.reload;

  const togglePause = (item: Reminder) => {
    const paused = !item.paused;
    reminderActions.setPaused(item.id, paused);
    setToast({
      text: paused ? 'Rappel mis en pause.' : 'Rappel réactivé.',
      undo: () => reminderActions.setPaused(item.id, !paused),
    });
  };

  const snooze = (item: Reminder) => {
    reminderActions.snooze(item.id, 60);
    setToast({
      text: `Repoussé d’1 heure : ${formatTime(new Date(item.at.getTime() + 3600000))}.`,
      undo: () => reminderActions.snooze(item.id, -60),
    });
  };

  const resend = (item: Reminder) => {
    reminderActions.resend(item.id);
    setToast({ text: `« ${item.title} » renvoyé.` });
  };

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[kitStyles.content, styles.content]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Tint.primary}
            colors={[Tint.primary]}
          />
        }>
        <View style={styles.titleRow}>
          <View style={styles.flex}>
            <Text style={styles.eyebrow}>Notifications</Text>
            <Text style={styles.pageTitle}>Rappels</Text>
          </View>
          <Tag label={`${counts.upcoming} actifs`} />
        </View>

        <View style={styles.stats}>
          <Stat value={counts.today} label="Aujourd’hui" />
          <Stat value={counts.tomorrow} label="Demain" />
          <Stat value={counts.paused} label="En pause" muted />
        </View>

        {!notificationsAllowed ? (
          <View style={styles.permission}>
            <View style={styles.permissionIcon}>
              <Icon name="notifications_off" size={22} color="#b45309" />
            </View>
            <View style={styles.flexMin}>
              <Text style={styles.cardTitle}>Autorisez les notifications</Text>
              <Text style={kitStyles.muted}>
                Pour recevoir vos rappels même lorsque l’application est fermée.
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.allow, pressed && styles.pressed]}
              accessibilityRole="button"
              onPress={() => {
                reminderActions.allowNotifications(true);
                setToast({ text: 'Notifications activées sur ce téléphone.' });
              }}>
              <Text style={styles.allowText}>Autoriser</Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [kitStyles.card, styles.quiet, pressed && kitStyles.cardPressed]}
          accessibilityRole="button"
          onPress={() => router.push('/notifications/settings')}>
          <View style={styles.quietIcon}>
            <Icon name="bedtime" size={22} color={Tint.navy} />
          </View>
          <View style={styles.flexMin}>
            <Text style={styles.cardTitle}>Heures de silence</Text>
            <Text style={kitStyles.muted}>
              Aucune notification entre {QUIET_HOURS.from} et {QUIET_HOURS.to}
            </Text>
          </View>
          <Text style={kitStyles.link}>Modifier</Text>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsRow}>
          {FILTERS.map((entry) => (
            <Chip
              key={entry.key}
              label={entry.label}
              selected={filter === entry.key}
              count={
                entry.key === 'past'
                  ? counts.missed || undefined
                  : entry.key === 'paused'
                    ? counts.paused || undefined
                    : undefined
              }
              onPress={() => setFilter(entry.key)}
            />
          ))}
        </ScrollView>

        {filter === 'past' && counts.missed > 0 ? (
          <View style={styles.missedNote}>
            <Icon name="error" size={20} color="#b91c1c" />
            <Text style={styles.missedText}>
              {counts.missed === 1 ? '1 rappel n’a pas pu être envoyé.' : `${counts.missed} rappels n’ont pas pu être envoyés.`}{' '}
              Vous pouvez le renvoyer.
            </Text>
          </View>
        ) : null}

        <QueryView query={sync} empty={{ icon: 'notifications', title: 'Aucun rappel', text: 'Créez un rappel pour ne rien oublier : une démarche, un événement, un appel.', actionLabel: 'Nouveau rappel', onAction: () => router.push('/reminders/add') }}>
        {sections.length === 0 ? (
          <View style={[kitStyles.card, styles.empty]}>
            <View style={styles.emptyIcon}>
              <Icon name="notifications_paused" size={30} color={Tint.primary} />
            </View>
            <Text style={styles.emptyTitle}>
              {filter === 'paused' ? 'Aucun rappel en pause' : 'Aucun rappel ici'}
            </Text>
            <Text style={styles.emptyText}>Créez un rappel pour ne rien oublier.</Text>
          </View>
        ) : (
          sections.map((section) => (
            <View key={section.key} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{sectionTitle(section.key, section.items[0])}</Text>
                <View style={styles.countPill}>
                  <Text style={styles.countText}>{section.items.length}</Text>
                </View>
              </View>
              <View style={styles.stack}>
                {section.items.map((item) => (
                  <ReminderRow
                    key={item.id}
                    item={item}
                    section={section.key}
                    onTogglePause={() => togglePause(item)}
                    onSnooze={() => snooze(item)}
                    onResend={() => resend(item)}
                  />
                ))}
              </View>
            </View>
          ))
        )}
        </QueryView>
      </ScrollView>

      <View style={styles.fabWrap} pointerEvents="box-none">
        <PrimaryButton
          label="Nouveau rappel"
          icon="add_alert"
          onPress={() => router.push('/reminders/add')}
          style={styles.fab}
        />
      </View>

      {toast ? (
        <UndoToast
          key={toast.text}
          text={toast.text}
          onUndo={toast.undo}
          onHide={() => setToast(null)}
          bottom={84}
        />
      ) : null}
    </SafeAreaView>
  );
}

function Stat({ value, label, muted }: { value: number; label: string; muted?: boolean }) {
  return (
    <View style={[kitStyles.card, styles.stat]}>
      <Text style={[styles.statValue, muted && styles.statValueMuted]}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function ReminderRow({
  item,
  section,
  onTogglePause,
  onSnooze,
  onResend,
}: {
  item: Reminder;
  section: SectionKey;
  onTogglePause: () => void;
  onSnooze: () => void;
  onResend: () => void;
}) {
  const past = section === 'past';
  const missed = item.delivery?.status === 'missed';
  const showDay = section === 'week' || section === 'later' || past;
  const iconTone =
    item.link.kind === 'task'
      ? { bg: Serene.secondaryContainer, fg: Serene.onSecondaryContainer }
      : item.link.kind === 'event'
        ? { bg: '#e2dfff', fg: '#3323cc' }
        : { bg: Tint.soft, fg: Tint.navy };

  const row = (
    <Pressable
      style={({ pressed }) => [
        kitStyles.card,
        styles.row,
        item.paused && styles.rowPaused,
        pressed && kitStyles.cardPressed,
      ]}
      // Sur le web, un rôle « button » produirait un <button> contenant l'interrupteur.
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      accessibilityLabel={`${item.title}, ${formatTime(item.at)}`}
      onPress={() => router.push({ pathname: '/reminders/edit', params: { id: item.id } })}>
      <View style={styles.time}>
        <Text style={[styles.timeText, item.paused && styles.muted]}>{formatTime(item.at)}</Text>
        {showDay ? (
          <Text style={styles.timeDay}>
            {past
              ? dayOffset(item.at) === 0
                ? 'Auj.'
                : dayOffset(item.at) === -1
                  ? 'Hier'
                  : formatDay(item.at)
              : `${DAY_SHORT[item.at.getDay()]} ${item.at.getDate()}`}
          </Text>
        ) : null}
      </View>

      <View style={styles.rowBody}>
        <Text style={[styles.rowTitle, item.paused && styles.muted]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.meta}>
          <View style={[styles.linkTag, { backgroundColor: iconTone.bg }]}>
            <Icon name={linkIcon(item.link)} size={13} color={iconTone.fg} />
            <Text style={[styles.linkTagText, { color: iconTone.fg }]}>{linkLabel(item.link)}</Text>
          </View>
          <Text style={styles.metaText}>{repeatSummary(item)}</Text>
          {item.shared ? <Icon name="group" size={15} color={Tint.primary} /> : null}
          {item.channels.map((channel) => (
            <Icon key={channel} name={CHANNEL_META[channel].icon} size={15} color={Serene.onSurfaceVariant} />
          ))}
        </View>
        {past ? (
          <Text style={[styles.delivery, missed ? styles.deliveryMissed : styles.deliverySent]}>
            {missed ? 'Manqué' : 'Envoyé'} — {item.delivery?.detail}
          </Text>
        ) : null}
        {missed ? (
          <Pressable
            style={({ pressed }) => [styles.resend, pressed && styles.pressed]}
            accessibilityRole="button"
            onPress={onResend}>
            <Icon name="refresh" size={18} color={Serene.onPrimary} />
            <Text style={styles.resendText}>Renvoyer maintenant</Text>
          </Pressable>
        ) : null}
      </View>

      {past ? (
        missed ? (
          <Icon name="error" size={22} color="#b91c1c" filled />
        ) : (
          <Icon name="check_circle" size={22} color={Serene.success} filled />
        )
      ) : (
        <Switch
          value={!item.paused}
          onValueChange={onTogglePause}
          trackColor={{ false: Tint.border, true: Tint.primary }}
          thumbColor={Serene.surfaceContainerLowest}
          {...(Platform.OS === 'web' ? { activeThumbColor: Serene.surfaceContainerLowest } : {})}
          ios_backgroundColor={Tint.border}
          accessibilityLabel={item.paused ? `Réactiver ${item.title}` : `Mettre en pause ${item.title}`}
        />
      )}
    </Pressable>
  );

  if (past) return row;

  return (
    <SwipeRow
      onSwipeRight={onTogglePause}
      onSwipeLeft={item.paused ? undefined : onSnooze}
      rightLabel={item.paused ? 'Réactiver' : 'Pause'}
      rightIcon={item.paused ? 'play_circle' : 'pause_circle'}
      rightColor={Tint.navy}
      leftLabel="+1 h"
      leftIcon="snooze">
      {row}
    </SwipeRow>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexMin: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.75,
  },
  muted: {
    color: Serene.onSurfaceVariant,
  },
  content: {
    paddingBottom: 120,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    paddingTop: 16,
  },
  eyebrow: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Tint.primary,
  },
  pageTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
    color: Tint.navy,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Space.md,
  },
  stat: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  statValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 26,
    lineHeight: 32,
    color: Tint.navy,
  },
  statValueMuted: {
    color: Serene.onSurfaceVariant,
  },
  statLabel: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
  },
  cardTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  permission: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
    backgroundColor: '#fffbeb',
  },
  permissionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allow: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Tint.black,
    justifyContent: 'center',
  },
  allowText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onPrimary,
  },
  quiet: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quietIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Tint.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsScroll: {
    marginTop: 18,
    marginHorizontal: -Space.gutter,
  },
  chipsRow: {
    gap: 8,
    paddingHorizontal: Space.gutter,
  },
  missedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
  },
  missedText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: '#991b1b',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    flexShrink: 1,
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
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
  stack: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowPaused: {
    backgroundColor: Tint.softer,
  },
  time: {
    width: 52,
    alignItems: 'center',
  },
  timeText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
    fontVariant: ['tabular-nums'],
  },
  timeDay: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  rowTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 6,
    rowGap: 2,
  },
  linkTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  linkTagText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
  },
  metaText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  delivery: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  deliverySent: {
    color: Serene.success,
  },
  deliveryMissed: {
    color: '#b91c1c',
  },
  resend: {
    alignSelf: 'flex-start',
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: Tint.black,
  },
  resendText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onPrimary,
  },
  empty: {
    marginTop: 24,
    alignItems: 'center',
    gap: 10,
    paddingVertical: 28,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
    color: Tint.navy,
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 21,
    color: Serene.onSurfaceVariant,
  },
  fabWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    paddingHorizontal: Space.gutter,
    alignItems: 'center',
  },
  fab: {
    width: '100%',
    maxWidth: 528,
  },
});
