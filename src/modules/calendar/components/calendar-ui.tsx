// Éléments partagés par les écrans du module Calendrier.
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { kitStyles } from '@/components/ui/kit';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';
import { formatTime } from '@/lib/demo-dates';

import { TONES, durationOf, formatDuration, sameDay } from '../data';
import type { CalendarEvent, TaskDeadline } from '../types';

export type SpaceFilter = 'all' | 'personal' | 'household';

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
  const tone = TONES[event.tone];
  return (
    <Pressable
      style={({ pressed }) => [kitStyles.card, styles.card, pressed && kitStyles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${event.title}${event.allDay ? ', toute la journée' : `, ${formatTime(event.start)}`}`}
      onPress={() => router.push({ pathname: '/calendar/detail', params: { id: event.id } })}>
      <View style={[styles.bar, { backgroundColor: event.cancelled ? Tint.border : tone.bar }]} />
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
              <Icon name="group" size={13} color={Tint.primary} />
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
            <Icon name="location_on" size={15} color={Serene.onSurfaceVariant} />
            <Text style={styles.metaText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        ) : null}
        {!event.allDay ? (
          <Text style={styles.duration}>{formatDuration(durationOf(event))}</Text>
        ) : null}
      </View>
      <Icon name="chevron_right" size={22} color={Serene.onSurfaceVariant} />
    </Pressable>
  );
}

export function DeadlineCard({ task }: { task: TaskDeadline }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.deadline, pressed && kitStyles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Échéance : ${task.title}`}
      onPress={() => router.push({ pathname: '/tasks/detail', params: { id: task.id } })}>
      <View style={styles.deadlineCheck}>
        <Icon name="check" size={14} color={Tint.primary} />
      </View>
      <View style={styles.body}>
        <Text style={styles.deadlineLabel}>
          Échéance de tâche{task.hasTime ? ` • ${formatTime(task.due)}` : ''}
        </Text>
        <Text style={styles.deadlineTitle} numberOfLines={2}>
          {task.title}
        </Text>
      </View>
      <Icon name="chevron_right" size={22} color={Serene.onSurfaceVariant} />
    </Pressable>
  );
}

export function DayItemCard({ item }: { item: DayItem }) {
  return item.kind === 'event' ? <EventCard event={item.event} /> : <DeadlineCard task={item.task} />;
}

const styles = StyleSheet.create({
  segmented: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 16,
    backgroundColor: Tint.soft,
    borderWidth: 1,
    borderColor: Tint.border,
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
    backgroundColor: Serene.surfaceContainerLowest,
    shadowColor: Tint.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  segmentText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  segmentTextActive: {
    color: Tint.navy,
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
    color: Tint.navy,
    fontVariant: ['tabular-nums'],
  },
  timeEnd: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    fontVariant: ['tabular-nums'],
  },
  allDay: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Tint.navy,
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
    color: Tint.primary,
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
    color: Tint.navy,
  },
  cancelledText: {
    color: Serene.onSurfaceVariant,
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
    color: Serene.onSurfaceVariant,
  },
  duration: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
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
    borderColor: Tint.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deadlineLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Tint.primary,
  },
  deadlineTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
});
