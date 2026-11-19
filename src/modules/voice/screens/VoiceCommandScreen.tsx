// S-28 - Commande vocale | Module M14 Voix | Phase S11
// Démo complète : écoute → transcription → ce que Kora a compris → confirmation (formulaire prérempli).
import { router, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Chip, PrimaryButton, SecondaryButton, TopBar, useKitStyles } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { DEMO_TODAY, addDays, atTime } from '@/lib/demo-dates';

type Phase = 'idle' | 'listening' | 'transcribing' | 'understood';

type Command = {
  id: string;
  say: string;
  icon: string;
  kind: string;
  title: string;
  detail: string;
  confirm: string;
  href: Href;
};

const COMMANDS: Command[] = [
  {
    id: 'tax',
    say: 'Crée une tâche pour payer la taxe foncière vendredi',
    icon: 'add_task',
    kind: 'Créer une tâche',
    title: 'Payer la taxe foncière',
    detail: 'Échéance : vendredi 17 mai',
    confirm: 'Ouvrir la tâche préremplie',
    href: {
      pathname: '/tasks/add',
      params: { title: 'Payer la taxe foncière', due: atTime(addDays(DEMO_TODAY, 3), 12).toISOString(), description: 'Créée par commande vocale.' },
    },
  },
  {
    id: 'tomorrow',
    say: 'Qu’est-ce que j’ai prévu demain ?',
    icon: 'event',
    kind: 'Consulter le planning',
    title: 'Demain, mercredi 15 mai',
    detail: 'Contrôle technique à 9h00 • kinésithérapie à 18h30',
    confirm: 'Voir le planning',
    href: '/calendar/agenda',
  },
  {
    id: 'doctor',
    say: 'Rappelle-moi d’appeler le médecin jeudi à 9h',
    icon: 'notifications',
    kind: 'Créer un rappel',
    title: 'Appeler le médecin',
    detail: 'Jeudi 16 mai à 9h00',
    confirm: 'Ouvrir le rappel prérempli',
    href: { pathname: '/reminders/add', params: { title: 'Appeler le médecin', at: atTime(addDays(DEMO_TODAY, 2), 9).toISOString() } },
  },
];

const BARS = [10, 18, 28, 16, 34, 22, 12, 26, 38, 20, 14, 30, 18, 10];

export default function VoiceCommandScreen() {
  const { c, styles } = useLook();
  const kitStyles = useKitStyles();
  const [phase, setPhase] = useState<Phase>('idle');
  const [command, setCommand] = useState<Command>(COMMANDS[0]);
  const [words, setWords] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [pulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => undefined);
  }, []);

  // Enchaînement de la démo : écoute (1,2 s) puis transcription mot à mot, puis compréhension.
  useEffect(() => {
    if (phase === 'listening') {
      const timer = setTimeout(() => setPhase('transcribing'), 1200);
      return () => clearTimeout(timer);
    }
    if (phase === 'transcribing') {
      const total = command.say.split(' ').length;
      if (words >= total) {
        const timer = setTimeout(() => setPhase('understood'), 400);
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => setWords((count) => count + 1), reduceMotion ? 0 : 110);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [phase, words, command, reduceMotion]);

  // Onde animée pendant l'écoute (désactivée si « réduire les animations »).
  useEffect(() => {
    if (reduceMotion || (phase !== 'listening' && phase !== 'transcribing')) {
      pulse.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [phase, pulse, reduceMotion]);

  const start = (next: Command) => {
    setCommand(next);
    setWords(0);
    setPhase('listening');
  };

  const active = phase === 'listening' || phase === 'transcribing';
  const transcript = command.say.split(' ').slice(0, words).join(' ');
  const status =
    phase === 'idle'
      ? 'Appuyez et parlez à Kora'
      : phase === 'listening'
        ? 'J’écoute…'
        : phase === 'transcribing'
          ? 'Je transcris…'
          : 'Voici ce que j’ai compris';

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      <TopBar title="Commande vocale" fallback="/assistant" />
      <ScrollView contentContainerStyle={[kitStyles.content, styles.content]} showsVerticalScrollIndicator={false}>
        <View style={styles.micZone}>
          <Animated.View
            style={[
              styles.halo,
              active && styles.haloActive,
              { transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }] },
            ]}>
            <Pressable
              style={({ pressed }) => [styles.mic, active && styles.micActive, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={active ? 'Arrêter l’écoute' : 'Parler à Kora'}
              onPress={() => (active ? setPhase('idle') : start(command))}>
              <Icon name={active ? 'stop' : 'mic'} size={40} color={c.solidText} />
            </Pressable>
          </Animated.View>
          <Text style={styles.status} accessibilityLiveRegion="polite">
            {status}
          </Text>
          <View style={styles.wave} accessibilityElementsHidden importantForAccessibility="no">
            {BARS.map((height, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.bar,
                  active ? styles.barActive : null,
                  {
                    height: active
                      ? pulse.interpolate({ inputRange: [0, 1], outputRange: [height * 0.5, height] })
                      : 6,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <Text style={[styles.liveText, !transcript && styles.placeholder]} accessibilityLiveRegion="polite">
          {transcript ? `« ${transcript} »` : 'Votre voix apparaîtra ici…'}
        </Text>

        {phase === 'understood' ? (
          <View style={styles.understood}>
            <View style={styles.cardHead}>
              <Icon name="auto_awesome" size={18} color={c.link} />
              <Text style={[styles.cardLabel, styles.understoodLabel]}>Kora a compris</Text>
            </View>
            <View style={styles.intent}>
              <View style={styles.intentIcon}>
                <Icon name={command.icon} size={22} color={c.link} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.intentKind}>{command.kind}</Text>
                <Text style={styles.intentTitle}>{command.title}</Text>
                <Text style={styles.intentDetail}>{command.detail}</Text>
              </View>
            </View>
            <PrimaryButton label={command.confirm} icon="check" onPress={() => router.push(command.href)} />
            <View style={styles.row}>
              <SecondaryButton label="Corriger" icon="mic" style={styles.flex} onPress={() => start(command)} />
              <SecondaryButton label="Annuler" style={styles.flex} onPress={() => setPhase('idle')} />
            </View>
            <Text style={styles.hint}>Rien n’est enregistré tant que vous n’avez pas validé le formulaire.</Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>Essayez par exemple</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.examplesScroll} contentContainerStyle={styles.examplesRow}>
          {COMMANDS.map((entry) => (
            <Chip key={entry.id} label={entry.say} icon="mic_none" onPress={() => start(entry)} />
          ))}
        </ScrollView>

        <View style={styles.privacy}>
          <Icon name="lock" size={14} color={c.muted} />
          <Text style={styles.privacyText}>L’audio est supprimé après la transcription.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    liveText: {
      minHeight: 56,
      paddingHorizontal: 12,
      textAlign: 'center',
      fontFamily: FontFamily.heading,
      fontSize: 20,
      lineHeight: 28,
      color: c.text,
    },
    examplesScroll: {
      marginHorizontal: -16,
    },
    examplesRow: {
      gap: 8,
      paddingHorizontal: 16,
    },
    privacy: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginTop: 24,
    },
    privacyText: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 17,
      color: c.muted,
    },
    flex: {
      flex: 1,
    },
    pressed: {
      opacity: 0.85,
    },
    content: {
      paddingTop: 4,
      paddingBottom: 40,
    },
    micZone: {
      alignItems: 'center',
      gap: 12,
      paddingVertical: 14,
    },
    halo: {
      width: 150,
      height: 150,
      borderRadius: Radius.full,
      backgroundColor: c.soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    haloActive: {
      backgroundColor: c.tintMint,
    },
    mic: {
      width: 104,
      height: 104,
      borderRadius: Radius.full,
      backgroundColor: c.solid,
      alignItems: 'center',
      justifyContent: 'center',
    },
    micActive: {
      backgroundColor: c.link,
    },
    status: {
      fontFamily: FontFamily.headingBold,
      fontSize: 18,
      lineHeight: 24,
      color: c.text,
    },
    wave: {
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    bar: {
      width: 5,
      borderRadius: Radius.full,
      backgroundColor: c.dark ? '#3B5079' : '#b9c4d6',
    },
    barActive: {
      backgroundColor: c.link,
    },
    transcript: {
      gap: 8,
    },
    cardHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    cardLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: c.muted,
    },
    transcriptText: {
      fontFamily: FontFamily.headingBold,
      fontSize: 18,
      lineHeight: 25,
      color: c.text,
    },
    placeholder: {
      color: c.muted,
    },
    understood: {
      marginTop: 14,
      gap: 12,
      padding: 16,
      borderRadius: 20,
      backgroundColor: c.tintMint,
      borderWidth: 1,
      borderColor: c.border,
    },
    understoodLabel: {
      color: c.link,
    },
    intent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    intentIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    intentKind: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      color: c.link,
    },
    intentTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 18,
      lineHeight: 24,
      color: c.text,
    },
    intentDetail: {
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    row: {
      flexDirection: 'row',
      gap: 8,
    },
    hint: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
      textAlign: 'center',
    },
    sectionLabel: {
      marginTop: 22,
      marginBottom: 8,
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: c.muted,
    },
    examples: {
      paddingVertical: 4,
      paddingHorizontal: 0,
    },
    example: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    exampleBorder: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
    },
    examplePressed: {
      backgroundColor: c.soft,
    },
    exampleText: {
      flex: 1,
      fontFamily: FontFamily.bodyMedium,
      fontSize: 15,
      lineHeight: 21,
      color: c.text,
    },
    note: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      marginTop: 18,
      padding: 14,
      borderRadius: 16,
      backgroundColor: c.soft,
    },
    noteText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.text,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
