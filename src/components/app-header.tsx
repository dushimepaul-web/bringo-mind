// En-tête des écrans principaux, identique à celui de l'accueil : le B du logo, bouton soleil/lune
// (dans les modules qui gèrent le mode sombre), cloche avec le nombre de non-lues, avatar à contour turquoise.
// Un trait le sépare du contenu pour montrer qu'il reste fixe.
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandLogo } from '@/components/brand-logo';
import { Icon } from '@/components/icon';
import { OutlineRing } from '@/components/rings';
import { ThemeToggle } from '@/components/theme-toggle';
import { DARK, LIGHT, useDarkModeSupported, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';

/** Démo : notifications non lues. */
const UNREAD = 3;

export function AppHeader() {
  const { c, styles } = useLook();
  const themable = useDarkModeSupported();
  return (
    <View style={styles.header}>
      <BrandLogo size={50} />
      <View style={styles.right}>
        {themable ? <ThemeToggle /> : null}
        <Pressable
          style={styles.bell}
          accessibilityRole="button"
          accessibilityLabel={`Notifications, ${UNREAD} non lues`}
          onPress={() => router.push('/notifications')}>
          <Icon name="notifications" size={30} color={c.text} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{UNREAD}</Text>
          </View>
        </Pressable>
        <Pressable style={styles.account} accessibilityRole="button" accessibilityLabel="Mes informations personnelles" onPress={() => router.push('/profile/complete')}>
          <OutlineRing size={46} stroke={4}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>CM</Text>
            </View>
          </OutlineRing>
          <Icon name="expand_more" size={22} color={c.link} />
        </Pressable>
      </View>
    </View>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    header: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.page,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    bell: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badge: {
      position: 'absolute',
      top: 4,
      right: 3,
      minWidth: 19,
      height: 19,
      paddingHorizontal: 4,
      borderRadius: Radius.full,
      backgroundColor: '#E53935',
      borderWidth: 2,
      borderColor: c.page,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 11,
      lineHeight: 13,
      color: '#FFFFFF',
    },
    account: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: Radius.full,
      backgroundColor: '#0C1A37',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: FontFamily.headingBold,
      fontSize: 15,
      lineHeight: 19,
      color: '#FFFFFF',
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
