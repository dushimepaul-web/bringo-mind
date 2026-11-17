// [Hors catalogue] - Onboarding | Module M01 Comptes et authentification | Phase S0
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { markOnboarded } from '@/lib/launch';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Space } from '@/constants/design';

import { ThemeToggle } from '@/components/theme-toggle';
import { AuthBrand, AuthScreen, PrimaryButton } from '../components/auth-ui';

const STEPS = [
  {
    icon: 'task_alt',
    badge: 'Étape 1 sur 3',
    lead: 'Gardez',
    accent: 'le contrôle',
    text: 'Tâches, rappels et calendrier se synchronisent. Vous validez chaque suggestion avant qu’elle soit appliquée.',
    bullets: ['Rappels intelligents', 'Détection des conflits', 'Tout centralisé'],
  },
  {
    icon: 'diversity_3',
    badge: 'Étape 2 sur 3',
    lead: 'Avancez',
    accent: 'ensemble',
    text: 'Partagez les démarches avec votre foyer tout en gardant certains documents strictement privés.',
    bullets: ['Espace foyer', 'Rôles et permissions', 'Confidentialité maîtrisée'],
  },
  {
    icon: 'auto_awesome',
    badge: 'Étape 3 sur 3',
    lead: 'Laissez Kora',
    accent: 'faire le tri',
    text: 'Importez un document ou un e-mail : Kora identifie les dates, montants et actions importantes pour vous.',
    bullets: ['Analyse automatique', 'Résumé clair', 'Zéro saisie inutile'],
  },
];

/** Fin de la présentation : on ne la remontrera plus sur cet appareil. */
function finishOnboarding() {
  void markOnboarded();
  router.replace('/welcome');
}

export default function OnboardingScreen() {
  const { c, styles } = useLook();
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const last = index === STEPS.length - 1;

  const next = () => {
    if (last) {
      finishOnboarding();
      return;
    }
    setIndex((value) => value + 1);
  };

  return (
    <AuthScreen
      toggle={false}
      footer={
        <>
          <View style={styles.dots}>
            {STEPS.map((entry, dotIndex) => (
              <Pressable
                key={entry.badge}
                onPress={() => setIndex(dotIndex)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Étape ${dotIndex + 1}`}
                style={[styles.dot, dotIndex === index && styles.dotActive]}
              />
            ))}
          </View>
          <PrimaryButton
            label={last ? 'Commencer' : 'Suivant'}
            icon={last ? 'check' : 'arrow_forward'}
            onPress={next}
            style={styles.cta}
          />
        </>
      }>
      <View style={styles.topBar}>
        <AuthBrand compact />
        <View style={styles.topActions}>
          <ThemeToggle />
          <Pressable
            style={({ pressed }) => [styles.skip, pressed && styles.pressed]}
            accessibilityRole="button"
            onPress={() => finishOnboarding()}>
            <Text style={styles.skipText}>Passer</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.illustration}>
        <View style={styles.illustrationRing} />
        <View style={styles.illustrationCircle}>
          <Icon name={step.icon} size={56} color={c.solidText} />
        </View>
        <View style={styles.floatingCard}>
          <Icon name="check_circle" size={18} color={c.success} filled />
          <Text style={styles.floatingText}>Aucune action en retard</Text>
        </View>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{step.badge}</Text>
      </View>
      <Text style={styles.title}>
        {step.lead} <Text style={styles.accent}>{step.accent}</Text>
      </Text>
      <View style={styles.underline} />
      <Text style={styles.text}>{step.text}</Text>

      <View style={styles.bullets}>
        {step.bullets.map((bullet) => (
          <View key={bullet} style={styles.bulletRow}>
            <View style={styles.bulletIcon}>
              <Icon name="check" size={14} color={c.link} />
            </View>
            <Text style={styles.bulletText}>{bullet}</Text>
          </View>
        ))}
      </View>
    </AuthScreen>
  );
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (clair ou sombre). */
function useLook() {
  const c = useAppColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    topActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    skip: {
      paddingHorizontal: 16,
      height: 40,
      justifyContent: 'center',
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    skipText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    pressed: {
      opacity: 0.7,
    },
    illustration: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 240,
      marginTop: Space.md,
    },
    illustrationRing: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: Radius.full,
      backgroundColor: c.glow,
      opacity: 0.3,
    },
    illustrationCircle: {
      width: 136,
      height: 136,
      borderRadius: Radius.full,
      backgroundColor: c.text,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: c.text,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 8,
    },
    floatingCard: {
      position: 'absolute',
      bottom: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: Radius.full,
      backgroundColor: c.card,
      shadowColor: c.text,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
      elevation: 3,
    },
    floatingText: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.text,
    },
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: Radius.full,
      backgroundColor: c.tintMint,
      marginTop: Space.lg,
    },
    badgeText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: c.link,
    },
    title: {
      fontFamily: FontFamily.headingBold,
      fontSize: 32,
      lineHeight: 38,
      letterSpacing: -0.7,
      color: c.text,
      marginTop: 12,
    },
    accent: {
      color: c.link,
    },
    underline: {
      width: 130,
      height: 4,
      borderRadius: Radius.full,
      backgroundColor: c.link,
      marginTop: 6,
      marginLeft: 12,
      transform: [{ rotate: '-2deg' }],
    },
    text: {
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 22,
      color: c.muted,
      marginTop: 14,
    },
    bullets: {
      gap: 10,
      marginTop: Space.md,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    bulletIcon: {
      width: 26,
      height: 26,
      borderRadius: Radius.full,
      backgroundColor: c.tintMint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bulletText: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
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
      backgroundColor: c.border,
    },
    dotActive: {
      width: 24,
      backgroundColor: c.link,
    },
    cta: {
      marginTop: Space.md,
    },
  });
}
