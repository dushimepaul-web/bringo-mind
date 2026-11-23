// Mémoire partagée par les écrans du module Foyer.
// Démo : tout reste en mémoire. Mode « api » : chaque action appelle l'API, puis la mémoire suit sa réponse
// (en cas d'échec, la modification locale est annulée et un message s'affiche).
import { useSyncExternalStore } from 'react';

import { Tint } from '@/constants/design';
import { userMessage } from '@/lib/api';
import { IS_DEMO } from '@/lib/config';
import { DEMO_TODAY, addDays } from '@/lib/demo-dates';
import { sessionStore } from '@/lib/session';

import { DEMO_ACTIVITY, DEMO_HOUSEHOLD, DEMO_INVITATIONS, DEMO_MEMBERS, SHARED_DOCS, SHARED_EVENTS, SHARED_TASKS } from './data';
import {
  activityVerb,
  householdApi,
  householdContentApi,
  toInvitation,
  type ActivityDto,
  type DocumentDto,
  type HouseholdEventDto,
  type SharedTaskDto,
} from './services/household.service';
import type { Activity, HouseholdRole, Invitation, Member, SharedDoc, SharedEvent, SharedTask } from './types';

type Snapshot = {
  /** Le foyer est optionnel : false = mode personnel uniquement. */
  hasHousehold: boolean;
  /** Mode « api » : identifiant et version du foyer actif. */
  householdId: string | null;
  version: number;
  name: string;
  createdAt: Date;
  /** false pour un foyer tout juste créé : rien n'est encore partagé. */
  demoContent: boolean;
  members: Member[];
  invitations: Invitation[];
  activity: Activity[];
  sharedTasks: SharedTask[];
  sharedEvents: SharedEvent[];
  sharedDocs: SharedDoc[];
  koraDismissed: boolean;
  flash: { text: string; undo?: () => void } | null;
};

let state: Snapshot = IS_DEMO
  ? {
      hasHousehold: true,
      householdId: null,
      version: 1,
      name: DEMO_HOUSEHOLD.name,
      createdAt: DEMO_HOUSEHOLD.createdAt,
      demoContent: true,
      members: DEMO_MEMBERS,
      invitations: DEMO_INVITATIONS,
      activity: DEMO_ACTIVITY,
      sharedTasks: SHARED_TASKS,
      sharedEvents: SHARED_EVENTS,
      sharedDocs: SHARED_DOCS,
      koraDismissed: false,
      flash: null,
    }
  : {
      // Mode « api » : rien d'affiché tant que l'API n'a pas répondu.
      hasHousehold: false,
      householdId: null,
      version: 1,
      name: '',
      createdAt: new Date(),
      demoContent: false,
      members: [],
      invitations: [],
      activity: [],
      sharedTasks: [],
      sharedEvents: [],
      sharedDocs: [],
      koraDismissed: true,
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
  const item: Activity = {
    ...entry,
    id: `a-${Date.now().toString(36)}`,
    who: myId(),
    at: IS_DEMO ? new Date(DEMO_TODAY) : new Date(),
  };
  return [item, ...state.activity];
}

function myId(): string {
  return state.members.find((member) => member.you)?.id ?? (IS_DEMO ? 'claire' : (sessionStore.getUser()?.id ?? ''));
}

/** Mode « api » : envoie la requête ; en cas d'échec, annule la modification locale et affiche l'erreur. */
function remote<T>(call: () => Promise<T>, onSuccess: (result: T) => void, rollback: () => void) {
  if (IS_DEMO) return;
  const id = state.householdId;
  if (!id) {
    rollback();
    return;
  }
  call()
    .then(onSuccess)
    .catch((error: unknown) => {
      rollback();
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
  /** Annuler un retrait ou une annulation d'invitation : démo seulement (l'API ne sait pas les défaire). */
  canUndo: IS_DEMO,

  setRole(id: string, role: HouseholdRole) {
    const before = state.members;
    emit({
      members: state.members.map((member) => (member.id === id ? { ...member, role } : member)),
    });
    remote(
      () => householdApi.setMemberRole(state.householdId as string, id, role),
      () => undefined,
      () => emit({ members: before }),
    );
  },
  removeMember(id: string): () => void {
    const before = state.members;
    const index = state.members.findIndex((member) => member.id === id);
    const member = state.members[index];
    emit({ members: state.members.filter((entry) => entry.id !== id) });
    remote(
      () => householdApi.removeMember(state.householdId as string, id),
      () => undefined,
      () => emit({ members: before }),
    );
    return () => {
      if (!IS_DEMO || !member || state.members.some((entry) => entry.id === id)) return;
      const copy = [...state.members];
      copy.splice(index, 0, member);
      emit({ members: copy });
    };
  },
  invite(email: string, role: Invitation['role']) {
    const now = IS_DEMO ? new Date(DEMO_TODAY) : new Date();
    const invitation: Invitation = {
      id: `inv-${Date.now().toString(36)}`,
      email: email.trim().toLowerCase(),
      role,
      sentAt: now,
      expiresAt: addDays(now, 7),
    };
    emit({
      invitations: [invitation, ...state.invitations],
      activity: log({
        kind: 'member',
        verb: 'a invité',
        target: invitation.email,
        href: '/household/members',
      }),
    });
    remote(
      () => householdApi.invite(state.householdId as string, invitation.email, role),
      (dto) =>
        emit({
          invitations: state.invitations.map((entry) => (entry.id === invitation.id ? toInvitation(dto) : entry)),
        }),
      () =>
        emit({
          invitations: state.invitations.filter((entry) => entry.id !== invitation.id),
        }),
    );
  },
  resendInvitation(id: string) {
    const before = state.invitations;
    const now = IS_DEMO ? new Date(DEMO_TODAY) : new Date();
    emit({
      invitations: state.invitations.map((entry) => (entry.id === id ? { ...entry, sentAt: now, expiresAt: addDays(now, 7) } : entry)),
    });
    remote(
      () => householdApi.resendInvitation(state.householdId as string, id),
      () => undefined,
      () => emit({ invitations: before }),
    );
  },
  cancelInvitation(id: string): () => void {
    const before = state.invitations;
    const index = state.invitations.findIndex((entry) => entry.id === id);
    const invitation = state.invitations[index];
    emit({ invitations: state.invitations.filter((entry) => entry.id !== id) });
    remote(
      () => householdApi.cancelInvitation(state.householdId as string, id),
      () => undefined,
      () => emit({ invitations: before }),
    );
    return () => {
      if (!IS_DEMO || !invitation || state.invitations.some((entry) => entry.id === id)) return;
      const copy = [...state.invitations];
      copy.splice(index, 0, invitation);
      emit({ invitations: copy });
    };
  },
  /** Le nouveau propriétaire prend la main, l'ancien devient admin. */
  transferOwnership(toId: string) {
    const before = state.members;
    emit({
      members: state.members.map((member) =>
        member.id === toId ? { ...member, role: 'owner' } : member.role === 'owner' ? { ...member, role: 'admin' } : member,
      ),
    });
    remote(
      () => householdApi.transfer(state.householdId as string, toId, state.version),
      (dto) => emit({ version: dto?.version ?? state.version + 1 }),
      () => emit({ members: before }),
    );
  },
  createHousehold(name: string, inviteEmail?: string) {
    if (!IS_DEMO) {
      const clean = name.trim();
      emit({
        hasHousehold: true,
        name: clean,
        createdAt: new Date(),
        demoContent: false,
        invitations: [],
        activity: [],
        koraDismissed: true,
      });
      householdApi
        .create(clean, Intl.DateTimeFormat().resolvedOptions().timeZone)
        .then(async (dto) => {
          emit({ householdId: dto.id, version: dto.version ?? 1 });
          if (inviteEmail) householdActions.invite(inviteEmail, 'admin');
          await syncHousehold();
        })
        .catch((error: unknown) => emit({ hasHousehold: false, flash: { text: userMessage(error) } }));
      return;
    }
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
      sharedTasks: SHARED_TASKS,
      sharedEvents: SHARED_EVENTS,
      sharedDocs: SHARED_DOCS,
      koraDismissed: false,
    });
  },
  /** Mode « api » : accepter l'invitation reçue par e-mail (jeton du lien), puis charger le foyer. */
  async acceptInvitation(token: string): Promise<string> {
    const dto = await householdApi.acceptInvitation(token);
    await syncHousehold();
    return dto.name;
  },
  /** Mode « api » : refuser l'invitation reçue par e-mail. */
  async declineInvitation(token: string): Promise<void> {
    await householdApi.declineInvitation(token);
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

// ——— Conversion des réponses de l'API vers le modèle des écrans ———

function toActivity(dto: ActivityDto, index: number, members: Member[]): Activity {
  const me = members.find((member) => member.you);
  const author = dto.is_me ? me : members.find((member) => member.name === dto.actor_name);
  const kind: Activity['kind'] = dto.kind === 'household' ? 'member' : dto.kind;
  const href: Activity['href'] =
    dto.kind === 'task' && dto.target_id
      ? { pathname: '/tasks/detail', params: { id: dto.target_id } }
      : dto.kind === 'event' && dto.target_id
        ? { pathname: '/calendar/detail', params: { id: dto.target_id } }
        : '/household/members';
  return {
    id: `${dto.at}-${index}`,
    who: author?.id ?? `name:${dto.actor_name}`,
    whoName: dto.actor_name,
    kind,
    verb: activityVerb(dto.action),
    target: dto.target_title ?? '',
    at: new Date(dto.at),
    href,
  };
}

function toSharedEvent(dto: HouseholdEventDto, members: Member[]): SharedEvent {
  const author = members.find((member) => member.id === dto.created_by);
  return {
    id: dto.id,
    title: dto.title,
    start: new Date(dto.starts_at),
    end: new Date(dto.ends_at),
    allDay: dto.all_day,
    location: dto.location ?? '',
    who: author ? (author.you ? 'Ajouté par vous' : `Ajouté par ${author.name.split(' ')[0]}`) : 'Tout le foyer',
    people: members.map((member) => member.id),
  };
}

function toSharedTask(dto: SharedTaskDto): SharedTask {
  const [y, m, d] = (dto.due_date ?? '').split('-').map(Number);
  const due = dto.due_at ? new Date(dto.due_at) : dto.due_date ? new Date(y, m - 1, d) : new Date();
  const assignee = dto.assignee_id ?? dto.owner_id;
  return {
    id: dto.id,
    title: dto.title,
    due,
    hasTime: Boolean(dto.due_at) && !dto.due_all_day,
    assignee,
    people: [assignee],
    done: householdContentApi.isClosed(dto.status),
  };
}

function toSharedDoc(dto: DocumentDto): SharedDoc {
  const type = dto.mime_type.includes('pdf') ? 'PDF' : dto.mime_type.startsWith('image/') ? 'Image' : 'Fichier';
  const size =
    dto.size_bytes >= 1048576 ? `${(dto.size_bytes / 1048576).toFixed(1)} Mo` : `${Math.max(1, Math.round(dto.size_bytes / 1024))} Ko`;
  return {
    id: dto.id,
    title: dto.title || dto.original_filename,
    meta: `${type} • ${size}`,
    icon: type === 'Image' ? 'image' : 'description',
  };
}

/** Charge le foyer depuis l'API (mode « api ») ; ne fait rien en démo. */
/** Mode « api » : aperçu d'une invitation reçue par e-mail. */
export const previewInvitation = (token: string) => householdApi.previewInvitation(token);

export async function syncHousehold(): Promise<void> {
  if (IS_DEMO) return;
  const result = await householdApi.load();
  if (!result) {
    emit({
      hasHousehold: false,
      householdId: null,
      members: [],
      invitations: [],
      activity: [],
      sharedTasks: [],
      sharedEvents: [],
      sharedDocs: [],
    });
    return;
  }
  const { household, members, invitations } = result;
  emit({
    hasHousehold: true,
    householdId: household.id,
    version: household.version ?? 1,
    name: household.name,
    createdAt: new Date(household.created_at),
    // Mode « api » : les blocs partagés (tâches, événements, documents) sont affichés, vides ou non.
    demoContent: true,
    members,
    invitations,
  });
  // Contenu partagé : chaque bloc se remplit dès qu'il arrive ; un bloc en échec reste vide sans bloquer les autres.
  const [activity, events, tasks, docs] = await Promise.allSettled([
    householdContentApi.activity(household.id),
    householdContentApi.events(household.id),
    householdContentApi.tasks(household.id),
    householdContentApi.documents(household.id),
  ]);
  emit({
    activity: activity.status === 'fulfilled' ? activity.value.map((dto, index) => toActivity(dto, index, members)) : [],
    sharedEvents: events.status === 'fulfilled' ? events.value.map((dto) => toSharedEvent(dto, members)) : [],
    sharedTasks: tasks.status === 'fulfilled' ? tasks.value.map(toSharedTask) : [],
    sharedDocs: docs.status === 'fulfilled' ? docs.value.map(toSharedDoc) : [],
  });
}

let inflight: Promise<void> | null = null;

/** Mode « api » : charge le foyer s'il ne l'est pas encore (écran ouvert directement, sans passer par l'accueil Famille). */
export function ensureHousehold(): void {
  if (IS_DEMO || state.householdId || inflight) return;
  inflight = syncHousehold()
    .catch((error: unknown) => emit({ flash: { text: userMessage(error) } }))
    .finally(() => {
      inflight = null;
    });
}
