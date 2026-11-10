// S-27 - Assistant Kora | Module M13 Assistant | Phase S11
// Kora aide sans décider à la place : chaque proposition ouvre le vrai formulaire, prérempli, à valider.
import { router } from 'expo-router';
import { useRef, useState } from 'react';
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
import { Chip, UndoToast, kitStyles } from '@/components/ui/kit';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';
import { DEMO_TODAY, formatTime } from '@/lib/demo-dates';

import { QUICK_QUESTIONS, answer, initialConversation, topicOf, type ActionCard, type Message, type Topic } from '../data';

const TONES: Record<ActionCard['tone'], { bg: string; fg: string }> = {
  event: { bg: '#e2dfff', fg: '#3323cc' },
  task: { bg: Serene.secondaryContainer, fg: Serene.onSecondaryContainer },
  reminder: { bg: '#fef3c7', fg: '#92400e' },
  document: { bg: '#dce9ff', fg: '#1e3a8a' },
};

export default function AssistantScreen() {
  const [messages, setMessages] = useState<Message[]>(initialConversation);
  const [scope, setScope] = useState<'personal' | 'household'>('personal');
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);
  const [typing, setTyping] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);

  const ask = (text: string, topic: Topic = topicOf(text)) => {
    const clean = text.trim();
    if (!clean || typing) return;
    // Démo : l'heure avance d'une minute à chaque échange.
    const at = new Date(DEMO_TODAY.getTime() + messages.length * 60000);
    setMessages((current) => [...current, { id: `me-${current.length}`, from: 'me', text: clean, at }]);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setMessages((current) => [...current, { id: `kora-${current.length}`, from: 'kora', at, ...answer(topic) }]);
      setTyping(false);
    }, 700);
  };

  return (
    <SafeAreaView style={kitStyles.safe} edges={['top']}>
      {/* En-tête : qui est Kora et ce qu'elle peut voir */}
      <View style={styles.header}>
        <View style={styles.koraAvatar}>
          <Icon name="auto_awesome" size={22} color={Tint.glow} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.headerTitle}>Kora</Text>
          <Text style={styles.headerSubtitle}>Kora propose, vous décidez</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.voiceButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Commande vocale"
          onPress={() => router.push('/voice')}>
          <Icon name="mic" size={22} color={Tint.navy} />
        </Pressable>
      </View>
      <View style={styles.scopeRow}>
        <Chip label="Personnel" icon="lock" selected={scope === 'personal'} onPress={() => setScope('personal')} />
        <Chip label="Foyer" icon="group" selected={scope === 'household'} onPress={() => setScope('household')} />
        <Text style={styles.scopeHint} numberOfLines={2}>
          {scope === 'personal' ? 'Kora ne voit que vos éléments' : 'Kora voit aussi ce qui est partagé'}
        </Text>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={[kitStyles.content, styles.content]}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {messages.map((message) =>
            message.from === 'me' ? (
              <View key={message.id} style={styles.meWrap}>
                <Text style={styles.time}>{formatTime(message.at)}</Text>
                <View style={styles.meBubble}>
                  <Text style={styles.meText}>{message.text}</Text>
                </View>
              </View>
            ) : (
              <View key={message.id} style={styles.koraWrap}>
                <View style={styles.koraMeta}>
                  <View style={styles.koraDot}>
                    <Icon name="auto_awesome" size={14} color={Tint.glow} />
                  </View>
                  <Text style={styles.koraName}>Kora</Text>
                  <Text style={styles.time}>{formatTime(message.at)}</Text>
                </View>
                <Text style={styles.koraText}>{message.text}</Text>
                {message.cards?.map((card) => (
                  <Card key={card.id} card={card} />
                ))}
              </View>
            ),
          )}
          {typing ? (
            <View style={styles.typing}>
              <View style={styles.koraDot}>
                <Icon name="auto_awesome" size={14} color={Tint.glow} />
              </View>
              <Text style={styles.typingText}>Kora prépare sa réponse…</Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.composer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quick} keyboardShouldPersistTaps="handled">
            {QUICK_QUESTIONS.map((question) => (
              <Chip key={question.topic} label={question.label} icon={question.icon} onPress={() => ask(question.label, question.topic)} />
            ))}
          </ScrollView>
          <View style={styles.inputRow}>
            <Pressable
              style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Joindre un document"
              onPress={() => setToast('Démo : choisir un document à montrer à Kora')}>
              <Icon name="attach_file" size={22} color={Tint.navy} />
            </Pressable>
            <View style={[styles.input, focused && kitStyles.inputFocused]}>
              <TextInput
                style={styles.inputText}
                value={draft}
                onChangeText={setDraft}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onSubmitEditing={() => ask(draft)}
                returnKeyType="send"
                placeholder="Écrire à Kora…"
                placeholderTextColor={Serene.onSurfaceVariant}
                selectionColor={Tint.primary}
                accessibilityLabel="Message pour Kora"
              />
            </View>
            <Pressable
              style={({ pressed }) => [styles.sendButton, !draft.trim() && styles.sendDisabled, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={draft.trim() ? 'Envoyer' : 'Parler à Kora'}
              onPress={() => (draft.trim() ? ask(draft) : router.push('/voice'))}>
              <Icon name={draft.trim() ? 'arrow_upward' : 'mic'} size={22} color={Serene.onPrimary} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      {toast ? <UndoToast key={toast} text={toast} onHide={() => setToast(null)} bottom={150} /> : null}
    </SafeAreaView>
  );
}

/** Carte d'action : ce que Kora propose, et le bouton qui ouvre le vrai écran. */
function Card({ card }: { card: ActionCard }) {
  const tone = TONES[card.tone];
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.cardIcon, { backgroundColor: tone.bg }]}>
          <Icon name={card.icon} size={20} color={tone.fg} />
        </View>
        <View style={styles.flex}>
          <Text style={[styles.cardLabel, { color: tone.fg }]}>{card.label}</Text>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <Text style={styles.cardDetail}>{card.detail}</Text>
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [styles.cardAction, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${card.action} : ${card.title}`}
        onPress={() => router.push(card.href)}>
        <Text style={styles.cardActionText}>{card.action}</Text>
        <Icon name="arrow_forward" size={18} color={Serene.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  koraAvatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Tint.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 22,
    lineHeight: 28,
    color: Tint.navy,
  },
  headerSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scopeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Tint.border,
  },
  scopeHint: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
  content: {
    paddingTop: 14,
    paddingBottom: 16,
    gap: 16,
  },
  time: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 17,
    color: Serene.onSurfaceVariant,
  },
  meWrap: {
    alignItems: 'flex-end',
    gap: 4,
  },
  meBubble: {
    maxWidth: '86%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    backgroundColor: Tint.black,
  },
  meText: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 22,
    color: Serene.onPrimary,
  },
  koraWrap: {
    gap: 8,
  },
  koraMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  koraDot: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Tint.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  koraName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.navy,
  },
  koraText: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 22,
    color: Tint.navy,
  },
  typing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 19,
    fontStyle: 'italic',
    color: Serene.onSurfaceVariant,
  },
  card: {
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 17,
  },
  cardTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  cardDetail: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  cardAction: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    backgroundColor: Tint.black,
  },
  cardActionText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
  composer: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    gap: 8,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Tint.border,
    backgroundColor: Tint.softer,
  },
  quick: {
    gap: 8,
    paddingHorizontal: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 46,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  inputText: {
    fontFamily: FontFamily.body,
    fontSize: 16,
    color: Tint.navy,
    outlineWidth: 0,
    outlineStyle: 'solid',
    paddingVertical: 0,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    backgroundColor: Tint.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    backgroundColor: Tint.primary,
  },
});
