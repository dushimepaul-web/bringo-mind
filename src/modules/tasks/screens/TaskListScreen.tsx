// S-08 - Liste des tâches | Module M04 Tâches | Phase S4
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

type Group = 'late' | 'today' | 'upcoming' | 'done';
type Priority = 'Haute' | 'Moyenne' | 'Basse';

type Task = {
  id: string;
  title: string;
  group: Group;
  priority: Priority;
  due: string;
  category: string;
  shared?: boolean;
};

const FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'late', label: 'En retard' },
  { key: 'today', label: "Aujourd'hui" },
  { key: 'upcoming', label: 'À venir' },
  { key: 'done', label: 'Terminées' },
] as const;

const GROUP_LABELS: Record<Group, string> = {
  late: 'En retard',
  today: "Aujourd'hui",
  upcoming: 'À venir',
  done: 'Terminées',
};

const GROUP_ORDER: Group[] = ['late', 'today', 'upcoming', 'done'];

const TASKS: Task[] = [
  {
    id: 'attestation',
    title: 'Renvoyer attestation de domicile signée',
    group: 'late',
    priority: 'Haute',
    due: "Aujourd'hui 17h",
    category: 'Logement',
  },
  {
    id: 'controle-technique',
    title: 'Contrôle technique Peugeot 208',
    group: 'today',
    priority: 'Moyenne',
    due: 'Demain • 09h00',
    category: 'Véhicule',
  },
  {
    id: 'remboursement-dentaire',
    title: 'Suivre le remboursement soins dentaires',
    group: 'today',
    priority: 'Basse',
    due: '17 mai',
    category: 'Santé',
    shared: true,
  },
  {
    id: 'ophtalmo',
    title: 'Contrôle ophtalmologique',
    group: 'upcoming',
    priority: 'Moyenne',
    due: 'Jeudi 16 mai • 14h30',
    category: 'Santé',
  },
  {
    id: 'impots',
    title: 'Finaliser la déclaration de revenus 2023',
    group: 'upcoming',
    priority: 'Haute',
    due: '27 mai',
    category: 'Impôts',
  },
  {
    id: 'inscription-leo',
    title: 'Renouvellement inscription scolaire de Léo',
    group: 'upcoming',
    priority: 'Moyenne',
    due: '25 mai',
    category: 'Famille',
    shared: true,
  },
  {
    id: 'cantine',
    title: 'Règlement cantine scolaire 2ème trimestre',
    group: 'done',
    priority: 'Basse',
    due: 'Clôturé le 12 mai',
    category: 'Famille',
  },
  {
    id: 'dentiste',
    title: 'Prendre rendez-vous chez le dentiste pour Léo',
    group: 'done',
    priority: 'Moyenne',
    due: 'Clôturé le 10 mai',
    category: 'Santé',
  },
];

export default function TaskListScreen() {
  const [selectedFilter, setSelectedFilter] =
    useState<(typeof FILTERS)[number]['key']>('all');
  const [query, setQuery] = useState('');

  const visibleTasks = useMemo(() => {
    const term = query.trim().toLowerCase();

    return TASKS.filter((task) => {
      const matchesFilter = selectedFilter === 'all' || task.group === selectedFilter;
      const matchesQuery =
        !term ||
        task.title.toLowerCase().includes(term) ||
        task.category.toLowerCase().includes(term);

      return matchesFilter && matchesQuery;
    });
  }, [selectedFilter, query]);

  const activeCount = TASKS.filter((task) => task.group !== 'done').length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.titleRow}>
          <View style={styles.titleTextBlock}>
            <Text style={styles.eyebrow}>Mon espace</Text>
            <Text style={styles.title}>Tâches</Text>
          </View>
          <View style={styles.activePill}>
            <Text style={styles.activePillText}>{activeCount} actives</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Icon name="search" size={18} color={Serene.onSurfaceVariant} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une tâche..."
              placeholderTextColor={Serene.onSurfaceVariant}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              selectionColor={Serene.secondary}
            />
          </View>
          <Pressable style={styles.filterButton} accessibilityLabel="Filtres avancés">
            <Icon name="tune" size={20} color={Serene.onSurfaceVariant} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersRow}>
          {FILTERS.map((filter) => {
            const active = filter.key === selectedFilter;

            return (
              <Pressable
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                style={[styles.filterChip, active && styles.filterChipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}>
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {GROUP_ORDER.map((group) => {
          const groupTasks = visibleTasks.filter((task) => task.group === group);
          if (groupTasks.length === 0) return null;

          return (
            <View key={group} style={styles.group}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{GROUP_LABELS[group]}</Text>
                <View style={styles.groupCount}>
                  <Text style={styles.groupCountText}>{groupTasks.length}</Text>
                </View>
              </View>

              <View style={styles.groupList}>
                {groupTasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </View>
            </View>
          );
        })}

        {visibleTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Icon name="task_alt" size={28} color={Serene.secondary} />
            </View>
            <Text style={styles.emptyTitle}>Aucune tâche trouvée</Text>
            <Text style={styles.emptyText}>
              Modifiez vos filtres ou créez une nouvelle tâche.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.addButton}
          accessibilityRole="button"
          onPress={() => router.push('/tasks/add')}>
          <Icon name="add" size={22} color={Serene.secondaryFixed} />
          <Text style={styles.addButtonText}>Nouvelle tâche</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function TaskRow({ task }: { task: Task }) {
  const [checked, setChecked] = useState(task.group === 'done');

  const priorityStyle =
    task.priority === 'Haute'
      ? styles.priorityHigh
      : task.priority === 'Moyenne'
        ? styles.priorityMedium
        : styles.priorityLow;

  const priorityTextStyle =
    task.priority === 'Haute'
      ? styles.priorityTextHigh
      : task.priority === 'Moyenne'
        ? styles.priorityTextMedium
        : styles.priorityTextLow;

  return (
    <Pressable
      style={styles.taskCard}
      onPress={() => router.push('/tasks/detail')}
      accessibilityRole="button">
      <Pressable
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        onPress={() => setChecked((value) => !value)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        hitSlop={8}>
        {checked ? <Icon name="check" size={13} color={Serene.onPrimary} /> : null}
      </Pressable>

      <View style={styles.taskBody}>
        <View style={styles.taskTopRow}>
          <View style={[styles.priorityPill, priorityStyle]}>
            <Text style={[styles.priorityText, priorityTextStyle]}>{task.priority}</Text>
          </View>
          <Text style={styles.taskDue} numberOfLines={1}>
            {task.due}
          </Text>
        </View>

        <Text
          style={[styles.taskTitle, checked && styles.taskTitleChecked]}
          numberOfLines={2}>
          {task.title}
        </Text>

        <View style={styles.taskMetaRow}>
          <View style={styles.taskMetaItem}>
            <Icon name="folder" size={14} color={Serene.onSurfaceVariant} />
            <Text style={styles.taskMetaText}>{task.category}</Text>
          </View>
          {task.shared ? (
            <View style={styles.taskMetaItem}>
              <Icon name="group" size={14} color={Serene.onSurfaceVariant} />
              <Text style={styles.taskMetaText}>Partagée</Text>
            </View>
          ) : null}
        </View>
      </View>

      <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Serene.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.sm,
    paddingBottom: Space.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleTextBlock: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.secondary,
  },
  title: {
    ...Typography.headlineMd,
    color: Serene.onSurface,
  },
  activePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  activePillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Space.md,
  },
  searchBox: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontFamily: FontFamily.body,
    fontSize: 14,
    color: Serene.onSurface,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersScroll: {
    marginTop: 12,
    marginHorizontal: -Space.gutter,
  },
  filtersRow: {
    paddingHorizontal: Space.gutter,
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  filterChipActive: {
    backgroundColor: Serene.primary,
  },
  filterChipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  filterChipTextActive: {
    color: Serene.onPrimary,
  },
  group: {
    marginTop: Space.md,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Space.sm,
  },
  groupTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
  },
  groupCount: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupCountText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  groupList: {
    gap: 10,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Serene.outlineVariant,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxChecked: {
    borderWidth: 0,
    backgroundColor: Serene.secondary,
  },
  taskBody: {
    flex: 1,
    minWidth: 0,
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  priorityHigh: {
    backgroundColor: Serene.errorContainer,
  },
  priorityMedium: {
    backgroundColor: Serene.secondaryContainer,
  },
  priorityLow: {
    backgroundColor: Serene.surfaceContainerHigh,
  },
  priorityText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
  },
  priorityTextHigh: {
    color: Serene.onErrorContainer,
  },
  priorityTextMedium: {
    color: Serene.onSecondaryContainer,
  },
  priorityTextLow: {
    color: Serene.onSurfaceVariant,
  },
  taskDue: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
    flexShrink: 1,
    textAlign: 'right',
  },
  taskTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onSurface,
  },
  taskTitleChecked: {
    color: Serene.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  taskMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskMetaText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Space.xl,
    gap: 6,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Space.gutter,
    paddingVertical: 10,
    backgroundColor: Serene.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Serene.surfaceContainerHigh,
  },
  addButton: {
    height: 48,
    borderRadius: Radius.xl,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.floating,
  },
  addButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
});
