// S-02 - Inscription | Module M01 Comptes et authentification | Phase S2
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  const strength = getStrength(password);
  const mismatch = confirm.length > 0 && confirm !== password;
  const valid =
    firstName.trim().length > 1 &&
    lastName.trim().length > 1 &&
    email.includes('@') &&
    password.length >= 8 &&
    confirm === password &&
    terms;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.topBar}>
            <Pressable
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Retour"
              onPress={() => router.back()}>
              <Icon name="arrow_back" size={22} color={Serene.onSurface} />
            </Pressable>
            <View style={styles.logo}>
              <Text style={styles.logoLetter}>K</Text>
            </View>
            <View style={styles.backButton} />
          </View>

          <Text style={styles.title}>Créer votre compte</Text>
          <Text style={styles.subtitle}>
            Quelques informations suffisent pour commencer.
          </Text>

          <View style={styles.social}>
            <Pressable style={styles.socialButton} accessibilityRole="button">
              <Icon name="g_translate" size={18} color={Serene.onSurface} />
              <Text style={styles.socialText}>Google</Text>
            </Pressable>
            <Pressable style={styles.socialButton} accessibilityRole="button">
              <Icon name="phone_iphone" size={18} color={Serene.onSurface} />
              <Text style={styles.socialText}>Apple</Text>
            </Pressable>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou avec un e-mail</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.row}>
            <View style={styles.rowField}>
              <FieldLabel text="Prénom" required />
              <TextInput
                style={styles.input}
                placeholder="Claire"
                placeholderTextColor={Serene.onSurfaceVariant}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                accessibilityLabel="Prénom"
              />
            </View>
            <View style={styles.rowField}>
              <FieldLabel text="Nom" required />
              <TextInput
                style={styles.input}
                placeholder="Martin"
                placeholderTextColor={Serene.onSurfaceVariant}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                accessibilityLabel="Nom"
              />
            </View>
          </View>

          <FieldLabel text="Adresse e-mail" required />
          <View style={styles.inputRow}>
            <Icon name="mail" size={18} color={Serene.onSurfaceVariant} />
            <TextInput
              style={styles.inputInline}
              placeholder="vous@email.fr"
              placeholderTextColor={Serene.onSurfaceVariant}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              accessibilityLabel="Adresse e-mail"
            />
          </View>

          <FieldLabel text="Mot de passe" required />
          <View style={styles.inputRow}>
            <Icon name="lock" size={18} color={Serene.onSurfaceVariant} />
            <TextInput
              style={styles.inputInline}
              placeholder="8 caractères minimum"
              placeholderTextColor={Serene.onSurfaceVariant}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              accessibilityLabel="Mot de passe"
            />
            <Pressable
              onPress={() => setShowPassword((value) => !value)}
              accessibilityLabel={showPassword ? 'Masquer' : 'Afficher'}>
              <Icon
                name={showPassword ? 'visibility_off' : 'visibility'}
                size={18}
                color={Serene.onSurfaceVariant}
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

          <FieldLabel text="Confirmer le mot de passe" required />
          <View style={[styles.inputRow, mismatch && styles.inputRowError]}>
            <Icon name="lock_reset" size={18} color={Serene.onSurfaceVariant} />
            <TextInput
              style={styles.inputInline}
              placeholder="Répétez le mot de passe"
              placeholderTextColor={Serene.onSurfaceVariant}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              accessibilityLabel="Confirmer le mot de passe"
            />
            {confirm.length > 0 ? (
              <Icon
                name={mismatch ? 'error' : 'check_circle'}
                size={18}
                color={mismatch ? Serene.error : Serene.success}
              />
            ) : null}
          </View>
          {mismatch ? (
            <Text style={styles.errorText}>Les mots de passe ne correspondent pas.</Text>
          ) : null}

          <Pressable
            style={styles.checkRow}
            onPress={() => setTerms((value) => !value)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: terms }}>
            <View style={[styles.checkbox, terms && styles.checkboxActive]}>
              {terms ? <Icon name="check" size={12} color={Serene.onPrimary} /> : null}
            </View>
            <Text style={styles.checkText}>
              J’accepte les{' '}
              <Text style={styles.link}>conditions d’utilisation</Text> et la{' '}
              <Text style={styles.link}>politique de confidentialité</Text>.
            </Text>
          </Pressable>

          <Pressable
            style={styles.checkRow}
            onPress={() => setNewsletter((value) => !value)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: newsletter }}>
            <View style={[styles.checkbox, newsletter && styles.checkboxActive]}>
              {newsletter ? <Icon name="check" size={12} color={Serene.onPrimary} /> : null}
            </View>
            <Text style={styles.checkText}>
              Recevoir les conseils PLAA et les nouveautés (facultatif).
            </Text>
          </Pressable>

          <Pressable
            style={[styles.primaryButton, !valid && styles.primaryButtonDisabled]}
            accessibilityRole="button"
            disabled={!valid}
            onPress={() => router.push('/verify-email')}>
            <Text style={styles.primaryButtonText}>Créer mon compte</Text>
            <Icon name="arrow_forward" size={18} color={Serene.onPrimary} />
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ?</Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.footerLink}>Se connecter</Text>
            </Pressable>
          </View>

          <View style={styles.privacyCard}>
            <Icon name="shield" size={15} color={Serene.onSurfaceVariant} />
            <Text style={styles.privacyText}>
              Vos données sont chiffrées et hébergées en Europe. Vous pouvez les exporter ou les
              supprimer à tout moment.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <Text style={styles.fieldLabel}>
      {text}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
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
  safe: {
    flex: 1,
    backgroundColor: Serene.surface,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.xs,
    paddingBottom: Space.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Space.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontFamily: FontFamily.headingBold,
    fontSize: 19,
    lineHeight: 24,
    color: Serene.onPrimary,
  },
  title: {
    ...Typography.headlineLg,
    color: Serene.onSurface,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    marginTop: 3,
  },
  social: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Space.md,
  },
  socialButton: {
    flex: 1,
    height: 46,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Serene.outlineVariant,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  socialText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: Space.md,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  dividerText: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  rowField: {
    flex: 1,
  },
  fieldLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
    marginBottom: 5,
    marginTop: 10,
  },
  required: {
    color: Serene.error,
  },
  input: {
    height: 46,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
    paddingHorizontal: 12,
    fontFamily: FontFamily.body,
    fontSize: 13,
    color: Serene.onSurface,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  inputRowError: {
    borderWidth: 1,
    borderColor: Serene.error,
  },
  inputInline: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    color: Serene.onSurface,
    paddingVertical: 0,
  },
  strengthBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  strengthTrack: {
    flex: 1,
    height: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
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
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.error,
    marginTop: 4,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
  },
  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Serene.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxActive: {
    backgroundColor: Serene.primary,
    borderWidth: 0,
  },
  checkText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
  link: {
    color: Serene.secondary,
    textDecorationLine: 'underline',
  },
  primaryButton: {
    height: 50,
    borderRadius: Radius.xl,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Space.md,
    ...Shadow.floating,
  },
  primaryButtonDisabled: {
    backgroundColor: Serene.surfaceContainerHigh,
  },
  primaryButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginTop: Space.md,
  },
  footerText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  footerLink: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.secondary,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: Space.md,
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
  },
  privacyText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
});

