import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandLogo } from '@/components/brand-logo';
import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';

export function AppHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <BrandLogo size={40} />
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
          <Text style={styles.avatarText}>CM</Text>
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
    backgroundColor: Tint.softer,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Tint.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  selector: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    justifyContent: 'center',
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectorTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Tint.navy,
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
    fontSize: 12,
    lineHeight: 15,
    color: Tint.primary,
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
    borderColor: Tint.softer,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Tint.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 14,
    lineHeight: 18,
    color: Serene.onPrimary,
  },
});
