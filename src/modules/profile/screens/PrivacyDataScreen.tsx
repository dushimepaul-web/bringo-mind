// S-23 - Confidentialité et données | Module M09 Profil | Phase S8
// Consentements réversibles, export choisi, suppression du compte confirmée avec 30 jours pour changer d'avis.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import {
  BottomSheet,
  CheckCircle,
  PrimaryButton,
  SecondaryButton,
  Tag,
  TopBar,
  UndoToast,
  kitStyles,
} from '@/components/ui/kit';
import { SettingsRow, SettingsSection, ToggleSwitch } from '@/components/ui/settings';
import { FontFamily, Serene, Tint } from '@/constants/design';
import { formatLongDay } from '@/lib/demo-dates';

import { CONSENTS, DELETION_GRACE_DAYS, EXPORT_ITEMS, LOGIN_HISTORY, USER, deletionDate } from '../data';
import { profileActions, useProfileState } from '../store';

type Sheet = 'export' | 'history' | 'delete' | null;
const CONFIRM_WORD = 'SUPPRIMER';

export default function PrivacyDataScreen() {
  const { consents, deletionAt } = useProfileState();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const [exportItems, setExportItems] = useState<string[]>(EXPORT_ITEMS.map((item) => item.key));
  // Démo : confirmation préremplie, comme tous les champs.
  const [typed, setTyped] = useState(CONFIRM_WORD);
  const [focused, setFocused] = useState(false);

  const toggleExport = (key: string) =>
    setExportItems((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD;

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar title="Confidentialité et données" fallback="/profile" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={[kitStyles.card, styles.hero]}>
          <View style={styles.heroIcon}>
            <Icon name="shield" size={28} color={Serene.onPrimary} />
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

        <SettingsSection
          title="Vos consentements"
          icon="toggle_on"
          footer="Bringo Mind fonctionne aussi sans Kora : désactiver ces options ne bloque aucune fonction.">
          {CONSENTS.map((consent, index) => (
            <SettingsRow
              key={consent.key}
              first={index === 0}
              icon={consent.icon}
              title={consent.title}
              subtitle={consent.subtitle}
              right={
                <ToggleSwitch
                  value={consents[consent.key]}
                  label={consent.title}
                  onValueChange={(value) => {
                    const undo = profileActions.setConsent(consent.key, value);
                    setToast({ text: `${consent.title} : ${value ? 'activé' : 'désactivé'}`, undo });
                  }}
                />
              }
            />
          ))}
        </SettingsSection>

        <SettingsSection title="Vos données" icon="database">
          <SettingsRow
            first
            icon="download"
            title="Exporter mes données"
            subtitle="Tâches, événements, rappels, documents et préférences"
            onPress={() => setSheet('export')}
          />
          <SettingsRow
            icon="history"
            title="Historique des connexions"
            subtitle={LOGIN_HISTORY[0].detail}
            onPress={() => setSheet('history')}
          />
          <SettingsRow
            icon="description"
            title="Politique de confidentialité"
            subtitle="Version 2.1 • mise à jour le 1er mai 2024"
            onPress={() => setToast({ text: 'Démo : ouverture de la politique de confidentialité' })}
            right={<Icon name="open_in_new" size={20} color={Serene.onSurfaceVariant} />}
          />
        </SettingsSection>

        <SettingsSection title="Supprimer le compte" icon="delete_forever">
          {deletionAt ? (
            <View style={styles.pending}>
              <Icon name="schedule" size={22} color={Serene.error} />
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
              subtitle={`Vous aurez ${DELETION_GRACE_DAYS} jours pour changer d’avis`}
              onPress={() => setSheet('delete')}
            />
          )}
        </SettingsSection>

        <Text style={styles.legal}>Responsable de traitement : Bringo Mind • Délégué à la protection des données : dpo@bringomind.app</Text>
      </ScrollView>

      {/* Export : la personne choisit ce qu'elle exporte */}
      <BottomSheet
        visible={sheet === 'export'}
        title="Exporter mes données"
        subtitle={`Une archive (fichiers + tableau) sera envoyée à ${USER.email}.`}
        onClose={() => setSheet(null)}>
        <View style={styles.list}>
          {EXPORT_ITEMS.map((item, index) => {
            const checked = exportItems.includes(item.key);
            return (
              <Pressable
                key={item.key}
                style={[styles.exportRow, index > 0 && styles.exportBorder]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                onPress={() => toggleExport(item.key)}>
                <Icon name={item.icon} size={20} color={Tint.navy} />
                <Text style={styles.exportLabel}>{item.label}</Text>
                <CheckCircle square checked={checked} label={item.label} onPress={() => toggleExport(item.key)} />
              </Pressable>
            );
          })}
        </View>
        <PrimaryButton
          label={exportItems.length ? 'Préparer l’export' : 'Choisissez au moins un élément'}
          icon="download"
          disabled={exportItems.length === 0}
          onPress={() => {
            setSheet(null);
            setToast({ text: `Export en préparation : le lien arrivera sur ${USER.email}` });
          }}
        />
      </BottomSheet>

      {/* Historique des connexions */}
      <BottomSheet
        visible={sheet === 'history'}
        title="Historique des connexions"
        subtitle="Une connexion inconnue ? Changez votre mot de passe."
        onClose={() => setSheet(null)}>
        <View style={styles.list}>
          {LOGIN_HISTORY.map((entry, index) => (
            <View key={entry.id} style={[styles.exportRow, index > 0 && styles.exportBorder]}>
              <Icon name={entry.icon} size={20} color={Tint.navy} />
              <View style={styles.flex}>
                <Text style={styles.exportLabel}>{entry.device}</Text>
                <Text style={styles.meta}>{entry.detail}</Text>
              </View>
            </View>
          ))}
        </View>
        <SecondaryButton
          label="Changer mon mot de passe"
          icon="lock_reset"
          onPress={() => {
            setSheet(null);
            router.push('/reset-password');
          }}
        />
      </BottomSheet>

      {/* Suppression : conséquences, foyer, confirmation forte */}
      <BottomSheet
        visible={sheet === 'delete'}
        title="Supprimer votre compte ?"
        subtitle={`Votre compte sera supprimé le ${formatLongDay(deletionDate()).toLowerCase()}. D’ici là, vous pourrez annuler.`}
        onClose={() => setSheet(null)}>
        <View style={styles.warning}>
          <Icon name="family_restroom" size={20} color="#b45309" />
          <Text style={styles.warningText}>
            Vous êtes propriétaire de « {USER.household.name} ». Transférez-le d’abord, sinon il sera supprimé pour tous ses
            membres.
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
        <Text style={styles.confirmLabel}>Pour confirmer, saisissez {CONFIRM_WORD}</Text>
        <TextInput
          style={[kitStyles.input, focused && kitStyles.inputFocused]}
          value={typed}
          onChangeText={setTyped}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder={CONFIRM_WORD}
          placeholderTextColor={Serene.onSurfaceVariant}
          selectionColor={Tint.primary}
          accessibilityLabel={`Saisissez ${CONFIRM_WORD} pour confirmer`}
        />
        <SecondaryButton
          label="Supprimer mon compte"
          icon="delete_forever"
          danger
          style={!confirmed ? styles.disabled : undefined}
          onPress={() => {
            if (!confirmed) return;
            profileActions.requestDeletion();
            setSheet(null);
            setToast({ text: `Suppression programmée dans ${DELETION_GRACE_DAYS} jours`, undo: () => profileActions.cancelDeletion() });
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
    backgroundColor: Tint.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    lineHeight: 26,
    color: Tint.navy,
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
    color: Serene.onSurfaceVariant,
  },
  pending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: '#fff5f5',
  },
  pendingTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.error,
  },
  cancel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.primary,
  },
  legal: {
    marginTop: 20,
    textAlign: 'center',
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  list: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Tint.border,
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
    borderTopColor: Tint.border,
  },
  exportLabel: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  warningText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Tint.navy,
  },
  confirmLabel: {
    marginTop: 4,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.navy,
  },
  disabled: {
    opacity: 0.4,
  },
});
