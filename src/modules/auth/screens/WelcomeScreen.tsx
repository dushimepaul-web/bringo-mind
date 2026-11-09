// S-01 - Bienvenue / présentation | Module M01 Comptes et authentification | Phase S0
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space } from '@/constants/design';

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
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.miniLogo}>
            <Text style={styles.miniLogoLetter}>K</Text>
          </View>
          <Pressable
            style={styles.skip}
            accessibilityRole="button"
            onPress={() => router.push('/login')}>
            <Text style={styles.skipText}>Se connecter</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <Icon name="verified" size={14} color={Serene.onPrimary} />
              <Text style={styles.heroBadgeText}>Assistant administratif</Text>
            </View>
            <Text style={styles.heroTitle}>Simplifiez votre vie{'\n'}administrative</Text>
            <Text style={styles.heroText}>
              Documents, tâches, rappels et calendrier réunis dans une seule application
              sereine.
            </Text>

            <View style={styles.heroArt}>
              <View style={styles.artRow}>
                <View style={styles.artPill}>
                  <Icon name="task_alt" size={14} color={Serene.success} />
                  <Text style={styles.artPillText}>Taxe foncière réglée</Text>
                </View>
                <View style={styles.artPill}>
                  <Icon name="event" size={14} color={Serene.secondary} />
                  <Text style={styles.artPillText}>RDV demain</Text>
                </View>
              </View>
              <View style={styles.artRow}>
                <View style={[styles.artPill, styles.artPillWide]}>
                  <Icon name="picture_as_pdf" size={14} color={Serene.error} />
                  <Text style={styles.artPillText}>Attestation — signée</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.features}>
          {FEATURES.map((feature) => (
            <View key={feature.title} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Icon name={feature.icon} size={20} color={Serene.secondary} />
              </View>
              <View style={styles.featureBody}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.primaryButton}
            accessibilityRole="button"
            onPress={() => router.push('/register')}>
            <Text style={styles.primaryButtonText}>Créer un compte</Text>
            <Icon name="arrow_forward" size={18} color={Serene.onPrimary} />
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            accessibilityRole="button"
            onPress={() => router.push('/login')}>
            <Text style={styles.secondaryButtonText}>J’ai déjà un compte</Text>
          </Pressable>

          <Pressable
            style={styles.discover}
            accessibilityRole="button"
            onPress={() => router.push('/onboarding')}>
            <Text style={styles.discoverText}>Découvrir PLAA en 3 étapes</Text>
            <Icon name="chevron_right" size={16} color={Serene.secondary} />
          </Pressable>
        </View>

        <Text style={styles.legal}>
          En continuant, vous acceptez nos conditions d’utilisation et notre politique de
          confidentialité.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Serene.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.sm,
    paddingBottom: Space.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniLogo: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniLogoLetter: {
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
  hero: {
    marginTop: Space.lg,
    alignItems: 'center',
  },
  heroCard: {
    width: '100%',
    padding: 18,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
  },
  heroBadgeText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onPrimary,
  },
  heroTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 28,
    lineHeight: 36,
    color: Serene.onSurface,
    marginTop: 12,
  },
  heroText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 20,
    color: Serene.onSurfaceVariant,
    marginTop: 6,
  },
  heroArt: {
    marginTop: 14,
    gap: 6,
  },
  artRow: {
    flexDirection: 'row',
    gap: 6,
  },
  artPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
  },
  artPillWide: {
    flex: 0,
  },
  artPillText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurface,
  },
  features: {
    gap: 10,
    marginTop: Space.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBody: {
    flex: 1,
    minWidth: 0,
  },
  featureTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  featureText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  actions: {
    marginTop: Space.lg,
    gap: 8,
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
  secondaryButton: {
    height: 50,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Serene.outlineVariant,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  discover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 6,
  },
  discoverText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.secondary,
  },
  legal: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    marginTop: Space.md,
  },
});

