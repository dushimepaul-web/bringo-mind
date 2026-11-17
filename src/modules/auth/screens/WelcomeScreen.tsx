// S-01 - Bienvenue / présentation | Module M01 Comptes et authentification | Phase S0
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Space } from '@/constants/design';

import {
  AuthBrand,
  AuthCard,
  AuthScreen,
  PrimaryButton,
  SecondaryButton,
  TextLink,
} from '../components/auth-ui';

const FEATURES = [
  {
    icon: 'checklist',
    title: 'Tâches et rappels',
    text: 'Ne ratez plus une échéance administrative.',
  },
  {
    icon: 'auto_awesome',
    title: 'Kora, votre assistant',
    text: 'Analyse vos documents et propose les prochaines étapes.',
  },
  {
    icon: 'diversity_3',
    title: 'Foyer partagé',
    text: 'Collaborez sur les démarches avec votre famille.',
  },
];

export default function WelcomeScreen() {
  const { c, styles } = useLook();
  return (
    <AuthScreen toggle={false}>
      <View style={styles.topBar}>
        <AuthBrand compact />
        <View style={styles.topActions}>
          <ThemeToggle />
          <Pressable
            style={({ pressed }) => [styles.loginPill, pressed && styles.pressed]}
            accessibilityRole="button"
            onPress={() => router.push('/login')}>
            <Text style={styles.loginPillText}>Se connecter</Text>
          </Pressable>
        </View>
      </View>

      <AuthCard style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Icon name="verified" size={14} color={c.link} filled />
          <Text style={styles.heroBadgeText}>Assistant administratif</Text>
        </View>
        <Text style={styles.heroTitle}>
          Simplifiez votre vie{'\n'}
          <Text style={styles.accent}>administrative</Text>
        </Text>
        <View style={styles.heroUnderline} />
        <Text style={styles.heroText}>
          Documents, tâches, rappels et calendrier réunis dans une seule application sereine.
        </Text>

        <View style={styles.heroArt}>
          <View style={styles.artRow}>
            <View style={styles.artPill}>
              <Icon name="task_alt" size={16} color={c.success} />
              <Text style={styles.artPillText}>Taxe foncière réglée</Text>
            </View>
            <View style={styles.artPill}>
              <Icon name="event" size={16} color={c.link} />
              <Text style={styles.artPillText}>RDV demain</Text>
            </View>
          </View>
          <View style={styles.artPill}>
            <Icon name="picture_as_pdf" size={16} color={c.error} />
            <Text style={styles.artPillText}>Attestation — signée</Text>
          </View>
        </View>
      </AuthCard>

      <View style={styles.features}>
        {FEATURES.map((feature) => (
          <View key={feature.title} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Icon name={feature.icon} size={22} color={c.link} />
            </View>
            <View style={styles.featureBody}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          </View>
        ))}
      </View>

      <PrimaryButton label="Créer un compte" onPress={() => router.push('/register')} />
      <SecondaryButton label="J’ai déjà un compte" onPress={() => router.push('/login')} />

      <View style={styles.discover}>
        <TextLink
          label="Découvrir Bringo Mind en 3 étapes"
          trailingIcon="chevron_right"
          onPress={() => router.push('/onboarding')}
        />
      </View>

      <Text style={styles.legal}>
        En continuant, vous acceptez nos conditions d’utilisation et notre politique de
        confidentialité.
      </Text>
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
    loginPill: {
      paddingHorizontal: 16,
      height: 40,
      justifyContent: 'center',
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    loginPillText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    pressed: {
      opacity: 0.7,
    },
    heroCard: {
      padding: 20,
    },
    heroBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: Radius.full,
      backgroundColor: c.tintMint,
    },
    heroBadgeText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 12,
      lineHeight: 16,
      color: c.link,
    },
    heroTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 30,
      lineHeight: 36,
      letterSpacing: -0.6,
      color: c.text,
      marginTop: 14,
    },
    accent: {
      color: c.link,
    },
    heroUnderline: {
      width: 140,
      height: 4,
      borderRadius: Radius.full,
      backgroundColor: c.link,
      marginTop: 6,
      marginLeft: 12,
      transform: [{ rotate: '-2deg' }],
    },
    heroText: {
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 22,
      color: c.muted,
      marginTop: 14,
    },
    heroArt: {
      marginTop: 16,
      gap: 8,
    },
    artRow: {
      flexDirection: 'row',
      gap: 8,
    },
    artPill: {
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.soft,
    },
    artPillText: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.text,
    },
    features: {
      gap: 14,
      marginTop: Space.lg,
      marginBottom: Space.xs,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    featureIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: c.tintMint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureBody: {
      flex: 1,
      minWidth: 0,
    },
    featureTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    featureText: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    discover: {
      alignItems: 'center',
      marginTop: Space.lg,
    },
    legal: {
      fontFamily: FontFamily.body,
      fontSize: 12,
      lineHeight: 17,
      color: c.muted,
      textAlign: 'center',
      marginTop: Space.md,
    },
  });
}
