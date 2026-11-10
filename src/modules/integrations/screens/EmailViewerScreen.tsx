// Mobile - E-mails importés | Module M12 Intégrations | Phase S10
// Sans identifiant : la liste. Avec identifiant : l'e-mail, ce que Kora a repéré et la bonne action
// (voir l'élément existant, ou créer une tâche / un rappel / un événement — jamais de doublon).
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, Chip, IconButton, SecondaryButton, SheetOption, TopBar, UndoToast, kitStyles } from '@/components/ui/kit';
import { SettingsRow, SettingsSection } from '@/components/ui/settings';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';
import { atTime, addDays, formatDay } from '@/lib/demo-dates';

import { LINK_META, receivedLabel } from '../data';
import { integrationActions, useIntegrationsState } from '../store';
import type { ImportedEmail } from '../types';

export default function EmailViewerScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return id ? <EmailDetail id={id} /> : <EmailList />;
}

function Avatar({ name }: { name: string }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{name[0]}</Text>
    </View>
  );
}

function EmailList() {
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
            <Icon name="mark_email_read" size={28} color={Tint.primary} />
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
                        <Icon name="check" size={13} color={Tint.primary} />
                        <Text style={styles.doneTagText}>Traité</Text>
                      </View>
                    )}
                    {email.attachment ? <Icon name="attach_file" size={16} color={Serene.onSurfaceVariant} /> : null}
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
            <Icon name="unsubscribe" size={28} color={Tint.primary} />
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
          {email.body.map((paragraph) => (
            <Text key={paragraph} style={styles.body}>
              {paragraph}
            </Text>
          ))}
          {email.attachment ? (
            <View style={styles.attachment}>
              <Icon name="picture_as_pdf" size={22} color={Serene.error} />
              <View style={styles.flex}>
                <Text style={styles.attachmentName}>{email.attachment.name}</Text>
                <Text style={styles.preview}>{email.attachment.size} • enregistré dans Documents</Text>
              </View>
            </View>
          ) : null}
        </View>

        <SettingsSection title="Repéré par Kora" icon="auto_awesome" footer="Kora propose, vous décidez. Rien n’est créé sans votre accord.">
          {email.extracted.map((field, index) => (
            <SettingsRow key={field.label} first={index === 0} icon={field.icon} title={field.value} subtitle={field.label} />
          ))}
        </SettingsSection>

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
        ) : (
          <View style={styles.doneInfo}>
            <Icon name="check_circle" size={20} color={Tint.primary} filled />
            <Text style={styles.doneInfoText}>Cet e-mail est traité.</Text>
          </View>
        )}
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

const styles = StyleSheet.create({
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
    borderTopColor: Tint.border,
  },
  rowPressed: {
    backgroundColor: Tint.soft,
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
    backgroundColor: Tint.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
    lineHeight: 22,
    color: Tint.navy,
  },
  from: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  time: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  subject: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.navy,
  },
  preview: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
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
    backgroundColor: '#fef3c7',
  },
  reviewTagText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 17,
    color: '#92400e',
  },
  doneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: '#e6f6f3',
  },
  doneTagText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 17,
    color: Tint.primary,
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
    color: Tint.navy,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 22,
    color: Tint.navy,
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: Tint.soft,
    borderWidth: 1,
    borderColor: Tint.border,
  },
  attachmentName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.navy,
  },
  done: {
    marginTop: 22,
  },
  doneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 22,
  },
  doneInfoText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.primary,
  },
});
