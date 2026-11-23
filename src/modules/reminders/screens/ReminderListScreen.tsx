// S-10 - Rappels | Module M05 Rappels | Phase S5
// Dans l'esprit de l'application Réveil du téléphone : l'heure en grand, le titre et la répétition dessous,
// l'interrupteur à droite. Rappels classés Aujourd'hui / Demain / Plus tard / En pause / Passés.
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { TURQUOISE } from '@/components/rings';
import { BottomSheet, SheetOption, UndoToast, useKitStyles } from '@/components/ui/kit';
import { QueryView } from '@/components/ui/states';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { useQuery } from '@/hooks/use-query';
import { dayOffset, formatDay, formatTime } from '@/lib/demo-dates';

import { CHANNEL_META, linkHref, linkIcon, linkLabel, repeatSummary } from '../data';
import { reminderActions, syncReminders, useReminderState } from '../store';
import type { Reminder } from '../types';
import { REMINDER_VIEWS, setReminderView, useReminderView, type ReminderView } from '../view-mode';

type Group = 'today' | 'tomorrow' | 'later' | 'paused' | 'past';

const GROUP_LABELS: Record<Group, string> = {
  today: 'Aujourd’hui',
  tomorrow: 'Demain',
  later: 'Plus tard',
  paused: 'Désactivés',
  past: 'Passés',
};

const GROUP_ICONS: Record<Group, string> = {
  today: 'today',
  tomorrow: 'event',
  later: 'date_range',
  paused: 'pause_circle',
  past: 'history',
};

function groupOf(reminder: Reminder): Group {
  if (reminder.delivery) return 'past';
  if (reminder.paused) return 'paused';
  const offset = dayOffset(reminder.at);
  if (offset <= 0) return 'today';
  if (offset === 1) return 'tomorrow';
  return 'later';
}

/** « Aujourd'hui », « Demain », sinon « 16 mai ». */
function dayText(at: Date): string {
  const offset = dayOffset(at);
  if (offset === 0) return 'Aujourd’hui';
  if (offset === 1) return 'Demain';
  if (offset === -1) return 'Hier';
  return formatDay(at);
}

type Toast = { text: string; undo?: () => void };

export default function ReminderListScreen() {
  const { c, styles } = useLook();
  const kit = useKitStyles();
  const { reminders, flash } = useReminderState();
  const sync = useQuery('reminders', syncReminders);
  const view = useReminderView();
  const viewInfo = REMINDER_VIEWS.find((entry) => entry.key === view) ?? REMINDER_VIEWS[0];
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [sheet, setSheet] = useState<'view' | null>(null);
  const [menuItem, setMenuItem] = useState<Reminder | null>(null);
  const [collapsed, setCollapsed] = useState<Record<Group, boolean>>({ today: false, tomorrow: false, later: false, paused: false, past: true });
  const [toast, setToast] = useState<Toast | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (flash) {
        setToast(flash);
        reminderActions.setFlash(null);
      }
    }, [flash]),
  );

  const sections = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = term ? reminders.filter((item) => `${item.title} ${linkLabel(item.link)}`.toLowerCase().includes(term)) : reminders;
    return (['today', 'tomorrow', 'later', 'paused', 'past'] as Group[])
      .map((group) => ({
        group,
        items: list
          .filter((item) => groupOf(item) === group)
          .sort((a, b) => (group === 'past' ? b.at.getTime() - a.at.getTime() : a.at.getTime() - b.at.getTime())),
      }))
      .filter((section) => section.items.length > 0);
  }, [reminders, query]);

  /** L'API ne met pas en pause : l'interrupteur ne sert qu'à réactiver un rappel désactivé. */
  const togglePaused = (item: Reminder) => {
    if (!item.paused) return;
    reminderActions.reactivate(item.id);
    setToast({ text: 'Rappel réactivé.' });
  };

  return (
    <SafeAreaView style={kit.safe} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={sync.refreshing} onRefresh={sync.reload} tintColor={c.link} colors={[c.link]} />}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Rappels</Text>
          <View style={styles.titleActions}>
            <Pressable style={({ pressed }) => [styles.square, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`Affichage : ${viewInfo.label}`} onPress={() => setSheet('view')}>
              <Icon name={viewInfo.icon} size={22} color={c.text} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.square, searching && styles.squareOn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={searching ? 'Fermer la recherche' : 'Rechercher un rappel'}
              onPress={() => {
                setSearching((value) => !value);
                setQuery('');
              }}>
              <Icon name={searching ? 'close' : 'search'} size={22} color={c.text} />
            </Pressable>
            <Pressable style={({ pressed }) => [styles.square, styles.addSquare, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Nouveau rappel" onPress={() => router.push('/reminders/add')}>
              <Icon name="add" size={26} color={c.solidText} />
            </Pressable>
          </View>
        </View>

        {searching ? (
          <View style={styles.search}>
            <Icon name="search" size={20} color={c.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un rappel…"
              placeholderTextColor={c.muted}
              selectionColor={c.link}
              value={query}
              onChangeText={setQuery}
              autoFocus
              accessibilityLabel="Rechercher un rappel"
            />
          </View>
        ) : null}

        <QueryView
          query={sync}
          empty={{
            icon: 'notifications',
            title: 'Aucun rappel',
            text: 'Créez un rappel pour ne rien oublier : une démarche, un événement, un appel.',
            actionLabel: 'Nouveau rappel',
            onAction: () => router.push('/reminders/add'),
          }}>
          {sections.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="search_off" size={32} color={c.link} />
              <Text style={styles.emptyTitle}>Aucun rappel ne correspond</Text>
            </View>
          ) : (
            sections.map((section) => (
              <View key={section.group} style={styles.section}>
                <Pressable
                  style={styles.sectionHead}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: !collapsed[section.group] }}
                  accessibilityLabel={`${GROUP_LABELS[section.group]}, ${section.items.length} rappel${section.items.length > 1 ? 's' : ''}`}
                  onPress={() => setCollapsed((value) => ({ ...value, [section.group]: !value[section.group] }))}>
                  <Icon name={GROUP_ICONS[section.group]} size={20} color={section.group === 'past' || section.group === 'paused' ? c.muted : c.link} />
                  <Text style={styles.sectionTitle}>{GROUP_LABELS[section.group]}</Text>
                  <Text style={styles.sectionCount}>{section.items.length}</Text>
                  <Icon name={collapsed[section.group] ? 'expand_more' : 'expand_less'} size={22} color={c.muted} />
                </Pressable>
                {collapsed[section.group] ? null : (
                  <SectionItems view={view} items={section.items} onToggle={togglePaused} onMenu={setMenuItem} />
                )}
              </View>
            ))
          )}
        </QueryView>
      </ScrollView>

      {toast ? <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={84} /> : null}

      <BottomSheet visible={sheet === 'view'} title="Affichage" subtitle="Choisissez comment voir vos rappels." onClose={() => setSheet(null)}>
        {REMINDER_VIEWS.map((entry) => (
          <SheetOption
            key={entry.key}
            icon={view === entry.key ? 'check_circle' : entry.icon}
            label={entry.label}
            hint={entry.hint}
            onPress={() => {
              setReminderView(entry.key);
              setSheet(null);
            }}
          />
        ))}
      </BottomSheet>

      <BottomSheet visible={menuItem !== null} title={menuItem?.title ?? ''} onClose={() => setMenuItem(null)}>
        {menuItem ? (
          <>
            <SheetOption
              icon="edit"
              label="Modifier"
              onPress={() => {
                setMenuItem(null);
                router.push({ pathname: '/reminders/edit', params: { id: menuItem.id } });
              }}
            />
            {!menuItem.delivery && !menuItem.paused ? (
              <SheetOption
                icon="snooze"
                label="Reporter de 15 minutes"
                onPress={() => {
                  setMenuItem(null);
                  const undo = reminderActions.snooze(menuItem.id, 15);
                  setToast({ text: 'Rappel reporté de 15 minutes.', undo });
                }}
              />
            ) : null}
            {menuItem.delivery?.status === 'missed' || menuItem.paused ? (
              <SheetOption
                icon="restart_alt"
                label="Réactiver le rappel"
                onPress={() => {
                  setMenuItem(null);
                  reminderActions.reactivate(menuItem.id);
                  setToast({ text: 'Rappel réactivé.' });
                }}
              />
            ) : null}
            {menuItem.link.id ? (
              <SheetOption
                icon="link"
                label={`Voir ${linkLabel(menuItem.link).toLowerCase()}`}
                onPress={() => {
                  const href = linkHref(menuItem.link);
                  setMenuItem(null);
                  router.push(href);
                }}
              />
            ) : null}
            <SheetOption
              icon="delete"
              label="Supprimer"
              danger
              onPress={() => {
                setMenuItem(null);
                const undo = reminderActions.remove(menuItem.id);
                setToast({ text: 'Rappel supprimé.', undo });
              }}
            />
          </>
        ) : null}
      </BottomSheet>
    </SafeAreaView>
  );
}

function SectionItems({
  view,
  items,
  onToggle,
  onMenu,
}: {
  view: ReminderView;
  items: Reminder[];
  onToggle: (item: Reminder) => void;
  onMenu: (item: Reminder) => void;
}) {
  const { styles } = useLook();
  if (view === 'grid') {
    return (
      <View style={styles.grid}>
        {items.map((item) => (
          <ReminderTile key={item.id} item={item} onToggle={() => onToggle(item)} onMenu={() => onMenu(item)} />
        ))}
      </View>
    );
  }
  if (view === 'cards') {
    return (
      <View style={styles.cards}>
        {items.map((item) => (
          <ReminderCard key={item.id} item={item} onToggle={() => onToggle(item)} onMenu={() => onMenu(item)} />
        ))}
      </View>
    );
  }
  return (
    <View style={styles.listCard}>
      {items.map((item, index) => (
        <ReminderRow key={item.id} item={item} first={index === 0} onToggle={() => onToggle(item)} onMenu={() => onMenu(item)} />
      ))}
    </View>
  );
}

/** Interrupteur actif / en pause (rien pour un rappel passé). */
function Toggle({ item, onToggle }: { item: Reminder; onToggle: () => void }) {
  const { c } = useLook();
  if (item.delivery) {
    const missed = item.delivery.status === 'missed';
    return <Icon name={missed ? 'error' : 'check_circle'} size={24} color={missed ? c.error : c.success} filled />;
  }
  // Rappel actif : rien à basculer (l'API ne propose pas de pause).
  if (!item.paused) return <Icon name="alarm" size={24} color={c.link} />;
  return (
    <Switch
      value={!item.paused}
      onValueChange={onToggle}
      trackColor={{ false: c.border, true: TURQUOISE }}
      thumbColor="#FFFFFF"
      {...(Platform.OS === 'web' ? { activeThumbColor: '#FFFFFF' } : {})}
      ios_backgroundColor={c.border}
      accessibilityLabel={item.paused ? `Réactiver ${item.title}` : `Mettre en pause ${item.title}`}
    />
  );
}

function Meta({ item }: { item: Reminder }) {
  const { c, styles } = useLook();
  return (
    <View style={styles.meta}>
      <Text style={styles.metaText} numberOfLines={1}>
        {item.delivery ? item.delivery.detail : `${dayText(item.at)} • ${repeatSummary(item)}`}
      </Text>
      {item.channels.map((channel) => (
        <Icon key={channel} name={CHANNEL_META[channel].icon} size={15} color={c.muted} />
      ))}
      {item.deferred ? <Icon name="bedtime" size={15} color={c.muted} /> : null}
    </View>
  );
}

/** Vue « Liste » : comme une alarme du téléphone. */
function ReminderRow({ item, first, onToggle, onMenu }: { item: Reminder; first: boolean; onToggle: () => void; onMenu: () => void }) {
  const { styles } = useLook();
  const off = item.paused || !!item.delivery;
  return (
    <Pressable
      style={({ pressed }) => [styles.row, !first && styles.rowDivider, pressed && styles.rowPressed]}
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      accessibilityLabel={`${item.title}, ${dayText(item.at)} à ${formatTime(item.at)}`}
      onPress={() => router.push({ pathname: '/reminders/edit', params: { id: item.id } })}
      onLongPress={onMenu}>
      <View style={styles.rowMain}>
        <Text style={[styles.bigTime, off && styles.off]}>{formatTime(item.at)}</Text>
        <Text style={[styles.rowTitle, off && styles.off]} numberOfLines={1}>
          {item.title}
        </Text>
        <Meta item={item} />
      </View>
      <Toggle item={item} onToggle={onToggle} />
      <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel={`Actions pour ${item.title}`} onPress={onMenu}>
        <Icon name="more_vert" size={22} color={styles.metaText.color as string} />
      </Pressable>
    </Pressable>
  );
}

/** Vue « Cartes » : une carte par rappel, avec ce à quoi il est rattaché. */
function ReminderCard({ item, onToggle, onMenu }: { item: Reminder; onToggle: () => void; onMenu: () => void }) {
  const { c, styles } = useLook();
  const off = item.paused || !!item.delivery;
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.rowPressed]}
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      accessibilityLabel={`${item.title}, ${dayText(item.at)} à ${formatTime(item.at)}`}
      onPress={() => router.push({ pathname: '/reminders/edit', params: { id: item.id } })}>
      <View style={styles.cardTop}>
        <Text style={[styles.bigTime, off && styles.off]}>{formatTime(item.at)}</Text>
        <Toggle item={item} onToggle={onToggle} />
      </View>
      <Text style={[styles.rowTitle, off && styles.off]} numberOfLines={2}>
        {item.title}
      </Text>
      <Meta item={item} />
      <View style={styles.cardFoot}>
        <View style={styles.linkPill}>
          <Icon name={linkIcon(item.link)} size={14} color={c.link} />
          <Text style={styles.linkPillText} numberOfLines={1}>
            {linkLabel(item.link)}
          </Text>
        </View>
        <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel={`Actions pour ${item.title}`} onPress={onMenu}>
          <Icon name="more_horiz" size={22} color={c.text} />
        </Pressable>
      </View>
    </Pressable>
  );
}

/** Vue « Grille » : deux rappels par ligne. */
function ReminderTile({ item, onToggle, onMenu }: { item: Reminder; onToggle: () => void; onMenu: () => void }) {
  const { c, styles } = useLook();
  const off = item.paused || !!item.delivery;
  return (
    <Pressable
      style={({ pressed }) => [styles.tile, pressed && styles.rowPressed]}
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      accessibilityLabel={`${item.title}, ${dayText(item.at)} à ${formatTime(item.at)}`}
      onPress={() => router.push({ pathname: '/reminders/edit', params: { id: item.id } })}
      onLongPress={onMenu}>
      <Text style={[styles.tileTime, off && styles.off]}>{formatTime(item.at)}</Text>
      <Text style={[styles.tileTitle, off && styles.off]} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.metaText} numberOfLines={1}>
        {dayText(item.at)}
      </Text>
      <View style={styles.tileFoot}>
        <Toggle item={item} onToggle={onToggle} />
        <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel={`Actions pour ${item.title}`} onPress={onMenu}>
          <Icon name="more_horiz" size={22} color={c.text} />
        </Pressable>
      </View>
    </Pressable>
  );
}

function makeStyles(c: AppColors) {
  const surface = {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.card,
    shadowColor: '#0C1A37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: c.shadowOpacity,
    shadowRadius: 10,
    elevation: 1,
  } as const;
  return StyleSheet.create({
    flex: { flex: 1 },
    pressed: { opacity: 0.75 },
    content: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 120, gap: 14 },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    pageTitle: { fontFamily: FontFamily.headingBold, fontSize: 28, lineHeight: 34, letterSpacing: -0.5, color: c.text },
    titleActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    square: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, borderColor: c.border, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center' },
    squareOn: { borderColor: c.link },
    addSquare: { borderColor: c.solid, backgroundColor: c.solid },
    search: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: c.border, backgroundColor: c.card },
    searchInput: { flex: 1, paddingVertical: 12, fontFamily: FontFamily.body, fontSize: 16, lineHeight: 22, color: c.text, outlineWidth: 0, outlineStyle: 'solid' },
    permission: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      backgroundColor: c.tintAmber,
    },
    permissionText: { flex: 1, fontFamily: FontFamily.bodyMedium, fontSize: 13, lineHeight: 18, color: c.amberText },
    permissionLink: { fontFamily: FontFamily.bodyBold, fontSize: 14, lineHeight: 19, color: c.amberText },
    section: { gap: 8 },
    sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 36 },
    sectionTitle: { flex: 1, fontFamily: FontFamily.headingBold, fontSize: 17, lineHeight: 22, color: c.text },
    sectionCount: { fontFamily: FontFamily.bodySemiBold, fontSize: 14, lineHeight: 19, color: c.muted },
    listCard: { ...surface, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 16, backgroundColor: c.card },
    rowDivider: { borderTopWidth: 1, borderTopColor: c.border },
    rowPressed: { backgroundColor: c.soft },
    rowMain: { flex: 1, gap: 2, minWidth: 0 },
    bigTime: { fontFamily: FontFamily.heading, fontSize: 34, lineHeight: 40, letterSpacing: -0.5, color: c.text },
    rowTitle: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, lineHeight: 20, color: c.text },
    off: { opacity: 0.45 },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: { flexShrink: 1, fontFamily: FontFamily.body, fontSize: 13, lineHeight: 18, color: c.muted },
    cards: { gap: 10 },
    card: { ...surface, padding: 16, gap: 6 },
    cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
    linkPill: { flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: '80%', paddingHorizontal: 9, paddingVertical: 4, borderRadius: Radius.full, backgroundColor: c.tintMint },
    linkPillText: { fontFamily: FontFamily.bodySemiBold, fontSize: 13, lineHeight: 17, color: c.link },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    tile: { ...surface, width: '48%', flexGrow: 1, padding: 14, gap: 4 },
    tileTime: { fontFamily: FontFamily.heading, fontSize: 28, lineHeight: 34, color: c.text },
    tileTitle: { minHeight: 38, fontFamily: FontFamily.bodySemiBold, fontSize: 14, lineHeight: 19, color: c.text },
    tileFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
    empty: { alignItems: 'center', gap: 8, paddingVertical: 40 },
    emptyTitle: { fontFamily: FontFamily.headingBold, fontSize: 17, lineHeight: 23, color: c.text },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre dans le module Rappels, converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
