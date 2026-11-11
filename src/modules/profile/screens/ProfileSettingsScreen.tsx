// S-20 - Profil et paramètres | Module M09 Profil | Phase S8
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import {
  BottomSheet,
  PrimaryButton,
  SecondaryButton,
  SheetOption,
  Tag,
  TopBar,
  UndoToast,
  kitStyles,
} from '@/components/ui/kit';
import { SettingsRow, SettingsSection, ToggleSwitch } from '@/components/ui/settings';
import { IS_DEMO } from '@/lib/config';
import { appLock } from '@/lib/app-lock';
import { DEMO_STATES, setDemoState, useDemoState } from '@/lib/demo-state';
import { replayIntro } from '@/lib/launch';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';
import { formatLongDay } from '@/lib/demo-dates';

import { CALENDAR_VIEWS, CURRENCIES, LANGUAGES, STATS, THEMES, TIMEZONES, USER } from '../data';
import { LOCK_DELAYS, initialsOf, profileActions, useProfileState } from '../store';

type Sheet = 'logout' | 'twoFactorOff' | 'sessions' | 'demo' | 'launch' | null;

export default function ProfileSettingsScreen() {
  const { preferences, user, biometric, lockDelay, twoFactor, sessions, deletionAt, flash } = useProfileState();
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const demoState = useDemoState();

  useFocusEffect(
    useCallback(() => {
      if (flash) {
        setToast(flash);
        profileActions.setFlash(null);
      }
    }, [flash]),
  );

  const language = LANGUAGES.find((entry) => entry.key === preferences.language)?.title;
  const zone = TIMEZONES.find((entry) => entry.key === preferences.timezone)?.title;
  const currency = CURRENCIES.find((entry) => entry.key === preferences.currency)?.label.split(' ')[0];
  const theme = THEMES.find((entry) => entry.key === preferences.theme)?.label.toLowerCase();
  const view = CALENDAR_VIEWS.find((entry) => entry.key === preferences.calendarView)?.label.toLowerCase();
  const otherSessions = sessions.filter((session) => !session.current);

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar title="Mon profil" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        {deletionAt ? (
          <View style={styles.deletion}>
            <Icon name="warning" size={22} color={Serene.error} />
            <View style={styles.flex}>
              <Text style={styles.deletionTitle}>Suppression du compte prévue</Text>
              <Text style={styles.deletionText}>Le {formatLongDay(deletionAt).toLowerCase()}. Vous pouvez encore changer d’avis.</Text>
            </View>
            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              onPress={() => {
                profileActions.cancelDeletion();
                setToast({ text: 'Suppression annulée : votre compte est conservé' });
              }}>
              <Text style={styles.deletionAction}>Annuler</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Identité */}
        <View style={[kitStyles.card, styles.hero]}>
          <Pressable
            style={({ pressed }) => [styles.avatarWrap, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Modifier la photo et les informations"
            onPress={() => router.push('/profile/complete')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsOf(user)}</Text>
            </View>
            <View style={styles.avatarEdit}>
              <Icon name="photo_camera" size={16} color={Serene.onPrimary} />
            </View>
          </Pressable>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={kitStyles.muted}>{USER.email}</Text>
          <View style={styles.tags}>
            <Tag label={USER.plan} icon="workspace_premium" tone="teal" />
            <Tag label={`Membre depuis ${USER.memberSince}`} />
          </View>
          <View style={styles.stats}>
            {STATS.map((stat, index) => (
              <Pressable
                key={stat.key}
                style={({ pressed }) => [styles.stat, index > 0 && styles.statBorder, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`${stat.value} ${stat.label}`}
                onPress={() => router.push(stat.href)}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <SettingsSection title="Compte" icon="person">
          <SettingsRow
            first
            icon="badge"
            title="Informations personnelles"
            subtitle={`${fullName} • ${user.phone}`}
            onPress={() => router.push('/profile/complete')}
          />
          <SettingsRow
            icon="mail"
            title="Adresse e-mail"
            subtitle={USER.email}
            right={<Tag label="Vérifiée" icon="verified" tone="success" />}
          />
          <SettingsRow
            icon="lock"
            title="Mot de passe"
            subtitle="Modifié il y a 3 mois"
            onPress={() => router.push('/reset-password')}
          />
        </SettingsSection>

        <SettingsSection title="Sécurité" icon="shield">
          <SettingsRow
            first
            icon="fingerprint"
            title="Déverrouillage biométrique"
            subtitle={
              biometric
                ? `Face ID • verrouillage ${LOCK_DELAYS.find((entry) => entry.key === lockDelay)?.label.toLowerCase()}`
                : 'Désactivé'
            }
            onPress={() => router.push('/profile/biometric')}
            right={
              <View style={styles.rowEnd}>
                <Tag label={biometric ? 'Activé' : 'Désactivé'} tone={biometric ? 'success' : 'neutral'} />
                <Icon name="chevron_right" size={22} color={Serene.onSurfaceVariant} />
              </View>
            }
          />
          <SettingsRow
            icon="verified_user"
            title="Double authentification"
            subtitle={twoFactor ? 'Activée • code par SMS' : 'Recommandée pour protéger vos documents'}
            right={
              <ToggleSwitch
                value={twoFactor}
                label="Double authentification"
                onValueChange={(value) => {
                  if (!value) {
                    setSheet('twoFactorOff');
                    return;
                  }
                  profileActions.setTwoFactor(true);
                  setToast({ text: 'Double authentification activée' });
                }}
              />
            }
          />
          <SettingsRow
            icon="devices"
            title="Appareils connectés"
            subtitle={`${sessions.length} appareil${sessions.length > 1 ? 's' : ''} • iPhone 15 (cet appareil)`}
            onPress={() => setSheet('sessions')}
          />
        </SettingsSection>

        <SettingsSection title="Préférences" icon="tune">
          <SettingsRow
            first
            icon="language"
            title="Langue et région"
            subtitle={`${language} • ${zone} • ${currency}`}
            onPress={() => router.push('/profile/preferences')}
          />
          <SettingsRow
            icon="palette"
            title="Affichage"
            subtitle={`Thème ${theme} • calendrier en vue ${view}`}
            onPress={() => router.push('/profile/preferences')}
          />
          <SettingsRow
            icon="notifications"
            title="Notifications"
            subtitle="Canaux, types et heures de silence"
            onPress={() => router.push('/notifications/settings')}
          />
          <SettingsRow
            icon="cable"
            title="Connexions externes"
            subtitle="Messagerie et calendrier"
            onPress={() => router.push('/integrations')}
          />
        </SettingsSection>

        <SettingsSection title="Foyer" icon="family_restroom">
          <SettingsRow
            first
            icon="home"
            title={USER.household.name}
            subtitle={`${USER.household.role} • ${USER.household.members} membres`}
            onPress={() => router.push('/household')}
          />
        </SettingsSection>

        <SettingsSection title="Abonnement" icon="workspace_premium">
          <SettingsRow
            first
            icon="workspace_premium"
            title="Bringo Mind Premium"
            subtitle="Kora illimitée • documents avancés • foyer étendu"
            onPress={() => router.push('/billing')}
          />
        </SettingsSection>

        <SettingsSection title="Confidentialité et aide" icon="lock">
          <SettingsRow
            first
            icon="shield"
            title="Confidentialité et données"
            subtitle="Consentements, export, suppression du compte"
            onPress={() => router.push('/profile/privacy')}
          />
          <SettingsRow icon="help" title="Aide et support" subtitle="Questions fréquentes, contact" onPress={() => router.push('/support')} />
        </SettingsSection>

        {IS_DEMO ? (
          <SettingsSection title="Démo" icon="science" footer="Pour relire le design des états réseau. Ce réglage disparaît quand l’app est branchée sur l’API.">
            <SettingsRow
              first
              icon="tune"
              title="Simuler un état"
              subtitle={DEMO_STATES.find((entry) => entry.key === demoState)?.label}
              onPress={() => setSheet('demo')}
            />
            <SettingsRow
              icon="rocket_launch"
              title="Revoir l’ouverture"
              subtitle="Animation, première ouverture, connexion, Face ID"
              onPress={() => setSheet('launch')}
            />
          </SettingsSection>
        ) : null}

        <SecondaryButton label="Se déconnecter" icon="logout" style={styles.logout} onPress={() => setSheet('logout')} />
        <Text style={styles.version}>Bringo Mind 1.0.0 • version de démonstration</Text>
      </ScrollView>

      {/* Déconnexion */}
      <BottomSheet
        visible={sheet === 'logout'}
        title="Se déconnecter ?"
        subtitle="Vos données restent enregistrées. Vous pourrez vous reconnecter à tout moment."
        onClose={() => setSheet(null)}>
        <PrimaryButton
          label="Se déconnecter"
          icon="logout"
          onPress={() => {
            setSheet(null);
            router.replace('/login');
          }}
        />
        <SecondaryButton label="Rester connecté" onPress={() => setSheet(null)} />
      </BottomSheet>

      {/* Désactiver la double authentification */}
      <BottomSheet
        visible={sheet === 'twoFactorOff'}
        title="Désactiver la double authentification ?"
        subtitle="Votre compte sera protégé uniquement par votre mot de passe."
        onClose={() => setSheet(null)}>
        <SecondaryButton
          label="Désactiver"
          danger
          onPress={() => {
            profileActions.setTwoFactor(false);
            setSheet(null);
            setToast({ text: 'Double authentification désactivée', undo: () => profileActions.setTwoFactor(true) });
          }}
        />
        <SecondaryButton label="Garder activée" onPress={() => setSheet(null)} />
      </BottomSheet>

      {/* Appareils connectés */}
      <BottomSheet
        visible={sheet === 'sessions'}
        title="Appareils connectés"
        subtitle="Déconnectez un appareil que vous ne reconnaissez pas."
        onClose={() => setSheet(null)}>
        {sessions.map((session) => (
          <View key={session.id} style={styles.session}>
            <View style={styles.sessionIcon}>
              <Icon name={session.icon} size={22} color={Tint.navy} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.sessionTitle}>{session.device}</Text>
              <Text style={styles.sessionMeta}>
                {session.place} • {session.when}
              </Text>
            </View>
            {session.current ? (
              <Tag label="Cet appareil" tone="teal" />
            ) : (
              <Pressable
                hitSlop={8}
                accessibilityRole="button"
                onPress={() => {
                  const undo = profileActions.signOutSession(session.id);
                  setSheet(null);
                  setToast({ text: `${session.device} a été déconnecté`, undo });
                }}>
                <Text style={styles.sessionAction}>Déconnecter</Text>
              </Pressable>
            )}
          </View>
        ))}
        {otherSessions.length === 0 ? <Text style={kitStyles.muted}>Aucun autre appareil connecté.</Text> : null}
      </BottomSheet>

      {/* Démo : simuler chargement, erreur, hors ligne ou compte vide sur les écrans principaux */}
      <BottomSheet visible={sheet === 'demo'} title="Simuler un état" subtitle="S’applique aux listes : tâches, rappels, calendrier, documents, notifications, foyer, accueil." onClose={() => setSheet(null)}>
        <View style={styles.demoList}>
          {DEMO_STATES.map((entry, index) => (
            <Pressable
              key={entry.key}
              style={({ pressed }) => [styles.demoRow, index > 0 && styles.demoBorder, pressed && styles.pressed]}
              accessibilityRole="radio"
              accessibilityState={{ selected: demoState === entry.key }}
              onPress={() => {
                setDemoState(entry.key);
                setSheet(null);
                setToast({ text: `État simulé : ${entry.label.toLowerCase()}` });
              }}>
              <View style={styles.flex}>
                <Text style={styles.sessionTitle}>{entry.label}</Text>
                <Text style={styles.sessionMeta}>{entry.hint}</Text>
              </View>
              <Icon
                name={demoState === entry.key ? 'radio_button_checked' : 'radio_button_unchecked'}
                size={22}
                color={demoState === entry.key ? Tint.black : Serene.onSurfaceVariant}
              />
            </Pressable>
          ))}
        </View>
      </BottomSheet>

      {/* Démo : rejouer chaque cas d'ouverture de l'app */}
      <BottomSheet visible={sheet === 'launch'} title="Revoir l’ouverture" subtitle="Rejoue ce que voit la personne en ouvrant l’app." onClose={() => setSheet(null)}>
        <SheetOption
          icon="animation"
          label="Animation d’ouverture"
          hint="Le « b » se dessine, puis le point s’allume"
          onPress={() => {
            setSheet(null);
            // Laisse la feuille se fermer avant de rejouer (elle passerait sinon devant l'animation).
            setTimeout(replayIntro, 350);
          }}
        />
        <SheetOption
          icon="waving_hand"
          label="Première ouverture"
          hint="Animation, puis présentation en 3 écrans"
          onPress={() => {
            setSheet(null);
            // Laisse la feuille se fermer avant de rejouer (elle passerait sinon devant l'animation).
            setTimeout(replayIntro, 350);
            router.replace('/onboarding');
          }}
        />
        <SheetOption
          icon="login"
          label="Personne non connectée"
          hint="Animation, puis écran Bienvenue"
          onPress={() => {
            setSheet(null);
            // Laisse la feuille se fermer avant de rejouer (elle passerait sinon devant l'animation).
            setTimeout(replayIntro, 350);
            router.replace('/welcome');
          }}
        />
        <SheetOption
          icon="face"
          label="Verrouillage Face ID"
          hint={biometric ? 'Comme au retour dans l’app après le délai' : 'Activez d’abord le déverrouillage biométrique'}
          onPress={() => {
            setSheet(null);
            if (!appLock.lockNow()) setToast({ text: 'Activez d’abord le déverrouillage biométrique' });
          }}
        />
      </BottomSheet>

      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={24} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  content: {
    paddingTop: 4,
    paddingBottom: 40,
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deletion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  deletionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.error,
  },
  deletionText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Tint.navy,
  },
  deletionAction: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.primary,
  },
  hero: {
    alignItems: 'center',
    gap: 6,
    paddingTop: 22,
  },
  avatarWrap: {
    marginBottom: 6,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: Radius.full,
    backgroundColor: Tint.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 32,
    lineHeight: 40,
    color: Serene.onPrimary,
  },
  avatarEdit: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Tint.black,
    borderWidth: 3,
    borderColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: FontFamily.headingBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
    color: Tint.navy,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  stats: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  statBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: Tint.border,
  },
  statValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    color: Tint.navy,
  },
  statLabel: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
  },
  logout: {
    marginTop: 26,
  },
  version: {
    marginTop: 14,
    textAlign: 'center',
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  session: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Tint.border,
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Tint.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  sessionMeta: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  demoList: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Tint.border,
    overflow: 'hidden',
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  demoBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
  },
  sessionAction: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.error,
  },
});
