// S-04 - Mot de passe oublié | Module M01 Comptes et authentification | Phase S2
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('claire.martin@email.fr');
  const [sent, setSent] = useState(false);
  const [resent, setResent] = useState(false);

  const valid = email.includes('@') && email.includes('.');

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
        <Text style={styles.headerTitle}>Mot de passe oublié</Text>
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
          {sent ? (
            <>
              <View style={styles.hero}>
                <View style={styles.heroIcon}>
                  <Icon name="mark_email_read" size={36} color={Serene.secondary} />
                </View>
                <Text style={styles.title}>Vérifiez votre boîte mail</Text>
                <Text style={styles.subtitle}>
                  Un lien de réinitialisation a été envoyé à{' '}
                  <Text style={styles.emailStrong}>{email}</Text>. Il est valable 30 minutes.
                </Text>
              </View>

              <View style={styles.stepsCard}>
                <StepRow index="1" text="Ouvrez l’e-mail de PLAA" active />
                <View style={styles.stepDivider} />
                <StepRow index="2" text="Cliquez sur « Réinitialiser mon mot de passe »" />
                <View style={styles.stepDivider} />
                <StepRow index="3" text="Choisissez un nouveau mot de passe" />
              </View>

              {resent ? (
                <View style={styles.successBanner}>
                  <Icon name="check_circle" size={17} color={Serene.success} />
                  <Text style={styles.successText}>Un nouvel e-mail vient d’être envoyé.</Text>
                </View>
              ) : null}

              <Pressable
                style={styles.primaryButton}
                accessibilityRole="button"
                onPress={() => router.push('/reset-password')}>
                <Text style={styles.primaryButtonText}>J’ai reçu le lien</Text>
                <Icon name="arrow_forward" size={18} color={Serene.onPrimary} />
              </Pressable>

              <Pressable style={styles.resendRow} onPress={() => setResent(true)}>
                <Icon name="refresh" size={16} color={Serene.secondary} />
                <Text style={styles.resendText}>Renvoyer l’e-mail</Text>
              </Pressable>

              <Pressable style={styles.changeRow} onPress={() => setSent(false)}>
                <Text style={styles.changeText}>Utiliser une autre adresse e-mail</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.hero}>
                <View style={styles.heroIconSoft}>
                  <Icon name="lock_reset" size={32} color={Serene.secondary} />
                </View>
                <Text style={styles.title}>Mot de passe oublié ?</Text>
                <Text style={styles.subtitle}>
                  Indiquez l’adresse associée à votre compte et nous vous enverrons un lien
                  sécurisé.
                </Text>
              </View>

              <Text style={styles.fieldLabel}>Adresse e-mail</Text>
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

              <Pressable
                style={[styles.primaryButton, !valid && styles.primaryButtonDisabled]}
                accessibilityRole="button"
                disabled={!valid}
                onPress={() => setSent(true)}>
                <Text style={styles.primaryButtonText}>Envoyer le lien</Text>
                <Icon name="send" size={17} color={Serene.onPrimary} />
              </Pressable>

              <View style={styles.tipCard}>
                <Icon name="info" size={16} color={Serene.onSurfaceVariant} />
                <Text style={styles.tipText}>
                  Pensez à vérifier vos courriers indésirables. Le lien expire au bout de 30
                  minutes pour votre sécurité.
                </Text>
              </View>
            </>
          )}

          <View style={styles.footer}>
            <Pressable
              style={styles.footerBack}
              onPress={() => router.replace('/login')}
              accessibilityRole="button">
              <Icon name="arrow_back" size={16} color={Serene.onSurfaceVariant} />
              <Text style={styles.footerBackText}>Retour à la connexion</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function StepRow({ index, text, active }: { index: string; text: string; active?: boolean }) {
  return (
    <View style={styles.stepRow}>
      <View style={[styles.stepIndex, active && styles.stepIndexActive]}>
        <Text style={[styles.stepIndexText, active && styles.stepIndexTextActive]}>{index}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
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
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.lg,
    paddingBottom: Space.lg,
  },
  hero: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 76,
    height: 76,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  heroIconSoft: {
    width: 76,
    height: 76,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: 24,
    lineHeight: 31,
    color: Serene.onSurface,
    marginTop: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 5,
    maxWidth: 320,
  },
  emailStrong: {
    fontFamily: FontFamily.bodySemiBold,
    color: Serene.onSurface,
  },
  fieldLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
    marginBottom: 5,
    marginTop: Space.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 50,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  inputInline: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 14,
    color: Serene.onSurface,
    paddingVertical: 0,
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
  stepsCard: {
    marginTop: Space.lg,
    padding: 12,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 7,
  },
  stepIndex: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndexActive: {
    backgroundColor: Serene.primary,
  },
  stepIndexText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  stepIndexTextActive: {
    color: Serene.onPrimary,
  },
  stepText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurface,
  },
  stepDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
    marginLeft: 34,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 10,
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: Serene.successContainer,
  },
  successText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.success,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
  },
  resendText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.secondary,
  },
  changeRow: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  changeText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
    textDecorationLine: 'underline',
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
  footer: {
    marginTop: Space.xl,
    alignItems: 'center',
  },
  footerBack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
  },
  footerBackText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
});
