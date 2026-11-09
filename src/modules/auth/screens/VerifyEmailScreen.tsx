// S-06 - Vérification e-mail | Module M01 Comptes et authentification | Phase S2
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputInstance,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space } from '@/constants/design';

export default function VerifyEmailScreen() {
  const [code, setCode] = useState('');
  const [resend, setResend] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRef = useRef<TextInputInstance>(null);

  const digits = code.replace(/\D/g, '').slice(0, 6);
  const complete = digits.length === 6;

  if (verified) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.successBody}>
          <View style={styles.successIcon}>
            <Icon name="verified" size={42} color={Serene.onPrimary} />
          </View>
          <Text style={styles.successTitle}>Adresse confirmée</Text>
          <Text style={styles.successText}>
            Votre compte est activé. Bienvenue dans PLAA, Claire.
          </Text>
          <Pressable
            style={styles.primaryButton}
            accessibilityRole="button"
            onPress={() => router.replace('/dashboard')}>
            <Text style={styles.primaryButtonText}>Accéder à mon espace</Text>
            <Icon name="arrow_forward" size={18} color={Serene.onPrimary} />
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={() => router.back()}>
          <Icon name="arrow_back" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Vérification e-mail</Text>
        <View style={styles.headerButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Icon name="mark_email_unread" size={40} color={Serene.onPrimary} />
            </View>
            <Text style={styles.title}>Vérifiez votre adresse e-mail</Text>
            <Text style={styles.subtitle}>
              Nous avons envoyé un code à 6 chiffres à
            </Text>
            <View style={styles.emailPill}>
              <Icon name="mail" size={14} color={Serene.onSecondaryContainer} />
              <Text style={styles.emailText}>claire.martin@email.fr</Text>
            </View>
          </View>

          <Text style={styles.codeLabel}>Code de vérification</Text>
          <Pressable
            style={styles.codeRow}
            onPress={() => inputRef.current?.focus()}
            accessibilityRole="button"
            accessibilityLabel="Saisir le code à 6 chiffres">
            {Array.from({ length: 6 }).map((_, index) => {
              const digit = digits[index];
              const focused = index === digits.length && digits.length < 6;
              return (
                <View
                  key={index}
                  style={[
                    styles.codeBox,
                    digit ? styles.codeBoxFilled : null,
                    focused ? styles.codeBoxFocused : null,
                  ]}>
                  <Text style={styles.codeDigit}>{digit ?? ''}</Text>
                </View>
              );
            })}
            <TextInput
              ref={inputRef}
              style={styles.hiddenInput}
              value={digits}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              accessibilityLabel="Code de vérification"
            />
          </Pressable>

          <Pressable
            style={[styles.primaryButton, !complete && styles.primaryButtonDisabled]}
            accessibilityRole="button"
            disabled={!complete}
            onPress={() => setVerified(true)}>
            <Text style={styles.primaryButtonText}>Vérifier mon adresse</Text>
            <Icon name="check" size={18} color={Serene.onPrimary} />
          </Pressable>

          <View style={styles.resendBlock}>
            <Text style={styles.resendHint}>
              {resend ? 'E-mail renvoyé à l’instant.' : 'Vous n’avez rien reçu ?'}
            </Text>
            <Pressable
              style={styles.resendButton}
              accessibilityRole="button"
              onPress={() => setResend(true)}>
              <Icon name="refresh" size={15} color={Serene.secondary} />
              <Text style={styles.resendText}>
                {resend ? 'Renvoyer à nouveau' : 'Renvoyer le code'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.tipCard}>
            <Icon name="schedule" size={15} color={Serene.onSurfaceVariant} />
            <Text style={styles.tipText}>
              Le code expire dans 10 minutes. Pensez à vérifier vos spams.
            </Text>
          </View>

          <Pressable
            style={styles.skipRow}
            accessibilityRole="button"
            onPress={() => router.replace('/dashboard')}>
            <Text style={styles.skipText}>Configurer mon profil plus tard</Text>
            <Icon name="chevron_right" size={16} color={Serene.onSurfaceVariant} />
          </Pressable>

          <Pressable style={styles.changeRow} onPress={() => router.push('/register')}>
            <Text style={styles.changeText}>Modifier l’adresse e-mail</Text>
          </Pressable>
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
  header: {
    height: 56,
    paddingHorizontal: Space.gutter,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Serene.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Serene.surfaceContainerHigh,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FontFamily.heading,
    fontSize: 16,
    lineHeight: 22,
    color: Serene.onSurface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.xl,
    paddingBottom: Space.lg,
  },
  hero: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 82,
    height: 82,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.floating,
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: 24,
    lineHeight: 31,
    color: Serene.onSurface,
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
    marginTop: 5,
    textAlign: 'center',
  },
  emailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
  },
  emailText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSecondaryContainer,
  },
  codeLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
    marginTop: Space.xl,
    marginBottom: 8,
    textAlign: 'center',
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  codeBox: {
    width: 46,
    height: 54,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBoxFilled: {
    backgroundColor: Serene.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: Serene.secondary,
  },
  codeBoxFocused: {
    borderWidth: 1.5,
    borderColor: Serene.outlineVariant,
  },
  codeDigit: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    color: Serene.onSurface,
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  primaryButton: {
    height: 50,
    borderRadius: Radius.xl,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Space.lg,
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
  resendBlock: {
    alignItems: 'center',
    marginTop: Space.md,
    gap: 2,
  },
  resendHint: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  resendText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.secondary,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: Space.md,
    padding: 11,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
  },
  tipText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  skipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginTop: Space.lg,
    paddingVertical: 6,
  },
  skipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  changeRow: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  changeText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.secondary,
    textDecorationLine: 'underline',
  },
  successBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Space.gutter,
  },
  successIcon: {
    width: 92,
    height: 92,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.floating,
  },
  successTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 26,
    lineHeight: 33,
    color: Serene.onSurface,
    marginTop: 18,
    textAlign: 'center',
  },
  successText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 6,
  },
});

