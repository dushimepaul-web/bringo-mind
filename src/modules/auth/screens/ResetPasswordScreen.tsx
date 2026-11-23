// S-05 - Nouveau mot de passe | Module M01 Comptes et authentification | Phase S2
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { displayMessage, isApiError } from '@/lib/api';
import { IS_DEMO } from '@/lib/config';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Space, Tint } from '@/constants/design';

import {
  AuthCard,
  AuthIconTile,
  AuthScreen,
  AuthTitle,
  FormError,
  InfoNote,
  PrimaryButton,
  useFormStyles,
} from '../components/auth-ui';
import { resetPassword, tokenFromLink } from '../services/auth.service';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../types';

type Field = 'password' | 'confirm' | 'link';

export default function ResetPasswordScreen() {
  const formStyles = useFormStyles();
  const { c, styles } = useLook();
  // Jeton du lien reçu par e-mail : …/reset-password?token=… (valable 60 min, usage unique).
  const params = useLocalSearchParams<{ token?: string }>();
  const [link, setLink] = useState('');
  const token = params.token ?? tokenFromLink(link);
  const [error, setError] = useState<string | null>(null);
  // Démo : mot de passe prérempli qui respecte toutes les règles.
  const [password, setPassword] = useState(IS_DEMO ? 'Demo2026!Bringo' : '');
  const [confirm, setConfirm] = useState(IS_DEMO ? 'Demo2026!Bringo' : '');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<Field | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const rules = [
    { label: `Au moins ${PASSWORD_MIN_LENGTH} caractères`, met: password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH },
    { label: 'Une majuscule et une minuscule', met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: 'Un chiffre', met: /[0-9]/.test(password) },
    { label: 'Un caractère spécial', met: /[^A-Za-z0-9]/.test(password) },
  ];

  // Le backend n'exige que la longueur (et refuse les mots de passe trop courants ou divulgués) :
  // en mode API, les trois autres règles sont des conseils.
  const allRules = IS_DEMO ? rules.every((rule) => rule.met) : rules[0].met;
  const match = confirm.length > 0 && confirm === password;
  const mismatch = confirm.length > 0 && !match;
  const valid = allRules && match && (IS_DEMO || token.length >= 10);

  const iconColor = (field: Field) =>
    focused === field ? c.link : c.muted;

  const handleSave = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    if (IS_DEMO) {
      // Démo : simule l'enregistrement du nouveau mot de passe.
      setTimeout(() => {
        setLoading(false);
        setDone(true);
      }, 700);
      return;
    }
    try {
      await resetPassword({ token, password });
      setDone(true);
    } catch (reason) {
      const fields = isApiError(reason) ? reason.fieldErrors() : {};
      setError(
        fields.token
          ? `${fields.token} Demandez un nouveau lien depuis « Mot de passe oublié ».`
          : (fields.password ?? displayMessage(reason)),
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthScreen centered>
        <View style={styles.successBody}>
          <AuthIconTile name="lock_open" size={88} />
          <AuthTitle
            centered
            lead="Mot de passe"
            accent="mis à jour"
            subtitle="Votre nouveau mot de passe est actif. Reconnectez-vous pour accéder à votre espace."
          />
        </View>
        <PrimaryButton label="Se connecter" onPress={() => router.replace('/login')} />
        <InfoNote icon="shield">
          Toutes vos sessions actives ont été déconnectées par sécurité.
        </InfoNote>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen back>
      <AuthIconTile name="key" />
      <AuthTitle
        lead="Nouveau"
        accent="mot de passe"
        subtitle="Utilisez un mot de passe unique que vous n’utilisez pas ailleurs."
      />

      <AuthCard>
        {!IS_DEMO && !params.token ? (
          <>
            <Text style={formStyles.fieldLabel}>Lien reçu par e-mail</Text>
            <View style={[formStyles.inputRow, focused === 'link' && formStyles.inputRowFocused]}>
              <Icon name="link" size={20} color={iconColor('link')} />
              <TextInput
                style={formStyles.inputInline}
                placeholder="Collez ici le lien de l’e-mail"
                placeholderTextColor={c.muted}
                selectionColor={c.link}
                value={link}
                onChangeText={setLink}
                onFocus={() => setFocused('link')}
                onBlur={() => setFocused(null)}
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Lien de réinitialisation"
              />
            </View>
          </>
        ) : null}
        <Text style={[formStyles.fieldLabel, !IS_DEMO && !params.token && formStyles.fieldLabelSpaced]}>
          Nouveau mot de passe
        </Text>
        <View style={[formStyles.inputRow, focused === 'password' && formStyles.inputRowFocused]}>
          <Icon name="lock" size={20} color={iconColor('password')} />
          <TextInput
            style={formStyles.inputInline}
            placeholder="12 caractères minimum"
            placeholderTextColor={c.muted}
            selectionColor={c.link}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocused('password')}
            onBlur={() => setFocused(null)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            accessibilityLabel="Nouveau mot de passe"
          />
          <Pressable
            style={({ pressed }) => [pressed && styles.pressed]}
            hitSlop={10}
            accessibilityRole="button"
            onPress={() => setShowPassword((value) => !value)}
            accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
            <Icon
              name={showPassword ? 'visibility' : 'visibility_off'}
              size={22}
              color={iconColor('password')}
            />
          </Pressable>
        </View>

        <View style={styles.rules}>
          {rules.map((rule) => (
            <View key={rule.label} style={styles.ruleRow}>
              <Icon
                name={rule.met ? 'check_circle' : 'radio_button_unchecked'}
                size={20}
                color={rule.met ? c.success : c.border}
                filled={rule.met}
              />
              <Text style={[styles.ruleText, rule.met && styles.ruleTextMet]}>{rule.label}</Text>
            </View>
          ))}
        </View>

        <Text style={[formStyles.fieldLabel, formStyles.fieldLabelSpaced]}>
          Confirmer le mot de passe
        </Text>
        <View
          style={[
            formStyles.inputRow,
            focused === 'confirm' && formStyles.inputRowFocused,
            mismatch && formStyles.inputRowError,
          ]}>
          <Icon name="lock_reset" size={20} color={mismatch ? c.error : iconColor('confirm')} />
          <TextInput
            style={formStyles.inputInline}
            placeholder="Répétez le mot de passe"
            placeholderTextColor={c.muted}
            selectionColor={c.link}
            value={confirm}
            onChangeText={setConfirm}
            onFocus={() => setFocused('confirm')}
            onBlur={() => setFocused(null)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            returnKeyType="done"
            onSubmitEditing={handleSave}
            accessibilityLabel="Confirmer le mot de passe"
          />
          {confirm.length > 0 ? (
            <Icon
              name={match ? 'check_circle' : 'error'}
              size={20}
              color={match ? c.success : c.error}
            />
          ) : null}
        </View>
        {mismatch ? (
          <View style={formStyles.errorRow} accessibilityLiveRegion="polite">
            <Icon name="error" size={16} color={c.error} />
            <Text style={formStyles.errorText}>Les mots de passe ne correspondent pas.</Text>
          </View>
        ) : null}

        <PrimaryButton
          label="Enregistrer le mot de passe"
          icon="check"
          loadingLabel="Enregistrement…"
          disabled={!valid}
          loading={loading}
          onPress={handleSave}
        />
        <FormError message={error} />
      </AuthCard>

      <InfoNote icon="lightbulb" iconColor={Tint.amber}>
        Astuce : une phrase de passe longue (par exemple « 3 chats dorment à Paris ! ») est plus
        sûre et plus facile à retenir.
      </InfoNote>
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
    pressed: {
      opacity: 0.55,
    },
    rules: {
      gap: 10,
      marginTop: 12,
      padding: 14,
      borderRadius: 14,
      backgroundColor: c.page,
      borderWidth: 1,
      borderColor: c.border,
    },
    ruleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    ruleText: {
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 19,
      color: c.muted,
    },
    ruleTextMet: {
      fontFamily: FontFamily.bodyMedium,
      color: c.success,
    },
    successBody: {
      alignItems: 'center',
      marginBottom: Space.sm,
      borderRadius: Radius.xl,
    },
  });
}
