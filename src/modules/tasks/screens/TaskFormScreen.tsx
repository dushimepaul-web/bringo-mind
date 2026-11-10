// S-10 - Création / édition de tâche | Module M04 Tâches | Phase S4
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
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';

import { Chip, PrimaryButton, PRIORITY_COLORS, TopBar, taskStyles } from '../components/task-ui';
import {
  CATEGORIES,
  CATEGORY_ICONS,
  DEMO_TODAY,
  HOUSEHOLD,
  PRIORITY_LABELS,
  addDays,
  atTime,
  dayOffset,
  formatDueLong,
  formatTime,
  startOfDay,
} from '../data';
import { taskActions, useTask } from '../store';
import type { Task, TaskCategory, TaskDraft, TaskPriority } from '../types';

const TITLE_MAX = 255;
const DESCRIPTION_MAX = 5000;
const PRIORITIES: TaskPriority[] = [1, 2, 3, 4];
const TIMES: { label: string; hours: number | null }[] = [
  { label: 'Sans heure', hours: null },
  { label: '09h00', hours: 9 },
  { label: '12h00', hours: 12 },
  { label: '17h00', hours: 17 },
  { label: '20h00', hours: 20 },
];

/** Démo : formulaire de création prérempli (exemple du dossier directeur). */
function demoDraft(): TaskDraft {
  return {
    title: 'Acheter les fournitures scolaires',
    description: 'Liste de la rentrée : cahiers, trousse, calculatrice et agenda.',
    priority: 2,
    dueAt: atTime(addDays(DEMO_TODAY, 1), 17),
    hasTime: true,
    category: 'Famille',
    // Personnel par défaut : le partage avec le foyer est toujours un choix explicite.
    household: null,
    sharedWith: [],
    reminder: true,
  };
}

function draftOf(task: Task): TaskDraft {
  return {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueAt: task.dueAt,
    hasTime: task.hasTime,
    category: task.category,
    household: task.household,
    sharedWith: task.sharedWith,
    reminder: task.reminder,
  };
}

/** Raccourcis de date : aujourd'hui, demain, samedi prochain, lundi prochain. */
function quickDates() {
  const today = startOfDay(DEMO_TODAY);
  const toSaturday = (6 - today.getDay() + 7) % 7 || 7;
  const toMonday = (1 - today.getDay() + 7) % 7 || 7;
  return [
    { label: 'Aujourd’hui', date: today },
    { label: 'Demain', date: addDays(today, 1) },
    { label: 'Ce week-end', date: addDays(today, toSaturday) },
    { label: 'Semaine prochaine', date: addDays(today, toMonday) },
  ];
}

const DAY_SHORT = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];

/** Choix libre de l'heure : toutes les heures, minutes par pas de 5. */
const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const MINUTES = Array.from({ length: 12 }, (_, index) => index * 5);
const pad = (value: number) => String(value).padStart(2, '0');

export default function TaskFormScreen() {
  const pathname = usePathname();
  const { id, title, due, description } = useLocalSearchParams<{
    id?: string;
    title?: string;
    due?: string;
    description?: string;
  }>();
  const isEdit = pathname.includes('/edit');
  const existing = useTask(isEdit ? id : '__new__');
  const insets = useSafeAreaInsets();

  const [draft, setDraft] = useState<TaskDraft>(() => {
    if (existing) return draftOf(existing);
    const base = demoDraft();
    // Tâche créée depuis un document : titre et échéance déjà remplis.
    if (title) {
      return {
        ...base,
        title,
        description: description ?? '',
        dueAt: due ? atTime(new Date(due), 12) : base.dueAt,
        hasTime: false,
      };
    }
    return base;
  });
  const [focused, setFocused] = useState<'title' | 'description' | null>(null);
  const [titleTouched, setTitleTouched] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const set = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const titleError = titleTouched && draft.title.trim().length === 0;
  const canSave = draft.title.trim().length > 0;
  const shared = draft.household !== null;

  const selectDay = (day: Date) => {
    const hours = draft.hasTime ? draft.dueAt.getHours() : 12;
    const minutes = draft.hasTime ? draft.dueAt.getMinutes() : 0;
    set('dueAt', atTime(day, hours, minutes));
  };

  const selectTime = (hours: number | null, minutes = 0) => {
    setDraft((current) => ({
      ...current,
      hasTime: hours !== null,
      dueAt: atTime(current.dueAt, hours ?? 12, hours === null ? 0 : minutes),
    }));
  };

  const currentHour = draft.dueAt.getHours();
  const currentMinute = draft.dueAt.getMinutes();
  // Heure libre : une heure qui ne fait pas partie des raccourcis.
  const customTime =
    draft.hasTime && !TIMES.some((time) => time.hours === currentHour && currentMinute === 0);

  const toggleShare = (value: boolean) => {
    setDraft((current) => ({
      ...current,
      household: value ? HOUSEHOLD.name : null,
      sharedWith: value ? ['Thomas'] : [],
    }));
  };

  const handleSave = () => {
    if (!canSave) {
      setTitleTouched(true);
      return;
    }
    const clean = { ...draft, title: draft.title.trim(), description: draft.description.trim() };
    if (isEdit && existing) {
      taskActions.save(existing.id, clean);
      router.back();
      return;
    }
    const newId = taskActions.create(clean);
    taskActions.setFlash({ text: `« ${clean.title} » créée.`, undo: taskActions.remove.bind(null, newId) });
    router.replace('/tasks');
  };

  const dates = quickDates();
  const selectedOffset = dayOffset(draft.dueAt);
  const calendarDays = Array.from({ length: 21 }, (_, index) => addDays(startOfDay(DEMO_TODAY), index));
  const quickSelected = dates.some((entry) => dayOffset(entry.date) === selectedOffset);

  return (
    <SafeAreaView style={taskStyles.safe} edges={['top']}>
      <TopBar close fallback="/tasks" title={isEdit ? 'Modifier la tâche' : 'Nouvelle tâche'} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[taskStyles.content, styles.content]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Titre */}
          <View style={styles.labelRow}>
            <Text style={taskStyles.label}>
              Titre <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.counter}>
              {draft.title.length}/{TITLE_MAX}
            </Text>
          </View>
          <TextInput
            style={[
              taskStyles.input,
              focused === 'title' && taskStyles.inputFocused,
              titleError && taskStyles.inputError,
            ]}
            value={draft.title}
            onChangeText={(value) => set('title', value.slice(0, TITLE_MAX))}
            onFocus={() => setFocused('title')}
            onBlur={() => {
              setFocused(null);
              setTitleTouched(true);
            }}
            placeholder="Ex. Renvoyer l’attestation de domicile"
            placeholderTextColor={Serene.onSurfaceVariant}
            selectionColor={Tint.primary}
            returnKeyType="next"
            accessibilityLabel="Titre de la tâche"
            aria-invalid={titleError}
          />
          {titleError ? (
            <View style={styles.errorRow} accessibilityLiveRegion="polite">
              <Icon name="error" size={16} color={Serene.error} />
              <Text style={styles.errorText}>Donnez un titre à la tâche.</Text>
            </View>
          ) : null}

          {/* Description */}
          <View style={[styles.labelRow, styles.spaced]}>
            <Text style={taskStyles.label}>Description</Text>
            <Text style={styles.counter}>facultatif</Text>
          </View>
          <TextInput
            style={[
              taskStyles.input,
              styles.textarea,
              focused === 'description' && taskStyles.inputFocused,
            ]}
            value={draft.description}
            onChangeText={(value) => set('description', value.slice(0, DESCRIPTION_MAX))}
            onFocus={() => setFocused('description')}
            onBlur={() => setFocused(null)}
            placeholder="Ajoutez les détails utiles…"
            placeholderTextColor={Serene.onSurfaceVariant}
            selectionColor={Tint.primary}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Description"
          />

          {/* Priorité */}
          <Text style={[taskStyles.label, styles.spaced, styles.labelGap]}>Priorité</Text>
          <View style={styles.priorities}>
            {PRIORITIES.map((priority) => {
              const selected = draft.priority === priority;
              const colors = PRIORITY_COLORS[priority];
              return (
                <Pressable
                  key={priority}
                  style={({ pressed }) => [
                    styles.priority,
                    selected && { backgroundColor: colors.bg, borderColor: colors.dot },
                    pressed && !selected && styles.pressedSoft,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => set('priority', priority)}>
                  <View style={[styles.priorityDot, { backgroundColor: colors.dot }]} />
                  <Text style={[styles.priorityText, selected && { color: colors.fg }]}>
                    {PRIORITY_LABELS[priority]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Échéance */}
          <Text style={[taskStyles.label, styles.spaced, styles.labelGap]}>Échéance</Text>
          <View style={[taskStyles.card, styles.dueCard]}>
            <View style={styles.dueSummary}>
              <View style={styles.dueIcon}>
                <Icon name="event" size={22} color={Tint.primary} />
              </View>
              <View style={styles.flexMin}>
                <Text style={styles.dueTitle}>{formatDueLong(draft)}</Text>
                <Text style={taskStyles.muted}>
                  {draft.hasTime ? `Heure : ${formatTime(draft.dueAt)}` : 'Toute la journée'}
                </Text>
              </View>
            </View>

            <View style={styles.wrap}>
              {dates.map((entry) => (
                <Chip
                  key={entry.label}
                  label={entry.label}
                  selected={dayOffset(entry.date) === selectedOffset}
                  onPress={() => {
                    setShowCalendar(false);
                    selectDay(entry.date);
                  }}
                />
              ))}
              <Chip
                label="Autre date"
                icon="calendar_month"
                selected={showCalendar || !quickSelected}
                onPress={() => setShowCalendar((value) => !value)}
              />
            </View>

            {showCalendar ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.days}>
                {calendarDays.map((day) => {
                  const selected = dayOffset(day) === selectedOffset;
                  return (
                    <Pressable
                      key={day.toISOString()}
                      style={[styles.day, selected && styles.daySelected]}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => selectDay(day)}>
                      <Text style={[styles.dayName, selected && styles.dayTextSelected]}>
                        {DAY_SHORT[day.getDay()]}
                      </Text>
                      <Text style={[styles.dayNumber, selected && styles.dayTextSelected]}>
                        {day.getDate()}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : null}

            <Text style={styles.subLabel}>Heure</Text>
            <View style={styles.wrap}>
              {TIMES.map((time) => {
                const selected =
                  time.hours === null
                    ? !draft.hasTime
                    : draft.hasTime &&
                      draft.dueAt.getHours() === time.hours &&
                      draft.dueAt.getMinutes() === 0;
                return (
                  <Chip
                    key={time.label}
                    label={time.label}
                    selected={selected && !showTimePicker}
                    onPress={() => {
                      setShowTimePicker(false);
                      selectTime(time.hours);
                    }}
                  />
                );
              })}
              <Chip
                label={customTime ? formatTime(draft.dueAt) : 'Autre heure'}
                icon="schedule"
                selected={showTimePicker || customTime}
                onPress={() => {
                  if (!draft.hasTime) selectTime(10, 0);
                  setShowTimePicker((value) => !value);
                }}
              />
            </View>

            {showTimePicker ? (
              <View style={styles.timePicker}>
                <View style={styles.timePickerHeader}>
                  <Text style={styles.subLabel}>Choisir l’heure</Text>
                  <Text style={styles.timeValue} accessibilityLiveRegion="polite">
                    {formatTime(draft.dueAt)}
                  </Text>
                </View>
                <Text style={styles.timeColumnLabel}>Heures</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.timeRow}>
                  {HOURS.map((hour) => {
                    const selected = draft.hasTime && currentHour === hour;
                    return (
                      <Pressable
                        key={hour}
                        style={[styles.timeCell, selected && styles.timeCellSelected]}
                        accessibilityRole="button"
                        accessibilityLabel={pad(hour) + ' heures'}
                        accessibilityState={{ selected }}
                        onPress={() => selectTime(hour, currentMinute)}>
                        <Text style={[styles.timeCellText, selected && styles.timeCellTextSelected]}>
                          {pad(hour)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                <Text style={styles.timeColumnLabel}>Minutes</Text>
                <View style={styles.minutesGrid}>
                  {MINUTES.map((minute) => {
                    const selected = draft.hasTime && currentMinute === minute;
                    return (
                      <Pressable
                        key={minute}
                        style={[styles.minuteCell, selected && styles.timeCellSelected]}
                        accessibilityRole="button"
                        accessibilityLabel={pad(minute) + ' minutes'}
                        accessibilityState={{ selected }}
                        onPress={() => selectTime(currentHour, minute)}>
                        <Text style={[styles.timeCellText, selected && styles.timeCellTextSelected]}>
                          {pad(minute)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Pressable
                  style={({ pressed }) => [styles.timeDone, pressed && styles.pressedSoft]}
                  accessibilityRole="button"
                  onPress={() => setShowTimePicker(false)}>
                  <Icon name="check" size={18} color={Tint.primary} />
                  <Text style={styles.timeDoneText}>Valider {formatTime(draft.dueAt)}</Text>
                </Pressable>
              </View>
            ) : null}
          </View>

          {/* Catégorie */}
          <Text style={[taskStyles.label, styles.spaced, styles.labelGap]}>Catégorie</Text>
          <View style={styles.wrap}>
            {CATEGORIES.map((category: TaskCategory) => (
              <Chip
                key={category}
                label={category}
                icon={CATEGORY_ICONS[category]}
                selected={draft.category === category}
                onPress={() => set('category', category)}
              />
            ))}
          </View>

          {/* Rappel */}
          <View style={[taskStyles.card, styles.toggleCard, styles.spaced]}>
            <View style={styles.toggleIcon}>
              <Icon name="notifications_active" size={22} color={Tint.primary} />
            </View>
            <View style={styles.flexMin}>
              <Text style={styles.toggleTitle}>Rappel automatique</Text>
              <Text style={taskStyles.muted}>Notification 1 h avant l’échéance</Text>
            </View>
            <DemoSwitch
              value={draft.reminder}
              onValueChange={(value) => set('reminder', value)}
              label="Rappel automatique"
            />
          </View>

          {/* Partage — personnel par défaut */}
          <View style={[taskStyles.card, styles.shareCard]}>
            <View style={styles.toggleCardRow}>
              <View style={[styles.toggleIcon, shared && styles.toggleIconOn]}>
                <Icon
                  name={shared ? 'group' : 'lock'}
                  size={22}
                  color={shared ? Serene.onSecondaryContainer : Tint.navy}
                />
              </View>
              <View style={styles.flexMin}>
                <Text style={styles.toggleTitle}>Partager avec le foyer</Text>
                <Text style={taskStyles.muted}>
                  {shared ? `Visible par les membres de ${HOUSEHOLD.name}` : 'Tâche personnelle, visible par vous seule'}
                </Text>
              </View>
              <DemoSwitch value={shared} onValueChange={toggleShare} label="Partager avec le foyer" />
            </View>

            {shared ? (
              <View style={styles.shareDetails}>
                <Text style={styles.subLabel}>Membres qui la verront</Text>
                <View style={styles.wrap}>
                  <View style={styles.meChip}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>C</Text>
                    </View>
                    <Text style={styles.meText}>Claire (vous)</Text>
                  </View>
                  {HOUSEHOLD.members
                    .filter((name) => name !== 'Claire')
                    .map((name) => {
                      const selected = draft.sharedWith.includes(name);
                      return (
                        <Chip
                          key={name}
                          label={name}
                          icon={selected ? 'check' : 'add'}
                          selected={selected}
                          onPress={() =>
                            set(
                              'sharedWith',
                              selected
                                ? draft.sharedWith.filter((member) => member !== name)
                                : [...draft.sharedWith, name],
                            )
                          }
                        />
                      );
                    })}
                </View>
                <View style={styles.note}>
                  <Icon name="shield" size={18} color={Serene.onSurfaceVariant} />
                  <Text style={styles.noteText}>
                    Seule cette tâche est partagée. Vos autres tâches et vos notes restent privées.
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Space.md) }]}>
          <PrimaryButton
            label={isEdit ? 'Enregistrer les modifications' : 'Créer la tâche'}
            icon={isEdit ? 'check' : 'add_task'}
            disabled={!canSave}
            onPress={handleSave}
            style={styles.footerButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
      trackColor={{ false: Tint.border, true: Tint.primary }}
      thumbColor={Serene.surfaceContainerLowest}
      {...(Platform.OS === 'web' ? { activeThumbColor: Serene.surfaceContainerLowest } : {})}
      ios_backgroundColor={Tint.border}
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
  content: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labelGap: {
    marginBottom: 10,
  },
  spaced: {
    marginTop: 22,
  },
  required: {
    color: Serene.error,
  },
  counter: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  textarea: {
    minHeight: 110,
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
  priorities: {
    flexDirection: 'row',
    gap: 8,
  },
  priority: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pressedSoft: {
    backgroundColor: Tint.soft,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  priorityText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.navy,
  },
  dueCard: {
    gap: 14,
  },
  dueSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dueIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dueTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
    lineHeight: 23,
    color: Tint.navy,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  days: {
    gap: 8,
  },
  day: {
    width: 52,
    height: 64,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  daySelected: {
    backgroundColor: Tint.black,
    borderColor: Tint.black,
  },
  dayName: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
  dayNumber: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 23,
    color: Tint.navy,
  },
  dayTextSelected: {
    color: Serene.onPrimary,
  },
  timePicker: {
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Tint.softer,
  },
  timePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    color: Tint.navy,
    fontVariant: ['tabular-nums'],
  },
  timeColumnLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  timeRow: {
    gap: 8,
  },
  timeCell: {
    width: 52,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minutesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  minuteCell: {
    width: 52,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeCellSelected: {
    backgroundColor: Tint.black,
    borderColor: Tint.black,
  },
  timeCellText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
    fontVariant: ['tabular-nums'],
  },
  timeCellTextSelected: {
    color: Serene.onPrimary,
  },
  timeDone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  timeDoneText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.primary,
  },
  subLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Tint.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIconOn: {
    backgroundColor: Serene.secondaryContainer,
  },
  toggleTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  shareCard: {
    marginTop: 12,
  },
  shareDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
    gap: 10,
  },
  meChip: {
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
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: Tint.soft,
  },
  noteText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
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
