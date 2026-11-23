// S-23 - Confidentialité et données | Module M09 Profil | Phase S8
// Consentements (/privacy/consents), export de toutes les données, appareils connectés,
// suppression du compte confirmée par le mot de passe, avec un délai pour changer d'avis.
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, PrimaryButton, SecondaryButton, Tag, TopBar, UndoToast, useKitStyles } from '@/components/ui/kit';
import { SettingsRow, SettingsSection, ToggleSwitch } from '@/components/ui/settings';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily } from '@/constants/design';
import { userMessage } from '@/lib/api';
import { formatLongDay } from '@/lib/demo-dates';

import { profileActions, syncProfile, useProfileState } from '../store';

type Sheet = 'export' | 'history' | 'delete' | null;
const CONFIRM_WORD = 'SUPPRIMER';

const EXPORT_STATUS: Record<string, string> = {
  pending: 'en préparation',
  processing: 'en préparation',
  queued: 'en préparation',
  completed: 'prête',
  ready: 'prête',
  failed: 'échouée',
  expired: 'expirée',
};

export default function PrivacyDataScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const { consents, deletionAt, sessions, user, lastExport, flash } = useProfileState();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const [typed, setTyped] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [owned, setOwned] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      void syncProfile().catch(() => undefined);
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      if (flash) {
        setToast(flash);
        profileActions.setFlash(null);
      }
    }, [flash]),
  );

  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD && password.length > 0;
  const exportLabel = lastExport ? EXPORT_STATUS[lastExport.status] ?? lastExport.status : null;

  const openDelete = () => {
    setTyped('');
    setPassword('');
    setSheetError(null);
    setSheet('delete');
    profileActions
      .ownedHouseholds()
      .then((list) => setOwned((list ?? []).map((entry) => entry.name)))
      .catch(() => setOwned([]));
  };

  const startExport = () => {
    setBusy(true);
    profileActions
      .requestExport()
      .then(() => {
        setSheet(null);
        setToast({ text: `Export en préparation : vous serez prévenu à ${user.email}` });
      })
      .catch((error: unknown) => setToast({ text: userMessage(error) }))
      .finally(() => setBusy(false));
  };

  const confirmDeletion = () => {
    if (!confirmed || busy) return;
    setBusy(true);
    setSheetError(null);
    profileActions
      .requestDeletion(password)
      .then((at) => {
        setSheet(null);
        setToast({ text: at ? `Suppression programmée le ${formatLongDay(at).toLowerCase()}` : 'Suppression du compte demandée' });
      })
      .catch((error: unknown) => setSheetError(userMessage(error)))
      .finally(() => {
        setBusy(false);
        setPassword('');
      });
  };

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar title="Confidentialité et données" fallback="/profile" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={[kitStyles.card, styles.hero]}>
          <View style={styles.heroIcon}>
            <Icon name="shield" size={28} color={c.solidText} />
          </View>
          <Text style={styles.heroTitle}>Vos données vous appartiennent</Text>
          <Text style={[kitStyles.muted, styles.center]}>
            Chiffrées sur nos serveurs et pendant les échanges. Rien n’est partagé sans votre accord.
          </Text>
          <View style={styles.tags}>
            <Tag label="Chiffré" icon="lock" tone="success" />
            <Tag label="RGPD" icon="verified_user" tone="success" />
            <Tag label="Privé par défaut" icon="visibility_off" tone="success" />
          </View>
        </View>

        {consents.length > 0 ? (
          <SettingsSection title="Vos consentements" icon="toggle_on" footer="Vous pouvez changer d’avis à tout moment.">
            {consents.map((consent, index) => (
              <SettingsRow
                key={consent.purpose}
                first={index === 0}
                icon={consent.icon}
                title={consent.title}
                subtitle={consent.required ? `${consent.subtitle ? `${consent.subtitle} • ` : ''}obligatoire` : consent.subtitle || undefined}
                right={
                  <ToggleSwitch
                    value={consent.granted}
                    disabled={consent.required}
                    label={consent.title}
                    onValueChange={(value) => {
                      profileActions.setConsent(consent.purpose, value);
                      setToast({ text: `${consent.title} : ${value ? 'activé' : 'désactivé'}` });
                    }}
                  />
                }
              />
            ))}
          </SettingsSection>
        ) : null}

        <SettingsSection title="Vos données" icon="database">
          <SettingsRow
            first
            icon="download"
            title="Exporter mes données"
            subtitle={exportLabel ? `Dernière demande : ${exportLabel}` : 'Toutes vos données dans une archive'}
            onPress={() => setSheet('export')}
          />
          <SettingsRow
            icon="devices"
            title="Appareils connectés"
            subtitle={sessions.length ? `${sessions.length} appareil${sessions.length > 1 ? 's' : ''}` : undefined}
            onPress={() => setSheet('history')}
          />
        </SettingsSection>

        <SettingsSection title="Supprimer le compte" icon="delete_forever">
          {deletionAt ? (
            <View style={styles.pending}>
              <Icon name="schedule" size={22} color={c.error} />
              <View style={styles.flex}>
                <Text style={styles.pendingTitle}>Suppression prévue le {formatLongDay(deletionAt).toLowerCase()}</Text>
                <Text style={styles.meta}>Jusque-là, votre compte reste utilisable et vous pouvez annuler.</Text>
              </View>
              <Pressable
                hitSlop={8}
                accessibilityRole="button"
                onPress={() => {
                  profileActions.cancelDeletion();
                  setToast({ text: 'Suppression annulée : votre compte est conservé' });
                }}>
                <Text style={styles.cancel}>Annuler</Text>
              </Pressable>
            </View>
          ) : (
            <SettingsRow
              first
              danger
              icon="delete_forever"
              title="Supprimer mon compte"
              subtitle="Vous aurez un délai pour changer d’avis"
              onPress={openDelete}
            />
          )}
        </SettingsSection>
      </ScrollView>

      {/* Export de toutes les données */}
      <BottomSheet
        visible={sheet === 'export'}
        title="Exporter mes données"
        subtitle={`Le serveur prépare une archive de toutes vos données. Vous serez prévenu à ${user.email} quand elle sera prête.`}
        onClose={() => setSheet(null)}>
        <PrimaryButton label={busy ? 'Demande en cours…' : 'Préparer l’export'} icon="download" disabled={busy} onPress={startExport} />
        <SecondaryButton label="Plus tard" onPress={() => setSheet(null)} />
      </BottomSheet>

      {/* Appareils connectés */}
      <BottomSheet
        visible={sheet === 'history'}
        title="Appareils connectés"
        subtitle="Un appareil inconnu ? Déconnectez-le et changez votre mot de passe."
        onClose={() => setSheet(null)}>
        <View style={styles.list}>
          {sessions.map((entry, index) => (
            <View key={entry.id} style={[styles.exportRow, index > 0 && styles.exportBorder]}>
              <Icon name={entry.icon} size={20} color={c.text} />
              <View style={styles.flex}>
                <Text style={styles.exportLabel}>{entry.device}</Text>
                <Text style={styles.meta}>{entry.detail}</Text>
              </View>
              {entry.current ? null : (
                <Pressable
                  hitSlop={8}
                  accessibilityRole="button"
                  onPress={() => {
                    profileActions.signOutSession(entry.id);
                    setToast({ text: `${entry.device} a été déconnecté` });
                  }}>
                  <Text style={styles.cancel}>Déconnecter</Text>
                </Pressable>
              )}
            </View>
          ))}
          {sessions.length === 0 ? <Text style={styles.meta}>Aucun appareil à afficher.</Text> : null}
        </View>
        <SecondaryButton
          label="Changer mon mot de passe"
          icon="lock_reset"
          onPress={() => {
            setSheet(null);
            router.push({ pathname: '/profile', params: { open: 'password' } });
          }}
        />
      </BottomSheet>

      {/* Suppression : foyer à transférer, mot de passe et confirmation forte */}
      <BottomSheet
        visible={sheet === 'delete'}
        title="Supprimer votre compte ?"
        subtitle="Vos données personnelles seront effacées à la date prévue. D’ici là, vous pourrez annuler."
        onClose={() => setSheet(null)}>
        {owned.length > 0 ? (
          <>
            <View style={styles.warning}>
              <Icon name="family_restroom" size={20} color="#b45309" />
              <Text style={styles.warningText}>
                Vous êtes propriétaire de « {owned.join(' », « ')} ». Sans transfert, la propriété passera au membre actif le plus ancien.
              </Text>
            </View>
            <SecondaryButton
              label="Transférer le foyer d’abord"
              icon="swap_horiz"
              onPress={() => {
                setSheet(null);
                router.push('/household/transfer');
              }}
            />
          </>
        ) : null}
        <Text style={styles.confirmLabel}>Mot de passe</Text>
        <TextInput
          style={kitStyles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          selectionColor={c.link}
          accessibilityLabel="Mot de passe"
        />
        <Text style={styles.confirmLabel}>Pour confirmer, saisissez {CONFIRM_WORD}</Text>
        <TextInput
          style={kitStyles.input}
          value={typed}
          onChangeText={setTyped}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder={CONFIRM_WORD}
          placeholderTextColor={c.muted}
          selectionColor={c.link}
          accessibilityLabel={`Saisissez ${CONFIRM_WORD} pour confirmer`}
        />
        {sheetError ? <Text style={[styles.meta, { color: c.error }]}>{sheetError}</Text> : null}
        <SecondaryButton
          label={busy ? 'Demande en cours…' : 'Supprimer mon compte'}
          icon="delete_forever"
          danger
          style={!confirmed || busy ? styles.disabled : undefined}
          onPress={confirmDeletion}
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
    flex: {
      flex: 1,
    },
    center: {
      textAlign: 'center',
    },
    content: {
      paddingTop: 4,
      paddingBottom: 40,
    },
    hero: {
      alignItems: 'center',
      gap: 8,
      paddingVertical: 22,
    },
    heroIcon: {
      width: 60,
      height: 60,
      borderRadius: 20,
      backgroundColor: c.solid,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 20,
      lineHeight: 26,
      color: c.text,
      textAlign: 'center',
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 6,
      marginTop: 4,
    },
    meta: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    pending: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 14,
      backgroundColor: c.dark ? '#3B1D24' : '#fff5f5',
    },
    pendingTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.error,
    },
    cancel: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.link,
    },
    legal: {
      marginTop: 20,
      textAlign: 'center',
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    list: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
    },
    exportRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 52,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    exportBorder: {
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    exportLabel: {
      flex: 1,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    warning: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      padding: 12,
      borderRadius: 14,
      backgroundColor: c.tintAmber,
      borderWidth: 1,
      borderColor: c.dark ? '#5A4A1E' : '#fde68a',
    },
    warningText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 20,
      color: c.text,
    },
    confirmLabel: {
      marginTop: 4,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    disabled: {
      opacity: 0.4,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
