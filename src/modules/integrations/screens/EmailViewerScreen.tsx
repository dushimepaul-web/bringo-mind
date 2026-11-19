// Mobile - E-mails importés | Module M12 Intégrations | Phase S10
// Sans identifiant : la liste. Avec identifiant : l'e-mail, ce que Kora a repéré et la bonne action
// (voir l'élément existant, ou créer une tâche / un rappel / un événement — jamais de doublon).
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, Chip, IconButton, SecondaryButton, SheetOption, TopBar, UndoToast, useKitStyles } from '@/components/ui/kit';
import { SettingsRow, SettingsSection } from '@/components/ui/settings';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { atTime, addDays, formatDay } from '@/lib/demo-dates';

import { LINK_META, receivedLabel } from '../data';
import { integrationActions, useIntegrationsState } from '../store';
import type { ImportedEmail } from '../types';

export default function EmailViewerScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return id ? <EmailDetail id={id} /> : <EmailList />;
}

function Avatar({ name }: { name: string }) {
  const { styles } = useLook();
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{name[0]}</Text>
    </View>
  );
}

function EmailList() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const { emails, flash } = useIntegrationsState();
  const [filter, setFilter] = useState<'all' | 'review' | 'done'>('all');
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (flash) {
        setToast(flash);
        integrationActions.setFlash(null);
      }
    }, [flash]),
  );
  // Du plus récent au plus ancien.
  const list = emails
    .filter((email) => filter === 'all' || email.status === filter)
    .sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime());
  const review = emails.filter((email) => email.status === 'review').length;

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar title="E-mails importés" fallback="/integrations" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <Text style={kitStyles.muted}>Seuls les e-mails de vos organismes autorisés sont importés.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipsScroll}>
          <Chip label="Tous" count={emails.length} selected={filter === 'all'} onPress={() => setFilter('all')} />
          <Chip label="À vérifier" count={review} selected={filter === 'review'} onPress={() => setFilter('review')} />
          <Chip label="Traités" count={emails.length - review} selected={filter === 'done'} onPress={() => setFilter('done')} />
        </ScrollView>

        {list.length === 0 ? (
          <View style={[kitStyles.card, styles.empty]}>
            <Icon name="mark_email_read" size={28} color={c.link} />
            <Text style={kitStyles.title}>Tout est traité</Text>
            <Text style={[kitStyles.muted, styles.center]}>Aucun e-mail ne demande votre attention.</Text>
          </View>
        ) : (
          <View style={[kitStyles.card, styles.list]}>
            {list.map((email, index) => (
              <Pressable
                key={email.id}
                style={({ pressed }) => [styles.row, index > 0 && styles.rowBorder, pressed && styles.rowPressed]}
                accessibilityRole="button"
                accessibilityLabel={`${email.from} : ${email.subject}${email.status === 'review' ? ', à vérifier' : ''}`}
                onPress={() => router.push({ pathname: '/integrations/email', params: { id: email.id } })}>
                <Avatar name={email.from} />
                <View style={styles.flex}>
                  <View style={styles.rowTop}>
                    <Text style={styles.from} numberOfLines={1}>
                      {email.from}
                    </Text>
                    <Text style={styles.time}>{receivedLabel(email.receivedAt)}</Text>
                  </View>
                  <Text style={styles.subject} numberOfLines={1}>
                    {email.subject}
                  </Text>
                  <Text style={styles.preview} numberOfLines={1}>
                    {email.preview}
                  </Text>
                  <View style={styles.rowTags}>
                    {email.status === 'review' ? (
                      <View style={styles.reviewTag}>
                        <Text style={styles.reviewTagText}>À vérifier</Text>
                      </View>
                    ) : (
                      <View style={styles.doneTag}>
                        <Icon name="check" size={13} color={c.link} />
                        <Text style={styles.doneTagText}>Traité</Text>
                      </View>
                    )}
                    {email.attachment ? <Icon name="attach_file" size={16} color={c.muted} /> : null}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={24} />
      ) : null}
    </SafeAreaView>
  );
}

function linkHref(link: ImportedEmail['links'][number]) {
  if (link.kind === 'task') return { pathname: '/tasks/detail' as const, params: { id: link.id } };
  if (link.kind === 'event') return { pathname: '/calendar/detail' as const, params: { id: link.id } };
  return { pathname: '/documents/detail' as const, params: { id: link.id } };
}

function EmailDetail({ id }: { id: string }) {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const { emails } = useIntegrationsState();
  const email = emails.find((entry) => entry.id === id);
  const [sheet, setSheet] = useState<'menu' | 'block' | null>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);

  if (!email) {
    return (
      <SafeAreaView style={kitStyles.safe} edges={['top']}>
        <TopBar title="E-mail importé" fallback="/integrations/email" />
        <View style={[kitStyles.content, styles.content]}>
          <View style={[kitStyles.card, styles.empty]}>
            <Icon name="unsubscribe" size={28} color={c.link} />
            <Text style={kitStyles.title}>E-mail introuvable</Text>
            <SecondaryButton label="Voir les e-mails importés" onPress={() => router.replace('/integrations/email')} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const hasTask = email.links.some((link) => link.kind === 'task');
  const hasEvent = email.links.some((link) => link.kind === 'event');
  const suggestion = email.suggestion;
  const reminderAt = suggestion?.due ? atTime(addDays(suggestion.due, -1), 9) : undefined;
  const nothingToCreate = !suggestion || (hasTask && hasEvent);
  const documentLink = email.links.find((link) => link.kind === 'document');

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar
        title="E-mail importé"
        fallback="/integrations/email"
        right={<IconButton icon="more_horiz" label="Plus d’actions" onPress={() => setSheet('menu')} />}
      />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={[kitStyles.card, styles.mail]}>
          <View style={styles.mailHead}>
            <Avatar name={email.from} />
            <View style={styles.flex}>
              <Text style={styles.from}>{email.from}</Text>
              <Text style={styles.preview}>{email.address}</Text>
            </View>
            <Text style={styles.time}>{receivedLabel(email.receivedAt)}</Text>
          </View>
          <Text style={styles.mailSubject}>{email.subject}</Text>
          {email.status === 'review' ? (
            <View style={[styles.statusPill, styles.reviewTag]}>
              <Icon name="schedule" size={14} color={c.muted} />
              <Text style={styles.reviewTagText}>À vérifier</Text>
            </View>
          ) : (
            <View style={[styles.statusPill, styles.doneTag]}>
              <Icon name="check_circle" size={14} color={c.link} filled />
              <Text style={styles.doneTagText}>Traité</Text>
            </View>
          )}
          {email.body.map((paragraph) => (
            <Text key={paragraph} style={styles.body}>
              {paragraph}
            </Text>
          ))}
          {email.attachment ? (
            <Pressable
              style={({ pressed }) => [styles.attachment, pressed && styles.rowPressed]}
              accessibilityRole="button"
              accessibilityLabel={`Ouvrir ${email.attachment.name}`}
              disabled={!documentLink}
              onPress={() => documentLink && router.push(linkHref(documentLink))}>
              <View style={styles.fileIcon}>
                <Text style={styles.fileExt}>PDF</Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.attachmentName} numberOfLines={1}>
                  {email.attachment.name}
                </Text>
                <Text style={styles.preview}>{email.attachment.size} • dans Documents</Text>
              </View>
              {documentLink ? <Icon name="chevron_right" size={22} color={c.muted} /> : null}
            </Pressable>
          ) : null}
        </View>

        <View style={[kitStyles.card, styles.kora]}>
          <View style={styles.koraHead}>
            <Icon name="auto_awesome" size={18} color={c.link} filled />
            <Text style={styles.koraTitle}>Kora a repéré</Text>
          </View>
          {email.extracted.map((field) => (
            <View key={field.label} style={styles.koraLine}>
              <Text style={styles.koraLabel}>{field.label}</Text>
              <Text style={styles.koraValue}>{field.value}</Text>
            </View>
          ))}
          <Text style={styles.preview}>Kora propose, vous décidez : rien n’est créé sans votre accord.</Text>
        </View>

        {email.links.length > 0 ? (
          <SettingsSection title="Déjà dans Bringo Mind" icon="link">
            {email.links.map((link, index) => (
              <SettingsRow
                key={`${link.kind}-${link.id}`}
                first={index === 0}
                icon={LINK_META[link.kind].icon}
                title={link.title}
                subtitle={LINK_META[link.kind].label}
                onPress={() => router.push(linkHref(link))}
              />
            ))}
          </SettingsSection>
        ) : null}

        {!nothingToCreate && suggestion ? (
          <SettingsSection title="Passer à l’action" icon="bolt">
            {!hasTask ? (
              <SettingsRow
                first
                icon="add_task"
                title="Créer une tâche"
                subtitle={suggestion.due ? `${suggestion.title} • pour le ${formatDay(suggestion.due)}` : suggestion.title}
                onPress={() =>
                  router.push({
                    pathname: '/tasks/add',
                    params: {
                      title: suggestion.title,
                      description: `D’après l’e-mail de ${email.from} : ${email.subject}`,
                      ...(suggestion.due ? { due: suggestion.due.toISOString() } : {}),
                    },
                  })
                }
              />
            ) : null}
            <SettingsRow
              first={hasTask}
              icon="notifications"
              title="Créer un rappel"
              subtitle={reminderAt ? `Proposé le ${formatDay(reminderAt)} à 9h00, la veille` : 'Rattaché à cet e-mail'}
              onPress={() =>
                router.push({
                  pathname: '/reminders/add',
                  params: {
                    ...(email.links.find((link) => link.kind === 'document')
                      ? {
                          linkKind: 'document',
                          linkId: email.links.find((link) => link.kind === 'document')?.id ?? '',
                          linkTitle: suggestion.title,
                        }
                      : { title: suggestion.title }),
                    ...(reminderAt ? { at: reminderAt.toISOString() } : {}),
                  },
                })
              }
            />
            {!hasEvent && suggestion.due ? (
              <SettingsRow
                icon="event"
                title="Ajouter au calendrier"
                subtitle={`Journée du ${formatDay(suggestion.due)}`}
                onPress={() =>
                  router.push({
                    pathname: '/calendar/add',
                    params: {
                      title: suggestion.title,
                      date: suggestion.due?.toISOString() ?? '',
                      allDay: '1',
                      description: `D’après l’e-mail de ${email.from}`,
                    },
                  })
                }
              />
            ) : null}
          </SettingsSection>
        ) : null}

        {email.status === 'review' ? (
          <SecondaryButton
            label="Marquer comme traité"
            icon="done_all"
            style={styles.done}
            onPress={() => {
              integrationActions.markDone(email.id);
              setToast({ text: 'E-mail marqué comme traité' });
            }}
          />
        ) : null}
      </ScrollView>

      <BottomSheet visible={sheet === 'menu'} title={email.from} subtitle={email.address} onClose={() => setSheet(null)}>
        <SheetOption
          icon="open_in_new"
          label="Ouvrir dans Gmail"
          hint="Pour répondre ou transférer"
          onPress={() => {
            setSheet(null);
            setToast({ text: 'Démo : ouverture de Gmail' });
          }}
        />
        <SheetOption icon="block" label="Ne plus importer cet expéditeur" danger onPress={() => setSheet('block')} />
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'block'}
        title={`Ne plus importer ${email.from} ?`}
        subtitle="Ses prochains e-mails resteront dans Gmail. Les documents déjà enregistrés sont conservés."
        onClose={() => setSheet(null)}>
        <SecondaryButton
          label="Ne plus importer"
          icon="block"
          danger
          onPress={() => {
            const undo = integrationActions.blockSender(email.from);
            integrationActions.setFlash({ text: `${email.from} ne sera plus importé`, undo });
            setSheet(null);
            if (router.canGoBack()) router.back();
            else router.replace('/integrations/email');
          }}
        />
        <SecondaryButton label="Continuer à importer" onPress={() => setSheet(null)} />
      </BottomSheet>

      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={24} />
      ) : null}
    </SafeAreaView>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    flex: {
      flex: 1,
      minWidth: 0,
    },
    center: {
      textAlign: 'center',
    },
    content: {
      paddingTop: 4,
      paddingBottom: 40,
    },
    chipsScroll: {
      marginTop: 12,
      marginBottom: 14,
    },
    chips: {
      gap: 8,
    },
    empty: {
      alignItems: 'center',
      gap: 8,
      paddingVertical: 24,
    },
    list: {
      paddingVertical: 4,
      paddingHorizontal: 0,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    rowBorder: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
    },
    rowPressed: {
      backgroundColor: c.soft,
    },
    rowTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: Radius.full,
      backgroundColor: '#0C1A37',
      borderWidth: c.dark ? 1.5 : 0,
      borderColor: '#3B5079',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: FontFamily.headingBold,
      fontSize: 17,
      lineHeight: 22,
      color: '#FFFFFF',
    },
    from: {
      flex: 1,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    time: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    subject: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    preview: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    rowTags: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 6,
    },
    reviewTag: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: Radius.full,
      backgroundColor: c.tintAmber,
    },
    reviewTagText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.amberText,
    },
    doneTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: Radius.full,
      backgroundColor: c.tintMint,
    },
    doneTagText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.link,
    },
    mail: {
      gap: 10,
    },
    mailHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    mailSubject: {
      marginTop: 4,
      fontFamily: FontFamily.headingBold,
      fontSize: 19,
      lineHeight: 25,
      color: c.text,
    },
    body: {
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 22,
      color: c.text,
    },
    attachment: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 12,
      borderRadius: 14,
      backgroundColor: c.soft,
      borderWidth: 1,
      borderColor: c.border,
    },
    attachmentName: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    done: {
      marginTop: 22,
    },
    statusPill: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: -4,
    },
    fileIcon: {
      width: 40,
      height: 44,
      borderRadius: 8,
      backgroundColor: '#E5484D',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fileExt: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 13,
      lineHeight: 16,
      color: '#FFFFFF',
    },
    kora: {
      marginTop: 18,
      gap: 10,
    },
    koraHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    koraTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    koraLine: {
      gap: 1,
    },
    koraLabel: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 17,
      color: c.muted,
    },
    koraValue: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
