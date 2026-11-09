// S-27 - Assistant conversationnel | Module M12 Assistant IA | Phase S11
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

import { AppHeader } from '@/components/app-header';
import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Shadow, Space, Typography } from '@/constants/design';

type ChatMessage = {
  id: number;
  role: 'user' | 'kora';
  text: string;
};

export default function AssistantScreen() {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const idRef = useRef(0);
  const scrollRef = useRef<ScrollViewInstance>(null);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    const userId = idRef.current++;
    const koraId = idRef.current++;

    setMessages((prev) => [
      ...prev,
      { id: userId, role: 'user', text },
      {
        id: koraId,
        role: 'kora',
        text: "J'analyse votre demande administrative et prépare la confirmation...",
      },
    ]);
    setDraft('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <AppHeader />
        <SecurityBanner />

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          <KoraBriefing />
          <UserBubble
            text="Peux-tu programmer un rendez-vous chez le dentiste pour Léo mercredi prochain à 15h, et créer un rappel pour Thomas pour qu'il l'accompagne ?"
            time="09:42"
          />
          <KoraStructuredResponse />

          {messages.map((message) =>
            message.role === 'user' ? (
              <UserBubble key={message.id} text={message.text} time="À l'instant" />
            ) : (
              <KoraSimpleBubble key={message.id} text={message.text} />
            ),
          )}

          <QuickPrompts onSelect={setDraft} />
        </ScrollView>

        <InputDock draft={draft} onChange={setDraft} onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SecurityBanner() {
  return (
    <View style={styles.security}>
      <View style={styles.securityRow}>
        <View style={styles.securityLeft}>
          <View style={styles.securityDot} />
          <Text style={styles.securityTitle}>Kora AI • Secrétaire de foyer</Text>
        </View>
        <View style={styles.encryptedPill}>
          <Icon name="lock" size={13} color={Serene.secondary} />
          <Text style={styles.encryptedText}>Chiffré de bout en bout</Text>
        </View>
      </View>

      <View style={styles.securityRow}>
        <View style={styles.contextPill}>
          <Icon name="roofing" size={14} color={Serene.secondary} />
          <Text style={styles.contextPillText}>Contexte : Foyer Martin</Text>
          <Icon name="expand_more" size={14} color={Serene.onSurfaceVariant} />
        </View>
        <Text style={styles.syncText}>Synchro cloud actif</Text>
      </View>
    </View>
  );
}

function KoraAvatar() {
  return (
    <View style={styles.koraAvatar}>
      <Icon name="arrow_back_ios_new" size={16} filled color={Serene.secondaryFixed} />
    </View>
  );
}

function KoraBriefing() {
  return (
    <View style={styles.koraRow}>
      <KoraAvatar />
      <View style={styles.koraColumn}>
        <View style={styles.metaRow}>
          <Text style={styles.author}>Kora</Text>
          <Text style={styles.time}>09:41</Text>
        </View>
        <View style={[styles.koraBubble, styles.koraBubbleTop]}>
          <Text style={styles.koraText}>
            Bonjour Claire, <Text style={styles.bold}>1 facture en attente</Text> (eau Veolia) et{' '}
            <Text style={styles.bold}>2 rendez-vous</Text> prévus cette semaine. Comment puis-je
            vous aider ?
          </Text>
        </View>
      </View>
    </View>
  );
}

function KoraSimpleBubble({ text }: { text: string }) {
  return (
    <View style={styles.koraRow}>
      <KoraAvatar />
      <View style={styles.koraColumn}>
        <View style={styles.metaRow}>
          <Text style={styles.author}>Kora</Text>
          <Text style={styles.time}>À l&apos;instant</Text>
        </View>
        <View style={[styles.koraBubble, styles.koraBubbleTop]}>
          <Text style={styles.koraText}>{text}</Text>
        </View>
      </View>
    </View>
  );
}

function UserBubble({ text, time }: { text: string; time: string }) {
  return (
    <View style={styles.userRow}>
      <View style={styles.userColumn}>
        <View style={styles.metaRowEnd}>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.author}>Claire</Text>
        </View>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{text}</Text>
        </View>
      </View>
    </View>
  );
}

function KoraStructuredResponse() {
  return (
    <View style={styles.koraRowWide}>
      <KoraAvatar />
      <View style={styles.structuredColumn}>
        <View style={styles.structuredHeader}>
          <View style={styles.metaRow}>
            <Text style={styles.author}>Kora</Text>
            <Text style={styles.time}>09:42</Text>
          </View>
          <View style={styles.actionsPill}>
            <Text style={styles.actionsPillText}>2 actions générées</Text>
          </View>
        </View>

        <Text style={styles.koraText}>
          Certainement. Voici les deux actions prêtes à être exécutées après votre validation :
        </Text>

        <CalendarActionCard />
        <TaskActionCard />
      </View>
    </View>
  );
}

function CalendarActionCard() {
  return (
    <View style={styles.actionCard}>
      <View style={styles.actionHeader}>
        <View style={styles.typePill}>
          <Icon name="calendar_today" size={14} color={Serene.secondary} />
          <Text style={styles.typePillText}>Événement Agenda</Text>
        </View>
        <View style={styles.confirmPill}>
          <View style={styles.confirmDot} />
          <Text style={styles.confirmPillText}>À confirmer</Text>
        </View>
      </View>

      <View>
        <Text style={styles.actionTitle}>Dentiste - Consultation annuelle (Léo)</Text>
        <View style={styles.actionTimeRow}>
          <Icon name="schedule" size={16} color={Serene.secondary} />
          <Text style={styles.actionTime}>Mercredi 22 mai 2024 • 15:00</Text>
        </View>
      </View>

      <View style={styles.metaGrid}>
        <View style={styles.metaGridRow}>
          <Text style={styles.metaLabel}>Praticien</Text>
          <Text style={styles.metaValue} numberOfLines={2}>
            Dr. Roche (Cabinet Saint-Michel)
          </Text>
        </View>
        <View style={styles.metaGridRow}>
          <Text style={styles.metaLabel}>Partagé avec</Text>
          <View style={styles.chipRow}>
            <View style={styles.tagChip}>
              <Text style={styles.tagChipText}>Claire</Text>
            </View>
            <View style={styles.tagChip}>
              <Text style={styles.tagChipText}>Thomas</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Pressable style={styles.secondaryButton} onPress={() => router.push('/calendar/edit')}>
          <Icon name="edit" size={16} color={Serene.onSurface} />
          <Text style={styles.secondaryButtonText}>Modifier</Text>
        </Pressable>
        <Pressable style={styles.tealButton} onPress={() => router.push('/calendar/detail')}>
          <Icon name="check_circle" size={16} color={Serene.onSecondary} />
          <Text style={styles.tealButtonText}>Confirmer le RDV</Text>
        </Pressable>
      </View>
    </View>
  );
}

function TaskActionCard() {
  return (
    <View style={styles.actionCard}>
      <View style={styles.actionHeader}>
        <View style={styles.typePill}>
          <Icon name="task_alt" size={14} color={Serene.secondary} />
          <Text style={styles.typePillText}>Tâche partagée</Text>
        </View>
        <View style={styles.readyPill}>
          <Text style={styles.readyPillText}>Prête à l&apos;envoi</Text>
        </View>
      </View>

      <View>
        <Text style={styles.actionTitle}>Accompagner Léo au dentiste</Text>
        <Text style={styles.actionSubtitle}>Aller-retour et carnet de santé à fournir</Text>
      </View>

      <View style={styles.metaGrid}>
        <View style={styles.metaGridRow}>
          <Text style={styles.metaLabel}>Assigné à</Text>
          <View style={styles.assigneeRow}>
            <View style={styles.assigneeAvatar}>
              <Text style={styles.assigneeInitial}>T</Text>
            </View>
            <Text style={styles.metaValue}>Thomas Martin</Text>
          </View>
        </View>
        <View style={styles.metaGridRow}>
          <Text style={styles.metaLabel}>Rappel programmé</Text>
          <Text style={styles.metaAccent}>Push 2h avant (13:00)</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Pressable style={styles.secondaryButton} onPress={() => router.push('/tasks/edit')}>
          <Icon name="edit" size={16} color={Serene.onSurface} />
          <Text style={styles.secondaryButtonText}>Modifier</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={() => router.push('/tasks/add')}>
          <Icon name="assignment_turned_in" size={16} color={Serene.secondaryFixed} />
          <Text style={styles.primaryButtonText}>Créer la tâche</Text>
        </Pressable>
      </View>
    </View>
  );
}

function QuickPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <View style={styles.promptsWrap}>
      <View style={styles.promptsLabelRow}>
        <Icon name="lightbulb" size={14} color={Serene.secondary} />
        <Text style={styles.promptsLabel}>Suggestions administratives</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.promptsRow}
        style={styles.promptsScroll}>
        <PromptChip
          icon="receipt_long"
          label="Que dois-je payer cette semaine ?"
          onPress={() => onSelect('Que dois-je payer cette semaine ?')}
        />
        <PromptChip
          icon="badge"
          label="Quand expire mon passeport ?"
          onPress={() => onSelect('Quand expire mon passeport ?')}
        />
        <PromptChip
          icon="shopping_basket"
          label="Créer un rappel courses"
          onPress={() => onSelect('Créer un rappel courses')}
        />
      </ScrollView>
    </View>
  );
}

function PromptChip({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.promptChip} onPress={onPress} accessibilityRole="button">
      <Icon name={icon} size={14} color={Serene.secondary} />
      <Text style={styles.promptChipText}>{label}</Text>
    </Pressable>
  );
}

function InputDock({
  draft,
  onChange,
  onSend,
}: {
  draft: string;
  onChange: (text: string) => void;
  onSend: () => void;
}) {
  return (
    <View style={styles.dock}>
      <View style={styles.dockRow}>
        <Pressable
          style={styles.attachButton}
          accessibilityRole="button"
          accessibilityLabel="Joindre un document ou une facture"
          onPress={() => router.push('/documents')}>
          <Icon name="attach_file" size={20} color={Serene.onSurfaceVariant} />
        </Pressable>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Demander ou dicter une action..."
            placeholderTextColor={Serene.onSurfaceVariant}
            value={draft}
            onChangeText={onChange}
            onSubmitEditing={onSend}
            returnKeyType="send"
            selectionColor={Serene.secondary}
          />
          <Pressable
            style={styles.sendButton}
            accessibilityRole="button"
            accessibilityLabel="Envoyer"
            onPress={onSend}>
            <Icon name="arrow_upward" size={18} color={Serene.onSurfaceVariant} />
          </Pressable>
        </View>

        <Pressable
          style={styles.voiceButton}
          accessibilityRole="button"
          accessibilityLabel="Maintenir pour parler"
          onPress={() => router.push('/voice')}>
          <Icon name="mic" size={22} color={Serene.secondaryFixed} />
          <Text style={styles.voiceLabel}>Vocal</Text>
        </Pressable>
      </View>

      <Text style={styles.hint}>
        Maintenez le bouton vocal ou saisissez pour déléguer à Kora
      </Text>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.gutter,
    paddingTop: Space.md,
    paddingBottom: Space.sm,
    gap: Space.md,
  },
  security: {
    paddingHorizontal: Space.gutter,
    paddingVertical: 10,
    backgroundColor: Serene.surfaceContainerLow,
    gap: Space.sm,
    ...Shadow.card,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.sm,
  },
  securityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securityDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
  },
  securityTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  encryptedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainer,
  },
  encryptedText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  contextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  contextPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurface,
  },
  syncText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  koraRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    maxWidth: '92%',
  },
  koraRowWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  koraAvatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    ...Shadow.card,
  },
  koraColumn: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  structuredColumn: {
    flex: 1,
    minWidth: 0,
    gap: 12,
  },
  structuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaRowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  author: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  time: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurfaceVariant,
  },
  koraBubble: {
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  koraBubbleTop: {
    borderTopLeftRadius: Radius.sm,
  },
  koraText: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onSurface,
  },
  bold: {
    fontFamily: FontFamily.bodySemiBold,
    color: Serene.onSurface,
  },
  userRow: {
    alignSelf: 'flex-end',
    maxWidth: '92%',
  },
  userColumn: {
    alignItems: 'flex-end',
    gap: 4,
  },
  userBubble: {
    padding: 14,
    borderRadius: Radius.xl,
    borderTopRightRadius: Radius.sm,
    backgroundColor: Serene.primary,
    ...Shadow.card,
  },
  userText: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
  actionsPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
  },
  actionsPillText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    lineHeight: 14,
    color: Serene.secondary,
  },
  actionCard: {
    padding: 16,
    borderRadius: Radius.xl,
    backgroundColor: Serene.surfaceContainerLowest,
    gap: 14,
    ...Shadow.card,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainer,
  },
  typePillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurface,
  },
  confirmPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
  },
  confirmDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondary,
  },
  confirmPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurface,
  },
  actionTitle: {
    ...Typography.titleMd,
    color: Serene.onSurface,
  },
  actionSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
    marginTop: 2,
  },
  actionTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  actionTime: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    fontVariant: ['tabular-nums'],
    color: Serene.onSurface,
  },
  metaGrid: {
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
    gap: 8,
  },
  metaGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  metaLabel: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
    color: Serene.onSurfaceVariant,
  },
  metaValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
    flexShrink: 1,
    textAlign: 'right',
  },
  metaAccent: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.secondary,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 4,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    backgroundColor: Serene.surfaceContainer,
  },
  tagChipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurface,
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assigneeAvatar: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assigneeInitial: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    lineHeight: 12,
    color: Serene.onSurface,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  secondaryButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurface,
  },
  tealButton: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: Serene.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    ...Shadow.card,
  },
  tealButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSecondary,
  },
  primaryButton: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: Serene.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    ...Shadow.card,
  },
  primaryButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onPrimary,
  },
  readyPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Serene.secondaryContainer,
  },
  readyPillText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSecondaryContainer,
  },
  promptsWrap: {
    paddingTop: Space.sm,
    gap: Space.sm,
  },
  promptsLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promptsLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Serene.onSurfaceVariant,
  },
  promptsScroll: {
    marginHorizontal: -Space.gutter,
  },
  promptsRow: {
    paddingHorizontal: Space.gutter,
    gap: 8,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    backgroundColor: Serene.surfaceContainerLowest,
    ...Shadow.card,
  },
  promptChipText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Serene.onSurface,
  },
  dock: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: Serene.surfaceContainerLowest,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Serene.outlineVariant,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
  },
  dockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Serene.surfaceContainerLow,
    justifyContent: 'center',
  },
  input: {
    height: 44,
    paddingLeft: 14,
    paddingRight: 40,
    fontFamily: FontFamily.body,
    fontSize: 14,
    color: Serene.onSurface,
  },
  sendButton: {
    position: 'absolute',
    right: 6,
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Serene.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: Serene.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.floating,
  },
  voiceLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 8,
    lineHeight: 10,
    color: Serene.secondaryFixed,
  },
  hint: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    color: Serene.onSurfaceVariant,
  },
});
