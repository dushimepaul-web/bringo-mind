import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OutlineRing, TURQUOISE } from '@/components/rings';
import { BRAND } from '@/components/brand-logo';
import { Icon } from '@/components/icon';
import { useAppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Space } from '@/constants/design';

type TabHref = '/dashboard' | '/insights' | '/assistant' | '/household' | '/profile';

type Tab = {
  label: string;
  icon: string;
  href: TabHref;
  center?: boolean;
};

// Barre de la maquette validée : Accueil · Tableau · Chat IA · Famille · Paramètres.
const TABS: Tab[] = [
  { label: 'Accueil', icon: 'home', href: '/dashboard' },
  { label: 'Tableau', icon: 'bar_chart', href: '/insights' },
  { label: 'Chat IA', icon: 'forum', href: '/assistant', center: true },
  { label: 'Famille', icon: 'group', href: '/household' },
  { label: 'Paramètres', icon: 'settings', href: '/profile' },
];

/** Écrans de saisie plein écran : la barre d'onglets est masquée. */
const HIDDEN_ON = [
  '/tasks/add',
  '/tasks/edit',
  '/reminders/add',
  '/reminders/edit',
  '/calendar/add',
  '/calendar/edit',
  '/household/invite',
  '/household/create',
  '/household/transfer',
  '/household/invitation',
  '/profile/preferences',
  '/profile/complete',
  '/notifications/settings',
  '/notes/edit',
];

export function BottomTabBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const c = useAppColors();

  if (HIDDEN_ON.includes(pathname)) {
    return null;
  }

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, Space.sm), backgroundColor: c.tabBar, borderTopColor: c.border }]}>
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        if (tab.center) {
          return (
            <Pressable
              key={tab.label}
              accessibilityRole="button"
              accessibilityLabel="Chat IA avec Kora"
              accessibilityState={{ selected: active }}
              onPress={() => router.navigate(tab.href)}
              style={styles.centerSlot}
              hitSlop={8}>
              <OutlineRing size={72} stroke={5} style={[styles.centerRing, { backgroundColor: c.tabBar }]}>
                <View style={styles.centerButton}>
                  <Icon name={tab.icon} size={30} color={TURQUOISE} filled />
                </View>
              </OutlineRing>
              <View style={styles.centerPill}>
                <Text style={styles.centerPillText}>{tab.label}</Text>
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
            <Icon name={tab.icon} size={28} color={c.tabIcon} filled={active} />
            <Text style={[styles.label, { color: active ? c.link : c.text }, active && styles.labelActive]} numberOfLines={1}>
              {tab.label}
            </Text>
            <View style={[styles.underline, active && { backgroundColor: c.link }]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingHorizontal: Space.xs,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E1ECE7',
    shadowColor: BRAND.navy,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 10,
  },
  tab: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
  },
  label: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 17,
    color: BRAND.navy,
  },
  labelActive: {
    fontFamily: FontFamily.bodySemiBold,
  },
  underline: {
    width: 56,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    marginTop: -38,
  },
  centerRing: {
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    shadowColor: BRAND.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  centerButton: {
    width: 58,
    height: 58,
    borderRadius: Radius.full,
    backgroundColor: BRAND.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPill: {
    marginTop: -10,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: BRAND.navy,
  },
  centerPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: '#FFFFFF',
  },
});
