// [Hors catalogue] - Onboarding | Module M01 Comptes et authentification | Phase S0
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space } from '@/constants/design';

const STEPS = [
  {
    icon: 'auto_awesome',
    badge: 'Étape 1 sur 3',
    title: 'Laissez Kora faire le tri',
    text: 'Importez un document ou un e-mail : Kora identifie les dates, montants et actions importantes pour vous.',
    bullets: ['Analyse automatique', 'Résumé clair', 'Zéro saisie inutile'],
  },
  {
    icon: 'task_alt',
    badge: 'Étape 2 sur 3',
    title: 'Gardez le contrôle',
    text: 'Tâches, rappels et calendrier se synchronisent. Vous validez chaque suggestion avant qu’elle soit appliquée.',
    bullets: ['Rappels intelligents', 'Détection des conflits', 'Tout centralisé'],
  },
  {
    icon: 'diversity_3',
    badge: 'Étape 3 sur 3',
    title: 'Avancez ensemble',
    text: 'Partagez les démarches avec votre foyer tout en gardant certains documents strictement privés.',
    bullets: ['Espace foyer', 'Rôles et permissions', 'Confidentialité maîtrisée'],
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const last = index === STEPS.length - 1;

  const next = () => {
    if (last) {
      router.replace('/welcome');
      return;
    }
    setIndex((value) => value + 1);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <View style={styles.logo}>
          <Text style={styles.logoLetter}>K</Text>
        </View>
        <Pressable
          style={styles.skip}
          accessibilityRole="button"
          onPress={() => router.replace('/welcome')}>
          <Text style={styles.skipText}>Passer</Text>
        </Pressable>
      </View>

      <View style={styles.stage}>
        <View style={styles.illustration}>
          <View style={styles.illustrationRing} />
          <View style={styles.illustrationCircle}>
            <Icon name={step.icon} size={54} color={Serene.onPrimary} />
          </View>
          <View style={styles.floatingCard}>
            <Icon name="check_circle" size={16} color={Serene.success} />
            <Text style={styles.floatingText}>Aucune action en retard</Text>
          </View>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{step.badge}</Text>
        </View>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.text}>{step.text}</Text>

        <View style={styles.bullets}>
          {step.bullets.map((bullet) => (
            <View key={bullet} style={styles.bulletRow}>
              <View style={styles.bulletIcon}>
                <Icon name="check" size={12} color={Serene.secondary} />
              </View>
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {STEPS.map((entry, dotIndex) => (
            <Pressable
              key={entry.title}
              onPress={() => setIndex(dotIndex)}
              accessibilityRole="button"
              accessibilityLabel={`Étape ${dotIndex + 1}`}
              style={[styles.dot, dotIndex === index && styles.dotActive]}
            />
          ))}
        </View>

        <Pressable style={styles.primaryButton} accessibilityRole="button" onPress={next}>
          <Text style={styles.primaryButtonText}>
            {last ? 'Commencer' : 'Suivant'}
          </Text>
          <Icon name={last ? 'check' : 'arrow_forward'} size={18} color={Serene.onPrimary} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Serene.surface,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.gutter,
    paddingTop: Space.sm,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontFamily: FontFamily.headingBold,
    fontSize: 19,
    lineHeight: 24,
    color: Serene.onPrimary,
  },
  skip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  skipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  stage: {
    flex: 1,
    paddingHorizontal: Space.gutter,
    paddingTop: Space.lg,
  },
  illustration: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
  },
  illustrationRing: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
    opacity: 0.35,
  },
  illustrationCircle: {
    width: 132,
    height: 132,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.floating,
  },
  floatingCard: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  floatingText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurface,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
  },
  badgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Serene.onSecondaryContainer,
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: 26,
    lineHeight: 33,
    color: Serene.onSurface,
    marginTop: 10,
  },
  text: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 20,
    color: Serene.onSurfaceVariant,
    marginTop: 6,
  },
  bullets: {
    gap: 8,
    marginTop: Space.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletIcon: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurface,
  },
  footer: {
    paddingHorizontal: Space.gutter,
    paddingBottom: Space.lg,
    gap: Space.md,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  dotActive: {
    width: 24,
    backgroundColor: Serene.primary,
  },
  primaryButton: {
    height: 50,
    borderRadius: Radius.xl,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.floating,
  },
  primaryButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
});

