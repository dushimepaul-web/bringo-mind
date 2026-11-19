// Toutes les notes : notes regroupées par période (cette semaine, ce mois-ci, plus ancien),
// chacune avec sa miniature, son titre et sa date. Bouton rond « crayon » pour écrire une note.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { BottomSheet, SheetOption } from '@/components/ui/kit';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { DEMO_TODAY, addDays, dayOffset, formatDay, startOfDay } from '@/lib/demo-dates';

import { NoteBody, parseLine } from '../components/notes-ui';
import { setNoteSort, useNotesState, type Note, type NoteSort } from '../store';
import { NOTES_VIEWS, setNotesView, useNotesView } from '../view-mode';

const SORTS: { key: NoteSort; label: string; icon: string }[] = [
  { key: 'recent', label: 'Les plus récentes', icon: 'schedule' },
  { key: 'alpha', label: 'De A à Z', icon: 'sort_by_alpha' },
];

type Period = 'week' | 'month' | 'older';
const PERIOD_LABELS: Record<Period, string> = { week: 'Cette semaine', month: 'Ce mois-ci', older: 'Plus ancien' };

/** Période d'une note : semaine en cours (lundi → dimanche), mois en cours, ou plus ancien. */
function periodOf(note: Note): Period {
  const monday = addDays(startOfDay(DEMO_TODAY), -((DEMO_TODAY.getDay() + 6) % 7));
  if (dayOffset(note.updatedAt) >= dayOffset(monday)) return 'week';
  if (note.updatedAt.getMonth() === DEMO_TODAY.getMonth() && note.updatedAt.getFullYear() === DEMO_TODAY.getFullYear()) return 'month';
  return 'older';
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    // Retire les accents (diacritiques combinants U+0300 à U+036F).
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export default function NotesScreen() {
  const { c, styles } = useLook();
  const { notes, sort } = useNotesState();
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [menu, setMenu] = useState<'sort' | 'view' | null>(null);
  const view = useNotesView();
  const viewInfo = NOTES_VIEWS.find((entry) => entry.key === view) ?? NOTES_VIEWS[0];

  const q = normalize(query.trim());
  const filtered = q ? notes.filter((note) => normalize(`${note.title} ${note.body}`).includes(q)) : notes;
  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (sort === 'alpha') return a.title.localeCompare(b.title, 'fr');
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });
  const sections = (['week', 'month', 'older'] as Period[])
    .map((period) => ({ period, items: sorted.filter((note) => periodOf(note) === period) }))
    .filter((section) => section.items.length > 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Titre et actions : défilent avec la liste */}
        <View style={styles.header}>
          <Pressable style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Trier les notes" onPress={() => setMenu('sort')}>
            <Icon name="menu" size={28} color={c.text} />
          </Pressable>
          <Text style={styles.title}>Toutes les notes</Text>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton} accessibilityRole="button" accessibilityLabel={`Affichage : ${viewInfo.label}`} onPress={() => setMenu('view')}>
              <Icon name={viewInfo.icon} size={26} color={c.text} />
            </Pressable>
              <Pressable
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel={searching ? 'Fermer la recherche' : 'Rechercher une note'}
              onPress={() => {
                setSearching((value) => !value);
                setQuery('');
              }}>
              <Icon name={searching ? 'close' : 'search'} size={26} color={c.text} />
            </Pressable>
            </View>
        </View>
        {searching ? (
          <View style={styles.search}>
            <Icon name="search" size={20} color={c.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholder="Rechercher une note…"
              placeholderTextColor={c.muted}
              selectionColor={c.link}
              style={styles.searchInput}
              accessibilityLabel="Rechercher une note"
            />
          </View>
        ) : null}

        {sections.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="sticky_note_2" size={40} color={c.muted} />
            <Text style={styles.emptyTitle}>{q ? 'Aucune note trouvée' : 'Aucune note'}</Text>
            <Text style={styles.emptyText}>{q ? 'Essayez un autre mot.' : 'Touchez le crayon pour écrire votre première note.'}</Text>
          </View>
        ) : (
          sections.map((section) => (
            <View key={section.period} style={styles.section}>
              <Text style={styles.sectionTitle}>{PERIOD_LABELS[section.period]}</Text>
              {view === 'grid' ? (
                <View style={styles.grid}>
                  {section.items.map((note) => (
                    <NoteTile key={note.id} note={note} />
                  ))}
                </View>
              ) : (
                section.items.map((note) => (view === 'cards' ? <NoteCard key={note.id} note={note} /> : <NoteRow key={note.id} note={note} />))
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Bouton rond « crayon » : écrire une nouvelle note */}
      <View style={styles.fabWrap} pointerEvents="box-none">
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Nouvelle note"
          onPress={() => router.push('/notes/edit')}>
          <Icon name="edit_square" size={28} color={c.link} />
        </Pressable>
      </View>

      <BottomSheet visible={menu === 'view'} title="Affichage" subtitle="Choisissez comment voir vos notes." onClose={() => setMenu(null)}>
        {NOTES_VIEWS.map((entry) => (
          <SheetOption
            key={entry.key}
            icon={view === entry.key ? 'check_circle' : entry.icon}
            label={entry.label}
            hint={entry.hint}
            onPress={() => {
              setNotesView(entry.key);
              setMenu(null);
            }}
          />
        ))}
      </BottomSheet>

      <BottomSheet visible={menu === 'sort'} title="Trier les notes" subtitle="Les notes épinglées restent toujours en premier." onClose={() => setMenu(null)}>
        {SORTS.map((entry) => (
          <SheetOption
            key={entry.key}
            icon={sort === entry.key ? 'check_circle' : entry.icon}
            label={entry.label}
            onPress={() => {
              setNoteSort(entry.key);
              setMenu(null);
            }}
          />
        ))}
      </BottomSheet>

    </SafeAreaView>
  );
}

/** Miniature : la note en petit (lignes grises, cases), comme une page vue de loin. */
function Thumbnail({ note }: { note: Note }) {
  const { c, styles } = useLook();
  const lines = note.body.split('\n').slice(0, 7);
  return (
    <View style={styles.thumb} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[styles.thumbTitle, { backgroundColor: c.text }]} />
      {lines.map((raw, index) => {
        const line = parseLine(raw);
        const width = Math.max(20, Math.min(100, (line.text.length / 28) * 100));
        return (
          <View key={index} style={styles.thumbLine}>
            {line.kind === 'check' ? <View style={[styles.thumbBox, line.done && { backgroundColor: c.muted }]} /> : null}
            {line.kind === 'bullet' || line.kind === 'number' ? <View style={styles.thumbDot} /> : null}
            <View style={[styles.thumbBar, { width: `${width}%` }]} />
          </View>
        );
      })}
    </View>
  );
}

/** Vue « Cartes » : une carte par note, avec le début du texte. */
function NoteCard({ note }: { note: Note }) {
  const { c, styles } = useLook();
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Note : ${note.title}, ${formatDay(note.updatedAt)}`}
      onPress={() => router.push({ pathname: '/notes/edit', params: { id: note.id } })}>
      <View style={styles.cardHead}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {note.title}
        </Text>
        {note.pinned ? <Icon name="push_pin" size={16} color={c.muted} filled /> : null}
      </View>
      <View pointerEvents="none">
        <NoteBody body={note.body} maxLines={4} compact />
      </View>
      <Text style={styles.cardDate}>{formatDay(note.updatedAt)}</Text>
    </Pressable>
  );
}

/** Vue « Grille » : deux notes par ligne, chacune comme une petite page. */
function NoteTile({ note }: { note: Note }) {
  const { c, styles } = useLook();
  return (
    <Pressable
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Note : ${note.title}, ${formatDay(note.updatedAt)}`}
      onPress={() => router.push({ pathname: '/notes/edit', params: { id: note.id } })}>
      <View style={styles.tilePage} pointerEvents="none">
        <NoteBody body={note.body} maxLines={7} compact />
      </View>
      <View style={styles.tileFoot}>
        <Text style={styles.tileTitle} numberOfLines={1}>
          {note.title}
        </Text>
        <View style={styles.rowMeta}>
          {note.pinned ? <Icon name="push_pin" size={14} color={c.muted} filled /> : null}
          <Text style={styles.tileDate}>{formatDay(note.updatedAt)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function NoteRow({ note }: { note: Note }) {
  const { c, styles } = useLook();
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Note : ${note.title}, ${formatDay(note.updatedAt)}`}
      onPress={() => router.push({ pathname: '/notes/edit', params: { id: note.id } })}>
      <Thumbnail note={note} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {note.title}
        </Text>
        <View style={styles.rowMeta}>
          {note.pinned ? <Icon name="push_pin" size={15} color={c.muted} filled /> : null}
          <Text style={styles.rowDate}>{formatDay(note.updatedAt)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.page },
    pressed: { opacity: 0.75 },
    header: { height: 60, marginHorizontal: -10, flexDirection: 'row', alignItems: 'center' },
    iconButton: { width: 44, height: 44, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
    title: { flex: 1, marginLeft: 4, fontFamily: FontFamily.headingBold, fontSize: 24, lineHeight: 30, color: c.text },
    headerRight: { flexDirection: 'row', alignItems: 'center' },
    content: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 4, paddingBottom: 120, gap: 18 },
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
    section: { gap: 14 },
    sectionTitle: { fontFamily: FontFamily.headingBold, fontSize: 16, lineHeight: 21, color: c.text },
    row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    card: {
      gap: 8,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      shadowColor: '#0C1A37',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 10,
      elevation: 1,
    },
    cardHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
    cardTitle: { flex: 1, fontFamily: FontFamily.headingBold, fontSize: 17, lineHeight: 23, color: c.text },
    cardDate: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 17, color: c.muted },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    tile: { width: '47.5%', flexGrow: 1, gap: 8 },
    tilePage: {
      height: 170,
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      overflow: 'hidden',
    },
    tileFoot: { gap: 2, paddingHorizontal: 2 },
    tileTitle: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, lineHeight: 20, color: c.text },
    tileDate: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 17, color: c.muted },
    thumb: {
      width: 82,
      height: 82,
      padding: 9,
      gap: 4,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      overflow: 'hidden',
    },
    thumbTitle: { width: '60%', height: 4, borderRadius: 2, marginBottom: 2, opacity: 0.7 },
    thumbLine: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    thumbBox: { width: 5, height: 5, borderRadius: 1, borderWidth: 1, borderColor: c.muted },
    thumbDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: c.muted },
    thumbBar: { height: 3, borderRadius: 2, backgroundColor: c.dark ? '#4B5B7A' : '#C9D2DC' },
    rowText: { flex: 1, gap: 4 },
    rowTitle: { fontFamily: FontFamily.body, fontSize: 19, lineHeight: 25, color: c.text },
    rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    rowDate: { fontFamily: FontFamily.body, fontSize: 15, lineHeight: 20, color: c.muted },
    empty: { alignItems: 'center', gap: 8, paddingVertical: 48 },
    emptyTitle: { fontFamily: FontFamily.headingBold, fontSize: 17, lineHeight: 23, color: c.text },
    emptyText: { fontFamily: FontFamily.body, fontSize: 14, lineHeight: 20, color: c.muted, textAlign: 'center' },
    fabWrap: { position: 'absolute', right: 18, bottom: 18 },
    fab: {
      width: 64,
      height: 64,
      borderRadius: Radius.full,
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#0C1A37',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: c.dark ? 0.4 : 0.18,
      shadowRadius: 14,
      elevation: 6,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

function useLook() {
  const c = useAppColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
