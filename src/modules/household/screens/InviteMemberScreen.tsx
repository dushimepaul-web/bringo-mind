// S-18 - Inviter un membre | Module M08 Foyer partagé | Phase S7
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

type Role = 'Membre' | 'Admin';

const ROLE_OPTIONS: { key: Role; hint: string }[] = [
  { key: 'Membre', hint: 'Accès aux éléments partagés' },
  { key: 'Admin', hint: 'Peut gérer les membres et invitations' },
];

const SHARE_TARGETS = [
  { key: 'email', label: 'E-mail', icon: 'mail' },
  { key: 'sms', label: 'SMS', icon: 'sms' },
  { key: 'link', label: 'Copier le lien', icon: 'link' },
];

export default function InviteMemberScreen() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Membre');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const canSend = email.trim().includes('@');

  if (sent) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <Icon name="arrow_back" size={22} color={Serene.onSurface} />
          </Pressable>
          <Text style={styles.headerTitle}>Inviter un membre</Text>
          <View style={styles.headerButton} />
        </View>

        <View style={styles.sentWrap}>
          <View style={styles.sentIcon}>
            <Icon name="mark_email_read" size={34} color={Serene.success} />
          </View>
          <Text style={styles.sentTitle}>Invitation envoyée</Text>
          <Text style={styles.sentText}>
            Un e-mail a été envoyé à <Text style={styles.sentEmail}>{email}</Text> avec un lien
            valable 7 jours pour rejoindre le Foyer Martin.
          </Text>

          <View style={styles.sentSummary}>
            <View style={styles.sentSummaryRow}>
              <Icon name="badge" size={16} color={Serene.secondary} />
              <Text style={styles.sentSummaryText}>Rôle proposé : {role}</Text>
            </View>
            <View style={styles.sentSummaryRow}>
              <Icon name="schedule" size={16} color={Serene.secondary} />
              <Text style={styles.sentSummaryText}>Expire le 16 mai 2024</Text>
            </View>
          </View>

          <Pressable
            style={styles.primaryButton}
            accessibilityRole="button"
            onPress={() => router.replace('/household/members')}>
            <Icon name="group" size={18} color={Serene.onPrimary} />
            <Text style={styles.primaryButtonText}>Retour aux membres</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => {
              setSent(false);
              setEmail('');
            }}>
            <Text style={styles.secondaryButtonText}>Inviter une autre personne</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={() => router.back()}>
          <Icon name="arrow_back" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Inviter un membre</Text>
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
              <Icon name="person_add" size={28} color={Serene.secondary} />
            </View>
            <Text style={styles.heroTitle}>Agrandissez votre foyer</Text>
            <Text style={styles.heroText}>
              Envoyez une invitation sécurisée. Le membre invité ne verra que les éléments
              partagés du foyer.
            </Text>
          </View>

          <Field label="Adresse e-mail" required>
            <View style={styles.inputWithIcon}>
              <Icon name="alternate_email" size={18} color={Serene.onSurfaceVariant} />
              <TextInput
                style={styles.inlineInput}
                placeholder="email@exemple.fr"
                placeholderTextColor={Serene.onSurfaceVariant}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                selectionColor={Serene.secondary}
              />
            </View>
          </Field>

          <Field label="Rôle proposé">
            <View style={styles.roleList}>
              {ROLE_OPTIONS.map((option) => {
                const active = role === option.key;

                return (
                  <Pressable
                    key={option.key}
                    style={[styles.roleCard, active && styles.roleCardActive]}
                    onPress={() => setRole(option.key)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <View style={styles.roleBody}>
                      <Text style={styles.roleTitle}>{option.key}</Text>
                      <Text style={styles.roleHint}>{option.hint}</Text>
                    </View>
                    <View style={[styles.radio, active && styles.radioActive]}>
                      {active ? (
                        <Icon name="check" size={12} color={Serene.onPrimary} />
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="Message personnel (optionnel)">
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Ex. Rejoins notre foyer pour organiser la rentrée !"
              placeholderTextColor={Serene.onSurfaceVariant}
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
              selectionColor={Serene.secondary}
            />
          </Field>

          <View style={styles.linkRow}>
            <Icon name="link" size={16} color={Serene.secondary} />
            <Text style={styles.linkText}>
              Un lien d’invitation personnel valable 7 jours sera généré.
            </Text>
          </View>

          <Field label="Partager autrement">
            <View style={styles.shareRow}>
              {SHARE_TARGETS.map((target) => (
                <Pressable
                  key={target.key}
                  style={styles.shareButton}
                  onPress={() => setCopied(target.key === 'link')}
                  accessibilityRole="button">
                  <Icon
                    name={target.key === 'link' && copied ? 'check' : target.icon}
                    size={18}
                    color={Serene.onSurface}
                  />
                  <Text style={styles.shareText}>
                    {target.key === 'link' && copied ? 'Copié' : target.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Field>

          <View style={styles.privacyCard}>
            <Icon name="shield" size={16} color={Serene.onSurfaceVariant} />
            <Text style={styles.privacyText}>
              L’invitation expire après 7 jours. Vous pouvez l’annuler à tout moment depuis la
              liste des invitations.
            </Text>
          </View>

          <Pressable
            style={[styles.primaryButton, !canSend && styles.primaryButtonDisabled]}
            disabled={!canSend}
            accessibilityRole="button"
            onPress={() => setSent(true)}>
            <Icon name="send" size={18} color={Serene.onPrimary} />
            <Text style={styles.primaryButtonText}>Envoyer l’invitation</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>Annuler</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      {children}
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
    paddingTop: Space.md,
    paddingBottom: Space.lg,
    gap: Space.md,
  },
  hero: {
    alignItems: 'center',
    gap: 5,
    paddingVertical: Space.sm,
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
  },
  heroText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
  },
  required: {
    color: Serene.error,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  inlineInput: {
    flex: 1,
    height: 46,
    fontFamily: FontFamily.body,
    fontSize: 14,
    color: Serene.onSurface,
  },
  roleList: {
    gap: 8,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  roleCardActive: {
    borderColor: Serene.secondary,
    backgroundColor: Serene.secondaryContainer,
  },
  roleBody: {
    flex: 1,
  },
  roleTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  roleHint: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Serene.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderWidth: 0,
    backgroundColor: Serene.secondary,
  },
  textInput: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onSurface,
    ...Shadow.card,
  },
  textArea: {
    minHeight: 88,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  linkText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  shareRow: {
    flexDirection: 'row',
    gap: 8,
  },
  shareButton: {
    flex: 1,
    height: 54,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    ...Shadow.card,
  },
  shareText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  privacyText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
  primaryButton: {
    height: 48,
    marginTop: Space.sm,
    borderRadius: Radius.xl,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.floating,
  },
  primaryButtonDisabled: {
    backgroundColor: Serene.surfaceDim,
  },
  primaryButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
  secondaryButton: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  sentWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Space.gutter,
    paddingTop: Space.xl,
    gap: 8,
  },
  sentIcon: {
    width: 76,
    height: 76,
    borderRadius: Radius.full,
    backgroundColor: Serene.successContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  sentTitle: {
    ...Typography.headlineSm,
    color: Serene.onSurface,
  },
  sentText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
  },
  sentEmail: {
    fontFamily: FontFamily.bodySemiBold,
    color: Serene.onSurface,
  },
  sentSummary: {
    alignSelf: 'stretch',
    gap: 8,
    marginTop: Space.md,
    padding: 14,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  sentSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sentSummaryText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
});
