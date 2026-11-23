// S-20 - Profil et paramètres | Module M09 Profil | Phase S8
import { router, useFocusEffect, useLocalSearchParams, type Href } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { BottomSheet, PrimaryButton, SecondaryButton, SheetOption, Tag, UndoToast, useKitStyles } from '@/components/ui/kit';
import { SettingsRow, SettingsSection, ToggleSwitch } from '@/components/ui/settings';
import { userMessage } from '@/lib/api';
import { IS_DEMO } from '@/lib/config';
import { appLock } from '@/lib/app-lock';
import { DEMO_STATES, setDemoState, useDemoState } from '@/lib/demo-state';
import { replayIntro } from '@/lib/launch';
import { useSession } from '@/lib/session';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { formatLongDay } from '@/lib/demo-dates';

import { LANGUAGES } from '../data';
import { initialsOf, profileActions, syncProfile, useProfileState } from '../store';

type Sheet = 'logout' | 'password' | 'mfaSetup' | 'mfaCodes' | 'twoFactorOff' | 'sessions' | 'demo' | 'launch' | null;

/** Réglages trouvables par la recherche. */
const SEARCH_INDEX: { title: string; keywords: string; icon: string; tint: string; href: Href }[] = [
  { title: 'Informations personnelles', keywords: 'nom prénom e-mail adresse', icon: 'badge', tint: '#2F7BE0', href: '/profile/complete' },
  { title: 'Mot de passe', keywords: 'sécurité changer', icon: 'lock', tint: '#6B7280', href: { pathname: '/profile', params: { open: 'password' } } },
  { title: 'Face ID', keywords: 'biométrie empreinte verrouillage déverrouillage', icon: 'fingerprint', tint: '#16A34A', href: '/profile/biometric' },
  { title: 'Langue et région', keywords: 'français anglais fuseau horaire devise date heure', icon: 'language', tint: '#2F7BE0', href: '/profile/preferences' },
  { title: 'Affichage', keywords: 'thème sombre clair taille texte calendrier', icon: 'palette', tint: '#E0518E', href: '/profile/preferences' },
  { title: 'Notifications', keywords: 'alertes silence canaux e-mail push', icon: 'notifications', tint: '#E5484D', href: '/notifications/settings' },
  { title: 'Connexions externes', keywords: 'google gmail outlook calendrier messagerie', icon: 'cable', tint: '#0CA07C', href: '/integrations' },
  { title: 'Bringo Mind Premium', keywords: 'abonnement facture paiement', icon: 'workspace_premium', tint: '#E0A100', href: '/billing' },
  { title: 'Confidentialité et données', keywords: 'consentement export suppression compte rgpd', icon: 'shield', tint: '#1D5ED0', href: '/profile/privacy' },
  { title: 'Aide et support', keywords: 'question contact faq', icon: 'help', tint: '#6B7280', href: '/support' },
];

export default function ProfileSettingsScreen() {
  const { c, styles } = useLook();
  const { signOut } = useSession();
  const kitStyles = useKitStyles();
  const { preferences, user, biometric, twoFactor, sessions, deletionAt, flash } = useProfileState();
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const demoState = useDemoState();
  const { open } = useLocalSearchParams<{ open?: string }>();
  // Champs des feuilles « mot de passe » et « double authentification ».
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirmNext, setConfirmNext] = useState('');
  const [code, setCode] = useState('');
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);

  const openSheet = (name: Sheet) => {
    setCurrent('');
    setNext('');
    setConfirmNext('');
    setCode('');
    setSheetError(null);
    setSheet(name);
  };

  // Lien « Changer mon mot de passe » depuis un autre écran.
  useEffect(() => {
    if (open === 'password') openSheet('password');
  }, [open]);

  /** Lance une action d'une feuille : erreur affichée dans la feuille, sinon fermeture. */
  const run = (action: () => Promise<unknown>, done: () => void) => {
    if (busy) return;
    setBusy(true);
    setSheetError(null);
    action()
      .then(done)
      .catch((error: unknown) => setSheetError(userMessage(error)))
      .finally(() => setBusy(false));
  };

  const passwordError =
    next.length > 0 && next.length < 8
      ? 'Au moins 8 caractères.'
      : confirmNext.length > 0 && confirmNext !== next
        ? 'Les deux mots de passe ne correspondent pas.'
        : null;
  const canChangePassword = current.length > 0 && next.length >= 8 && next === confirmNext;

  useFocusEffect(
    useCallback(() => {
      if (flash) {
        setToast(flash);
        profileActions.setFlash(null);
      }
    }, [flash]),
  );

  // Rafraîchit compte, réglages, sessions et consentements à l'arrivée sur l'écran.
  useFocusEffect(
    useCallback(() => {
      void syncProfile().catch((error: unknown) => setToast({ text: userMessage(error) }));
    }, []),
  );

  const language = LANGUAGES.find((entry) => entry.key === preferences.language)?.title;
  const otherSessions = sessions.filter((session) => !session.current);
  const [query, setQuery] = useState('');
  const term = query.trim().toLowerCase();
  const searchResults = term
    ? SEARCH_INDEX.filter((entry) => `${entry.title} ${entry.keywords}`.toLowerCase().includes(term))
    : null;

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <AppHeader />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Paramètres</Text>
        <View style={styles.search}>
          <Icon name="search" size={20} color={c.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un réglage"
            placeholderTextColor={c.muted}
            selectionColor={c.link}
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Rechercher un réglage"
          />
          {query ? (
            <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Effacer" onPress={() => setQuery('')}>
              <Icon name="cancel" size={18} color={c.muted} filled />
            </Pressable>
          ) : null}
        </View>

        {searchResults ? (
          <SettingsSection title={searchResults.length ? 'Résultats' : 'Aucun réglage trouvé'} icon="search">
            {searchResults.map((entry, index) => (
              <SettingsRow key={entry.title} first={index === 0} icon={entry.icon} tint={entry.tint} title={entry.title} onPress={() => router.push(entry.href)} />
            ))}
          </SettingsSection>
        ) : (
        <>
        {deletionAt ? (
          <View style={styles.deletion}>
            <Icon name="warning" size={22} color={c.error} />
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

        {/* Identité : toucher la carte ouvre les informations personnelles */}
        <Pressable
          style={({ pressed }) => [kitStyles.card, styles.profileCard, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`${fullName}, informations personnelles`}
          onPress={() => router.push('/profile/complete')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsOf(user)}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.name} numberOfLines={1}>
              {fullName}
            </Text>
            <Text style={kitStyles.muted} numberOfLines={1}>
              {user.email}
            </Text>
            <View style={styles.tags}>
              {user.emailVerified ? (
                <Tag label="E-mail vérifié" icon="verified" tone="teal" />
              ) : (
                <Tag label="E-mail à vérifier" icon="schedule" />
              )}
            </View>
          </View>
          <Icon name="chevron_right" size={24} color={c.muted} />
        </Pressable>

        <SettingsSection title="Compte" icon="person">
          <SettingsRow
            first
            icon="badge"
            tint="#2F7BE0"
            title="Informations personnelles"
            onPress={() => router.push('/profile/complete')}
          />
          <SettingsRow
            icon="lock"
            tint="#6B7280"
            title="Mot de passe"
            onPress={() => openSheet('password')}
          />
        </SettingsSection>

        <SettingsSection title="Sécurité" icon="shield">
          <SettingsRow
            first
            icon="fingerprint"
            tint="#16A34A"
            title="Face ID"
            onPress={() => router.push('/profile/biometric')}
            right={
              <View style={styles.rowEnd}>
                <Text style={styles.rowValue}>{biometric ? 'Activé' : 'Désactivé'}</Text>
                <Icon name="chevron_right" size={22} color={c.muted} />
              </View>
            }
          />
          <SettingsRow
            icon="verified_user"
            tint="#0FB5A3"
            title="Double authentification"
            right={
              <ToggleSwitch
                value={twoFactor}
                label="Double authentification"
                onValueChange={(value) => {
                  if (!value) {
                    openSheet('twoFactorOff');
                    return;
                  }
                  openSheet('mfaSetup');
                  setMfaSecret(null);
                  profileActions
                    .startTwoFactor()
                    .then((setup) => setMfaSecret(setup.secret))
                    .catch((error: unknown) => setSheetError(userMessage(error)));
                }}
              />
            }
          />
          <SettingsRow
            icon="devices"
            tint="#5B5BD6"
            title="Appareils connectés"
            onPress={() => setSheet('sessions')}
            right={
              <View style={styles.rowEnd}>
                <Text style={styles.rowValue}>{sessions.length}</Text>
                <Icon name="chevron_right" size={22} color={c.muted} />
              </View>
            }
          />
        </SettingsSection>

        <SettingsSection title="Préférences" icon="tune">
          <SettingsRow
            first
            icon="language"
            tint="#2F7BE0"
            title="Langue et région"
            onPress={() => router.push('/profile/preferences')}
            right={
              <View style={styles.rowEnd}>
                <Text style={styles.rowValue}>{language}</Text>
                <Icon name="chevron_right" size={22} color={c.muted} />
              </View>
            }
          />
          <SettingsRow
            icon="palette"
            tint="#E0518E"
            title="Affichage"
            onPress={() => router.push('/profile/preferences')}
          />
          <SettingsRow
            icon="notifications"
            tint="#E5484D"
            title="Notifications"
            onPress={() => router.push('/notifications/settings')}
          />
          <SettingsRow
            icon="cable"
            tint="#0CA07C"
            title="Connexions externes"
            onPress={() => router.push('/integrations')}
          />
        </SettingsSection>


        <SettingsSection title="Abonnement et aide" icon="workspace_premium">
          <SettingsRow first icon="workspace_premium" tint="#E0A100" title="Bringo Mind Premium" onPress={() => router.push('/billing')} />
          <SettingsRow icon="shield" tint="#1D5ED0" title="Confidentialité et données" onPress={() => router.push('/profile/privacy')} />
          <SettingsRow icon="help" tint="#6B7280" title="Aide et support" onPress={() => router.push('/support')} />
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

        </>
        )}

        <SecondaryButton label="Se déconnecter" icon="logout" danger style={styles.logout} onPress={() => setSheet('logout')} />
        <Text style={styles.version}>Bringo Mind 1.0.0</Text>
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
            // POST /auth/logout (session retrouvée par le cookie), puis session locale effacée.
            void signOut().finally(() => router.replace('/login'));
          }}
        />
        <SecondaryButton label="Rester connecté" onPress={() => setSheet(null)} />
      </BottomSheet>

      {/* Désactiver la double authentification */}
      <BottomSheet
        visible={sheet === 'twoFactorOff'}
        title="Désactiver la double authentification ?"
        subtitle="Votre compte sera protégé uniquement par votre mot de passe. Confirmez avec votre mot de passe."
        onClose={() => setSheet(null)}>
        <TextInput
          style={kitStyles.input}
          value={current}
          onChangeText={setCurrent}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          placeholder="Mot de passe"
          placeholderTextColor={c.muted}
          selectionColor={c.link}
          accessibilityLabel="Mot de passe"
        />
        {sheetError ? <Text style={styles.sheetError}>{sheetError}</Text> : null}
        <SecondaryButton
          label={busy ? 'Désactivation…' : 'Désactiver'}
          danger
          style={!current || busy ? styles.disabledButton : undefined}
          onPress={() => {
            if (!current) return;
            run(
              () => profileActions.disableTwoFactor(current),
              () => {
                setSheet(null);
                setToast({ text: 'Double authentification désactivée' });
              },
            );
          }}
        />
        <SecondaryButton label="Garder activée" onPress={() => setSheet(null)} />
      </BottomSheet>

      {/* Changer le mot de passe */}
      <BottomSheet
        visible={sheet === 'password'}
        title="Changer le mot de passe"
        subtitle="Les autres appareils resteront connectés. Déconnectez-les ensuite si besoin."
        onClose={() => setSheet(null)}>
        <TextInput
          style={kitStyles.input}
          value={current}
          onChangeText={setCurrent}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          placeholder="Mot de passe actuel"
          placeholderTextColor={c.muted}
          selectionColor={c.link}
          accessibilityLabel="Mot de passe actuel"
        />
        <TextInput
          style={kitStyles.input}
          value={next}
          onChangeText={setNext}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          placeholder="Nouveau mot de passe (8 caractères au moins)"
          placeholderTextColor={c.muted}
          selectionColor={c.link}
          accessibilityLabel="Nouveau mot de passe"
        />
        <TextInput
          style={kitStyles.input}
          value={confirmNext}
          onChangeText={setConfirmNext}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          placeholder="Confirmer le nouveau mot de passe"
          placeholderTextColor={c.muted}
          selectionColor={c.link}
          accessibilityLabel="Confirmer le nouveau mot de passe"
        />
        {passwordError || sheetError ? <Text style={styles.sheetError}>{passwordError ?? sheetError}</Text> : null}
        <PrimaryButton
          label={busy ? 'Enregistrement…' : 'Changer le mot de passe'}
          icon="lock_reset"
          disabled={!canChangePassword || busy}
          onPress={() =>
            run(
              () => profileActions.changePassword(current, next),
              () => {
                setSheet(null);
                setToast({ text: 'Mot de passe changé' });
              },
            )
          }
        />
        <SecondaryButton label="Annuler" onPress={() => setSheet(null)} />
      </BottomSheet>

      {/* Activer la double authentification : clé, puis code de l'application d'authentification */}
      <BottomSheet
        visible={sheet === 'mfaSetup'}
        title="Activer la double authentification"
        subtitle="Ajoutez cette clé dans votre application d’authentification (Google Authenticator, Microsoft Authenticator…), puis saisissez le code à 6 chiffres."
        onClose={() => setSheet(null)}>
        <View style={styles.secretBox}>
          <Text selectable style={styles.secretText}>
            {mfaSecret ?? (sheetError ? '—' : 'Préparation de la clé…')}
          </Text>
        </View>
        <TextInput
          style={kitStyles.input}
          value={code}
          onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          placeholder="Code à 6 chiffres"
          placeholderTextColor={c.muted}
          selectionColor={c.link}
          accessibilityLabel="Code à 6 chiffres"
        />
        {sheetError ? <Text style={styles.sheetError}>{sheetError}</Text> : null}
        <PrimaryButton
          label={busy ? 'Vérification…' : 'Activer'}
          icon="verified_user"
          disabled={!mfaSecret || code.length !== 6 || busy}
          onPress={() =>
            run(
              async () => setRecoveryCodes(await profileActions.enableTwoFactor(code)),
              () => setSheet('mfaCodes'),
            )
          }
        />
        <SecondaryButton label="Annuler" onPress={() => setSheet(null)} />
      </BottomSheet>

      {/* Codes de secours : affichés une seule fois */}
      <BottomSheet
        visible={sheet === 'mfaCodes'}
        title="Double authentification activée"
        subtitle="Notez ces codes de secours et gardez-les en lieu sûr : chacun permet une connexion si vous perdez votre téléphone. Ils ne seront plus affichés."
        onClose={() => setSheet(null)}>
        <View style={styles.secretBox}>
          <Text selectable style={styles.secretText}>
            {recoveryCodes.length ? recoveryCodes.join('\n') : 'Aucun code renvoyé'}
          </Text>
        </View>
        <PrimaryButton
          label="J’ai noté mes codes"
          icon="check"
          onPress={() => {
            setRecoveryCodes([]);
            setSheet(null);
          }}
        />
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
              <Icon name={session.icon} size={22} color={c.text} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.sessionTitle}>{session.device}</Text>
              <Text style={styles.sessionMeta}>{session.detail}</Text>
            </View>
            {session.current ? (
              <Tag label="Cet appareil" tone="teal" />
            ) : (
              <Pressable
                hitSlop={8}
                accessibilityRole="button"
                onPress={() => {
                  profileActions.signOutSession(session.id);
                  setSheet(null);
                  setToast({ text: `${session.device} a été déconnecté` });
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
                color={demoState === entry.key ? c.solid : c.muted}
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

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    sheetError: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.error,
    },
    disabledButton: {
      opacity: 0.45,
    },
    secretBox: {
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.soft,
      padding: 14,
    },
    secretText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 1,
      color: c.text,
      textAlign: 'center',
    },
    pageTitle: {
      marginTop: 12,
      fontFamily: FontFamily.headingBold,
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.5,
      color: c.text,
    },
    search: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      minHeight: 46,
      marginTop: 12,
      paddingHorizontal: 12,
      borderRadius: 14,
      backgroundColor: c.soft,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 10,
      fontFamily: FontFamily.body,
      fontSize: 16,
      lineHeight: 22,
      color: c.text,
      outlineWidth: 0,
      outlineStyle: 'solid',
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginTop: 16,
    },
    rowValue: {
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 19,
      color: c.muted,
    },
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
      backgroundColor: c.dark ? '#3B1D24' : '#fff5f5',
      borderWidth: 1,
      borderColor: c.dark ? '#5B2A33' : '#fecaca',
    },
    deletionTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.error,
    },
    deletionText: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.text,
    },
    deletionAction: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.link,
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
      width: 60,
      height: 60,
      borderRadius: Radius.full,
      backgroundColor: '#0C1A37',
      borderWidth: c.dark ? 1.5 : 0,
      borderColor: '#3B5079',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: FontFamily.headingBold,
      fontSize: 22,
      lineHeight: 28,
      color: '#FFFFFF',
    },
    avatarEdit: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: 32,
      height: 32,
      borderRadius: Radius.full,
      backgroundColor: c.solid,
      borderWidth: 3,
      borderColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      fontFamily: FontFamily.headingBold,
      fontSize: 24,
      lineHeight: 30,
      letterSpacing: -0.3,
      color: c.text,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 4,
    },
    stats: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
    },
    stat: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 4,
    },
    statBorder: {
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderLeftColor: c.border,
    },
    statValue: {
      fontFamily: FontFamily.headingBold,
      fontSize: 22,
      lineHeight: 28,
      color: c.text,
    },
    statLabel: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
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
      color: c.muted,
    },
    session: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
    },
    sessionIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: c.soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sessionTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    sessionMeta: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    demoList: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
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
      borderTopColor: c.border,
    },
    sessionAction: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.error,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
