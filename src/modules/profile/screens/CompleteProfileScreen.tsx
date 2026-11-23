// Mobile - Informations personnelles | Module M09 Profil | Phase S8
// Nom et e-mail du compte (GET/PATCH /accounts/me) ; l'e-mail se change par un lien de confirmation.
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, PrimaryButton, SecondaryButton, Tag, TopBar, UndoToast, useKitStyles } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { userMessage } from '@/lib/api';

import { initialsOf, profileActions, useProfileState } from '../store';

type FieldKey = 'firstName' | 'lastName' | 'newEmail' | 'password';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export default function CompleteProfileScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const saved = useProfileState().user;
  const [firstName, setFirstName] = useState(saved.firstName);
  const [lastName, setLastName] = useState(saved.lastName);
  const [focus, setFocus] = useState<FieldKey | null>(null);
  const [sheet, setSheet] = useState<'email' | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const firstError = firstName.trim().length === 0;
  const dirty = firstName.trim() !== saved.firstName || lastName.trim() !== saved.lastName;
  const canSave = dirty && !firstError;
  const emailValid = EMAIL.test(newEmail.trim());

  const field = (key: FieldKey, label: string, value: string, onChange: (value: string) => void, error?: string) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[kitStyles.input, focus === key && kitStyles.inputFocused, error ? kitStyles.inputError : null]}
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocus(key)}
        onBlur={() => setFocus(null)}
        autoCapitalize="words"
        selectionColor={c.link}
        accessibilityLabel={label}
      />
      {error ? (
        <View style={styles.errorRow}>
          <Icon name="error" size={16} color={c.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );

  const sendEmailChange = () => {
    if (!emailValid || !password || sending) return;
    setSending(true);
    setSheetError(null);
    profileActions
      .changeEmail(newEmail.trim().toLowerCase(), password)
      .then(() => {
        setSheet(null);
        setToast(`Lien de confirmation envoyé à ${newEmail.trim()}`);
        setNewEmail('');
      })
      .catch((error: unknown) => setSheetError(userMessage(error)))
      .finally(() => {
        setSending(false);
        setPassword('');
      });
  };

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top', 'bottom']}>
      <TopBar title="Informations personnelles" close fallback="/profile" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.photoZone}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsOf({ firstName, lastName, email: saved.email })}</Text>
            </View>
            {saved.memberSince ? (
              <Text style={kitStyles.muted}>
                Membre depuis {MONTHS[saved.memberSince.getMonth()]} {saved.memberSince.getFullYear()}
              </Text>
            ) : null}
          </View>

          <View style={styles.row}>
            <View style={styles.flex}>{field('firstName', 'Prénom', firstName, setFirstName, firstError ? 'Le prénom est obligatoire.' : undefined)}</View>
            <View style={styles.flex}>{field('lastName', 'Nom', lastName, setLastName)}</View>
          </View>

          {/* E-mail : se change par un lien de confirmation envoyé à la nouvelle adresse */}
          <View style={styles.field}>
            <Text style={styles.label}>Adresse e-mail</Text>
            <View style={styles.readonly}>
              <Icon name="mail" size={20} color={c.muted} />
              <Text style={styles.readonlyText} numberOfLines={1}>
                {saved.email}
              </Text>
              {saved.emailVerified ? <Tag label="Vérifiée" icon="verified" tone="success" /> : <Tag label="À vérifier" icon="schedule" />}
            </View>
            {!saved.emailVerified ? (
              <Pressable
                hitSlop={8}
                accessibilityRole="button"
                onPress={() =>
                  profileActions
                    .resendVerification()
                    .then(() => setToast(`Lien de vérification renvoyé à ${saved.email}`))
                    .catch((error: unknown) => setToast(userMessage(error)))
                }>
                <Text style={styles.link}>Renvoyer le lien de vérification</Text>
              </Pressable>
            ) : null}
            <Pressable hitSlop={8} accessibilityRole="button" onPress={() => setSheet('email')}>
              <Text style={styles.link}>Changer l’adresse e-mail</Text>
            </Pressable>
          </View>

          <View style={styles.note}>
            <Icon name="lock" size={18} color={c.link} />
            <Text style={styles.noteText}>Votre nom apparaît auprès des membres de votre foyer et dans vos invitations.</Text>
          </View>
        </ScrollView>

        {dirty ? (
          <View style={styles.footer}>
            <PrimaryButton
              label="Enregistrer"
              icon="check"
              disabled={!canSave}
              onPress={() => {
                profileActions.saveName(firstName.trim(), lastName.trim());
                profileActions.setFlash({ text: 'Informations enregistrées' });
                if (router.canGoBack()) router.back();
                else router.replace('/profile');
              }}
            />
          </View>
        ) : null}
      </KeyboardAvoidingView>

      <BottomSheet
        visible={sheet === 'email'}
        title="Changer l’adresse e-mail"
        subtitle="Un lien de confirmation part à la nouvelle adresse. L’ancienne reste active jusqu’à la confirmation."
        onClose={() => setSheet(null)}>
        {field('newEmail', 'Nouvelle adresse e-mail', newEmail, setNewEmail, newEmail && !emailValid ? 'Adresse e-mail invalide.' : undefined)}
        <View style={styles.field}>
          <Text style={styles.label}>Mot de passe actuel</Text>
          <TextInput
            style={[kitStyles.input, focus === 'password' && kitStyles.inputFocused]}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocus('password')}
            onBlur={() => setFocus(null)}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="current-password"
            selectionColor={c.link}
            accessibilityLabel="Mot de passe actuel"
          />
        </View>
        {sheetError ? (
          <View style={styles.errorRow}>
            <Icon name="error" size={16} color={c.error} />
            <Text style={styles.errorText}>{sheetError}</Text>
          </View>
        ) : null}
        <PrimaryButton
          label={sending ? 'Envoi…' : 'Envoyer le lien'}
          icon="send"
          disabled={!emailValid || !password || sending}
          onPress={sendEmailChange}
        />
        <SecondaryButton label="Garder mon adresse" onPress={() => setSheet(null)} />
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
    pressed: {
      opacity: 0.8,
    },
    content: {
      paddingTop: 4,
      paddingBottom: 24,
    },
    photoZone: {
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: Radius.full,
      backgroundColor: c.link,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: FontFamily.headingBold,
      fontSize: 34,
      lineHeight: 42,
      color: c.solidText,
    },
    photoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: Radius.full,
      backgroundColor: c.tintMint,
    },
    photoText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.link,
    },
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    field: {
      marginTop: 16,
      gap: 6,
    },
    label: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    errorText: {
      flex: 1,
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.error,
    },
    readonly: {
      minHeight: 54,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    readonlyText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 16,
      lineHeight: 22,
      color: c.muted,
    },
    dateField: {
      backgroundColor: c.soft,
    },
    dateText: {
      flex: 1,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 22,
      color: c.text,
    },
    link: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.link,
    },
    note: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      marginTop: 20,
      padding: 14,
      borderRadius: 16,
      backgroundColor: c.soft,
    },
    noteText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.text,
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
