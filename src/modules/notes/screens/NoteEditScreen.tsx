// Écrire une note, comme une feuille : « ‹ Titre » en haut (lecture, insertion, menu),
// une page blanche entre deux bandes grises (« 1/1 »), et la barre d'outils en bas
// (case à cocher, listes, police, taille, annuler, rétablir). Enregistrement automatique en quittant.
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, SheetOption } from '@/components/ui/kit';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';

import { NoteBody, parseLine, toggleCheck } from '../components/notes-ui';
import { deleteNote, findNote, saveNote, type NoteDraft, type NoteFont } from '../store';

/** Démo : une nouvelle note arrive pré-remplie. */
const NEW_NOTE: NoteDraft = {
  title: 'Sortie de dimanche',
  body: '☐ Pique-nique au parc floral\n☐ Vélo de Léo à regonfler\n☐ Appeler les parents de Thomas',
  color: 'mint',
  pinned: false,
  fontSize: 15,
  font: 'normal',
};

const SIZES = [13, 15, 17, 20, 24];
const FONTS: { key: NoteFont; label: string; family: string }[] = [
  { key: 'normal', label: 'Normale', family: FontFamily.body },
  { key: 'rounded', label: 'Arrondie', family: FontFamily.heading },
];

type Prefix = 'bullet' | 'number' | 'check';

/** Ajoute (ou retire) une puce, un numéro ou une case au début de la ligne du curseur. */
function applyPrefix(body: string, cursor: number, kind: Prefix): string {
  const start = body.lastIndexOf('\n', Math.max(0, cursor - 1)) + 1;
  const endIndex = body.indexOf('\n', start);
  const end = endIndex === -1 ? body.length : endIndex;
  const parsed = parseLine(body.slice(start, end));
  const same =
    (kind === 'bullet' && parsed.kind === 'bullet') ||
    (kind === 'number' && parsed.kind === 'number') ||
    (kind === 'check' && parsed.kind === 'check');
  let prefix = '';
  if (!same) {
    if (kind === 'bullet') prefix = '• ';
    if (kind === 'check') prefix = '☐ ';
    if (kind === 'number') {
      const previous = parseLine(body.slice(0, Math.max(0, start - 1)).split('\n').pop() ?? '');
      prefix = `${previous.kind === 'number' ? Number(previous.n) + 1 : 1}. `;
    }
  }
  return body.slice(0, start) + prefix + parsed.text + body.slice(end);
}

export default function NoteEditScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  // Une note = un éditeur neuf (évite de garder le texte de la note précédente).
  return <NoteEditor key={id ?? 'new'} id={id} />;
}

function NoteEditor({ id }: { id?: string }) {
  const { c, styles } = useLook();
  const existing = findNote(id);
  const [draft, setDraft] = useState<NoteDraft>(() =>
    existing
      ? { title: existing.title, body: existing.body, color: existing.color, pinned: existing.pinned, fontSize: existing.fontSize ?? 15, font: existing.font ?? 'normal' }
      : NEW_NOTE,
  );
  const [reading, setReading] = useState(!!existing);
  const [cursor, setCursor] = useState(draft.body.length);
  const [sheet, setSheet] = useState<'menu' | 'font' | 'size' | null>(null);
  const [past, setPast] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);
  const set = (patch: Partial<NoteDraft>) => setDraft((current) => ({ ...current, ...patch }));

  /** Change le texte en gardant l'historique (annuler / rétablir). */
  const setBody = (body: string) => {
    if (body === draft.body) return;
    setPast((list) => [...list.slice(-49), draft.body]);
    setFuture([]);
    set({ body });
  };
  const undo = () => {
    const previous = past[past.length - 1];
    if (previous === undefined) return;
    setPast((list) => list.slice(0, -1));
    setFuture((list) => [draft.body, ...list]);
    set({ body: previous });
  };
  const redo = () => {
    const next = future[0];
    if (next === undefined) return;
    setFuture((list) => list.slice(1));
    setPast((list) => [...list, draft.body]);
    set({ body: next });
  };

  // Enregistrement automatique : à la sortie de l'écran (bouton retour ou geste).
  const latest = useRef({ draft, noteId: existing?.id, removed: false });
  useEffect(() => {
    latest.current.draft = draft;
  }, [draft]);
  useEffect(() => {
    const ref = latest.current;
    return () => {
      if (ref.removed) return;
      const { title, body } = ref.draft;
      if (!title.trim() && !body.trim()) return;
      saveNote({ ...ref.draft, title: title.trim() || 'Sans titre' }, ref.noteId);
    };
  }, []);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/notes'));

  const format = (kind: Prefix) => {
    setReading(false);
    setBody(applyPrefix(draft.body, reading ? draft.body.length : cursor, kind));
  };

  const size = draft.fontSize ?? 15;
  const family = FONTS.find((entry) => entry.key === draft.font)?.family ?? FontFamily.body;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable style={styles.iconButton} hitSlop={4} accessibilityRole="button" accessibilityLabel="Retour (la note est enregistrée)" onPress={close}>
          <Icon name="chevron_left" size={30} color={c.text} />
        </Pressable>
        <TextInput
          value={draft.title}
          onChangeText={(title) => set({ title })}
          placeholder="Titre"
          placeholderTextColor={c.muted}
          selectionColor={c.link}
          style={styles.titleInput}
          numberOfLines={1}
          accessibilityLabel="Titre de la note"
        />
        <Pressable
          style={[styles.iconButton, reading && styles.iconOn]}
          accessibilityRole="button"
          accessibilityState={{ selected: reading }}
          accessibilityLabel={reading ? 'Quitter le mode lecture' : 'Mode lecture'}
          onPress={() => setReading((value) => !value)}>
          <Icon name="menu_book" size={24} color={c.text} />
        </Pressable>
        <Pressable style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Plus d’actions" onPress={() => setSheet('menu')}>
          <Icon name="more_vert" size={26} color={c.text} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.canvas} contentContainerStyle={styles.canvasContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.band} />
          <View style={styles.page}>
            {reading ? (
              <Pressable
                style={styles.pageInner}
                accessibilityRole="button"
                accessibilityLabel="Modifier le texte"
                onPress={() => {
                  setCursor(draft.body.length);
                  setReading(false);
                }}>
                <NoteBody body={draft.body || ' '} fontSize={size} font={draft.font} onToggle={(index) => setBody(toggleCheck(draft.body, index))} />
              </Pressable>
            ) : (
              <TextInput
                value={draft.body}
                onChangeText={setBody}
                onSelectionChange={(event) => setCursor(event.nativeEvent.selection.start)}
                placeholder="Écrivez ici…"
                placeholderTextColor={c.muted}
                selectionColor={c.link}
                multiline
                autoFocus={!existing}
                textAlignVertical="top"
                style={[styles.pageInput, { fontSize: size, lineHeight: Math.round(size * 1.5), fontFamily: family }]}
                accessibilityLabel="Texte de la note"
              />
            )}
          </View>
          <View style={styles.band}>
            <Text style={styles.pageCount}>1/1</Text>
          </View>
        </ScrollView>

        {/* Barre d'outils */}
        <View style={styles.toolbar}>
          <ToolButton icon="check_box" label="Case à cocher" onPress={() => format('check')} />
          <ToolButton icon="format_list_bulleted" label="Liste à puces" onPress={() => format('bullet')} />
          <ToolButton icon="format_list_numbered" label="Liste numérotée" onPress={() => format('number')} />
          <Pressable style={styles.textTool} accessibilityRole="button" accessibilityLabel={`Police : ${FONTS.find((f) => f.key === draft.font)?.label}`} onPress={() => setSheet('font')}>
            <Text style={[styles.textToolLabel, { fontFamily: family }]}>Aa</Text>
            <Icon name="arrow_drop_down" size={20} color={c.text} />
          </Pressable>
          <Pressable style={styles.textTool} accessibilityRole="button" accessibilityLabel={`Taille du texte : ${size}`} onPress={() => setSheet('size')}>
            <Text style={styles.textToolLabel}>{size}</Text>
            <Icon name="arrow_drop_down" size={20} color={c.text} />
          </Pressable>
          <ToolButton icon="undo" label="Annuler" disabled={past.length === 0} onPress={undo} />
          <ToolButton icon="redo" label="Rétablir" disabled={future.length === 0} onPress={redo} />
        </View>
      </KeyboardAvoidingView>


      <BottomSheet visible={sheet === 'menu'} title="La note" onClose={() => setSheet(null)}>
        <SheetOption
          icon="push_pin"
          label={draft.pinned ? 'Désépingler' : 'Épingler en haut de la liste'}
          onPress={() => {
            set({ pinned: !draft.pinned });
            setSheet(null);
          }}
        />
        {existing ? (
          <SheetOption
            icon="delete"
            label="Supprimer la note"
            danger
            onPress={() => {
              latest.current.removed = true;
              deleteNote(existing.id);
              setSheet(null);
              close();
            }}
          />
        ) : null}
      </BottomSheet>

      <BottomSheet visible={sheet === 'font'} title="Police" onClose={() => setSheet(null)}>
        {FONTS.map((entry) => (
          <SheetOption
            key={entry.key}
            icon={draft.font === entry.key ? 'check_circle' : 'text_fields'}
            label={entry.label}
            onPress={() => {
              set({ font: entry.key });
              setSheet(null);
            }}
          />
        ))}
      </BottomSheet>

      <BottomSheet visible={sheet === 'size'} title="Taille du texte" onClose={() => setSheet(null)}>
        <View style={styles.sizes}>
          {SIZES.map((value) => {
            const on = size === value;
            return (
              <Pressable
                key={value}
                style={[styles.sizeChip, on && styles.sizeChipOn]}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                onPress={() => {
                  set({ fontSize: value });
                  setSheet(null);
                }}>
                <Text style={[styles.sizeText, on && styles.sizeTextOn]}>{value}</Text>
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

function ToolButton({ icon, label, onPress, disabled }: { icon: string; label: string; onPress: () => void; disabled?: boolean }) {
  const { c, styles } = useLook();
  return (
    <Pressable
      style={({ pressed }) => [styles.tool, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}>
      <Icon name={icon} size={24} color={disabled ? c.border : c.text} />
    </Pressable>
  );
}

function makeStyles(c: AppColors) {
  const band = c.dark ? '#0A1326' : '#E8EAED';
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.card },
    flex: { flex: 1 },
    pressed: { opacity: 0.7 },
    topBar: { height: 56, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center', gap: 2 },
    iconButton: { width: 44, height: 44, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
    iconOn: { backgroundColor: c.soft },
    titleInput: {
      flex: 1,
      minWidth: 0,
      width: 0,
      paddingVertical: 8,
      fontFamily: FontFamily.headingBold,
      fontSize: 20,
      lineHeight: 26,
      color: c.text,
      outlineWidth: 0,
      outlineStyle: 'solid',
    },
    canvas: { flex: 1, backgroundColor: band },
    canvasContent: { flexGrow: 1 },
    band: { height: 44, backgroundColor: band, alignItems: 'flex-end', justifyContent: 'flex-start', paddingHorizontal: 12, paddingTop: 4 },
    pageCount: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 17, color: c.muted },
    page: { minHeight: 560, flexGrow: 1, backgroundColor: c.card },
    pageInner: { flex: 1, minHeight: 560, paddingHorizontal: 22, paddingVertical: 18 },
    pageInput: {
      flex: 1,
      minHeight: 560,
      paddingHorizontal: 22,
      paddingVertical: 18,
      color: c.text,
      outlineWidth: 0,
      outlineStyle: 'solid',
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderTopWidth: 1,
      borderTopColor: c.border,
      backgroundColor: c.card,
    },
    tool: { width: 42, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    textTool: { flexDirection: 'row', alignItems: 'center', height: 44, paddingHorizontal: 4 },
    textToolLabel: { fontFamily: FontFamily.bodyMedium, fontSize: 18, lineHeight: 24, color: c.text },
    sizes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingVertical: 6 },
    sizeChip: { minWidth: 56, height: 48, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center', backgroundColor: c.card },
    sizeChipOn: { backgroundColor: c.solid, borderColor: c.solid },
    sizeText: { fontFamily: FontFamily.bodySemiBold, fontSize: 16, lineHeight: 21, color: c.text },
    sizeTextOn: { color: c.solidText },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

function useLook() {
  const c = useAppColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
