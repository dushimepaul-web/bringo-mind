// S-13 - Agenda | Module M07 Rendez-vous et calendrier | Phase S6
// D'après la maquette validée, aux couleurs de l'app : barre du mois bleu nuit (Planning, « Mai ⌄ », recherche, ajout),
// mois entier qui se déplie, bande de la semaine, puis la journée « Heure | Événement »
// (cartes à la hauteur de la durée, ligne verte de l'heure actuelle, échéances de tâches).
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { TURQUOISE } from '@/components/rings';
import { BottomSheet, SheetOption, UndoToast, useKitStyles } from '@/components/ui/kit';
import { QueryView } from '@/components/ui/states';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { useQuery } from '@/hooks/use-query';
import { addDays, dayOffset, formatTime, startOfDay, today } from '@/lib/demo-dates';

import { itemsForDay, type DayItem, type SpaceFilter } from '../components/calendar-ui';
import { MONTHS, TONES, WEEKDAY_LETTERS, durationOf, monthGrid, sameDay, weekOf } from '../data';
import { eventActions, syncMonth, useCalendarState } from '../store';
import type { CalendarEvent } from '../types';

const FILTERS: { key: SpaceFilter; label: string; icon: string }[] = [
  { key: 'all', label: 'Tout', icon: 'calendar_view_month' },
  { key: 'personal', label: 'Personnel', icon: 'person' },
  { key: 'household', label: 'Foyer', icon: 'group' },
];

const WEEK_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

/** Hauteur d'une carte selon la durée (comme la maquette), bornée pour rester lisible. */
const cardHeight = (minutes: number) => Math.max(66, Math.min(180, minutes * 1.1));

/** Heure de début d'un élément, en minutes depuis minuit (journée entière / sans heure : en tête). */
function startMinutes(item: DayItem): number {
  if (item.kind === 'event') return item.event.allDay ? -1 : item.event.start.getHours() * 60 + item.event.start.getMinutes();
  return item.task.hasTime ? item.task.due.getHours() * 60 + item.task.due.getMinutes() : -1;
}

export default function CalendarScreen() {
  const { c, styles } = useLook();
  const kit = useKitStyles();
  const { events, deadlines, flash } = useCalendarState();
  const [selected, setSelected] = useState(() => startOfDay(today()));
  // Chargement du mois affiché (rechargé en tirant vers le bas, et à chaque changement de mois).
  const sync = useQuery(`events-${selected.getFullYear()}-${selected.getMonth()}`, () => syncMonth(selected));
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [filter, setFilter] = useState<SpaceFilter>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuEvent, setMenuEvent] = useState<CalendarEvent | null>(null);
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

  const visibleEvents = useMemo(() => events.filter((event) => !event.cancelled), [events]);
  const items = useMemo(() => itemsForDay(selected, visibleEvents, deadlines, filter), [selected, visibleEvents, deadlines, filter]);
  const week = useMemo(() => weekOf(selected), [selected]);
  const grid = useMemo(() => monthGrid(selected.getFullYear(), selected.getMonth()), [selected]);
  const hasItems = (day: Date) => itemsForDay(day, visibleEvents, deadlines, filter).length > 0;

  // Ligne de l'heure actuelle : seulement aujourd'hui, avant le premier élément qui commence après.
  const now = today();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isToday = dayOffset(selected) === 0;
  const nowIndex = isToday ? items.findIndex((item) => startMinutes(item) > nowMinutes) : -2;
  const nowAt = nowIndex === -1 ? items.length : nowIndex;

  const moveMonth = (direction: 1 | -1) =>
    setSelected((date) => {
      const target = new Date(date.getFullYear(), date.getMonth() + direction, 1);
      const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
      return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
    });

  const onWeekSwipeEnd = (x: number) => {
    const start = touchX.current;
    touchX.current = null;
    if (start == null) return;
    const delta = x - start;
    if (Math.abs(delta) > 50) setSelected((date) => addDays(date, delta < 0 ? 7 : -7));
  };

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return visibleEvents
      .filter((event) => [event.title, event.location].some((value) => value.toLowerCase().includes(term)))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [visibleEvents, query]);

  const cancelEvent = (event: CalendarEvent) => {
    setMenuEvent(null);
    eventActions.cancel(event.id);
    setToast({ text: 'Événement annulé.' });
  };

  return (
    <SafeAreaView style={kit.safe} edges={['top']}>
      <AppHeader />

      {/* Barre du mois (et mois entier quand elle est dépliée) */}
      <View style={[styles.panel, monthOpen && styles.panelOpen]}>
        <View style={styles.monthBar}>
          <Pressable
            style={({ pressed }) => [styles.barIcon, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Planning : tout ce qui est prévu"
            onPress={() => router.push('/calendar/agenda')}>
            <Icon name="view_agenda" size={24} color="#FFFFFF" />
          </Pressable>
          <Pressable
            style={styles.monthTitle}
            accessibilityRole="button"
            accessibilityState={{ expanded: monthOpen }}
            accessibilityLabel={`${MONTHS[selected.getMonth()]} ${selected.getFullYear()}, ${monthOpen ? 'replier' : 'afficher'} le mois`}
            onPress={() => {
              setMonthOpen((value) => !value);
              setYearOpen(false);
            }}>
            <Text style={styles.monthText}>{MONTHS[selected.getMonth()]}</Text>
            <Icon name={monthOpen ? 'expand_less' : 'expand_more'} size={24} color="#FFFFFF" />
          </Pressable>
          <View style={styles.barRight}>
            <Pressable
              style={({ pressed }) => [styles.barIcon, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Rechercher et filtrer"
              onPress={() => setSearchOpen(true)}>
              <Icon name="search" size={24} color="#FFFFFF" />
              {filter !== 'all' ? <View style={styles.filterDot} /> : null}
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.barIcon, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Nouvel événement"
              onPress={() => router.push('/calendar/add')}>
              <Icon name="add_circle" size={26} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {monthOpen ? (
          <View style={styles.monthPanel}>
            <View style={styles.panelNav}>
              <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Mois précédent" onPress={() => moveMonth(-1)}>
                <Icon name="chevron_left" size={26} color="#FFFFFF" />
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel={`Choisir le mois de ${selected.getFullYear()}`} onPress={() => setYearOpen((value) => !value)}>
                <Text style={styles.panelYear}>
                  {yearOpen ? `Année ${selected.getFullYear()}` : `${MONTHS[selected.getMonth()]} ${selected.getFullYear()}`}
                </Text>
              </Pressable>
              <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Mois suivant" onPress={() => moveMonth(1)}>
                <Icon name="chevron_right" size={26} color="#FFFFFF" />
              </Pressable>
            </View>

            {yearOpen ? (
              <View style={styles.yearGrid}>
                {MONTHS.map((name, month) => {
                  const current = month === selected.getMonth();
                  return (
                    <Pressable
                      key={name}
                      style={[styles.yearCell, current && styles.yearCellOn]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: current }}
                      onPress={() => {
                        const lastDay = new Date(selected.getFullYear(), month + 1, 0).getDate();
                        setSelected(new Date(selected.getFullYear(), month, Math.min(selected.getDate(), lastDay)));
                        setYearOpen(false);
                      }}>
                      <Text style={[styles.yearText, current && styles.yearTextOn]}>{name.slice(0, 4)}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <>
                <View style={styles.gridRow}>
                  {WEEKDAY_LETTERS.map((letter, index) => (
                    <Text key={index} style={styles.gridLetter}>
                      {letter}
                    </Text>
                  ))}
                </View>
                <View style={styles.gridDays}>
                  {grid.map(({ date, inMonth }) => {
                    const chosen = sameDay(date, selected);
                    return (
                      <Pressable
                        key={date.toISOString()}
                        style={styles.gridCell}
                        accessibilityRole="button"
                        accessibilityState={{ selected: chosen }}
                        accessibilityLabel={`${date.getDate()} ${MONTHS[date.getMonth()]}`}
                        onPress={() => {
                          setSelected(startOfDay(date));
                          setMonthOpen(false);
                        }}>
                        <View style={[styles.gridDay, chosen && styles.gridDayOn]}>
                          <Text style={[styles.gridNumber, !inMonth && styles.gridNumberOut, chosen && styles.gridNumberOn]}>
                            {String(date.getDate()).padStart(2, '0')}
                          </Text>
                        </View>
                        <View style={[styles.gridDot, hasItems(date) && inMonth && styles.gridDotOn]} />
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}
          </View>
        ) : null}
      </View>

      {/* Bande de la semaine : glisser à gauche / à droite pour changer de semaine */}
      <View
        style={styles.week}
        onTouchStart={(event) => {
          touchX.current = event.nativeEvent.pageX;
        }}
        onTouchEnd={(event) => onWeekSwipeEnd(event.nativeEvent.pageX)}>
        {week.map((day, index) => {
          const chosen = sameDay(day, selected);
          const today = dayOffset(day) === 0;
          return (
            <Pressable
              key={day.toISOString()}
              style={[styles.weekDay, chosen && styles.weekDayOn]}
              accessibilityRole="button"
              accessibilityState={{ selected: chosen }}
              accessibilityLabel={`${WEEK_LABELS[index]} ${day.getDate()}`}
              onPress={() => setSelected(startOfDay(day))}>
              <Text style={[styles.weekLabel, chosen && styles.weekTextOn]}>{WEEK_LABELS[index]}</Text>
              <Text style={[styles.weekNumber, today && !chosen && styles.weekToday, chosen && styles.weekTextOn]}>{day.getDate()}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.dayContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={sync.refreshing} onRefresh={sync.reload} tintColor={c.link} colors={[c.link]} />}>
        <View style={styles.dayHead}>
          <Text style={[styles.dayHeadText, styles.timeCol]}>Heure</Text>
          <Text style={styles.dayHeadText}>Événement</Text>
        </View>

        <QueryView query={sync} loadingRows={4}>
          {items.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="event_available" size={32} color={c.link} />
              <Text style={styles.emptyTitle}>Rien de prévu ce jour</Text>
              <Pressable style={styles.emptyButton} accessibilityRole="button" onPress={() => router.push('/calendar/add')}>
                <Icon name="add" size={20} color={c.solidText} />
                <Text style={styles.emptyButtonText}>Ajouter un événement</Text>
              </Pressable>
            </View>
          ) : (
            items.map((item, index) => (
              <View key={item.kind === 'event' ? item.event.id : `t-${item.task.id}`}>
                {index === nowAt ? <NowLine /> : null}
                <TimelineRow item={item} upcoming={isToday && index === nowAt} onMenu={setMenuEvent} />
              </View>
            ))
          )}
          {items.length > 0 && nowAt === items.length ? <NowLine /> : null}
        </QueryView>
      </ScrollView>

      {toast ? <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={84} /> : null}

      {/* Recherche et filtre */}
      <BottomSheet visible={searchOpen} title="Rechercher" subtitle="Un événement, un lieu… et ce que vous voulez voir." onClose={() => setSearchOpen(false)}>
        <View style={styles.search}>
          <Icon name="search" size={20} color={c.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un événement…"
            placeholderTextColor={c.muted}
            selectionColor={c.link}
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Rechercher un événement"
          />
        </View>
        <View style={styles.segments}>
          {FILTERS.map((entry) => {
            const on = filter === entry.key;
            return (
              <Pressable
                key={entry.key}
                style={[styles.segment, on && styles.segmentOn]}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                onPress={() => setFilter(entry.key)}>
                <Icon name={entry.icon} size={18} color={on ? c.text : c.muted} />
                <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{entry.label}</Text>
              </Pressable>
            );
          })}
        </View>
        {results.map((event) => (
          <SheetOption
            key={event.id}
            icon={TONES[event.tone].icon}
            label={event.title}
            hint={`${event.start.getDate()} ${MONTHS[event.start.getMonth()].toLowerCase()} • ${event.allDay ? 'Journée' : formatTime(event.start)}`}
            onPress={() => {
              setSearchOpen(false);
              setSelected(startOfDay(event.start));
            }}
          />
        ))}
        {query.trim() && results.length === 0 ? <Text style={styles.noResult}>Aucun événement ne correspond.</Text> : null}
      </BottomSheet>

      {/* Actions d'un événement (⋯) */}
      <BottomSheet visible={menuEvent !== null} title={menuEvent?.title ?? ''} onClose={() => setMenuEvent(null)}>
        {menuEvent ? (
          <>
            {menuEvent.readOnly ? (
              <SheetOption
                icon="visibility"
                label="Voir le détail"
                hint="Événement d’un agenda connecté : modifiable depuis cet agenda"
                onPress={() => {
                  setMenuEvent(null);
                  router.push({ pathname: '/calendar/detail', params: { id: menuEvent.id } });
                }}
              />
            ) : (
              <>
                <SheetOption
                  icon="edit"
                  label="Modifier"
                  onPress={() => {
                    setMenuEvent(null);
                    router.push({ pathname: '/calendar/edit', params: { id: menuEvent.id } });
                  }}
                />
                <SheetOption icon="event_busy" label="Annuler l’événement" danger onPress={() => cancelEvent(menuEvent)} />
              </>
            )}
          </>
        ) : null}
      </BottomSheet>
    </SafeAreaView>
  );
}

/** Ligne verte de l'heure actuelle. */
function NowLine() {
  const { styles } = useLook();
  return (
    <View style={styles.nowRow} accessibilityLabel={`Maintenant, ${formatTime(today())}`}>
      <View style={styles.timeCol} />
      <View style={styles.nowDot} />
      <View style={styles.nowLine} />
    </View>
  );
}

function TimelineRow({ item, upcoming, onMenu }: { item: DayItem; upcoming: boolean; onMenu: (event: CalendarEvent) => void }) {
  const { c, styles } = useLook();
  if (item.kind === 'task') {
    const task = item.task;
    return (
      <View style={styles.row}>
        <Text style={[styles.timeLabel, styles.timeCol]}>{task.hasTime ? formatTime(task.due) : 'Journée'}</Text>
        <Pressable
          style={({ pressed }) => [styles.card, styles.taskCard, pressed && styles.cardPressed]}
          accessibilityRole="button"
          accessibilityLabel={`Échéance de tâche : ${task.title}`}
          onPress={() => router.push({ pathname: '/tasks/detail', params: { id: task.id } })}>
          <View style={[styles.bar, { backgroundColor: c.link }]} />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {task.title}
            </Text>
            <View style={styles.taskMeta}>
              <Icon name="task_alt" size={16} color={c.link} />
              <Text style={[styles.cardTime, { color: c.link }]}>Échéance de tâche{task.hasTime ? ` • ${formatTime(task.due)}` : ''}</Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  }
  const event = item.event;
  const minutes = event.allDay ? 0 : durationOf(event);
  return (
    <View style={styles.row}>
      <Text style={[styles.timeLabel, styles.timeCol]}>{event.allDay ? 'Journée' : formatTime(event.start)}</Text>
      <Pressable
        style={({ pressed }) => [styles.card, { minHeight: event.allDay ? 66 : cardHeight(minutes) }, pressed && styles.cardPressed]}
        accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
        accessibilityLabel={`${event.title}, ${event.allDay ? 'toute la journée' : `${formatTime(event.start)} à ${formatTime(event.end)}`}`}
        onPress={() => router.push({ pathname: '/calendar/detail', params: { id: event.id } })}>
        <View style={[styles.bar, { backgroundColor: TONE_BARS[event.tone] }]} />
        <View style={styles.cardBody}>
          <Text style={[styles.cardTitle, upcoming && styles.cardTitleUpcoming]} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={styles.cardTime}>
            {event.allDay ? 'Toute la journée' : `${formatTime(event.start)} – ${formatTime(event.end)}`}
          </Text>
          {event.location ? (
            <Text style={styles.cardPlace} numberOfLines={1}>
              {event.location}
            </Text>
          ) : null}
        </View>
        <Pressable hitSlop={10} style={styles.more} accessibilityRole="button" accessibilityLabel={`Actions pour ${event.title}`} onPress={() => onMenu(event)}>
          <Icon name="more_horiz" size={24} color={c.text} />
        </Pressable>
      </Pressable>
    </View>
  );
}

/** Couleur de la barre de chaque catégorie (couleurs de l'app). */
const TONE_BARS: Record<CalendarEvent['tone'], string> = {
  admin: '#5B5BD6',
  family: '#F2B01E',
  work: '#1D6FE0',
};

function makeStyles(c: AppColors) {
  const panelBg = c.dark ? '#16294D' : '#0C1A37';
  return StyleSheet.create({
    flex: { flex: 1 },
    pressed: { opacity: 0.7 },
    panel: {
      backgroundColor: panelBg,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    panelOpen: {
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      paddingBottom: 14,
    },
    monthBar: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
    barIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    barRight: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' },
    monthTitle: {
      position: 'absolute',
      left: 0,
      right: 0,
      marginHorizontal: 'auto',
      alignSelf: 'center',
      width: 170,
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
    },
    monthText: { fontFamily: FontFamily.headingBold, fontSize: 18, lineHeight: 24, color: '#FFFFFF' },
    filterDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: TURQUOISE },
    monthPanel: { paddingHorizontal: 14 },
    panelNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 6 },
    panelYear: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, lineHeight: 20, color: '#C9D6EA' },
    gridRow: { flexDirection: 'row' },
    gridLetter: { flex: 1, textAlign: 'center', fontFamily: FontFamily.bodySemiBold, fontSize: 13, lineHeight: 18, color: '#9FB0CC' },
    gridDays: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
    gridCell: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 3, gap: 2 },
    gridDay: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    gridDayOn: { backgroundColor: TURQUOISE },
    gridNumber: { fontFamily: FontFamily.bodySemiBold, fontSize: 16, lineHeight: 21, color: '#FFFFFF' },
    gridNumberOut: { color: '#5D6E8E' },
    gridNumberOn: { color: '#0C1A37', fontFamily: FontFamily.bodyBold },
    gridDot: { width: 5, height: 5, borderRadius: 3 },
    gridDotOn: { backgroundColor: TURQUOISE },
    yearGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 6 },
    yearCell: { width: '30.9%', height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)' },
    yearCellOn: { backgroundColor: TURQUOISE },
    yearText: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, lineHeight: 20, color: '#FFFFFF' },
    yearTextOn: { color: '#0C1A37' },
    week: { flexDirection: 'row', paddingHorizontal: 10, paddingTop: 12, paddingBottom: 10, gap: 4 },
    weekDay: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12, gap: 2 },
    weekDayOn: { backgroundColor: c.solid },
    weekLabel: { fontFamily: FontFamily.bodyMedium, fontSize: 13, lineHeight: 17, color: c.muted },
    weekNumber: { fontFamily: FontFamily.headingBold, fontSize: 20, lineHeight: 25, color: c.text },
    weekToday: { color: c.link },
    weekTextOn: { color: c.solidText },
    dayContent: { paddingHorizontal: 12, paddingBottom: 110 },
    dayHead: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: c.border },
    dayHeadText: { fontFamily: FontFamily.bodySemiBold, fontSize: 13, lineHeight: 17, color: c.text },
    timeCol: { width: 52 },
    row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: c.border },
    timeLabel: { fontFamily: FontFamily.bodyMedium, fontSize: 13, lineHeight: 17, color: c.muted, paddingTop: 2 },
    card: {
      flex: 1,
      flexDirection: 'row',
      borderRadius: 12,
      backgroundColor: c.card,
      overflow: 'hidden',
      shadowColor: '#0C1A37',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 8,
      elevation: 1,
    },
    taskCard: { minHeight: 60, borderWidth: 1, borderStyle: 'dashed', borderColor: c.link, backgroundColor: c.dark ? '#0F2E3A' : '#F2FBF8' },
    cardPressed: { opacity: 0.85 },
    bar: { width: 5 },
    cardBody: { flex: 1, paddingVertical: 10, paddingLeft: 12, paddingRight: 4, gap: 3 },
    cardTitle: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, lineHeight: 20, color: c.text },
    cardTitleUpcoming: { color: c.dark ? '#6FA8FF' : '#1D6FE0' },
    cardTime: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 17, color: c.muted },
    cardPlace: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 17, color: c.muted },
    taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    more: { paddingTop: 8, paddingHorizontal: 10 },
    nowRow: { flexDirection: 'row', alignItems: 'center', height: 14 },
    nowDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E' },
    nowLine: { flex: 1, height: 2, backgroundColor: '#22C55E' },
    empty: { alignItems: 'center', gap: 10, paddingVertical: 40 },
    emptyTitle: { fontFamily: FontFamily.headingBold, fontSize: 17, lineHeight: 23, color: c.text },
    emptyButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.full, backgroundColor: c.solid },
    emptyButtonText: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, lineHeight: 20, color: c.solidText },
    search: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: c.border, backgroundColor: c.card },
    searchInput: { flex: 1, paddingVertical: 12, fontFamily: FontFamily.body, fontSize: 16, lineHeight: 22, color: c.text, outlineWidth: 0, outlineStyle: 'solid' },
    segments: { flexDirection: 'row', padding: 4, marginTop: 12, marginBottom: 6, borderRadius: 14, backgroundColor: c.dark ? '#13213D' : '#E8EEF3' },
    segment: { flex: 1, minHeight: 40, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
    segmentOn: { backgroundColor: c.dark ? '#22365C' : '#FFFFFF' },
    segmentText: { fontFamily: FontFamily.bodyMedium, fontSize: 14, lineHeight: 19, color: c.muted },
    segmentTextOn: { fontFamily: FontFamily.bodySemiBold, color: c.text },
    noResult: { fontFamily: FontFamily.body, fontSize: 14, lineHeight: 20, color: c.muted, paddingVertical: 12, textAlign: 'center' },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre dans le module Agenda, converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
