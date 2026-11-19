// S-13 (vue liste) - Planning | Module M07 Rendez-vous et calendrier | Phase S6
// Tout ce qui est prévu, jour après jour, comme la vue « Planning » de l'agenda du téléphone.
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ScrollViewInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Chip, IconButton, TopBar, useKitStyles } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { DEMO_TODAY, dayOffset, formatTime, startOfDay } from '@/lib/demo-dates';

import { itemsForDay, type DayItem, type SpaceFilter, useTones } from '../components/calendar-ui';
import { MONTHS, TASK_DEADLINES, WEEKDAY_SHORT, durationOf, formatDuration } from '../data';
import { QueryView } from '@/components/ui/states';
import { useQuery } from '@/hooks/use-query';

import { syncEvents, useCalendarState } from '../store';

const FILTERS: { key: SpaceFilter; label: string; icon: string }[] = [
  { key: 'all', label: 'Tout', icon: 'calendar_view_month' },
  { key: 'personal', label: 'Personnel', icon: 'person' },
  { key: 'household', label: 'Foyer', icon: 'group' },
];

type Row =
  | { type: 'month'; key: string; label: string }
  | { type: 'day'; key: string; day: Date; items: DayItem[] };

export default function AgendaScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const { events } = useCalendarState();
  const sync = useQuery('events', syncEvents);
  const [filter, setFilter] = useState<SpaceFilter>('all');
  const [showTasks, setShowTasks] = useState(true);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const scrollRef = useRef<ScrollViewInstance>(null);
  // Position du jour d'aujourd'hui dans la liste (mesurée au rendu).
  const [todayY, setTodayY] = useState<number | null>(null);
  const positioned = useRef(false);

  const rows = useMemo<Row[]>(() => {
    const term = query.trim().toLowerCase();
    const matches = (title: string, place = '') =>
      !term || title.toLowerCase().includes(term) || place.toLowerCase().includes(term);
    const visibleEvents = events.filter((event) => matches(event.title, event.location));
    const visibleTasks = showTasks ? TASK_DEADLINES.filter((task) => matches(task.title)) : [];

    // Tous les jours qui ont quelque chose de prévu, plus aujourd'hui (toujours affiché).
    const keys = new Map<string, Date>();
    for (const date of [...visibleEvents.map((e) => e.start), ...visibleTasks.map((t) => t.due)]) {
      const day = startOfDay(date);
      keys.set(day.toDateString(), day);
    }
    if (!term) keys.set(startOfDay(DEMO_TODAY).toDateString(), startOfDay(DEMO_TODAY));

    const days = [...keys.values()].sort((a, b) => a.getTime() - b.getTime());
    const result: Row[] = [];
    let currentMonth = '';
    for (const day of days) {
      const items = itemsForDay(day, visibleEvents, visibleTasks, filter);
      if (items.length === 0 && dayOffset(day) !== 0) continue;
      const month = `${MONTHS[day.getMonth()]} ${day.getFullYear()}`;
      if (month !== currentMonth) {
        currentMonth = month;
        result.push({ type: 'month', key: `m-${month}`, label: month });
      }
      result.push({ type: 'day', key: day.toDateString(), day, items });
    }
    return result;
  }, [events, filter, showTasks, query]);

  const upcoming = rows.filter(
    (row): row is Extract<Row, { type: 'day' }> => row.type === 'day' && dayOffset(row.day) >= 0,
  );
  const upcomingCount = upcoming.reduce(
    (total, row) => total + row.items.filter((item) => item.kind === 'event' && !item.event.cancelled).length,
    0,
  );

  const scrollToToday = (animated = true) => {
    if (todayY !== null) scrollRef.current?.scrollTo({ y: Math.max(0, todayY - 8), animated });
  };

  // Ouvre le planning sur aujourd'hui, comme l'agenda du téléphone (une seule fois).
  useEffect(() => {
    if (todayY === null || positioned.current) return;
    const frame = requestAnimationFrame(() => {
      positioned.current = true;
      scrollRef.current?.scrollTo({ y: Math.max(0, todayY - 8), animated: false });
    });
    return () => cancelAnimationFrame(frame);
  }, [todayY]);

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar
        title="Planning"
        fallback="/calendar"
        right={
          <>
            <Pressable
              style={({ pressed }) => [styles.todayButton, pressed && styles.pressed]}
              accessibilityRole="button"
              onPress={() => scrollToToday()}>
              <Text style={styles.todayText}>Aujourd’hui</Text>
            </Pressable>
            <IconButton icon="add" label="Nouvel événement" onPress={() => router.push('/calendar/add')} />
          </>
        }
      />

      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={[kitStyles.content, styles.content]}
        showsVerticalScrollIndicator={false}>
        {/* Vues, recherche et filtres défilent avec la liste */}
        <View style={styles.toolbar}>
          <View style={[styles.search, searchFocused && kitStyles.inputFocused]}>
            <Icon name="search" size={20} color={searchFocused ? c.link : c.muted} />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Rechercher un événement…"
              placeholderTextColor={c.muted}
              selectionColor={c.link}
              accessibilityLabel="Rechercher dans le planning"
            />
            {query ? (
              <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Effacer" onPress={() => setQuery('')}>
                <Icon name="cancel" size={20} color={c.muted} filled />
              </Pressable>
            ) : null}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {FILTERS.map((entry) => (
              <Chip
                key={entry.key}
                label={entry.label}
                icon={entry.icon}
                selected={filter === entry.key}
                onPress={() => setFilter(entry.key)}
              />
            ))}
            <Chip
              label="Échéances"
              icon={showTasks ? 'check_box' : 'check_box_outline_blank'}
              selected={showTasks}
              onPress={() => setShowTasks((value) => !value)}
            />
          </ScrollView>
          <Text style={styles.summary}>
            {upcomingCount} événement{upcomingCount > 1 ? 's' : ''} à venir • remontez pour voir le passé
          </Text>
        </View>
        <QueryView query={sync} empty={{ icon: 'event_available', title: 'Rien de prévu', text: 'Ajoutez un événement ou connectez votre calendrier Google.', actionLabel: 'Nouvel événement', onAction: () => router.push('/calendar/add') }}>
        {rows.length === 0 ? (
          <View style={[kitStyles.card, styles.empty]}>
            <Icon name="search_off" size={28} color={c.link} />
            <Text style={styles.emptyTitle}>Aucun résultat</Text>
            <Text style={kitStyles.muted}>Essayez un autre mot-clé ou retirez un filtre.</Text>
          </View>
        ) : (
          rows.map((row) =>
            row.type === 'month' ? (
              <View key={row.key} style={styles.monthBanner}>
                <Text style={styles.monthText}>{row.label}</Text>
              </View>
            ) : (
              <View
                key={row.key}
                style={[styles.dayRow, dayOffset(row.day) < 0 && styles.pastRow]}
                onLayout={(event) => {
                  if (dayOffset(row.day) === 0) setTodayY(event.nativeEvent.layout.y);
                }}>
                <DayColumn day={row.day} />
                <View style={styles.dayItems}>
                  {row.items.length === 0 ? (
                    <Pressable
                      style={({ pressed }) => [styles.freeDay, pressed && styles.pressed]}
                      accessibilityRole="button"
                      onPress={() => router.push('/calendar/add')}>
                      <Text style={styles.freeText}>Rien de prévu aujourd’hui</Text>
                      <Text style={kitStyles.link}>Ajouter</Text>
                    </Pressable>
                  ) : (
                    row.items.map((item) => (
                      <PlanningItem
                        key={item.kind === 'event' ? item.event.id : `t-${item.task.id}`}
                        item={item}
                      />
                    ))
                  )}
                </View>
              </View>
            ),
          )
        )}
        </QueryView>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Colonne de gauche : jour de la semaine et numéro, entouré si c'est aujourd'hui. */
function DayColumn({ day }: { day: Date }) {
  const { styles } = useLook();
  const today = dayOffset(day) === 0;
  return (
    <View style={styles.dayColumn}>
      <Text style={[styles.weekday, today && styles.weekdayToday]}>
        {WEEKDAY_SHORT[day.getDay()].toUpperCase()}
      </Text>
      <View style={[styles.dayNumberWrap, today && styles.dayNumberToday]}>
        <Text style={[styles.dayNumber, today && styles.dayNumberTodayText]}>{day.getDate()}</Text>
      </View>
    </View>
  );
}

/** Ligne compacte d'un événement ou d'une échéance de tâche. */
function PlanningItem({ item }: { item: DayItem }) {
  const tones = useTones();
  const { c, styles } = useLook();
  if (item.kind === 'task') {
    const { task } = item;
    return (
      <Pressable
        style={({ pressed }) => [styles.item, styles.taskItem, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`Échéance : ${task.title}`}
        onPress={() => router.push({ pathname: '/tasks/detail', params: { id: task.id } })}>
        <View style={styles.taskBox}>
          <Icon name="check" size={12} color={c.link} />
        </View>
        <View style={styles.itemBody}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {task.title}
          </Text>
          <Text style={styles.taskMeta}>Échéance de tâche{task.hasTime ? ` • ${formatTime(task.due)}` : ''}</Text>
        </View>
      </Pressable>
    );
  }

  const { event } = item;
  const tone = tones[event.tone];
  return (
    <Pressable
      style={({ pressed }) => [styles.item, { backgroundColor: event.cancelled ? c.soft : tone.bg }, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${event.title}${event.allDay ? ', toute la journée' : `, ${formatTime(event.start)}`}`}
      onPress={() => router.push({ pathname: '/calendar/detail', params: { id: event.id } })}>
      <View style={[styles.itemBar, { backgroundColor: event.cancelled ? c.border : tone.bar }]} />
      <View style={styles.itemBody}>
        <Text style={[styles.itemTitle, event.cancelled && styles.cancelled]} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={[styles.itemTime, { color: tone.fg }]}>
          {event.allDay
            ? 'Toute la journée'
            : `${formatTime(event.start)} – ${formatTime(event.end)} • ${formatDuration(durationOf(event))}`}
          {event.cancelled ? ' • Annulé' : ''}
        </Text>
        {event.location ? (
          <Text style={styles.itemPlace} numberOfLines={1}>
            {event.location}
          </Text>
        ) : null}
      </View>
      {event.shared ? <Icon name="group" size={18} color={c.link} /> : null}
    </Pressable>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    pressed: {
      opacity: 0.8,
    },
    todayButton: {
      height: 36,
      paddingHorizontal: 12,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      justifyContent: 'center',
    },
    todayText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    toolbar: {
      gap: 10,
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    search: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    searchInput: {
      flex: 1,
      minWidth: 0,
      outlineWidth: 0,
      outlineStyle: 'solid',
      fontFamily: FontFamily.body,
      fontSize: 16,
      color: c.text,
      paddingVertical: 0,
    },
    filters: {
      gap: 8,
    },
    summary: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    content: {
      paddingTop: 4,
      paddingBottom: 40,
    },
    monthBanner: {
      marginTop: 18,
      marginBottom: 6,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor: c.soft,
    },
    monthText: {
      fontFamily: FontFamily.headingBold,
      fontSize: 18,
      lineHeight: 24,
      color: c.text,
    },
    dayRow: {
      flexDirection: 'row',
      gap: 12,
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    pastRow: {
      opacity: 0.6,
    },
    dayColumn: {
      width: 48,
      alignItems: 'center',
      gap: 2,
      paddingTop: 2,
    },
    weekday: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.4,
      color: c.muted,
    },
    weekdayToday: {
      color: c.link,
    },
    dayNumberWrap: {
      width: 40,
      height: 40,
      borderRadius: Radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayNumberToday: {
      backgroundColor: c.link,
    },
    dayNumber: {
      fontFamily: FontFamily.headingBold,
      fontSize: 20,
      lineHeight: 26,
      color: c.text,
    },
    dayNumberTodayText: {
      color: c.solidText,
    },
    dayItems: {
      flex: 1,
      minWidth: 0,
      gap: 8,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
      paddingRight: 12,
      borderRadius: 14,
      overflow: 'hidden',
    },
    itemBar: {
      width: 4,
      alignSelf: 'stretch',
      borderRadius: Radius.full,
      marginLeft: 6,
    },
    itemBody: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    itemTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    itemTime: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
    },
    itemPlace: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    cancelled: {
      textDecorationLine: 'line-through',
      color: c.muted,
    },
    taskItem: {
      paddingLeft: 10,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: '#99f6e4',
      backgroundColor: '#f0fdfa',
    },
    taskBox: {
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: c.link,
      alignItems: 'center',
      justifyContent: 'center',
    },
    taskMeta: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.link,
    },
    freeDay: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 44,
      paddingHorizontal: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: c.border,
    },
    freeText: {
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 19,
      color: c.muted,
    },
    empty: {
      marginTop: 22,
      alignItems: 'center',
      gap: 8,
      paddingVertical: 24,
    },
    emptyTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 18,
      lineHeight: 24,
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
