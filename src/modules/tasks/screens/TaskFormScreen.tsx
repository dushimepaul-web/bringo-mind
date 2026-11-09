// S-10 - Création / édition de tâche | Module M04 Tâches | Phase S4
import { router, usePathname } from 'expo-router';
import { useState } from 'react';
import {
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
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

type Priority = 'Basse' | 'Moyenne' | 'Haute';

const CATEGORIES = ['Logement', 'Santé', 'Impôts', 'Famille', 'Véhicule', 'Autre'];
const PRIORITIES: Priority[] = ['Basse', 'Moyenne', 'Haute'];

export default function TaskFormScreen() {
  const pathname = usePathname();
  const isEdit = pathname.includes('/edit');

  const [title, setTitle] = useState(
    isEdit ? 'Renvoyer attestation de domicile signée' : '',
  );
  const [description, setDescription] = useState(
    isEdit
      ? "Renvoyer l'attestation de domicile signée au bailleur avant 17h. Le document est déjà scanné et signé électroniquement."
      : '',
  );
  const [priority, setPriority] = useState<Priority>(isEdit ? 'Haute' : 'Moyenne');
  const [category, setCategory] = useState(isEdit ? 'Logement' : 'Logement');
  const [reminder, setReminder] = useState(isEdit);
  const [shareThomas, setShareThomas] = useState(isEdit);

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    router.replace('/tasks');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          accessibilityRole="button"
          accessibilityLabel="Annuler"
          onPress={() => router.back()}>
          <Icon name="close" size={22} color={Serene.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isEdit ? 'Modifier la tâche' : 'Nouvelle tâche'}
        </Text>
        <Pressable
          style={styles.saveButton}
          accessibilityRole="button"
          onPress={handleSave}
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
          <Field label="Titre" required>
            <TextInput
              style={styles.textInput}
              placeholder="Ex. Renvoyer l'attestation de domicile"
              placeholderTextColor={Serene.onSurfaceVariant}
              value={title}
              onChangeText={setTitle}
              returnKeyType="next"
              selectionColor={Serene.secondary}
            />
          </Field>

          <Field label="Description">
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Ajoutez les détails utiles..."
              placeholderTextColor={Serene.onSurfaceVariant}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              selectionColor={Serene.secondary}
            />
          </Field>

          <Field label="Priorité">
            <View style={styles.priorityRow}>
              {PRIORITIES.map((value) => {
                const active = priority === value;

                return (
                  <Pressable
                    key={value}
                    style={[
                      styles.priorityOption,
                      active && priorityActiveStyle(value),
                    ]}
                    onPress={() => setPriority(value)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <Text
                      style={[
                        styles.priorityOptionText,
                        active && priorityActiveTextStyle(value),
                      ]}>
                      {value}
                    </Text>
                    {value === 'Haute' ? (
                      <View style={[styles.priorityDot, active && styles.priorityDotActive]} />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="Échéance">
            <Pressable
              style={styles.selectRow}
              accessibilityRole="button"
              onPress={() => router.push('/calendar/add')}>
              <View style={styles.selectLeft}>
                <View style={styles.selectIcon}>
                  <Icon name="event" size={18} color={Serene.secondary} />
                </View>
                <View>
                  <Text style={styles.selectValue}>Aujourd&apos;hui • 17h00</Text>
                  <Text style={styles.selectHint}>Date et heure d&apos;échéance</Text>
                </View>
              </View>
              <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
            </Pressable>
          </Field>

          <Field label="Catégorie">
            <View style={styles.chipsWrap}>
              {CATEGORIES.map((value) => {
                const active = category === value;

                return (
                  <Pressable
                    key={value}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setCategory(value)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {value}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="Foyer">
            <Pressable
              style={styles.selectRow}
              accessibilityRole="button"
              onPress={() => router.push('/household')}>
              <View style={styles.selectLeft}>
                <View style={styles.selectIcon}>
                  <Icon name="family_restroom" size={18} color={Serene.secondary} />
                </View>
                <View>
                  <Text style={styles.selectValue}>Foyer Martin</Text>
                  <Text style={styles.selectHint}>Partagée avec 2 membres</Text>
                </View>
              </View>
              <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
            </Pressable>
          </Field>

          <View style={styles.toggleCard}>
            <View style={styles.toggleLeft}>
              <View style={styles.toggleIcon}>
                <Icon name="notifications_active" size={18} color={Serene.secondary} />
              </View>
              <View style={styles.toggleTextBlock}>
                <Text style={styles.toggleTitle}>Rappel automatique</Text>
                <Text style={styles.toggleHint}>Notifier 1h avant l&apos;échéance</Text>
              </View>
            </View>
            <Switch
              value={reminder}
              onValueChange={setReminder}
              trackColor={{ false: Serene.surfaceContainerHigh, true: Serene.secondary }}
              thumbColor={Serene.surfaceContainerLowest}
            />
          </View>

          <Field label="Partager avec">
            <View style={styles.chipsWrap}>
              <View style={[styles.memberChip, styles.memberChipFixed]}>
                <View style={[styles.memberAvatar, styles.memberAvatarPrimary]}>
                  <Text style={styles.memberInitial}>C</Text>
                </View>
                <Text style={styles.memberName}>Claire (vous)</Text>
              </View>
              <Pressable
                style={[styles.memberChip, shareThomas && styles.memberChipActive]}
                onPress={() => setShareThomas((value) => !value)}
                accessibilityRole="button"
                accessibilityState={{ selected: shareThomas }}>
                <View style={[styles.memberAvatar, styles.memberAvatarSecondary]}>
                  <Text style={styles.memberInitial}>T</Text>
                </View>
                <Text style={styles.memberName}>Thomas</Text>
                {shareThomas ? (
                  <Icon name="check_circle" size={16} color={Serene.secondary} />
                ) : (
                  <Icon name="add_circle" size={16} color={Serene.onSurfaceVariant} />
                )}
              </Pressable>
            </View>
          </Field>

          <View style={styles.helpCard}>
            <Icon name="info" size={16} color={Serene.onSurfaceVariant} />
            <Text style={styles.helpText}>
              Une tâche partagée est visible uniquement par les membres du foyer autorisés.
            </Text>
          </View>

          <Pressable
            style={[styles.submitButton, !canSave && styles.submitButtonDisabled]}
            onPress={handleSave}
            disabled={!canSave}
            accessibilityRole="button">
            <Icon
              name={isEdit ? 'save' : 'add_task'}
              size={18}
              color={Serene.onPrimary}
            />
            <Text style={styles.submitButtonText}>
              {isEdit ? 'Enregistrer les modifications' : 'Créer la tâche'}
            </Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
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

function priorityActiveStyle(priority: Priority) {
  if (priority === 'Haute') return styles.priorityHighActive;
  if (priority === 'Moyenne') return styles.priorityMediumActive;
  return styles.priorityLowActive;
}

function priorityActiveTextStyle(priority: Priority) {
  if (priority === 'Haute') return styles.priorityHighTextActive;
  if (priority === 'Moyenne') return styles.priorityMediumTextActive;
  return styles.priorityLowTextActive;
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
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    ...Typography.titleMd,
    color: Serene.onSurface,
    marginLeft: 4,
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
    minHeight: 96,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    ...Shadow.card,
  },
  priorityHighActive: {
    backgroundColor: Serene.errorContainer,
  },
  priorityMediumActive: {
    backgroundColor: Serene.secondaryContainer,
  },
  priorityLowActive: {
    backgroundColor: Serene.surfaceContainerHigh,
  },
  priorityOptionText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  priorityHighTextActive: {
    color: Serene.onErrorContainer,
    fontFamily: FontFamily.bodySemiBold,
  },
  priorityMediumTextActive: {
    color: Serene.onSecondaryContainer,
    fontFamily: FontFamily.bodySemiBold,
  },
  priorityLowTextActive: {
    color: Serene.onSurface,
    fontFamily: FontFamily.bodySemiBold,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.outlineVariant,
  },
  priorityDotActive: {
    backgroundColor: Serene.error,
  },
  selectRow: {
    minHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    ...Shadow.card,
  },
  selectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  selectIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  selectHint: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
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
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  toggleTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  toggleHint: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  memberChipFixed: {
    backgroundColor: Serene.surfaceContainerLow,
  },
  memberChipActive: {
    backgroundColor: Serene.secondaryContainer,
  },
  memberAvatar: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarPrimary: {
    backgroundColor: Serene.primary,
  },
  memberAvatarSecondary: {
    backgroundColor: Serene.secondary,
  },
  memberInitial: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    lineHeight: 12,
    color: Serene.onPrimary,
  },
  memberName: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
  },
  helpText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
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
