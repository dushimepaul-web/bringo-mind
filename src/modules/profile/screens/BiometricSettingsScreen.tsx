// Mobile - Déverrouillage biométrique | Module M09 Profil | Phase S8
// Un seul état partagé avec le Profil ; les réglages s'appliquent tout de suite ; désactiver est confirmé.
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, Chip, PrimaryButton, SecondaryButton, Tag, TopBar, UndoToast, kitStyles } from '@/components/ui/kit';
import { FieldLabel, SettingsRow, SettingsSection, ToggleSwitch, settingsStyles } from '@/components/ui/settings';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';

import { LOCK_DELAYS, profileActions, useProfileState } from '../store';

export default function BiometricSettingsScreen() {
  const { biometric, confirmSensitive, fallbackCode, lockDelay } = useProfileState();
  const [test, setTest] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [confirmOff, setConfirmOff] = useState(false);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);

  // Démo : la vérification Face ID prend un instant.
  useEffect(() => {
    if (test !== 'scanning') return undefined;
    const timer = setTimeout(() => setTest('success'), 1200);
    return () => clearTimeout(timer);
  }, [test]);

  const off = !biometric;

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar title="Déverrouillage biométrique" fallback="/profile" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={[kitStyles.card, styles.hero]}>
          <View style={[styles.faceId, off && styles.faceIdOff, test === 'success' && styles.faceIdOk]}>
            <Icon
              name={test === 'success' ? 'check' : 'face'}
              size={44}
              color={off ? Serene.onSurfaceVariant : Serene.onPrimary}
            />
          </View>
          <Text style={styles.heroTitle}>{off ? 'Face ID désactivé' : 'Face ID activé'}</Text>
          <Text style={[kitStyles.muted, styles.center]}>
            {off
              ? 'L’app s’ouvre avec votre mot de passe.'
              : 'Déverrouillez Bringo Mind et confirmez les actions sensibles avec votre visage.'}
          </Text>
          {off ? (
            <PrimaryButton
              label="Activer Face ID"
              icon="face"
              style={styles.heroButton}
              onPress={() => {
                profileActions.setBiometric(true);
                setToast({ text: 'Face ID activé' });
              }}
            />
          ) : (
            <SecondaryButton
              label={test === 'success' ? 'Identité vérifiée' : test === 'scanning' ? 'Vérification…' : 'Tester Face ID'}
              icon={test === 'success' ? 'verified' : 'play_arrow'}
              style={styles.heroButton}
              onPress={() => setTest(test === 'scanning' ? 'scanning' : 'scanning')}
            />
          )}
        </View>

        <SettingsSection title="Réglages" icon="tune" footer={off ? 'Activez Face ID pour modifier ces réglages.' : undefined}>
          <SettingsRow
            first
            icon="lock_open"
            title="Déverrouiller l’application"
            subtitle="Face ID à l’ouverture de Bringo Mind"
            right={
              <ToggleSwitch
                value={biometric}
                label="Déverrouiller l’application avec Face ID"
                onValueChange={(value) => (value ? profileActions.setBiometric(true) : setConfirmOff(true))}
              />
            }
          />
          <SettingsRow
            icon="gpp_good"
            title="Confirmer les actions sensibles"
            subtitle="Suppression, export, transfert du foyer"
            disabled={off}
            right={
              <ToggleSwitch
                value={confirmSensitive}
                disabled={off}
                label="Confirmer les actions sensibles avec Face ID"
                onValueChange={profileActions.setConfirmSensitive}
              />
            }
          />
          <SettingsRow
            icon="pin"
            title="Code du téléphone en secours"
            subtitle="Si Face ID ne vous reconnaît pas"
            disabled={off}
            right={
              <ToggleSwitch
                value={fallbackCode}
                disabled={off}
                label="Utiliser le code du téléphone en secours"
                onValueChange={profileActions.setFallbackCode}
              />
            }
          />
          <View style={[settingsStyles.inset, settingsStyles.insetBorder, off && styles.disabled]}>
            <FieldLabel>Verrouiller l’app</FieldLabel>
            <View style={styles.chips}>
              {LOCK_DELAYS.map((entry) => (
                <Chip
                  key={entry.key}
                  label={entry.label}
                  selected={lockDelay === entry.key}
                  onPress={() => {
                    if (off) return;
                    profileActions.setLockDelay(entry.key);
                  }}
                />
              ))}
            </View>
          </View>
        </SettingsSection>

        <SettingsSection title="Cet appareil" icon="phone_iphone">
          <SettingsRow
            first
            icon="phone_iphone"
            title="iPhone 15"
            subtitle="Face ID disponible • iOS 18"
            right={<Tag label="Compatible" icon="check" tone="success" />}
          />
        </SettingsSection>

        <View style={styles.note}>
          <Icon name="lock" size={18} color={Tint.primary} />
          <Text style={styles.noteText}>
            Votre visage ne quitte jamais le téléphone : Bringo Mind reçoit seulement « reconnu » ou « non reconnu ».
          </Text>
        </View>
      </ScrollView>

      <BottomSheet
        visible={confirmOff}
        title="Désactiver Face ID ?"
        subtitle="Vous devrez saisir votre mot de passe pour ouvrir l’app et confirmer les actions sensibles."
        onClose={() => setConfirmOff(false)}>
        <SecondaryButton
          label="Désactiver"
          danger
          onPress={() => {
            profileActions.setBiometric(false);
            setConfirmOff(false);
            setTest('idle');
            setToast({ text: 'Face ID désactivé', undo: () => profileActions.setBiometric(true) });
          }}
        />
        <SecondaryButton label="Garder Face ID" onPress={() => setConfirmOff(false)} />
      </BottomSheet>

      {toast ? (
        <UndoToast key={toast.text} text={toast.text} onUndo={toast.undo} onHide={() => setToast(null)} bottom={24} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  faceId: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: Tint.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  faceIdOff: {
    backgroundColor: Tint.soft,
  },
  faceIdOk: {
    backgroundColor: Tint.primary,
  },
  heroTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 21,
    lineHeight: 27,
    color: Tint.navy,
  },
  heroButton: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
  disabled: {
    opacity: 0.45,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 20,
    padding: 14,
    borderRadius: Radius.md,
    backgroundColor: Tint.soft,
  },
  noteText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Tint.navy,
  },
});
