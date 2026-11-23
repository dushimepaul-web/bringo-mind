// S-08 - Liste des tâches | Module M04 Tâches | Phase S4
// D'après les maquettes validées : titre + recherche + « + », onglets Personnel / Foyer,
// puis les tâches classées « À faire », « En cours » et « Terminées » (bandeau de couleur, compteur, menu ⋮).
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { QueryView } from '@/components/ui/states';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { useQuery } from '@/hooks/use-query';

import { BottomSheet, SheetOption, SwipeRow, UndoToast, useTaskStyles } from '../components/task-ui';
import { categoryIcon, categoryLabel, dayOffset, formatDay, initialsOf } from '../data';
import { syncTasks, taskActions, useFlash, useTaskContext, useTasks } from '../store';
import { TASK_VIEWS, setTaskView, useTaskView, type TaskView } from '../view-mode';
import type { Task } from '../types';

type Space = 'personal' | 'household';
type Status = 'todo' | 'doing' | 'done';
type Toast = { text: string; undo?: () => void };

/** Onglets Personnel / Foyer (le nom du foyer vient de l'API). */
function spacesOf(householdName: string | null): { key: Space; label: string }[] {
  return [
    { key: 'personal', label: 'Personnel' },
    { key: 'household', label: householdName ? `Foyer · ${householdName}` : 'Foyer' },
  ];
}

const STATUS_LABELS: Record<Status, string> = { todo: 'À faire', doing: 'En cours', done: 'Terminées' };

/** « En cours » : statut `in_progress` du serveur ; « Terminées » : tâche terminée. */
function statusOf(task: Task): Status | null {
  if (task.status === 'done') return 'done';
  if (task.status !== 'open') return null;
  return task.inProgress ? 'doing' : 'todo';
}

/** « Aujourd'hui », « Demain », « Hier », sinon « 16 mai ». */
function dueText(task: Task): string {
  if (!task.hasDue && task.status !== 'done') return 'Sans échéance';
  const date = task.status === 'done' ? (task.completedAt ?? task.dueAt) : task.dueAt;
  const offset = dayOffset(date);
  if (offset === 0) return 'Aujourd’hui';
  if (offset === 1) return 'Demain';
  if (offset === -1) return 'Hier';
  return formatDay(date);
}

export default function TaskListScreen() {
  const { c, styles } = useLook();
  const taskStyles = useTaskStyles();
  const tasks = useTasks();
  const flash = useFlash();
  const { household } = useTaskContext();
  const [space, setSpace] = useState<Space>('personal');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Record<Status, boolean>>({ todo: false, doing: false, done: true });
  const [menuTask, setMenuTask] = useState<Task | null>(null);
  const [viewSheet, setViewSheet] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const view = useTaskView();
  const [toast, setToast] = useState<Toast | null>(null);
  // Chargement (mode « api ») et rechargement en tirant la liste vers le bas.
  const sync = useQuery('tasks', syncTasks);

  // Message laissé par un autre écran (tâche créée, supprimée…).
  useFocusEffect(
    useCallback(() => {
      if (flash) {
        setToast(flash);
        taskActions.setFlash(null);
      }
    }, [flash]),
  );

  const sections = useMemo(() => {
    const term = query.trim().toLowerCase();
    const mine = tasks.filter((task) => {
      const inSpace = space === 'personal' ? task.household === null : task.household !== null;
      const inQuery =
        !term || [task.title, categoryLabel(task.category), task.context].some((value) => value.toLowerCase().includes(term));
      return inSpace && inQuery;
    });
    return (['todo', 'doing', 'done'] as Status[]).map((status) => ({
      status,
      items: mine
        .filter((task) => statusOf(task) === status)
        .sort((a, b) =>
          status === 'done'
            ? (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0)
            : a.dueAt.getTime() - b.dueAt.getTime(),
        ),
    }));
  }, [tasks, space, query]);

  const complete = (task: Task) => {
    taskActions.complete(task.id);
    setToast({ text: `« ${task.title} » terminée.`, undo: () => taskActions.reopen(task.id) });
  };
  const reopen = (task: Task) => {
    taskActions.reopen(task.id);
    setToast({ text: 'Tâche rouverte.', undo: () => taskActions.complete(task.id) });
  };
  const postpone = (task: Task) => {
    taskActions.postpone(task.id, 1);
    setToast({ text: 'Échéance reportée d’un jour.', undo: () => taskActions.postpone(task.id, -1) });
  };
  const archive = (task: Task) => {
    taskActions.archive(task.id);
    setToast({ text: 'Tâche archivée.', undo: () => taskActions.restore(task.id) });
  };

  const nothing = sections.every((section) => section.items.length === 0);

  return (
    <SafeAreaView style={taskStyles.safe} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[taskStyles.content, styles.content]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={sync.refreshing} onRefresh={sync.reload} tintColor={c.link} colors={[c.link]} />}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Tâches</Text>
          <View style={styles.titleActions}>
            <Pressable
              style={({ pressed }) => [styles.squareButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`Affichage : ${TASK_VIEWS.find((entry) => entry.key === view)?.label}`}
              onPress={() => setViewSheet(true)}>
              <Icon name={TASK_VIEWS.find((entry) => entry.key === view)?.icon ?? 'view_list'} size={22} color={c.text} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.squareButton, searching && styles.squareButtonOn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={searching ? 'Fermer la recherche' : 'Rechercher une tâche'}
              onPress={() => {
                setSearching((value) => !value);
                setQuery('');
              }}>
              <Icon name={searching ? 'close' : 'search'} size={22} color={c.text} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.squareButton, styles.addButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Nouvelle tâche"
              onPress={() => router.push('/tasks/add')}>
              <Icon name="add" size={26} color={c.solidText} />
            </Pressable>
          </View>
        </View>

        {searching ? (
          <View style={styles.search}>
            <Icon name="search" size={20} color={c.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une tâche…"
              placeholderTextColor={c.muted}
              selectionColor={c.link}
              value={query}
              onChangeText={setQuery}
              autoFocus
              returnKeyType="search"
              accessibilityLabel="Rechercher une tâche"
            />
          </View>
        ) : null}

        <View style={styles.segments} accessibilityRole="tablist">
          {spacesOf(household?.name ?? null).map((entry) => {
            const selected = space === entry.key;
            return (
              <Pressable
                key={entry.key}
                style={[styles.segment, selected && styles.segmentOn]}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setSpace(entry.key)}>
                <Text style={[styles.segmentText, selected && styles.segmentTextOn]} numberOfLines={1}>
                  {entry.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <QueryView
          query={sync}
          empty={{
            icon: 'task_alt',
            title: 'Aucune tâche pour l’instant',
            text: 'Ajoutez votre première démarche : Bringo Mind vous rappellera l’échéance.',
            actionLabel: 'Nouvelle tâche',
            onAction: () => router.push('/tasks/add'),
          }}>
          {nothing ? (
            <View style={styles.empty}>
              <Icon name={query ? 'search_off' : 'task_alt'} size={32} color={c.link} />
              <Text style={styles.emptyTitle}>{query ? 'Aucune tâche ne correspond' : 'Rien à faire ici'}</Text>
              <Text style={styles.emptyText}>
                {query ? 'Essayez un autre mot.' : 'Touchez « + » pour ajouter une tâche.'}
              </Text>
            </View>
          ) : (
            sections.map((section) => {
              // « Terminées » : les 7 derniers jours, puis « Voir tout ».
              const recent =
                section.status === 'done' && !allDone
                  ? section.items.filter((task) => dayOffset(task.completedAt ?? task.dueAt) >= -7)
                  : section.items;
              const hidden = section.items.length - recent.length;
              return (
              <Section
                key={section.status}
                status={section.status}
                items={recent}
                total={section.items.length}
                hidden={hidden}
                onShowAll={() => setAllDone(true)}
                view={view}
                collapsed={collapsed[section.status]}
                onToggle={() => setCollapsed((value) => ({ ...value, [section.status]: !value[section.status] }))}
                onCheck={(task) => (task.status === 'done' ? reopen(task) : complete(task))}
                onPostpone={postpone}
                onMenu={setMenuTask}
              />
              );
            })
          )}
        </QueryView>
      </ScrollView>

      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={84} />
      ) : null}

      <BottomSheet visible={viewSheet} title="Affichage" subtitle="Choisissez comment voir vos tâches." onClose={() => setViewSheet(false)}>
        {TASK_VIEWS.map((entry) => (
          <SheetOption
            key={entry.key}
            icon={view === entry.key ? 'check_circle' : entry.icon}
            label={entry.label}
            hint={entry.hint}
            onPress={() => {
              setTaskView(entry.key);
              setViewSheet(false);
            }}
          />
        ))}
      </BottomSheet>

      <BottomSheet visible={menuTask !== null} title={menuTask?.title ?? ''} onClose={() => setMenuTask(null)}>
        {menuTask ? (
          <>
            {menuTask.status === 'open' ? (
              <SheetOption
                icon="schedule"
                label="Reporter d’un jour"
                onPress={() => {
                  setMenuTask(null);
                  postpone(menuTask);
                }}
              />
            ) : null}
            <SheetOption
              icon="edit"
              label="Modifier"
              onPress={() => {
                setMenuTask(null);
                router.push({ pathname: '/tasks/edit', params: { id: menuTask.id } });
              }}
            />
            <SheetOption
              icon="inventory_2"
              label="Archiver"
              danger
              onPress={() => {
                setMenuTask(null);
                archive(menuTask);
              }}
            />
          </>
        ) : null}
      </BottomSheet>
    </SafeAreaView>
  );
}

/** Couleurs d'un groupe : bandeau, pictogramme, compteur. */
function useStatusTone(status: Status) {
  const { c } = useLook();
  if (status === 'done') {
    return {
      band: c.dark ? '#163328' : '#DFF5E6',
      icon: c.dark ? '#4ADE80' : '#16A34A',
      pill: c.dark ? '#1F4A35' : '#C8EED5',
      pillText: c.dark ? '#4ADE80' : '#15803D',
    };
  }
  return {
    band: c.dark ? '#1B2A4D' : '#E6EEFB',
    icon: status === 'doing' ? (c.dark ? '#6FA8FF' : '#1D6FE0') : c.text,
    pill: c.dark ? '#24396A' : '#D5E3FA',
    pillText: c.dark ? '#8DBBFF' : '#1D5ED0',
  };
}

function Section({
  status,
  items,
  total,
  hidden,
  onShowAll,
  view,
  collapsed,
  onToggle,
  onCheck,
  onPostpone,
  onMenu,
}: {
  status: Status;
  items: Task[];
  total: number;
  hidden: number;
  onShowAll: () => void;
  view: TaskView;
  collapsed: boolean;
  onToggle: () => void;
  onCheck: (task: Task) => void;
  onPostpone: (task: Task) => void;
  onMenu: (task: Task) => void;
}) {
  const { styles } = useLook();
  const tone = useStatusTone(status);
  return (
    <View style={styles.section}>
      <Pressable
        style={[styles.band, { backgroundColor: tone.band }]}
        accessibilityRole="button"
        accessibilityState={{ expanded: !collapsed }}
        accessibilityLabel={`${STATUS_LABELS[status]}, ${total} tâche${total > 1 ? 's' : ''}`}
        onPress={onToggle}>
        {status === 'todo' ? (
          <View style={[styles.bandDot, { backgroundColor: tone.icon }]} />
        ) : (
          <Icon name={status === 'doing' ? 'schedule' : 'check_circle'} size={22} color={tone.icon} filled />
        )}
        <Text style={styles.bandTitle}>{STATUS_LABELS[status]}</Text>
        <View style={[styles.bandPill, { backgroundColor: tone.pill }]}>
          <Text style={[styles.bandPillText, { color: tone.pillText }]}>{total}</Text>
        </View>
        <Icon name={collapsed ? 'expand_more' : 'chevron_right'} size={22} color={tone.pillText} />
      </Pressable>

      {!collapsed && items.length > 0 && view === 'cards' ? (
        <View style={styles.cardsStack}>
          {items.map((task) => (
            <TaskCard key={task.id} task={task} status={status} onCheck={() => onCheck(task)} onPostpone={() => onPostpone(task)} onMenu={() => onMenu(task)} />
          ))}
        </View>
      ) : null}

      {!collapsed && items.length > 0 && view === 'grid' ? (
        <View style={styles.grid}>
          {items.map((task) => (
            <TaskTile key={task.id} task={task} status={status} onCheck={() => onCheck(task)} onMenu={() => onMenu(task)} />
          ))}
        </View>
      ) : null}

      {!collapsed && items.length > 0 && view === 'list' ? (
        <View style={styles.card}>
          {items.map((task, index) => (
            <TaskRow
              key={task.id}
              task={task}
              status={status}
              first={index === 0}
              onCheck={() => onCheck(task)}
              onPostpone={() => onPostpone(task)}
              onMenu={() => onMenu(task)}
            />
          ))}
        </View>
      ) : null}
      {!collapsed && hidden > 0 ? (
        <Pressable style={styles.showAll} accessibilityRole="button" onPress={onShowAll}>
          <Text style={styles.showAllText}>Voir tout ({hidden} de plus)</Text>
          <Icon name="expand_more" size={20} color={tone.pillText} />
        </Pressable>
      ) : null}
    </View>
  );
}

function TaskRow({
  task,
  status,
  first,
  onCheck,
  onPostpone,
  onMenu,
}: {
  task: Task;
  status: Status;
  first: boolean;
  onCheck: () => void;
  onPostpone: () => void;
  onMenu: () => void;
}) {
  const { c, styles } = useLook();
  const tone = useStatusTone(status);
  const late = task.status === 'open' && task.hasDue && dayOffset(task.dueAt) < 0;
  const done = status === 'done';

  const row = (
    <Pressable
      style={({ pressed }) => [styles.row, !first && styles.rowDivider, pressed && styles.rowPressed]}
      // Sur le web, un rôle « button » produirait un <button> contenant d'autres boutons.
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      accessibilityLabel={`${task.title}, ${dueText(task)}`}
      onPress={() => router.push({ pathname: '/tasks/detail', params: { id: task.id } })}>
      <Pressable
        hitSlop={10}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        accessibilityLabel={done ? `Rouvrir ${task.title}` : `Terminer ${task.title}`}
        onPress={onCheck}>
        {status === 'todo' ? (
          <View style={[styles.check, task.suggested && styles.checkSuggested]} />
        ) : (
          <View style={[styles.check, styles.checkFilled, { backgroundColor: tone.icon, borderColor: tone.icon }]}>
            <Icon name="check" size={15} color={c.dark ? '#0A1326' : '#FFFFFF'} />
          </View>
        )}
      </Pressable>

      <View style={styles.rowMain}>
        <Text style={[styles.rowTitle, done && styles.rowTitleDone]} numberOfLines={2}>
          {task.title}
        </Text>
        {task.priority === 4 && !done ? <Pill label="Urgent" tone="red" /> : null}
        {task.priority === 3 && !done ? <Pill label="Haute" tone="orange" /> : null}
        {task.suggested && !done ? <Pill label="À vérifier" tone="orange" /> : null}
      </View>

      <View style={styles.due}>
        <Icon name="calendar_month" size={16} color={late ? c.error : c.muted} />
        <Text style={[styles.dueText, late && { color: c.error }]} numberOfLines={1}>
          {dueText(task)}
        </Text>
      </View>

      <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel={`Actions pour ${task.title}`} onPress={onMenu}>
        <Icon name="more_vert" size={22} color={c.text} />
      </Pressable>
    </Pressable>
  );

  if (task.status !== 'open') return row;
  return (
    <SwipeRow onSwipeRight={onCheck} onSwipeLeft={onPostpone} rightLabel="Terminer" leftLabel="Reporter">
      {row}
    </SwipeRow>
  );
}

/** Case ronde selon l'état : vide (à faire), bleue cochée (en cours), verte cochée (terminée). */
function CheckMark({ task, status, onPress }: { task: Task; status: Status; onPress: () => void }) {
  const { c, styles } = useLook();
  const tone = useStatusTone(status);
  const done = status === 'done';
  return (
    <Pressable
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={done ? `Rouvrir ${task.title}` : `Terminer ${task.title}`}
      onPress={onPress}>
      {status === 'todo' ? (
        <View style={[styles.check, task.suggested && styles.checkSuggested]} />
      ) : (
        <View style={[styles.check, styles.checkFilled, { backgroundColor: tone.icon, borderColor: tone.icon }]}>
          <Icon name="check" size={15} color={c.dark ? '#0A1326' : '#FFFFFF'} />
        </View>
      )}
    </Pressable>
  );
}

function TaskPills({ task, done }: { task: Task; done: boolean }) {
  if (done) return null;
  return (
    <>
      {task.priority === 4 ? <Pill label="Urgent" tone="red" /> : null}
      {task.priority === 3 ? <Pill label="Haute" tone="orange" /> : null}
      {task.suggested ? <Pill label="À vérifier" tone="orange" /> : null}
    </>
  );
}

function DueLabel({ task }: { task: Task }) {
  const { c, styles } = useLook();
  const late = task.status === 'open' && task.hasDue && dayOffset(task.dueAt) < 0;
  return (
    <View style={styles.dueInline}>
      <Icon name="calendar_month" size={16} color={late ? c.error : c.muted} />
      <Text style={[styles.dueText, late && { color: c.error }]} numberOfLines={1}>
        {dueText(task)}
      </Text>
    </View>
  );
}

function Initials({ name }: { name: string }) {
  const { styles } = useLook();
  const initials = initialsOf(name);
  return (
    <View style={styles.initials} accessibilityLabel={`Confiée à ${name}`}>
      <Text style={styles.initialsText}>{initials}</Text>
    </View>
  );
}

/** Vue « Cartes » : une carte par tâche, avec catégorie et personne. */
function TaskCard({ task, status, onCheck, onPostpone, onMenu }: { task: Task; status: Status; onCheck: () => void; onPostpone: () => void; onMenu: () => void }) {
  const { c, styles } = useLook();
  const done = status === 'done';
  const card = (
    <Pressable
      style={({ pressed }) => [styles.taskCard, pressed && styles.rowPressed]}
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      accessibilityLabel={`${task.title}, ${dueText(task)}`}
      onPress={() => router.push({ pathname: '/tasks/detail', params: { id: task.id } })}>
      <CheckMark task={task} status={status} onPress={onCheck} />
      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, done && styles.rowTitleDone]} numberOfLines={2}>
          {task.title}
        </Text>
        <View style={styles.cardMeta}>
          <DueLabel task={task} />
          <View style={styles.dueInline}>
            <Icon name={categoryIcon(task.category)} size={16} color={c.muted} />
            <Text style={styles.dueText}>{categoryLabel(task.category)}</Text>
          </View>
        </View>
        <View style={styles.cardPills}>
          <TaskPills task={task} done={done} />
        </View>
      </View>
      <View style={styles.cardSide}>
        <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel={`Actions pour ${task.title}`} onPress={onMenu}>
          <Icon name="more_vert" size={22} color={c.text} />
        </Pressable>
        {task.assignee && !task.assignedToMe ? <Initials name={task.assignee} /> : null}
      </View>
    </Pressable>
  );
  if (task.status !== 'open') return card;
  return (
    <SwipeRow onSwipeRight={onCheck} onSwipeLeft={onPostpone} rightLabel="Terminer" leftLabel="Reporter">
      {card}
    </SwipeRow>
  );
}

/** Vue « Grille » : deux tuiles par ligne. */
function TaskTile({ task, status, onCheck, onMenu }: { task: Task; status: Status; onCheck: () => void; onMenu: () => void }) {
  const { c, styles } = useLook();
  const done = status === 'done';
  return (
    <Pressable
      style={({ pressed }) => [styles.tile, pressed && styles.rowPressed]}
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      accessibilityLabel={`${task.title}, ${dueText(task)}`}
      onPress={() => router.push({ pathname: '/tasks/detail', params: { id: task.id } })}>
      <View style={styles.tileTop}>
        <CheckMark task={task} status={status} onPress={onCheck} />
        <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel={`Actions pour ${task.title}`} onPress={onMenu}>
          <Icon name="more_vert" size={20} color={c.text} />
        </Pressable>
      </View>
      <Text style={[styles.tileTitle, done && styles.rowTitleDone]} numberOfLines={2}>
        {task.title}
      </Text>
      <DueLabel task={task} />
      <View style={styles.cardPills}>
        <TaskPills task={task} done={done} />
      </View>
    </Pressable>
  );
}

function Pill({ label, tone }: { label: string; tone: 'red' | 'orange' }) {
  const { c, styles } = useLook();
  const colors =
    tone === 'red'
      ? { bg: c.dark ? '#3B1D24' : '#FDE2E2', fg: c.dark ? '#FCA5A5' : '#B91C1C' }
      : { bg: c.dark ? '#3A2717' : '#FDEBD3', fg: c.dark ? '#FDBA74' : '#B45309' };
  return (
    <View style={[styles.pill, { backgroundColor: colors.bg }]}>
      <Text style={[styles.pillText, { color: colors.fg }]}>{label}</Text>
    </View>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    flex: { flex: 1 },
    pressed: { opacity: 0.75 },
    content: { paddingBottom: 120, paddingTop: 12, gap: 14 },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    pageTitle: { fontFamily: FontFamily.headingBold, fontSize: 28, lineHeight: 34, letterSpacing: -0.5, color: c.text },
    titleActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    squareButton: {
      width: 42,
      height: 42,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    squareButtonOn: { borderColor: c.link },
    addButton: { borderColor: c.solid, backgroundColor: c.solid },
    search: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minHeight: 48,
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontFamily: FontFamily.body,
      fontSize: 16,
      lineHeight: 22,
      color: c.text,
      outlineWidth: 0,
      outlineStyle: 'solid',
    },
    segments: {
      flexDirection: 'row',
      padding: 4,
      borderRadius: 14,
      backgroundColor: c.dark ? '#13213D' : '#E8EEF3',
    },
    segment: { flex: 1, minHeight: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
    segmentOn: {
      backgroundColor: c.dark ? '#22365C' : '#FFFFFF',
      shadowColor: '#0C1A37',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: c.dark ? 0 : 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    segmentText: { fontFamily: FontFamily.bodyMedium, fontSize: 14, lineHeight: 19, color: c.muted },
    segmentTextOn: { fontFamily: FontFamily.bodySemiBold, color: c.text },
    section: { gap: 8 },
    band: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minHeight: 44,
      paddingHorizontal: 14,
      borderRadius: 14,
    },
    bandDot: { width: 12, height: 12, borderRadius: 6, marginHorizontal: 5 },
    bandTitle: { flex: 1, fontFamily: FontFamily.headingBold, fontSize: 17, lineHeight: 22, color: c.text },
    bandPill: { minWidth: 30, height: 24, paddingHorizontal: 9, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
    bandPillText: { fontFamily: FontFamily.bodyBold, fontSize: 13, lineHeight: 17 },
    card: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      overflow: 'hidden',
      shadowColor: '#0C1A37',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 10,
      elevation: 1,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minHeight: 48,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: c.card,
    },
    rowDivider: { borderTopWidth: 1, borderTopColor: c.border },
    rowPressed: { backgroundColor: c.soft },
    check: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: c.dark ? '#5B6B8C' : '#B5C0CE',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkSuggested: { borderStyle: 'dashed', borderColor: c.dark ? '#FDBA74' : '#D97706' },
    checkFilled: { borderWidth: 0 },
    rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 0 },
    rowTitle: { flexShrink: 1, fontFamily: FontFamily.bodySemiBold, fontSize: 14, lineHeight: 19, color: c.text },
    rowTitleDone: { color: c.muted, textDecorationLine: 'line-through' },
    pill: { paddingHorizontal: 7, paddingVertical: 1, borderRadius: Radius.full },
    pillText: { fontFamily: FontFamily.bodySemiBold, fontSize: 13, lineHeight: 17 },
    due: { flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: 110 },
    dueText: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 17, color: c.muted },
    empty: { alignItems: 'center', gap: 8, paddingVertical: 40 },
    cardsStack: { gap: 8 },
    showAll: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 40 },
    showAllText: { fontFamily: FontFamily.bodySemiBold, fontSize: 14, lineHeight: 19, color: c.link },
    taskCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      shadowColor: '#0C1A37',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 10,
      elevation: 1,
    },
    cardBody: { flex: 1, gap: 6 },
    cardTitle: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, lineHeight: 20, color: c.text },
    cardMeta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 12, rowGap: 4 },
    cardPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    cardSide: { alignItems: 'center', gap: 10 },
    dueInline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    initials: {
      width: 30,
      height: 30,
      borderRadius: Radius.full,
      backgroundColor: c.dark ? '#14532D' : '#22C55E',
      alignItems: 'center',
      justifyContent: 'center',
    },
    initialsText: { fontFamily: FontFamily.bodyBold, fontSize: 12, lineHeight: 15, color: '#FFFFFF' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tile: {
      width: '48.8%',
      flexGrow: 1,
      gap: 8,
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      shadowColor: '#0C1A37',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 10,
      elevation: 1,
    },
    tileTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    tileTitle: { minHeight: 38, fontFamily: FontFamily.bodySemiBold, fontSize: 14, lineHeight: 19, color: c.text },
    emptyTitle: { fontFamily: FontFamily.headingBold, fontSize: 17, lineHeight: 23, color: c.text },
    emptyText: { fontFamily: FontFamily.body, fontSize: 14, lineHeight: 20, color: c.muted, textAlign: 'center' },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre dans le module Tâches, converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
