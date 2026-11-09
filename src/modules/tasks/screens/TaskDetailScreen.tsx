// S-09 - Détail d'une tâche | Module M04 Tâches | Phase S4
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';

import {
  BottomSheet,
  CheckCircle,
  ConfirmButton,
  IconButton,
  PrimaryButton,
  PriorityBadge,
  SecondaryButton,
  SheetOption,
  Tag,
  TopBar,
  UndoToast,
  taskStyles,
} from '../components/task-ui';
import { CATEGORY_ICONS, formatDay, formatDueLong, formatLongDay, lateDays } from '../data';
import { taskActions, useTask } from '../store';

type Sheet = 'menu' | 'postpone' | 'delete' | null;
type Toast = { text: string; undo?: () => void };

const POSTPONE_OPTIONS = [
  { days: 1, label: 'Demain', icon: 'today' },
  { days: 3, label: 'Dans 3 jours', icon: 'date_range' },
  { days: 7, label: 'La semaine prochaine', icon: 'next_week' },
];

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const task = useTask(id);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  if (!task) {
    return (
      <SafeAreaView style={taskStyles.safe} edges={['top']}>
        <TopBar title="Détail de la tâche" />
        <View style={[taskStyles.content, styles.missing]}>
          <View style={styles.missingIcon}>
            <Icon name="search_off" size={30} color={Tint.primary} />
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
  const doneSubtasks = task.subtasks.filter((sub) => sub.done).length;
  const editHref = { pathname: '/tasks/edit', params: { id: task.id } } as const;

  const status = !open
    ? task.status === 'done'
      ? { label: 'Terminée', tone: 'success' as const, icon: 'task_alt' }
      : { label: 'Archivée', tone: 'neutral' as const, icon: 'inventory_2' }
    : late > 0
      ? { label: late === 1 ? 'En retard d’1 jour' : `En retard de ${late} jours`, tone: 'danger' as const, icon: 'warning' }
      : { label: 'En cours', tone: 'neutral' as const, icon: 'pending' };

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
        right={<IconButton icon="more_vert" label="Plus d’actions" onPress={() => setSheet('menu')} />}
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[taskStyles.content, styles.content]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.badges}>
          <PriorityBadge priority={task.priority} withDot />
          <Tag icon={status.icon} label={status.label} tone={status.tone} />
          <Tag
            icon={task.household ? 'group' : 'person'}
            label={task.household ? 'Partagée' : 'Personnelle'}
            tone={task.household ? 'teal' : 'neutral'}
          />
        </View>

        <Text style={[styles.title, !open && styles.titleDone]}>{task.title}</Text>
        <Text style={styles.context}>{task.context}</Text>

        {task.description ? (
          <View style={[taskStyles.card, styles.block]}>
            <Text style={styles.blockLabel}>Description</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        ) : null}

        <SectionTitle icon="info" title="Informations" />
        <View style={[taskStyles.card, styles.infoCard]}>
          <InfoRow
            icon="event"
            label="Échéance"
            value={formatDueLong(task)}
            danger={late > 0}
          />
          <InfoRow icon={CATEGORY_ICONS[task.category]} label="Catégorie" value={task.category} />
          <InfoRow
            icon="person"
            label="Assignée à"
            value={task.assignee === 'Claire' ? 'Claire Martin (vous)' : `${task.assignee} Martin`}
            avatar={task.assignee.charAt(0)}
          />
          <InfoRow
            icon={task.household ? 'family_restroom' : 'lock'}
            label="Espace"
            value={task.household ?? 'Personnel'}
          />
          <InfoRow
            icon="notifications_active"
            label="Rappel"
            value={task.reminder ? '1 h avant l’échéance' : 'Aucun'}
          />
          <InfoRow
            icon="calendar_add_on"
            label="Créée le"
            value={formatLongDay(task.createdAt)}
            last
          />
        </View>

        {task.subtasks.length > 0 ? (
          <>
            <SectionTitle
              icon="checklist"
              title="Sous-tâches"
              aside={`${doneSubtasks}/${task.subtasks.length}`}
            />
            <View style={[taskStyles.card, styles.subtasks]}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(doneSubtasks / task.subtasks.length) * 100}%` },
                  ]}
                />
              </View>
              {task.subtasks.map((sub, index) => (
                <Pressable
                  key={sub.id}
                  style={[styles.subRow, index > 0 && styles.subRowBorder]}
                  // La case à cocher porte le rôle accessible ; la ligne élargit seulement la zone tactile.
                  onPress={() => taskActions.toggleSubtask(task.id, sub.id)}>
                  <CheckCircle
                    square
                    checked={sub.done}
                    label={sub.title}
                    onPress={() => taskActions.toggleSubtask(task.id, sub.id)}
                  />
                  <Text style={[styles.subText, sub.done && styles.subTextDone]}>{sub.title}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        {task.document ? (
          <>
            <SectionTitle icon="attach_file" title="Document lié" />
            <Pressable
              style={({ pressed }) => [taskStyles.card, styles.docRow, pressed && taskStyles.cardPressed]}
              accessibilityRole="button"
              onPress={() => router.push('/documents/detail')}>
              <View style={styles.docIcon}>
                <Icon name="picture_as_pdf" size={24} color={Tint.navy} />
              </View>
              <View style={styles.flexMin}>
                <Text style={taskStyles.title} numberOfLines={1}>
                  {task.document.name}
                </Text>
                <Text style={taskStyles.muted}>{task.document.meta}</Text>
              </View>
              <Icon name="chevron_right" size={22} color={Serene.onSurfaceVariant} />
            </Pressable>
          </>
        ) : null}

        {task.household ? (
          <>
            <SectionTitle icon="group" title="Partagée avec" />
            <View style={[taskStyles.card, styles.people]}>
              <Person name="Claire (vous)" initial="C" dark />
              {task.sharedWith.map((name) => (
                <Person key={name} name={name} initial={name.charAt(0)} />
              ))}
            </View>
            <Text style={styles.privacy}>
              Les membres voient cette tâche, mais jamais vos notes ni vos tâches personnelles.
            </Text>
          </>
        ) : null}

        <View style={styles.actions}>
          {open ? (
            <ConfirmButton label="Marquer comme terminée" icon="done_all" onPress={toggleDone} />
          ) : task.status === 'done' ? (
            <SecondaryButton label="Rouvrir la tâche" icon="undo" onPress={toggleDone} />
          ) : (
            <ConfirmButton label="Restaurer la tâche" icon="unarchive" onPress={archive} />
          )}
          <View style={styles.actionRow}>
            <SecondaryButton
              label="Modifier"
              icon="edit"
              style={styles.flex}
              onPress={() => router.push(editHref)}
            />
            {open ? (
              <SecondaryButton
                label="Reporter"
                icon="schedule"
                style={styles.flex}
                onPress={() => setSheet('postpone')}
              />
            ) : null}
          </View>
          <View style={styles.actionRow}>
            {task.status !== 'archived' ? (
              <SecondaryButton label="Archiver" icon="inventory_2" style={styles.flex} onPress={archive} />
            ) : null}
            <SecondaryButton
              label="Supprimer"
              icon="delete"
              danger
              style={styles.flex}
              onPress={() => setSheet('delete')}
            />
          </View>
        </View>
      </ScrollView>

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
            <Icon name="delete" size={20} color={Serene.onPrimary} />
            <Text style={styles.deleteText}>Supprimer</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

function SectionTitle({ icon, title, aside }: { icon: string; title: string; aside?: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Icon name={icon} size={22} color={Tint.navy} />
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
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Icon name={icon} size={20} color={Serene.onSurfaceVariant} />
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

function Person({ name, initial, dark }: { name: string; initial: string; dark?: boolean }) {
  return (
    <View style={styles.person}>
      <View style={[styles.avatar, !dark && styles.avatarTeal]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <Text style={styles.personName}>{name}</Text>
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
    color: Tint.navy,
    marginTop: 12,
  },
  titleDone: {
    color: Serene.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  context: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 21,
    color: Serene.onSurfaceVariant,
    marginTop: 6,
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
    color: Serene.onSurfaceVariant,
  },
  description: {
    fontFamily: FontFamily.body,
    fontSize: 16,
    lineHeight: 24,
    color: Tint.navy,
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
    color: Tint.primary,
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
    borderBottomColor: Tint.border,
  },
  infoLabel: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onSurfaceVariant,
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
    color: Tint.navy,
  },
  infoValueDanger: {
    color: '#b91c1c',
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    backgroundColor: Tint.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTeal: {
    backgroundColor: Tint.primary,
  },
  avatarText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    color: Serene.onPrimary,
  },
  subtasks: {
    paddingVertical: 12,
  },
  progressTrack: {
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Tint.soft,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.full,
    backgroundColor: Tint.primary,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 50,
  },
  subRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
  },
  subText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 16,
    lineHeight: 22,
    color: Tint.navy,
  },
  subTextDone: {
    color: Serene.onSurfaceVariant,
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
    backgroundColor: Tint.soft,
    borderWidth: 1,
    borderColor: Tint.border,
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
    backgroundColor: Tint.soft,
  },
  personName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  privacy: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
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
    backgroundColor: Serene.error,
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
    color: Serene.onPrimary,
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
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    lineHeight: 26,
    color: Tint.navy,
  },
  missingText: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 21,
    color: Serene.onSurfaceVariant,
    marginBottom: 8,
  },
});
