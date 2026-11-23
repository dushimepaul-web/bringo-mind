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
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { WheelList, WheelSeparator } from '@/components/ui/wheel-list';
import { BottomSheet, Chip, PrimaryButton, SecondaryButton, SheetOption, TopBar, useKitStyles } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Space } from '@/constants/design';
import { useQuery } from '@/hooks/use-query';
import {
  addDays,
  formatDay,
  atTime,
  dayOffset,
  formatDueLong,
  startOfDay,
  today,
} from '@/lib/demo-dates';
import { useSession } from '@/lib/session';

import {
  CHANNEL_META,
  REPEAT_HINTS,
  REPEAT_LABELS,
  hourLabel,
  inQuietHours,
  linkHref,
  linkIcon,
  linkLabel,
  timeZoneLabel,
} from '../data';
import { reminderActions, syncReminderTargets, useReminder, useReminderState } from '../store';
import type { Reminder, ReminderChannel, ReminderDraft, ReminderRepeat } from '../types';

const REPEATS: ReminderRepeat[] = ['once', 'daily'];
const CHANNELS: ReminderChannel[] = ['app', 'push', 'email'];

/** Rappel vide : demain à 9h00, dans l'application et en push, à rattacher. */
function emptyDraft(): ReminderDraft {
  return {
    at: atTime(addDays(today(), 1), 9),
    repeat: 'once',
    channels: ['app', 'push'],
    link: null,
  };
}

function draftOf(item: Reminder): ReminderDraft {
  return {
    at: item.at,
    repeat: item.repeat,
    channels: item.channels,
    link: item.link,
  };
}

const two = (value: number) => String(value).padStart(2, '0');
const HOUR_ITEMS = Array.from({ length: 24 }, (_, value) => ({ key: `h${value}`, label: two(value) }));
const MINUTE_ITEMS = Array.from({ length: 60 }, (_, value) => ({ key: `m${value}`, label: two(value) }));
const WHEEL_DAYS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];

/** « Aujourd'hui », « Demain », sinon « Sam. 18 mai ». */
function wheelDayLabel(day: Date): string {
  const offset = dayOffset(day);
  if (offset === 0) return 'Aujourd’hui';
  if (offset === 1) return 'Demain';
  const short = WHEEL_DAYS[day.getDay()];
  return `${short.charAt(0).toUpperCase()}${short.slice(1)} ${formatDay(day)}`;
}


export default function ReminderFormScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
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
  const { quietHours, targets } = useReminderState();
  const { user } = useSession();
  // Tâches et événements proposés dans « Associer à », et heures de silence.
  const targetsQuery = useQuery('reminder-targets', syncReminderTargets);
  const insets = useSafeAreaInsets();

  const [draft, setDraft] = useState<ReminderDraft>(() => {
    if (existing) return draftOf(existing);
    const base = emptyDraft();
    // Rappel créé depuis une tâche ou un événement : déjà rattaché, à l'heure proposée.
    if ((linkKind === 'event' || linkKind === 'task') && linkId && linkTitle) {
      return { ...base, at: at ? new Date(at) : base.at, link: { kind: linkKind, id: linkId, title: linkTitle } };
    }
    return at ? { ...base, at: new Date(at) } : base;
  });
  const [linkTouched, setLinkTouched] = useState(false);
  const [sheet, setSheet] = useState<'link' | 'delete' | null>(null);

  const set = <K extends keyof ReminderDraft>(key: K, value: ReminderDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const linkError = linkTouched && draft.link === null;
  const channelError = draft.channels.length === 0;
  const pastError = draft.at.getTime() <= Date.now();
  const canSave = draft.link !== null && !channelError && !pastError;

  // Roue des dates : d'aujourd'hui (ou de la date du rappel si elle est passée) à 3 mois.
  const wheelStart = startOfDay(dayOffset(draft.at) < 0 ? draft.at : today());
  const wheelDays = Array.from({ length: 92 }, (_, index) => addDays(wheelStart, index));
  const hour = draft.at.getHours();
  const minute = draft.at.getMinutes();
  const linkTarget = draft.link ? linkHref(draft.link) : null;

  const selectDay = (day: Date) => set('at', atTime(day, hour, minute));
  const selectTime = (hours: number, minutes: number) => set('at', atTime(draft.at, hours, minutes));

  const toggleChannel = (channel: ReminderChannel, enabled: boolean) =>
    set(
      'channels',
      enabled ? [...draft.channels, channel] : draft.channels.filter((entry) => entry !== channel),
    );

  const handleSave = () => {
    if (!canSave) {
      setLinkTouched(true);
      return;
    }
    const clean = draft;
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
          {/* Association (obligatoire : un rappel porte sur une tâche ou un événement) */}
          <Text style={kitStyles.label}>
            Associer à <Text style={styles.required}>*</Text>
          </Text>
          <View style={[kitStyles.card, styles.linkCard, linkError && styles.linkCardError]}>
            <View style={styles.channelIcon}>
              <Icon name={draft.link ? linkIcon(draft.link) : 'link'} size={20} color={c.text} />
            </View>
            <View style={styles.flexMin}>
              {draft.link ? (
                <>
                  <Text style={styles.linkKind}>{linkLabel(draft.link)}</Text>
                  <Text style={styles.channelTitle} numberOfLines={2}>
                    {draft.link.title}
                  </Text>
                  {linkTarget ? (
                    <Pressable hitSlop={6} accessibilityRole="link" onPress={() => router.push(linkTarget)}>
                      <Text style={kitStyles.link}>Ouvrir {draft.link.kind === 'task' ? 'la tâche' : 'l’événement'}</Text>
                    </Pressable>
                  ) : null}
                </>
              ) : (
                <Text style={styles.channelTitle}>Choisissez une tâche ou un événement</Text>
              )}
            </View>
            <Pressable
              style={({ pressed }) => [styles.change, pressed && styles.pressedSoft]}
              accessibilityRole="button"
              onPress={() => setSheet('link')}>
              <Text style={styles.changeText}>{draft.link ? 'Changer' : 'Choisir'}</Text>
            </Pressable>
          </View>
          {linkError ? (
            <View style={styles.errorRow} accessibilityLiveRegion="polite">
              <Icon name="error" size={16} color={c.error} />
              <Text style={styles.errorText}>Choisissez la tâche ou l’événement à rappeler.</Text>
            </View>
          ) : null}

          {/* Quand */}
          <Text style={[kitStyles.label, styles.spaced, styles.gap]}>Quand</Text>
          <View style={[kitStyles.card, styles.cardGap]}>
            <View style={styles.summary}>
              <View style={styles.summaryIcon}>
                <Icon name="alarm" size={22} color={c.link} />
              </View>
              <View style={styles.flexMin}>
                <Text style={styles.summaryTitle}>{formatDueLong({ dueAt: draft.at, hasTime: true })}</Text>
                <View style={styles.zone}>
                  <Icon name="public" size={15} color={c.muted} />
                  <Text style={kitStyles.muted}>{timeZoneLabel()}</Text>
                </View>
              </View>
            </View>

            <View style={styles.wheels}>
              <View style={styles.dateColumn}>
                <Text style={styles.wheelLabel}>Date</Text>
                <View style={styles.wheelBox}>
                  <WheelList
                    label="Date"
                    size="medium"
                    items={wheelDays.map((day) => ({ key: day.toDateString(), label: wheelDayLabel(day) }))}
                    index={Math.max(0, wheelDays.findIndex((day) => dayOffset(day) === dayOffset(draft.at)))}
                    onChange={(index) => selectDay(wheelDays[index])}
                  />
                </View>
              </View>
              <View style={styles.timeColumn}>
                <Text style={styles.wheelLabel}>Heure</Text>
                <View style={[styles.wheelBox, styles.timeBox]}>
                  <WheelList label="Heures" items={HOUR_ITEMS} index={hour} onChange={(value) => selectTime(value, minute)} style={styles.timeWheel} />
                  <WheelSeparator />
                  <WheelList label="Minutes" items={MINUTE_ITEMS} index={minute} onChange={(value) => selectTime(hour, value)} style={styles.timeWheel} />
                </View>
              </View>
            </View>

            {pastError ? (
              <View style={styles.errorRow} accessibilityLiveRegion="polite">
                <Icon name="error" size={16} color={c.error} />
                <Text style={styles.errorText}>Choisissez une heure à venir.</Text>
              </View>
            ) : null}
            {quietHours && inQuietHours(draft.at, quietHours) ? (
              <View style={styles.warning}>
                <Icon name="bedtime" size={18} color={c.amberText} />
                <Text style={styles.warningText}>
                  Cette heure tombe pendant vos heures de silence ({hourLabel(quietHours.start)} – {hourLabel(quietHours.end)}).
                  L’envoi sera décalé à la fin de la plage, sauf pour une tâche urgente.
                </Text>
              </View>
            ) : null}
          </View>

          {/* Répétition */}
          <Text style={[kitStyles.label, styles.spaced, styles.gap]}>Répétition</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsRow}>
            {REPEATS.map((repeat) => (
              <Chip
                key={repeat}
                label={REPEAT_LABELS[repeat]}
                selected={draft.repeat === repeat}
                onPress={() => set('repeat', repeat)}
              />
            ))}
          </ScrollView>
          <View style={styles.preview}>
            <Icon name="event_repeat" size={18} color={c.link} />
            <Text style={styles.previewText}>{REPEAT_HINTS[draft.repeat]}</Text>
          </View>

          {/* Canaux */}
          <Text style={[kitStyles.label, styles.spaced, styles.gap]}>Canaux de notification</Text>
          <View style={[kitStyles.card, styles.channels]}>
            {CHANNELS.map((channel, index) => {
              const meta = CHANNEL_META[channel];
              const enabled = draft.channels.includes(channel);
              return (
                <View key={channel} style={[styles.channel, index > 0 && styles.channelBorder]}>
                  <View style={styles.channelIcon}>
                    <Icon name={meta.icon} size={20} color={c.text} />
                  </View>
                  <View style={styles.flexMin}>
                    <Text style={styles.channelTitle}>{meta.label}</Text>
                    <Text style={kitStyles.muted}>{channel === 'email' && user?.email ? user.email : meta.hint}</Text>
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
              <Icon name="error" size={16} color={c.error} />
              <Text style={styles.errorText}>Choisissez au moins un canal.</Text>
            </View>
          ) : null}

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
          {targetsQuery.status === 'loading' && targets.length === 0 ? (
            <Text style={[kitStyles.muted, styles.sheetHint]}>Chargement de vos tâches et événements…</Text>
          ) : null}
          {targetsQuery.status === 'error' && targets.length === 0 ? (
            <SheetOption icon="refresh" label="Impossible de charger la liste · Réessayer" onPress={targetsQuery.reload} />
          ) : null}
          {targetsQuery.status === 'success' && targets.length === 0 ? (
            <Text style={[kitStyles.muted, styles.sheetHint]}>
              Aucune tâche ouverte ni événement à venir. Créez d’abord une tâche ou un événement.
            </Text>
          ) : null}
          {targets.map((target) => (
            <SheetOption
              key={`${target.kind}-${target.id}`}
              icon={linkIcon(target)}
              label={target.title}
              hint={linkLabel(target)}
              onPress={() => {
                set('link', target);
                setLinkTouched(true);
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
            <Icon name="delete" size={20} color={c.solidText} />
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
    wheelLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
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
    // La ligne de puces va jusqu'aux bords de l'écran pour montrer qu'elle défile.
    chipsScroll: {
      marginHorizontal: -Space.gutter,
    },
    chipsRow: {
      gap: 8,
      paddingHorizontal: Space.gutter,
    },
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
      color: c.error,
    },
    counter: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
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
      backgroundColor: c.tintMint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 17,
      lineHeight: 23,
      color: c.text,
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
    subLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.muted,
    },
    warning: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      padding: 12,
      borderRadius: 14,
      backgroundColor: c.tintAmber,
      borderWidth: 1,
      borderColor: c.dark ? '#5A4A1E' : '#fde68a',
    },
    warningText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 19,
      color: c.amberText,
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
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    weekdaySelected: {
      backgroundColor: c.solid,
      borderColor: c.solid,
    },
    weekdayText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    preview: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      marginTop: 12,
      padding: 12,
      borderRadius: 14,
      backgroundColor: c.tintMint,
      borderWidth: 1,
      borderColor: c.border,
    },
    previewText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 20,
      color: c.text,
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
      borderTopColor: c.border,
    },
    channelIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: c.soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    channelIconOn: {
      backgroundColor: c.tintMint,
    },
    channelTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    permissionText: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.amberText,
    },
    permissionLink: {
      fontFamily: FontFamily.bodySemiBold,
      color: c.link,
    },
    linkCardError: {
      borderColor: c.error,
    },
    sheetHint: {
      paddingHorizontal: 4,
      paddingVertical: 12,
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
      color: c.link,
    },
    change: {
      height: 40,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      justifyContent: 'center',
    },
    changeText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
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
      borderTopColor: c.border,
      backgroundColor: c.page,
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
      backgroundColor: c.error,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    deleteText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.solidText,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
