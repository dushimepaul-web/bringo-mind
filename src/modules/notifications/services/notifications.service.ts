// API Notifications (guide d'API v1.0, module 04 : NOT-001 à NOT-006) et conversion vers le modèle des écrans.
import type { Href } from 'expo-router';

import { api, getPage } from '@/lib/api';

import type { AppNotification, NotificationKind } from '../store';

/** Notification telle que renvoyée par l'API (NOT-001 / NOT-002). */
export type NotificationDto = {
  id: string;
  type: string;
  title: string;
  body: string;
  entity_type?: 'task' | 'reminder' | 'calendar_event' | 'document' | 'household' | 'invitation' | null;
  entity_id?: string | null;
  read_at: string | null;
  created_at: string;
};

function kindOf(dto: NotificationDto): NotificationKind {
  if (dto.entity_type === 'calendar_event') return 'event';
  if (dto.entity_type === 'document') return 'document';
  if (dto.entity_type === 'household' || dto.entity_type === 'invitation' || dto.type.startsWith('household')) return 'household';
  return 'task';
}

function hrefOf(dto: NotificationDto): Href {
  const id = dto.entity_id ?? '';
  switch (dto.entity_type) {
    case 'task':
      return { pathname: '/tasks/detail', params: { id } };
    case 'calendar_event':
      return { pathname: '/calendar/detail', params: { id } };
    case 'document':
      return { pathname: '/documents/detail', params: { id } };
    case 'reminder':
      return '/reminders';
    case 'household':
    case 'invitation':
      return '/household';
    default:
      return '/notifications';
  }
}

export function toNotification(dto: NotificationDto): AppNotification {
  return {
    id: dto.id,
    kind: kindOf(dto),
    title: dto.title,
    body: dto.body,
    at: new Date(dto.created_at),
    read: dto.read_at !== null,
    href: hrefOf(dto),
  };
}

export const notificationsApi = {
  /** NOT-001 : les 50 plus récentes. */
  list: async () => (await getPage<NotificationDto>('/notifications', { per_page: 50 })).items,
  /** NOT-003 : marquer lue / non lue. */
  setRead: (id: string, read: boolean) => api.patch(`/notifications/${id}`, { read }),
  /** NOT-004 : tout marquer comme lu. */
  readAll: () => api.post('/notifications/read-all'),
  /** NOT-005 : supprimer. */
  remove: (id: string) => api.delete(`/notifications/${id}`),
};
