// Mobile - Transférer la propriété du foyer | Module M08 Foyer | Phase S7
// Action sensible : choix du membre, conséquences expliquées, confirmation forte (nom du foyer).
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { PrimaryButton, TopBar, useKitStyles } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily } from '@/constants/design';

import { Avatar, ChoiceCard } from '../components/household-ui';
import { ROLE_LABELS, firstName } from '../data';
import { ensureHousehold, householdActions, useHouseholdState } from '../store';

export default function TransferOwnershipScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const { to } = useLocalSearchParams<{ to?: string }>();
  const { name, members } = useHouseholdState();
  useEffect(() => ensureHousehold(), []);
  const me = members.find((member) => member.you);
  const eligible = members.filter((member) => !member.you && member.role !== 'child');
  const [target, setTarget] = useState(() => eligible.find((member) => member.id === to)?.id ?? eligible[0]?.id);
  // Démo : confirmation préremplie, comme tous les champs.
  const [typed, setTyped] = useState(name);
  const [focused, setFocused] = useState(false);

  const chosen = eligible.find((member) => member.id === target);
  const matches = typed.trim().toLowerCase() === name.trim().toLowerCase();

  if (me?.role !== 'owner' || !chosen) {
    return (
      <SafeAreaView style={kitStyles.safe} edges={['top']}>
        <TopBar title="Transférer la propriété" fallback="/household" />
        <View style={[kitStyles.content, styles.content]}>
          <View style={[kitStyles.card, styles.blocked]}>
            <Icon name="info" size={28} color={c.link} />
            <Text style={kitStyles.title}>Transfert indisponible</Text>
            <Text style={[kitStyles.muted, styles.center]}>
              {me?.role !== 'owner'
                ? 'Seul le propriétaire du foyer peut le transférer.'
                : 'Invitez d’abord un autre adulte dans le foyer.'}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top', 'bottom']}>
      <TopBar title="Transférer la propriété" close fallback="/household/members" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[kitStyles.content, styles.content]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.swap}>
            <View style={styles.swapPerson}>
              <Avatar name={me.name} color={me.color} size={56} />
              <Text style={styles.swapName}>Vous</Text>
              <Text style={styles.swapRole}>Propriétaire → Admin</Text>
            </View>
            <Icon name="arrow_forward" size={26} color={c.muted} />
            <View style={styles.swapPerson}>
              <Avatar name={chosen.name} color={chosen.color} size={56} />
              <Text style={styles.swapName}>{firstName(chosen.name)}</Text>
              <Text style={styles.swapRole}>
                {ROLE_LABELS[chosen.role]} → Propriétaire
              </Text>
            </View>
          </View>

          <Text style={[kitStyles.label, styles.label]}>Nouveau propriétaire</Text>
          <View style={styles.stack}>
            {eligible.map((member) => (
              <ChoiceCard
                key={member.id}
                title={member.name}
                hint={`${ROLE_LABELS[member.role]} • ${member.email}`}
                selected={target === member.id}
                onPress={() => setTarget(member.id)}
              />
            ))}
          </View>

          <View style={[kitStyles.card, styles.warning]}>
            <View style={styles.warningHead}>
              <Icon name="warning" size={22} color="#b45309" />
              <Text style={styles.warningTitle}>Ce qui va changer</Text>
            </View>
            {[
              `${firstName(chosen.name)} pourra gérer les membres, transférer ou supprimer le foyer.`,
              'Vous restez dans le foyer comme admin.',
              `Seul ${firstName(chosen.name)} pourra vous rendre la propriété.`,
              'Vos éléments personnels ne sont pas concernés.',
            ].map((line) => (
              <View key={line} style={styles.warningLine}>
                <View style={styles.bullet} />
                <Text style={styles.warningText}>{line}</Text>
              </View>
            ))}
          </View>

          <Text style={[kitStyles.label, styles.label]}>Pour confirmer, saisissez le nom du foyer</Text>
          <TextInput
            style={[kitStyles.input, focused && kitStyles.inputFocused]}
            value={typed}
            onChangeText={setTyped}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoCorrect={false}
            placeholder={name}
            placeholderTextColor={c.muted}
            selectionColor={c.link}
            accessibilityLabel={`Saisissez ${name} pour confirmer`}
          />
          <Text style={[styles.hint, matches && styles.hintOk]}>
            {matches ? 'Nom confirmé' : `Saisissez exactement « ${name} »`}
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label={`Transférer à ${firstName(chosen.name)}`}
            icon="swap_horiz"
            disabled={!matches}
            onPress={() => {
              householdActions.transferOwnership(chosen.id);
              householdActions.setFlash({ text: `${firstName(chosen.name)} est maintenant propriétaire du foyer` });
              if (router.canGoBack()) router.back();
              else router.replace('/household/members');
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
    center: {
      textAlign: 'center',
    },
    content: {
      paddingTop: 4,
      paddingBottom: 24,
    },
    blocked: {
      alignItems: 'center',
      gap: 8,
      paddingVertical: 24,
    },
    swap: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      paddingVertical: 12,
    },
    swapPerson: {
      width: 128,
      alignItems: 'center',
      gap: 4,
    },
    swapName: {
      fontFamily: FontFamily.headingBold,
      fontSize: 17,
      lineHeight: 23,
      color: c.text,
    },
    swapRole: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
      textAlign: 'center',
    },
    label: {
      marginTop: 20,
      marginBottom: 8,
    },
    stack: {
      gap: 10,
    },
    warning: {
      marginTop: 18,
      gap: 8,
      backgroundColor: c.tintAmber,
      borderColor: c.dark ? '#5A4A1E' : '#fde68a',
    },
    warningHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    warningTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 16,
      lineHeight: 22,
      color: c.amberText,
    },
    warningLine: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginTop: 8,
      backgroundColor: '#b45309',
    },
    warningText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 20,
      color: c.text,
    },
    hint: {
      marginTop: 6,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    hintOk: {
      fontFamily: FontFamily.bodySemiBold,
      color: c.link,
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
