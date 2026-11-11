// S-03 - Connexion | Module M01 Comptes et authentification | Phase S2
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import type { TextInputInstance } from 'react-native';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandLogo } from '@/components/brand-logo';
import { Icon } from '@/components/icon';
import { appLock } from '@/lib/app-lock';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [email, setEmail] = useState('claire.martin@email.fr');
  const [password, setPassword] = useState('demo123456');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInputInstance>(null);

  const emailValid = EMAIL_PATTERN.test(email.trim());
  const emailError = emailTouched && email.length > 0 && !emailValid;
  const valid = emailValid && password.length > 0;
  const canSubmit = valid && !loading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setLoading(true);
    // Démo : simule l'appel réseau avant d'ouvrir le tableau de bord.
    setTimeout(() => openApp(), 700);
  };

  const iconColor = (field: 'email' | 'password') =>
    focusedField === field ? Tint.primary : Serene.onSurfaceVariant;

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
            <BrandLogo size={64} />
            <View>
              <Text style={styles.wordmark}>
                bringo <Text style={styles.wordmarkAccent}>mind</Text>
              </Text>
              <Text style={styles.tagline}>Organisez • Gérez • Avancez</Text>
            </View>
          </View>

          <View style={styles.hero}>
            <View style={styles.heroText}>
              <Text style={styles.title}>
                Bon retour{'\n'}
                <Text style={styles.titleAccent}>parmi nous !</Text>
              </Text>
              <View style={styles.titleUnderline} />
              <Text style={styles.subtitle}>
                Retrouvez vos tâches, documents et rappels en un seul endroit.
              </Text>
            </View>
            <HeroIllustration />
          </View>

          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Adresse e-mail</Text>
            <View
              style={[
                styles.inputRow,
                focusedField === 'email' && styles.inputRowFocused,
                emailError && styles.inputRowError,
              ]}>
              <Icon name="mail" size={20} color={emailError ? Serene.error : iconColor('email')} />
              <TextInput
                style={styles.inputInline}
                placeholder="vous@email.fr"
                placeholderTextColor={Serene.onSurfaceVariant}
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
                selectionColor={Tint.primary}
                accessibilityLabel="Adresse e-mail"
                aria-invalid={emailError}
              />
            </View>
            {emailError ? (
              <View style={styles.errorRow} accessibilityLiveRegion="polite">
                <Icon name="error" size={16} color={Serene.error} />
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
                placeholderTextColor={Serene.onSurfaceVariant}
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
                selectionColor={Tint.primary}
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

            <View style={styles.optionsRow}>
              <View style={styles.rememberRow}>
                <Switch
                  value={remember}
                  onValueChange={setRemember}
                  trackColor={{ false: Serene.surfaceContainerHigh, true: Tint.primary }}
                  thumbColor={Serene.surfaceContainerLowest}
                  {...(Platform.OS === 'web' ? { activeThumbColor: Serene.surfaceContainerLowest } : {})}
                  ios_backgroundColor={Serene.surfaceContainerHigh}
                  accessibilityLabel="Rester connecté"
                />
                <Pressable
                  hitSlop={8}
                  onPress={() => setRemember((value) => !value)}
                  accessibilityElementsHidden
                  importantForAccessibility="no">
                  <Text style={styles.rememberText} numberOfLines={1}>
                    Rester connecté
                  </Text>
                </Pressable>
              </View>
              <View style={styles.optionsDivider} />
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
                  <ActivityIndicator color={Serene.onPrimary} />
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
                    color={Serene.onPrimary}
                  />
                </>
              )}
            </Pressable>
          </View>

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
                style={styles.appleIcon}
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
            <Icon name="verified_user" size={22} color={Tint.primary} />
            <Text style={styles.biometricText}>{BIOMETRIC.label}</Text>
            <Icon name={BIOMETRIC.icon} size={24} color={Tint.primary} />
          </Pressable>

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
            <Icon name="lock" size={16} color={Serene.onSurfaceVariant} filled />
            <Text style={styles.securityText}>Votre sécurité, notre priorité</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Illustration décorative : téléphone, calendrier et notifications. */
function HeroIllustration() {
  return (
    <View style={styles.art} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.artBlob} />
      <View style={styles.artPhone}>
        {[0, 1, 2].map((row) => (
          <View key={row} style={styles.artRow}>
            <Icon
              name="check_circle"
              size={16}
              color={row === 2 ? Serene.success : Tint.primary}
              filled
            />
            <View style={styles.artLines}>
              <View style={styles.artLine} />
              <View style={[styles.artLine, styles.artLineShort]} />
            </View>
          </View>
        ))}
        <View style={styles.artButton} />
      </View>
      <View style={styles.artCalendar}>
        <Icon name="calendar_month" size={30} color={Tint.primary} filled />
      </View>
      <View style={styles.artBell}>
        <Icon name="notifications" size={40} color={Tint.amber} filled />
        <View style={styles.artBellDot} />
      </View>
      <View style={styles.artBadge}>
        <Icon name="notifications" size={20} color={Serene.onPrimary} filled />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Tint.softer,
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
    backgroundColor: Tint.glow,
    opacity: 0.28,
  },
  waveBottom: {
    position: 'absolute',
    bottom: -260,
    left: -80,
    right: -80,
    height: 330,
    borderRadius: 400,
    backgroundColor: Tint.lavender,
    opacity: 0.9,
  },
  waveBottomInner: {
    position: 'absolute',
    bottom: -300,
    right: -160,
    width: 420,
    height: 340,
    borderRadius: Radius.full,
    backgroundColor: Tint.glow,
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
    gap: 14,
  },
  wordmark: {
    fontFamily: FontFamily.headingBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: Tint.navy,
  },
  wordmarkAccent: {
    fontFamily: FontFamily.bodySemiBold,
    color: Tint.primary,
  },
  tagline: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    marginTop: 2,
  },
  hero: {
    marginTop: 28,
    minHeight: 190,
  },
  heroText: {
    width: '62%',
    zIndex: 1,
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.8,
    color: Tint.navy,
  },
  titleAccent: {
    color: Tint.primary,
  },
  titleUnderline: {
    width: 150,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Tint.primary,
    marginTop: 6,
    marginLeft: 14,
    transform: [{ rotate: '-2deg' }],
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 22,
    color: Serene.onSurfaceVariant,
    marginTop: 16,
  },
  art: {
    position: 'absolute',
    top: -6,
    right: -8,
    width: 150,
    height: 190,
  },
  artBlob: {
    position: 'absolute',
    top: 10,
    left: 0,
    width: 150,
    height: 170,
    borderRadius: 80,
    backgroundColor: Tint.lavender,
  },
  artPhone: {
    position: 'absolute',
    top: 8,
    left: 42,
    width: 88,
    height: 160,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: Tint.navy,
    backgroundColor: Serene.surfaceContainerLowest,
    paddingTop: 22,
    paddingHorizontal: 9,
    gap: 12,
    transform: [{ rotate: '12deg' }],
    shadowColor: Tint.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  artRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  artLines: {
    flex: 1,
    gap: 4,
  },
  artLine: {
    height: 5,
    borderRadius: Radius.full,
    backgroundColor: Tint.border,
  },
  artLineShort: {
    width: '60%',
  },
  artButton: {
    height: 14,
    borderRadius: 6,
    backgroundColor: Tint.soft,
    marginTop: 4,
  },
  artCalendar: {
    position: 'absolute',
    top: 62,
    left: 6,
    width: 50,
    height: 48,
    borderRadius: 12,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Tint.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    transform: [{ rotate: '-8deg' }],
  },
  artBell: {
    position: 'absolute',
    top: 24,
    right: -4,
    transform: [{ rotate: '14deg' }],
  },
  artBellDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: Tint.red,
    borderWidth: 2,
    borderColor: Serene.surfaceContainerLowest,
  },
  artBadge: {
    position: 'absolute',
    bottom: 14,
    right: 8,
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: Tint.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Tint.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  card: {
    marginTop: Space.lg,
    padding: 16,
    borderRadius: 22,
    backgroundColor: Serene.surfaceContainerLowest,
    shadowColor: Tint.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
  },
  fieldLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
    marginBottom: 10,
  },
  fieldLabelSpaced: {
    marginTop: 20,
  },
  inputRowError: {
    borderColor: Serene.error,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  errorText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.error,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Tint.soft,
  },
  inputRowFocused: {
    borderColor: Tint.primary,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  inputInline: {
    flex: 1,
    minWidth: 0,
    outlineWidth: 0,
    fontFamily: FontFamily.body,
    fontSize: 16,
    color: Tint.navy,
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
  rememberText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Tint.navy,
  },
  optionsDivider: {
    width: StyleSheet.hairlineWidth,
    height: 24,
    backgroundColor: Tint.border,
    marginHorizontal: 10,
  },
  forgotText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Tint.primary,
  },
  primaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: Tint.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 22,
    shadowColor: Tint.black,
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
    backgroundColor: Tint.blackPressed,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 18,
    lineHeight: 23,
    color: Serene.onPrimary,
  },
  primaryButtonTextDisabled: {
    color: Serene.onPrimary,
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
    backgroundColor: Tint.border,
  },
  dividerText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
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
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  socialButtonPressed: {
    backgroundColor: Tint.soft,
    transform: [{ scale: 0.99 }],
  },
  socialText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  brandIcon: {
    width: 22,
    height: 22,
  },
  appleIcon: {
    width: 22,
    height: 22,
  },
  biometricButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: Tint.soft,
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
    color: Tint.primary,
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
    color: Serene.onSurfaceVariant,
  },
  footerLink: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.primary,
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
    color: Serene.onSurfaceVariant,
  },
});
