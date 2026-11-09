// S-02 - Inscription | Module M01 Comptes et authentification | Phase S2
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';

import {
  AuthBrand,
  AuthCard,
  AuthScreen,
  AuthTitle,
  Divider,
  InfoNote,
  PrimaryButton,
  TextLink,
  formStyles,
} from '../components/auth-ui';

type Field = 'firstName' | 'lastName' | 'email' | 'password' | 'confirm';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  // Démo : formulaire prérempli pour parcourir l'inscription en un appui.
  const [firstName, setFirstName] = useState('Claire');
  const [lastName, setLastName] = useState('Martin');
  const [email, setEmail] = useState('claire.martin@email.fr');
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState('Demo2026!');
  const [confirm, setConfirm] = useState('Demo2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [focused, setFocused] = useState<Field | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(password);
  const emailValid = EMAIL_PATTERN.test(email.trim());
  const emailError = emailTouched && email.length > 0 && !emailValid;
  const mismatch = confirm.length > 0 && confirm !== password;
  const valid =
    firstName.trim().length > 1 &&
    lastName.trim().length > 1 &&
    emailValid &&
    password.length >= 8 &&
    confirm === password &&
    terms;

  const focusProps = (field: Field) => ({
    onFocus: () => setFocused(field),
    onBlur: () => {
      setFocused(null);
      if (field === 'email') setEmailTouched(true);
    },
    selectionColor: Tint.primary,
    placeholderTextColor: Serene.onSurfaceVariant,
  });
  const iconColor = (field: Field) =>
    focused === field ? Tint.primary : Serene.onSurfaceVariant;

  const handleSubmit = () => {
    if (!valid || loading) return;
    setLoading(true);
    // Démo : simule la création du compte avant la vérification de l'e-mail.
    setTimeout(() => router.push('/verify-email'), 700);
  };

  return (
    <AuthScreen back>
      <AuthBrand />
      <AuthTitle
        lead="Créer votre"
        accent="compte"
        subtitle="Quelques informations suffisent pour commencer."
      />

      <View style={styles.social}>
        <SocialButton
          label="Google"
          source={require('../../../../assets/images/brand/google.png')}
          onPress={() => router.replace('/dashboard')}
        />
        <SocialButton
          label="Apple"
          source={require('../../../../assets/images/brand/apple.png')}
          onPress={() => router.replace('/dashboard')}
        />
      </View>

      <Divider label="Ou avec un e-mail" />

      <AuthCard style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowField}>
            <FieldLabel text="Prénom" required />
            <TextInput
              style={[formStyles.input, focused === 'firstName' && formStyles.inputRowFocused]}
              {...focusProps('firstName')}
              placeholder="Prénom"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              autoComplete="given-name"
              accessibilityLabel="Prénom"
            />
          </View>
          <View style={styles.rowField}>
            <FieldLabel text="Nom" required />
            <TextInput
              style={[formStyles.input, focused === 'lastName' && formStyles.inputRowFocused]}
              {...focusProps('lastName')}
              placeholder="Nom"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              autoComplete="family-name"
              accessibilityLabel="Nom"
            />
          </View>
        </View>

        <FieldLabel text="Adresse e-mail" required spaced />
        <View
          style={[
            formStyles.inputRow,
            focused === 'email' && formStyles.inputRowFocused,
            emailError && formStyles.inputRowError,
          ]}>
          <Icon name="mail" size={20} color={emailError ? Serene.error : iconColor('email')} />
          <TextInput
            style={formStyles.inputInline}
            {...focusProps('email')}
            placeholder="vous@email.fr"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            accessibilityLabel="Adresse e-mail"
            aria-invalid={emailError}
          />
        </View>
        {emailError ? (
          <View style={formStyles.errorRow} accessibilityLiveRegion="polite">
            <Icon name="error" size={16} color={Serene.error} />
            <Text style={formStyles.errorText}>Saisissez une adresse e-mail valide.</Text>
          </View>
        ) : null}

        <FieldLabel text="Mot de passe" required spaced />
        <View style={[formStyles.inputRow, focused === 'password' && formStyles.inputRowFocused]}>
          <Icon name="lock" size={20} color={iconColor('password')} />
          <TextInput
            style={formStyles.inputInline}
            {...focusProps('password')}
            placeholder="8 caractères minimum"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            accessibilityLabel="Mot de passe"
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

        {password.length > 0 ? (
          <View style={styles.strengthBlock}>
            <View style={styles.strengthTrack}>
              <View
                style={[
                  styles.strengthFill,
                  { width: `${(strength.score / 4) * 100}%` },
                  strength.score >= 3 ? styles.strengthGood : styles.strengthWeak,
                ]}
              />
            </View>
            <Text style={styles.strengthText}>{strength.label}</Text>
          </View>
        ) : null}

        <FieldLabel text="Confirmer le mot de passe" required spaced />
        <View
          style={[
            formStyles.inputRow,
            focused === 'confirm' && formStyles.inputRowFocused,
            mismatch && formStyles.inputRowError,
          ]}>
          <Icon name="lock_reset" size={20} color={mismatch ? Serene.error : iconColor('confirm')} />
          <TextInput
            style={formStyles.inputInline}
            {...focusProps('confirm')}
            placeholder="Répétez le mot de passe"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            accessibilityLabel="Confirmer le mot de passe"
          />
          {confirm.length > 0 ? (
            <Icon
              name={mismatch ? 'error' : 'check_circle'}
              size={20}
              color={mismatch ? Serene.error : Serene.success}
            />
          ) : null}
        </View>
        {mismatch ? (
          <View style={formStyles.errorRow} accessibilityLiveRegion="polite">
            <Icon name="error" size={16} color={Serene.error} />
            <Text style={formStyles.errorText}>Les mots de passe ne correspondent pas.</Text>
          </View>
        ) : null}

        <CheckRow checked={terms} onToggle={() => setTerms((value) => !value)}>
          J’accepte les <Text style={styles.link}>conditions d’utilisation</Text> et la{' '}
          <Text style={styles.link}>politique de confidentialité</Text>.
        </CheckRow>
        <CheckRow checked={newsletter} onToggle={() => setNewsletter((value) => !value)}>
          Recevoir les conseils Bringo Mind et les nouveautés (facultatif).
        </CheckRow>

        <PrimaryButton
          label="Créer mon compte"
          loadingLabel="Création…"
          disabled={!valid}
          loading={loading}
          onPress={handleSubmit}
        />
      </AuthCard>

      <View style={formStyles.footerRow}>
        <Text style={formStyles.footerText}>Déjà un compte ?</Text>
        <TextLink label="Se connecter" onPress={() => router.push('/login')} />
      </View>

      <InfoNote icon="shield">
        Vos données sont chiffrées et hébergées en Europe. Vous pouvez les exporter ou les
        supprimer à tout moment.
      </InfoNote>
    </AuthScreen>
  );
}

function FieldLabel({ text, required, spaced }: { text: string; required?: boolean; spaced?: boolean }) {
  return (
    <Text style={[formStyles.fieldLabel, spaced && formStyles.fieldLabelSpaced]}>
      {text}
      {required ? <Text style={formStyles.required}> *</Text> : null}
    </Text>
  );
}

function SocialButton({
  label,
  source,
  onPress,
}: {
  label: string;
  source: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.socialButton, pressed && styles.socialPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Continuer avec ${label}`}
      onPress={onPress}>
      <Image source={source} style={styles.socialIcon} resizeMode="contain" />
      <Text style={styles.socialText}>{label}</Text>
    </Pressable>
  );
}

function CheckRow({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <Pressable
      style={styles.checkRow}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}>
      <View style={[styles.checkbox, checked && styles.checkboxActive]}>
        {checked ? <Icon name="check" size={16} color={Serene.onPrimary} /> : null}
      </View>
      <Text style={styles.checkText}>{children}</Text>
    </Pressable>
  );
}

function getStrength(value: string) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/[0-9]/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;

  if (value.length === 0) return { score: 0, label: '' };
  if (score <= 1) return { score: 1, label: 'Faible' };
  if (score === 2) return { score: 2, label: 'Moyen' };
  if (score === 3) return { score: 3, label: 'Bon' };
  return { score: 4, label: 'Excellent' };
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.55,
  },
  social: {
    flexDirection: 'row',
    gap: 12,
    marginTop: Space.lg,
  },
  socialButton: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  socialPressed: {
    backgroundColor: Tint.soft,
    transform: [{ scale: 0.99 }],
  },
  socialIcon: {
    width: 22,
    height: 22,
  },
  socialText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  card: {
    marginTop: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowField: {
    flex: 1,
    minWidth: 0,
  },
  strengthBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  strengthTrack: {
    flex: 1,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Tint.soft,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  strengthWeak: {
    backgroundColor: Serene.error,
  },
  strengthGood: {
    backgroundColor: Serene.success,
  },
  strengthText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 18,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: Tint.border,
    backgroundColor: Tint.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Tint.primary,
    borderColor: Tint.primary,
  },
  checkText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 21,
    color: Serene.onSurfaceVariant,
  },
  link: {
    fontFamily: FontFamily.bodySemiBold,
    color: Tint.primary,
  },
});
