// Tableau : la semaine en un coup d'œil (onglet « Tableau »). En mode « api », alimenté par
// la synthèse des rapports (GET /reports/summary).
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ProgressRing, TURQUOISE } from '@/components/rings';
import { BRAND } from '@/components/brand-logo';
import { Icon } from '@/components/icon';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { IS_DEMO } from '@/lib/config';

import { syncInsights, useInsights } from '../store';

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

export default function InsightsScreen() {
  const c = useAppColors();
  const styles = c.dark ? STYLES.dark : STYLES.light;
  const insights = useInsights();

  useEffect(() => {
    if (!IS_DEMO) void syncInsights();
  }, []);

  const week = insights.week.length ? insights.week : WEEK_EMPTY;
  const max = Math.max(...week.map((d) => d.done), 1);
  const percent = Math.round(insights.progress * 100);
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={c.dark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Tableau</Text>
        <Text style={styles.subtitle}>Votre semaine en un coup d’œil</Text>

        <View style={[styles.card, styles.weekCard]}>
          <ProgressRing size={110} stroke={13} progress={insights.progress} track={c.track}>
            <Text style={styles.ringValue}>{percent}%</Text>
          </ProgressRing>
          <View style={styles.weekText}>
            <Text style={styles.cardTitle}>Progression de la semaine</Text>
            <Text style={styles.muted}>
              {insights.completed} tâches terminées sur {insights.total || 0} prévues.
            </Text>
            <Pressable style={styles.button} accessibilityRole="button" onPress={() => router.push('/tasks')}>
              <Text style={styles.buttonText}>Voir mes tâches →</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.grid}>
          {insights.kpis.map((kpi) => (
            <Pressable
              key={kpi.label}
              style={({ pressed }) => [styles.card, styles.kpi, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`${kpi.label} : ${kpi.value}`}
              onPress={() => router.push(kpi.href)}>
              <View style={[styles.kpiIcon, { backgroundColor: c[kpi.bg] }]}>
                <Icon name={kpi.icon} size={24} color={kpi.color} filled />
              </View>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tâches terminées par jour</Text>
          <View style={styles.chart}>
            {week.map((d, index) => (
              <View key={index} style={styles.chartCol}>
                <Text style={styles.chartValue}>{d.done || ''}</Text>
                <View style={styles.chartTrack}>
                  <View
                    style={[
                      styles.chartBar,
                      { height: `${(d.done / max) * 100}%`, backgroundColor: d.today ? TURQUOISE : BRAND.blue },
                    ]}
                  />
                </View>
                <Text style={[styles.chartDay, d.today && styles.chartToday]}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {insights.categories.length ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Par catégorie</Text>
            <View style={styles.categories}>
              {insights.categories.map((cat) => (
                <View key={cat.label} style={styles.category}>
                  <View style={styles.categoryHead}>
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                    <Text style={styles.muted}>
                      {cat.done} / {cat.total || 0}
                    </Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${cat.total ? (cat.done / cat.total) * 100 : 0}%`, backgroundColor: cat.color }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

/** Sept jours vides, affichés tant que la synthèse n'est pas chargée (ou en démo). */
const WEEK_EMPTY = [
  { day: 'L', done: 0 },
  { day: 'M', done: 0 },
  { day: 'M', done: 0 },
  { day: 'J', done: 0 },
  { day: 'V', done: 0 },
  { day: 'S', done: 0 },
  { day: 'D', done: 0, today: true },
];

function makeStyles(c: AppColors) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.page },
  content: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 14, paddingTop: 14, paddingBottom: 40, gap: 14 },
  pressed: { opacity: 0.85 },
  title: { fontFamily: FontFamily.headingBold, fontSize: 28, lineHeight: 34, color: c.text },
  subtitle: { fontFamily: FontFamily.body, fontSize: 15, lineHeight: 20, color: c.muted, marginTop: -10 },
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.card,
    shadowColor: BRAND.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: c.shadowOpacity,
    shadowRadius: 16,
    elevation: 2,
  },
  cardTitle: { fontFamily: FontFamily.headingBold, fontSize: 17, lineHeight: 23, color: c.text },
  muted: { fontFamily: FontFamily.body, fontSize: 14, lineHeight: 19, color: c.muted },
  weekCard: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  weekText: { flex: 1, gap: 6 },
  ringValue: { fontFamily: FontFamily.headingBold, fontSize: 26, lineHeight: 32, color: c.text },
  button: { alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.full, backgroundColor: c.solid },
  buttonText: { fontFamily: FontFamily.bodySemiBold, fontSize: 14, lineHeight: 19, color: c.solidText },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpi: { flexBasis: '47%', flexGrow: 1, gap: 6 },
  kpiIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  kpiValue: { fontFamily: FontFamily.headingBold, fontSize: 26, lineHeight: 32, color: c.text },
  kpiLabel: { fontFamily: FontFamily.bodyMedium, fontSize: 13, lineHeight: 17, color: c.muted },
  chart: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, height: 150 },
  chartCol: { flex: 1, alignItems: 'center', gap: 6 },
  chartValue: { fontFamily: FontFamily.bodySemiBold, fontSize: 13, lineHeight: 17, color: c.text, minHeight: 17 },
  chartTrack: { flex: 1, width: 18, borderRadius: 9, backgroundColor: c.chartTrack, justifyContent: 'flex-end', overflow: 'hidden' },
  chartBar: { width: '100%', borderRadius: 9 },
  chartDay: { fontFamily: FontFamily.bodyMedium, fontSize: 13, lineHeight: 17, color: c.muted },
  chartToday: { fontFamily: FontFamily.bodyBold, color: BRAND.emerald },
  categories: { gap: 12, marginTop: 12 },
  category: { gap: 6 },
  categoryHead: { flexDirection: 'row', justifyContent: 'space-between' },
  categoryLabel: { fontFamily: FontFamily.bodySemiBold, fontSize: 14, lineHeight: 19, color: c.text },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: c.chartTrack, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  });
}
