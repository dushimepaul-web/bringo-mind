// S-18 (formulaire) - Inviter un membre | Module M08 Foyer | Phase S7
// Démo : champs préremplis ; l'envoi est confirmé avant de partir.
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, PrimaryButton, SecondaryButton, TopBar, UndoToast, useKitStyles } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily } from '@/constants/design';

import { ChoiceCard, SmallButton, useHouseholdStyles } from '../components/household-ui';
import { ROLE_HINTS, ROLE_LABELS, isValidEmail } from '../data';
import { householdActions, useHouseholdState } from '../store';
import type { Invitation } from '../types';

export default function InviteMemberScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const householdStyles = useHouseholdStyles();
  const { name, members, invitations } = useHouseholdState();
  const [email, setEmail] = useState('sophie.martin@email.fr');
  const [role, setRole] = useState<Invitation['role']>('member');
  const [message, setMessage] = useState(
    'Bonjour Sophie, rejoins notre foyer sur Bringo Mind pour suivre avec nous l’agenda de Léo.',
  );
  const [focus, setFocus] = useState<'email' | 'message' | null>(null);
  const [touched, setTouched] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const clean = email.trim().toLowerCase();
  const already =
    members.some((member) => member.email.toLowerCase() === clean) ||
    invitations.some((invitation) => invitation.email === clean);
  const error = !isValidEmail(email)
    ? 'Saisissez une adresse e-mail valide.'
    : already
      ? 'Cette personne est déjà membre ou déjà invitée.'
      : null;
  const showError = touched && error;

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top', 'bottom']}>
      <TopBar title="Inviter un membre" close fallback="/household/members" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[kitStyles.content, styles.content]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={kitStyles.muted}>
            La personne invitée rejoindra « {name} ». Elle verra uniquement les éléments partagés du foyer.
          </Text>

          <Text style={[kitStyles.label, styles.label]}>Adresse e-mail</Text>
          <TextInput
            style={[kitStyles.input, focus === 'email' && kitStyles.inputFocused, showError && kitStyles.inputError]}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocus('email')}
            onBlur={() => {
              setFocus(null);
              setTouched(true);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="prenom.nom@email.fr"
            placeholderTextColor={c.muted}
            selectionColor={c.link}
            accessibilityLabel="Adresse e-mail de la personne invitée"
          />
          {showError ? (
            <View style={styles.errorRow} accessibilityLiveRegion="polite">
              <Icon name="error" size={16} color={c.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={[kitStyles.label, styles.label]}>Rôle dans le foyer</Text>
          <View style={styles.stack}>
            {(['member', 'admin'] as Invitation['role'][]).map((entry) => (
              <ChoiceCard
                key={entry}
                icon={entry === 'admin' ? 'manage_accounts' : 'person'}
                title={ROLE_LABELS[entry]}
                hint={ROLE_HINTS[entry]}
                selected={role === entry}
                onPress={() => setRole(entry)}
              />
            ))}
          </View>

          <Text style={[kitStyles.label, styles.label]}>Message personnel (facultatif)</Text>
          <TextInput
            style={[kitStyles.input, styles.message, focus === 'message' && kitStyles.inputFocused]}
            value={message}
            onChangeText={setMessage}
            onFocus={() => setFocus('message')}
            onBlur={() => setFocus(null)}
            multiline
            textAlignVertical="top"
            placeholderTextColor={c.muted}
            selectionColor={c.link}
            accessibilityLabel="Message personnel"
          />

          <View style={[householdStyles.note, styles.note]}>
            <Icon name="shield" size={20} color={c.link} />
            <Text style={householdStyles.noteText}>
              Le lien d’invitation est personnel et valable 7 jours. Vous pouvez l’annuler à tout moment depuis la liste
              des membres.
            </Text>
          </View>

          <Text style={[kitStyles.label, styles.label]}>Ou partager le lien</Text>
          <View style={styles.shareRow}>
            <SmallButton label="Copier le lien" icon="link" variant="light" onPress={() => setToast('Lien d’invitation copié')} />
            <SmallButton label="SMS" icon="sms" variant="light" onPress={() => setToast('Démo : ouverture des SMS')} />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label="Envoyer l’invitation"
            icon="send"
            disabled={!!error}
            onPress={() => setConfirm(true)}
          />
        </View>
      </KeyboardAvoidingView>

      <BottomSheet
        visible={confirm}
        title="Envoyer l’invitation ?"
        subtitle={`${clean} recevra un e-mail pour rejoindre « ${name} » comme ${ROLE_LABELS[role].toLowerCase()}.`}
        onClose={() => setConfirm(false)}>
        <PrimaryButton
          label="Oui, envoyer"
          icon="send"
          onPress={() => {
            householdActions.invite(clean, role);
            householdActions.setFlash({ text: `Invitation envoyée à ${clean}` });
            setConfirm(false);
            if (router.canGoBack()) router.back();
            else router.replace('/household/members');
          }}
        />
        <SecondaryButton label="Revenir au formulaire" onPress={() => setConfirm(false)} />
      </BottomSheet>

      {toast ? <UndoToast key={toast} text={toast} onHide={() => setToast(null)} bottom={100} /> : null}
    </SafeAreaView>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    content: {
      paddingTop: 4,
      paddingBottom: 24,
    },
    label: {
      marginTop: 20,
      marginBottom: 8,
    },
    stack: {
      gap: 10,
    },
    message: {
      minHeight: 110,
    },
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 6,
    },
    errorText: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.error,
    },
    note: {
      marginTop: 18,
    },
    shareRow: {
      flexDirection: 'row',
      gap: 8,
    },
    footer: {
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
      backgroundColor: c.page,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
