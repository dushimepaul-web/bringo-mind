// S-17 - Créer un foyer | Module M08 Foyer | Phase S7
// Démo : champs préremplis. Créer un foyer ne change rien aux éléments personnels.
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Chip, PrimaryButton, TopBar, useKitStyles } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily } from '@/constants/design';

import { useHouseholdStyles } from '../components/household-ui';
import { isValidEmail } from '../data';
import { householdActions } from '../store';

const KINDS = [
  { key: 'family', label: 'Famille', icon: 'family_restroom' },
  { key: 'couple', label: 'Couple', icon: 'favorite' },
  { key: 'coloc', label: 'Colocation', icon: 'apartment' },
  { key: 'other', label: 'Autre', icon: 'groups' },
];

export default function CreateHouseholdScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const householdStyles = useHouseholdStyles();
  const [name, setName] = useState('Foyer Martin');
  const [kind, setKind] = useState('family');
  const [inviteNow, setInviteNow] = useState(true);
  const [email, setEmail] = useState('thomas.martin@email.fr');
  const [focus, setFocus] = useState<'name' | 'email' | null>(null);

  const nameOk = name.trim().length >= 2;
  const emailOk = !inviteNow || isValidEmail(email);
  const canCreate = nameOk && emailOk;

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top', 'bottom']}>
      <TopBar title="Créer un foyer" close fallback="/household" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[kitStyles.content, styles.content]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={kitStyles.muted}>
            Un foyer sert à partager certaines tâches, événements et documents. Vous en serez le propriétaire.
          </Text>

          <Text style={[kitStyles.label, styles.label]}>Nom du foyer</Text>
          <TextInput
            style={[kitStyles.input, focus === 'name' && kitStyles.inputFocused, !nameOk && kitStyles.inputError]}
            value={name}
            onChangeText={setName}
            onFocus={() => setFocus('name')}
            onBlur={() => setFocus(null)}
            maxLength={40}
            placeholder="Ex. Foyer Martin"
            placeholderTextColor={c.muted}
            selectionColor={c.link}
            accessibilityLabel="Nom du foyer"
          />
          {!nameOk ? <Text style={styles.error}>Donnez un nom d’au moins 2 caractères.</Text> : null}

          <Text style={[kitStyles.label, styles.label]}>Type de foyer</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {KINDS.map((entry) => (
              <Chip key={entry.key} label={entry.label} icon={entry.icon} selected={kind === entry.key} onPress={() => setKind(entry.key)} />
            ))}
          </ScrollView>

          <View style={[kitStyles.card, styles.inviteCard]}>
            <View style={styles.switchRow}>
              <Icon name="person_add" size={22} color={c.text} />
              <View style={styles.flex}>
                <Text style={kitStyles.label}>Inviter quelqu’un maintenant</Text>
                <Text style={styles.hint}>Vous pourrez aussi le faire plus tard.</Text>
              </View>
              <Switch
                value={inviteNow}
                onValueChange={setInviteNow}
                trackColor={{ false: c.border, true: c.link }}
                thumbColor="#ffffff"
                {...(Platform.OS === 'web' ? { activeThumbColor: '#ffffff' } : {})}
                accessibilityLabel="Inviter quelqu’un maintenant"
              />
            </View>
            {inviteNow ? (
              <>
                <TextInput
                  style={[kitStyles.input, focus === 'email' && kitStyles.inputFocused, !emailOk && kitStyles.inputError]}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocus('email')}
                  onBlur={() => setFocus(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="prenom.nom@email.fr"
                  placeholderTextColor={c.muted}
                  selectionColor={c.link}
                  accessibilityLabel="Adresse e-mail à inviter"
                />
                {!emailOk ? <Text style={styles.error}>Saisissez une adresse e-mail valide.</Text> : null}
                <Text style={styles.hint}>Invité comme admin : il pourra aussi gérer les membres.</Text>
              </>
            ) : null}
          </View>

          <View style={[householdStyles.note, styles.note]}>
            <Icon name="lock" size={20} color={c.link} />
            <Text style={householdStyles.noteText}>
              Rien n’est partagé automatiquement : vous choisissez, élément par élément, ce que le foyer peut voir.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label="Créer le foyer"
            icon="add_home"
            disabled={!canCreate}
            onPress={() => {
              householdActions.createHousehold(name, inviteNow ? email : undefined);
              householdActions.setFlash({
                text: inviteNow ? `Foyer créé • invitation envoyée à ${email.trim()}` : 'Foyer créé',
              });
              router.replace('/household');
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    content: {
      paddingTop: 4,
      paddingBottom: 24,
    },
    label: {
      marginTop: 20,
      marginBottom: 8,
    },
    chips: {
      gap: 8,
    },
    inviteCard: {
      marginTop: 20,
      gap: 12,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    hint: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    error: {
      marginTop: 6,
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.error,
    },
    note: {
      marginTop: 18,
    },
    footer: {
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
      backgroundColor: c.page,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
