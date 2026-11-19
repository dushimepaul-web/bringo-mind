// Mobile - Accepter une invitation | Module M08 Foyer | Phase S7
// La personne voit qui l'invite, ce qui sera partagé et ce qui reste privé, avant de décider.
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomSheet, PrimaryButton, SecondaryButton, Tag, TopBar, useKitStyles } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily } from '@/constants/design';
import { DEMO_TODAY, addDays, formatLongDay } from '@/lib/demo-dates';

import { Avatar } from '../components/household-ui';
import { DEMO_HOUSEHOLD, DEMO_MEMBERS, firstName } from '../data';
import { householdActions } from '../store';

const SHARED = [
  { icon: 'task_alt', text: 'Les tâches que les membres partagent avec le foyer' },
  { icon: 'event', text: 'Les événements marqués « Foyer »' },
  { icon: 'folder_shared', text: 'Les documents placés dans le dossier commun' },
];
const PRIVATE = [
  { icon: 'lock', text: 'Vos tâches, rappels et événements personnels' },
  { icon: 'lock', text: 'Vos documents (santé, impôts, fiches de paie)' },
];

export default function AcceptInvitationScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const [decline, setDecline] = useState(false);
  const host = DEMO_MEMBERS.find((member) => member.id === 'thomas') ?? DEMO_MEMBERS[0];
  const expires = addDays(DEMO_TODAY, 6);

  const leave = () => (router.canGoBack() ? router.back() : router.replace('/household'));

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top', 'bottom']}>
      <TopBar title="Invitation" close fallback="/household" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={[kitStyles.card, styles.hero]}>
          <Avatar name={host.name} color={host.color} size={64} />
          <Text style={styles.from}>{host.name} vous invite à rejoindre</Text>
          <Text style={styles.household}>{DEMO_HOUSEHOLD.name}</Text>
          <View style={styles.tags}>
            <Tag label="Rôle : Membre" icon="person" />
            <Tag label={`${DEMO_MEMBERS.length} membres`} icon="group" tone="teal" />
          </View>
          <View style={styles.faces}>
            {DEMO_MEMBERS.map((member) => (
              <View key={member.id} style={styles.face}>
                <Avatar name={member.name} color={member.color} size={36} />
                <Text style={styles.faceName}>{firstName(member.name)}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.expiry}>Invitation valable jusqu’au {formatLongDay(expires).toLowerCase()}</Text>
        </View>

        <Text style={[kitStyles.label, styles.label]}>Ce que vous verrez dans le foyer</Text>
        <View style={[kitStyles.card, styles.list]}>
          {SHARED.map((item) => (
            <View key={item.text} style={styles.line}>
              <Icon name={item.icon} size={20} color={c.link} />
              <Text style={styles.lineText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <Text style={[kitStyles.label, styles.label]}>Ce qui reste privé</Text>
        <View style={[kitStyles.card, styles.list]}>
          {PRIVATE.map((item) => (
            <View key={item.text} style={styles.line}>
              <Icon name={item.icon} size={20} color={c.muted} />
              <Text style={styles.lineText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Rejoindre le foyer"
          icon="group_add"
          onPress={() => {
            householdActions.joinDemoHousehold();
            householdActions.setFlash({ text: `Bienvenue dans ${DEMO_HOUSEHOLD.name}` });
            router.replace('/household');
          }}
        />
        <SecondaryButton label="Refuser" onPress={() => setDecline(true)} />
      </View>

      <BottomSheet
        visible={decline}
        title="Refuser l’invitation ?"
        subtitle={`${firstName(host.name)} sera prévenu. Il pourra vous inviter à nouveau plus tard.`}
        onClose={() => setDecline(false)}>
        <SecondaryButton
          label="Refuser l’invitation"
          danger
          onPress={() => {
            setDecline(false);
            householdActions.setFlash({ text: 'Invitation refusée' });
            leave();
          }}
        />
        <SecondaryButton label="Revenir" onPress={() => setDecline(false)} />
      </BottomSheet>
    </SafeAreaView>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    content: {
      paddingTop: 4,
      paddingBottom: 24,
    },
    hero: {
      alignItems: 'center',
      gap: 8,
      paddingVertical: 24,
    },
    from: {
      marginTop: 6,
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 21,
      color: c.muted,
      textAlign: 'center',
    },
    household: {
      fontFamily: FontFamily.headingBold,
      fontSize: 26,
      lineHeight: 32,
      letterSpacing: -0.4,
      color: c.text,
      textAlign: 'center',
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 8,
    },
    faces: {
      flexDirection: 'row',
      gap: 16,
      marginTop: 8,
    },
    face: {
      alignItems: 'center',
      gap: 4,
    },
    faceName: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.text,
    },
    expiry: {
      marginTop: 6,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    label: {
      marginTop: 20,
      marginBottom: 8,
    },
    list: {
      gap: 12,
    },
    line: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    lineText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 21,
      color: c.text,
    },
    footer: {
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
      gap: 8,
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
