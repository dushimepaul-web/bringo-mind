// S-14 - Détail d'un événement | Module M07 Rendez-vous et calendrier | Phase S6
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import {
  BottomSheet,
  IconButton,
  PrimaryButton,
  SecondaryButton,
  SheetOption,
  Tag,
  TopBar,
  UndoToast,
  kitStyles,
} from '@/components/ui/kit';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';
import { formatLongDay, formatTime } from '@/lib/demo-dates';

import {
  RECURRENCE_LABELS,
  TONES,
  USER_TIMEZONE,
  conflictsFor,
  durationOf,
  formatDuration,
  reminderLabel,
} from '../data';
import { eventActions, useCalendarState, useEvent } from '../store';

type Sheet = 'menu' | 'cancel' | null;

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const event = useEvent(id);
  const { events } = useCalendarState();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [notify, setNotify] = useState(true);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);

  if (!event) {
    return (
      <SafeAreaView style={kitStyles.safe} edges={['top']}>
        <TopBar title="Détail de l’événement" fallback="/calendar" />
        <View style={[kitStyles.content, styles.missing]}>
          <Icon name="event_busy" size={36} color={Tint.primary} />
          <Text style={styles.missingTitle}>Cet événement n’existe plus</Text>
          <PrimaryButton label="Retour au calendrier" onPress={() => router.replace('/calendar')} />
        </View>
      </SafeAreaView>
    );
  }

  const tone = TONES[event.tone];
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

  const cancel = () => {
    setSheet(null);
    eventActions.cancel(event.id);
    setToast({
      text: event.shared && notify ? 'Événement annulé. Thomas a été prévenu.' : 'Événement annulé.',
      undo: () => eventActions.restore(event.id),
    });
  };

  const remove = () => {
    setSheet(null);
    const undo = eventActions.remove(event.id);
    eventActions.setFlash({ text: `« ${event.title} » supprimé.`, undo });
    if (router.canGoBack()) router.back();
    else router.replace('/calendar');
  };

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar
        title="Détail de l’événement"
        fallback="/calendar"
        right={<IconButton icon="more_vert" label="Plus d’actions" onPress={() => setSheet('menu')} />}
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
              <Text style={styles.cancelText}>Il reste visible barré dans votre calendrier.</Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.restore, pressed && styles.pressed]}
              accessibilityRole="button"
              onPress={() => {
                eventActions.restore(event.id);
                setToast({ text: 'Événement rétabli.' });
              }}>
              <Text style={styles.restoreText}>Rétablir</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={[kitStyles.card, styles.hero]}>
          <View style={styles.heroTop}>
            <View style={[styles.heroIcon, { backgroundColor: tone.bg }]}>
              <Icon name={tone.icon} size={26} color={tone.fg} />
            </View>
            <View style={styles.badges}>
              <Tag label={tone.label} />
              <Tag
                icon={event.shared ? 'group' : 'person'}
                label={event.shared ? 'Foyer' : 'Personnel'}
                tone={event.shared ? 'teal' : 'neutral'}
              />
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
              <Icon name="event_available" size={20} color={Serene.success} />
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
          <InfoRow icon="public" label="Fuseau" value={`${USER_TIMEZONE.label} (${USER_TIMEZONE.offset})`} />
          <InfoRow icon="notifications_active" label="Rappel" value={reminderLabel(event.reminder)} />
          <InfoRow icon="event_repeat" label="Récurrence" value={RECURRENCE_LABELS[event.recurrence]} last />
        </View>

        <SectionTitle icon="group" title="Participants" />
        <View style={[kitStyles.card, styles.info]}>
          <Person initial="C" name="Claire Martin (vous)" detail="Organisatrice" dark />
          {event.shared
            ? event.members.map((name) => (
                <Person key={name} initial={name.charAt(0)} name={`${name} Martin`} detail="Membre du foyer • Confirmé" />
              ))
            : null}
          {event.external ? (
            <Person initial={event.external.name.replace('Dr. ', '').replace('Dr ', '').charAt(0)} name={event.external.name} detail={event.external.detail} external />
          ) : null}
        </View>
        {!event.shared ? (
          <Text style={styles.privacy}>Événement personnel : les membres du foyer ne le voient pas.</Text>
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
          <PrimaryButton label="Modifier l’événement" icon="edit" onPress={() => router.push(editHref)} />
          <SecondaryButton
            label="Ajouter un rappel lié"
            icon="add_alert"
            onPress={() => router.push(reminderHref)}
          />
          {event.cancelled ? (
            <SecondaryButton label="Supprimer définitivement" icon="delete" danger onPress={remove} />
          ) : (
            <SecondaryButton
              label="Annuler l’événement"
              icon="event_busy"
              danger
              onPress={() => setSheet('cancel')}
            />
          )}
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
        {!event.cancelled ? (
          <SheetOption icon="event_busy" label="Annuler l’événement" onPress={() => setSheet('cancel')} />
        ) : null}
        <SheetOption icon="delete" label="Supprimer" danger onPress={remove} />
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'cancel'}
        title="Annuler cet événement ?"
        subtitle="Il restera visible, barré, dans votre calendrier. Vous pourrez le rétablir."
        onClose={() => setSheet(null)}>
        {event.shared ? (
          <View style={styles.notifyRow}>
            <Icon name="campaign" size={22} color={Tint.navy} />
            <Text style={styles.notifyText}>Prévenir Thomas</Text>
            <Switch
              value={notify}
              onValueChange={setNotify}
              trackColor={{ false: Tint.border, true: Tint.primary }}
              thumbColor={Serene.surfaceContainerLowest}
              {...(Platform.OS === 'web' ? { activeThumbColor: Serene.surfaceContainerLowest } : {})}
              accessibilityLabel="Prévenir Thomas"
            />
          </View>
        ) : null}
        <View style={styles.sheetRow}>
          <SecondaryButton label="Garder" style={styles.flex} onPress={() => setSheet(null)} />
          <Pressable
            style={({ pressed }) => [styles.dangerButton, pressed && styles.pressed]}
            accessibilityRole="button"
            onPress={cancel}>
            <Icon name="event_busy" size={20} color={Serene.onPrimary} />
            <Text style={styles.dangerText}>Annuler l’événement</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

function HeroLine({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.heroLine}>
      <Icon name={icon} size={18} color={Serene.onSurfaceVariant} />
      <Text style={styles.heroLineText}>{text}</Text>
    </View>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Icon name={icon} size={22} color={Tint.navy} />
      <Text style={styles.sectionText}>{title}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value, last }: { icon: string; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoBorder]}>
      <Icon name={icon} size={20} color={Serene.onSurfaceVariant} />
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
  return (
    <View style={[styles.person, styles.infoBorder]}>
      <View style={[styles.avatar, dark ? styles.avatarDark : external ? styles.avatarExternal : styles.avatarTeal]}>
        <Text style={[styles.avatarText, external && styles.avatarTextExternal]}>{initial}</Text>
      </View>
      <View style={styles.flexMin}>
        <Text style={styles.personName}>{name}</Text>
        <Text style={kitStyles.muted}>{detail}</Text>
      </View>
      {external ? <Tag label="Externe" /> : <Icon name="check_circle" size={20} color={Serene.success} />}
    </View>
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
    backgroundColor: Tint.black,
    justifyContent: 'center',
  },
  restoreText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onPrimary,
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
    color: Tint.navy,
  },
  cancelledText: {
    textDecorationLine: 'line-through',
    color: Serene.onSurfaceVariant,
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
    color: Tint.navy,
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
    color: Serene.success,
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
    color: Tint.navy,
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
    borderBottomColor: Tint.border,
  },
  infoLabel: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onSurfaceVariant,
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
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
    backgroundColor: Tint.black,
  },
  avatarTeal: {
    backgroundColor: Tint.primary,
  },
  avatarExternal: {
    backgroundColor: Tint.lavender,
  },
  avatarText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
  avatarTextExternal: {
    color: Tint.navy,
  },
  personName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  privacy: {
    marginTop: 8,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
  },
  notes: {
    fontFamily: FontFamily.body,
    fontSize: 16,
    lineHeight: 24,
    color: Tint.navy,
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
    borderColor: Tint.border,
  },
  notifyText: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  sheetRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dangerButton: {
    flex: 1.6,
    height: 50,
    borderRadius: 16,
    backgroundColor: Serene.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dangerText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onPrimary,
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
    color: Tint.navy,
  },
});

