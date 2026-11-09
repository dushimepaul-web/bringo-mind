// S-15 - Création / édition d'événement | Module M07 Rendez-vous et calendrier | Phase S6
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

type EventType = 'rendez-vous' | 'personnel' | 'foyer';

const TYPES: { key: EventType; label: string; icon: string }[] = [
  { key: 'rendez-vous', label: 'Rendez-vous', icon: 'medical_services' },
  { key: 'personnel', label: 'Personnel', icon: 'person' },
  { key: 'foyer', label: 'Foyer', icon: 'family_restroom' },
];

const TIME_SLOTS = [
  { start: '09:30', end: '10:15' },
  { start: '14:00', end: '15:00' },
  { start: '16:45', end: '17:15' },
  { start: '18:30', end: '19:30' },
];

const REMINDER_OPTIONS = ['Aucun', '15 min', '30 min', '1 heure', '1 jour'];
const RECURRENCES = ['Ne se répète pas', 'Chaque semaine', 'Chaque mois'];

export default function EventFormScreen() {
  const pathname = usePathname();
  const isEdit = pathname.includes('/edit');

  const [type, setType] = useState<EventType>(isEdit ? 'rendez-vous' : 'rendez-vous');
  const [title, setTitle] = useState(isEdit ? 'Rendez-vous dentiste' : '');
  const [location, setLocation] = useState(
    isEdit ? 'Dr. Moreau • Cabinet Voltaire, Paris 11e' : '',
  );
  const [description, setDescription] = useState(
    isEdit ? 'Apporter la carte vitale et le dossier dentaire.' : '',
  );
  const [slotIndex, setSlotIndex] = useState(0);
  const [allDay, setAllDay] = useState(false);
  const [reminder, setReminder] = useState(isEdit ? '30 min' : 'Aucun');
  const [recurrence, setRecurrence] = useState(RECURRENCES[0]);
  const [shared, setShared] = useState(isEdit);
  const [shareThomas, setShareThomas] = useState(isEdit);

  const slot = TIME_SLOTS[slotIndex];
  const hasConflict = slot.start === '14:00';

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    router.replace('/calendar');
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
          {isEdit ? 'Modifier l’événement' : 'Nouvel événement'}
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
          <View style={styles.typeRow}>
            {TYPES.map((option) => {
              const active = type === option.key;

              return (
                <Pressable
                  key={option.key}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                  onPress={() => setType(option.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}>
                  <Icon
                    name={option.icon}
                    size={16}
                    color={active ? Serene.onPrimary : Serene.onSurfaceVariant}
                  />
                  <Text style={[styles.typeText, active && styles.typeTextActive]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Field label="Titre" required>
            <TextInput
              style={styles.textInput}
              placeholder="Ex. Rendez-vous dentiste"
              placeholderTextColor={Serene.onSurfaceVariant}
              value={title}
              onChangeText={setTitle}
              selectionColor={Serene.secondary}
            />
          </Field>

          <Field label="Date">
            <Pressable style={styles.selectRow} accessibilityRole="button">
              <View style={styles.selectLeft}>
                <View style={styles.selectIcon}>
                  <Icon name="event" size={18} color={Serene.secondary} />
                </View>
                <View>
                  <Text style={styles.selectValue}>Jeudi 9 mai 2024</Text>
                  <Text style={styles.selectHint}>Europe/Paris (UTC+2)</Text>
                </View>
              </View>
              <Icon name="chevron_right" size={20} color={Serene.outlineVariant} />
            </Pressable>
          </Field>

          <Field label="Horaire">
            <View style={styles.timeRow}>
              <View style={styles.timeBox}>
                <Text style={styles.timeBoxLabel}>Début</Text>
                <Text style={styles.timeBoxValue}>{allDay ? '—' : slot.start}</Text>
              </View>
              <Icon name="arrow_forward" size={18} color={Serene.outlineVariant} />
              <View style={styles.timeBox}>
                <Text style={styles.timeBoxLabel}>Fin</Text>
                <Text style={styles.timeBoxValue}>{allDay ? '—' : slot.end}</Text>
              </View>
            </View>

            <View style={styles.timeChipsRow}>
              {TIME_SLOTS.map((option, index) => {
                const active = index === slotIndex && !allDay;

                return (
                  <Pressable
                    key={option.start}
                    style={[styles.timeChip, active && styles.timeChipActive]}
                    onPress={() => {
                      setSlotIndex(index);
                      setAllDay(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <Text style={[styles.timeChipText, active && styles.timeChipTextActive]}>
                      {option.start}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.toggleCard}>
              <View style={styles.toggleLeft}>
                <View style={styles.toggleIcon}>
                  <Icon name="wb_sunny" size={18} color={Serene.secondary} />
                </View>
                <Text style={styles.toggleTitle}>Toute la journée</Text>
              </View>
              <Switch
                value={allDay}
                onValueChange={setAllDay}
                trackColor={{ false: Serene.surfaceContainerHigh, true: Serene.secondary }}
                thumbColor={Serene.surfaceContainerLowest}
              />
            </View>

            {!allDay ? (
              <View style={hasConflict ? styles.conflictBanner : styles.freeBanner}>
                <Icon
                  name={hasConflict ? 'warning' : 'verified'}
                  size={18}
                  color={hasConflict ? Serene.error : Serene.success}
                />
                <Text style={hasConflict ? styles.conflictText : styles.freeText}>
                  {hasConflict
                    ? 'Conflit détecté avec « Réunion projet Bringo Mind » (14:00 – 15:00). Choisissez un autre horaire ou acceptez le chevauchement.'
                    : 'Aucun conflit détecté sur ce créneau.'}
                </Text>
              </View>
            ) : null}
          </Field>

          <Field label="Lieu">
            <View style={styles.inputWithIcon}>
              <Icon name="location_on" size={18} color={Serene.onSurfaceVariant} />
              <TextInput
                style={styles.inlineInput}
                placeholder="Adresse ou visioconférence"
                placeholderTextColor={Serene.onSurfaceVariant}
                value={location}
                onChangeText={setLocation}
                selectionColor={Serene.secondary}
              />
            </View>
          </Field>

          <Field label="Description">
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Notes, participants, documents à apporter..."
              placeholderTextColor={Serene.onSurfaceVariant}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              selectionColor={Serene.secondary}
            />
          </Field>

          <Field label="Rappel">
            <View style={styles.chipsWrap}>
              {REMINDER_OPTIONS.map((option) => {
                const active = reminder === option;

                return (
                  <Pressable
                    key={option}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setReminder(option)}
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

          <Field label="Récurrence">
            <View style={styles.chipsWrap}>
              {RECURRENCES.map((option) => {
                const active = recurrence === option;

                return (
                  <Pressable
                    key={option}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setRecurrence(option)}
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

          <View style={styles.toggleCard}>
            <View style={styles.toggleLeft}>
              <View style={styles.toggleIcon}>
                <Icon name="family_restroom" size={18} color={Serene.secondary} />
              </View>
              <View style={styles.toggleTextBlock}>
                <Text style={styles.toggleTitle}>Partager avec le foyer</Text>
                <Text style={styles.toggleHint}>Visible par les membres autorisés</Text>
              </View>
            </View>
            <Switch
              value={shared}
              onValueChange={setShared}
              trackColor={{ false: Serene.surfaceContainerHigh, true: Serene.secondary }}
              thumbColor={Serene.surfaceContainerLowest}
            />
          </View>

          {shared ? (
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
          ) : null}

          <Pressable
            style={[
              styles.submitButton,
              (!canSave || hasConflict) && styles.submitButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!canSave || hasConflict}
            accessibilityRole="button">
            <Icon
              name={isEdit ? 'save' : 'event_available'}
              size={18}
              color={Serene.onPrimary}
            />
            <Text style={styles.submitButtonText}>
              {isEdit ? 'Enregistrer les modifications' : 'Créer l’événement'}
            </Text>
          </Pressable>

          {hasConflict ? (
            <Text style={styles.conflictHelp}>
              Résolvez le conflit horaire pour enregistrer l’événement.
            </Text>
          ) : null}

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
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    ...Shadow.card,
  },
  typeChipActive: {
    backgroundColor: Serene.primary,
  },
  typeText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  typeTextActive: {
    color: Serene.onPrimary,
    fontFamily: FontFamily.bodySemiBold,
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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  timeBoxLabel: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  timeBoxValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    lineHeight: 26,
    color: Serene.onSurface,
  },
  timeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLow,
  },
  timeChipActive: {
    backgroundColor: Serene.surfaceContainerHigh,
  },
  timeChipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  timeChipTextActive: {
    fontFamily: FontFamily.bodySemiBold,
    color: Serene.onSurface,
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
  conflictBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.errorContainer,
  },
  conflictText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onErrorContainer,
  },
  freeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: Radius.lg,
    backgroundColor: Serene.successContainer,
  },
  freeText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.success,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  inlineInput: {
    flex: 1,
    height: 44,
    fontFamily: FontFamily.body,
    fontSize: 14,
    color: Serene.onSurface,
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
  conflictHelp: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
    textAlign: 'center',
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
