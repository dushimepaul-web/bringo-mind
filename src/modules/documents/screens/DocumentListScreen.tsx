// S-25 - Documents | Module M11 Documents | Phase S9
// Dans l'esprit de l'app Fichiers du téléphone : stockage, dossiers par catégorie, onglets Tout / Personnel / Foyer,
// une ligne « À vérifier » discrète, les échéances, puis les documents récents (liste, cartes ou grille).
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { BottomSheet, SheetOption, UndoToast, useKitStyles } from '@/components/ui/kit';
import { QueryView } from '@/components/ui/states';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { useQuery } from '@/hooks/use-query';
import { dayOffset, formatDay } from '@/lib/demo-dates';

import { CATEGORIES, CATEGORIES_DARK, STORAGE } from '../data';
import { documentActions, syncDocuments, useDocumentsState } from '../store';
import type { DocCategory, DocItem, DocScope } from '../types';
import { DOCS_VIEWS, setDocsView, useDocsView } from '../view-mode';

const SCOPES: { key: DocScope | 'all'; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'personal', label: 'Personnel' },
  { key: 'household', label: 'Foyer' },
];

/** Couleurs des catégories du mode actuel. */
function useCategories() {
  return useScopedColors().dark ? CATEGORIES_DARK : CATEGORIES;
}

export default function DocumentListScreen() {
  const { c, styles } = useLook();
  const kit = useKitStyles();
  const categories = useCategories();
  const { documents, flash } = useDocumentsState();
  const sync = useQuery('documents', syncDocuments);
  const view = useDocsView();
  const viewInfo = DOCS_VIEWS.find((entry) => entry.key === view) ?? DOCS_VIEWS[0];
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<DocCategory | 'all'>('all');
  const [scope, setScope] = useState<DocScope | 'all'>('all');
  const { scan } = useLocalSearchParams<{ scan?: string }>();
  const [sheet, setSheet] = useState<'add' | 'view' | null>(scan === '1' ? 'add' : null);
  const [menuDoc, setMenuDoc] = useState<DocItem | null>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (flash) {
        setToast(flash);
        documentActions.setFlash(null);
      }
    }, [flash]),
  );

  const term = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      documents
        .filter(
          (doc) =>
            (category === 'all' || doc.category === category) &&
            (scope === 'all' || doc.scope === scope) &&
            (!term || doc.title.toLowerCase().includes(term) || CATEGORIES[doc.category].label.toLowerCase().includes(term)),
        )
        .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime()),
    [documents, category, scope, term],
  );
  const toReview = documents.filter((doc) => doc.review);
  const deadlines = documents
    .filter((doc) => doc.due && dayOffset(doc.due.date) >= 0 && (scope === 'all' || doc.scope === scope))
    .sort((a, b) => (a.due?.date.getTime() ?? 0) - (b.due?.date.getTime() ?? 0))
    .slice(0, 3);
  const countFor = (key: DocCategory) => documents.filter((doc) => doc.category === key && (scope === 'all' || doc.scope === scope)).length;
  const usedShare = STORAGE.used / STORAGE.total;

  return (
    <SafeAreaView style={kit.safe} edges={['top']}>
      <AppHeader />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={sync.refreshing} onRefresh={sync.reload} tintColor={c.link} colors={[c.link]} />}>
        {/* Titre et actions */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Documents</Text>
          <View style={styles.titleActions}>
            <Pressable style={({ pressed }) => [styles.square, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`Affichage : ${viewInfo.label}`} onPress={() => setSheet('view')}>
              <Icon name={viewInfo.icon} size={22} color={c.text} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.square, searching && styles.squareOn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={searching ? 'Fermer la recherche' : 'Rechercher un document'}
              onPress={() => {
                setSearching((value) => !value);
                setQuery('');
              }}>
              <Icon name={searching ? 'close' : 'search'} size={22} color={c.text} />
            </Pressable>
            <Pressable style={({ pressed }) => [styles.square, styles.addSquare, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Ajouter un document" onPress={() => setSheet('add')}>
              <Icon name="add" size={26} color={c.solidText} />
            </Pressable>
          </View>
        </View>

        {searching ? (
          <View style={styles.search}>
            <Icon name="search" size={20} color={c.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un document…"
              placeholderTextColor={c.muted}
              selectionColor={c.link}
              value={query}
              onChangeText={setQuery}
              autoFocus
              accessibilityLabel="Rechercher un document"
            />
          </View>
        ) : null}

        {/* Stockage, comme sur le téléphone */}
        <View style={styles.storage}>
          <View style={styles.storageRow}>
            <Text style={styles.storageText}>
              {documents.length} documents · {STORAGE.used} Mo sur {STORAGE.total / 1024} Go
            </Text>
            <View style={styles.locked}>
              <Icon name="lock" size={14} color={c.link} filled />
              <Text style={styles.lockedText}>Chiffré</Text>
            </View>
          </View>
          <View style={styles.storageTrack}>
            <View style={[styles.storageFill, { width: `${Math.max(2, usedShare * 100)}%` }]} />
          </View>
        </View>

        {/* Onglets Tout / Personnel / Foyer */}
        <View style={styles.segments} accessibilityRole="tablist">
          {SCOPES.map((entry) => {
            const on = scope === entry.key;
            return (
              <Pressable key={entry.key} style={[styles.segment, on && styles.segmentOn]} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setScope(entry.key)}>
                <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{entry.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Dossiers par catégorie */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.foldersScroll} contentContainerStyle={styles.folders}>
          {(Object.keys(CATEGORIES) as DocCategory[]).map((key) => {
            const meta = categories[key];
            const on = category === key;
            return (
              <Pressable
                key={key}
                style={({ pressed }) => [styles.folder, on && { borderColor: meta.fg }, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${meta.label}, ${countFor(key)} documents`}
                onPress={() => setCategory(on ? 'all' : key)}>
                <View style={[styles.folderIcon, { backgroundColor: meta.bg }]}>
                  <Icon name={on ? 'folder_open' : meta.icon} size={24} color={meta.fg} filled />
                </View>
                <Text style={styles.folderLabel} numberOfLines={1}>
                  {meta.label}
                </Text>
                <Text style={styles.folderCount}>{countFor(key)}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Kora : documents à vérifier, sur une seule ligne */}
        {toReview.length > 0 ? (
          <Pressable
            style={({ pressed }) => [styles.review, pressed && styles.pressed]}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/documents/detail', params: { id: toReview[0].id } })}>
            <Icon name="auto_awesome" size={20} color={c.link} />
            <Text style={styles.reviewText} numberOfLines={1}>
              {toReview.length === 1 ? '1 document lu par Kora' : `${toReview.length} documents lus par Kora`}
            </Text>
            <Text style={styles.reviewLink}>Vérifier</Text>
            <Icon name="chevron_right" size={20} color={c.link} />
          </Pressable>
        ) : null}

        <QueryView
          query={sync}
          empty={{
            icon: 'folder_open',
            title: 'Votre coffre est vide',
            text: 'Scannez ou importez un premier document : Kora repérera les dates et montants.',
            actionLabel: 'Ajouter un document',
            onAction: () => setSheet('add'),
          }}>
          {/* Échéances repérées */}
          {deadlines.length > 0 && category === 'all' && !term ? (
            <View style={styles.block}>
              <Text style={styles.blockTitle}>Échéances à venir</Text>
              <View style={styles.listCard}>
                {deadlines.map((doc, index) => (
                  <Pressable
                    key={doc.id}
                    style={({ pressed }) => [styles.dueRow, index > 0 && styles.divider, pressed && styles.rowPressed]}
                    accessibilityRole="button"
                    onPress={() => router.push({ pathname: '/documents/detail', params: { id: doc.id } })}>
                    <View style={styles.dueDate}>
                      <Text style={styles.dueDay}>{doc.due?.date.getDate()}</Text>
                      <Text style={styles.dueMonth}>{formatDay(doc.due!.date).split(' ')[1]}</Text>
                    </View>
                    <View style={styles.flex}>
                      <Text style={styles.rowTitle} numberOfLines={1}>
                        {doc.title}
                      </Text>
                      <Text style={styles.rowMeta}>
                        {doc.due?.label} · dans {dayOffset(doc.due!.date)} jours
                      </Text>
                    </View>
                    {doc.due?.amount ? <Text style={styles.amount}>{doc.due.amount}</Text> : null}
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {/* Documents récents */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>{category === 'all' ? 'Récents' : CATEGORIES[category].label}</Text>
            {filtered.length === 0 ? (
              <View style={styles.empty}>
                <Icon name="search_off" size={30} color={c.link} />
                <Text style={styles.emptyTitle}>Aucun document ne correspond</Text>
              </View>
            ) : view === 'grid' ? (
              <View style={styles.grid}>
                {filtered.map((doc) => (
                  <DocTile key={doc.id} doc={doc} onMenu={() => setMenuDoc(doc)} />
                ))}
              </View>
            ) : view === 'cards' ? (
              <View style={styles.cards}>
                {filtered.map((doc) => (
                  <DocCard key={doc.id} doc={doc} onMenu={() => setMenuDoc(doc)} />
                ))}
              </View>
            ) : (
              <View style={styles.listCard}>
                {filtered.map((doc, index) => (
                  <DocLine key={doc.id} doc={doc} first={index === 0} onMenu={() => setMenuDoc(doc)} />
                ))}
              </View>
            )}
          </View>
        </QueryView>
      </ScrollView>

      {/* Ajouter */}
      <BottomSheet visible={sheet === 'add'} title="Ajouter un document" subtitle="Kora repère les dates et montants ; vous vérifiez." onClose={() => setSheet(null)}>
        <SheetOption
          icon="photo_camera"
          label="Scanner avec l’appareil photo"
          hint="Démo : ajoute une quittance de loyer"
          onPress={() => {
            setSheet(null);
            const id = documentActions.scan();
            router.push({ pathname: '/documents/detail', params: { id } });
          }}
        />
        <SheetOption
          icon="upload_file"
          label="Importer un fichier"
          hint="PDF ou image depuis le téléphone"
          onPress={() => {
            setSheet(null);
            setToast({ text: 'Démo : ouverture des fichiers du téléphone' });
          }}
        />
        <SheetOption
          icon="mail"
          label="Depuis un e-mail"
          hint="Pièces jointes de votre messagerie connectée"
          onPress={() => {
            setSheet(null);
            router.push('/integrations/email');
          }}
        />
      </BottomSheet>

      {/* Affichage */}
      <BottomSheet visible={sheet === 'view'} title="Affichage" subtitle="Choisissez comment voir vos documents." onClose={() => setSheet(null)}>
        {DOCS_VIEWS.map((entry) => (
          <SheetOption
            key={entry.key}
            icon={view === entry.key ? 'check_circle' : entry.icon}
            label={entry.label}
            hint={entry.hint}
            onPress={() => {
              setDocsView(entry.key);
              setSheet(null);
            }}
          />
        ))}
      </BottomSheet>

      {/* Actions d'un document */}
      <BottomSheet visible={menuDoc !== null} title={menuDoc?.title ?? ''} onClose={() => setMenuDoc(null)}>
        {menuDoc ? (
          <>
            <SheetOption icon="ios_share" label="Partager" onPress={() => { setMenuDoc(null); setToast({ text: 'Démo : partage du document' }); }} />
            <SheetOption
              icon={menuDoc.scope === 'household' ? 'lock' : 'group'}
              label={menuDoc.scope === 'household' ? 'Rendre personnel' : 'Partager avec le foyer'}
              onPress={() => {
                setMenuDoc(null);
                const undo = documentActions.setScope(menuDoc.id, menuDoc.scope === 'household' ? 'personal' : 'household');
                setToast({ text: menuDoc.scope === 'household' ? 'Document rendu personnel.' : 'Document partagé avec le foyer.', undo });
              }}
            />
            <SheetOption icon="edit" label="Renommer ou déplacer" onPress={() => { setMenuDoc(null); router.push({ pathname: '/documents/detail', params: { id: menuDoc.id } }); }} />
            <SheetOption
              icon="delete"
              label="Supprimer"
              danger
              onPress={() => {
                setMenuDoc(null);
                const undo = documentActions.remove(menuDoc.id);
                setToast({ text: 'Document supprimé.', undo });
              }}
            />
          </>
        ) : null}
      </BottomSheet>

      {toast ? <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={88} /> : null}
    </SafeAreaView>
  );
}

/** Pictogramme du type de fichier, dans la couleur de la catégorie. */
function FileIcon({ doc, size = 44 }: { doc: DocItem; size?: number }) {
  const meta = useCategories()[doc.category];
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.28, backgroundColor: meta.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={doc.fileType === 'PDF' ? 'picture_as_pdf' : 'image'} size={size * 0.5} color={meta.fg} />
    </View>
  );
}

const open = (doc: DocItem) => () => router.push({ pathname: '/documents/detail', params: { id: doc.id } });

function DocLine({ doc, first, onMenu }: { doc: DocItem; first: boolean; onMenu: () => void }) {
  const { c, styles } = useLook();
  return (
    <Pressable style={({ pressed }) => [styles.line, !first && styles.divider, pressed && styles.rowPressed]} accessibilityRole="button" accessibilityLabel={doc.title} onPress={open(doc)}>
      <FileIcon doc={doc} />
      <View style={styles.flex}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {doc.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.rowMeta}>
            {doc.size} · {formatDay(doc.addedAt)}
          </Text>
          {doc.scope === 'household' ? <Icon name="group" size={14} color={c.link} /> : null}
          {doc.review ? <Icon name="auto_awesome" size={14} color={c.link} /> : null}
        </View>
      </View>
      <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel={`Actions pour ${doc.title}`} onPress={onMenu}>
        <Icon name="more_vert" size={22} color={c.muted} />
      </Pressable>
    </Pressable>
  );
}

function DocCard({ doc, onMenu }: { doc: DocItem; onMenu: () => void }) {
  const { c, styles } = useLook();
  const meta = useCategories()[doc.category];
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.rowPressed]} accessibilityRole="button" accessibilityLabel={doc.title} onPress={open(doc)}>
      <View style={styles.cardTop}>
        <FileIcon doc={doc} size={48} />
        <View style={styles.flex}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {doc.title}
          </Text>
          <Text style={styles.rowMeta}>
            {doc.fileType} · {doc.size} · {formatDay(doc.addedAt)}
          </Text>
        </View>
        <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel={`Actions pour ${doc.title}`} onPress={onMenu}>
          <Icon name="more_horiz" size={22} color={c.text} />
        </Pressable>
      </View>
      <View style={styles.pills}>
        <View style={[styles.pill, { backgroundColor: meta.bg }]}>
          <Text style={[styles.pillText, { color: meta.fg }]}>{meta.label}</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: c.soft }]}>
          <Icon name={doc.scope === 'household' ? 'group' : 'lock'} size={13} color={c.text} />
          <Text style={[styles.pillText, { color: c.text }]}>{doc.scope === 'household' ? 'Foyer' : 'Personnel'}</Text>
        </View>
        {doc.status ? <Text style={styles.rowMeta}>{doc.status}</Text> : null}
      </View>
    </Pressable>
  );
}

function DocTile({ doc, onMenu }: { doc: DocItem; onMenu: () => void }) {
  const { c, styles } = useLook();
  const meta = useCategories()[doc.category];
  return (
    <Pressable style={({ pressed }) => [styles.tile, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={doc.title} onPress={open(doc)}>
      <View style={[styles.preview, { backgroundColor: meta.bg }]}>
        <Icon name={meta.icon} size={34} color={meta.fg} />
        <View style={styles.fileBadge}>
          <Text style={styles.fileBadgeText}>{doc.fileType}</Text>
        </View>
      </View>
      <View style={styles.tileFoot}>
        <View style={styles.flex}>
          <Text style={styles.tileTitle} numberOfLines={1}>
            {doc.title}
          </Text>
          <Text style={styles.rowMeta}>{formatDay(doc.addedAt)}</Text>
        </View>
        <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel={`Actions pour ${doc.title}`} onPress={onMenu}>
          <Icon name="more_vert" size={20} color={c.muted} />
        </Pressable>
      </View>
    </Pressable>
  );
}

function makeStyles(c: AppColors) {
  const surface = {
    borderRadius: 16,
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
    flex: { flex: 1, minWidth: 0 },
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
    storage: { gap: 6 },
    storageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    storageText: { fontFamily: FontFamily.bodyMedium, fontSize: 13, lineHeight: 18, color: c.muted },
    locked: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    lockedText: { fontFamily: FontFamily.bodySemiBold, fontSize: 13, lineHeight: 17, color: c.link },
    storageTrack: { height: 6, borderRadius: 3, backgroundColor: c.chartTrack, overflow: 'hidden' },
    storageFill: { height: '100%', borderRadius: 3, backgroundColor: c.link },
    segments: { flexDirection: 'row', padding: 4, borderRadius: 14, backgroundColor: c.dark ? '#13213D' : '#E8EEF3' },
    segment: { flex: 1, minHeight: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    segmentOn: { backgroundColor: c.dark ? '#22365C' : '#FFFFFF' },
    segmentText: { fontFamily: FontFamily.bodyMedium, fontSize: 14, lineHeight: 19, color: c.muted },
    segmentTextOn: { fontFamily: FontFamily.bodySemiBold, color: c.text },
    foldersScroll: { marginHorizontal: -16 },
    folders: { gap: 10, paddingHorizontal: 16 },
    folder: { ...surface, width: 100, padding: 12, gap: 6 },
    folderIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    folderLabel: { fontFamily: FontFamily.bodySemiBold, fontSize: 14, lineHeight: 19, color: c.text },
    folderCount: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 17, color: c.muted },
    review: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 46, paddingHorizontal: 14, borderRadius: 14, backgroundColor: c.tintMint },
    reviewText: { flex: 1, fontFamily: FontFamily.bodyMedium, fontSize: 14, lineHeight: 19, color: c.text },
    reviewLink: { fontFamily: FontFamily.bodyBold, fontSize: 14, lineHeight: 19, color: c.link },
    block: { gap: 8 },
    blockTitle: { fontFamily: FontFamily.headingBold, fontSize: 17, lineHeight: 22, color: c.text },
    listCard: { ...surface, overflow: 'hidden' },
    divider: { borderTopWidth: 1, borderTopColor: c.border },
    rowPressed: { backgroundColor: c.soft },
    dueRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: c.card },
    dueDate: { width: 46, height: 46, borderRadius: 12, backgroundColor: c.soft, alignItems: 'center', justifyContent: 'center' },
    dueDay: { fontFamily: FontFamily.headingBold, fontSize: 17, lineHeight: 20, color: c.text },
    dueMonth: { fontFamily: FontFamily.bodyMedium, fontSize: 13, lineHeight: 15, color: c.muted },
    amount: { fontFamily: FontFamily.headingBold, fontSize: 15, lineHeight: 20, color: c.text },
    line: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: c.card },
    rowTitle: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, lineHeight: 20, color: c.text },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    rowMeta: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 18, color: c.muted },
    cards: { gap: 10 },
    card: { ...surface, padding: 14, gap: 10 },
    cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    cardTitle: { fontFamily: FontFamily.headingBold, fontSize: 15, lineHeight: 20, color: c.text },
    pills: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
    pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 3, borderRadius: Radius.full },
    pillText: { fontFamily: FontFamily.bodySemiBold, fontSize: 13, lineHeight: 17 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    tile: { width: '47.5%', flexGrow: 1, gap: 8 },
    preview: { height: 130, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    fileBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, backgroundColor: c.card },
    fileBadgeText: { fontFamily: FontFamily.bodyBold, fontSize: 13, lineHeight: 16, color: c.text },
    tileFoot: { flexDirection: 'row', alignItems: 'flex-start', gap: 4, paddingHorizontal: 2 },
    tileTitle: { fontFamily: FontFamily.bodySemiBold, fontSize: 14, lineHeight: 19, color: c.text },
    empty: { alignItems: 'center', gap: 8, paddingVertical: 32 },
    emptyTitle: { fontFamily: FontFamily.headingBold, fontSize: 16, lineHeight: 21, color: c.text },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre dans le module Documents, converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
