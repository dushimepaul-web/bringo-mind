// S-20 (identité) - Informations personnelles | Module M09 Profil et paramètres | Phase S8
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

export default function CompleteProfileScreen() {
  const [firstName, setFirstName] = useState('Claire');
  const [lastName, setLastName] = useState('Martin');
  const [email] = useState('claire.martin@email.fr');
  const [phone, setPhone] = useState('+33 6 12 34 56 78');
  const [birthdate, setBirthdate] = useState('14/03/1988');
  const [address, setAddress] = useState('12 rue de la République');
  const [city, setCity] = useState('75011 Paris');

  const canSave = firstName.trim().length > 0 && lastName.trim().length > 0;

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
        <Text style={styles.headerTitle}>Informations personnelles</Text>
        <Pressable
          style={styles.saveButton}
          onPress={() => router.back()}
          disabled={!canSave}>
          <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
            Enregistrer
          </Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.avatarBlock}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>
                {`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()}
              </Text>
            </View>
            <Pressable style={styles.changePhoto} accessibilityRole="button">
              <Icon name="photo_camera" size={15} color={Serene.secondary} />
              <Text style={styles.changePhotoText}>Changer la photo</Text>
            </Pressable>
          </View>

          <View style={styles.rowFields}>
            <Field label="Prénom" required style={styles.halfField}>
              <TextInput
                style={styles.textInput}
                value={firstName}
                onChangeText={setFirstName}
                selectionColor={Serene.secondary}
              />
            </Field>
            <Field label="Nom" required style={styles.halfField}>
              <TextInput
                style={styles.textInput}
                value={lastName}
                onChangeText={setLastName}
                selectionColor={Serene.secondary}
              />
            </Field>
          </View>

          <Field label="Adresse e-mail">
            <View style={[styles.textInput, styles.readonlyInput]}>
              <Text style={styles.readonlyText} numberOfLines={1}>
                {email}
              </Text>
              <View style={styles.verifiedPill}>
                <Icon name="verified" size={11} color={Serene.success} />
                <Text style={styles.verifiedText}>Vérifiée</Text>
              </View>
            </View>
            <Text style={styles.helperText}>
              Pour changer d’adresse, contactez le support depuis les paramètres de sécurité.
            </Text>
          </Field>

          <Field label="Téléphone">
            <View style={styles.inputWithIcon}>
              <Icon name="call" size={18} color={Serene.onSurfaceVariant} />
              <TextInput
                style={styles.inlineInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                selectionColor={Serene.secondary}
              />
            </View>
          </Field>

          <Field label="Date de naissance">
            <View style={styles.inputWithIcon}>
              <Icon name="cake" size={18} color={Serene.onSurfaceVariant} />
              <TextInput
                style={styles.inlineInput}
                value={birthdate}
                onChangeText={setBirthdate}
                placeholder="JJ/MM/AAAA"
                placeholderTextColor={Serene.onSurfaceVariant}
                selectionColor={Serene.secondary}
              />
            </View>
          </Field>

          <Field label="Adresse postale">
            <View style={styles.inputWithIcon}>
              <Icon name="home" size={18} color={Serene.onSurfaceVariant} />
              <TextInput
                style={styles.inlineInput}
                value={address}
                onChangeText={setAddress}
                selectionColor={Serene.secondary}
              />
            </View>
          </Field>

          <Field label="Ville et code postal">
            <View style={styles.inputWithIcon}>
              <Icon name="location_city" size={18} color={Serene.onSurfaceVariant} />
              <TextInput
                style={styles.inlineInput}
                value={city}
                onChangeText={setCity}
                selectionColor={Serene.secondary}
              />
            </View>
          </Field>

          <View style={styles.infoCard}>
            <Icon name="lock" size={16} color={Serene.onSurfaceVariant} />
            <Text style={styles.infoText}>
              Ces informations restent privées et ne sont jamais partagées avec les membres du
              foyer.
            </Text>
          </View>

          <Pressable
            style={[styles.submitButton, !canSave && styles.submitButtonDisabled]}
            onPress={() => router.back()}
            disabled={!canSave}
            accessibilityRole="button">
            <Icon name="save" size={18} color={Serene.onPrimary} />
            <Text style={styles.submitButtonText}>Enregistrer les modifications</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  required,
  style,
  children,
}: {
  label: string;
  required?: boolean;
  style?: object;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.field, style]}>
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
  saveButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  saveButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.secondary,
  },
  saveButtonTextDisabled: {
    color: Serene.outlineVariant,
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
  avatarBlock: {
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: FontFamily.headingBold,
    fontSize: 26,
    lineHeight: 32,
    color: Serene.onPrimary,
  },
  changePhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  changePhotoText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.secondary,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 10,
  },
  halfField: {
    flex: 1,
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
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    fontFamily: FontFamily.body,
    fontSize: 14,
    color: Serene.onSurface,
    ...Shadow.card,
  },
  readonlyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readonlyText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 14,
    color: Serene.onSurfaceVariant,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.successContainer,
  },
  verifiedText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.success,
  },
  helperText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  infoText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
  submitButton: {
    height: 48,
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
});
