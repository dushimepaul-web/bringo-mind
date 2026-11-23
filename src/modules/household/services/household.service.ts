// API Foyer (contrat 2.11.0, docs/backend/modules/08_foyer.md) et conversion vers le modèle des écrans.
import { api, getAll, getPage } from '@/lib/api';
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

/** Aperçu d'une invitation (`GET /households/invitations/preview`). */
export type InvitationPreviewDto = {
  household_name: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  invited_by: string | null;
  expires_at: string;
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
    api.post<HouseholdDto>(`/households/${householdId}/transfer`, { new_owner_id: newOwnerId, version }),

  /** Accepter / refuser une invitation (lien reçu par e-mail). */
  previewInvitation: (token: string) =>
    api.get<InvitationPreviewDto>('/households/invitations/preview', { query: { token }, auth: false }),
  acceptInvitation: (token: string) => api.post<HouseholdDto>('/households/invitations/accept', { token }),
  declineInvitation: (token: string) => api.post('/households/invitations/decline', { token }),
};

// ——— Contenu partagé du foyer (mode « api ») ———

/** Élément du fil d'activité (`GET /households/{id}/activity`). */
export type ActivityDto = {
  at: string;
  kind: 'household' | 'task' | 'event';
  action: string;
  actor_name: string;
  is_me: boolean;
  target_id?: string | null;
  target_title?: string | null;
  role?: string | null;
};

/** Événement du calendrier du foyer (`GET /households/{id}/events`). */
export type HouseholdEventDto = {
  id: string;
  household_id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  all_day: boolean;
  location: string | null;
  description: string | null;
  version: number;
  created_by: string;
};

type SharedTaskDto = {
  id: string;
  title: string;
  status: string;
  owner_id: string;
  assignee_id: string | null;
  household_id: string | null;
  due_at: string | null;
  due_date?: string | null;
  due_all_day: boolean;
};

type DocumentDto = {
  id: string;
  title: string | null;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  household_id: string | null;
  document_type: string | null;
};

/** Le fil peut arriver en liste simple ou en `{ items }`. */
function listOf<T>(data: T[] | { items?: T[] } | null | undefined): T[] {
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

/** Traduit l'action brute du journal (« task.completed », « member_invited »…) en verbe affiché. */
export function activityVerb(action: string): string {
  const a = action.toLowerCase();
  if (a.includes('transfer')) return 'a transféré la propriété du foyer';
  if (a.includes('role')) return 'a changé le rôle de';
  if (a.includes('invit') && (a.includes('cancel') || a.includes('revok'))) return 'a annulé l’invitation de';
  if (a.includes('invit')) return 'a invité';
  if (a.includes('join') || a.includes('accept')) return 'a rejoint le foyer';
  if (a.includes('leave') || a.includes('left')) return 'a quitté le foyer';
  if (a.includes('remov') && a.includes('member')) return 'a retiré';
  if (a.includes('complet') || a.includes('done')) return 'a terminé';
  if (a.includes('creat') || a.includes('add')) return 'a ajouté';
  if (a.includes('cancel')) return 'a annulé';
  if (a.includes('delet') || a.includes('remov')) return 'a supprimé';
  if (a.includes('assign')) return 'a attribué';
  return 'a modifié';
}

const CLOSED = new Set(['completed', 'cancelled', 'archived']);

export const householdContentApi = {
  activity: async (householdId: string) =>
    listOf(await api.get<ActivityDto[] | { items?: ActivityDto[] }>(`/households/${householdId}/activity`, { query: { limit: 30 } })),

  /** Événements du foyer sur les 60 prochains jours. */
  events: async (householdId: string) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime() + 60 * 24 * 3600 * 1000);
    return listOf(
      await api.get<HouseholdEventDto[] | { items?: HouseholdEventDto[] }>(`/households/${householdId}/events`, {
        query: { start: start.toISOString(), end: end.toISOString() },
      }),
    );
  },

  /** Tâches du foyer (ouvertes et récemment terminées). */
  tasks: async (householdId: string) => {
    const tasks = await getAll<SharedTaskDto>('/tasks', { household_id: householdId, scope: 'shared', sort: 'due_at' });
    return tasks.filter((task) => task.household_id === householdId && task.status !== 'cancelled' && task.status !== 'archived');
  },

  /** Documents partagés avec le foyer (l'API n'a pas de filtre foyer : tri côté app). */
  documents: async (householdId: string) => {
    const page = await getPage<DocumentDto>('/documents', { limit: 100 });
    return page.items.filter((doc) => doc.household_id === householdId);
  },

  isClosed: (status: string) => CLOSED.has(status),
};

export type { DocumentDto, SharedTaskDto };
