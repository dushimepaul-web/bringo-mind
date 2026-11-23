// S-03 - Connexion | Module M01 Comptes et authentification | Phase S2
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import type { TextInputInstance } from 'react-native';
import {
  ActivityIndicator,
  Image,
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

import { BrandFullLogo } from '@/components/brand-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Icon } from '@/components/icon';
import { appLock } from '@/lib/app-lock';
import { displayMessage, isApiError } from '@/lib/api';
import { IS_DEMO } from '@/lib/config';
import { useSession } from '@/lib/session';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Space } from '@/constants/design';

import { login } from '../services/auth.service';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Formate un délai d'attente en « 4 min 30 s » ou « 45 s ». */
function formatLock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes} min ${String(rest).padStart(2, '0')} s` : `${rest} s`;
}

/** Libellé biométrique adapté au téléphone. */
const BIOMETRIC =
  Platform.OS === 'android'
    ? { label: 'Déverrouiller avec l’empreinte', icon: 'fingerprint' }
    : { label: 'Déverrouiller avec Face ID', icon: 'familiar_face_and_zone' };


/** Après une connexion réussie : pas de verrouillage Face ID, la personne vient de s'identifier. */
function openApp() {
  appLock.unlock();
  router.replace('/dashboard');
}

export default function LoginScreen() {
  const { c, styles } = useLook();
  const { signIn } = useSession();
  // Démo : identifiants préremplis. API : champs vides.
  const [email, setEmail] = useState(IS_DEMO ? 'claire.martin@email.fr' : '');
  const [password, setPassword] = useState(IS_DEMO ? 'demo123456' : '');
  // Double authentification : demandée par le serveur (401 { mfa_required: true }).
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | 'mfa' | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  /** Secondes restantes avant de pouvoir réessayer après un 423 (compte verrouillé) ou un 429. */
  const [lockSeconds, setLockSeconds] = useState(0);
  const passwordRef = useRef<TextInputInstance>(null);
  const mfaRef = useRef<TextInputInstance>(null);

  useEffect(() => {
    if (lockSeconds <= 0) return;
    const timer = setTimeout(() => setLockSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [lockSeconds]);

  const emailValid = EMAIL_PATTERN.test(email.trim());
  const emailError = emailTouched && email.length > 0 && !emailValid;
  const valid = emailValid && password.length > 0 && (!mfaRequired || mfaCode.trim().length >= 6);
  const locked = lockSeconds > 0;
  const canSubmit = valid && !loading && !locked;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setFormError(null);
    setEmailNotVerified(false);
    if (IS_DEMO) {
      // Démo : simule l'appel réseau avant d'ouvrir le tableau de bord.
      setTimeout(() => openApp(), 700);
      return;
    }
    try {
      const session = await login({
        email,
        password,
        mfaCode: mfaRequired ? mfaCode : undefined,
        rememberMe: remember,
      });
      await signIn(session);
      openApp();
    } catch (error) {
      setLoading(false);
      if (isApiError(error) && error.details.mfa_required === true) {
        // Identifiants corrects, code de double authentification attendu.
        setMfaRequired(true);
        setTimeout(() => mfaRef.current?.focus(), 50);
        return;
      }
      if (isApiError(error) && error.details.email_not_verified === true) {
        setEmailNotVerified(true);
      }
      if (isApiError(error) && error.fieldErrors().mfa_code) {
        setMfaCode('');
      }
      // 423 (compte verrouillé) ou 429 : le serveur indique le délai avant un nouvel essai.
      const retryAfter = isApiError(error)
        ? (error.retryAfter ?? Number(error.details.retry_after))
        : NaN;
      if (isApiError(error) && (error.status === 423 || error.status === 429) && retryAfter > 0) {
        setLockSeconds(Math.ceil(retryAfter));
      }
      setFormError(displayMessage(error));
    }
  };

  const iconColor = (field: 'email' | 'password' | 'mfa') =>
    focusedField === field ? c.link : c.muted;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.decor} pointerEvents="none">
        <View style={styles.blobTop} />
        <View style={styles.waveBottom} />
        <View style={styles.waveBottomInner} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}>
            <BrandFullLogo height={46} onDark={c.dark} />
            <ThemeToggle />
          </View>

          <View style={styles.hero}>
            <Text style={styles.title}>
              Content de <Text style={styles.titleAccent}>vous revoir</Text>
            </Text>
            <Text style={styles.subtitle}>Connectez-vous pour retrouver votre journée.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Adresse e-mail</Text>
            <View
              style={[
                styles.inputRow,
                focusedField === 'email' && styles.inputRowFocused,
                emailError && styles.inputRowError,
              ]}>
              <Icon name="mail" size={20} color={emailError ? c.error : iconColor('email')} />
              <TextInput
                style={styles.inputInline}
                placeholder="vous@email.fr"
                placeholderTextColor={c.muted}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => {
                  setFocusedField(null);
                  setEmailTouched(true);
                }}
                keyboardType="email-address"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="username"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => passwordRef.current?.focus()}
                selectionColor={c.link}
                accessibilityLabel="Adresse e-mail"
                aria-invalid={emailError}
              />
            </View>
            {emailError ? (
              <View style={styles.errorRow} accessibilityLiveRegion="polite">
                <Icon name="error" size={16} color={c.error} />
                <Text style={styles.errorText}>Saisissez une adresse e-mail valide.</Text>
              </View>
            ) : null}

            <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>Mot de passe</Text>
            <View
              style={[styles.inputRow, focusedField === 'password' && styles.inputRowFocused]}>
              <Icon name="lock" size={20} color={iconColor('password')} />
              <TextInput
                ref={passwordRef}
                style={styles.inputInline}
                placeholder="Votre mot de passe"
                placeholderTextColor={c.muted}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
                selectionColor={c.link}
                accessibilityLabel="Mot de passe"
              />
              <Pressable
                style={({ pressed }) => [pressed && styles.iconPressed]}
                hitSlop={10}
                accessibilityRole="button"
                onPress={() => setShowPassword((value) => !value)}
                accessibilityLabel={
                  showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                }>
                <Icon
                  name={showPassword ? 'visibility' : 'visibility_off'}
                  size={22}
                  color={iconColor('password')}
                />
              </Pressable>
            </View>

            {mfaRequired ? (
              <>
                <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>Code de vérification</Text>
                <View style={[styles.inputRow, focusedField === 'mfa' && styles.inputRowFocused]}>
                  <Icon name="pin" size={20} color={iconColor('mfa')} />
                  <TextInput
                    ref={mfaRef}
                    style={styles.inputInline}
                    placeholder="Code à 6 chiffres ou code de secours"
                    placeholderTextColor={c.muted}
                    value={mfaCode}
                    onChangeText={setMfaCode}
                    onFocus={() => setFocusedField('mfa')}
                    onBlur={() => setFocusedField(null)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="one-time-code"
                    textContentType="oneTimeCode"
                    returnKeyType="go"
                    onSubmitEditing={handleSubmit}
                    selectionColor={c.link}
                    accessibilityLabel="Code de double authentification"
                  />
                </View>
                <Text style={styles.mfaHint}>
                  Ouvrez votre application d’authentification et saisissez le code affiché.
                </Text>
              </>
            ) : null}

            {formError ? (
              <View style={styles.errorRow} accessibilityLiveRegion="polite" accessibilityRole="alert">
                <Icon name="error" size={16} color={c.error} />
                <Text style={styles.errorText}>{formError}</Text>
              </View>
            ) : null}
            {locked ? (
              <Text style={styles.lockHint} accessibilityLiveRegion="polite">
                Nouvelle tentative possible dans {formatLock(lockSeconds)}.
              </Text>
            ) : null}
            {emailNotVerified ? (
              <Pressable
                style={({ pressed }) => [pressed && styles.linkPressed]}
                hitSlop={8}
                accessibilityRole="link"
                onPress={() => router.push({ pathname: '/verify-email', params: { email: email.trim() } })}>
                <Text style={styles.forgotText}>Renvoyer le lien de confirmation</Text>
              </Pressable>
            ) : null}

            <View style={styles.optionsRow}>
              <Pressable
                style={styles.rememberRow}
                hitSlop={8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: remember }}
                accessibilityLabel="Rester connecté"
                onPress={() => setRemember((value) => !value)}>
                <View style={[styles.checkbox, remember && styles.checkboxOn]}>
                  {remember ? <Icon name="check" size={16} color="#FFFFFF" /> : null}
                </View>
                <Text style={styles.rememberText} numberOfLines={1}>
                  Rester connecté
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [pressed && styles.linkPressed]}
                hitSlop={8}
                accessibilityRole="link"
                onPress={() => router.push('/forgot-password')}>
                <Text style={styles.forgotText} numberOfLines={1}>Mot de passe oublié ?</Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                !valid && styles.primaryButtonDisabled,
                pressed && canSubmit && styles.primaryButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSubmit, busy: loading }}
              disabled={!canSubmit}
              onPress={handleSubmit}>
              {loading ? (
                <>
                  <ActivityIndicator color={c.solidText} />
                  <Text style={styles.primaryButtonText}>Connexion…</Text>
                </>
              ) : (
                <>
                  <Text
                    style={[styles.primaryButtonText, !valid && styles.primaryButtonTextDisabled]}>
                    Se connecter
                  </Text>
                  <Icon
                    name="arrow_forward"
                    size={22}
                    color={c.solidText}
                  />
                </>
              )}
            </Pressable>
          </View>

          {/* Connexion Google / Apple et déverrouillage biométrique : démo seulement.
              Le backend n'a pas de connexion sociale (OAuth) ; la biométrie ne remplace pas
              une première connexion par mot de passe. */}
          {IS_DEMO ? (
          <>
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Ou se connecter avec</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.social}>
            <Pressable
              style={({ pressed }) => [styles.socialButton, pressed && styles.socialButtonPressed]}
              accessibilityRole="button"
              accessibilityLabel="Continuer avec Google"
              onPress={() => openApp()}>
              <Image
                source={require('../../../../assets/images/brand/google.png')}
                style={styles.brandIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialText}>Google</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.socialButton, pressed && styles.socialButtonPressed]}
              accessibilityRole="button"
              accessibilityLabel="Continuer avec Apple"
              onPress={() => openApp()}>
              <Image
                source={require('../../../../assets/images/brand/apple.png')}
                style={[styles.appleIcon, c.dark && styles.appleIconDark]}
                resizeMode="contain"
              />
              <Text style={styles.socialText}>Apple</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.biometricButton, pressed && styles.socialButtonPressed]}
            accessibilityRole="button"
            accessibilityLabel={BIOMETRIC.label}
            onPress={() => openApp()}>
            <Icon name="verified_user" size={22} color={c.link} />
            <Text style={styles.biometricText}>{BIOMETRIC.label}</Text>
            <Icon name={BIOMETRIC.icon} size={24} color={c.link} />
          </Pressable>
          </>
          ) : null}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ?</Text>
            <Pressable
              style={({ pressed }) => [pressed && styles.linkPressed]}
              hitSlop={8}
              accessibilityRole="link"
              onPress={() => router.push('/register')}>
              <Text style={styles.footerLink}>Créer un compte</Text>
            </Pressable>
          </View>

          <View style={styles.securityRow}>
            <Icon name="lock" size={16} color={c.muted} filled />
            <Text style={styles.securityText}>Votre sécurité, notre priorité</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    safe: {
      flex: 1,
      backgroundColor: c.page,
    },
    decor: {
      ...StyleSheet.absoluteFill,
      overflow: 'hidden',
    },
    flex: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    content: {
      width: '100%',
      maxWidth: 440,
      alignSelf: 'center',
      paddingHorizontal: 20,
      paddingTop: Space.md,
      paddingBottom: 40,
    },
    blobTop: {
      position: 'absolute',
      top: -120,
      right: -110,
      width: 300,
      height: 300,
      borderRadius: Radius.full,
      backgroundColor: c.glow,
      opacity: 0.28,
    },
    waveBottom: {
      position: 'absolute',
      bottom: -260,
      left: -80,
      right: -80,
      height: 330,
      borderRadius: 400,
      backgroundColor: c.soft,
      opacity: 0.9,
    },
    waveBottomInner: {
      position: 'absolute',
      bottom: -300,
      right: -160,
      width: 420,
      height: 340,
      borderRadius: Radius.full,
      backgroundColor: c.glow,
      opacity: 0.25,
    },
    iconPressed: {
      opacity: 0.55,
    },
    linkPressed: {
      opacity: 0.65,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    hero: {
      marginTop: 28,
      marginBottom: 18,
    },
    title: {
      fontFamily: FontFamily.headingBold,
      fontSize: 26,
      lineHeight: 32,
      letterSpacing: -0.5,
      color: c.text,
    },
    titleAccent: {
      color: c.link,
    },
    subtitle: {
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 20,
      color: c.muted,
      marginTop: 6,
    },
    card: {
      marginTop: Space.lg,
      padding: 16,
      borderRadius: 22,
      backgroundColor: c.card,
      shadowColor: c.text,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.07,
      shadowRadius: 24,
      elevation: 4,
    },
    fieldLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
      marginBottom: 10,
    },
    fieldLabelSpaced: {
      marginTop: 20,
    },
    inputRowError: {
      borderColor: c.error,
      backgroundColor: c.card,
    },
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
    },
    errorText: {
      flexShrink: 1,
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.error,
    },
    lockHint: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
      marginTop: 8,
    },
    mfaHint: {
      fontFamily: FontFamily.body,
      fontSize: 12,
      lineHeight: 17,
      color: c.muted,
      marginTop: 6,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      height: 54,
      paddingHorizontal: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.soft,
    },
    inputRowFocused: {
      borderColor: c.link,
      backgroundColor: c.card,
    },
    inputInline: {
      flex: 1,
      minWidth: 0,
      outlineWidth: 0,
      fontFamily: FontFamily.body,
      fontSize: 16,
      color: c.text,
      paddingVertical: 0,
    },
    optionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 18,
    },
    rememberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: c.muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxOn: {
      borderColor: c.link,
      backgroundColor: c.link,
    },
    rememberText: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.text,
    },
    forgotText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.link,
    },
    primaryButton: {
      height: 56,
      borderRadius: 18,
      backgroundColor: c.solid,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      marginTop: 22,
      shadowColor: c.solid,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.22,
      shadowRadius: 16,
      elevation: 8,
    },
    primaryButtonDisabled: {
      // Bouton noir estompé : reste reconnaissable comme bouton, sans se confondre avec un champ.
      opacity: 0.3,
      shadowOpacity: 0,
      elevation: 0,
    },
    primaryButtonPressed: {
      backgroundColor: c.solidPressed,
      transform: [{ scale: 0.99 }],
    },
    primaryButtonText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 18,
      lineHeight: 23,
      color: c.solidText,
    },
    primaryButtonTextDisabled: {
      color: c.solidText,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 28,
      marginBottom: 18,
    },
    divider: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.border,
    },
    dividerText: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 14,
      lineHeight: 18,
      color: c.muted,
    },
    social: {
      flexDirection: 'row',
      gap: 12,
    },
    socialButton: {
      flex: 1,
      height: 56,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    socialButtonPressed: {
      backgroundColor: c.soft,
      transform: [{ scale: 0.99 }],
    },
    socialText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    brandIcon: {
      width: 22,
      height: 22,
    },
    appleIcon: {
      width: 22,
      height: 22,
    },
    appleIconDark: {
      tintColor: '#FFFFFF',
    },
    biometricButton: {
      height: 56,
      borderRadius: 18,
      backgroundColor: c.soft,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      marginTop: 14,
    },
    biometricText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.link,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 6,
      marginTop: Space.lg,
    },
    footerText: {
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 19,
      color: c.muted,
    },
    footerLink: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.link,
    },
    securityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginTop: 14,
    },
    securityText: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
  });
}
