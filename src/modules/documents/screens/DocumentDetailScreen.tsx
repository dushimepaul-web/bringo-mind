// S-26 - Détail d'un document | Module M11 Documents | Phase S9
// Le bon document à chaque fois ; Kora propose, la personne vérifie ; actions reliées aux autres modules.
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, IconButton, PrimaryButton, SecondaryButton, SheetOption, TopBar, UndoToast, useKitStyles } from '@/components/ui/kit';
import { RadioRow, SettingsRow, SettingsSection } from '@/components/ui/settings';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily } from '@/constants/design';
import { addDays, atTime, formatDay } from '@/lib/demo-dates';

import { DocIcon, ScopeTag } from '../components/document-ui';
import { CATEGORIES, CATEGORIES_DARK, HOUSEHOLD_NAME, addedLabel, percent } from '../data';
import { documentActions, useDocument } from '../store';
import type { DocCategory, DocScope } from '../types';

type Sheet = 'menu' | 'rename' | 'move' | 'edit' | 'delete' | { scope: DocScope } | null;

export default function DocumentDetailScreen() {
  const categoryStyles = useCategoryStyles();
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const doc = useDocument(id);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const [name, setName] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [focus, setFocus] = useState<string | null>(null);

  if (!doc) {
    return (
      <SafeAreaView style={kitStyles.safe} edges={['top']}>
        <TopBar title="Document" fallback="/documents" />
        <View style={[kitStyles.content, styles.content]}>
          <View style={[kitStyles.card, styles.missing]}>
            <Icon name="folder_off" size={28} color={c.link} />
            <Text style={kitStyles.title}>Document introuvable</Text>
            <Text style={[kitStyles.muted, styles.center]}>Il a peut-être été supprimé.</Text>
            <SecondaryButton label="Voir mes documents" onPress={() => router.replace('/documents')} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const category = categoryStyles[doc.category];
  const close = () => setSheet(null);
  const openEdit = () => {
    setFields(Object.fromEntries((doc.extracted ?? []).map((field) => [field.key, field.value])));
    setSheet('edit');
  };
  // Rappel deux jours avant l'échéance, à 9h00.
  const reminderAt = doc.due ? atTime(addDays(doc.due.date, -2), 9) : undefined;

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar
        title="Document"
        fallback="/documents"
        right={<IconButton icon="more_horiz" label="Plus d’actions" onPress={() => setSheet('menu')} />}
      />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        {/* Aperçu */}
        <View style={[kitStyles.card, styles.hero]}>
          <View style={[styles.preview, { backgroundColor: category.bg }]}>
            <DocIcon doc={doc} size={64} />
            <View style={styles.fileType}>
              <Text style={styles.fileTypeText}>{doc.fileType}</Text>
            </View>
          </View>
          <Text style={styles.title}>{doc.title}</Text>
          <Text style={[kitStyles.muted, styles.center]}>
            {doc.size} • ajouté {addedLabel(doc.addedAt)} par {doc.addedBy}
          </Text>
          <View style={styles.tags}>
            <Text style={[styles.category, { color: category.fg }]}>{category.label}</Text>
            <ScopeTag doc={doc} />
          </View>
          {doc.status ? <Text style={styles.status}>{doc.status}</Text> : null}
          {/* Barre d'actions, comme la galerie du téléphone */}
          <View style={styles.actionBar}>
            <ActionButton icon="ios_share" label="Partager" onPress={() => setToast({ text: 'Démo : feuille de partage du téléphone' })} />
            <ActionButton icon="download" label="Télécharger" onPress={() => setToast({ text: 'Démo : document téléchargé' })} />
            <ActionButton
              icon="notifications"
              label="Rappel"
              onPress={() =>
                router.push({
                  pathname: '/reminders/add',
                  params: {
                    linkKind: 'document',
                    linkId: doc.id,
                    linkTitle: doc.due ? `${doc.due.label} — ${doc.title}` : doc.title,
                    ...(reminderAt ? { at: reminderAt.toISOString() } : {}),
                  },
                })
              }
            />
            <ActionButton icon="more_horiz" label="Plus" onPress={() => setSheet('menu')} />
          </View>
        </View>

        {/* Vérification demandée après une analyse de Kora */}
        {doc.review ? (
          <View style={styles.review}>
            <View style={styles.reviewHead}>
              <Icon name="auto_awesome" size={20} color={c.link} />
              <Text style={styles.reviewTitle}>Kora a lu ce document</Text>
            </View>
            <Text style={styles.reviewText}>
              Vérifiez les informations repérées ci-dessous{doc.confidence ? ` (fiabilité ${percent(doc.confidence)})` : ''}. Corrigez-les si
              besoin.
            </Text>
            <View style={styles.reviewActions}>
              <PrimaryButton
                label="C’est correct"
                icon="check"
                style={styles.flex}
                onPress={() => {
                  documentActions.confirmReview(doc.id);
                  setToast({ text: 'Informations confirmées' });
                }}
              />
              <SecondaryButton label="Corriger" icon="edit" onPress={openEdit} />
            </View>
          </View>
        ) : null}

        {doc.extracted ? (
          <SettingsSection title="Informations repérées" icon="fact_check" footer="Repérées par Kora. Vous pouvez les modifier à tout moment.">
            {doc.extracted.map((field, index) => (
              <SettingsRow key={field.key} first={index === 0} icon={field.icon} title={field.value} subtitle={field.label} />
            ))}
            <SettingsRow icon="edit" title="Modifier les informations" onPress={openEdit} />
          </SettingsSection>
        ) : null}

        <SettingsSection
          title="Qui peut le voir"
          icon="visibility"
          footer={doc.scope === 'household' ? `Visible par les membres de ${HOUSEHOLD_NAME}.` : 'Visible uniquement par vous.'}>
          <RadioRow
            first
            title="Personnel"
            subtitle="Visible uniquement par vous"
            selected={doc.scope === 'personal'}
            onPress={() => doc.scope !== 'personal' && setSheet({ scope: 'personal' })}
          />
          <RadioRow
            title={`Partagé avec ${HOUSEHOLD_NAME}`}
            subtitle="Thomas pourra le voir et le télécharger"
            selected={doc.scope === 'household'}
            onPress={() => doc.scope !== 'household' && setSheet({ scope: 'household' })}
          />
        </SettingsSection>

        {doc.linked ? (
          <SettingsSection title="Lié à" icon="link">
            <SettingsRow
              first
              icon={doc.linked.kind === 'task' ? 'task_alt' : 'event'}
              title={doc.linked.title}
              subtitle={doc.linked.kind === 'task' ? 'Tâche' : 'Événement'}
              onPress={() =>
                router.push(
                  doc.linked?.kind === 'task'
                    ? { pathname: '/tasks/detail', params: { id: doc.linked.id } }
                    : { pathname: '/calendar/detail', params: { id: doc.linked?.id ?? '' } },
                )
              }
            />
          </SettingsSection>
        ) : null}

        <SettingsSection title="Passer à l’action" icon="bolt">
          <SettingsRow
            first
            icon="notifications"
            title="Créer un rappel"
            subtitle={reminderAt ? `Proposé le ${formatDay(reminderAt)} à 9h00, deux jours avant` : 'Rattaché à ce document'}
            onPress={() =>
              router.push({
                pathname: '/reminders/add',
                params: {
                  linkKind: 'document',
                  linkId: doc.id,
                  linkTitle: doc.due ? `${doc.due.label} — ${doc.title}` : doc.title,
                  ...(reminderAt ? { at: reminderAt.toISOString() } : {}),
                },
              })
            }
          />
          {doc.due ? (
            <SettingsRow
              icon="event"
              title="Ajouter l’échéance au calendrier"
              subtitle={`${doc.due.label} le ${formatDay(doc.due.date)}${doc.due.amount ? ` • ${doc.due.amount}` : ''}`}
              onPress={() =>
                router.push({
                  pathname: '/calendar/add',
                  params: {
                    title: `${doc.due?.label} — ${doc.title}`,
                    date: doc.due?.date.toISOString() ?? '',
                    allDay: '1',
                    description: doc.due?.amount ? `Montant : ${doc.due.amount}` : '',
                  },
                })
              }
            />
          ) : null}
          <SettingsRow
            icon="add_task"
            title="Créer une tâche"
            subtitle={doc.due ? `Échéance le ${formatDay(doc.due.date)}` : 'À partir de ce document'}
            onPress={() =>
              router.push({
                pathname: '/tasks/add',
                params: {
                  title: doc.due ? `${doc.due.label === 'Prélèvement' ? 'Vérifier le prélèvement' : doc.due.label} — ${doc.title}` : `Traiter : ${doc.title}`,
                  description: `Document : ${doc.title}`,
                  ...(doc.due ? { due: doc.due.date.toISOString() } : {}),
                },
              })
            }
          />
        </SettingsSection>

        <SecondaryButton label="Supprimer le document" icon="delete" danger style={styles.delete} onPress={() => setSheet('delete')} />
      </ScrollView>

      {/* Plus d'actions */}
      <BottomSheet visible={sheet === 'menu'} title={doc.title} subtitle={`${category.label} • ${doc.size}`} onClose={close}>
        <SheetOption
          icon="edit"
          label="Renommer"
          onPress={() => {
            setName(doc.title);
            setSheet('rename');
          }}
        />
        <SheetOption icon="drive_file_move" label="Changer de catégorie" hint={`Actuellement : ${category.label}`} onPress={() => setSheet('move')} />
        <SheetOption icon="delete" label="Supprimer" danger onPress={() => setSheet('delete')} />
      </BottomSheet>

      {/* Renommer */}
      <BottomSheet visible={sheet === 'rename'} title="Renommer le document" onClose={close}>
        <TextInput
          style={[kitStyles.input, focus === 'name' && kitStyles.inputFocused]}
          value={name}
          onChangeText={setName}
          onFocus={() => setFocus('name')}
          onBlur={() => setFocus(null)}
          selectionColor={c.link}
          accessibilityLabel="Nom du document"
        />
        <PrimaryButton
          label="Enregistrer le nom"
          icon="check"
          disabled={name.trim().length < 2 || name.trim() === doc.title}
          onPress={() => {
            documentActions.rename(doc.id, name);
            close();
            setToast({ text: 'Document renommé' });
          }}
        />
      </BottomSheet>

      {/* Changer de catégorie */}
      <BottomSheet visible={sheet === 'move'} title="Changer de catégorie" onClose={close}>
        <View style={styles.list}>
          {(Object.keys(CATEGORIES) as DocCategory[]).map((key, index) => (
            <RadioRow
              key={key}
              first={index === 0}
              title={CATEGORIES[key].label}
              selected={doc.category === key}
              onPress={() => {
                const previous = doc.category;
                documentActions.move(doc.id, key);
                close();
                setToast({ text: `Déplacé dans ${CATEGORIES[key].label}`, undo: () => documentActions.move(doc.id, previous) });
              }}
            />
          ))}
        </View>
      </BottomSheet>

      {/* Corriger les informations repérées */}
      <BottomSheet visible={sheet === 'edit'} title="Corriger les informations" subtitle="Ce que vous saisissez remplace ce que Kora a repéré." onClose={close}>
        {(doc.extracted ?? []).map((field) => (
          <View key={field.key} style={styles.field}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TextInput
              style={[kitStyles.input, focus === field.key && kitStyles.inputFocused]}
              value={fields[field.key] ?? ''}
              onChangeText={(value) => setFields((current) => ({ ...current, [field.key]: value }))}
              onFocus={() => setFocus(field.key)}
              onBlur={() => setFocus(null)}
              selectionColor={c.link}
              accessibilityLabel={field.label}
            />
          </View>
        ))}
        <PrimaryButton
          label="Enregistrer"
          icon="check"
          onPress={() => {
            documentActions.saveFields(doc.id, fields);
            close();
            setToast({ text: 'Informations enregistrées' });
          }}
        />
      </BottomSheet>

      {/* Changer qui peut voir le document */}
      <BottomSheet
        visible={typeof sheet === 'object' && sheet !== null}
        title={typeof sheet === 'object' && sheet?.scope === 'household' ? `Partager avec ${HOUSEHOLD_NAME} ?` : 'Rendre ce document personnel ?'}
        subtitle={
          typeof sheet === 'object' && sheet?.scope === 'household'
            ? 'Thomas pourra voir et télécharger ce document.'
            : 'Les membres du foyer ne le verront plus.'
        }
        onClose={close}>
        <PrimaryButton
          label={typeof sheet === 'object' && sheet?.scope === 'household' ? 'Partager avec le foyer' : 'Rendre personnel'}
          icon={typeof sheet === 'object' && sheet?.scope === 'household' ? 'group' : 'lock'}
          onPress={() => {
            if (typeof sheet !== 'object' || !sheet) return;
            const undo = documentActions.setScope(doc.id, sheet.scope);
            close();
            setToast({ text: sheet.scope === 'household' ? 'Document partagé avec le foyer' : 'Document rendu personnel', undo });
          }}
        />
        <SecondaryButton label="Annuler" onPress={close} />
      </BottomSheet>

      {/* Supprimer */}
      <BottomSheet
        visible={sheet === 'delete'}
        title="Supprimer ce document ?"
        subtitle={doc.scope === 'household' ? 'Il disparaîtra aussi pour les membres du foyer.' : 'Il sera retiré de votre coffre.'}
        onClose={close}>
        <SecondaryButton
          label="Supprimer le document"
          icon="delete"
          danger
          onPress={() => {
            const undo = documentActions.remove(doc.id);
            documentActions.setFlash({ text: 'Document supprimé', undo });
            close();
            if (router.canGoBack()) router.back();
            else router.replace('/documents');
          }}
        />
        <SecondaryButton label="Garder le document" onPress={close} />
      </BottomSheet>

      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={24} />
      ) : null}
    </SafeAreaView>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    actionBar: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    action: {
      alignItems: 'center',
      gap: 4,
      minWidth: 64,
    },
    actionPressed: {
      opacity: 0.7,
    },
    actionIcon: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: c.soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionLabel: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 17,
      color: c.text,
    },
    flex: {
      flex: 1,
    },
    center: {
      textAlign: 'center',
    },
    content: {
      paddingTop: 4,
      paddingBottom: 40,
    },
    missing: {
      alignItems: 'center',
      gap: 8,
      paddingVertical: 24,
    },
    hero: {
      alignItems: 'center',
      gap: 6,
    },
    preview: {
      alignSelf: 'stretch',
      height: 240,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    fileType: {
      position: 'absolute',
      top: 10,
      right: 10,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      backgroundColor: c.card,
    },
    fileTypeText: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.text,
    },
    title: {
      fontFamily: FontFamily.headingBold,
      fontSize: 21,
      lineHeight: 27,
      letterSpacing: -0.3,
      color: c.text,
      textAlign: 'center',
    },
    tags: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 2,
    },
    category: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
    },
    status: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
      textAlign: 'center',
    },
    heroActions: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      gap: 8,
      marginTop: 10,
    },
    review: {
      marginTop: 16,
      padding: 16,
      gap: 10,
      borderRadius: 20,
      backgroundColor: '#f0fdfa',
      borderWidth: 1,
      borderColor: '#99f6e4',
    },
    reviewHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    reviewTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 17,
      lineHeight: 23,
      color: c.text,
    },
    reviewText: {
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 21,
      color: c.text,
    },
    reviewActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    list: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
    },
    field: {
      gap: 6,
    },
    fieldLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    delete: {
      marginTop: 24,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}

/** Bouton de la barre d'actions : pictogramme rond et libellé dessous. */
function ActionButton({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  const { c, styles } = useLook();
  return (
    <Pressable style={({ pressed }) => [styles.action, pressed && styles.actionPressed]} accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Icon name={icon} size={22} color={c.text} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

/** Couleurs des catégories du mode actuel. */
function useCategoryStyles() {
  return useScopedColors().dark ? CATEGORIES_DARK : CATEGORIES;
}
