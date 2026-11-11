// S-25 - Documents | Module M11 Documents | Phase S9
// La liste d'abord ; Kora aide (document à vérifier, échéances repérées) sans prendre toute la place.
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import {
  BottomSheet,
  Chip,
  PrimaryButton,
  SecondaryButton,
  SheetOption,
  Tag,
  UndoToast,
  kitStyles,
} from '@/components/ui/kit';
import { FontFamily, Serene, Tint } from '@/constants/design';
import { dayOffset, formatDay } from '@/lib/demo-dates';

import { DocIcon, DocRow } from '../components/document-ui';
import { CATEGORIES } from '../data';
import { QueryView } from '@/components/ui/states';
import { useQuery } from '@/hooks/use-query';

import { documentActions, syncDocuments, useDocumentsState } from '../store';
import type { DocCategory, DocScope } from '../types';

const SCOPES: { key: DocScope | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'Tout', icon: 'folder' },
  { key: 'personal', label: 'Personnel', icon: 'lock' },
  { key: 'household', label: 'Foyer', icon: 'group' },
];

export default function DocumentListScreen() {
  const { documents, flash } = useDocumentsState();
  const sync = useQuery('documents', syncDocuments);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [category, setCategory] = useState<DocCategory | 'all'>('all');
  const [scope, setScope] = useState<DocScope | 'all'>('all');
  const [addSheet, setAddSheet] = useState(false);
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
      documents.filter(
        (doc) =>
          (category === 'all' || doc.category === category) &&
          (scope === 'all' || doc.scope === scope) &&
          (!term || doc.title.toLowerCase().includes(term) || CATEGORIES[doc.category].label.toLowerCase().includes(term)),
      ),
    [documents, category, scope, term],
  );
  const toReview = documents.filter((doc) => doc.review);
  const deadlines = documents
    .filter((doc) => doc.due && dayOffset(doc.due.date) >= 0)
    .sort((a, b) => (a.due?.date.getTime() ?? 0) - (b.due?.date.getTime() ?? 0));
  const browsing = !term && category === 'all' && scope === 'all';
  const countFor = (key: DocCategory) => documents.filter((doc) => doc.category === key).length;

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={[kitStyles.content, styles.content]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={sync.refreshing} onRefresh={sync.reload} tintColor={Tint.primary} colors={[Tint.primary]} />}>
        <View style={styles.titleRow}>
          <View style={styles.flex}>
            <Text style={styles.eyebrow}>Coffre sécurisé</Text>
            <Text style={styles.pageTitle}>Documents</Text>
          </View>
          <Tag label="Chiffré" icon="lock" tone="success" />
        </View>
        <Text style={kitStyles.muted}>
          {documents.length} documents • 86 Mo utilisés sur 10 Go
        </Text>

        <View style={[styles.search, focused && kitStyles.inputFocused]}>
          <Icon name="search" size={20} color={focused ? Tint.primary : Serene.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Rechercher un document…"
            placeholderTextColor={Serene.onSurfaceVariant}
            selectionColor={Tint.primary}
            accessibilityLabel="Rechercher un document"
          />
          {query ? (
            <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Effacer" onPress={() => setQuery('')}>
              <Icon name="cancel" size={20} color={Serene.onSurfaceVariant} filled />
            </Pressable>
          ) : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipsScroll}>
          <Chip label="Tous" count={documents.length} selected={category === 'all'} onPress={() => setCategory('all')} />
          {(Object.keys(CATEGORIES) as DocCategory[]).map((key) => (
            <Chip
              key={key}
              label={CATEGORIES[key].label}
              icon={CATEGORIES[key].icon}
              count={countFor(key)}
              selected={category === key}
              onPress={() => setCategory(key)}
            />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipsScroll}>
          {SCOPES.map((entry) => (
            <Chip key={entry.key} label={entry.label} icon={entry.icon} selected={scope === entry.key} onPress={() => setScope(entry.key)} />
          ))}
        </ScrollView>

        {/* Kora : un document à vérifier, en carte compacte */}
        {browsing && toReview.length > 0 ? (
          <View style={styles.review}>
            <View style={styles.reviewHead}>
              <Icon name="auto_awesome" size={18} color={Tint.primary} />
              <Text style={styles.reviewLabel}>
                À vérifier • {toReview.length} document{toReview.length > 1 ? 's' : ''} lu{toReview.length > 1 ? 's' : ''} par Kora
              </Text>
            </View>
            {toReview.slice(0, 2).map((doc) => (
              <Pressable
                key={doc.id}
                style={({ pressed }) => [styles.reviewRow, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`Vérifier ${doc.title}`}
                onPress={() => router.push({ pathname: '/documents/detail', params: { id: doc.id } })}>
                <DocIcon doc={doc} size={40} />
                <View style={styles.flex}>
                  <Text style={styles.reviewTitle} numberOfLines={1}>
                    {doc.title}
                  </Text>
                  <Text style={styles.meta} numberOfLines={1}>
                    {doc.due ? `${doc.due.amount} • ${doc.due.label.toLowerCase()} le ${formatDay(doc.due.date)}` : 'Informations repérées à confirmer'}
                  </Text>
                </View>
                <Text style={styles.reviewAction}>Vérifier</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {/* Échéances repérées dans les documents */}
        {browsing && deadlines.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Échéances à venir</Text>
            <View style={[kitStyles.card, styles.deadlines]}>
              {deadlines.map((doc, index) => (
                <Pressable
                  key={doc.id}
                  style={({ pressed }) => [styles.deadline, index > 0 && styles.deadlineBorder, pressed && styles.deadlinePressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`${doc.title}, ${doc.due?.label} le ${doc.due ? formatDay(doc.due.date) : ''}`}
                  onPress={() => router.push({ pathname: '/documents/detail', params: { id: doc.id } })}>
                  <View style={styles.dateBlock}>
                    <Text style={styles.dateDay}>{doc.due?.date.getDate()}</Text>
                    <Text style={styles.dateMonth}>{doc.due ? formatDay(doc.due.date).split(' ')[1] : ''}</Text>
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.deadlineTitle} numberOfLines={1}>
                      {doc.title}
                    </Text>
                    <Text style={styles.meta}>
                      {doc.due?.label} • dans {doc.due ? dayOffset(doc.due.date) : 0} jours
                    </Text>
                  </View>
                  {doc.due?.amount ? <Text style={styles.amount}>{doc.due.amount}</Text> : null}
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        <View style={styles.listHead}>
          <Text style={styles.sectionTitleInline}>{browsing ? 'Tous les documents' : 'Résultats'}</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{filtered.length}</Text>
          </View>
        </View>

        <QueryView query={sync} empty={{ icon: 'folder_open', title: 'Votre coffre est vide', text: 'Scannez ou importez un premier document : Kora repérera les dates et montants.', actionLabel: 'Scanner ou importer', onAction: () => setAddSheet(true) }}>
        {filtered.length === 0 ? (
          <View style={[kitStyles.card, styles.empty]}>
            <Icon name="search_off" size={28} color={Tint.primary} />
            <Text style={kitStyles.title}>Aucun document trouvé</Text>
            <Text style={[kitStyles.muted, styles.center]}>Essayez un autre mot-clé ou retirez un filtre.</Text>
            <SecondaryButton
              label="Effacer les filtres"
              onPress={() => {
                setQuery('');
                setCategory('all');
                setScope('all');
              }}
            />
          </View>
        ) : (
          <View style={styles.stack}>
            {filtered.map((doc) => (
              <DocRow key={doc.id} doc={doc} />
            ))}
          </View>
        )}
        </QueryView>
      </ScrollView>

      <View style={styles.fabWrap} pointerEvents="box-none">
        <PrimaryButton label="Scanner ou importer" icon="document_scanner" onPress={() => setAddSheet(true)} style={styles.fab} />
      </View>

      <BottomSheet visible={addSheet} title="Ajouter un document" subtitle="Kora repère les dates et montants ; vous vérifiez." onClose={() => setAddSheet(false)}>
        <SheetOption
          icon="photo_camera"
          label="Scanner avec l’appareil photo"
          hint="Démo : ajoute une quittance de loyer"
          onPress={() => {
            setAddSheet(false);
            const id = documentActions.scan();
            router.push({ pathname: '/documents/detail', params: { id } });
          }}
        />
        <SheetOption
          icon="upload_file"
          label="Importer un fichier"
          hint="PDF ou image depuis le téléphone"
          onPress={() => {
            setAddSheet(false);
            setToast({ text: 'Démo : ouverture des fichiers du téléphone' });
          }}
        />
        <SheetOption
          icon="mail"
          label="Depuis un e-mail"
          hint="Pièces jointes de votre messagerie connectée"
          onPress={() => {
            setAddSheet(false);
            router.push('/integrations/email');
          }}
        />
      </BottomSheet>

      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={88} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    minWidth: 0,
  },
  center: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  content: {
    paddingTop: 4,
    paddingBottom: 110,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 8,
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
    letterSpacing: -0.5,
    color: Tint.navy,
  },
  search: {
    marginTop: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    outlineWidth: 0,
    outlineStyle: 'solid',
    fontFamily: FontFamily.body,
    fontSize: 16,
    color: Tint.navy,
    paddingVertical: 0,
  },
  chipsScroll: {
    marginTop: 10,
  },
  chips: {
    gap: 8,
  },
  review: {
    marginTop: 18,
    padding: 14,
    gap: 10,
    borderRadius: 20,
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#99f6e4',
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Tint.primary,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 14,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  reviewTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  reviewAction: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.primary,
  },
  meta: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
    color: Tint.navy,
  },
  deadlines: {
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  deadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  deadlineBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
  },
  deadlinePressed: {
    backgroundColor: Tint.soft,
  },
  dateBlock: {
    width: 48,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Tint.soft,
    alignItems: 'center',
  },
  dateDay: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    lineHeight: 24,
    color: Tint.navy,
  },
  dateMonth: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  deadlineTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  amount: {
    fontFamily: FontFamily.headingBold,
    fontSize: 16,
    lineHeight: 22,
    color: Tint.navy,
  },
  listHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 10,
  },
  sectionTitleInline: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
    color: Tint.navy,
  },
  countPill: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: 12,
    backgroundColor: Tint.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    color: Tint.navy,
  },
  stack: {
    gap: 10,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  fabWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  fab: {
    width: '100%',
    maxWidth: 528,
  },
});
