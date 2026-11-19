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
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Space } from '@/constants/design';

import { WheelList, WheelSeparator } from '@/components/ui/wheel-list';

import { Chip, PrimaryButton, TopBar, usePriorityColors, useTaskStyles } from '../components/task-ui';
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
  startOfDay,
  remindersOf,
  dayLabel,
  reminderText,
} from '../data';
import { taskActions, useTask } from '../store';
import type { Task, TaskCategory, TaskDraft, TaskPriority } from '../types';

const TITLE_MAX = 255;
const DESCRIPTION_MAX = 5000;
const PRIORITIES: TaskPriority[] = [1, 2, 3, 4];

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
    reminderAt: [atTime(addDays(DEMO_TODAY, 1), 16)],
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
    reminderAt: remindersOf(task),
    assignee: task.assignee,
  };
}


const two = (value: number) => String(value).padStart(2, '0');
const HOUR_ITEMS = Array.from({ length: 24 }, (_, hour) => ({ key: `h${hour}`, label: two(hour) }));
const MINUTE_ITEMS = Array.from({ length: 60 }, (_, minute) => ({ key: `m${minute}`, label: two(minute) }));

export default function TaskFormScreen() {
  const priorityColors = usePriorityColors();
  const { c, styles } = useLook();
  const taskStyles = useTaskStyles();
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
  // Rappel en cours de réglage (null : aucun réglage ouvert).
  const [newReminder, setNewReminder] = useState<Date | null>(null);
  const [stepText, setStepText] = useState('');
  const steps = draft.steps ?? [];
  const addStep = () => {
    if (!stepText.trim()) return;
    set('steps', [...steps, stepText.trim()]);
    setStepText('');
  };

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

  const toggleShare = (value: boolean) => {
    setDraft((current) => ({
      ...current,
      household: value ? HOUSEHOLD.name : null,
      sharedWith: value ? ['Thomas'] : [],
      assignee: value ? current.assignee : 'Claire',
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

  // Roue des dates : d'aujourd'hui (ou de l'échéance si elle est passée) à 3 mois.
  const firstDay = startOfDay(dayOffset(draft.dueAt) < 0 ? draft.dueAt : DEMO_TODAY);
  const days = Array.from({ length: 92 }, (_, index) => addDays(firstDay, index));
  const dayIndex = Math.max(0, days.findIndex((day) => dayOffset(day) === dayOffset(draft.dueAt)));
  const reminders = draft.reminderAt ?? [];
  const setReminders = (list: Date[]) =>
    setDraft((current) => ({ ...current, reminderAt: list, reminder: list.length > 0 }));
  // Roue des dates du rappel : d'aujourd'hui à 3 mois.
  const reminderDays = Array.from({ length: 92 }, (_, index) => addDays(startOfDay(DEMO_TODAY), index));
  const openReminder = () => {
    // Proposition : 1 h avant l'échéance (ou à 9h00 la veille si la tâche n'a pas d'heure).
    const base = draft.hasTime
      ? new Date(draft.dueAt.getTime() - 60 * 60000)
      : atTime(addDays(startOfDay(draft.dueAt), -1), 9);
    setNewReminder(base.getTime() < DEMO_TODAY.getTime() ? atTime(DEMO_TODAY, DEMO_TODAY.getHours() + 1) : base);
  };

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
            placeholderTextColor={c.muted}
            selectionColor={c.link}
            returnKeyType="next"
            accessibilityLabel="Titre de la tâche"
            aria-invalid={titleError}
          />
          {titleError ? (
            <View style={styles.errorRow} accessibilityLiveRegion="polite">
              <Icon name="error" size={16} color={c.error} />
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
            placeholderTextColor={c.muted}
            selectionColor={c.link}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Description"
          />

          {/* Priorité */}
          <Text style={[taskStyles.label, styles.spaced, styles.labelGap]}>Priorité</Text>
          <View style={styles.priorities}>
            {PRIORITIES.map((priority) => {
              const selected = draft.priority === priority;
              const colors = priorityColors[priority];
              return (
                <Pressable
                  key={priority}
                  style={({ pressed }) => [
                    styles.priority,
                    selected && styles.prioritySelected,
                    pressed && !selected && styles.pressedSoft,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => set('priority', priority)}>
                  <View style={[styles.priorityDot, { backgroundColor: colors.dot }]} />
                  <Text style={[styles.priorityText, selected && styles.priorityTextSelected]}>
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
                <Icon name="event" size={22} color={c.link} />
              </View>
              <View style={styles.flexMin}>
                <Text style={styles.dueTitle}>{formatDueLong(draft)}</Text>
                {!draft.hasTime ? <Text style={taskStyles.muted}>Toute la journée</Text> : null}
              </View>
            </View>

            <View style={styles.wheels}>
              <View style={styles.dateColumn}>
                <Text style={styles.wheelLabel}>Date</Text>
                <View style={styles.wheelBox}>
                  <WheelList
                    label="Date"
                    size="medium"
                    items={days.map((day) => ({ key: day.toDateString(), label: dayLabel(day) }))}
                    index={dayIndex}
                    onChange={(index) => selectDay(days[index])}
                  />
                </View>
              </View>
              <View style={styles.timeColumn}>
                <Text style={styles.wheelLabel}>Heure</Text>
                <View
                  style={[styles.wheelBox, styles.timeBox, !draft.hasTime && styles.timeOff]}
                  pointerEvents={draft.hasTime ? 'auto' : 'none'}>
                  <WheelList
                    label="Heures"
                    items={HOUR_ITEMS}
                    index={draft.dueAt.getHours()}
                    onChange={(hour) => selectTime(hour, draft.dueAt.getMinutes())}
                    style={styles.timeWheel}
                  />
                  <WheelSeparator />
                  <WheelList
                    label="Minutes"
                    items={MINUTE_ITEMS}
                    index={draft.dueAt.getMinutes()}
                    onChange={(minute) => selectTime(draft.dueAt.getHours(), minute)}
                    style={styles.timeWheel}
                  />
                </View>
              </View>
            </View>
            <View style={styles.noTimeRow}>
              <Chip
                label="Sans heure"
                icon="schedule"
                selected={!draft.hasTime}
                onPress={() => (draft.hasTime ? selectTime(null) : selectTime(17, 0))}
              />
            </View>
          </View>

          {/* Catégorie */}
          <Text style={[taskStyles.label, styles.spaced, styles.labelGap]}>Catégorie</Text>
          {/* Une seule ligne qui défile à gauche et à droite */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chipsRow}>
            {CATEGORIES.map((category: TaskCategory) => (
              <Chip
                key={category}
                label={category}
                icon={CATEGORY_ICONS[category]}
                selected={draft.category === category}
                onPress={() => set('category', category)}
              />
            ))}
          </ScrollView>

          {/* Étapes (à la création ; ensuite elles se gèrent depuis le détail) */}
          {!isEdit ? (
            <>
              <Text style={[taskStyles.label, styles.spaced, styles.labelGap]}>Étapes</Text>
              <View style={[taskStyles.card, styles.remindersCard]}>
                {steps.map((step, index) => (
                  <View key={`${index}-${step}`} style={styles.reminderRow}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.reminderText}>{step}</Text>
                    <Pressable
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel={`Retirer l’étape ${step}`}
                      onPress={() => set('steps', steps.filter((_, at) => at !== index))}>
                      <Icon name="close" size={20} color={c.muted} />
                    </Pressable>
                  </View>
                ))}
                <View style={styles.reminderRow}>
                  <Icon name="add" size={22} color={c.link} />
                  <TextInput
                    style={styles.stepInput}
                    placeholder="Ajouter une étape"
                    placeholderTextColor={c.muted}
                    selectionColor={c.link}
                    value={stepText}
                    onChangeText={setStepText}
                    returnKeyType="done"
                    submitBehavior="blurAndSubmit"
                    onSubmitEditing={addStep}
                    accessibilityLabel="Nouvelle étape"
                  />
                  {stepText.trim() ? (
                    <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Ajouter l’étape" onPress={addStep}>
                      <Icon name="check_circle" size={24} color={c.link} filled />
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </>
          ) : null}

          {/* Rappels : date et heure exactes, avec les mêmes roues que l'échéance */}
          <Text style={[taskStyles.label, styles.spaced, styles.labelGap]}>Rappels</Text>
          <View style={[taskStyles.card, styles.remindersCard]}>
            {reminders.length === 0 && !newReminder ? (
              <Text style={taskStyles.muted}>Aucun rappel pour cette tâche.</Text>
            ) : (
              [...reminders]
                .sort((a, b) => a.getTime() - b.getTime())
                .map((at) => (
                  <View key={at.getTime()} style={styles.reminderRow}>
                    <View style={styles.toggleIcon}>
                      <Icon name="notifications_active" size={20} color={c.link} />
                    </View>
                    <Text style={styles.reminderText}>{reminderText(at)}</Text>
                    <Pressable
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel={`Retirer le rappel ${reminderText(at)}`}
                      onPress={() => setReminders(reminders.filter((value) => value.getTime() !== at.getTime()))}>
                      <Icon name="close" size={20} color={c.muted} />
                    </Pressable>
                  </View>
                ))
            )}

            {newReminder ? (
              <View style={styles.reminderEditor}>
                <Text style={styles.reminderEditorTitle}>{reminderText(newReminder)}</Text>
                <View style={styles.wheels}>
                  <View style={styles.dateColumn}>
                    <Text style={styles.wheelLabel}>Date</Text>
                    <View style={styles.wheelBox}>
                      <WheelList
                        label="Date du rappel"
                        size="medium"
                        items={reminderDays.map((day) => ({ key: day.toDateString(), label: dayLabel(day) }))}
                        index={Math.max(0, reminderDays.findIndex((day) => dayOffset(day) === dayOffset(newReminder)))}
                        onChange={(index) =>
                          setNewReminder(atTime(reminderDays[index], newReminder.getHours(), newReminder.getMinutes()))
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.timeColumn}>
                    <Text style={styles.wheelLabel}>Heure</Text>
                    <View style={[styles.wheelBox, styles.timeBox]}>
                      <WheelList
                        label="Heures du rappel"
                        items={HOUR_ITEMS}
                        index={newReminder.getHours()}
                        onChange={(hour) => setNewReminder(atTime(newReminder, hour, newReminder.getMinutes()))}
                        style={styles.timeWheel}
                      />
                      <WheelSeparator />
                      <WheelList
                        label="Minutes du rappel"
                        items={MINUTE_ITEMS}
                        index={newReminder.getMinutes()}
                        onChange={(minute) => setNewReminder(atTime(newReminder, newReminder.getHours(), minute))}
                        style={styles.timeWheel}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.reminderActions}>
                  <Pressable
                    style={({ pressed }) => [styles.reminderCancel, pressed && styles.pressedSoft]}
                    accessibilityRole="button"
                    onPress={() => setNewReminder(null)}>
                    <Text style={styles.reminderCancelText}>Annuler</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [styles.reminderAdd, pressed && styles.pressedSoft]}
                    accessibilityRole="button"
                    onPress={() => {
                      if (!reminders.some((value) => value.getTime() === newReminder.getTime())) {
                        setReminders([...reminders, newReminder]);
                      }
                      setNewReminder(null);
                    }}>
                    <Icon name="check" size={18} color={c.solidText} />
                    <Text style={styles.reminderAddText}>Ajouter ce rappel</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                style={({ pressed }) => [styles.addReminder, pressed && styles.pressedSoft]}
                accessibilityRole="button"
                onPress={openReminder}>
                <Icon name="add" size={20} color={c.link} />
                <Text style={styles.addReminderText}>Ajouter un rappel</Text>
              </Pressable>
            )}
          </View>

          {/* Partage — personnel par défaut */}
          <View style={[taskStyles.card, styles.shareCard]}>
            <View style={styles.toggleCardRow}>
              <View style={[styles.toggleIcon, shared && styles.toggleIconOn]}>
                <Icon
                  name={shared ? 'group' : 'lock'}
                  size={22}
                  color={shared ? c.link : c.text}
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
                <Text style={[styles.subLabel, styles.assigneeLabel]}>Confiée à</Text>
                <View style={styles.wrap}>
                  {HOUSEHOLD.members.map((name) => (
                    <Chip
                      key={name}
                      label={name === 'Claire' ? 'Claire (vous)' : name}
                      icon="person"
                      selected={(draft.assignee ?? 'Claire') === name}
                      onPress={() => set('assignee', name)}
                    />
                  ))}
                </View>
                <View style={styles.note}>
                  <Icon name="shield" size={18} color={c.muted} />
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
  const { c } = useLook();
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: c.border, true: c.link }}
      thumbColor={c.card}
      {...(Platform.OS === 'web' ? { activeThumbColor: c.card } : {})}
      ios_backgroundColor={c.border}
      accessibilityLabel={label}
    />
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
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
      color: c.error,
    },
    counter: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
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
      color: c.error,
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
      borderColor: c.border,
      backgroundColor: c.card,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    pressedSoft: {
      backgroundColor: c.soft,
    },
    prioritySelected: {
      backgroundColor: c.solid,
      borderColor: c.solid,
    },
    priorityTextSelected: {
      color: c.solidText,
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
      color: c.text,
    },
    wheels: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 16,
    },
    dateColumn: {
      flex: 1.15,
      gap: 8,
    },
    timeColumn: {
      flex: 1,
      gap: 8,
    },
    wheelBox: {
      borderRadius: 14,
      backgroundColor: c.dark ? '#0F1B33' : '#F0F1F4',
      overflow: 'hidden',
    },
    timeBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    timeWheel: {
      flex: 1,
    },
    timeOff: {
      opacity: 0.35,
    },
    noTimeRow: {
      flexDirection: 'row',
      marginTop: 12,
    },
    wheelLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    remindersCard: {
      gap: 12,
    },
    reminderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    reminderText: {
      flex: 1,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    assigneeLabel: {
      marginTop: 14,
    },
    stepNumber: {
      width: 26,
      height: 26,
      borderRadius: Radius.full,
      backgroundColor: c.tintMint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepNumberText: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.link,
    },
    stepInput: {
      flex: 1,
      paddingVertical: 10,
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
      outlineWidth: 0,
      outlineStyle: 'solid',
    },
    reminderEditor: {
      gap: 4,
      paddingTop: 4,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    reminderEditorTitle: {
      marginTop: 8,
      fontFamily: FontFamily.headingBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    reminderActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 14,
    },
    reminderCancel: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: c.border,
    },
    reminderCancelText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    reminderAdd: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: Radius.full,
      backgroundColor: c.solid,
    },
    reminderAddText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.solidText,
    },
    addReminder: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      alignSelf: 'flex-start',
      paddingVertical: 6,
    },
    addReminderText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.link,
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
      backgroundColor: c.tintMint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dueTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 17,
      lineHeight: 23,
      color: c.text,
    },
    wrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    // La ligne de puces va jusqu'aux bords de l'écran pour montrer qu'elle défile.
    chipsScroll: {
      marginHorizontal: -Space.gutter,
    },
    chipsRow: {
      gap: 8,
      paddingHorizontal: Space.gutter,
    },
    days: {
      gap: 8,
    },
    day: {
      width: 52,
      height: 64,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
    },
    daySelected: {
      backgroundColor: c.solid,
      borderColor: c.solid,
    },
    dayName: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 17,
      color: c.muted,
    },
    dayNumber: {
      fontFamily: FontFamily.headingBold,
      fontSize: 18,
      lineHeight: 23,
      color: c.text,
    },
    dayTextSelected: {
      color: c.solidText,
    },
    timePicker: {
      gap: 10,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.page,
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
      color: c.text,
      fontVariant: ['tabular-nums'],
    },
    timeColumnLabel: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    timeRow: {
      gap: 8,
    },
    timeCell: {
      width: 52,
      height: 48,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
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
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timeCellSelected: {
      backgroundColor: c.solid,
      borderColor: c.solid,
    },
    timeCellText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
      fontVariant: ['tabular-nums'],
    },
    timeCellTextSelected: {
      color: c.solidText,
    },
    timeDone: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      height: 44,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    timeDoneText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.link,
    },
    subLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.muted,
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
      backgroundColor: c.soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toggleIconOn: {
      backgroundColor: c.tintMint,
    },
    toggleTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    shareCard: {
      marginTop: 12,
    },
    shareDetails: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
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
      backgroundColor: c.soft,
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: Radius.full,
      backgroundColor: c.solid,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.solidText,
    },
    meText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    note: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      padding: 12,
      borderRadius: 14,
      backgroundColor: c.soft,
    },
    noteText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 19,
      color: c.muted,
    },
    footer: {
      paddingTop: 12,
      paddingHorizontal: Space.gutter,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
      backgroundColor: c.page,
      alignItems: 'center',
    },
    footerButton: {
      width: '100%',
      maxWidth: 528,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
