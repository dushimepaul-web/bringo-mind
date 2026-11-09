// S-20 - Paramètres du profil | Module M09 Profil et paramètres | Phase S8
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

export default function ProfileSettingsScreen() {
  const [biometric, setBiometric] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={() => router.back()}>
          <Icon name="arrow_back" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Mon profil</Text>
        <Pressable
          style={styles.headerButton}
          accessibilityLabel="Modifier le profil"
          onPress={() => router.push('/profile/complete')}>
          <Icon name="edit" size={20} color={Serene.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>C</Text>
            </View>
            <Pressable style={styles.cameraBadge} accessibilityLabel="Changer la photo">
              <Icon name="photo_camera" size={14} color={Serene.onPrimary} />
            </Pressable>
          </View>

          <Text style={styles.name}>Claire Martin</Text>
          <Text style={styles.email}>claire.martin@email.fr</Text>

          <View style={styles.heroPills}>
            <View style={styles.planPill}>
              <Icon name="workspace_premium" size={12} color={Serene.onSecondaryContainer} />
              <Text style={styles.planPillText}>Premium</Text>
            </View>
            <View style={styles.sincePill}>
              <Text style={styles.sincePillText}>Membre depuis mai 2023</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Tâches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statLabel}>Documents</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Foyer</Text>
            </View>
          </View>
        </View>

        <SectionTitle title="Compte" />
        <View style={styles.card}>
          <SettingRow
            icon="badge"
            label="Informations personnelles"
            hint="Nom, prénom, téléphone"
            onPress={() => router.push('/profile/complete')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="mail"
            label="Adresse e-mail"
            hint="claire.martin@email.fr"
            badge="Vérifiée"
            badgeTone="success"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="lock"
            label="Mot de passe"
            hint="Modifié il y a 3 mois"
            action="Modifier"
          />
        </View>

        <SectionTitle title="Sécurité" />
        <View style={styles.card}>
          <SettingRow
            icon="fingerprint"
            label="Déverrouillage biométrique"
            hint="Face ID / empreinte"
            toggle={{ value: biometric, onChange: setBiometric }}
            onPress={() => router.push('/profile/biometric')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="verified_user"
            label="Double authentification"
            hint={twoFactor ? 'Activée par SMS' : 'Recommandée'}
            toggle={{ value: twoFactor, onChange: setTwoFactor }}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="devices"
            label="Sessions actives"
            hint="iPhone 15 • Paris"
            action="Voir"
          />
        </View>

        <SectionTitle title="Préférences" />
        <View style={styles.card}>
          <SettingRow
            icon="language"
            label="Langue"
            hint="Français"
            onPress={() => router.push('/profile/preferences')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="public"
            label="Fuseau horaire"
            hint="Europe/Paris (UTC+2)"
            onPress={() => router.push('/profile/preferences')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="notifications"
            label="Notifications"
            hint="Push, e-mail, heures de silence"
            onPress={() => router.push('/notifications/settings')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="cable"
            label="Connexions externes"
            hint="E-mail, calendrier"
            onPress={() => router.push('/integrations')}
          />
        </View>

        <SectionTitle title="Abonnement" />
        <Pressable
          style={styles.premiumCard}
          accessibilityRole="button"
          onPress={() => router.push('/billing')}>
          <View style={styles.premiumIcon}>
            <Icon name="workspace_premium" size={22} color={Serene.onSecondaryContainer} />
          </View>
          <View style={styles.premiumBody}>
            <Text style={styles.premiumTitle}>Bringo Mind Premium</Text>
            <Text style={styles.premiumText}>
              Assistant IA illimité • Documents avancés • Foyer étendu
            </Text>
          </View>
          <Icon name="chevron_right" size={20} color={Serene.onSecondaryContainer} />
        </Pressable>

        <SectionTitle title="Confidentialité" />
        <View style={styles.card}>
          <SettingRow
            icon="shield"
            label="Confidentialité et données"
            hint="Export, consentements, suppression"
            onPress={() => router.push('/profile/privacy')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="help"
            label="Aide et support"
            hint="FAQ, contact, signalements"
            onPress={() => router.push('/support')}
          />
        </View>

        <Pressable
          style={styles.logoutButton}
          accessibilityRole="button"
          onPress={() => router.replace('/welcome')}>
          <Icon name="logout" size={18} color={Serene.onSurfaceVariant} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          accessibilityRole="button"
          onPress={() => router.push('/profile/privacy')}>
          <Text style={styles.deleteText}>Supprimer mon compte</Text>
        </Pressable>

        <Text style={styles.version}>Bringo Mind 1.0.0 • Build 2026.11</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function SettingRow({
  icon,
  label,
  hint,
  action,
  badge,
  badgeTone,
  toggle,
  onPress,
}: {
  icon: string;
  label: string;
  hint?: string;
  action?: string;
  badge?: string;
  badgeTone?: 'success';
  toggle?: { value: boolean; onChange: (value: boolean) => void };
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}>
      <View style={styles.rowIcon}>
        <Icon name={icon} size={18} color={Serene.onSurfaceVariant} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      </View>
      {badge ? (
        <View style={styles.successBadge}>
          <Icon name="verified" size={11} color={Serene.success} />
          <Text style={styles.successBadgeText}>{badge}</Text>
        </View>
      ) : null}
      {toggle ? (
        <Switch
          value={toggle.value}
          onValueChange={toggle.onChange}
          trackColor={{ false: Serene.surfaceContainerHigh, true: Serene.secondary }}
          thumbColor={Serene.surfaceContainerLowest}
        />
      ) : action ? (
        <Text style={styles.rowAction}>{action}</Text>
      ) : onPress ? (
        <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Serene.surface,
  },
  header: {
    height: 56,
    paddingHorizontal: Space.gutter,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Serene.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Serene.surfaceContainerHigh,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.md,
    paddingBottom: Space.lg,
  },
  heroCard: {
    alignItems: 'center',
    padding: Space.md,
    borderRadius: Radius.xxl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  avatarWrap: {
    marginBottom: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: FontFamily.headingBold,
    fontSize: 28,
    lineHeight: 34,
    color: Serene.onPrimary,
  },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
    borderWidth: 2,
    borderColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
  },
  email: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    marginTop: 1,
  },
  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  planPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
  },
  planPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSecondaryContainer,
  },
  sincePill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  sincePillText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: Space.md,
    paddingTop: Space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Serene.surfaceContainerHigh,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
    color: Serene.onSurface,
  },
  statLabel: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  sectionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
    marginTop: Space.lg,
    marginBottom: Space.sm,
  },
  card: {
    paddingHorizontal: Space.sm,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
  },
  rowLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  rowHint: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  rowAction: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.secondary,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.successContainer,
  },
  successBadgeText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.success,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.secondaryContainer,
  },
  premiumIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumBody: {
    flex: 1,
    minWidth: 0,
  },
  premiumTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSecondaryContainer,
  },
  premiumText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSecondaryContainer,
  },
  logoutButton: {
    height: 46,
    marginTop: Space.lg,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.card,
  },
  logoutText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  deleteButton: {
    height: 40,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.error,
  },
  version: {
    marginTop: Space.sm,
    textAlign: 'center',
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.outlineVariant,
  },
});
