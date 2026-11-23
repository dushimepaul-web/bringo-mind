// S-09 - Détail d'une tâche | Module M04 Tâches | Phase S4
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { ErrorState, LoadingState } from '@/components/ui/states';
import { useQuery } from '@/hooks/use-query';
import { isApiError } from '@/lib/api';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Space } from '@/constants/design';

import { BottomSheet, IconButton, PrimaryButton, PriorityBadge, SecondaryButton, SheetOption, Tag, TopBar, UndoToast, useTaskStyles } from '../components/task-ui';
import {
  categoryIcon,
  categoryLabel,
  formatDay,
  formatDueLong,
  formatLongDay,
  initialsOf,
  lateDays,
  remindersSummary,
} from '../data';
import { ensureTask, taskActions, useTask, useTaskContext } from '../store';

type Sheet = 'menu' | 'postpone' | 'delete' | null;
type Toast = { text: string; undo?: () => void };

const POSTPONE_OPTIONS = [
  { days: 1, label: 'Demain', icon: 'today' },
  { days: 3, label: 'Dans 3 jours', icon: 'date_range' },
  { days: 7, label: 'La semaine prochaine', icon: 'next_week' },
];

export default function TaskDetailScreen() {
  const { c, styles } = useLook();
  const taskStyles = useTaskStyles();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const task = useTask(id);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const { household } = useTaskContext();
  // Tâche ouverte depuis un autre écran sans passer par la liste : on la demande au serveur.
  const load = useQuery(`task-${id ?? ''}`, () => ensureTask(id));

  if (!task && load.status === 'loading') {
    return (
      <SafeAreaView style={taskStyles.safe} edges={['top']}>
        <TopBar title="Détail de la tâche" fallback="/tasks" />
        <View style={taskStyles.content}>
          <LoadingState rows={3} />
        </View>
      </SafeAreaView>
    );
  }

  // Erreur autre qu'une tâche introuvable (réseau, serveur) : on propose de réessayer.
  if (!task && load.status === 'error' && !(isApiError(load.error) && load.error.status === 404)) {
    return (
      <SafeAreaView style={taskStyles.safe} edges={['top']}>
        <TopBar title="Détail de la tâche" fallback="/tasks" />
        <View style={taskStyles.content}>
          <ErrorState error={load.error} onRetry={load.reload} />
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={taskStyles.safe} edges={['top']}>
        <TopBar title="Détail de la tâche" fallback="/tasks" />
        <View style={[taskStyles.content, styles.missing]}>
          <View style={styles.missingIcon}>
            <Icon name="search_off" size={30} color={c.link} />
          </View>
          <Text style={styles.missingTitle}>Cette tâche n’existe plus</Text>
          <Text style={styles.missingText}>Elle a peut-être été supprimée.</Text>
          <PrimaryButton label="Voir mes tâches" onPress={() => router.replace('/tasks')} />
        </View>
      </SafeAreaView>
    );
  }

  const open = task.status === 'open';
  const late = lateDays(task);
  const awaitingAnswer = task.assignedToMe && task.assignmentStatus === 'pending';
  const sharedWith = household && task.householdId === household.id
    ? household.members.map((member) => (member.you ? 'Vous' : member.name)).join(' · ')
    : 'Tous les membres du foyer';
  const editHref = { pathname: '/tasks/edit', params: { id: task.id } } as const;

  const status: { label: string; tone: StatusTone; icon: string } = !open
    ? task.status === 'done'
      ? { label: 'Terminée', tone: 'green', icon: 'check_circle' }
      : { label: 'Archivée', tone: 'gray', icon: 'inventory_2' }
    : late > 0
      ? { label: late === 1 ? 'En retard d’1 jour' : `En retard de ${late} jours`, tone: 'red', icon: 'warning' }
      : task.inProgress
        ? { label: 'En cours', tone: 'blue', icon: 'schedule' }
        : { label: 'À faire', tone: 'gray', icon: 'radio_button_unchecked' };

  const postpone = (days: number) => {
    setSheet(null);
    taskActions.postpone(task.id, days);
    setToast({
      text: `Échéance reportée : ${formatDay(new Date(task.dueAt.getTime() + days * 86400000))}.`,
      undo: () => taskActions.postpone(task.id, -days),
    });
  };

  const archive = () => {
    setSheet(null);
    if (task.status === 'archived') {
      taskActions.restore(task.id);
      setToast({ text: 'Tâche restaurée.', undo: () => taskActions.archive(task.id) });
    } else {
      taskActions.archive(task.id);
      setToast({ text: 'Tâche archivée.', undo: () => taskActions.restore(task.id) });
    }
  };

  const remove = () => {
    setSheet(null);
    const undo = taskActions.remove(task.id);
    taskActions.setFlash({ text: `« ${task.title} » supprimée.`, undo });
    if (router.canGoBack()) router.back();
    else router.replace('/tasks');
  };

  const keepSuggestion = () => {
    taskActions.confirm(task.id);
    setToast({ text: 'Tâche gardée dans votre liste.' });
  };

  const answer = (accept: boolean) => {
    taskActions.respond(task.id, accept);
    setToast({ text: accept ? 'Vous vous chargez de cette tâche.' : 'Attribution refusée.' });
  };

  const toggleDone = () => {
    if (open) {
      taskActions.complete(task.id);
      setToast({ text: 'Tâche terminée. Bravo !', undo: () => taskActions.reopen(task.id) });
    } else {
      taskActions.reopen(task.id);
      setToast({ text: 'Tâche rouverte.', undo: () => taskActions.complete(task.id) });
    }
  };

  return (
    <SafeAreaView style={taskStyles.safe} edges={['top']}>
      <TopBar
        title="Détail de la tâche"
        fallback="/tasks"
        right={<IconButton icon="more_vert" label="Plus d’actions" onPress={() => setSheet('menu')} />}
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[taskStyles.content, styles.content]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.badges}>
          <PriorityBadge priority={task.priority} withDot />
          <StatusPill icon={status.icon} label={status.label} tone={status.tone} />
          <Tag
            icon={task.household ? 'group' : 'person'}
            label={task.household ? 'Partagée' : 'Personnelle'}
            tone={task.household ? 'teal' : 'neutral'}
          />
        </View>

        <Text style={[styles.title, !open && styles.titleDone]}>{task.title}</Text>
        <Text style={styles.context}>{task.context}</Text>

        {task.suggested && open ? (
          <View style={[taskStyles.card, styles.block, styles.notice]}>
            <Text style={styles.description}>
              Kora a repéré cette démarche. Vérifiez-la, puis gardez-la dans votre liste.
            </Text>
            <PrimaryButton label="Garder la tâche" icon="check" onPress={keepSuggestion} />
          </View>
        ) : null}

        {awaitingAnswer && open ? (
          <View style={[taskStyles.card, styles.block, styles.notice]}>
            <Text style={styles.description}>Un membre du foyer vous a confié cette tâche.</Text>
            <PrimaryButton label="Je m’en charge" icon="check" onPress={() => answer(true)} />
            <SecondaryButton label="Refuser" icon="close" onPress={() => answer(false)} />
          </View>
        ) : null}

        {task.description ? (
          <>
            <SectionTitle icon="notes" title="Description" />
            <View style={[taskStyles.card, styles.block]}>
              <Text style={styles.description}>{task.description}</Text>
            </View>
          </>
        ) : null}

        <SectionTitle icon="info" title="Informations" />
        <View style={[taskStyles.card, styles.infoCard]}>
          <InfoRow
            icon="event"
            label="Échéance"
            value={task.hasDue ? formatDueLong(task) : 'Sans échéance'}
            danger={late > 0}
          />
          <InfoRow icon={categoryIcon(task.category)} label="Catégorie" value={categoryLabel(task.category)} />
          {task.household ? (
            <InfoRow
              icon="person"
              label="Assignée à"
              value={task.assignee || 'Personne pour l’instant'}
              avatar={task.assignee ? initialsOf(task.assignee) : undefined}
            />
          ) : null}
          <InfoRow
            icon={task.household ? 'group' : 'lock'}
            label={task.household ? `Partagée avec ${task.household}` : 'Espace'}
            value={task.household ? sharedWith : 'Personnel, visible par vous seule'}
          />
          <InfoRow
            icon="notifications_active"
            label={task.reminderAt.length > 1 ? 'Rappels' : 'Rappel'}
            value={remindersSummary(task)}
          />
          <InfoRow
            icon="calendar_add_on"
            label="Créée le"
            value={formatLongDay(task.createdAt)}
            last
          />
        </View>

        {task.household ? (
          <Text style={styles.privacy}>
            Les membres du foyer voient cette tâche, mais jamais vos notes ni vos tâches personnelles.
          </Text>
        ) : null}

      </ScrollView>

      <View style={styles.footer}>
        {open ? (
          <PrimaryButton label="Marquer comme terminée" icon="done_all" onPress={toggleDone} />
        ) : task.status === 'done' ? (
          <PrimaryButton label="Rouvrir la tâche" icon="undo" onPress={toggleDone} />
        ) : (
          <PrimaryButton label="Restaurer la tâche" icon="unarchive" onPress={archive} />
        )}
      </View>

      {toast ? (
        <UndoToast
          key={toast.text}
          text={toast.text}
          onUndo={toast.undo}
          onHide={() => setToast(null)}
          bottom={96}
        />
      ) : null}

      <BottomSheet visible={sheet === 'menu'} title="Actions" onClose={() => setSheet(null)}>
        <SheetOption
          icon="edit"
          label="Modifier la tâche"
          onPress={() => {
            setSheet(null);
            router.push(editHref);
          }}
        />
        {open ? (
          <SheetOption icon="schedule" label="Reporter l’échéance" onPress={() => setSheet('postpone')} />
        ) : null}
        <SheetOption
          icon={task.status === 'archived' ? 'unarchive' : 'inventory_2'}
          label={task.status === 'archived' ? 'Restaurer' : 'Archiver'}
          hint="La tâche quitte vos listes actives sans être supprimée."
          onPress={archive}
        />
        <SheetOption icon="delete" label="Supprimer" danger onPress={() => setSheet('delete')} />
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'postpone'}
        title="Reporter l’échéance"
        subtitle={`Actuellement : ${formatDueLong(task)}`}
        onClose={() => setSheet(null)}>
        {POSTPONE_OPTIONS.map((option) => (
          <SheetOption
            key={option.days}
            icon={option.icon}
            label={option.label}
            hint={formatLongDay(new Date(task.dueAt.getTime() + option.days * 86400000))}
            onPress={() => postpone(option.days)}
          />
        ))}
        <SheetOption
          icon="edit_calendar"
          label="Choisir une date"
          onPress={() => {
            setSheet(null);
            router.push(editHref);
          }}
        />
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'delete'}
        title="Supprimer cette tâche ?"
        subtitle="Elle sera retirée de toutes vos listes. Vous pourrez annuler pendant quelques secondes."
        onClose={() => setSheet(null)}>
        <View style={styles.deleteRow}>
          <SecondaryButton label="Garder" style={styles.flex} onPress={() => setSheet(null)} />
          <Pressable
            style={({ pressed }) => [styles.deleteButton, pressed && styles.deletePressed]}
            accessibilityRole="button"
            onPress={remove}>
            <Icon name="delete" size={20} color={c.solidText} />
            <Text style={styles.deleteText}>Supprimer</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

type StatusTone = 'blue' | 'green' | 'red' | 'gray';

/** Pastille d'état aux couleurs de la liste (À faire, En cours, Terminée, En retard). */
function StatusPill({ icon, label, tone }: { icon: string; label: string; tone: StatusTone }) {
  const { c, styles } = useLook();
  const colors = {
    blue: { bg: c.dark ? '#24396A' : '#D5E3FA', fg: c.dark ? '#8DBBFF' : '#1D5ED0' },
    green: { bg: c.dark ? '#1F4A35' : '#C8EED5', fg: c.dark ? '#4ADE80' : '#15803D' },
    red: { bg: c.dark ? '#3B1D24' : '#FDE2E2', fg: c.dark ? '#FCA5A5' : '#B91C1C' },
    gray: { bg: c.soft, fg: c.text },
  }[tone];
  return (
    <View style={[styles.statusPill, { backgroundColor: colors.bg }]}>
      <Icon name={icon} size={14} color={colors.fg} filled={tone !== 'gray'} />
      <Text style={[styles.statusPillText, { color: colors.fg }]}>{label}</Text>
    </View>
  );
}

function SectionTitle({ icon, title, aside }: { icon: string; title: string; aside?: string }) {
  const { c, styles } = useLook();
  const taskStyles = useTaskStyles();
  return (
    <View style={styles.sectionTitle}>
      <Icon name={icon} size={22} color={c.text} />
      <Text style={[taskStyles.sectionTitle, styles.flex]}>{title}</Text>
      {aside ? <Text style={styles.aside}>{aside}</Text> : null}
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  danger,
  avatar,
  last,
}: {
  icon: string;
  label: string;
  value: string;
  danger?: boolean;
  avatar?: string;
  last?: boolean;
}) {
  const { c, styles } = useLook();
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Icon name={icon} size={20} color={c.muted} />
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueWrap}>
        {avatar ? (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatar}</Text>
          </View>
        ) : null}
        <Text style={[styles.infoValue, danger && styles.infoValueDanger]} numberOfLines={2}>
          {value}
        </Text>
      </View>
    </View>
  );
}


function makeStyles(c: AppColors) {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: Radius.full,
    },
    statusPillText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
    },
    addStep: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minHeight: 48,
    },
    addStepInput: {
      flex: 1,
      paddingVertical: 10,
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
      outlineWidth: 0,
      outlineStyle: 'solid',
    },
    footer: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 12,
      borderTopWidth: 1,
      borderTopColor: c.border,
      backgroundColor: c.page,
    },
    flexMin: {
      flex: 1,
      minWidth: 0,
    },
    content: {
      paddingTop: 4,
      paddingBottom: 120,
    },
    badges: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    title: {
      fontFamily: FontFamily.headingBold,
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.5,
      color: c.text,
      marginTop: 12,
    },
    titleDone: {
      color: c.muted,
      textDecorationLine: 'line-through',
    },
    context: {
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 21,
      color: c.muted,
      marginTop: 6,
    },
    notice: {
      gap: Space.sm,
      marginTop: Space.md,
    },
    block: {
      marginTop: Space.md,
      gap: 6,
    },
    blockLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: c.muted,
    },
    description: {
      fontFamily: FontFamily.body,
      fontSize: 16,
      lineHeight: 24,
      color: c.text,
    },
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 26,
      marginBottom: 12,
    },
    aside: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.link,
    },
    infoCard: {
      paddingVertical: 4,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minHeight: 52,
      paddingVertical: 10,
    },
    infoRowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    infoLabel: {
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 20,
      color: c.muted,
    },
    infoValueWrap: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 8,
    },
    infoValue: {
      flexShrink: 1,
      textAlign: 'right',
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    infoValueDanger: {
      color: c.error,
    },
    avatar: {
      width: 26,
      height: 26,
      borderRadius: Radius.full,
      backgroundColor: c.solid,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarTeal: {
      backgroundColor: c.link,
    },
    avatarText: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.solidText,
    },
    subtasks: {
      paddingVertical: 12,
    },
    progressTrack: {
      height: 6,
      borderRadius: Radius.full,
      backgroundColor: c.soft,
      overflow: 'hidden',
      marginBottom: 6,
    },
    progressFill: {
      height: '100%',
      borderRadius: Radius.full,
      backgroundColor: c.link,
    },
    subRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 50,
    },
    subRowBorder: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
    },
    subText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 16,
      lineHeight: 22,
      color: c.text,
    },
    subTextDone: {
      color: c.muted,
      textDecorationLine: 'line-through',
    },
    docRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    docIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: c.soft,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    people: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    person: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingLeft: 4,
      paddingRight: 12,
      paddingVertical: 4,
      borderRadius: Radius.full,
      backgroundColor: c.soft,
    },
    personName: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    privacy: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 19,
      color: c.muted,
      marginTop: 8,
    },
    actions: {
      marginTop: 28,
      gap: 10,
    },
    actionRow: {
      flexDirection: 'row',
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
    deletePressed: {
      opacity: 0.88,
    },
    deleteText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.solidText,
    },
    missing: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      paddingBottom: 80,
    },
    missingIcon: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: c.tintMint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    missingTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 20,
      lineHeight: 26,
      color: c.text,
    },
    missingText: {
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 21,
      color: c.muted,
      marginBottom: 8,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
