// S-16 - Foyer partagé | Module M08 Foyer | Phase S7
// Le foyer est optionnel : sans foyer, l'écran explique simplement à quoi il sert.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { BottomSheet, Chip, PrimaryButton, SecondaryButton, SheetOption, Tag, TopBar, UndoToast, useKitStyles } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { IS_DEMO } from '@/lib/config';
import { dayOffset, formatDay, formatTime } from '@/lib/demo-dates';

import { Avatar, SectionHeader, useFlashToast, useHouseholdStyles } from '../components/household-ui';
import { ROLE_LABELS, WEEKDAY_SHORT, firstName } from '../data';
import { QueryView } from '@/components/ui/states';
import { useQuery, type QueryState } from '@/hooks/use-query';

import { householdActions, syncHousehold, useHouseholdState } from '../store';
import type { Member, SharedTask } from '../types';

export default function HouseholdHomeScreen() {
  const kitStyles = useKitStyles();
  const { hasHousehold } = useHouseholdState();
  const [toast, setToast] = useFlashToast();
  // Chargé ici (et non dans HouseholdHome) : en mode « api », on ne sait s'il y a un foyer qu'après la réponse.
  const sync = useQuery('household', syncHousehold);

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      {hasHousehold ? (
        <HouseholdHome sync={sync} />
      ) : !IS_DEMO && sync.status !== 'success' ? (
        <QueryView query={sync} loadingRows={5}>
          <NoHousehold />
        </QueryView>
      ) : (
        <NoHousehold />
      )}
      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={24} />
      ) : null}
    </SafeAreaView>
  );
}

/** Mode personnel : le foyer est présenté comme une option, jamais une obligation. */
function NoHousehold() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  return (
    <>
      <TopBar title="Foyer" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={[kitStyles.card, styles.emptyCard]}>
          <View style={styles.emptyIcon}>
            <Icon name="family_restroom" size={34} color={c.link} />
          </View>
          <Text style={styles.emptyTitle}>Le foyer est optionnel</Text>
          <Text style={styles.emptyText}>
            Bringo Mind fonctionne entièrement en mode personnel. Créez un foyer seulement si vous voulez partager
            certaines tâches, événements ou documents avec vos proches.
          </Text>
          <View style={styles.benefits}>
            {[
              { icon: 'lock', text: 'Vos éléments personnels restent privés' },
              { icon: 'tune', text: 'Vous choisissez ce que vous partagez' },
              { icon: 'logout', text: 'Vous pouvez quitter le foyer à tout moment' },
            ].map((item) => (
              <View key={item.text} style={styles.benefit}>
                <Icon name={item.icon} size={20} color={c.link} />
                <Text style={styles.benefitText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.emptyActions}>
          <PrimaryButton label="Créer un foyer" icon="add_home" onPress={() => router.push('/household/create')} />
          <SecondaryButton
            label="J’ai reçu une invitation"
            icon="mail"
            onPress={() => router.push('/household/invitation')}
          />
        </View>
      </ScrollView>
    </>
  );
}

function HouseholdHome({ sync }: { sync: QueryState }) {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const householdStyles = useHouseholdStyles();
  const { name, members, invitations, koraDismissed, createdAt: created, demoContent, activity, sharedTasks, sharedEvents, sharedDocs } =
    useHouseholdState();
  // Un seul filtre par personne, pour les tâches ET les événements.
  const [person, setPerson] = useState<string>('all');
  const [menu, setMenu] = useState(false);

  const me = members.find((member) => member.you);
  const canManage = me?.role === 'owner' || me?.role === 'admin';
  const concerns = (people: string[]) => person === 'all' || people.includes(person);
  const upcoming = sharedEvents.filter((event) => dayOffset(event.start) >= 0);
  const openTasks = sharedTasks.filter((task) => !task.done);
  const countFor = (id: string) =>
    openTasks.filter((task) => task.people.includes(id)).length +
    upcoming.filter((event) => event.people.includes(id)).length;
  const tasks = sharedTasks.filter((task) => concerns(task.people));
  const events = upcoming.filter((event) => concerns(event.people)).slice(0, person === 'all' ? 3 : 4);
  const personName = members.find((member) => member.id === person);
  const forWhom = personName ? (personName.you ? 'vous' : firstName(personName.name)) : '';

  return (
    <>
      <AppHeader />
      <ScrollView
        contentContainerStyle={[kitStyles.content, styles.content]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={sync.refreshing} onRefresh={sync.reload} tintColor={c.link} colors={[c.link]} />}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Famille</Text>
          <View style={styles.titleActions}>
            {canManage ? (
              <Pressable style={({ pressed }) => [styles.square, styles.addSquare, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Inviter un membre" onPress={() => router.push('/household/invite')}>
                <Icon name="person_add" size={22} color={c.solidText} />
              </Pressable>
            ) : null}
            <Pressable style={({ pressed }) => [styles.square, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Options du foyer" onPress={() => setMenu(true)}>
              <Icon name="more_vert" size={22} color={c.text} />
            </Pressable>
          </View>
        </View>
        <QueryView query={sync} loadingRows={5}>
        {/* Carte du foyer : les membres, comme les favoris des Contacts */}
        <View style={[kitStyles.card, styles.hero]}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <Icon name="family_restroom" size={26} color={c.link} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.heroName} numberOfLines={1}>
                {name}
              </Text>
              <Text style={kitStyles.muted}>
                {members.length} membre{members.length > 1 ? 's' : ''} • depuis {formatDay(created)}
              </Text>
            </View>
            <Tag label="Partagé" icon="group" tone="teal" />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.people}>
            {members.map((member) => (
              <Pressable
                key={member.id}
                style={({ pressed }) => [styles.person, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`${member.name}, ${ROLE_LABELS[member.role]}`}
                onPress={() => router.push('/household/members')}>
                <Avatar name={member.name} color={member.color} size={48} />
                <Text style={styles.personName} numberOfLines={1}>
                  {member.you ? 'Vous' : firstName(member.name)}
                </Text>
                <Text style={styles.personRole} numberOfLines={1}>
                  {ROLE_LABELS[member.role]}
                </Text>
              </Pressable>
            ))}
            {invitations.length > 0 ? (
              <Pressable
                style={({ pressed }) => [styles.person, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`${invitations.length} invitation en attente`}
                onPress={() => router.push('/household/members')}>
                <View style={styles.pendingAvatar}>
                  <Icon name="schedule_send" size={22} color={c.muted} />
                </View>
                <Text style={styles.personName}>Invitée</Text>
                <Text style={styles.personRole}>En attente</Text>
              </Pressable>
            ) : null}
          </ScrollView>

        </View>

        {/* Kora propose, la personne décide */}
        {!koraDismissed ? (
          <Pressable
            style={({ pressed }) => [styles.koraLine, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Suggestion de Kora : l’inscription scolaire de Léo est à rendre le 25 mai"
            onPress={() => router.push({ pathname: '/tasks/detail', params: { id: 'inscription' } })}>
            <Icon name="auto_awesome" size={20} color={c.link} />
            <Text style={styles.koraLineText} numberOfLines={2}>
              Kora : l’inscription de Léo est à rendre le 25 mai
            </Text>
            <Text style={styles.koraLineLink}>Voir</Text>
            <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Masquer la suggestion" onPress={() => householdActions.dismissKora()}>
              <Icon name="close" size={18} color={c.muted} />
            </Pressable>
          </Pressable>
        ) : null}

        {demoContent ? (
          <>
        {/* Tâches partagées */}
        <Text style={styles.filterLabel}>Afficher pour</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="Tout le foyer" selected={person === 'all'} onPress={() => setPerson('all')} />
          {members.map((member) => (
            <Chip
              key={member.id}
              label={member.you ? 'Moi' : firstName(member.name)}
              count={countFor(member.id)}
              selected={person === member.id}
              onPress={() => setPerson(member.id)}
            />
          ))}
        </ScrollView>

        <SectionHeader title="Tâches partagées" count={tasks.filter((task) => !task.done).length} action="Tout voir" href="/tasks" />
        <View style={styles.groupCard}>
          {tasks.length === 0 ? (
            <Text style={[kitStyles.muted, styles.none]}>Aucune tâche partagée pour {forWhom}.</Text>
          ) : (
            tasks.map((task, index) => <TaskRow key={task.id} task={task} first={index === 0} members={members} />)
          )}
        </View>

        {/* Prochains événements partagés */}
        <SectionHeader title="Événements partagés" count={events.length} action="Calendrier" href="/calendar" />
        <View style={styles.groupCard}>
          {events.length === 0 ? (
            <Text style={[kitStyles.muted, styles.none]}>Aucun événement partagé à venir pour {forWhom}.</Text>
          ) : null}
          {events.map((event, index) => (
            <Pressable
              key={event.id}
              style={({ pressed }) => [styles.event, index > 0 && styles.groupDivider, pressed && kitStyles.cardPressed]}
              accessibilityRole="button"
              accessibilityLabel={`${event.title}, ${formatDay(event.start)} à ${formatTime(event.start)}`}
              onPress={() => router.push({ pathname: '/calendar/detail', params: { id: event.id } })}>
              <View style={[styles.dateBlock, dayOffset(event.start) === 0 && styles.dateBlockToday]}>
                <Text style={[styles.dateDay, dayOffset(event.start) === 0 && styles.dateTodayText]}>
                  {WEEKDAY_SHORT[event.start.getDay()]}
                </Text>
                <Text style={[styles.dateNumber, dayOffset(event.start) === 0 && styles.dateTodayText]}>
                  {event.start.getDate()}
                </Text>
              </View>
              <View style={styles.flex}>
                <Text style={kitStyles.title} numberOfLines={2}>
                  {event.title}
                </Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {event.allDay ? 'Toute la journée' : `${formatTime(event.start)} – ${formatTime(event.end)}`} •{' '}
                  {event.location}
                </Text>
                <View style={styles.whoRow}>
                  <Icon name="group" size={16} color={c.link} />
                  <Text style={styles.who}>{event.who}</Text>
                </View>
              </View>
              <Icon name="chevron_right" size={22} color={c.muted} />
            </Pressable>
          ))}
        </View>

        {/* Documents partagés */}
        <SectionHeader title="Documents partagés" count={sharedDocs.length} action="Documents" href="/documents" />
        <View style={styles.docs}>
          {sharedDocs.map((doc) => (
            <Pressable
              key={doc.id}
              style={({ pressed }) => [kitStyles.card, styles.doc, pressed && kitStyles.cardPressed]}
              accessibilityRole="button"
              accessibilityLabel={doc.title}
              onPress={() => router.push({ pathname: '/documents/detail', params: { id: doc.id } })}>
              <View style={styles.docIcon}>
                <Icon name={doc.icon} size={22} color={c.link} />
              </View>
              <Text style={styles.docTitle} numberOfLines={2}>
                {doc.title}
              </Text>
              <Text style={styles.docMeta} numberOfLines={2}>
                {doc.meta}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Activité récente */}
        <SectionHeader title="Activité récente" count={activity.length} action="Voir tout" href="/household/activity" />
        <View style={styles.groupCard}>
          {activity.slice(0, 3).map((item, index) => {
            const member = members.find((entry) => entry.id === item.who);
            const who = item.who === 'kora' ? 'Kora' : member?.you ? 'Vous' : member ? firstName(member.name) : (item.whoName ?? item.who);
            return (
              <Pressable
                key={item.id}
                style={({ pressed }) => [styles.activity, index > 0 && styles.groupDivider, pressed && kitStyles.cardPressed]}
                accessibilityRole="button"
                onPress={() => (item.href ? router.push(item.href) : router.push('/household/activity'))}>
                <Avatar name={item.who === 'kora' ? 'Kora' : member?.name ?? who} color={item.who === 'kora' ? c.solid : member?.color ?? c.text} size={34} kora={item.who === 'kora'} />
                <Text style={styles.activityText} numberOfLines={2}>
                  <Text style={styles.activityWho}>{who}</Text> {item.verb} <Text style={styles.activityTarget}>{item.target}</Text>
                </Text>
                <Text style={styles.activityTime}>{formatTime(item.at)}</Text>
              </Pressable>
            );
          })}
        </View>

          </>
        ) : (
          <View style={[kitStyles.card, styles.nothing]}>
            <Icon name="share" size={28} color={c.link} />
            <Text style={kitStyles.title}>Rien n’est encore partagé</Text>
            <Text style={[kitStyles.muted, styles.center]}>
              Depuis une tâche, un événement ou un document, choisissez « Foyer » pour le partager ici.
            </Text>
          </View>
        )}

        <View style={[householdStyles.note, styles.privacy]}>
          <Icon name="lock" size={20} color={c.link} />
          <Text style={householdStyles.noteText}>
            Vos éléments personnels (santé, impôts, fiches de paie) restent privés. Seul ce que vous choisissez de
            partager apparaît ici.
          </Text>
        </View>
        </QueryView>
      </ScrollView>

      <BottomSheet visible={menu} title={name} subtitle="Options du foyer" onClose={() => setMenu(false)}>
        <SheetOption
          icon="group"
          label="Membres et invitations"
          onPress={() => {
            setMenu(false);
            router.push('/household/members');
          }}
        />
        {me?.role === 'owner' ? (
          <SheetOption
            icon="swap_horiz"
            label="Transférer la propriété"
            hint="Confier le foyer à un autre membre"
            onPress={() => {
              setMenu(false);
              router.push('/household/transfer');
            }}
          />
        ) : null}
        {IS_DEMO ? (
          <SheetOption
            icon="visibility"
            label="Aperçu sans foyer (démo)"
            hint="Voir l’écran d’une personne qui n’a pas de foyer"
            onPress={() => {
              setMenu(false);
              householdActions.previewWithoutHousehold();
            }}
          />
        ) : null}
      </BottomSheet>
    </>
  );
}

function TaskRow({ task, first, members }: { task: SharedTask; first: boolean; members: Member[] }) {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const offset = dayOffset(task.due);
  const late = !task.done && offset < 0;
  const status = task.done
    ? `Terminée le ${formatDay(task.due)}`
    : offset === 0
      ? `Aujourd’hui${task.hasTime ? ` • ${formatTime(task.due)}` : ''}`
      : late
        ? `En retard • ${formatDay(task.due)}`
        : `Pour le ${formatDay(task.due)}`;
  const assignee = members.find((member) => member.id === task.assignee);
  // Démo : Claire ou Thomas. Mode « api » : le membre à qui la tâche est attribuée.
  const who = IS_DEMO ? (task.assignee === 'claire' ? 'Vous' : 'Thomas') : assignee ? (assignee.you ? 'Vous' : firstName(assignee.name)) : 'Non attribuée';
  return (
    <Pressable
      style={({ pressed }) => [styles.task, !first && styles.groupDivider, pressed && kitStyles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${task.title}, ${status}, assignée à ${who}`}
      onPress={() => router.push({ pathname: '/tasks/detail', params: { id: task.id } })}>
      <View style={[styles.taskState, task.done && styles.taskStateDone]}>
        {task.done ? <Icon name="check" size={16} color={c.solidText} /> : null}
      </View>
      <View style={styles.flex}>
        <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]} numberOfLines={2}>
          {task.title}
        </Text>
        <View style={styles.taskMeta}>
          <Text
            style={[
              styles.taskStatus,
              (late || (offset === 0 && !task.done)) && styles.taskStatusUrgent,
              task.done && styles.taskStatusDone,
            ]}>
            {status}
          </Text>
          <Text style={styles.meta}>• {who}</Text>
        </View>
      </View>
      <Icon name="chevron_right" size={22} color={c.muted} />
    </Pressable>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
      marginBottom: 12,
    },
    pageTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.5,
      color: c.text,
    },
    titleActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    square: {
      width: 42,
      height: 42,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addSquare: {
      borderColor: c.solid,
      backgroundColor: c.solid,
    },
    koraLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      minHeight: 48,
      marginTop: 14,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 14,
      backgroundColor: c.tintMint,
    },
    koraLineText: {
      flex: 1,
      fontFamily: FontFamily.bodyMedium,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    koraLineLink: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.link,
    },
    groupCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      overflow: 'hidden',
    },
    groupDivider: {
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    activity: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    activityText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    activityWho: {
      fontFamily: FontFamily.bodySemiBold,
    },
    activityTarget: {
      fontFamily: FontFamily.bodySemiBold,
      color: c.link,
    },
    activityTime: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 17,
      color: c.muted,
    },
    flex: {
      flex: 1,
    },
    pressed: {
      opacity: 0.8,
    },
    content: {
      paddingTop: 4,
      paddingBottom: 40,
    },
    hero: {
      gap: 16,
    },
    heroTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    heroIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: c.tintMint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroName: {
      fontFamily: FontFamily.headingBold,
      fontSize: 22,
      lineHeight: 28,
      letterSpacing: -0.3,
      color: c.text,
    },
    people: {
      gap: 8,
    },
    person: {
      width: 82,
      alignItems: 'center',
      gap: 4,
    },
    personName: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    personRole: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 17,
      color: c.muted,
    },
    pendingAvatar: {
      width: 48,
      height: 48,
      borderRadius: Radius.full,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: c.dark ? '#3B5079' : '#b9c4d6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    shortcuts: {
      flexDirection: 'row',
      gap: 10,
    },
    shortcut: {
      flex: 1,
      height: 64,
      borderRadius: 16,
      backgroundColor: c.soft,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
    },
    shortcutPressed: {
      backgroundColor: c.soft,
    },
    shortcutText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    kora: {
      marginTop: 16,
      padding: 16,
      gap: 10,
      borderRadius: 20,
      backgroundColor: c.tintMint,
      borderWidth: 1,
      borderColor: c.border,
    },
    koraHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    koraLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.link,
    },
    koraText: {
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 22,
      color: c.text,
    },
    koraActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
    koraLater: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.muted,
    },
    filterLabel: {
      marginTop: 24,
      marginBottom: 8,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: c.muted,
    },
    chips: {
      gap: 8,
    },
    none: {
      paddingVertical: 8,
    },
    stack: {
      gap: 10,
    },
    task: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 14,
      paddingHorizontal: 14,
    },
    taskState: {
      width: 24,
      height: 24,
      borderRadius: Radius.full,
      borderWidth: 2,
      borderColor: c.dark ? '#3B5079' : '#b9c4d6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    taskStateDone: {
      backgroundColor: c.link,
      borderColor: c.link,
    },
    taskTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    taskTitleDone: {
      color: c.muted,
      textDecorationLine: 'line-through',
    },
    taskMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      marginTop: 2,
    },
    taskStatus: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.text,
    },
    taskStatusUrgent: {
      color: c.error,
    },
    taskStatusDone: {
      color: c.link,
    },
    meta: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    event: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
    },
    dateBlock: {
      width: 54,
      paddingVertical: 8,
      borderRadius: 14,
      backgroundColor: c.soft,
      alignItems: 'center',
    },
    dateBlockToday: {
      backgroundColor: c.link,
    },
    dateDay: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.muted,
    },
    dateNumber: {
      fontFamily: FontFamily.headingBold,
      fontSize: 22,
      lineHeight: 28,
      color: c.text,
    },
    dateTodayText: {
      color: c.solidText,
    },
    whoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    who: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.link,
    },
    docs: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    doc: {
      flexBasis: '47%',
      flexGrow: 1,
      gap: 6,
    },
    docIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: c.tintMint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    docTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    docMeta: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    nothing: {
      marginTop: 22,
      alignItems: 'center',
      gap: 8,
      paddingVertical: 24,
    },
    center: {
      textAlign: 'center',
    },
    privacy: {
      marginTop: 22,
    },
    emptyCard: {
      alignItems: 'center',
      gap: 12,
      paddingVertical: 26,
    },
    emptyIcon: {
      width: 72,
      height: 72,
      borderRadius: 24,
      backgroundColor: c.tintMint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 22,
      lineHeight: 28,
      color: c.text,
      textAlign: 'center',
    },
    emptyText: {
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 22,
      color: c.muted,
      textAlign: 'center',
    },
    benefits: {
      alignSelf: 'stretch',
      gap: 10,
      marginTop: 6,
    },
    benefit: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 12,
      borderRadius: 14,
      backgroundColor: c.soft,
    },
    benefitText: {
      flex: 1,
      fontFamily: FontFamily.bodyMedium,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    emptyActions: {
      gap: 10,
      marginTop: 18,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
