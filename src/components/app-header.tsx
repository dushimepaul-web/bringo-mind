import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Space } from '@/constants/design';

export function AppHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>K</Text>
        </View>
        <Pressable
          style={styles.selector}
          accessibilityRole="button"
          accessibilityLabel="Changer de foyer"
          onPress={() => router.push('/household')}>
          <View style={styles.selectorRow}>
            <Text style={styles.selectorTitle}>Foyer Martin</Text>
            <Icon name="unfold_more" size={15} color={Serene.onSurfaceVariant} />
          </View>
          <View style={styles.selectorSubRow}>
            <View style={styles.dot} />
            <Text style={styles.selectorSub}>IA active</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.right}>
        <Pressable
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={() => router.push('/notifications')}>
          <Icon name="notifications" size={22} color={Serene.onSurfaceVariant} />
          <View style={styles.notifDot} />
        </Pressable>
        <Pressable
          style={styles.avatar}
          accessibilityRole="button"
          accessibilityLabel="Mon profil"
          onPress={() => router.push('/profile')}>
          <Icon name="person" size={18} color={Serene.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    paddingHorizontal: Space.gutter,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Serene.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Serene.surfaceContainerHigh,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: Radius.lg,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: FontFamily.heading,
    fontSize: 18,
    lineHeight: 24,
    color: Serene.onPrimary,
  },
  selector: {
    height: 36,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    justifyContent: 'center',
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectorTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  selectorSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
  },
  selectorSub: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 12,
    color: Serene.secondary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 11,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
    borderWidth: 2,
    borderColor: Serene.surface,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
