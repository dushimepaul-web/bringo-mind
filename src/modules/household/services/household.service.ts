// Lecture de l'API Foyer (guide d'API v1.0, module 02 : HH-002, HH-006, HH-008) et conversion
// vers le modèle des écrans. Les modifications restent locales tant que le backend n'est pas prêt.
import { getAll } from '@/lib/api';
import { Tint } from '@/constants/design';

import type { HouseholdRole, Invitation, Member } from '../types';

export type HouseholdDto = { id: string; name: string; created_at: string; role?: string };

/** Membre tel que renvoyé par l'API (HH-006). */
export type MemberDto = {
  user_id: string;
  display_name: string;
  email?: string;
  role: 'owner' | 'admin' | 'member' | 'child' | 'guest';
  status: 'active' | 'removed' | 'left';
  joined_at: string;
  is_current_user?: boolean;
};

export type InvitationDto = { id: string; email: string; role: 'admin' | 'member'; created_at: string; expires_at: string };

const COLORS = [Tint.primary, Tint.navy, '#d97706', '#7c3aed', '#db2777'];

export function toMember(dto: MemberDto, index: number): Member {
  const role: HouseholdRole = dto.role === 'guest' ? 'member' : dto.role;
  return {
    id: dto.user_id,
    name: dto.display_name,
    email: dto.email ?? '',
    role,
    color: COLORS[index % COLORS.length],
    you: dto.is_current_user,
  };
}

export function toInvitation(dto: InvitationDto): Invitation {
  return { id: dto.id, email: dto.email, role: dto.role, sentAt: new Date(dto.created_at), expiresAt: new Date(dto.expires_at) };
}

export const householdApi = {
  /** HH-002 puis HH-006 et HH-008 pour le premier foyer actif. */
  load: async () => {
    const households = await getAll<HouseholdDto>('/households');
    const household = households[0];
    if (!household) return null;
    const [members, invitations] = await Promise.all([
      getAll<MemberDto>(`/households/${household.id}/members`),
      getAll<InvitationDto>(`/households/${household.id}/invitations`),
    ]);
    return {
      household,
      members: members.filter((member) => member.status === 'active').map(toMember),
      invitations: invitations.map(toInvitation),
    };
  },
};
