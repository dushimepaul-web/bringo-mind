// S-28 - Commande vocale | Module M14 Assistant & Voix | Phase S10
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

type VoiceState = 'idle' | 'listening' | 'processing' | 'result';

const EXAMPLES = [
  'Crée une tâche pour payer la taxe foncière vendredi',
  'Qu’est-ce que j’ai prévu demain ?',
  'Ajoute un rappel pour appeler le médecin',
];

const WAVE_BARS = [12, 22, 38, 52, 30, 18, 44, 60, 36, 24, 48, 32, 20, 42, 28];

export default function VoiceCommandScreen() {
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState(
    'Rappelle-moi demain à 8 heures d’appeler le médecin',
  );
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const start = () => {
    if (state === 'processing') return;
    setState('listening');
    timer.current = setTimeout(() => {
      setState('processing');
      timer.current = setTimeout(() => setState('result'), 1200);
    }, 2200);
  };

  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    if (state === 'listening') {
      setState('processing');
      timer.current = setTimeout(() => setState('result'), 900);
    }
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setState('idle');
  };

  const applyExample = (example: string) => {
    if (timer.current) clearTimeout(timer.current);
    setTranscript(example);
    setState('result');
  };

  const active = state === 'listening' || state === 'processing';

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
        <Text style={styles.headerTitle}>Commande vocale</Text>
        <Pressable style={styles.headerButton} accessibilityLabel="Paramètres vocaux">
          <Icon name="settings" size={21} color={Serene.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.stage}>
          <View style={[styles.ring, styles.ringOuter, active && styles.ringActive]} />
          <View style={[styles.ring, styles.ringMiddle, active && styles.ringActive]} />
          <Pressable
            onPress={state === 'listening' ? stop : state === 'result' ? reset : start}
            style={[styles.micButton, state === 'listening' && styles.micButtonActive]}
            accessibilityRole="button"
            accessibilityLabel={
              state === 'listening' ? 'Arrêter l’écoute' : 'Démarrer la commande vocale'
            }>
            <Icon
              name={state === 'listening' ? 'stop' : state === 'processing' ? 'graphic_eq' : 'mic'}
              size={40}
              color={Serene.onPrimary}
            />
          </Pressable>

          <Text style={styles.status}>
            {state === 'idle'
              ? 'Appuyez pour parler'
              : state === 'listening'
                ? 'Je vous écoute...'
                : state === 'processing'
                  ? 'Kora analyse votre demande...'
                  : 'Commande comprise'}
          </Text>

          <View style={styles.wave}>
            {WAVE_BARS.map((height, index) => (
              <View
                key={index}
                style={[
                  styles.waveBar,
                  { height: active ? height : height * 0.45 },
                  active && index % 3 === 0 && styles.waveBarAccent,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.transcriptCard}>
          <View style={styles.cardHeader}>
            <Icon name="record_voice_over" size={16} color={Serene.onSurfaceVariant} />
            <Text style={styles.cardHeaderText}>Transcription</Text>
            {state === 'listening' ? (
              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>En direct</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.transcript}>
            {state === 'idle' ? '« Votre voix apparaîtra ici… »' : `« ${transcript} »`}
          </Text>
        </View>

        {state === 'result' ? (
          <View style={styles.intentCard}>
            <View style={styles.intentHeader}>
              <View style={styles.intentIcon}>
                <Icon name="auto_awesome" size={18} color={Serene.onPrimary} />
              </View>
              <View style={styles.intentHeaderBody}>
                <Text style={styles.intentTitle}>Intention détectée</Text>
                <Text style={styles.intentSub}>Créer un rappel • fiabilité 97 %</Text>
              </View>
              <View style={styles.confidencePill}>
                <Text style={styles.confidenceText}>97%</Text>
              </View>
            </View>

            <View style={styles.intentFields}>
              <IntentRow icon="label" label="Objet" value="Appeler le médecin" />
              <IntentRow icon="schedule" label="Quand" value="Demain 10 mai • 08:00" />
              <IntentRow icon="notifications" label="Rappel" value="Push + e-mail" />
            </View>

            <View style={styles.intentActions}>
              <Pressable
                style={styles.primaryButton}
                accessibilityRole="button"
                onPress={() => router.push('/reminders/add')}>
                <Icon name="check" size={17} color={Serene.onPrimary} />
                <Text style={styles.primaryButtonText}>Confirmer</Text>
              </Pressable>
              <Pressable
                style={styles.secondaryButton}
                accessibilityRole="button"
                onPress={() => router.push('/reminders/edit')}>
                <Icon name="edit" size={17} color={Serene.onSurface} />
                <Text style={styles.secondaryButtonText}>Modifier</Text>
              </Pressable>
              <Pressable
                style={styles.ghostButton}
                accessibilityRole="button"
                accessibilityLabel="Annuler"
                onPress={reset}>
                <Icon name="close" size={17} color={Serene.onSurfaceVariant} />
              </Pressable>
            </View>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>Exemples de commandes</Text>
        <View style={styles.examples}>
          {EXAMPLES.map((example) => (
            <Pressable
              key={example}
              style={styles.exampleCard}
              accessibilityRole="button"
              onPress={() => applyExample(example)}>
              <Icon name="mic_none" size={16} color={Serene.secondary} />
              <Text style={styles.exampleText}>{example}</Text>
              <Icon name="north_east" size={14} color={Serene.onSurfaceVariant} />
            </Pressable>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Icon name="lock" size={15} color={Serene.onSurfaceVariant} />
          <Text style={styles.infoText}>
            L’audio est traité en direct pour la transcription, puis supprimé. Aucun
            enregistrement n’est conservé.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function IntentRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.intentRow}>
      <View style={styles.intentRowIcon}>
        <Icon name={icon} size={15} color={Serene.secondary} />
      </View>
      <Text style={styles.intentLabel}>{label}</Text>
      <Text style={styles.intentValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Serene.surface,
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
    paddingTop: Space.lg,
    paddingBottom: Space.lg,
  },
  stage: {
    alignItems: 'center',
    paddingVertical: Space.md,
  },
  ring: {
    position: 'absolute',
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
    opacity: 0.35,
  },
  ringOuter: {
    top: 4,
    width: 168,
    height: 168,
    opacity: 0.18,
  },
  ringMiddle: {
    top: 26,
    width: 124,
    height: 124,
    opacity: 0.3,
  },
  ringActive: {
    backgroundColor: Serene.secondary,
    opacity: 0.22,
  },
  micButton: {
    marginTop: 26,
    width: 92,
    height: 92,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.floating,
  },
  micButtonActive: {
    backgroundColor: Serene.error,
  },
  status: {
    marginTop: Space.md,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  wave: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 64,
    marginTop: 6,
  },
  waveBar: {
    width: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
  },
  waveBarAccent: {
    backgroundColor: Serene.primary,
  },
  transcriptCard: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardHeaderText: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.errorContainer,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: Radius.full,
    backgroundColor: Serene.error,
  },
  liveText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 9,
    lineHeight: 13,
    color: Serene.error,
  },
  transcript: {
    fontFamily: FontFamily.heading,
    fontSize: 17,
    lineHeight: 25,
    color: Serene.onSurface,
    marginTop: 8,
  },
  intentCard: {
    marginTop: Space.md,
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Serene.secondaryContainer,
    ...Shadow.card,
  },
  intentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  intentIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intentHeaderBody: {
    flex: 1,
    minWidth: 0,
  },
  intentTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Serene.onSurface,
  },
  intentSub: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  confidencePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
  },
  confidenceText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSecondaryContainer,
  },
  intentFields: {
    marginTop: 8,
    backgroundColor: Serene.surfaceContainerLow,
    borderRadius: Radius.lg,
    paddingHorizontal: 10,
  },
  intentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Serene.surfaceContainerHigh,
  },
  intentRowIcon: {
    width: 24,
    height: 24,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intentLabel: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 15,
    color: Serene.onSurfaceVariant,
  },
  intentValue: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurface,
  },
  intentActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  primaryButton: {
    flex: 1,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  primaryButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onPrimary,
  },
  secondaryButton: {
    flex: 1,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  secondaryButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  ghostButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
    marginTop: Space.lg,
    marginBottom: Space.sm,
  },
  examples: {
    gap: 8,
  },
  exampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  exampleText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: Serene.onSurface,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: Space.md,
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainerLow,
  },
  infoText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
});
