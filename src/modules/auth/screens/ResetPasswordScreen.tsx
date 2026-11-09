// S-05 - Nouveau mot de passe | Module M01 Comptes et authentification | Phase S2
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

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const rules = [
    { label: 'Au moins 8 caractères', met: password.length >= 8 },
    { label: 'Une majuscule et une minuscule', met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: 'Un chiffre', met: /[0-9]/.test(password) },
    { label: 'Un caractère spécial', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const allRules = rules.every((rule) => rule.met);
  const match = confirm.length > 0 && confirm === password;
  const valid = allRules && match;

  if (done) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.successBody}>
          <View style={styles.successIcon}>
            <Icon name="lock_open" size={40} color={Serene.onPrimary} />
          </View>
          <Text style={styles.successTitle}>Mot de passe mis à jour</Text>
          <Text style={styles.successText}>
            Votre nouveau mot de passe est actif. Reconnectez-vous pour accéder à votre espace.
          </Text>
          <Pressable
            style={styles.primaryButton}
            accessibilityRole="button"
            onPress={() => router.replace('/login')}>
            <Text style={styles.primaryButtonText}>Se connecter</Text>
            <Icon name="arrow_forward" size={18} color={Serene.onPrimary} />
          </Pressable>
          <View style={styles.securityNote}>
            <Icon name="shield" size={15} color={Serene.onSurfaceVariant} />
            <Text style={styles.securityNoteText}>
              Toutes vos sessions actives ont été déconnectées par sécurité.
            </Text>
          </View>
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
        <Text style={styles.headerTitle}>Nouveau mot de passe</Text>
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
              <Icon name="key" size={32} color={Serene.secondary} />
            </View>
            <Text style={styles.title}>Choisissez un nouveau mot de passe</Text>
            <Text style={styles.subtitle}>
              Utilisez un mot de passe unique que vous n’utilisez pas ailleurs.
            </Text>
          </View>

          <Text style={styles.fieldLabel}>Nouveau mot de passe</Text>
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
              accessibilityLabel="Nouveau mot de passe"
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

          <View style={styles.rulesCard}>
            {rules.map((rule) => (
              <View key={rule.label} style={styles.ruleRow}>
                <Icon
                  name={rule.met ? 'check_circle' : 'radio_button_unchecked'}
                  size={16}
                  color={rule.met ? Serene.success : Serene.outlineVariant}
                />
                <Text style={[styles.ruleText, rule.met && styles.ruleTextMet]}>
                  {rule.label}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Confirmer le mot de passe</Text>
          <View
            style={[
              styles.inputRow,
              confirm.length > 0 && !match && styles.inputRowError,
            ]}>
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
                name={match ? 'check_circle' : 'error'}
                size={18}
                color={match ? Serene.success : Serene.error}
              />
            ) : null}
          </View>
          {confirm.length > 0 && !match ? (
            <Text style={styles.errorText}>Les mots de passe ne correspondent pas.</Text>
          ) : null}

          <Pressable
            style={[styles.primaryButton, !valid && styles.primaryButtonDisabled]}
            accessibilityRole="button"
            disabled={!valid}
            onPress={() => setDone(true)}>
            <Text style={styles.primaryButtonText}>Enregistrer le mot de passe</Text>
            <Icon name="check" size={18} color={Serene.onPrimary} />
          </Pressable>

          <View style={styles.tipCard}>
            <Icon name="lightbulb" size={15} color={Serene.warning} />
            <Text style={styles.tipText}>
              Astuce : une phrase de passe longue (par exemple « 3 chats dorment à Paris ! »)
              est plus sûre et plus facile à retenir.
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
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: 23,
    lineHeight: 30,
    color: Serene.onSurface,
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 310,
  },
  fieldLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
    marginBottom: 5,
    marginTop: Space.md,
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
  inputRowError: {
    borderWidth: 1,
    borderColor: Serene.error,
  },
  inputInline: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 14,
    color: Serene.onSurface,
    paddingVertical: 0,
  },
  rulesCard: {
    gap: 7,
    marginTop: 10,
    padding: 11,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  ruleText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  ruleTextMet: {
    color: Serene.success,
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.error,
    marginTop: 4,
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
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: Space.md,
    padding: 11,
    borderRadius: Radius.md,
    backgroundColor: Serene.warningContainer,
  },
  tipText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 16,
    color: Serene.warning,
  },
  successBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Space.gutter,
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.floating,
  },
  successTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 25,
    lineHeight: 32,
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
    maxWidth: 320,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: Space.lg,
    padding: 11,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
  },
  securityNoteText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
});
