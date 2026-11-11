// S-16 - Foyer partagé | Module M08 Foyer | Phase S7
// Le foyer est optionnel : sans foyer, l'écran explique simplement à quoi il sert.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import {
  BottomSheet,
  Chip,
  IconButton,
  PrimaryButton,
  SecondaryButton,
  SheetOption,
  Tag,
  TopBar,
  UndoToast,
  kitStyles,
} from '@/components/ui/kit';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';
import { dayOffset, formatDay, formatTime } from '@/lib/demo-dates';

import {
  Avatar,
  SectionHeader,
  SmallButton,
  householdStyles,
  useFlashToast,
} from '../components/household-ui';
import { ROLE_LABELS, SHARED_DOCS, SHARED_EVENTS, SHARED_TASKS, WEEKDAY_SHORT, firstName } from '../data';
import { QueryView } from '@/components/ui/states';
import { useQuery } from '@/hooks/use-query';

import { householdActions, syncHousehold, useHouseholdState } from '../store';
import type { SharedTask } from '../types';


export default function HouseholdHomeScreen() {
  const { hasHousehold } = useHouseholdState();
  const [toast, setToast] = useFlashToast();

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      {hasHousehold ? <HouseholdHome /> : <NoHousehold />}
      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={24} />
      ) : null}
    </SafeAreaView>
  );
}

/** Mode personnel : le foyer est présenté comme une option, jamais une obligation. */
function NoHousehold() {
  return (
    <>
      <TopBar title="Foyer" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={[kitStyles.card, styles.emptyCard]}>
          <View style={styles.emptyIcon}>
            <Icon name="family_restroom" size={34} color={Tint.primary} />
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
                <Icon name={item.icon} size={20} color={Tint.primary} />
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

function HouseholdHome() {
  const { name, members, invitations, koraDismissed, createdAt: created, demoContent } = useHouseholdState();
  const sync = useQuery('household', syncHousehold);
  // Un seul filtre par personne, pour les tâches ET les événements.
  const [person, setPerson] = useState<string>('all');
  const [menu, setMenu] = useState(false);

  const me = members.find((member) => member.you);
  const canManage = me?.role === 'owner' || me?.role === 'admin';
  const concerns = (people: string[]) => person === 'all' || people.includes(person);
  const upcoming = SHARED_EVENTS.filter((event) => dayOffset(event.start) >= 0);
  const openTasks = SHARED_TASKS.filter((task) => !task.done);
  const countFor = (id: string) =>
    openTasks.filter((task) => task.people.includes(id)).length +
    upcoming.filter((event) => event.people.includes(id)).length;
  const tasks = SHARED_TASKS.filter((task) => concerns(task.people));
  const events = upcoming.filter((event) => concerns(event.people)).slice(0, person === 'all' ? 3 : 4);
  const personName = members.find((member) => member.id === person);
  const forWhom = personName ? (personName.you ? 'vous' : firstName(personName.name)) : '';

  return (
    <>
      <TopBar
        title="Foyer"
        right={<IconButton icon="more_horiz" label="Options du foyer" onPress={() => setMenu(true)} />}
      />
      <ScrollView
        contentContainerStyle={[kitStyles.content, styles.content]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={sync.refreshing} onRefresh={sync.reload} tintColor={Tint.primary} colors={[Tint.primary]} />}>
        <QueryView query={sync} loadingRows={5}>
        {/* Carte du foyer : qui en fait partie et les trois raccourcis */}
        <View style={[kitStyles.card, styles.hero]}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <Icon name="family_restroom" size={26} color={Tint.primary} />
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
                  <Icon name="schedule_send" size={22} color={Serene.onSurfaceVariant} />
                </View>
                <Text style={styles.personName}>Invitée</Text>
                <Text style={styles.personRole}>En attente</Text>
              </Pressable>
            ) : null}
          </ScrollView>

          <View style={styles.shortcuts}>
            {canManage ? (
              <Shortcut icon="person_add" label="Inviter" onPress={() => router.push('/household/invite')} />
            ) : null}
            <Shortcut icon="group" label="Membres" onPress={() => router.push('/household/members')} />
            <Shortcut icon="history" label="Activité" onPress={() => router.push('/household/activity')} />
          </View>
        </View>

        {/* Kora propose, la personne décide */}
        {!koraDismissed ? (
          <View style={styles.kora}>
            <View style={styles.koraHead}>
              <Avatar name="Kora" color={Tint.black} size={30} kora />
              <Text style={styles.koraLabel}>Kora • Suggestion pour le foyer</Text>
            </View>
            <Text style={styles.koraText}>
              L’inscription scolaire de Léo est à rendre le 25 mai. L’attestation d’assurance habitation est déjà
              dans les documents partagés : Thomas peut la joindre au dossier.
            </Text>
            <View style={styles.koraActions}>
              <SmallButton
                label="Voir la tâche"
                icon="arrow_forward"
                onPress={() => router.push({ pathname: '/tasks/detail', params: { id: 'inscription' } })}
              />
              <Pressable hitSlop={8} accessibilityRole="button" onPress={() => householdActions.dismissKora()}>
                <Text style={styles.koraLater}>Plus tard</Text>
              </Pressable>
            </View>
          </View>
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
        <View style={styles.stack}>
          {tasks.length === 0 ? (
            <Text style={[kitStyles.muted, styles.none]}>Aucune tâche partagée pour {forWhom}.</Text>
          ) : (
            tasks.map((task) => <TaskRow key={task.id} task={task} />)
          )}
        </View>

        {/* Prochains événements partagés */}
        <SectionHeader title="Événements partagés" count={events.length} action="Calendrier" href="/calendar" />
        <View style={styles.stack}>
          {events.length === 0 ? (
            <Text style={[kitStyles.muted, styles.none]}>Aucun événement partagé à venir pour {forWhom}.</Text>
          ) : null}
          {events.map((event) => (
            <Pressable
              key={event.id}
              style={({ pressed }) => [kitStyles.card, styles.event, pressed && kitStyles.cardPressed]}
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
                  <Icon name="group" size={16} color={Tint.primary} />
                  <Text style={styles.who}>{event.who}</Text>
                </View>
              </View>
              <Icon name="chevron_right" size={22} color={Serene.onSurfaceVariant} />
            </Pressable>
          ))}
        </View>

        {/* Documents partagés */}
        <SectionHeader title="Documents partagés" count={SHARED_DOCS.length} action="Documents" href="/documents" />
        <View style={styles.docs}>
          {SHARED_DOCS.map((doc) => (
            <Pressable
              key={doc.id}
              style={({ pressed }) => [kitStyles.card, styles.doc, pressed && kitStyles.cardPressed]}
              accessibilityRole="button"
              accessibilityLabel={doc.title}
              onPress={() => router.push({ pathname: '/documents/detail', params: { id: doc.id } })}>
              <View style={styles.docIcon}>
                <Icon name={doc.icon} size={22} color={Tint.primary} />
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

          </>
        ) : (
          <View style={[kitStyles.card, styles.nothing]}>
            <Icon name="share" size={28} color={Tint.primary} />
            <Text style={kitStyles.title}>Rien n’est encore partagé</Text>
            <Text style={[kitStyles.muted, styles.center]}>
              Depuis une tâche, un événement ou un document, choisissez « Foyer » pour le partager ici.
            </Text>
          </View>
        )}

        <View style={[householdStyles.note, styles.privacy]}>
          <Icon name="lock" size={20} color={Tint.primary} />
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
        <SheetOption
          icon="visibility"
          label="Aperçu sans foyer (démo)"
          hint="Voir l’écran d’une personne qui n’a pas de foyer"
          onPress={() => {
            setMenu(false);
            householdActions.previewWithoutHousehold();
          }}
        />
      </BottomSheet>
    </>
  );
}

function Shortcut({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.shortcut, pressed && styles.shortcutPressed]}
      accessibilityRole="button"
      onPress={onPress}>
      <Icon name={icon} size={22} color={Tint.navy} />
      <Text style={styles.shortcutText}>{label}</Text>
    </Pressable>
  );
}

function TaskRow({ task }: { task: SharedTask }) {
  const offset = dayOffset(task.due);
  const late = !task.done && offset < 0;
  const status = task.done
    ? `Terminée le ${formatDay(task.due)}`
    : offset === 0
      ? `Aujourd’hui${task.hasTime ? ` • ${formatTime(task.due)}` : ''}`
      : late
        ? `En retard • ${formatDay(task.due)}`
        : `Pour le ${formatDay(task.due)}`;
  const who = task.assignee === 'claire' ? 'Vous' : 'Thomas';
  return (
    <Pressable
      style={({ pressed }) => [kitStyles.card, styles.task, pressed && kitStyles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${task.title}, ${status}, assignée à ${who}`}
      onPress={() => router.push({ pathname: '/tasks/detail', params: { id: task.id } })}>
      <View style={[styles.taskState, task.done && styles.taskStateDone]}>
        {task.done ? <Icon name="check" size={16} color={Serene.onPrimary} /> : null}
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
      <Icon name="chevron_right" size={22} color={Serene.onSurfaceVariant} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroName: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: Tint.navy,
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
    color: Tint.navy,
  },
  personRole: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
  pendingAvatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#b9c4d6',
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
    backgroundColor: Tint.soft,
    borderWidth: 1,
    borderColor: Tint.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  shortcutPressed: {
    backgroundColor: Tint.lavender,
  },
  shortcutText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.navy,
  },
  kora: {
    marginTop: 16,
    padding: 16,
    gap: 10,
    borderRadius: 20,
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#99f6e4',
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
    color: Tint.primary,
  },
  koraText: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 22,
    color: Tint.navy,
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
    color: Serene.onSurfaceVariant,
  },
  filterLabel: {
    marginTop: 24,
    marginBottom: 8,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
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
  },
  taskState: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#b9c4d6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskStateDone: {
    backgroundColor: Tint.primary,
    borderColor: Tint.primary,
  },
  taskTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  taskTitleDone: {
    color: Serene.onSurfaceVariant,
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
    color: Tint.navy,
  },
  taskStatusUrgent: {
    color: Serene.error,
  },
  taskStatusDone: {
    color: Tint.primary,
  },
  meta: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  event: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateBlock: {
    width: 54,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: Tint.soft,
    alignItems: 'center',
  },
  dateBlockToday: {
    backgroundColor: Tint.primary,
  },
  dateDay: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
  dateNumber: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    color: Tint.navy,
  },
  dateTodayText: {
    color: Serene.onPrimary,
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
    color: Tint.primary,
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
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  docMeta: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
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
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    color: Tint.navy,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 22,
    color: Serene.onSurfaceVariant,
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
    backgroundColor: Tint.soft,
  },
  benefitText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  emptyActions: {
    gap: 10,
    marginTop: 18,
  },
});
