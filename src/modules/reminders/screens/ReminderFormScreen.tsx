// S-12 - Création / édition de rappel | Module M05 Rappels | Phase S5
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

type Repeat = 'une-fois' | 'quotidien' | 'hebdomadaire' | 'personnalise';
type LinkedTo = 'none' | 'task' | 'event';

const REPEATS: { key: Repeat; label: string }[] = [
  { key: 'une-fois', label: 'Une fois' },
  { key: 'quotidien', label: 'Quotidien' },
  { key: 'hebdomadaire', label: 'Hebdomadaire' },
  { key: 'personnalise', label: 'Personnalisé' },
];

const QUICK_PRESETS = [
  { key: 'soir', label: 'Ce soir 18h', time: '18:00' },
  { key: 'demain', label: 'Demain 8h', time: '08:00' },
  { key: 'une-heure', label: 'Dans 1h', time: '14:30' },
];

export default function ReminderFormScreen() {
  const pathname = usePathname();
  const isEdit = pathname.includes('/edit');

  const [title, setTitle] = useState(isEdit ? 'Appeler le médecin' : '');
  const [note, setNote] = useState(
    isEdit ? 'Demander le renouvellement de l’ordonnance.' : '',
  );
  const [time, setTime] = useState(isEdit ? '08:00' : '09:00');
  const [repeat, setRepeat] = useState<Repeat>(isEdit ? 'quotidien' : 'une-fois');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [linkedTo, setLinkedTo] = useState<LinkedTo>(isEdit ? 'none' : 'none');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    router.replace('/reminders');
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
          {isEdit ? 'Modifier le rappel' : 'Nouveau rappel'}
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
          <Field label="Objet du rappel" required>
            <TextInput
              style={styles.textInput}
              placeholder="Ex. Appeler le médecin"
              placeholderTextColor={Serene.onSurfaceVariant}
              value={title}
              onChangeText={setTitle}
              selectionColor={Serene.secondary}
            />
          </Field>

          <Field label="Quand">
            <View style={styles.whenCard}>
              <View style={styles.whenRow}>
                <View style={styles.whenIcon}>
                  <Icon name="event" size={18} color={Serene.secondary} />
                </View>
                <View style={styles.whenBody}>
                  <Text style={styles.whenLabel}>Date</Text>
                  <Text style={styles.whenValue}>Aujourd’hui • Jeudi 9 mai</Text>
                </View>
                <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
              </View>
              <View style={styles.divider} />
              <View style={styles.whenRow}>
                <View style={styles.whenIcon}>
                  <Icon name="schedule" size={18} color={Serene.secondary} />
                </View>
                <View style={styles.whenBody}>
                  <Text style={styles.whenLabel}>Heure</Text>
                  <Text style={styles.whenValue}>{time}</Text>
                </View>
                <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
              </View>
            </View>

            <View style={styles.presetsRow}>
              {QUICK_PRESETS.map((preset) => {
                const active = selectedPreset === preset.key;

                return (
                  <Pressable
                    key={preset.key}
                    style={[styles.presetChip, active && styles.presetChipActive]}
                    onPress={() => {
                      setSelectedPreset(preset.key);
                      setTime(preset.time);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <Text
                      style={[styles.presetText, active && styles.presetTextActive]}>
                      {preset.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="Répétition">
            <View style={styles.chipsWrap}>
              {REPEATS.map((option) => {
                const active = repeat === option.key;

                return (
                  <Pressable
                    key={option.key}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setRepeat(option.key)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="Canaux de notification">
            <View style={styles.toggleCard}>
              <View style={styles.toggleLeft}>
                <View style={styles.toggleIcon}>
                  <Icon name="notifications" size={18} color={Serene.secondary} />
                </View>
                <View style={styles.toggleTextBlock}>
                  <Text style={styles.toggleTitle}>Notification push</Text>
                  <Text style={styles.toggleHint}>Sur tous vos appareils</Text>
                </View>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: Serene.surfaceContainerHigh, true: Serene.secondary }}
                thumbColor={Serene.surfaceContainerLowest}
              />
            </View>
            <View style={styles.toggleCard}>
              <View style={styles.toggleLeft}>
                <View style={styles.toggleIcon}>
                  <Icon name="mail" size={18} color={Serene.secondary} />
                </View>
                <View style={styles.toggleTextBlock}>
                  <Text style={styles.toggleTitle}>E-mail</Text>
                  <Text style={styles.toggleHint}>claire.martin@email.fr</Text>
                </View>
              </View>
              <Switch
                value={emailEnabled}
                onValueChange={setEmailEnabled}
                trackColor={{ false: Serene.surfaceContainerHigh, true: Serene.secondary }}
                thumbColor={Serene.surfaceContainerLowest}
              />
            </View>
          </Field>

          <Field label="Associer à">
            <LinkedRow
              icon="task_alt"
              label="Renvoyer attestation de domicile"
              hint="Tâche • Aujourd’hui 17h"
              active={linkedTo === 'task'}
              onPress={() => setLinkedTo(linkedTo === 'task' ? 'none' : 'task')}
            />
            <LinkedRow
              icon="medical_services"
              label="Rendez-vous dentiste"
              hint="Événement • Ven. 09:30"
              active={linkedTo === 'event'}
              onPress={() => setLinkedTo(linkedTo === 'event' ? 'none' : 'event')}
            />
          </Field>

          <Field label="Note">
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Ajoutez un détail utile..."
              placeholderTextColor={Serene.onSurfaceVariant}
              value={note}
              onChangeText={setNote}
              multiline
              textAlignVertical="top"
              selectionColor={Serene.secondary}
            />
          </Field>

          <View style={styles.helpCard}>
            <Icon name="shield" size={16} color={Serene.onSurfaceVariant} />
            <Text style={styles.helpText}>
              Les heures de silence (22h00 – 07h00) s’appliquent. Les rappels critiques
              peuvent être prioritaires selon vos réglages.
            </Text>
          </View>

          <Pressable
            style={[styles.submitButton, !canSave && styles.submitButtonDisabled]}
            onPress={handleSave}
            disabled={!canSave}
            accessibilityRole="button">
            <Icon
              name={isEdit ? 'save' : 'add_alert'}
              size={18}
              color={Serene.onPrimary}
            />
            <Text style={styles.submitButtonText}>
              {isEdit ? 'Enregistrer les modifications' : 'Créer le rappel'}
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

function LinkedRow({
  icon,
  label,
  hint,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  hint: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.linkedRow, active && styles.linkedRowActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}>
      <View style={styles.linkedIcon}>
        <Icon name={icon} size={18} color={active ? Serene.secondary : Serene.onSurfaceVariant} />
      </View>
      <View style={styles.linkedBody}>
        <Text style={styles.linkedLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.linkedHint}>{hint}</Text>
      </View>
      <View style={[styles.radio, active && styles.radioActive]}>
        {active ? <Icon name="check" size={12} color={Serene.onPrimary} /> : null}
      </View>
    </Pressable>
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
    minHeight: 88,
  },
  whenCard: {
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    paddingHorizontal: 12,
    ...Shadow.card,
  },
  whenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  whenIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whenBody: {
    flex: 1,
    minWidth: 0,
  },
  whenLabel: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  whenValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  presetChipActive: {
    backgroundColor: Serene.secondaryContainer,
  },
  presetText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  presetTextActive: {
    color: Serene.onSecondaryContainer,
    fontFamily: FontFamily.bodySemiBold,
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
    marginBottom: 8,
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
  linkedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    marginBottom: 8,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  linkedRowActive: {
    borderColor: Serene.secondary,
    backgroundColor: Serene.secondaryContainer,
  },
  linkedIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkedBody: {
    flex: 1,
    minWidth: 0,
  },
  linkedLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  linkedHint: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
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
