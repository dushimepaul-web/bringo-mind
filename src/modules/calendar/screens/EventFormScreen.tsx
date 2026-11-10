// S-15 - Création / édition d'événement | Module M07 Rendez-vous et calendrier | Phase S6
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Chip, PrimaryButton, TopBar, kitStyles } from '@/components/ui/kit';
import { DatePickerSheet } from '@/components/ui/date-picker';
import { TimeWheelSheet } from '@/components/ui/wheel-picker';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';
import {
  DEMO_TODAY,
  addDays,
  atTime,
  dayOffset,
  formatDay,
  formatLongDay,
  formatTime,
} from '@/lib/demo-dates';

import {
  RECURRENCE_LABELS,
  WEEKDAY_SHORT,
  REMINDER_OPTIONS,
  TONES,
  USER_TIMEZONE,
  conflictsFor,
  durationOf,
  formatDuration,
  freeSlots,
} from '../data';
import { eventActions, useCalendarState, useEvent } from '../store';
import type { CalendarEvent, EventDraft, EventRecurrence, EventTone } from '../types';

const TONE_KEYS: EventTone[] = ['health', 'admin', 'family', 'work', 'leisure'];
const RECURRENCES: EventRecurrence[] = ['none', 'weekly', 'monthly'];

/** Démo : événement prérempli (demain 10h00, 45 min). */
function demoDraft(day?: Date, start?: Date): EventDraft {
  const startAt = start ?? atTime(day ?? addDays(DEMO_TODAY, 1), 10);
  return {
    title: 'Retirer la carte d’identité de Léo',
    start: startAt,
    end: new Date(startAt.getTime() + 45 * 60000),
    allDay: false,
    location: 'Mairie du 11e • Place Léon-Blum',
    description: 'Apporter l’ancienne carte et le récépissé de demande.',
    tone: 'admin',
    // Personnel par défaut : le partage avec le foyer est toujours un choix explicite.
    shared: false,
    members: [],
    reminder: 60,
    recurrence: 'none',
  };
}

function draftOf(event: CalendarEvent): EventDraft {
  const { id: _id, cancelled: _cancelled, ...draft } = event;
  return draft;
}

export default function EventFormScreen() {
  const pathname = usePathname();
  const params = useLocalSearchParams<{ id?: string; start?: string; date?: string }>();
  const isEdit = pathname.includes('/edit');
  const existing = useEvent(isEdit ? params.id : '__new__');
  const { events } = useCalendarState();
  const insets = useSafeAreaInsets();

  const [draft, setDraft] = useState<EventDraft>(() => {
    if (existing) return draftOf(existing);
    const start = params.start ? new Date(params.start) : undefined;
    const day = params.date ? new Date(params.date) : undefined;
    // Un jour passé n'est pas proposé : on se cale sur demain.
    return demoDraft(day && dayOffset(day) >= 0 ? day : undefined, start);
  });
  const [focused, setFocused] = useState<'title' | 'location' | 'description' | null>(null);
  const [titleTouched, setTitleTouched] = useState(false);
  // Sélecteur ouvert : date ou heure, du début ou de la fin (comme l'agenda du téléphone).
  const [picker, setPicker] = useState<'startDate' | 'startTime' | 'endDate' | 'endTime' | null>(null);

  const duration = durationOf(draft);
  const startHour = draft.start.getHours();
  const startMinute = draft.start.getMinutes();
  const endHour = draft.end.getHours();
  const endMinute = draft.end.getMinutes();
  const titleError = titleTouched && draft.title.trim().length === 0;
  // La fin doit suivre le début (même jour ou plus tard pour un événement sur la journée).
  const endError = draft.allDay
    ? dayOffset(draft.end) < dayOffset(draft.start)
    : draft.end.getTime() <= draft.start.getTime();
  const canSave = draft.title.trim().length > 0 && !endError;

  const slot = { start: draft.start, end: draft.end, allDay: draft.allDay, id: existing?.id };
  const conflicts = conflictsFor(slot, events);
  const suggestions = conflicts.length > 0 ? freeSlots(slot, events) : [];


  const set = <K extends keyof EventDraft>(key: K, value: EventDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /** Change le début en gardant la durée. */
  const setStart = (start: Date) =>
    setDraft((current) => ({ ...current, start, end: new Date(start.getTime() + durationOf(current) * 60000) }));

  const setEnd = (end: Date) => setDraft((current) => ({ ...current, end }));

  const toggleShare = (value: boolean) =>
    setDraft((current) => ({ ...current, shared: value, members: value ? ['Thomas'] : [] }));

  const handleSave = () => {
    if (!canSave) {
      setTitleTouched(true);
      return;
    }
    const clean: EventDraft = {
      ...draft,
      title: draft.title.trim(),
      location: draft.location.trim(),
      description: draft.description.trim(),
      ...(draft.allDay
        ? { start: atTime(draft.start, 0), end: atTime(draft.end, 23, 59) }
        : {}),
    };
    const when = `${formatLongDay(clean.start)}${clean.allDay ? '' : ` à ${formatTime(clean.start)}`}`;
    if (isEdit && existing) {
      eventActions.save(existing.id, clean);
      eventActions.setFlash({ text: 'Événement mis à jour.' });
    } else {
      const newId = eventActions.create(clean);
      eventActions.setFlash({ text: `Événement ajouté : ${when}.`, undo: eventActions.remove.bind(null, newId) });
    }
    if (router.canGoBack()) router.back();
    else router.replace('/calendar');
  };

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar close fallback="/calendar" title={isEdit ? 'Modifier l’événement' : 'Nouvel événement'} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[kitStyles.content, styles.content]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Type */}
          <Text style={[kitStyles.label, styles.gap]}>Type</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.typesScroll}
            contentContainerStyle={styles.types}>
            {TONE_KEYS.map((key) => (
              <Chip
                key={key}
                label={TONES[key].label}
                icon={TONES[key].icon}
                selected={draft.tone === key}
                onPress={() => set('tone', key)}
              />
            ))}
          </ScrollView>

          {/* Titre */}
          <Text style={[kitStyles.label, styles.spaced, styles.gap]}>
            Titre <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[kitStyles.input, focused === 'title' && kitStyles.inputFocused, titleError && kitStyles.inputError]}
            value={draft.title}
            onChangeText={(value) => set('title', value)}
            onFocus={() => setFocused('title')}
            onBlur={() => {
              setFocused(null);
              setTitleTouched(true);
            }}
            placeholder="Ex. Rendez-vous chez le médecin"
            placeholderTextColor={Serene.onSurfaceVariant}
            selectionColor={Tint.primary}
            accessibilityLabel="Titre de l’événement"
            aria-invalid={titleError}
          />
          {titleError ? (
            <View style={styles.errorRow}>
              <Icon name="error" size={16} color={Serene.error} />
              <Text style={styles.errorText}>Donnez un titre à l’événement.</Text>
            </View>
          ) : null}

          {/* Quand : début à gauche, fin à droite, comme l'agenda du téléphone */}
          <Text style={[kitStyles.label, styles.spaced, styles.gap]}>Quand</Text>
          <View style={[kitStyles.card, styles.cardGap]}>
            <View style={styles.allDayRow}>
              <Icon name="wb_sunny" size={20} color={Tint.navy} />
              <Text style={styles.allDayText}>Toute la journée</Text>
              <DemoSwitch value={draft.allDay} onValueChange={(value) => set('allDay', value)} label="Toute la journée" />
            </View>

            <View style={styles.range}>
              <WhenColumn
                label="Début"
                date={draft.start}
                showTime={!draft.allDay}
                onPressDate={() => setPicker('startDate')}
                onPressTime={() => setPicker('startTime')}
              />
              <View style={styles.rangeArrow}>
                <Icon name="arrow_forward" size={20} color={Serene.onSurfaceVariant} />
              </View>
              <WhenColumn
                label="Fin"
                date={draft.end}
                showTime={!draft.allDay}
                error={endError}
                onPressDate={() => setPicker('endDate')}
                onPressTime={() => setPicker('endTime')}
              />
            </View>

            {endError ? (
              <View style={styles.errorRow} accessibilityLiveRegion="polite">
                <Icon name="error" size={16} color={Serene.error} />
                <Text style={styles.errorText}>La fin doit être après le début.</Text>
              </View>
            ) : null}

            <View style={styles.rangeFooter}>
              {!draft.allDay && !endError ? (
                <View style={styles.footerItem}>
                  <Icon name="timer" size={16} color={Serene.onSurfaceVariant} />
                  <Text style={kitStyles.muted}>Durée : {formatDuration(duration)}</Text>
                </View>
              ) : null}
              <View style={styles.footerItem}>
                <Icon name="public" size={16} color={Serene.onSurfaceVariant} />
                <Text style={kitStyles.muted}>
                  {USER_TIMEZONE.label} ({USER_TIMEZONE.offset})
                </Text>
              </View>
            </View>
          </View>

          {/* Conflits */}
          {!draft.allDay ? (
            conflicts.length > 0 ? (
              <View style={styles.conflict} accessibilityLiveRegion="polite">
                <View style={styles.conflictHead}>
                  <Icon name="warning" size={20} color="#b91c1c" />
                  <Text style={styles.conflictTitle}>
                    Conflit avec « {conflicts[0].title} » ({formatTime(conflicts[0].start)} – {formatTime(conflicts[0].end)})
                  </Text>
                </View>
                {suggestions.length > 0 ? (
                  <>
                    <Text style={styles.conflictText}>Créneaux libres le même jour :</Text>
                    <View style={styles.wrap}>
                      {suggestions.map((start) => (
                        <Pressable
                          key={start.toISOString()}
                          style={({ pressed }) => [styles.slot, pressed && styles.pressed]}
                          accessibilityRole="button"
                          accessibilityLabel={`Choisir ${formatTime(start)}`}
                          onPress={() => setStart(start)}>
                          <Icon name="event_available" size={16} color={Tint.primary} />
                          <Text style={styles.slotText}>
                            {formatTime(start)} – {formatTime(new Date(start.getTime() + duration * 60000))}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </>
                ) : null}
                <Text style={styles.conflictHelp}>Vous pouvez aussi enregistrer malgré le chevauchement.</Text>
              </View>
            ) : (
              <View style={styles.free}>
                <Icon name="event_available" size={20} color={Serene.success} />
                <Text style={styles.freeText}>Aucun conflit sur ce créneau.</Text>
              </View>
            )
          ) : null}

          {/* Lieu */}
          <Text style={[kitStyles.label, styles.spaced, styles.gap]}>Lieu</Text>
          <View style={[styles.inputRow, focused === 'location' && kitStyles.inputFocused]}>
            <Icon name="location_on" size={20} color={focused === 'location' ? Tint.primary : Serene.onSurfaceVariant} />
            <TextInput
              style={styles.inputInline}
              value={draft.location}
              onChangeText={(value) => set('location', value)}
              onFocus={() => setFocused('location')}
              onBlur={() => setFocused(null)}
              placeholder="Adresse ou visioconférence"
              placeholderTextColor={Serene.onSurfaceVariant}
              selectionColor={Tint.primary}
              accessibilityLabel="Lieu"
            />
          </View>

          {/* Description */}
          <Text style={[kitStyles.label, styles.spaced, styles.gap]}>Description</Text>
          <TextInput
            style={[kitStyles.input, styles.textarea, focused === 'description' && kitStyles.inputFocused]}
            value={draft.description}
            onChangeText={(value) => set('description', value)}
            onFocus={() => setFocused('description')}
            onBlur={() => setFocused(null)}
            placeholder="Informations utiles…"
            placeholderTextColor={Serene.onSurfaceVariant}
            selectionColor={Tint.primary}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Description"
          />

          {/* Rappel */}
          <Text style={[kitStyles.label, styles.spaced, styles.gap]}>Rappel</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.typesScroll}
            contentContainerStyle={styles.types}>
            {REMINDER_OPTIONS.map((option) => (
              <Chip
                key={option.label}
                label={option.label}
                icon={option.minutes === null ? undefined : 'notifications_active'}
                selected={draft.reminder === option.minutes}
                onPress={() => set('reminder', option.minutes)}
              />
            ))}
          </ScrollView>

          {/* Récurrence */}
          <Text style={[kitStyles.label, styles.spaced, styles.gap]}>Récurrence</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.typesScroll}
            contentContainerStyle={styles.types}>
            {RECURRENCES.map((recurrence) => (
              <Chip
                key={recurrence}
                label={RECURRENCE_LABELS[recurrence]}
                selected={draft.recurrence === recurrence}
                onPress={() => set('recurrence', recurrence)}
              />
            ))}
          </ScrollView>

          {/* Partage — personnel par défaut */}
          <View style={[kitStyles.card, styles.share]}>
            <View style={styles.shareRow}>
              <View style={[styles.shareIcon, draft.shared && styles.shareIconOn]}>
                <Icon
                  name={draft.shared ? 'group' : 'lock'}
                  size={22}
                  color={draft.shared ? Serene.onSecondaryContainer : Tint.navy}
                />
              </View>
              <View style={styles.flexMin}>
                <Text style={styles.shareTitle}>Partager avec le foyer</Text>
                <Text style={kitStyles.muted}>
                  {draft.shared ? 'Visible par les membres invités' : 'Événement personnel, visible par vous seule'}
                </Text>
              </View>
              <DemoSwitch value={draft.shared} onValueChange={toggleShare} label="Partager avec le foyer" />
            </View>
            {draft.shared ? (
              <View style={styles.members}>
                <Text style={styles.subLabel}>Invités</Text>
                <View style={styles.wrap}>
                  <View style={styles.me}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>C</Text>
                    </View>
                    <Text style={styles.meText}>Claire (vous)</Text>
                  </View>
                  <Chip
                    label="Thomas"
                    icon={draft.members.includes('Thomas') ? 'check' : 'add'}
                    selected={draft.members.includes('Thomas')}
                    onPress={() =>
                      set('members', draft.members.includes('Thomas') ? [] : ['Thomas'])
                    }
                  />
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Space.md) }]}>
          <PrimaryButton
            label={
              conflicts.length > 0 && !draft.allDay
                ? 'Enregistrer quand même'
                : isEdit
                  ? 'Enregistrer les modifications'
                  : 'Ajouter au calendrier'
            }
            icon={isEdit ? 'check' : 'event_available'}
            disabled={!canSave}
            onPress={handleSave}
            style={styles.footerButton}
          />
        </View>
      </KeyboardAvoidingView>

      <DatePickerSheet
        visible={picker === 'startDate'}
        title="Date de début"
        value={draft.start}
        onSelect={(day) => setStart(atTime(day, startHour, startMinute))}
        onClose={() => setPicker(null)}
      />
      <DatePickerSheet
        visible={picker === 'endDate'}
        title="Date de fin"
        value={draft.end}
        minDate={draft.start}
        onSelect={(day) => setEnd(atTime(day, endHour, endMinute))}
        onClose={() => setPicker(null)}
      />
      <TimeWheelSheet
        visible={picker === 'startTime'}
        title="Heure de début"
        hours={startHour}
        minutes={startMinute}
        onConfirm={(hours, minutes) => setStart(atTime(draft.start, hours, minutes))}
        onClose={() => setPicker(null)}
      />
      <TimeWheelSheet
        visible={picker === 'endTime'}
        title="Heure de fin"
        hours={endHour}
        minutes={endMinute}
        onConfirm={(hours, minutes) => setEnd(atTime(draft.end, hours, minutes))}
        onClose={() => setPicker(null)}
      />
    </SafeAreaView>
  );
}

/** Une colonne Début ou Fin : la date (touchée → calendrier) et l'heure (touchée → roue). */
function WhenColumn({
  label,
  date,
  showTime,
  error,
  onPressDate,
  onPressTime,
}: {
  label: string;
  date: Date;
  showTime: boolean;
  error?: boolean;
  onPressDate: () => void;
  onPressTime: () => void;
}) {
  return (
    <View style={styles.when}>
      <Text style={styles.whenLabel}>{label}</Text>
      <Pressable
        style={({ pressed }) => [styles.whenDate, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${label} : ${formatLongDay(date)}, changer la date`}
        onPress={onPressDate}>
        <Text style={[styles.whenDay, error && styles.whenError]} numberOfLines={1}>
          {WEEKDAY_SHORT[date.getDay()]}. {formatDay(date)}
        </Text>
        <Text style={styles.whenYear}>{date.getFullYear()}</Text>
      </Pressable>
      {showTime ? (
        <Pressable
          style={({ pressed }) => [styles.whenTime, error && styles.whenTimeError, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`${label} : ${formatTime(date)}, changer l’heure`}
          onPress={onPressTime}>
          <Text style={[styles.whenTimeText, error && styles.whenError]}>{formatTime(date)}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function DemoSwitch({
  value,
  onValueChange,
  label,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#c3cfe0', true: Tint.primary }}
      thumbColor={Serene.surfaceContainerLowest}
      {...(Platform.OS === 'web' ? { activeThumbColor: Serene.surfaceContainerLowest } : {})}
      ios_backgroundColor="#c3cfe0"
      accessibilityLabel={label}
    />
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
  content: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  gap: {
    marginBottom: 10,
  },
  spaced: {
    marginTop: 22,
  },
  required: {
    color: Serene.error,
  },
  typesScroll: {
    marginHorizontal: -Space.gutter,
  },
  types: {
    gap: 8,
    paddingHorizontal: Space.gutter,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  errorText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.error,
  },
  cardGap: {
    gap: 14,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Tint.border,
  },
  range: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  rangeArrow: {
    paddingTop: 34,
  },
  when: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  whenLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
  },
  whenDate: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginHorizontal: -10,
    borderRadius: 12,
  },
  whenDay: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
    color: Tint.navy,
  },
  whenYear: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  whenTime: {
    alignSelf: 'flex-start',
    height: 48,
    minWidth: 96,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Tint.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whenTimeError: {
    borderColor: Serene.error,
    backgroundColor: '#fff5f5',
  },
  whenTimeText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    color: Tint.navy,
    fontVariant: ['tabular-nums'],
  },
  whenError: {
    color: Serene.error,
    textDecorationLine: 'line-through',
  },
  rangeFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  allDayText: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  subLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
  },
  conflict: {
    marginTop: 12,
    gap: 10,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fff5f5',
  },
  conflictHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  conflictTitle: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 21,
    color: '#991b1b',
  },
  conflictText: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.navy,
  },
  conflictHelp: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  slot: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#99f6e4',
    backgroundColor: '#f0fdfa',
  },
  slotText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.primary,
  },
  free: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    backgroundColor: Serene.successContainer,
  },
  freeText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.success,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Tint.soft,
  },
  inputInline: {
    flex: 1,
    minWidth: 0,
    outlineWidth: 0,
    outlineStyle: 'solid',
    fontFamily: FontFamily.body,
    fontSize: 16,
    color: Tint.navy,
    paddingVertical: 0,
  },
  textarea: {
    minHeight: 96,
  },
  share: {
    marginTop: 22,
  },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shareIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Tint.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIconOn: {
    backgroundColor: Serene.secondaryContainer,
  },
  shareTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  members: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
    gap: 10,
  },
  me: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 6,
    paddingRight: 14,
    borderRadius: Radius.full,
    backgroundColor: Tint.soft,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Tint.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    color: Serene.onPrimary,
  },
  meText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.navy,
  },
  footer: {
    paddingTop: 12,
    paddingHorizontal: Space.gutter,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
    backgroundColor: Tint.softer,
    alignItems: 'center',
  },
  footerButton: {
    width: '100%',
    maxWidth: 528,
  },
});
