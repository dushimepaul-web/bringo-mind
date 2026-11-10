// Mobile - Informations personnelles | Module M09 Profil | Phase S8
// Champs préremplis (démo), un seul « Enregistrer », date de naissance au calendrier, retour visible sur le Profil.
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, PrimaryButton, SecondaryButton, SheetOption, Tag, TopBar, UndoToast, kitStyles } from '@/components/ui/kit';
import { DatePickerSheet } from '@/components/ui/date-picker';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';
import { DEMO_TODAY } from '@/lib/demo-dates';

import { USER } from '../data';
import { initialsOf, profileActions, useProfileState, type PersonalInfo } from '../store';

type FieldKey = 'firstName' | 'lastName' | 'phone' | 'address' | 'city';

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const longDate = (date: Date) => `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

export default function CompleteProfileScreen() {
  const saved = useProfileState().user;
  const [draft, setDraft] = useState<PersonalInfo>(saved);
  const [focus, setFocus] = useState<FieldKey | null>(null);
  const [sheet, setSheet] = useState<'photo' | 'email' | 'birthdate' | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const set = <K extends keyof PersonalInfo>(key: K, value: PersonalInfo[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const firstError = draft.firstName.trim().length === 0;
  const lastError = draft.lastName.trim().length === 0;
  const dirty = (Object.keys(draft) as (keyof PersonalInfo)[]).some((key) =>
    draft[key] instanceof Date ? (draft[key] as Date).getTime() !== (saved[key] as Date).getTime() : draft[key] !== saved[key],
  );
  const canSave = dirty && !firstError && !lastError;

  const input = (key: FieldKey, label: string, options: { error?: string; keyboard?: 'phone-pad' | 'default'; capitalize?: 'words' | 'none' } = {}) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[kitStyles.input, focus === key && kitStyles.inputFocused, options.error ? kitStyles.inputError : null]}
        value={draft[key]}
        onChangeText={(value) => set(key, value)}
        onFocus={() => setFocus(key)}
        onBlur={() => setFocus(null)}
        keyboardType={options.keyboard ?? 'default'}
        autoCapitalize={options.capitalize ?? 'sentences'}
        selectionColor={Tint.primary}
        accessibilityLabel={label}
      />
      {options.error ? (
        <View style={styles.errorRow}>
          <Icon name="error" size={16} color={Serene.error} />
          <Text style={styles.errorText}>{options.error}</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top', 'bottom']}>
      <TopBar title="Informations personnelles" close fallback="/profile" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Photo */}
          <View style={styles.photoZone}>
            <View style={styles.avatar}>
              {draft.hasPhoto ? (
                <Icon name="face" size={52} color={Serene.onPrimary} />
              ) : (
                <Text style={styles.avatarText}>{initialsOf(draft)}</Text>
              )}
            </View>
            <Pressable
              style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}
              accessibilityRole="button"
              onPress={() => setSheet('photo')}>
              <Icon name="photo_camera" size={18} color={Tint.primary} />
              <Text style={styles.photoText}>{draft.hasPhoto ? 'Changer la photo' : 'Ajouter une photo'}</Text>
            </Pressable>
          </View>

          <View style={styles.row}>
            <View style={styles.flex}>{input('firstName', 'Prénom', { error: firstError ? 'Le prénom est obligatoire.' : undefined, capitalize: 'words' })}</View>
            <View style={styles.flex}>{input('lastName', 'Nom', { error: lastError ? 'Le nom est obligatoire.' : undefined, capitalize: 'words' })}</View>
          </View>

          {/* E-mail : vérifiée, se change par un lien de confirmation */}
          <View style={styles.field}>
            <Text style={styles.label}>Adresse e-mail</Text>
            <View style={styles.readonly}>
              <Icon name="mail" size={20} color={Serene.onSurfaceVariant} />
              <Text style={styles.readonlyText} numberOfLines={1}>
                {USER.email}
              </Text>
              <Tag label="Vérifiée" icon="verified" tone="success" />
            </View>
            <Pressable hitSlop={8} accessibilityRole="button" onPress={() => setSheet('email')}>
              <Text style={styles.link}>Changer l’adresse e-mail</Text>
            </Pressable>
          </View>

          {input('phone', 'Téléphone', { keyboard: 'phone-pad', capitalize: 'none' })}

          <View style={styles.field}>
            <Text style={styles.label}>Date de naissance</Text>
            <Pressable
              style={({ pressed }) => [styles.readonly, styles.dateField, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`Date de naissance : ${longDate(draft.birthdate)}, changer`}
              onPress={() => setSheet('birthdate')}>
              <Icon name="cake" size={20} color={Tint.navy} />
              <Text style={styles.dateText}>{longDate(draft.birthdate)}</Text>
              <Icon name="calendar_month" size={20} color={Serene.onSurfaceVariant} />
            </Pressable>
          </View>

          {input('address', 'Adresse')}
          {input('city', 'Code postal et ville', { capitalize: 'words' })}

          <View style={styles.note}>
            <Icon name="lock" size={18} color={Tint.primary} />
            <Text style={styles.noteText}>Ces informations restent privées. Elles servent seulement à préremplir vos démarches.</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label={dirty ? 'Enregistrer' : 'Aucune modification'}
            icon="check"
            disabled={!canSave}
            onPress={() => {
              profileActions.saveUser({ ...draft, firstName: draft.firstName.trim(), lastName: draft.lastName.trim() });
              profileActions.setFlash({ text: 'Informations enregistrées' });
              if (router.canGoBack()) router.back();
              else router.replace('/profile');
            }}
          />
        </View>
      </KeyboardAvoidingView>

      <BottomSheet visible={sheet === 'photo'} title="Photo de profil" onClose={() => setSheet(null)}>
        <SheetOption
          icon="photo_camera"
          label="Prendre une photo"
          onPress={() => {
            set('hasPhoto', true);
            setSheet(null);
          }}
        />
        <SheetOption
          icon="photo_library"
          label="Choisir dans la galerie"
          onPress={() => {
            set('hasPhoto', true);
            setSheet(null);
          }}
        />
        {draft.hasPhoto ? (
          <SheetOption
            icon="delete"
            label="Retirer la photo"
            hint="Vos initiales seront affichées"
            danger
            onPress={() => {
              set('hasPhoto', false);
              setSheet(null);
            }}
          />
        ) : null}
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'email'}
        title="Changer l’adresse e-mail"
        subtitle="Nous enverrons un lien de confirmation à la nouvelle adresse. L’ancienne reste active jusqu’à la confirmation."
        onClose={() => setSheet(null)}>
        <PrimaryButton
          label="Continuer"
          icon="arrow_forward"
          onPress={() => {
            setSheet(null);
            setToast('Démo : saisie de la nouvelle adresse e-mail');
          }}
        />
        <SecondaryButton label="Garder mon adresse" onPress={() => setSheet(null)} />
      </BottomSheet>

      <DatePickerSheet
        visible={sheet === 'birthdate'}
        title="Date de naissance"
        value={draft.birthdate}
        maxDate={DEMO_TODAY}
        onSelect={(date) => set('birthdate', date)}
        onClose={() => setSheet(null)}
      />

      {toast ? <UndoToast key={toast} text={toast} onHide={() => setToast(null)} bottom={100} /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  content: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  photoZone: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
    backgroundColor: Tint.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.headingBold,
    fontSize: 34,
    lineHeight: 42,
    color: Serene.onPrimary,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: '#e6f6f3',
  },
  photoText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.primary,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  field: {
    marginTop: 16,
    gap: 6,
  },
  label: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.error,
  },
  readonly: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  readonlyText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 16,
    lineHeight: 22,
    color: Serene.onSurfaceVariant,
  },
  dateField: {
    backgroundColor: Tint.soft,
  },
  dateText: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 22,
    color: Tint.navy,
  },
  link: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.primary,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 20,
    padding: 14,
    borderRadius: 16,
    backgroundColor: Tint.soft,
  },
  noteText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Tint.navy,
  },
  footer: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
    backgroundColor: Tint.softer,
  },
});
