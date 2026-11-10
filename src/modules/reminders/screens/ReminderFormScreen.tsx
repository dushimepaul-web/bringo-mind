// S-12 - Création / édition de rappel | Module M05 Rappels | Phase S5
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
import {
  BottomSheet,
  Chip,
  PrimaryButton,
  SecondaryButton,
  SheetOption,
  TopBar,
  kitStyles,
} from '@/components/ui/kit';
import { TimePicker } from '@/components/ui/time-picker';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';
import {
  DEMO_TODAY,
  addDays,
  atTime,
  dayOffset,
  formatDueLong,
  formatTime,
  startOfDay,
} from '@/lib/demo-dates';

import {
  CHANNEL_META,
  LINK_TARGETS,
  QUIET_HOURS,
  REPEAT_LABELS,
  USER_TIMEZONE,
  WEEKDAY_LETTERS,
  demoReminderTitle,
  formatOccurrence,
  linkHref,
  linkIcon,
  linkLabel,
  nextOccurrences,
} from '../data';
import { reminderActions, useReminder, useReminderState } from '../store';
import type { Reminder, ReminderChannel, ReminderDraft, ReminderRepeat } from '../types';

const TITLE_MAX = 255;
const REPEATS: ReminderRepeat[] = ['once', 'daily', 'weekly', 'monthly', 'custom'];
const CHANNELS: ReminderChannel[] = ['app', 'push', 'email'];
const TIMES = [8, 12, 18, 20];
const DAY_SHORT = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];

/** Démo : rappel prérempli pour la création. */
function demoDraft(): ReminderDraft {
  return {
    title: demoReminderTitle(),
    at: atTime(addDays(DEMO_TODAY, 1), 10),
    repeat: 'once',
    weekdays: [1, 3, 5],
    channels: ['app', 'push'],
    link: { kind: 'task', id: 'remboursement', title: 'Suivre le remboursement des soins dentaires' },
    shared: false,
    note: 'Feuille de soins envoyée le 2 mai.',
  };
}

function draftOf(item: Reminder): ReminderDraft {
  return {
    title: item.title,
    at: item.at,
    repeat: item.repeat,
    weekdays: item.weekdays.length ? item.weekdays : [1, 3, 5],
    channels: item.channels,
    link: item.link,
    shared: item.shared,
    note: item.note,
  };
}

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

/** Les heures de silence vont de 22h00 à 07h00. */
function inQuietHours(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 22 || hour < 7;
}

export default function ReminderFormScreen() {
  const pathname = usePathname();
  const { id, linkKind, linkId, linkTitle, at } = useLocalSearchParams<{
    id?: string;
    linkKind?: string;
    linkId?: string;
    linkTitle?: string;
    at?: string;
  }>();
  const isEdit = pathname.includes('/edit');
  const existing = useReminder(isEdit ? id : undefined);
  const { notificationsAllowed } = useReminderState();
  const insets = useSafeAreaInsets();

  const [draft, setDraft] = useState<ReminderDraft>(() => {
    if (existing) return draftOf(existing);
    const base = demoDraft();
    // Rappel créé depuis une tâche, un événement ou un document : déjà rattaché, à l'heure proposée.
    if ((linkKind === 'event' || linkKind === 'task' || linkKind === 'document') && linkId && linkTitle) {
      return {
        ...base,
        title: linkTitle,
        at: at ? new Date(at) : base.at,
        link: { kind: linkKind, id: linkId, title: linkTitle },
        note: '',
      };
    }
    return base;
  });
  const [titleFocused, setTitleFocused] = useState(false);
  const [noteFocused, setNoteFocused] = useState(false);
  const [titleTouched, setTitleTouched] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [sheet, setSheet] = useState<'link' | 'delete' | null>(null);

  const set = <K extends keyof ReminderDraft>(key: K, value: ReminderDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const titleError = titleTouched && draft.title.trim().length === 0;
  const channelError = draft.channels.length === 0;
  const canSave = draft.title.trim().length > 0 && !channelError;

  const dates = quickDates();
  const selectedOffset = dayOffset(draft.at);
  const quickSelected = dates.some((entry) => dayOffset(entry.date) === selectedOffset);
  const calendarDays = Array.from({ length: 21 }, (_, index) => addDays(startOfDay(DEMO_TODAY), index));
  const hour = draft.at.getHours();
  const minute = draft.at.getMinutes();
  const customTime = !TIMES.some((value) => value === hour && minute === 0);
  const occurrences = nextOccurrences(draft.at, draft.repeat, draft.weekdays);
  const linkTarget = linkHref(draft.link);

  const selectDay = (day: Date) => set('at', atTime(day, hour, minute));
  const selectTime = (hours: number, minutes: number) => set('at', atTime(draft.at, hours, minutes));

  const toggleChannel = (channel: ReminderChannel, enabled: boolean) =>
    set(
      'channels',
      enabled ? [...draft.channels, channel] : draft.channels.filter((entry) => entry !== channel),
    );

  const toggleWeekday = (day: number) =>
    set(
      'weekdays',
      draft.weekdays.includes(day)
        ? draft.weekdays.filter((entry) => entry !== day)
        : [...draft.weekdays, day],
    );

  const handleSave = () => {
    if (!canSave) {
      setTitleTouched(true);
      return;
    }
    const clean = { ...draft, title: draft.title.trim(), note: draft.note.trim() };
    if (isEdit && existing) {
      reminderActions.save(existing.id, clean);
      reminderActions.setFlash({ text: 'Rappel mis à jour.' });
    } else {
      const newId = reminderActions.create(clean);
      reminderActions.setFlash({
        text: `Rappel planifié : ${formatDueLong({ dueAt: clean.at, hasTime: true })}.`,
        undo: reminderActions.remove.bind(null, newId),
      });
    }
    if (router.canGoBack()) router.back();
    else router.replace('/reminders');
  };

  const handleDelete = () => {
    if (!existing) return;
    setSheet(null);
    const undo = reminderActions.remove(existing.id);
    reminderActions.setFlash({ text: `« ${existing.title} » supprimé.`, undo });
    if (router.canGoBack()) router.back();
    else router.replace('/reminders');
  };

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar close fallback="/reminders" title={isEdit ? 'Modifier le rappel' : 'Nouveau rappel'} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[kitStyles.content, styles.content]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Objet */}
          <View style={styles.labelRow}>
            <Text style={kitStyles.label}>
              Objet du rappel <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.counter}>
              {draft.title.length}/{TITLE_MAX}
            </Text>
          </View>
          <TextInput
            style={[kitStyles.input, titleFocused && kitStyles.inputFocused, titleError && kitStyles.inputError]}
            value={draft.title}
            onChangeText={(value) => set('title', value.slice(0, TITLE_MAX))}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => {
              setTitleFocused(false);
              setTitleTouched(true);
            }}
            placeholder="Ex. Appeler le médecin"
            placeholderTextColor={Serene.onSurfaceVariant}
            selectionColor={Tint.primary}
            accessibilityLabel="Objet du rappel"
            aria-invalid={titleError}
          />
          {titleError ? (
            <View style={styles.errorRow} accessibilityLiveRegion="polite">
              <Icon name="error" size={16} color={Serene.error} />
              <Text style={styles.errorText}>Indiquez l’objet du rappel.</Text>
            </View>
          ) : null}

          {/* Quand */}
          <Text style={[kitStyles.label, styles.spaced, styles.gap]}>Quand</Text>
          <View style={[kitStyles.card, styles.cardGap]}>
            <View style={styles.summary}>
              <View style={styles.summaryIcon}>
                <Icon name="alarm" size={22} color={Tint.primary} />
              </View>
              <View style={styles.flexMin}>
                <Text style={styles.summaryTitle}>{formatDueLong({ dueAt: draft.at, hasTime: true })}</Text>
                <View style={styles.zone}>
                  <Icon name="public" size={15} color={Serene.onSurfaceVariant} />
                  <Text style={kitStyles.muted}>
                    {USER_TIMEZONE.label} ({USER_TIMEZONE.offset})
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.wrap}>
              {dates.map((entry) => (
                <Chip
                  key={entry.label}
                  label={entry.label}
                  selected={!showCalendar && dayOffset(entry.date) === selectedOffset}
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>
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
                      <Text style={[styles.dayNumber, selected && styles.dayTextSelected]}>{day.getDate()}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : null}

            <Text style={styles.subLabel}>Heure</Text>
            <View style={styles.wrap}>
              {TIMES.map((value) => (
                <Chip
                  key={value}
                  label={`${String(value).padStart(2, '0')}h00`}
                  selected={!showTime && hour === value && minute === 0}
                  onPress={() => {
                    setShowTime(false);
                    selectTime(value, 0);
                  }}
                />
              ))}
              <Chip
                label={customTime ? formatTime(draft.at) : 'Autre heure'}
                icon="schedule"
                selected={showTime || customTime}
                onPress={() => setShowTime((value) => !value)}
              />
            </View>
            {showTime ? (
              <TimePicker
                hours={hour}
                minutes={minute - (minute % 5)}
                onChange={selectTime}
                onDone={() => setShowTime(false)}
              />
            ) : null}

            {inQuietHours(draft.at) ? (
              <View style={styles.warning}>
                <Icon name="bedtime" size={18} color="#b45309" />
                <Text style={styles.warningText}>
                  Cette heure tombe pendant vos heures de silence ({QUIET_HOURS.from} – {QUIET_HOURS.to}). La
                  notification sera silencieuse.
                </Text>
              </View>
            ) : null}
          </View>

          {/* Répétition */}
          <Text style={[kitStyles.label, styles.spaced, styles.gap]}>Répétition</Text>
          <View style={styles.wrap}>
            {REPEATS.map((repeat) => (
              <Chip
                key={repeat}
                label={REPEAT_LABELS[repeat]}
                selected={draft.repeat === repeat}
                onPress={() => set('repeat', repeat)}
              />
            ))}
          </View>
          {draft.repeat === 'custom' ? (
            <View style={styles.weekdays}>
              {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                const selected = draft.weekdays.includes(day);
                return (
                  <Pressable
                    key={day}
                    style={[styles.weekday, selected && styles.weekdaySelected]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][day]}
                    onPress={() => toggleWeekday(day)}>
                    <Text style={[styles.weekdayText, selected && styles.dayTextSelected]}>
                      {WEEKDAY_LETTERS[day]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
          {draft.repeat !== 'once' && occurrences.length > 0 ? (
            <View style={styles.preview}>
              <Icon name="event_repeat" size={18} color={Tint.primary} />
              <Text style={styles.previewText}>
                Prochains : {occurrences.map(formatOccurrence).join(', ')}…
              </Text>
            </View>
          ) : null}

          {/* Canaux */}
          <Text style={[kitStyles.label, styles.spaced, styles.gap]}>Canaux de notification</Text>
          <View style={[kitStyles.card, styles.channels]}>
            {CHANNELS.map((channel, index) => {
              const meta = CHANNEL_META[channel];
              const enabled = draft.channels.includes(channel);
              return (
                <View key={channel} style={[styles.channel, index > 0 && styles.channelBorder]}>
                  <View style={styles.channelIcon}>
                    <Icon name={meta.icon} size={20} color={Tint.navy} />
                  </View>
                  <View style={styles.flexMin}>
                    <Text style={styles.channelTitle}>{meta.label}</Text>
                    {channel === 'push' && !notificationsAllowed ? (
                      <Pressable
                        hitSlop={6}
                        accessibilityRole="button"
                        onPress={() => reminderActions.allowNotifications(true)}>
                        <Text style={styles.permissionText}>
                          Non autorisées sur ce téléphone · <Text style={styles.permissionLink}>Autoriser</Text>
                        </Text>
                      </Pressable>
                    ) : (
                      <Text style={kitStyles.muted}>{meta.hint}</Text>
                    )}
                  </View>
                  <DemoSwitch
                    value={enabled}
                    onValueChange={(value) => toggleChannel(channel, value)}
                    label={meta.label}
                  />
                </View>
              );
            })}
          </View>
          {channelError ? (
            <View style={styles.errorRow} accessibilityLiveRegion="polite">
              <Icon name="error" size={16} color={Serene.error} />
              <Text style={styles.errorText}>Choisissez au moins un canal.</Text>
            </View>
          ) : null}

          {/* Association */}
          <Text style={[kitStyles.label, styles.spaced, styles.gap]}>Associer à</Text>
          <View style={[kitStyles.card, styles.linkCard]}>
            <View style={styles.channelIcon}>
              <Icon name={linkIcon(draft.link)} size={20} color={Tint.navy} />
            </View>
            <View style={styles.flexMin}>
              <Text style={styles.linkKind}>{linkLabel(draft.link)}</Text>
              <Text style={styles.channelTitle} numberOfLines={2}>
                {draft.link.kind === 'personal' ? 'Rappel personnel, sans objet lié' : draft.link.title}
              </Text>
              {linkTarget ? (
                <Pressable hitSlop={6} accessibilityRole="link" onPress={() => router.push(linkTarget)}>
                  <Text style={kitStyles.link}>
                    Ouvrir {draft.link.kind === 'task' ? 'la tâche' : draft.link.kind === 'document' ? 'le document' : 'l’événement'}
                  </Text>
                </Pressable>
              ) : null}
            </View>
            <Pressable
              style={({ pressed }) => [styles.change, pressed && styles.pressedSoft]}
              accessibilityRole="button"
              onPress={() => setSheet('link')}>
              <Text style={styles.changeText}>Changer</Text>
            </Pressable>
          </View>

          {/* Partage */}
          <View style={[kitStyles.card, styles.shareCard]}>
            <View style={[styles.channelIcon, draft.shared && styles.channelIconOn]}>
              <Icon
                name={draft.shared ? 'group' : 'lock'}
                size={20}
                color={draft.shared ? Serene.onSecondaryContainer : Tint.navy}
              />
            </View>
            <View style={styles.flexMin}>
              <Text style={styles.channelTitle}>Rappel collectif du foyer</Text>
              <Text style={kitStyles.muted}>
                {draft.shared ? 'Thomas le recevra aussi' : 'Vous seule le recevez'}
              </Text>
            </View>
            <DemoSwitch value={draft.shared} onValueChange={(value) => set('shared', value)} label="Rappel collectif" />
          </View>

          {/* Note */}
          <View style={[styles.labelRow, styles.spaced]}>
            <Text style={kitStyles.label}>Note</Text>
            <Text style={styles.counter}>facultatif</Text>
          </View>
          <TextInput
            style={[kitStyles.input, styles.textarea, noteFocused && kitStyles.inputFocused]}
            value={draft.note}
            onChangeText={(value) => set('note', value)}
            onFocus={() => setNoteFocused(true)}
            onBlur={() => setNoteFocused(false)}
            placeholder="Ajoutez un détail utile…"
            placeholderTextColor={Serene.onSurfaceVariant}
            selectionColor={Tint.primary}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Note"
          />

          {isEdit && existing ? (
            <SecondaryButton
              label="Supprimer le rappel"
              icon="delete"
              danger
              style={styles.delete}
              onPress={() => setSheet('delete')}
            />
          ) : null}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Space.md) }]}>
          <PrimaryButton
            label={isEdit ? 'Enregistrer les modifications' : 'Créer le rappel'}
            icon={isEdit ? 'check' : 'add_alert'}
            disabled={!canSave}
            onPress={handleSave}
            style={styles.footerButton}
          />
        </View>
      </KeyboardAvoidingView>

      <BottomSheet
        visible={sheet === 'link'}
        title="Associer le rappel"
        subtitle="Choisissez une tâche ou un événement."
        onClose={() => setSheet(null)}>
        <ScrollView style={styles.sheetList} contentContainerStyle={styles.sheetListContent}>
          <SheetOption
            icon="person"
            label="Aucun (rappel personnel)"
            onPress={() => {
              set('link', { kind: 'personal' });
              setSheet(null);
            }}
          />
          {LINK_TARGETS.map((target) => (
            <SheetOption
              key={`${target.kind}-${target.id}`}
              icon={linkIcon(target)}
              label={target.title}
              hint={linkLabel(target)}
              onPress={() => {
                set('link', target);
                setSheet(null);
              }}
            />
          ))}
        </ScrollView>
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'delete'}
        title="Supprimer ce rappel ?"
        subtitle="Aucune notification ne sera plus envoyée. Vous pourrez annuler pendant quelques secondes."
        onClose={() => setSheet(null)}>
        <View style={styles.deleteRow}>
          <SecondaryButton label="Garder" style={styles.flex} onPress={() => setSheet(null)} />
          <Pressable
            style={({ pressed }) => [styles.deleteButton, pressed && styles.pressedSoft]}
            accessibilityRole="button"
            onPress={handleDelete}>
            <Icon name="delete" size={20} color={Serene.onPrimary} />
            <Text style={styles.deleteText}>Supprimer</Text>
          </Pressable>
        </View>
      </BottomSheet>
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
  pressedSoft: {
    opacity: 0.8,
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
  spaced: {
    marginTop: 22,
  },
  gap: {
    marginBottom: 10,
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
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
    lineHeight: 23,
    color: Tint.navy,
  },
  zone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  subLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  warningText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: '#92400e',
  },
  weekdays: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  weekday: {
    flex: 1,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdaySelected: {
    backgroundColor: Tint.black,
    borderColor: Tint.black,
  },
  weekdayText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#99f6e4',
  },
  previewText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Tint.navy,
  },
  channels: {
    paddingVertical: 4,
  },
  channel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 64,
    paddingVertical: 8,
  },
  channelBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
  },
  channelIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Tint.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelIconOn: {
    backgroundColor: Serene.secondaryContainer,
  },
  channelTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  permissionText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: '#b45309',
  },
  permissionLink: {
    fontFamily: FontFamily.bodySemiBold,
    color: Tint.primary,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linkKind: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Tint.primary,
  },
  change: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Tint.border,
    justifyContent: 'center',
  },
  changeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.navy,
  },
  shareCard: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textarea: {
    minHeight: 96,
  },
  delete: {
    marginTop: 24,
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
  sheetList: {
    maxHeight: 420,
  },
  sheetListContent: {
    gap: 10,
  },
  deleteRow: {
    flexDirection: 'row',
    gap: 10,
  },
  deleteButton: {
    flex: 1.3,
    height: 50,
    borderRadius: 16,
    backgroundColor: Serene.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Serene.onPrimary,
  },
});
