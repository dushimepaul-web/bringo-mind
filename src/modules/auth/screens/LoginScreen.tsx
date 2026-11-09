// S-03 - Connexion | Module M01 Comptes et authentification | Phase S2
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import type { TextInputInstance } from 'react-native';
import {
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

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Space } from '@/constants/design';

export default function LoginScreen() {
  const [email, setEmail] = useState('claire.martin@email.fr');
  const [password, setPassword] = useState('demo123456');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const passwordRef = useRef<TextInputInstance>(null);

  const valid = email.trim().includes('@') && password.length > 0;

  const handleSubmit = () => {
    if (!valid) return;
    router.replace('/dashboard');
  };

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
              style={({ pressed }) => [styles.backButton, pressed && styles.iconPressed]}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityLabel="Retour"
              onPress={() => router.back()}>
              <Icon name="arrow_back" size={26} color={Serene.onSurface} />
            </Pressable>
          </View>

          <View style={styles.brandRow}>
            <View style={styles.logo}>
              <Text style={styles.logoLetter}>K</Text>
            </View>
            <Text style={styles.wordmark}>Bringo Mind</Text>
          </View>

          <Text style={styles.title}>Bon retour parmi nous</Text>
          <Text style={styles.subtitle}>Retrouvez vos tâches, documents et rappels.</Text>

          <Text style={styles.fieldLabel}>Adresse e-mail</Text>
          <View style={[styles.inputRow, focusedField === 'email' && styles.inputRowFocused]}>
            <Icon
              name="mail"
              size={20}
              color={focusedField === 'email' ? Serene.secondary : Serene.onSurfaceVariant}
            />
            <TextInput
              style={styles.inputInline}
              placeholder="vous@email.fr"
              placeholderTextColor={Serene.onSurfaceVariant}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="username"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => passwordRef.current?.focus()}
              selectionColor={Serene.secondary}
              accessibilityLabel="Adresse e-mail"
            />
          </View>

          <Text style={styles.fieldLabel}>Mot de passe</Text>
          <View style={[styles.inputRow, focusedField === 'password' && styles.inputRowFocused]}>
            <Icon
              name="lock"
              size={20}
              color={focusedField === 'password' ? Serene.secondary : Serene.onSurfaceVariant}
            />
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
              selectionColor={Serene.secondary}
              accessibilityLabel="Mot de passe"
            />
            <Pressable
              style={({ pressed }) => [pressed && styles.iconPressed]}
              hitSlop={10}
              accessibilityRole="button"
              onPress={() => setShowPassword((value) => !value)}
              accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
              <Icon
                name={showPassword ? 'visibility_off' : 'visibility'}
                size={22}
                color={focusedField === 'password' ? Serene.secondary : Serene.onSurfaceVariant}
              />
            </Pressable>
          </View>

          <View style={styles.optionsRow}>
            <View style={styles.rememberRow}>
              <Switch
                value={remember}
                onValueChange={setRemember}
                trackColor={{ false: Serene.surfaceContainerHigh, true: Serene.secondary }}
                thumbColor={Serene.surfaceContainerLowest}
                ios_backgroundColor={Serene.surfaceContainerHigh}
                accessibilityLabel="Rester connecté"
              />
              <Text style={styles.rememberText}>Rester connecté</Text>
            </View>
            <Pressable
              style={({ pressed }) => [pressed && styles.linkPressed]}
              hitSlop={8}
              accessibilityRole="link"
              onPress={() => router.push('/forgot-password')}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              !valid && styles.primaryButtonDisabled,
              pressed && valid && styles.primaryButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityState={{ disabled: !valid }}
            disabled={!valid}
            onPress={handleSubmit}>
            <Text
              style={[styles.primaryButtonText, !valid && styles.primaryButtonTextDisabled]}>
              Se connecter
            </Text>
            <Icon
              name="arrow_forward"
              size={20}
              color={valid ? Serene.onPrimary : Serene.onSurfaceVariant}
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.biometricRow, pressed && styles.linkPressed]}
            hitSlop={8}
            accessibilityRole="button"
            onPress={() => router.replace('/dashboard')}>
            <Icon name="face" size={21} color={Serene.secondary} />
            <Text style={styles.biometricText}>Déverrouiller avec Face ID</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.social}>
            <Pressable
              style={({ pressed }) => [styles.socialButton, pressed && styles.socialButtonPressed]}
              accessibilityRole="button"
              accessibilityLabel="Continuer avec Google">
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
              accessibilityLabel="Continuer avec Apple">
              <Image
                source={require('../../../../assets/images/brand/apple.png')}
                style={styles.appleIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialText}>Apple</Text>
            </Pressable>
          </View>

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

          <View style={styles.demoCard}>
            <Icon name="science" size={20} color={Serene.success} />
            <Text style={styles.demoText}>
              Version de démonstration : l’e-mail et le mot de passe sont préremplis.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
    paddingHorizontal: 20,
    paddingTop: Space.xs,
    paddingBottom: 32,
  },
  topBar: {
    height: 44,
    justifyContent: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
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
    gap: 16,
    marginTop: Space.lg,
    marginBottom: 28,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: Serene.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontFamily: FontFamily.headingBold,
    fontSize: 38,
    lineHeight: 44,
    color: Serene.onPrimary,
  },
  wordmark: {
    fontFamily: FontFamily.headingBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: Serene.onSurface,
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: 31,
    lineHeight: 37,
    letterSpacing: -0.7,
    color: Serene.onSurface,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 22,
    color: Serene.onSurfaceVariant,
    marginTop: 8,
  },
  fieldLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
    marginTop: 22,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 56,
    paddingHorizontal: 16,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: Serene.surfaceContainerLow,
  },
  inputRowFocused: {
    borderColor: Serene.secondary,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  inputInline: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 16,
    color: Serene.onSurface,
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
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  forgotText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.secondary,
  },
  primaryButton: {
    height: 58,
    borderRadius: Radius.xl,
    backgroundColor: Serene.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: Space.lg,
  },
  primaryButtonDisabled: {
    backgroundColor: Serene.surfaceContainerHigh,
  },
  primaryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Serene.onPrimary,
  },
  primaryButtonTextDisabled: {
    color: Serene.onSurfaceVariant,
  },
  biometricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    marginTop: 12,
  },
  biometricText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.secondary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: Space.lg,
    marginBottom: Space.lg,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(11, 28, 48, 0.12)',
  },
  dividerText: {
    fontFamily: FontFamily.body,
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
    height: 54,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11, 28, 48, 0.14)',
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialButtonPressed: {
    backgroundColor: Serene.surfaceContainerLow,
    transform: [{ scale: 0.99 }],
  },
  socialText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onSurface,
  },
  brandIcon: {
    width: 20,
    height: 20,
  },
  appleIcon: {
    width: 21,
    height: 21,
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
    color: Serene.secondary,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: Space.lg,
    padding: 16,
    borderRadius: Radius.xl,
    backgroundColor: Serene.successContainer,
  },
  demoText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
  },
});
