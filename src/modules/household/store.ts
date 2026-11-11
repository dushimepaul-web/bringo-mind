// Mémoire de démonstration partagée par les écrans du module Foyer.
import { useSyncExternalStore } from 'react';

import { Tint } from '@/constants/design';
import { DEMO_TODAY, addDays } from '@/lib/demo-dates';

import { IS_DEMO } from '@/lib/config';

import { DEMO_ACTIVITY, DEMO_HOUSEHOLD, DEMO_INVITATIONS, DEMO_MEMBERS } from './data';
import { householdApi } from './services/household.service';
import type { Activity, HouseholdRole, Invitation, Member } from './types';

type Snapshot = {
  /** Le foyer est optionnel : false = mode personnel uniquement. */
  hasHousehold: boolean;
  name: string;
  createdAt: Date;
  /** false pour un foyer tout juste créé : rien n'est encore partagé. */
  demoContent: boolean;
  members: Member[];
  invitations: Invitation[];
  activity: Activity[];
  koraDismissed: boolean;
  flash: { text: string; undo?: () => void } | null;
};

let state: Snapshot = {
  hasHousehold: true,
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
  const item: Activity = { ...entry, id: `a-${Date.now().toString(36)}`, who: 'claire', at: new Date(DEMO_TODAY) };
  return [item, ...state.activity];
}

export function useHouseholdState(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useMe(): Member | undefined {
  return useHouseholdState().members.find((member) => member.you);
}

export const householdActions = {
  setRole(id: string, role: HouseholdRole) {
    emit({ members: state.members.map((member) => (member.id === id ? { ...member, role } : member)) });
  },
  removeMember(id: string): () => void {
    const index = state.members.findIndex((member) => member.id === id);
    const member = state.members[index];
    emit({ members: state.members.filter((entry) => entry.id !== id) });
    return () => {
      if (!member || state.members.some((entry) => entry.id === id)) return;
      const copy = [...state.members];
      copy.splice(index, 0, member);
      emit({ members: copy });
    };
  },
  invite(email: string, role: Invitation['role']) {
    const invitation: Invitation = {
      id: `inv-${Date.now().toString(36)}`,
      email: email.trim().toLowerCase(),
      role,
      sentAt: new Date(DEMO_TODAY),
      expiresAt: addDays(DEMO_TODAY, 7),
    };
    emit({
      invitations: [invitation, ...state.invitations],
      activity: log({ kind: 'member', verb: 'a invité', target: invitation.email, href: '/household/members' }),
    });
  },
  resendInvitation(id: string) {
    emit({
      invitations: state.invitations.map((entry) =>
        entry.id === id ? { ...entry, sentAt: new Date(DEMO_TODAY), expiresAt: addDays(DEMO_TODAY, 7) } : entry,
      ),
    });
  },
  cancelInvitation(id: string): () => void {
    const index = state.invitations.findIndex((entry) => entry.id === id);
    const invitation = state.invitations[index];
    emit({ invitations: state.invitations.filter((entry) => entry.id !== id) });
    return () => {
      if (!invitation || state.invitations.some((entry) => entry.id === id)) return;
      const copy = [...state.invitations];
      copy.splice(index, 0, invitation);
      emit({ invitations: copy });
    };
  },
  /** Le nouveau propriétaire prend la main, l'ancien devient admin. */
  transferOwnership(toId: string) {
    emit({
      members: state.members.map((member) =>
        member.id === toId ? { ...member, role: 'owner' } : member.role === 'owner' ? { ...member, role: 'admin' } : member,
      ),
    });
  },
  createHousehold(name: string, inviteEmail?: string) {
    const me = DEMO_MEMBERS.find((member) => member.you) ?? DEMO_MEMBERS[0];
    emit({
      hasHousehold: true,
      name: name.trim(),
      createdAt: new Date(DEMO_TODAY),
      demoContent: false,
      members: [{ ...me, role: 'owner', color: Tint.primary }],
      invitations: [],
      activity: [],
      koraDismissed: true,
    });
    if (inviteEmail) householdActions.invite(inviteEmail, 'admin');
  },
  /** Démo : rejoindre le foyer de Thomas après une invitation. */
  joinDemoHousehold() {
    emit({
      hasHousehold: true,
      name: DEMO_HOUSEHOLD.name,
      createdAt: DEMO_HOUSEHOLD.createdAt,
      demoContent: true,
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

/** Charge le foyer depuis l'API (mode « api ») ; ne fait rien en démo. */
export async function syncHousehold(): Promise<void> {
  if (IS_DEMO) return;
  const result = await householdApi.load();
  if (!result) {
    emit({ hasHousehold: false });
    return;
  }
  emit({
    hasHousehold: true,
    name: result.household.name,
    createdAt: new Date(result.household.created_at),
    demoContent: false,
    members: result.members,
    invitations: result.invitations,
    activity: [],
  });
}
