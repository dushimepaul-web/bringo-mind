// S-18 - Membres et invitations | Module M08 Foyer partagé | Phase S7
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

type Role = 'Propriétaire' | 'Admin' | 'Membre';

type Member = {
  id: string;
  initial: string;
  name: string;
  email: string;
  role: Role;
  you?: boolean;
  child?: boolean;
};

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'claire',
    initial: 'C',
    name: 'Claire Martin',
    email: 'claire.martin@email.fr',
    role: 'Propriétaire',
    you: true,
  },
  {
    id: 'thomas',
    initial: 'T',
    name: 'Thomas Martin',
    email: 'thomas.martin@email.fr',
    role: 'Admin',
  },
  {
    id: 'leo',
    initial: 'L',
    name: 'Léo Martin',
    email: 'leo.martin@email.fr',
    role: 'Membre',
    child: true,
  },
];

const ROLES: Role[] = ['Admin', 'Membre'];

export default function MembersInvitationsScreen() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [expandedId, setExpandedId] = useState<string | null>('thomas');
  const [invitations, setInvitations] = useState([
    { id: 'jeanne', email: 'jeanne.martin@email.fr', role: 'Membre' as Role, days: 2 },
  ]);
  const [resentId, setResentId] = useState<string | null>(null);

  const changeRole = (memberId: string, role: Role) => {
    setMembers((current) =>
      current.map((member) => (member.id === memberId ? { ...member, role } : member)),
    );
  };

  const removeMember = (memberId: string) => {
    setMembers((current) => current.filter((member) => member.id !== memberId));
    setExpandedId(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Retour au foyer"
          onPress={() => router.back()}>
          <Icon name="arrow_back" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Membres & invitations</Text>
        <Pressable
          style={styles.headerButton}
          accessibilityLabel="Inviter un membre"
          onPress={() => router.push('/household/invite')}>
          <Icon name="person_add" size={22} color={Serene.secondary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.foyerCard}>
          <View style={styles.foyerAvatar}>
            <Icon name="family_restroom" size={24} color={Serene.secondary} />
          </View>
          <View style={styles.foyerBody}>
            <Text style={styles.foyerName}>Foyer Martin</Text>
            <Text style={styles.foyerMeta}>
              {members.length} membres • Créé le 12 mai 2023
            </Text>
          </View>
          <View style={styles.foyerPill}>
            <Text style={styles.foyerPillText}>Partagé</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Membres</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{members.length}</Text>
          </View>
        </View>

        <View style={styles.list}>
          {members.map((member) => {
            const expanded = expandedId === member.id && !member.you;

            return (
              <View key={member.id} style={styles.memberCard}>
                <Pressable
                  style={styles.memberRow}
                  onPress={() =>
                    setExpandedId((current) =>
                      current === member.id || member.you ? current : member.id,
                    )
                  }
                  accessibilityRole="button">
                  <View
                    style={[
                      styles.avatar,
                      member.role === 'Propriétaire'
                        ? styles.avatarOwner
                        : member.child
                          ? styles.avatarChild
                          : styles.avatarMember,
                    ]}>
                    <Text style={styles.avatarInitial}>{member.initial}</Text>
                  </View>

                  <View style={styles.memberBody}>
                    <View style={styles.memberNameRow}>
                      <Text style={styles.memberName} numberOfLines={1}>
                        {member.name}
                      </Text>
                      {member.you ? <Text style={styles.youLabel}>Vous</Text> : null}
                    </View>
                    <Text style={styles.memberEmail} numberOfLines={1}>
                      {member.email}
                    </Text>
                    <View style={styles.roleRow}>
                      <View
                        style={[
                          styles.rolePill,
                          member.role === 'Propriétaire'
                            ? styles.roleOwner
                            : member.role === 'Admin'
                              ? styles.roleAdmin
                              : styles.roleMember,
                        ]}>
                        <Text
                          style={[
                            styles.roleText,
                            member.role === 'Propriétaire' && styles.roleTextOwner,
                          ]}>
                          {member.role}
                        </Text>
                      </View>
                      {member.child ? <Text style={styles.childLabel}>Compte enfant</Text> : null}
                    </View>
                  </View>

                  {member.you ? (
                    <Icon name="lock" size={16} color={Serene.outlineVariant} />
                  ) : (
                    <Icon
                      name={expanded ? 'expand_less' : 'expand_more'}
                      size={20}
                      color={Serene.onSurfaceVariant}
                    />
                  )}
                </Pressable>

                {expanded ? (
                  <View style={styles.expanded}>
                    <View style={styles.divider} />
                    <Text style={styles.expandedLabel}>Rôle dans le foyer</Text>
                    <View style={styles.rolesRow}>
                      {ROLES.map((role) => {
                        const active = member.role === role;

                        return (
                          <Pressable
                            key={role}
                            style={[styles.roleChip, active && styles.roleChipActive]}
                            onPress={() => changeRole(member.id, role)}
                            accessibilityRole="button"
                            accessibilityState={{ selected: active }}>
                            <Text
                              style={[
                                styles.roleChipText,
                                active && styles.roleChipTextActive,
                              ]}>
                              {role}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    <Pressable
                      style={styles.expandedAction}
                      onPress={() => router.push('/household/transfer')}>
                      <Icon name="swap_horiz" size={17} color={Serene.onSurface} />
                      <Text style={styles.expandedActionText}>
                        Transférer la propriété du foyer
                      </Text>
                      <Icon name="chevron_right" size={18} color={Serene.outlineVariant} />
                    </Pressable>

                    <Pressable
                      style={styles.expandedDanger}
                      onPress={() => removeMember(member.id)}>
                      <Icon name="person_remove" size={16} color={Serene.error} />
                      <Text style={styles.expandedDangerText}>Retirer du foyer</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Invitations en attente</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{invitations.length}</Text>
          </View>
        </View>

        {invitations.length > 0 ? (
          <View style={styles.list}>
            {invitations.map((invitation) => (
              <View key={invitation.id} style={styles.inviteCard}>
                <View style={styles.inviteTopRow}>
                  <View style={styles.inviteIcon}>
                    <Icon name="mail" size={18} color={Serene.warning} />
                  </View>
                  <View style={styles.inviteBody}>
                    <Text style={styles.inviteEmail} numberOfLines={1}>
                      {invitation.email}
                    </Text>
                    <Text style={styles.inviteMeta}>
                      Invité·e comme {invitation.role} • il y a {invitation.days} jours
                    </Text>
                  </View>
                  <View style={styles.pendingPill}>
                    <Text style={styles.pendingPillText}>En attente</Text>
                  </View>
                </View>

                <View style={styles.inviteActions}>
                  <Pressable
                    style={styles.inviteAction}
                    onPress={() => setResentId(invitation.id)}>
                    <Icon
                      name={resentId === invitation.id ? 'check' : 'send'}
                      size={15}
                      color={Serene.secondary}
                    />
                    <Text style={styles.inviteActionText}>
                      {resentId === invitation.id ? 'Renvoyée' : 'Renvoyer'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.inviteAction}
                    onPress={() =>
                      setInvitations((current) =>
                        current.filter((item) => item.id !== invitation.id),
                      )
                    }>
                    <Icon name="cancel" size={15} color={Serene.error} />
                    <Text style={[styles.inviteActionText, styles.inviteActionDanger]}>
                      Annuler
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.inviteAction}
                    onPress={() => router.push('/household/invitation')}>
                    <Icon name="visibility" size={15} color={Serene.onSurfaceVariant} />
                    <Text style={[styles.inviteActionText, styles.inviteActionNeutral]}>
                      Aperçu
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyInvites}>
            <Text style={styles.emptyInvitesText}>Aucune invitation en attente.</Text>
          </View>
        )}

        <Pressable
          style={styles.inviteCta}
          accessibilityRole="button"
          onPress={() => router.push('/household/invite')}>
          <View style={styles.inviteCtaIcon}>
            <Icon name="person_add" size={20} color={Serene.onPrimary} />
          </View>
          <View style={styles.inviteCtaBody}>
            <Text style={styles.inviteCtaTitle}>Inviter un membre</Text>
            <Text style={styles.inviteCtaText}>
              Envoyez un lien sécurisé valable 7 jours
            </Text>
          </View>
          <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
        </Pressable>

        <View style={styles.privacyCard}>
          <Icon name="shield" size={18} color={Serene.onSurfaceVariant} />
          <Text style={styles.privacyText}>
            Les membres voient uniquement les éléments partagés. Les données personnelles de
            chacun restent privées.
          </Text>
        </View>

        <Pressable
          style={styles.activityButton}
          accessibilityRole="button"
          onPress={() => router.push('/household/activity')}>
          <Icon name="history" size={18} color={Serene.onSurface} />
          <Text style={styles.activityButtonText}>Voir l’activité du foyer</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Serene.surface,
  },
  header: {
    height: 56,
    paddingHorizontal: Space.gutter,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Serene.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Serene.surfaceContainerHigh,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.md,
    paddingBottom: Space.lg,
  },
  foyerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  foyerAvatar: {
    width: 46,
    height: 46,
    borderRadius: Radius.lg,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foyerBody: {
    flex: 1,
    minWidth: 0,
  },
  foyerName: {
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  foyerMeta: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  foyerPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  foyerPillText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Space.lg,
    marginBottom: Space.sm,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
  },
  countPill: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  list: {
    gap: 10,
  },
  memberCard: {
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOwner: {
    backgroundColor: Serene.primary,
  },
  avatarMember: {
    backgroundColor: Serene.secondary,
  },
  avatarChild: {
    backgroundColor: Serene.warning,
  },
  avatarInitial: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
  memberBody: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberName: {
    flexShrink: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  youLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.secondary,
  },
  memberEmail: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  roleOwner: {
    backgroundColor: Serene.primary,
  },
  roleAdmin: {
    backgroundColor: Serene.secondaryContainer,
  },
  roleMember: {
    backgroundColor: Serene.surfaceContainerHigh,
  },
  roleText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  roleTextOwner: {
    color: Serene.onPrimary,
  },
  childLabel: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  expanded: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
    marginBottom: 10,
  },
  expandedLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
    marginBottom: 6,
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  roleChipActive: {
    backgroundColor: Serene.secondaryContainer,
  },
  roleChipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  roleChipTextActive: {
    color: Serene.onSecondaryContainer,
    fontFamily: FontFamily.bodySemiBold,
  },
  expandedAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    marginTop: 8,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
  },
  expandedActionText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  expandedDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 10,
  },
  expandedDangerText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.error,
  },
  inviteCard: {
    padding: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  inviteTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inviteIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Serene.warningContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteBody: {
    flex: 1,
    minWidth: 0,
  },
  inviteEmail: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  inviteMeta: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  pendingPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.warningContainer,
  },
  pendingPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 9,
    lineHeight: 13,
    color: Serene.warning,
  },
  inviteActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Serene.surfaceContainerHigh,
  },
  inviteAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  inviteActionText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.secondary,
  },
  inviteActionDanger: {
    color: Serene.error,
  },
  inviteActionNeutral: {
    color: Serene.onSurfaceVariant,
  },
  emptyInvites: {
    padding: 14,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  emptyInvitesText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
  },
  inviteCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: Space.md,
    padding: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Serene.secondary,
  },
  inviteCtaIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteCtaBody: {
    flex: 1,
    minWidth: 0,
  },
  inviteCtaTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  inviteCtaText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: Space.md,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  privacyText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
  activityButton: {
    height: 44,
    marginTop: 10,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadow.card,
  },
  activityButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
});
