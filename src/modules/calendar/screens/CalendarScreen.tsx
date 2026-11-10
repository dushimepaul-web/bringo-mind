// S-13 - Calendrier (planning, jour, semaine, mois, année) | Module M07 Rendez-vous et calendrier | Phase S6
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { Chip, PrimaryButton, SecondaryButton, UndoToast, kitStyles } from '@/components/ui/kit';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';
import { DEMO_TODAY, addDays, dayOffset, formatLongDay, formatTime, startOfDay } from '@/lib/demo-dates';

import {
  DayItemCard,
  ViewSwitcher,
  itemsForDay,
  type CalendarView,
  type DayItem,
  type SpaceFilter,
} from '../components/calendar-ui';
import { MONTHS, TASK_DEADLINES, TONES, WEEKDAY_LETTERS, WEEKDAY_SHORT, monthGrid, weekOf } from '../data';
import { eventActions, useCalendarState } from '../store';
import type { CalendarEvent } from '../types';

type View3 = Exclude<CalendarView, 'planning'>;

const isView = (value: string | undefined): value is View3 =>
  value === 'day' || value === 'week' || value === 'month' || value === 'year';

const FILTERS: { key: SpaceFilter; label: string; icon: string }[] = [
  { key: 'all', label: 'Tout', icon: 'calendar_view_month' },
  { key: 'personal', label: 'Personnel', icon: 'person' },
  { key: 'household', label: 'Foyer', icon: 'group' },
];

const FIRST_HOUR = 7;
const LAST_HOUR = 22;
const HOUR_HEIGHT = 60;

function dotColor(item: DayItem): string {
  return item.kind === 'event' ? TONES[item.event.tone].bar : Tint.primary;
}

export default function CalendarScreen() {
  const { events, flash } = useCalendarState();
  const params = useLocalSearchParams<{ view?: string }>();
  const [view, setView] = useState<View3>(() => (isView(params.view) ? params.view : 'month'));
  const [lastParam, setLastParam] = useState(params.view);
  // Retour depuis le Planning avec une vue choisie (ex. « Année »).
  if (params.view !== lastParam) {
    setLastParam(params.view);
    if (isView(params.view)) setView(params.view);
  }
  const [selected, setSelected] = useState(() => startOfDay(DEMO_TODAY));
  const [filter, setFilter] = useState<SpaceFilter>('all');
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const touchX = useRef<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (flash) {
        setToast(flash);
        eventActions.setFlash(null);
      }
    }, [flash]),
  );

  const items = useCallback(
    (day: Date) => itemsForDay(day, events, TASK_DEADLINES, filter),
    [events, filter],
  );

  const isToday = dayOffset(selected) === 0;
  const week = useMemo(() => weekOf(selected), [selected]);
  const grid = useMemo(() => monthGrid(selected.getFullYear(), selected.getMonth()), [selected]);
  const selectedItems = items(selected);

  const move = (direction: 1 | -1) => {
    if (view === 'day') setSelected((date) => addDays(date, direction));
    else if (view === 'week') setSelected((date) => addDays(date, 7 * direction));
    else if (view === 'year')
      setSelected((date) => {
        const year = date.getFullYear() + direction;
        const lastDay = new Date(year, date.getMonth() + 1, 0).getDate();
        return new Date(year, date.getMonth(), Math.min(date.getDate(), lastDay));
      });
    else
      setSelected((date) => {
        const target = new Date(date.getFullYear(), date.getMonth() + direction, 1);
        const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
        return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
      });
  };

  const periodLabel =
    view === 'year'
      ? `Année ${selected.getFullYear()}`
      : view === 'month'
      ? `${MONTHS[selected.getMonth()]} ${selected.getFullYear()}`
      : view === 'week'
        ? `Semaine du ${week[0].getDate()} au ${week[6].getDate()} ${MONTHS[week[6].getMonth()].toLowerCase()}`
        : formatLongDay(selected);

  const periodCount = useMemo(() => {
    const inPeriod = (event: CalendarEvent) =>
      view === 'year'
        ? event.start.getFullYear() === selected.getFullYear()
        : view === 'month'
        ? event.start.getMonth() === selected.getMonth() && event.start.getFullYear() === selected.getFullYear()
        : view === 'week'
          ? dayOffset(event.start) >= dayOffset(week[0]) && dayOffset(event.start) <= dayOffset(week[6])
          : dayOffset(event.start) === dayOffset(selected);
    const keep = (event: CalendarEvent) =>
      filter === 'all' || (filter === 'household' ? event.shared : !event.shared);
    return events.filter((event) => !event.cancelled && inPeriod(event) && keep(event)).length;
  }, [events, view, selected, week, filter]);

  const onSwipeEnd = (x: number) => {
    const start = touchX.current;
    touchX.current = null;
    if (start == null) return;
    const delta = x - start;
    if (Math.abs(delta) > 60) move(delta < 0 ? 1 : -1);
  };

  const addAt = (start?: Date) =>
    router.push({
      pathname: '/calendar/add',
      params: start ? { start: start.toISOString() } : { date: selected.toISOString() },
    });

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[kitStyles.content, styles.content]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <View style={styles.flex}>
            <Text style={styles.eyebrow}>Mon agenda</Text>
            <Text style={styles.pageTitle}>Calendrier</Text>
          </View>
          {!isToday ? (
            <Pressable
              style={({ pressed }) => [styles.todayButton, pressed && styles.pressed]}
              accessibilityRole="button"
              onPress={() => setSelected(startOfDay(DEMO_TODAY))}>
              <Icon name="today" size={18} color={Tint.navy} />
              <Text style={styles.todayText}>Aujourd’hui</Text>
            </Pressable>
          ) : null}
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Voir le planning"
            onPress={() => router.push('/calendar/agenda')}>
            <Icon name="view_agenda" size={22} color={Tint.navy} />
          </Pressable>
        </View>

        <View style={styles.periodRow}>
          <Pressable
            style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Période précédente"
            onPress={() => move(-1)}>
            <Icon name="chevron_left" size={24} color={Tint.navy} />
          </Pressable>
          <View style={styles.period}>
            <Text style={styles.periodLabel} numberOfLines={1}>
              {periodLabel}
            </Text>
            <Text style={styles.periodCount}>
              {periodCount === 0
                ? 'Aucun événement'
                : `${periodCount} événement${periodCount > 1 ? 's' : ''}`}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Période suivante"
            onPress={() => move(1)}>
            <Icon name="chevron_right" size={24} color={Tint.navy} />
          </Pressable>
        </View>

        <ViewSwitcher
          value={view}
          style={styles.switcher}
          onChange={(next) => {
            if (next === 'planning') {
              router.push('/calendar/agenda');
              return;
            }
            setView(next);
            // Garde l'adresse alignée sur la vue, pour que le retour depuis le Planning fonctionne toujours.
            setLastParam(next);
            router.setParams({ view: next });
          }}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filters}>
          {FILTERS.map((entry) => (
            <Chip
              key={entry.key}
              label={entry.label}
              icon={entry.icon}
              selected={filter === entry.key}
              onPress={() => setFilter(entry.key)}
            />
          ))}
        </ScrollView>

        <View
          onTouchStart={(event) => {
            touchX.current = event.nativeEvent.pageX;
          }}
          onTouchEnd={(event) => onSwipeEnd(event.nativeEvent.pageX)}>
          {view === 'month' ? (
            <View style={[kitStyles.card, styles.month]}>
              <View style={styles.weekHeader}>
                {WEEKDAY_LETTERS.map((letter, index) => (
                  <Text key={`${letter}-${index}`} style={styles.weekLetter}>
                    {letter}
                  </Text>
                ))}
              </View>
              <View style={styles.grid}>
                {grid.map(({ date, inMonth }) => {
                  const dayItems = items(date);
                  const isSelected = dayOffset(date) === dayOffset(selected);
                  const isTodayCell = dayOffset(date) === 0;
                  return (
                    <Pressable
                      key={date.toISOString()}
                      style={styles.cell}
                      accessibilityRole="button"
                      accessibilityLabel={`${formatLongDay(date)}, ${dayItems.length} élément${dayItems.length > 1 ? 's' : ''}`}
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => setSelected(startOfDay(date))}>
                      <View
                        style={[
                          styles.dayCircle,
                          isTodayCell && styles.dayToday,
                          isSelected && styles.daySelected,
                        ]}>
                        <Text
                          style={[
                            styles.dayNumber,
                            !inMonth && styles.dayOut,
                            isSelected && styles.dayNumberSelected,
                          ]}>
                          {date.getDate()}
                        </Text>
                      </View>
                      <View style={styles.dots}>
                        {dayItems.slice(0, 3).map((item, index) => (
                          <View
                            key={index}
                            style={[
                              styles.dot,
                              item.kind === 'task' ? styles.dotTask : { backgroundColor: dotColor(item) },
                            ]}
                          />
                        ))}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          {view === 'week' ? (
            <View style={[kitStyles.card, styles.weekStrip]}>
              {week.map((date) => {
                const dayItems = items(date);
                const isSelected = dayOffset(date) === dayOffset(selected);
                const isTodayCell = dayOffset(date) === 0;
                return (
                  <Pressable
                    key={date.toISOString()}
                    style={styles.weekCell}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setSelected(startOfDay(date))}>
                    <Text style={[styles.weekName, isTodayCell && styles.weekNameToday]}>
                      {WEEKDAY_SHORT[date.getDay()]}
                    </Text>
                    <View
                      style={[styles.dayCircle, isTodayCell && styles.dayToday, isSelected && styles.daySelected]}>
                      <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                        {date.getDate()}
                      </Text>
                    </View>
                    <Text style={styles.weekCount}>{dayItems.length || ''}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          {view === 'year' ? (
            <YearGrid
              year={selected.getFullYear()}
              hasItems={(date) => items(date).length > 0}
              onPickMonth={(month) => {
                setLastParam('month');
                router.setParams({ view: 'month' });
                const now = startOfDay(DEMO_TODAY);
                const sameMonth = now.getFullYear() === selected.getFullYear() && now.getMonth() === month;
                setSelected(sameMonth ? now : new Date(selected.getFullYear(), month, 1));
                setView('month');
              }}
            />
          ) : null}

          {view === 'day' ? (
            <DayTimeline
              day={selected}
              items={selectedItems}
              onEmptySlot={(hour) => addAt(new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), hour))}
            />
          ) : null}
        </View>

        {view === 'week' || view === 'month' ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {isToday ? 'Aujourd’hui • ' : ''}
                {formatLongDay(selected)}
              </Text>
              <View style={styles.countPill}>
                <Text style={styles.countText}>{selectedItems.length}</Text>
              </View>
            </View>
            {selectedItems.length === 0 ? (
              <View style={[kitStyles.card, styles.empty]}>
                <Icon name="event_available" size={28} color={Tint.primary} />
                <Text style={styles.emptyTitle}>Journée libre</Text>
                <Text style={styles.emptyText}>Aucun événement ni échéance ce jour-là.</Text>
                <SecondaryButton label="Ajouter un événement" icon="add" onPress={() => addAt()} />
              </View>
            ) : (
              <View style={styles.stack}>
                {selectedItems.map((item) => (
                  <DayItemCard key={item.kind === 'event' ? item.event.id : `t-${item.task.id}`} item={item} />
                ))}
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.fabWrap} pointerEvents="box-none">
        <PrimaryButton label="Nouvel événement" icon="add" onPress={() => addAt()} style={styles.fab} />
      </View>

      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={84} />
      ) : null}
    </SafeAreaView>
  );
}

/** Vue Jour : toute la journée de 07h00 à 22h00, ligne de l'heure actuelle, créneaux vides cliquables. */
function DayTimeline({
  day,
  items,
  onEmptySlot,
}: {
  day: Date;
  items: DayItem[];
  onEmptySlot: (hour: number) => void;
}) {
  const timed = items.filter(
    (item): item is { kind: 'event'; event: CalendarEvent } => item.kind === 'event' && !item.event.allDay,
  );
  const banners = items.filter((item) => item.kind === 'task' || item.event.allDay);
  const hours = Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, index) => FIRST_HOUR + index);

  // Colonnes pour les événements qui se chevauchent.
  const columns: CalendarEvent[][] = [];
  const placement = new Map<string, number>();
  for (const { event } of timed) {
    let column = columns.findIndex((list) => list[list.length - 1].end <= event.start);
    if (column === -1) {
      columns.push([event]);
      column = columns.length - 1;
    } else {
      columns[column].push(event);
    }
    placement.set(event.id, column);
  }
  const columnCount = Math.max(columns.length, 1);
  const top = (date: Date) => ((date.getHours() + date.getMinutes() / 60) - FIRST_HOUR) * HOUR_HEIGHT;
  const showNow = dayOffset(day) === 0;

  return (
    <View style={styles.dayWrap}>
      {banners.length > 0 ? (
        <View style={styles.banners}>
          {banners.map((item) => (
            <DayItemCard key={item.kind === 'event' ? item.event.id : `t-${item.task.id}`} item={item} />
          ))}
        </View>
      ) : null}
      <View style={[kitStyles.card, styles.timeline]}>
        <View style={{ height: hours.length * HOUR_HEIGHT }}>
          {hours.map((hour) => (
            <Pressable
              key={hour}
              style={[styles.hourRow, { top: (hour - FIRST_HOUR) * HOUR_HEIGHT }]}
              accessibilityRole="button"
              accessibilityLabel={`Créer un événement à ${String(hour).padStart(2, '0')}h00`}
              onPress={() => onEmptySlot(hour)}>
              <Text style={styles.hourLabel}>{String(hour).padStart(2, '0')}:00</Text>
              <View style={styles.hourLine} />
            </Pressable>
          ))}

          <View style={styles.eventsArea} pointerEvents="box-none">
          {timed.map(({ event }) => {
            const tone = TONES[event.tone];
            const column = placement.get(event.id) ?? 0;
            const height = Math.max(
              ((event.end.getTime() - event.start.getTime()) / 3600000) * HOUR_HEIGHT - 4,
              40,
            );
            const compact = height < 54;
            return (
              <Pressable
                key={event.id}
                style={[
                  styles.block,
                  {
                    top: top(event.start) + 2,
                    height,
                    left: `${(column / columnCount) * 100}%`,
                    width: `${100 / columnCount}%`,
                    backgroundColor: event.cancelled ? Tint.soft : tone.bg,
                    borderLeftColor: event.cancelled ? Tint.border : tone.bar,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${event.title}, ${formatTime(event.start)}`}
                onPress={() => router.push({ pathname: '/calendar/detail', params: { id: event.id } })}>
                {compact ? (
                  // Événement court : heure et titre sur une seule ligne.
                  <Text style={[styles.blockTitle, event.cancelled && styles.blockCancelled]} numberOfLines={1}>
                    <Text style={[styles.blockTime, { color: tone.fg }]}>{formatTime(event.start)} </Text>
                    {event.title}
                  </Text>
                ) : (
                  <>
                    <Text style={[styles.blockTime, { color: tone.fg }]}>
                      {formatTime(event.start)} – {formatTime(event.end)}
                    </Text>
                    <Text
                      style={[styles.blockTitle, event.cancelled && styles.blockCancelled]}
                      numberOfLines={height > 70 ? 2 : 1}>
                      {event.title}
                    </Text>
                  </>
                )}
              </Pressable>
            );
          })}
          </View>

          {showNow ? (
            <View style={[styles.now, { top: top(DEMO_TODAY) }]} pointerEvents="none">
              <View style={styles.nowDot} />
              <View style={styles.nowLine} />
            </View>
          ) : null}
        </View>
      </View>
      <Text style={styles.hint}>Touchez un créneau libre pour créer un événement.</Text>
    </View>
  );
}

/** Vue Année : les 12 mois en miniature ; les jours occupés sont teintés, toucher un mois l'ouvre. */
function YearGrid({
  year,
  hasItems,
  onPickMonth,
}: {
  year: number;
  hasItems: (date: Date) => boolean;
  onPickMonth: (month: number) => void;
}) {
  return (
    <View style={styles.year}>
      {MONTHS.map((name, month) => {
        const current = DEMO_TODAY.getFullYear() === year && DEMO_TODAY.getMonth() === month;
        return (
          <Pressable
            key={name}
            style={({ pressed }) => [
              kitStyles.card,
              styles.miniMonth,
              current && styles.miniMonthCurrent,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Ouvrir ${name} ${year}`}
            onPress={() => onPickMonth(month)}>
            <Text style={[styles.miniTitle, current && styles.miniTitleCurrent]}>{name}</Text>
            <View style={styles.miniGrid}>
              {WEEKDAY_LETTERS.map((letter, index) => (
                <View key={`${letter}-${index}`} style={styles.miniCell}>
                  <Text style={styles.miniLetter}>{letter}</Text>
                </View>
              ))}
              {monthGrid(year, month).map(({ date, inMonth }) => {
                if (!inMonth) return <View key={date.toISOString()} style={styles.miniCell} />;
                const today = dayOffset(date) === 0;
                const busy = !today && hasItems(date);
                return (
                  <View key={date.toISOString()} style={styles.miniCell}>
                    <View style={[styles.miniDay, busy && styles.miniDayBusy, today && styles.miniDayToday]}>
                      <Text style={[styles.miniText, busy && styles.miniTextBusy, today && styles.miniTextToday]}>
                        {date.getDate()}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Pressable>
        );
      })}
      <View style={styles.yearLegend}>
        <View style={styles.legendSwatch} />
        <Text style={styles.legendText}>Jour avec un événement ou une échéance • touchez un mois pour l’ouvrir</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    paddingBottom: 120,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
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
  todayButton: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  todayText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.navy,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Space.md,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Tint.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  period: {
    flex: 1,
    alignItems: 'center',
  },
  periodLabel: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
    color: Tint.navy,
  },
  periodCount: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
  },
  switcher: {
    marginTop: 14,
  },
  year: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  miniMonth: {
    flexBasis: '47%',
    flexGrow: 1,
    paddingHorizontal: 6,
    paddingVertical: 10,
    gap: 4,
  },
  miniMonthCurrent: {
    borderColor: Tint.primary,
  },
  miniTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    lineHeight: 22,
    color: Tint.navy,
    paddingHorizontal: 4,
  },
  miniTitleCurrent: {
    color: Tint.primary,
  },
  miniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  miniCell: {
    width: `${100 / 7}%`,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniDay: {
    minWidth: 22,
    height: 22,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniDayBusy: {
    backgroundColor: Tint.lavender,
  },
  miniDayToday: {
    backgroundColor: Tint.primary,
  },
  miniText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 16,
    color: Tint.navy,
    fontVariant: ['tabular-nums'],
  },
  miniTextBusy: {
    fontFamily: FontFamily.bodySemiBold,
    color: Tint.primary,
  },
  miniTextToday: {
    fontFamily: FontFamily.bodySemiBold,
    color: Serene.onPrimary,
  },
  miniLetter: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  yearLegend: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
    backgroundColor: Tint.lavender,
  },
  legendText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  filtersScroll: {
    marginTop: 12,
    marginHorizontal: -Space.gutter,
  },
  filters: {
    gap: 8,
    paddingHorizontal: Space.gutter,
  },
  month: {
    marginTop: 14,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekLetter: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayToday: {
    borderWidth: 2,
    borderColor: Tint.primary,
  },
  daySelected: {
    backgroundColor: Tint.black,
    borderColor: Tint.black,
  },
  dayNumber: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  dayOut: {
    color: '#b6bfcd',
  },
  dayNumberSelected: {
    color: Serene.onPrimary,
  },
  dots: {
    flexDirection: 'row',
    gap: 3,
    height: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
  },
  dotTask: {
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: Tint.primary,
  },
  weekStrip: {
    marginTop: 14,
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  weekCell: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  weekName: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  weekNameToday: {
    fontFamily: FontFamily.bodyBold,
    color: Tint.primary,
  },
  weekCount: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Tint.primary,
    minHeight: 18,
  },
  dayWrap: {
    marginTop: 14,
    gap: 10,
  },
  banners: {
    gap: 10,
  },
  timeline: {
    paddingLeft: 8,
    paddingRight: 10,
    paddingVertical: 12,
  },
  hourRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: HOUR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hourLabel: {
    width: 48,
    marginTop: -9,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    fontVariant: ['tabular-nums'],
  },
  hourLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Tint.border,
  },
  eventsArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 52,
    right: 0,
  },
  block: {
    position: 'absolute',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  blockTime: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
  },
  blockTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Tint.navy,
  },
  blockCancelled: {
    textDecorationLine: 'line-through',
    color: Serene.onSurfaceVariant,
  },
  now: {
    position: 'absolute',
    left: 44,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nowDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: '#dc2626',
  },
  nowLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#dc2626',
  },
  hint: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
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
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
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
    marginBottom: 6,
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
