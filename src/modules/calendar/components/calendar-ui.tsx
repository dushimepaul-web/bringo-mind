// Éléments partagés par les écrans du module Calendrier.
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { useKitStyles } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { formatTime } from '@/lib/demo-dates';

import { TONES, TONES_DARK, durationOf, formatDuration, sameDay } from '../data';
import type { CalendarEvent, TaskDeadline } from '../types';

export type SpaceFilter = 'all' | 'personal' | 'household';

/** Couleurs des catégories du mode actuel. */
export function useTones() {
  return useScopedColors().dark ? TONES_DARK : TONES;
}

/** Les vues de l'agenda : Jour, Semaine, Mois, Année. « planning » = écran liste (aucun onglet actif). */
export type CalendarView = 'planning' | 'day' | 'week' | 'month' | 'year';

const VIEWS: { key: CalendarView; label: string }[] = [
  { key: 'day', label: 'Jour' },
  { key: 'week', label: 'Semaine' },
  { key: 'month', label: 'Mois' },
  { key: 'year', label: 'Année' },
];

export function ViewSwitcher({
  value,
  onChange,
  style,
}: {
  value: CalendarView;
  onChange: (view: CalendarView) => void;
  style?: object;
}) {
  const { styles } = useLook();
  return (
    <View style={[styles.segmented, style]} accessibilityRole="tablist">
      {VIEWS.map((entry) => {
        const active = value === entry.key;
        return (
          <Pressable
            key={entry.key}
            style={[styles.segment, active && styles.segmentActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(entry.key)}>
            <Text style={[styles.segmentText, active && styles.segmentTextActive]} numberOfLines={1}>
              {entry.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export type DayItem =
  | { kind: 'event'; event: CalendarEvent }
  | { kind: 'task'; task: TaskDeadline };

/** Événements et échéances d'un jour, filtrés par espace, triés par heure. */
export function itemsForDay(
  day: Date,
  events: CalendarEvent[],
  deadlines: TaskDeadline[],
  filter: SpaceFilter,
): DayItem[] {
  const keep = (shared: boolean) =>
    filter === 'all' || (filter === 'household' ? shared : !shared);
  const dayEvents: DayItem[] = events
    .filter((event) => sameDay(event.start, day) && keep(event.shared))
    .map((event) => ({ kind: 'event', event }));
  const dayTasks: DayItem[] = deadlines
    .filter((task) => sameDay(task.due, day) && keep(task.shared))
    .map((task) => ({ kind: 'task', task }));
  const time = (item: DayItem) =>
    item.kind === 'event'
      ? item.event.allDay
        ? 0
        : item.event.start.getTime()
      : item.task.hasTime
        ? item.task.due.getTime()
        : Number.MAX_SAFE_INTEGER;
  return [...dayEvents, ...dayTasks].sort((a, b) => time(a) - time(b));
}

export function EventCard({ event }: { event: CalendarEvent }) {
  const tones = useTones();
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const tone = tones[event.tone];
  return (
    <Pressable
      style={({ pressed }) => [kitStyles.card, styles.card, pressed && kitStyles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${event.title}${event.allDay ? ', toute la journée' : `, ${formatTime(event.start)}`}`}
      onPress={() => router.push({ pathname: '/calendar/detail', params: { id: event.id } })}>
      <View style={[styles.bar, { backgroundColor: event.cancelled ? c.border : tone.bar }]} />
      <View style={styles.time}>
        {event.allDay ? (
          <Text style={styles.allDay}>Journée</Text>
        ) : (
          <>
            <Text style={[styles.timeStart, event.cancelled && styles.cancelledText]}>
              {formatTime(event.start)}
            </Text>
            <Text style={styles.timeEnd}>{formatTime(event.end)}</Text>
          </>
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.tags}>
          <View style={[styles.tone, { backgroundColor: tone.bg }]}>
            <Icon name={tone.icon} size={13} color={tone.fg} />
            <Text style={[styles.toneText, { color: tone.fg }]}>{tone.label}</Text>
          </View>
          {event.shared ? (
            <View style={styles.shared}>
              <Icon name="group" size={13} color={c.link} />
              <Text style={styles.sharedText}>Foyer</Text>
            </View>
          ) : null}
          {event.cancelled ? <Text style={styles.cancelledTag}>Annulé</Text> : null}
        </View>
        <Text style={[styles.title, event.cancelled && styles.cancelledText]} numberOfLines={2}>
          {event.title}
        </Text>
        {event.location ? (
          <View style={styles.meta}>
            <Icon name="location_on" size={15} color={c.muted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        ) : null}
        {!event.allDay ? (
          <Text style={styles.duration}>{formatDuration(durationOf(event))}</Text>
        ) : null}
      </View>
      <Icon name="chevron_right" size={22} color={c.muted} />
    </Pressable>
  );
}

export function DeadlineCard({ task }: { task: TaskDeadline }) {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  return (
    <Pressable
      style={({ pressed }) => [styles.deadline, pressed && kitStyles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Échéance : ${task.title}`}
      onPress={() => router.push({ pathname: '/tasks/detail', params: { id: task.id } })}>
      <View style={styles.deadlineCheck}>
        <Icon name="check" size={14} color={c.link} />
      </View>
      <View style={styles.body}>
        <Text style={styles.deadlineLabel}>
          Échéance de tâche{task.hasTime ? ` • ${formatTime(task.due)}` : ''}
        </Text>
        <Text style={styles.deadlineTitle} numberOfLines={2}>
          {task.title}
        </Text>
      </View>
      <Icon name="chevron_right" size={22} color={c.muted} />
    </Pressable>
  );
}

export function DayItemCard({ item }: { item: DayItem }) {
  return item.kind === 'event' ? <EventCard event={item.event} /> : <DeadlineCard task={item.task} />;
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    segmented: {
      flexDirection: 'row',
      padding: 4,
      borderRadius: 16,
      backgroundColor: c.soft,
      borderWidth: 1,
      borderColor: c.border,
    },
    segment: {
      flex: 1,
      height: 40,
      paddingHorizontal: 2,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentActive: {
      backgroundColor: c.card,
      shadowColor: c.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    segmentText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    segmentTextActive: {
      color: c.text,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingLeft: 12,
      overflow: 'hidden',
    },
    bar: {
      width: 4,
      alignSelf: 'stretch',
      borderRadius: Radius.full,
    },
    time: {
      width: 48,
    },
    timeStart: {
      fontFamily: FontFamily.headingBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
      fontVariant: ['tabular-nums'],
    },
    timeEnd: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
      fontVariant: ['tabular-nums'],
    },
    allDay: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.text,
    },
    body: {
      flex: 1,
      minWidth: 0,
      gap: 3,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 6,
    },
    tone: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 6,
    },
    toneText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
    },
    shared: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    sharedText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.link,
    },
    cancelledTag: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 13,
      lineHeight: 18,
      color: '#b91c1c',
    },
    title: {
      fontFamily: FontFamily.headingBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    cancelledText: {
      color: c.muted,
      textDecorationLine: 'line-through',
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      flexShrink: 1,
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 19,
      color: c.muted,
    },
    duration: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    deadline: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: '#99f6e4',
      backgroundColor: '#f0fdfa',
    },
    deadlineCheck: {
      width: 24,
      height: 24,
      borderRadius: 7,
      borderWidth: 2,
      borderColor: c.link,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deadlineLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.link,
    },
    deadlineTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
