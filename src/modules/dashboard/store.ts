// Données du tableau de bord, alimentées par GET /dashboard (contrat 2.11.0).
import type { Href } from 'expo-router';
import { useSyncExternalStore } from 'react';

import { IS_DEMO } from '@/lib/config';

import { dashboardApi, type DashboardDto } from './services/dashboard.service';

export type DashboardTip = { title: string; line: string; small: string; cta: string; href: Href };
export type TodayTask = { id: string; title: string; time: string; priority: string; href: Href };
export type UpcomingEvent = { id: string; title: string; time: string; day: string; num: string; href: Href };

export type DashboardData = {
  date: string;
  tips: DashboardTip[];
  todayTasks: TodayTask[];
  /** Tâches du jour terminées / prévues. */
  done: number;
  total: number;
  upcoming: UpcomingEvent[];
  /** Nombre de notifications non lues (pastille de l'en-tête). */
  unread: number;
};

const EMPTY: DashboardData = { date: '', tips: [], todayTasks: [], done: 0, total: 0, upcoming: [], unread: 0 };

let state: DashboardData = EMPTY;
const listeners = new Set<() => void>();

function emit(next: DashboardData) {
  state = next;
  for (const listener of listeners) listener();
}

function items(sections: DashboardDto['sections'], key: string): Record<string, unknown>[] {
  const section = sections[key];
  if (!section) return [];
  const data = section.data as { items?: unknown } | undefined;
  return Array.isArray(data?.items) ? (data.items as Record<string, unknown>[]) : [];
}

function shortTime(value: unknown): string {
  if (typeof value !== 'string') return '';
  const match = /(\d{2}):(\d{2})/.exec(value);
  return match ? `${match[1]}:${match[2]}` : '';
}

function priorityLabel(value: unknown): string {
  switch (value) {
    case 'critical':
      return 'Priorité urgente';
    case 'high':
      return 'Priorité haute';
    case 'low':
      return 'Priorité basse';
    default:
      return 'Priorité normale';
  }
}

export function useDashboard(): DashboardData {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state,
  );
}

/** Charge le tableau de bord depuis l'API (mode « api ») ; ne fait rien en démo. */
export async function syncDashboard(): Promise<void> {
  if (IS_DEMO) return;
  try {
    const dto = await dashboardApi.get();
    const today = items(dto.sections, 'today');
    const appointments = items(dto.sections, 'appointments');
    const overdue = items(dto.sections, 'overdue');
    const toReview = items(dto.sections, 'to_review');
    const notifications = items(dto.sections, 'notifications');

    const todayTasks: TodayTask[] = today.map((task) => ({
      id: String(task.id ?? ''),
      title: String(task.title ?? ''),
      time: shortTime(task.due_time) || shortTime(task.due_at),
      priority: priorityLabel(task.priority),
      href: { pathname: '/tasks/detail', params: { id: String(task.id ?? '') } },
    }));

    const completed = today.filter((task) => task.status === 'completed').length;

    const upcoming: UpcomingEvent[] = appointments.map((event) => {
      const start = typeof event.starts_at === 'string' ? new Date(event.starts_at) : null;
      return {
        id: String(event.id ?? ''),
        title: String(event.title ?? ''),
        time: start ? `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}` : '',
        day: start ? ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'][start.getDay()] : '',
        num: start ? String(start.getDate()) : '',
        href: { pathname: '/calendar/detail', params: { id: String(event.id ?? '') } },
      };
    });

    const tips: DashboardTip[] = [
      ...(overdue.length
        ? [{ title: 'Tâches en retard', line: `${overdue.length} tâche${overdue.length > 1 ? 's' : ''} à rattraper :`, small: overdue.map((task) => String(task.title ?? '')).join(' • ').slice(0, 120), cta: 'Voir les tâches →', href: '/tasks' as Href }]
        : []),
      ...(toReview.length
        ? [{ title: 'À vérifier', line: `Kora a repéré ${toReview.length} élément${toReview.length > 1 ? 's' : ''} :`, small: toReview.map((task) => String(task.title ?? '')).join(' • ').slice(0, 120), cta: 'Vérifier →', href: '/tasks' as Href }]
        : []),
      {
        title: 'Votre planning',
        line: 'Aujourd’hui :',
        small: `${todayTasks.length} tâche${todayTasks.length > 1 ? 's' : ''}, ${upcoming.length} rendez-vous.`,
        cta: 'Voir mon planning →',
        href: '/calendar/agenda',
      },
    ];

    emit({
      date: dto.date,
      tips: tips.length ? tips : [{ title: 'Bienvenue', line: 'Votre planning du jour :', small: 'Rien de prévu pour le moment.', cta: 'Voir mon planning →', href: '/calendar/agenda' }],
      todayTasks,
      done: completed,
      total: today.length,
      upcoming,
      unread: notifications.length,
    });
  } catch {
    // Hors ligne : on garde l'état précédent (ou vide).
  }
}
