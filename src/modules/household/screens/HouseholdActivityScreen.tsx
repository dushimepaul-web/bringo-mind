// S-19 - Activité du foyer | Module M08 Foyer | Phase S7
// Seules les actions sur les éléments partagés apparaissent ; toucher une ligne ouvre l'élément.
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Chip, TopBar, kitStyles } from '@/components/ui/kit';
import { FontFamily, Serene, Tint } from '@/constants/design';
import { dayOffset, formatDay, formatLongDay, formatTime } from '@/lib/demo-dates';

import { Avatar, householdStyles } from '../components/household-ui';
import { KIND_LABELS, firstName } from '../data';
import { useHouseholdState } from '../store';
import type { Activity, ActivityKind } from '../types';

const FILTERS: { key: ActivityKind | 'all'; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'task', label: 'Tâches' },
  { key: 'event', label: 'Événements' },
  { key: 'document', label: 'Documents' },
  { key: 'member', label: 'Membres' },
];

function groupLabel(date: Date): string {
  const offset = dayOffset(date);
  if (offset === 0) return 'Aujourd’hui';
  if (offset === -1) return 'Hier';
  if (offset >= -6) return formatLongDay(date);
  return 'Plus tôt';
}

export default function HouseholdActivityScreen() {
  const { name, members, activity } = useHouseholdState();
  const [filter, setFilter] = useState<ActivityKind | 'all'>('all');

  const groups = useMemo(() => {
    const list = activity.filter((item) => filter === 'all' || item.kind === filter);
    const result: { label: string; items: Activity[] }[] = [];
    for (const item of list) {
      const label = groupLabel(item.at);
      const last = result[result.length - 1];
      if (last && last.label === label) last.items.push(item);
      else result.push({ label, items: [item] });
    }
    return result;
  }, [activity, filter]);

  const person = (who: string): { label: string; avatar: string; color: string; kora: boolean } => {
    if (who === 'kora') return { label: 'Kora', avatar: 'Kora', color: Tint.black, kora: true };
    const member = members.find((entry) => entry.id === who);
    return {
      label: member ? (member.you ? 'Vous' : firstName(member.name)) : 'Un ancien membre',
      avatar: member?.name ?? '?',
      color: member?.color ?? '#94a3b8',
      kora: false,
    };
  };

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar title="Activité du foyer" fallback="/household" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <Text style={kitStyles.muted}>
          {name} • ce que les membres ont fait sur les éléments partagés
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters} style={styles.filtersScroll}>
          {FILTERS.map((entry) => (
            <Chip key={entry.key} label={entry.label} selected={filter === entry.key} onPress={() => setFilter(entry.key)} />
          ))}
        </ScrollView>

        {groups.length === 0 ? (
          <View style={[kitStyles.card, styles.empty]}>
            <Icon name="history" size={28} color={Tint.primary} />
            <Text style={kitStyles.title}>Rien pour l’instant</Text>
            <Text style={[kitStyles.muted, styles.center]}>Les actions des membres sur ce type d’élément s’afficheront ici.</Text>
          </View>
        ) : (
          groups.map((group) => (
            <View key={group.label}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{group.label}</Text>
                <View style={styles.countPill}>
                  <Text style={styles.countText}>{group.items.length}</Text>
                </View>
              </View>
              <View style={[kitStyles.card, styles.list]}>
                {group.items.map((item, index) => {
                  const who = person(item.who);
                  const kind = KIND_LABELS[item.kind];
                  // « Vous avez… » plutôt que « Vous a… ».
                  const verb = who.label === 'Vous' ? item.verb.replace(/^a /, 'avez ') : item.verb;
                  return (
                    <Pressable
                      key={item.id}
                      disabled={!item.href}
                      style={({ pressed }) => [
                        styles.row,
                        index > 0 && styles.rowBorder,
                        pressed && styles.rowPressed,
                      ]}
                      accessibilityRole={item.href ? 'link' : undefined}
                      accessibilityLabel={`${who.label} ${verb} ${item.target}, ${formatTime(item.at)}`}
                      onPress={() => item.href && router.push(item.href)}>
                      <Avatar name={who.avatar} color={who.color} size={38} kora={who.kora} />
                      <View style={styles.flex}>
                        <Text style={styles.sentence}>
                          <Text style={styles.who}>{who.label}</Text> {verb}{' '}
                          <Text style={styles.target}>{item.target}</Text>
                        </Text>
                        <View style={styles.metaRow}>
                          <Icon name={kind.icon} size={14} color={Serene.onSurfaceVariant} />
                          <Text style={styles.meta}>
                            {kind.label} • {dayOffset(item.at) < -6 ? `${formatDay(item.at)} • ` : ''}
                            {formatTime(item.at)}
                          </Text>
                        </View>
                      </View>
                      {item.href ? <Icon name="chevron_right" size={20} color={Serene.onSurfaceVariant} /> : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))
        )}

        <View style={[householdStyles.note, styles.note]}>
          <Icon name="visibility_off" size={20} color={Tint.primary} />
          <Text style={householdStyles.noteText}>
            L’historique ne montre que les actions sur les éléments partagés. Ce que chacun fait dans son espace
            personnel reste invisible.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    textAlign: 'center',
  },
  content: {
    paddingTop: 4,
    paddingBottom: 40,
  },
  filtersScroll: {
    marginTop: 12,
  },
  filters: {
    gap: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 22,
    marginBottom: 8,
  },
  groupTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
    color: Tint.navy,
  },
  countPill: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: 12,
    backgroundColor: Tint.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    color: Tint.navy,
  },
  list: {
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
  },
  rowPressed: {
    backgroundColor: Tint.soft,
  },
  sentence: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 21,
    color: Tint.navy,
  },
  who: {
    fontFamily: FontFamily.bodySemiBold,
  },
  target: {
    fontFamily: FontFamily.bodySemiBold,
    color: Tint.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  meta: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  empty: {
    marginTop: 22,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  note: {
    marginTop: 22,
  },
});
