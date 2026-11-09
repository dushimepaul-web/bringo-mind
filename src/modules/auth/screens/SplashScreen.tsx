// [Hors catalogue] - Écran de démarrage | Module M01 Comptes et authentification | Phase S0
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';

import { AuthBrand, AuthScreen, TextLink } from '../components/auth-ui';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/welcome'), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthScreen
      centered
      footer={
        <View style={styles.footer}>
          <TextLink
            label="Continuer"
            trailingIcon="arrow_forward"
            onPress={() => router.replace('/welcome')}
          />
          <Text style={styles.version}>Bringo Mind 1.0.0</Text>
        </View>
      }>
      <View style={styles.body}>
        <View style={styles.halo} />
        <AuthBrand large />
        <Text style={styles.claim}>Votre vie administrative, simplifiée</Text>

        <View style={styles.dots} accessibilityElementsHidden>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: Radius.full,
    backgroundColor: Tint.glow,
    opacity: 0.22,
  },
  claim: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 22,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    marginTop: Space.md,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: Space.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Tint.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Tint.primary,
  },
  footer: {
    alignItems: 'center',
    gap: 10,
  },
  version: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
});
