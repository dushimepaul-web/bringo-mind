// Mémoire partagée par les écrans du module Foyer.
// Mode « demo » : données de démonstration. Mode « api » : mise à jour optimiste puis requête.
import { useSyncExternalStore } from 'react';

import { userMessage } from '@/lib/api';
import { IS_DEMO } from '@/lib/config';
import { Tint } from '@/constants/design';
import { addDays } from '@/lib/demo-dates';

import { DEMO_ACTIVITY, DEMO_HOUSEHOLD, DEMO_INVITATIONS, DEMO_MEMBERS } from './data';
import { householdApi, toInvitation } from './services/household.service';
import type { Activity, HouseholdRole, Invitation, Member } from './types';

type Snapshot = {
  /** Le foyer est optionnel : false = mode personnel uniquement. */
  hasHousehold: boolean;
  /** Identifiant du foyer actif (mode « api »). */
  id: string | null;
  version: number;
  name: string;
  createdAt: Date;
  /** false pour un foyer réel (mode « api ») : rien n'est prérempli. */
  demoContent: boolean;
  members: Member[];
  invitations: Invitation[];
  activity: Activity[];
  koraDismissed: boolean;
  flash: { text: string; undo?: () => void } | null;
};

let state: Snapshot = {
  hasHousehold: true,
  id: null,
  version: 1,
  name: DEMO_HOUSEHOLD.name,
  createdAt: DEMO_HOUSEHOLD.createdAt,
  demoContent: true,
  members: DEMO_MEMBERS,
  invitations: DEMO_INVITATIONS,
  activity: DEMO_ACTIVITY,
  koraDismissed: false,
  flash: null,
};
const listeners = new Set<() => void>();

function emit(next: Partial<Snapshot>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;

function log(entry: Omit<Activity, 'id' | 'at' | 'who'>) {
  const item: Activity = { ...entry, id: `a-${Date.now().toString(36)}`, who: 'claire', at: new Date() };
  return [item, ...state.activity];
}

/** Mode « api » : envoie la requête ; en cas d'échec, annule la modification locale. */
function remote<T>(call: () => Promise<T>, onSuccess: (result: T) => void, rollback?: () => void) {
  if (IS_DEMO) return;
  call()
    .then(onSuccess)
    .catch((error: unknown) => {
      rollback?.();
      emit({ flash: { text: userMessage(error) } });
    });
}

export function useHouseholdState(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useMe(): Member | undefined {
  return useHouseholdState().members.find((member) => member.you);
}

export const householdActions = {
  setRole(id: string, role: HouseholdRole) {
    const before = state.members.find((member) => member.id === id);
    if (!before) return;
    emit({ members: state.members.map((member) => (member.id === id ? { ...member, role } : member)) });
    if (state.id) remote(() => householdApi.setMemberRole(state.id!, id, role), () => undefined, () => updateMember(id, before));
  },
  removeMember(id: string): () => void {
    const index = state.members.findIndex((member) => member.id === id);
    const member = state.members[index];
    emit({ members: state.members.filter((entry) => entry.id !== id) });
    const putBack = () => {
      if (!member || state.members.some((entry) => entry.id === id)) return;
      const copy = [...state.members];
      copy.splice(index, 0, member);
      emit({ members: copy });
    };
    if (state.id) remote(() => householdApi.removeMember(state.id!, id), () => undefined, putBack);
    return putBack;
  },
  invite(email: string, role: Invitation['role']) {
    const localId = `inv-${Date.now().toString(36)}`;
    const invitation: Invitation = {
      id: localId,
      email: email.trim().toLowerCase(),
      role,
      sentAt: new Date(),
      expiresAt: addDays(new Date(), 7),
    };
    emit({
      invitations: [invitation, ...state.invitations],
      activity: log({ kind: 'member', verb: 'a invité', target: invitation.email, href: '/household/members' }),
    });
    if (state.id) {
      remote(
        () => householdApi.invite(state.id!, email, role === 'admin' ? 'admin' : 'member'),
        (dto) => emit({ invitations: state.invitations.map((entry) => (entry.id === localId ? toInvitation(dto) : entry)) }),
        () => emit({ invitations: state.invitations.filter((entry) => entry.id !== localId) }),
      );
    }
  },
  resendInvitation(id: string) {
    emit({
      invitations: state.invitations.map((entry) => (entry.id === id ? { ...entry, sentAt: new Date(), expiresAt: addDays(new Date(), 7) } : entry)),
    });
    if (state.id) remote(() => householdApi.resendInvitation(state.id!, id), () => undefined);
  },
  cancelInvitation(id: string): () => void {
    const index = state.invitations.findIndex((entry) => entry.id === id);
    const invitation = state.invitations[index];
    emit({ invitations: state.invitations.filter((entry) => entry.id !== id) });
    const putBack = () => {
      if (!invitation || state.invitations.some((entry) => entry.id === id)) return;
      const copy = [...state.invitations];
      copy.splice(index, 0, invitation);
      emit({ invitations: copy });
    };
    if (state.id) remote(() => householdApi.cancelInvitation(state.id!, id), () => undefined, putBack);
    return putBack;
  },
  /** Le nouveau propriétaire prend la main, l'ancien devient admin. */
  transferOwnership(toId: string) {
    const before = state.members;
    emit({
      members: state.members.map((member) =>
        member.id === toId ? { ...member, role: 'owner' } : member.role === 'owner' ? { ...member, role: 'admin' } : member,
      ),
    });
    if (state.id) remote(() => householdApi.transfer(state.id!, toId, state.version), () => undefined, () => emit({ members: before }));
  },
  createHousehold(name: string, inviteEmail?: string) {
    const me = DEMO_MEMBERS.find((member) => member.you) ?? DEMO_MEMBERS[0];
    emit({
      hasHousehold: true,
      name: name.trim(),
      createdAt: new Date(),
      demoContent: false,
      members: [{ ...me, role: 'owner', color: Tint.primary }],
      invitations: [],
      activity: [],
      koraDismissed: true,
    });
    if (!IS_DEMO) {
      remote(
        () => householdApi.create(name.trim()),
        (dto) => {
          emit({ id: dto.id, version: dto.version, name: dto.name, createdAt: new Date(dto.created_at) });
          if (inviteEmail) householdActions.invite(inviteEmail, 'admin');
        },
        () => emit({ hasHousehold: false, id: null }),
      );
    } else if (inviteEmail) {
      householdActions.invite(inviteEmail, 'admin');
    }
  },
  /** Démo : rejoindre le foyer de Thomas après une invitation. */
  joinDemoHousehold() {
    emit({
      hasHousehold: true,
      id: null,
      name: DEMO_HOUSEHOLD.name,
      createdAt: DEMO_HOUSEHOLD.createdAt,
      members: DEMO_MEMBERS,
      invitations: DEMO_INVITATIONS,
      activity: DEMO_ACTIVITY,
      koraDismissed: false,
    });
  },
  /** Démo : voir l'application sans foyer (mode personnel). */
  previewWithoutHousehold() {
    emit({ hasHousehold: false });
  },
  dismissKora() {
    emit({ koraDismissed: true });
  },
  setFlash(flash: Snapshot['flash']) {
    emit({ flash });
  },
};

function updateMember(id: string, patch: Partial<Member>) {
  emit({ members: state.members.map((member) => (member.id === id ? { ...member, ...patch } : member)) });
}

/** Charge le foyer depuis l'API (mode « api ») ; ne fait rien en démo. */
export async function syncHousehold(): Promise<void> {
  if (IS_DEMO) return;
  const result = await householdApi.load();
  if (!result) {
    emit({ hasHousehold: false, id: null });
    return;
  }
  emit({
    hasHousehold: true,
    id: result.household.id,
    version: result.household.version,
    name: result.household.name,
    createdAt: new Date(result.household.created_at),
    demoContent: false,
    members: result.members,
    invitations: result.invitations,
    activity: [],
  });
}
