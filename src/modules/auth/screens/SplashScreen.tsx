// [Hors catalogue] - Écran de démarrage | Module M01 Comptes et authentification | Phase S0
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Space } from '@/constants/design';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/welcome'), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <View style={styles.glow} />
        <View style={styles.logo}>
          <Text style={styles.logoLetter}>K</Text>
        </View>
        <Text style={styles.brand}>PLAA</Text>
        <Text style={styles.tagline}>Votre vie administrative, simplifiée</Text>

        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.skip}
          accessibilityRole="button"
          onPress={() => router.replace('/welcome')}>
          <Text style={styles.skipText}>Continuer</Text>
          <Icon name="arrow_forward" size={16} color={Serene.onSurfaceVariant} />
        </Pressable>
        <Text style={styles.version}>PLAA 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Serene.primary,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Space.gutter,
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
    opacity: 0.18,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontFamily: FontFamily.headingBold,
    fontSize: 48,
    lineHeight: 56,
    color: Serene.primary,
  },
  brand: {
    fontFamily: FontFamily.headingBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 4,
    color: Serene.onPrimary,
    marginTop: 20,
  },
  tagline: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onPrimary,
    opacity: 0.8,
    marginTop: 4,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 36,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: Radius.full,
    backgroundColor: Serene.onPrimary,
    opacity: 0.35,
  },
  dotActive: {
    width: 22,
    opacity: 1,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: Space.lg,
  },
  skip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  skipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  version: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onPrimary,
    opacity: 0.6,
  },
});
