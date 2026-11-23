// S-14 - Détail d'un événement | Module M07 Rendez-vous et calendrier | Phase S6
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, IconButton, PrimaryButton, SecondaryButton, SheetOption, Tag, TopBar, UndoToast, useKitStyles } from '@/components/ui/kit';
import { ErrorState, LoadingState } from '@/components/ui/states';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Serene } from '@/constants/design';
import { useQuery } from '@/hooks/use-query';
import { formatLongDay, formatTime } from '@/lib/demo-dates';
import { useSession } from '@/lib/session';

import { conflictsFor, durationOf, formatDuration, reminderLabel, timeZoneLabel } from '../data';
import { useTones } from '../components/calendar-ui';
import { ensureEvent, eventActions, loadEventReminder, useCalendarState, useEvent } from '../store';

type Sheet = 'menu' | 'cancel' | null;

export default function EventDetailScreen() {
  const tones = useTones();
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const event = useEvent(id);
  const { events } = useCalendarState();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const { user } = useSession();
  // Événement ouvert depuis un autre écran : chargé s'il manque ; puis son rappel.
  const load = useQuery(`event-${id ?? ''}`, async () => {
    await ensureEvent(id);
    await loadEventReminder(id).catch(() => undefined);
  });

  if (!event && load.status === 'loading') {
    return (
      <SafeAreaView style={kitStyles.safe} edges={['top']}>
        <TopBar title="Détail de l’événement" fallback="/calendar" />
        <View style={kitStyles.content}>
          <LoadingState rows={3} />
        </View>
      </SafeAreaView>
    );
  }

  if (!event && load.status === 'error') {
    return (
      <SafeAreaView style={kitStyles.safe} edges={['top']}>
        <TopBar title="Détail de l’événement" fallback="/calendar" />
        <View style={kitStyles.content}>
          <ErrorState error={load.error} onRetry={load.reload} />
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={kitStyles.safe} edges={['top']}>
        <TopBar title="Détail de l’événement" fallback="/calendar" />
        <View style={[kitStyles.content, styles.missing]}>
          <Icon name="event_busy" size={36} color={c.link} />
          <Text style={styles.missingTitle}>Cet événement n’existe plus</Text>
          <PrimaryButton label="Retour au calendrier" onPress={() => router.replace('/calendar')} />
        </View>
      </SafeAreaView>
    );
  }

  const tone = tones[event.tone];
  const conflicts = conflictsFor(event, events);
  const editHref = { pathname: '/calendar/edit', params: { id: event.id } } as const;
  const reminderHref = {
    pathname: '/reminders/add',
    params: {
      linkKind: 'event',
      linkId: event.id,
      linkTitle: event.title,
      at: new Date(event.start.getTime() - (event.reminder ?? 60) * 60000).toISOString(),
    },
  } as const;

  const editable = !event.readOnly && !event.cancelled;
  const guests = event.shared ? event.members.filter((name) => name !== 'Vous') : event.members;

  const cancel = () => {
    setSheet(null);
    eventActions.cancel(event.id);
    eventActions.setFlash({
      text: event.shared ? 'Événement annulé. Les membres du foyer sont prévenus.' : 'Événement annulé.',
    });
    if (router.canGoBack()) router.back();
    else router.replace('/calendar');
  };

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar
        title="Détail de l’événement"
        fallback="/calendar"
        right={editable ? <IconButton icon="more_vert" label="Plus d’actions" onPress={() => setSheet('menu')} /> : undefined}
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[kitStyles.content, styles.content]}
        showsVerticalScrollIndicator={false}>
        {event.cancelled ? (
          <View style={styles.cancelBanner}>
            <Icon name="event_busy" size={22} color="#b91c1c" />
            <View style={styles.flexMin}>
              <Text style={styles.cancelTitle}>Événement annulé</Text>
              <Text style={styles.cancelText}>Il n’apparaît plus dans votre calendrier.</Text>
            </View>
          </View>
        ) : null}

        <View style={[kitStyles.card, styles.hero]}>
          <View style={styles.heroTop}>
            <View style={[styles.heroIcon, { backgroundColor: tone.bg }]}>
              <Icon name={tone.icon} size={26} color={tone.fg} />
            </View>
            <View style={styles.badges}>
              <Tag icon={tone.icon} label={tone.label} tone={event.shared ? 'teal' : 'neutral'} />
            </View>
          </View>
          <Text style={[styles.title, event.cancelled && styles.cancelledText]}>{event.title}</Text>
          <HeroLine icon="calendar_today" text={formatLongDay(event.start)} />
          <HeroLine
            icon="schedule"
            text={
              event.allDay
                ? 'Toute la journée'
                : `${formatTime(event.start)} – ${formatTime(event.end)} • ${formatDuration(durationOf(event))}`
            }
          />
          {event.location ? <HeroLine icon="location_on" text={event.location} /> : null}
        </View>

        {!event.cancelled && !event.allDay ? (
          conflicts.length > 0 ? (
            <View style={styles.conflict}>
              <Icon name="warning" size={20} color="#b91c1c" />
              <Text style={styles.conflictText}>
                Chevauche « {conflicts[0].title} » ({formatTime(conflicts[0].start)} – {formatTime(conflicts[0].end)}).
              </Text>
            </View>
          ) : (
            <View style={styles.free}>
              <Icon name="event_available" size={20} color={c.success} />
              <Text style={styles.freeText}>Aucun conflit dans votre agenda.</Text>
            </View>
          )
        ) : null}

        <SectionTitle icon="info" title="Informations" />
        <View style={[kitStyles.card, styles.info]}>
          <InfoRow icon="calendar_today" label="Date" value={formatLongDay(event.start)} />
          <InfoRow
            icon="schedule"
            label="Horaire"
            value={event.allDay ? 'Toute la journée' : `${formatTime(event.start)} – ${formatTime(event.end)}`}
          />
          {!event.allDay ? (
            <InfoRow icon="timer" label="Durée" value={formatDuration(durationOf(event))} />
          ) : null}
          <InfoRow icon="public" label="Fuseau" value={timeZoneLabel()} />
          <InfoRow icon="notifications_active" label="Rappel" value={reminderLabel(event.reminder)} last />
        </View>

        <SectionTitle icon="group" title="Participants" />
        <View style={[kitStyles.card, styles.info]}>
          {event.source !== 'external' ? (
            <Person
              initial={(user?.full_name || user?.email || 'V').charAt(0).toUpperCase()}
              name={`${user?.full_name || user?.email || 'Vous'} (vous)`}
              detail="Organisateur"
              dark
            />
          ) : null}
          {guests.map((name) => (
            <Person
              key={name}
              initial={name.charAt(0).toUpperCase()}
              name={name}
              detail={event.shared ? 'Membre du foyer' : 'Invité'}
              external={!event.shared}
            />
          ))}
          {event.source !== 'external' && guests.length === 0 ? (
            <Text style={styles.privacy}>Aucun autre participant.</Text>
          ) : null}
        </View>
        {event.source === 'personal' ? (
          <Text style={styles.privacy}>Événement personnel : les membres du foyer ne le voient pas.</Text>
        ) : null}
        {event.readOnly ? (
          <Text style={styles.privacy}>
            {event.source === 'external'
              ? 'Événement d’un agenda connecté : modifiez-le depuis cet agenda.'
              : 'Événement organisé par une autre personne : vous ne pouvez pas le modifier.'}
          </Text>
        ) : null}

        {event.description ? (
          <>
            <SectionTitle icon="notes" title="Notes" />
            <View style={kitStyles.card}>
              <Text style={styles.notes}>{event.description}</Text>
            </View>
          </>
        ) : null}

        <View style={styles.actions}>
          {editable ? <PrimaryButton label="Modifier l’événement" icon="edit" onPress={() => router.push(editHref)} /> : null}
          {!event.cancelled && event.source !== 'external' ? (
            <SecondaryButton label="Ajouter un rappel lié" icon="add_alert" onPress={() => router.push(reminderHref)} />
          ) : null}
          {editable ? (
            <SecondaryButton label="Annuler l’événement" icon="event_busy" danger onPress={() => setSheet('cancel')} />
          ) : null}
        </View>
      </ScrollView>

      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={96} />
      ) : null}

      <BottomSheet visible={sheet === 'menu'} title="Actions" onClose={() => setSheet(null)}>
        <SheetOption
          icon="edit"
          label="Modifier"
          onPress={() => {
            setSheet(null);
            router.push(editHref);
          }}
        />
        <SheetOption
          icon="add_alert"
          label="Ajouter un rappel lié"
          onPress={() => {
            setSheet(null);
            router.push(reminderHref);
          }}
        />
        <SheetOption icon="event_busy" label="Annuler l’événement" danger onPress={() => setSheet('cancel')} />
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'cancel'}
        title="Annuler cet événement ?"
        subtitle={
          event.shared
            ? 'Il disparaîtra du calendrier du foyer et les membres seront prévenus. Cette action est définitive.'
            : 'Il disparaîtra de votre calendrier. Cette action est définitive.'
        }
        onClose={() => setSheet(null)}>
        <View style={styles.sheetRow}>
          <SecondaryButton label="Garder" style={styles.flex} onPress={() => setSheet(null)} />
          <Pressable
            style={({ pressed }) => [styles.dangerButton, pressed && styles.pressed]}
            accessibilityRole="button"
            onPress={cancel}>
            <Icon name="event_busy" size={20} color={c.solidText} />
            <Text style={styles.dangerText}>Annuler l’événement</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

function HeroLine({ icon, text }: { icon: string; text: string }) {
  const { c, styles } = useLook();
  return (
    <View style={styles.heroLine}>
      <Icon name={icon} size={18} color={c.muted} />
      <Text style={styles.heroLineText}>{text}</Text>
    </View>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  const { c, styles } = useLook();
  return (
    <View style={styles.sectionTitle}>
      <Icon name={icon} size={22} color={c.text} />
      <Text style={styles.sectionText}>{title}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value, last }: { icon: string; label: string; value: string; last?: boolean }) {
  const { c, styles } = useLook();
  return (
    <View style={[styles.infoRow, !last && styles.infoBorder]}>
      <Icon name={icon} size={20} color={c.muted} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function Person({
  initial,
  name,
  detail,
  dark,
  external,
}: {
  initial: string;
  name: string;
  detail: string;
  dark?: boolean;
  external?: boolean;
}) {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  return (
    <View style={[styles.person, styles.infoBorder]}>
      <View style={[styles.avatar, dark ? styles.avatarDark : external ? styles.avatarExternal : styles.avatarTeal]}>
        <Text style={[styles.avatarText, external && styles.avatarTextExternal]}>{initial}</Text>
      </View>
      <View style={styles.flexMin}>
        <Text style={styles.personName}>{name}</Text>
        <Text style={kitStyles.muted}>{detail}</Text>
      </View>
      {external ? <Tag label="Externe" /> : <Icon name="check_circle" size={20} color={c.success} />}
    </View>
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
    pressed: {
      opacity: 0.8,
    },
    content: {
      paddingTop: 4,
      paddingBottom: 120,
    },
    cancelBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
      padding: 14,
      borderRadius: 18,
      backgroundColor: '#fee2e2',
    },
    cancelTitle: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 15,
      lineHeight: 20,
      color: '#991b1b',
    },
    cancelText: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: '#991b1b',
    },
    restore: {
      height: 38,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: c.solid,
      justifyContent: 'center',
    },
    restoreText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.solidText,
    },
    hero: {
      gap: 8,
    },
    heroTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    heroIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badges: {
      flexDirection: 'row',
      gap: 6,
    },
    title: {
      fontFamily: FontFamily.headingBold,
      fontSize: 26,
      lineHeight: 32,
      letterSpacing: -0.4,
      color: c.text,
    },
    cancelledText: {
      textDecorationLine: 'line-through',
      color: c.muted,
    },
    heroLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    heroLineText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 21,
      color: c.text,
    },
    conflict: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 14,
      borderRadius: 16,
      backgroundColor: '#fee2e2',
    },
    conflictText: {
      flex: 1,
      fontFamily: FontFamily.bodyMedium,
      fontSize: 14,
      lineHeight: 20,
      color: '#991b1b',
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
      color: c.success,
    },
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 24,
      marginBottom: 12,
    },
    sectionText: {
      fontFamily: FontFamily.headingBold,
      fontSize: 20,
      lineHeight: 26,
      color: c.text,
    },
    info: {
      paddingVertical: 4,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minHeight: 52,
      paddingVertical: 10,
    },
    infoBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    infoLabel: {
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 20,
      color: c.muted,
    },
    infoValue: {
      flex: 1,
      textAlign: 'right',
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    person: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 60,
      paddingVertical: 8,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: Radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarDark: {
      backgroundColor: c.solid,
    },
    avatarTeal: {
      backgroundColor: c.link,
    },
    avatarExternal: {
      backgroundColor: c.soft,
    },
    avatarText: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.solidText,
    },
    avatarTextExternal: {
      color: c.text,
    },
    personName: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    privacy: {
      marginTop: 8,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 19,
      color: c.muted,
    },
    notes: {
      fontFamily: FontFamily.body,
      fontSize: 16,
      lineHeight: 24,
      color: c.text,
    },
    actions: {
      marginTop: 28,
      gap: 10,
    },
    notifyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minHeight: 56,
      paddingHorizontal: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
    },
    notifyText: {
      flex: 1,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    sheetRow: {
      flexDirection: 'row',
      gap: 10,
    },
    dangerButton: {
      flex: 1.6,
      height: 50,
      borderRadius: 16,
      backgroundColor: c.error,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    dangerText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.solidText,
    },
    missing: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      paddingBottom: 80,
    },
    missingTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 20,
      lineHeight: 26,
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

