// Notes : recherche, notes épinglées puis les autres. Un toucher ouvre la note. Clair et sombre.
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily } from '@/constants/design';
import { formatDay } from '@/lib/demo-dates';

import { NOTE_COLORS, NotesHeader, NotesIconButton, useNotesUi } from '../components/notes-ui';
import { togglePin, useNotes, type Note } from '../store';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    // Retire les accents (diacritiques combinants U+0300 à U+036F).
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export default function NotesScreen() {
  const { c, ui } = useNotesUi();
  const notes = useNotes();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const q = normalize(query.trim());
  const visible = q ? notes.filter((note) => normalize(`${note.title} ${note.body}`).includes(q)) : notes;
  const pinned = visible.filter((note) => note.pinned);
  const others = visible.filter((note) => !note.pinned);

  return (
    <SafeAreaView style={ui.safe} edges={['top']}>
      <StatusBar style={c.dark ? 'light' : 'dark'} />
      <NotesHeader title="Notes" right={<NotesIconButton icon="add" label="Nouvelle note" onPress={() => router.push('/notes/edit')} />} />
      <ScrollView contentContainerStyle={[ui.content, styles.content]} keyboardShouldPersistTaps="handled">
        <View style={[ui.input, styles.search, focused && ui.inputFocused]}>
          <Icon name="search" size={22} color={c.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Rechercher une note…"
            placeholderTextColor={c.muted}
            style={[styles.searchInput, { color: c.text }]}
            accessibilityLabel="Rechercher une note"
          />
          {query ? (
            <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Effacer la recherche" onPress={() => setQuery('')}>
              <Icon name="close" size={20} color={c.muted} />
            </Pressable>
          ) : null}
        </View>

        {visible.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="description" size={40} color={c.muted} />
            <Text style={ui.title}>{q ? 'Aucune note trouvée' : 'Aucune note'}</Text>
            <Text style={[ui.muted, styles.center]}>{q ? 'Essayez un autre mot.' : 'Touchez « + » pour écrire votre première note.'}</Text>
          </View>
        ) : null}

        {pinned.length ? <Section title="Épinglées" notes={pinned} /> : null}
        {others.length ? <Section title={pinned.length ? 'Autres notes' : 'Toutes les notes'} notes={others} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, notes }: { title: string; notes: Note[] }) {
  const { c } = useNotesUi();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: c.text }]}>
        {title} <Text style={[styles.count, { color: c.muted }]}>{notes.length}</Text>
      </Text>
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </View>
  );
}

function NoteCard({ note }: { note: Note }) {
  const { c, ui } = useNotesUi();
  const color = NOTE_COLORS[note.color];
  return (
    <Pressable
      style={({ pressed }) => [ui.card, styles.card, pressed && ui.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Note : ${note.title}`}
      onPress={() => router.push({ pathname: '/notes/edit', params: { id: note.id } })}>
      <View style={[styles.bar, { backgroundColor: color.bar }]} />
      <View style={styles.cardBody}>
        <Text style={ui.title} numberOfLines={1}>
          {note.title}
        </Text>
        <Text style={ui.muted} numberOfLines={2}>
          {note.body}
        </Text>
        <Text style={[styles.date, { color: c.muted }]}>Modifiée le {formatDay(note.updatedAt)}</Text>
      </View>
      <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel={note.pinned ? 'Désépingler' : 'Épingler'} onPress={() => togglePin(note.id)}>
        <Icon name="push_pin" size={22} color={note.pinned ? c.link : c.muted} filled={note.pinned} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16 },
  center: { textAlign: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 0 },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: 14,
    outlineWidth: 0,
    outlineStyle: 'solid',
  },
  section: { gap: 10 },
  sectionTitle: { fontFamily: FontFamily.headingBold, fontSize: 18, lineHeight: 24 },
  count: { fontFamily: FontFamily.bodySemiBold, fontSize: 15 },
  card: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  bar: { width: 5, alignSelf: 'stretch', borderRadius: 3 },
  cardBody: { flex: 1, gap: 4 },
  date: { fontFamily: FontFamily.bodyMedium, fontSize: 13, lineHeight: 17, marginTop: 2 },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 40 },
});
