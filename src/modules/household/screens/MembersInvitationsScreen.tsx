// S-18 - Membres et invitations | Module M08 Foyer | Phase S7
// Les actions sensibles (rôle, retrait, annulation) sont confirmées et peuvent être annulées.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import {
  BottomSheet,
  IconButton,
  PrimaryButton,
  SecondaryButton,
  SheetOption,
  TopBar,
  UndoToast,
  kitStyles,
} from '@/components/ui/kit';
import { FontFamily, Serene, Tint } from '@/constants/design';
import { dayOffset, formatDay } from '@/lib/demo-dates';

import {
  Avatar,
  ChoiceCard,
  RoleTag,
  SectionHeader,
  SmallButton,
  householdStyles,
  useFlashToast,
} from '../components/household-ui';
import { ROLE_HINTS, ROLE_LABELS, firstName } from '../data';
import { householdActions, useHouseholdState } from '../store';
import type { HouseholdRole, Invitation, Member } from '../types';

type Step =
  | { kind: 'menu'; member: Member }
  | { kind: 'role'; member: Member; role: HouseholdRole }
  | { kind: 'remove'; member: Member }
  | null;

function sentLabel(invitation: Invitation): string {
  const sent = dayOffset(invitation.sentAt);
  const left = dayOffset(invitation.expiresAt);
  const when = sent === 0 ? 'aujourd’hui' : sent === -1 ? 'hier' : `le ${formatDay(invitation.sentAt)}`;
  return `Envoyée ${when} • expire dans ${left} jour${left > 1 ? 's' : ''}`;
}

export default function MembersInvitationsScreen() {
  const { name, members, invitations } = useHouseholdState();
  const [step, setStep] = useState<Step>(null);
  const [toast, setToast] = useFlashToast();

  const me = members.find((member) => member.you);
  const canManage = me?.role === 'owner' || me?.role === 'admin';
  const isOwner = me?.role === 'owner';

  const close = () => setStep(null);

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar
        title="Membres et invitations"
        fallback="/household"
        right={
          canManage ? (
            <IconButton icon="person_add" label="Inviter un membre" onPress={() => router.push('/household/invite')} />
          ) : null
        }
      />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <Text style={kitStyles.muted}>
          {name} • {members.length} membre{members.length > 1 ? 's' : ''}
          {invitations.length ? ` • ${invitations.length} invitation${invitations.length > 1 ? 's' : ''} en attente` : ''}
        </Text>

        <SectionHeader title="Membres" count={members.length} />
        <View style={styles.stack}>
          {members.map((member) => {
            const editable = canManage && !member.you && member.role !== 'owner';
            return (
              <Pressable
                key={member.id}
                disabled={!editable}
                style={({ pressed }) => [kitStyles.card, styles.member, pressed && kitStyles.cardPressed]}
                accessibilityRole={editable ? 'button' : undefined}
                accessibilityLabel={`${member.name}, ${ROLE_LABELS[member.role]}${editable ? ', gérer' : ''}`}
                onPress={() => setStep({ kind: 'menu', member })}>
                <Avatar name={member.name} color={member.color} />
                <View style={styles.flex}>
                  <View style={styles.nameRow}>
                    <Text style={kitStyles.title} numberOfLines={1}>
                      {member.name}
                    </Text>
                    {member.you ? <Text style={styles.you}>Vous</Text> : null}
                  </View>
                  <Text style={styles.meta} numberOfLines={1}>
                    {member.detail ?? member.email}
                  </Text>
                  <View style={styles.tagRow}>
                    <RoleTag role={member.role} />
                  </View>
                </View>
                {editable ? <Icon name="more_vert" size={22} color={Serene.onSurfaceVariant} /> : null}
              </Pressable>
            );
          })}
        </View>

        <SectionHeader title="Invitations en attente" count={invitations.length} />
        {invitations.length === 0 ? (
          <View style={[kitStyles.card, styles.empty]}>
            <Icon name="mark_email_read" size={28} color={Tint.primary} />
            <Text style={kitStyles.title}>Aucune invitation en attente</Text>
            <Text style={[kitStyles.muted, styles.center]}>Invitez un proche pour partager certains éléments.</Text>
            {canManage ? (
              <SecondaryButton label="Inviter un membre" icon="person_add" onPress={() => router.push('/household/invite')} />
            ) : null}
          </View>
        ) : (
          <View style={styles.stack}>
            {invitations.map((invitation) => (
              <View key={invitation.id} style={[kitStyles.card, styles.invite]}>
                <View style={styles.inviteTop}>
                  <View style={styles.inviteIcon}>
                    <Icon name="schedule_send" size={22} color={Serene.onSurfaceVariant} />
                  </View>
                  <View style={styles.flex}>
                    <Text style={kitStyles.title} numberOfLines={1}>
                      {invitation.email}
                    </Text>
                    <Text style={styles.meta}>
                      Invitée comme {ROLE_LABELS[invitation.role].toLowerCase()}
                    </Text>
                    <Text style={styles.meta}>{sentLabel(invitation)}</Text>
                  </View>
                </View>
                {canManage ? (
                  <View style={styles.inviteActions}>
                    <SmallButton
                      label="Renvoyer"
                      icon="send"
                      variant="light"
                      onPress={() => {
                        householdActions.resendInvitation(invitation.id);
                        setToast({ text: `Invitation renvoyée à ${invitation.email}` });
                      }}
                    />
                    <SmallButton
                      label="Annuler l’invitation"
                      variant="danger"
                      onPress={() => {
                        const undo = householdActions.cancelInvitation(invitation.id);
                        setToast({ text: 'Invitation annulée', undo });
                      }}
                    />
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )}

        <SectionHeader title="Qui peut faire quoi" />
        <View style={[kitStyles.card, styles.roles]}>
          {(['owner', 'admin', 'member', 'child'] as HouseholdRole[]).map((role) => (
            <View key={role} style={styles.roleLine}>
              <RoleTag role={role} />
              <Text style={styles.roleHint}>{ROLE_HINTS[role]}</Text>
            </View>
          ))}
        </View>

        <View style={[householdStyles.note, styles.note]}>
          <Icon name="lock" size={20} color={Tint.primary} />
          <Text style={householdStyles.noteText}>
            Aucun membre ne voit vos éléments personnels. Retirer quelqu’un du foyer ne supprime pas ses propres données.
          </Text>
        </View>
      </ScrollView>

      {/* Gérer un membre */}
      <BottomSheet
        visible={step?.kind === 'menu'}
        title={step?.member.name ?? ''}
        subtitle={step ? `${ROLE_LABELS[step.member.role]} • ${step.member.detail ?? step.member.email}` : undefined}
        onClose={close}>
        {step && step.member.role !== 'child' ? (
          <SheetOption
            icon="manage_accounts"
            label="Changer le rôle"
            hint={`Actuellement : ${ROLE_LABELS[step.member.role]}`}
            onPress={() => setStep({ kind: 'role', member: step.member, role: step.member.role })}
          />
        ) : null}
        {step && isOwner && step.member.role !== 'child' ? (
          <SheetOption
            icon="swap_horiz"
            label="Lui transférer la propriété"
            hint="Vous deviendrez admin"
            onPress={() => {
              const id = step.member.id;
              close();
              router.push({ pathname: '/household/transfer', params: { to: id } });
            }}
          />
        ) : null}
        {step ? (
          <SheetOption
            icon="person_remove"
            label="Retirer du foyer"
            danger
            onPress={() => setStep({ kind: 'remove', member: step.member })}
          />
        ) : null}
      </BottomSheet>

      {/* Changer le rôle, avec confirmation */}
      <BottomSheet
        visible={step?.kind === 'role'}
        title="Changer le rôle"
        subtitle={step ? `Rôle de ${firstName(step.member.name)} dans le foyer` : undefined}
        onClose={close}>
        {step?.kind === 'role' ? (
          <>
            {(['admin', 'member'] as HouseholdRole[]).map((role) => (
              <ChoiceCard
                key={role}
                title={ROLE_LABELS[role]}
                hint={ROLE_HINTS[role]}
                selected={step.role === role}
                onPress={() => setStep({ ...step, role })}
              />
            ))}
            <PrimaryButton
              label={
                step.role === step.member.role
                  ? 'Aucun changement'
                  : `Passer ${firstName(step.member.name)} en ${ROLE_LABELS[step.role].toLowerCase()}`
              }
              disabled={step.role === step.member.role}
              onPress={() => {
                const previous = step.member.role;
                const { id, name: memberName } = step.member;
                householdActions.setRole(id, step.role);
                close();
                setToast({
                  text: `${firstName(memberName)} est maintenant ${ROLE_LABELS[step.role].toLowerCase()}`,
                  undo: () => householdActions.setRole(id, previous),
                });
              }}
            />
          </>
        ) : null}
      </BottomSheet>

      {/* Retirer un membre, avec confirmation */}
      <BottomSheet
        visible={step?.kind === 'remove'}
        title={step ? `Retirer ${firstName(step.member.name)} du foyer ?` : ''}
        subtitle={
          step
            ? `${firstName(step.member.name)} ne verra plus les tâches, événements et documents partagés. Ses données personnelles ne sont pas touchées.`
            : undefined
        }
        onClose={close}>
        {step ? (
          <>
            <SecondaryButton
              label="Retirer du foyer"
              icon="person_remove"
              danger
              onPress={() => {
                const memberName = step.member.name;
                const undo = householdActions.removeMember(step.member.id);
                close();
                setToast({ text: `${firstName(memberName)} a été retiré du foyer`, undo });
              }}
            />
            <SecondaryButton label="Garder dans le foyer" onPress={close} />
          </>
        ) : null}
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
  },
  center: {
    textAlign: 'center',
  },
  content: {
    paddingTop: 4,
    paddingBottom: 40,
  },
  stack: {
    gap: 10,
  },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  you: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Tint.primary,
  },
  meta: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  invite: {
    gap: 12,
  },
  inviteTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inviteIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#b9c4d6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 22,
  },
  roles: {
    gap: 12,
  },
  roleLine: {
    gap: 4,
    alignItems: 'flex-start',
  },
  roleHint: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Tint.navy,
  },
  note: {
    marginTop: 18,
  },
});
