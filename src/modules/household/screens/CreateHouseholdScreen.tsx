// S-17 - Création d'un foyer | Module M08 Foyer partagé | Phase S7
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

const CURRENCIES = ['EUR • €', 'CHF • Fr.', 'CAD • $'];
const TIMEZONES = ['Europe/Paris', 'Europe/Zurich', 'America/Montreal'];

export default function CreateHouseholdScreen() {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [timezone, setTimezone] = useState(TIMEZONES[0]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [pendingInvites, setPendingInvites] = useState<string[]>([]);

  const canCreate = name.trim().length >= 2;

  const addInvite = () => {
    const email = inviteEmail.trim();
    if (!email.includes('@')) return;
    setPendingInvites((current) => [...current, email]);
    setInviteEmail('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          onPress={() => router.back()}>
          <Icon name="close" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Créer un foyer</Text>
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
              <Icon name="family_restroom" size={30} color={Serene.secondary} />
            </View>
            <Text style={styles.heroTitle}>Un espace pour votre foyer</Text>
            <Text style={styles.heroText}>
              Coordonnez vos tâches, rendez-vous et documents partagés sans jamais exposer vos
              données personnelles.
            </Text>
          </View>

          <Field label="Nom du foyer" required>
            <TextInput
              style={styles.textInput}
              placeholder="Ex. Foyer Martin"
              placeholderTextColor={Serene.onSurfaceVariant}
              value={name}
              onChangeText={setName}
              selectionColor={Serene.secondary}
            />
          </Field>

          <Field label="Devise">
            <View style={styles.chipsWrap}>
              {CURRENCIES.map((option) => {
                const active = currency === option;

                return (
                  <Pressable
                    key={option}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setCurrency(option)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="Fuseau horaire">
            <View style={styles.selectCard}>
              {TIMEZONES.map((option, index) => {
                const active = timezone === option;

                return (
                  <View key={option}>
                    {index > 0 ? <View style={styles.divider} /> : null}
                    <Pressable
                      style={styles.radioRow}
                      onPress={() => setTimezone(option)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}>
                      <Text
                        style={[
                          styles.radioLabel,
                          active && styles.radioLabelActive,
                        ]}>
                        {option}
                      </Text>
                      <View style={[styles.radio, active && styles.radioActive]}>
                        {active ? <Icon name="check" size={12} color={Serene.onPrimary} /> : null}
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </Field>

          <Field label="Inviter des membres (optionnel)">
            <View style={styles.inviteRow}>
              <View style={styles.inviteInputWrap}>
                <Icon name="alternate_email" size={18} color={Serene.onSurfaceVariant} />
                <TextInput
                  style={styles.inviteInput}
                  placeholder="email@exemple.fr"
                  placeholderTextColor={Serene.onSurfaceVariant}
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onSubmitEditing={addInvite}
                  selectionColor={Serene.secondary}
                />
              </View>
              <Pressable
                style={styles.inviteButton}
                onPress={addInvite}
                accessibilityRole="button"
                accessibilityLabel="Ajouter l'invitation">
                <Icon name="add" size={20} color={Serene.onPrimary} />
              </Pressable>
            </View>

            {pendingInvites.length > 0 ? (
              <View style={styles.pendingList}>
                {pendingInvites.map((email) => (
                  <View key={email} style={styles.pendingChip}>
                    <Icon name="mail" size={14} color={Serene.secondary} />
                    <Text style={styles.pendingText} numberOfLines={1}>
                      {email}
                    </Text>
                    <Pressable
                      onPress={() =>
                        setPendingInvites((current) =>
                          current.filter((item) => item !== email),
                        )
                      }
                      hitSlop={6}
                      accessibilityLabel="Retirer l'invitation">
                      <Icon name="close" size={14} color={Serene.onSurfaceVariant} />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </Field>

          <View style={styles.privacyCard}>
            <Icon name="lock" size={18} color={Serene.secondary} />
            <View style={styles.privacyBody}>
              <Text style={styles.privacyTitle}>Vos données restent privées</Text>
              <Text style={styles.privacyText}>
                Vous choisissez ce qui est partagé. Les notes personnelles et documents privés
                ne sont jamais visibles par les autres membres.
              </Text>
            </View>
          </View>

          <Pressable
            style={[styles.submitButton, !canCreate && styles.submitButtonDisabled]}
            onPress={() => router.replace('/household')}
            disabled={!canCreate}
            accessibilityRole="button">
            <Icon name="group_add" size={18} color={Serene.onPrimary} />
            <Text style={styles.submitButtonText}>Créer le foyer</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Plus tard</Text>
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
    gap: 6,
    paddingVertical: Space.sm,
  },
  heroIcon: {
    width: 64,
    height: 64,
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
  textInput: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    fontFamily: FontFamily.body,
    fontSize: 15,
    color: Serene.onSurface,
    ...Shadow.card,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  chipActive: {
    backgroundColor: Serene.primary,
  },
  chipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  chipTextActive: {
    color: Serene.onPrimary,
  },
  selectCard: {
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    paddingHorizontal: 12,
    ...Shadow.card,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 12,
  },
  radioLabel: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurfaceVariant,
  },
  radioLabelActive: {
    fontFamily: FontFamily.bodySemiBold,
    color: Serene.onSurface,
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
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  inviteRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inviteInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 46,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  inviteInput: {
    flex: 1,
    height: 46,
    fontFamily: FontFamily.body,
    fontSize: 14,
    color: Serene.onSurface,
  },
  inviteButton: {
    width: 46,
    height: 46,
    borderRadius: Radius.lg,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  pendingList: {
    gap: 6,
    marginTop: 2,
  },
  pendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
  },
  pendingText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.secondaryContainer,
  },
  privacyBody: {
    flex: 1,
  },
  privacyTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSecondaryContainer,
  },
  privacyText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSecondaryContainer,
    marginTop: 1,
  },
  submitButton: {
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
  submitButtonDisabled: {
    backgroundColor: Serene.surfaceDim,
  },
  submitButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
  cancelButton: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
});
