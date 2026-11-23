// API Foyer (contrat 2.11.0, docs/backend/modules/08_foyer.md) et conversion vers le modèle des écrans.
import { api, getAll } from '@/lib/api';
import { sessionStore } from '@/lib/session';
import { Tint } from '@/constants/design';

import type { HouseholdRole, Invitation, Member } from '../types';

export type HouseholdDto = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  currency: string | null;
  time_zone: string;
  role: 'owner' | 'admin' | 'member' | 'viewer' | null;
  version: number;
};

/** Membre tel que renvoyé par l'API (`MemberOut`). */
export type MemberDto = {
  user_id: string;
  full_name: string;
  email: string | null;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joined_at: string;
};

export type InvitationDto = {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  expires_at: string;
  accepted_at: string | null;
  token: string | null;
};

const COLORS = [Tint.primary, Tint.navy, '#d97706', '#7c3aed', '#db2777'];

function toLocalRole(role: MemberDto['role']): HouseholdRole {
  if (role === 'viewer') return 'member';
  return role;
}

export function toMember(dto: MemberDto, index: number): Member {
  return {
    id: dto.user_id,
    name: dto.full_name,
    email: dto.email ?? '',
    role: toLocalRole(dto.role),
    color: COLORS[index % COLORS.length],
    you: dto.user_id === sessionStore.getUser()?.id,
  };
}

export function toInvitation(dto: InvitationDto): Invitation {
  const role: Invitation['role'] = dto.role === 'member' || dto.role === 'admin' ? dto.role : 'admin';
  return {
    id: dto.id,
    email: dto.email,
    role,
    sentAt: new Date(),
    expiresAt: new Date(dto.expires_at),
  };
}

export const householdApi = {
  /** HH-001 : foyers visibles (le premier est le foyer actif). */
  list: () => getAll<HouseholdDto>('/households'),

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
      members: members.map(toMember),
      invitations: invitations.map(toInvitation),
    };
  },

  /** HH-003 : créer un foyer. */
  create: (name: string, timeZone?: string) => api.post<HouseholdDto>('/households', { name, time_zone: timeZone ?? null }),

  /** HH-005 : renommer / modifier le foyer. */
  update: (id: string, version: number, patch: { name?: string; time_zone?: string }) =>
    api.patch<HouseholdDto>(`/households/${id}`, { ...patch, version }),

  /** HH-007 : inviter un membre. */
  invite: (householdId: string, email: string, role: 'admin' | 'member' = 'member') =>
    api.post<InvitationDto>(`/households/${householdId}/invitations`, { email, role }),

  /** HH-009 : annuler une invitation. */
  cancelInvitation: (householdId: string, invitationId: string) =>
    api.delete(`/households/${householdId}/invitations/${invitationId}`),

  /** HH-010 : renvoyer une invitation. */
  resendInvitation: (householdId: string, invitationId: string) =>
    api.post(`/households/${householdId}/invitations/${invitationId}/resend`),

  /** HH-012 : retirer un membre. */
  removeMember: (householdId: string, memberId: string) => api.delete(`/households/${householdId}/members/${memberId}`),

  /** HH-013 : changer le rôle d'un membre. */
  setMemberRole: (householdId: string, memberId: string, role: HouseholdRole) =>
    api.patch(`/households/${householdId}/members/${memberId}`, { role: role === 'child' ? 'viewer' : role }),

  /** HH-014 : transférer la propriété. */
  transfer: (householdId: string, newOwnerId: string, version: number) =>
    api.post(`/households/${householdId}/transfer`, { new_owner_id: newOwnerId, version }),

  /** Accepter / refuser une invitation (lien reçu par e-mail). */
  previewInvitation: (token: string) => api.get<unknown>('/households/invitations/preview', { query: { token } }),
  acceptInvitation: (token: string) => api.post<HouseholdDto>('/households/invitations/accept', { token }),
  declineInvitation: (token: string) => api.post('/households/invitations/decline', { token }),
};
