// S-13 - Calendrier (jour, semaine, mois) | Module M07 Rendez-vous et calendrier | Phase S6
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

type CalendarView = 'day' | 'week' | 'month';

type EventTone = 'primary' | 'secondary' | 'tertiary';

type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  end: string;
  location: string;
  tone: EventTone;
  shared?: boolean;
  icon: string;
};

const VIEWS: { key: CalendarView; label: string }[] = [
  { key: 'day', label: 'Jour' },
  { key: 'week', label: 'Semaine' },
  { key: 'month', label: 'Mois' },
];

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const WEEK_DAYS = [
  { day: 6, label: 'Lun' },
  { day: 7, label: 'Mar' },
  { day: 8, label: 'Mer' },
  { day: 9, label: 'Jeu' },
  { day: 10, label: 'Ven' },
  { day: 11, label: 'Sam' },
  { day: 12, label: 'Dim' },
];

const EVENTS_BY_DAY: Record<number, number> = {
  2: 1,
  6: 2,
  9: 3,
  12: 1,
  15: 2,
  18: 1,
  21: 1,
  24: 2,
  27: 1,
  30: 1,
};

const DAY_NINE_EVENTS: CalendarEvent[] = [
  {
    id: 'dentiste',
    title: 'Rendez-vous dentiste',
    time: '09:30',
    end: '10:15',
    location: 'Dr. Moreau • Cabinet Voltaire',
    tone: 'secondary',
    icon: 'medical_services',
  },
  {
    id: 'reunion',
    title: 'Réunion projet Bringo Mind',
    time: '14:00',
    end: '15:00',
    location: 'Visioconférence',
    tone: 'primary',
    icon: 'videocam',
  },
  {
    id: 'leo',
    title: 'Récupérer Léo à l’école',
    time: '16:45',
    end: '17:15',
    location: 'École Jean Moulin',
    tone: 'tertiary',
    shared: true,
    icon: 'school',
  },
];

const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];

export default function CalendarScreen() {
  const [view, setView] = useState<CalendarView>('month');
  const [selectedDay, setSelectedDay] = useState(9);

  const monthCells = useMemo(() => {
    const firstDayOffset = 2;
    return Array.from({ length: 35 }, (_, index) => {
      const dayNumber = index - firstDayOffset + 1;
      const inMonth = dayNumber >= 1 && dayNumber <= 31;
      const displayDay = inMonth
        ? dayNumber
        : dayNumber <= 0
          ? 30 + dayNumber
          : dayNumber - 31;

      return {
        key: `${index}`,
        day: displayDay,
        inMonth,
        eventCount: inMonth ? (EVENTS_BY_DAY[displayDay] ?? 0) : 0,
      };
    });
  }, []);

  const selectedEvents = selectedDay === 9 ? DAY_NINE_EVENTS : [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <View style={styles.titleTextBlock}>
            <Text style={styles.eyebrow}>Mon agenda</Text>
            <Text style={styles.title}>Calendrier</Text>
          </View>
          <View style={styles.titleActions}>
            <Pressable
              style={styles.iconButton}
              accessibilityLabel="Vue liste"
              onPress={() => router.push('/calendar/agenda')}>
              <Icon name="view_agenda" size={20} color={Serene.onSurfaceVariant} />
            </Pressable>
            <Pressable
              style={styles.iconButton}
              accessibilityLabel="Aujourd’hui"
              onPress={() => {
                setSelectedDay(9);
                setView('day');
              }}>
              <Icon name="today" size={20} color={Serene.onSurfaceVariant} />
            </Pressable>
          </View>
        </View>

        <View style={styles.monthBar}>
          <Pressable style={styles.monthNav} accessibilityLabel="Mois précédent">
            <Icon name="chevron_left" size={22} color={Serene.onSurfaceVariant} />
          </Pressable>
          <View style={styles.monthLabelBlock}>
            <Text style={styles.monthLabel}>Mai 2024</Text>
            <Text style={styles.monthSub}>3 événements à venir</Text>
          </View>
          <Pressable style={styles.monthNav} accessibilityLabel="Mois suivant">
            <Icon name="chevron_right" size={22} color={Serene.onSurfaceVariant} />
          </Pressable>
        </View>

        <View style={styles.segmented}>
          {VIEWS.map((option) => {
            const active = view === option.key;

            return (
              <Pressable
                key={option.key}
                style={[styles.segment, active && styles.segmentActive]}
                onPress={() => setView(option.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}>
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {view === 'month' ? (
          <View style={styles.calendarCard}>
            <View style={styles.weekdayRow}>
              {WEEKDAYS.map((label, index) => (
                <Text key={`${label}-${index}`} style={styles.weekdayLabel}>
                  {label}
                </Text>
              ))}
            </View>
            <View style={styles.monthGrid}>
              {monthCells.map((cell) => {
                const isToday = cell.inMonth && cell.day === 9;
                const isSelected = cell.inMonth && cell.day === selectedDay;

                return (
                  <Pressable
                    key={cell.key}
                    style={styles.dayCell}
                    disabled={!cell.inMonth}
                    onPress={() => setSelectedDay(cell.day)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}>
                    <View
                      style={[
                        styles.dayCircle,
                        isSelected && !isToday && styles.dayCircleSelected,
                        isToday && styles.dayCircleToday,
                      ]}>
                      <Text
                        style={[
                          styles.dayNumber,
                          !cell.inMonth && styles.dayNumberMuted,
                          isSelected && !isToday && styles.dayNumberSelected,
                          isToday && styles.dayNumberToday,
                        ]}>
                        {cell.day}
                      </Text>
                    </View>
                    {cell.eventCount > 0 ? (
                      <View style={styles.dotRow}>
                        {Array.from({ length: Math.min(cell.eventCount, 3) }).map((_, dot) => (
                          <View
                            key={dot}
                            style={[
                              styles.dot,
                              isToday && styles.dotToday,
                              isSelected && !isToday && styles.dotSelected,
                            ]}
                          />
                        ))}
                      </View>
                    ) : (
                      <View style={styles.dotSpacer} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {view === 'week' ? (
          <View style={styles.weekCard}>
            {WEEK_DAYS.map((day) => {
              const isSelected = day.day === selectedDay;
              const isToday = day.day === 9;
              const count = EVENTS_BY_DAY[day.day] ?? 0;

              return (
                <Pressable
                  key={day.day}
                  style={styles.weekDay}
                  onPress={() => setSelectedDay(day.day)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}>
                  <Text style={[styles.weekDayLabel, isSelected && styles.weekDayLabelActive]}>
                    {day.label}
                  </Text>
                  <View
                    style={[
                      styles.weekDayCircle,
                      isToday && styles.dayCircleToday,
                      isSelected && !isToday && styles.dayCircleSelected,
                    ]}>
                    <Text
                      style={[
                        styles.weekDayNumber,
                        isToday && styles.dayNumberToday,
                        isSelected && !isToday && styles.dayNumberSelected,
                      ]}>
                      {day.day}
                    </Text>
                  </View>
                  {count > 0 ? (
                    <View style={[styles.weekDot, (isToday || isSelected) && styles.dotToday]} />
                  ) : (
                    <View style={styles.dotSpacer} />
                  )}
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {view === 'day' ? (
          <View style={styles.timelineCard}>
            {HOURS.map((hour) => {
              const hourEvents = DAY_NINE_EVENTS.filter(
                (event) => event.time.slice(0, 2) === hour.slice(0, 2),
              );

              return (
                <View key={hour} style={styles.hourRow}>
                  <Text style={styles.hourLabel}>{hour}</Text>
                  <View style={styles.hourLine} />
                  <View style={styles.hourEvents}>
                    {hourEvents.map((event) => (
                      <Pressable
                        key={event.id}
                        style={[styles.hourEvent, toneCardStyle(event.tone)]}
                        onPress={() => router.push('/calendar/detail')}>
                        <Text style={styles.hourEventTime}>{event.time}</Text>
                        <Text style={styles.hourEventTitle} numberOfLines={1}>
                          {event.title}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.agendaSection}>
            <View style={styles.agendaHeader}>
              <Text style={styles.agendaTitle}>
                {selectedDay === 9
                  ? 'Jeudi 9 mai'
                  : selectedDay === 10
                    ? 'Vendredi 10 mai'
                    : selectedDay === 11
                      ? 'Samedi 11 mai'
                      : `Le ${selectedDay} mai`}
              </Text>
              <View style={styles.groupCount}>
                <Text style={styles.groupCountText}>{selectedEvents.length}</Text>
              </View>
            </View>

            {selectedEvents.length > 0 ? (
              <View style={styles.eventList}>
                {selectedEvents.map((event) => (
                  <Pressable
                    key={event.id}
                    style={styles.eventCard}
                    onPress={() => router.push('/calendar/detail')}
                    accessibilityRole="button">
                    <View style={styles.eventTimeBlock}>
                      <Text style={styles.eventTime}>{event.time}</Text>
                      <Text style={styles.eventEnd}>{event.end}</Text>
                      <View style={[styles.eventBar, toneBarStyle(event.tone)]} />
                    </View>
                    <View style={styles.eventBody}>
                      <View style={styles.eventTopRow}>
                        <View style={[styles.eventIcon, toneBubbleStyle(event.tone)]}>
                          <Icon
                            name={event.icon}
                            size={16}
                            color={toneColor(event.tone)}
                          />
                        </View>
                        {event.shared ? (
                          <View style={styles.sharedPill}>
                            <Icon name="group" size={11} color={Serene.onSurfaceVariant} />
                            <Text style={styles.sharedText}>Foyer</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.eventTitle} numberOfLines={2}>
                        {event.title}
                      </Text>
                      <View style={styles.eventLocationRow}>
                        <Icon name="location_on" size={13} color={Serene.onSurfaceVariant} />
                        <Text style={styles.eventLocation} numberOfLines={1}>
                          {event.location}
                        </Text>
                      </View>
                    </View>
                    <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Icon name="event_available" size={26} color={Serene.secondary} />
                </View>
                <Text style={styles.emptyTitle}>Aucun événement</Text>
                <Text style={styles.emptyText}>
                  Cette journée est libre. Ajoutez un rendez-vous si besoin.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.addButton}
          accessibilityRole="button"
          onPress={() => router.push('/calendar/add')}>
          <Icon name="add" size={22} color={Serene.onPrimary} />
          <Text style={styles.addButtonText}>Nouvel événement</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function toneColor(tone: EventTone) {
  if (tone === 'secondary') return Serene.secondary;
  if (tone === 'tertiary') return Serene.warning;
  return Serene.primary;
}

function toneCardStyle(tone: EventTone) {
  if (tone === 'secondary') return styles.hourEventSecondary;
  if (tone === 'tertiary') return styles.hourEventTertiary;
  return styles.hourEventPrimary;
}

function toneBarStyle(tone: EventTone) {
  if (tone === 'secondary') return styles.eventBarSecondary;
  if (tone === 'tertiary') return styles.eventBarTertiary;
  return styles.eventBarPrimary;
}

function toneBubbleStyle(tone: EventTone) {
  if (tone === 'secondary') return styles.eventIconSecondary;
  if (tone === 'tertiary') return styles.eventIconTertiary;
  return styles.eventIconPrimary;
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
  titleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Space.md,
  },
  monthNav: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabelBlock: {
    alignItems: 'center',
  },
  monthLabel: {
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  monthSub: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  segmented: {
    flexDirection: 'row',
    marginTop: 12,
    padding: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  segment: {
    flex: 1,
    height: 34,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  segmentText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  segmentTextActive: {
    fontFamily: FontFamily.bodySemiBold,
    color: Serene.onSurface,
  },
  calendarCard: {
    marginTop: 12,
    padding: 10,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingBottom: 6,
  },
  weekdayLabel: {
    width: '14.2857%',
    textAlign: 'center',
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.2857%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: Serene.surfaceContainerHigh,
  },
  dayCircleToday: {
    backgroundColor: Serene.primary,
  },
  dayNumber: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  dayNumberMuted: {
    color: Serene.outlineVariant,
  },
  dayNumberSelected: {
    fontFamily: FontFamily.bodyBold,
    color: Serene.onSurface,
  },
  dayNumberToday: {
    fontFamily: FontFamily.bodyBold,
    color: Serene.onPrimary,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 2,
    height: 8,
    alignItems: 'center',
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
  },
  dotToday: {
    backgroundColor: Serene.secondary,
  },
  dotSelected: {
    backgroundColor: Serene.secondary,
  },
  dotSpacer: {
    height: 8,
    marginTop: 2,
  },
  weekCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    padding: 10,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  weekDayLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  weekDayLabelActive: {
    color: Serene.secondary,
    fontFamily: FontFamily.bodySemiBold,
  },
  weekDayCircle: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayNumber: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  weekDot: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.outlineVariant,
  },
  timelineCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 52,
  },
  hourLabel: {
    width: 44,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
    paddingTop: 2,
  },
  hourLine: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: Serene.surfaceContainerHigh,
    marginRight: 10,
  },
  hourEvents: {
    flex: 1,
    gap: 6,
    paddingBottom: 8,
  },
  hourEvent: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  hourEventPrimary: {
    backgroundColor: Serene.primaryContainer,
  },
  hourEventSecondary: {
    backgroundColor: Serene.secondaryContainer,
  },
  hourEventTertiary: {
    backgroundColor: Serene.warningContainer,
  },
  hourEventTime: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  hourEventTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  agendaSection: {
    marginTop: Space.md,
  },
  agendaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Space.sm,
  },
  agendaTitle: {
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
  eventList: {
    gap: 10,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  eventTimeBlock: {
    width: 48,
    alignItems: 'flex-start',
    gap: 1,
  },
  eventTime: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  eventEnd: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  eventBar: {
    width: 3,
    height: 22,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  eventBarPrimary: {
    backgroundColor: Serene.primary,
  },
  eventBarSecondary: {
    backgroundColor: Serene.secondary,
  },
  eventBarTertiary: {
    backgroundColor: Serene.warning,
  },
  eventBody: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  eventTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventIcon: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventIconPrimary: {
    backgroundColor: Serene.primaryContainer,
  },
  eventIconSecondary: {
    backgroundColor: Serene.secondaryContainer,
  },
  eventIconTertiary: {
    backgroundColor: Serene.warningContainer,
  },
  sharedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  sharedText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  eventTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  eventLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  eventLocation: {
    flexShrink: 1,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Space.lg,
    gap: 6,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
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
