// S-08 - Liste des tâches | Module M04 Tâches | Phase S4
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';

import {
  BottomSheet,
  CheckCircle,
  Chip,
  PrimaryButton,
  PriorityBadge,
  SecondaryButton,
  SwipeRow,
  Tag,
  UndoToast,
  taskStyles,
} from '../components/task-ui';
import {
  CATEGORIES,
  CATEGORY_ICONS,
  GROUP_LABELS,
  PRIORITY_LABELS,
  formatDay,
  formatDue,
  groupOf,
  lateDays,
} from '../data';
import { taskActions, useFlash, useTasks } from '../store';
import type { Task, TaskCategory, TaskGroup, TaskPriority } from '../types';

type FilterKey = 'all' | 'late' | 'today' | 'upcoming' | 'shared' | 'done' | 'archived';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'late', label: 'En retard' },
  { key: 'today', label: 'Aujourd’hui' },
  { key: 'upcoming', label: 'À venir' },
  { key: 'shared', label: 'Partagées' },
  { key: 'done', label: 'Terminées' },
  { key: 'archived', label: 'Archivées' },
];

/** Ordre d'affichage des sections dans la vue « Toutes ». */
const SECTION_ORDER: TaskGroup[] = ['late', 'today', 'upcoming', 'done'];

const PRIORITIES: TaskPriority[] = [4, 3, 2, 1];

type Toast = { text: string; undo?: () => void };

export default function TaskListScreen() {
  const tasks = useTasks();
  const flash = useFlash();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [priorities, setPriorities] = useState<TaskPriority[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Message laissé par un autre écran (tâche créée, supprimée…).
  useFocusEffect(
    useCallback(() => {
      if (flash) {
        setToast(flash);
        taskActions.setFlash(null);
      }
    }, [flash]),
  );

  const counts = useMemo(() => {
    const result: Record<FilterKey, number> = {
      all: 0,
      late: 0,
      today: 0,
      upcoming: 0,
      shared: 0,
      done: 0,
      archived: 0,
    };
    for (const task of tasks) {
      const group = groupOf(task);
      result[group] += 1;
      if (group !== 'archived') result.all += 1;
      if (task.household && task.status === 'open') result.shared += 1;
    }
    return result;
  }, [tasks]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return tasks.filter((task) => {
      const group = groupOf(task);
      const inFilter =
        filter === 'all'
          ? group !== 'archived'
          : filter === 'shared'
            ? task.household !== null && task.status === 'open'
            : group === filter;
      const inQuery =
        !term ||
        task.title.toLowerCase().includes(term) ||
        task.category.toLowerCase().includes(term) ||
        task.context.toLowerCase().includes(term);
      const inPriority = priorities.length === 0 || priorities.includes(task.priority);
      const inCategory = categories.length === 0 || categories.includes(task.category);
      return inFilter && inQuery && inPriority && inCategory;
    });
  }, [tasks, filter, query, priorities, categories]);

  const sections = useMemo(() => {
    const order: TaskGroup[] =
      filter === 'archived' ? ['archived'] : filter === 'shared' ? ['late', 'today', 'upcoming'] : SECTION_ORDER;
    return order
      .map((group) => ({
        group,
        items: visible
          .filter((task) => groupOf(task) === group)
          .sort((a, b) =>
            group === 'done'
              ? (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0)
              : a.dueAt.getTime() - b.dueAt.getTime(),
          ),
      }))
      .filter((section) => section.items.length > 0);
  }, [visible, filter]);

  const advancedCount = priorities.length + categories.length;
  const activeCount = counts.late + counts.today + counts.upcoming;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

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
  const restore = (task: Task) => {
    taskActions.restore(task.id);
    setToast({ text: 'Tâche restaurée.', undo: () => taskActions.archive(task.id) });
  };

  const resetFilters = () => {
    setFilter('all');
    setQuery('');
    setPriorities([]);
    setCategories([]);
  };

  return (
    <SafeAreaView style={taskStyles.safe} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[taskStyles.content, styles.content]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Tint.primary}
            colors={[Tint.primary]}
          />
        }>
        <View style={styles.titleRow}>
          <View style={styles.flex}>
            <Text style={styles.eyebrow}>Mon espace</Text>
            <Text style={styles.pageTitle}>Tâches</Text>
          </View>
          <Tag label={`${activeCount} actives`} />
        </View>

        <View style={styles.searchRow}>
          <View style={[styles.search, searchFocused && taskStyles.inputFocused]}>
            <Icon
              name="search"
              size={22}
              color={searchFocused ? Tint.primary : Serene.onSurfaceVariant}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une tâche…"
              placeholderTextColor={Serene.onSurfaceVariant}
              selectionColor={Tint.primary}
              value={query}
              onChangeText={setQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              returnKeyType="search"
              accessibilityLabel="Rechercher une tâche"
            />
            {query ? (
              <Pressable
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Effacer la recherche"
                onPress={() => setQuery('')}>
                <Icon name="cancel" size={20} color={Serene.onSurfaceVariant} filled />
              </Pressable>
            ) : null}
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.filterButton,
              advancedCount > 0 && styles.filterButtonActive,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Filtres avancés${advancedCount ? `, ${advancedCount} actifs` : ''}`}
            onPress={() => setSheetOpen(true)}>
            <Icon name="tune" size={22} color={advancedCount > 0 ? Serene.onPrimary : Tint.navy} />
            {advancedCount > 0 ? (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{advancedCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsRow}>
          {FILTERS.map((entry) => (
            <Chip
              key={entry.key}
              label={entry.label}
              selected={filter === entry.key}
              count={entry.key === 'all' ? undefined : counts[entry.key] || undefined}
              onPress={() => setFilter(entry.key)}
            />
          ))}
        </ScrollView>

        {showHint && filter === 'all' ? (
          <View style={styles.hint}>
            <Icon name="swipe" size={22} color={Tint.primary} />
            <Text style={styles.hintText}>
              Glissez une tâche vers la droite pour la terminer, vers la gauche pour la reporter.
            </Text>
            <Pressable
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Masquer l’astuce"
              onPress={() => setShowHint(false)}>
              <Icon name="close" size={20} color={Serene.onSurfaceVariant} />
            </Pressable>
          </View>
        ) : null}

        {sections.length === 0 ? (
          <View style={[taskStyles.card, styles.empty]}>
            <View style={styles.emptyIcon}>
              <Icon
                name={filter === 'done' ? 'task_alt' : filter === 'archived' ? 'inventory_2' : 'search_off'}
                size={30}
                color={Tint.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {query || advancedCount
                ? 'Aucune tâche ne correspond'
                : filter === 'late'
                  ? 'Aucune tâche en retard'
                  : filter === 'archived'
                    ? 'Aucune tâche archivée'
                    : 'Rien à faire ici'}
            </Text>
            <Text style={styles.emptyText}>
              {query || advancedCount
                ? 'Essayez un autre mot-clé ou retirez des filtres.'
                : 'Profitez-en, ou ajoutez une nouvelle tâche.'}
            </Text>
            {query || advancedCount || filter !== 'all' ? (
              <SecondaryButton label="Réinitialiser les filtres" icon="restart_alt" onPress={resetFilters} />
            ) : null}
          </View>
        ) : (
          sections.map((section) => (
            <View key={section.group} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[taskStyles.sectionTitle, section.group === 'late' && styles.lateTitle]}>
                  {GROUP_LABELS[section.group]}
                </Text>
                <View style={[styles.countPill, section.group === 'late' && styles.countPillLate]}>
                  <Text
                    style={[styles.countText, section.group === 'late' && styles.countTextLate]}>
                    {section.items.length}
                  </Text>
                </View>
              </View>
              <View style={styles.stack}>
                {section.items.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={() => (task.status === 'open' ? complete(task) : reopen(task))}
                    onPostpone={() => postpone(task)}
                    onRestore={() => restore(task)}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.fabWrap} pointerEvents="box-none">
        <PrimaryButton
          label="Nouvelle tâche"
          icon="add"
          onPress={() => router.push('/tasks/add')}
          style={styles.fab}
        />
      </View>

      {toast ? (
        <UndoToast
          key={toast.text}
          text={toast.text}
          onUndo={toast.undo}
          onHide={() => setToast(null)}
          bottom={84}
        />
      ) : null}

      <BottomSheet
        visible={sheetOpen}
        title="Filtres avancés"
        subtitle="Affinez la liste par priorité et par catégorie."
        onClose={() => setSheetOpen(false)}>
        <Text style={taskStyles.label}>Priorité</Text>
        <View style={styles.wrap}>
          {PRIORITIES.map((priority) => (
            <Chip
              key={priority}
              label={PRIORITY_LABELS[priority]}
              selected={priorities.includes(priority)}
              onPress={() =>
                setPriorities((list) =>
                  list.includes(priority) ? list.filter((p) => p !== priority) : [...list, priority],
                )
              }
            />
          ))}
        </View>
        <Text style={[taskStyles.label, styles.sheetLabel]}>Catégorie</Text>
        <View style={styles.wrap}>
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={category}
              icon={CATEGORY_ICONS[category]}
              selected={categories.includes(category)}
              onPress={() =>
                setCategories((list) =>
                  list.includes(category) ? list.filter((c) => c !== category) : [...list, category],
                )
              }
            />
          ))}
        </View>
        <View style={styles.sheetActions}>
          <SecondaryButton
            label="Réinitialiser"
            style={styles.flex}
            onPress={() => {
              setPriorities([]);
              setCategories([]);
            }}
          />
          <PrimaryButton
            label={`Voir ${visible.length} tâche${visible.length > 1 ? 's' : ''}`}
            style={styles.sheetPrimary}
            onPress={() => setSheetOpen(false)}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

function TaskRow({
  task,
  onToggle,
  onPostpone,
  onRestore,
}: {
  task: Task;
  onToggle: () => void;
  onPostpone: () => void;
  onRestore: () => void;
}) {
  const done = task.status === 'done';
  const archived = task.status === 'archived';
  const late = lateDays(task);
  const doneSubtasks = task.subtasks.filter((sub) => sub.done).length;

  const dueLabel = done
    ? `Terminée le ${formatDay(task.completedAt ?? task.dueAt)}`
    : archived
      ? 'Archivée'
      : late > 0
        ? `En retard • ${formatDue(task)}`
        : formatDue(task);

  const card = (
    <Pressable
      style={({ pressed }) => [taskStyles.card, styles.row, pressed && taskStyles.cardPressed]}
      // Sur le web, un rôle « button » produirait un <button> contenant la case à cocher.
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      accessibilityLabel={`${task.title}, ${dueLabel}`}
      onPress={() => router.push({ pathname: '/tasks/detail', params: { id: task.id } })}>
      {archived ? (
        <View style={styles.archivedIcon}>
          <Icon name="inventory_2" size={18} color={Serene.onSurfaceVariant} />
        </View>
      ) : (
        <CheckCircle
          checked={done}
          onPress={onToggle}
          label={done ? `Rouvrir ${task.title}` : `Terminer ${task.title}`}
        />
      )}
      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <PriorityBadge priority={task.priority} />
          <Text
            style={[styles.due, late > 0 && styles.dueLate, done && styles.dueDone]}
            numberOfLines={1}>
            {dueLabel}
          </Text>
        </View>
        <Text style={[taskStyles.title, done && styles.titleDone]} numberOfLines={2}>
          {task.title}
        </Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Icon name={CATEGORY_ICONS[task.category]} size={16} color={Serene.onSurfaceVariant} />
            <Text style={styles.metaText}>{task.category}</Text>
          </View>
          {task.household ? (
            <View style={styles.metaItem}>
              <Icon name="group" size={16} color={Tint.primary} />
              <Text style={[styles.metaText, styles.metaShared]}>Partagée</Text>
            </View>
          ) : null}
          {task.subtasks.length > 0 ? (
            <View style={styles.metaItem}>
              <Icon name="checklist" size={16} color={Serene.onSurfaceVariant} />
              <Text style={styles.metaText}>
                {doneSubtasks}/{task.subtasks.length}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      {archived ? (
        <Pressable
          style={({ pressed }) => [styles.restore, pressed && styles.pressed]}
          accessibilityRole="button"
          onPress={onRestore}>
          <Icon name="unarchive" size={18} color={Tint.primary} />
          <Text style={taskStyles.link}>Restaurer</Text>
        </Pressable>
      ) : (
        <Icon name="chevron_right" size={22} color={Serene.onSurfaceVariant} />
      )}
    </Pressable>
  );

  if (task.status !== 'open') return card;

  return (
    <SwipeRow
      onSwipeRight={onToggle}
      onSwipeLeft={onPostpone}
      rightLabel="Terminer"
      leftLabel="Reporter">
      {card}
    </SwipeRow>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    paddingBottom: 120,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    paddingTop: 16,
  },
  eyebrow: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Tint.primary,
  },
  pageTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
    color: Tint.navy,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Space.md,
  },
  search: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    outlineWidth: 0,
    fontFamily: FontFamily.body,
    fontSize: 16,
    color: Tint.navy,
    paddingVertical: 0,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: Tint.black,
    borderColor: Tint.black,
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSecondaryFixed,
  },
  chipsScroll: {
    marginTop: 14,
    marginHorizontal: -Space.gutter,
  },
  chipsRow: {
    gap: 8,
    paddingHorizontal: Space.gutter,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#99f6e4',
    backgroundColor: '#f0fdfa',
  },
  hintText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Tint.navy,
  },
  section: {
    marginTop: 26,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  lateTitle: {
    color: '#b91c1c',
  },
  countPill: {
    minWidth: 26,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    backgroundColor: Tint.soft,
    borderWidth: 1,
    borderColor: Tint.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countPillLate: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
  },
  countText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    color: Tint.navy,
  },
  countTextLate: {
    color: '#b91c1c',
  },
  stack: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  due: {
    flexShrink: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  dueLate: {
    color: '#b91c1c',
  },
  dueDone: {
    color: Serene.success,
  },
  titleDone: {
    color: Serene.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  metaShared: {
    fontFamily: FontFamily.bodySemiBold,
    color: Tint.primary,
  },
  archivedIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: Tint.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  empty: {
    marginTop: 26,
    alignItems: 'center',
    gap: 10,
    paddingVertical: 28,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
    color: Tint.navy,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 21,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 6,
  },
  fabWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    paddingHorizontal: Space.gutter,
    alignItems: 'center',
  },
  fab: {
    width: '100%',
    maxWidth: 528,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sheetLabel: {
    marginTop: 8,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  sheetPrimary: {
    flex: 1.4,
  },
});
