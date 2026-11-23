// Données du « Tableau » (Analyses), alimentées par la synthèse des rapports (GET /reports/summary).
import type { Href } from 'expo-router';
import { useSyncExternalStore } from 'react';

import { IS_DEMO } from '@/lib/config';

import { reportsApi } from './services/reports.service';

export type Kpi = { label: string; value: string; icon: string; color: string; bg: 'tintBlue' | 'tintLime' | 'tintGreen' | 'tintAmber'; href: Href };
export type DayBar = { day: string; done: number; today?: boolean };
export type Category = { label: string; done: number; total: number; color: string };

export type InsightsData = {
  kpis: Kpi[];
  week: DayBar[];
  categories: Category[];
  /** Progression de la semaine, entre 0 et 1. */
  progress: number;
  completed: number;
  total: number;
};

const EMPTY: InsightsData = { kpis: [], week: [], categories: [], progress: 0, completed: 0, total: 0 };

let state: InsightsData = EMPTY;
const listeners = new Set<() => void>();

function emit(next: InsightsData) {
  state = next;
  for (const listener of listeners) listener();
}

const KPI_COLORS = {
  tasks_open: { color: '#5BB81E', bg: 'tintLime' as const },
  tasks_overdue: { color: '#C2410C', bg: 'tintAmber' as const },
  tasks_completed: { color: '#2F7BE0', bg: 'tintBlue' as const },
  reminders_sent: { color: '#5BB81E', bg: 'tintLime' as const },
  inbox_received: { color: '#0FB5A3', bg: 'tintGreen' as const },
};

function kpiNumber(kpis: { key: string; value: unknown }[], key: string): number {
  const value = kpis.find((entry) => entry.key === key)?.value;
  return typeof value === 'number' ? value : 0;
}

export function useInsights(): InsightsData {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state,
  );
}

/** Charge la synthèse des rapports depuis l'API (mode « api ») ; ne fait rien en démo. */
export async function syncInsights(): Promise<void> {
  if (IS_DEMO) return;
  try {
    const summary = await reportsApi.report('summary');
    const kpis = Array.isArray(summary.kpis) ? summary.kpis : [];
    const charts = Array.isArray(summary.charts) ? summary.charts : [];
    const breakdowns = Array.isArray(summary.breakdowns) ? summary.breakdowns : [];

    const open = kpiNumber(kpis, 'tasks_open');
    const done = kpiNumber(kpis, 'tasks_completed');
    const overdue = kpiNumber(kpis, 'tasks_overdue');
    const total = open + done;

    const activity = charts.find((chart) => chart.key === 'tasks_activity');
    const series = Array.isArray(activity?.series) ? activity.series : [];
    const completedSeries = series.find((entry: { key?: string }) => entry.key === 'tasks_completed');
    const points = Array.isArray(completedSeries?.points) ? completedSeries.points.slice(-7) : [];
    const week: DayBar[] = points.map((point: { date?: string; value?: unknown }, index: number) => {
      const value = typeof point.value === 'number' ? point.value : 0;
      return {
        day: ['L', 'M', 'M', 'J', 'V', 'S', 'D'][index] ?? '',
        done: value,
        today: index === points.length - 1,
      };
    });

    const byCategory = breakdowns.find((entry) => entry.key === 'by_category');
    const catItems = Array.isArray(byCategory?.items) ? byCategory.items : [];
    const categories: Category[] = catItems.map((item: Record<string, unknown>, index: number) => ({
      label: String(item.label ?? item.key ?? ''),
      done: Number(item.completed ?? item.done ?? 0) || 0,
      total: Number(item.total ?? item.value ?? 0) || 0,
      color: ['#2F7BE0', '#0FB5A3', '#5BB81E', '#E08A00'][index % 4],
    }));

    emit({
      kpis: [
        { label: 'Tâches ouvertes', value: String(open), icon: 'task_alt', href: '/tasks', ...KPI_COLORS.tasks_open },
        { label: 'Tâches en retard', value: String(overdue), icon: 'warning', href: '/tasks', ...KPI_COLORS.tasks_overdue },
        { label: 'Rappels envoyés', value: String(kpiNumber(kpis, 'reminders_sent')), icon: 'notifications', href: '/reminders', ...KPI_COLORS.reminders_sent },
        { label: 'Tâches terminées', value: String(done), icon: 'check_circle', href: '/tasks', ...KPI_COLORS.tasks_completed },
      ],
      week,
      categories,
      progress: total ? done / total : 0,
      completed: done,
      total,
    });
  } catch {
    // Hors ligne : on garde l'état précédent (ou vide).
  }
}
