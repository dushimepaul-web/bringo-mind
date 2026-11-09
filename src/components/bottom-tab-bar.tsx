import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Space } from '@/constants/design';

type TabHref = '/dashboard' | '/tasks' | '/assistant' | '/calendar' | '/documents';

type Tab = {
  label: string;
  icon: string;
  href: TabHref;
  center?: boolean;
  badge?: number;
};

const TABS: Tab[] = [
  { label: 'Accueil', icon: 'home', href: '/dashboard' },
  { label: 'Tâches', icon: 'checklist', href: '/tasks', badge: 3 },
  { label: 'Assistant', icon: 'auto_awesome', href: '/assistant', center: true },
  { label: 'Calendrier', icon: 'calendar_month', href: '/calendar' },
  { label: 'Documents', icon: 'folder', href: '/documents' },
];

/** Écrans de saisie plein écran : la barre d'onglets est masquée. */
const HIDDEN_ON = ['/tasks/add', '/tasks/edit'];

export function BottomTabBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  if (HIDDEN_ON.includes(pathname)) {
    return null;
  }

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, Space.sm) }]}>
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        if (tab.center) {
          return (
            <Pressable
              key={tab.label}
              accessibilityRole="button"
              accessibilityLabel="Assistant IA Kora"
              onPress={() => router.navigate(tab.href)}
              style={styles.centerSlot}
              hitSlop={8}>
              <View style={styles.centerButton}>
                <Icon name={tab.icon} size={26} color={Serene.secondaryFixed} />
              </View>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab.label}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => router.navigate(tab.href)}
            style={styles.tab}>
            <View>
              <Icon
                name={tab.icon}
                size={22}
                color={active ? Serene.onSurface : Serene.onSurfaceVariant}
                filled={active}
              />
              {tab.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: Space.sm,
    paddingHorizontal: Space.xs,
    backgroundColor: Serene.surfaceContainerLowest,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Serene.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 8,
  },
  tab: {
    minWidth: 56,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  labelActive: {
    fontFamily: FontFamily.bodySemiBold,
    color: Serene.onSurface,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSecondaryContainer,
  },
  centerSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#006a61',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
});
