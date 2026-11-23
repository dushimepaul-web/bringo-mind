// API Notifications (contrat 2.11.0, docs/backend/modules/06_rappels_et_notifications.md) et conversion
// vers le modèle des écrans. `NotificationOut` n'a pas de type : on déduit le lien depuis `link`.
import type { Href } from 'expo-router';

import { api, getPage } from '@/lib/api';

import type { AppNotification, NotificationKind } from '../store';

/** Notification telle que renvoyée par l'API (`NotificationOut`). */
export type NotificationDto = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
  category: string;
  priority: number;
};

function kindOf(link: string | null): NotificationKind {
  if (!link) return 'task';
  if (/calendar|event/i.test(link)) return 'event';
  if (/document/i.test(link)) return 'document';
  if (/household|member|invite|foyer/i.test(link)) return 'household';
  return 'task';
}

function hrefOf(dto: NotificationDto): Href {
  const link = dto.link ?? '';
  const id = link.split('/').filter(Boolean).pop() ?? '';
  if (/\/tasks\//i.test(link)) return { pathname: '/tasks/detail', params: { id } };
  if (/calendar|event/i.test(link)) return { pathname: '/calendar/detail', params: { id } };
  if (/document/i.test(link)) return { pathname: '/documents/detail', params: { id } };
  if (/household|member|invite/i.test(link)) return '/household/members';
  return '/notifications';
}

/** Préférences telles que renvoyées par l'API (`PreferencesOut`). */
export type PreferencesDto = {
  channels: ('in_app' | 'email' | 'web_push')[];
  default_offsets: number[];
  same_day_reminder?: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  all_day_reminder_time: string;
  repeat_unresolved_hours: number | null;
  daily_summary: boolean;
  weekly_summary: boolean;
  escalate_critical: boolean;
  category_overrides: Record<string, unknown>;
};

export function toNotification(dto: NotificationDto): AppNotification {
  return {
    id: dto.id,
    kind: kindOf(dto.link),
    title: dto.title,
    body: dto.body ?? '',
    at: new Date(dto.created_at),
    read: dto.read_at !== null,
    href: hrefOf(dto),
  };
}

export const notificationsApi = {
  /** API-NOT-005 : les 100 notifications les plus récentes. */
  list: async () => (await getPage<NotificationDto>('/notifications', { limit: 100 })).items,
  /** NOT-003 : marquer une notification comme lue (pas de « non lue » côté serveur). */
  read: (id: string) => api.post(`/notifications/${id}/read`),
  /** NOT-004 : tout marquer comme lu. */
  readAll: () => api.post('/notifications/read-all'),
  /** NOT-005 : supprimer. */
  remove: (id: string) => api.delete(`/notifications/${id}`),
  /** Nombre de notifications non lues. */
  unreadCount: () => api.get<number>('/notifications/unread-count'),
  /** API-NOT-003 / 004 : préférences de notification (canaux, heures de silence, résumés…). */
  preferences: () => api.get<PreferencesDto>('/notifications/preferences'),
  savePreferences: (body: Partial<PreferencesDto>) => api.put<PreferencesDto>('/notifications/preferences', body),
};
