// Conversation Kora, alimentée par l'API Assistant (contrat 2.11.0) :
// liste des conversations, détail, envoi de message puis attente de la réponse (active_run).
import type { Href } from 'expo-router';
import { useSyncExternalStore } from 'react';

import { IS_DEMO } from '@/lib/config';

import type { ActionCard, Message } from './data';
import { assistantApi, type ConversationDetail, type MessageDto } from './services/assistant.service';

export type AssistantState = {
  conversationId: string | null;
  messages: Message[];
  /** true pendant l'envoi ou l'attente de la réponse de Kora. */
  busy: boolean;
};

let state: AssistantState = { conversationId: null, messages: [], busy: false };
const listeners = new Set<() => void>();

function emit(next: Partial<AssistantState>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

function roleOf(dto: MessageDto): Message['from'] {
  return dto.role === 'assistant' ? 'kora' : 'me';
}

function hrefForAction(type: string): Href {
  if (type.includes('task')) return '/tasks';
  if (type.includes('event') || type.includes('calendar')) return '/calendar';
  if (type.includes('email') || type.includes('mail')) return '/integrations/email';
  return '/assistant';
}

function cardOf(action: Record<string, unknown>): ActionCard {
  const type = String(action.action_type ?? '');
  return {
    id: String(action.id ?? `a-${Date.now()}`),
    icon: type.includes('event') ? 'event' : type.includes('email') ? 'mail' : 'add_task',
    tone: type.includes('event') ? 'event' : type.includes('email') ? 'document' : 'task',
    label: 'Proposition de Kora',
    title: String(action.preview ?? type ?? ''),
    detail: action.executable ? 'Prête à être exécutée' : 'À valider',
    action: 'Ouvrir',
    href: hrefForAction(type),
  };
}

function toMessage(dto: MessageDto): Message {
  const actions = Array.isArray(dto.actions) ? dto.actions : [];
  return {
    id: dto.id,
    from: roleOf(dto),
    text: dto.content,
    at: new Date(dto.created_at),
    ...(actions.length ? { cards: actions.map(cardOf) } : {}),
  };
}

function toMessages(detail: ConversationDetail): Message[] {
  return detail.messages.map(toMessage);
}

export function useAssistant(): AssistantState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state,
  );
}

/** Charge la conversation la plus récente (mode « api ») ; ne fait rien en démo. */
export async function syncAssistant(): Promise<void> {
  if (IS_DEMO) return;
  try {
    const conversations = await assistantApi.list('active');
    const latest = conversations[0];
    if (!latest) {
      emit({ conversationId: null, messages: [] });
      return;
    }
    const detail = await assistantApi.get(latest.id);
    emit({ conversationId: detail.id, messages: toMessages(detail) });
  } catch {
    // Hors ligne : on garde l'état précédent.
  }
}

/** Attend la fin du « run » puis recharge les messages de la conversation. */
async function waitForReply(conversationId: string): Promise<void> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const detail = await assistantApi.get(conversationId);
    if (!detail.active_run) {
      emit({ messages: toMessages(detail), busy: false });
      return;
    }
  }
  // Délai dépassé : on recharge une dernière fois et on libère.
  const detail = await assistantApi.get(conversationId);
  emit({ messages: toMessages(detail), busy: false });
}

/** Envoie un message à Kora (crée la conversation au besoin) puis attend la réponse. */
export async function sendAssistantMessage(text: string): Promise<void> {
  const clean = text.trim();
  if (!clean || state.busy || IS_DEMO) return;
  const local: Message = { id: `me-${Date.now()}`, from: 'me', text: clean, at: new Date() };
  emit({ messages: [...state.messages, local], busy: true });
  try {
    if (!state.conversationId) {
      const posted = await assistantApi.create(clean);
      emit({ conversationId: posted.conversation_id });
      await waitForReply(posted.conversation_id);
    } else {
      await assistantApi.send(state.conversationId, clean);
      await waitForReply(state.conversationId);
    }
  } catch {
    emit({ busy: false });
  }
}

/** Nouvelle conversation : on repart de zéro (la prochaine question crée une conversation). */
export function newAssistantConversation(): void {
  if (!IS_DEMO) {
    const id = state.conversationId;
    if (id) void assistantApi.remove(id).catch(() => undefined);
  }
  emit({ conversationId: null, messages: [], busy: false });
}
