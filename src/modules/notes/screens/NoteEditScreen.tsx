// Écrire ou modifier une note (clair et sombre). Démo : une nouvelle note arrive pré-remplie.
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius } from '@/constants/design';

import { NOTE_COLORS, NotesButton, NotesHeader, useNotesUi } from '../components/notes-ui';
import { deleteNote, findNote, saveNote, type NoteColor, type NoteDraft } from '../store';

const NEW_NOTE: NoteDraft = {
  title: 'Idée cadeau pour Thomas',
  body: 'Montre connectée ou livre de cuisine italienne — budget 80 €. Commander avant le 25 mai.',
  color: 'mint',
  pinned: false,
};

export default function NoteEditScreen() {
  const { c, ui } = useNotesUi();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = findNote(id);
  const [draft, setDraft] = useState<NoteDraft>(() =>
    existing ? { title: existing.title, body: existing.body, color: existing.color, pinned: existing.pinned } : NEW_NOTE,
  );
  const [focus, setFocus] = useState<'title' | 'body' | null>(null);
  const set = (patch: Partial<NoteDraft>) => setDraft((current) => ({ ...current, ...patch }));
  const canSave = draft.title.trim().length > 0 || draft.body.trim().length > 0;

  const close = () => (router.canGoBack() ? router.back() : router.replace('/notes'));
  const save = () => {
    saveNote({ ...draft, title: draft.title.trim() || 'Sans titre', body: draft.body.trim() }, existing?.id);
    close();
  };

  return (
    <SafeAreaView style={ui.safe} edges={['top', 'bottom']}>
      <StatusBar style={c.dark ? 'light' : 'dark'} />
      <NotesHeader title={existing ? 'Modifier la note' : 'Nouvelle note'} close fallback="/notes" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[ui.content, styles.content]} keyboardShouldPersistTaps="handled">
          <View style={styles.field}>
            <Text style={ui.label}>Titre</Text>
            <TextInput
              value={draft.title}
              onChangeText={(title) => set({ title })}
              onFocus={() => setFocus('title')}
              onBlur={() => setFocus(null)}
              placeholder="Titre de la note"
              placeholderTextColor={c.muted}
              style={[ui.input, focus === 'title' && ui.inputFocused]}
              accessibilityLabel="Titre"
            />
          </View>

          <View style={styles.field}>
            <Text style={ui.label}>Note</Text>
            <TextInput
              value={draft.body}
              onChangeText={(body) => set({ body })}
              onFocus={() => setFocus('body')}
              onBlur={() => setFocus(null)}
              placeholder="Écrivez ici…"
              placeholderTextColor={c.muted}
              multiline
              textAlignVertical="top"
              style={[ui.input, styles.body, focus === 'body' && ui.inputFocused]}
              accessibilityLabel="Contenu de la note"
            />
          </View>

          <View style={styles.field}>
            <Text style={ui.label}>Couleur</Text>
            <View style={styles.colors}>
              {(Object.keys(NOTE_COLORS) as NoteColor[]).map((key) => {
                const color = NOTE_COLORS[key];
                const selected = draft.color === key;
                return (
                  <Pressable
                    key={key}
                    style={[styles.color, { backgroundColor: c[color.tint] }, selected && { borderColor: color.bar }]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={color.label}
                    onPress={() => set({ color: key })}>
                    <View style={[styles.colorDot, { backgroundColor: color.bar }]}>
                      {selected ? <Icon name="check" size={16} color="#FFFFFF" /> : null}
                    </View>
                    <Text style={[styles.colorLabel, { color: c.text }]}>{color.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            style={[ui.card, styles.pinRow]}
            accessibilityRole="switch"
            accessibilityState={{ checked: draft.pinned }}
            onPress={() => set({ pinned: !draft.pinned })}>
            <Icon name="push_pin" size={22} color={draft.pinned ? c.link : c.muted} filled={draft.pinned} />
            <View style={styles.flex}>
              <Text style={ui.label}>Épingler en haut de la liste</Text>
              <Text style={ui.muted}>Les notes épinglées restent toujours visibles.</Text>
            </View>
            <View style={[styles.switch, { backgroundColor: draft.pinned ? c.link : c.border }]}>
              <View style={[styles.knob, draft.pinned && styles.knobOn]} />
            </View>
          </Pressable>

          <NotesButton label={existing ? 'Enregistrer' : 'Créer la note'} icon="check" disabled={!canSave} onPress={save} />
          {existing ? (
            <NotesButton
              label="Supprimer la note"
              icon="delete"
              danger
              onPress={() => {
                deleteNote(existing.id);
                close();
              }}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { gap: 18 },
  field: { gap: 8 },
  body: { minHeight: 160 },
  colors: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  color: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDot: { width: 22, height: 22, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  colorLabel: { fontFamily: FontFamily.bodySemiBold, fontSize: 14, lineHeight: 19 },
  pinRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  switch: { width: 50, height: 30, borderRadius: 15, padding: 3 },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFFFFF' },
  knobOn: { transform: [{ translateX: 20 }] },
});
