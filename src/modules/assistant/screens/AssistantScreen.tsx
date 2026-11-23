// S-27 - Assistant Kora | Module M13 Assistant | Phase S11
// Dans l'esprit de l'app Messages du téléphone : bulles, propositions compactes, un seul micro en bas.
// Kora aide sans décider à la place : chaque proposition ouvre le vrai formulaire, prérempli, à valider.
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ScrollViewInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { TURQUOISE } from '@/components/rings';
import { BottomSheet, Chip, SheetOption, UndoToast } from '@/components/ui/kit';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';
import { IS_DEMO } from '@/lib/config';
import { formatTime } from '@/lib/demo-dates';

import { QUICK_QUESTIONS, type ActionCard } from '../data';
import { newAssistantConversation, sendAssistantMessage, syncAssistant, useAssistant } from '../store';

/** Couleurs des propositions, en clair et en sombre. */
function toneOf(tone: ActionCard['tone'], dark: boolean): { bg: string; fg: string } {
  const light = {
    event: { bg: '#E4E3FB', fg: '#4338CA' },
    task: { bg: '#D3F5EE', fg: '#0B7A6E' },
    reminder: { bg: '#FCEFC4', fg: '#8A6100' },
    document: { bg: '#DDE9FB', fg: '#1D5ED0' },
  };
  const night = {
    event: { bg: '#262A55', fg: '#A5B4FC' },
    task: { bg: '#0F3B3B', fg: '#5EEAD4' },
    reminder: { bg: '#3D3216', fg: '#F5C84B' },
    document: { bg: '#1B3058', fg: '#8DBBFF' },
  };
  return (dark ? night : light)[tone];
}

export default function AssistantScreen() {
  const { c, styles } = useLook();
  const { messages, busy } = useAssistant();
  const [scope, setScope] = useState<'personal' | 'household'>('personal');
  const [draft, setDraft] = useState('');
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    if (!IS_DEMO) void syncAssistant();
  }, []);

  const ask = (text: string) => {
    const clean = text.trim();
    if (!clean || busy) return;
    setDraft('');
    void sendAssistantMessage(clean);
  };

  const hasDraft = draft.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={c.dark ? 'light' : 'dark'} />

      {/* En-tête : Kora, et ce qu'elle peut voir */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="auto_awesome" size={22} color={TURQUOISE} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.headerTitle}>Kora</Text>
          <Text style={styles.headerSubtitle}>Kora propose, vous décidez</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Options de la conversation" onPress={() => setMenu(true)}>
          <Icon name="more_vert" size={24} color={c.text} />
        </Pressable>
      </View>

      <View style={styles.scopeBlock}>
        <View style={styles.segments} accessibilityRole="tablist">
          {(['personal', 'household'] as const).map((key) => {
            const on = scope === key;
            return (
              <Pressable key={key} style={[styles.segment, on && styles.segmentOn]} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setScope(key)}>
                <Icon name={key === 'personal' ? 'lock' : 'group'} size={16} color={on ? c.text : c.muted} />
                <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{key === 'personal' ? 'Personnel' : 'Foyer'}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.scopeHint}>{scope === 'personal' ? 'Kora voit seulement vos éléments.' : 'Kora voit aussi ce qui est partagé avec le foyer.'}</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.content}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {messages.map((message) =>
            message.from === 'me' ? (
              <View key={message.id} style={styles.meWrap}>
                <View style={styles.meBubble}>
                  <Text style={styles.meText}>{message.text}</Text>
                </View>
                <Text style={styles.time}>{formatTime(message.at)}</Text>
              </View>
            ) : (
              <View key={message.id} style={styles.koraWrap}>
                <View style={styles.koraRow}>
                  <View style={styles.koraDot}>
                    <Icon name="auto_awesome" size={14} color={TURQUOISE} />
                  </View>
                  <View style={styles.koraColumn}>
                    <View style={styles.koraBubble}>
                      <Text style={styles.koraText}>{message.text}</Text>
                    </View>
                    {message.cards?.map((card) => (
                      <Card key={card.id} card={card} />
                    ))}
                    <Text style={styles.time}>Kora · {formatTime(message.at)}</Text>
                  </View>
                </View>
              </View>
            ),
          )}
          {busy ? (
            <View style={styles.koraRow}>
              <View style={styles.koraDot}>
                <Icon name="auto_awesome" size={14} color={TURQUOISE} />
              </View>
              <View style={[styles.koraBubble, styles.typingBubble]}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, styles.typingDot2]} />
                <View style={[styles.typingDot, styles.typingDot3]} />
              </View>
            </View>
          ) : null}
        </ScrollView>

        {/* Suggestions + saisie, comme Messages */}
        <View style={styles.composer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quick} keyboardShouldPersistTaps="handled">
            {QUICK_QUESTIONS.map((question) => (
              <Chip key={question.label} label={question.label} icon={question.icon} onPress={() => ask(question.label)} />
            ))}
          </ScrollView>
          <View style={styles.inputRow}>
            <Pressable
              style={({ pressed }) => [styles.attach, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Joindre un document"
              onPress={() => setToast('Démo : choisir un document à montrer à Kora')}>
              <Icon name="add" size={26} color={c.text} />
            </Pressable>
            <View style={styles.input}>
              <TextInput
                style={styles.inputText}
                value={draft}
                onChangeText={setDraft}
                onSubmitEditing={() => ask(draft)}
                returnKeyType="send"
                placeholder="Écrire à Kora…"
                placeholderTextColor={c.muted}
                selectionColor={c.link}
                accessibilityLabel="Message pour Kora"
              />
            </View>
            <Pressable
              style={({ pressed }) => [styles.send, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={hasDraft ? 'Envoyer' : 'Parler à Kora'}
              onPress={() => (hasDraft ? ask(draft) : router.push('/voice'))}>
              <Icon name={hasDraft ? 'arrow_upward' : 'mic'} size={22} color={c.solidText} filled={!hasDraft} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <BottomSheet visible={menu} title="Conversation" onClose={() => setMenu(false)}>
        <SheetOption
          icon="add_comment"
          label="Nouvelle conversation"
          onPress={() => {
            setMenu(false);
            newAssistantConversation();
          }}
        />
      </BottomSheet>

      {toast ? <UndoToast key={toast} text={toast} onHide={() => setToast(null)} bottom={150} /> : null}
    </SafeAreaView>
  );
}

/** Proposition compacte : ce que Kora propose, et un petit bouton qui ouvre le vrai écran. */
function Card({ card }: { card: ActionCard }) {
  const { c, styles } = useLook();
  const tone = toneOf(card.tone, c.dark);
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`${card.action} : ${card.title}`} onPress={() => router.push(card.href)}>
      <View style={[styles.cardIcon, { backgroundColor: tone.bg }]}>
        <Icon name={card.icon} size={20} color={tone.fg} />
      </View>
      <View style={styles.flex}>
        <Text style={[styles.cardLabel, { color: tone.fg }]} numberOfLines={1}>
          {card.label}
        </Text>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {card.title}
        </Text>
        <Text style={styles.cardDetail} numberOfLines={1}>
          {card.detail}
        </Text>
      </View>
      <View style={styles.cardAction}>
        <Text style={styles.cardActionText}>{card.action.replace(/ (l’|la |le )?(événement|rappel|tâche|document)$/i, '')}</Text>
      </View>
    </Pressable>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.page },
    flex: { flex: 1, minWidth: 0 },
    pressed: { opacity: 0.75 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
    },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0C1A37', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontFamily: FontFamily.headingBold, fontSize: 18, lineHeight: 23, color: c.text },
    headerSubtitle: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 17, color: c.muted },
    iconButton: { width: 44, height: 44, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
    scopeBlock: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, gap: 6, borderBottomWidth: 1, borderBottomColor: c.border },
    segments: { flexDirection: 'row', padding: 4, borderRadius: 14, backgroundColor: c.dark ? '#13213D' : '#E8EEF3' },
    segment: { flex: 1, minHeight: 38, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
    segmentOn: { backgroundColor: c.dark ? '#22365C' : '#FFFFFF' },
    segmentText: { fontFamily: FontFamily.bodyMedium, fontSize: 14, lineHeight: 19, color: c.muted },
    segmentTextOn: { fontFamily: FontFamily.bodySemiBold, color: c.text },
    scopeHint: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 17, color: c.muted, textAlign: 'center' },
    content: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, gap: 14 },
    time: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 17, color: c.muted, marginTop: 4 },
    meWrap: { alignItems: 'flex-end' },
    meBubble: { maxWidth: '85%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderBottomRightRadius: 6, backgroundColor: c.solid },
    meText: { fontFamily: FontFamily.body, fontSize: 15, lineHeight: 21, color: c.solidText },
    koraWrap: {},
    koraRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
    koraDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#0C1A37', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
    koraColumn: { flex: 1, gap: 8, alignItems: 'flex-start' },
    koraBubble: { maxWidth: '92%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderBottomLeftRadius: 6, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
    koraText: { fontFamily: FontFamily.body, fontSize: 15, lineHeight: 21, color: c.text },
    typingBubble: { flexDirection: 'row', gap: 5, paddingVertical: 14, marginBottom: 22 },
    typingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: c.muted, opacity: 0.9 },
    typingDot2: { opacity: 0.6 },
    typingDot3: { opacity: 0.35 },
    card: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    cardIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    cardLabel: { fontFamily: FontFamily.bodySemiBold, fontSize: 13, lineHeight: 17 },
    cardTitle: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, lineHeight: 20, color: c.text },
    cardDetail: { fontFamily: FontFamily.body, fontSize: 13, lineHeight: 17, color: c.muted },
    cardAction: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: c.solid },
    cardActionText: { fontFamily: FontFamily.bodySemiBold, fontSize: 13, lineHeight: 17, color: c.solidText },
    composer: { gap: 8, paddingTop: 8, paddingBottom: 10, borderTopWidth: 1, borderTopColor: c.border, backgroundColor: c.page },
    quick: { gap: 8, paddingHorizontal: 16 },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
    attach: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
    input: { flex: 1, minHeight: 44, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: c.border, backgroundColor: c.card },
    inputText: { paddingVertical: 10, fontFamily: FontFamily.body, fontSize: 16, lineHeight: 22, color: c.text, outlineWidth: 0, outlineStyle: 'solid' },
    send: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: c.solid },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

function useLook() {
  const c = useAppColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
